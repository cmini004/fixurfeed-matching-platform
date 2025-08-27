interface FeedbackData {
  rating: number;
  feedback: string;
  improvements: string;
  selectedToggles: string[];
  timestamp: string;
}

export async function submitFeedback(feedbackData: FeedbackData): Promise<boolean> {
  try {
    // Store in localStorage
    const existingData = JSON.parse(localStorage.getItem('feedbackData') || '[]');
    const newEntry = {
      ...feedbackData,
      timestamp: new Date().toISOString(),
    };
    
    existingData.push(newEntry);
    localStorage.setItem('feedbackData', JSON.stringify(existingData));
    
    console.log('Feedback stored locally:', newEntry);
    return true;
  } catch (error) {
    console.error('Failed to store feedback:', error);
    return false;
  }
}

// Export feedback data as CSV/Excel file
export function exportFeedbackAsCSV() {
  const feedbackData = JSON.parse(localStorage.getItem('feedbackData') || '[]');
  if (feedbackData.length === 0) {
    alert('No feedback data to export');
    return;
  }

  const headers = ['Timestamp', 'Rating', 'Feedback', 'Improvements', 'Quick Feedback'];
  const csvContent = [
    headers.join(','),
    ...feedbackData.map((item: FeedbackData) => [
      item.timestamp,
      item.rating,
      `"${item.feedback.replace(/"/g, '""')}"`,
      `"${item.improvements.replace(/"/g, '""')}"`,
      `"${item.selectedToggles.join(', ')}"`
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `feedback-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
}

// Get all stored feedback data
export function getAllFeedback(): FeedbackData[] {
  return JSON.parse(localStorage.getItem('feedbackData') || '[]');
}