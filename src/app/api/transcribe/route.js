import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import os from 'os';

const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

const groq = new Groq();

export async function POST(request) {
  console.log('Transcription request received');
  let tempFilePath = '';

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      console.log('No file uploaded');
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    console.log('File received, size:', file.size, 'bytes');

    // Save the file temporarily in the /tmp directory
    const buffer = Buffer.from(await file.arrayBuffer());
    tempFilePath = path.join(os.tmpdir(), `temp_audio_${Date.now()}.m4a`);
    await writeFile(tempFilePath, buffer);

    console.log('Temporary file saved:', tempFilePath);

    console.log('Sending transcription request to Groq');
    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(tempFilePath),
      model: "distil-whisper-large-v3-en",
      language: "en",
      temperature: 0.0,
    });

    console.log('Transcription received:', transcription.text);
    return NextResponse.json({ text: transcription.text });
  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json({ error: 'Transcription failed: ' + error.message }, { status: 500 });
  } finally {
    // Clean up: delete the temporary file
    if (tempFilePath) {
      try {
        await unlink(tempFilePath);
        console.log('Temporary file deleted');
      } catch (unlinkError) {
        console.error('Error deleting temporary file:', unlinkError);
      }
    }
  }
}