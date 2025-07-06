# Build for GitHub Pages
Write-Host "Building for GitHub Pages..." -ForegroundColor Green
npm run build:github

# Copy built files to docs directory
Write-Host "Copying files to docs directory..." -ForegroundColor Green
Copy-Item -Path "dist\*" -Destination "docs\" -Recurse -Force

Write-Host "Deployment ready! Commit and push to deploy to GitHub Pages." -ForegroundColor Yellow 