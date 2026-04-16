import React from 'react';
import { useResume } from '../../contexts/ResumeContext';
import InterestIcon from '../icons/InterestIcon';
import { normalizeTemplateData } from './templateDataNormalizer';

function hexToRgba(hex: string, alpha: number) {
  const normalizedHex = hex.replace('#', '');
  const fullHex = normalizedHex.length === 3
    ? normalizedHex.split('').map(char => char + char).join('')
    : normalizedHex;

  const r = parseInt(fullHex.slice(0, 2), 16);
  const g = parseInt(fullHex.slice(2, 4), 16);
  const b = parseInt(fullHex.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Helper function to lighten/darken hex colors
function adjustBrightness(hex: string, percent: number) {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, Math.min(255, (num >> 16) + amt));
  const G = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amt));
  const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

// Helper function to create color variants
function getColorVariants(primaryColor: string) {
  const colorMap: { [key: string]: { primary: string; secondary: string; accent: string; light: string; sidebar: string } } = {
    '#1e40af': { primary: '#1e40af', secondary: '#1e3a8a', accent: '#3b82f6', light: '#eff6ff', sidebar: '#2c3e50' },
    '#059669': { primary: '#059669', secondary: '#047857', accent: '#10b981', light: '#ecfdf5', sidebar: '#1e4d3b' },
    '#dc2626': { primary: '#dc2626', secondary: '#991b1b', accent: '#ef4444', light: '#fef2f2', sidebar: '#5a1a1a' },
    '#7c3aed': { primary: '#7c3aed', secondary: '#6d28d9', accent: '#a78bfa', light: '#faf5ff', sidebar: '#4c1d95' },
  };
  
  // If custom color, generate variants dynamically
  if (!colorMap[primaryColor]) {
    const primary = primaryColor;
    const secondary = adjustBrightness(primary, -20); // Darker
    const accent = adjustBrightness(primary, 20); // Lighter
    const light = adjustBrightness(primary, 70); // Much lighter
    const sidebar = adjustBrightness(primary, -40); // Much darker
    
    return { primary, secondary, accent, light, sidebar };
  }
  
  return colorMap[primaryColor];
}

export const sampleData = {
  basicInfo: {
    fullName: 'Narin Chaiyaporn',
    professionalTitle: 'Full-stack Developer & UX-minded Engineer',
    profilePicture: '',
    email: 'narin@example.com',
    phone: '081-234-5678',
    location: 'Bangkok, Thailand',
    socialProfiles: [
      { platform: 'github', username: 'narin-dev' },
      { platform: 'portfolio', username: 'narin-portfolio.example' },
    ],
  },
  education: {
    degree: 'Bachelor of Engineering',
    major: 'Computer Engineering',
    university: 'Siam Technical University',
    graduationYear: '2021',
    gpax: '3.45',
    coursework: ['Human-Computer Interaction', 'Database Systems', 'Applied Machine Learning'],
  },
  experiences: [
    {
      id: 'exp-1',
      startDate: '2023',
      endDate: 'Present',
      title: 'Senior Front-end Engineer',
      organization: 'Brightworks Co., Ltd.',
      result: 'Led a redesign of the customer-facing product to improve usability and performance. Implemented a reusable component library in React and TypeScript to speed up feature delivery. Reduced average page load times by 35% through code-splitting and image optimization. Mentored junior engineers and introduced accessibility improvements across the UI.',
      situation: '',
      skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS']
    },
    {
      id: 'exp-2',
      startDate: '2021',
      endDate: '2022',
      title: 'Front-end Developer',
      organization: 'StudioCraft',
      result: 'Built responsive UI components and a design system used by product teams. Collaborated closely with designers to translate Figma into pixel-accurate interfaces and improve accessibility. Reduced CSS bundle sizes and improved rendering performance through refactors. Created Storybook documentation and unit tests to improve component reliability.',
      situation: '',
      skills: ['React', 'CSS', 'Storybook']
    },
    {
      id: 'exp-3',
      startDate: '2019',
      endDate: '2020',
      title: 'Software Engineer Intern',
      organization: 'DataForge',
      result: 'Developed internal tools to automate data import and reporting workflows. Wrote unit and integration tests to increase reliability of ETL processes. Optimized scripts to reduce processing time by 30% and improved monitoring for stakeholders. Presented results and supported adoption across operations teams.',
      situation: '',
      skills: ['Python', 'ETL', 'Testing']
    },
  ],
  professionalSummary: {
    description:
      'Product-minded full-stack developer with strong UX sensibilities. Experienced in building designer-friendly frontends using React and Next.js, and integrating with scalable backends.',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL', 'Figma'],
  },
  certifications: [
    { name: 'Front-end Development Certificate', issuer: 'Online Academy', year: '2022' },
    { name: 'Cloud Fundamentals', issuer: 'Cloud Academy', year: '2023' },
    { name: 'UX Design Fundamentals', issuer: 'Design Institute', year: '2021' },
  ],
  languages: [
    { name: 'English', level: 'Professional' },
    { name: 'Thai', level: 'Native' },
  ],
  awards: [
    { title: 'Dean List', issuer: 'Siam Technical University', year: '2020' },
  ],
  interests: ['Product design', 'Hackathons', 'Photography'],
};

