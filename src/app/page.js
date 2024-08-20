import ChatRoom from './components/ChatRoom';
import { getQuestionData } from '@/lib/questionData';

export default function Home() {
  const questionData = getQuestionData();

  return (
    <main className="flex min-h-screen flex-col items-center p-2 w-full max-w-4xl mx-auto">
      <h1 className="text-lg font-semibold mb-2">Xoul Chat</h1>
      <ChatRoom questionData={questionData} />
    </main>
  );
}