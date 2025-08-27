# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the "Fix UR Feed Creator Matching Platform" - a React-based web application that helps users find content creators through a quiz-based matching system. The application includes a landing page, quiz flow, results matching, and a creator database with feedback gating.

## Commands

### Development
- `npm install` - Install dependencies
- `npm run dev` - Start development server (runs on port 3000, opens browser automatically)
- `npm run build` - Build for production (outputs to `build/` directory)

## Architecture

### Tech Stack
- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite with SWC plugin for fast compilation
- **UI Components**: Radix UI primitives with custom styling
- **Styling**: Tailwind CSS with custom component variants
- **Icons**: Lucide React

### Application Flow
The app uses a centralized state management pattern in `App.tsx` with page-based routing:

1. **Landing Page** → **Quiz Flow** → **Match Results** → **Feedback Gate** → **Creator Database**
2. Navigation is conditionally rendered (hidden during quiz, feedback flows)
3. Creator database access is gated behind feedback submission

### Key Components Structure

**Main Application Components** (`src/components/`):
- `LandingPage.tsx` - Entry point with call-to-action
- `QuizFlow.tsx` - Multi-step quiz with progress tracking
- `MatchResults.tsx` - Displays matched creators based on quiz responses
- `CreatorDatabase.tsx` - Searchable/filterable creator directory
- `FeedbackGate.tsx` / `FeedbackSuccess.tsx` - Feedback collection flow
- `Navigation.tsx` - App navigation with conditional database access

**UI Components** (`src/components/ui/`):
- Complete Radix UI component library with custom styling
- Follows shadcn/ui patterns and conventions
- Uses class-variance-authority for component variants

### Data Models

**QuizResponse Interface**:
```typescript
interface QuizResponse {
  age: string;
  gender: string;
  careAboutAge: string;
  careerDirection: string;
  contentStyle: string[];
}
```

**Creator Interface**:
```typescript
interface Creator {
  id: string;
  name: string;
  role: string;
  avatar: string;
  tagline: string;
  followers: number;
  platform: string;
  topics: string[];
  style: string;
}
```

### Configuration Notes

- Vite config includes extensive alias mappings for dependency resolution
- Path alias `@` points to `src/` directory
- Build target set to `esnext`
- Development server configured for port 3000 with auto-open

### Styling Approach

- Dark theme enabled by default (`dark` class on root div)
- Uses Tailwind utility classes throughout
- Component variants managed through class-variance-authority
- Responsive design with mobile-first approach