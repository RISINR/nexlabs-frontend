import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Navbar } from '../../components/Navbar';
import { Upload, X, Loader, FileText, Trash2 } from 'lucide-react';
import { useUploadAnalysis } from '../../contexts/UploadAnalysisContext';
import { aiService } from '../../services/aiService';
import { useListResumes } from '../../services/resumeApi';

interface JobDescription {
  jobId: string;
  jobTitle: string;
  description: string;
  requiredSkills: string[];
  optionalSkills: string[];
}

interface AnalysisHistoryItem {
  analysisId: string;
  fileName: string;
  overallScore: number;
  createdAt: string;
}

interface SavedResumeItem {
  _id: string;
  resumeName: string;
  createdAt: string;
  basicInfo?: {
    fullName?: string;
    professionalTitle?: string;
    email?: string;
    phone?: string;
    location?: string;
  };
  education?: {
    university?: string;
    degree?: string;
    major?: string;
    graduationYear?: string;
    gpax?: string;
  };
  experiences?: Array<{
    title?: string;
    organization?: string;
    startDate?: string;
    endDate?: string;
    situation?: string;
    action?: string;
    result?: string;
    skills?: string[];
  }>;
  professionalSummary?: {
    role?: string;
    experience?: string;
    goal?: string;
    description?: string;
    skills?: string[];
  };
  certifications?: Array<{ name?: string; issuer?: string; year?: string }>;
  languages?: Array<{ name?: string; level?: string }>;
  awards?: Array<{ title?: string; issuer?: string; year?: string }>;
  interests?: string[];
}

