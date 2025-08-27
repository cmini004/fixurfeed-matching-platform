interface EmailSubmission {
  email: string;
  matches: any[];
  timestamp: string;
  quizResponses: any;
}

class EmailStorage {
  private static STORAGE_KEY = 'fixUrFeed_emails';

  static saveEmailSubmission(submission: EmailSubmission): void {
    try {
      const existingSubmissions = this.getAllSubmissions();
      existingSubmissions.push({
        ...submission,
        timestamp: new Date().toISOString()
      });
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingSubmissions));
    } catch (error) {
      console.error('Failed to save email submission:', error);
    }
  }

  static getAllSubmissions(): EmailSubmission[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to retrieve email submissions:', error);
      return [];
    }
  }

  static getSubmissionsByEmail(email: string): EmailSubmission[] {
    const allSubmissions = this.getAllSubmissions();
    return allSubmissions.filter(submission => submission.email === email);
  }

  static exportSubmissions(): string {
    const submissions = this.getAllSubmissions();
    return JSON.stringify(submissions, null, 2);
  }
}

export { EmailStorage, type EmailSubmission };