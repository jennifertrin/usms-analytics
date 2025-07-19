import { NextRequest, NextResponse } from 'next/server';
import { SessionResponse, CreateSessionResponse, ErrorResponse } from '@/types/api';
import { userService } from '@/lib/userService';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest): Promise<NextResponse<SessionResponse | ErrorResponse>> {
  try {
    const userId = request.headers.get('X-User-ID');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'No user ID provided' } as ErrorResponse,
        { status: 400 }
      );
    }
    
    const userSession = userService.getUserSessionInfo(userId);
    
    if (!userSession) {
      return NextResponse.json({
        userId,
        hasData: false,
        swimmerName: null,
        newSession: false
      } as SessionResponse);
    }
    
    return NextResponse.json({
      userId: userSession.userId,
      hasData: true,
      swimmerName: userSession.swimmerName,
      newSession: false
    } as SessionResponse);
  } catch (error) {
    console.error('Session GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' } as ErrorResponse,
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<CreateSessionResponse | ErrorResponse>> {
  try {
    const userId = userService.createUserSession();
    
    return NextResponse.json({
      userId,
      message: 'New session created successfully'
    } as CreateSessionResponse);
  } catch (error) {
    console.error('Session POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' } as ErrorResponse,
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse<{ message: string } | ErrorResponse>> {
  try {
    const userId = request.headers.get('X-User-ID');
    
    if (userId) {
      userService.clearUserData(userId);
      return NextResponse.json({ message: 'Session cleared successfully' });
    }
    
    return NextResponse.json({ message: 'No session to clear' });
  } catch (error) {
    console.error('Session DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' } as ErrorResponse,
      { status: 500 }
    );
  }
} 