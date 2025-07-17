# Vercel Deployment Troubleshooting

## Common Issues and Solutions

### 1. Rollup Dependency Error
**Error**: `Cannot find module @rollup/rollup-linux-x64-gnu`

**Solution**: This is a known npm bug with optional dependencies. We've implemented several fixes:

#### Fix 1: Use Legacy Peer Dependencies
```bash
npm install --legacy-peer-deps
```

#### Fix 2: Override Optional Dependencies
Added to `client/package.json`:
```json
{
  "overrides": {
    "rollup": {
      "optionalDependencies": {}
    }
  }
}
```

#### Fix 3: Custom Build Script
Use `npm run build:vercel` which includes the legacy peer deps flag.

### 2. Build Configuration Issues

#### Problem: Conflicting functions and builds configuration
**Error**: `Conflicting functions and builds configuration`

**Solution**: Use consistent configuration format. Don't mix `builds` and `functions` sections:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "client/dist",
        "nodeVersion": "18.x",
        "installCommand": "cd client && npm install --legacy-peer-deps --production=false",
        "buildCommand": "cd client && npm run build:vercel"
      }
    },
    {
      "src": "api/*.py",
      "use": "@vercel/python",
      "config": {
        "runtime": "python3.9",
        "maxDuration": 30
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/client/$1"
    }
  ]
}
```

#### Problem: Wrong distDir Path
**Error**: Build succeeds but files not found

**Solution**: Ensure `vercel.json` has correct paths as shown above.

### 3. Python Dependencies

#### Problem: Missing Python packages
**Error**: Import errors in serverless functions

**Solution**: Ensure all dependencies are in `requirements-vercel.txt`:
```
requests>=2.31.0
beautifulsoup4>=4.12.0
pandas>=2.2.0
numpy>=1.26.0
python-dotenv>=1.0.0
flask>=3.0.0
flask-cors>=4.0.0
redis>=5.0.0
```

### 4. Environment Variables

#### Problem: Missing environment variables
**Error**: Application fails to start

**Solution**: Set these in Vercel dashboard:
- `SECRET_KEY`: Random string for app security
- `FLASK_DEBUG`: `false` for production
- `VERCEL`: `true`

### 5. CORS Issues

#### Problem: CORS errors in browser
**Error**: `Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**Solution**: Ensure API functions include proper CORS headers:
```python
self.send_header('Access-Control-Allow-Origin', '*')
self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
self.send_header('Access-Control-Allow-Headers', 'Content-Type, X-User-ID')
```

### 6. Session Management Issues

#### Problem: Session not persisting
**Error**: User data lost between requests

**Solution**: This is expected behavior in serverless functions. Use the header-based session management:
- Client stores `user_id` in localStorage
- Include `X-User-ID` header in all API calls
- Server uses `user_id` to retrieve/store data

## Deployment Steps

### 1. Pre-deployment Checklist
- [ ] All Python dependencies in `requirements-vercel.txt`
- [ ] `vercel.json` has correct configuration
- [ ] Environment variables set in Vercel dashboard
- [ ] `.vercelignore` excludes unnecessary files

### 2. Deploy Command
```bash
# Use the automated script
./deploy-vercel.sh

# Or manual deployment
vercel --prod
```

### 3. Post-deployment Verification
- [ ] Health endpoint works: `https://your-app.vercel.app/api/health`
- [ ] Frontend loads without errors
- [ ] API endpoints respond correctly
- [ ] Session management works

## Debugging Commands

### Check Build Logs
```bash
# View Vercel function logs
vercel logs

# View specific function logs
vercel logs --function=api/analyze
```

### Test API Endpoints
```bash
# Health check
curl https://your-app.vercel.app/api/health

# Create session
curl -X POST https://your-app.vercel.app/api/session

# Test with user ID
curl -H "X-User-ID: your-user-id" https://your-app.vercel.app/api/session
```

### Local Testing
```bash
# Test client build locally
cd client
npm run build:vercel

# Test serverless functions locally
vercel dev
```

## Performance Optimization

### 1. Bundle Size
- Use tree-shaking in Vite config
- Split vendor chunks
- Optimize images and assets

### 2. Function Optimization
- Keep functions lightweight
- Avoid heavy computations
- Use caching where possible

### 3. Cold Start Reduction
- Minimize dependencies
- Use function warm-up strategies
- Consider edge functions for simple operations

## Common Error Messages

### `Module not found`
- Check import paths in Python functions
- Ensure all dependencies are installed
- Verify file structure matches imports

### `Function timeout`
- Increase `maxDuration` in `vercel.json`
- Optimize function performance
- Consider breaking into smaller functions

### `Build failed`
- Check build logs for specific errors
- Verify Node.js version compatibility
- Ensure all required files are present

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Python Runtime](https://vercel.com/docs/functions/serverless-functions/runtimes/python)
- [Vercel Build Configuration](https://vercel.com/docs/build-step)
- [npm Optional Dependencies](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#optionaldependencies) 