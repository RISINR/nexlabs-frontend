import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Navbar } from '../../components/Navbar';
import { useUploadAnalysis } from '../../contexts/UploadAnalysisContext';
import { useResume } from '../../contexts/ResumeContext';
import { ArrowLeft, CheckCircle2, Circle, AlertTriangle, Sparkles, Download, Share2, BookOpen, Trophy, Plus, Code, Briefcase, Award, Zap } from 'lucide-react';
import { aiService } from '../../services/aiService';

type AnalysisHistoryItem = {
  analysisId: string;
  fileName: string;
  overallScore: number;
  createdAt: string;
};

type ResourceItem = {
  title: string;
  desc: string;
  duration?: string;
  date?: string;
  type?: string;
  location?: string;
  tags: string[];
  source: string;
  actionLabel: string;
  actionPath?: string;
  externalLabel?: string;
  externalUrl?: string;
};

type CareerTrackKey = 'backend' | 'data' | 'ux' | 'product';

function SectionCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section
      style={{
        background: '#ffffff',
        borderRadius: '1rem',
        border: '1px solid #dbe5f7',
        overflow: 'hidden',
        boxShadow: '0 10px 24px rgba(35, 77, 154, 0.08)'
      }}
    >
      <div style={{ padding: '1rem 1.1rem', borderBottom: '1px solid #e6eefc' }}>
        <h3 style={{ margin: 0, color: '#111827', fontSize: '1.02rem', fontWeight: 800 }}>{title}</h3>
        {subtitle ? <p style={{ margin: '0.4rem 0 0 0', color: '#64748b', fontSize: '0.88rem' }}>{subtitle}</p> : null}
      </div>
      <div style={{ padding: '0 1.1rem 1rem 1.1rem' }}>{children}</div>
    </section>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.32rem 0.56rem',
        borderRadius: '0.4rem',
        background: '#eef4ff',
        color: '#2f62d8',
        border: '1px solid #c9daf9',
        fontSize: '0.76rem',
        fontWeight: 700,
        marginRight: '0.45rem',
        marginBottom: '0.45rem'
      }}
    >
      {label}
    </span>
  );
}

