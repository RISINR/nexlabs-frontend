/**
 * Example Resume Analyzer Component
 * This demonstrates how to use the Gemini AI integration
 */

import { useState, useContext } from 'react';
import { aiService } from '@/services/aiService';
import { ResumeContext } from '@/contexts/ResumeContext';
import styles from './ResumeAnalyzer.module.css';

interface AnalysisResult {
  success: boolean;
  data: {
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    overallScore: number;
    summary: string;
  };
}

export function ResumeAnalyzer() {
  const { resume } = useContext(ResumeContext) || {};
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult['data'] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyzeResume = async () => {
    if (!resume || !resume.content) {
      setError('กรุณาสร้างเรซูเม่ก่อน');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const response: AnalysisResult = await aiService.analyzeResume(
        resume.content
      );

      if (response.success) {
        setAnalysis(response.data);
      } else {
        setError('ไม่สามารถวิเคราะห์เรซูเม่ได้');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการวิเคราะห์'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>🤖 วิเคราะห์เรซูเม่ด้วย AI</h2>

      <button
        onClick={handleAnalyzeResume}
        disabled={loading || !resume}
        className={styles.analyzeButton}
      >
        {loading ? 'กำลังวิเคราะห์...' : 'วิเคราะห์เรซูเม่'}
      </button>

      {error && <div className={styles.error}>{error}</div>}

      {analysis && (
        <div className={styles.results}>
          <div className={styles.scoreSection}>
            <h3>คะแนนรวม: {analysis.overallScore}/10</h3>
            <div className={styles.scoreBar}>
              <div
                className={styles.scoreFill}
                style={{ width: `${(analysis.overallScore / 10) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className={styles.summary}>
            <h4>สรุป</h4>
            <p>{analysis.summary}</p>
          </div>

          <div className={styles.section}>
            <h4>✅ จุดแข็ง</h4>
            <ul>
              {analysis.strengths.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          <div className={styles.section}>
            <h4>⚠️ จุดอ่อน</h4>
            <ul>
              {analysis.weaknesses.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          <div className={styles.section}>
            <h4>💡 คำแนะนำ</h4>
            <ul>
              {analysis.suggestions.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumeAnalyzer;
