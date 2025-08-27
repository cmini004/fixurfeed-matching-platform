
import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Crown, MessageSquare, ExternalLink, Camera, Share2 } from "lucide-react";
import { matchCreators } from "../utils/creatorMatcher";
import confetti from 'canvas-confetti';

interface QuizResponse {
  gender: string;
  ethnicity: string[];
  careerJourney: string[];
  goals: string[];
  contentCare: string[];
  contentPreference: string[];
}

interface MatchedCreator {
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
  matchReason: string;
  cta: string;
  tags: string[];
}

interface MatchResultsProps {
  quizResponses: QuizResponse;
}

export function MatchResults({ quizResponses }: MatchResultsProps) {
  // Get matched creators using our algorithm
  const matchedCreators = matchCreators(quizResponses);

  // Trigger confetti on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7']
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const getPlatformEmoji = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin': return '💼';
      case 'tiktok': return '🎵';
      case 'instagram': return '📸';
      case 'twitter': return '🐦';
      case 'youtube': return '📺';
      default: return '🌐';
    }
  };

  const isHiddenGem = (creator: MatchedCreator) => {
    return creator.followers < 50000;
  };

  const getBestPlatform = (creator: MatchedCreator): { platform: string; count: number; url?: string } => {
    const followersData = creator.followers_detail || {};
    
    // Find platform with highest follower count
    let bestPlatform = creator.platform;
    let bestCount = creator.followers;
    let bestUrl: string | undefined;
    
    Object.entries(followersData).forEach(([platform, count]) => {
      if (count > bestCount) {
        bestCount = count;
        bestPlatform = platform;
      }
    });
    
    // Get the URL for the best platform
    switch (bestPlatform.toLowerCase()) {
      case 'linkedin':
        bestUrl = creator.linkedinUrl;
        break;
      case 'instagram':
        bestUrl = creator.instagramUrl;
        break;
      case 'tiktok':
        bestUrl = creator.tiktokUrl;
        break;
      default:
        bestUrl = creator.website;
    }
    
    return { platform: bestPlatform, count: bestCount, url: bestUrl };
  };

  const getAvailablePlatforms = (creator: MatchedCreator) => {
    const platforms: { name: string; url: string; followers?: number }[] = [];
    
    if (creator.linkedinUrl) {
      platforms.push({
        name: 'LinkedIn',
        url: creator.linkedinUrl,
        followers: creator.followers_detail?.LinkedIn || 0
      });
    }
    
    if (creator.instagramUrl) {
      platforms.push({
        name: 'Instagram', 
        url: creator.instagramUrl,
        followers: creator.followers_detail?.Instagram || 0
      });
    }
    
    if (creator.tiktokUrl) {
      platforms.push({
        name: 'TikTok',
        url: creator.tiktokUrl,
        followers: creator.followers_detail?.TikTok || 0
      });
    }
    
    if (creator.website) {
      platforms.push({
        name: 'Website',
        url: creator.website
      });
    }
    
    // Sort by follower count (highest first), website last
    return platforms.sort((a, b) => {
      if (a.name === 'Website') return 1;
      if (b.name === 'Website') return -1;
      return (b.followers || 0) - (a.followers || 0);
    });
  };

  const formatFollowerCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${Math.round(count / 1000)}K`;
    return count.toString();
  };

  const handleCreatorClick = (creator: MatchedCreator) => {
    // For now, we'll just show the creator info since we don't have direct URLs
    console.log('Creator clicked:', creator.name);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/20 p-3 rounded-full">
              <Crown className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="font-baron text-3xl font-bold text-foreground mb-2">
            Your Top 5 <span className="girlboss-gradient"> Tech and Career Creators</span>
          </h1>
          <p className="text-muted-foreground">
            Curated matches based on your quiz responses
          </p>
        </div>

        {/* Creator Cards */}
        <div className="space-y-4 mb-8">
          {matchedCreators.map((creator, index) => (
            <div key={creator.id} className="relative">
              <div className="absolute -left-3 top-6 z-10">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </div>
              </div>
              
              {/* Custom Creator Card */}
              <div 
                className="bg-card border border-border rounded-2xl p-4 shadow-md hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
                onClick={() => handleCreatorClick(creator)}
              >
                <div className="flex items-start gap-4">
                  {/* Creator Avatar */}
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    {creator.avatar ? (
                      <img 
                        src={creator.avatar} 
                        alt={creator.name}
                        className="w-full h-full object-cover"
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                          // Fallback to initials if image fails to load
                          (e.target as HTMLImageElement).style.display = 'none';
                          const parent = (e.target as HTMLElement).parentElement;
                          if (parent) {
                            parent.innerHTML = `<span class="text-2xl font-bold text-primary">${creator.name.split(' ').map(n => n[0]).join('')}</span>`;
                          }
                        }}
                      />
                    ) : (
                      <span className="text-2xl font-bold text-primary">
                        {creator.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-card-foreground mb-2">
                          {creator.name}
                        </h3>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {(() => {
                          const bestPlatform = getBestPlatform(creator);
                          return (
                            <span className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-md">
                              {getPlatformEmoji(bestPlatform.platform)} 
                              <strong className="text-primary">
                                {formatFollowerCount(bestPlatform.count)} on {bestPlatform.platform}
                              </strong>
                            </span>
                          );
                        })()}
                        {isHiddenGem(creator) && (
                          <span className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            Hidden Gem
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-base text-card-foreground mb-3 line-clamp-2">
                      {creator.knownFor}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {creator.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex flex-col gap-2 items-end">
                        {(() => {
                          const availablePlatforms = getAvailablePlatforms(creator);
                          const primaryPlatform = availablePlatforms[0];
                          const secondaryPlatforms = availablePlatforms.slice(1);
                          
                          return (
                            <>
                              {/* Primary platform button (highest followers) */}
                              {primaryPlatform && (
                                <Button 
                                  variant="default" 
                                  size="sm"
                                  className="bg-primary text-white hover:bg-primary/90 w-full sm:w-auto"
                                  onClick={(e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    window.open(primaryPlatform.url, '_blank');
                                  }}
                                >
                                  {getPlatformEmoji(primaryPlatform.name)} Follow on {primaryPlatform.name} <ExternalLink className="w-3 h-3 ml-1" />
                                </Button>
                              )}
                              
                              {/* Secondary platform buttons */}
                              {secondaryPlatforms.length > 0 && (
                                <div className="flex gap-2 flex-wrap">
                                  {secondaryPlatforms.map((platform) => (
                                    <Button 
                                      key={platform.name}
                                      variant="outline" 
                                      size="sm"
                                      className="text-xs"
                                      onClick={(e: React.MouseEvent) => {
                                        e.stopPropagation();
                                        window.open(platform.url, '_blank');
                                      }}
                                    >
                                      {getPlatformEmoji(platform.name)} {platform.name}
                                    </Button>
                                  ))}
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </div>
                    
                    <div className="mt-2 text-xs text-primary font-medium">
                      Match reason: {creator.matchReason}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Screenshot CTA */}
        <div className="text-center mt-8 mb-8">
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/20">
            <div className="flex justify-center mb-4">
              <div className="bg-primary/20 p-3 rounded-full">
                <Camera className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Share Your Match! 📸
            </h3>
            <p className="text-muted-foreground mb-4">
              Take a screenshot of your creator matches and share your success story
            </p>
            <div className="bg-card rounded-lg p-4 border border-border mb-4">
              <p className="text-lg font-semibold text-primary mb-2">
                #IFixedMyFeed
              </p>
              <p className="text-sm text-muted-foreground">
                Copy this hashtag and share your FixUrFeed results!
              </p>
            </div>
            <div className="flex justify-center">
              <Button 
                onClick={() => {
                  navigator.clipboard.writeText('#IFixedMyFeed');
                  confetti({
                    particleCount: 50,
                    spread: 60,
                    origin: { y: 0.7 },
                    colors: ['#ff6b6b', '#4ecdc4', '#45b7d1']
                  });
                }}
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Copy Hashtag
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              🎉 Share on your social media and help other students discover FixUrFeed!
            </p>
          </div>
        </div>

        {/* Feedback CTA */}
        <div className="text-center mt-8">
          <Button 
            onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSckzWvnJHWHXteCmhdhg2bt4roprKKIGUV3431KTW0KGrUAwA/viewform', '_blank')}
            className="bg-primary text-white hover:bg-primary/90 girlboss-glow font-semibold px-8 py-3 text-lg"
          >
            <MessageSquare className="w-5 h-5 mr-2" />
            Help Us Improve - Quick Feedback
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            FixUrFeed is a student experiment. Your feedback helps us make better matches!
          </p>
        </div>
      </div>
    </div>
  );
}