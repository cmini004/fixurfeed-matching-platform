import React, { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Download, Share2, ArrowRight } from 'lucide-react';

interface CelebrationScreenProps {
  creatorMatches: any[];
  onContinue: () => void;
}

// Simple confetti animation component
const Confetti = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
    }> = [];

    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];

    // Create confetti particles
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 4 + 2,
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.1; // gravity

        // Draw particle
        ctx.fillStyle = particle.color;
        ctx.fillRect(particle.x, particle.y, particle.size, particle.size);

        // Reset particle if it goes off screen
        if (particle.y > canvas.height) {
          particles[index] = {
            x: Math.random() * canvas.width,
            y: -10,
            vx: (Math.random() - 0.5) * 4,
            vy: Math.random() * 3 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 4 + 2,
          };
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Stop animation after 3 seconds
    const timer = setTimeout(() => {
      cancelAnimationFrame(animationId);
      canvas.style.display = 'none';
    }, 3000);

    return () => {
      cancelAnimationFrame(animationId);
      clearTimeout(timer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ zIndex: 1000 }}
    />
  );
};

const ShareableCard = React.forwardRef<HTMLDivElement, { matches: any[] }>(
  ({ matches }, ref) => (
    <div ref={ref} className="w-[600px] h-[800px] bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-8 text-white">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 h-full flex flex-col justify-center items-center text-center">
        <h1 className="text-4xl font-bold mb-4">#IFixedMyFeed</h1>
        <p className="text-xl mb-8 leading-relaxed">
          Now I follow good resources to help me grow in my ambitious goals as a tech student.
        </p>
        
        <div className="bg-white/20 rounded-xl p-4 mb-6">
          <p className="text-lg font-semibold mb-2">My Top Creator Matches:</p>
          <div className="space-y-2">
            {matches.slice(0, 3).map((creator, index) => (
              <div key={creator.id} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <span className="font-medium">{creator.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-auto">
          <p className="text-sm opacity-90">Created with FixUrFeed.com</p>
          <p className="text-xs opacity-75">Your personalized creator discovery platform</p>
        </div>
      </div>
    </div>
  )
);

ShareableCard.displayName = 'ShareableCard';

export function CelebrationScreen({ creatorMatches, onContinue }: CelebrationScreenProps) {
  const [showConfetti, setShowConfetti] = useState(true);
  const shareableCardRef = useRef<HTMLDivElement>(null);

  const handleDownloadImage = async () => {
    if (!shareableCardRef.current) return;

    try {
      // Use html2canvas if available, otherwise show a message
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(shareableCardRef.current, {
        backgroundColor: null,
        scale: 2,
        width: 600,
        height: 800,
      });

      // Create download link
      const link = document.createElement('a');
      link.download = 'my-fixed-feed.png';
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Failed to generate screenshot:', error);
      // Fallback: copy text to clipboard
      const text = `#IFixedMyFeed - Now I follow good resources to help me grow in my ambitious goals as a tech student. Check out FixUrFeed.com`;
      navigator.clipboard.writeText(text).then(() => {
        alert('Text copied to clipboard! You can share this on social media.');
      });
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: '#IFixedMyFeed',
      text: 'Now I follow good resources to help me grow in my ambitious goals as a tech student.',
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        const shareText = `${shareData.text} ${shareData.url}`;
        await navigator.clipboard.writeText(shareText);
        alert('Share text copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  useEffect(() => {
    // Hide confetti after 3 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {showConfetti && <Confetti />}
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Main celebration content */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-3xl">🎉</span>
            </div>
          </div>
          
          <h1 className="font-baron text-4xl font-bold text-foreground mb-4">
            <span className="girlboss-gradient">#IFixedMyFeed!</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
            Congratulations! You've discovered {creatorMatches.length} amazing creators who align with your goals and interests.
          </p>
          
          <p className="text-lg text-foreground mb-8">
            Now I follow good resources to help me grow in my ambitious goals as a tech student.
          </p>
        </div>

        {/* Screenshot/Share Card - Hidden by default */}
        <div className="fixed -top-[1000px] -left-[1000px] pointer-events-none">
          <ShareableCard ref={shareableCardRef} matches={creatorMatches} />
        </div>

        {/* Visible preview card */}
        <div className="max-w-sm mx-auto mb-8">
          <Card className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 p-6 text-center">
            <h3 className="font-bold text-lg mb-2">#IFixedMyFeed</h3>
            <p className="text-sm mb-4">
              Now I follow good resources to help me grow in my ambitious goals as a tech student.
            </p>
            <div className="text-xs text-muted-foreground">
              Your top matches: {creatorMatches.slice(0, 3).map(c => c.name).join(', ')}
            </div>
          </Card>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <Button 
            onClick={handleDownloadImage}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Image
          </Button>
          
          <Button 
            onClick={handleShare}
            variant="outline"
            className="border-purple-600 text-purple-600 hover:bg-purple-50"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Achievement
          </Button>
        </div>

        {/* Continue button */}
        <div className="text-center">
          <Button 
            onClick={onContinue}
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 text-lg girlboss-glow font-semibold"
          >
            Continue to Creators
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}