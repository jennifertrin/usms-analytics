# Vercel Deployment Guide

## Overview

This guide explains how to deploy the USMS Analytics application to Vercel, including the necessary optimizations for serverless architecture.

## Key Changes Made for Vercel

### 1. Session Management
**Problem**: Flask sessions with filesystem storage don't work on Vercel's serverless functions.

**Solution**: Implemented header-based session management using `X-User-ID` headers.

### 2. Build Configuration
- Updated `vercel.json` to handle monorepo structure
- Configured proper build paths for frontend and backend
- Set function timeouts and runtime settings

### 3. API Endpoints
- All API endpoints now support `X-User-ID` header for session management
- Removed Flask session dependencies
- Updated CORS headers to include custom headers

## Deployment Steps

### 1. Environment Setup

Create a `.env` file in the root directory:
```bash
SECRET_KEY=your-secret-key-here
FLASK_DEBUG=false
VERCEL=true
```

### 2. Install Vercel CLI
```bash
npm install -g vercel
```

### 3. Deploy to Vercel
```bash
# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### 4. Environment Variables
Set these in your Vercel dashboard:
- `SECRET_KEY`: Your application secret key
- `FLASK_DEBUG`: Set to `false` for production
- `VERCEL`: Set to `true`

## Session Management

### How It Works
1. Client calls `/api/session` to get a new user ID
2. Client stores the user ID locally (localStorage, sessionStorage, etc.)
3. Client includes `X-User-ID` header in all subsequent API calls
4. Server uses the user ID to retrieve/store user data

### Client Implementation
```javascript
// Get or create session
async function getSession() {
  let userId = localStorage.getItem('userId');
  
  if (!userId) {
    const response = await fetch('/api/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    userId = data.user_id;
    localStorage.setItem('userId', userId);
  }
  
  return userId;
}

// Make API calls with session
async function analyzePerformance(usmsLink) {
  const userId = await getSession();
  
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-User-ID': userId
    },
    body: JSON.stringify({ usmsLink })
  });
  
  return response.json();
}
```

## Limitations and Considerations

### 1. Stateless Architecture
- Each serverless function invocation is independent
- No persistent memory between requests
- User data is stored in-memory (will be lost on function restart)

### 2. Production Recommendations
For production use, consider implementing:
- **Redis**: For persistent session storage
- **Database**: For user data persistence
- **JWT Tokens**: For stateless authentication

### 3. Function Timeouts
- Default timeout: 10 seconds
- Maximum timeout: 30 seconds (configured in vercel.json)
- Long-running operations may timeout

### 4. Cold Starts
- First request to each function may be slower
- Consider implementing warm-up strategies

## File Structure
```
/
├── api/                    # Vercel serverless functions
│   ├── analyze.py         # Performance analysis
│   ├── data.py           # Data retrieval
│   ├── health.py         # Health check
│   └── session.py        # Session management
├── client/                # React frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── services/              # Business logic
├── models/               # Data models
├── utils/                # Utilities
├── vercel.json          # Vercel configuration
├── requirements-vercel.txt # Python dependencies
└── README.md
```

## Troubleshooting

### Common Issues

1. **Import Errors**
   - Ensure all Python dependencies are in `requirements-vercel.txt`
   - Check import paths in API functions

2. **CORS Errors**
   - Verify CORS headers in API responses
   - Check client-side request headers

3. **Session Issues**
   - Ensure client sends `X-User-ID` header
   - Check localStorage/sessionStorage implementation

4. **Build Failures**
   - Verify `vercel.json` configuration
   - Check build paths and dependencies

### Debugging
- Use Vercel dashboard to view function logs
- Check browser developer tools for client-side errors
- Monitor function execution times and memory usage

## Performance Optimization

1. **Bundle Size**
   - Minimize Python dependencies
   - Use tree-shaking for frontend

2. **Function Optimization**
   - Keep functions lightweight
   - Avoid heavy computations in serverless functions

3. **Caching**
   - Implement client-side caching
   - Consider CDN for static assets

## Security Considerations

1. **Environment Variables**
   - Never commit secrets to version control
   - Use Vercel's environment variable system

2. **Input Validation**
   - Validate all user inputs
   - Sanitize USMS links

3. **Rate Limiting**
   - Consider implementing rate limiting
   - Monitor API usage

## Monitoring

1. **Vercel Analytics**
   - Monitor function performance
   - Track error rates

2. **Custom Logging**
   - Add structured logging to API functions
   - Monitor user session patterns

## Future Improvements

1. **Database Integration**
   - Add persistent storage for user data
   - Implement proper user management

2. **Authentication**
   - Add user authentication system
   - Implement JWT tokens

3. **Caching Layer**
   - Add Redis for session storage
   - Implement result caching

4. **API Versioning**
   - Implement API versioning strategy
   - Add backward compatibility 