import React from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ArrowRight, Users, Search, MessageSquare, Database, TrendingUp, Crown } from "lucide-react";

interface LandingPageProps {
  onStartQuiz: () => void;
}

export function LandingPage({ onStartQuiz }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 pt-16 pb-12 text-center">
        <div className="space-y-6">
          <Badge variant="secondary" className="bg-secondary/10 text-secondary border-secondary/20 font-semibold inline-flex items-center">
            <Crown className="w-4 h-4 mr-2" />
            Coral Approved • certified girlboss
          </Badge>
         
          <h1 className="font-baron text-4xl md:text-3xl font-bold text-foreground leading-tight">
          <span className="text-foreground">Tired of rage bait and humble brags this recruiting season? It's time to...</span>
          <br />
            <span className="girlboss-gradient">FixUrFeed.</span> 
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-canva">
            60-second quiz → 5 laser-matched creators for ambitious tech students.
          </p>

          <div className="flex items-center justify-center gap-3">
            <Button 
              onClick={onStartQuiz}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 text-lg girlboss-glow font-semibold"
            >
              Take the quiz
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Curated from LinkedIn and beyond by a certified girlboss. 
          </p>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Start building a feed you’ll actually want to open.
          </p>
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-5xl mx-auto px-4 py-14">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-baron font-semibold text-foreground">Quiz</h3>
            <p className="text-sm text-muted-foreground">Share your goals, vibe, and what you need right now.</p>
          </div>
          
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-baron font-semibold text-foreground">Matches</h3>
            <p className="text-sm text-muted-foreground">We pair you with 5 creators who educate, inspire, and entertain.</p>
          </div>
          
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mx-auto">
              <MessageSquare className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="font-baron font-semibold text-foreground">Feedback</h3>
            <p className="text-sm text-muted-foreground">Tell us what hit or missed so the next match gets smarter.</p>
          </div>
        </div>
      </div>    
    </div>
  );
}
