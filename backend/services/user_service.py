import uuid
from typing import Optional, Dict, Any
from collections import defaultdict
from models.data_models import AnalysisResult, UserSession

class UserService:
    """Service for managing user sessions and data"""
    
    def __init__(self):
        # In-memory storage for user data (in production, use a proper database)
        self.user_data_store = defaultdict(dict)

    def create_user_session(self) -> str:
        """Create a new user session and return user ID"""
        user_id = str(uuid.uuid4())
        return user_id

    def store_user_data(self, user_id: str, analysis_data: AnalysisResult) -> None:
        """Store analysis data for a user"""
        self.user_data_store[user_id] = analysis_data

    def get_user_data(self, user_id: str) -> Optional[AnalysisResult]:
        """Get stored analysis data for a user"""
        return self.user_data_store.get(user_id)

    def has_user_data(self, user_id: str) -> bool:
        """Check if user has stored data"""
        return user_id in self.user_data_store

    def clear_user_data(self, user_id: str) -> None:
        """Clear stored data for a user"""
        if user_id in self.user_data_store:
            del self.user_data_store[user_id]

    def get_user_session_info(self, user_id: str) -> Optional[UserSession]:
        """Get user session information"""
        user_data = self.get_user_data(user_id)
        if user_data:
            return UserSession(
                user_id=user_id,
                swimmer_name=user_data.swimmer.name
            )
        return None

    def get_active_users_count(self) -> int:
        """Get count of active users"""
        return len(self.user_data_store)

    def get_total_sessions_count(self) -> int:
        """Get total number of sessions"""
        return len(self.user_data_store) 