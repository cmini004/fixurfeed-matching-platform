import React from "react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Input } from "./ui/input";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface QuizField {
  key: string;
  label: string;
  type: 'single' | 'multiple';
  options: string[];
}

interface QuizQuestion {
  id: string;
  title: string;
  subtitle: string;
  skipOption?: boolean;
  maxSelections?: number;
  fields: QuizField[];
}

interface QuizResponse {
  gender: string;
  ethnicity: string[];
  careerJourney: string[];
  goals: string[];
  contentCare: string[];
  contentPreference: string[];
}

interface QuizFlowProps {
  onComplete: (responses: QuizResponse) => void;
  onBack: () => void;
}

export function QuizFlow({ onComplete, onBack }: QuizFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<QuizResponse>({
    gender: '',
    ethnicity: [],
    careerJourney: [],
    goals: [],
    contentCare: [],
    contentPreference: []
  });

  const questions: QuizQuestion[] = [
    {
      id: 'gender',
      title: 'Gender',
      subtitle: '',
      skipOption: true,
      fields: [
        {
          key: 'gender',
          label: '',
          type: 'single' as const,
          options: ['Man', 'Woman', 'Other']
        }
      ]
    },
    {
      id: 'ethnicity',
      title: 'Race / Ethnicity',
      subtitle: 'Select all that apply',
      skipOption: true,
      fields: [
        {
          key: 'ethnicity',
          label: '',
          type: 'multiple' as const,
          options: [
            'Asian',
            'Black / African American',
            'Latino / Hispanic',
            'White / Caucasian',
            'Middle Eastern / North African',
            'Native American / Indigenous',
            'Pacific Islander',
            'Mixed / Multiracial',
            'Other'
          ]
        }
      ]
    },
    {
      id: 'journey',
      title: 'Where are you in your journey?',
      subtitle: 'Select all that apply to your current situation',
      fields: [
        {
          key: 'careerJourney',
          label: '',
          type: 'multiple' as const,
          options: [
            'Still in school',
            'Recent graduate',
            'Entry-level professional',
            'Career changer',
            'Entrepreneur / Founder',
            'Looking for my first job',
            'Between jobs',
            'Exploring new opportunities'
          ]
        }
      ]
    },
    {
      id: 'goals',
      title: 'What are your career goals?',
      subtitle: 'Select the specific fields you want to work in or learn about',
      fields: [
        {
          key: 'goals',
          label: '',
          type: 'multiple' as const,
          options: [
            'Marketing in tech',
            'Product management',
            'Entrepreneurship',
            'Data science',
            'Software engineering',
            'AI / Machine learning',
            'Cybersecurity'
          ]
        }
      ]
    },
    {
      id: 'contentCare',
      title: 'What do you care about in content?',
      subtitle: 'Choose what matters to you',
      fields: [
        {
          key: 'contentCare',
          label: '',
          type: 'multiple' as const,
          options: [
            'Someone who looks like me',
            'Has first gen experience',
            'Someone whose company was acquired',
            'Someone with more experience (senior)',
            'Doesn\'t matter'
          ]
        }
      ]
    },
    {
      id: 'content',
      title: 'What kind of content do you like?',
      subtitle: 'Select up to 6 options that appeal to you most',
      maxSelections: 6,
      fields: [
        {
          key: 'contentPreference',
          label: '',
          type: 'multiple' as const,
          options: [
            'Personal brand',
            'Getting an internship',
            'First gen',
            'Mental health',
            'Tech skills & coding',
            'Salary negotiation',
            'Salary transparent',
            'Straight to the point',
            'Mental health focused'
          ]
        }
      ]
    }
  ];

  const currentQuestion = questions[currentStep];
  const totalSteps = questions.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleOptionSelect = (key: string, value: string, type: 'single' | 'multiple') => {
    if (type === 'single') {
      setResponses((prev: QuizResponse) => ({
        ...prev,
        [key]: value
      }));
    } else if (type === 'multiple') {
      setResponses((prev: QuizResponse) => {
        const currentValues = prev[key as keyof QuizResponse] as string[];
        const maxSelections = questions[currentStep].maxSelections;
        
        let newValues: string[];
        if (currentValues.includes(value)) {
          // Remove if already selected
          newValues = currentValues.filter(v => v !== value);
        } else {
          // Add if not at max limit
          if (!maxSelections || currentValues.length < maxSelections) {
            newValues = [...currentValues, value];
          } else {
            // Replace first item if at max limit
            newValues = [...currentValues.slice(1), value];
          }
        }
        
        return {
          ...prev,
          [key]: newValues
        };
      });
    }
  };


  const handleSkip = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev: number) => prev + 1);
    } else {
      onComplete(responses);
    }
  };

  const isCurrentStepValid = () => {
    // Special case for intro step - always valid
    // Skip option allows moving forward without selection
    if (currentQuestion.skipOption) {
      return true;
    }
    
    // Skip option allows moving forward without selection
    if (currentQuestion.skipOption) {
      return true;
    }
    
    return currentQuestion.fields.every((field: QuizField) => {
      const value = responses[field.key as keyof QuizResponse];
      if (field.type === 'single') {
        return value !== '';
      } else {
        return Array.isArray(value) && value.length > 0;
      }
    });
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev: number) => prev + 1);
    } else {
      onComplete(responses);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev: number) => prev - 1);
    } else {
      onBack();
    }
  };

  const isOptionSelected = (key: string, value: string, type: 'single' | 'multiple') => {
    const currentValue = responses[key as keyof QuizResponse];
    if (type === 'single') {
      return currentValue === value;
    } else if (type === 'multiple') {
      return Array.isArray(currentValue) && currentValue.includes(value);
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-baron text-2xl font-bold text-foreground mb-2">
            Find Your Perfect Creator Match
          </h1>
          <p className="text-muted-foreground">
            Step {currentStep + 1} of {totalSteps}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="p-8 shadow-lg border border-border bg-card mb-8">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="font-baron text-xl font-bold text-card-foreground">
                {currentQuestion.title}
              </h2>
              <p className="text-muted-foreground">
                {currentQuestion.subtitle}
              </p>
            </div>

            <div className="space-y-6">
              {/* Show intro text for first question */}
              {currentQuestion.id === 'about-you' && (
                <div className="text-center py-8">
                  <p className="text-lg text-muted-foreground mb-6">
                    We'll ask you a few quick questions to find your perfect creator matches.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    This will take less than 2 minutes.
                  </p>
                </div>
              )}
              
              {currentQuestion.fields.map((field: QuizField) => (
                <div key={field.key} className="space-y-4">
                  {field.label && (
                    <h3 className="font-baron font-medium text-card-foreground">{field.label}</h3>
                  )}
                  
                  <>
                      {/* Show selection limit if applicable */}
                      {field.type === 'multiple' && currentQuestion.maxSelections && (
                        <p className="text-sm text-muted-foreground">
                          Select up to {currentQuestion.maxSelections} options
                          {(responses[field.key as keyof QuizResponse] as string[])?.length > 0 && (
                            <span className="ml-2">
                              ({(responses[field.key as keyof QuizResponse] as string[]).length}/{currentQuestion.maxSelections} selected)
                            </span>
                          )}
                        </p>
                      )}
                      
                      <div className="grid gap-3">
                        {field.options.map((option) => (
                          <button
                            key={option}
                            onClick={() => handleOptionSelect(field.key, option, field.type)}
                            className={`p-4 rounded-lg border-2 text-left transition-all hover:scale-[1.02] ${
                              isOptionSelected(field.key, option, field.type)
                                ? 'border-primary bg-primary/10'
                                : 'border-border hover:border-primary/50 bg-card'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                isOptionSelected(field.key, option, field.type)
                                  ? 'border-primary bg-primary'
                                  : 'border-muted-foreground'
                              }`}>
                                {isOptionSelected(field.key, option, field.type) && (
                                  <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                                )}
                              </div>
                              <span className="font-medium text-card-foreground">{option}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                  </>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            className="border-border bg-card text-card-foreground hover:bg-card/80"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {currentStep === 0 ? 'Back to Home' : 'Previous'}
          </Button>

          <div className="flex gap-3">
            {/* Show skip button for questions that allow skipping */}
            {currentQuestion.skipOption && (
              <Button
                variant="outline"
                onClick={handleSkip}
                className="border-border bg-card text-card-foreground hover:bg-card/80"
              >
                Skip
              </Button>
            )}
            
            <Button
              onClick={handleNext}
              disabled={!isCurrentStepValid()}
              className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed girlboss-glow font-semibold"
            >
              {currentStep === totalSteps - 1 ? 'See My Matches' : 'Next'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}