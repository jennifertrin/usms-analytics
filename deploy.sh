#!/bin/bash

echo "🚀 Starting Vercel deployment for USMS Analytics (Restructured)..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Please install it first:"
    echo "npm install -g vercel"
    exit 1
fi

# Install all dependencies
echo "📦 Installing all dependencies..."
npm run install:all

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
if vercel --prod --yes; then
    echo "✅ Deployment completed successfully!"
    
    # Get the deployment URL
    DEPLOYMENT_URL=$(vercel ls | grep -o 'https://[^[:space:]]*' | head -1)
    echo "🌐 Application URL: $DEPLOYMENT_URL"
    
    echo ""
    echo "📝 Next steps:"
    echo "1. Set environment variables in Vercel dashboard:"
    echo "   - SECRET_KEY: A secure random string"
    echo "   - VERCEL: Set to 'true'"
    echo "2. Test the application at: $DEPLOYMENT_URL"
    echo "3. Configure custom domain if needed"
else
    echo "❌ Deployment failed!"
    exit 1
fi 