import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com'] 
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:3002'],
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());

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
  profilePhoto: string;
  gender: string;
  ageGroup: string;
  ethnicity: string;
  careerStage: string;
  hasRecruitingExperience: boolean;
  contentStyle: string[];
  knownFor: string;
  subCategory: string[];
  targetAudience: string[];
  followers_detail?: Record<string, number>;
  linkedinUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  website?: string;
}

let creatorsCache: Creator[] | null = null;
let lastCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function loadCreators(): Creator[] {
  const now = Date.now();
  
  if (creatorsCache && (now - lastCacheTime) < CACHE_DURATION) {
    return creatorsCache;
  }

  try {
    // Try different paths for development vs production
    const possiblePaths = [
      path.join(__dirname, 'creators.json'),                 // Server directory
      path.join(__dirname, '../creators.json'),              // Server build directory
      path.join(__dirname, '../../src/data/creators.json'),  // Development fallback
      path.join(process.cwd(), 'src/data/creators.json'),    // Root relative fallback
    ];
    
    let creatorsData;
    for (const creatorsPath of possiblePaths) {
      try {
        creatorsData = JSON.parse(fs.readFileSync(creatorsPath, 'utf8'));
        console.log(`Loaded creators from: ${creatorsPath}`);
        break;
      } catch (err) {
        console.log(`Failed to load from: ${creatorsPath}`);
        continue;
      }
    }
    
    if (!creatorsData) {
      throw new Error('Could not find creators.json file');
    }
    
    const sanitizedCreators = creatorsData
      .filter((creator: any) => creator.id && creator.name)
      .map((creator: any) => ({
        ...creator,
        avatar: creator.avatar ? creator.avatar.replace('/src/data/profile_photos/', '/api/images/') : '',
        profilePhoto: creator.profilePhoto ? creator.profilePhoto.replace('/src/data/profile_photos/', '/api/images/') : ''
      }));

    creatorsCache = sanitizedCreators;
    lastCacheTime = now;
    
    return sanitizedCreators;
  } catch (error) {
    console.error('Error loading creators:', error);
    return [];
  }
}

// API endpoint for creator data
app.get('/api/creators', (req, res) => {
  try {
    const creators = loadCreators();
    
    // Optional filtering and pagination
    const { limit, offset, role, platform } = req.query;
    
    let filteredCreators = creators;
    
    if (role) {
      filteredCreators = filteredCreators.filter(c => 
        c.role.toLowerCase().includes(role.toString().toLowerCase())
      );
    }
    
    if (platform) {
      filteredCreators = filteredCreators.filter(c => 
        c.platform.toLowerCase() === platform.toString().toLowerCase()
      );
    }
    
    const startIndex = offset ? parseInt(offset.toString()) : 0;
    const endIndex = limit ? startIndex + parseInt(limit.toString()) : undefined;
    
    const result = filteredCreators.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: result,
      total: filteredCreators.length,
      count: result.length
    });
    
  } catch (error) {
    console.error('Error fetching creators:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// API endpoint for single creator
app.get('/api/creators/:id', (req, res) => {
  try {
    const creators = loadCreators();
    const creator = creators.find(c => c.id === req.params.id);
    
    if (!creator) {
      return res.status(404).json({
        success: false,
        message: 'Creator not found'
      });
    }
    
    res.json({
      success: true,
      data: creator
    });
    
  } catch (error) {
    console.error('Error fetching creator:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Secure image serving endpoint
app.get('/api/images/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    
    // Security: Only allow specific file extensions
    if (!filename.match(/\.(jpg|jpeg|png|gif)$/i)) {
      return res.status(400).json({ error: 'Invalid file type' });
    }
    
    // Security: Prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({ error: 'Invalid filename' });
    }
    
    const imagePath = path.join(__dirname, '../src/data/profile_photos', filename);
    
    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    // Set appropriate headers
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
    res.setHeader('Content-Type', 'image/jpeg');
    
    // Stream the file
    const stream = fs.createReadStream(imagePath);
    stream.pipe(res);
    
  } catch (error) {
    console.error('Error serving image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error' 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Endpoint not found' 
  });
});

app.listen(PORT, () => {
  console.log(`Creator API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Creators API: http://localhost:${PORT}/api/creators`);
});

export default app;