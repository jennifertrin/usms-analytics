#!/bin/bash

echo "🚀 Starting Vercel deployment preparation..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf client/dist
rm -rf .vercel

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Build the client
echo "🔨 Building client application..."
cd client
pnpm install --frozen-lockfile
pnpm run build

# Check if build was successful
if [ ! -f "dist/index.html" ]; then
    echo "❌ Build failed - index.html not found"
    exit 1
fi

echo "✅ Build completed successfully!"
echo "📁 Build contents:"
ls -la dist/

# Go back to root
cd ..

echo "🎯 Ready for Vercel deployment!"
echo "Run: vercel --prod" 