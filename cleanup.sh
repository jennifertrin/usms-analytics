#!/bin/bash

echo "🧹 Cleaning up session files and cache..."

# Remove Flask session files
if [ -d "backend/flask_session" ]; then
    echo "Removing Flask session files..."
    rm -rf backend/flask_session/*
    echo "✅ Flask session files cleaned"
fi

# Remove Python cache files
echo "Removing Python cache files..."
find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
find . -name "*.pyc" -delete 2>/dev/null || true
find . -name "*.pyo" -delete 2>/dev/null || true
echo "✅ Python cache files cleaned"

# Remove Vite cache
echo "Removing Vite cache..."
rm -rf node_modules/.vite 2>/dev/null || true
echo "✅ Vite cache cleaned"

# Remove dist directory
echo "Removing dist directory..."
rm -rf dist 2>/dev/null || true
echo "✅ Dist directory cleaned"

echo "🎉 Cleanup complete! You can now run 'npm run dev' without flickering issues." 