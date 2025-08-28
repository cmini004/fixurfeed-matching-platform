import React from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { CheckCircle, Database, Sparkles } from "lucide-react";

interface FeedbackSuccessProps {
  onOpenDatabase: () => void;
}

export function FeedbackSuccess({ onOpenDatabase }: FeedbackSuccessProps) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md mx-auto px-4">
        <Card className="p-8 text-center shadow-lg border border-gray-200">
          <div className="space-y-6">
            {/* Success Animation/Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="bg-green-100 p-4 rounded-full">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="w-6 h-6 text-accent animate-pulse" />
                </div>
              </div>
            </div>

            {/* Success Message */}
            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-gray-900">
                Thanks!
              </h1>
              <p className="text-gray-600">
                Your feedback helps us make better matches for future students.
              </p>
            </div>

            {/* CTA Button */}
            <Button 
              onClick={onOpenDatabase}
              className="w-full bg-primary text-white hover:bg-primary/90 py-3"
            >
              <Database className="w-5 h-5 mr-2" />
              Open Database
            </Button>

            {/* Thank you note */}
            <p className="text-sm text-gray-500">
              🎉 You're helping make Fix Your Feed better for everyone
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}