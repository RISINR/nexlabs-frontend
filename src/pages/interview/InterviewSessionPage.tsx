import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Navbar } from '../../components/Navbar';
import { useInterview } from '../../contexts/InterviewContext';
import { ArrowLeft, CheckCircle2, Circle, Mic, Pause, Play, SkipForward, Video, X } from 'lucide-react';
import { useConfirmDialog } from '../../components/ui/ConfirmDialogProvider';
import styles from './InterviewSessionPage.module.css';

const QUESTION_TIME_BY_DIFFICULTY = {
  beginner: 180,
  intermediate: 150,
  professional: 120,
} as const;

export default function InterviewSessionPage() {
  const navigate = useNavigate();
  const confirmDialog = useConfirmDialog();
  const { interviewData, nextQuestion, previousQuestion, answerQuestion, endInterview } = useInterview();

  const webcamVideoRef = useRef<HTMLVideoElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const dragDataRef = useRef<{ startX: number; startY: number; left: number; top: number } | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [showWebcam, setShowWebcam] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_BY_DIFFICULTY[interviewData.difficulty]);
  const [webcamPos, setWebcamPos] = useState<{ left: number; top: number } | null>(null);

  const currentQuestion = interviewData.questions[interviewData.currentQuestionIndex];
  const totalQuestions = interviewData.questions.length;
  const currentQuestionNumber = interviewData.currentQuestionIndex + 1;
  const questionTimeLimit = QUESTION_TIME_BY_DIFFICULTY[interviewData.difficulty];

  const progressPercentage = useMemo(() => {
    if (totalQuestions === 0) return 0;
    return Math.round((currentQuestionNumber / totalQuestions) * 100);
  }, [currentQuestionNumber, totalQuestions]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const ensureWebcamPosition = () => {
    if (!stageRef.current || webcamPos) return;
    const stageRect = stageRef.current.getBoundingClientRect();
    const fallbackWidth = 240;
    const fallbackHeight = 150;
    const left = Math.max(16, stageRect.width - fallbackWidth - 18);
    const top = Math.max(16, stageRect.height - fallbackHeight - 24);
    setWebcamPos({ left, top });
  };

  const stopStream = () => {
    if (!stream) return;
    stream.getTracks().forEach((track) => track.stop());
    setStream(null);
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
      if (webcamVideoRef.current) {
        webcamVideoRef.current.srcObject = mediaStream;
        webcamVideoRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      setCameraError(err?.message || 'Unable to access camera');
      setStream(null);
    }
  };

  useEffect(() => {
    if (!showWebcam) {
      stopStream();
      return;
    }
    startCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showWebcam]);

  useEffect(() => {
    if (!stream || !webcamVideoRef.current) return;
    webcamVideoRef.current.srcObject = stream;
    webcamVideoRef.current.play().catch(() => {});
  }, [stream]);

  useEffect(() => {
    ensureWebcamPosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageRef.current]);

  useEffect(() => {
    const onResize = () => {
      if (!stageRef.current || !overlayRef.current || !webcamPos) return;
      const stageRect = stageRef.current.getBoundingClientRect();
      const overlayRect = overlayRef.current.getBoundingClientRect();
      setWebcamPos({
        left: Math.max(0, Math.min(webcamPos.left, stageRect.width - overlayRect.width)),
        top: Math.max(0, Math.min(webcamPos.top, stageRect.height - overlayRect.height)),
      });
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [webcamPos]);

  useEffect(() => {
    setTimeLeft(questionTimeLimit);
    setIsRecording(false);
  }, [interviewData.currentQuestionIndex, questionTimeLimit]);

  useEffect(() => {
    if (!isRecording) return;
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRecording(false);
          answerQuestion('Timed response');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRecording, timeLeft, answerQuestion]);

  useEffect(() => {
    return () => {
      stopStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePointerDown = (ev: React.PointerEvent<HTMLDivElement>) => {
    if (!webcamPos || !stageRef.current || !overlayRef.current) return;
    dragDataRef.current = {
      startX: ev.clientX,
      startY: ev.clientY,
      left: webcamPos.left,
      top: webcamPos.top,
    };

    (ev.currentTarget as Element).setPointerCapture?.(ev.pointerId);

    const onMove = (event: PointerEvent) => {
      if (!dragDataRef.current || !stageRef.current || !overlayRef.current) return;
      const stageRect = stageRef.current.getBoundingClientRect();
      const overlayRect = overlayRef.current.getBoundingClientRect();
      const dx = event.clientX - dragDataRef.current.startX;
      const dy = event.clientY - dragDataRef.current.startY;

      let left = dragDataRef.current.left + dx;
      let top = dragDataRef.current.top + dy;

      left = Math.max(0, Math.min(left, stageRect.width - overlayRect.width));
      top = Math.max(0, Math.min(top, stageRect.height - overlayRect.height));

      setWebcamPos({ left, top });
    };

    const onUp = () => {
      dragDataRef.current = null;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      answerQuestion('Recorded answer');
      return;
    }

    if (timeLeft <= 0) {
      setTimeLeft(questionTimeLimit);
    }
    setIsRecording(true);
  };

  const handleNextQuestion = () => {
    if (!currentQuestion.answered) {
      answerQuestion('Completed');
    }

    if (interviewData.currentQuestionIndex >= totalQuestions - 1) {
      handleEndInterview();
      return;
    }

    nextQuestion();
  };

  const handleEndInterview = async () => {
    const confirmed = await confirmDialog({
      title: 'End interview now?',
      description: 'Your current interview session will be finished and saved.',
      confirmText: 'End interview',
      cancelText: 'Keep practicing',
      tone: 'danger',
    });
    if (!confirmed) return;

    endInterview();
    stopStream();
    navigate('/interview/summary');
  };

  const toggleWebcam = () => {
    if (showWebcam) {
      stopStream();
      setShowWebcam(false);
      return;
    }

    setShowWebcam(true);
  };

  return (
    <div className={styles.pageRoot}>
      <Navbar />

      <div className={styles.pageShell}>
        <header className={styles.header}>
          <button type="button" onClick={() => navigate(-1)} className={styles.backButton}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className={styles.title}>{interviewData.position || 'AI Interview Session'}</h1>
            <p className={styles.subtitle}>
              Stay focused, answer clearly, and move through each question with confidence.
            </p>
          </div>
          <div className={styles.headerMeta}>
            <span className={styles.metaPill}>{interviewData.difficulty}</span>
            <span className={styles.metaPillMuted}>{currentQuestionNumber}/{totalQuestions} questions</span>
          </div>
        </header>

        <div className={styles.layout}>
          <section className={styles.stageCard}>
            <div className={styles.stageTopBar}>
              <div>
                <p className={styles.stageLabel}>Current question</p>
                <p className={styles.stageQuestionIndex}>Question {currentQuestionNumber} of {totalQuestions}</p>
              </div>
              <div className={`${styles.timerBadge} ${timeLeft <= 20 ? styles.timerWarning : ''}`}>
                {formatTime(timeLeft)}
              </div>
            </div>

            <div ref={stageRef} className={styles.stageViewport}>
              <div className={styles.aiScene}>
                <div className={styles.aiAura} />
                <div className={styles.aiCore} />
                <p className={styles.aiText}>AI Interviewer</p>
                <p className={styles.aiSubText}>{isRecording ? 'Listening to your answer...' : 'Press start when you are ready.'}</p>
              </div>

              {showWebcam && webcamPos ? (
                <div
                  ref={overlayRef}
                  className={styles.webcamOverlay}
                  style={{ left: webcamPos.left, top: webcamPos.top }}
                >
                  <div className={styles.webcamDragArea} onPointerDown={handlePointerDown}>
                    <span>Your camera</span>
                    <span className={styles.webcamDot} />
                  </div>

                  <video ref={webcamVideoRef} autoPlay playsInline muted className={styles.webcamVideo} />

                  {cameraError ? (
                    <div className={styles.webcamError}>
                      <p>{cameraError}</p>
                      <button type="button" onClick={startCamera}>Retry camera</button>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>

            <div className={styles.questionCard}>
              <p className={styles.questionTitle}>AI Question</p>
              <p className={styles.questionText}>{currentQuestion.question}</p>
            </div>
          </section>

          <aside className={styles.panelCard}>
            <div className={styles.panelSection}>
              <h2 className={styles.panelTitle}>Interview Controls</h2>
              <div className={styles.controlRow}>
                <button type="button" className={styles.iconButton} onClick={toggleRecording}>
                  {isRecording ? <Pause size={16} /> : <Play size={16} />}
                  {isRecording ? 'Pause answer' : 'Start answer'}
                </button>
                <button type="button" className={styles.iconButtonGhost} onClick={toggleWebcam}>
                  {showWebcam ? <Video size={16} /> : <X size={16} />}
                  {showWebcam ? 'Hide camera' : 'Show camera'}
                </button>
              </div>

              <div className={styles.controlRowCompact}>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={previousQuestion}
                  disabled={interviewData.currentQuestionIndex === 0}
                >
                  Previous
                </button>
                <button type="button" className={styles.primaryButton} onClick={handleNextQuestion}>
                  <SkipForward size={16} />
                  {interviewData.currentQuestionIndex >= totalQuestions - 1 ? 'Finish Interview' : 'Next Question'}
                </button>
              </div>
            </div>

            <div className={styles.panelSection}>
              <h3 className={styles.panelSubTitle}>Answer Guidelines</h3>
              <div className={styles.guidelineList}>
                {currentQuestion.guidelines.map((guideline, index) => (
                  <div key={`${currentQuestion.id}-${index}`} className={styles.guidelineItem}>
                    <span className={styles.guidelineDot} />
                    <span>{guideline}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.panelSection}>
              <h3 className={styles.panelSubTitle}>Question Progress</h3>
              <div className={styles.progressTrack}>
                <div className={styles.progressFill} style={{ width: `${progressPercentage}%` }} />
              </div>

              <div className={styles.questionList}>
                {interviewData.questions.map((question, index) => {
                  const isActive = index === interviewData.currentQuestionIndex;
                  return (
                    <div key={question.id} className={`${styles.questionListItem} ${isActive ? styles.questionListItemActive : ''}`}>
                      {question.answered ? (
                        <CheckCircle2 size={16} className={styles.doneIcon} />
                      ) : (
                        <Circle size={16} className={styles.pendingIcon} />
                      )}
                      <span>Question {index + 1}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <button type="button" className={styles.endButton} onClick={handleEndInterview}>
              End Interview
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}
