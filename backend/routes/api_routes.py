from flask import Blueprint, request, jsonify, session
from datetime import datetime
from typing import Dict, Any
from services.usms_scraper import USMSScraper
from services.performance_analyzer import PerformanceAnalyzer
from services.user_service import UserService
from models.data_models import AnalysisResult

# Create Blueprint
api_bp = Blueprint('api', __name__, url_prefix='/api')

# Initialize services
scraper = USMSScraper()
analyzer = PerformanceAnalyzer()
user_service = UserService()

@api_bp.route('/analyze', methods=['POST'])
def analyze_usms_results():
    """Analyze USMS results from provided URL"""
    try:
        # Initialize user session if not exists
        if 'user_id' not in session:
            session['user_id'] = user_service.create_user_session()
        
        user_id = session['user_id']
        data = request.get_json()
        usms_link = data.get('usmsLink')
        
        if not usms_link:
            return jsonify({'error': 'USMS link is required'}), 400

        # Scrape the USMS results
        results_data = scraper.scrape_usms_results(usms_link)
        
        if not results_data:
            return jsonify({'error': 'Failed to scrape USMS results'}), 500

        # Analyze the performance
        analysis = analyzer.analyze_performance(results_data)
        
        if not analysis:
            return jsonify({'error': 'Failed to analyze performance data'}), 500

        # Store analysis data for this user
        user_service.store_user_data(user_id, analysis)
        
        # Convert to dict for JSON response
        analysis_dict = _analysis_result_to_dict(analysis)
        
        # Add user session info to response
        analysis_dict['user_session'] = {
            'user_id': user_id,
            'swimmer_name': analysis.swimmer.name
        }

        return jsonify(analysis_dict)

    except Exception as e:
        print(f"Error in analyze endpoint: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@api_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

@api_bp.route('/session', methods=['GET'])
def get_session():
    """Get current user session information"""
    if 'user_id' not in session:
        return jsonify({'error': 'No active session'}), 404
    
    user_id = session['user_id']
    user_session = user_service.get_user_session_info(user_id)
    
    if not user_session:
        return jsonify({'error': 'No data found for current session'}), 404
    
    return jsonify({
        'user_id': user_session.user_id,
        'has_data': True,
        'swimmer_name': user_session.swimmer_name
    })

@api_bp.route('/session', methods=['DELETE'])
def clear_session():
    """Clear current user session and data"""
    if 'user_id' in session:
        user_id = session['user_id']
        user_service.clear_user_data(user_id)
        session.pop('user_id', None)
    
    return jsonify({'message': 'Session cleared successfully'})

@api_bp.route('/data', methods=['GET'])
def get_user_data():
    """Get stored analysis data for current user"""
    if 'user_id' not in session:
        return jsonify({'error': 'No active session'}), 404
    
    user_id = session['user_id']
    user_data = user_service.get_user_data(user_id)
    
    if not user_data:
        return jsonify({'error': 'No data found for current session'}), 404
    
    return jsonify(_analysis_result_to_dict(user_data))

@api_bp.route('/users/active', methods=['GET'])
def get_active_users():
    """Get count of active users (for admin/monitoring purposes)"""
    return jsonify({
        'active_users': user_service.get_active_users_count(),
        'total_sessions': user_service.get_total_sessions_count()
    })

@api_bp.route('/sample-data', methods=['GET'])
def get_sample_data():
    """Get sample data for testing"""
    sample_data = {
        "swimmer": {
            "name": "John Doe",
            "age": 35,
            "totalMeets": 12,
            "totalEvents": 48
        },
        "performance": {
            "bestTimes": [
                {"event": "50 Free", "time": "23.45", "date": "2023-01-15", "meet": "Winter Nationals", "courseType": "SCY"},
                {"event": "100 Free", "time": "52.12", "date": "2023-02-20", "meet": "Spring Championships", "courseType": "SCY"},
                {"event": "200 Free", "time": "1:58.34", "date": "2023-03-10", "meet": "Summer Classic", "courseType": "SCY"},
                {"event": "50 Free", "time": "24.67", "date": "2023-06-15", "meet": "Summer Nationals", "courseType": "LCM"},
                {"event": "100 Free", "time": "54.23", "date": "2023-06-15", "meet": "Summer Nationals", "courseType": "LCM"},
                {"event": "50 Back", "time": "28.67", "date": "2023-01-15", "meet": "Winter Nationals", "courseType": "SCY"},
                {"event": "100 Back", "time": "1:02.45", "date": "2023-02-20", "meet": "Spring Championships", "courseType": "SCY"},
                {"event": "50 Breast", "time": "32.12", "date": "2023-03-10", "meet": "Summer Classic", "courseType": "SCY"},
                {"event": "100 Breast", "time": "1:08.34", "date": "2023-01-15", "meet": "Winter Nationals", "courseType": "SCY"},
                {"event": "50 Fly", "time": "26.78", "date": "2023-02-20", "meet": "Spring Championships", "courseType": "SCY"},
                {"event": "100 Fly", "time": "58.92", "date": "2023-03-10", "meet": "Summer Classic", "courseType": "SCY"},
                {"event": "200 IM", "time": "2:15.67", "date": "2023-01-15", "meet": "Winter Nationals", "courseType": "SCY"}
            ],
            "recentTimes": [
                {"event": "50 Free", "times": [23.45, 23.67, 23.89, 24.12, 23.78]},
                {"event": "100 Free", "times": [52.12, 52.45, 52.89, 53.12, 52.67]}
            ]
        },
        "meetBreakdown": {
            "currentMeet": {
                "name": "Spring Championships 2024",
                "date": "2024-02-20",
                "location": "San Francisco, CA",
                "results": [
                    {"event": "50 Free", "place": 3, "time": "23.45", "improvement": "-0.5s", "ageGroup": "35-39"},
                    {"event": "100 Free", "place": 2, "time": "52.12", "improvement": "-1.2s", "ageGroup": "35-39"},
                    {"event": "200 Free", "place": 1, "time": "1:58.34", "improvement": "-2.1s", "ageGroup": "35-39"},
                    {"event": "50 Back", "place": 4, "time": "28.67", "improvement": "+0.3s", "ageGroup": "35-39"},
                    {"event": "100 Back", "place": 3, "time": "1:02.45", "improvement": "-0.8s", "ageGroup": "35-39"},
                    {"event": "50 Breast", "place": 5, "time": "32.12", "improvement": "+0.1s", "ageGroup": "35-39"}
                ]
            },
            "allTimeImprovements": [
                {"event": "50 Free", "improvement": "-2.3s", "date": "2023-01-15"},
                {"event": "100 Free", "improvement": "-3.1s", "date": "2023-02-20"},
                {"event": "200 Free", "improvement": "-4.2s", "date": "2023-03-10"},
                {"event": "50 Back", "improvement": "-1.8s", "date": "2023-01-15"},
                {"event": "100 Back", "improvement": "-2.5s", "date": "2023-02-20"},
                {"event": "50 Breast", "improvement": "-1.2s", "date": "2023-03-10"}
            ],
            "ageGroupImprovements": {
                "35-39": [
                    {"event": "50 Free", "improvement": "-0.5s", "rank": 2},
                    {"event": "100 Free", "improvement": "-1.2s", "rank": 1},
                    {"event": "200 Free", "improvement": "-2.1s", "rank": 1}
                ],
                "40-44": [
                    {"event": "50 Free", "improvement": "-0.3s", "rank": 3},
                    {"event": "100 Free", "improvement": "-0.8s", "rank": 2},
                    {"event": "200 Free", "improvement": "-1.5s", "rank": 2}
                ]
            }
        },
        "personalBests": {
            "allTime": [
                {"event": "50 Free", "time": "23.45", "date": "2023-01-15", "meet": "Winter Nationals", "courseType": "SCY"},
                {"event": "100 Free", "time": "52.12", "date": "2023-02-20", "meet": "Spring Championships", "courseType": "SCY"},
                {"event": "200 Free", "time": "1:58.34", "date": "2023-03-10", "meet": "Summer Classic", "courseType": "SCY"},
                {"event": "50 Free", "time": "24.67", "date": "2023-06-15", "meet": "Summer Nationals", "courseType": "LCM"},
                {"event": "100 Free", "time": "54.23", "date": "2023-06-15", "meet": "Summer Nationals", "courseType": "LCM"},
                {"event": "50 Back", "time": "28.67", "date": "2023-01-15", "meet": "Winter Nationals", "courseType": "SCY"},
                {"event": "100 Back", "time": "1:02.45", "date": "2023-02-20", "meet": "Spring Championships", "courseType": "SCY"},
                {"event": "50 Breast", "time": "32.12", "date": "2023-03-10", "meet": "Summer Classic", "courseType": "SCY"},
                {"event": "100 Breast", "time": "1:08.34", "date": "2023-01-15", "meet": "Winter Nationals", "courseType": "SCY"},
                {"event": "50 Fly", "time": "26.78", "date": "2023-02-20", "meet": "Spring Championships", "courseType": "SCY"},
                {"event": "100 Fly", "time": "58.92", "date": "2023-03-10", "meet": "Summer Classic", "courseType": "SCY"},
                {"event": "200 IM", "time": "2:15.67", "date": "2023-01-15", "meet": "Winter Nationals", "courseType": "SCY"}
            ],
            "byAgeGroup": {
                "18-24": [
                    {"event": "50 Free", "time": "22.34", "date": "2019-06-15", "meet": "College Nationals", "courseType": "SCY"},
                    {"event": "100 Free", "time": "49.87", "date": "2019-06-15", "meet": "College Nationals", "courseType": "SCY"},
                    {"event": "200 Free", "time": "1:52.45", "date": "2019-06-15", "meet": "College Nationals", "courseType": "SCY"}
                ],
                "25-29": [
                    {"event": "50 Free", "time": "23.12", "date": "2020-03-20", "meet": "Spring Classic", "courseType": "SCY"},
                    {"event": "100 Free", "time": "51.23", "date": "2020-03-20", "meet": "Spring Classic", "courseType": "SCY"},
                    {"event": "200 Free", "time": "1:56.78", "date": "2020-03-20", "meet": "Spring Classic", "courseType": "SCY"}
                ],
                "30-34": [
                    {"event": "50 Free", "time": "23.89", "date": "2022-07-10", "meet": "Summer Nationals", "courseType": "LCM"},
                    {"event": "100 Free", "time": "52.67", "date": "2022-07-10", "meet": "Summer Nationals", "courseType": "LCM"},
                    {"event": "200 Free", "time": "1:59.12", "date": "2022-07-10", "meet": "Summer Nationals", "courseType": "LCM"}
                ],
                "35-39": [
                    {"event": "50 Free", "time": "23.45", "date": "2023-01-15", "meet": "Winter Nationals", "courseType": "SCY"},
                    {"event": "100 Free", "time": "52.12", "date": "2023-02-20", "meet": "Spring Championships", "courseType": "SCY"},
                    {"event": "200 Free", "time": "1:58.34", "date": "2023-03-10", "meet": "Summer Classic", "courseType": "SCY"}
                ]
            }
        },
        "clubs": [
            {
                "name": "Aqua Masters",
                "location": "San Francisco, CA",
                "years": "2018-2023",
                "meets": 15,
                "events": 45,
                "bestTimes": 8,
                "logo": "🏊‍♂️"
            },
            {
                "name": "Golden State Swim Club",
                "location": "Los Angeles, CA",
                "years": "2015-2018",
                "meets": 8,
                "events": 24,
                "bestTimes": 5,
                "logo": "🏆"
            },
            {
                "name": "Pacific Masters",
                "location": "San Diego, CA",
                "years": "2012-2015",
                "meets": 6,
                "events": 18,
                "bestTimes": 3,
                "logo": "🌊"
            },
            {
                "name": "College Swim Team",
                "location": "Berkeley, CA",
                "years": "2008-2012",
                "meets": 20,
                "events": 60,
                "bestTimes": 12,
                "logo": "🎓"
            }
        ],
        "eventDistribution": {
            "Freestyle": 12,
            "Backstroke": 8,
            "Breaststroke": 6,
            "Butterfly": 4,
            "Individual Medley": 3
        }
    }
    return jsonify(sample_data)

def _analysis_result_to_dict(analysis: AnalysisResult) -> Dict[str, Any]:
    """Convert AnalysisResult to dictionary for JSON serialization"""
    return {
        "swimmer": {
            "name": analysis.swimmer.name,
            "age": analysis.swimmer.age,
            "totalMeets": analysis.swimmer.total_meets,
            "totalEvents": analysis.swimmer.total_events
        },
        "performance": {
            "bestTimes": [
                {
                    "event": bt.event,
                    "time": bt.time,
                    "date": bt.date,
                    "meet": bt.meet,
                    "courseType": bt.course_type
                }
                for bt in analysis.performance.best_times
            ],
            "recentTimes": [
                {
                    "event": pt.event,
                    "times": pt.times
                }
                for pt in analysis.performance.recent_times
            ]
        },
        "meetBreakdown": {
            "meets": [
                {
                    "name": meet.name,
                    "date": meet.date,
                    "location": meet.location,
                    "results": [
                        {
                            "event": r.event,
                            "place": r.place,
                            "time": r.time,
                            "improvement": r.improvement,
                            "ageGroup": r.age_group
                        }
                        for r in meet.results
                    ]
                }
                for meet in analysis.meet_breakdown.meets
            ],
            "currentMeet": analysis.meet_breakdown.current_meet,
            "allTimeImprovements": [
                {
                    "event": imp.event,
                    "improvement": imp.improvement,
                    "date": imp.date
                }
                for imp in analysis.meet_breakdown.all_time_improvements
            ],
            "ageGroupImprovements": {
                age_group: [
                    {
                        "event": imp.event,
                        "improvement": imp.improvement,
                        "rank": imp.rank
                    }
                    for imp in improvements
                ]
                for age_group, improvements in analysis.meet_breakdown.age_group_improvements.items()
            }
        },
        "personalBests": {
            "allTime": [
                {
                    "event": bt.event,
                    "time": bt.time,
                    "date": bt.date,
                    "meet": bt.meet,
                    "courseType": bt.course_type
                }
                for bt in analysis.personal_bests.all_time
            ],
            "byAgeGroup": {
                age_group: [
                    {
                        "event": bt.event,
                        "time": bt.time,
                        "date": bt.date,
                        "meet": bt.meet,
                        "courseType": bt.course_type
                    }
                    for bt in best_times
                ]
                for age_group, best_times in analysis.personal_bests.by_age_group.items()
            }
        },
        "clubs": [
            {
                "name": club.name,
                "location": club.location,
                "years": club.years,
                "meets": club.meets,
                "events": club.events,
                "bestTimes": club.best_times,
                "logo": club.logo
            }
            for club in analysis.clubs
        ],
        "summary": {
            "total_events": analysis.summary.total_events,
            "total_points": analysis.summary.total_points,
            "average_place": analysis.summary.average_place
        },
        "insights": {
            "strengths": analysis.insights.strengths,
            "improvements": analysis.insights.improvements,
            "recommendations": analysis.insights.recommendations
        },
        "eventDistribution": analysis.event_distribution
    } 