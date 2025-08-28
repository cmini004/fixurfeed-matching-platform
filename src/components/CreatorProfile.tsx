import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import React from "react";
import { 
  ArrowLeft, 
  Instagram, 
  Linkedin, 
  Youtube, 
  Users, 
  MapPin, 
  Calendar,
  ExternalLink,
  Star,
  TrendingUp,
  Award
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { creatorApi } from "../services/creatorApi";

interface Creator {
  id: string;
  name: string;
  role: string;
  avatar: string;
  expertise: string[];
  followers: {
    linkedin?: number;
    instagram?: number;
    youtube?: number;
    total?: number;
  };
  location: string;
  experience: string;
  bio: string;
  timeline: Array<{
    year: string;
    title: string;
    company: string;
    description: string;
  }>;
  contentStyle: string[];
  hiddenGemInsight: string;
  socialLinks: {
    linkedin?: string;
    instagram?: string;
    youtube?: string;
  };
  recentContent: Array<{
    title: string;
    type: string;
    engagement: string;
    date: string;
  }>;
}

interface CreatorProfileProps {
  creatorId: string;
  onBack: () => void;
}

export function CreatorProfile({ creatorId, onBack }: CreatorProfileProps) {
  // Mock creator data - in real app, this would be fetched based on creatorId
  const creator: Creator = {
    id: creatorId,
    name: 'Sarah Chen',
    role: 'Senior Software Engineer',
    avatar: 'https://images.unsplash.com/photo-1602566356438-dd36d35e989c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdCUyMHdvbWFuJTIwdGVjaHxlbnwxfHx8fDE3NTYwODk4MTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    expertise: ['React', 'TypeScript', 'System Design', 'AWS', 'Node.js', 'GraphQL'],
    followers: { 
      linkedin: 15000, 
      youtube: 8500,
      instagram: 3200,
      total: 26700
    },
    location: 'San Francisco, CA',
    experience: '7 years',
    bio: 'Passionate about building scalable web applications and sharing knowledge with the developer community. I love breaking down complex concepts into digestible tutorials and helping others grow their careers in tech.',
    timeline: [
      {
        year: '2024',
        title: 'Senior Software Engineer',
        company: 'Stripe',
        description: 'Leading frontend architecture initiatives and mentoring junior developers'
      },
      {
        year: '2022',
        title: 'Software Engineer',
        company: 'Airbnb',
        description: 'Built and maintained host dashboard using React and TypeScript'
      },
      {
        year: '2020',
        title: 'Frontend Developer',
        company: 'Shopify',
        description: 'Developed merchant tools and improved checkout experience'
      },
      {
        year: '2018',
        title: 'Junior Developer',
        company: 'Local Startup',
        description: 'Full-stack development using MERN stack'
      }
    ],
    contentStyle: ['Tutorial-based', 'Beginner-friendly', 'Project-focused', 'Career advice'],
    hiddenGemInsight: 'Sarah shares incredibly detailed system design breakdowns that are perfect for interview prep. Her content consistently gets high engagement despite having a smaller following than big tech YouTubers.',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/sarahchen',
      youtube: 'https://youtube.com/@sarahchendev',
      instagram: 'https://instagram.com/sarahcodes'
    },
    recentContent: [
      {
        title: 'Building a React App with TypeScript in 2024',
        type: 'YouTube Video',
        engagement: '2.3K views',
        date: '3 days ago'
      },
      {
        title: 'System Design Interview Tips',
        type: 'LinkedIn Post',
        engagement: '847 likes',
        date: '1 week ago'
      },
      {
        title: 'My Frontend Developer Journey',
        type: 'Instagram Reel',
        engagement: '1.2K likes',
        date: '2 weeks ago'
      }
    ]
  };

  const formatFollowerCount = (count?: number) => {
    if (!count) return '0';
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[var(--fixur-primary)] py-6">
        <div className="max-w-7xl mx-auto px-6">
          <Button
            onClick={onBack}
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-[var(--fixur-primary)]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Results
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Main Profile Card */}
            <Card className="p-6">
              <div className="text-center space-y-4">
                <ImageWithFallback
                  src={creatorApi.getImageUrl(creator.avatar)}
                  alt={creator.name}
                  className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-[var(--fixur-yellow)]"
                />
                
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{creator.name}</h1>
                  <p className="text-lg text-gray-600">{creator.role}</p>
                </div>

                <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{creator.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{creator.experience}</span>
                  </div>
                </div>

                <p className="text-gray-700 text-center">{creator.bio}</p>

                <div className="flex space-x-3 justify-center">
                  <Button 
                    className="bg-[var(--fixur-yellow)] text-[var(--fixur-primary)] hover:bg-[var(--fixur-yellow)]/90"
                  >
                    Follow
                  </Button>
                  <Button variant="outline">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Connect
                  </Button>
                </div>
              </div>
            </Card>

            {/* Social Stats */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Social Media Reach</h3>
              <div className="space-y-4">
                {creator.followers.linkedin && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Linkedin className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700">LinkedIn</span>
                    </div>
                    <span className="font-semibold">
                      {formatFollowerCount(creator.followers.linkedin)}
                    </span>
                  </div>
                )}
                
                {creator.followers.youtube && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Youtube className="w-5 h-5 text-red-600" />
                      <span className="text-gray-700">YouTube</span>
                    </div>
                    <span className="font-semibold">
                      {formatFollowerCount(creator.followers.youtube)}
                    </span>
                  </div>
                )}

                {creator.followers.instagram && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Instagram className="w-5 h-5 text-pink-600" />
                      <span className="text-gray-700">Instagram</span>
                    </div>
                    <span className="font-semibold">
                      {formatFollowerCount(creator.followers.instagram)}
                    </span>
                  </div>
                )}

                <Separator />
                
                <div className="flex items-center justify-between font-semibold">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-[var(--fixur-primary)]" />
                    <span className="text-gray-900">Total Reach</span>
                  </div>
                  <span className="text-[var(--fixur-primary)]">
                    {formatFollowerCount(creator.followers.total)}
                  </span>
                </div>
              </div>
            </Card>

            {/* Hidden Gem Insight */}
            <Card className="p-6 bg-gradient-to-br from-[var(--fixur-pink)]/10 to-[var(--fixur-yellow)]/10 border-[var(--fixur-pink)]/20">
              <div className="flex items-start space-x-3">
                <div className="bg-[var(--fixur-pink)] p-2 rounded-lg flex-shrink-0">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Hidden Gem Insight 💎
                  </h3>
                  <p className="text-sm text-gray-700">{creator.hiddenGemInsight}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Content & Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {/* Expertise */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Expertise & Skills</h3>
              <div className="flex flex-wrap gap-2">
                {creator.expertise.map((skill, index) => (
                  <Badge 
                    key={index}
                    className="bg-[var(--fixur-primary)] text-white hover:bg-[var(--fixur-primary)]/90"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Content Style */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Content Style</h3>
              <div className="flex flex-wrap gap-2">
                {creator.contentStyle.map((style, index) => (
                  <Badge 
                    key={index}
                    variant="outline"
                    className="border-[var(--fixur-yellow)] text-[var(--fixur-primary)]"
                  >
                    <Star className="w-3 h-3 mr-1" />
                    {style}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Recent Content */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Content</h3>
              <div className="space-y-4">
                {creator.recentContent.map((content, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="bg-[var(--fixur-yellow)] p-2 rounded-lg flex-shrink-0">
                      <TrendingUp className="w-4 h-4 text-[var(--fixur-primary)]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{content.title}</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {content.type}
                        </Badge>
                        <span>{content.engagement}</span>
                        <span>•</span>
                        <span>{content.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Professional Timeline */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-6">Professional Timeline</h3>
              <div className="space-y-6">
                {creator.timeline.map((item, index) => (
                  <div key={index} className="flex space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-[var(--fixur-primary)] rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {item.year.slice(-2)}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{item.title}</h4>
                      <p className="text-[var(--fixur-primary)] font-medium">{item.company}</p>
                      <p className="text-gray-600 mt-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Connect Section */}
            <Card className="p-6 bg-[var(--fixur-primary)] text-white">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold">Ready to Connect?</h3>
                <p className="text-white/80">
                  Follow {creator.name} on their social platforms to start learning from their content
                </p>
                <div className="flex justify-center space-x-4">
                  {creator.socialLinks.linkedin && (
                    <Button 
                      variant="outline"
                      className="border-white text-white hover:bg-white hover:text-[var(--fixur-primary)]"
                    >
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn
                    </Button>
                  )}
                  {creator.socialLinks.youtube && (
                    <Button 
                      variant="outline"
                      className="border-white text-white hover:bg-white hover:text-[var(--fixur-primary)]"
                    >
                      <Youtube className="w-4 h-4 mr-2" />
                      YouTube
                    </Button>
                  )}
                  {creator.socialLinks.instagram && (
                    <Button 
                      variant="outline"
                      className="border-white text-white hover:bg-white hover:text-[var(--fixur-primary)]"
                    >
                      <Instagram className="w-4 h-4 mr-2" />
                      Instagram
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}