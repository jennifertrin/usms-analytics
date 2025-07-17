from http.server import BaseHTTPRequestHandler
import json
import sys
import os
from datetime import datetime
import uuid

# Add the current directory to the path so we can import our modules
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
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, X-User-ID')
        self.end_headers()

        try:
            # Get user ID from headers (client should send this)
            user_id = self.headers.get('X-User-ID')
            
            if not user_id:
                # Create new session if no user ID provided
                user_id = user_service.create_user_session()
                response = {
                    'user_id': user_id,
                    'has_data': False,
                    'swimmer_name': None,
                    'new_session': True
                }
            else:
                # Get existing session data
                user_session = user_service.get_user_session_info(user_id)
                
                if not user_session:
                    response = {
                        'user_id': user_id,
                        'has_data': False,
                        'swimmer_name': None,
                        'new_session': False
                    }
                else:
                    response = {
                        'user_id': user_session.user_id,
                        'has_data': True,
                        'swimmer_name': user_session.swimmer_name,
                        'new_session': False
                    }
            
            self.wfile.write(json.dumps(response).encode())

        except Exception as e:
            print(f"Error in session GET endpoint: {e}")
            response = {'error': 'Internal server error'}
            self.wfile.write(json.dumps(response).encode())

    def do_POST(self):
        # Set CORS headers
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, X-User-ID')
        self.end_headers()

        try:
            # Create a new session
            user_id = user_service.create_user_session()
            response = {
                'user_id': user_id,
                'message': 'New session created successfully'
            }
            
            self.wfile.write(json.dumps(response).encode())

        except Exception as e:
            print(f"Error in session POST endpoint: {e}")
            response = {'error': 'Internal server error'}
            self.wfile.write(json.dumps(response).encode())

    def do_DELETE(self):
        # Set CORS headers
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, X-User-ID')
        self.end_headers()

        try:
            # Get user ID from headers
            user_id = self.headers.get('X-User-ID')
            
            if user_id:
                user_service.clear_user_data(user_id)
                response = {'message': 'Session cleared successfully'}
            else:
                response = {'message': 'No session to clear'}
                
            self.wfile.write(json.dumps(response).encode())

        except Exception as e:
            print(f"Error in session DELETE endpoint: {e}")
            response = {'error': 'Internal server error'}
            self.wfile.write(json.dumps(response).encode())

    def do_OPTIONS(self):
        # Handle preflight requests
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, X-User-ID')
        self.end_headers() 