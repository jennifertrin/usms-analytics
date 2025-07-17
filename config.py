import os
from datetime import datetime

class Config:
    """Application configuration"""
    
    # Flask settings
    SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key-change-in-production')
    DEBUG = os.environ.get('FLASK_DEBUG', 'True').lower() == 'true'
    
    # Server settings
    HOST = os.environ.get('HOST', '0.0.0.0')
    PORT = int(os.environ.get('PORT', 5000))
    
    # Vercel settings
    IS_VERCEL = os.environ.get('VERCEL', 'false').lower() == 'true'
    
    # CORS settings
    CORS_SUPPORTS_CREDENTIALS = True
    
    # User agent for web scraping
    USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    
    # Swimming time validation
    MIN_SWIM_TIME_SECONDS = 10
    MAX_SWIM_TIME_SECONDS = 7200  # 2 hours
    
    # Age group mappings
    AGE_GROUPS = {
        (18, 24): "18-24",
        (25, 29): "25-29",
        (30, 34): "30-34",
        (35, 39): "35-39",
        (40, 44): "40-44",
        (45, 49): "45-49",
        (50, 54): "50-54",
        (55, 59): "55-59",
        (60, 64): "60-64",
        (65, 69): "65-69",
        (70, 74): "70-74",
        (75, 79): "75-79",
        (80, float('inf')): "80+"
    }
    
    # Swimming events
    SWIMMING_EVENTS = [
        "50 Free", "100 Free", "200 Free", "400 Free", "800 Free", "1500 Free",
        "50 Back", "100 Back", "200 Back",
        "50 Breast", "100 Breast", "200 Breast",
        "50 Fly", "100 Fly", "200 Fly",
        "100 IM", "200 IM", "400 IM",
        "Freestyle", "Backstroke", "Breaststroke", "Butterfly", "Individual Medley"
    ] 