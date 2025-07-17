from http.server import BaseHTTPRequestHandler
import json
import sys
import os
from datetime import datetime

# Add the parent directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.user_service import UserService

# Initialize services
user_service = UserService()

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Set CORS headers
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

        try:
            # For serverless, we'll create a new session for each request
            # In a real implementation, you'd want to use cookies or headers for session management
            user_id = user_service.create_user_session()
            user_session = user_service.get_user_session_info(user_id)
            
            if not user_session:
                response = {'error': 'No data found for current session'}
                self.wfile.write(json.dumps(response).encode())
                return
            
            response = {
                'user_id': user_session.user_id,
                'has_data': True,
                'swimmer_name': user_session.swimmer_name
            }
            
            self.wfile.write(json.dumps(response).encode())

        except Exception as e:
            print(f"Error in session GET endpoint: {e}")
            response = {'error': 'Internal server error'}
            self.wfile.write(json.dumps(response).encode())

    def do_DELETE(self):
        # Set CORS headers
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

        try:
            # For serverless, we can't maintain sessions between requests
            # This is a placeholder for session clearing logic
            response = {'message': 'Session cleared successfully'}
            self.wfile.write(json.dumps(response).encode())

        except Exception as e:
            print(f"Error in session DELETE endpoint: {e}")
            response = {'error': 'Internal server error'}
            self.wfile.write(json.dumps(response).encode())

    def do_OPTIONS(self):
        # Handle preflight requests
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers() 