import json
from services.usms_scraper import USMSScraper
from services.performance_analyzer import PerformanceAnalyzer
from services.user_service import UserService

def handler(request):
    # CORS headers for all responses
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-User-ID',
        'Content-Type': 'application/json'
    }
    
    # Handle preflight
    if request.method == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}
    
    if request.method != 'POST':
        return {
            'statusCode': 405,
            'headers': headers,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        # Your existing logic here
        data = json.loads(request.body)
        usms_link = data.get('usmsLink')
        
        if not usms_link:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'USMS link is required'})
            }
        
        # Rest of your analysis logic...
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': 'Internal server error'})
        }