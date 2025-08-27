import React from "react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { Heart, Star, Sparkles, Loader2 } from "lucide-react";
import { submitFeedback } from "../services/feedbackStorage";


interface FeedbackGateProps {
  onSubmit: () => void;
  onCancel: () => void;
}

export function FeedbackGate({ onSubmit, onCancel }: FeedbackGateProps) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [improvements, setImprovements] = useState("");
  const [consent, setConsent] = useState(false);
  const [selectedToggles, setSelectedToggles] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const toggleOptions = [
    "Too senior",
    "Too junior", 
    "Not my role",
    "Love the vibe"
  ];

  const handleToggle = (option: string) => {
    setSelectedToggles(prev => 
      prev.includes(option)
        ? prev.filter(t => t !== option)
        : [...prev, option]
    );
  };

  const handleSubmit = async () => {
    if (rating > 0 && consent) {
      setIsSubmitting(true);
      setSubmitError(null);
      
      try {
        const success = await submitFeedback({
          rating,
          feedback,
          improvements,
          selectedToggles,
          timestamp: new Date().toISOString()
        });
        
        if (success) {
          onSubmit();
        } else {
          setSubmitError("Failed to save feedback. Please try again.");
        }
      } catch (error) {
        setSubmitError("An error occurred while saving feedback.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const isValid = rating > 0 && consent;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-accent/10 p-3 rounded-full">
              <Heart className="w-8 h-8 text-accent" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Help us help students like you
          </h1>
          <p className="text-gray-600">
            Fix Your Feed is a student-led experiment. Your quick feedback makes the matching smarter for the next person.
          </p>
        </div>

        {/* Feedback Form */}
        <Card className="p-8 shadow-lg border border-gray-200">
          <div className="space-y-6">
            {/* Rating */}
            <div className="space-y-3">
              <label className="block font-medium text-gray-900">
                How useful were these matches?
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`p-2 rounded-lg transition-colors ${
                      star <= rating 
                        ? 'text-yellow-500' 
                        : 'text-gray-300 hover:text-yellow-400'
                    }`}
                  >
                    <Star className="w-6 h-6 fill-current" />
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback Text */}
            <div className="space-y-3">
              <label className="block font-medium text-gray-900">
                Tell us why (1-2 sentences)
              </label>
              <Textarea
                value={feedback}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFeedback(e.target.value)}
                placeholder="What worked well or didn't work about these matches?"
                className="resize-none h-20"
              />
            </div>

            {/* Improvements */}
            <div className="space-y-3">
              <label className="block font-medium text-gray-900">
                Anything missing you wish we included? (optional)
              </label>
              <Textarea
                value={improvements}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setImprovements(e.target.value)}
                placeholder="Tell us what would make this better..."
                className="resize-none h-20"
              />
            </div>

            {/* Quick Toggles */}
            <div className="space-y-3">
              <label className="block font-medium text-gray-900">
                Quick feedback
              </label>
              <div className="flex flex-wrap gap-2">
                {toggleOptions.map((option) => (
                  <Badge
                    key={option}
                    variant={selectedToggles.includes(option) ? "default" : "outline"}
                    className={`cursor-pointer transition-colors ${
                      selectedToggles.includes(option)
                        ? 'bg-primary text-white'
                        : 'hover:bg-primary/5'
                    }`}
                    onClick={() => handleToggle(option)}
                  >
                    {option}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Consent */}
            <div className="flex items-start space-x-3">
              <Checkbox
                checked={consent}
                onCheckedChange={setConsent}
                className="mt-1"
              />
              <label className="text-sm text-gray-600 cursor-pointer" onClick={() => setConsent(!consent)}>
                I'm okay with you using anonymized feedback to improve matches.
              </label>
            </div>

            {/* Error Message */}
            {submitError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{submitError}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-4 pt-4">
              <Button
                onClick={onCancel}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!isValid || isSubmitting}
                className="flex-1 bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:text-white"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                {isSubmitting ? 'Saving...' : 'Submit Feedback'}
              </Button>
            </div>
          </div>
        </Card>

        {/* Bottom Note */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Your feedback helps us create better matches for future students</p>
        </div>
      </div>
    </div>
  );
}