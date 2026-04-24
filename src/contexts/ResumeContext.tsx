import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from 'react';
import { useUpdateResume } from '../services/resumeApi';
import { API_BASE_URL } from '../utils/apiBase';

export interface Education {
  university: string;
  degree: string;
  major: string;
  graduationYear: string;
  gpax: string;
  coursework: string[];
  additionalEntries?: Array<{
    university: string;
    degree: string;
    major: string;
    graduationYear: string;
    gpax: string;
    coursework: string[];
  }>;
}

export interface Experience {
  id: string;
  type: 'project' | 'work' | 'camp' | 'competition';
  title: string;
  organization: string;
  role?: string;
  startDate: string;
  endDate: string;
  situation?: string;
  action?: string;
  result?: string;
  skills?: string[];
}

export interface ProfessionalSummary {
  role: string;
  experience: string;
  skills: string[];
  showSkillCategories?: boolean;
  goal: string;
  description: string;
  aiGenerated?: boolean;
  aiGeneratedAt?: Date;
}

export interface SocialProfile {
  platform: 'linkedin' | 'github' | 'portfolio' | 'behance' | 'dribbble' | 'other';
  username: string;
}

export interface BasicInfo {
  profilePicture?: string; // URL or base64
  photoFrameShape?: 'square' | 'rounded' | 'circle' | 'none';
  fullName: string;
  firstName: string;
  lastName: string;
  professionalTitle: string;
  futureGoal: string;
  email: string;
  phone: string;
  location: string;
  socialProfiles: SocialProfile[];
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
}

export interface Language {
  name: string;
  level: string;
}

export interface Award {
  title: string;
  issuer: string;
  year: string;
}

export interface ResumeData {
  selectedTemplate?: string;
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
  basicInfo?: BasicInfo;
  education?: Education;
  experiences: Experience[];
  professionalSummary?: ProfessionalSummary;
  certifications?: Certification[];
  languages?: Language[];
  awards?: Award[];
  interests?: string[];
}

interface ResumeContextType {
  resumeId: string | null;
  resumeData: ResumeData;
  displayResumeData: ResumeData;
  isSaving: boolean;
  setResumeId: (id: string | null) => void;
  setPreviewResumeData: (data: ResumeData | null) => void;
  clearPreviewResumeData: () => void;
  updateBasicInfo: (basicInfo: BasicInfo) => void;
  updateEducation: (education: Education) => void;
  addExperience: (experience: Experience) => void;
  setExperiences: (experiences: Experience[]) => void;
  updateExperience: (id: string, experience: Experience) => void;
  deleteExperience: (id: string) => void;
  updateProfessionalSummary: (summary: ProfessionalSummary) => void;
  updateCertifications: (certifications: Certification[]) => void;
  updateLanguages: (languages: Language[]) => void;
  updateAwards: (awards: Award[]) => void;
  updateInterests: (interests: string[]) => void;
  selectTemplate: (templateId: string) => void;
  selectTemplateColor: (color: string) => void;
  selectHeadingFont: (font: string) => void;
  selectBodyFont: (font: string) => void;
  updateSectionFontSizes: (sizes: ResumeData['sectionFontSizes']) => void;
  resetResume: () => void;
  clearFormData: () => void;
  saveResume: () => Promise<void>;
  loadResume: (id: string) => Promise<void>;
}

export const ResumeContext = createContext<ResumeContextType | undefined>(undefined);
const RESUME_DRAFT_STORAGE_KEY = 'nexlabs_resume_draft_v1';
const RESUME_DRAFT_STORAGE_PREFIX = 'nexlabs_resume_draft_v2';
const RESUME_ACTIVE_ID_STORAGE_KEY = 'nexlabs_resume_active_id_v2';

interface PersistedResumeDraft {
  resumeId: string | null;
  resumeData: ResumeData;
}

interface PersistedResumeDraftV2 {
  resumeData: ResumeData;
}

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};

const initialResumeData: ResumeData = {
  selectedTemplate: '',
  headingFont: 'Inter',
  bodyFont: 'Inter',
  sectionFontSizes: {
    basic: 1,
    education: 1,
    summary: 1,
    experience: 1,
    additional: 1,
    skills: 1,
  },
  basicInfo: undefined,
  education: undefined,
  experiences: [],
  professionalSummary: undefined,
  certifications: [],
  languages: [],
  awards: [],
  interests: [],
};

const normalizeResumeData = (data?: ResumeData): ResumeData => ({
  ...initialResumeData,
  ...(data || {}),
  experiences: Array.isArray(data?.experiences)
    ? data.experiences
    : [],
  certifications: Array.isArray(data?.certifications)
    ? data.certifications
    : [],
  languages: Array.isArray(data?.languages)
    ? data.languages
    : [],
  awards: Array.isArray(data?.awards)
    ? data.awards
    : [],
  interests: Array.isArray(data?.interests)
    ? data.interests
    : [],
});

