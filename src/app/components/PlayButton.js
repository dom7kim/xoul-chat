import { useState } from 'react';
import { Play, Pause, Loader } from 'lucide-react';

export default function PlayButton({ text, darkMode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audio, setAudio] = useState(null);

  const handlePlay = async () => {
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    if (audio) {
      audio.play();
      setIsPlaying(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error('TTS request failed');

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const newAudio = new Audio(audioUrl);

      newAudio.onended = () => setIsPlaying(false);
      setAudio(newAudio);
      newAudio.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('Failed to play audio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePlay}
      className={`p-1 rounded-full focus:outline-none focus:ring-2 ${
        darkMode
          ? 'bg-gray-700 text-white hover:bg-gray-600 focus:ring-gray-500'
          : 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400'
      }`}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : isPlaying ? (
        <Pause className="w-4 h-4" />
      ) : (
        <Play className="w-4 h-4" />
      )}
    </button>
  );
}
