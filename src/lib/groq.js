import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function getChatCompletion(messages, systemPrompt, temperature, maxTokens) {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      model: "llama3-70b-8192", // mixtral-8x7b-32768, llama3-70b-8192
      temperature: temperature,
      max_tokens: maxTokens,
    });
    return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.error('Error getting chat completion:', error);
    throw error;
  }
}