import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Navbar } from '../../../components/Navbar';

const JOB_ROLES = ['Frontend Developer', 'Backend Developer', 'UX Designer', 'Data Scientist'];
const DIFFICULTIES = ['Beginner', 'Intermediate', 'Professional'];

export default function InterviewSetup({ onStart }: { onStart?: (role: string, difficulty: string) => void }) {
  const [role, setRole] = useState(JOB_ROLES[0]);
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[1]);
  const [micOk, setMicOk] = useState<boolean | null>(null);
  const [camOk, setCamOk] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const streamRef = useRef<MediaStream | null>(null);

  const checkHardware = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      streamRef.current = s;
      setMicOk(true);
      setCamOk(true);
      // stop tracks so preview not persist
      s.getTracks().forEach(t => t.stop());
    } catch (err) {
      console.error('Hardware check failed', err);
      // try audio only
      try {
        const s = await navigator.mediaDevices.getUserMedia({ audio: true });
        s.getTracks().forEach(t => t.stop());
        setMicOk(true);
        setCamOk(false);
      } catch (e) {
        setMicOk(false);
        setCamOk(false);
      }
    }
  };

  const startInterview = () => {
    if (onStart) return onStart(role, difficulty);
    // fallback to navigation for standalone page
    navigate('/university/dashboard/ai-simulate', { state: { role, difficulty } });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">AI Mock Interview — Setup</h1>

        <div className="bg-white rounded-lg p-6 shadow">
          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-2">Select Job Role</label>
            <select value={role} onChange={e => setRole(e.target.value)} className="w-full p-2 border rounded">
              {JOB_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-2">Select Difficulty</label>
            <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="w-full p-2 border rounded">
              {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-2">Hardware Check</label>
            <div className="flex gap-3 items-center">
              <button onClick={checkHardware} className="px-4 py-2 bg-blue-600 text-white rounded">Run Check</button>
              <div>
                <div>Microphone: <strong>{micOk === null ? '—' : micOk ? 'OK' : 'Not detected'}</strong></div>
                <div>Camera: <strong>{camOk === null ? '—' : camOk ? 'OK' : 'Not detected'}</strong></div>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">ระบบจะทดสอบการเชื่อมต่อไมโครโฟนและกล้องก่อนเริ่มการสัมภาษณ์</p>
          </div>

          <div className="pt-4 flex gap-3">
            <button onClick={startInterview} className="px-5 py-2 bg-green-600 text-white rounded">Start Interview</button>
            <button onClick={() => navigate('/university/dashboard')} className="px-5 py-2 border rounded">Back</button>
          </div>
        </div>
      </main>
    </div>
  );
}
