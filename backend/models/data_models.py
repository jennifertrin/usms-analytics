from dataclasses import dataclass
from typing import List, Dict, Optional, Any
from datetime import datetime

@dataclass
class SwimmerInfo:
    """Swimmer information data model"""
    name: str
    age: int
    team: str

@dataclass
class MeetInfo:
    """Meet information data model"""
    name: str
    date: str
    location: str
    course_type: str  # "SCY", "SCM", or "LCM"

@dataclass
class SwimResult:
    """Individual swim result data model"""
    event: str
    time: str
    place: int
    date: str
    club: str
    age_group: str
    course_type: str  # "SCY", "SCM", or "LCM"

@dataclass
class BestTime:
    """Best time data model"""
    event: str
    time: str
    date: str
    meet: str
    seconds: float
    course_type: str  # "SCY", "SCM", or "LCM"

@dataclass
class PerformanceTrend:
    """Performance trend data model"""
    event: str
    times: List[float]

@dataclass
class MeetResult:
    """Meet result data model"""
    event: str
    place: int
    time: str
    improvement: str
    age_group: str

@dataclass
class Improvement:
    """Improvement data model"""
    event: str
    improvement: str
    date: str

@dataclass
class AgeGroupImprovement:
    """Age group improvement data model"""
    event: str
    improvement: str
    rank: int

@dataclass
class ClubInfo:
    """Club information data model"""
    name: str
    location: str
    years: str
    meets: int
    events: int
    best_times: int
    logo: str

@dataclass
class PerformanceInsights:
    """Performance insights data model"""
    strengths: List[str]
    improvements: List[str]
    recommendations: List[str]

@dataclass
class PerformanceSummary:
    """Performance summary data model"""
    total_events: int
    total_points: int
    average_place: float

@dataclass
class SwimmerPerformance:
    """Swimmer performance data model"""
    name: str
    age: int
    total_meets: int
    total_events: int

@dataclass
class PerformanceData:
    """Complete performance data model"""
    best_times: List[BestTime]
    recent_times: List[PerformanceTrend]

@dataclass
class MeetData:
    """Individual meet data model"""
    name: str
    date: str
    location: str
    results: List[MeetResult]

@dataclass
class MeetBreakdown:
    """Meet breakdown data model"""
    meets: List[MeetData]
    current_meet: Dict[str, Any]  # Keep for backward compatibility
    all_time_improvements: List[Improvement]
    age_group_improvements: Dict[str, List[AgeGroupImprovement]]

@dataclass
class PersonalBests:
    """Personal bests data model"""
    all_time: List[BestTime]
    by_age_group: Dict[str, List[BestTime]]

@dataclass
class AnalysisResult:
    """Complete analysis result data model"""
    swimmer: SwimmerPerformance
    performance: PerformanceData
    meet_breakdown: MeetBreakdown
    personal_bests: PersonalBests
    clubs: List[ClubInfo]
    summary: PerformanceSummary
    insights: PerformanceInsights
    event_distribution: Dict[str, int]

@dataclass
class UserSession:
    """User session data model"""
    user_id: str
    swimmer_name: str

@dataclass
class ScrapedData:
    """Scraped data model"""
    swimmer: SwimmerInfo
    meet: MeetInfo
    results: List[SwimResult] 