import { NextRequest, NextResponse } from 'next/server';
import { ActiveUsersResponse, ErrorResponse } from '@/types/api';
import { userService } from '@/lib/userService';

export async function GET(request: NextRequest): Promise<NextResponse<ActiveUsersResponse | ErrorResponse>> {
  try {
    const response: ActiveUsersResponse = {
      activeUsers: userService.getActiveUsersCount(),
      totalSessions: userService.getTotalSessionsCount()
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Active users GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' } as ErrorResponse,
      { status: 500 }
    );
  }
} 