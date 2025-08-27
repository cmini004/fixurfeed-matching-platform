interface MatchSession {
  id: string;
  timestamp: string;
  email: string;
  quizResponses: {
    email: string;
    gender: string;
    ethnicity: string[];
    careerJourney: string[];
    vibes: string[];
    contentPreference: string[];
  };
  matches: any[];
  feedback?: FeedbackSubmission;
}

interface FeedbackSubmission {
  sessionId: string;
  timestamp: string;
  email: string;
  overallSatisfaction: number;
  matchQuality: number;
  recommendations: string;
  wouldRecommend: boolean;
  additionalComments?: string;
}

interface Analytics {
  totalSessions: number;
  totalFeedback: number;
  averageSatisfaction: number;
  averageMatchQuality: number;
  topContentPreferences: { [key: string]: number };
  topVibes: { [key: string]: number };
  genderDistribution: { [key: string]: number };
  ethnicityDistribution: { [key: string]: number };
}

class DataStorage {
  private static MATCHES_STORAGE_KEY = 'fixUrFeed_matches';
  private static FEEDBACK_STORAGE_KEY = 'fixUrFeed_feedback';
  private static ANALYTICS_STORAGE_KEY = 'fixUrFeed_analytics';

  // Session Management
  static saveMatchSession(session: Omit<MatchSession, 'id' | 'timestamp'>): string {
    const sessionId = this.generateId();
    const fullSession: MatchSession = {
      ...session,
      id: sessionId,
      timestamp: new Date().toISOString(),
    };

    try {
      const existingSessions = this.getAllMatchSessions();
      existingSessions.push(fullSession);
      localStorage.setItem(this.MATCHES_STORAGE_KEY, JSON.stringify(existingSessions));
      
      // Update analytics
      this.updateAnalytics(fullSession);
      
      return sessionId;
    } catch (error) {
      console.error('Failed to save match session:', error);
      return sessionId;
    }
  }