export default function MinimalSleekTemplate({
  showExample = false,
  onEditSection,
}: {
  showExample?: boolean;
  onEditSection?: (
    section: 'basic' | 'photo' | 'contact' | 'education' | 'summary' | 'experience' | 'additional' | 'skills',
    meta?: { bounds?: { top: number; left: number; width: number; height: number } }
  ) => void;
}) {
  const { displayResumeData: resumeData } = useResume();
  const selectedColor = resumeData.templateColor || '#1e40af';
  const colors = getColorVariants(selectedColor);
  const isTemplateInUse = resumeData.selectedTemplate === 'minimal-sleek';

  // Font selection
  const headingFont = resumeData.headingFont || 'Inter';
  const bodyFont = resumeData.bodyFont || 'Inter';

  const noData =
    !resumeData.basicInfo &&
    !resumeData.education &&
    resumeData.experiences.length === 0 &&
    !resumeData.professionalSummary;

  const hasBasicInfoData = Boolean(
    resumeData.basicInfo && (
      resumeData.basicInfo.fullName?.trim() ||
      resumeData.basicInfo.professionalTitle?.trim() ||
      resumeData.basicInfo.email?.trim() ||
      resumeData.basicInfo.phone?.trim() ||
      resumeData.basicInfo.location?.trim() ||
      resumeData.basicInfo.profilePicture?.trim()
    )
  );

  const hasEducationData = Boolean(
    resumeData.education && (
      resumeData.education.university?.trim() ||
      resumeData.education.major?.trim() ||
      resumeData.education.graduationYear?.trim() ||
      resumeData.education.gpax?.trim()
    )
  );

  const hasSummaryData = Boolean(
    resumeData.professionalSummary && (
      resumeData.professionalSummary.description?.trim() ||
      resumeData.professionalSummary.role?.trim() ||
      resumeData.professionalSummary.experience?.trim() ||
      resumeData.professionalSummary.goal?.trim() ||
      (resumeData.professionalSummary.skills && resumeData.professionalSummary.skills.length > 0)
    )
  );

  const hasExperienceData = resumeData.experiences && resumeData.experiences.length > 0;

  const forceSample = showExample === true;

  const shouldShow = (sectionData: any) => forceSample || Boolean(sectionData) || !isTemplateInUse;

  // If the preview toggle is active, show full sample data. Otherwise preserve
  // existing behavior: when template is 'used' show empty user values, else show
  // user's data when present or sample data.
  let data: any;
  if (forceSample) {
    data = sampleData;
  } else {
    data = {
      basicInfo: isTemplateInUse
        ? (resumeData.basicInfo || {
            fullName: '',
            professionalTitle: '',
            profilePicture: '',
            email: '',
            phone: '',
            location: '',
            socialProfiles: [],
          })
        : (hasBasicInfoData ? (resumeData.basicInfo as typeof sampleData.basicInfo) : sampleData.basicInfo),
      education: isTemplateInUse
        ? (resumeData.education || {
            degree: '',
            major: '',
            university: '',
            graduationYear: '',
            gpax: '',
            coursework: [],
          })
        : (hasEducationData ? (resumeData.education as typeof sampleData.education) : sampleData.education),
      experiences: isTemplateInUse
        ? (resumeData.experiences || [])
        : (hasExperienceData ? resumeData.experiences : sampleData.experiences),
      professionalSummary: isTemplateInUse
        ? (resumeData.professionalSummary || {
            role: '',
            experience: '',
            skills: [],
            goal: '',
            description: '',
          })
        : (hasSummaryData ? (resumeData.professionalSummary as typeof sampleData.professionalSummary) : sampleData.professionalSummary),
    };
  }

  // Ensure data fields exist to avoid runtime errors when mapping
  data.basicInfo = {
    fullName: '',
    professionalTitle: '',
    profilePicture: '',
    email: '',
    phone: '',
    location: '',
    socialProfiles: [],
    ...(data.basicInfo || {}),
  };
  data.education = {
    degree: '',
    major: '',
    university: '',
    graduationYear: '',
    gpax: '',
    coursework: [],
    ...(data.education || {}),
  };
  data.experiences = data.experiences || [];
  data.professionalSummary = {
    role: '',
    experience: '',
    skills: [],
    goal: '',
    description: '',
    ...(data.professionalSummary || {}),
  };
  data = normalizeTemplateData(data);

  const {
    basicInfo,
    education,
    experiences,
    professionalSummary,
  } = data;
  const profileShape = (basicInfo?.photoFrameShape || 'rounded') as
    | 'square'
    | 'rounded'
    | 'circle'
    | 'none';
  const profileRadius =
    profileShape === 'circle'
      ? '50%'
      : profileShape === 'square'
        ? '0.35rem'
        : profileShape === 'none'
          ? '0'
          : '0.8rem';
  const profileObjectFit = profileShape === 'none' ? 'contain' : 'cover';
  const profileBackground = profileShape === 'none' ? 'transparent' : 'white';

  // Extract skills from experiences
  const allExperienceSkills = experiences.flatMap((exp: any) => exp.skills || []);
  const uniqueExperienceSkills = [...new Set(allExperienceSkills)];
  const iconColor = colors.secondary;
  const sectionFontSizes = {
    basic: 1,
    education: 1,
    summary: 1,
    experience: 1,
    additional: 1,
    ...(resumeData.sectionFontSizes || {}),
  };
  const getSectionZoom = (section: 'basic' | 'photo' | 'contact' | 'education' | 'summary' | 'experience' | 'additional' | 'skills') => {
    const raw = Number(sectionFontSizes[section as keyof typeof sectionFontSizes] || 1);
    return Math.max(0.8, Math.min(1.35, raw));
  };
  const getHeadingLockStyle = (section: 'basic' | 'photo' | 'contact' | 'education' | 'summary' | 'experience' | 'additional' | 'skills') => ({
    zoom: 1 / getSectionZoom(section),
    transformOrigin: 'left top',
  });
  const getEditableSectionProps = (section: 'basic' | 'photo' | 'contact' | 'education' | 'summary' | 'experience' | 'additional' | 'skills') => ({
    'data-edit-section': section,
    role: onEditSection ? 'button' : undefined,
    tabIndex: onEditSection ? 0 : undefined,
    onClick: onEditSection
      ? (event: React.MouseEvent<HTMLElement>) => {
          event.stopPropagation();
          const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
          onEditSection(section, {
            bounds: {
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
            },
          });
        }
      : undefined,
    onKeyDown: onEditSection
      ? (event: React.KeyboardEvent<HTMLElement>) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
            onEditSection(section, {
              bounds: {
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
              },
            });
          }
        }
      : undefined,
    style: {
      zoom: getSectionZoom(section),
      cursor: onEditSection ? 'pointer' : 'default',
    } as React.CSSProperties,
  });
  const theme = {
    headerBg: colors.sidebar,
    heading: colors.secondary,
    divider: `0.5px solid ${hexToRgba(colors.primary, 0.2)}`,
    softDivider: `0.5px solid ${hexToRgba(colors.primary, 0.14)}`,
    mutedPanel: '#ffffff',
    mutedCard: '#ffffff',
    subtleText: '#374151',
    titleText: '#111827',
  };
  const isCompact = experiences.length >= 4;
  const layout = {
    headerPadding: isCompact ? '0.58rem 0.8rem' : '0.75rem 1rem',
    mainPadding: isCompact ? '0.64rem 0.75rem' : '0.8rem 0.9rem',
    columnGap: isCompact ? '0.55rem' : '0.7rem',
    blockGap: isCompact ? '0.35rem' : '0.5rem',
    sectionPadding: isCompact ? '0.32rem 0.32rem' : '0.4rem 0.4rem',
    itemPadding: isCompact ? '0.28rem' : '0.35rem',
    rightGap: isCompact ? '0.35rem' : '0.5rem',
    profileAspectRatio: '1 / 1',
  };

  const additionalEducationEntries = Array.isArray((education as any)?.additionalEntries)
    ? (education as any).additionalEntries.filter((entry: any) =>
        Boolean(
          String(entry?.university || '').trim()
          || String(entry?.major || '').trim()
          || String(entry?.graduationYear || '').trim()
          || String(entry?.gpax || '').trim()
        )
      )
    : [];

  const educationItems = [
    {
      university: education?.university || '',
      major: education?.major || '',
      graduationYear: education?.graduationYear || '',
      gpax: education?.gpax || '',
    },
    ...additionalEducationEntries,
  ].filter((entry) =>
    Boolean(
      String(entry?.university || '').trim()
      || String(entry?.major || '').trim()
      || String(entry?.graduationYear || '').trim()
      || String(entry?.gpax || '').trim()
    )
  );

  const showContact = shouldShow(basicInfo);
  const showSkillCategories = professionalSummary?.showSkillCategories ?? true;

  // Use skills from the resolved data (either user, sample, or empty)
  const normalizedSkills: string[] = (professionalSummary && professionalSummary.skills && professionalSummary.skills.length > 0)
    ? [...new Set(professionalSummary.skills.map((skill: string) => skill.trim()).filter(Boolean))] as string[]
    : [...new Set((sampleData.professionalSummary.skills || []).map((skill: string) => skill.trim()).filter(Boolean))] as string[];

  const groupedSkills: Record<string, string[]> = {
    Frontend: [],
    Backend: [],
    Database: [],
    Tools: [],
    Others: [],
  };

  const frontendKeywords = ['react', 'next', 'vue', 'angular', 'javascript', 'typescript', 'html', 'css', 'tailwind', 'sass'];
  const backendKeywords = ['node', 'express', 'nestjs', 'python', 'java', 'go', 'php', 'c#', 'dotnet'];
  const databaseKeywords = ['postgres', 'postgresql', 'mysql', 'mongodb', 'sqlite', 'sql', 'database', 'prisma', 'supabase', 'firebase'];
  const toolKeywords = ['docker', 'kubernetes', 'aws', 'gcp', 'azure', 'git', 'github', 'ci', 'cd', 'terraform', 'linux', 'nginx', 'vscode', 'figma', 'jest', 'storybook', 'vite', 'webpack', 'npm', 'yarn', 'pnpm'];

  normalizedSkills.forEach((skill: string) => {
    const lowerSkill = skill.toLowerCase();
    if (frontendKeywords.some(keyword => lowerSkill.includes(keyword))) {
      groupedSkills.Frontend.push(skill);
    } else if (backendKeywords.some(keyword => lowerSkill.includes(keyword))) {
      groupedSkills.Backend.push(skill);
    } else if (databaseKeywords.some(keyword => lowerSkill.includes(keyword))) {
      groupedSkills.Database.push(skill);
    } else if (toolKeywords.some(keyword => lowerSkill.includes(keyword))) {
      groupedSkills.Tools.push(skill);
    } else {
      groupedSkills.Others.push(skill);
    }
  });

  const visibleSkillGroups = Object.entries(groupedSkills).filter(([, skills]) => skills.length > 0);
  const flatSkillList = normalizedSkills.filter(Boolean);

  return (
    <div className="w-full h-full flex justify-center bg-white p-0" style={{ fontSize: 'clamp(10px, 2vw, 16px)', fontFamily: `'${bodyFont}', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` }}>
      <div className="w-full flex flex-col" style={{ aspectRatio: '8.5 / 11', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
        {/* TOP HEADER SECTION - Minimal Colors */}
        <div style={{
          width: '100%',
          backgroundColor: theme.headerBg,
          color: 'white',
          padding: layout.headerPadding,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '950', color: 'white', margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em', lineHeight: 1.1, fontFamily: headingFont }}>
              {basicInfo?.fullName}
            </h1>
            <p style={{ fontSize: '0.73rem', color: '#d1d5db', fontWeight: '600', margin: '0.15rem 0 0 0', letterSpacing: '0.04em' }}>
              {basicInfo?.professionalTitle}
            </p>
          </div>
        </div>

        {/* MAIN CONTENT - TWO COLUMNS */}
        <div style={{
          width: '100%',
          flex: 1,
          display: 'flex',
          padding: layout.mainPadding,
          gap: layout.columnGap,
          overflow: 'hidden'
        }}>
          {/* LEFT COLUMN - Content with Better Spacing */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: layout.blockGap,
            paddingRight: '0.2rem'
          }}>
            {/* PERSONAL PROFILE - Minimal Design */}
            {(forceSample || isTemplateInUse || professionalSummary?.description) && (
                        <section
                          {...getEditableSectionProps('summary')}
                          style={{
                            ...getEditableSectionProps('summary').style,
                            backgroundColor: 'white',
                            padding: layout.sectionPadding,
                            borderRadius: '0.6rem',
                            borderBottom: theme.softDivider,
                          }}
                        >
                <h2 style={{ ...getHeadingLockStyle('summary'), fontSize: '0.78rem', fontWeight: '900', color: theme.heading, margin: '0 0 0.2rem 0', paddingBottom: '0.2rem', borderBottom: theme.divider, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: headingFont }}>
                  Personal Profile
                </h2>
                          {shouldShow(professionalSummary?.description) && (
                            <p style={{ fontSize: '0.67rem', lineHeight: '1.5', color: '#495057', margin: 0, fontWeight: 500 }}>
                              {professionalSummary.description}
                            </p>
                          )}
              </section>
            )}

            {/* WORK EXPERIENCE - Minimal Design */}
            {(forceSample || isTemplateInUse || (experiences && experiences.length > 0)) && (
              <section
                {...getEditableSectionProps('experience')}
                style={{
                  ...getEditableSectionProps('experience').style,
                  backgroundColor: 'white',
                  padding: layout.sectionPadding,
                  borderRadius: '0.6rem',
                  borderBottom: theme.softDivider,
                }}
              >
                <h2 style={{ ...getHeadingLockStyle('experience'), fontSize: '0.78rem', fontWeight: '900', color: theme.heading, margin: '0 0 0.25rem 0', paddingBottom: '0.2rem', borderBottom: theme.divider, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: headingFont }}>
                  Work Experience
                </h2>
                {shouldShow(experiences?.length) && experiences.map((exp: any, idx: number) => (
                  <div key={exp.id} style={{ marginBottom: isCompact ? '0.24rem' : '0.35rem', backgroundColor: theme.mutedCard, padding: layout.itemPadding, borderRadius: '0.4rem', borderBottom: theme.softDivider }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.15rem', gap: '0.2rem' }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontWeight: '800', color: theme.titleText, margin: 0, fontSize: isCompact ? '0.66rem' : '0.70rem', lineHeight: '1.25' }}>{exp.title}</h3>
                        <p style={{ color: '#475569', fontWeight: '700', margin: '0.08rem 0 0 0', fontSize: '0.65rem' }}>{exp.organization}</p>
                      </div>
                      <span style={{ color: '#64748b', fontWeight: '600', fontSize: '0.62rem', whiteSpace: 'nowrap' }}>
                        {(() => {
                          const endRaw = String(exp.endDate || '').trim();
                          const startRaw = String(exp.startDate || '').trim();
                          const endYearMatch = endRaw.match(/(19|20)\d{2}/);
                          if (endYearMatch) return endYearMatch[0];
                          const startYearMatch = startRaw.match(/(19|20)\d{2}/);
                          return startYearMatch ? startYearMatch[0] : '';
                        })()}
                      </span>
                    </div>
                    {(() => {
                      const r = exp.result ? exp.result.trim() : '';
                      const s = exp.situation ? exp.situation.trim() : '';
                      let text = '';
                      if (r && s) {
                        if (r.includes(s)) text = r;
                        else if (s.includes(r)) text = s;
                        else text = `${r} ${s}`;
                      } else {
                        text = r || s;
                      }
                      return text ? (
                        <div style={{ margin: isCompact ? '0.1rem 0 0 0' : '0.15rem 0 0 0', paddingLeft: '0.18rem', fontSize: isCompact ? '0.63rem' : '0.66rem', color: '#1e293b', lineHeight: '1.35', fontWeight: 500 }}>
                          <span style={{ color: iconColor }}>✓</span> {text}
                        </div>
                      ) : null;
                    })()}
                  </div>
                ))}
              </section>
            )}

            {/* ADDITIONAL INFO — all render in same spot; only one has data at a time */}
            {(() => {
              const additional = {
                // Only show sample data when the preview 'showExample' is active.
                certifications: resumeData.certifications && resumeData.certifications.length > 0 ? resumeData.certifications : (forceSample ? sampleData.certifications : []),
                languages: resumeData.languages && resumeData.languages.length > 0 ? resumeData.languages : (forceSample && sampleData.languages ? sampleData.languages : []),
                awards: resumeData.awards && resumeData.awards.length > 0 ? resumeData.awards : (forceSample && (sampleData as any).awards ? (sampleData as any).awards : []),
                interests: resumeData.interests && resumeData.interests.length > 0 ? resumeData.interests : (forceSample && (sampleData as any).interests ? (sampleData as any).interests : []),
              };
              const presentTypes = Object.entries(additional).filter(([, items]) => Array.isArray(items) && items.length > 0).map(([k]) => k);
              const titleMap: Record<string, string> = {
                certifications: 'Certifications',
                languages: 'Languages you speak',
                awards: 'Awards / Achievements',
                interests: 'Hobbies & interests',
              };
              const headerTitle = presentTypes.length === 1 ? titleMap[presentTypes[0]] || 'Additional Information' : (presentTypes.length > 1 ? 'Additional Information' : 'Certifications');
              if (presentTypes.length === 0) return null;
              return (
                <section
                  {...getEditableSectionProps('additional')}
                  style={{
                    ...getEditableSectionProps('additional').style,
                    backgroundColor: 'white',
                    padding: layout.sectionPadding,
                    borderRadius: '0.6rem',
                    borderBottom: theme.softDivider,
                  }}
                >
                  <h2 style={{ ...getHeadingLockStyle('additional'), fontSize: '0.78rem', fontWeight: '900', color: theme.heading, margin: '0 0 0.2rem 0', paddingBottom: '0.2rem', borderBottom: theme.divider, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: headingFont }}>
                    {headerTitle}
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.28rem 0.4rem', marginTop: '0.14rem' }}>
                    {presentTypes.map((type) => {
                      const title = titleMap[type] || 'Additional Information';
                      const items =
                        type === 'certifications' ? additional.certifications :
                        type === 'languages' ? additional.languages :
                        type === 'awards' ? additional.awards :
                        additional.interests;

                      return (
                        <div
                          key={type}
                          style={{
                            minWidth: 0,
                            borderRadius: '0.45rem',
                            padding: '0.22rem 0.28rem',
                            background: '#fff',
                          }}
                        >
                          <div style={{ fontSize: '0.64rem', fontWeight: 900, color: theme.heading, marginBottom: '0.12rem', textTransform: 'uppercase', letterSpacing: '0.04em', wordBreak: 'break-word' }}>
                            {title}
                          </div>
                          <div style={{ display: 'grid', gap: '0.08rem' }}>
                            {type === 'certifications' && (items || []).map((cert: any, idx: number) => (
                              <div key={idx} style={{ minWidth: 0, fontSize: '0.58rem', lineHeight: 1.18 }}>
                                <div style={{ fontWeight: 700, color: theme.titleText, wordBreak: 'break-word' }}>{cert.name || cert.title || ''}</div>
                                <div style={{ color: theme.subtleText, wordBreak: 'break-word' }}>{cert.issuer || ''}{cert.year ? ` — ${cert.year}` : ''}</div>
                              </div>
                            ))}
                            {type === 'languages' && (items || []).map((l: any, idx: number) => (
                              <div key={idx} style={{ fontSize: '0.58rem', lineHeight: 1.18, wordBreak: 'break-word' }}>
                                {(() => {
                                  const name = typeof l === 'string' ? l : (l.name || l.language || '');
                                  const level = typeof l === 'string' ? '' : (l.level || l.proficiency || '');
                                  return name + (level ? ` — ${level}` : '');
                                })()}
                              </div>
                            ))}
                            {type === 'awards' && (items || []).map((a: any, idx: number) => (
                              <div key={idx} style={{ fontSize: '0.58rem', lineHeight: 1.18, minWidth: 0 }}>
                                <div style={{ fontWeight: 700, marginBottom: 1, wordBreak: 'break-word' }}>{a.name || a.title || ''}</div>
                                <div style={{ color: theme.subtleText, wordBreak: 'break-word' }}>{a.issuer || a.org || ''} {a.year ? `— ${a.year}` : ''}</div>
                              </div>
                            ))}
                            {type === 'interests' && (items || []).map((it: any, idx: number) => (
                              <div key={idx} style={{ fontSize: '0.58rem', display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                                <span style={{ width: 14, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                  <InterestIcon name={typeof it === 'string' ? it : (it.name || '')} size={12} color="#c0c0c0" />
                                </span>
                                <span style={{ wordBreak: 'break-word' }}>{typeof it === 'string' ? it : it.name || ''}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })()}

            {/* Languages, Awards, Interests removed per request */}
          </div>

          {/* RIGHT COLUMN - Profile & Skills with Enhanced Polish */}
          <div style={{
            width: '32%',
            display: 'flex',
            flexDirection: 'column',
            gap: layout.rightGap,
            marginTop: '-0.2rem'
          }}>
            {/* PROFILE PICTURE - Minimal */}
            <div
              {...getEditableSectionProps('photo')}
              style={{
                ...getEditableSectionProps('photo').style,
                width: isCompact ? '86%' : '90%',
                aspectRatio: layout.profileAspectRatio,
                borderRadius: profileRadius,
                overflow: 'hidden',
                backgroundColor: profileBackground,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center'
              }}
            >
              {basicInfo?.profilePicture ? (
                <img
                  src={basicInfo.profilePicture}
                  alt="Profile"
                  style={{ width: '100%', height: '100%', objectFit: profileObjectFit }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: iconColor }}>
                  <svg
                    width="60%"
                    height="60%"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              )}
            </div>

            {/* CONTACT ME AT - Minimal */}
            {showContact && (
              <section
                  {...getEditableSectionProps('contact')}
                style={{
                    ...getEditableSectionProps('contact').style,
                  backgroundColor: theme.mutedPanel,
                  padding: layout.sectionPadding,
                  borderRadius: '0.6rem',
                  borderTop: theme.softDivider,
                }}
              >
                <h2 style={{ ...getHeadingLockStyle('contact'), fontSize: '0.72rem', fontWeight: '900', color: theme.heading, margin: '0 0 0.2rem 0', paddingBottom: '0.15rem', borderBottom: theme.divider, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: headingFont }}>
                  Contact
                </h2>
                {(forceSample || isTemplateInUse || basicInfo?.phone || basicInfo?.email || basicInfo?.location || (basicInfo?.socialProfiles && basicInfo.socialProfiles.length > 0)) && (
                  <div style={{ fontSize: '0.64rem', lineHeight: '1.6', color: theme.subtleText }}>
                    {basicInfo?.phone && (
                      <div style={{ marginBottom: '0.15rem' }}>
                        <p style={{ fontWeight: '600', margin: 0, color: '#1f2937' }}><span style={{ color: iconColor, marginRight: '0.25rem' }}>☎</span>{basicInfo.phone}</p>
                      </div>
                    )}
                    {basicInfo?.email && (
                      <div style={{ marginBottom: '0.15rem' }}>
                        <p style={{ fontWeight: '600', margin: 0, color: '#1f2937', wordBreak: 'break-word' }}><span style={{ color: iconColor, marginRight: '0.25rem' }}>✉</span>{basicInfo.email}</p>
                      </div>
                    )}
                    {basicInfo?.location && (
                      <div>
                        <p style={{ fontWeight: '600', margin: 0, color: '#1f2937' }}><span style={{ color: iconColor, marginRight: '0.25rem' }}>⌖</span>{basicInfo.location}</p>
                      </div>
                    )}
                    {basicInfo?.socialProfiles && basicInfo.socialProfiles.length > 0 && basicInfo.socialProfiles.map((profile: any, idx: number) => (
                      <div key={idx} style={{ marginTop: '0.15rem' }}>
                        <p style={{ fontWeight: '600', margin: 0, color: '#1f2937', wordBreak: 'break-word', display: 'flex', alignItems: 'center' }}>
                          <span style={{ color: iconColor, marginRight: '0.25rem', display: 'inline-block', width: 14 }}>
                            {profile.platform === 'github' && (
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ display: 'block' }} xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.48 2.87 8.28 6.84 9.63.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.1-1.5-1.1-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05A9.38 9.38 0 0 1 12 6.84c.85.004 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" fill="currentColor"/>
                              </svg>
                            )}
                            {profile.platform === 'linkedin' && (
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ display: 'block' }} xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 11.28h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.88v1.36h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v5.59z" fill="currentColor"/>
                              </svg>
                            )}
                            {profile.platform === 'portfolio' && (
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ display: 'block' }} xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                                <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" stroke="currentColor" strokeWidth="2" fill="none"/>
                              </svg>
                            )}
                            {profile.platform !== 'github' && profile.platform !== 'linkedin' && profile.platform !== 'portfolio' && (
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ display: 'block' }} xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                              </svg>
                            )}
                          </span>
                          {profile.username}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* EDUCATIONAL HISTORY - Right Column */}
            {(forceSample || isTemplateInUse || educationItems.length > 0) && (
              <section
                {...getEditableSectionProps('education')}
                style={{
                  ...getEditableSectionProps('education').style,
                  backgroundColor: theme.mutedPanel,
                  padding: layout.sectionPadding,
                  borderRadius: '0.6rem',
                  borderTop: theme.softDivider,
                }}
              >
                <h2 style={{ ...getHeadingLockStyle('education'), fontSize: '0.72rem', fontWeight: '900', color: theme.heading, margin: '0 0 0.2rem 0', paddingBottom: '0.15rem', borderBottom: theme.divider, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: headingFont }}>
                  Educational History
                </h2>
                {shouldShow(educationItems.length) && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.26rem' }}>
                    {educationItems.map((entry: any, idx: number) => (
                      <div key={`edu-${idx}`} style={{ fontSize: '0.60rem', lineHeight: '1.4', color: '#495057' }}>
                        <h3 style={{ fontWeight: '800', color: theme.titleText, margin: '0 0 0.04rem 0', fontSize: '0.63rem' }}>{entry.university || '-'}</h3>
                        <p style={{ color: '#6b7280', fontWeight: '700', margin: '0 0 0.02rem 0', fontSize: '0.58rem' }}>{entry.major || ''}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.57rem', color: '#374151', fontWeight: 500, marginTop: '0.04rem' }}>
                          <span>{entry.graduationYear || ''}</span>
                          {entry.gpax && <span style={{ fontWeight: '700' }}>GPAX: {entry.gpax}</span>}
                        </div>
                      </div>
                    ))}
                    {isTemplateInUse && educationItems.length === 0 && (
                      <div style={{ fontSize: '0.58rem', color: '#6b7280' }}>
                        Add education to display it here.
                      </div>
                    )}
                  </div>
                )}
                {!isTemplateInUse && !forceSample && educationItems.length === 0 && shouldShow(education) && (
                  <div style={{ fontSize: '0.58rem', color: '#6b7280' }}>
                    Add education to display it here.
                  </div>
                )}
              </section>
            )}

            {/* SKILLS SUMMARY - Minimal Badges */}
            {(forceSample || isTemplateInUse || visibleSkillGroups.length > 0 || flatSkillList.length > 0) && (
              <section
                {...getEditableSectionProps('skills')}
                style={{
                  ...getEditableSectionProps('skills').style,
                  backgroundColor: theme.mutedPanel,
                  padding: layout.sectionPadding,
                  borderRadius: '0.6rem',
                  borderTop: theme.softDivider,
                }}
              >
                <h2 style={{ ...getHeadingLockStyle('skills'), fontSize: '0.72rem', fontWeight: '900', color: theme.heading, margin: '0 0 0.2rem 0', paddingBottom: '0.15rem', borderBottom: theme.divider, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: headingFont }}>
                  Skills
                </h2>
                {shouldShow(showSkillCategories ? visibleSkillGroups.length : flatSkillList.length) && (
                  showSkillCategories ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      {visibleSkillGroups.map(([groupName, skills]) => (
                        <div key={groupName}>
                          <p style={{ margin: '0 0 0.15rem 0', fontSize: '0.59rem', fontWeight: 800, color: theme.heading, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {groupName}
                          </p>
                          <div style={{ fontSize: '0.62rem', display: 'flex', flexWrap: 'wrap', gap: '0.2rem' }}>
                            {skills.map((skill: any, idx: number) => (
                              <span key={`${groupName}-${idx}`} style={{
                                display: 'inline',
                                color: '#1f2937',
                                fontSize: '0.60rem',
                                fontWeight: '700',
                                whiteSpace: 'nowrap'
                              }}>
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                      {flatSkillList.map((skill: any, idx: number) => (
                        <span key={`flat-${idx}`} style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '0.12rem 0.4rem',
                          borderRadius: '999px',
                          background: '#f8fafc',
                          border: `0.5px solid ${hexToRgba(colors.primary, 0.08)}`,
                          color: '#1f2937',
                          fontSize: '0.60rem',
                          fontWeight: '700',
                          whiteSpace: 'nowrap'
                        }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  )
                )}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
