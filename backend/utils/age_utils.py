from typing import Optional
from config import Config

def extract_age_group_from_age(age_text: str) -> str:
    """Extract age group from age column text"""
    try:
        # Age column might contain "35-39" or just "35"
        if '-' in age_text:
            # Already in age group format
            return age_text
        elif age_text.isdigit():
            age = int(age_text)
            return age_to_age_group(age)
        else:
            return "Unknown"
    except:
        return "Unknown"

def age_to_age_group(age: int) -> str:
    """Convert age to age group"""
    for (min_age, max_age), age_group in Config.AGE_GROUPS.items():
        if min_age <= age <= max_age:
            return age_group
    return "Unknown"

def is_valid_age_group(age_group: str) -> bool:
    """Check if age group is valid"""
    valid_groups = set(Config.AGE_GROUPS.values())
    return age_group in valid_groups

def get_age_group_range(age_group: str) -> tuple[int, int]:
    """Get the age range for a given age group"""
    for (min_age, max_age), group in Config.AGE_GROUPS.items():
        if group == age_group:
            return (min_age, max_age)
    return (0, 0) 