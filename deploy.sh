#!/bin/bash

# Deployment script for Focus Space app
echo "🚀 Starting deployment process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build for GitHub Pages
echo "🔨 Building for GitHub Pages..."
npm run build:github

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Build output is in the 'dist' directory"
    echo ""
    echo "🌐 For GitHub Pages deployment:"
    echo "   1. Push this code to your GitHub repository"
    echo "   2. Go to Settings > Pages"
    echo "   3. Set source to 'GitHub Actions'"
    echo "   4. The workflow will automatically deploy on push to main branch"
    echo ""
    echo "🚀 For Netlify deployment:"
    echo "   1. Connect your repository to Netlify"
    echo "   2. Build command: npm run build:github"
    echo "   3. Publish directory: dist"
    echo "   4. Deploy!"
else
    echo "❌ Build failed!"
    exit 1
fi 