#!/bin/bash

# Vercel Deployment Script for USMS Analytics
# This script automates the deployment process to Vercel

set -e  # Exit on any error

echo "🚀 Starting Vercel deployment for USMS Analytics..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Installing now..."
    npm install -g vercel
fi

# Check if we're in the right directory
if [ ! -f "vercel.json" ]; then
    echo "❌ Error: vercel.json not found. Please run this script from the project root."
    exit 1
fi

# Check if client dependencies are installed
if [ ! -d "client/node_modules" ]; then
    echo "📦 Installing client dependencies..."
    cd client
    npm install
    cd ..
fi

# Check if requirements-vercel.txt exists
if [ ! -f "requirements-vercel.txt" ]; then
    echo "❌ Error: requirements-vercel.txt not found."
    exit 1
fi

# Check environment variables
echo "🔧 Checking environment variables..."

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Vercel Deployment Configuration
SECRET_KEY=$(openssl rand -hex 32)
FLASK_DEBUG=false
VERCEL=true
EOF
    echo "✅ Created .env file with generated SECRET_KEY"
else
    echo "✅ .env file already exists"
fi

# Build the client
echo "🔨 Building client application..."
cd client
npm run build
cd ..

# Check if build was successful
if [ ! -d "client/dist" ]; then
    echo "❌ Error: Client build failed. dist/ directory not found."
    exit 1
fi

echo "✅ Client build successful"

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Set environment variables in your Vercel dashboard:"
echo "   - SECRET_KEY: $(grep SECRET_KEY .env | cut -d'=' -f2)"
echo "   - FLASK_DEBUG: false"
echo "   - VERCEL: true"
echo ""
echo "2. Test your deployment by visiting the provided URL"
echo ""
echo "3. Check the Vercel dashboard for function logs and performance metrics"
echo ""
echo "🔗 For more information, see VERCEL_DEPLOYMENT.md" 