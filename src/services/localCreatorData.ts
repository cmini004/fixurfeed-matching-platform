// Simple local data service - following Jude's suggestion for environment variables

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

// Hardcoded creator data - secure and simple (Jude's approach)
const CREATORS_DATA: Creator[] = [
  {
    id: "1",
    name: "Jenny Wood",
    role: "Founder",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616c6106db8?w=400",
    tagline: "Leadership coach focusing on self-advocacy and workplace tips—her unapologetic voice resonates with professionals seeking assertive growth.",
    followers: 98971,
    platform: "LinkedIn",
    topics: ["Tech Leadership", "Digital Marketing", "Content strategy", "Personal Branding"],
    style: "Educational",
    profilePhoto: "https://images.unsplash.com/photo-1494790108755-2616c6106db8?w=400",
    gender: "Female",
    ageGroup: "30+",
    ethnicity: "White",
    careerStage: "Senior",
    hasRecruitingExperience: false,
    contentStyle: ["Educational", "Inspiring", "Tactical Tips", "Storytelling"],
    knownFor: "Leadership coach focusing on self-advocacy and workplace tips—her unapologetic voice resonates with professionals seeking assertive growth.",
    subCategory: ["Tech Leadership", "Digital Marketing", "Content strategy", "Personal Branding"],
    targetAudience: ["Early career", "Underrepresented individuals", "Career changers", "Executives"],
    linkedinUrl: "https://www.linkedin.com/in/jennyilles/",
    instagramUrl: "https://www.instagram.com/itsjennywood/"
  },
  {
    id: "2", 
    name: "Marcus Johnson",
    role: "Product Manager",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    tagline: "From zero to PM. Helping others break into product management.",
    followers: 45000,
    platform: "YouTube",
    topics: ["Product Management", "Career"],
    style: "Educational",
    profilePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    gender: "Male",
    ageGroup: "26-30",
    ethnicity: "Black",
    careerStage: "Mid Career",
    hasRecruitingExperience: true,
    contentStyle: ["Educational", "Inspiring"],
    knownFor: "Product management career guidance",
    subCategory: ["Product Management"],
    targetAudience: ["Early career", "Career changers"]
  },
  {
    id: "3",
    name: "Sarah Chen",
    role: "Software Engineer",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    tagline: "Building scalable systems at scale. Sharing practical engineering tips.",
    followers: 85000,
    platform: "LinkedIn", 
    topics: ["Software Engineering", "System Design"],
    style: "Educational",
    profilePhoto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    gender: "Female",
    ageGroup: "26-30",
    ethnicity: "Asian",
    careerStage: "Senior",
    hasRecruitingExperience: false,
    contentStyle: ["Educational", "Technical"],
    knownFor: "Software engineering and system design",
    subCategory: ["Software Engineering"],
    targetAudience: ["Engineers", "Tech professionals"]
  },
  {
    id: "4",
    name: "Alex Rodriguez", 
    role: "Data Scientist",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    tagline: "Making data science accessible. Python tips and career advice.",
    followers: 32000,
    platform: "YouTube",
    topics: ["Data Science", "AI/ML", "Python"],
    style: "Educational",
    profilePhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400", 
    gender: "Male",
    ageGroup: "30+",
    ethnicity: "Latino",
    careerStage: "Senior",
    hasRecruitingExperience: true,
    contentStyle: ["Educational", "Technical"],
    knownFor: "Data science education and career guidance",
    subCategory: ["Data Science", "AI/ML"],
    targetAudience: ["Data scientists", "Career changers", "Students"]
  },
  {
    id: "5",
    name: "Taylor Kim",
    role: "Entrepreneur",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
    tagline: "Built 3 startups. Sharing lessons learned the hard way.",
    followers: 67000,
    platform: "Twitter",
    topics: ["Entrepreneurship", "Startups", "Fundraising"],
    style: "Inspiring",
    profilePhoto: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
    gender: "Female", 
    ageGroup: "30+",
    ethnicity: "Asian",
    careerStage: "Senior",
    hasRecruitingExperience: false,
    contentStyle: ["Inspiring", "Storytelling"],
    knownFor: "Startup founding and entrepreneurship",
    subCategory: ["Founders, startup advice", "fundraising and pitching"],
    targetAudience: ["Entrepreneurs", "Founders", "Early career"]
  }
];

// Simple data service following Jude's approach
export class LocalCreatorService {
  static getAllCreators(): Creator[] {
    return CREATORS_DATA;
  }

  static getCreatorById(id: string): Creator | null {
    return CREATORS_DATA.find(creator => creator.id === id) || null;
  }

  static getCreatorsByRole(role: string): Creator[] {
    return CREATORS_DATA.filter(creator => 
      creator.role.toLowerCase().includes(role.toLowerCase())
    );
  }

  static searchCreators(query: string): Creator[] {
    const lowerQuery = query.toLowerCase();
    return CREATORS_DATA.filter(creator =>
      creator.name.toLowerCase().includes(lowerQuery) ||
      creator.role.toLowerCase().includes(lowerQuery) ||
      creator.knownFor.toLowerCase().includes(lowerQuery) ||
      creator.topics.some(topic => topic.toLowerCase().includes(lowerQuery))
    );
  }
}

export type { Creator };
export default LocalCreatorService;