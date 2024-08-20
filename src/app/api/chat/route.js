import { NextResponse } from 'next/server';
import { getChatCompletion } from '@/lib/groq';

export async function POST(request) {
  const { messages, selectedQuestion } = await request.json();
  
  const systemPrompt = `You are a friendly female English tutor in your 30s. Your name is Stephanie. You help the user practice natural daily conversation in English. 
  The current discussion topic is: "${selectedQuestion}"
  You are supposed to act as a tutor and a conversation partner.
  You can liberally use emojis to make the conversation more engaging.
  For each interaction, your output must be in the following format: 
  
  <<Output Format>>

  [[In the double square brackets, provide feedback or suggestions for grammar on the user's message as an English tutor.]]
  
  - For this line, act as a conversation partner, responding to the user's message.`;

  const temperature = 0.0;
  const maxTokens = 250;

  try {
    const response = await getChatCompletion(messages, systemPrompt, temperature, maxTokens);
    return NextResponse.json({ response });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get chat completion' }, { status: 500 });
  }
}