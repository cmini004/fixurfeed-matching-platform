# Deployment Guide - FixUrFeed Creator Matching Platform

## Overview

This guide provides instructions for deploying the FixUrFeed Creator Matching Platform with the new secure API architecture.

## Architecture

The application now consists of two main components:
1. **Frontend (React/Vite)** - User interface and quiz functionality
2. **Backend API (Express/Node.js)** - Secure creator data serving

## Prerequisites

- Node.js 16+ installed
- npm or yarn package manager
- SSL certificate for production (recommended)
- Domain name and hosting provider

## Development Setup

### 1. Clone and Install Dependencies

```bash
# Main project
npm install

# Server dependencies
npm run install:server
```

### 2. Environment Configuration

Copy the environment files and update with your settings:

```bash
# Development
cp .env.local.example .env.local

# Production
cp .env.production.example .env.production
```

Update the API URL in your environment files:
- Development: `http://localhost:3001`
- Production: `https://api.your-domain.com`

### 3. Development Server

Run both frontend and backend simultaneously:

```bash
npm run dev:full
```

Or run them separately:

```bash
# Terminal 1 - Backend API
npm run server

# Terminal 2 - Frontend
npm run dev
```

## Production Deployment

### Option 1: Traditional Hosting (VPS/Dedicated Server)

#### Backend Deployment

1. **Prepare the server**
```bash
# Install Node.js and PM2
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2
```

2. **Deploy the API server**
```bash
# Copy server files to your server
scp -r server/ user@your-server:/path/to/app/

# On the server
cd /path/to/app/server
npm install
npm run build

# Start with PM2
pm2 start dist/index.js --name "fixurfeed-api"
pm2 startup
pm2 save
```

3. **Configure reverse proxy (Nginx)**
```nginx
server {
    listen 80;
    server_name api.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.your-domain.com;
    
    ssl_certificate /path/to/your/certificate.pem;
    ssl_certificate_key /path/to/your/private-key.pem;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Frontend Deployment

1. **Build the frontend**
```bash
npm run build
```

2. **Deploy to web server**
```bash
# Copy build files to your web server
scp -r build/* user@your-server:/var/www/html/
```

3. **Configure web server (Nginx)**
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;
    
    ssl_certificate /path/to/your/certificate.pem;
    ssl_certificate_key /path/to/your/private-key.pem;
    
    root /var/www/html;
    index index.html;
    
    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

### Option 2: Platform-as-a-Service (PaaS)

#### Vercel (Frontend)

1. **Connect your repository to Vercel**
2. **Configure build settings**
   - Framework: Vite
   - Build command: `npm run build`
   - Output directory: `build`
3. **Add environment variables**
   - `VITE_API_BASE_URL=https://your-api-domain.com`

#### Railway/Render (Backend)

1. **Create new service**
2. **Connect your repository**
3. **Configure build settings**
   - Build command: `cd server && npm install && npm run build`
   - Start command: `cd server && npm start`
4. **Add environment variables**
   - `NODE_ENV=production`
   - `PORT=3001`

#### Heroku (Full Stack)

1. **Create Heroku apps**
```bash
# API
heroku create your-app-api
heroku config:set NODE_ENV=production -a your-app-api

# Frontend
heroku create your-app-frontend
heroku config:set VITE_API_BASE_URL=https://your-app-api.herokuapp.com -a your-app-frontend
```

2. **Deploy with separate buildpacks**
```bash
# API deployment
git subtree push --prefix=server heroku-api main

# Frontend deployment
heroku buildpacks:add mars/create-react-app -a your-app-frontend
git push heroku-frontend main
```

## Docker Deployment

### 1. Backend Dockerfile

Create `server/Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY . .
RUN npm run build

EXPOSE 3001
CMD ["npm", "start"]
```

### 2. Frontend Dockerfile

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 3. Docker Compose

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  api:
    build: ./server
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    
  frontend:
    build: .
    ports:
      - "80:80"
    depends_on:
      - api
    environment:
      - VITE_API_BASE_URL=http://api:3001
    restart: unless-stopped
```

## Environment Variables

### Frontend (.env.production)
```env
VITE_API_BASE_URL=https://api.your-domain.com
VITE_API_TIMEOUT=30000
VITE_ENABLE_DEBUG=false
VITE_MOCK_API=false
```

### Backend Environment Variables
```env
NODE_ENV=production
PORT=3001
CORS_ORIGINS=https://your-domain.com,https://www.your-domain.com
```

## Security Configuration

### 1. HTTPS/SSL Setup
- Obtain SSL certificates (Let's Encrypt recommended for free certificates)
- Configure HTTPS redirects
- Enable HSTS headers

### 2. CORS Configuration
Update the CORS origins in your production server:
```javascript
cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CORS_ORIGINS?.split(',') || ['https://your-domain.com'] 
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
})
```

### 3. Security Headers
Implement security headers in your web server or application:
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security` (HTTPS only)

## Monitoring and Logging

### 1. Application Monitoring
- Set up error tracking (Sentry, Rollbar)
- Monitor API performance and uptime
- Set up alerts for critical issues

### 2. Server Monitoring
- Monitor server resources (CPU, memory, disk)
- Set up log aggregation (ELK stack, Fluentd)
- Monitor API metrics and response times

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check API CORS configuration
   - Verify frontend API URL
   - Ensure domains match exactly

2. **API Connection Issues**
   - Verify API server is running
   - Check firewall and network settings
   - Validate environment variables

3. **Image Loading Issues**
   - Verify image API endpoint
   - Check file permissions
   - Validate image paths

4. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Review build logs for specific errors

### Health Checks

Monitor these endpoints:
- Frontend: `https://your-domain.com` (should load the application)
- API Health: `https://api.your-domain.com/health`
- API Data: `https://api.your-domain.com/api/creators?limit=1`

## Performance Optimization

### 1. Frontend Optimization
- Enable gzip compression
- Configure CDN for static assets
- Implement service worker for caching
- Optimize image sizes and formats

### 2. Backend Optimization
- Enable API response caching
- Implement database connection pooling (when database is added)
- Use compression middleware
- Monitor and optimize query performance

This deployment guide should help you successfully deploy the secure version of your FixUrFeed platform. For additional support or custom deployment scenarios, refer to the platform-specific documentation or reach out for assistance.