import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import AudioVisualizer from '../../../components/AudioVisualizer';

const MOCK_QUESTIONS = [
  'Tell me about a project where you used React to solve a difficult UI problem.',
  'How do you approach optimizing web performance?',
  'Describe a time you had to collaborate with designers. What was your process?'
];

export default function InterviewSimulation({ initial, onFinish }: { initial?: { role?: string; difficulty?: string }, onFinish?: (answers: any[]) => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location as any;
  const role = initial?.role || state?.role || 'Frontend Developer';
  const difficulty = initial?.difficulty || state?.difficulty || 'Intermediate';

  const [idx, setIdx] = useState(0);
  const [question, setQuestion] = useState(MOCK_QUESTIONS[0]);
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const answersRef = useRef<Array<{ q: string; blob?: Blob }>>([]);

  useEffect(() => {
    setQuestion(MOCK_QUESTIONS[idx]);
  }, [idx]);

  useEffect(() => {
    // prepare mic and analyser
    let audioCtx: AudioContext | null = null;
    let stream: MediaStream | null = null;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const source = audioCtx.createMediaStreamSource(stream);
        const a = audioCtx.createAnalyser();
        source.connect(a);
        setAnalyser(a);
        const mr = new MediaRecorder(stream);
        mediaRecorderRef.current = mr;
        mr.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
        };
        mr.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
          chunksRef.current = [];
          answersRef.current.push({ q: question, blob });
        };
      } catch (err) {
        console.error('Mic setup failed', err);
      }
    })();
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') mediaRecorderRef.current.stop();
      if (audioCtx) audioCtx.close();
    };
  }, []);

  const speakQuestion = (text: string) => {
    try {
      const u = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(u);
    } catch (e) {
      console.warn('TTS not available', e);
    }
  };

  const startRecording = () => {
    chunksRef.current = [];
    try {
      mediaRecorderRef.current?.start();
      setRecording(true);
    } catch (e) {
      console.error('Start rec error', e);
    }
  };
  const stopRecording = () => {
    try {
      mediaRecorderRef.current?.stop();
      setRecording(false);
    } catch (e) {
      console.error('Stop rec error', e);
    }
  };

  const nextQuestion = () => {
    if (idx < MOCK_QUESTIONS.length - 1) {
      setIdx(i => i + 1);
      speakQuestion(MOCK_QUESTIONS[idx + 1]);
    } else {
      // finished -> go to results (call callback or navigate)
      sessionStorage.setItem('mock_interview_answers', JSON.stringify(answersRef.current.map(a => ({ q: a.q }))));
      if (onFinish) return onFinish(answersRef.current.map(a => ({ q: a.q })));
      navigate('/university/dashboard/ai-results');
    }
  };

  useEffect(() => {
    // speak current question on mount / change
    speakQuestion(question);
  }, [question]);

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">AI Mock Interview — Simulation</h1>

        <div className="bg-white rounded-lg p-6 shadow">
          <p className="text-sm text-gray-500 mb-2">Role: <strong>{role}</strong> • Difficulty: <strong>{difficulty}</strong></p>

          <div className="mb-4">
            <div className="p-4 border rounded bg-gray-50">
              <h3 className="font-medium mb-2">Question</h3>
              <p className="text-lg">{question}</p>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="mb-2">Your Answer (recorded)</h4>
            <AudioVisualizer analyser={analyser} />
            <div className="mt-3 flex gap-3">
              {!recording ? (
                <button onClick={startRecording} className="px-4 py-2 bg-red-600 text-white rounded">Start Speaking</button>
              ) : (
                <button onClick={stopRecording} className="px-4 py-2 bg-gray-600 text-white rounded">Stop</button>
              )}
              <button onClick={nextQuestion} className="px-4 py-2 bg-blue-600 text-white rounded">Next Question</button>
            </div>
          </div>

          <div className="mt-6">
            <button onClick={() => navigate('/university/dashboard')} className="px-4 py-2 border rounded">Exit</button>
          </div>
        </div>
      </main>
    </div>
  );
}
