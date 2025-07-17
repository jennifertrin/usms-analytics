# Vercel Deployment Guide (Restructured)

This guide explains how to deploy the restructured USMS Analytics application to Vercel.

## Overview

The application has been restructured for simplified Vercel deployment:

- **Single Repository**: Both frontend and backend in one repository
- **Root-level Configuration**: Single `vercel.json` handles both frontend and API
- **Simplified Deployment**: One command deploys everything

## Project Structure

```
usms-analytics/
├── src/                 # React frontend source code
├── public/              # Static assets
├── api/                 # Python serverless functions
├── services/            # Backend business logic
├── models/              # Data models
├── utils/               # Utility functions
├── package.json         # Frontend dependencies and scripts
├── vite.config.ts       # Vite configuration
├── vercel.json          # Vercel configuration (handles both frontend and API)
└── requirements-vercel.txt # Python dependencies
```

## Deployment Steps

### Quick Deploy

1. **Run the deployment script:**
   ```bash
   ./deploy.sh
   ```

### Manual Deployment

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

3. **Set environment variables in Vercel dashboard:**
   - `SECRET_KEY`: A secure random string for session management
   - `VERCEL`: Set to `true`

## Configuration

### Vercel Configuration (vercel.json)

The `vercel.json` file handles both frontend and backend:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "api/*.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "outputDirectory": "dist"
}
```

### Environment Variables

Set these in your Vercel project dashboard:

- `SECRET_KEY`: Secure random string for session management
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

### Build Process
- Frontend: Vite builds the React app to `dist/`
- Backend: Python serverless functions are deployed from `api/`

## Local Development

For local development, you can still use the original setup:

1. **Start the backend (from backend directory):**
   ```bash
   cd backend
   python app.py
   ```

2. **Start the frontend (from root directory):**
   ```bash
   npm run dev
   ```

## Troubleshooting

### Common Issues

1. **Build Errors**: Make sure all dependencies are installed with `npm install`

2. **Import Errors**: The serverless functions use relative imports. Make sure all required modules are available.

3. **CORS Errors**: CORS is configured in each serverless function. No additional configuration needed.

4. **Session Issues**: The serverless version doesn't maintain sessions between requests. Each analysis request is independent.

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

## Migration from Previous Structure

If you're migrating from the previous frontend/backend structure:

1. **Backup your data** if needed
2. **Update any custom configurations** to work with the new structure
3. **Test the deployment** with the new structure
4. **Update any CI/CD pipelines** to work with the new structure

## Benefits of New Structure

1. **Simplified Deployment**: One command deploys everything
2. **Better Organization**: Clear separation of concerns
3. **Easier Maintenance**: Single repository to manage
4. **Reduced Complexity**: No need to manage multiple deployments 