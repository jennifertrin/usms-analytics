from flask import Flask
from flask_cors import CORS
from flask_session import Session
from config import Config
from routes.api_routes import api_bp

def create_app():
    """Application factory pattern"""
    app = Flask(__name__)
    
    # Configure app
    app.secret_key = Config.SECRET_KEY
    app.config['SESSION_TYPE'] = Config.SESSION_TYPE
    
    # Initialize extensions
    Session(app)
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