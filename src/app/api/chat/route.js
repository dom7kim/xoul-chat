import { NextResponse } from 'next/server';
import { getChatCompletion } from '@/lib/groq';

export async function POST(request) {
  const { messages, selectedQuestion, context } = await request.json();
  
  const systemPrompt = `You are Stephanie, a friendly English tutor in your 30s. Your role is to help users practice natural daily conversation in English while providing gentle corrections and encouragement.
  ${context ? `Context: ${context}` : ''}
  The current discussion topic is: "${selectedQuestion}"
  You are supposed to act as both a tutor and a friend.
  You can liberally use emojis to make the conversation more engaging to convey tone.
  
  You must respond in JSON format with the following structure:
  {
    "feedback": "Provide feedback or suggestions for grammar on the user's message as an English tutor. If there are no issues, provide encouragement.",
    "response": "Act as a friend or conversation partner, responding to the user's message"
  }`;

  const temperature = 0.0;
  const maxTokens = 250;

  try {
    const response = await getChatCompletion(messages, systemPrompt, temperature, maxTokens, true);
    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error in chat route:', error);
    return NextResponse.json({ error: 'Failed to get chat completion' }, { status: 500 });
  }
}