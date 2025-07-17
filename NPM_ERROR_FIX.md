# Fix for npm package.json Not Found Error

## Error
```
npm error syscall open
npm error path /vercel/path0/client/package.json
npm error errno -2
npm error enoent Could not read package.json: Error: ENOENT: no such file or directory
```

## Root Cause
Vercel cannot find the `client/package.json` file during deployment. This usually happens when:
1. The `client` directory is not being uploaded to Vercel
2. The `.vercelignore` file is excluding necessary files
3. The `vercel.json` configuration is incorrect

## Solutions

### Solution 1: Check .vercelignore
Ensure `.vercelignore` is not excluding the client directory:

```bash
# Make sure these lines are NOT in .vercelignore
client/
!client/
```

### Solution 2: Use Minimal vercel.json
Try using the minimal configuration:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "client/package.json",
      "use": "@vercel/static-build"
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
      "dest": "/client/$1"
    }
  ]
}
```

### Solution 3: Manual Deployment Test
Test if the files are being uploaded correctly:

```bash
# 1. Build locally first
cd client
npm run build
cd ..

# 2. Check if client directory exists
ls -la client/

# 3. Deploy with verbose logging
vercel --debug
```

### Solution 4: Alternative Deployment Structure
If the monorepo structure continues to cause issues, consider:

1. **Deploy frontend separately**:
   ```bash
   cd client
   vercel --prod
   ```

2. **Deploy API separately**:
   ```bash
   # Create a separate API project
   mkdir api-deploy
   cp -r api api-deploy/
   cp -r models api-deploy/
   cp -r services api-deploy/
   cp -r utils api-deploy/
   cp config.py api-deploy/
   cp requirements-vercel.txt api-deploy/
   cd api-deploy
   vercel --prod
   ```

### Solution 5: Check File Permissions
Ensure the client directory and package.json have correct permissions:

```bash
chmod -R 755 client/
chmod 644 client/package.json
```

## Debugging Steps

1. **Check what's being uploaded**:
   ```bash
   vercel --debug
   ```

2. **Verify local structure**:
   ```bash
   ls -la client/package.json
   ```

3. **Test build locally**:
   ```bash
   cd client
   npm run build
   ```

4. **Check Vercel logs**:
   ```bash
   vercel logs
   ```

## Alternative: Deploy as Static Site
If the monorepo approach continues to fail, consider deploying as a static site:

1. Build the frontend locally
2. Upload the `client/dist` contents to Vercel
3. Deploy API functions separately

## Success Indicators
✅ `client/package.json` exists locally  
✅ Build completes without errors  
✅ Vercel can find the package.json file  
✅ No 404 errors after deployment 