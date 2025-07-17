import re
from typing import Optional
from config import Config

def time_to_seconds(time_str: str) -> float:
    """Convert time string to seconds"""
    if not time_str:
        return 0.0
    
    # Handle formats like "23.45", "1:58.34", "2:15.67"
    parts = time_str.split(':')
    if len(parts) == 1:
        return float(parts[0])
    elif len(parts) == 2:
        return int(parts[0]) * 60 + float(parts[1])
    return 0.0

def is_valid_swim_time(time_str: str) -> bool:
    """Check if text matches swimming time format"""
    if not time_str:
        return False
    
    # Remove any extra characters
    time_str = time_str.strip()
    
    # Patterns: "23.45", "1:58.34", "2:15.67", "23.45s", "1:58.34s"
    time_pattern = r'^(\d+:)?\d+\.\d+s?$'
    
    # Additional validation: times should be reasonable for swimming
    if re.match(time_pattern, time_str):
        # Convert to seconds and check if it's reasonable
        seconds = time_to_seconds(time_str)
        # Swimming times should be between min and max configured values
        return Config.MIN_SWIM_TIME_SECONDS <= seconds <= Config.MAX_SWIM_TIME_SECONDS
    
    return False

def format_time_display(seconds: float) -> str:
    """Format seconds back to readable time format"""
    if seconds < 60:
        return f"{seconds:.2f}"
    else:
        minutes = int(seconds // 60)
        remaining_seconds = seconds % 60
        return f"{minutes}:{remaining_seconds:05.2f}"

def calculate_time_improvement(old_time: str, new_time: str) -> str:
    """Calculate time improvement between two times"""
    old_seconds = time_to_seconds(old_time)
    new_seconds = time_to_seconds(new_time)
    
    difference = new_seconds - old_seconds
    
    if difference < 0:
        return f"-{abs(difference):.1f}s"
    elif difference > 0:
        return f"+{difference:.1f}s"
    else:
        return "0.0s" 