# FixUrFeed Creator Matching Platform

**FixUrFeed** is a quiz-based matching platform that helps students and young professionals discover the perfect career content creators for their goals. Users take a quick 2-minute quiz about their career aspirations (like product management, AI, or cybersecurity), identity, and content preferences. Our smart algorithm then matches them with 5 personalized creator recommendations from a curated database, ensuring diversity by including senior professionals, recruiting experts, and identity representation.

## Features

- 🎯 **Smart Matching Algorithm**: Uses career goals, identity, and preferences for accurate creator recommendations
- 🎓 **7 Career Goals**: Marketing, Product Management, Entrepreneurship, Data Science, Software Engineering, AI/ML, and Cybersecurity
- 👥 **Guaranteed Diversity**: Ensures senior experience + recruiting expertise in every result set
- 🎭 **Identity Matching**: Includes representation when requested (with smart fallbacks)
- 📱 **Responsive Design**: Built with React, TypeScript, and Tailwind CSS
- 🗄️ **Curated Database**: 100+ verified career content creators with detailed profiles

## Running the Code

```bash
# Install dependencies
npm install

# Start development server (runs on port 3000)
npm run dev

# Build for production
npm run build
```

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite with SWC plugin
- **UI Components**: Radix UI primitives with Tailwind CSS
- **Icons**: Lucide React

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── QuizFlow.tsx    # Multi-step quiz interface  
│   ├── MatchResults.tsx # Creator matching results
│   └── CreatorDatabase.tsx # Searchable creator directory
├── data/
│   ├── creators.json   # Creator database
│   └── profile_photos/ # Creator profile images
├── utils/
│   └── creatorMatcher.ts # Matching algorithm
└── styles/             # Global CSS and Tailwind config
```

The original design is available at: https://www.figma.com/design/oHGYkak9DRmCeyawhX96JW/Fix-UR-Feed-Creator-Matching-Platform