const getResumeDraftStorageKey = (id: string) => `${RESUME_DRAFT_STORAGE_PREFIX}:${id}`;

const getPersistedActiveResumeId = (): string | null => {
  if (typeof window === 'undefined') return null;

  try {
    const activeId = localStorage.getItem(RESUME_ACTIVE_ID_STORAGE_KEY);
    if (activeId !== null) return activeId || null;

    // Backward compatibility with previous single-draft storage format.
    const legacyRaw = localStorage.getItem(RESUME_DRAFT_STORAGE_KEY);
    if (!legacyRaw) return null;
    const legacyParsed = JSON.parse(legacyRaw) as PersistedResumeDraft;
    return legacyParsed?.resumeId ?? null;
  } catch (error) {
    console.error('Failed to parse persisted active resume id:', error);
    return null;
  }
};

const getPersistedResumeDataById = (id: string | null): ResumeData => {
  if (typeof window === 'undefined' || !id) return initialResumeData;

  try {
    const raw = localStorage.getItem(getResumeDraftStorageKey(id));
    if (raw) {
      const parsed = JSON.parse(raw) as PersistedResumeDraftV2;
      return normalizeResumeData(parsed?.resumeData);
    }

    // Backward compatibility: only restore legacy payload when ids match.
    const legacyRaw = localStorage.getItem(RESUME_DRAFT_STORAGE_KEY);
    if (legacyRaw) {
      const legacyParsed = JSON.parse(legacyRaw) as PersistedResumeDraft;
      if (legacyParsed?.resumeId === id) {
        return normalizeResumeData(legacyParsed.resumeData);
      }
    }
  } catch (error) {
    console.error('Failed to parse persisted resume draft:', error);
  }

  return initialResumeData;
};

const getPersistedResumeDraft = (): PersistedResumeDraft | null => {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(RESUME_DRAFT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedResumeDraft;

    if (!parsed || typeof parsed !== 'object') return null;

    return {
      resumeId: parsed.resumeId ?? null,
      resumeData: normalizeResumeData(parsed.resumeData),
    };
  } catch (error) {
    console.error('Failed to parse persisted resume draft:', error);
    return null;
  }
};

