import sys
import os
from flask import Flask
from flask_cors import CORS

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config import Config
from server.routes.api_routes import api_bp

def create_app():
    """Application factory pattern"""
    app = Flask(__name__)
    
    # Configure app
    app.secret_key = Config.SECRET_KEY
    
    # Initialize extensions (removed Flask-Session for Vercel compatibility)
    CORS(app, supports_credentials=Config.CORS_SUPPORTS_CREDENTIALS)
    
    # Register blueprints
    app.register_blueprint(api_bp)
    
    return app

# Create the application instance
app = create_app()

if __name__ == '__main__':
    app.run(
        debug=Config.DEBUG,
        host=Config.HOST,
        port=Config.PORT
    ) 