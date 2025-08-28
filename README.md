# FixUrFeed Creator Matching Platform

**FixUrFeed** is a secure, quiz-based matching platform that helps students and young professionals discover the perfect career content creators for their goals. Users take a quick 2-minute quiz about their career aspirations (like product management, AI, or cybersecurity), identity, and content preferences. Our smart algorithm then matches them with 5 personalized creator recommendations from a curated database, ensuring diversity by including senior professionals, recruiting experts, and identity representation.

## 🔒 Security Features

- **Secure API Architecture**: No hardcoded sensitive data in frontend
- **Protected Creator Data**: All creator information served through authenticated API endpoints  
- **Secure Image Serving**: Images served with path validation and file type restrictions
- **CORS Protection**: API endpoints protected against unauthorized cross-origin requests
- **Input Sanitization**: All user inputs validated and sanitized before processing

## ✨ Core Features

- 🎯 **Smart Matching Algorithm**: Uses career goals, identity, and preferences for accurate creator recommendations
- 🎓 **7 Career Goals**: Marketing, Product Management, Entrepreneurship, Data Science, Software Engineering, AI/ML, and Cybersecurity
- 👥 **Guaranteed Diversity**: Ensures senior experience + recruiting expertise in every result set
- 🎭 **Identity Matching**: Includes representation when requested (with smart fallbacks)
- 📱 **Responsive Design**: Built with React, TypeScript, and Tailwind CSS
- 🗄️ **Curated Database**: 100+ verified career content creators with detailed profiles
- ⚡ **Real-time Loading**: Async data fetching with loading states and error handling

## 🚀 Quick Start

### Development Setup

```bash
# Install main dependencies
npm install

# Install server dependencies
npm run install:server

# Start both frontend and backend (recommended)
npm run dev:full
```

**Or run separately:**

```bash
# Terminal 1: Start backend API server (port 3001)
npm run server

# Terminal 2: Start frontend dev server (port 5173)
npm run dev
```

### Production Build

```bash
# Build both frontend and backend
npm run build:all
```

## 🏗️ Architecture

### Frontend (React/Vite)
- **Port**: 5173 (development)
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with Radix UI components
- **State Management**: React hooks with async API integration

### Backend API (Express/Node.js)
- **Port**: 3001
- **Framework**: Express.js with TypeScript
- **Security**: CORS protection, input validation, secure file serving
- **Caching**: Server-side caching with configurable TTL
- **Monitoring**: Health check and logging endpoints

## 📁 Project Structure

```
├── src/                     # Frontend React application
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI components (Radix)
│   │   ├── QuizFlow.tsx    # Multi-step quiz interface  
│   │   ├── MatchResults.tsx # Creator matching results
│   │   └── CreatorDatabase.tsx # Searchable creator directory
│   ├── services/
│   │   └── creatorApi.ts   # Secure API client with caching
│   ├── utils/
│   │   └── creatorMatcher.ts # Matching algorithm
│   └── data/               # Static assets (served via API)
├── server/                  # Backend API server
│   ├── index.ts            # Express server with security middleware
│   ├── package.json        # Server dependencies
│   └── tsconfig.json       # Server TypeScript config
├── SECURITY.md             # Security documentation
├── DEPLOYMENT.md           # Deployment guide
├── .env.local              # Development environment variables
└── .env.production         # Production environment variables
```

## 🔧 API Endpoints

- `GET /api/creators` - Get paginated creator data with filtering
- `GET /api/creators/:id` - Get individual creator details
- `GET /api/images/:filename` - Secure image serving with validation
- `GET /health` - API health check

## 🛡️ Security Documentation

For detailed security information, deployment guides, and best practices, see:
- **[SECURITY.md](SECURITY.md)** - Security features and implementation details
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment guide

## 🎨 Design

The original design is available at: https://www.figma.com/design/oHGYkak9DRmCeyawhX96JW/Fix-UR-Feed-Creator-Matching-Platform

## 🤖 Built with Claude Code

This secure implementation was enhanced using [Claude Code](https://claude.ai/code) to replace hardcoded data with enterprise-level security features.
