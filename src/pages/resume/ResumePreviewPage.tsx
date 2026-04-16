import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Navbar } from '../../components/Navbar';
import { useResume } from '../../contexts/ResumeContext';
import { useUploadAnalysis } from '../../contexts/UploadAnalysisContext';
import { Download, Loader, Check, ChevronDown, ChevronUp, ChevronLeft, Mic, ZoomIn, ZoomOut, Maximize2, Plus, Trash2, X, Sparkles } from 'lucide-react';
import { templates } from '../../data/templates';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import ResumePreview from '../../components/resume/ResumePreview';
import { aiService } from '../../services/aiService';
import { calculateResumeProgress } from '../../utils/resumeProgress';
import styles from './ResumePreviewPage.module.css';

const EXPORT_FONT_FAMILIES = [
  'Inter:wght@300;400;500;600;700;800;900',
  'Poppins:wght@400;500;600;700',
  'League+Spartan:wght@400;700',
  'Noto+Sans+Thai:wght@400;500;600;700',
  'Kanit:wght@300;400;500;600;700',
  'Roboto:wght@300;400;500;700;900',
  'Open+Sans:wght@300;400;500;600;700;800',
  'Montserrat:wght@300;400;500;600;700;800',
  'Raleway:wght@300;400;500;600;700;800',
  'Merriweather:wght@300;400;700;900',
  'PT+Serif:wght@400;700',
  'Lora:wght@400;500;600;700'
];

const PHOTO_HISTORY_STORAGE_KEY = 'nexlabs_photo_history_v1';
const MAX_PHOTO_HISTORY_ITEMS = 6;
const MAX_PHOTO_UPLOAD_BYTES = 5 * 1024 * 1024;

