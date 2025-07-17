# Vercel Deployment Guide

This guide explains how to deploy the USMS Analytics application to Vercel.

## Overview

The application has been restructured to work with Vercel's serverless architecture:

- **Frontend**: React + Vite application deployed as a static site
- **Backend**: Python serverless functions for API endpoints

## Deployment Steps

### 1. Frontend Deployment

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set environment variables:**
   Create a `.env` file in the frontend directory:
   ```
   VITE_API_BASE_URL=https://your-backend-domain.vercel.app
   ```

4. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

### 2. Backend Deployment

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

3. **Set environment variables in Vercel dashboard:**
   - `SECRET_KEY`: A secure random string for session management
   - `VERCEL`: Set to `true`

## API Endpoints

The backend provides the following serverless functions:

- `POST /api/analyze` - Analyze USMS results
- `GET /api/session` - Get session information
- `DELETE /api/session` - Clear session
- `GET /api/data` - Get user data
- `GET /api/health` - Health check

## Important Notes

### Session Management
Since Vercel serverless functions are stateless, session management has been simplified:
- Each request creates a new user session
- Data is stored temporarily for the duration of the request
- For production use, consider implementing a proper database for persistent storage

### CORS Configuration
CORS headers are set in each serverless function to allow cross-origin requests from the frontend.

### Environment Variables
Make sure to set the following environment variables in your Vercel project:
- `VITE_API_BASE_URL` (frontend)
- `SECRET_KEY` (backend)
- `VERCEL` (backend)

## Local Development

For local development, you can still use the original Flask setup:

1. **Start the backend:**
   ```bash
   cd backend
   python app.py
   ```

2. **Start the frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure the frontend environment variable `VITE_API_BASE_URL` points to the correct backend URL.

2. **Import Errors**: The serverless functions use relative imports. Make sure all required modules are available in the backend directory.

3. **Session Issues**: The serverless version doesn't maintain sessions between requests. Each analysis request is independent.

### Debugging

- Check Vercel function logs in the dashboard
- Use the `/api/health` endpoint to verify the backend is running
- Test API endpoints directly using tools like Postman or curl

## Production Considerations

1. **Database**: Consider implementing a proper database (e.g., PostgreSQL, MongoDB) for persistent data storage.

2. **Caching**: Implement caching for frequently accessed data.

3. **Rate Limiting**: Add rate limiting to prevent abuse.

4. **Monitoring**: Set up monitoring and logging for production use.

5. **Security**: Ensure all environment variables are properly secured. 