  static getAllMatchSessions(): MatchSession[] {
    try {
      const stored = localStorage.getItem(this.MATCHES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to retrieve match sessions:', error);
      return [];
    }
  }

  static getMatchSession(sessionId: string): MatchSession | null {
    const sessions = this.getAllMatchSessions();
    return sessions.find(session => session.id === sessionId) || null;
  }

  // Feedback Management
  static saveFeedback(feedback: Omit<FeedbackSubmission, 'timestamp'>): void {
    const fullFeedback: FeedbackSubmission = {
      ...feedback,
      timestamp: new Date().toISOString(),
    };

    try {
      // Save to feedback storage
      const existingFeedback = this.getAllFeedback();
      existingFeedback.push(fullFeedback);
      localStorage.setItem(this.FEEDBACK_STORAGE_KEY, JSON.stringify(existingFeedback));

      // Update the corresponding match session
      const sessions = this.getAllMatchSessions();
      const sessionIndex = sessions.findIndex(s => s.id === feedback.sessionId);
      if (sessionIndex >= 0) {
        sessions[sessionIndex].feedback = fullFeedback;
        localStorage.setItem(this.MATCHES_STORAGE_KEY, JSON.stringify(sessions));
      }

      // Update analytics
      this.updateFeedbackAnalytics(fullFeedback);
    } catch (error) {
      console.error('Failed to save feedback:', error);
    }
  }

  static getAllFeedback(): FeedbackSubmission[] {
    try {
      const stored = localStorage.getItem(this.FEEDBACK_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to retrieve feedback:', error);
      return [];
    }
  }

  static getFeedbackByEmail(email: string): FeedbackSubmission[] {
    const allFeedback = this.getAllFeedback();
    return allFeedback.filter(feedback => feedback.email === email);
  }

  // Analytics
  static getAnalytics(): Analytics {
    try {
      const stored = localStorage.getItem(this.ANALYTICS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : this.initializeAnalytics();
    } catch (error) {
      console.error('Failed to retrieve analytics:', error);
      return this.initializeAnalytics();
    }
  }

  private static initializeAnalytics(): Analytics {
    return {
      totalSessions: 0,
      totalFeedback: 0,
      averageSatisfaction: 0,
      averageMatchQuality: 0,
      topContentPreferences: {},
      topVibes: {},
      genderDistribution: {},
      ethnicityDistribution: {},
    };
  }

  private static updateAnalytics(session: MatchSession): void {
    try {
      const analytics = this.getAnalytics();
      
      analytics.totalSessions++;

      // Update content preferences
      session.quizResponses.contentPreference.forEach(pref => {
        analytics.topContentPreferences[pref] = (analytics.topContentPreferences[pref] || 0) + 1;
      });

      // Update vibes
      session.quizResponses.vibes.forEach(vibe => {
        analytics.topVibes[vibe] = (analytics.topVibes[vibe] || 0) + 1;
      });

      // Update gender distribution
      if (session.quizResponses.gender) {
        analytics.genderDistribution[session.quizResponses.gender] = 
          (analytics.genderDistribution[session.quizResponses.gender] || 0) + 1;
      }

      // Update ethnicity distribution
      session.quizResponses.ethnicity.forEach(eth => {
        analytics.ethnicityDistribution[eth] = (analytics.ethnicityDistribution[eth] || 0) + 1;
      });

      localStorage.setItem(this.ANALYTICS_STORAGE_KEY, JSON.stringify(analytics));
    } catch (error) {
      console.error('Failed to update analytics:', error);
    }
  }

  private static updateFeedbackAnalytics(feedback: FeedbackSubmission): void {
    try {
      const analytics = this.getAnalytics();
      
      analytics.totalFeedback++;

      // Update satisfaction averages
      const allFeedback = this.getAllFeedback();
      const totalSatisfaction = allFeedback.reduce((sum, f) => sum + f.overallSatisfaction, 0);
      const totalMatchQuality = allFeedback.reduce((sum, f) => sum + f.matchQuality, 0);
      
      analytics.averageSatisfaction = totalSatisfaction / allFeedback.length;
      analytics.averageMatchQuality = totalMatchQuality / allFeedback.length;

      localStorage.setItem(this.ANALYTICS_STORAGE_KEY, JSON.stringify(analytics));
    } catch (error) {
      console.error('Failed to update feedback analytics:', error);
    }
  }

  // Export functionality
  static exportData(): {
    sessions: MatchSession[];
    feedback: FeedbackSubmission[];
    analytics: Analytics;
  } {
    return {
      sessions: this.getAllMatchSessions(),
      feedback: this.getAllFeedback(),
      analytics: this.getAnalytics(),
    };
  }

  static exportCSV(): string {
    const sessions = this.getAllMatchSessions();
    const headers = [
      'Session ID', 'Timestamp', 'Email', 'Gender', 'Ethnicity', 'Career Journey',
      'Vibes', 'Content Preferences', 'Matches Count', 'Has Feedback',
      'Satisfaction', 'Match Quality', 'Would Recommend'
    ];

    const rows = sessions.map(session => [
      session.id,
      session.timestamp,
      session.email,
      session.quizResponses.gender || '',
      session.quizResponses.ethnicity.join('; '),
      session.quizResponses.careerJourney.join('; '),
      session.quizResponses.vibes.join('; '),
      session.quizResponses.contentPreference.join('; '),
      session.matches.length.toString(),
      session.feedback ? 'Yes' : 'No',
      session.feedback?.overallSatisfaction?.toString() || '',
      session.feedback?.matchQuality?.toString() || '',
      session.feedback?.wouldRecommend?.toString() || ''
    ]);

    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
      .join('\\n');
  }

  // Utility methods
  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  static clearAllData(): void {
    localStorage.removeItem(this.MATCHES_STORAGE_KEY);
    localStorage.removeItem(this.FEEDBACK_STORAGE_KEY);
    localStorage.removeItem(this.ANALYTICS_STORAGE_KEY);
  }

  // Get summary stats for dashboard
  static getSummaryStats() {
    const sessions = this.getAllMatchSessions();
    const feedback = this.getAllFeedback();
    const analytics = this.getAnalytics();

    return {
      totalSessions: sessions.length,
      sessionsToday: sessions.filter(s => 
        new Date(s.timestamp).toDateString() === new Date().toDateString()
      ).length,
      totalFeedback: feedback.length,
      feedbackRate: sessions.length > 0 ? (feedback.length / sessions.length * 100).toFixed(1) : '0',
      averageSatisfaction: analytics.averageSatisfaction.toFixed(1),
      topContentPreference: Object.entries(analytics.topContentPreferences)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A',
    };
  }
}

export { 
  DataStorage, 
  type MatchSession, 
  type FeedbackSubmission, 
  type Analytics 
};