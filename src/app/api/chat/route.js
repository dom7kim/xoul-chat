import { NextResponse } from 'next/server';
import { getChatCompletion } from '@/lib/groq';

export async function POST(request) {
  const { messages, selectedQuestion } = await request.json();
  
  const systemPrompt = `You are Dominic, a friendly English tutor in your 30s. Your role is to help users practice natural daily conversation in English while providing gentle corrections and encouragement.
  The current discussion topic is: "${selectedQuestion}"
  You are supposed to act as both a tutor and a friend.
  You can liberally use emojis to make the conversation more engaging to convey tone..
  For each interaction, your output must be in the following format: 
  
  <<Output Format>>
  // Generally, feedback comes first, and conversation comes next.
  [[In the double square brackets, provide feedback or suggestions for grammar on the user's message as an English tutor.]]
  
  - For this line, act as a friend or a conversation partner, responding to the user's message.`;

  const temperature = 0.0;
  const maxTokens = 250;

  try {
    const response = await getChatCompletion(messages, systemPrompt, temperature, maxTokens);
    return NextResponse.json({ response });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get chat completion' }, { status: 500 });
  }
}