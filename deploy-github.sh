#!/bin/bash

# Build for GitHub Pages
echo "Building for GitHub Pages..."
npm run build:github

# Copy built files to docs directory
echo "Copying files to docs directory..."
cp -r dist/* docs/

echo "Deployment ready! Commit and push to deploy to GitHub Pages." 