# Vercel Build Fix - Next.js Deployment

## 🚨 Problem Identified

Vercel is still trying to build the **old `client` directory** (Vite/React) instead of the **new Next.js app**. This is causing the TypeScript error:

```
./client/src/main.tsx:3:17
Type error: An import path can only end with a '.tsx' extension when 'allowImportingTsExtensions' is enabled.
```

## ✅ Solution Applied

### 1. **Updated `.vercelignore`**
Added exclusions for old directories:
```
# Old client directory (replaced by Next.js)
client/

# Old server directory (replaced by Next.js API routes)
server/

# Old API directory (replaced by Next.js API routes)
api/

# Old build artifacts
dist/
build/
```

### 2. **Enhanced `vercel.json`**
Made Next.js configuration more explicit:
```json
{
  "version": 2,
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "outputDirectory": ".next",
  "functions": {
    "src/app/api/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  }
}
```

### 3. **Created Deployment Script**
`deploy-nextjs.sh` - Ensures clean Next.js build

## 🚀 How to Fix

### Option 1: Use the Deployment Script (Recommended)

```bash
# Run the deployment script
./deploy-nextjs.sh

# Commit and push
git add .
git commit -m "Fix Vercel build - use Next.js instead of old client"
git push
```

### Option 2: Manual Fix

1. **Clean up old files:**
   ```bash
   rm -rf .next dist build
   rm -f pnpm-lock.yaml yarn.lock
   ```

2. **Install and build:**
   ```bash
   npm install
   npm run build
   ```

3. **Verify build:**
   ```bash
   ls -la .next/
   ```

4. **Commit and push:**
   ```bash
   git add .
   git commit -m "Fix Vercel build - use Next.js instead of old client"
   git push
   ```

### Option 3: Vercel Dashboard Fix

If the above doesn't work:

1. **Go to Vercel Dashboard**
2. **Project Settings** → **Build & Development Settings**
3. **Override settings:**
   - Framework Preset: **Next.js**
   - Build Command: `npm run build`
   - Install Command: `npm install`
   - Output Directory: `.next`
   - Root Directory: `.` (root of repository)

## 🔍 Verification

After deployment, verify:

1. **Build logs show Next.js:**
   ```
   ✓ Creating an optimized production build
   ✓ Compiled successfully
   ✓ Collecting page data
   ✓ Finalizing page optimization
   ```

2. **API endpoints work:**
   - `https://your-app.vercel.app/api/health`
   - `https://your-app.vercel.app/api/sample-data`

3. **No more TypeScript errors** about client directory

## 📁 Current Structure

```
usms-analytics/
├── src/                    ✅ Next.js App Router
│   ├── app/
│   │   ├── api/           ✅ API Routes
│   │   ├── page.tsx       ✅ Main app
│   │   └── layout.tsx     ✅ Root layout
│   ├── components/        ✅ React components
│   ├── lib/               ✅ Services
│   └── types/             ✅ TypeScript interfaces
├── package.json           ✅ Next.js dependencies
├── next.config.js         ✅ Next.js config
├── vercel.json            ✅ Vercel config
├── .vercelignore          ✅ Excludes old directories
└── deploy-nextjs.sh       ✅ Deployment script
```

## 🎯 Expected Result

After the fix:
- ✅ **Vercel builds Next.js app** (not old client)
- ✅ **No TypeScript errors** about client directory
- ✅ **All API routes work** via Next.js
- ✅ **Frontend fully functional** with internal APIs

## 🆘 If Issues Persist

1. **Check Vercel logs** for build errors
2. **Verify framework detection** in Vercel settings
3. **Clear Vercel cache** and redeploy
4. **Check if client directory is being ignored**

The key is ensuring Vercel **ignores the old client directory** and **builds the Next.js app** from the root directory. 