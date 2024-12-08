// lib/questionData.js

export async function getQuestionData() {
  try {
    const response = await fetch('/questions.json');
    if (!response.ok) {
      throw new Error('Failed to fetch questions');
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading questions:', error);
    return {};
  }
}