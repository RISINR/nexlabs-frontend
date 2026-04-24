import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Navbar } from '../../components/Navbar';
import { useResume } from '../../contexts/ResumeContext';
import { ArrowLeft, Briefcase, Award, Users, FolderKanban, Pencil, Trash2, Plus, Sparkles } from 'lucide-react';
import ResumePreview from '../../components/resume/ResumePreview';
import { getAuthUser } from '../../utils/authStorage';
import { useConfirmDialog } from '../../components/ui/ConfirmDialogProvider';
import { API_BASE_URL } from '../../utils/apiBase';
import styles from './BasicInfoPage.module.css';

// Helper function to get auth headers with JWT token
function getAuthHeaders() {
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('nexlabs_token')
      || sessionStorage.getItem('nexlabs_token')
      || localStorage.getItem('token')
      || sessionStorage.getItem('token')
    : null;
  
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
}

export default function ExperienceStackPage() {
  const navigate = useNavigate();
  const {
    resumeData,
    deleteExperience,
    updateExperience,
    addExperience,
    updateBasicInfo,
    updateEducation,
    updateProfessionalSummary,
    updateCertifications,
    updateLanguages,
    updateAwards,
    updateInterests,
  } = useResume();
  const [isPolishing, setIsPolishing] = React.useState(false);
  const [selectedExpIdForAI, setSelectedExpIdForAI] = React.useState<string | null>(null);
  const [aiProgressFrame, setAiProgressFrame] = React.useState(0);
  const [aiStatusLabel, setAiStatusLabel] = React.useState('');
  const [mockFillMode, setMockFillMode] = React.useState<'fill-empty' | 'overwrite-all'>('fill-empty');
  const [experienceSkillSuggestions, setExperienceSkillSuggestions] = React.useState<Record<string, string[]>>({});
  const typingIntervalsRef = React.useRef<Record<string, number>>({});
  const confirmDialog = useConfirmDialog();

  const currentUserRole = String(getAuthUser()?.role || '').toLowerCase();
  const canSeeMockDataControls =
    currentUserRole === 'admin'
    || currentUserRole === 'university'
    || currentUserRole === 'univercity';

  const TYPE_ORDER: Record<string, number> = {
    project: 0,
    work: 1,
    camp: 2,
    competition: 3,
  };

  const extractYear = (value: string) => {
    const match = String(value || '').match(/(19|20)\d{2}/g);
    if (!match || match.length === 0) return 0;
    return Number(match[match.length - 1]);
  };

  const sortedExperiences = React.useMemo(() => {
    return [...resumeData.experiences].sort((a, b) => {
      const typeDiff = (TYPE_ORDER[a.type] ?? 99) - (TYPE_ORDER[b.type] ?? 99);
      if (typeDiff !== 0) return typeDiff;

      const yearA = Math.max(extractYear(a.startDate), extractYear(a.endDate));
      const yearB = Math.max(extractYear(b.startDate), extractYear(b.endDate));
      if (yearA !== yearB) return yearB - yearA;

      return String(a.title || '').localeCompare(String(b.title || ''));
    });
  }, [resumeData.experiences]);

  const roleForAi =
    resumeData.basicInfo?.professionalTitle?.trim()
    || resumeData.professionalSummary?.role?.trim()
    || 'Frontend Developer';

  const fallbackRoleSkills: Record<string, string[]> = {
    frontend: ['React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Responsive Design', 'Problem Solving'],
    backend: ['Node.js', 'Express', 'REST API', 'MongoDB', 'System Design', 'Debugging'],
    fullstack: ['React', 'Node.js', 'TypeScript', 'API Design', 'Git', 'Communication'],
    design: ['Figma', 'Design Systems', 'User Research', 'Prototyping', 'Usability Testing'],
    default: ['Communication', 'Problem Solving', 'Teamwork', 'Project Management', 'Adaptability'],
  };

  const getFallbackSkillsByRole = React.useCallback((role: string) => {
    const normalized = role.toLowerCase();
    if (normalized.includes('frontend')) return fallbackRoleSkills.frontend;
    if (normalized.includes('backend')) return fallbackRoleSkills.backend;
    if (normalized.includes('full-stack') || normalized.includes('full stack')) return fallbackRoleSkills.fullstack;
    if (normalized.includes('ux') || normalized.includes('ui') || normalized.includes('design')) return fallbackRoleSkills.design;
    return fallbackRoleSkills.default;
  }, []);

  const clearTypingTimer = React.useCallback((key: string) => {
    const timer = typingIntervalsRef.current[key];
    if (timer) {
      window.clearInterval(timer);
      delete typingIntervalsRef.current[key];
    }
  }, []);

  const typeExperienceStar = React.useCallback(
    async (
      expId: string,
      starValues: { situation: string; action: string; result: string }
    ) => {
      const timerKey = `${expId}-star`;
      clearTypingTimer(timerKey);

      const baseExp = resumeData.experiences.find((e) => e.id === expId);
      if (!baseExp) return;

      const typeOneField = async (
        field: 'situation' | 'action' | 'result',
        text: string,
        snapshot: { situation: string; action: string; result: string }
      ) => {
        const sanitized = String(text || '').trim();
        if (!sanitized) return;

        await new Promise<void>((resolve) => {
          let pointer = 0;
          const step = sanitized.length > 300 ? 6 : 4;
          const interval = window.setInterval(() => {
            pointer = Math.min(pointer + step, sanitized.length);
            snapshot[field] = sanitized.slice(0, pointer);

            updateExperience(expId, {
              ...baseExp,
              situation: snapshot.situation,
              action: snapshot.action,
              result: snapshot.result,
            });

            if (pointer >= sanitized.length) {
              clearTypingTimer(timerKey);
              resolve();
            }
          }, 20);

          typingIntervalsRef.current[timerKey] = interval;
        });
      };

      const snapshot = {
        situation: '',
        action: '',
        result: '',
      };

      updateExperience(expId, {
        ...baseExp,
        situation: '',
        action: '',
        result: '',
      });

      await typeOneField('situation', starValues.situation, snapshot);
      await typeOneField('action', starValues.action, snapshot);
      await typeOneField('result', starValues.result, snapshot);
    },
    [clearTypingTimer, resumeData.experiences, updateExperience]
  );

  const appendSkillsAnimated = React.useCallback(
    async (expId: string, skills: string[]) => {
      const exp = resumeData.experiences.find((e) => e.id === expId);
      if (!exp) return;

      const workingSkills = [...(exp.skills || [])];
      const existing = new Set(workingSkills.map((s) => s.toLowerCase()));
      const incoming = skills.filter((skill) => !existing.has(skill.toLowerCase()));

      for (const skill of incoming) {
        workingSkills.push(skill);
        updateExperience(expId, { ...exp, skills: Array.from(new Set(workingSkills)) });
        await new Promise((resolve) => window.setTimeout(resolve, 90));
      }
    },
    [resumeData.experiences, updateExperience]
  );

  const addSkillToExperience = React.useCallback((expId: string, skill: string) => {
    const exp = resumeData.experiences.find((e) => e.id === expId);
    if (!exp) return;

    const normalizedSkill = String(skill || '').trim();
    if (!normalizedSkill) return;

    const exists = (exp.skills || []).some((item) => item.toLowerCase() === normalizedSkill.toLowerCase());
    if (exists) return;

    updateExperience(expId, {
      ...exp,
      skills: [...(exp.skills || []), normalizedSkill],
    });

    const summary = resumeData.professionalSummary || {
      role: '',
      experience: '',
      skills: [],
      goal: '',
      description: '',
    };
    const summarySkills = Array.isArray(summary.skills) ? summary.skills : [];
    const mergedSummarySkills = Array.from(
      new Map(
        [...summarySkills, normalizedSkill]
          .map((s) => String(s || '').trim())
          .filter(Boolean)
          .map((s) => [s.toLowerCase(), s])
      ).values()
    ).slice(0, 12);

    if (mergedSummarySkills.length !== summarySkills.length) {
      updateProfessionalSummary({
        ...summary,
        skills: mergedSummarySkills,
      });
    }
  }, [resumeData.experiences, resumeData.professionalSummary, updateExperience, updateProfessionalSummary]);

  const handleAIImproveStar = async (expId: string) => {
    const exp = resumeData.experiences.find(e => e.id === expId);
    if (!exp) return;

    setIsPolishing(true);
    setSelectedExpIdForAI(expId);
    setAiStatusLabel(`Improving STAR for ${exp.title}`);
    try {
      const response = await fetch(`${API_BASE_URL}/resume-ai/improve-experience`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          experience: {
            situation: exp.situation || '',
            action: exp.action || '',
            result: exp.result || ''
          },
          profession: roleForAi,
          experienceType: exp.type,
        })
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to improve experience');
      }

      const data = await response.json();
      const improved = data?.improvedExperience || {};
      const safeSituation = typeof improved.situation === 'string' ? improved.situation : exp.situation || '';
      const safeAction = typeof improved.action === 'string' ? improved.action : exp.action || '';
      const safeResult = typeof improved.result === 'string' ? improved.result : exp.result || '';

      setAiStatusLabel(`Typing improved STAR for ${exp.title}`);
      await typeExperienceStar(expId, {
        situation: safeSituation,
        action: safeAction,
        result: safeResult,
      });
    } catch (error) {
      console.error('AI Improve error:', error);
      const roleHint = roleForAi || 'your role';
      const localSituation = exp.situation?.trim() || `Handled a role-relevant challenge as a ${roleHint} in ${exp.organization || 'the team'}.`;
      const localAction = exp.action?.trim() || `Executed a structured plan, collaborated with stakeholders, and prioritized the highest-impact tasks for ${exp.title || 'the initiative'}.`;
      const localResult = exp.result?.trim() || `Delivered measurable impact aligned with ${roleHint} expectations, improving quality, speed, and team confidence.`;

      setAiStatusLabel(`Applying fallback STAR for ${exp.title}`);
      await typeExperienceStar(expId, {
        situation: localSituation,
        action: localAction,
        result: localResult,
      });
    } finally {
      setIsPolishing(false);
      setSelectedExpIdForAI(null);
      setAiStatusLabel('');
    }
  };

  const handleAISuggestSkills = async (expId: string) => {
    const exp = resumeData.experiences.find(e => e.id === expId);
    if (!exp) return;

    setIsPolishing(true);
    setSelectedExpIdForAI(expId);
    setAiStatusLabel(`Generating role-based skills for ${exp.title}`);
    try {
      const response = await fetch(`${API_BASE_URL}/resume-ai/generate-skills`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          experience: {
            title: exp.title,
            organization: exp.organization,
            role: exp.role,
            situation: exp.situation,
            action: exp.action,
            result: exp.result
          },
          profession: resumeData.basicInfo?.professionalTitle
        })
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to suggest skills');
      }

      const data = await response.json();
      const aiSkills = Array.isArray(data?.skills) ? data.skills.filter((s: unknown) => typeof s === 'string') : [];
      const finalSkills = aiSkills.length > 0 ? aiSkills : getFallbackSkillsByRole(roleForAi);
      const existing = new Set((exp.skills || []).map((s) => s.toLowerCase()));
      const deduped = Array.from(new Set(finalSkills.map((s) => String(s).trim()).filter(Boolean)));
      const missingOnly = deduped.filter((s) => !existing.has(s.toLowerCase()));

      setExperienceSkillSuggestions((prev) => ({
        ...prev,
        [expId]: missingOnly,
      }));
      setAiStatusLabel(missingOnly.length > 0
        ? `Tap skills to add for ${exp.title}`
        : `All suggested skills are already in ${exp.title}`);
    } catch (error) {
      console.error('AI skills error:', error);
      const fallbackSkills = getFallbackSkillsByRole(roleForAi);
      const existing = new Set((exp.skills || []).map((s) => s.toLowerCase()));
      const missingOnly = fallbackSkills.filter((s) => !existing.has(String(s).toLowerCase()));

      setExperienceSkillSuggestions((prev) => ({
        ...prev,
        [expId]: missingOnly,
      }));
      setAiStatusLabel(missingOnly.length > 0
        ? `Showing fallback skills for ${exp.title}`
        : `All fallback skills are already in ${exp.title}`);
    } finally {
      setIsPolishing(false);
      setSelectedExpIdForAI(null);
      setAiStatusLabel('');
    }
  };

  const buildMockProfileByRole = React.useCallback((role: string) => {
    const normalized = role.toLowerCase();

    if (normalized.includes('backend')) {
      return {
        summarySkills: ['Node.js', 'Express', 'MongoDB', 'REST API', 'System Design', 'Docker'],
        summaryDescription: 'Backend developer focused on building scalable API services, optimizing database performance, and improving release reliability through clean architecture and automation. Strong collaboration with frontend and product teams to deliver business outcomes with stable and secure systems.',
        experiences: [
          {
            id: `mock-${Date.now()}-1`, type: 'work' as const, title: 'Backend Developer Intern', organization: 'NexLabs Platform Team', role: 'Backend Developer', startDate: '2024', endDate: 'Present',
            situation: 'The team had slow API responses and duplicate endpoint logic across modules.',
            action: 'Refactored service layers, introduced shared validation middleware, and optimized MongoDB indexes for high-traffic endpoints.',
            result: 'Reduced average API response time by 42% and cut bug-fix turnaround time by 35%.',
            skills: ['Node.js', 'Express', 'MongoDB', 'REST API', 'Performance Optimization']
          },
          {
            id: `mock-${Date.now()}-2`, type: 'project' as const, title: 'Resume API Pipeline', organization: 'University Capstone', role: 'API Lead', startDate: '2023', endDate: '2024',
            situation: 'Needed a robust resume processing flow that could handle varied user input and AI enrichment.',
            action: 'Designed versioned APIs, added request sanitization, and built monitoring logs for AI operations.',
            result: 'Improved processing reliability and enabled faster debugging for production incidents.',
            skills: ['API Design', 'Logging', 'Validation', 'Team Collaboration']
          }
        ]
      };
    }

    if (normalized.includes('ux') || normalized.includes('ui') || normalized.includes('design')) {
      return {
        summarySkills: ['Figma', 'Design Systems', 'User Research', 'Prototyping', 'Accessibility'],
        summaryDescription: 'UI/UX designer who translates user insights into practical product experiences. Experienced in building reusable design systems, validating decisions with usability testing, and partnering with engineers to launch consistent interfaces with measurable improvements in engagement.',
        experiences: [
          {
            id: `mock-${Date.now()}-1`, type: 'project' as const, title: 'Student Dashboard Redesign', organization: 'NexLabs Design Sprint', role: 'UX Designer', startDate: '2024', endDate: 'Present',
            situation: 'Users struggled to find critical dashboard actions and progress metrics.',
            action: 'Mapped user journeys, created high-fidelity prototypes in Figma, and ran moderated usability tests with students.',
            result: 'Increased task completion rate by 31% and reduced navigation confusion in post-test interviews.',
            skills: ['Figma', 'User Research', 'Wireframing', 'Usability Testing']
          },
          {
            id: `mock-${Date.now()}-2`, type: 'competition' as const, title: 'Hackathon Product Design', organization: 'Campus Innovation Challenge', role: 'Product Designer', startDate: '2023', endDate: '2023',
            situation: 'Team needed a clear prototype to pitch an AI career assistant concept in limited time.',
            action: 'Built a complete prototype flow and defined a compact visual system for fast handoff.',
            result: 'Won top-3 placement and received strong feedback on clarity and user-centric interaction flow.',
            skills: ['Prototyping', 'Storytelling', 'Design Systems']
          }
        ]
      };
    }

    return {
      summarySkills: ['React', 'TypeScript', 'JavaScript', 'Problem Solving', 'Communication', 'Git'],
      summaryDescription: 'Frontend-focused software developer building responsive, maintainable web experiences with strong attention to usability and performance. Comfortable collaborating across design and backend teams, translating business needs into production-ready features with measurable user impact.',
      experiences: [
        {
          id: `mock-${Date.now()}-1`, type: 'work' as const, title: 'Frontend Developer Intern', organization: 'NexLabs Product Team', role: 'Frontend Developer', startDate: '2024', endDate: 'Present',
          situation: 'The app had inconsistent UI behavior and duplicated component logic across pages.',
          action: 'Refactored reusable React components, standardized state flows, and improved loading interactions across core screens.',
          result: 'Reduced UI regressions and improved perceived responsiveness based on user feedback sessions.',
          skills: ['React', 'TypeScript', 'Component Architecture', 'UX Collaboration']
        },
        {
          id: `mock-${Date.now()}-2`, type: 'project' as const, title: 'AI Resume Builder Experience', organization: 'Personal Project', role: 'Full-stack Builder', startDate: '2023', endDate: '2024',
          situation: 'Users needed a guided resume workflow with real-time preview and AI-assisted writing.',
          action: 'Implemented multi-step flow, autosave draft behavior, and role-based AI content assistance.',
          result: 'Delivered an end-to-end MVP used in demos with positive feedback on usability and clarity.',
          skills: ['React', 'Node.js', 'REST API', 'Product Thinking']
        }
      ]
    };
  }, []);

  const handleGenerateMockAllSections = React.useCallback(async () => {
    const role = roleForAi || 'Frontend Developer';
    const profile = buildMockProfileByRole(role);

    const shouldOverwrite = await confirmDialog({
      title: 'Generate mock data for all resume sections?',
      description: 'Existing values will be replaced where applicable.',
      confirmText: 'Generate',
      cancelText: 'Cancel',
    });
    if (!shouldOverwrite) return;

    const existingBasic = resumeData.basicInfo;
    const currentSocialProfiles = existingBasic?.socialProfiles || [];
    const shouldOverwriteAll = mockFillMode === 'overwrite-all';

    const nextBasicInfo = {
      profilePicture: shouldOverwriteAll ? '' : (existingBasic?.profilePicture || ''),
      photoFrameShape: shouldOverwriteAll ? 'rounded' : (existingBasic?.photoFrameShape || 'rounded'),
      firstName:
        shouldOverwriteAll
          ? 'Nex'
          : (existingBasic?.firstName || 'Nex'),
      lastName:
        shouldOverwriteAll
          ? 'Labs'
          : (existingBasic?.lastName || 'Labs'),
      fullName: shouldOverwriteAll
        ? 'Nex Labs'
        : `${existingBasic?.firstName || 'Nex'} ${existingBasic?.lastName || 'Labs'}`,
      professionalTitle: shouldOverwriteAll
        ? role
        : (existingBasic?.professionalTitle || role),
      futureGoal: shouldOverwriteAll
        ? `Grow as a high-impact ${role} and deliver measurable product outcomes.`
        : (existingBasic?.futureGoal || `Grow as a high-impact ${role} and deliver measurable product outcomes.`),
      email: shouldOverwriteAll ? 'nexlabs.demo@example.com' : (existingBasic?.email || 'nexlabs.demo@example.com'),
      phone: shouldOverwriteAll ? '+66-81-234-5678' : (existingBasic?.phone || '+66-81-234-5678'),
      location: shouldOverwriteAll ? 'Bangkok, Thailand' : (existingBasic?.location || 'Bangkok, Thailand'),
      socialProfiles: shouldOverwriteAll ? [] : currentSocialProfiles,
    };

    updateBasicInfo({
      ...nextBasicInfo,
    });

    updateEducation({
      university: shouldOverwriteAll
        ? 'Chulalongkorn University'
        : (resumeData.education?.university || 'Chulalongkorn University'),
      degree: '',
      major: shouldOverwriteAll
        ? 'Computer Engineering'
        : (resumeData.education?.major || 'Computer Engineering'),
      graduationYear: shouldOverwriteAll
        ? '2026'
        : (resumeData.education?.graduationYear || '2026'),
      gpax: shouldOverwriteAll
        ? '3.62'
        : (resumeData.education?.gpax || '3.62'),
      coursework: !shouldOverwriteAll && resumeData.education?.coursework?.length
        ? resumeData.education.coursework
        : ['Data Structures', 'Database Systems', 'Software Engineering', 'Human-Computer Interaction'],
      additionalEntries: shouldOverwriteAll ? [] : (resumeData.education?.additionalEntries || []),
    });

    updateProfessionalSummary({
      role: shouldOverwriteAll ? role : (resumeData.professionalSummary?.role || role),
      experience: shouldOverwriteAll
        ? '2+ years through internships and major projects'
        : (resumeData.professionalSummary?.experience || '2+ years through internships and major projects'),
      skills: shouldOverwriteAll || !resumeData.professionalSummary?.skills?.length
        ? profile.summarySkills
        : (resumeData.professionalSummary?.skills || profile.summarySkills),
      goal: shouldOverwriteAll
        ? `Become a trusted ${role} who can own feature delivery end to end.`
        : (resumeData.professionalSummary?.goal || `Become a trusted ${role} who can own feature delivery end to end.`),
      description: shouldOverwriteAll
        ? profile.summaryDescription
        : (resumeData.professionalSummary?.description || profile.summaryDescription),
    });

    if (shouldOverwriteAll || resumeData.experiences.length === 0) {
      resumeData.experiences.forEach((exp) => deleteExperience(exp.id));
      profile.experiences.slice(0, 4).forEach((exp) => addExperience(exp));
    }

    if (shouldOverwriteAll || (resumeData.certifications?.length || 0) === 0) {
      updateCertifications([
        { name: 'Google Professional Certificate', issuer: 'Google', year: '2024' },
        { name: 'Agile Foundations', issuer: 'PMI', year: '2023' },
      ]);
    }
    if (shouldOverwriteAll || (resumeData.languages?.length || 0) === 0) {
      updateLanguages([
        { name: 'Thai', level: 'Native' },
        { name: 'English', level: 'Professional' },
      ]);
    }
    if (shouldOverwriteAll || (resumeData.awards?.length || 0) === 0) {
      updateAwards([
        { title: 'Top 3 in Campus Innovation Challenge', issuer: 'University Innovation Hub', year: '2024' },
      ]);
    }
    if (shouldOverwriteAll || (resumeData.interests?.length || 0) === 0) {
      updateInterests(['Open Source', 'Hackathon', 'Product Design']);
    }
  }, [
    addExperience,
    buildMockProfileByRole,
    deleteExperience,
    resumeData.basicInfo,
    resumeData.education,
    resumeData.experiences,
    resumeData.interests,
    resumeData.languages,
    resumeData.certifications,
    resumeData.awards,
    resumeData.professionalSummary,
    roleForAi,
    mockFillMode,
    confirmDialog,
    updateAwards,
    updateBasicInfo,
    updateCertifications,
    updateEducation,
    updateInterests,
    updateLanguages,
    updateProfessionalSummary,
  ]);

  useEffect(() => {
    if (!isPolishing) {
      setAiProgressFrame(0);
      return;
    }

    const timer = window.setInterval(() => {
      setAiProgressFrame((prev) => (prev + 1) % 4);
    }, 220);

    return () => {
      window.clearInterval(timer);
    };
  }, [isPolishing]);

  useEffect(() => {
    return () => {
      Object.values(typingIntervalsRef.current).forEach((timer) => window.clearInterval(timer));
      typingIntervalsRef.current = {};
    };
  }, []);

  React.useEffect(() => {
    if (!resumeData.basicInfo) {
      navigate('/resume/basic-info');
    } else if (!resumeData.education) {
      navigate('/resume/education');
    } else if (!resumeData.professionalSummary) {
      navigate('/resume/professional-summary');
    }
  }, [resumeData, navigate]);

  const experienceTypes = [
    { id: 'project', label: 'Project/Portfolio', icon: FolderKanban },
    { id: 'work', label: 'Work/Internship', icon: Briefcase },
    { id: 'camp', label: 'Camp/Volunteer', icon: Users },
    { id: 'competition', label: 'Competition', icon: Award },
  ];

  const handleAddExperience = (type: string) => {
    navigate(`/resume/experience/${type}`);
  };

  const handleEditExperience = (id: string) => {
    const experience = resumeData.experiences.find(exp => exp.id === id);
    if (experience) {
      navigate(`/resume/experience/${experience.type}/${id}`);
    }
  };

  const handleDeleteExperience = async (id: string) => {
    const confirmed = await confirmDialog({
      title: 'Delete this experience?',
      description: 'This item will be removed from your resume.',
      confirmText: 'Delete',
      cancelText: 'Keep',
      tone: 'danger',
    });
    if (!confirmed) return;
    deleteExperience(id);
  };

  return (
    <div className={styles.container}>
      <Navbar />

      <div className={styles.gridLayout}>
        {/* Left Column: Preview */}
        <div className={styles.previewColumn}>
          <div className={styles.previewSticky}>
            <div className={styles.previewCard}>
              <ResumePreview scale={1} />
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className={styles.formColumn}>
          <div className={styles.formSticky}>
            <div className={styles.formCard}>

              {/* Action Row: Back + Save */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <button
                  onClick={() => navigate('/resume/professional-summary')}
                  type="button"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0',
                    color: 'rgb(75, 85, 99)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = 'rgb(17, 24, 39)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = 'rgb(75, 85, 99)';
                  }}
                >
                  <ArrowLeft size={16} />
                  <span>Back to Professional Summary</span>
                </button>
                <button
                  type="button"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#000000',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    cursor: 'default',
                    padding: '0.5rem 0',
                  }}
                  disabled
                >
                  ✓ Auto-saved
                </button>
              </div>

              {/* Title */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0' }}>
                <h1 className={styles.formTitle} style={{ marginBottom: 0 }}>Experience Stack</h1>
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: resumeData.experiences.length >= 4 ? 'rgb(220, 38, 38)' : 'rgb(107, 114, 128)',
                    backgroundColor: resumeData.experiences.length >= 4 ? 'rgb(254, 242, 242)' : 'rgb(243, 244, 246)',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    whiteSpace: 'nowrap'
                  }}>
                    {resumeData.experiences.length}/4
                  </span>
              </div>
                <p className={styles.description} style={{ marginBottom: '2rem', marginTop: '0.5rem', fontSize: '0.9rem', color: 'rgb(107, 114, 128)' }}>
                Add your most notable experiences to demonstrate your background and professional expertise. You can write Thai or English; AI will translate and polish into English.
              </p>

              {canSeeMockDataControls && (
                <div style={{
                  padding: '0.9rem',
                  border: '1px solid rgb(191, 219, 254)',
                  borderRadius: '0.75rem',
                  background: 'rgb(239, 246, 255)',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  flexWrap: 'wrap',
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    <span style={{ fontSize: '0.82rem', color: 'rgb(30, 64, 175)', fontWeight: 600 }}>
                      Need quick draft? Auto-fill all resume sections from your role.
                    </span>
                    <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => setMockFillMode('fill-empty')}
                        style={{
                          padding: '0.36rem 0.62rem',
                          borderRadius: '9999px',
                          border: mockFillMode === 'fill-empty' ? '1px solid rgb(37, 99, 235)' : '1px solid rgb(191, 219, 254)',
                          background: mockFillMode === 'fill-empty' ? 'rgb(219, 234, 254)' : 'white',
                          color: 'rgb(30, 64, 175)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        เติมเฉพาะช่องว่าง
                      </button>
                      <button
                        type="button"
                        onClick={() => setMockFillMode('overwrite-all')}
                        style={{
                          padding: '0.36rem 0.62rem',
                          borderRadius: '9999px',
                          border: mockFillMode === 'overwrite-all' ? '1px solid rgb(30, 58, 138)' : '1px solid rgb(191, 219, 254)',
                          background: mockFillMode === 'overwrite-all' ? 'rgb(30, 64, 175)' : 'white',
                          color: mockFillMode === 'overwrite-all' ? 'white' : 'rgb(30, 64, 175)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        เขียนทับทั้งหมด
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateMockAllSections}
                    style={{
                      padding: '0.48rem 0.82rem',
                      borderRadius: '0.55rem',
                      border: '1px solid rgb(59, 130, 246)',
                      background: 'white',
                      color: 'rgb(29, 78, 216)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Generate Mock Data
                  </button>
                </div>
              )}

              {/* Existing Experiences */}
              {resumeData.experiences.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: 'rgb(75, 85, 99)',
                    marginBottom: '1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Your experiences ({resumeData.experiences.length})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {sortedExperiences.map((exp) => (
                      <div
                        key={exp.id}
                        style={{
                          padding: '1rem',
                          border: '1px solid rgb(224, 227, 231)',
                          borderRadius: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          backgroundColor: 'rgb(255, 255, 255)',
                          transition: 'all 0.2s',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          const el = e.currentTarget as HTMLDivElement;
                          el.style.backgroundColor = 'rgb(248, 250, 255)';
                          el.style.borderColor = 'rgb(59, 130, 246)';
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget as HTMLDivElement;
                          el.style.backgroundColor = 'rgb(255, 255, 255)';
                          el.style.borderColor = 'rgb(224, 227, 231)';
                        }}
                      >
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '0.5rem',
                          backgroundColor:
                            exp.type === 'work'
                              ? 'rgb(219, 234, 254)'
                              : exp.type === 'project'
                                ? 'rgb(220, 252, 231)'
                                : exp.type === 'camp'
                                  ? 'rgb(254, 243, 199)'
                                  : 'rgb(251, 207, 232)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color:
                            exp.type === 'work'
                              ? 'rgb(29, 78, 216)'
                              : exp.type === 'project'
                                ? 'rgb(22, 101, 52)'
                                : exp.type === 'camp'
                                  ? 'rgb(146, 64, 14)'
                                  : 'rgb(157, 23, 77)',
                          flexShrink: 0
                        }}>
                          {exp.type === 'work' && <Briefcase size={18} />}
                          {exp.type === 'project' && <FolderKanban size={18} />}
                          {exp.type === 'camp' && <Users size={18} />}
                          {exp.type === 'competition' && <Award size={18} />}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{
                            fontWeight: '600',
                            fontSize: '0.9375rem',
                            color: 'rgb(17, 24, 39)',
                            marginBottom: '0.25rem',
                            wordBreak: 'break-word'
                          }}>
                            {exp.title}
                          </p>
                          <p style={{
                            fontSize: '0.8125rem',
                            color: 'rgb(107, 114, 128)',
                            wordBreak: 'break-word'
                          }}>
                            {exp.organization} • {exp.startDate} - {exp.endDate}
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                          <button
                            onClick={() => handleEditExperience(exp.id)}
                            style={{
                              padding: '0.5rem 0.75rem',
                              color: 'rgb(75, 85, 99)',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              borderRadius: '0.5rem',
                              transition: 'all 0.2s',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgb(229, 231, 235)';
                              (e.currentTarget as HTMLButtonElement).style.color = 'rgb(17, 24, 39)';
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
                              (e.currentTarget as HTMLButtonElement).style.color = 'rgb(75, 85, 99)';
                            }}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteExperience(exp.id)}
                            style={{
                              padding: '0.5rem 0.75rem',
                              color: 'rgb(156, 163, 175)',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              borderRadius: '0.5rem',
                              transition: 'all 0.2s',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgb(254, 242, 242)';
                              (e.currentTarget as HTMLButtonElement).style.color = 'rgb(220, 38, 38)';
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
                              (e.currentTarget as HTMLButtonElement).style.color = 'rgb(156, 163, 175)';
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Polish Section */}
              {resumeData.experiences.length > 0 && (
                  <div style={{
                    padding: '1.25rem',
                    backgroundColor: 'rgb(249, 250, 251)',
                    borderRadius: '0.75rem',
                    border: '1px solid rgb(229, 231, 235)',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <motion.span
                      aria-hidden="true"
                      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                      animate={{
                        color: ['#c4f1ff', '#72d1ff', '#2ea6e6', '#1d6fd6', '#72d1ff'],
                        scale: [1, 1.05, 1],
                        y: [0, -1, 0],
                        opacity: [0.9, 1, 0.9],
                      }}
                      transition={{
                        duration: 2.8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    >
                      <Sparkles size={16} />
                    </motion.span>
                    <p style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: 'rgb(17, 24, 39)',
                      margin: 0
                    }}>
                      AI Experience Assistant
                    </p>
                  </div>
                  <p style={{
                    fontSize: '0.8rem',
                    color: 'rgb(75, 85, 99)',
                    margin: 0,
                    opacity: 1
                  }}>
                    Improve your S.A.R descriptions and get skill recommendations
                  </p>
                  {isPolishing && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'rgb(255, 255, 255)',
                        border: '1px solid rgb(229, 231, 235)',
                        borderRadius: '0.6rem',
                        padding: '0.52rem 0.72rem',
                        color: 'rgb(55, 65, 81)',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                      }}
                    >
                      <span aria-hidden="true">{['◐', '◓', '◑', '◒'][aiProgressFrame]}</span>
                      <span>{aiStatusLabel || 'AI is processing'}...</span>
                    </div>
                  )}
                  {resumeData.experiences.map((exp) => (
                    <div key={exp.id} style={{
                      padding: '0.75rem',
                      backgroundColor: 'rgba(255,255,255,0.7)',
                      borderRadius: '0.5rem',
                      border: '1px solid rgba(221, 214, 254, 0.5)'
                    }}>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '500', color: 'rgb(88, 28, 135)', flex: 1, minWidth: 0 }}>
                          {exp.title} - {exp.organization}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAIImproveStar(exp.id)}
                          disabled={isPolishing}
                          style={{
                            padding: '0.5rem 0.75rem',
                                backgroundColor: isPolishing ? 'rgb(229, 231, 235)' : 'white',
                                color: 'rgb(17, 24, 39)',
                                border: '1px solid rgb(209, 213, 219)',
                            borderRadius: '0.5rem',
                            cursor: isPolishing ? 'not-allowed' : 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            if (!isPolishing) {
                              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgb(243, 244, 246)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isPolishing) {
                              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'white';
                            }
                          }}
                        >
                          {isPolishing && selectedExpIdForAI === exp.id ? 'Improving...' : 'Improve S.A.R'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAISuggestSkills(exp.id)}
                          disabled={isPolishing}
                          style={{
                            padding: '0.5rem 0.75rem',
                            backgroundColor: isPolishing ? 'rgb(229, 231, 235)' : 'white',
                            color: isPolishing ? 'rgb(107, 114, 128)' : 'rgb(17, 24, 39)',
                            border: '1px solid rgb(209, 213, 219)',
                            borderRadius: '0.5rem',
                            cursor: isPolishing ? 'not-allowed' : 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            if (!isPolishing) {
                              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgb(243, 244, 246)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isPolishing) {
                              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'white';
                            }
                          }}
                        >
                          {isPolishing && selectedExpIdForAI === exp.id ? 'Typing...' : '+ Skills'}
                        </button>
                      </div>

                      {Object.prototype.hasOwnProperty.call(experienceSkillSuggestions, exp.id) && (
                        <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          {(experienceSkillSuggestions[exp.id] || []).map((skill) => {
                            const alreadyAdded = (exp.skills || []).some((item) => item.toLowerCase() === skill.toLowerCase());
                            return (
                              <button
                                key={`${exp.id}-${skill}`}
                                type="button"
                                onClick={() => addSkillToExperience(exp.id, skill)}
                                style={{
                                  padding: '0.35rem 0.65rem',
                                  borderRadius: '9999px',
                                  border: '1px solid rgb(229, 231, 235)',
                                  background: alreadyAdded ? 'rgb(243, 244, 246)' : 'white',
                                  color: 'rgb(55, 65, 81)',
                                  cursor: alreadyAdded ? 'default' : 'pointer',
                                  fontSize: '0.78rem',
                                  fontWeight: 600
                                }}
                                disabled={alreadyAdded}
                              >
                                {alreadyAdded ? '✓ ' : '+ '}{skill}
                              </button>
                            );
                          })}
                          {(experienceSkillSuggestions[exp.id] || []).length === 0 && (
                            <span style={{ fontSize: '0.78rem', color: 'rgb(71, 85, 105)', fontWeight: 500 }}>
                              Suggested skills are already in this experience.
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Add Experience Section */}
              {resumeData.experiences.length >= 4 ? (
                <div style={{
                  padding: '1.25rem',
                  backgroundColor: 'rgb(249, 250, 251)',
                  borderRadius: '0.75rem',
                  border: '1px solid rgb(224, 227, 231)',
                  marginBottom: '2rem',
                  textAlign: 'center'
                }}>
                  <p style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: 'rgb(107, 114, 128)',
                    margin: 0
                  }}>
                    คุณได้เพิ่มครบจำนวนสูงสุด 4 ประสบการณ์แล้ว
                  </p>
                </div>
              ) : (
              <div style={{
                padding: '1.5rem',
                backgroundColor: 'rgb(248, 250, 255)',
                borderRadius: '0.75rem',
                border: '1px solid rgb(224, 227, 231)',
                marginBottom: '2rem'
              }}>
                  <p style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: 'rgb(17, 24, 39)',
                    marginBottom: '1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Add New Experience
                  </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {experienceTypes.map(({ id, label, icon: Icon }) => (
                    <button
                      type="button"
                      key={id}
                      onClick={() => handleAddExperience(id)}
                      style={{
                        padding: '0.875rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        border: '1px solid rgb(224, 227, 231)',
                        borderRadius: '0.75rem',
                        backgroundColor: 'rgb(255, 255, 255)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        color: 'rgb(17, 24, 39)'
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgb(59, 130, 246)';
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgb(248, 250, 255)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgb(224, 227, 231)';
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgb(255, 255, 255)';
                      }}
                    >
                      <Plus size={16} style={{ color: 'rgb(59, 130, 246)' }} />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>
              )}


              {/* Next Button: Go to Additional Info */}
                <button
                onClick={() => navigate('/resume/additional-info')}
                className={styles.submitButton}
                style={{
                  width: '100%',
                  marginTop: '1.5rem',
                  background: '#000000',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '1rem',
                  padding: '0.9rem 0',
                  borderRadius: '0.75rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  transition: 'background 0.2s',
                }}
              >
                Next: Additional Info
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
