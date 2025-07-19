import { NextRequest, NextResponse } from 'next/server';
import { AnalyzeResponse, ErrorResponse } from '@/types/api';
import { userService } from '@/lib/userService';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest): Promise<NextResponse<AnalyzeResponse | ErrorResponse>> {
  try {
    const userId = request.headers.get('X-User-ID');
    
    console.log('Data GET request - User ID:', userId);
    
    if (!userId) {
      console.log('No user ID provided in data GET request');
      return NextResponse.json(
        { error: 'No user ID provided' } as ErrorResponse,
        { status: 400 }
      );
    }
    
    // Debug current state
    userService.debugState();
    
    const userData = userService.getUserData(userId);
    
    console.log('User data found:', !!userData);
    if (userData) {
      console.log(`Data contains swimmer: ${userData.swimmer.name}, age: ${userData.swimmer.age}`);
      console.log(`Event distribution keys: ${Object.keys(userData.eventDistribution)}`);
    }
    
    if (!userData) {
      console.log(`No data found for user ${userId}`);
      return NextResponse.json(
        { error: 'No data found for user' } as ErrorResponse,
        { status: 404 }
      );
    }
    
    // Convert AnalysisResult to AnalyzeResponse format
    const response: AnalyzeResponse = {
      swimmer: {
        name: userData.swimmer.name,
        age: userData.swimmer.age,
        totalMeets: userData.swimmer.totalMeets,
        totalEvents: userData.swimmer.totalEvents
      },
      performance: {
        bestTimes: userData.performance.bestTimes.map(bt => ({
          event: bt.event,
          time: bt.time,
          date: bt.date,
          meet: bt.meet,
          courseType: bt.courseType
        })),
        recentTimes: userData.performance.recentTimes.map(pt => ({
          event: pt.event,
          times: pt.times
        }))
      },
      meetBreakdown: {
        meets: userData.meetBreakdown.meets.map(meet => ({
          name: meet.name,
          date: meet.date,
          location: meet.location,
          results: meet.results.map(r => ({
            event: r.event,
            place: r.place,
            time: r.time,
            improvement: r.improvement,
            ageGroup: r.ageGroup
          }))
        })),
        currentMeet: userData.meetBreakdown.currentMeet,
        allTimeImprovements: userData.meetBreakdown.allTimeImprovements.map(imp => ({
          event: imp.event,
          improvement: imp.improvement,
          date: imp.date
        })),
        ageGroupImprovements: Object.fromEntries(
          Object.entries(userData.meetBreakdown.ageGroupImprovements).map(([ageGroup, improvements]) => [
            ageGroup,
            (improvements as any[]).map(imp => ({
              event: imp.event,
              improvement: imp.improvement,
              rank: imp.rank
            }))
          ])
        )
      },
      personalBests: {
        allTime: userData.personalBests.allTime.map(bt => ({
          event: bt.event,
          time: bt.time,
          date: bt.date,
          meet: bt.meet,
          courseType: bt.courseType
        })),
        byAgeGroup: Object.fromEntries(
          Object.entries(userData.personalBests.byAgeGroup).map(([ageGroup, bestTimes]) => [
            ageGroup,
            (bestTimes as any[]).map(bt => ({
              event: bt.event,
              time: bt.time,
              date: bt.date,
              meet: bt.meet,
              courseType: bt.courseType
            }))
          ])
        )
      },
      clubs: userData.clubs.map(club => ({
        name: club.name,
        location: club.location,
        years: club.years,
        meets: club.meets,
        events: club.events,
        bestTimes: club.bestTimes,
        logo: club.logo
      })),
      summary: {
        totalEvents: userData.summary.totalEvents,
        totalPoints: userData.summary.totalPoints,
        averagePlace: userData.summary.averagePlace
      },
      insights: {
        strengths: userData.insights.strengths,
        improvements: userData.insights.improvements,
        recommendations: userData.insights.recommendations
      },
      eventDistribution: userData.eventDistribution
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Data GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' } as ErrorResponse,
      { status: 500 }
    );
  }
} 