export default function UploadPage() {
  const navigate = useNavigate();
  const { setAnalysis: setContextAnalysis } = useUploadAnalysis();
  const { resumes: createdResumes, fetchResumes, loading: loadingResumes } = useListResumes();
  const [file, setFile] = useState<File | null>(null);
  const [selectedCreatedResumeId, setSelectedCreatedResumeId] = useState('');
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);
  const [selectedJobIds, setSelectedJobIds] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showPositionDropdown, setShowPositionDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [historyItems, setHistoryItems] = useState<AnalysisHistoryItem[]>([]);
  const [loadingHistoryId, setLoadingHistoryId] = useState<string>('');
  const [deletingHistoryId, setDeletingHistoryId] = useState<string>('');
  const [clearingHistory, setClearingHistory] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const LOGO_BLUE = '#1d8bd8';
  const LOGO_BLUE_DARK = '#166fae';
  const LOGO_BLUE_LIGHT = '#eef7ff';
  const pageShellStyle: React.CSSProperties = {
    maxWidth: '1180px',
    margin: '0 auto',
    padding: '5.5rem 1.25rem 2.5rem',
  };

  const pageCardStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: '1.25rem',
    border: '1px solid #e5e7eb',
    padding: '2.25rem',
  };

  const sectionStyle: React.CSSProperties = {
    marginBottom: '1.75rem',
  };

  const getCurrentUserId = () => {
    const raw = localStorage.getItem('nexlabs_user') || sessionStorage.getItem('nexlabs_user');
    if (!raw) return 'guest';

    try {
      const parsed = JSON.parse(raw);
      return String(parsed?._id || parsed?.id || parsed?.userId || parsed?.email || 'guest');
    } catch {
      return 'guest';
    }
  };

  const getPreferredStorage = () => {
    if (localStorage.getItem('nexlabs_token')) return localStorage;
    if (sessionStorage.getItem('nexlabs_token')) return sessionStorage;
    return sessionStorage;
  };

  const pushAnalysisHistory = (
    userId: string,
    analysisId: string,
    fileName: string,
    overallScore: number
  ) => {
    const storage = getPreferredStorage();
    const historyKey = `nexlabs_analysis_history_${userId}`;

    let existing: Array<{ analysisId: string; fileName: string; overallScore: number; createdAt: string }> = [];
    try {
      const raw = storage.getItem(historyKey);
      existing = raw ? JSON.parse(raw) : [];
    } catch {
      existing = [];
    }

    const next = [
      {
        analysisId,
        fileName,
        overallScore,
        createdAt: new Date().toISOString()
      },
      ...existing.filter((item) => item.analysisId !== analysisId)
    ].slice(0, 20);

    storage.setItem(historyKey, JSON.stringify(next));
  };

  const getAnalysisHistory = (userId: string): AnalysisHistoryItem[] => {
    const key = `nexlabs_analysis_history_${userId}`;
    const raw = localStorage.getItem(key) || sessionStorage.getItem(key);
    if (!raw) return [];

    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const getAnalysisCacheKey = (analysisId: string) => `nexlabs_analysis_cache_${analysisId}`;

  const hasAuthToken = () => {
    return Boolean(localStorage.getItem('nexlabs_token') || sessionStorage.getItem('nexlabs_token'));
  };

  const normalizeAnalysisPayload = (payload: any) => {
    const envelope = payload?.data ?? payload ?? {};
    const source = envelope.analysis || envelope.finalOutput || envelope;
    if (!source) return null;

    const details = source.finalOutput && typeof source.finalOutput === 'object' ? source.finalOutput : source;

    return {
      ...details,
      analysisId: envelope.analysisId || source.analysisId || source._id || details.analysisId || '',
      fileName: envelope.fileName || source.fileName || details.fileName || 'resume',
      fileMimeType: envelope.fileType || source.fileMimeType || details.fileMimeType,
      selectedJobIds: envelope.selectedJobIds || source.selectedJobIds || source.jobIds || details.selectedJobIds || [],
      uploadDate: details.uploadDate || source.createdAt || envelope.createdAt || new Date().toISOString()
    };
  };

  const saveAnalysisCache = (analysisId: string, analysis: any) => {
    const storage = getPreferredStorage();
    try {
      storage.setItem(getAnalysisCacheKey(analysisId), JSON.stringify(analysis));
    } catch {
      // ignore cache write failures
    }
  };

  const removeHistoryFromStorage = (userId: string) => {
    const historyKey = `nexlabs_analysis_history_${userId}`;
    const lastKey = `nexlabs_last_analysis_${userId}`;

    localStorage.removeItem(historyKey);
    sessionStorage.removeItem(historyKey);
    localStorage.removeItem(lastKey);
    sessionStorage.removeItem(lastKey);
  };

  const loadAnalysisFromCache = (analysisId: string) => {
    const cachedRaw = localStorage.getItem(getAnalysisCacheKey(analysisId)) || sessionStorage.getItem(getAnalysisCacheKey(analysisId));
    if (!cachedRaw) return null;

    try {
      return JSON.parse(cachedRaw);
    } catch {
      return null;
    }
  };

  const formatDateTime = (dateInput: string) => {
    try {
      return new Date(dateInput).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateInput;
    }
  };

  const normalizeAndSetAnalysis = (payload: any, fallbackAnalysisId: string, userId: string) => {
    const analysisData = normalizeAnalysisPayload(payload);
    if (!analysisData) return;

    const summary = analysisData.skillGapSummary || {
      summary: 'No summary available yet.',
      priorities: [],
      nextSteps: []
    };

    setContextAnalysis({
      userId,
      overallScore: analysisData.overallScore || 0,
      analysisId: analysisData.analysisId || fallbackAnalysisId,
      language: analysisData.language || 'en',
      normalizedResumeSkills: analysisData.normalizedResumeSkills || [],
      matchedRequiredSkills: analysisData.matchedRequiredSkills || [],
      matchedOptionalSkills: analysisData.matchedOptionalSkills || [],
      missingRequiredSkills: analysisData.missingRequiredSkills || [],
      missingOptionalSkills: analysisData.missingOptionalSkills || [],
      jobResults: analysisData.jobResults || [],
      skillGapSummary: summary,
      resumeDetails: analysisData.resumeDetails,
      recommendationsBySection: analysisData.recommendationsBySection,
      resumeData: analysisData.resumeData,
      aiUsage: analysisData.aiUsage,
      selectedJobIds: analysisData.selectedJobIds || [],
      fileName: analysisData.fileName || 'resume',
      fileMimeType: analysisData.fileMimeType,
      filePreviewUrl: undefined,
      uploadDate: analysisData.uploadDate || new Date().toISOString()
    });

    if (analysisData.analysisId) {
      saveAnalysisCache(analysisData.analysisId, analysisData);
    }
  };

  const handleViewHistory = async (analysisId: string) => {
    const userId = getCurrentUserId();
    setLoadingHistoryId(analysisId);
    setHistoryError(null);

    try {
      const response = await aiService.getAnalysisById(analysisId);
      const analysisData = response?.success ? normalizeAnalysisPayload(response) : null;
      if (!analysisData) {
        throw new Error('Analysis data was not found.');
      }

      normalizeAndSetAnalysis(response, analysisId, userId);

      saveAnalysisCache(analysisData.analysisId || analysisId, analysisData);

      const lastKey = `nexlabs_last_analysis_${userId}`;
      getPreferredStorage().setItem(lastKey, analysisId);
      navigate('/resume/analysis-results');
    } catch (err) {
      const cachedAnalysis = loadAnalysisFromCache(analysisId);
      if (cachedAnalysis) {
        normalizeAndSetAnalysis({ data: cachedAnalysis }, analysisId, userId);
        const lastKey = `nexlabs_last_analysis_${userId}`;
        getPreferredStorage().setItem(lastKey, analysisId);
        navigate('/resume/analysis-results');
        return;
      }

      setHistoryError(err instanceof Error ? err.message : 'Unable to load analysis history.');
    } finally {
      setLoadingHistoryId('');
    }
  };

  const handleClearAllHistory = async () => {
    const confirmed = window.confirm('Clear all analysis history? This action cannot be undone.');
    if (!confirmed) return;

    const userId = getCurrentUserId();
    setClearingHistory(true);
    setHistoryError(null);

    try {
      if (hasAuthToken()) {
        const response = await aiService.deleteUserAnalyses();
        if (!response?.success) {
          throw new Error(response?.message || 'Unable to clear analysis history from server.');
        }
      }

      removeHistoryFromStorage(userId);
      setHistoryItems([]);
    } catch (err) {
      setHistoryError(err instanceof Error ? err.message : 'Unable to clear analysis history.');
    } finally {
      setClearingHistory(false);
    }
  };

  const handleDeleteHistory = async (analysisId: string) => {
    const confirmed = window.confirm('Delete this analysis history item? This action cannot be undone.');
    if (!confirmed) return;

    setDeletingHistoryId(analysisId);
    setHistoryError(null);

    try {
      // Try to delete from backend first
      const response = await aiService.deleteAnalysis(analysisId);
      
      if (response?.success) {
        // Remove from localStorage as well
        const userId = getCurrentUserId();
        const historyKey = `nexlabs_analysis_history_${userId}`;
        const lastKey = `nexlabs_last_analysis_${userId}`;

        const removeFromStorage = (storage: Storage) => {
          const raw = storage.getItem(historyKey);
          if (!raw) return;

          const parsed = JSON.parse(raw);
          const list = Array.isArray(parsed) ? parsed : [];
          const next = list.filter((item: AnalysisHistoryItem) => item.analysisId !== analysisId);
          storage.setItem(historyKey, JSON.stringify(next));

          if (storage.getItem(lastKey) === analysisId) {
            if (next[0]?.analysisId) {
              storage.setItem(lastKey, next[0].analysisId);
            } else {
              storage.removeItem(lastKey);
            }
          }
        };

        removeFromStorage(localStorage);
        removeFromStorage(sessionStorage);

        setHistoryItems((prev) => prev.filter((item) => item.analysisId !== analysisId));
      } else {
        setHistoryError(response?.message || 'Unable to delete analysis history. Please try again.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      setHistoryError('Unable to delete analysis history. Please try again.');
    } finally {
      setDeletingHistoryId('');
    }
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const positionDropdownRef = useRef<HTMLDivElement | null>(null);

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

  React.useEffect(() => {
    let mounted = true;

    const loadJobs = async () => {
      try {
        setLoadingJobs(true);
        const response = await aiService.getJobDescriptions();
        const jobs = Array.isArray(response?.data) ? response.data : [];

        if (mounted) {
          setJobDescriptions(jobs);
        }
      } catch (err) {
        if (mounted) {
          setError('Unable to load job positions. Please try again.');
        }
      } finally {
        if (mounted) {
          setLoadingJobs(false);
        }
      }
    };

    loadJobs();

    return () => {
      mounted = false;
    };
  }, []);

  React.useEffect(() => {
    fetchResumes().catch(() => {
      // Keep file-upload flow available if loading created resumes fails.
    });
  }, [fetchResumes]);

  React.useEffect(() => {
    let mounted = true;

    const loadAnalysisHistory = async () => {
      try {
        setHistoryError(null);
        const response = await aiService.getUserAnalyses(20, 0);
        
        if (mounted && response?.success) {
          const histories = (response.data?.histories || []).map((item: any) => ({
            analysisId: String(item.analysisId),
            fileName: item.fileName,
            overallScore: item.overallScore || 0,
            createdAt: item.analyzedAt || new Date().toISOString()
          }));
          setHistoryItems(histories);
        } else if (mounted) {
          // Fallback to localStorage if API fails
          const userId = getCurrentUserId();
          setHistoryItems(getAnalysisHistory(userId));
        }
      } catch (err) {
        console.error('Error loading analysis history:', err);
        if (mounted) {
          // Fallback to localStorage on error
          const userId = getCurrentUserId();
          setHistoryItems(getAnalysisHistory(userId));
        }
      }
    };

    loadAnalysisHistory();

    return () => {
      mounted = false;
    };
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) {
      const dropped = e.dataTransfer.files[0];
      if (isValidFileType(dropped)) {
        setFile(dropped);
        setSelectedCreatedResumeId('');
        setError(null);
      } else {
        setError('Please upload only PDF, DOC, or DOCX files.');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const selected = e.target.files[0];
      if (isValidFileType(selected)) {
        setFile(selected);
        setSelectedCreatedResumeId('');
        setError(null);
      } else {
        setError('Please upload only PDF, DOC, or DOCX files.');
      }
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (sizeInBytes: number) => {
    if (sizeInBytes >= 1024 * 1024) {
      return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
    }
    return `${(sizeInBytes / 1024).toFixed(2)} KB`;
  };

  const isValidFileType = (selectedFile: File) => {
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    return validTypes.includes(selectedFile.type);
  };

  const togglePosition = (jobId: string) => {
    setSelectedJobIds((prev) => (prev[0] === jobId ? [] : [jobId]));
  };

  const selectedJobs = jobDescriptions.filter((job) => selectedJobIds.includes(job.jobId));
  const selectedCreatedResume = (createdResumes as SavedResumeItem[]).find((resume) => resume._id === selectedCreatedResumeId);

  const buildResumeTextFromSavedResume = (resume: SavedResumeItem) => {
    const lines: string[] = [];
    const basic = resume.basicInfo || {};
    const summary = resume.professionalSummary || {};
    const education = resume.education || {};

    if (basic.fullName) lines.push(`Name: ${basic.fullName}`);
    if (basic.professionalTitle || summary.role) lines.push(`Title: ${basic.professionalTitle || summary.role}`);

    const contacts = [basic.email, basic.phone, basic.location].filter(Boolean);
    if (contacts.length > 0) lines.push(`Contact: ${contacts.join(' | ')}`);

    if (summary.description) lines.push(`Summary: ${summary.description}`);
    if (Array.isArray(summary.skills) && summary.skills.length > 0) {
      lines.push(`Core Skills: ${summary.skills.join(', ')}`);
    }

    if (education.university || education.major || education.degree) {
      lines.push('Education:');
      lines.push(`- ${education.degree || ''} ${education.major || ''} ${education.university || ''}`.trim());
      if (education.graduationYear || education.gpax) {
        lines.push(`- ${education.graduationYear || ''}${education.gpax ? ` GPAX ${education.gpax}` : ''}`.trim());
      }
    }

    if (Array.isArray(resume.experiences) && resume.experiences.length > 0) {
      lines.push('Experience:');
      resume.experiences.forEach((exp) => {
        lines.push(`- ${exp.title || ''} at ${exp.organization || ''} (${exp.startDate || ''} - ${exp.endDate || ''})`.trim());
        const details = [exp.result, exp.situation, exp.action].filter(Boolean).join(' ');
        if (details) lines.push(`  ${details}`);
        if (Array.isArray(exp.skills) && exp.skills.length > 0) {
          lines.push(`  Skills: ${exp.skills.join(', ')}`);
        }
      });
    }

    if (Array.isArray(resume.certifications) && resume.certifications.length > 0) {
      lines.push('Certifications:');
      resume.certifications.forEach((cert) => {
        lines.push(`- ${cert.name || ''} ${cert.issuer ? `(${cert.issuer})` : ''} ${cert.year || ''}`.trim());
      });
    }

    if (Array.isArray(resume.languages) && resume.languages.length > 0) {
      lines.push(`Languages: ${resume.languages.map((lang) => `${lang.name || ''}${lang.level ? ` (${lang.level})` : ''}`).join(', ')}`);
    }

    if (Array.isArray(resume.awards) && resume.awards.length > 0) {
      lines.push('Awards:');
      resume.awards.forEach((award) => {
        lines.push(`- ${award.title || ''} ${award.issuer ? `(${award.issuer})` : ''} ${award.year || ''}`.trim());
      });
    }

    if (Array.isArray(resume.interests) && resume.interests.length > 0) {
      lines.push(`Interests: ${resume.interests.join(', ')}`);
    }

    return lines.join('\n').trim();
  };

  const buildSavedResumeFingerprint = async (resume: SavedResumeItem, jobId: string) => {
    const payload = JSON.stringify({
      resumeId: resume._id,
      resumeName: resume.resumeName,
      createdAt: resume.createdAt,
      jobIds: [jobId],
    });
    const encoded = new TextEncoder().encode(payload);
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
    return Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, '0')).join('');
  };

  const handleConfirm = async () => {
    if ((!file && !selectedCreatedResumeId) || selectedJobIds.length === 0) {
      setError('Please upload a resume file or choose one from My Resumes, then select one target position.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const currentUserId = getCurrentUserId();
      let analysisData: any = {};
      let analysisId = '';
      let resolvedFileName = '';
      let resolvedFileMimeType = '';
      let resolvedFilePreviewUrl: string | undefined;

      if (file) {
        const data = await aiService.uploadAndAnalyzeResume(file, selectedJobIds);
        if (!data?.success) {
          throw new Error(data?.message || 'An error occurred while analyzing your resume.');
        }

        analysisData = data.data.analysis || {};
        analysisId = String(data.data.analysisId || '');
        resolvedFileName = file.name;
        resolvedFileMimeType = file.type;
        resolvedFilePreviewUrl = URL.createObjectURL(file);
      } else {
        if (!selectedCreatedResume) {
          throw new Error('Selected resume from My Resumes was not found. Please select again.');
        }

        const selectedJobId = selectedJobIds[0];
        const resumeText = buildResumeTextFromSavedResume(selectedCreatedResume);
        if (!resumeText.trim()) {
          throw new Error('Selected resume does not contain enough data to analyze.');
        }

        const fingerprint = await buildSavedResumeFingerprint(selectedCreatedResume, selectedJobId);
        const contextResult = await aiService.analyzeResumeContext(
          resumeText,
          [selectedJobId],
          selectedCreatedResume.resumeName || 'builder-resume',
          fingerprint
        );

        if (!contextResult?.success || !contextResult?.data?.analysis) {
          throw new Error(contextResult?.message || 'An error occurred while analyzing your selected resume.');
        }

        analysisData = contextResult.data.analysis || {};
        analysisId = String(contextResult.data.analysisId || '');
        resolvedFileName = selectedCreatedResume.resumeName || 'builder-resume';
        resolvedFileMimeType = 'text/resume-builder';
        resolvedFilePreviewUrl = undefined;
      }

      const summary = analysisData.skillGapSummary || {
        summary: 'No summary available yet.',
        priorities: [],
        nextSteps: []
      };
      const lastAnalysisKey = `nexlabs_last_analysis_${currentUserId}`;
      getPreferredStorage().setItem(lastAnalysisKey, analysisId);
      saveAnalysisCache(analysisId, {
        ...analysisData,
        analysisId,
        fileName: resolvedFileName,
        fileMimeType: resolvedFileMimeType,
        selectedJobIds,
        uploadDate: new Date().toISOString()
      });
      
      // Save to localStorage as backup
      pushAnalysisHistory(
        currentUserId,
        analysisId,
        resolvedFileName,
        Number(analysisData.overallScore || 0)
      );

      setContextAnalysis({
        userId: currentUserId,
        overallScore: analysisData.overallScore,
        analysisId,
        language: analysisData.language || 'en',
        normalizedResumeSkills: analysisData.normalizedResumeSkills || [],
        matchedRequiredSkills: analysisData.matchedRequiredSkills || [],
        matchedOptionalSkills: analysisData.matchedOptionalSkills || [],
        missingRequiredSkills: analysisData.missingRequiredSkills || [],
        missingOptionalSkills: analysisData.missingOptionalSkills || [],
        jobResults: analysisData.jobResults || [],
        skillGapSummary: summary,
        resumeDetails: analysisData.resumeDetails,
        recommendationsBySection: analysisData.recommendationsBySection,
        resumeData: analysisData.resumeData,
        aiUsage: analysisData.aiUsage,
        selectedJobIds,
        fileName: resolvedFileName,
        fileMimeType: resolvedFileMimeType,
        filePreviewUrl: resolvedFilePreviewUrl,
        uploadDate: new Date().toISOString()
      });

      // Navigate to results page
      navigate('/resume/analysis-results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to analyze the uploaded file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff' }}>
      <Navbar />
      <div style={pageShellStyle}>
        <div style={pageCardStyle}>
          <h1 style={{ fontSize: '2.15rem', fontWeight: 'bold', marginBottom: '0.65rem', letterSpacing: '-0.03em' }}>Upload & Analyze</h1>
          <p style={{ color: 'rgb(107,114,128)', marginBottom: '2rem', maxWidth: '46rem', lineHeight: 1.65 }}>Upload your resume file and select one target position.</p>

          {/* File Upload Section */}
          <div style={sectionStyle}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.75rem' }}>Upload Resume File</label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={openFilePicker}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openFilePicker();
                }
              }}
              role="button"
              tabIndex={0}
              style={{
                border: isDragging ? `2px dashed ${LOGO_BLUE}` : '2px dashed #e5e7eb',
                padding: '2.1rem 1.5rem',
                borderRadius: '0.75rem',
                textAlign: 'center',
                background: isDragging ? LOGO_BLUE_LIGHT : '#fafbfc',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <Upload size={32} style={{ margin: '0 auto 0.75rem', color: LOGO_BLUE }} />
              <p style={{ fontSize: '1rem', fontWeight: '600', margin: '0 0 0.25rem 0' }}>Drag & drop your file here</p>
              <p style={{ color: 'rgb(107,114,128)', margin: '0', fontSize: '0.875rem' }}>Supported: PDF, DOCX, DOC</p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openFilePicker();
                }}
                style={{
                  marginTop: '1rem',
                  padding: '0.625rem 1rem',
                  border: `1px solid ${LOGO_BLUE}`,
                  borderRadius: '0.5rem',
                  background: LOGO_BLUE,
                  color: 'white',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Choose Resume File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </div>
            {file && (
              <div style={{ marginTop: '1rem', padding: '0.875rem', background: '#f0fdf4', border: '1px solid #dcfce7', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                  <FileText size={18} color="#166534" />
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: '0', fontWeight: '600', color: '#166534', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>✓ {file.name}</p>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: 'rgb(107,114,128)' }}>{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626' }}
                  aria-label="remove uploaded file"
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </div>

          <div style={sectionStyle}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.75rem' }}>Or Choose from My Resumes</label>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.875rem', background: '#ffffff', padding: '0.85rem', maxHeight: '240px', overflowY: 'auto' }}>
              {loadingResumes ? (
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Loading your resumes...</p>
              ) : (createdResumes as SavedResumeItem[]).length === 0 ? (
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>No resumes found in your account yet.</p>
              ) : (
                <div style={{ display: 'grid', gap: '0.55rem' }}>
                  {(createdResumes as SavedResumeItem[]).slice(0, 8).map((resume) => {
                    const isSelected = selectedCreatedResumeId === resume._id;
                    return (
                      <button
                        key={resume._id}
                        type="button"
                        onClick={() => {
                          setSelectedCreatedResumeId((prev) => (prev === resume._id ? '' : resume._id));
                          setFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                          setError(null);
                        }}
                        style={{
                          textAlign: 'left',
                          border: isSelected ? `1px solid ${LOGO_BLUE}` : '1px solid #e2e8f0',
                          background: isSelected ? LOGO_BLUE_LIGHT : '#ffffff',
                          borderRadius: '0.55rem',
                          padding: '0.6rem 0.7rem',
                          cursor: 'pointer'
                        }}
                      >
                        <p style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>{resume.resumeName || 'Untitled Resume'}</p>
                        <p style={{ margin: '0.2rem 0 0 0', color: '#64748b', fontSize: '0.8rem' }}>
                          {resume.basicInfo?.professionalTitle || resume.professionalSummary?.role || 'Role not set'} • {formatDateTime(resume.createdAt)}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Job Position Selection */}
          <div style={sectionStyle}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.75rem' }}>Select Job Position *</label>
            <div style={{ position: 'relative' }} ref={positionDropdownRef}>
              <button
                type="button"
                onClick={() => setShowPositionDropdown(!showPositionDropdown)}
                disabled={loadingJobs}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  background: 'white',
                  textAlign: 'left',
                  cursor: loadingJobs ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>
                  {loadingJobs
                    ? 'Loading job positions...'
                    : selectedJobIds.length > 0
                      ? selectedJobs[0]?.jobTitle || 'Select a target job position'
                      : 'Select a target job position'}
                </span>
                <span style={{ transform: showPositionDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', display: 'inline-block' }}>▼</span>
              </button>
              {showPositionDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  zIndex: 10,
                  marginTop: '0.25rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                  {jobDescriptions.map((job) => (
                    <label
                      key={job.jobId}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0.75rem 1rem',
                        cursor: 'pointer',
                        background: selectedJobIds.includes(job.jobId) ? LOGO_BLUE_LIGHT : 'white',
                        borderBottom: '1px solid #f3f4f6',
                        transition: 'background 0.15s'
                      }}
                    >
                      <input
                        type="radio"
                        name="target-job-position"
                        checked={selectedJobIds.includes(job.jobId)}
                        onChange={() => {
                          togglePosition(job.jobId);
                          setShowPositionDropdown(false);
                        }}
                        style={{ marginRight: '0.75rem', cursor: 'pointer' }}
                      />
                      <span>{job.jobTitle}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Analysis History */}
          <div style={sectionStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', fontWeight: '600' }}>Previous Analysis History</label>
              {historyItems.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAllHistory}
                  disabled={clearingHistory}
                  style={{
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.8rem',
                    border: '1px solid #fecaca',
                    background: '#fff1f2',
                    color: '#b91c1c',
                    borderRadius: '0.375rem',
                    cursor: clearingHistory ? 'not-allowed' : 'pointer',
                    fontWeight: 600
                  }}
                >
                  {clearingHistory ? 'Clearing...' : 'Clear All'}
                </button>
              )}
            </div>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.75rem', background: '#ffffff', padding: '0.75rem' }}>
              {!historyItems.length ? (
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>No previous analysis found for this account.</p>
              ) : (
                <div style={{ display: 'grid', gap: '0.55rem' }}>
                  {historyItems.slice(0, 6).map((item) => (
                    <div
                      key={item.analysisId}
                      style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.55rem',
                        padding: '0.65rem 0.75rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '0.75rem'
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <p style={{ margin: 0, fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.fileName}</p>
                        <p style={{ margin: '0.2rem 0 0 0', color: '#64748b', fontSize: '0.8rem' }}>
                          Score {item.overallScore} • {formatDateTime(item.createdAt)}
                        </p>
                      </div>
                      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <button
                          type="button"
                          onClick={() => handleViewHistory(item.analysisId)}
                          disabled={loadingHistoryId === item.analysisId || deletingHistoryId === item.analysisId}
                          style={{
                            padding: '0.45rem 0.75rem',
                            borderRadius: '0.45rem',
                            border: '1px solid #cbd5e1',
                            background: '#f8fafc',
                            color: '#1e293b',
                            fontWeight: 700,
                            cursor: loadingHistoryId === item.analysisId || deletingHistoryId === item.analysisId ? 'not-allowed' : 'pointer',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {loadingHistoryId === item.analysisId ? 'Loading...' : 'View Data'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteHistory(item.analysisId)}
                          disabled={deletingHistoryId === item.analysisId || loadingHistoryId === item.analysisId}
                          title="Delete"
                          aria-label="Delete analysis history"
                          style={{
                            width: '2rem',
                            height: '2rem',
                            borderRadius: '0.45rem',
                            border: '1px solid #fecaca',
                            background: '#fff1f2',
                            color: '#b91c1c',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: deletingHistoryId === item.analysisId || loadingHistoryId === item.analysisId ? 'not-allowed' : 'pointer'
                          }}
                        >
                          {deletingHistoryId === item.analysisId ? <Loader size={14} /> : <Trash2 size={14} />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {historyError ? (
              <div style={{ marginTop: '0.6rem', padding: '0.65rem 0.85rem', borderRadius: '0.5rem', background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca' }}>
                {historyError}
              </div>
            ) : null}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.9rem', justifyContent: 'flex-end', flexWrap: 'wrap', paddingTop: '0.25rem' }}>
            <button
              type="button"
              onClick={() => navigate('/resume')}
              style={{
                padding: '0.8rem 1.4rem',
                border: '1px solid #e5e7eb',
                background: 'white',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600'
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={loading || (!file && !selectedCreatedResumeId) || selectedJobIds.length === 0}
              style={{
                padding: '0.8rem 1.4rem',
                background: loading || (!file && !selectedCreatedResumeId) || selectedJobIds.length === 0 ? '#9ca3af' : LOGO_BLUE,
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: loading || (!file && !selectedCreatedResumeId) || selectedJobIds.length === 0 ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                fontWeight: '600'
              }}
            >
              {loading ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Loader size={16} /> Analyzing...
                </span>
              ) : (
                'Run AI Analysis'
              )}
            </button>
          </div>

          {error && (
            <div style={{ marginTop: '1rem', padding: '0.85rem 1rem', borderRadius: '0.5rem', background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca' }}>
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
