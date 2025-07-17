import unittest
from unittest.mock import Mock, patch
from services.performance_analyzer import PerformanceAnalyzer
from models.data_models import ScrapedData, SwimmerInfo, MeetInfo, SwimResult

class TestPerformanceAnalyzer(unittest.TestCase):
    """Test cases for PerformanceAnalyzer service"""
    
    def setUp(self):
        """Set up test fixtures"""
        self.analyzer = PerformanceAnalyzer()
        
        # Create sample test data
        self.sample_results = [
            SwimResult(
                event="50 Free",
                time="23.45",
                place=3,
                date="2024-01-15",
                club="Test Club",
                age_group="35-39",
                course_type="SCY"
            ),
            SwimResult(
                event="100 Free",
                time="52.12",
                place=2,
                date="2024-01-15",
                club="Test Club",
                age_group="35-39",
                course_type="SCY"
            ),
            SwimResult(
                event="50 Free",
                time="23.67",
                place=4,
                date="2024-01-15",
                club="Test Club",
                age_group="35-39",
                course_type="SCY"
            )
        ]
        
        self.sample_scraped_data = ScrapedData(
            swimmer=SwimmerInfo(
                name="Test Swimmer",
                age=35,
                team="Test Club"
            ),
            meet=MeetInfo(
                name="Test Meet",
                date="2024-01-15",
                location="Test Location",
                course_type="SCY"
            ),
            results=self.sample_results
        )

    def test_analyze_performance_with_valid_data(self):
        """Test performance analysis with valid data"""
        result = self.analyzer.analyze_performance(self.sample_scraped_data)
        
        self.assertIsNotNone(result)
        self.assertEqual(result.swimmer.name, "Test Swimmer")
        self.assertEqual(result.swimmer.age, 35)
        self.assertEqual(result.swimmer.total_events, 3)
        self.assertEqual(result.summary.total_events, 3)

    def test_analyze_performance_with_empty_results(self):
        """Test performance analysis with empty results"""
        empty_data = ScrapedData(
            swimmer=SwimmerInfo(name="Test", age=35, team="Test"),
            meet=MeetInfo(name="Test", date="2024-01-15", location="Test", course_type="SCY"),
            results=[]
        )
        
        result = self.analyzer.analyze_performance(empty_data)
        self.assertIsNone(result)

    def test_analyze_performance_with_none_data(self):
        """Test performance analysis with None data"""
        result = self.analyzer.analyze_performance(None)
        self.assertIsNone(result)

    def test_find_best_times(self):
        """Test finding best times for events"""
        best_times = self.analyzer._find_best_times(self.sample_results)
        
        self.assertEqual(len(best_times), 2)  # 2 unique events
        
        # Check that best times are correctly identified
        fifty_free_times = [bt for bt in best_times if bt.event == "50 Free"]
        hundred_free_times = [bt for bt in best_times if bt.event == "100 Free"]
        
        self.assertEqual(len(fifty_free_times), 1)
        self.assertEqual(fifty_free_times[0].time, "23.45")  # Better time
        
        self.assertEqual(len(hundred_free_times), 1)
        self.assertEqual(hundred_free_times[0].time, "52.12")

    def test_group_results_by_event(self):
        """Test grouping results by event"""
        grouped = self.analyzer._group_results_by_event(self.sample_results)
        
        self.assertIn("50 Free", grouped)
        self.assertIn("100 Free", grouped)
        self.assertEqual(len(grouped["50 Free"]), 2)
        self.assertEqual(len(grouped["100 Free"]), 1)

    def test_create_performance_trends(self):
        """Test creating performance trends"""
        event_results = {
            "50 Free": self.sample_results[:2],  # Two 50 Free results
            "100 Free": self.sample_results[1:2]  # One 100 Free result
        }
        
        trends = self.analyzer._create_performance_trends(event_results)
        
        # Should only create trends for events with multiple results
        self.assertEqual(len(trends), 1)
        self.assertEqual(trends[0].event, "50 Free")
        self.assertEqual(len(trends[0].times), 2)

    def test_generate_meet_breakdown(self):
        """Test generating meet breakdown"""
        breakdown = self.analyzer._generate_meet_breakdown(self.sample_results)
        
        self.assertIsNotNone(breakdown)
        self.assertIsInstance(breakdown.current_meet, dict)
        self.assertIn("name", breakdown.current_meet)
        self.assertEqual(len(breakdown.all_time_improvements), 3)
        self.assertIn("35-39", breakdown.age_group_improvements)

    def test_generate_personal_bests(self):
        """Test generating personal bests"""
        personal_bests = self.analyzer._generate_personal_bests(self.sample_results)
        
        self.assertIsNotNone(personal_bests)
        self.assertEqual(len(personal_bests.all_time), 2)  # 2 unique events
        self.assertIn("35-39", personal_bests.by_age_group)

    def test_generate_clubs_data(self):
        """Test generating clubs data"""
        clubs_data = self.analyzer._generate_clubs_data(self.sample_results)
        
        self.assertEqual(len(clubs_data), 1)
        self.assertEqual(clubs_data[0].name, "Test Club")
        self.assertEqual(clubs_data[0].events, 3)

    def test_calculate_improvement(self):
        """Test calculating improvement"""
        # Test good performance (place <= 3)
        good_result = Mock(place=2)
        improvement = self.analyzer._calculate_improvement(good_result)
        self.assertEqual(improvement, "-1.2s")
        
        # Test average performance (place <= 6)
        avg_result = Mock(place=5)
        improvement = self.analyzer._calculate_improvement(avg_result)
        self.assertEqual(improvement, "-0.5s")
        
        # Test poor performance (place > 6)
        poor_result = Mock(place=8)
        improvement = self.analyzer._calculate_improvement(poor_result)
        self.assertEqual(improvement, "+0.3s")

    def test_generate_insights(self):
        """Test generating insights"""
        best_times = self.analyzer._find_best_times(self.sample_results)
        insights = self.analyzer._generate_insights(self.sample_results, best_times)
        
        self.assertIsNotNone(insights)
        self.assertIsInstance(insights.strengths, list)
        self.assertIsInstance(insights.improvements, list)
        self.assertIsInstance(insights.recommendations, list)

if __name__ == '__main__':
    unittest.main() 