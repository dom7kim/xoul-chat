import { NextResponse } from 'next/server';

const UNREAL_SPEECH_API_URL = 'https://api.v8.unrealspeech.com/speech';
const UNREAL_SPEECH_API_KEY = process.env.UNREAL_SPEECH_API_KEY;

// Improved function to remove emojis from text
function removeEmojis(text) {
  return text.replace(
    /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
    ''
  ).replace(/\s+/g, ' ').trim();
}

export async function POST(request) {
  const { text } = await request.json();

  // Remove emojis from the input text
  const filteredText = removeEmojis(text);

  // console.log('Original text:', text);
  // console.log('Filtered text:', filteredText);

  try {
    const response = await fetch(UNREAL_SPEECH_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${UNREAL_SPEECH_API_KEY}`
      },
      body: JSON.stringify({
        Text: filteredText,
        VoiceId: 'Sierra',
        Bitrate: '128k',
        Speed: '0',
        Pitch: '1.0',
        TimestampType: 'sentence'
      })
    });

    if (!response.ok) {
      throw new Error('Unreal Speech API request failed');
    }

    const data = await response.json();

    // Fetch the audio file from the provided OutputUri
    const audioResponse = await fetch(data.OutputUri);
    if (!audioResponse.ok) {
      throw new Error('Failed to fetch audio file');
    }

    const audioBuffer = await audioResponse.arrayBuffer();

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