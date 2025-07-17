# Vercel Deployment Guide - Fixed

## The Issue
The 404 error occurs because Vercel doesn't understand how to serve the monorepo structure. We need to explicitly tell Vercel:
1. Where to find the frontend build
2. How to route API requests
3. How to serve static assets

## Solution

### 1. Correct Vercel Configuration
The `vercel.json` file now properly configures:
- **Frontend**: Built from `client/package.json` → output to `client/dist`
- **API**: Python serverless functions in `api/` directory
- **Routes**: Proper routing for API and static assets

### 2. Deployment Steps

#### Option A: Automated Deployment
```bash
./deploy-vercel.sh
```

#### Option B: Manual Deployment
```bash
# 1. Build the client locally first
cd client
npm run build
cd ..

# 2. Deploy to Vercel
vercel --prod
```

### 3. What Vercel Will Do
1. **Build Frontend**: Run `npm run build` in `client/` directory
2. **Deploy API**: Deploy Python functions from `api/` directory
3. **Serve Static Files**: Serve `client/dist/index.html` for all non-API routes
4. **Route Assets**: Serve CSS/JS files from `client/dist/assets/`

## File Structure for Vercel
```
/
├── client/           # Frontend (React + Vite)
│   ├── package.json  # Frontend dependencies
│   ├── src/         # React source code
│   └── dist/        # Built frontend (generated)
├── api/             # Python serverless functions
│   ├── analyze.py   # POST /api/analyze
│   ├── session.py   # GET/POST/DELETE /api/session
│   ├── data.py      # GET /api/data
│   └── health.py    # GET /api/health
├── vercel.json      # Vercel configuration
└── requirements-vercel.txt # Python dependencies
```

## Expected URLs After Deployment
- **Frontend**: `https://your-app.vercel.app/`
- **API Health**: `https://your-app.vercel.app/api/health`
- **API Session**: `https://your-app.vercel.app/api/session`
- **API Analyze**: `https://your-app.vercel.app/api/analyze`

## Troubleshooting

### If you still get 404:
1. **Check Build Logs**: Look at Vercel build logs for errors
2. **Verify Build Output**: Ensure `client/dist/index.html` exists
3. **Test API**: Try `https://your-app.vercel.app/api/health`
4. **Check Routes**: Verify `vercel.json` routes are correct

### Common Issues:
- **Build Fails**: Check `client/package.json` dependencies
- **API 404**: Ensure Python functions are in `api/` directory
- **Assets 404**: Check that assets are in `client/dist/assets/`

## Environment Variables
Set in Vercel dashboard:
- `SECRET_KEY`: Random string for app security
- `FLASK_DEBUG`: `false` for production
- `VERCEL`: `true`

## Success Indicators
✅ Frontend loads at root URL  
✅ API health endpoint responds  
✅ Session management works  
✅ No 404 errors for assets  
✅ Build completes successfully 