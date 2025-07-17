import requests
from bs4 import BeautifulSoup
import re
from typing import Optional, List
from urllib.parse import urlparse, parse_qs
from config import Config
from models.data_models import ScrapedData, SwimmerInfo, MeetInfo, SwimResult
from utils.time_utils import is_valid_swim_time
from utils.age_utils import extract_age_group_from_age

class USMSScraper:
    """Service for scraping USMS meet results"""
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': Config.USER_AGENT
        })

    def scrape_usms_results(self, url_or_swimmer_id: str) -> Optional[ScrapedData]:
        """
        Scrape USMS meet results from the provided URL or SwimmerID
        
        Args:
            url_or_swimmer_id: Either a full USMS URL or just a SwimmerID (e.g., 'MZ99C')
            
        Returns:
            ScrapedData object with swimmer info, meet info, and results
        """
        try:
            # Determine if input is a URL or SwimmerID
            url = self._build_url_from_input(url_or_swimmer_id)
            
            print(f"Scraping URL: {url}")
            response = self.session.get(url)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Debug: Print page title and some basic info
            title = soup.find('title')
            if title:
                print(f"Page title: {title.get_text()}")
            
            # Debug page structure
            self.debug_page_structure(soup)
            
            # Debug: Print all table structures
            tables = soup.find_all('table')
            print(f"Found {len(tables)} tables on the page")
            
            for i, table in enumerate(tables):
                rows = table.find_all('tr')
                print(f"Table {i+1}: {len(rows)} rows")
                if rows:
                    # Print first few rows for debugging
                    for j, row in enumerate(rows[:3]):
                        cells = row.find_all(['td', 'th'])
                        cell_texts = [cell.get_text().strip() for cell in cells]
                        print(f"  Row {j+1}: {cell_texts}")
            
            # Parse the actual USMS results page
            results = self._parse_results_page(soup, url)
            
            return results
            
        except Exception as e:
            print(f"Error scraping USMS results: {e}")
            return None

    def _build_url_from_input(self, input_str: str) -> str:
        """
        Build a complete USMS URL from either a full URL or SwimmerID
        
        Args:
            input_str: Either a full URL or SwimmerID
            
        Returns:
            Complete USMS URL
        """
        input_str = input_str.strip()
        
        # Check if it's already a complete URL
        if input_str.startswith('http'):
            return input_str
        
        # Check if it's a USMS URL without protocol
        if 'usms.org' in input_str:
            if not input_str.startswith('http'):
                return 'https://' + input_str
            return input_str
        
        # Otherwise, treat it as a SwimmerID and build the URL
        base_url = "https://www.usms.org/comp/meets/indresults.php"
        params = {
            'SwimmerID': input_str,
            'Sex': '',
            'StrokeID': '0',
            'Distance': '',
            'CourseID': '0',
            'lowage': '',
            'highage': ''
        }
        
        # Build URL with parameters
        param_string = '&'.join([f"{key}={value}" for key, value in params.items()])
        complete_url = f"{base_url}?{param_string}"
        
        return complete_url

    def _extract_swimmer_id_from_url(self, url: str) -> Optional[str]:
        """
        Extract SwimmerID from a USMS URL
        
        Args:
            url: USMS URL
            
        Returns:
            SwimmerID if found, None otherwise
        """
        try:
            parsed_url = urlparse(url)
            query_params = parse_qs(parsed_url.query)
            
            if 'SwimmerID' in query_params:
                return query_params['SwimmerID'][0]
            
            return None
            
        except Exception as e:
            print(f"Error extracting SwimmerID from URL: {e}")
            return None

    def _parse_results_page(self, soup: BeautifulSoup, url: str) -> Optional[ScrapedData]:
        """Parse the actual USMS results page HTML"""
        try:
            # Extract swimmer information
            swimmer_info = self._extract_swimmer_info(soup)
            
            # Extract meet information (basic info without course type)
            meet_info = self._extract_meet_info(soup)
            
            # Extract results with course type detection
            results = self._extract_results_with_course_types(soup)
            
            if not results:
                print("No results found on the page")
                return None
            
            return ScrapedData(
                swimmer=swimmer_info,
                meet=meet_info,
                results=results
            )
            
        except Exception as e:
            print(f"Error parsing results page: {e}")
            return None

    def _extract_swimmer_info(self, soup: BeautifulSoup) -> SwimmerInfo:
        """Extract swimmer information from the page"""
        try:
            swimmer_name = "Unknown Swimmer"
            age = 0
            team = "Unknown Team"
            
            # Look for the main heading that contains swimmer name and swim count
            main_heading = soup.find('h3')
            if main_heading:
                heading_text = main_heading.get_text().strip()
                print(f"Main heading: {heading_text}")
                
                # Extract name from heading like "USMS Individual Meet Results for Jennifer Tran (45 swims)"
                name_match = re.search(r'for (.+?) \((\d+) swims?\)', heading_text)
                if name_match:
                    swimmer_name = name_match.group(1).strip()
                    total_swims = int(name_match.group(2))
                    print(f"Found swimmer: {swimmer_name} with {total_swims} swims")
            
            # Extract age group from table headers
            age_group_headers = soup.find_all('h4')
            for header in age_group_headers:
                header_text = header.get_text().strip()
                age_match = re.search(r'(\d+)-(\d+)\s*Age Group', header_text)
                if age_match:
                    age = int(age_match.group(1))
                    break
            
            # Extract team from the first result row
            first_row = soup.find('tr')
            if first_row:
                cells = first_row.find_all('td')
                if len(cells) >= 4:  # Name, Date, Age, Club columns
                    team_cell = cells[3]  # Club column
                    if team_cell:
                        team = team_cell.get_text().strip()
            
            return SwimmerInfo(
                name=swimmer_name,
                age=age,
                team=team
            )
            
        except Exception as e:
            print(f"Error extracting swimmer info: {e}")
            return SwimmerInfo(
                name="Unknown Swimmer",
                age=0,
                team="Unknown Team"
            )

    def _extract_meet_info(self, soup: BeautifulSoup) -> MeetInfo:
        """Extract meet information from the page"""
        try:
            meet_name = ""
            meet_date = ""
            location = ""
            course_type = "Mixed"  # Changed to Mixed since we'll handle multiple course types
            
            # Look for meet information in page content
            # This will need to be adapted based on the actual USMS page structure
            
            return MeetInfo(
                name=meet_name,
                date=meet_date,
                location=location,
                course_type=course_type
            )
            
        except Exception as e:
            print(f"Error extracting meet info: {e}")
            return MeetInfo(
                name="",
                date="",
                location="",
                course_type="Mixed"
            )

    def _extract_results_with_course_types(self, soup: BeautifulSoup) -> List[SwimResult]:
        """Extract swimming results from the page, detecting course types from headers"""
        try:
            results = []
            current_course_type = "SCY"  # Default fallback
            
            # Find all elements in the page to process in order
            page_elements = soup.find_all(['h4', 'table', 'h3', 'h2', 'h1'])
            
            for element in page_elements:
                if element.name in ['h1', 'h2', 'h3', 'h4']:
                    # Check if this header indicates a course type
                    header_text = element.get_text().strip()
                    print(f"Processing header: {header_text}")  # Debug output
                    
                    detected_course = self._detect_course_type_from_header(header_text)
                    if detected_course:
                        current_course_type = detected_course
                        print(f"Found course type header: {header_text} -> {current_course_type}")
                    else:
                        print(f"No course type detected in header: {header_text}")
                
                elif element.name == 'table':
                    # Process table with current course type
                    print(f"Processing table with course type: {current_course_type}")
                    table_results = self._extract_results_from_table(element, current_course_type)
                    results.extend(table_results)
            
            print(f"Total results found: {len(results)}")
            return results
            
        except Exception as e:
            print(f"Error extracting results with course types: {e}")
            return []

    def _detect_course_type_from_header(self, header_text: str) -> Optional[str]:
        """Detect course type from header text - Enhanced version"""
        header_text = header_text.upper()
        
        # Handle USMS format: "Short Course Yards Results [ SCM | LCM ]"
        if 'SHORT COURSE YARDS' in header_text or 'SCY RESULTS' in header_text:
            return "SCY"
        elif 'SHORT COURSE METERS' in header_text or 'SCM RESULTS' in header_text:
            return "SCM"
        elif 'LONG COURSE METERS' in header_text or 'LCM RESULTS' in header_text:
            return "LCM"
        
        # Handle abbreviated forms
        if 'SCY' in header_text and 'RESULTS' in header_text:
            return "SCY"
        elif 'SCM' in header_text and 'RESULTS' in header_text:
            return "SCM"
        elif 'LCM' in header_text and 'RESULTS' in header_text:
            return "LCM"
        
        # Look for patterns like "SCY Results for 25-29 Age Group"
        course_match = re.search(r'(SCY|SCM|LCM)\s+RESULTS', header_text)
        if course_match:
            return course_match.group(1)
        
        # Handle age group headers that come after main course type header
        # These should NOT change the course type, just indicate age groups
        if re.search(r'\d+-\d+\s*AGE GROUP', header_text):
            return None  # Don't change course type for age group headers
        
        return None

    def _extract_results_from_table(self, table, course_type: str) -> List[SwimResult]:
        """Extract swimming results from a specific table"""
        try:
            results = []
            rows = table.find_all('tr')
            
            for row in rows:
                cells = row.find_all(['td', 'th'])
                
                # Skip header rows and rows with too few cells
                if len(cells) < 6:  # USMS results have: Name, Date, Age, Club, Event, Time, Place
                    continue
                
                # Try to identify if this row contains a swimming result
                result = self._parse_result_row(cells, course_type)
                if result:
                    results.append(result)
                    print(f"Found result: {result}")
            
            return results
            
        except Exception as e:
            print(f"Error extracting results from table: {e}")
            return []

    def _extract_results(self, soup: BeautifulSoup, course_type: str) -> List[SwimResult]:
        """Extract swimming results from the page (legacy method - kept for compatibility)"""
        return self._extract_results_with_course_types(soup)

    def _parse_result_row(self, cells, course_type: str) -> Optional[SwimResult]:
        """Parse a single row of results"""
        try:
            cell_texts = [cell.get_text().strip() for cell in cells]
            
            # Skip header rows and empty rows
            if not any(cell_texts) or all(len(text) < 2 for text in cell_texts):
                return None
            
            # USMS table: Name, Date (MeetID), Age, Club, Event, Heat/Lane, Time, Place
            if len(cell_texts) >= 8:
                name = cell_texts[0]
                date = cell_texts[1]
                age = cell_texts[2]
                club = cell_texts[3]
                event = cell_texts[4]
                # cell_texts[5] is Heat/Lane, skip it
                time = cell_texts[6]
                place = cell_texts[7]
                
                # Validate time
                if not is_valid_swim_time(time):
                    return None
                
                # Place as int
                place_num = int(place) if place.isdigit() else 0
                age_group = extract_age_group_from_age(age)
                
                return SwimResult(
                    event=event,
                    time=time,
                    place=place_num,
                    date=date,
                    club=club,
                    age_group=age_group,
                    course_type=course_type  # Now properly set based on detected course type
                )
            return None
        except Exception as e:
            print(f"Error parsing result row: {e}")
            return None

    def debug_page_structure(self, soup: BeautifulSoup):
        """Debug method to understand the page structure"""
        print("\n=== PAGE STRUCTURE DEBUG ===")
        
        # Find all headers and their text
        headers = soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
        print(f"Found {len(headers)} headers:")
        for i, header in enumerate(headers):
            print(f"  {header.name}: {header.get_text().strip()}")
        
        # Find all tables and their position relative to headers
        all_elements = soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'table'])
        print(f"\nPage structure (headers and tables):")
        for i, element in enumerate(all_elements):
            if element.name == 'table':
                rows = element.find_all('tr')
                print(f"  {i}: TABLE ({len(rows)} rows)")
            else:
                print(f"  {i}: {element.name.upper()}: {element.get_text().strip()}")
        
        print("=== END DEBUG ===\n")

    def validate_swimmer_id(self, swimmer_id: str) -> bool:
        """
        Validate a USMS SwimmerID format
        
        Args:
            swimmer_id: SwimmerID to validate
            
        Returns:
            True if valid format, False otherwise
        """
        # USMS SwimmerIDs typically follow pattern: 2 letters + 2-3 digits + 1 letter
        # Example: MZ99C
        pattern = r'^[A-Z]{2}\d{2,3}[A-Z]$'
        return bool(re.match(pattern, swimmer_id.upper()))

    def get_swimmer_profile_url(self, swimmer_id: str) -> str:
        """
        Get the profile URL for a swimmer
        
        Args:
            swimmer_id: USMS SwimmerID
            
        Returns:
            Complete profile URL
        """
        return f"https://www.usms.org/comp/meets/indresults.php?SwimmerID={swimmer_id}&Sex=&StrokeID=0&Distance=&CourseID=0&lowage=&highage="

# Usage examples:
def example_usage():
    """Example usage of the enhanced USMSScraper"""
    scraper = USMSScraper()
    
    # Example 1: Using a full URL
    url = "https://www.usms.org/comp/meets/indresults.php?SwimmerID=MZ99C&Sex=&StrokeID=0&Distance=&CourseID=0&lowage=&highage="
    results = scraper.scrape_usms_results(url)
    
    # Example 2: Using just a SwimmerID
    swimmer_id = "MZ99C"
    results = scraper.scrape_usms_results(swimmer_id)
    
    # Example 3: Validate SwimmerID
    is_valid = scraper.validate_swimmer_id("MZ99C")
    print(f"SwimmerID MZ99C is valid: {is_valid}")
    
    # Example 4: Get profile URL
    profile_url = scraper.get_swimmer_profile_url("MZ99C")
    print(f"Profile URL: {profile_url}")
    
    if results:
        print(f"Found {len(results.results)} swim results for {results.swimmer.name}")
        for result in results.results:
            print(f"  {result.event}: {result.time} ({result.course_type})")
    else:
        print("No results found")

if __name__ == "__main__":
    example_usage()