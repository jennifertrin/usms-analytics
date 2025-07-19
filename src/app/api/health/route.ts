import { NextRequest, NextResponse } from 'next/server';
import { HealthResponse, ErrorResponse } from '../../../types/api';

export async function GET(request: NextRequest): Promise<NextResponse<HealthResponse | ErrorResponse>> {
  try {
    const response: HealthResponse = {
      status: 'healthy',
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' } as ErrorResponse,
      { status: 500 }
    );
  }
} 