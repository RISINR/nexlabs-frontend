/**
 * Example Interview Practice Component
 * This demonstrates how to use the interview generation and rating features
 */

import { useState } from 'react';
import { aiService } from '@/services/aiService';
import styles from './InterviewPractice.module.css';

interface InterviewQuestion {
  question: string;
  difficulty?: string;
  expectedPoints?: string[];
  tips?: string[];
}

interface InterviewRating {
  success: boolean;
  data: {
    score: number;
    strengths: string[];
    improvements: string[];
    suggestedAnswer: string;
    feedback: string;
  };
}

export function InterviewPractice() {
  const [formData, setFormData] = useState({
    jobTitle: '',
    industry: '',
    level: 'intermediate'
  });

  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [rating, setRating] = useState<InterviewRating['data'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateQuestions = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.jobTitle || !formData.industry) {
      setError('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    setLoading(true);
    setError(null);
    setQuestions([]);
    setRating(null);

    try {
      const response = await aiService.generateInterviewQuestions(
        formData.jobTitle,
        formData.industry,
        formData.level
      );

      if (response.success) {
        const allQuestions = [
          ...(response.data.technicalQuestions || []),
          ...(response.data.behavioralQuestions || [])
        ];
        setQuestions(allQuestions);
        setCurrentQuestionIndex(0);
        setUserAnswer('');
      } else {
        setError('ไม่สามารถสร้างคำถามสัมภาษณ์ได้');
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'เกิดข้อผิดพลาดในการสร้างคำถาม'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRateAnswer = async () => {
    if (!userAnswer.trim()) {
      setError('กรุณาเขียนคำตอบของคุณ');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const currentQuestion =
        questions[currentQuestionIndex]?.question ||
        'Interview Question';
      const response: InterviewRating = await aiService.rateInterviewAnswer(
        currentQuestion,
        userAnswer
      );

      if (response.success) {
        setRating(response.data);
      } else {
        setError('ไม่สามารถให้คะแนนคำตอบได้');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการให้คะแนน'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer('');
      setRating(null);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setUserAnswer('');
      setRating(null);
    }
  };

  if (questions.length === 0) {
    return (
      <div className={styles.container}>
        <h2>🎤 ซ้อมสัมภาษณ์ด้วย AI</h2>

        <form onSubmit={handleGenerateQuestions} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="jobTitle">ตำแหน่งงาน</label>
            <input
              id="jobTitle"
              type="text"
              placeholder="เช่น Software Engineer, Product Manager"
              value={formData.jobTitle}
              onChange={(e) =>
                setFormData({ ...formData, jobTitle: e.target.value })
              }
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="industry">อุตสาหกรรม</label>
            <input
              id="industry"
              type="text"
              placeholder="เช่น Technology, Finance, Healthcare"
              value={formData.industry}
              onChange={(e) =>
                setFormData({ ...formData, industry: e.target.value })
              }
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="level">ระดับความสำคัญ</label>
            <select
              id="level"
              value={formData.level}
              onChange={(e) =>
                setFormData({ ...formData, level: e.target.value })
              }
            >
              <option value="beginner">เบื้องต้น</option>
              <option value="intermediate">ปานกลาง</option>
              <option value="advanced">ขั้นสูง</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? 'กำลังสร้าง...' : 'สร้างคำถามสัมภาษณ์'}
          </button>
        </form>

        {error && <div className={styles.error}>{error}</div>}
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className={styles.container}>
      <h2>🎤 ซ้อมสัมภาษณ์ด้วย AI</h2>

      <div className={styles.progress}>
        <p>
          คำถาม {currentQuestionIndex + 1} จาก {questions.length}
        </p>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{
              width: `${(((currentQuestionIndex + 1) / questions.length) * 100)}%`
            }}
          ></div>
        </div>
      </div>

      <div className={styles.questionSection}>
        <h3>คำถาม:</h3>
        <p className={styles.question}>{currentQuestion.question}</p>

        {currentQuestion.difficulty && (
          <p className={styles.difficulty}>
            ระดับความยาก: {currentQuestion.difficulty}
          </p>
        )}
      </div>

      <div className={styles.answerSection}>
        <label htmlFor="answer">คำตอบของคุณ:</label>
        <textarea
          id="answer"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="เขียนคำตอบของคุณที่นี่..."
          rows={6}
        />
      </div>

      {rating && (
        <div className={styles.ratingSection}>
          <div className={styles.score}>
            <h4>คะแนน: {rating.score}/10</h4>
            <div className={styles.scoreBar}>
              <div
                className={styles.scoreFill}
                style={{ width: `${(rating.score / 10) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className={styles.section}>
            <h5>✅ จุดแข็ง</h5>
            <ul>
              {rating.strengths.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          <div className={styles.section}>
            <h5>💡 ควรปรับปรุง</h5>
            <ul>
              {rating.improvements.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          <div className={styles.section}>
            <h5>💬 ข้อมูลย่อ</h5>
            <p>{rating.feedback}</p>
          </div>

          <div className={styles.section}>
            <h5>📝 คำตอบที่แนะนำ</h5>
            <p>{rating.suggestedAnswer}</p>
          </div>
        </div>
      )}

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.buttonGroup}>
        <button
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className={styles.navButton}
        >
          ← ก่อนหน้า
        </button>

        <button
          onClick={handleRateAnswer}
          disabled={loading || !userAnswer.trim()}
          className={styles.rateButton}
        >
          {loading ? 'กำลังให้คะแนน...' : '⭐ ให้คะแนนคำตอบ'}
        </button>

        <button
          onClick={handleNextQuestion}
          disabled={currentQuestionIndex === questions.length - 1}
          className={styles.navButton}
        >
          ถัดไป →
        </button>
      </div>
    </div>
  );
}

export default InterviewPractice;
