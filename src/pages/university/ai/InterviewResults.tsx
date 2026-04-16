import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Navbar } from '../../../components/Navbar';

export default function InterviewResults({ answersProp, onRunAgain, onBack }: { answersProp?: any[], onRunAgain?: () => void, onBack?: () => void }) {
  const [answers, setAnswers] = useState<Array<any>>(answersProp || []);
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!answersProp) {
      const stored = sessionStorage.getItem('mock_interview_answers');
      const data = stored ? JSON.parse(stored) : [];
      setAnswers(data);
    }
    // Mock scoring and feedback
    setTimeout(() => {
      setScore(78);
      setFeedback([
        'Good structure in answers, add more measurable results.',
        'Provide one concrete technical detail for your React project.',
        'Confidence and pacing are fine.'
      ]);
    }, 600);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">AI Mock Interview — Results</h1>

        <div className="bg-white rounded-lg p-6 shadow">
          <div className="mb-4">
            <h2 className="text-lg font-medium">Overall Performance Score</h2>
            <div className="text-4xl font-bold text-green-600">{score ?? '—'}</div>
          </div>

          <div className="mb-4">
            <h3 className="font-medium mb-2">Feedback by AI</h3>
            <ul className="list-disc pl-6 text-sm text-gray-700">
              {feedback.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="font-medium mb-2">Improvement Tips</h3>
            <p className="text-sm text-gray-700">Recommended Path: Consider our <strong>Frontend Performance</strong> course and join weekly mock interview sessions.</p>
          </div>

          <div className="flex gap-3 mt-4">
            <button onClick={() => (onBack ? onBack() : navigate('/university/dashboard'))} className="px-4 py-2 border rounded">Back to Dashboard</button>
            <button onClick={() => (onRunAgain ? onRunAgain() : navigate('/university/dashboard/ai-setup'))} className="px-4 py-2 bg-blue-600 text-white rounded">Run Again</button>
          </div>
        </div>
      </main>
    </div>
  );
}
