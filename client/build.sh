#!/bin/bash

# Custom build script to handle Vercel deployment issues
set -e

echo "🔨 Starting custom build process..."

# Clean any existing build artifacts
rm -rf dist/

# Install dependencies with legacy peer deps to avoid conflicts
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps --production=false

# Build the application
echo "🏗️ Building application..."
npm run build

echo "✅ Build completed successfully!" 