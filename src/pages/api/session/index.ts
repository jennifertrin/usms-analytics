import { NextRequest, NextResponse } from 'next/server';
import { SessionResponse, CreateSessionResponse, ErrorResponse } from '../../../types/api';
import { userService } from '../../../lib/userService';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest): Promise<NextResponse<SessionResponse | ErrorResponse>> {
  try {
    const userId = request.headers.get('X-User-ID');
    console.log(`Session GET request - User ID: ${userId}`);
    
    if (!userId) {
      console.log('No user ID provided in session GET request');
      return NextResponse.json(
        { error: 'No user ID provided' } as ErrorResponse,
        { status: 400 }
      );
    }
    
    // Debug current state
    userService.debugState();
    
    const userSession = userService.getUserSessionInfo(userId);
    const userData = userService.getUserData(userId);
    
    console.log(`Session check - Session exists: ${!!userSession}, Data exists: ${!!userData}`);
    
    if (!userSession) {
      console.log(`No session found for ${userId}, returning hasData: false`);
      return NextResponse.json({
        userId,
        hasData: false,
        swimmerName: null,
        newSession: false
      } as SessionResponse);
    }
    
    const response = {
      userId: userSession.userId,
      hasData: !!userData,
      swimmerName: userSession.swimmerName,
      newSession: false
    } as SessionResponse;
    
    console.log(`Session GET response:`, response);
    return NextResponse.json(response);
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
    console.log('Session POST request - Creating new session');
    const userId = userService.createUserSession();
    
    const response = {
      userId,
      newSession: true,
      message: 'Session created successfully'
    } as CreateSessionResponse;
    
    console.log(`Session POST response:`, response);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Session POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' } as ErrorResponse,
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse<{ success: boolean } | ErrorResponse>> {
  try {
    const userId = request.headers.get('X-User-ID');
    console.log(`Session DELETE request - User ID: ${userId}`);
    
    if (!userId) {
      console.log('No user ID provided in session DELETE request');
      return NextResponse.json(
        { error: 'No user ID provided' } as ErrorResponse,
        { status: 400 }
      );
    }
    
    userService.clearUserData(userId);
    console.log(`Session DELETE completed for ${userId}`);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Session DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' } as ErrorResponse,
      { status: 500 }
    );
  }
}