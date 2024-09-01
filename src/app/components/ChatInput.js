import { useState, useRef } from 'react';
import { Mic, MicOff, Loader } from 'lucide-react';

export default function ChatInput({ onSendMessage, isDisabled, darkMode, largeFont }) {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isDisabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const toggleRecording = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/mp4' });
        const audioChunks = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };

        mediaRecorderRef.current.onstop = async () => {
          setIsTranscribing(true);
          const audioBlob = new Blob(audioChunks, { type: 'audio/mp4' });
          await processAudio(audioBlob);
          setIsTranscribing(false);
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);

        // Stop recording after 30 seconds
        setTimeout(() => {
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
          }
        }, 30000);
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    } else {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob) => {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.m4a');

    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const { text } = await response.json();
        setMessage(text);
      } else {
        console.error('Transcription failed:', await response.text());
      }
    } catch (error) {
      console.error('Error processing audio:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center">
      <button
        type="button"
        onClick={toggleRecording}
        className={`px-3 py-1 rounded-l-md focus:outline-none focus:ring-1 transition-colors ${
          isDisabled
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : darkMode
              ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300'
              : 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-200'
        } ${largeFont ? 'text-lg' : 'text-base'}`}
        disabled={isDisabled || isTranscribing}
      >
        {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
      </button>
      <div className="relative flex-grow">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`w-full px-2 py-1 border-y focus:outline-none focus:ring-1 ${
            darkMode
              ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-400 focus:ring-blue-300'
              : 'bg-white text-gray-800 border-gray-300 focus:border-blue-500 focus:ring-blue-200'
          } ${largeFont ? 'text-lg' : 'text-base'}`}
          placeholder={isDisabled ? "Select a topic to start chatting" : isTranscribing ? "Transcribing..." : "Type a message or click the mic to speak..."}
          disabled={isDisabled || isTranscribing}
        />
        {isTranscribing && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <Loader className="animate-spin h-5 w-5 text-gray-400" />
          </div>
        )}
      </div>
      <button
        type="submit"
        className={`px-3 py-1 rounded-r-md focus:outline-none focus:ring-1 transition-colors ${
          isDisabled || !message.trim() || isTranscribing
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : darkMode
              ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300'
              : 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-200'
        } ${largeFont ? 'text-lg' : 'text-base'}`}
        disabled={isDisabled || !message.trim() || isTranscribing}
      >
        Send
      </button>
    </form>
  );
}