export default function ResumeAnalysisUploadPage() {
  const navigate = useNavigate();
  const { analysis, setAnalysis } = useUploadAnalysis();
  const { resumeData } = useResume();
  const bootcampsRef = useRef<HTMLDivElement | null>(null);
  const opportunitiesRef = useRef<HTMLDivElement | null>(null);
  const supportProgramsRef = useRef<HTMLDivElement | null>(null);
  const [restoring, setRestoring] = useState(true);
  const [historyItems, setHistoryItems] = useState<AnalysisHistoryItem[]>([]);
  const [loadingHistoryId, setLoadingHistoryId] = useState<string>('');
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [previewLoadFailed, setPreviewLoadFailed] = useState(false);
  const [expandedPanels, setExpandedPanels] = useState<Record<'Education' | 'Activity' | 'Skills' | 'Format', boolean>>({
    Education: false,
    Activity: false,
    Skills: false,
    Format: false
  });

  const formatDateTime = (dateInput: string) => {
    try {
      return new Date(dateInput).toLocaleString('th-TH', {
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

  const getLastAnalysisId = (userId: string) => {
    const key = `nexlabs_last_analysis_${userId}`;
    return localStorage.getItem(key) || sessionStorage.getItem(key) || '';
  };

  const normalizeHistoryItems = (items: any[]): AnalysisHistoryItem[] => {
    if (!Array.isArray(items)) return [];

    return items
      .map((item) => {
        const numericScore = Number(item?.overallScore ?? item?.score ?? 0);
        return {
          analysisId: String(item?.analysisId || item?._id || ''),
          fileName: String(item?.fileName || 'resume'),
          overallScore: Number.isFinite(numericScore) ? numericScore : 0,
          createdAt: String(item?.createdAt || item?.analyzedAt || new Date().toISOString())
        };
      })
      .filter((item) => item.analysisId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const getAnalysisHistory = (userId: string): AnalysisHistoryItem[] => {
    const key = `nexlabs_analysis_history_${userId}`;
    const raw = localStorage.getItem(key) || sessionStorage.getItem(key);
    if (!raw) return [];

    try {
      const parsed = JSON.parse(raw);
      return normalizeHistoryItems(parsed);
    } catch {
      return [];
    }
  };

  const getAnalysisCacheKey = (analysisId: string) => `nexlabs_analysis_cache_${analysisId}`;

  const getPreferredStorage = () => {
    if (localStorage.getItem('nexlabs_token')) return localStorage;
    if (sessionStorage.getItem('nexlabs_token')) return sessionStorage;
    return sessionStorage;
  };

  const saveAnalysisCache = (analysisId: string, analysis: any) => {
    const storage = getPreferredStorage();
    try {
      storage.setItem(getAnalysisCacheKey(analysisId), JSON.stringify(analysis));
    } catch {
      // ignore cache write failures
    }
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

  const detectCareerTrack = (jobTitle: string): CareerTrackKey => {
    const title = String(jobTitle || '').toLowerCase();

    if (/backend|server|api|devops|cloud|full\s*stack|software engineer|node|nestjs/.test(title)) {
      return 'backend';
    }
    if (/data|analyst|business intelligence|bi|ml|machine learning|analytics/.test(title)) {
      return 'data';
    }
    if (/ux|ui|designer|product design|user experience/.test(title)) {
      return 'ux';
    }
    if (/product|pm|product manager|product owner/.test(title)) {
      return 'product';
    }

    return 'backend';
  };

  const readCachedAnalysis = (analysisId: string) => {
    const raw = localStorage.getItem(getAnalysisCacheKey(analysisId)) || sessionStorage.getItem(getAnalysisCacheKey(analysisId));
    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  const normalizeAndSetAnalysis = (payload: any, userId: string, fallbackId: string) => {
    const analysisData = normalizeAnalysisPayload(payload);
    if (!analysisData) return;

    const summary = analysisData.skillGapSummary || {
      summary: 'ยังไม่มีสรุปผล',
      priorities: [],
      nextSteps: []
    };

    setAnalysis({
      userId,
      overallScore: analysisData.overallScore || 0,
      analysisId: analysisData.analysisId || fallbackId,
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

  const loadHistoryAnalysis = async (analysisId: string) => {
    const userId = getCurrentUserId();
    setLoadingHistoryId(analysisId);
    setHistoryError(null);

    try {
      const response = await aiService.getAnalysisById(analysisId);
      const analysisData = response?.success ? normalizeAnalysisPayload(response) : null;
      if (!analysisData) {
        throw new Error('ไม่พบข้อมูลการวิเคราะห์');
      }

      normalizeAndSetAnalysis(response, userId, analysisId);

      const lastKey = `nexlabs_last_analysis_${userId}`;
      getPreferredStorage().setItem(lastKey, analysisId);
    } catch {
      const cachedAnalysis = readCachedAnalysis(analysisId);
      if (cachedAnalysis) {
        normalizeAndSetAnalysis({ data: cachedAnalysis }, userId, analysisId);
        const lastKey = `nexlabs_last_analysis_${userId}`;
        getPreferredStorage().setItem(lastKey, analysisId);
      } else {
        setHistoryError('ไม่สามารถโหลดประวัติการวิเคราะห์ได้');
      }
    } finally {
      setLoadingHistoryId('');
    }
  };

  useEffect(() => {
    let active = true;

    const restoreAnalysis = async () => {
      const userId = getCurrentUserId();
      if (active) {
        setHistoryItems(getAnalysisHistory(userId));
      }

      if (analysis) {
        if (active) setRestoring(false);
        return;
      }

      const lastAnalysisId = getLastAnalysisId(userId);
      if (!lastAnalysisId) {
        const cachedHistory = getAnalysisHistory(userId)[0]?.analysisId;
        const cachedAnalysis = cachedHistory ? readCachedAnalysis(cachedHistory) : null;
        if (cachedAnalysis) {
          normalizeAndSetAnalysis({ data: cachedAnalysis }, userId, cachedHistory);
        }
        if (active) setRestoring(false);
        return;
      }

      try {
        const response = await aiService.getAnalysisById(lastAnalysisId);
        if (!active || !response?.success || !normalizeAnalysisPayload(response)) {
          const cachedAnalysis = readCachedAnalysis(lastAnalysisId);
          if (active && cachedAnalysis) {
            normalizeAndSetAnalysis({ data: cachedAnalysis }, userId, lastAnalysisId);
          }
          if (active) setRestoring(false);
          return;
        }

        normalizeAndSetAnalysis(response, userId, lastAnalysisId);
      } catch {
        // keep empty state if restore fails
      } finally {
        if (active) setRestoring(false);
      }
    };

    restoreAnalysis();

    return () => {
      active = false;
    };
  }, [analysis, setAnalysis]);

  if (!analysis) {
    return (
      <div style={{ minHeight: '100vh', background: '#edf2fb' }}>
        <Navbar />
        <div style={{ maxWidth: '880px', margin: '0 auto', padding: '6rem 1rem 2rem 1rem' }}>
          <div style={{ background: '#fff', borderRadius: '1rem', padding: '2rem', textAlign: 'center', border: '1px solid #dbe5f7' }}>
            <p style={{ marginTop: 0, color: '#52525b', fontSize: '1rem' }}>ไม่พบข้อมูลการวิเคราะห์</p>
            <button
              onClick={() => navigate('/resume/upload')}
              style={{
                border: 'none',
                background: '#2f62d8',
                color: '#fff',
                borderRadius: '0.6rem',
                padding: '0.72rem 1.2rem',
                cursor: 'pointer',
                fontWeight: 700
              }}
            >
              กลับไปอัปโหลดเรซูเม่
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalRequired = analysis.jobResults.reduce((sum, job) => sum + job.requiredSkills.length, 0);
  const totalMatched = analysis.jobResults.reduce((sum, job) => sum + job.matchedRequiredSkills.length, 0);
  const totalOptional = analysis.jobResults.reduce((sum, job) => sum + job.optionalSkills.length, 0);
  const coverage = totalRequired ? Math.round((totalMatched / totalRequired) * 100) : 0;

  const bestJob = [...analysis.jobResults].sort(
    (a, b) => (b.rankingScore ?? b.matchScore) - (a.rankingScore ?? a.matchScore)
  )[0];

  const cleanedPreview = analysis.resumeDetails?.cleanedPreview || '';
  const cleanedPreviewLower = cleanedPreview.toLowerCase();
  const wordCount = analysis.resumeDetails?.textStats?.wordCount || 0;
  const lineCount = analysis.resumeDetails?.textStats?.lineCount || 0;
  const hasEmail = (analysis.resumeDetails?.contact?.emails || []).length > 0;
  const hasPhone = (analysis.resumeDetails?.contact?.phones || []).length > 0;
  const hasContact = hasEmail || hasPhone;

  const extractedResumeData = analysis.resumeData || { skills: [], experience: [], projects: [], education: [] };
  const extractedEducationCount = Array.isArray(extractedResumeData.education) ? extractedResumeData.education.length : 0;
  const extractedExperienceCount = Array.isArray(extractedResumeData.experience) ? extractedResumeData.experience.length : 0;
  const extractedProjectCount = Array.isArray(extractedResumeData.projects) ? extractedResumeData.projects.length : 0;
  const extractedSkillCount = Array.isArray(extractedResumeData.skills) ? extractedResumeData.skills.length : 0;

  const hasEducationKeyword = /education|bachelor|master|university|college|ปริญญา|มหาวิทยาลัย/i.test(cleanedPreview);
  const educationEvidenceScore = extractedEducationCount > 0 ? 22 : hasEducationKeyword ? 14 : 6;
  const educationLengthScore =
    (wordCount >= 220 ? 5 : wordCount >= 150 ? 3 : 1) +
    (lineCount >= 18 ? 3 : lineCount >= 12 ? 2 : 1);
  const educationScore = Math.min(30, educationEvidenceScore + educationLengthScore);

  const optionalMatched = analysis.jobResults.reduce((sum, job) => sum + job.matchedOptionalSkills.length, 0);
  const totalTrackSkills = totalRequired + totalOptional;
  const activityRatio = totalTrackSkills > 0 ? (totalMatched + optionalMatched) / totalTrackSkills : 0;
  const requiredCoverageRatio = totalRequired > 0 ? totalMatched / totalRequired : 0;
  const optionalCoverageRatio = totalOptional > 0 ? optionalMatched / totalOptional : 0;
  const experienceMentions = (cleanedPreviewLower.match(/experience|worked|intern|employment|career|developer|engineer|analyst|manager|ฝึกงาน|ประสบการณ์|ทำงาน/g) || []).length;
  const projectMentions = (cleanedPreviewLower.match(/project|portfolio|github|hackathon|application|system|platform|api|mobile|web|โครงงาน|โปรเจกต์|ผลงาน/g) || []).length;
  const actionVerbMentions = (cleanedPreviewLower.match(/built|developed|designed|implemented|optimized|led|improved|created|managed|analyzed|automated|พัฒนา|สร้าง|ออกแบบ|วิเคราะห์|ปรับปรุง/g) || []).length;
  const quantifiedAchievements = (cleanedPreviewLower.match(/\b\d+(\.\d+)?%|\b\d+\+|\b\d+\s?(users|projects|years?|yrs?)|kpi|metric|ล้าน|เปอร์เซ็นต์/g) || []).length;

  const activityStructureScore = Math.round((bestJob?.scoreBreakdown?.structureScore || 0) * 20);
  const activityEvidenceScore = Math.min(
    20,
    extractedExperienceCount * 5 +
    extractedProjectCount * 4 +
    (quantifiedAchievements >= 2 ? 4 : quantifiedAchievements >= 1 ? 2 : 0) +
    (actionVerbMentions >= 4 ? 4 : actionVerbMentions >= 2 ? 2 : 0)
  );
  const activityScore = Math.min(40, activityStructureScore + activityEvidenceScore);

  const skillsScore = Math.min(20, Math.round(requiredCoverageRatio * 14) + Math.round(optionalCoverageRatio * 6));
  const formatScore = (hasContact ? 4 : 0) + (wordCount >= 120 ? 3 : 0) + (lineCount >= 12 ? 3 : 0);

  const analysisBreakdownTotal = Math.min(100, educationScore + activityScore + skillsScore + formatScore);

  const scoreCards = {
    Education: { value: educationScore, max: 30 },
    Activity: { value: activityScore, max: 40 },
    Skills: { value: skillsScore, max: 20 },
    Format: { value: formatScore, max: 10 }
  };

  type ScoreCategory = keyof typeof scoreCards;

  const sectionActionMap: Record<ScoreCategory, string> = {
    Education: '/resume/education',
    Activity: '/resume/experience-stack',
    Skills: '/resume/professional-summary',
    Format: '/resume/preview'
  };

  const careerTrack = detectCareerTrack(bestJob?.jobTitle || analysis.jobResults[0]?.jobTitle || '');

  const resourceCatalog: Record<CareerTrackKey, {
    bootcamps: ResourceItem[];
    events: ResourceItem[];
    support: ResourceItem[];
  }> = {
    backend: {
      bootcamps: [
        {
          title: 'คอร์สพัฒนา Backend ด้วย Node.js',
          desc: 'ฝึกทำ API จัดการฐานข้อมูล และวางระบบหลังบ้าน',
          duration: '4-6 สัปดาห์',
          tags: ['Backend', 'API', 'Database'],
          source: 'เหมาะกับคนที่อยากเสริมทักษะสาย Backend',
          actionLabel: 'ไปที่หน้า Experience',
          actionPath: '/resume/experience-stack',
          externalLabel: 'เปิดคอร์สไทย',
          externalUrl: 'https://thaimooc.org'
        },
        {
          title: 'ระบบหลังบ้านและการ Deploy',
          desc: 'ฝึกทำงานกับ server auth และการนำระบบขึ้นใช้งานจริง',
          duration: '3-5 สัปดาห์',
          tags: ['Server', 'Auth', 'Deploy'],
          source: 'ช่วยเติมทักษะที่ใช้บ่อยในงาน Backend',
          actionLabel: 'แก้เรซูเม่ต่อ',
          actionPath: '/resume/preview',
          externalLabel: 'ดูแหล่งความรู้ไทย',
          externalUrl: 'https://www.skooldio.com/'
        }
      ],
      events: [
        {
          title: 'ข่าวและกิจกรรมสายเทคโนโลยีไทย',
          type: 'Community',
          desc: 'ติดตามข่าว อัปเดต และกิจกรรมด้านเทคในไทย',
          location: 'ออนไลน์',
          tags: ['Community', 'Tech', 'Thailand'],
          source: 'เหมาะกับการต่อยอดประสบการณ์สาย Backend',
          actionLabel: 'อัปเดต Summary',
          actionPath: '/resume/professional-summary',
          externalLabel: 'ดูข่าวเทคไทย',
          externalUrl: 'https://techsauce.co/'
        }
      ],
      support: [
        {
          title: 'งาน Backend ในไทย',
          desc: 'ใช้ดูแนวทางตำแหน่งงานและคำค้นที่นายจ้างไทยใช้จริง',
          duration: 'ตลอดเวลา',
          tags: ['Jobs', 'Backend', 'Thailand'],
          source: 'ช่วยเทียบเรซูเม่กับงานจริงในตลาดไทย',
          actionLabel: 'ดูงานสายนี้',
          actionPath: '/resume/preview',
          externalLabel: 'ไปที่ JobThai',
          externalUrl: 'https://www.jobthai.com/'
        }
      ]
    },
    data: {
      bootcamps: [
        {
          title: 'คอร์สวิเคราะห์ข้อมูลและ Data Analytics',
          desc: 'ฝึกใช้ข้อมูลจริง สรุป insight และนำเสนอผลลัพธ์',
          duration: '4-6 สัปดาห์',
          tags: ['Data', 'Analytics', 'Insight'],
          source: 'เหมาะกับสาย Data Analyst และงานวิเคราะห์ข้อมูล',
          actionLabel: 'ไปที่หน้า Experience',
          actionPath: '/resume/experience-stack',
          externalLabel: 'เปิดคอร์สไทย',
          externalUrl: 'https://datarockie.com/'
        },
        {
          title: 'พื้นฐาน Data Skills สำหรับคนทำงาน',
          desc: 'ทบทวนการใช้ข้อมูล dashboard และการสื่อสารผลลัพธ์',
          duration: '3-5 สัปดาห์',
          tags: ['Dashboard', 'SQL', 'Reporting'],
          source: 'ช่วยเติมทักษะที่ตลาดงานสาย Data ต้องการบ่อย',
          actionLabel: 'แก้เรซูเม่ต่อ',
          actionPath: '/resume/professional-summary',
          externalLabel: 'ดูแหล่งเรียนไทย',
          externalUrl: 'https://thaimooc.org'
        }
      ],
      events: [
        {
          title: 'ข่าวและเวทีด้านข้อมูลในไทย',
          type: 'Community',
          desc: 'ติดตามกิจกรรมด้าน data analytics และงานสายข้อมูล',
          location: 'ออนไลน์',
          tags: ['Data', 'Community', 'Thailand'],
          source: 'ช่วยมองหาเวทีที่นำผลงานข้อมูลไปใช้จริง',
          actionLabel: 'อัปเดต Summary',
          actionPath: '/resume/professional-summary',
          externalLabel: 'ดูข่าวเทคไทย',
          externalUrl: 'https://techsauce.co/'
        }
      ],
      support: [
        {
          title: 'งาน Data ในไทย',
          desc: 'ใช้เทียบคำศัพท์ ทักษะ และความคาดหวังของตลาดงาน',
          duration: 'ตลอดเวลา',
          tags: ['Jobs', 'Data', 'Thailand'],
          source: 'ช่วยปรับเรซูเม่ให้ตรงกับตำแหน่งสายข้อมูล',
          actionLabel: 'ดูงานสายนี้',
          actionPath: '/resume/preview',
          externalLabel: 'ไปที่ JobThai',
          externalUrl: 'https://www.jobthai.com/'
        }
      ]
    },
    ux: {
      bootcamps: [
        {
          title: 'คอร์ส UX/UI สำหรับสายออกแบบผลิตภัณฑ์',
          desc: 'ฝึกคิดประสบการณ์ผู้ใช้ wireframe และการนำเสนอผลงาน',
          duration: '4-6 สัปดาห์',
          tags: ['UX', 'UI', 'Design'],
          source: 'เหมาะกับสาย UX/UI และ Product Design',
          actionLabel: 'ไปที่หน้า Experience',
          actionPath: '/resume/experience-stack',
          externalLabel: 'เปิดคอร์สไทย',
          externalUrl: 'https://www.skooldio.com/'
        },
        {
          title: 'พื้นฐานการออกแบบประสบการณ์ผู้ใช้',
          desc: 'เน้นการวิเคราะห์ผู้ใช้ การจัดลำดับปัญหา และการสื่อสารงานดีไซน์',
          duration: '3-5 สัปดาห์',
          tags: ['Research', 'Wireframe', 'Portfolio'],
          source: 'ช่วยยกระดับพอร์ตให้เหมาะกับงานสาย UX',
          actionLabel: 'แก้เรซูเม่ต่อ',
          actionPath: '/resume/preview',
          externalLabel: 'อ่านแหล่งไทย',
          externalUrl: 'https://designil.com/'
        }
      ],
      events: [
        {
          title: 'เวทีดีไซน์และ UX ในไทย',
          type: 'Community',
          desc: 'ติดตามงานเสวนาและกิจกรรมของคนทำ UX/UI ในประเทศไทย',
          location: 'ออนไลน์',
          tags: ['UX', 'Design', 'Thailand'],
          source: 'เหมาะกับการเติม portfolio และเครือข่ายสายดีไซน์',
          actionLabel: 'อัปเดต Summary',
          actionPath: '/resume/professional-summary',
          externalLabel: 'ดูแหล่งสาย UX',
          externalUrl: 'https://www.skooldio.com/'
        }
      ],
      support: [
        {
          title: 'งาน UX/UI ในไทย',
          desc: 'ใช้ดูคำเรียกตำแหน่งและทักษะที่นายจ้างต้องการ',
          duration: 'ตลอดเวลา',
          tags: ['Jobs', 'UX', 'Thailand'],
          source: 'ช่วยจับคู่ผลงานกับงานสายออกแบบได้แม่นขึ้น',
          actionLabel: 'ดูงานสายนี้',
          actionPath: '/resume/preview',
          externalLabel: 'ไปที่ JobThai',
          externalUrl: 'https://www.jobthai.com/'
        }
      ]
    },
    product: {
      bootcamps: [
        {
          title: 'คอร์ส Product Management',
          desc: 'ฝึกคิดโจทย์ธุรกิจ ลำดับความสำคัญ และสื่อสารกับทีม',
          duration: '4-6 สัปดาห์',
          tags: ['Product', 'Strategy', 'Business'],
          source: 'เหมาะกับสาย Product และ PM',
          actionLabel: 'ไปที่หน้า Summary',
          actionPath: '/resume/professional-summary',
          externalLabel: 'เปิดคอร์สไทย',
          externalUrl: 'https://www.skooldio.com/'
        },
        {
          title: 'การทำงานกับข้อมูลและผู้ใช้สำหรับ Product',
          desc: 'ช่วยเชื่อม data user needs และการตัดสินใจเชิงผลิตภัณฑ์',
          duration: '3-5 สัปดาห์',
          tags: ['Product', 'Data', 'User'],
          source: 'เหมาะกับการต่อยอดพอร์ตเพื่อสมัครงานสาย Product',
          actionLabel: 'แก้เรซูเม่ต่อ',
          actionPath: '/resume/experience-stack',
          externalLabel: 'อ่านแหล่งไทย',
          externalUrl: 'https://techsauce.co/'
        }
      ],
      events: [
        {
          title: 'ข่าวและอัปเดตสาย Product ในไทย',
          type: 'Community',
          desc: 'ติดตามแนวคิด product startup และการทำงานกับทีมข้ามสายงาน',
          location: 'ออนไลน์',
          tags: ['Product', 'Startup', 'Thailand'],
          source: 'เหมาะกับคนที่ต้องการเห็นภาพการทำงานจริงของสาย Product',
          actionLabel: 'อัปเดต Summary',
          actionPath: '/resume/professional-summary',
          externalLabel: 'ดูข่าวเทคไทย',
          externalUrl: 'https://techsauce.co/'
        }
      ],
      support: [
        {
          title: 'งาน Product ในไทย',
          desc: 'ใช้ดูคำค้นและทักษะที่ตลาดงาน Product ต้องการจริง',
          duration: 'ตลอดเวลา',
          tags: ['Jobs', 'Product', 'Thailand'],
          source: 'ช่วยปรับเรซูเม่ให้สื่อบทบาทที่เหมาะกับงาน Product',
          actionLabel: 'ดูงานสายนี้',
          actionPath: '/resume/preview',
          externalLabel: 'ไปที่ JobThai',
          externalUrl: 'https://www.jobthai.com/'
        }
      ]
    }
  };

  const selectedResources = resourceCatalog[careerTrack];
  const bootcampResources = selectedResources.bootcamps;
  const eventResources = selectedResources.events;
  const supportResources = selectedResources.support;

  const scrollToSection = (section: string) => {
    const sectionMap: Record<string, React.RefObject<HTMLDivElement | null>> = {
      'Bootcamps & Courses': bootcampsRef,
      'Opportunities & Events': opportunitiesRef,
      'Support Programs': supportProgramsRef
    };

    sectionMap[section]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const openExternalResource = (url?: string) => {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadReport = () => {
    const reportPayload = {
      analysisId: analysis.analysisId,
      fileName: analysis.fileName,
      generatedAt: new Date().toISOString(),
      score: {
        overall: analysis.overallScore,
        education: educationScore,
        activity: activityScore,
        skills: skillsScore,
        format: formatScore
      },
      summary: analysis.skillGapSummary,
      strengths: {
        matchedRequiredSkills: analysis.matchedRequiredSkills,
        matchedOptionalSkills: analysis.matchedOptionalSkills
      },
      gaps: {
        missingRequiredSkills: analysis.missingRequiredSkills,
        missingOptionalSkills: analysis.missingOptionalSkills
      },
      recommendationBySection: analysis.recommendationsBySection
    };

    const blob = new Blob([JSON.stringify(reportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume-analysis-${analysis.analysisId || 'report'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShareReport = async () => {
    const shareText = `Resume Analysis: ${analysis.fileName}\nOverall Score: ${analysis.overallScore}\nRequired Gaps: ${analysis.missingRequiredSkills.length}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Resume Analysis Result',
          text: shareText,
          url: window.location.href
        });
        return;
      }

      await navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
      window.alert('คัดลอกลิงก์ผลวิเคราะห์แล้ว');
    } catch {
      window.alert('ไม่สามารถแชร์ได้ในขณะนี้');
    }
  };

  const checklist = [
    { label: 'Contact Information', complete: hasContact },
    { label: 'Resume Length (>= 120 words)', complete: wordCount >= 120 },
    { label: 'Required Skill Coverage (>= 60%)', complete: coverage >= 60 },
    {
      label: 'Section Recommendations Ready',
      complete: Boolean(
        analysis.recommendationsBySection?.resumeSummary?.length ||
        analysis.recommendationsBySection?.experience?.length ||
        analysis.recommendationsBySection?.projects?.length ||
        analysis.recommendationsBySection?.skills?.length
      )
    },
    { label: 'No Critical Required Gap', complete: analysis.missingRequiredSkills.length === 0 }
  ];

  const recommendationCards = [
    { title: 'Summary', items: analysis.recommendationsBySection?.resumeSummary || [] },
    { title: 'Experience', items: analysis.recommendationsBySection?.experience || [] },
    { title: 'Projects', items: analysis.recommendationsBySection?.projects || [] },
    { title: 'Skills', items: analysis.recommendationsBySection?.skills || [] }
  ];

  const previewUrl = analysis.filePreviewUrl;
  const previewMime = analysis.fileMimeType || '';
  const canRenderPdf = Boolean(previewUrl && previewMime === 'application/pdf');
  const canRenderImage = Boolean(previewUrl && previewMime.startsWith('image/'));
  const isPdfFile = previewMime === 'application/pdf' || /\.pdf$/i.test(analysis.fileName || '');
  const hasNexlabsDraftData = Boolean(
    resumeData.basicInfo ||
    resumeData.professionalSummary ||
    resumeData.education ||
    (resumeData.experiences || []).length ||
    (resumeData.certifications || []).length ||
    (resumeData.languages || []).length ||
    (resumeData.awards || []).length ||
    (resumeData.interests || []).length
  );
  const isLikelyNexlabsGeneratedName = /^resume_/i.test(analysis.fileName || '') || /nexlabs/i.test(analysis.fileName || '');
  const canUseResumeEditorActions = !isPdfFile || (hasNexlabsDraftData && isLikelyNexlabsGeneratedName);

  const sortedJobs = [...(analysis.jobResults || [])].sort(
    (a, b) => (b.rankingScore ?? b.matchScore) - (a.rankingScore ?? a.matchScore)
  );

  useEffect(() => {
    setPreviewLoadFailed(false);
  }, [previewUrl, previewMime, analysis.analysisId]);

  const showMediaPreview = !previewLoadFailed && (canRenderPdf || canRenderImage);
  const fallbackName =
    resumeData.basicInfo?.fullName ||
    analysis.fileName?.replace(/\.(pdf|docx?|txt)$/i, '') ||
    'Resume Candidate';
  const fallbackTitle =
    resumeData.basicInfo?.professionalTitle ||
    bestJob?.jobTitle ||
    'Target Position';
  const fallbackSkills =
    (analysis.normalizedResumeSkills || []).slice(0, 4).length
      ? (analysis.normalizedResumeSkills || []).slice(0, 4)
      : (resumeData.professionalSummary?.skills || []).slice(0, 4);

  const renderList = (items: string[], emptyText: string, color: string) => {
    if (!items.length) {
      return <p style={{ margin: 0, color: '#71717a', fontSize: '0.86rem' }}>{emptyText}</p>;
    }

    return (
      <ul style={{ margin: 0, paddingLeft: '1.1rem' }}>
        {items.map((item, index) => (
          <li key={`${item}-${index}`} style={{ marginBottom: '0.45rem', color, lineHeight: 1.45 }}>
            {item}
          </li>
        ))}
      </ul>
    );
  };

  const getScoreDetails = (category: ScoreCategory) => {
    const details: Record<ScoreCategory, { reason: string[]; improve: string[]; relatedSections: string[] }> = {
      Education: {
        reason: [
          `ระบบอ่านเจอข้อมูลการศึกษาจำนวน ${extractedEducationCount} รายการ`,
          `เอกสารมีความยาว ${wordCount} คำ และ ${lineCount} บรรทัด`,
          `คะแนนส่วนนี้มาจากหลักฐานด้านการศึกษา ${educationEvidenceScore}/22 และความอ่านง่าย ${educationLengthScore}/8`
        ],
        improve: [
          'เพิ่มข้อมูลระดับการศึกษาให้ครบ เช่น ชื่อมหาวิทยาลัย คณะ และสาขา',
          'ใส่ปีที่เรียนจบหรือคาดว่าจะจบให้ชัดเจน',
          'ถ้า GPAX ดีและเหมาะสม ให้ระบุไว้ในเรซูเม่',
          'เขียนรายละเอียดแบบสั้นและชัด โดยเน้นสิ่งที่เกี่ยวกับงานหรือโปรเจกต์จริง'
        ],
        relatedSections: ['Bootcamps & Courses']
      },
      Activity: {
        reason: [
          `โครงสร้างเรซูเม่สอดคล้องกับตำแหน่งเป้าหมายในระดับ ${activityStructureScore}/20`,
          `ระบบตรวจพบหลักฐานจากประสบการณ์และโครงการ: ประสบการณ์ ${extractedExperienceCount} รายการ และโครงการ ${extractedProjectCount} รายการ`,
          `พบข้อความที่สื่อผลลัพธ์อย่างชัดเจน ${quantifiedAchievements} จุด และคำกริยาเชิงการกระทำ ${actionVerbMentions} จุด`
        ],
        improve: [
          'เพิ่มรายการประสบการณ์ 2-3 บรรทัด โดยใช้คำกริยาเชิงการกระทำและผลลัพธ์ที่วัดได้',
          'เพิ่มโครงการอย่างน้อย 1 ชิ้น พร้อมระบุเทคโนโลยีที่ใช้และผลลัพธ์ที่เกิดขึ้นจริง',
          'ระบุผลลัพธ์เป็นตัวเลข เช่น ลดเวลาโหลดลง 35% หรือเพิ่มจำนวนผู้ใช้ 20%',
          'หากเคยเข้าร่วมแฮกกาธอนหรือกิจกรรมวิชาการ ควรบันทึกไว้ในส่วนผลงานหรือกิจกรรมเสริม'
        ],
        relatedSections: ['Opportunities & Events', 'Bootcamps & Courses']
      },
      Skills: {
        reason: [
          `ทักษะหลักที่ตรงกับตำแหน่ง ${totalMatched}/${totalRequired} (${Math.round(requiredCoverageRatio * 100)}%)`,
          `ทักษะเสริมที่ตรงกับตำแหน่ง ${optionalMatched}/${totalOptional} (${Math.round(optionalCoverageRatio * 100)}%)`,
          `ระบบตรวจพบรายการทักษะจากข้อความเรซูเม่ ${extractedSkillCount} รายการ`
        ],
        improve: [
          ...analysis.missingRequiredSkills.slice(0, 3).map((s) => `ทบทวนหรือศึกษาเพิ่มเติม: ${s}`),
          'ระบุทักษะที่เกี่ยวข้องกับตำแหน่งให้ชัดเจนในเรซูเม่',
          'จัดทำโครงการหรือผลงานที่สะท้อนการใช้ทักษะเหล่านั้นจริง',
          `ปัจจุบันยังขาดทักษะหลัก ${analysis.missingRequiredSkills.length} รายการ และทักษะเสริม ${analysis.missingOptionalSkills.length} รายการ`
        ],
        relatedSections: ['Bootcamps & Courses', 'Support Programs']
      },
      Format: {
        reason: [
          `ข้อมูลติดต่อ${hasContact ? 'ครบถ้วน' : 'ยังไม่ครบถ้วน'} โดยเฉพาะอีเมลและหมายเลขโทรศัพท์`,
          `เอกสารมีความยาว ${wordCount} คำ และ ${lineCount} บรรทัด`,
          `คะแนนส่วนนี้ประเมินจากข้อมูลติดต่อ ${hasContact ? 4 : 0}/4 ความยาวเอกสาร ${wordCount >= 120 ? 3 : 0}/3 และโครงสร้างเอกสาร ${lineCount >= 12 ? 3 : 0}/3`
        ],
        improve: [
          'ระบุข้อมูลติดต่อให้ครบถ้วน เช่น อีเมลและหมายเลขโทรศัพท์',
          'ใช้หัวข้ออย่างชัดเจน เช่น Experience, Education และ Skills',
          'จัดรูปแบบ ฟอนต์ และระยะห่างให้สม่ำเสมอ',
          'รักษาความเป็นระเบียบของเอกสารให้อ่านง่ายและเป็นมืออาชีพ',
          'บันทึกเป็นไฟล์ PDF เพื่อคงรูปแบบให้เหมือนเดิมทุกอุปกรณ์'
        ],
        relatedSections: ['Support Programs']
      }
    };
    return details[category];
  };

  const topMissingSkills = analysis.missingRequiredSkills.slice(0, 4);

  const progressRow = (label: ScoreCategory, value: number, max: number, icon: React.ReactNode) => {
    const percent = max > 0 ? Math.round((value / max) * 100) : 0;
    const details = getScoreDetails(label);
    const isExpanded = expandedPanels[label];

    return (
      <div
        style={{
          background: '#f7faff',
          border: '1px solid #dbe5f7',
          borderRadius: '0.8rem',
          padding: '0.8rem',
          transition: 'all 0.2s ease'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#111827', fontWeight: 700, fontSize: '0.82rem' }}>
            {icon}
            {label}
          </div>
          <div style={{ display: 'inline-flex', gap: '0.55rem', alignItems: 'center' }}>
            <span style={{ color: '#111827', fontWeight: 800, fontSize: '0.82rem' }}>{value}/{max}</span>
            <button
              type="button"
              onClick={() => setExpandedPanels((prev) => ({ ...prev, [label]: !prev[label] }))}
              style={{ border: '1px solid #bfdbfe', background: '#eff6ff', color: '#1d4ed8', borderRadius: '0.4rem', padding: '0.2rem 0.5rem', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}
            >
              {isExpanded ? 'Hide details' : 'Show details'}
            </button>
          </div>
        </div>
        <div style={{ height: '6px', background: '#d7e3fb', borderRadius: '999px' }}>
          <div style={{ width: `${percent}%`, height: '100%', background: '#2f62d8', borderRadius: '999px', transition: 'width 0.25s ease' }} />
        </div>

        {isExpanded ? (
          <div style={{ marginTop: '0.8rem', border: '1px solid #cbd5e1', borderRadius: '0.7rem', background: '#ffffff', padding: '0.75rem' }}>
            <p style={{ margin: '0 0 0.35rem 0', color: '#334155', fontWeight: 700, fontSize: '0.8rem' }}>เหตุผลที่ได้คะแนนนี้</p>
            <ul style={{ margin: '0 0 0.65rem 0', paddingLeft: '1.1rem', color: '#475569', fontSize: '0.78rem', lineHeight: 1.4 }}>
              {details.reason.map((item, index) => (
                <li key={`${label}-reason-${index}`}>{item}</li>
              ))}
            </ul>

            <p style={{ margin: '0 0 0.35rem 0', color: '#334155', fontWeight: 700, fontSize: '0.8rem' }}>วิธีเพิ่มคะแนน</p>
            <ul style={{ margin: '0 0 0.65rem 0', paddingLeft: '1.1rem', color: '#475569', fontSize: '0.78rem', lineHeight: 1.4 }}>
              {details.improve.map((item, index) => (
                <li key={`${label}-improve-${index}`}>{item}</li>
              ))}
            </ul>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {details.relatedSections.map((section) => (
                <button
                  key={`${label}-section-${section}`}
                  type="button"
                  onClick={() => scrollToSection(section)}
                  style={{ border: '1px solid #bfdbfe', background: '#eff6ff', color: '#1d4ed8', borderRadius: '0.45rem', padding: '0.35rem 0.55rem', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  ไปยัง {section}
                </button>
              ))}

              {canUseResumeEditorActions ? (
                <button
                  type="button"
                  onClick={() => navigate(sectionActionMap[label])}
                  style={{ border: '1px solid #cbd5e1', background: '#ffffff', color: '#334155', borderRadius: '0.45rem', padding: '0.35rem 0.55rem', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  แก้ใน Resume Builder
                </button>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#ffffff'
      }}
    >
      <Navbar />

      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '5rem 1rem 2rem 1rem' }}>
        {/* Back Button */}
        <button
          onClick={() => navigate('/resume/upload')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            border: '1px solid #cbd5e1',
            borderRadius: '0.5rem',
            background: '#ffffff',
            color: '#475569',
            padding: '0.5rem 0.9rem',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '0.9rem',
            marginBottom: '1rem'
          }}
        >
          <ArrowLeft size={16} /> Back to Upload
        </button>

        {/* Main Header */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '1.2rem',
            padding: '2rem',
            color: '#0f172a',
            marginBottom: '2rem',
            border: '2px solid #dbe5f7',
            boxShadow: '0 10px 24px rgba(35, 77, 154, 0.08)'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, fontSize: '0.95rem', color: '#1e3a8a', fontWeight: 700 }}>Resume Skill Gap Report</p>
              <h1 style={{ margin: '0.5rem 0 0.8rem 0', fontSize: '2.2rem', fontWeight: 900, color: '#0f172a' }}>
                Resume Analysis & Growth Plan
              </h1>
              <p style={{ margin: 0, fontSize: '0.95rem', color: '#475569' }}>
                File: <strong>{analysis.fileName}</strong> | Target Positions: <strong>{analysis.jobResults.length}</strong>
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: '#eff6ff',
                  border: '2px solid #bfdbfe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '2.5rem',
                  color: '#1e3a8a',
                  boxShadow: '0 10px 24px rgba(30, 58, 138, 0.12)'
                }}
              >
                {analysis.overallScore}
              </div>
              <p style={{ margin: '0.8rem 0 0 0', fontSize: '0.85rem', color: '#334155', fontWeight: 600 }}>AI Overall Score (Official)</p>
              <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.72rem', color: '#64748b', maxWidth: '140px', lineHeight: 1.35 }}>
                Used by backend matching and ranking.
              </p>
            </div>
          </div>
        </div>

        {/* Two-Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* LEFT SIDEBAR */}
          <div style={{ display: 'grid', gap: '1.2rem' }}>
            {/* Resume Preview Card */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: '0.95rem',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
              }}
            >
              <div style={{ padding: '1rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <p style={{ margin: 0, color: '#0f172a', fontWeight: 800, fontSize: '0.95rem' }}>Resume Preview</p>
              </div>
              <div style={{ padding: '1rem' }}>
                <div
                  style={{
                    borderRadius: '0.7rem',
                    border: '1px solid #cbd5e1',
                    background: '#f5f9ff',
                    aspectRatio: '210 / 297',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}
                >
                  {showMediaPreview && canRenderPdf ? (
                    <iframe
                      title="Resume preview"
                      src={`${previewUrl}#toolbar=0&navpanes=0&view=FitH&zoom=page-fit`}
                      style={{ width: '100%', height: '100%', border: 'none' }}
                      onError={() => setPreviewLoadFailed(true)}
                    />
                  ) : showMediaPreview && canRenderImage ? (
                    <img
                      src={previewUrl}
                      alt="Resume"
                      style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#fff' }}
                      onError={() => setPreviewLoadFailed(true)}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
                        padding: '0.75rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.65rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#475569', fontSize: '0.72rem', fontWeight: 700 }}>
                        <AlertTriangle size={13} />
                        <span>Preview image unavailable</span>
                      </div>
                      <div style={{ border: '1px solid #dbe5f7', borderRadius: '0.6rem', padding: '0.6rem', background: '#ffffff' }}>
                        <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {fallbackName}
                        </p>
                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.7rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {fallbackTitle}
                        </p>
                        {fallbackSkills.length ? (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.5rem' }}>
                            {fallbackSkills.map((skill) => (
                              <span
                                key={skill}
                                style={{
                                  fontSize: '0.62rem',
                                  fontWeight: 700,
                                  color: '#1d4ed8',
                                  background: '#eaf1ff',
                                  border: '1px solid #cfe0ff',
                                  borderRadius: '999px',
                                  padding: '0.12rem 0.42rem'
                                }}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>
                      {previewUrl ? (
                        <a
                          href={previewUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            marginTop: 'auto',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            color: '#2563eb',
                            textDecoration: 'none'
                          }}
                        >
                          Open original file
                        </a>
                      ) : null}
                    </div>
                  )}
                </div>
                <p style={{ margin: '0.8rem 0 0 0', color: '#64748b', fontSize: '0.78rem', lineHeight: 1.4 }}>
                  {cleanedPreview?.slice(0, 200) || 'No preview available'}...
                </p>
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.8rem' }}>
                  <Tag label={`${wordCount} words`} />
                  <Tag label={`${lineCount} lines`} />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ background: '#ffffff', borderRadius: '0.95rem', border: '1px solid #e2e8f0', padding: '1rem', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}>
              <p style={{ margin: '0 0 0.8rem 0', color: '#0f172a', fontWeight: 800, fontSize: '0.95rem' }}>Quick Actions</p>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <button onClick={handleDownloadReport} style={{ border: '1px solid #cbd5e1', background: '#f8fafc', color: '#1e293b', borderRadius: '0.6rem', padding: '0.6rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                  <Download size={16} /> Download
                </button>
                <button onClick={handleShareReport} style={{ border: '1px solid #cbd5e1', background: '#f8fafc', color: '#1e293b', borderRadius: '0.6rem', padding: '0.6rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                  <Share2 size={16} /> Share
                </button>
              </div>
            </div>

            <div style={{ background: '#ffffff', borderRadius: '0.95rem', border: '1px solid #e2e8f0', padding: '1rem', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}>
              <p style={{ margin: '0 0 0.8rem 0', color: '#0f172a', fontWeight: 800, fontSize: '0.9rem' }}>Recent Analysis</p>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {(historyItems || []).slice(0, 4).map((item) => (
                  <button
                    key={item.analysisId}
                    onClick={() => loadHistoryAnalysis(item.analysisId)}
                    disabled={loadingHistoryId === item.analysisId}
                    style={{
                      border: '1px solid #dbe5f7',
                      background: item.analysisId === analysis.analysisId ? '#eef4ff' : '#ffffff',
                      color: '#1e293b',
                      borderRadius: '0.55rem',
                      padding: '0.55rem',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <p style={{ margin: 0, fontWeight: 700, fontSize: '0.78rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.fileName}</p>
                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.72rem', color: '#64748b' }}>
                      Score {item.overallScore} • {formatDateTime(item.createdAt)}
                    </p>
                    {loadingHistoryId === item.analysisId ? <p style={{ margin: '0.22rem 0 0 0', fontSize: '0.7rem', color: '#2563eb' }}>กำลังโหลด...</p> : null}
                  </button>
                ))}
                {!historyItems.length ? <p style={{ margin: 0, color: '#64748b', fontSize: '0.78rem' }}>ยังไม่มีประวัติการวิเคราะห์</p> : null}
              </div>
            </div>

            {/* Completeness */}
            <div style={{ background: '#ffffff', borderRadius: '0.95rem', border: '1px solid #e2e8f0', padding: '1rem', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}>
              <p style={{ margin: '0 0 0.8rem 0', color: '#0f172a', fontWeight: 800, fontSize: '0.9rem' }}>Completeness</p>
              <div style={{ display: 'grid', gap: '0.4rem' }}>
                {checklist.map((item) => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
                    {item.complete ? (
                      <CheckCircle2 size={16} style={{ color: '#10b981', flexShrink: 0 }} />
                    ) : (
                      <Circle size={16} style={{ color: '#cbd5e1', flexShrink: 0 }} />
                    )}
                    <span style={{ color: '#475569' }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT MAIN CONTENT */}
          <div style={{ display: 'grid', gap: '1.2rem' }}>
            {/* Main Role Card */}
            <div style={{ background: '#ffffff', borderRadius: '0.95rem', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}>
              <div style={{ padding: '1.2rem', background: 'linear-gradient(135deg, #eef4ff 0%, #dde9ff 100%)', borderBottom: '1px solid #cbd5e1' }}>
                <h3 style={{ margin: 0, color: '#1e3a8a', fontSize: '1.1rem', fontWeight: 800 }}>
                  {bestJob?.jobTitle || 'Target Position'}
                </h3>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '1.2rem' }}>
                  {/* Left Stats */}
                  <div>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.8rem', fontWeight: 700 }}>ANALYSIS BREAKDOWN (ADVISORY)</p>
                    <p style={{ margin: '0.3rem 0 0 0', color: '#111827', fontSize: '1.6rem', fontWeight: 900 }}>
                      {analysisBreakdownTotal}
                      <span style={{ fontSize: '0.9rem', color: '#64748b' }}>/100</span>
                    </p>
                    <p style={{ margin: '0.25rem 0 0 0', color: '#64748b', fontSize: '0.72rem' }}>
                      Derived from analyzed resume evidence for coaching; official ranking still uses AI Overall Score.
                    </p>
                  </div>

                  {/* Right Stats */}
                  <div>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.8rem', fontWeight: 700 }}>ACTIVITY RATIO</p>
                    <p style={{ margin: '0.3rem 0 0 0', color: '#111827', fontSize: '1.6rem', fontWeight: 900 }}>
                      {Math.round(activityRatio * 100)}<span style={{ fontSize: '0.9rem', color: '#64748b' }}>%</span>
                    </p>
                  </div>
                </div>

                {/* Progress Bars */}
                <div style={{ display: 'grid', gap: '0.8rem' }}>
                  {[
                    { label: 'Education', value: educationScore, max: 30, icon: BookOpen },
                    { label: 'Activity', value: activityScore, max: 40, icon: Zap },
                    { label: 'Skills', value: skillsScore, max: 20, icon: Code },
                    { label: 'Format', value: formatScore, max: 10, icon: CheckCircle2 }
                  ].map(({ label, value, max, icon: Icon }) => (
                    <div key={label}>{progressRow(label as 'Education' | 'Activity' | 'Skills' | 'Format', value, max, <Icon size={14} />)}</div>
                  ))}
                </div>

                <div style={{ marginTop: '0.95rem' }}>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.78rem' }}>
                    Each card now contains its own expandable explanation and direct action buttons.
                  </p>
                </div>
              </div>
            </div>

            {/* Skill Gap Analysis */}
            <div style={{ background: '#ffffff', borderRadius: '0.95rem', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}>
              <div style={{ padding: '1.2rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1rem', fontWeight: 800 }}>Skill Gap Analysis</h3>
                <p style={{ margin: '0.3rem 0 0 0', color: '#64748b', fontSize: '0.8rem' }}>Skills breakdown across all target positions</p>
              </div>
              <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                {/* Matched Skills */}
                <div>
                  <p style={{ margin: '0 0 0.6rem 0', color: '#0f172a', fontWeight: 800, fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    <CheckCircle2 size={16} style={{ color: '#10b981' }} />
                    Matched Skills
                  </p>
                  <div style={{ fontSize: '0.85rem' }}>
                    <p style={{ margin: '0 0 0.35rem 0', color: '#64748b', fontWeight: 700 }}>Required</p>
                    {renderList(analysis.matchedRequiredSkills?.slice(0, 5) || [], 'None found', '#059669')}
                    <p style={{ margin: '0.7rem 0 0.35rem 0', color: '#64748b', fontWeight: 700 }}>Optional</p>
                    {renderList(analysis.matchedOptionalSkills?.slice(0, 5) || [], 'None found', '#059669')}
                  </div>
                </div>

                {/* Missing Skills */}
                <div>
                  <p style={{ margin: '0 0 0.6rem 0', color: '#0f172a', fontWeight: 800, fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    <AlertTriangle size={16} style={{ color: '#dc2626' }} />
                    Missing Skills
                  </p>
                  <div style={{ fontSize: '0.85rem' }}>
                    <p style={{ margin: '0 0 0.35rem 0', color: '#7c2d12', fontWeight: 700 }}>Required Gaps</p>
                    {renderList(analysis.missingRequiredSkills?.slice(0, 5) || [], 'None', '#dc2626')}
                    <p style={{ margin: '0.7rem 0 0.35rem 0', color: '#7c2d12', fontWeight: 700 }}>Optional Gaps</p>
                    {renderList(analysis.missingOptionalSkills?.slice(0, 5) || [], 'None', '#dc2626')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MISSING SKILLS ALERT */}
        {analysis.missingRequiredSkills.length > 0 && (
          <div
            style={{
              background: '#fef2f2',
              border: '2px solid #ef4444',
              borderRadius: '0.95rem',
              padding: '1.5rem',
              marginBottom: '2rem'
            }}
          >
            <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '1rem' }}>
              <AlertTriangle size={20} style={{ color: '#dc2626', flexShrink: 0, marginTop: '0.1rem' }} />
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0, color: '#7f1d1d', fontSize: '1rem', fontWeight: 800 }}>Missing Skills (High Demand)</h4>
                <p style={{ margin: '0.25rem 0 0 0', color: '#991b1b', fontSize: '0.88rem' }}>
                  These required skills are not detected in your resume. We recommend prioritizing these for immediate improvement.
                </p>
              </div>
              <span style={{ background: '#dc2626', color: '#fff', padding: '0.35rem 0.7rem', borderRadius: '0.35rem', fontSize: '0.75rem', fontWeight: 800, whiteSpace: 'nowrap' }}>
                {analysis.missingRequiredSkills.length} Gap{analysis.missingRequiredSkills.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {analysis.missingRequiredSkills.map((skill, idx) => (
                <span
                  key={idx}
                  style={{
                    background: '#fecaca',
                    color: '#7f1d1d',
                    padding: '0.35rem 0.7rem',
                    borderRadius: '0.35rem',
                    fontSize: '0.8rem',
                    fontWeight: 700
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* BOOTCAMPS & COURSES */}
        <div ref={bootcampsRef} style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <BookOpen size={20} style={{ color: '#1e3a8a' }} />
            <h2 style={{ margin: 0, color: '#0f172a', fontSize: '1.25rem', fontWeight: 900 }}>Bootcamps & Courses</h2>
          </div>
          <p style={{ margin: '0 0 1.2rem 0', color: '#64748b', fontSize: '0.9rem' }}>Practical learning tracks for Thai students, based on your missing skills and target role</p>
          {!canUseResumeEditorActions ? (
            <p style={{ margin: '0 0 1rem 0', color: '#92400e', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '0.6rem', padding: '0.65rem 0.8rem', fontSize: '0.82rem', fontWeight: 600 }}>
              This PDF was uploaded from outside NexLabs, so the original content cannot be edited in the Builder. Guidance only is shown instead.
            </p>
          ) : null}

          <div style={{ display: 'grid', gap: '0.9rem' }}>
            {bootcampResources.map((course, idx) => (
              <div key={idx} style={{ background: '#ffffff', borderRadius: '0.85rem', border: '1px solid #e2e8f0', padding: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 0.3rem 0', color: '#0f172a', fontWeight: 800, fontSize: '0.95rem' }}>{course.title}</h4>
                  <p style={{ margin: '0 0 0.6rem 0', color: '#64748b', fontSize: '0.85rem' }}>{course.desc}</p>
                  <p style={{ margin: '0 0 0.6rem 0', color: '#1d4ed8', fontSize: '0.76rem', fontWeight: 600 }}>Source: {course.source}</p>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {course.tags.map((tag, i) => (
                      <span key={i} style={{ background: '#eef4ff', color: '#1e40af', padding: '0.2rem 0.5rem', borderRadius: '0.3rem', fontSize: '0.75rem', fontWeight: 600 }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.6rem', whiteSpace: 'nowrap' }}>
                  <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 700 }}>{course.duration || '-'}</span>
                  {canUseResumeEditorActions && course.actionPath ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', alignItems: 'flex-end' }}>
                        <button onClick={() => navigate(course.actionPath as string)} style={{ border: 'none', background: '#000', color: '#fff', borderRadius: '0.5rem', padding: '0.5rem 1rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}>
                          {course.actionLabel}
                        </button>
                        {course.externalUrl ? (
                          <button onClick={() => openExternalResource(course.externalUrl)} style={{ border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', borderRadius: '0.5rem', padding: '0.45rem 0.9rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.78rem' }}>
                            {course.externalLabel || 'ไปยังลิงก์ภายนอก'}
                          </button>
                        ) : null}
                      </div>
                    ) : course.externalUrl ? (
                      <button onClick={() => openExternalResource(course.externalUrl)} style={{ border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', borderRadius: '0.5rem', padding: '0.45rem 0.9rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.78rem' }}>
                        {course.externalLabel || 'ไปยังลิงก์ภายนอก'}
                      </button>
                    ) : (
                      <span style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '0.45rem', padding: '0.38rem 0.65rem', fontSize: '0.74rem', fontWeight: 700 }}>
                        Guidance Only
                      </span>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* OPPORTUNITIES & EVENTS */}
        <div ref={opportunitiesRef} style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <Briefcase size={20} style={{ color: '#1e3a8a' }} />
            <h2 style={{ margin: 0, color: '#0f172a', fontSize: '1.25rem', fontWeight: 900 }}>Opportunities & Events</h2>
          </div>
          <p style={{ margin: '0 0 1.2rem 0', color: '#64748b', fontSize: '0.9rem' }}>Recommended events and hiring opportunities commonly available to students in Thailand</p>

          <div style={{ display: 'grid', gap: '0.9rem' }}>
            {eventResources.map((event, idx) => (
              <div key={idx} style={{ background: '#ffffff', borderRadius: '0.85rem', border: '1px solid #e2e8f0', padding: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                    <h4 style={{ margin: 0, color: '#0f172a', fontWeight: 800, fontSize: '0.95rem' }}>{event.title}</h4>
                    <span style={{ background: '#fef08a', color: '#713f12', padding: '0.2rem 0.5rem', borderRadius: '0.3rem', fontSize: '0.7rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                      {event.type || 'Event'}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.85rem' }}>{event.desc}</p>
                  <p style={{ margin: '0 0 0.5rem 0', color: '#1d4ed8', fontSize: '0.76rem', fontWeight: 600 }}>Source: {event.source}</p>
                  <p style={{ margin: '0 0 0.6rem 0', color: '#64748b', fontSize: '0.8rem' }}>
                    <strong>Location:</strong> {event.location || '-'}
                  </p>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {event.tags.map((company, i) => (
                      <span key={i} style={{ background: '#e0e7ff', color: '#3730a3', padding: '0.2rem 0.5rem', borderRadius: '0.3rem', fontSize: '0.75rem', fontWeight: 600 }}>
                        {company}
                      </span>
                    ))}
                  </div>
                </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.6rem', whiteSpace: 'nowrap' }}>
                  <span style={{ color: '#991b1b', fontWeight: 700, fontSize: '0.8rem' }}>{event.date || '-'}</span>
                  {canUseResumeEditorActions && event.actionPath ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', alignItems: 'flex-end' }}>
                      <button onClick={() => navigate(event.actionPath as string)} style={{ border: 'none', background: '#000', color: '#fff', borderRadius: '0.5rem', padding: '0.5rem 0.9rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}>
                        {event.actionLabel}
                      </button>
                      {event.externalUrl ? (
                        <button onClick={() => openExternalResource(event.externalUrl)} style={{ border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', borderRadius: '0.5rem', padding: '0.45rem 0.9rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.78rem' }}>
                          {event.externalLabel || 'ไปยังลิงก์ภายนอก'}
                        </button>
                      ) : null}
                    </div>
                  ) : event.externalUrl ? (
                    <button onClick={() => openExternalResource(event.externalUrl)} style={{ border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', borderRadius: '0.5rem', padding: '0.45rem 0.9rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.78rem' }}>
                      {event.externalLabel || 'ไปยังลิงก์ภายนอก'}
                    </button>
                  ) : (
                    <span style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '0.45rem', padding: '0.38rem 0.65rem', fontSize: '0.74rem', fontWeight: 700 }}>
                      Guidance Only
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SUPPORT PROGRAMS */}
        <div ref={supportProgramsRef} style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <Award size={20} style={{ color: '#1e3a8a' }} />
            <h2 style={{ margin: 0, color: '#0f172a', fontSize: '1.25rem', fontWeight: 900 }}>Support Programs</h2>
          </div>
          <p style={{ margin: '0 0 1.2rem 0', color: '#64748b', fontSize: '0.9rem' }}>Support options Thai students can use to improve certifications, resume quality, and job-readiness</p>

          <div style={{ display: 'grid', gap: '0.9rem' }}>
            {supportResources.map((program, idx) => (
              <div key={idx} style={{ background: '#ffffff', borderRadius: '0.85rem', border: '1px solid #e2e8f0', padding: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                    <h4 style={{ margin: 0, color: '#0f172a', fontWeight: 800, fontSize: '0.95rem' }}>{program.title}</h4>
                    <span style={{ background: '#dcfce7', color: '#166534', padding: '0.2rem 0.5rem', borderRadius: '0.3rem', fontSize: '0.7rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                      {program.type || 'Support'}
                    </span>
                  </div>
                  <p style={{ margin: '0', color: '#64748b', fontSize: '0.85rem' }}>{program.desc}</p>
                  <p style={{ margin: '0.45rem 0 0 0', color: '#1d4ed8', fontSize: '0.76rem', fontWeight: 600 }}>Source: {program.source}</p>
                </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.6rem', whiteSpace: 'nowrap' }}>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: '0 0 0.2rem 0', color: '#64748b', fontSize: '0.75rem', fontWeight: 700 }}>Duration</p>
                    <p style={{ margin: 0, color: '#0f172a', fontSize: '0.85rem', fontWeight: 700 }}>{program.duration || '-'}</p>
                  </div>
                  {canUseResumeEditorActions && program.actionPath ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', alignItems: 'flex-end' }}>
                      <button onClick={() => navigate(program.actionPath as string)} style={{ border: 'none', background: '#000', color: '#fff', borderRadius: '0.5rem', padding: '0.5rem 0.8rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}>
                        {program.actionLabel}
                      </button>
                      {program.externalUrl ? (
                        <button onClick={() => openExternalResource(program.externalUrl)} style={{ border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', borderRadius: '0.5rem', padding: '0.45rem 0.9rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.78rem' }}>
                          {program.externalLabel || 'ไปยังลิงก์ภายนอก'}
                        </button>
                      ) : null}
                    </div>
                  ) : program.externalUrl ? (
                    <button onClick={() => openExternalResource(program.externalUrl)} style={{ border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', borderRadius: '0.5rem', padding: '0.45rem 0.9rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.78rem' }}>
                      {program.externalLabel || 'ไปยังลิงก์ภายนอก'}
                    </button>
                  ) : (
                    <span style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '0.45rem', padding: '0.38rem 0.65rem', fontSize: '0.74rem', fontWeight: 700 }}>
                      Guidance Only
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
