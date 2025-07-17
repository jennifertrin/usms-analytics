from typing import Dict, List, Optional
from collections import defaultdict
from models.data_models import (
    ScrapedData, AnalysisResult, SwimmerPerformance, PerformanceData,
    BestTime, PerformanceTrend, MeetBreakdown, PersonalBests,
    ClubInfo, PerformanceSummary, PerformanceInsights, MeetResult,
    Improvement, AgeGroupImprovement, MeetData
)
from utils.time_utils import time_to_seconds, calculate_time_improvement

class PerformanceAnalyzer:
    """Service for analyzing swimming performance data"""
    
    def analyze_performance(self, results_data: ScrapedData) -> Optional[AnalysisResult]:
        """Analyze swimming performance data"""
        if not results_data or not results_data.results:
            print("No results to analyze")
            return None

        results = results_data.results
        
        # Calculate basic statistics
        total_events = len(results)
        total_points = sum(10 - result.place for result in results if result.place <= 10)
        
        # Calculate total unique meets - THIS IS THE FIX
        unique_meets = set()
        for result in results:
            # Create unique identifier for each meet (date + course type)
            course_type = getattr(result, 'course_type', 'SCY')
            meet_id = f"{result.date}_{course_type}"
            unique_meets.add(meet_id)
        
        total_meets = len(unique_meets)
        
        # Find best times
        best_times = self._find_best_times(results)

        # Group results by event for trend analysis
        event_results = self._group_results_by_event(results)

        # Create performance trends
        performance_trends = self._create_performance_trends(event_results)

        # Generate meet breakdown data
        meet_breakdown = self._generate_meet_breakdown(results)
        
        # Generate personal bests data
        personal_bests = self._generate_personal_bests(results)
        
        # Generate clubs data
        clubs_data = self._generate_clubs_data(results)

        # Create swimmer performance data with CORRECT total_meets
        swimmer_performance = SwimmerPerformance(
            name=results_data.swimmer.name,
            age=results_data.swimmer.age,
            total_meets=total_meets,  # Now correctly calculated
            total_events=total_events
        )

        # Create performance data
        performance_data = PerformanceData(
            best_times=best_times,
            recent_times=performance_trends
        )

        # Create summary
        summary = PerformanceSummary(
            total_events=total_events,
            total_points=total_points,
            average_place=sum(r.place for r in results) / total_events if total_events > 0 else 0
        )

        # Generate insights
        insights = self._generate_insights(results, best_times)

        # Calculate event distribution
        event_distribution = self._calculate_event_distribution(results)

        return AnalysisResult(
            swimmer=swimmer_performance,
            performance=performance_data,
            meet_breakdown=meet_breakdown,
            personal_bests=personal_bests,
            clubs=clubs_data,
            summary=summary,
            insights=insights,
            event_distribution=event_distribution
        )

    def _find_best_times(self, results: List) -> List[BestTime]:
        """Find best times for each event and course type"""
        best_times = {}
        
        for result in results:
            event = result.event
            time_str = result.time
            course_type = getattr(result, 'course_type', 'SCY')  # Default to SCY if not specified
            
            # Create a unique key for event + course type
            event_key = f"{event}_{course_type}"
            
            # Convert time to seconds for comparison
            time_seconds = time_to_seconds(time_str)
            
            if event_key not in best_times or time_seconds < best_times[event_key].seconds:
                best_times[event_key] = BestTime(
                    event=event,
                    time=time_str,
                    date=result.date,
                    meet=result.date,  # Using date as meet for now
                    seconds=time_seconds,
                    course_type=course_type
                )

        return list(best_times.values())

    def _group_results_by_event(self, results: List) -> Dict[str, List]:
        """Group results by event"""
        event_results = defaultdict(list)
        for result in results:
            event_results[result.event].append(result)
        return dict(event_results)

    def _create_performance_trends(self, event_results: Dict[str, List]) -> List[PerformanceTrend]:
        """Create performance trends for events with multiple results"""
        performance_trends = []
        
        for event, event_data in event_results.items():
            if len(event_data) > 1:
                # Sort by date if available, otherwise use order
                times = [time_to_seconds(r.time) for r in event_data]
                performance_trends.append(PerformanceTrend(
                    event=event,
                    times=times
                ))

        return performance_trends

    def _generate_meet_breakdown(self, results: List) -> MeetBreakdown:
        """Generate meet breakdown data"""
        if not results:
            return MeetBreakdown(
                meets=[],
                current_meet={},
                all_time_improvements=[],
                age_group_improvements={}
            )
        
        # Group results by meet date and course type
        meets_by_date = defaultdict(lambda: defaultdict(list))
        for result in results:
            course_type = getattr(result, 'course_type', 'SCY')  # Default to SCY if not specified
            meets_by_date[result.date][course_type].append(result)
        
        # Create meet data for each unique meet date and course type
        meets_data = []
        for meet_date, course_types in meets_by_date.items():
            for course_type, meet_results in course_types.items():
                meet_results_list = []
                for result in meet_results:
                    meet_results_list.append(MeetResult(
                        event=result.event,
                        place=result.place,
                        time=result.time,
                        improvement=self._calculate_improvement(result),
                        age_group=result.age_group
                    ))
                
                # Sort results by event name for consistency
                meet_results_list.sort(key=lambda x: x.event)
                
                meets_data.append(MeetData(
                    name=f"{meet_date} - ({course_type})",
                    date=meet_date,
                    location="",  # Could be enhanced to include location if available
                    results=meet_results_list
                ))
        
        # Sort meets by date (oldest first)
        meets_data.sort(key=lambda x: x.date)
        
        # Get the most recent meet for current_meet (backward compatibility)
        latest_meet = max(meets_data, key=lambda x: x.date) if meets_data else None
        current_meet = {
            "name": latest_meet.name if latest_meet else "",
            "date": latest_meet.date if latest_meet else "",
            "location": latest_meet.location if latest_meet else "",
            "results": [{"event": r.event, "place": r.place, "time": r.time, "improvement": r.improvement, "ageGroup": r.age_group} for r in latest_meet.results] if latest_meet else []
        }
        
        # Generate all-time improvements (simplified for now)
        all_time_improvements = []
        for result in results:
            all_time_improvements.append(Improvement(
                event=result.event,
                improvement=self._calculate_improvement(result),
                date=result.date
            ))
        
        # Generate age group improvements
        age_group_improvements = self._generate_age_group_improvements(results)
        
        return MeetBreakdown(
            meets=meets_data,
            current_meet=current_meet,
            all_time_improvements=all_time_improvements,
            age_group_improvements=age_group_improvements
        )

    def _generate_age_group_improvements(self, results: List) -> Dict[str, List[AgeGroupImprovement]]:
        """Generate age group improvements"""
        age_group_improvements = {}
        age_groups = set(result.age_group for result in results)
        
        for age_group in age_groups:
            age_group_results = [r for r in results if r.age_group == age_group]
            if age_group_results:
                age_group_improvements[age_group] = []
                for result in age_group_results[:3]:  # Top 3 per age group
                    age_group_improvements[age_group].append(AgeGroupImprovement(
                        event=result.event,
                        improvement=self._calculate_improvement(result),
                        rank=result.place
                    ))
        
        return age_group_improvements

    def _generate_personal_bests(self, results: List) -> PersonalBests:
        """Generate personal bests data"""
        if not results:
            return PersonalBests(all_time=[], by_age_group={})
        
        # Group by age group and course type
        age_group_results = defaultdict(lambda: defaultdict(list))
        for result in results:
            course_type = getattr(result, 'course_type', 'SCY')  # Default to SCY if not specified
            age_group_results[result.age_group][course_type].append(result)
        
        # Find best times for each event in each age group and course type
        all_time_bests = {}
        for result in results:
            event = result.event
            time_seconds = time_to_seconds(result.time)
            course_type = getattr(result, 'course_type', 'SCY')
            
            # Create unique key for event + course type
            event_key = f"{event}_{course_type}"
            
            if event_key not in all_time_bests or time_seconds < all_time_bests[event_key].seconds:
                all_time_bests[event_key] = BestTime(
                    event=event,
                    time=result.time,
                    date=result.date,
                    meet=result.date,
                    seconds=time_seconds,
                    course_type=course_type
                )
        
        # Age group bests by course type
        by_age_group = {}
        for age_group, course_types in age_group_results.items():
            age_bests = {}
            for course_type, age_results in course_types.items():
                for result in age_results:
                    event = result.event
                    time_seconds = time_to_seconds(result.time)
                    
                    # Create unique key for event + course type within age group
                    event_key = f"{event}_{course_type}"
                    
                    if event_key not in age_bests or time_seconds < age_bests[event_key].seconds:
                        age_bests[event_key] = BestTime(
                            event=event,
                            time=result.time,
                            date=result.date,
                            meet=result.date,
                            seconds=time_seconds,
                            course_type=course_type
                        )
            
            by_age_group[age_group] = list(age_bests.values())
        
        return PersonalBests(
            all_time=list(all_time_bests.values()),
            by_age_group=by_age_group
        )

    def _generate_clubs_data(self, results: List) -> List[ClubInfo]:
        """Generate clubs data"""
        if not results:
            return []
        
        # Group results by club
        club_results = defaultdict(list)
        for result in results:
            club_results[result.club].append(result)
        
        clubs_data = []
        for club, club_results_list in club_results.items():
            # Calculate club statistics
            events = len(club_results_list)
            best_times = len(set(r.event for r in club_results_list))
            meets = len(set(r.date for r in club_results_list))
            avg_place = sum(r.place for r in club_results_list) / events if events > 0 else 0
            
            clubs_data.append(ClubInfo(
                name=club,
                location="",
                years="",
                meets=meets,
                events=events,
                best_times=best_times,
                logo="🏊‍♂️"
            ))
        
        return clubs_data

    def _calculate_improvement(self, result) -> str:
        """Calculate time improvement (simplified)"""
        # This is a simplified calculation - in a real implementation,
        # you would compare against previous times for the same event
        place = result.place
        if place <= 3:
            return "-1.2s"  # Good performance
        elif place <= 6:
            return "-0.5s"  # Average performance
        else:
            return "+0.3s"  # Room for improvement

    def _generate_insights(self, results: List, best_times: List[BestTime]) -> PerformanceInsights:
        """Generate performance insights"""
        insights = PerformanceInsights(
            strengths=[],
            improvements=[],
            recommendations=[]
        )

        # Analyze event distribution
        events = [r.event for r in results]
        freestyle_count = len([e for e in events if 'Free' in e])
        
        if freestyle_count > len(events) * 0.5:
            insights.strengths.append("Strong performance in freestyle events")
        
        # Analyze times
        for result in results:
            if result.place <= 3:
                insights.strengths.append(f"Excellent performance in {result.event}")
            elif result.place >= 8:
                insights.improvements.append(f"Room for improvement in {result.event}")

        insights.recommendations = [
            "Focus on technique drills for butterfly",
            "Increase endurance training for longer events",
            "Practice turn efficiency"
        ]

        return insights

    def _calculate_event_distribution(self, results: List) -> Dict[str, int]:
        """Calculate event distribution from results"""
        event_counts = defaultdict(int)
        
        for result in results:
            event = result.event
            # Categorize events by stroke
            if 'Free' in event:
                event_counts['Freestyle'] += 1
            elif 'Back' in event:
                event_counts['Backstroke'] += 1
            elif 'Breast' in event:
                event_counts['Breaststroke'] += 1
            elif 'Fly' in event:
                event_counts['Butterfly'] += 1
            elif 'IM' in event:
                event_counts['Individual Medley'] += 1
            else:
                # For any other events, categorize by the event name
                event_counts[event] += 1
        
        return dict(event_counts)