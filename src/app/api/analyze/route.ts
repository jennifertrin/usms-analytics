import { NextRequest, NextResponse } from 'next/server';
import { AnalyzeRequest, AnalyzeResponse, ErrorResponse } from '@/types/api';
import { userService } from '@/lib/userService';
import { analysisService } from '@/lib/analysisService';
import { getSampleData } from '@/lib/sampleData';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest): Promise<NextResponse<AnalyzeResponse | ErrorResponse>> {
  console.log('=== API Route Called ===');
  
  try {
    // Validate request has proper content type
    const contentType = request.headers.get('content-type');
    console.log('Content-Type:', contentType);
    
    if (!contentType?.includes('application/json')) {
      console.log('Invalid content type, returning error');
      return NextResponse.json(
        { error: 'Content-Type must be application/json' } as ErrorResponse,
        { status: 400 }
      );
    }

    // Get user ID from headers (Vercel-compatible session management)
    let userId = request.headers.get('X-User-ID');
    console.log('User ID from header:', userId);
    
    if (!userId) {
      userId = userService.createUserSession();
      console.log('Created new user session:', userId);
    } else {
      // Ensure session exists for this user ID
      const existingSession = userService.getUserSessionInfo(userId);
      if (!existingSession) {
        userService.createUserSession(userId);
        console.log('Created session for existing user ID:', userId);
      }
    }
    
    // Safely parse request body
    let body;
    try {
      const rawBody = await request.text();
      console.log('Raw request body:', rawBody);
      
      if (!rawBody.trim()) {
        console.log('Empty request body');
        return NextResponse.json(
          { error: 'Request body is empty' } as ErrorResponse,
          { status: 400 }
        );
      }
      
      body = JSON.parse(rawBody);
      console.log('Parsed body:', body);
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' } as ErrorResponse,
        { status: 400 }
      );
    }

    const { usmsLink }: AnalyzeRequest = body;
    console.log('USMS Link:', usmsLink);
    
    if (!usmsLink) {
      console.log('No USMS link provided');
      return NextResponse.json(
        { error: 'USMS link is required' } as ErrorResponse,
        { status: 400 }
      );
    }

    console.log('Starting analysis for user:', userId);

    // Try to scrape and analyze the USMS results
    let analysis;
    try {
      console.log('Calling analysis service...');
      analysis = await analysisService.analyzeUSMSResults(usmsLink);
      console.log('Analysis result:', analysis ? 'Success' : 'Failed/Null');
    } catch (analysisError) {
      console.error('Analysis service error:', analysisError);
      analysis = null;
    }
    
    // Always use sample data for now to isolate the issue
    console.log('Using sample data for response');
    
    let sampleData;
    try {
      sampleData = getSampleData();
      console.log('Sample data retrieved successfully');
    } catch (sampleError) {
      console.error('Error getting sample data:', sampleError);
      return NextResponse.json(
        { error: 'Error retrieving sample data' } as ErrorResponse,
        { status: 500 }
      );
    }
    
    // Create minimal response first
    const minimalResponse: AnalyzeResponse = {
      swimmer: {
        name: 'Test Swimmer',
        age: 18,
        totalMeets: 5,
        totalEvents: 20
      },
      performance: {
        bestTimes: [],
        recentTimes: []
      },
      meetBreakdown: {
        meets: [],
        currentMeet: null,
        allTimeImprovements: [],
        ageGroupImprovements: {}
      },
      personalBests: {
        allTime: [],
        byAgeGroup: {}
      },
      clubs: [],
      summary: {
        totalEvents: 0,
        totalPoints: 0,
        averagePlace: 0
      },
      insights: {
        strengths: [],
        improvements: [],
        recommendations: []
      },
      eventDistribution: {},
      userSession: {
        userId,
        swimmerName: 'Test Swimmer'
      }
    };

    console.log('Created minimal response');
    
    // Try to store minimal data
    try {
      console.log('Storing minimal data...');
      userService.storeUserData(userId, {
        swimmer: minimalResponse.swimmer,
        performance: minimalResponse.performance,
        meetBreakdown: minimalResponse.meetBreakdown,
        personalBests: minimalResponse.personalBests,
        clubs: minimalResponse.clubs,
        summary: minimalResponse.summary,
        insights: minimalResponse.insights,
        eventDistribution: minimalResponse.eventDistribution
      });
      console.log('Data stored successfully');
    } catch (storageError) {
      console.error('Error storing data:', storageError);
      // Continue anyway
    }

    console.log('Returning response...');
    
    // Convert to JSON string to check size
    const responseJson = JSON.stringify(minimalResponse);
    console.log('Response JSON length:', responseJson.length);
    console.log('Response JSON preview:', responseJson.substring(0, 200) + '...');
    
    return NextResponse.json(minimalResponse);

  } catch (error) {
    console.error('=== CRITICAL ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Return a very simple error response
    try {
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    } catch (responseError) {
      console.error('Error creating error response:', responseError);
      // Last resort - return a basic Response
      return new Response('Internal server error', { status: 500 });
    }
  }
}