# Vercel Deployment Guide - FixUrFeed

## Overview

This guide will help you deploy your FixUrFeed Creator Matching Platform to production using Vercel for the frontend and Railway/Render for the backend API.

## Architecture

- **Frontend (React/Vite)**: Deploy to Vercel
- **Backend API (Express/Node.js)**: Deploy to Railway or Render
- **Static Assets**: Served through secure API endpoints

## Step 1: Deploy Backend API First

### Option A: Railway (Recommended)

1. **Go to [Railway](https://railway.app)**
2. **Connect GitHub**: Sign up/login and connect your GitHub account
3. **Create New Project**: 
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `fixurfeed-matching-platform` repository
4. **Configure Service**:
   - Railway will detect your Node.js project
   - Set the **Root Directory** to `server`
   - Set **Start Command** to `npm start`
5. **Environment Variables**:
   ```
   NODE_ENV=production
   PORT=3001
   ```
6. **Deploy**: Railway will automatically build and deploy
7. **Get URL**: Copy your Railway app URL (e.g., `https://your-app-name.up.railway.app`)

### Option B: Render

1. **Go to [Render](https://render.com)**
2. **Create Web Service**:
   - Connect your GitHub repository
   - Set **Root Directory**: `server`
   - Set **Build Command**: `npm install && npm run build`
   - Set **Start Command**: `npm start`
3. **Environment Variables**:
   ```
   NODE_ENV=production
   PORT=10000
   ```
4. **Deploy** and copy your Render URL

## Step 2: Update Frontend Configuration

Once you have your backend URL, update the environment variable:

```bash
# Update .env.production with your actual backend URL
VITE_API_BASE_URL=https://your-actual-backend-url.railway.app
```

## Step 3: Deploy Frontend to Vercel

### Method 1: Vercel Dashboard (Recommended)

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Import Project**:
   - Click "Add New..." → "Project"
   - Import your GitHub repository: `fixurfeed-matching-platform`
3. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `.` (leave as root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`
4. **Environment Variables**:
   Add these in the Vercel dashboard:
   ```
   VITE_API_BASE_URL=https://your-backend-url.railway.app
   VITE_API_TIMEOUT=30000
   VITE_ENABLE_DEBUG=false
   VITE_MOCK_API=false
   ```
5. **Deploy**: Click "Deploy"

### Method 2: Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from your project root
cd "/path/to/Fix UR Feed Creator Matching Platform V2"
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? [your-account]
# - Link to existing project? N
# - Project name? fixurfeed-creator-platform
# - Directory? ./
# - Override settings? N
```

## Step 4: Configure Environment Variables in Vercel

1. **Go to your project in Vercel Dashboard**
2. **Settings** → **Environment Variables**
3. **Add the following variables**:

| Variable | Value | Environment |
|----------|--------|------------|
| `VITE_API_BASE_URL` | `https://your-backend-url.railway.app` | Production |
| `VITE_API_TIMEOUT` | `30000` | Production |
| `VITE_ENABLE_DEBUG` | `false` | Production |
| `VITE_MOCK_API` | `false` | Production |

## Step 5: Update Backend CORS for Production

Update your backend's CORS configuration to include your Vercel domain:

```typescript
// In server/index.ts
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://your-vercel-app.vercel.app',
        'https://your-custom-domain.com'  // if you have one
      ] 
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:3002'],
  credentials: true,
  optionsSuccessStatus: 200
}));
```

## Step 6: Redeploy After Changes

1. **Push changes to GitHub**:
```bash
git add .
git commit -m "Configure for production deployment"
git push origin main
```

2. **Vercel will auto-deploy** from GitHub
3. **Railway/Render will auto-deploy** from GitHub

## Step 7: Custom Domain (Optional)

### Vercel Custom Domain
1. **Vercel Dashboard** → **Your Project** → **Settings** → **Domains**
2. **Add Domain**: Enter your custom domain
3. **Configure DNS**: Follow Vercel's instructions to point your domain

### Backend Custom Domain
1. **Railway**: Go to Settings → Domain → Add custom domain
2. **Render**: Go to Settings → Custom Domains

## Troubleshooting

### Common Issues

1. **Build Fails**:
   - Check Node.js version compatibility
   - Ensure all dependencies are in `package.json`
   - Check build logs for specific errors

2. **API Connection Fails**:
   - Verify `VITE_API_BASE_URL` is correct
   - Check backend CORS configuration
   - Ensure backend is deployed and healthy

3. **Images Not Loading**:
   - Verify backend image serving endpoint works
   - Check image paths in API responses

4. **Environment Variables Not Working**:
   - Ensure variables start with `VITE_`
   - Redeploy after adding variables
   - Check variable names match exactly

### Testing Deployment

1. **Backend Health**: Visit `https://your-backend-url/health`
2. **API Data**: Visit `https://your-backend-url/api/creators?limit=1`
3. **Frontend**: Visit your Vercel URL and test the quiz

## Production Checklist

- [ ] Backend deployed to Railway/Render
- [ ] Backend health check returns "healthy"
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] CORS updated for production domains
- [ ] Quiz flow works end-to-end
- [ ] Creator database loads properly
- [ ] Images display correctly
- [ ] Speed Insights working (check Network tab)

## Support

If you encounter issues:

1. **Check Vercel Build Logs**: Dashboard → Project → Deployments → View logs
2. **Check Backend Logs**: Railway/Render dashboard logs
3. **Browser DevTools**: Check Console and Network tabs
4. **Test API Directly**: Use curl or Postman to test backend endpoints

Your FixUrFeed platform will be live at:
- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://your-backend.railway.app`

## Updating Your Deployment

To update after making changes:

1. **Push to GitHub**: `git push origin main`
2. **Vercel**: Auto-deploys from GitHub
3. **Railway/Render**: Auto-deploys from GitHub
4. **No manual intervention needed!**

That's it! Your secure FixUrFeed Creator Matching Platform will be live in production! 🚀