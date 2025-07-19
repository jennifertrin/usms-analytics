#!/bin/bash

# Next.js Deployment Script
echo "🚀 Starting Next.js deployment preparation..."

# Clean up old build artifacts
echo "🧹 Cleaning up old build artifacts..."
rm -rf .next
rm -rf dist
rm -rf build

# Remove old lock files to avoid conflicts
echo "🗑️ Removing old lock files..."
rm -f pnpm-lock.yaml
rm -f yarn.lock

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the Next.js app
echo "🔨 Building Next.js app..."
npm run build

# Verify the build
echo "✅ Verifying build..."
if [ -d ".next" ]; then
    echo "✅ Next.js build successful!"
    echo "📁 Build directory: .next"
    echo "📄 Build contents:"
    ls -la .next/
else
    echo "❌ Build failed - .next directory not found"
    exit 1
fi

echo "🎉 Next.js app is ready for deployment!"
echo "📝 Next steps:"
echo "1. Commit your changes: git add . && git commit -m 'Ready for Next.js deployment'"
echo "2. Push to trigger Vercel deployment: git push"
echo "3. Check Vercel dashboard for deployment status" 