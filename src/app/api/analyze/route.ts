import { NextRequest, NextResponse } from 'next/server';
import { AnalyzeRequest, AnalyzeResponse, ErrorResponse } from '@/types/api';
import { userService } from '@/lib/userService';
import { analysisService } from '@/lib/analysisService';
import { getSampleData } from '@/lib/sampleData';

export async function POST(request: NextRequest): Promise<NextResponse<AnalyzeResponse | ErrorResponse>> {
  try {
    // Get user ID from headers (Vercel-compatible session management)
    let userId = request.headers.get('X-User-ID');
    if (!userId) {
      userId = userService.createUserSession();
    }
    
    const body = await request.json();
    const { usmsLink }: AnalyzeRequest = body;
    
    if (!usmsLink) {
      return NextResponse.json(
        { error: 'USMS link is required' } as ErrorResponse,
        { status: 400 }
      );
    }

        // Try to scrape and analyze the USMS results
    const analysis = await analysisService.analyzeUSMSResults(usmsLink);
    
    // If analysis fails, fall back to sample data for demonstration
    if (!analysis) {
      console.log('Analysis failed, using sample data');
      const sampleData = getSampleData();
      
      // Store sample data for this user
      const analysisResult = {
        swimmer: {
          name: sampleData.swimmer.name,
          age: sampleData.swimmer.age,
          totalMeets: sampleData.swimmer.totalMeets,
          totalEvents: sampleData.swimmer.totalEvents
        },
        performance: {
          bestTimes: sampleData.performance.bestTimes.map(bt => ({
            event: bt.event,
            time: bt.time,
            date: bt.date,
            meet: bt.meet,
            courseType: bt.courseType,
            seconds: 0 // Placeholder
          })),
          recentTimes: sampleData.performance.recentTimes.map(pt => ({
            event: pt.event,
            times: pt.times
          }))
        },
        meetBreakdown: {
          meets: sampleData.meetBreakdown.meets.map(meet => ({
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
          currentMeet: sampleData.meetBreakdown.currentMeet,
          allTimeImprovements: sampleData.meetBreakdown.allTimeImprovements.map(imp => ({
            event: imp.event,
            improvement: imp.improvement,
            date: imp.date
          })),
          ageGroupImprovements: Object.fromEntries(
            Object.entries(sampleData.meetBreakdown.ageGroupImprovements).map(([ageGroup, improvements]) => [
              ageGroup,
              improvements.map(imp => ({
                event: imp.event,
                improvement: imp.improvement,
                rank: imp.rank
              }))
            ])
          )
        },
        personalBests: {
          allTime: sampleData.personalBests.allTime.map(bt => ({
            event: bt.event,
            time: bt.time,
            date: bt.date,
            meet: bt.meet,
            courseType: bt.courseType,
            seconds: 0 // Placeholder
          })),
          byAgeGroup: Object.fromEntries(
            Object.entries(sampleData.personalBests.byAgeGroup).map(([ageGroup, bestTimes]) => [
              ageGroup,
              bestTimes.map(bt => ({
                event: bt.event,
                time: bt.time,
                date: bt.date,
                meet: bt.meet,
                courseType: bt.courseType,
                seconds: 0 // Placeholder
              }))
            ])
          )
        },
        clubs: sampleData.clubs.map(club => ({
          name: club.name,
          location: club.location,
          years: club.years,
          meets: club.meets,
          events: club.events,
          bestTimes: club.bestTimes,
          logo: club.logo
        })),
        summary: {
          totalEvents: sampleData.summary.totalEvents,
          totalPoints: sampleData.summary.totalPoints,
          averagePlace: sampleData.summary.averagePlace
        },
        insights: {
          strengths: sampleData.insights.strengths,
          improvements: sampleData.insights.improvements,
          recommendations: sampleData.insights.recommendations
        },
        eventDistribution: sampleData.eventDistribution
      };
      
      userService.storeUserData(userId, analysisResult);
      
      // Add user session info to response
      const response: AnalyzeResponse = {
        ...sampleData,
        userSession: {
          userId,
          swimmerName: sampleData.swimmer.name
        }
      };

      return NextResponse.json(response);
    }
    
    // If we have real analysis data, use it
    userService.storeUserData(userId, analysis);
    
    // Convert AnalysisResult to AnalyzeResponse format
    const response: AnalyzeResponse = {
      swimmer: {
        name: analysis.swimmer.name,
        age: analysis.swimmer.age,
        totalMeets: analysis.swimmer.totalMeets,
        totalEvents: analysis.swimmer.totalEvents
      },
      performance: {
        bestTimes: analysis.performance.bestTimes.map(bt => ({
          event: bt.event,
          time: bt.time,
          date: bt.date,
          meet: bt.meet,
          courseType: bt.courseType
        })),
        recentTimes: analysis.performance.recentTimes.map(pt => ({
          event: pt.event,
          times: pt.times
        }))
      },
      meetBreakdown: {
        meets: analysis.meetBreakdown.meets.map(meet => ({
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
        currentMeet: analysis.meetBreakdown.currentMeet,
        allTimeImprovements: analysis.meetBreakdown.allTimeImprovements.map(imp => ({
          event: imp.event,
          improvement: imp.improvement,
          date: imp.date
        })),
        ageGroupImprovements: Object.fromEntries(
          Object.entries(analysis.meetBreakdown.ageGroupImprovements).map(([ageGroup, improvements]) => [
            ageGroup,
            improvements.map(imp => ({
              event: imp.event,
              improvement: imp.improvement,
              rank: imp.rank
            }))
          ])
        )
      },
      personalBests: {
        allTime: analysis.personalBests.allTime.map(bt => ({
          event: bt.event,
          time: bt.time,
          date: bt.date,
          meet: bt.meet,
          courseType: bt.courseType
        })),
        byAgeGroup: Object.fromEntries(
          Object.entries(analysis.personalBests.byAgeGroup).map(([ageGroup, bestTimes]) => [
            ageGroup,
            bestTimes.map(bt => ({
              event: bt.event,
              time: bt.time,
              date: bt.date,
              meet: bt.meet,
              courseType: bt.courseType
            }))
          ])
        )
      },
      clubs: analysis.clubs.map(club => ({
        name: club.name,
        location: club.location,
        years: club.years,
        meets: club.meets,
        events: club.events,
        bestTimes: club.bestTimes,
        logo: club.logo
      })),
      summary: {
        totalEvents: analysis.summary.totalEvents,
        totalPoints: analysis.summary.totalPoints,
        averagePlace: analysis.summary.averagePlace
      },
      insights: {
        strengths: analysis.insights.strengths,
        improvements: analysis.insights.improvements,
        recommendations: analysis.insights.recommendations
      },
      eventDistribution: analysis.eventDistribution,
      userSession: {
        userId,
        swimmerName: analysis.swimmer.name
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Analyze POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' } as ErrorResponse,
      { status: 500 }
    );
  }
} 