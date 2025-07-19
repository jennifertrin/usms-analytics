# Flask to Next.js API Conversion

This document outlines the conversion of Flask APIs to Next.js API routes for Vercel deployment.

## Overview

The Flask APIs have been successfully converted to Next.js API routes while maintaining:
- Same endpoint structure (`/api/health`, `/api/analyze`, etc.)
- All business logic and data structures
- Proper request method handling (GET, POST, DELETE)
- Error handling and status codes
- Session management functionality

## API Endpoints

### `/api/health` (GET)
- **Purpose**: Health check endpoint
- **Response**: `{ status: string, timestamp: string }`
- **Status Codes**: 200 (success), 500 (error)

### `/api/session` (GET, POST, DELETE)
- **GET**: Retrieve current user session information
- **POST**: Create a new user session
- **DELETE**: Clear current user session and data
- **Headers**: `X-User-ID` (for GET/DELETE)
- **Response**: Session information or success message

### `/api/analyze` (POST)
- **Purpose**: Analyze USMS results from provided URL
- **Request Body**: `{ usmsLink: string }`
- **Headers**: `X-User-ID` (optional, auto-created if missing)
- **Response**: Complete analysis result with user session info
- **Status Codes**: 200 (success), 400 (bad request), 500 (error)

### `/api/data` (GET)
- **Purpose**: Get stored analysis data for current user
- **Headers**: `X-User-ID` (required)
- **Response**: Stored analysis data
- **Status Codes**: 200 (success), 400 (no user ID), 404 (no data), 500 (error)

### `/api/sample-data` (GET)
- **Purpose**: Get sample data for testing
- **Response**: Complete sample analysis data
- **Status Codes**: 200 (success), 500 (error)

### `/api/users/active` (GET)
- **Purpose**: Get count of active users (admin/monitoring)
- **Response**: `{ activeUsers: number, totalSessions: number }`
- **Status Codes**: 200 (success), 500 (error)

## TypeScript Interfaces

All Python data models have been converted to TypeScript interfaces in `src/types/api.ts`:

- `SwimmerInfo`, `MeetInfo`, `SwimResult`
- `BestTime`, `PerformanceTrend`, `MeetResult`
- `Improvement`, `AgeGroupImprovement`, `ClubInfo`
- `PerformanceInsights`, `PerformanceSummary`
- `SwimmerPerformance`, `PerformanceData`
- `MeetData`, `MeetBreakdown`, `PersonalBests`
- `AnalysisResult`, `UserSession`, `ScrapedData`
- API Request/Response interfaces

## Services

### UserService (`src/lib/userService.ts`)
- In-memory session management (replace with database in production)
- User session creation, retrieval, and cleanup
- User data storage and retrieval
- Active user statistics

### AnalysisService (`src/lib/analysisService.ts`)
- Placeholder for Python scraper/analyzer integration
- Methods for scraping USMS results and analyzing performance
- Ready for integration with Python services

### SampleData (`src/lib/sampleData.ts`)
- Complete sample data matching the Flask API response
- Used for testing and demonstration purposes

## Session Management

The API uses a Vercel-compatible session management approach:
- User IDs are passed via `X-User-ID` header
- Sessions are auto-created if not provided
- In-memory storage (replace with database for production)
- Session data includes swimmer name and analysis results

## Error Handling

All endpoints include proper error handling:
- Input validation (missing required fields)
- User session validation
- Internal server error handling
- Consistent error response format: `{ error: string }`

## Deployment Considerations

### For Vercel Deployment:
1. **Database**: Replace in-memory storage with a database (e.g., PostgreSQL, MongoDB)
2. **Python Integration**: Implement the Python scraper/analyzer integration in `AnalysisService`
3. **Environment Variables**: Configure any necessary API keys or database connections
4. **CORS**: Configure CORS if needed for cross-origin requests

### Python Service Integration Options:
1. **Separate API Service**: Deploy Python services separately and call via HTTP
2. **Serverless Functions**: Use Vercel serverless functions with Python runtime
3. **External APIs**: Use existing Python APIs if available

## Testing

The API can be tested using:
- Sample data endpoint: `GET /api/sample-data`
- Health check: `GET /api/health`
- Session management: `POST /api/session`, `GET /api/session`, `DELETE /api/session`
- Analysis (with sample data): `POST /api/analyze` with any USMS link

## Migration Notes

- All Flask route handlers converted to Next.js API route handlers
- Python data models converted to TypeScript interfaces
- Session management adapted for Vercel deployment
- Error handling maintained with proper HTTP status codes
- Business logic preserved and ready for Python service integration 