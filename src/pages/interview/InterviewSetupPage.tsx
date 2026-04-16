
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Navbar } from '../../components/Navbar';
import { useInterview } from '../../contexts/InterviewContext';
import { Upload, Mic, Video, Check, X, ChevronDown, FileText } from 'lucide-react';
import styles from './InterviewSetupPage.module.css';

export default function InterviewSetupPage() {
  const navigate = useNavigate();
  const { interviewData, uploadResume, setPosition, setDifficulty, testMicrophone, testCamera, startInterview } = useInterview();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const positionDropdownRef = useRef<HTMLDivElement | null>(null);
  
  const [selectedPosition, setSelectedPositionLocal] = useState(interviewData.position || '');
  const [selectedDifficulty, setSelectedDifficultyLocal] = useState(interviewData.difficulty);
  const [showPositionDropdown, setShowPositionDropdown] = useState(false);
  const [isDraggingResume, setIsDraggingResume] = useState(false);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!showPositionDropdown) return;
      const target = event.target as Node;
      if (positionDropdownRef.current && !positionDropdownRef.current.contains(target)) {
        setShowPositionDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPositionDropdown]);

  const positions = [
    'Frontend Developer',
    'Backend Developer',
    'Full-stack Developer',
    'UI/UX Designer',
    'Data Analyst',
    'Product Manager',
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      uploadResume(file);
    } else {
      alert('Please upload a PDF file only.');
    }
  };

  const handlePositionChange = (value: string) => {
    setSelectedPositionLocal(value);
    setPosition(value);
    setShowPositionDropdown(false);
  };

  const handleDifficultyChange = (difficulty: typeof selectedDifficulty) => {
    setSelectedDifficultyLocal(difficulty);
    setDifficulty(difficulty);
  };

  const handleContinue = () => {
    if (!interviewData.resumeFile) {
      alert('Please upload a resume');
      return;
    }
    if (!selectedPosition) {
      alert('Please select a job position');
      return;
    }
    if (interviewData.deviceStatus.microphone === 'not-tested' || interviewData.deviceStatus.camera === 'not-tested') {
      alert('Please test your devices before starting');
      return;
    }
    if (interviewData.deviceStatus.microphone === 'failed' || interviewData.deviceStatus.camera === 'failed') {
      alert('Your devices are not working properly. Please check your equipment.');
      return;
    }
    
    startInterview();
    navigate('/interview/session');
  };

  const handleResumeDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingResume(false);
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file only.');
      return;
    }
    uploadResume(file);
  };

  const getStatusIcon = (status: string) => {
    if (status === 'working') return <Check size={20} className="text-green-600" />;
    if (status === 'failed') return <X size={20} className="text-red-600" />;
    return <div className={styles.pendingDot} />;
  };

  const getStatusLabel = (status: string) => {
    if (status === 'working') return 'Ready';
    if (status === 'testing') return 'Testing...';
    if (status === 'failed') return 'Issue found';
    return 'Not tested';
  };

  const isResumeReady = Boolean(interviewData.resumeFile);
  const isPositionReady = Boolean(selectedPosition);
  const isMicReady = interviewData.deviceStatus.microphone === 'working';
  const isCamReady = interviewData.deviceStatus.camera === 'working';
  const canStartInterview = isResumeReady && isPositionReady && isMicReady && isCamReady;
  const completedSteps = [isResumeReady, isPositionReady, isMicReady && isCamReady].filter(Boolean).length;

  return (
    <div className={styles.pageRoot}>
      <Navbar />
      <div className={styles.pageShell}>
        <header className={styles.header}>
          <h1 className={styles.title}>Interview Setup</h1>
          <p className={styles.subtitle}>
            Prepare your resume, choose a target role, and verify your devices before starting.
          </p>
        </header>

        <div className={styles.layout}>
          <main className={styles.setupCard}>
            <section className={styles.stepSection}>
              <div className={styles.stepHeader}>
                <span className={styles.stepBadge}>1</span>
                <div>
                  <h2 className={styles.stepTitle}>Upload Resume</h2>
                  <p className={styles.stepHint}>Upload your latest resume as a PDF file.</p>
                </div>
              </div>

              <div
                className={`${styles.uploadBox} ${isDraggingResume ? styles.uploadBoxActive : ''}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDraggingResume(true);
                }}
                onDragLeave={() => setIsDraggingResume(false)}
                onDrop={handleResumeDrop}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
              >
                <Upload size={32} className={styles.uploadIcon} />
                <p className={styles.uploadTitle}>Click to upload or drag and drop</p>
                <p className={styles.uploadSubtitle}>Supported format: PDF</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </div>

              {interviewData.resumeFile ? (
                <div className={styles.successBox}>
                  <Check size={18} />
                  <FileText size={16} />
                  <span>{interviewData.resumeFile.name}</span>
                </div>
              ) : null}
            </section>

            <section className={styles.stepSection}>
              <div className={styles.stepHeader}>
                <span className={styles.stepBadge}>2</span>
                <div>
                  <h2 className={styles.stepTitle}>Choose Position</h2>
                  <p className={styles.stepHint}>Select the role to generate focused interview questions.</p>
                </div>
              </div>

              <div className={styles.dropdownWrap} ref={positionDropdownRef}>
                <button
                  type="button"
                  className={styles.dropdownTrigger}
                  onClick={() => setShowPositionDropdown((prev) => !prev)}
                >
                  <span>{selectedPosition || 'Select a position'}</span>
                  <ChevronDown size={18} className={showPositionDropdown ? styles.chevronOpen : ''} />
                </button>

                {showPositionDropdown ? (
                  <div className={styles.dropdownMenu}>
                    {positions.map((position) => (
                      <button
                        key={position}
                        type="button"
                        className={`${styles.dropdownItem} ${selectedPosition === position ? styles.dropdownItemActive : ''}`}
                        onClick={() => handlePositionChange(position)}
                      >
                        {position}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </section>

            <section className={styles.stepSection}>
              <div className={styles.stepHeader}>
                <span className={styles.stepBadge}>3</span>
                <div>
                  <h2 className={styles.stepTitle}>Select Difficulty</h2>
                  <p className={styles.stepHint}>Set the challenge level based on your preparation goal.</p>
                </div>
              </div>

              <div className={styles.difficultyGrid}>
                {(['beginner', 'intermediate', 'professional'] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    className={`${styles.levelButton} ${selectedDifficulty === level ? styles.levelButtonActive : ''}`}
                    onClick={() => handleDifficultyChange(level)}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </section>

            <section className={styles.stepSectionLast}>
              <div className={styles.stepHeader}>
                <span className={styles.stepBadge}>4</span>
                <div>
                  <h2 className={styles.stepTitle}>Device Check</h2>
                  <p className={styles.stepHint}>Test your microphone and camera before the interview starts.</p>
                </div>
              </div>

              <div className={styles.deviceGrid}>
                <div className={styles.deviceCard}>
                  <div className={styles.deviceHead}>
                    <Mic size={18} />
                    <span>Microphone</span>
                    {getStatusIcon(interviewData.deviceStatus.microphone)}
                  </div>
                  <p className={styles.deviceStatusText}>{getStatusLabel(interviewData.deviceStatus.microphone)}</p>
                  <button
                    type="button"
                    className={styles.deviceButton}
                    onClick={() => testMicrophone()}
                    disabled={interviewData.deviceStatus.microphone === 'testing'}
                  >
                    {interviewData.deviceStatus.microphone === 'testing' ? 'Testing...' : 'Test Microphone'}
                  </button>
                </div>

                <div className={styles.deviceCard}>
                  <div className={styles.deviceHead}>
                    <Video size={18} />
                    <span>Camera</span>
                    {getStatusIcon(interviewData.deviceStatus.camera)}
                  </div>
                  <p className={styles.deviceStatusText}>{getStatusLabel(interviewData.deviceStatus.camera)}</p>
                  <button
                    type="button"
                    className={styles.deviceButton}
                    onClick={() => testCamera()}
                    disabled={interviewData.deviceStatus.camera === 'testing'}
                  >
                    {interviewData.deviceStatus.camera === 'testing' ? 'Testing...' : 'Test Camera'}
                  </button>
                </div>
              </div>
            </section>
          </main>

          <aside className={styles.summaryCard}>
            <h3 className={styles.summaryTitle}>Ready to Start</h3>
            <p className={styles.summarySubtitle}>Complete the setup checklist before starting your AI interview.</p>

            <div className={styles.progressWrap}>
              <div className={styles.progressLabelRow}>
                <span>Setup progress</span>
                <span>{completedSteps}/3</span>
              </div>
              <div className={styles.progressTrack}>
                <div className={styles.progressFill} style={{ width: `${(completedSteps / 3) * 100}%` }} />
              </div>
            </div>

            <ul className={styles.checklist}>
              <li className={styles.checkItem}>
                <span className={`${styles.checkDot} ${isResumeReady ? styles.checkDotDone : ''}`} />
                <span>Resume uploaded</span>
              </li>
              <li className={styles.checkItem}>
                <span className={`${styles.checkDot} ${isPositionReady ? styles.checkDotDone : ''}`} />
                <span>Position selected</span>
              </li>
              <li className={styles.checkItem}>
                <span className={`${styles.checkDot} ${isMicReady ? styles.checkDotDone : ''}`} />
                <span>Microphone ready</span>
              </li>
              <li className={styles.checkItem}>
                <span className={`${styles.checkDot} ${isCamReady ? styles.checkDotDone : ''}`} />
                <span>Camera ready</span>
              </li>
            </ul>

            <div className={styles.summaryActions}>
              <button type="button" className={styles.cancelButton} onClick={() => navigate('/interview')}>
                Cancel
              </button>
              <button
                type="button"
                className={styles.startButton}
                onClick={handleContinue}
                disabled={!canStartInterview}
              >
                Start Interview
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
