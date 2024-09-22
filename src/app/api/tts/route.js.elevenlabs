import { NextResponse } from 'next/server';
import { ElevenLabsClient, ElevenLabs } from "elevenlabs";

const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });

export async function POST(request) {
  const { text } = await request.json();

  try {
    const audioStream = await client.textToSpeech.convert("cgSgspJ2msm6clMCkdW9", {
      optimize_streaming_latency: ElevenLabs.OptimizeStreamingLatency.Zero,
      output_format: ElevenLabs.OutputFormat.Mp32205032,
      text: text,
      voice_settings: {
        stability: 0.3,
        similarity_boost: 0.5,
        style: 0.2
      }
    });

    // Convert the audio stream to a buffer
    const chunks = [];
    for await (const chunk of audioStream) {
      chunks.push(chunk);
    }
    const audioBuffer = Buffer.concat(chunks);

    // Return the audio buffer as a response
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error) {
    console.error('Text-to-speech conversion failed:', error);
    return NextResponse.json({ error: 'Text-to-speech conversion failed' }, { status: 500 });
  }
}