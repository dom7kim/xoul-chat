import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Loader } from 'lucide-react';

const RECORDING_TIME_LIMIT = 30; // in seconds

export default function ChatInput({ onSendMessage, isDisabled, darkMode, largeFont }) {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [previousMessage, setPreviousMessage] = useState('');
  const mediaRecorderRef = useRef(null);
  const timerRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => {
          if (prevTime >= RECORDING_TIME_LIMIT - 1) {
            stopRecording();
            return 0;
          }
          return prevTime + 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      setRecordingTime(0);
    }

    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const startRecording = async () => {
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
      setPreviousMessage(message);
      setMessage('');
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
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
        setMessage(''); // Clear the message if transcription fails
      }
    } catch (error) {
      console.error('Error processing audio:', error);
      setMessage(''); // Clear the message if there's an error
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isDisabled && !isRecording && !isTranscribing) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const buttonClasses = `px-2 flex items-center justify-center focus:outline-none focus:ring-1 transition-colors h-9`;

  const inputClasses = `w-full px-2 py-1.5 focus:outline-none focus:ring-1 ${
    darkMode
      ? 'bg-gray-700 text-white border-gray-600 focus:border-blue-400 focus:ring-blue-300'
      : 'bg-white text-gray-800 border-gray-300 focus:border-blue-500 focus:ring-blue-200'
  }`;

  return (
    <form onSubmit={handleSubmit} className="relative flex w-full min-h-[36px]">
      <div className="absolute left-0 bottom-0 w-9">
        <button
          type="button"
          onClick={toggleRecording}
          className={`${buttonClasses} rounded-l-md border-y border-l ${
            isDisabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300'
              : isRecording
                ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-300 border-red-600'
                : darkMode
                  ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300 border-blue-600'
                  : 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-200 border-blue-500'
          }`}
          disabled={isDisabled || isTranscribing}
        >
          {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
        </button>
      </div>

      <div className="flex-grow ml-9 mr-14">
        <div className="relative w-full -ml-[1px]">
          <textarea
            ref={textareaRef}
            rows={1}
            value={isRecording || isTranscribing ? '' : message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            className={`${inputClasses} ${largeFont ? 'text-base' : 'text-sm'} resize-none overflow-hidden min-h-[36px] max-h-[120px] w-full block border rounded-none`}
            placeholder={
              isDisabled
                ? "Select a topic to start chatting"
                : isRecording
                  ? "Listening ..."
                  : isTranscribing
                    ? "Transcribing ..."
                    : "Type a message or click the mic to speak..."
            }
            disabled={isDisabled || isRecording || isTranscribing}
          />
          {isRecording && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
              <span className="text-xs text-gray-400">{RECORDING_TIME_LIMIT - recordingTime}s</span>
            </div>
          )}
          {isTranscribing && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
              <Loader className="animate-spin h-4 w-4 text-gray-400" />
            </div>
          )}
        </div>
      </div>

      <div className="absolute right-0 bottom-0 w-14 -ml-[1px]">
        <button
          type="submit"
          className={`${buttonClasses} rounded-r-md border-y border-r ${
            isDisabled || !message.trim() || isRecording || isTranscribing
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300'
              : darkMode
                ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300 border-blue-600'
                : 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-200 border-blue-500'
          }`}
          disabled={isDisabled || !message.trim() || isRecording || isTranscribing}
        >
          Send
        </button>
      </div>
    </form>
  );
}