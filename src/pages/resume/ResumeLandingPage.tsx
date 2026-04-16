import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Navbar } from '../../components/Navbar';
import ResumeNameModal from '../../components/resume/ResumeNameModal';
import { useListResumes, useCreateResume } from '../../services/resumeApi';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, EyeOff, Check, Zap } from 'lucide-react';
import { useResume } from '../../contexts/ResumeContext';
import { templates, TemplateItem } from '../../data/templates';
import { getAuthToken } from '../../utils/authStorage';
import { useConfirmDialog } from '../../components/ui/ConfirmDialogProvider';
import { calculateResumeProgress, ResumeProgressSummary } from '../../utils/resumeProgress';
import { completeDemoResume } from '../../data/demoData';
import ResumePreview from '../../components/resume/ResumePreview';
import styles from './TemplateSelectionPage.module.css';

interface ResumeItem {
  _id: string;
  resumeName: string;
  status: 'draft' | 'completed';
  selectedTemplate: string;
  templateColor?: string;
  headingFont?: string;
  bodyFont?: string;
  sectionFontSizes?: {
    basic?: number;
    education?: number;
    summary?: number;
    experience?: number;
    additional?: number;
    skills?: number;
  };
  createdAt: string;
  basicInfo?: {
    fullName?: string;
    professionalTitle?: string;
    email?: string;
    phone?: string;
  };
  education?: {
    university?: string;
    degree?: string;
    major?: string;
    graduationYear?: string;
  };
  experiences?: Array<{
    title?: string;
    organization?: string;
    role?: string;
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
  progressSummary?: ResumeProgressSummary;
}

const getProgressStageLabel = (percentage: number) => {
  if (percentage >= 100) return 'Preview Ready';
  if (percentage >= 75) return 'Almost Ready';
  if (percentage >= 50) return 'Building';
  if (percentage >= 25) return 'Getting Started';
  return 'New';
};

const getProgressStageTone = (percentage: number) => {
  if (percentage >= 100) return 'bg-gray-100 text-gray-700 border-gray-200';
  if (percentage >= 75) return 'bg-slate-100 text-slate-700 border-slate-200';
  if (percentage >= 50) return 'bg-gray-100 text-gray-700 border-gray-200';
  if (percentage >= 25) return 'bg-slate-50 text-slate-600 border-slate-200';
  return 'bg-gray-100 text-gray-700 border-gray-200';
};

export default function ResumeLandingPage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showTemplateView, setShowTemplateView] = useState(false);
  const { resumes, fetchResumes, loading: fetchLoading } = useListResumes();
  const { createResume, loading: createLoading } = useCreateResume();
  const { 
    setResumeId, 
    loadResume,
    updateBasicInfo,
    updateEducation,
    setExperiences,
    updateProfessionalSummary,
    updateCertifications,
    updateLanguages,
    updateAwards,
    updateInterests,
    selectTemplate,
    selectTemplateColor,
    selectHeadingFont,
    selectBodyFont,
    updateSectionFontSizes
  } = useResume();
  const confirmDialog = useConfirmDialog();

  const RAW_API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const API_BASE_URL = RAW_API_BASE_URL.replace(/\/$/, '').endsWith('/api')
    ? RAW_API_BASE_URL.replace(/\/$/, '')
    : `${RAW_API_BASE_URL.replace(/\/$/, '')}/api`;

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleCreateResume = async (resumeName: string) => {
    try {
      const newResume = await createResume(resumeName, '');
      setResumeId(newResume._id);
      navigate(`/resume/templates?id=${newResume._id}`);
    } catch (error) {
      console.error('Failed to create resume:', error);
      const message = error instanceof Error ? error.message : '';
      if (/not authenticated|please login again|invalid token/i.test(message)) {
        navigate('/login');
      }
      throw error;
    }
  };

  const handleEditResume = async (resumeId: string) => {
    try {
      await loadResume(resumeId);
      navigate(`/resume/basic-info?id=${resumeId}`);
    } catch (error) {
      console.error('Failed to load resume:', error);
    }
  };

  const handleDeleteResume = async (resumeId: string) => {
    const confirmed = await confirmDialog({
      title: 'Delete this resume?',
      description: 'This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Keep',
      tone: 'danger',
    });
    if (!confirmed) {
      return;
    }
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/resume/${resumeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
      });
      if (response.ok) {
        await fetchResumes();
      }
    } catch (error) {
      console.error('Failed to delete resume:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleSelectTemplate = (templateId: string) => {
    navigate(`/resume/template/${templateId}`);
  };

  const handlePreviewResume = async (resumeId: string) => {
    try {
      navigate(`/resume/preview?id=${resumeId}`);
    } catch (error) {
      console.error('Failed to open preview:', error);
    }
  };

  const handleLoadDemoData = async () => {
    try {
      // Create a new resume with demo data
      const newResume = await createResume('Demo Resume - Sarah Anderson', '');
      
      // Set the resume ID in context
      setResumeId(newResume._id);
      
      // Update all sections with demo data
      if (completeDemoResume.basicInfo) updateBasicInfo(completeDemoResume.basicInfo);
      if (completeDemoResume.education) updateEducation(completeDemoResume.education);
      if (completeDemoResume.experiences) setExperiences(completeDemoResume.experiences);
      if (completeDemoResume.professionalSummary) updateProfessionalSummary(completeDemoResume.professionalSummary);
      if (completeDemoResume.certifications) updateCertifications(completeDemoResume.certifications);
      if (completeDemoResume.languages) updateLanguages(completeDemoResume.languages);
      if (completeDemoResume.awards) updateAwards(completeDemoResume.awards);
      if (completeDemoResume.interests) updateInterests(completeDemoResume.interests);
      if (completeDemoResume.selectedTemplate) selectTemplate(completeDemoResume.selectedTemplate);
      if (completeDemoResume.templateColor) selectTemplateColor(completeDemoResume.templateColor);
      if (completeDemoResume.headingFont) selectHeadingFont(completeDemoResume.headingFont);
      if (completeDemoResume.bodyFont) selectBodyFont(completeDemoResume.bodyFont);
      if (completeDemoResume.sectionFontSizes) updateSectionFontSizes(completeDemoResume.sectionFontSizes);

      // Navigate to basic info page to show the filled data
      navigate(`/resume/preview?id=${newResume._id}`);
    } catch (error) {
      console.error('Failed to load demo data:', error);
      const message = error instanceof Error ? error.message : '';
      if (/not authenticated|please login again|invalid token/i.test(message)) {
        navigate('/login');
      }
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.contentWrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>My Resumes</h1>
          <p className={styles.subtitle}>Manage your professional resume documents</p>
        </div>

        {/* Create New Resume Button */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 48 }}>
          <button
            onClick={() => setIsModalOpen(true)}
            className="h-[50px] rounded-full px-8 text-[20px] font-['Poppins'] transition-colors flex items-center gap-2"
            style={{ backgroundColor: '#000000', color: '#ffffff', border: '1px solid #000000', boxShadow: '0 10px 24px rgba(15, 23, 42, 0.2)' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#111827';
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#111827';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#000000';
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#000000';
            }}
          >
            <Plus size={20} />
            Create New Resume
          </button>
          <button
            onClick={() => navigate('/resume/upload')}
            className="h-[50px] rounded-full px-8 text-[20px] font-['Poppins'] transition-colors"
            style={{ backgroundColor: '#ffffff', color: '#111827', border: '1px solid #d1d5db' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#ffffff';
            }}
          >
            Upload & Refine
          </button>
          <button
            onClick={() => setShowTemplateView((prev) => !prev)}
            className="h-[50px] rounded-full px-6 text-[16px] font-['Poppins'] transition-colors inline-flex items-center gap-2"
            style={{ backgroundColor: '#ffffff', color: '#111827', border: '1px solid #d1d5db' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#ffffff';
            }}
          >
            {showTemplateView ? <EyeOff size={18} /> : <Eye size={18} />}
            {showTemplateView ? 'View Created Resumes' : 'Templates'}
          </button>
          {process.env.NODE_ENV === 'development' && (
            <button
              onClick={handleLoadDemoData}
              className="h-[50px] rounded-full px-6 text-[16px] font-['Poppins'] transition-colors inline-flex items-center gap-2"
              style={{ backgroundColor: '#ffffff', color: '#4b5563', border: '1px solid #d1d5db' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#ffffff';
              }}
              title="Test Demo Data - Development Only"
            >
              <Zap size={18} />
              Load Demo Data
            </button>
          )}
        </div>

        {/* Resumes Grid or Empty State */}
        {fetchLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading your resumes...</p>
          </div>
        ) : resumes.length === 0 || showTemplateView ? (
          <div className="text-center py-16">
            {/* Real Template Previews */}
            <div className={styles.gridWrapper} style={{ marginBottom: 48 }}>
              <div className={styles.grid}>
                {templates.map((template: TemplateItem) => (
                  <motion.div
                    key={template.id}
                    className={styles.templateCard}
                    style={{ '--template-primary-color': template.colors[0] } as React.CSSProperties}
                    onClick={() => handleSelectTemplate(template.id)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    layout
                  >
                    <div className={styles.templatePreview} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflow: 'hidden', background: '#fff' }}>
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflow: 'hidden' }}>
                        <div style={{ minWidth: 0, minHeight: 0, width: '100%', height: 'auto', maxHeight: '100%' }}>
                          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
                            {template.Preview ? <template.Preview /> : null}
                          </motion.div>
                        </div>
                      </div>
                    </div>
                    <p className={styles.templateName}>{template.name}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.gridWrapper}>
            <div className={styles.resumeCardsGrid}>
              {resumes.map((resume: ResumeItem) => {
                const progress: ResumeProgressSummary = resume.progressSummary || calculateResumeProgress(resume);
                const progressStage = getProgressStageLabel(progress.percentage);
                const progressTone = getProgressStageTone(progress.percentage);
                const isPreviewReady = progress.percentage >= 100;
                const role = resume.basicInfo?.professionalTitle || resume.professionalSummary?.role || '';
                const selectedTemplateItem = templates.find((item) => item.id === resume.selectedTemplate);

                return (
                  <motion.div
                    key={resume._id}
                    className={styles.resumeItemCard}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={styles.resumeCardHead}>
                      <div className={styles.resumeCardMeta}>
                        <h3 className={styles.resumeCardTitle}>{resume.resumeName}</h3>
                        <p className={styles.resumeCardDate}>Updated {formatDate(resume.createdAt)}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-[11px] sm:text-xs leading-none font-medium border whitespace-nowrap shrink-0 ${progressTone}`}>
                        Ready
                      </span>
                    </div>

                    <p className={styles.resumeCardRole}>
                      {role ? `Role: ${role}` : 'Role not selected yet'}
                    </p>

                    <div className={styles.resumeTemplateThumb}>
                      {selectedTemplateItem ? (
                        <div className={styles.resumeTemplateThumbInner}>
                          <ResumePreview
                            scale={1}
                            previewTemplateId={selectedTemplateItem.id}
                            previewResumeData={resume}
                            showExample={true}
                          />
                        </div>
                      ) : (
                        <div className={styles.resumeTemplateThumbPlaceholder}>No template preview</div>
                      )}
                    </div>

                    <div className={styles.resumeProgressCard}>
                      <div className={styles.resumeProgressHeader}>
                        <span className={styles.resumeProgressTitle}>Progress</span>
                        <span className={styles.resumeProgressCount}>{progress.completedCount}/{progress.totalCount}</span>
                      </div>
                    </div>

                    <div className={styles.resumeCardActions}>
                      {isPreviewReady && (
                        <button
                          onClick={() => handlePreviewResume(resume._id)}
                          className={`${styles.resumeActionBtn} ${styles.resumeActionPreview}`}
                        >
                          <Eye size={16} />
                          Preview
                        </button>
                      )}
                      <button
                        onClick={() => handleEditResume(resume._id)}
                        className={`${styles.resumeActionBtn} ${styles.resumeActionEdit}`}
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteResume(resume._id)}
                        className={`${styles.resumeActionBtn} ${styles.resumeActionDelete}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Resume Name Modal */}
      <ResumeNameModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleCreateResume}
        isLoading={createLoading}
      />
    </div>
  );
}
