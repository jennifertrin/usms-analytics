# Vercel Deployment Guide

## Overview
This guide explains how to deploy your USMS Analytics app to Vercel with proper CORS configuration.

## Prerequisites
- Vercel account
- Your code pushed to a Git repository (GitHub, GitLab, etc.)

## Deployment Steps

### 1. Connect Your Repository
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Vercel will automatically detect it's a Python project

### 2. Configure Environment Variables

In your Vercel project settings, add these environment variables:

#### For Client (Vite) App:
```
VITE_API_BASE_URL=https://your-app-name.vercel.app
```

#### For Next.js App:
```
NEXT_PUBLIC_API_BASE_URL=https://your-app-name.vercel.app
```

**Important**: Replace `your-app-name` with your actual Vercel app name.

### 3. Build Settings

Vercel should automatically detect your build settings from `vercel.json`, but verify:

- **Framework Preset**: Other
- **Build Command**: `pnpm run vercel-build`
- **Output Directory**: `dist`
- **Install Command**: `pnpm install`

### 4. Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Your app will be available at `https://your-app-name.vercel.app`

## CORS Configuration

The app is configured to allow access from any origin:

### API Level (Python)
Each API endpoint (`/api/analyze`, `/api/data`, `/api/session`, `/api/health`) includes:
```python
self.send_header('Access-Control-Allow-Origin', '*')
self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
self.send_header('Access-Control-Allow-Headers', 'Content-Type, X-User-ID')
```

### Vercel Level
The `vercel.json` configuration adds additional CORS headers for all `/api/*` routes.

## Testing Your Deployment

### 1. Test API Endpoints
```bash
# Health check
curl https://your-app-name.vercel.app/api/health

# Session endpoint
curl https://your-app-name.vercel.app/api/session
```

### 2. Test Frontend
1. Visit `https://your-app-name.vercel.app`
2. Try submitting a USMS link
3. Check browser console for any CORS errors

## Troubleshooting

### CORS Errors
If you still see CORS errors:
1. Verify environment variables are set correctly
2. Check that your frontend is using the correct API base URL
3. Ensure you're not mixing HTTP and HTTPS

### API Not Found
If APIs return 404:
1. Check that your Python files are in the `/api/` directory
2. Verify `vercel.json` has the correct Python build configuration
3. Check build logs for any Python import errors

### Environment Variables Not Working
1. Redeploy after setting environment variables
2. Verify variable names match your code exactly
3. Check that variables are set for the correct environment (Production/Preview)

## Local Development vs Production

### Local Development
- API runs on `http://localhost:5000`
- Frontend connects to local API
- Use `npm run dev` or `pnpm dev`

### Production (Vercel)
- API runs on `https://your-app-name.vercel.app/api/`
- Frontend connects to Vercel API
- Environment variables control the API base URL

## Security Considerations

The current CORS configuration allows access from any origin (`*`). For production use, consider:

1. **Restricting origins** to specific domains
2. **Adding authentication** if needed
3. **Rate limiting** to prevent abuse

To restrict origins, update the CORS headers in your API files:
```python
# Instead of '*', specify allowed origins
self.send_header('Access-Control-Allow-Origin', 'https://your-domain.com')
```

## Support

If you encounter issues:
1. Check Vercel build logs
2. Verify environment variables
3. Test API endpoints directly
4. Check browser console for errors 