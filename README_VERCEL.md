# USMS Analytics - Vercel Deployment

## Quick Deploy

```bash
# Run the deployment script
./deploy-vercel.sh
```

## What's Changed for Vercel

### ✅ Session Management
- **Before**: Flask sessions with filesystem storage
- **After**: Header-based sessions using `X-User-ID`

### ✅ Build Configuration
- Single `vercel.json` handles both frontend and backend
- Proper monorepo structure support
- Function timeouts configured (30s max)

### ✅ API Endpoints
- All endpoints support `X-User-ID` header
- CORS headers updated for custom headers
- Stateless serverless functions

## Session Flow

1. **Client** calls `/api/session` (POST) → gets `user_id`
2. **Client** stores `user_id` in localStorage
3. **Client** includes `X-User-ID: {user_id}` in all API calls
4. **Server** uses `user_id` to retrieve/store data

## Client Usage

```typescript
import { sessionManager } from './utils/sessionManager';

// Get or create session
const userId = await sessionManager.getSession();

// Make authenticated request
const data = await sessionManager.authenticatedRequest('/api/analyze', {
  method: 'POST',
  body: JSON.stringify({ usmsLink: '...' })
});
```

## Environment Variables

Set in Vercel dashboard:
- `SECRET_KEY`: Random string for app security
- `FLASK_DEBUG`: `false` for production
- `VERCEL`: `true`

## Limitations

⚠️ **Important**: Current implementation uses in-memory storage. User data will be lost when functions restart.

**For Production**: Consider adding:
- Redis for session storage
- Database for user data persistence
- JWT tokens for authentication

## File Structure

```
/
├── api/                    # Serverless functions
│   ├── analyze.py         # Performance analysis
│   ├── data.py           # Data retrieval
│   ├── health.py         # Health check
│   └── session.py        # Session management
├── client/                # React frontend
├── services/              # Business logic
├── models/               # Data models
├── vercel.json          # Vercel config
└── requirements-vercel.txt # Python deps
```

## Troubleshooting

- **Import errors**: Check `requirements-vercel.txt`
- **CORS errors**: Verify `X-User-ID` header
- **Session issues**: Check localStorage implementation
- **Build failures**: Verify `vercel.json` paths

## Full Documentation

See `VERCEL_DEPLOYMENT.md` for detailed deployment guide. 