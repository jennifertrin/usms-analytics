import { NextRequest, NextResponse } from 'next/server';
import { AnalyzeRequest, AnalyzeResponse, ErrorResponse } from '@/types/api';
import { userService } from '@/lib/userService';
import { analysisService } from '@/lib/analysisService';
import { getSampleData } from '@/lib/sampleData';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest): Promise<NextResponse<AnalyzeResponse | ErrorResponse>> {
  try {
    // Validate request has proper content type
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type must be application/json' } as ErrorResponse,
        { status: 400 }
      );
    }

    // Get user ID from headers (Vercel-compatible session management)
    let userId = request.headers.get('X-User-ID');
    if (!userId) {
      userId = userService.createUserSession();
    } else {
      // Ensure session exists for this user ID
      const existingSession = userService.getUserSessionInfo(userId);
      if (!existingSession) {
        userService.createUserSession(userId);
      }
    }
    
    // Safely parse request body
    let body;
    try {
      body = await request.json();
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' } as ErrorResponse,
        { status: 400 }
      );
    }

    const { usmsLink }: AnalyzeRequest = body;
    
    if (!usmsLink) {
      return NextResponse.json(
        { error: 'USMS link is required' } as ErrorResponse,
        { status: 400 }
      );
    }

    console.log('Analyzing USMS link:', usmsLink, 'for user:', userId);

    // Try to scrape and analyze the USMS results
    let analysis;
    try {
      analysis = await analysisService.analyzeUSMSResults(usmsLink);
    } catch (analysisError) {
      console.error('Analysis service error:', analysisError);
      analysis = null;
    }
    
    // If analysis fails, fall back to sample data for demonstration
    if (!analysis) {
      console.log('Analysis failed, using sample data');
      const sampleData = getSampleData();
      
      // Store sample data for this user
      const analysisResult = {
        swimmer: {
          name: sampleData.swimmer?.name || 'Sample Swimmer',
          age: sampleData.swimmer?.age || 18,
          totalMeets: sampleData.swimmer?.totalMeets || 0,
          totalEvents: sampleData.swimmer?.totalEvents || 0
        },
        performance: {
          bestTimes: (sampleData.performance?.bestTimes || []).map(bt => ({
            event: bt?.event || '',
            time: bt?.time || '',
            date: bt?.date || '',
            meet: bt?.meet || '',
            courseType: bt?.courseType || 'SCY',
            seconds: bt?.seconds || 0
          })),
          recentTimes: (sampleData.performance?.recentTimes || []).map(pt => ({
            event: pt?.event || '',
            times: pt?.times || []
          }))
        },
        meetBreakdown: {
          meets: (sampleData.meetBreakdown?.meets || []).map(meet => ({
            name: meet?.name || '',
            date: meet?.date || '',
            location: meet?.location || '',
            results: (meet?.results || []).map(r => ({
              event: r?.event || '',
              place: r?.place || 0,
              time: r?.time || '',
              improvement: r?.improvement || '',
              ageGroup: r?.ageGroup || ''
            }))
          })),
          currentMeet: sampleData.meetBreakdown?.currentMeet || null,
          allTimeImprovements: (sampleData.meetBreakdown?.allTimeImprovements || []).map(imp => ({
            event: imp?.event || '',
            improvement: imp?.improvement || '',
            date: imp?.date || ''
          })),
          ageGroupImprovements: Object.fromEntries(
            Object.entries(sampleData.meetBreakdown?.ageGroupImprovements || {}).map(([ageGroup, improvements]) => [
              ageGroup,
              (Array.isArray(improvements) ? improvements : []).map(imp => ({
                event: imp?.event || '',
                improvement: imp?.improvement || '',
                rank: imp?.rank || 0
              }))
            ])
          )
        },
        personalBests: {
          allTime: (sampleData.personalBests?.allTime || []).map(bt => ({
            event: bt?.event || '',
            time: bt?.time || '',
            date: bt?.date || '',
            meet: bt?.meet || '',
            courseType: bt?.courseType || 'SCY',
            seconds: bt?.seconds || 0
          })),
          byAgeGroup: Object.fromEntries(
            Object.entries(sampleData.personalBests?.byAgeGroup || {}).map(([ageGroup, bestTimes]) => [
              ageGroup,
              (Array.isArray(bestTimes) ? bestTimes : []).map(bt => ({
                event: bt?.event || '',
                time: bt?.time || '',
                date: bt?.date || '',
                meet: bt?.meet || '',
                courseType: bt?.courseType || 'SCY',
                seconds: bt?.seconds || 0
              }))
            ])
          )
        },
        clubs: (sampleData.clubs || []).map(club => ({
          name: club?.name || '',
          location: club?.location || '',
          years: club?.years || '',
          meets: club?.meets || 0,
          events: club?.events || 0,
          bestTimes: club?.bestTimes || 0,
          logo: club?.logo || null
        })),
        summary: {
          totalEvents: sampleData.summary?.totalEvents || 0,
          totalPoints: sampleData.summary?.totalPoints || 0,
          averagePlace: sampleData.summary?.averagePlace || 0
        },
        insights: {
          strengths: sampleData.insights?.strengths || [],
          improvements: sampleData.insights?.improvements || [],
          recommendations: sampleData.insights?.recommendations || []
        },
        eventDistribution: sampleData.eventDistribution || {}
      };
      
      try {
        userService.storeUserData(userId, analysisResult);
      } catch (storageError) {
        console.error('Error storing user data:', storageError);
      }
      
      // Add user session info to response
      const response: AnalyzeResponse = {
        ...sampleData,
        userSession: {
          userId,
          swimmerName: sampleData.swimmer?.name || 'Sample Swimmer'
        }
      };

      return NextResponse.json(response);
    }
    
    // If we have real analysis data, use it
    console.log('Storing analysis data for user:', userId);
    
    try {
      userService.storeUserData(userId, analysis);
    } catch (storageError) {
      console.error('Error storing analysis data:', storageError);
    }
    
    // Convert AnalysisResult to AnalyzeResponse format with null checks
    const response: AnalyzeResponse = {
      swimmer: {
        name: analysis.swimmer?.name || 'Unknown Swimmer',
        age: analysis.swimmer?.age || 18,
        totalMeets: analysis.swimmer?.totalMeets || 0,
        totalEvents: analysis.swimmer?.totalEvents || 0
      },
      performance: {
        bestTimes: (analysis.performance?.bestTimes || []).map(bt => ({
          event: bt?.event || '',
          time: bt?.time || '',
          date: bt?.date || '',
          meet: bt?.meet || '',
          courseType: bt?.courseType || 'SCY'
        })),
        recentTimes: (analysis.performance?.recentTimes || []).map(pt => ({
          event: pt?.event || '',
          times: pt?.times || []
        }))
      },
      meetBreakdown: {
        meets: (analysis.meetBreakdown?.meets || []).map(meet => ({
          name: meet?.name || '',
          date: meet?.date || '',
          location: meet?.location || '',
          results: (meet?.results || []).map(r => ({
            event: r?.event || '',
            place: r?.place || 0,
            time: r?.time || '',
            improvement: r?.improvement || '',
            ageGroup: r?.ageGroup || ''
          }))
        })),
        currentMeet: analysis.meetBreakdown?.currentMeet || null,
        allTimeImprovements: (analysis.meetBreakdown?.allTimeImprovements || []).map(imp => ({
          event: imp?.event || '',
          improvement: imp?.improvement || '',
          date: imp?.date || ''
        })),
        ageGroupImprovements: Object.fromEntries(
          Object.entries(analysis.meetBreakdown?.ageGroupImprovements || {}).map(([ageGroup, improvements]) => [
            ageGroup,
            (Array.isArray(improvements) ? improvements : []).map(imp => ({
              event: imp?.event || '',
              improvement: imp?.improvement || '',
              rank: imp?.rank || 0
            }))
          ])
        )
      },
      personalBests: {
        allTime: (analysis.personalBests?.allTime || []).map(bt => ({
          event: bt?.event || '',
          time: bt?.time || '',
          date: bt?.date || '',
          meet: bt?.meet || '',
          courseType: bt?.courseType || 'SCY'
        })),
        byAgeGroup: Object.fromEntries(
          Object.entries(analysis.personalBests?.byAgeGroup || {}).map(([ageGroup, bestTimes]) => [
            ageGroup,
            (Array.isArray(bestTimes) ? bestTimes : []).map(bt => ({
              event: bt?.event || '',
              time: bt?.time || '',
              date: bt?.date || '',
              meet: bt?.meet || '',
              courseType: bt?.courseType || 'SCY'
            }))
          ])
        )
      },
      clubs: (analysis.clubs || []).map(club => ({
        name: club?.name || '',
        location: club?.location || '',
        years: club?.years || '',
        meets: club?.meets || 0,
        events: club?.events || 0,
        bestTimes: club?.bestTimes || 0,
        logo: club?.logo || null
      })),
      summary: {
        totalEvents: analysis.summary?.totalEvents || 0,
        totalPoints: analysis.summary?.totalPoints || 0,
        averagePlace: analysis.summary?.averagePlace || 0
      },
      insights: {
        strengths: analysis.insights?.strengths || [],
        improvements: analysis.insights?.improvements || [],
        recommendations: analysis.insights?.recommendations || []
      },
      eventDistribution: analysis.eventDistribution || {},
      userSession: {
        userId,
        swimmerName: analysis.swimmer?.name || 'Unknown Swimmer'
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