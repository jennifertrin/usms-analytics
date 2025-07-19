import { NextRequest, NextResponse } from 'next/server';
import { AnalyzeResponse, ErrorResponse } from '../../../types/api';
import { getSampleData } from '../../../lib/sampleData';

export async function GET(request: NextRequest): Promise<NextResponse<AnalyzeResponse | ErrorResponse>> {
  try {
    const sampleData = getSampleData();
    return NextResponse.json(sampleData);
  } catch (error) {
    console.error('Sample data GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' } as ErrorResponse,
      { status: 500 }
    );
  }
} 