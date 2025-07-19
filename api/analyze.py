import json
import sys
import os
from datetime import datetime
from typing import Dict, Any

# Add the parent directories to the path so we can import our modules
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

def handler(request):
    """Main handler function for Vercel serverless function"""
    
    # CORS headers for all responses
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-User-ID',
        'Content-Type': 'application/json'
    }
    
    try:
        # Handle preflight CORS request
        if request.method == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': headers,
                'body': ''
            }
        
        # Only allow POST requests
        if request.method != 'POST':
            return {
                'statusCode': 405,
                'headers': headers,
                'body': json.dumps({'error': 'Method not allowed'})
            }
        
        # Parse request body
        if hasattr(request, 'body'):
            # For newer Vercel runtime
            body = request.body
        elif hasattr(request, 'get_json'):
            # For Flask-like interface
            body = request.get_json()
        else:
            # Fallback - try to read from request
            body = json.loads(request.read().decode('utf-8'))
        
        # Handle different body formats
        if isinstance(body, str):
            data = json.loads(body)
        else:
            data = body
            
        usms_link = data.get('usmsLink')
        
        if not usms_link:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'USMS link is required'})
            }

        # Get user ID from headers
        user_id = None
        if hasattr(request, 'headers'):
            user_id = request.headers.get('X-User-ID')
        elif hasattr(request, 'get_header'):
            user_id = request.get_header('X-User-ID')
            
        if not user_id:
            user_id = user_service.create_user_session()

        # Scrape the USMS results
        results_data = scraper.scrape_usms_results(usms_link)
        
        if not results_data:
            return {
                'statusCode': 500,
                'headers': headers,
                'body': json.dumps({'error': 'Failed to scrape USMS results'})
            }

        # Analyze the performance
        analysis = analyzer.analyze_performance(results_data)
        
        if not analysis:
            return {
                'statusCode': 500,
                'headers': headers,
                'body': json.dumps({'error': 'Failed to analyze performance data'})
            }

        # Store analysis data for this user
        user_service.store_user_data(user_id, analysis)
        
        # Convert to dict for JSON response
        analysis_dict = _analysis_result_to_dict(analysis)
        
        # Add user session info to response
        analysis_dict['user_session'] = {
            'user_id': user_id,
            'swimmer_name': analysis.swimmer.name
        }

        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps(analysis_dict)
        }

    except json.JSONDecodeError as e:
        print(f"JSON decode error: {e}")
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'error': 'Invalid JSON in request body'})
        }
    except Exception as e:
        print(f"Error in analyze endpoint: {e}")
        import traceback
        traceback.print_exc()
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': 'Internal server error'})
        }

# For backward compatibility with different Vercel runtime versions
def default(request):
    return handler(request)