import React from "react";
import { Button } from "./ui/button";
import { Lock } from "lucide-react";

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isDatabaseUnlocked: boolean;
}

export function Navigation({ currentPage, onPageChange, isDatabaseUnlocked }: NavigationProps) {
  const handleDatabaseClick = () => {
    if (isDatabaseUnlocked) {
      onPageChange('database');
    } else {
      // Show feedback gate if database is locked
      onPageChange('feedback-gate');
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <button 
            onClick={() => onPageChange('landing')}
            className="font-baron text-xl font-bold text-primary hover:text-primary/80 transition-colors"
          >
            FixUrFeed
          </button>
          
          <div className="hidden md:flex space-x-6">
            <button
              onClick={() => onPageChange('landing')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                currentPage === 'landing'
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Home
            </button>
            
            <button
              onClick={() => onPageChange('about')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                currentPage === 'about'
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              About
            </button>
            
          </div>
        </div>
        
        <Button 
          onClick={() => onPageChange('quiz')}
          className="bg-primary text-primary-foreground hover:bg-primary/90 girlboss-glow font-semibold"
        >
          Take the Quiz
        </Button>
      </div>
    </nav>
  );
}