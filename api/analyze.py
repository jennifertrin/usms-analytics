from http.server import BaseHTTPRequestHandler
import json
import sys
import os
from datetime import datetime
from typing import Dict, Any

# Add the current directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.usms_scraper import USMSScraper
from services.performance_analyzer import PerformanceAnalyzer
from services.user_service import UserService
from models.data_models import AnalysisResult
from config import Config

# Initialize services
scraper = USMSScraper()
analyzer = PerformanceAnalyzer()
user_service = UserService()

def _analysis_result_to_dict(analysis: AnalysisResult) -> Dict[str, Any]:
    """Convert AnalysisResult to dictionary for JSON response"""
    return {
        'swimmer': {
            'name': analysis.swimmer.name,
            'age': analysis.swimmer.age,
            'totalMeets': analysis.swimmer.total_meets,
            'totalEvents': analysis.swimmer.total_events
        },
        'performance': {
            'bestTimes': [
                {
                    'event': time.event,
                    'time': time.time,
                    'date': time.date,
                    'meet': time.meet,
                    'courseType': time.course_type
                } for time in analysis.performance.best_times
            ],
            'recentTimes': [
                {
                    'event': recent.event,
                    'times': recent.times
                } for recent in analysis.performance.recent_times
            ]
        },
        'meetBreakdown': {
            'currentMeet': {
                'name': analysis.meet_breakdown.current_meet.name,
                'date': analysis.meet_breakdown.current_meet.date,
                'location': analysis.meet_breakdown.current_meet.location,
                'results': [
                    {
                        'event': result.event,
                        'place': result.place,
                        'time': result.time,
                        'improvement': result.improvement,
                        'ageGroup': result.age_group
                    } for result in analysis.meet_breakdown.current_meet.results
                ]
            },
            'allTimeImprovements': [
                {
                    'event': improvement.event,
                    'improvement': improvement.improvement,
                    'date': improvement.date
                } for improvement in analysis.meet_breakdown.all_time_improvements
            ],
            'ageGroupImprovements': {
                age_group: [
                    {
                        'event': improvement.event,
                        'improvement': improvement.improvement,
                        'rank': improvement.rank
                    } for improvement in improvements
                ] for age_group, improvements in analysis.meet_breakdown.age_group_improvements.items()
            }
        },
        'personalBests': {
            'allTime': [
                {
                    'event': best.event,
                    'time': best.time,
                    'date': best.date,
                    'meet': best.meet,
                    'courseType': best.course_type
                } for best in analysis.personal_bests.all_time
            ],
            'byAgeGroup': {
                age_group: [
                    {
                        'event': best.event,
                        'time': best.time,
                        'date': best.date,
                        'meet': best.meet,
                        'courseType': best.course_type
                    } for best in bests
                ] for age_group, bests in analysis.personal_bests.by_age_group.items()
            }
        },
        'clubs': [
            {
                'name': club.name,
                'location': club.location,
                'years': club.years,
                'meets': club.meets,
                'events': club.events,
                'bestTimes': club.best_times,
                'logo': club.logo
            } for club in analysis.clubs
        ]
    }

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        # Set CORS headers
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, X-User-ID')
        self.end_headers()

        try:
            # Get request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            usms_link = data.get('usmsLink')
            
            if not usms_link:
                response = {'error': 'USMS link is required'}
                self.wfile.write(json.dumps(response).encode())
                return

            # Get or create user session
            user_id = self.headers.get('X-User-ID')
            if not user_id:
                user_id = user_service.create_user_session()

            # Scrape the USMS results
            results_data = scraper.scrape_usms_results(usms_link)
            
            if not results_data:
                response = {'error': 'Failed to scrape USMS results'}
                self.wfile.write(json.dumps(response).encode())
                return

            # Analyze the performance
            analysis = analyzer.analyze_performance(results_data)
            
            if not analysis:
                response = {'error': 'Failed to analyze performance data'}
                self.wfile.write(json.dumps(response).encode())
                return

            # Store analysis data for this user
            user_service.store_user_data(user_id, analysis)
            
            # Convert to dict for JSON response
            analysis_dict = _analysis_result_to_dict(analysis)
            
            # Add user session info to response
            analysis_dict['user_session'] = {
                'user_id': user_id,
                'swimmer_name': analysis.swimmer.name
            }

            self.wfile.write(json.dumps(analysis_dict).encode())

        except Exception as e:
            print(f"Error in analyze endpoint: {e}")
            response = {'error': 'Internal server error'}
            self.wfile.write(json.dumps(response).encode())

    def do_OPTIONS(self):
        # Handle preflight requests
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, X-User-ID')
        self.end_headers() 