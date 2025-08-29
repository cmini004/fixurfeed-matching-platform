
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Crown, MessageSquare, ExternalLink, Camera, Share2, Loader2, X } from "lucide-react";
import { matchCreators } from "../utils/creatorMatcher";
import { creatorApi } from "../services/creatorApi";
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
  const [matchedCreators, setMatchedCreators] = useState<MatchedCreator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);

  // Load matched creators using our secure API
  useEffect(() => {
    async function loadMatches() {
      try {
        setLoading(true);
        setError(null);
        const creators = await matchCreators(quizResponses);
        setMatchedCreators(creators);
      } catch (err) {
        console.error('Error loading creator matches:', err);
        setError('Failed to load creator matches. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    
    loadMatches();
  }, [quizResponses]);

  // Trigger celebration modal and confetti when creators are loaded
  useEffect(() => {
    if (matchedCreators.length > 0) {
      const timer = setTimeout(() => {
        // Show celebration modal
        setShowCelebrationModal(true);
        
        // Trigger confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7']
        });
        
        // More confetti from different angles
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.7 },
            colors: ['#ff6b6b', '#4ecdc4', '#45b7d1']
          });
        }, 250);
        
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.7 },
            colors: ['#96ceb4', '#ffeaa7', '#ff6b6b']
          });
        }, 400);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [matchedCreators]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/20 p-3 rounded-full">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Finding Your Perfect Creators...
          </h2>
          <p className="text-muted-foreground">
            Analyzing your preferences to match you with the best creators
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <ExternalLink className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-muted-foreground mb-4">
            {error}
          </p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-primary text-white hover:bg-primary/90"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Celebration Modal - Shows automatically after results load */}
      {showCelebrationModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setShowCelebrationModal(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-br from-primary/20 to-secondary/20 p-4 rounded-full">
                  <Crown className="w-12 h-12 text-primary" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-foreground mb-3">
                🎉 You Fixed Your Feed! 🎉
              </h2>
              
              <p className="text-muted-foreground mb-6">
                We found your perfect creator matches! Now let's make this even better.
              </p>
              
              <div className="space-y-4">
                {/* Share Results Section */}
                <div className="bg-primary/10 rounded-xl p-4">
                  <h3 className="font-semibold text-foreground mb-2">
                    📸 Share Your Results
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Screenshot your matches and share with #IFixedMyFeed
                  </p>
                  <Button 
                    onClick={() => {
                      navigator.clipboard.writeText('#IFixedMyFeed');
                      confetti({
                        particleCount: 30,
                        spread: 40,
                        origin: { y: 0.8 },
                        colors: ['#ff6b6b', '#4ecdc4']
                      });
                    }}
                    variant="outline"
                    size="sm"
                    className="border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    <Share2 className="w-3 h-3 mr-2" />
                    Copy Hashtag
                  </Button>
                </div>
                
                {/* Feedback Section */}
                <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl p-4 border border-primary/30">
                  <h3 className="font-semibold text-foreground mb-2">
                    💜 Help Coral Become a Better Product Manager
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Your 30-second feedback helps improve FixUrFeed for thousands of students
                  </p>
                  <Button 
                    onClick={() => {
                      window.open('https://docs.google.com/forms/d/e/1FAIpQLSckzWvnJHWHXteCmhdhg2bt4roprKKIGUV3431KTW0KGrUAwA/viewform', '_blank');
                      setShowCelebrationModal(false);
                    }}
                    className="bg-primary text-white hover:bg-primary/90 w-full font-bold girlboss-glow"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Give Quick Feedback
                  </Button>
                </div>
              </div>
              
              <button
                onClick={() => setShowCelebrationModal(false)}
                className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Skip for now
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Feedback Modal - Shows when user clicks feedback button */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/20 p-2 rounded-full">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  Help Us Improve! 💡
                </h3>
              </div>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-muted-foreground mb-6">
              FixUrFeed is a student experiment designed to help students like you discover tech and career creators that inspire and educate.
            </p>
            
            <p className="text-foreground font-medium mb-4">
              Your quick feedback helps us:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
              <li>Improve our matching algorithm</li>
              <li>Add more diverse creators</li>
              <li>Better understand what content students need</li>
            </ul>
            
            <div className="flex flex-col gap-3">
              <Button 
                onClick={() => {
                  window.open('https://docs.google.com/forms/d/e/1FAIpQLSckzWvnJHWHXteCmhdhg2bt4roprKKIGUV3431KTW0KGrUAwA/viewform', '_blank');
                  setShowFeedbackModal(false);
                }}
                className="bg-primary text-white hover:bg-primary/90 w-full py-6 text-lg font-bold girlboss-glow"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Share Feedback (30 seconds)
              </Button>
              <Button 
                onClick={() => setShowFeedbackModal(false)}
                variant="ghost"
                className="text-muted-foreground"
              >
                Maybe Later
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-4 py-4">
          {/* Top Feedback Banner */}
          <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl p-4 mb-4 border border-primary/30">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    Help improve FixUrFeed for students like you!
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Share your quick feedback (30 seconds)
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => setShowFeedbackModal(true)}
                className="bg-primary text-white hover:bg-primary/90 font-bold px-6 py-2 girlboss-glow"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Give Feedback
              </Button>
            </div>
          </div>
          
          {/* Header */}
          <div className="text-center mb-4">
            <div className="flex justify-center mb-2">
              <div className="bg-primary/20 p-2 rounded-full">
                <Crown className="w-6 h-6 text-primary" />
              </div>
            </div>
            <h1 className="font-baron text-2xl font-bold text-foreground mb-1">
              Your Top 5 <span className="girlboss-gradient">Tech & Career Creators</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Curated matches based on your quiz responses
            </p>
          </div>

          {/* Creator Cards - Compact Layout */}
          <div className="grid gap-3 mb-4">
            {matchedCreators.map((creator, index) => (
              <div key={creator.id} className="relative">
                <div className="absolute -left-2 top-3 z-10">
                  <div className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold">
                    {index + 1}
                  </div>
                </div>
                
                {/* Compact Creator Card */}
                <div 
                  className="bg-card border border-border rounded-xl p-3 shadow-sm hover:shadow-md transition-all hover:scale-[1.01] cursor-pointer"
                  onClick={() => handleCreatorClick(creator)}
                >
                  <div className="flex items-start gap-3">
                    {/* Creator Avatar - Smaller */}
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                      {creator.avatar || creator.profilePhoto ? (
                        <img 
                          src={creatorApi.getImageUrl(creator.avatar || creator.profilePhoto)} 
                          alt={creator.name}
                          className="w-full h-full object-cover"
                          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                            // Fallback to initials if image fails to load
                            (e.target as HTMLImageElement).style.display = 'none';
                            const parent = (e.target as HTMLElement).parentElement;
                            if (parent) {
                              parent.innerHTML = `<span class="text-sm font-bold text-primary">${creator.name.split(' ').map(n => n[0]).join('')}</span>`;
                            }
                          }}
                        />
                      ) : (
                        <span className="text-sm font-bold text-primary">
                          {creator.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      )}
                    </div>
                  
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <h3 className="text-base font-semibold text-card-foreground">
                            {creator.name}
                          </h3>
                        </div>
                        
                        <div className="flex items-center gap-1 text-xs">
                          {(() => {
                            const bestPlatform = getBestPlatform(creator);
                            return (
                              <span className="flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded">
                                {getPlatformEmoji(bestPlatform.platform)} 
                                <strong className="text-primary">
                                  {formatFollowerCount(bestPlatform.count)}
                                </strong>
                              </span>
                            );
                          })()}
                          {isHiddenGem(creator) && (
                            <span className="bg-green-100 text-green-800 px-1.5 py-0.5 rounded text-xs font-medium">
                              💎
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-card-foreground mb-2 line-clamp-1">
                        {creator.knownFor}
                      </p>
                    
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {creator.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs py-0 px-1.5">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex gap-1.5">
                          {(() => {
                            const availablePlatforms = getAvailablePlatforms(creator);
                            const primaryPlatform = availablePlatforms[0];
                            
                            return (
                              <>
                                {primaryPlatform && (
                                  <Button 
                                    variant="default" 
                                    size="sm"
                                    className="bg-primary text-white hover:bg-primary/90 text-xs px-3 py-1 h-7"
                                    onClick={(e: React.MouseEvent) => {
                                      e.stopPropagation();
                                      window.open(primaryPlatform.url, '_blank');
                                    }}
                                  >
                                    Follow <ExternalLink className="w-3 h-3 ml-1" />
                                  </Button>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </div>
                      
                      <div className="mt-1 text-xs text-muted-foreground">
                        {creator.matchReason}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Compact Screenshot CTA */}
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-4 border border-primary/20">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Camera className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    Share Your Match! #IFixedMyFeed
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Screenshot & share your results
                  </p>
                </div>
              </div>
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
                size="sm"
                className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                <Share2 className="w-3 h-3 mr-2" />
                Copy Hashtag
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}