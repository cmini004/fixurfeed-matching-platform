import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ArrowRight, Users, TrendingUp, Database, Target, Heart, Lightbulb, Calendar, Crown, BarChart3, MessageSquareQuote } from "lucide-react";
import { creatorApi } from "../services/creatorApi";
import React from "react";

interface AboutProps {
  onTakeQuiz: () => void;
}

export function About({ onTakeQuiz }: AboutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Statement */}
        <div className="text-center mb-12">
          <h1 className="font-baron text-4xl md:text-5xl font-bold text-foreground mb-4">
            I believe early access to high-quality information can change your career.
          </h1>
          <p className="text-md text-muted-foreground max-w-xl mx-auto mb-6">
            Hey it's Coral ✨ — Your favorite Miami Tech girl 😎, student at FIU (Computer Science + Film), and a future Product Manager. 
            I built FixUrFeed after realizing how hard it was to find the right content on LinkedIn when you're just starting out.
          </p>
          <div className="flex justify-center mb-6">
            <img
              src={creatorApi.getImageUrl("/api/images/Coral_Miniel.jpeg")}
              alt="Coral Miniel headshot"
              width="160"
              height="160"
              className="rounded-full border border-border"
            />
          </div>
         
        </div>

     
        {/* Why I Built This */}
        <Card className="p-8 mb-8 border border-border bg-card">
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-primary/20 p-2 rounded-lg">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <h2 className="font-baron text-2xl font-semibold text-card-foreground">Why I built this</h2>
            </div>
            
            <div className="prose text-muted-foreground space-y-4">
              <p>
                LinkedIn is powerful — but let's be honest, it kind of sucks at first. When you're new, your feed is filled with humble-brags, generic advice, and posts that don't help you grow. It took me years of trial, error, and endless scrolling to finally build a feed that felt valuable.
              </p>
              
              <p>
                <strong className="text-secondary">Worse, it feeds impostor syndrome.</strong> Your feed becomes a comparison trap — everyone else seems to have it figured out, landing dream internships, getting promoted, or building successful startups. Meanwhile, you're still trying to figure out what you even want to do. It shouldn't feel like a private club where you need the right connections just to get started.
              </p>
              
              <p>
                The problem isn't that LinkedIn lacks good creators. It's that they're <strong className="text-primary">hard to discover</strong>. And for students just starting out, time matters. Five minutes on TikTok gives you immediate value. On LinkedIn, it can take months before you find the right people to follow. That "time to value" is broken — and I want to fix it.
              </p>
            </div>
          </div>
          
        </Card>
        {/* Research & Student Feedback */}
        <Card className="p-8 mb-8 border border-border bg-gradient-to-br from-secondary/5 to-accent/5">
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-secondary/20 p-2 rounded-lg">
                <BarChart3 className="w-6 h-6 text-secondary" />
              </div>
              <h2 className="font-baron text-2xl font-semibold text-card-foreground">What the students said</h2>
            </div>
            
            {/* Research Overview */}
            <div className="bg-card/50 p-6 rounded-lg border border-border/50 backdrop-blur-sm">
              <div className="flex items-start space-x-4 mb-4">
                <div className="bg-primary/20 p-2 rounded-lg shrink-0">
                  <MessageSquareQuote className="w-5 h-5 text-primary" />
                </div>
                <p className="text-muted-foreground">
                  I interviewed <strong className="text-foreground">7 students</strong>, surveyed <strong className="text-foreground">64 more</strong>.
                </p>
              </div>
              <p className="text-card-foreground font-medium">
                The data confirmed what I felt: ambitious young people want content that's real, tactical, and actually helps them grow.
              </p>
            </div>

            {/* Key Statistics */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-primary/10 p-6 rounded-lg border border-primary/20 text-center group hover:bg-primary/15 transition-colors">
                <div className="font-baron text-3xl font-bold text-primary mb-2">62%</div>
                <p className="text-sm text-muted-foreground leading-tight">want more job postings, advice, and educational content</p>
              </div>
              <div className="bg-secondary/10 p-6 rounded-lg border border-secondary/20 text-center group hover:bg-secondary/15 transition-colors">
                <div className="font-baron text-3xl font-bold text-secondary mb-2">54%</div>
                <p className="text-sm text-muted-foreground leading-tight">want less engagement bait</p>
              </div>
              <div className="bg-accent/10 p-6 rounded-lg border border-accent/20 text-center group hover:bg-accent/15 transition-colors">
                <div className="font-baron text-3xl font-bold text-accent mb-2">48%</div>
                <p className="text-sm text-muted-foreground leading-tight">want less fluff and more strategy</p>
              </div>
            </div>

            {/* Bottom Quote */}
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg border-l-4 border-primary">
              <p className="text-card-foreground font-semibold text-lg">
                "I didn't just build this from opinion. I built it from feedback, data, and lived experience."
              </p>
            </div>
          </div>
        </Card>


        {/* Value Prop */}
        <Card className="p-8 mb-8 border border-border bg-card">
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-accent/20 p-2 rounded-lg">
                <Target className="w-6 h-6 text-accent" />
              </div>
              <h2 className="font-baron text-2xl font-semibold text-card-foreground">My value prop</h2>
            </div>
            
            <div className="prose text-muted-foreground space-y-4">
              <p>
                I curated 100 creators who consistently deliver for ambitious students. My filter was simple: they either <strong className="text-primary">entertain, inspire, and / or educate</strong> (and many do all three). Because sometimes you need a laugh to keep going, sometimes you need a story to stay motivated, and sometimes you need a step-by-step guide to level up.
              </p>
              
              <p>
                This isn't just about LinkedIn. Great creators live across TikTok and Instagram too — but LinkedIn is where ambitious students come to build careers. If we can make the feed better, the whole student experience improves.
              </p>
            </div>
          </div>
        </Card>

        {/* Why Tech Students */}
        <Card className="p-8 mb-8 border border-border bg-card">
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-primary/20 p-2 rounded-lg">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h2 className="font-baron text-2xl font-semibold text-card-foreground">Why tech students first?</h2>
            </div>
            
            <div className="prose text-muted-foreground space-y-4">
              <p>
                I started with tech students because that's what I know best. I've been living in that ecosystem — recruiting, internships, conferences for my entire undergrad — so I knew where the gaps were. But this isn't just about tech.
              </p>
              
              <p className="bg-primary/10 p-4 rounded-lg border-l-4 border-primary text-card-foreground">
                This project is a <strong>call-out to LinkedIn</strong>: if you're the largest professional platform in the world, then the <strong>first 30 days for ambitious young people should feel like a competitive advantage, not a letdown.</strong>
              </p>
            </div>
          </div>
        </Card>

        {/* Scale of Problem */}
        <Card className="p-8 mb-8 border border-border bg-card">
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-secondary/20 p-2 rounded-lg">
                <TrendingUp className="w-6 h-6 text-secondary" />
              </div>
              <h2 className="font-baron text-2xl font-semibold text-card-foreground">The scale of the problem</h2>
            </div>
            
            <div className="prose text-muted-foreground space-y-4">
              <p>
                I only have ~3,000 followers. That's tiny compared to LinkedIn's <strong className="text-primary">234 million+ active users</strong>. And if even <strong className="text-secondary">30% of them are 18–25</strong>, that's around 70 million students and early professionals.
              </p>
              
              <p>
                No single creator — not even all of us combined — can match that reach. But LinkedIn <em>can</em>. With the right discovery features, they could get students to value in days, not months.
              </p>
            </div>
            
            {/* Stats */} 
            <div className="grid md:grid-cols-4 gap-6 mt-6">
              <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
                <div className="font-baron text-2xl font-bold text-primary">234M+</div>
                <div className="text-sm text-muted-foreground">LinkedIn users</div>
              </div>
              <div className="text-center p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                <div className="font-baron text-2xl font-bold text-secondary">70M+</div>
                <div className="text-sm text-muted-foreground">Est. students (18-25)</div>
              </div>
              <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
                <div className="font-baron text-2xl font-bold text-primary">5M+</div>
                <div className="text-sm text-muted-foreground">Combined followers</div>
              </div>
              <div className="text-center p-4 bg-accent/10 rounded-lg border border-accent/20">
                <div className="font-baron text-2xl font-bold text-accent">Months</div>
                <div className="text-sm text-muted-foreground">Time to valuable feed</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Why Creators */}
        <Card className="p-8 mb-8 border border-border bg-card">
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-accent/20 p-2 rounded-lg">
                <Lightbulb className="w-6 h-6 text-accent" />
              </div>
              <h2 className="font-baron text-2xl font-semibold text-card-foreground">Why creators?</h2>
            </div>
            
            <div className="prose text-muted-foreground space-y-4">
              <p>
                Because for our generation, <strong className="text-primary">creators are the new teachers.</strong> We've learned from YouTube tutorials, TikTok explainers, and LinkedIn career posts. Creators shape how we discover opportunities, learn skills, and see what's possible.
              </p>
              
              <p>
                The issue isn't whether students should follow creators. It's <em>which creators they should follow — and how fast they can find them.</em>
              </p>
            </div>
          </div>
        </Card>

        {/* The Experiment */}
        <Card className="p-8 mb-8 border border-border bg-card">
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-primary/20 p-2 rounded-lg">
                <Database className="w-6 h-6 text-primary" />
              </div>
              <h2 className="font-baron text-2xl font-semibold text-card-foreground">The experiment</h2>
            </div>
            
            <div className="prose text-muted-foreground space-y-4">
              <p>
                FixUrFeed is my student-led attempt at showing what's possible: a 1-minute quiz that matches you with 5 creators tailored to your goals and learning style. 
              </p>
              
              <p>
                The point isn't just the quiz — it's the <strong className="text-secondary">proof</strong>. I'm building a case analysis that shows why this discovery gap exists, why it matters, and how to close it.
              </p>
            </div>
          </div>
        </Card>

        {/* Follow the Journey */}
        <Card className="p-8 mb-8 border border-border bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-primary/20 p-2 rounded-lg">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <h2 className="font-baron text-2xl font-semibold text-card-foreground">Follow the journey</h2>
            </div>
            
            <div className="prose text-muted-foreground space-y-4">
              <p>
                I'm doing this in the open, because I'm learning too. This is my way of practicing product management: spotting a real problem, building a scrappy solution, and learning from feedback.
              </p>
              
              <p className="font-semibold text-primary">
                On <strong>Monday</strong>, I'll be dropping the <strong>full case analysis</strong>. 
                
                If you care about fixing career discovery, or if you just want a better feed, follow along. 
                
                Let's make LinkedIn more valuable for the next generation of ambitious students.
              </p>
              <a
            href="https://www.linkedin.com/in/coralminiel/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-semibold underline hover:text-primary/80"
          >
            Follow the journey → linkedin.com/in/coralminiel
          </a>
            </div>
          </div>
        </Card>

        {/* CTA Section */}
        <div className="text-center py-8">
          <h2 className="font-baron text-2xl font-semibold text-foreground mb-4">
            Ready to try the experiment?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Take the 1-minute quiz and see if we can match you with creators who actually help your tech career.
          </p>
          <Button 
            onClick={onTakeQuiz}
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 text-lg girlboss-glow font-semibold"
          >
            Take the Quiz
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Stats Footer */}
      </div>
    </div>
  );
}