export default function ResumePreviewPage() {
  const navigate = useNavigate();
  const {
    resumeId,
    resumeData,
    displayResumeData,
    isSaving,
    loadResume,
    selectTemplate,
    selectTemplateColor,
    selectHeadingFont,
    selectBodyFont,
    setPreviewResumeData,
    clearPreviewResumeData,
    updateBasicInfo,
    updateEducation,
    addExperience,
    setExperiences,
    updateProfessionalSummary,
    updateExperience,
    deleteExperience,
    updateCertifications,
    updateLanguages,
    updateAwards,
    updateInterests,
    updateSectionFontSizes,
  } = useResume();
  const { setAnalysis: setContextAnalysis } = useUploadAnalysis();
  const colorInputRef = useRef<HTMLInputElement | null>(null);
  const [localColor, setLocalColor] = useState(resumeData.templateColor || '#6b21a8');
  const [showEditStudio, setShowEditStudio] = useState(false);
  const [activeLensSection, setActiveLensSection] = useState<'basic' | 'photo' | 'contact' | 'education' | 'summary' | 'experience' | 'additional' | 'skills' | null>(null);
  const [lensAnchor, setLensAnchor] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const [lensPosition, setLensPosition] = useState<{ top: number; left: number }>({ top: 64, left: 16 });
  const [hoverFocusRect, setHoverFocusRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const [lensExperienceIndex, setLensExperienceIndex] = useState(0);
  const [lensEducationIndex, setLensEducationIndex] = useState(0);
  const [lensAdditionalGroup, setLensAdditionalGroup] = useState<'certifications' | 'languages' | 'awards' | 'interests'>('certifications');
  const [contactDragIndex, setContactDragIndex] = useState<number | null>(null);
  const [showFontControls, setShowFontControls] = useState(false);
  const [editTab, setEditTab] = useState<'basic' | 'education' | 'summary' | 'experience' | 'additional' | 'fonts'>('basic');
  const [editExperienceIndex, setEditExperienceIndex] = useState(0);
  const [longFieldEditor, setLongFieldEditor] = useState<
    | { scope: 'summary'; field: 'description' | 'skillsText'; label: string }
    | { scope: 'experience'; field: 'situation' | 'action' | 'result' | 'skillsText'; label: string; experienceIndex: number }
    | null
  >(null);
  const [longFieldText, setLongFieldText] = useState('');
  const [editDraft, setEditDraft] = useState<any>(null);
  const [photoLensImage, setPhotoLensImage] = useState('');
  const [photoLensHistory, setPhotoLensHistory] = useState<string[]>([]);
  const photoLensInputRef = useRef<HTMLInputElement | null>(null);

  const DEFAULT_SECTION_FONT_SIZES = {
    basic: 1,
    education: 1,
    summary: 1,
    experience: 1,
    additional: 1,
    skills: 1,
  };

  const FONT_OPTIONS = [
    'Inter',
    'Poppins',
    'Kanit',
    'Noto Sans Thai',
    'League Spartan',
    'Roboto',
    'Open Sans',
    'Montserrat',
    'Raleway',
    'Merriweather',
    'PT Serif',
    'Lora',
  ];

  const CONTACT_PROFILE_OPTIONS: { value: 'linkedin' | 'github' | 'portfolio' | 'behance' | 'dribbble' | 'other'; label: string; placeholder: string }[] = [
    { value: 'linkedin', label: 'LinkedIn', placeholder: 'john-doe' },
    { value: 'github', label: 'GitHub', placeholder: 'johndoe' },
    { value: 'portfolio', label: 'Portfolio', placeholder: 'johndoe.dev' },
    { value: 'behance', label: 'Behance', placeholder: 'johndoe' },
    { value: 'dribbble', label: 'Dribbble', placeholder: 'johndoe' },
    { value: 'other', label: 'Other', placeholder: 'username or URL' },
  ];

  const PREVIEW_CONTEXT_STORAGE_KEY = 'resume-preview-lens-context';

  const readPhotoLensHistory = () => {
    if (typeof window === 'undefined') return [] as string[];
    try {
      const raw = localStorage.getItem(PHOTO_HISTORY_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : [];
    } catch {
      return [] as string[];
    }
  };

  const savePhotoLensHistory = (items: string[]) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(PHOTO_HISTORY_STORAGE_KEY, JSON.stringify(items.slice(0, MAX_PHOTO_HISTORY_ITEMS)));
    } catch {
      // ignore
    }
  };

  const syncPhotoLensHistory = (nextImage?: string) => {
    const current = readPhotoLensHistory();
    const merged = [
      ...(nextImage ? [nextImage] : []),
      ...current.filter((item) => item !== nextImage),
    ].slice(0, MAX_PHOTO_HISTORY_ITEMS);
    setPhotoLensHistory(merged);
    savePhotoLensHistory(merged);
  };

  const handlePhotoLensFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_PHOTO_UPLOAD_BYTES) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      if (!result) return;
      setPhotoLensImage(result);
      setPhotoLensHistory((prev) => {
        const merged = [result, ...prev.filter((item) => item !== result)].slice(0, MAX_PHOTO_HISTORY_ITEMS);
        savePhotoLensHistory(merged);
        return merged;
      });
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const savePhotoLensImage = () => {
    updatePreviewData((data) => ({
      ...data,
      basicInfo: {
        ...(data.basicInfo || {
          fullName: '',
          firstName: '',
          lastName: '',
          professionalTitle: '',
          futureGoal: '',
          email: '',
          phone: '',
          location: '',
          socialProfiles: [],
        }),
        profilePicture: photoLensImage,
      },
    }));
    syncPhotoLensHistory(photoLensImage);
  };

  const clampSectionFontSize = (value: number) => Math.max(0.8, Math.min(1.35, Number(value || 1)));

  const createEditDraft = () => ({
    basicInfo: {
      fullName: resumeData.basicInfo?.fullName || '',
      firstName: resumeData.basicInfo?.firstName || '',
      lastName: resumeData.basicInfo?.lastName || '',
      professionalTitle: resumeData.basicInfo?.professionalTitle || '',
      futureGoal: resumeData.basicInfo?.futureGoal || '',
      email: resumeData.basicInfo?.email || '',
      phone: resumeData.basicInfo?.phone || '',
      location: resumeData.basicInfo?.location || '',
      socialProfiles: (resumeData.basicInfo?.socialProfiles || []).map((profile) => ({ ...profile })),
    },
    education: {
      university: resumeData.education?.university || '',
      degree: resumeData.education?.degree || '',
      major: resumeData.education?.major || '',
      graduationYear: resumeData.education?.graduationYear || '',
      gpax: resumeData.education?.gpax || '',
      courseworkText: (resumeData.education?.coursework || []).join(', '),
      additionalEntries: (resumeData.education?.additionalEntries || []).map((entry) => ({
        university: entry.university || '',
        degree: entry.degree || '',
        major: entry.major || '',
        graduationYear: entry.graduationYear || '',
        gpax: entry.gpax || '',
        courseworkText: (entry.coursework || []).join(', '),
      })),
    },
    professionalSummary: {
      role: resumeData.professionalSummary?.role || '',
      experience: resumeData.professionalSummary?.experience || '',
      goal: resumeData.professionalSummary?.goal || '',
      description: resumeData.professionalSummary?.description || '',
      showSkillCategories: resumeData.professionalSummary?.showSkillCategories ?? true,
      skillsText: (resumeData.professionalSummary?.skills || []).join(', '),
    },
    experiences: resumeData.experiences.map((experience) => ({
      ...experience,
      skillsText: (experience.skills || []).join(', '),
    })),
    additionalInfo: {
      certifications: (resumeData.certifications || []).map((item) => ({
        name: item.name || '',
        issuer: item.issuer || '',
        year: item.year || '',
      })),
      languages: (resumeData.languages || []).map((item) => ({
        name: item.name || '',
        level: item.level || '',
      })),
      awards: (resumeData.awards || []).map((item) => ({
        title: item.title || '',
        issuer: item.issuer || '',
        year: item.year || '',
      })),
      interests: (resumeData.interests || []).map((name) => ({ name: String(name || '') })),
    },
    sectionFontSizes: {
      ...DEFAULT_SECTION_FONT_SIZES,
      ...(resumeData.sectionFontSizes || {}),
    },
  });

  const openEditStudio = (tab: 'basic' | 'education' | 'summary' | 'experience' | 'additional' | 'fonts' = 'basic') => {
    setEditTab(tab);
    setEditExperienceIndex(0);
    setEditDraft(createEditDraft());
    setShowEditStudio(true);
  };

  const parseCommaList = (value: string) =>
    String(value || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

  const updateLensSectionFontSize = (section: 'basic' | 'education' | 'summary' | 'experience' | 'additional' | 'skills', value: number) => {
    updateSectionFontSizes({ [section]: clampSectionFontSize(value) } as any);
  };

  const getLensSectionFontSize = (section: 'basic' | 'education' | 'summary' | 'experience' | 'additional' | 'skills') => {
    return Number((resumeData.sectionFontSizes as any)?.[section] || 1);
  };

  const setHeadingFont = (font: string) => {
    selectHeadingFont(font);
  };

  const setBodyFont = (font: string) => {
    selectBodyFont(font);
  };

  const lensResumeData = displayResumeData;

  const clonePreviewData = () => JSON.parse(JSON.stringify(lensResumeData || resumeData));

  const updatePreviewData = (updater: (data: any) => any) => {
    const next = updater(clonePreviewData());
    setPreviewResumeData(next);
  };

  const setShowSkillCategoriesPreview = (show: boolean) => {
    const currentSummary = resumeData.professionalSummary || {
      role: '',
      experience: '',
      goal: '',
      description: '',
      skills: [],
    };

    updatePreviewData((data) => ({
      ...data,
      professionalSummary: {
        ...(data.professionalSummary || currentSummary),
        showSkillCategories: show,
      },
    }));

    updateProfessionalSummary({
      ...currentSummary,
      showSkillCategories: show,
    } as any);
  };

  const getLensMainEditPath = (section: 'basic' | 'photo' | 'contact' | 'education' | 'summary' | 'experience' | 'additional' | 'skills') => {
    if (section === 'education') return '/resume/education';
    if (section === 'summary') return '/resume/professional-summary';
    if (section === 'skills') return '/resume/professional-summary';
    if (section === 'experience') return '/resume/experience-stack';
    if (section === 'additional') return '/resume/additional-info';
    return '/resume/basic-info';
  };

  const getContactProfiles = () => {
    return lensResumeData.basicInfo?.socialProfiles || [];
  };

  const updateContactProfile = (index: number, field: 'platform' | 'username', value: string) => {
    const profiles = [...getContactProfiles()];
    const current = profiles[index] || { platform: 'linkedin', username: '' };
    profiles[index] = { ...current, [field]: value };
    updatePreviewData((data) => ({
      ...data,
      basicInfo: {
        ...(data.basicInfo || {
          fullName: '',
          firstName: '',
          lastName: '',
          professionalTitle: '',
          futureGoal: '',
          email: '',
          phone: '',
          location: '',
          socialProfiles: [],
        }),
        socialProfiles: profiles,
      },
    }));
  };

  const addContactProfile = () => {
    updatePreviewData((data) => ({
      ...data,
      basicInfo: {
        ...(data.basicInfo || {
          fullName: '',
          firstName: '',
          lastName: '',
          professionalTitle: '',
          futureGoal: '',
          email: '',
          phone: '',
          location: '',
          socialProfiles: [],
        }),
        socialProfiles: [...getContactProfiles(), { platform: 'linkedin', username: '' }],
      },
    }));
  };

  const removeContactProfile = (index: number) => {
    updatePreviewData((data) => ({
      ...data,
      basicInfo: {
        ...(data.basicInfo || {
          fullName: '',
          firstName: '',
          lastName: '',
          professionalTitle: '',
          futureGoal: '',
          email: '',
          phone: '',
          location: '',
          socialProfiles: [],
        }),
        socialProfiles: getContactProfiles().filter((_, itemIndex) => itemIndex !== index),
      },
    }));
  };

  const moveContactProfile = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    updatePreviewData((data) => {
      const profiles = [...(data.basicInfo?.socialProfiles || [])];
      if (fromIndex < 0 || fromIndex >= profiles.length) return data;
      if (toIndex < 0 || toIndex >= profiles.length) return data;
      const next = [...profiles];
      [next[fromIndex], next[toIndex]] = [next[toIndex], next[fromIndex]];
      return {
        ...data,
        basicInfo: {
          ...(data.basicInfo || {
            fullName: '',
            firstName: '',
            lastName: '',
            professionalTitle: '',
            futureGoal: '',
            email: '',
            phone: '',
            location: '',
            socialProfiles: [],
          }),
          socialProfiles: next,
        },
      };
    });
  };

  const updateBasicField = (field: string, value: string) => {
    updatePreviewData((data) => ({
      ...data,
      basicInfo: {
        fullName: '',
        firstName: '',
        lastName: '',
        professionalTitle: '',
        futureGoal: '',
        email: '',
        phone: '',
        location: '',
        socialProfiles: [],
        ...(data.basicInfo || {}),
        [field]: value,
      },
    }));
  };

  const updateSummaryField = (field: 'role' | 'experience' | 'goal' | 'description' | 'skills', value: string | string[]) => {
    const current = lensResumeData.professionalSummary || {
      role: '',
      experience: '',
      goal: '',
      description: '',
      skills: [],
    };

    updatePreviewData((data) => ({
      ...data,
      professionalSummary: {
        ...current,
        ...(field === 'skills' 
          ? { skills: typeof value === 'string' ? parseCommaList(value) : value }
          : { [field]: value as string }),
      },
    }));
  };

  const updateEducationField = (field: string, value: string) => {
    const current = lensResumeData.education || {
      university: '',
      degree: '',
      major: '',
      graduationYear: '',
      gpax: '',
      coursework: [],
      additionalEntries: [],
    };

    updatePreviewData((data) => ({
      ...data,
      education: {
        ...current,
        ...(field === 'coursework'
          ? { coursework: parseCommaList(value) }
          : { [field]: value }),
      },
    }));
  };

  const getEducationItems = () => {
    const primary = {
      university: lensResumeData.education?.university || '',
      degree: lensResumeData.education?.degree || '',
      major: lensResumeData.education?.major || '',
      graduationYear: lensResumeData.education?.graduationYear || '',
      gpax: lensResumeData.education?.gpax || '',
      coursework: lensResumeData.education?.coursework || [],
    };

    const extras = (lensResumeData.education?.additionalEntries || []).map((entry) => ({
      university: entry.university || '',
      degree: entry.degree || '',
      major: entry.major || '',
      graduationYear: entry.graduationYear || '',
      gpax: entry.gpax || '',
      coursework: entry.coursework || [],
    }));

    return [primary, ...extras];
  };

  const updateEducationEntryField = (index: number, field: string, value: string) => {
    const current = lensResumeData.education || {
      university: '',
      degree: '',
      major: '',
      graduationYear: '',
      gpax: '',
      coursework: [],
      additionalEntries: [],
    };
    const entries = getEducationItems();
    const nextEntries = entries.map((item, itemIndex) => (
      itemIndex === index
        ? {
            ...item,
            ...(field === 'coursework' ? { coursework: parseCommaList(value) } : { [field]: value }),
          }
        : item
    ));

    const [first, ...rest] = nextEntries;
    updatePreviewData((data) => ({
      ...data,
      education: {
        ...current,
        university: first?.university || '',
        degree: first?.degree || '',
        major: first?.major || '',
        graduationYear: first?.graduationYear || '',
        gpax: first?.gpax || '',
        coursework: first?.coursework || [],
        additionalEntries: rest,
      },
    }));
  };

  const addEducationEntry = () => {
    const current = lensResumeData.education || {
      university: '',
      degree: '',
      major: '',
      graduationYear: '',
      gpax: '',
      coursework: [],
      additionalEntries: [],
    };

    const nextAdditional = [
      ...(current.additionalEntries || []),
      {
        university: '',
        degree: '',
        major: '',
        graduationYear: '',
        gpax: '',
        coursework: [],
      },
    ];

    updatePreviewData((data) => ({
      ...data,
      education: {
        ...current,
        additionalEntries: nextAdditional,
      },
    }));
    setLensEducationIndex(nextAdditional.length);
  };

  const moveEducationEntry = (index: number, direction: 'up' | 'down') => {
    const entries = getEducationItems();
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= entries.length) return;

    const nextEntries = [...entries];
    [nextEntries[index], nextEntries[target]] = [nextEntries[target], nextEntries[index]];
    const [first, ...rest] = nextEntries;

    updatePreviewData((data) => ({
      ...data,
      education: {
        ...(data.education || {}),
        university: first.university || '',
        degree: first.degree || '',
        major: first.major || '',
        graduationYear: first.graduationYear || '',
        gpax: first.gpax || '',
        coursework: first.coursework || [],
        additionalEntries: rest,
      },
    }));
    setLensEducationIndex(target);
  };

  const removeEducationEntry = (index: number) => {
    const entries = getEducationItems();
    if (entries.length <= 1) return;
    const nextEntries = entries.filter((_, itemIndex) => itemIndex !== index);
    const [first, ...rest] = nextEntries;

    updatePreviewData((data) => ({
      ...data,
      education: {
        ...(data.education || {}),
        university: first.university || '',
        degree: first.degree || '',
        major: first.major || '',
        graduationYear: first.graduationYear || '',
        gpax: first.gpax || '',
        coursework: first.coursework || [],
        additionalEntries: rest,
      },
    }));
    setLensEducationIndex((prev) => Math.max(0, Math.min(prev, nextEntries.length - 1)));
  };

  const updateExperienceList = (updater: (list: any[]) => any[]) => {
    const current = (lensResumeData.experiences || []).map((item) => ({ ...item }));
    const next = updater(current);
    updatePreviewData((data) => ({
      ...data,
      experiences: next as any,
    }));
  };

  const addLensExperience = () => {
    updateExperienceList((list) => ([
      ...list,
      {
        id: `exp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        type: 'work',
        title: '',
        organization: '',
        role: '',
        startDate: '',
        endDate: '',
        situation: '',
        action: '',
        result: '',
        skills: [],
      },
    ]));
    setLensExperienceIndex((lensResumeData.experiences || []).length);
  };

  const moveLensExperience = (index: number, direction: 'up' | 'down') => {
    updateExperienceList((list) => {
      const target = direction === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= list.length) return list;
      const next = [...list];
      [next[index], next[target]] = [next[target], next[index]];
      setLensExperienceIndex(target);
      return next;
    });
  };

  const removeLensExperience = (index: number) => {
    const item = lensResumeData.experiences[index];
    if (!item) return;
    updatePreviewData((data) => ({
      ...data,
      experiences: (data.experiences || []).filter((experience: any) => experience.id !== item.id),
    }));
    setLensExperienceIndex((prev) => Math.max(0, prev - (prev >= index ? 1 : 0)));
  };

  const updateLensExperienceField = (index: number, field: string, value: string) => {
    updateExperienceList((list) => list.map((item, i) => {
      if (i !== index) return item;
      if (field === 'skills') {
        return { ...item, skills: parseCommaList(value) };
      }
      return { ...item, [field]: value };
    }));
  };

  const updateAdditionalGroup = (
    group: 'certifications' | 'languages' | 'awards' | 'interests',
    updater: (items: any[]) => any[]
  ) => {
    if (group === 'certifications') {
      updatePreviewData((data) => ({
        ...data,
        certifications: updater([...(data.certifications || [])]),
      }));
      return;
    }
    if (group === 'languages') {
      updatePreviewData((data) => ({
        ...data,
        languages: updater([...(data.languages || [])]),
      }));
      return;
    }
    if (group === 'awards') {
      updatePreviewData((data) => ({
        ...data,
        awards: updater([...(data.awards || [])]),
      }));
      return;
    }

    const interestObjects = (lensResumeData.interests || []).map((name) => ({ name }));
    const updated = updater(interestObjects)
      .map((item) => String(item.name || '').trim())
      .filter(Boolean);
    updatePreviewData((data) => ({
      ...data,
      interests: updated,
    }));
  };

  const saveEditStudio = () => {
    if (!editDraft) return;

    updateBasicInfo({
      ...resumeData.basicInfo,
      ...editDraft.basicInfo,
      socialProfiles: editDraft.basicInfo.socialProfiles || [],
    });

    updateEducation({
      ...resumeData.education,
      ...editDraft.education,
      coursework: parseCommaList(editDraft.education.courseworkText),
      additionalEntries: (editDraft.education.additionalEntries || []).map((entry: any) => ({
        university: entry.university || '',
        degree: entry.degree || '',
        major: entry.major || '',
        graduationYear: entry.graduationYear || '',
        gpax: entry.gpax || '',
        coursework: parseCommaList(entry.courseworkText),
      })),
    });

    updateProfessionalSummary({
      ...resumeData.professionalSummary,
      ...editDraft.professionalSummary,
      showSkillCategories: (editDraft.professionalSummary as any).showSkillCategories ?? resumeData.professionalSummary?.showSkillCategories ?? true,
      skills: parseCommaList(editDraft.professionalSummary.skillsText),
    });

    const existingIds = new Set((resumeData.experiences || []).map((item) => item.id));
    const draftIds = new Set((editDraft.experiences || []).map((item: any) => item.id));

    (resumeData.experiences || []).forEach((item) => {
      if (!draftIds.has(item.id)) {
        deleteExperience(item.id);
      }
    });

    editDraft.experiences.forEach((experience: any) => {
      const { skillsText, ...rest } = experience;
      const payload = {
        ...rest,
        skills: parseCommaList(skillsText),
      };

      if (existingIds.has(experience.id)) {
        updateExperience(experience.id, payload);
        return;
      }

      addExperience(payload);
    });

    updateCertifications(
      (editDraft.additionalInfo.certifications || [])
        .map((item: any) => ({
          name: String(item.name || '').trim(),
          issuer: String(item.issuer || '').trim(),
          year: String(item.year || '').trim(),
        }))
        .filter((item: any) => item.name || item.issuer || item.year)
    );
    updateLanguages(
      (editDraft.additionalInfo.languages || [])
        .map((item: any) => ({
          name: String(item.name || '').trim(),
          level: String(item.level || '').trim(),
        }))
        .filter((item: any) => item.name || item.level)
    );
    updateAwards(
      (editDraft.additionalInfo.awards || [])
        .map((item: any) => ({
          title: String(item.title || '').trim(),
          issuer: String(item.issuer || '').trim(),
          year: String(item.year || '').trim(),
        }))
        .filter((item: any) => item.title || item.issuer || item.year)
    );
    updateInterests(
      (editDraft.additionalInfo.interests || [])
        .map((item: any) => String(item.name || '').trim())
        .filter(Boolean)
    );

    updateSectionFontSizes(
      Object.fromEntries(
        Object.entries(editDraft.sectionFontSizes || {}).map(([key, value]) => [key, clampSectionFontSize(Number(value))])
      ) as any
    );

    setLongFieldEditor(null);
    setLongFieldText('');
    setShowEditStudio(false);
    showToast('✓ Resume updated from preview');
  };

  const toWrapperRect = (rect: { top: number; left: number; width: number; height: number }) => {
    if (!previewRef.current) return null;
    const wrapper = previewRef.current.getBoundingClientRect();
    return {
      top: rect.top - wrapper.top,
      left: rect.left - wrapper.left,
      width: rect.width,
      height: rect.height,
    };
  };

  const updateHoverFocus = (event: React.MouseEvent<HTMLDivElement>) => {
    const wrapper = previewRef.current;
    if (!wrapper) return;
    const target = event.target as HTMLElement;
    const sectionNode = target.closest('[data-edit-section]') as HTMLElement | null;
    if (!sectionNode) {
      setHoverFocusRect(null);
      return;
    }
    const normalized = toWrapperRect(sectionNode.getBoundingClientRect());
    if (!normalized) return;
    setHoverFocusRect(normalized);
  };

  const handlePreviewSectionClick = (
    section: 'basic' | 'photo' | 'contact' | 'education' | 'summary' | 'experience' | 'additional' | 'skills',
    meta?: { bounds?: { top: number; left: number; width: number; height: number } }
  ) => {
    setShowFullscreen(false);
    lensPinnedByDragRef.current = false;
    const normalized = meta?.bounds ? toWrapperRect(meta.bounds) : null;
    if (normalized) {
      setLensAnchor(normalized);
    }
    if (section === 'education') {
      setLensEducationIndex(0);
    }
    setActiveLensSection(section);
  };

  const handleLensDragStart = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!previewRef.current) return;
    const wrapperRect = previewRef.current.getBoundingClientRect();
    lensIsDraggingRef.current = true;
    lensDragStartedRef.current = true;
    lensDragOffsetRef.current = {
      x: event.clientX - wrapperRect.left - lensPosition.left,
      y: event.clientY - wrapperRect.top - lensPosition.top,
    };
    (event.currentTarget as HTMLDivElement).setPointerCapture(event.pointerId);
  };

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      if (!lensIsDraggingRef.current || !previewRef.current || !lensPanelRef.current) return;
      const wrapperRect = previewRef.current.getBoundingClientRect();
      const panel = lensPanelRef.current;
      const panelWidth = panel.offsetWidth || 350;
      const panelHeight = panel.offsetHeight || 360;
      const nextLeft = event.clientX - wrapperRect.left - lensDragOffsetRef.current.x;
      const nextTop = event.clientY - wrapperRect.top - lensDragOffsetRef.current.y;
      const safeLeft = Math.max(-panelWidth + 40, Math.min(nextLeft, previewRef.current.clientWidth - 40));
      const safeTop = Math.max(8, Math.min(nextTop, previewRef.current.clientHeight - panelHeight - 8));
      setLensPosition({ top: safeTop, left: safeLeft });
      lensPinnedByDragRef.current = true;
    };

    const onPointerUp = () => {
      lensIsDraggingRef.current = false;
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, []);

  useEffect(() => {
    if (!activeLensSection || !previewRef.current || !lensPanelRef.current) return;
    if (lensPinnedByDragRef.current && lensDragStartedRef.current) return;

    const wrapper = previewRef.current;
    const wrapperRect = wrapper.getBoundingClientRect();
    const panel = lensPanelRef.current;
    const panelWidth = panel.offsetWidth || 350;
    const panelHeight = panel.offsetHeight || 360;
    const padding = 12;
    const gap = 10;

    const anchor = lensAnchor || {
      top: 64,
      left: 20,
      width: 160,
      height: 80,
    };

    const avoidRects = [
      {
        top: anchor.top - 6,
        left: anchor.left - 6,
        width: anchor.width + 12,
        height: anchor.height + 12,
      },
    ];

    const candidates = [
      { left: anchor.left + anchor.width + gap, top: anchor.top, prefersOutside: true },
      { left: anchor.left - panelWidth - gap, top: anchor.top, prefersOutside: true },
      { left: wrapper.clientWidth - panelWidth - padding, top: anchor.top, prefersOutside: false },
      { left: padding, top: anchor.top, prefersOutside: false },
      { left: anchor.left, top: anchor.top + anchor.height + gap, prefersOutside: false },
      { left: anchor.left, top: anchor.top - panelHeight - gap, prefersOutside: false },
    ];

    const overlapArea = (a: any, b: any) => {
      const x = Math.max(0, Math.min(a.left + a.width, b.left + b.width) - Math.max(a.left, b.left));
      const y = Math.max(0, Math.min(a.top + a.height, b.top + b.height) - Math.max(a.top, b.top));
      return x * y;
    };

    const clampTop = (top: number) => {
      if (top + panelHeight > wrapper.clientHeight - padding) {
        return wrapper.clientHeight - panelHeight - padding;
      }
      return Math.max(padding, top);
    };

    const scored = candidates.map((candidate) => {
      const top = clampTop(candidate.top);
      const rect = { left: candidate.left, top, width: panelWidth, height: panelHeight };

      const contentOverlapPenalty = avoidRects.reduce((sum, avoidRect) => sum + overlapArea(rect, avoidRect), 0);
      const screenLeft = wrapperRect.left + rect.left;
      const screenRight = screenLeft + panelWidth;
      const overflowLeft = Math.max(0, 8 - screenLeft);
      const overflowRight = Math.max(0, screenRight - (window.innerWidth - 8));
      const viewportOverflowPenalty = overflowLeft + overflowRight;
      const insidePenalty = candidate.prefersOutside ? 0 : 140;

      return {
        left: rect.left,
        top: rect.top,
        score: contentOverlapPenalty * 4 + viewportOverflowPenalty * 30 + insidePenalty,
      };
    });

    const best = scored.sort((a, b) => a.score - b.score)[0];
    const safeLeft = best
      ? Math.max(-panelWidth - 20, Math.min(best.left, wrapper.clientWidth + 20))
      : padding;
    const safeTop = best ? best.top : padding;

    setLensPosition({ top: safeTop, left: safeLeft });
  }, [activeLensSection, lensAnchor, resumeData]);

  useEffect(() => {
    if (activeLensSection !== 'photo') return;
    setPhotoLensImage(String(lensResumeData.basicInfo?.profilePicture || ''));
    setPhotoLensHistory(readPhotoLensHistory());
  }, [activeLensSection, lensResumeData.basicInfo?.profilePicture]);

  const createBlankExperience = () => ({
    id: `exp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type: 'work',
    title: '',
    organization: '',
    role: '',
    startDate: '',
    endDate: '',
    situation: '',
    action: '',
    result: '',
    skillsText: '',
  });

  const moveExperience = (index: number, direction: 'up' | 'down') => {
    setEditDraft((prev: any) => {
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.experiences.length) return prev;
      const next = [...prev.experiences];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      setEditExperienceIndex(targetIndex);
      return { ...prev, experiences: next };
    });
  };

  const removeExperienceFromDraft = (index: number) => {
    setEditDraft((prev: any) => {
      const next = prev.experiences.filter((_: any, itemIndex: number) => itemIndex !== index);
      setEditExperienceIndex((current) => {
        if (next.length === 0) return 0;
        if (current > index) return current - 1;
        return Math.min(current, next.length - 1);
      });
      return { ...prev, experiences: next };
    });
  };

  const addExperienceToDraft = () => {
    setEditDraft((prev: any) => {
      const next = [...prev.experiences, createBlankExperience()];
      setEditExperienceIndex(next.length - 1);
      return { ...prev, experiences: next };
    });
  };

  const openLongFieldPopup = (
    target:
      | { scope: 'summary'; field: 'description' | 'skillsText'; label: string }
      | { scope: 'experience'; field: 'situation' | 'action' | 'result' | 'skillsText'; label: string; experienceIndex: number }
  ) => {
    if (!editDraft) return;
    let currentValue = '';

    if (target.scope === 'summary') {
      currentValue = editDraft.professionalSummary?.[target.field] || '';
    } else {
      currentValue = editDraft.experiences?.[target.experienceIndex]?.[target.field] || '';
    }

    setLongFieldEditor(target);
    setLongFieldText(currentValue);
  };

  const saveLongFieldPopup = () => {
    if (!longFieldEditor) return;

    setEditDraft((prev: any) => {
      if (longFieldEditor.scope === 'summary') {
        return {
          ...prev,
          professionalSummary: {
            ...prev.professionalSummary,
            [longFieldEditor.field]: longFieldText,
          },
        };
      }

      return {
        ...prev,
        experiences: prev.experiences.map((item: any, index: number) => (
          index === longFieldEditor.experienceIndex
            ? { ...item, [longFieldEditor.field]: longFieldText }
            : item
        )),
      };
    });

    setLongFieldEditor(null);
    setLongFieldText('');
  };

  const updateAdditionalItem = (group: 'certifications' | 'languages' | 'awards' | 'interests', index: number, field: string, value: string) => {
    setEditDraft((prev: any) => ({
      ...prev,
      additionalInfo: {
        ...prev.additionalInfo,
        [group]: prev.additionalInfo[group].map((item: any, itemIndex: number) => (
          itemIndex === index ? { ...item, [field]: value } : item
        )),
      },
    }));
  };

  const addAdditionalItem = (group: 'certifications' | 'languages' | 'awards' | 'interests') => {
    const blankMap: Record<string, any> = {
      certifications: { name: '', issuer: '', year: '' },
      languages: { name: '', level: '' },
      awards: { title: '', issuer: '', year: '' },
      interests: { name: '' },
    };

    setEditDraft((prev: any) => ({
      ...prev,
      additionalInfo: {
        ...prev.additionalInfo,
        [group]: [...(prev.additionalInfo[group] || []), blankMap[group]],
      },
    }));
  };

  const removeAdditionalItem = (group: 'certifications' | 'languages' | 'awards' | 'interests', index: number) => {
    setEditDraft((prev: any) => ({
      ...prev,
      additionalInfo: {
        ...prev.additionalInfo,
        [group]: prev.additionalInfo[group].filter((_: any, itemIndex: number) => itemIndex !== index),
      },
    }));
  };

  const moveAdditionalItem = (group: 'certifications' | 'languages' | 'awards' | 'interests', index: number, direction: 'up' | 'down') => {
    setEditDraft((prev: any) => {
      const next = [...prev.additionalInfo[group]];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= next.length) return prev;
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return {
        ...prev,
        additionalInfo: {
          ...prev.additionalInfo,
          [group]: next,
        },
      };
    });
  };

  useEffect(() => {
    setLocalColor(resumeData.templateColor || '#6b21a8');
  }, [resumeData.templateColor]);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const lensPanelRef = useRef<HTMLDivElement>(null);
  const lensIsDraggingRef = useRef(false);
  const lensDragStartedRef = useRef(false);
  const lensPinnedByDragRef = useRef(false);
  const lensDragOffsetRef = useRef({ x: 0, y: 0 });
  const exportFontCssRef = useRef<string>('');
  const [isExporting, setIsExporting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showJobPicker, setShowJobPicker] = useState(false);
  const [jobOptions, setJobOptions] = useState<Array<{ jobId: string; jobTitle: string; requiredSkills?: string[]; optionalSkills?: string[] }>>([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [jobPickerError, setJobPickerError] = useState('');
  const location = useLocation();
  const previewResumeId = new URLSearchParams(location.search).get('id');
  const [isLoadingPreviewResume, setIsLoadingPreviewResume] = useState(false);
  const initialShowExample = previewResumeId
    ? false
    : typeof (location.state as any)?.showExample === 'boolean'
      ? (location.state as any).showExample
      : false;

  const [showExample, setShowExample] = useState(initialShowExample);

  useEffect(() => {
    if (previewResumeId) {
      setShowExample(false);
    }
  }, [previewResumeId]);

  useEffect(() => {
    let isMounted = true;

    const loadPreviewResume = async () => {
      if (!previewResumeId) {
        if (isMounted) setIsLoadingPreviewResume(false);
        return;
      }

      if (String(resumeId || '') === String(previewResumeId)) {
        if (isMounted) setIsLoadingPreviewResume(false);
        return;
      }

      try {
        if (isMounted) setIsLoadingPreviewResume(true);
        await loadResume(previewResumeId);
      } catch (error) {
        console.error('Failed to load preview resume:', error);
        navigate('/resume');
      } finally {
        if (isMounted) setIsLoadingPreviewResume(false);
      }
    };

    void loadPreviewResume();

    return () => {
      isMounted = false;
    };
  }, [loadResume, navigate, previewResumeId, resumeId]);

  useEffect(() => {
    if (showEditStudio) {
      setEditDraft(createEditDraft());
    }
  }, [showEditStudio, resumeData]);

  useEffect(() => {
    return () => {
      clearPreviewResumeData();
    };
  }, [clearPreviewResumeData]);

  useEffect(() => {
    if (isLoadingPreviewResume) return;

    if (!resumeData.basicInfo) {
      navigate('/resume/basic-info');
    } else if (!resumeData.education) {
      navigate('/resume/education');
    } else if (resumeData.experiences.length === 0) {
      navigate('/resume/experience-stack');
    }
  }, [isLoadingPreviewResume, resumeData, navigate]);

  // Get selected template or default to professional-blue
  const getSelectedTemplate = () => {
    const selectedId = resumeData.selectedTemplate || 'professional-blue';
    const selectedTemplate = templates.find(t => t.id === selectedId);
    return selectedTemplate || templates[1];
  };

  const showToast = (message: string, isError = false) => {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: ${isError ? '#ef4444' : '#10b981'};
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      z-index: 9999;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const loadingStateView = (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Resume Preview</h1>
          <p className={styles.subtitle}>Loading selected resume...</p>
        </div>
      </div>
    </div>
  );

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

  const getKeywords = (value: string) =>
    String(value || '')
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\u0E00-\u0E7F\s]/g, ' ')
      .split(/\s+/)
      .filter((token) => token.length >= 2);

  const guessBestJobId = (jobs: Array<{ jobId: string; jobTitle: string; requiredSkills?: string[]; optionalSkills?: string[] }>) => {
    const roleText = [
      resumeData.basicInfo?.professionalTitle,
      resumeData.professionalSummary?.role,
      resumeData.basicInfo?.futureGoal,
      resumeData.professionalSummary?.goal
    ].filter(Boolean).join(' ');

    const roleTokens = new Set(getKeywords(roleText));
    const userSkills = new Set((resumeData.professionalSummary?.skills || []).map((s) => String(s || '').toLowerCase()));

    let bestJobId = '';
    let bestScore = 0;

    jobs.forEach((job) => {
      const titleTokens = getKeywords(job.jobTitle);
      const required = (job.requiredSkills || []).map((s) => String(s || '').toLowerCase());
      const optional = (job.optionalSkills || []).map((s) => String(s || '').toLowerCase());

      const titleScore = titleTokens.reduce((sum, token) => sum + (roleTokens.has(token) ? 3 : 0), 0);
      const requiredSkillScore = required.reduce((sum, skill) => sum + (userSkills.has(skill) ? 2 : 0), 0);
      const optionalSkillScore = optional.reduce((sum, skill) => sum + (userSkills.has(skill) ? 1 : 0), 0);
      const total = titleScore + requiredSkillScore + optionalSkillScore;

      if (total > bestScore) {
        bestScore = total;
        bestJobId = job.jobId;
      }
    });

    if (!bestJobId || bestScore <= 0) {
      return '';
    }

    return bestJobId;
  };

  const buildResumeTextFromContext = () => {
    const sections: string[] = [];
    const basic = resumeData.basicInfo;
    const education = resumeData.education;
    const summary = resumeData.professionalSummary;

    if (basic) {
      sections.push('=== BASIC INFO ===');
      if (basic.fullName) sections.push(`Name: ${basic.fullName}`);
      if (basic.professionalTitle) sections.push(`Professional Title: ${basic.professionalTitle}`);
      if (basic.futureGoal) sections.push(`Future Goal: ${basic.futureGoal}`);
      if (basic.email) sections.push(`Email: ${basic.email}`);
      if (basic.phone) sections.push(`Phone: ${basic.phone}`);
      if (basic.location) sections.push(`Location: ${basic.location}`);
      if (basic.socialProfiles?.length) {
        sections.push(`Social Profiles: ${basic.socialProfiles.map((p) => `${p.platform}:${p.username}`).join(', ')}`);
      }
    }

    if (summary) {
      sections.push('=== PROFESSIONAL SUMMARY ===');
      if (summary.role) sections.push(`Target Role: ${summary.role}`);
      if (summary.experience) sections.push(`Experience: ${summary.experience}`);
      if (summary.goal) sections.push(`Career Goal: ${summary.goal}`);
      if (summary.description) sections.push(`Summary: ${summary.description}`);
      if (summary.skills?.length) sections.push(`Core Skills: ${summary.skills.join(', ')}`);
    }

    if (education) {
      sections.push('=== EDUCATION ===');
      sections.push(`University: ${education.university || '-'}`);
      sections.push(`Degree: ${education.degree || '-'}`);
      sections.push(`Major: ${education.major || '-'}`);
      sections.push(`Graduation Year: ${education.graduationYear || '-'}`);
      sections.push(`GPAX: ${education.gpax || '-'}`);
      if (education.coursework?.length) {
        sections.push(`Coursework: ${education.coursework.join(', ')}`);
      }

      (education.additionalEntries || []).forEach((entry, index) => {
        sections.push(`Additional Education ${index + 1}: ${entry.degree || '-'} ${entry.major || '-'} ${entry.university || '-'}`);
        if (entry.coursework?.length) {
          sections.push(`Additional Coursework ${index + 1}: ${entry.coursework.join(', ')}`);
        }
      });
    }

    if (resumeData.experiences.length) {
      sections.push('=== EXPERIENCE ===');
      resumeData.experiences.forEach((exp, index) => {
        sections.push(`Experience ${index + 1} (${exp.type}):`);
        sections.push(`Title: ${exp.title || '-'}`);
        sections.push(`Organization: ${exp.organization || '-'}`);
        sections.push(`Role: ${exp.role || '-'}`);
        sections.push(`Duration: ${exp.startDate || '-'} to ${exp.endDate || 'Present'}`);
        if (exp.situation) sections.push(`Situation: ${exp.situation}`);
        if (exp.action) sections.push(`Action: ${exp.action}`);
        if (exp.result) sections.push(`Result: ${exp.result}`);
        if (exp.skills?.length) sections.push(`Skills: ${exp.skills.join(', ')}`);
      });
    }

    if (resumeData.certifications?.length) {
      sections.push('=== CERTIFICATIONS ===');
      resumeData.certifications.forEach((item) => {
        sections.push(`${item.name || '-'} | ${item.issuer || '-'} | ${item.year || '-'}`);
      });
    }

    if (resumeData.languages?.length) {
      sections.push('=== LANGUAGES ===');
      resumeData.languages.forEach((item) => {
        sections.push(`${item.name || '-'}: ${item.level || '-'}`);
      });
    }

    if (resumeData.awards?.length) {
      sections.push('=== AWARDS ===');
      resumeData.awards.forEach((item) => {
        sections.push(`${item.title || '-'} | ${item.issuer || '-'} | ${item.year || '-'}`);
      });
    }

    if (resumeData.interests?.length) {
      sections.push('=== INTERESTS ===');
      sections.push(resumeData.interests.join(', '));
    }

    return sections.join('\n');
  };

  const sortKeysDeep = (value: any): any => {
    if (Array.isArray(value)) {
      return value.map((item) => sortKeysDeep(item));
    }
    if (value && typeof value === 'object') {
      return Object.keys(value)
        .sort()
        .reduce((acc, key) => {
          acc[key] = sortKeysDeep(value[key]);
          return acc;
        }, {} as Record<string, any>);
    }
    return value;
  };

  const buildResumeFingerprint = async (jobId: string) => {
    const payload = JSON.stringify(sortKeysDeep({
      resumeData,
      jobIds: [jobId]
    }));
    const encoded = new TextEncoder().encode(payload);
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  };

  const setLastAnalysisId = (userId: string, analysisId: string) => {
    const key = `nexlabs_last_analysis_${userId}`;
    const storage = getPreferredStorage();
    storage.setItem(key, analysisId);
    if (localStorage.getItem(key) !== null) localStorage.setItem(key, analysisId);
    if (sessionStorage.getItem(key) !== null) sessionStorage.setItem(key, analysisId);
  };

  const runAnalysisWithJob = async (jobId: string) => {
    const resumeText = buildResumeTextFromContext();
    if (!resumeText.trim()) {
      showToast('กรุณากรอกข้อมูลเรซูเม่ก่อนใช้งาน AI', true);
      return;
    }

    setIsAnalyzing(true);
    setJobPickerError('');
    const userId = getCurrentUserId();
    const fileName = `${resumeData.basicInfo?.fullName || 'resume'}_builder`;

    try {
      const fingerprint = await buildResumeFingerprint(jobId);

      const response = await aiService.analyzeResumeContext(resumeText, [jobId], fileName, fingerprint);
      if (!response?.success || !response?.data?.analysis) {
        throw new Error(response?.message || 'ไม่สามารถประเมินคะแนนได้');
      }

      const analysisData = response.data.analysis;
      const analysisId = String(response.data.analysisId || '');
      const summary = analysisData.skillGapSummary || {
        summary: 'ยังไม่มีสรุปผล',
        priorities: [],
        nextSteps: []
      };

      setContextAnalysis({
        userId,
        overallScore: analysisData.overallScore || 0,
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
        selectedJobIds: response.data.selectedJobIds || [jobId],
        fileName,
        fileMimeType: 'text/resume-builder',
        filePreviewUrl: undefined,
        uploadDate: new Date().toISOString()
      });

      if (analysisId) {
        setLastAnalysisId(userId, analysisId);
        pushAnalysisHistory(userId, analysisId, fileName, Number(analysisData.overallScore || 0));
      }

      if (response?.data?.reusedFromCache) {
        showToast('ใช้ผลวิเคราะห์เดิมจากระบบเพื่อลดการใช้โทเคน AI');
      }

      if ((analysisData.overallScore || 0) >= 80) {
        showToast('ผ่านเกณฑ์ความพร้อมสมัครงาน (80+)');
      } else {
        showToast('ยังไม่ถึงเกณฑ์ 80 ระบบแนะนำจุดที่ต้องปรับให้แล้ว');
      }

      navigate('/resume/analysis-results');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'ไม่สามารถประเมินคะแนนได้', true);
    } finally {
      setIsAnalyzing(false);
      setShowJobPicker(false);
    }
  };

  const ensureImageHasVisibleContent = async (dataUrl: string) => {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load rendered preview image'));
      img.src = dataUrl;
    });

    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.drawImage(image, 0, 0);
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);

    let sampled = 0;
    let nearWhite = 0;
    const step = Math.max(4, Math.floor((canvas.width * canvas.height) / 120000));

    for (let i = 0; i < data.length; i += 4 * step) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      sampled += 1;
      // Treat transparent and very bright pixels as white background.
      if (a < 5 || (r > 248 && g > 248 && b > 248)) {
        nearWhite += 1;
      }
    }

    if (!sampled) return;

    const whiteRatio = nearWhite / sampled;
    if (whiteRatio > 0.992) {
      throw new Error('Rendered preview is blank or near-blank');
    }
  };

  const getExportFontCss = async () => {
    if (exportFontCssRef.current) {
      return exportFontCssRef.current;
    }

    const familiesQuery = EXPORT_FONT_FAMILIES.map((family) => `family=${family}`).join('&');
    const fontCssUrls = [
      `https://fonts.googleapis.com/css2?${familiesQuery}&display=swap`
    ];

    const chunks = await Promise.all(
      fontCssUrls.map(async (url) => {
        try {
          const response = await fetch(url, { mode: 'cors' });
          if (!response.ok) return '';
          return await response.text();
        } catch {
          return '';
        }
      })
    );

    exportFontCssRef.current = chunks.filter(Boolean).join('\n');
    return exportFontCssRef.current;
  };

  const handleExport = async (format: 'pdf' | 'png' | 'jpg') => {
    if (isExporting) return;

    setIsExporting(true);
    setShowExportMenu(false);

    const statusMsg = format === 'pdf' ? 'Downloading PDF...' : format === 'png' ? 'Downloading PNG...' : 'Downloading JPG...';
    showToast(statusMsg);

    const paperElement = document.querySelector('[data-resume-paper]') as HTMLElement | null;

    if (!paperElement) {
      setIsExporting(false);
      showToast('✗ Resume preview element not found', true);
      return;
    }

    let exportSandbox: HTMLDivElement | null = null;
    const previewRect = paperElement.getBoundingClientRect();
    const exportWidthPx = Math.max(1, Math.round(previewRect.width));
    const exportHeightPx = Math.max(1, Math.round(previewRect.height));

    try {
      await (document as any).fonts?.ready;

      const selectedFonts = [resumeData.headingFont, resumeData.bodyFont].filter(Boolean) as string[];
      if (selectedFonts.length && (document as any).fonts?.load) {
        await Promise.all(
          selectedFonts.map((fontName) => {
            const cleanName = fontName.replace(/^['\"]|['\"]$/g, '').trim();
            return (document as any).fonts.load(`400 16px "${cleanName}"`);
          })
        );
      }

      const fullName = resumeData.basicInfo?.fullName || 'resume';
      const safeName = fullName
        .trim()
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9_\-]/g, '');

      const clone = paperElement.cloneNode(true) as HTMLElement;

      exportSandbox = document.createElement('div');
      exportSandbox.style.cssText = `
        position: fixed;
        left: -10000px;
        top: 0;
        width: ${exportWidthPx}px;
        height: ${exportHeightPx}px;
        background: #ffffff;
        padding: 0;
        margin: 0;
        overflow: visible;
        z-index: -1;
      `;

      clone.style.width = `${exportWidthPx}px`;
      clone.style.height = `${exportHeightPx}px`;
      clone.style.maxWidth = 'none';
      clone.style.aspectRatio = 'auto';
      clone.style.margin = '0';
      clone.style.transform = 'none';

      exportSandbox.appendChild(clone);
      document.body.appendChild(exportSandbox);

      const pixelRatio = Math.max(2, window.devicePixelRatio || 1);
      const fontEmbedCSS = await getExportFontCss();
      const imageDataUrl = await toPng(clone, {
        cacheBust: true,
        backgroundColor: '#ffffff',
        pixelRatio,
        width: exportWidthPx,
        height: exportHeightPx,
        skipFonts: false,
        preferredFontFormat: 'woff2',
        ...(fontEmbedCSS ? { fontEmbedCSS } : { skipFonts: true })
      });
      await ensureImageHasVisibleContent(imageDataUrl);

      if (format === 'pdf') {
        const filename = `resume_${safeName || 'resume'}.pdf`;
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'letter'
        });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        pdf.addImage(imageDataUrl, 'PNG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
        pdf.save(filename);
        showToast('✓ PDF downloaded successfully!');
      } else if (format === 'png') {
        const filename = `resume_${safeName || 'resume'}.png`;
        const link = document.createElement('a');
        link.href = imageDataUrl;
        link.download = filename;
        link.click();
        showToast('✓ PNG downloaded successfully!');
      } else if (format === 'jpg') {
        const filename = `resume_${safeName || 'resume'}.jpg`;
        const canvas = document.createElement('canvas');
        canvas.width = exportWidthPx;
        canvas.height = exportHeightPx;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, 0, 0, exportWidthPx, exportHeightPx);
            canvas.toBlob((blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = filename;
                link.click();
                URL.revokeObjectURL(url);
                showToast('✓ JPG downloaded successfully!');
              }
            }, 'image/jpeg', 0.95);
          };
          img.src = imageDataUrl;
        } else {
          showToast('✗ Failed to create JPG', true);
        }
      }
    } catch (error) {
      console.error('Export error:', error);
      showToast('✗ Failed to export file', true);
    } finally {
      if (exportSandbox) {
        exportSandbox.remove();
      }
      setIsExporting(false);
    }
  };

  const handleSavePDF = async () => {
    await handleExport('pdf');
  };

  const handleAIRecommend = async () => {
    if (isAnalyzing) return;

    setJobPickerError('');

    try {
      const response = await aiService.getJobDescriptions();
      const jobs = Array.isArray(response?.data) ? response.data : [];
      if (!jobs.length) {
        showToast('ไม่พบตำแหน่งงานสำหรับประเมินคะแนน', true);
        return;
      }

      setJobOptions(jobs);
      const guessedJobId = guessBestJobId(jobs);

      if (guessedJobId) {
        setSelectedJobId(guessedJobId);
        await runAnalysisWithJob(guessedJobId);
        return;
      }

      setSelectedJobId('');
      setShowJobPicker(true);
    } catch {
      showToast('โหลดตำแหน่งงานไม่สำเร็จ กรุณาลองใหม่', true);
    }
  };

  const handleInterview = () => {
    navigate('/interview');
  };

  const handleGoToAiPage = async () => {
    if (isAnalyzing) return;
    await handleAIRecommend();
  };

  const [showFullscreen, setShowFullscreen] = useState(false);
  const [modalScale, setModalScale] = useState(1);

  const zoomIn = () => setModalScale(s => Math.min(2, +(s + 0.1).toFixed(2)));
  const zoomOut = () => setModalScale(s => Math.max(0.5, +(s - 0.1).toFixed(2)));
  const fitToWidth = () => setModalScale(0.95);
  const resetScale = () => setModalScale(1);

  // Prevent page scroll when dropdown/modal is open
  useEffect(() => {
    if (showTemplateDropdown || showFullscreen || activeLensSection) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'auto';
      };
    }
  }, [showTemplateDropdown, showFullscreen, activeLensSection]);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(PREVIEW_CONTEXT_STORAGE_KEY);
      if (!raw) return;

      const stored = JSON.parse(raw) as {
        activeLensSection?: typeof activeLensSection;
        lensAnchor?: typeof lensAnchor;
        lensPosition?: typeof lensPosition;
        lensEducationIndex?: number;
        lensExperienceIndex?: number;
        lensAdditionalGroup?: typeof lensAdditionalGroup;
        showFontControls?: boolean;
      };

      if (stored.activeLensSection) {
        setActiveLensSection(stored.activeLensSection);
      }
      if (stored.lensAnchor) {
        setLensAnchor(stored.lensAnchor);
      }
      if (stored.lensPosition) {
        setLensPosition(stored.lensPosition);
      }
      if (typeof stored.lensEducationIndex === 'number') {
        setLensEducationIndex(stored.lensEducationIndex);
      }
      if (typeof stored.lensExperienceIndex === 'number') {
        setLensExperienceIndex(stored.lensExperienceIndex);
      }
      if (stored.lensAdditionalGroup) {
        setLensAdditionalGroup(stored.lensAdditionalGroup);
      }
      if (typeof stored.showFontControls === 'boolean') {
        setShowFontControls(stored.showFontControls);
      }

      sessionStorage.removeItem(PREVIEW_CONTEXT_STORAGE_KEY);
    } catch {
      sessionStorage.removeItem(PREVIEW_CONTEXT_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showExportMenu && !target.closest('[data-export-menu]')) {
        setShowExportMenu(false);
      }
    };

    if (showExportMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showExportMenu]);

  

  const selectedTemplate = getSelectedTemplate();
  const lensFontSection = activeLensSection && activeLensSection !== 'photo' && activeLensSection !== 'contact'
    ? activeLensSection
    : null;

  const progressSummary = calculateResumeProgress(displayResumeData);

  return isLoadingPreviewResume ? loadingStateView : (
    <div className={styles.container}>
      <Navbar />
      
      <div className={styles.background}>
        <div className={`${styles.blob} ${styles.blob1}`} />
        <div className={`${styles.blob} ${styles.blob2}`} />
        <div className={`${styles.blob} ${styles.blob3}`} />
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Resume Preview</h1>
          <p className={styles.subtitle}>Review and export your professional resume</p>
        </div>

        <div className={styles.layoutGrid}>
          {/* Left Sidebar */}
          <div className={styles.sidebar}>
            {/* Template Card */}
            <div className={styles.card}>
              <h3 className={styles.cardHeader}>Selected Template</h3>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div className={styles.templatePreview}>
                    <div style={{ textAlign: 'center' }}>
                      <div className={styles.templateIcon}>{selectedTemplate.name.charAt(0)}</div>
                      <p className={styles.templateName}>{selectedTemplate.name}</p>
                      <p className={styles.templateDesc}>{selectedTemplate.description}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
                    <input
                      ref={colorInputRef}
                      type="color"
                      value={localColor}
                      onChange={(e) => {
                        const v = e.target.value;
                        setLocalColor(v);
                        selectTemplateColor?.(v);
                      }}
                      style={{ display: 'none' }}
                    />

                    <button
                      onClick={() => colorInputRef.current?.click()}
                      title="Custom accent color"
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        border: '2px solid rgba(0,0,0,0.08)',
                        background: localColor,
                        cursor: 'pointer'
                      }}
                      aria-label="Choose accent color"
                    />
                  </div>
                </div>
              </div>

              <div style={{ position: 'relative', marginTop: 12 }}>
                <button
                  onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
                  className={styles.changeTemplateBtn}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}
                >
                  <span>Change Template</span>
                  <ChevronDown size={16} style={{ transform: showTemplateDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                </button>
                {showTemplateDropdown && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      background: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      marginTop: '0.5rem',
                      maxHeight: '300px',
                      overflowY: 'auto',
                      zIndex: 50,
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    {templates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => {
                          selectTemplate(template.id);
                          setShowTemplateDropdown(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          textAlign: 'left',
                          border: 'none',
                          background: resumeData.selectedTemplate === template.id ? '#f0f9ff' : 'transparent',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: resumeData.selectedTemplate === template.id ? '600' : '500',
                          color: resumeData.selectedTemplate === template.id ? '#0284c7' : '#111827',
                          transition: 'background-color 0.2s',
                          borderBottom: '1px solid #f3f4f6'
                        }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLElement).style.background = '#f9fafb';
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLElement).style.background = resumeData.selectedTemplate === template.id ? '#f0f9ff' : 'transparent';
                        }}
                      >
                        {template.name}
                      </button>
                    ))}
                  </div>
                )}

                <div style={{ marginTop: 10, position: 'relative', width: '100%' }}>
                  <button
                    type="button"
                    onClick={() => setShowFontControls((prev) => !prev)}
                    className={styles.changeTemplateBtn}
                  >
                    {showFontControls ? 'Hide font styles' : 'Font styles'}
                  </button>

                  {showFontControls && (
                    <div className={styles.templateFontOverlay}>
                      <div className={styles.templateFontOverlayHeader}>
                        <strong>Font styles</strong>
                        <button
                          type="button"
                          className={styles.zoomButton}
                          onClick={() => setShowFontControls(false)}
                          aria-label="Close font picker"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <div className={styles.fontPickerRow}>
                        <label>Heading Font</label>
                        <select
                          className={styles.fontPickerSelect}
                          value={resumeData.headingFont || 'Inter'}
                          onChange={(event) => setHeadingFont(event.target.value)}
                          style={{ fontFamily: `'${resumeData.headingFont || 'Inter'}', sans-serif` }}
                        >
                          {FONT_OPTIONS.map((font) => (
                            <option key={font} value={font}>{font}</option>
                          ))}
                        </select>
                      </div>
                      <div className={styles.fontPickerRow}>
                        <label>Body Font</label>
                        <select
                          className={styles.fontPickerSelect}
                          value={resumeData.bodyFont || 'Inter'}
                          onChange={(event) => setBodyFont(event.target.value)}
                          style={{ fontFamily: `'${resumeData.bodyFont || 'Inter'}', sans-serif` }}
                        >
                          {FONT_OPTIONS.map((font) => (
                            <option key={font} value={font}>{font}</option>
                          ))}
                        </select>
                      </div>
                      <div className={styles.fontPickerRow} style={{ alignItems: 'center' }}>
                        <label>Skills Categories</label>
                        <button
                          type="button"
                          onClick={() => setShowSkillCategoriesPreview(!(displayResumeData.professionalSummary?.showSkillCategories ?? true))}
                          style={{
                            justifySelf: 'start',
                            border: '1px solid #d1d5db',
                            borderRadius: '9999px',
                            padding: '0.45rem 0.8rem',
                            background: (displayResumeData.professionalSummary?.showSkillCategories ?? true) ? '#eff6ff' : '#fff',
                            color: (displayResumeData.professionalSummary?.showSkillCategories ?? true) ? '#1d4ed8' : '#374151',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          {(displayResumeData.professionalSummary?.showSkillCategories ?? true) ? 'On' : 'Off'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.card} style={{ padding: '1rem', marginTop: '1rem' }}>
              <h3 className={styles.cardHeader} style={{ marginBottom: '0.75rem' }}>Progress</h3>
              <div style={{ display: 'grid', gap: '0.65rem', marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', fontSize: '0.84rem', color: '#334155', fontWeight: 700 }}>
                  <span>{progressSummary.completedCount} / {progressSummary.totalCount} complete</span>
                  <span>{progressSummary.percentage}%</span>
                </div>
                <div style={{ height: '8px', borderRadius: '999px', background: '#e2e8f0', overflow: 'hidden' }}>
                  <div style={{ width: `${progressSummary.percentage}%`, height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, #2563eb 0%, #0ea5e9 100%)' }} />
                </div>
              </div>
              <div className={styles.progressList}>
                {progressSummary.items.map((item, index) => (
                  <div key={index} className={styles.progressItem}>
                    <div className={`${styles.progressIcon} ${item.completed ? styles.completed : styles.pending}`}>
                      {item.completed ? <Check size={16} /> : <span>{index + 1}</span>}
                    </div>
                    <span className={`${styles.progressLabel} ${item.completed ? styles.completed : styles.pending}`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Content Area */}
          <div className={styles.mainContent}>
            {/* Resume Preview */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', width: '100%' }}>
              <div className={styles.previewContainer}>
              <div
                ref={previewRef}
                className={styles.previewWrapper}
                style={{ position: 'relative' }}
                onMouseMove={updateHoverFocus}
                onMouseLeave={() => setHoverFocusRect(null)}
              >
                <div className={styles.previewContent} data-preview-content>
                  <ResumePreview key={`${displayResumeData.additionalSectionTitle}-${selectedTemplate.id}`} scale={1} showExample={showExample} onEditSection={handlePreviewSectionClick} />
                </div>
                {hoverFocusRect && !activeLensSection && (
                  <div
                    className={styles.lensFocusHover}
                    style={{
                      top: hoverFocusRect.top,
                      left: hoverFocusRect.left,
                      width: hoverFocusRect.width,
                      height: hoverFocusRect.height,
                    }}
                  >
                    <span className={`${styles.lensCorner} ${styles.lensCornerTL}`} />
                    <span className={`${styles.lensCorner} ${styles.lensCornerTR}`} />
                    <span className={`${styles.lensCorner} ${styles.lensCornerBL}`} />
                    <span className={`${styles.lensCorner} ${styles.lensCornerBR}`} />
                  </div>
                )}
                {activeLensSection && (
                  <div
                    ref={lensPanelRef}
                    className={styles.lensPanel}
                    style={{ top: lensPosition.top, left: lensPosition.left }}
                  >
                    <div
                      className={`${styles.lensHeader} ${styles.lensDragHandle}`}
                      onPointerDown={handleLensDragStart}
                    >
                      <strong>
                        {activeLensSection === 'basic' && 'Basic Lens'}
                        {activeLensSection === 'photo' && 'Photo Lens'}
                        {activeLensSection === 'contact' && 'Contact Lens'}
                        {activeLensSection === 'education' && 'Education Lens'}
                        {activeLensSection === 'summary' && 'Summary Lens'}
                        {activeLensSection === 'experience' && 'Experience Lens'}
                        {activeLensSection === 'additional' && 'Additional Lens'}
                        {activeLensSection === 'skills' && 'Skills Lens'}
                      </strong>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button
                          type="button"
                          className={styles.zoomButton}
                          onPointerDown={(event) => event.stopPropagation()}
                          onClick={() => {
                            const nextPath = getLensMainEditPath(activeLensSection);
                            clearPreviewResumeData();
                            setActiveLensSection(null);
                            navigate(nextPath);
                          }}
                          title="Go back to the main edit page"
                        >
                          <ChevronLeft size={14} />
                        </button>
                        <span className={styles.lensAutosave}>{isSaving ? 'Auto-saving...' : 'Auto-save on'}</span>
                        <button
                          type="button"
                          className={styles.zoomButton}
                          onPointerDown={(event) => event.stopPropagation()}
                          onClick={() => setActiveLensSection(null)}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>

                    <p className={styles.lensHint}>Click another section on resume to switch this lens.</p>

                    {activeLensSection === 'basic' && (
                      <div className={styles.lensBody}>
                        {[
                          ['fullName', 'Full Name'],
                          ['professionalTitle', 'Professional Title'],
                        ].map(([field, label]) => (
                          <div key={field} className={styles.lensField}>
                            <label>{label}</label>
                            <input value={(lensResumeData.basicInfo as any)?.[field] || ''} onChange={(e) => updateBasicField(field, e.target.value)} />
                          </div>
                        ))}
                      </div>
                    )}

                    {activeLensSection === 'photo' && (
                      <div className={styles.lensBody}>
                        <div className={styles.lensField}>
                          <label>Current photo</label>
                          <div className={styles.photoLensPreview}>
                            {photoLensImage ? (
                              <img src={photoLensImage} alt="Photo preview" className={styles.photoLensPreviewImage} />
                            ) : (
                              <div className={styles.photoLensEmpty}>No photo selected</div>
                            )}
                          </div>
                          <div className={styles.photoLensActions}>
                            <button type="button" className={styles.changeTemplateBtn} onClick={() => photoLensInputRef.current?.click()}>
                              Upload new photo
                            </button>
                            <input
                              ref={photoLensInputRef}
                              type="file"
                              accept=".jpg,.jpeg,.png,.webp"
                              onChange={handlePhotoLensFileSelect}
                              className={styles.fileInput}
                              style={{ display: 'none' }}
                            />
                          </div>
                        </div>

                        {photoLensHistory.length > 0 && (
                          <div className={styles.photoLensHistorySection}>
                            <div className={styles.photoLensHistoryHeader}>Previously used photos</div>
                            <div className={styles.photoHistoryGrid}>
                              {photoLensHistory.map((photo, index) => (
                                <button
                                  key={`photo-lens-history-${index}`}
                                  type="button"
                                  className={`${styles.photoHistoryItem} ${photoLensImage === photo ? styles.photoHistoryItemActive : ''}`}
                                  onClick={() => setPhotoLensImage(photo)}
                                >
                                  <img src={photo} alt={`History ${index + 1}`} className={styles.photoHistoryThumb} />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className={styles.lensField}>
                          <label>Photo Frame Shape</label>
                          <select
                            value={lensResumeData.basicInfo?.photoFrameShape || 'rounded'}
                            onChange={(event) => updateBasicField('photoFrameShape', event.target.value)}
                            className={styles.lensSelect}
                          >
                            <option value="rounded">Rounded</option>
                            <option value="square">Square</option>
                            <option value="circle">Circle</option>
                            <option value="none">No Frame</option>
                          </select>
                        </div>
                        <div className={styles.photoLensPopupFooter} style={{ padding: 0, borderTop: 'none', background: 'transparent', justifyContent: 'space-between' }}>
                          <button type="button" className={styles.buttonSecondary} onClick={() => setPhotoLensImage(String(lensResumeData.basicInfo?.profilePicture || ''))}>
                            Reset
                          </button>
                          <button type="button" className={styles.buttonPrimary} onClick={savePhotoLensImage}>
                            Save to preview
                          </button>
                        </div>
                      </div>
                    )}

                    {activeLensSection === 'contact' && (
                      <div className={styles.lensBody}>
                        {[
                          ['email', 'Email'],
                          ['phone', 'Phone'],
                          ['location', 'Location'],
                        ].map(([field, label]) => (
                          <div key={field} className={styles.lensField}>
                            <label>{label}</label>
                            <input value={(lensResumeData.basicInfo as any)?.[field] || ''} onChange={(e) => updateBasicField(field, e.target.value)} />
                          </div>
                        ))}
                        <div className={styles.lensField}>
                          <label>Social Profiles</label>
                          <div className={styles.contactProfileList}>
                            {(lensResumeData.basicInfo?.socialProfiles || []).map((profile, index) => (
                              <div
                                key={`${profile.platform}-${index}`}
                                className={styles.contactProfileRow}
                                draggable
                                onDragStart={() => setContactDragIndex(index)}
                                onDragOver={(event) => event.preventDefault()}
                                onDrop={() => {
                                  if (contactDragIndex === null) return;
                                  moveContactProfile(contactDragIndex, index);
                                  setContactDragIndex(null);
                                }}
                                onDragEnd={() => setContactDragIndex(null)}
                              >
                                <select
                                  value={profile.platform}
                                  onChange={(event) => updateContactProfile(index, 'platform', event.target.value)}
                                  className={styles.lensSelect}
                                >
                                  {CONTACT_PROFILE_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                  ))}
                                </select>
                                <input
                                  value={profile.username || ''}
                                  onChange={(event) => updateContactProfile(index, 'username', event.target.value)}
                                  placeholder={CONTACT_PROFILE_OPTIONS.find((option) => option.value === profile.platform)?.placeholder || 'username or URL'}
                                />
                                <button type="button" className={styles.zoomButton} onClick={() => removeContactProfile(index)} aria-label="Remove social profile">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                          <button type="button" className={styles.changeTemplateBtn} onClick={addContactProfile} style={{ width: 'fit-content' }}>
                            + Add social profile
                          </button>
                        </div>
                      </div>
                    )}

                    {activeLensSection === 'education' && (
                      <div className={styles.lensBody}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {getEducationItems().map((entry, index) => (
                            <button
                              key={`education-${index}`}
                              type="button"
                              className={`${styles.lensChip} ${lensEducationIndex === index ? styles.lensChipActive : ''}`}
                              onClick={() => setLensEducationIndex(index)}
                            >
                              {entry.university || `Education ${index + 1}`}
                            </button>
                          ))}
                        </div>

                        <div style={{ display: 'flex', gap: 6 }}>
                          <button type="button" className={styles.zoomButton} onClick={addEducationEntry}><Plus size={14} /></button>
                          <button type="button" className={styles.zoomButton} onClick={() => moveEducationEntry(lensEducationIndex, 'up')} disabled={lensEducationIndex <= 0}><ChevronUp size={14} /></button>
                          <button type="button" className={styles.zoomButton} onClick={() => moveEducationEntry(lensEducationIndex, 'down')} disabled={lensEducationIndex >= getEducationItems().length - 1}><ChevronDown size={14} /></button>
                          <button type="button" className={styles.zoomButton} onClick={() => removeEducationEntry(lensEducationIndex)} disabled={getEducationItems().length <= 1}><Trash2 size={14} /></button>
                        </div>

                        <div className={styles.lensField}>
                          <label>University</label>
                          <input
                            value={getEducationItems()[lensEducationIndex]?.university || ''}
                            onChange={(e) => updateEducationEntryField(lensEducationIndex, 'university', e.target.value)}
                          />
                        </div>
                        <div className={styles.lensField}>
                          <label>Degree</label>
                          <input
                            value={getEducationItems()[lensEducationIndex]?.degree || ''}
                            onChange={(e) => updateEducationEntryField(lensEducationIndex, 'degree', e.target.value)}
                          />
                        </div>
                        <div className={styles.lensField}>
                          <label>Major</label>
                          <input
                            value={getEducationItems()[lensEducationIndex]?.major || ''}
                            onChange={(e) => updateEducationEntryField(lensEducationIndex, 'major', e.target.value)}
                          />
                        </div>
                        <div className={styles.lensField}>
                          <label>Graduation Year</label>
                          <input
                            value={getEducationItems()[lensEducationIndex]?.graduationYear || ''}
                            onChange={(e) => updateEducationEntryField(lensEducationIndex, 'graduationYear', e.target.value)}
                          />
                        </div>
                        <div className={styles.lensField}>
                          <label>GPAX</label>
                          <input
                            value={getEducationItems()[lensEducationIndex]?.gpax || ''}
                            onChange={(e) => updateEducationEntryField(lensEducationIndex, 'gpax', e.target.value)}
                          />
                        </div>
                        <div className={styles.lensField}>
                          <label>Coursework (comma separated)</label>
                          <textarea
                            value={(getEducationItems()[lensEducationIndex]?.coursework || []).join(', ')}
                            onChange={(e) => updateEducationEntryField(lensEducationIndex, 'coursework', e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    {activeLensSection === 'summary' && (
                      <div className={styles.lensBody}>
                        {[
                          ['role', 'Role'],
                          ['experience', 'Experience'],
                          ['goal', 'Goal'],
                        ].map(([field, label]) => (
                          <div key={field} className={styles.lensField}>
                            <label>{label}</label>
                            <input value={(lensResumeData.professionalSummary as any)?.[field] || ''} onChange={(e) => updateSummaryField(field as any, e.target.value)} />
                          </div>
                        ))}
                        <div className={styles.lensField}>
                          <label>Description</label>
                          <textarea
                            value={lensResumeData.professionalSummary?.description || ''}
                            onChange={(e) => updateSummaryField('description', e.target.value)}
                          />
                        </div>
                        <div className={styles.lensField}>
                          <label>Skills (comma separated)</label>
                          <textarea
                            value={(lensResumeData.professionalSummary?.skills || []).join(', ')}
                            onChange={(e) => updateSummaryField('skills', e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    {activeLensSection === 'experience' && (
                      <div className={styles.lensBody}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {(lensResumeData.experiences || []).map((item, idx) => (
                            <button
                              key={item.id || idx}
                              type="button"
                              className={`${styles.lensChip} ${lensExperienceIndex === idx ? styles.lensChipActive : ''}`}
                              onClick={() => setLensExperienceIndex(idx)}
                            >
                              {item.title || `Experience ${idx + 1}`}
                            </button>
                          ))}
                        </div>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button type="button" className={styles.zoomButton} onClick={addLensExperience}><Plus size={14} /></button>
                          <button type="button" className={styles.zoomButton} onClick={() => moveLensExperience(lensExperienceIndex, 'up')} disabled={lensExperienceIndex <= 0}><ChevronUp size={14} /></button>
                          <button type="button" className={styles.zoomButton} onClick={() => moveLensExperience(lensExperienceIndex, 'down')} disabled={lensExperienceIndex >= (lensResumeData.experiences || []).length - 1}><ChevronDown size={14} /></button>
                          <button type="button" className={styles.zoomButton} onClick={() => removeLensExperience(lensExperienceIndex)} disabled={(lensResumeData.experiences || []).length === 0}><Trash2 size={14} /></button>
                        </div>
                        {(lensResumeData.experiences || [])[lensExperienceIndex] && (
                          <>
                            {[
                              ['title', 'Title'],
                              ['organization', 'Organization'],
                              ['role', 'Role'],
                              ['startDate', 'Start Date'],
                              ['endDate', 'End Date'],
                            ].map(([field, label]) => (
                              <div key={field} className={styles.lensField}>
                                <label>{label}</label>
                                <input
                                  value={(lensResumeData.experiences[lensExperienceIndex] as any)?.[field] || ''}
                                  onChange={(e) => updateLensExperienceField(lensExperienceIndex, field, e.target.value)}
                                />
                              </div>
                            ))}
                            {['situation', 'action', 'result'].map((field) => (
                              <div key={field} className={styles.lensField}>
                                <label>{field[0].toUpperCase() + field.slice(1)}</label>
                                <textarea
                                  value={(lensResumeData.experiences[lensExperienceIndex] as any)?.[field] || ''}
                                  onChange={(e) => updateLensExperienceField(lensExperienceIndex, field, e.target.value)}
                                />
                              </div>
                            ))}
                            <div className={styles.lensField}>
                              <label>Skills (comma separated)</label>
                              <textarea
                                value={(lensResumeData.experiences[lensExperienceIndex]?.skills || []).join(', ')}
                                onChange={(e) => updateLensExperienceField(lensExperienceIndex, 'skills', e.target.value)}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {activeLensSection === 'additional' && (
                      <div className={styles.lensBody}>
                        <div className={styles.lensTabs}>
                          {[
                            ['certifications', 'Certs'],
                            ['languages', 'Lang'],
                            ['awards', 'Awards'],
                            ['interests', 'Interests'],
                          ].map(([key, label]) => (
                            <button
                              key={key}
                              type="button"
                              className={`${styles.lensTab} ${lensAdditionalGroup === key ? styles.lensTabActive : ''}`}
                              onClick={() => setLensAdditionalGroup(key as any)}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            className={styles.zoomButton}
                            onClick={() => updateAdditionalGroup(lensAdditionalGroup, (items) => ([
                              ...items,
                              lensAdditionalGroup === 'certifications' ? { name: '', issuer: '', year: '' } :
                              lensAdditionalGroup === 'languages' ? { name: '', level: '' } :
                              lensAdditionalGroup === 'awards' ? { title: '', issuer: '', year: '' } :
                              { name: '' },
                            ]))}
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {(lensAdditionalGroup === 'certifications' ? (lensResumeData.certifications || []) :
                          lensAdditionalGroup === 'languages' ? (lensResumeData.languages || []) :
                          lensAdditionalGroup === 'awards' ? (lensResumeData.awards || []) :
                          (lensResumeData.interests || []).map((name) => ({ name }))
                        ).map((item: any, index: number, arr: any[]) => (
                          <div key={`${lensAdditionalGroup}-${index}`} className={styles.lensListItem}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                              <button type="button" className={styles.zoomButton} onClick={() => updateAdditionalGroup(lensAdditionalGroup, (items) => {
                                if (index === 0) return items;
                                const next = [...items];
                                [next[index - 1], next[index]] = [next[index], next[index - 1]];
                                return next;
                              })} disabled={index === 0}><ChevronUp size={14} /></button>
                              <button type="button" className={styles.zoomButton} onClick={() => updateAdditionalGroup(lensAdditionalGroup, (items) => {
                                if (index >= items.length - 1) return items;
                                const next = [...items];
                                [next[index + 1], next[index]] = [next[index], next[index + 1]];
                                return next;
                              })} disabled={index >= arr.length - 1}><ChevronDown size={14} /></button>
                              <button type="button" className={styles.zoomButton} onClick={() => updateAdditionalGroup(lensAdditionalGroup, (items) => items.filter((_, i) => i !== index))}><Trash2 size={14} /></button>
                            </div>
                            {Object.keys(item).map((field) => (
                              <div key={field} className={styles.lensField}>
                                <label>{field}</label>
                                <input
                                  value={item[field] || ''}
                                  onChange={(e) => updateAdditionalGroup(lensAdditionalGroup, (items) => items.map((entry: any, i: number) => (
                                    i === index ? { ...entry, [field]: e.target.value } : entry
                                  )))}
                                />
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}

                    {activeLensSection === 'skills' && (
                      <div className={styles.lensBody}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            className={styles.zoomButton}
                            onClick={() => updateSummaryField('skills', [
                              ...(lensResumeData.professionalSummary?.skills || []),
                              '',
                            ])}
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {(lensResumeData.professionalSummary?.skills || []).map((skill: string, index: number, arr: string[]) => (
                          <div key={`skill-${index}`} className={styles.lensListItem}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                              <button 
                                type="button" 
                                className={styles.zoomButton} 
                                onClick={() => updateSummaryField('skills', (lensResumeData.professionalSummary?.skills || []).map((s, i) => {
                                  if (index === 0 || i !== index && i !== index - 1) return s;
                                  const next = [...(lensResumeData.professionalSummary?.skills || [])];
                                  [next[index - 1], next[index]] = [next[index], next[index - 1]];
                                  return next[i];
                                }))}
                                disabled={index === 0}
                              >
                                <ChevronUp size={14} />
                              </button>
                              <button 
                                type="button" 
                                className={styles.zoomButton} 
                                onClick={() => updateSummaryField('skills', (lensResumeData.professionalSummary?.skills || []).map((s, i) => {
                                  if (index >= arr.length - 1 || i !== index && i !== index + 1) return s;
                                  const next = [...(lensResumeData.professionalSummary?.skills || [])];
                                  [next[index + 1], next[index]] = [next[index], next[index + 1]];
                                  return next[i];
                                }))}
                                disabled={index >= arr.length - 1}
                              >
                                <ChevronDown size={14} />
                              </button>
                              <button 
                                type="button" 
                                className={styles.zoomButton} 
                                onClick={() => updateSummaryField('skills', (lensResumeData.professionalSummary?.skills || []).filter((_, i) => i !== index))}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                            <div className={styles.lensField}>
                              <label>Skill Name</label>
                              <input
                                value={skill || ''}
                                onChange={(e) => updateSummaryField('skills', (lensResumeData.professionalSummary?.skills || []).map((s, i) => i === index ? e.target.value : s))}
                                placeholder="e.g., React, Node.js, Docker"
                              />
                              <small style={{ color: '#999', display: 'block', marginTop: 4 }}>
                                Auto-categorized as: {
                                  skill.toLowerCase().includes('react') || skill.toLowerCase().includes('next') || 
                                  skill.toLowerCase().includes('vue') || skill.toLowerCase().includes('angular') ||
                                  skill.toLowerCase().includes('javascript') || skill.toLowerCase().includes('typescript') ||
                                  skill.toLowerCase().includes('html') || skill.toLowerCase().includes('css') ||
                                  skill.toLowerCase().includes('tailwind') || skill.toLowerCase().includes('sass')
                                    ? 'Frontend' :
                                  skill.toLowerCase().includes('node') || skill.toLowerCase().includes('express') ||
                                  skill.toLowerCase().includes('nestjs') || skill.toLowerCase().includes('python') ||
                                  skill.toLowerCase().includes('java') || skill.toLowerCase().includes('go') ||
                                  skill.toLowerCase().includes('php') || skill.toLowerCase().includes('c#') ||
                                  skill.toLowerCase().includes('dotnet') || skill.toLowerCase().includes('postgres') ||
                                  skill.toLowerCase().includes('mysql') || skill.toLowerCase().includes('mongodb') ||
                                  skill.toLowerCase().includes('database') || skill.toLowerCase().includes('sql')
                                    ? 'Backend' :
                                  skill.toLowerCase().includes('docker') || skill.toLowerCase().includes('kubernetes') ||
                                  skill.toLowerCase().includes('aws') || skill.toLowerCase().includes('gcp') ||
                                  skill.toLowerCase().includes('azure') || skill.toLowerCase().includes('git') ||
                                  skill.toLowerCase().includes('github') || skill.toLowerCase().includes('ci') ||
                                  skill.toLowerCase().includes('cd') || skill.toLowerCase().includes('terraform') ||
                                  skill.toLowerCase().includes('linux') || skill.toLowerCase().includes('nginx')
                                    ? 'DevOps/Tools' :
                                  'Others'
                                }
                              </small>
                            </div>
                          </div>
                        ))}
                        {(!lensResumeData.professionalSummary?.skills || lensResumeData.professionalSummary.skills.length === 0) && (
                          <div style={{ padding: 12, textAlign: 'center', color: '#999' }}>
                            No skills added yet. Click + to add one.
                          </div>
                        )}
                      </div>
                    )}

                    {lensFontSection && (
                      <div className={styles.lensSectionControl}>
                        <label>Font Size</label>
                        <input
                          type="range"
                          min={0.8}
                          max={1.35}
                          step={0.05}
                          value={getLensSectionFontSize(lensFontSection)}
                          onChange={(e) => updateLensSectionFontSize(lensFontSection, Number(e.target.value))}
                        />
                        <span>{Math.round(getLensSectionFontSize(lensFontSection) * 100)}%</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              </div>

              {/* Action Buttons - inline next to preview */}
              <div className={`${styles.card} ${styles.actionCard}`}>
                <div className={styles.actionButtonsContainer}>
                  <div className={styles.actionButtons}>
                  

                  <div className={styles.saveContainer}>
                    <div style={{ position: 'relative' }} data-export-menu>
                      <button
                        onClick={() => setShowExportMenu(!showExportMenu)}
                        disabled={isExporting}
                        className={`${styles.button} ${styles.buttonPrimary} ${styles.stackedButton}`}
                        title="Download resume"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          background: '#1d8bd8',
                          borderColor: '#1d8bd8',
                          color: '#ffffff',
                          boxShadow: '0 10px 22px rgba(29, 139, 216, 0.18)',
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.background = '#167cc2';
                          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 26px rgba(29, 139, 216, 0.22)';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.background = '#1d8bd8';
                          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 10px 22px rgba(29, 139, 216, 0.18)';
                        }}
                      >
                        {isExporting ? (
                          <>
                            <Loader size={16} className="animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Download size={16} />
                            <span>Save</span>
                          </>
                        )}
                      </button>

                      {showExportMenu && !isExporting && (
                        <div style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          background: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.5rem',
                          marginTop: '0.5rem',
                          zIndex: 50,
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                          overflow: 'hidden'
                        }}>
                          <button
                            type="button"
                            onClick={() => handleExport('pdf')}
                            style={{
                              width: '100%',
                              padding: '0.75rem 1rem',
                              textAlign: 'left',
                              border: 'none',
                              background: 'transparent',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              color: '#111827',
                              transition: 'background-color 0.2s',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}
                            onMouseEnter={(e) => {
                              (e.target as HTMLElement).style.background = '#f9fafb';
                            }}
                            onMouseLeave={(e) => {
                              (e.target as HTMLElement).style.background = 'transparent';
                            }}
                          >
                            <Download size={14} />
                            <span>Save as PDF</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleExport('png')}
                            style={{
                              width: '100%',
                              padding: '0.75rem 1rem',
                              textAlign: 'left',
                              border: 'none',
                              background: 'transparent',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              color: '#111827',
                              transition: 'background-color 0.2s',
                              borderTop: '1px solid #f3f4f6',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}
                            onMouseEnter={(e) => {
                              (e.target as HTMLElement).style.background = '#f9fafb';
                            }}
                            onMouseLeave={(e) => {
                              (e.target as HTMLElement).style.background = 'transparent';
                            }}
                          >
                            <Download size={14} />
                            <span>Save as PNG</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleExport('jpg')}
                            style={{
                              width: '100%',
                              padding: '0.75rem 1rem',
                              textAlign: 'left',
                              border: 'none',
                              background: 'transparent',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              color: '#111827',
                              transition: 'background-color 0.2s',
                              borderTop: '1px solid #f3f4f6',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}
                            onMouseEnter={(e) => {
                              (e.target as HTMLElement).style.background = '#f9fafb';
                            }}
                            onMouseLeave={(e) => {
                              (e.target as HTMLElement).style.background = 'transparent';
                            }}
                          >
                            <Download size={14} />
                            <span>Save as JPG</span>
                          </button>
                        </div>
                      )}
                    </div>

                    <div className={styles.saveNote}>Choose a file format: PDF, PNG, or JPG</div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleGoToAiPage}
                    className={`${styles.button} ${styles.buttonSecondary} ${styles.aiButton} ${styles.stackedButton}`}
                    title="Go to AI analysis"
                    style={{ cursor: isAnalyzing ? 'not-allowed' : 'pointer', opacity: isAnalyzing ? 0.7 : 1 }}
                    disabled={isAnalyzing}
                  >
                    <Sparkles size={16} />
                    <span>{isAnalyzing ? 'Analyzing...' : 'Go To AI'}</span>
                  </button>
                  
                  <button
                    onClick={handleInterview}
                    className={`${styles.button} ${styles.buttonTertiary} ${styles.interviewButton} ${styles.stackedButton}`}
                    title="Start interview practice"
                  >
                    <Mic size={16} />
                    <span>Interview</span>
                  </button>
                  
                  <button
                    onClick={() => setShowFullscreen(true)}
                    className={`${styles.button} ${styles.buttonSecondary} ${styles.stackedButton}`}
                    title="Full screen preview"
                  >
                    <span>Full Screen</span>
                  </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {showFullscreen && (
          <div className={styles.fullscreenModal} role="dialog" aria-modal="true">
            <div className={styles.modalContent}>
              <div className={styles.modalToolbar}>
                <div className={styles.zoomControls}>
                  <button onClick={zoomOut} className={`${styles.zoomButton}`} aria-label="Zoom out"><ZoomOut size={16} /></button>
                  <div className={styles.zoomLevel}>{Math.round(modalScale * 100)}%</div>
                  <button onClick={zoomIn} className={`${styles.zoomButton}`} aria-label="Zoom in"><ZoomIn size={16} /></button>
                  <button onClick={fitToWidth} className={`${styles.zoomButton}`} title="Fit to width"><Maximize2 size={16} /></button>
                </div>

                <div style={{ display: 'flex', gap: 8, position: 'relative' }}>
                  <button onClick={() => setShowFullscreen(false)} className={`${styles.button} ${styles.buttonTertiary}`}>Close</button>
                  <div style={{ position: 'relative' }} data-export-menu>
                    <button 
                      onClick={() => setShowExportMenu(!showExportMenu)} 
                      disabled={isExporting}
                      className={`${styles.button} ${styles.buttonPrimary}`}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      {isExporting ? (
                        <>
                          <Loader size={16} className="animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Download size={16} />
                          <span>Save</span>
                        </>
                      )}
                    </button>

                    {showExportMenu && !isExporting && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        background: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        marginTop: '0.5rem',
                        zIndex: 50,
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        overflow: 'hidden',
                        minWidth: '160px'
                      }}>
                        <button
                          type="button"
                          onClick={() => handleExport('pdf')}
                          style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            textAlign: 'left',
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#111827',
                            transition: 'background-color 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                          onMouseEnter={(e) => {
                            (e.target as HTMLElement).style.background = '#f9fafb';
                          }}
                          onMouseLeave={(e) => {
                            (e.target as HTMLElement).style.background = 'transparent';
                          }}
                        >
                          <Download size={14} />
                          <span>PDF</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleExport('png')}
                          style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            textAlign: 'left',
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#111827',
                            transition: 'background-color 0.2s',
                            borderTop: '1px solid #f3f4f6',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                          onMouseEnter={(e) => {
                            (e.target as HTMLElement).style.background = '#f9fafb';
                          }}
                          onMouseLeave={(e) => {
                            (e.target as HTMLElement).style.background = 'transparent';
                          }}
                        >
                          <Download size={14} />
                          <span>PNG</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleExport('jpg')}
                          style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            textAlign: 'left',
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#111827',
                            transition: 'background-color 0.2s',
                            borderTop: '1px solid #f3f4f6',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                          onMouseEnter={(e) => {
                            (e.target as HTMLElement).style.background = '#f9fafb';
                          }}
                          onMouseLeave={(e) => {
                            (e.target as HTMLElement).style.background = 'transparent';
                          }}
                        >
                          <Download size={14} />
                          <span>JPG</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.modalBody}>
                <div className={styles.modalPreview}>
                  <ResumePreview scale={modalScale} showExample={showExample} onEditSection={handlePreviewSectionClick} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}