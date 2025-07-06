# Deployment Guide for Focus Space

This guide will help you deploy the Focus Space app to either GitHub Pages or Netlify.

## Prerequisites

- Node.js 18+ installed
- Git repository set up
- GitHub account (for GitHub Pages)
- Netlify account (optional, for Netlify deployment)

## Quick Deployment

### Option 1: GitHub Pages (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Fix deployment configuration"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Navigate to Settings > Pages
   - Set Source to "GitHub Actions"
   - The workflow will automatically deploy on push to main branch

3. **Your app will be available at:**
   `https://yourusername.github.io/focvus/`

### Option 2: Netlify

1. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Configure build settings**
   - Build command: `npm run build:github`
   - Publish directory: `dist`
   - Deploy!

## Manual Build and Test

To test the build locally:

```bash
# Install dependencies
npm ci

# Build for production
npm run build:github

# The built files will be in the 'dist' directory
```

## Troubleshooting

### Common Issues

1. **404 errors on page refresh**
   - This is handled by the SPA routing configuration in `public/404.html`
   - Make sure the file is present and properly configured

2. **Assets not loading**
   - Check that the base path in `vite.config.github.ts` matches your repository name
   - Current base path: `/focvus/`

3. **Build failures**
   - Ensure all dependencies are installed: `npm ci`
   - Check for TypeScript errors: `npm run typecheck`

### File Structure After Build

```
dist/
├── index.html
├── assets/
│   ├── [hash].js
│   ├── [hash].css
│   └── [hash].png
└── 404.html
```

## Configuration Files

- `vite.config.github.ts` - GitHub Pages build configuration
- `netlify.toml` - Netlify deployment configuration
- `.github/workflows/deploy.yml` - GitHub Actions workflow
- `public/404.html` - SPA routing support for GitHub Pages

## Support

If you encounter any issues:
1. Check the build logs in GitHub Actions or Netlify
2. Verify all configuration files are present
3. Ensure the repository name matches the base path configuration 