export const ResumeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const persistedDraft = getPersistedResumeDraft();
  const initialResumeId = getPersistedActiveResumeId() ?? persistedDraft?.resumeId ?? null;
  const [resumeId, setResumeIdState] = useState<string | null>(initialResumeId);
  const [resumeData, setResumeData] = useState<ResumeData>(() => getPersistedResumeDataById(initialResumeId));
  const [previewResumeData, setPreviewResumeData] = useState<ResumeData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { updateResume } = useUpdateResume();
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const setResumeId = useCallback((id: string | null) => {
    setResumeIdState((prev) => {
      if (prev === id) return prev;
      setResumeData(getPersistedResumeDataById(id));
      setPreviewResumeData(null);
      return id;
    });
  }, []);

  const extractYear = (value: string): number => {
    const match = String(value || '').match(/(19|20)\d{2}/g);
    if (!match || match.length === 0) return 0;
    return Number(match[match.length - 1]);
  };

  const TYPE_ORDER: Record<Experience['type'], number> = {
    project: 0,
    work: 1,
    camp: 2,
    competition: 3,
  };

  const sortExperiences = (items: Experience[]) => {
    return [...items].sort((a, b) => {
      const typeDiff = TYPE_ORDER[a.type] - TYPE_ORDER[b.type];
      if (typeDiff !== 0) return typeDiff;

      const yearA = Math.max(extractYear(a.startDate), extractYear(a.endDate));
      const yearB = Math.max(extractYear(b.startDate), extractYear(b.endDate));
      if (yearA !== yearB) return yearB - yearA;

      return String(a.title || '').localeCompare(String(b.title || ''));
    });
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      if (resumeId) {
        localStorage.setItem(RESUME_ACTIVE_ID_STORAGE_KEY, resumeId);
      } else {
        localStorage.removeItem(RESUME_ACTIVE_ID_STORAGE_KEY);
      }

      if (resumeId) {
        const payload: PersistedResumeDraftV2 = {
          resumeData,
        };
        localStorage.setItem(getResumeDraftStorageKey(resumeId), JSON.stringify(payload));
      }
    } catch (error) {
      console.error('Failed to persist resume draft:', error);
    }
  }, [resumeId, resumeData]);

  // Auto-save function with debounce
  const autoSave = useCallback(
    async (dataToSave: ResumeData) => {
      if (!resumeId) return;

      try {
        setIsSaving(true);
        await updateResume(resumeId, dataToSave);
      } catch (error) {
        console.error('Failed to auto-save resume:', error);
      } finally {
        setIsSaving(false);
      }
    },
    [resumeId, updateResume]
  );

  // Debounced auto-save on data changes
  useEffect(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      if (resumeId) {
        autoSave(resumeData);
      }
    }, 1000); // Wait 1 second after changes before saving

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [resumeData, resumeId, autoSave]);

  const updateBasicInfo = (basicInfo: BasicInfo) => {
    setResumeData((prev) => ({ ...prev, basicInfo }));
  };

  const updateEducation = (education: Education) => {
    setResumeData((prev) => ({ ...prev, education }));
  };

  const addExperience = (experience: Experience) => {
    setResumeData((prev) => ({
      ...prev,
      experiences: sortExperiences([...prev.experiences, experience]),
    }));
  };

  const updateExperience = (id: string, experience: Experience) => {
    setResumeData((prev) => ({
      ...prev,
      experiences: sortExperiences(prev.experiences.map((exp) =>
        exp.id === id ? experience : exp
      )),
    }));
  };

  const setExperiences = (experiences: Experience[]) => {
    setResumeData((prev) => ({
      ...prev,
      experiences: [...experiences],
    }));
  };

  const deleteExperience = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((exp) => exp.id !== id),
    }));
  };

  const updateProfessionalSummary = (summary: ProfessionalSummary) => {
    setResumeData((prev) => ({ ...prev, professionalSummary: summary }));
  };

  const updateCertifications = (certifications: Certification[]) => {
    setResumeData((prev) => ({ ...prev, certifications }));
  };

  const updateLanguages = (languages: Language[]) => {
    setResumeData((prev) => ({ ...prev, languages }));
  };

  const updateAwards = (awards: Award[]) => {
    setResumeData((prev) => ({ ...prev, awards }));
  };

  const updateInterests = (interests: string[]) => {
    setResumeData((prev) => ({ ...prev, interests }));
  };

  const selectTemplate = (templateId: string) => {
    setResumeData((prev) => ({ ...prev, selectedTemplate: templateId }));
  };

  const selectTemplateColor = (color: string) => {
    setResumeData((prev) => ({ ...prev, templateColor: color }));
  };

  const selectHeadingFont = (font: string) => {
    setResumeData((prev) => ({ ...prev, headingFont: font }));
  };

  const selectBodyFont = (font: string) => {
    setResumeData((prev) => ({ ...prev, bodyFont: font }));
  };

  const updateSectionFontSizes = (sizes: ResumeData['sectionFontSizes']) => {
    setResumeData((prev) => ({
      ...prev,
      sectionFontSizes: {
        ...(prev.sectionFontSizes || {}),
        ...(sizes || {}),
      },
    }));
  };

  const resetResume = () => {
    setResumeData(initialResumeData);
  };

  const clearFormData = () => {
    setResumeData((prev) => ({
      ...prev,
      basicInfo: undefined,
      education: undefined,
      experiences: [],
      professionalSummary: undefined,
      certifications: [],
      languages: [],
      awards: [],
      interests: [],
    }));
  };

  const saveResume = useCallback(async () => {
    if (!resumeId) throw new Error('No resume ID set');
    await autoSave(resumeData);
  }, [resumeId, resumeData, autoSave]);

  const loadResume = useCallback(async (id: string) => {
    try {
      setPreviewResumeData(null);

      const token = typeof window !== 'undefined'
        ? localStorage.getItem('nexlabs_token')
          || sessionStorage.getItem('nexlabs_token')
          || localStorage.getItem('token')
          || sessionStorage.getItem('token')
        : null;
      const response = await fetch(`${API_BASE_URL}/resume/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
      });
      if (!response.ok) throw new Error('Failed to load resume');
      const data = await response.json();
      setResumeData(data.resume);
      setResumeId(id);
    } catch (error) {
      console.error('Failed to load resume:', error);
      throw error;
    }
  }, []);

  const clearPreviewResumeData = useCallback(() => {
    setPreviewResumeData(null);
  }, []);

  const displayResumeData = previewResumeData || resumeData;

  return (
    <ResumeContext.Provider
      value={{
        resumeId,
        resumeData,
        displayResumeData,
        isSaving,
        setResumeId,
        setPreviewResumeData,
        clearPreviewResumeData,
        updateBasicInfo,
        updateEducation,
        addExperience,
        setExperiences,
        updateExperience,
        deleteExperience,
        updateProfessionalSummary,
        updateCertifications,
        updateLanguages,
        updateAwards,
        updateInterests,
        selectTemplate,
        selectTemplateColor,
        selectHeadingFont,
        selectBodyFont,
        updateSectionFontSizes,
        resetResume,
        clearFormData,
        saveResume,
        loadResume,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};
