import ChatRoom from './components/ChatRoom';
import { getQuestionData } from '@/lib/questionData';

export default function Home() {
  const questionData = getQuestionData();

  return (
    <main className="flex flex-col min-h-screen w-full max-w-4xl mx-auto">
      <h1 className="text-lg font-semibold p-2">Xoul Chat</h1>
      <div className="flex-grow">
        <ChatRoom questionData={questionData} />
      </div>
    </main>
  );
}