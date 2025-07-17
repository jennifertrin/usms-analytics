#!/bin/bash

echo "🚀 Starting Vercel deployment for USMS Analytics..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Please install it first:"
    echo "npm install -g vercel"
    exit 1
fi

# Deploy backend first
echo "📦 Deploying backend..."
cd backend
if vercel --prod --yes; then
    echo "✅ Backend deployed successfully!"
    # Get the backend URL
    BACKEND_URL=$(vercel ls | grep -o 'https://[^[:space:]]*' | head -1)
    echo "🔗 Backend URL: $BACKEND_URL"
else
    echo "❌ Backend deployment failed!"
    exit 1
fi
cd ..

# Deploy frontend
echo "📦 Deploying frontend..."
cd frontend

# Create .env file with backend URL
echo "VITE_API_BASE_URL=$BACKEND_URL" > .env

if vercel --prod --yes; then
    echo "✅ Frontend deployed successfully!"
    # Get the frontend URL
    FRONTEND_URL=$(vercel ls | grep -o 'https://[^[:space:]]*' | head -1)
    echo "🔗 Frontend URL: $FRONTEND_URL"
else
    echo "❌ Frontend deployment failed!"
    exit 1
fi
cd ..

echo "🎉 Deployment completed successfully!"
echo "🌐 Frontend: $FRONTEND_URL"
echo "🔧 Backend: $BACKEND_URL"
echo ""
echo "📝 Don't forget to:"
echo "1. Set environment variables in Vercel dashboard"
echo "2. Configure CORS if needed"
echo "3. Test the application" 