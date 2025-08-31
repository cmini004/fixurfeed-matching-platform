import React from 'react';
import { useState } from "react";
import { Navigation } from "./components/Navigation";
import { LandingPage } from "./components/LandingPage";
import { QuizFlow } from "./components/QuizFlow";
import { MatchResults } from "./components/MatchResults";
import { About } from "./components/About";
import { matchCreators } from "./utils/creatorMatcher";

interface QuizResponse {
  gender: string;
  ethnicity: string[];
  careerJourney: string[];
  goals: string[];
  contentCare: string[];
  contentPreference: string[];
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [quizResponses, setQuizResponses] = useState<QuizResponse | null>(null);

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  const handleStartQuiz = () => {
    setCurrentPage('quiz');
  };

  const handleQuizComplete = (responses: QuizResponse) => {
    setQuizResponses(responses);
    setCurrentPage('results');
  };

  const handleFeedbackGate = () => {
    // Open Google form in new tab
    window.open('https://docs.google.com/forms/d/e/1FAIpQLSckzWvnJHWHXteCmhdhg2bt4roprKKIGUV3431KTW0KGrUAwA/viewform', '_blank');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return (
          <LandingPage 
            onStartQuiz={handleStartQuiz}
          />
        );
      
      case 'about':
        return (
          <About 
            onTakeQuiz={handleStartQuiz}
          />
        );
      
      
      case 'quiz':
        return (
          <QuizFlow 
            onComplete={handleQuizComplete}
            onBack={() => handlePageChange('landing')}
          />
        );
      
      case 'results':
        return quizResponses ? (
          <MatchResults 
            quizResponses={quizResponses}
          />
        ) : (
          <LandingPage 
            onStartQuiz={handleStartQuiz}
          />
        );
      
      
      default:
        return (
          <LandingPage 
            onStartQuiz={handleStartQuiz}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground dark">
      {currentPage !== 'quiz' && (
        <Navigation 
          currentPage={currentPage}
          onPageChange={handlePageChange}
          isDatabaseUnlocked={false}
        />
      )}
      {renderCurrentPage()}
    </div>
  );
}