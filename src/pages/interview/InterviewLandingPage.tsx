import { useNavigate } from 'react-router';
import { Navbar } from '../../components/Navbar';
import styles from './InterviewLandingPage.module.css';

export default function InterviewLandingPage() {
  const navigate = useNavigate();

  const features = [
    { id: 1, title: 'AI-Powered Interview Simulation', desc: 'Practice with an AI interviewer that analyzes your answers and provides real-time feedback.' },
    { id: 2, title: 'Position-Specific Questions', desc: 'Questions tailored to the job position and difficulty level you choose.' },
    { id: 3, title: 'Detailed Performance Analysis', desc: 'Get scores and recommendations across areas such as communication and technical knowledge.' }
  ];

  return (
    <div className={`${styles.interviewRoot} min-h-screen bg-white`}>
      <Navbar />

      <div className={`${styles.container} py-16`}>
        <header className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-['Poppins'] font-semibold mb-3">AI Interview Practice</h1>
          <p className="text-lg text-gray-700">Practice interview skills with an AI that simulates real interview scenarios  <br></br>and provides real-time analysis and guidance.</p>
        </header>

        <div className={styles.actions}>
          <button onClick={() => navigate('/interview/setup')} className="bg-black text-white px-8 py-3 rounded-full text-lg">Start Practice Interview</button>
          <button onClick={() => navigate('/interview/history')} className="bg-gray-100 border border-gray-200 px-6 py-3 rounded-full text-lg">View History</button>
        </div>

        {/* Features */}
        <section className={`${styles.featuresGrid} mb-12`}>
          {features.map((f) => (
            <div key={f.id} className={styles.featureCard}>
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-700 font-semibold flex items-center justify-center mb-4">{f.id}</div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-gray-600">{f.desc}</p>
            </div>
          ))}
        </section>

      </div>
    </div>
  );
}
