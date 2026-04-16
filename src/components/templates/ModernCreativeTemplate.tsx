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

function adjustBrightness(hex: string, percent: number) {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, Math.min(255, (num >> 16) + amt));
  const G = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amt));
  const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

function getColorVariants(primaryColor: string) {
  const colorMap: { [key: string]: { primary: string; secondary: string; accent: string; light: string; sidebar: string } } = {
    '#1e40af': { primary: '#1e40af', secondary: '#1e3a8a', accent: '#3b82f6', light: '#eff6ff', sidebar: '#2c3e50' },
    '#059669': { primary: '#059669', secondary: '#047857', accent: '#10b981', light: '#ecfdf5', sidebar: '#1e4d3b' },
    '#dc2626': { primary: '#dc2626', secondary: '#991b1b', accent: '#ef4444', light: '#fef2f2', sidebar: '#5a1a1a' },
    '#7c3aed': { primary: '#7c3aed', secondary: '#6d28d9', accent: '#a78bfa', light: '#faf5ff', sidebar: '#4c1d95' },
  };
  if (!colorMap[primaryColor]) {
    const primary = primaryColor;
    const secondary = adjustBrightness(primary, -20);
    const accent = adjustBrightness(primary, 20);
    const light = adjustBrightness(primary, 70);
    const sidebar = adjustBrightness(primary, -40);
    return { primary, secondary, accent, light, sidebar };
  }
  return colorMap[primaryColor];
}

const sampleData = {
  basicInfo: {
    fullName: 'Narin Chaiyaporn',
    professionalTitle: 'Full-stack Developer & UX Engineer',
    profilePicture: '',
    email: 'narin@example.com',
    phone: '+66 81 234 5678',
    location: 'Bangkok, Thailand',
    socialProfiles: [
      { platform: 'github', username: 'narinchai' },
      { platform: 'linkedin', username: 'narin-chai' },
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
  professionalSummary: {
    description:
      'Product-minded engineer who blends frontend craftsmanship with pragmatic backend engineering. Focused on usable interfaces, performance, and shipping high-quality products with cross-functional teams.',
    skills: ['React', 'TypeScript', 'Node.js', 'Next.js', 'Tailwind CSS', 'Docker', 'AWS'],
  },
  experiences: [
    {
      id: 'exp-brightworks-2023',
      startDate: '2023',
      endDate: 'Present',
      title: 'Senior Front-end Engineer',
      organization: 'Brightworks Co., Ltd.',
      result: '✓ Led a redesign of the customer-facing product to improve usability and performance. Implemented a reusable component library in React and TypeScript to speed up feature delivery. Reduced average page load times by 35% through code-splitting and image optimization. Mentored junior engineers and introduced accessibility improvements across the UI.',
      situation: '',
    },
    {
      id: 'exp-studiocraft-2021',
      startDate: '2021',
      endDate: '2022',
      title: 'Front-end Developer',
      organization: 'StudioCraft',
      result: '✓ Built responsive UI components and a design system used by product teams. Collaborated closely with designers to translate Figma into pixel-accurate interfaces and improve accessibility. Reduced CSS bundle sizes and improved rendering performance through refactors. Created Storybook documentation and unit tests to improve component reliability.',
      situation: '',
    },
    {
      id: 'exp-dataforge-2019',
      startDate: '2019',
      endDate: '2020',
      title: 'Software Engineer Intern',
      organization: 'DataForge',
      result: '✓ Developed internal tools to automate data import and reporting workflows. Wrote unit and integration tests to increase reliability of ETL processes. Optimized scripts to reduce processing time by 30% and improved monitoring for stakeholders. Presented results and supported adoption across operations teams.',
      situation: '',
    },
  ],
  certifications: [
    { name: 'Front-end Development Certificate', issuer: 'Online Academy', year: '2022' },
    { name: 'Cloud Fundamentals', issuer: 'Cloud Academy', year: '2023' },
    { name: 'UX Design Fundamentals', issuer: 'Design Institute', year: '2021' },
  ],
};

export default function ModernCreativeTemplate({
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
  // Default template color changed from purple to a blue tone
  const selectedColor = resumeData.templateColor || '#1e40af';
  const colors = getColorVariants(selectedColor);
  const forceSample = showExample === true;
  const isTemplateInUse = resumeData.selectedTemplate === 'modern-creative';

  const shouldShow = (sectionData: any) => forceSample || Boolean(sectionData) || !isTemplateInUse;
  
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

  const hasBasicInfo = Boolean(resumeData.basicInfo && (resumeData.basicInfo.fullName || resumeData.basicInfo.email || resumeData.basicInfo.phone || resumeData.basicInfo.location));
  const hasExperiences = Boolean(resumeData.experiences && resumeData.experiences.length > 0);
  const hasSummary = Boolean(resumeData.professionalSummary && (resumeData.professionalSummary.description || (resumeData.professionalSummary.skills && resumeData.professionalSummary.skills.length > 0)));

  let data: any;
  if (forceSample) {
    data = sampleData;
  } else {
    data = {
      basicInfo: isTemplateInUse ? (resumeData.basicInfo || { fullName: '', professionalTitle: '', profilePicture: '', email: '', phone: '', location: '', socialProfiles: [] }) : (hasBasicInfo ? resumeData.basicInfo : sampleData.basicInfo),
      education: isTemplateInUse ? (resumeData.education || { degree: '', major: '', university: '', graduationYear: '', gpax: '' }) : (resumeData.education || sampleData.education),
      professionalSummary: isTemplateInUse ? (resumeData.professionalSummary || { description: '', skills: [] }) : (hasSummary ? resumeData.professionalSummary : sampleData.professionalSummary),
      experiences: isTemplateInUse ? (resumeData.experiences || []) : (hasExperiences ? resumeData.experiences : sampleData.experiences),
      certifications: isTemplateInUse ? (resumeData.certifications || []) : (resumeData.certifications && resumeData.certifications.length > 0 ? resumeData.certifications : sampleData.certifications),
      languages: isTemplateInUse ? (resumeData.languages || []) : (resumeData.languages && resumeData.languages.length > 0 ? resumeData.languages : []),
      awards: isTemplateInUse ? (resumeData.awards || []) : (resumeData.awards && resumeData.awards.length > 0 ? resumeData.awards : []),
      interests: isTemplateInUse ? (resumeData.interests || []) : (resumeData.interests && resumeData.interests.length > 0 ? resumeData.interests : []),
    };
  }

  // Ensure fields default to safe types to avoid runtime .map on undefined
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
    ...(data.education || {}),
  };
  data.professionalSummary = {
    description: '',
    skills: [],
    ...(data.professionalSummary || {}),
  };
  data.experiences = data.experiences || [];
  data.certifications = data.certifications || [];
  data.languages = data.languages || [];
  data.awards = data.awards || [];
  data.interests = data.interests || [];
  data = normalizeTemplateData(data);

  const normalizedSkills = (data.professionalSummary && data.professionalSummary.skills && data.professionalSummary.skills.length > 0)
    ? [...new Set(data.professionalSummary.skills.map((s: string) => s.trim()).filter(Boolean))]
    : [];

  const groupedSkills: Record<string, string[]> = { Frontend: [], Backend: [], 'DevOps/Tools': [], Others: [] };
  const frontendKeywords = ['react', 'next', 'vue', 'angular', 'javascript', 'typescript', 'html', 'css', 'tailwind'];
  const backendKeywords = ['node', 'express', 'nestjs', 'python', 'java', 'go', 'php', 'postgres', 'mysql', 'mongodb'];
  const devopsKeywords = ['docker', 'kubernetes', 'aws', 'gcp', 'azure', 'ci', 'cd', 'terraform'];

  normalizedSkills.forEach((skill) => {
    const lower = skill.toLowerCase();
    if (frontendKeywords.some(k => lower.includes(k))) groupedSkills.Frontend.push(skill);
    else if (backendKeywords.some(k => lower.includes(k))) groupedSkills.Backend.push(skill);
    else if (devopsKeywords.some(k => lower.includes(k))) groupedSkills['DevOps/Tools'].push(skill);
    else groupedSkills.Others.push(skill);
  });

  const visibleSkillGroups = Object.entries(groupedSkills).filter(([, s]) => s.length > 0);

  const additionalEducationEntries = Array.isArray((data.education as any)?.additionalEntries)
    ? (data.education as any).additionalEntries.filter((entry: any) =>
        Boolean(
          String(entry?.university || '').trim()
          || String(entry?.major || '').trim()
          || String(entry?.graduationYear || '').trim()
        )
      )
    : [];

  const educationItems = [
    {
      university: data.education?.university || '',
      major: data.education?.major || '',
      graduationYear: data.education?.graduationYear || '',
      gpax: data.education?.gpax || '',
    },
    ...additionalEducationEntries,
  ].filter((entry) =>
    Boolean(
      String(entry?.university || '').trim()
      || String(entry?.major || '').trim()
      || String(entry?.graduationYear || '').trim()
    )
  );

  const headingFont = resumeData.headingFont || 'Inter';
  const bodyFont = resumeData.bodyFont || 'Inter';
  const fmtFont = (f: string, fallback = 'sans-serif') => {
    if (!f) return fallback;
    if (f.includes(',')) return f;
    return f.includes(' ') ? `"${f}", ${fallback}` : `${f}, ${fallback}`;
  };
  const profileShape = (data.basicInfo.photoFrameShape || 'rounded') as
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
          : '1rem';
  const profileObjectFit = profileShape === 'none' ? 'contain' : 'cover';

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#f4f6fa', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: 0 }}>
      <div style={{ width: '100%', minHeight: '100vh', background: '#fff', borderRadius: 0, boxShadow: 'none', display: 'flex', overflow: 'hidden', fontFamily: fmtFont(bodyFont), fontSize: 10 }}>
        <aside style={{ width: 220, background: colors.primary, color: '#fff', padding: '28px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div {...getEditableSectionProps('photo')} style={{ ...getEditableSectionProps('photo').style, width: 120, height: 120, borderRadius: profileRadius, overflow: 'hidden', marginBottom: 18, cursor: onEditSection ? 'pointer' : 'default' }}>
            {data.basicInfo.profilePicture ? (
              <img src={data.basicInfo.profilePicture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: profileObjectFit }} />
            ) : (
              <div style={{ width: '100%', height: '100%', background: colors.light, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" stroke="#bfc6d1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              </div>
            )}
          </div>
          {/* Left sidebar contact block (name/title intentionally omitted per request) */}
          <div {...getEditableSectionProps('contact')} style={{ ...getEditableSectionProps('contact').style, width: '100%', marginBottom: 8 }}>
            <div style={{ ...getHeadingLockStyle('contact'), fontSize: 10, fontWeight: 700, marginBottom: 6, color: colors.light }}>Contact</div>
            {shouldShow(data.basicInfo) && (
              <div style={{ fontSize: 10, color: colors.light, marginBottom: 6, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {data.basicInfo.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.09 4.18 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.72c.12 1 .45 2.07 1 3.2a2 2 0 0 1-.45 2.11L9.91 10.09a16 16 0 0 0 6 6l1.06-1.06a2 2 0 0 1 2.11-.45c1.13.55 2.2.88 3.2 1A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <div>{data.basicInfo.phone}</div>
                  </div>
                )}
                {data.basicInfo.email && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <path d="M4 4h16v16H4z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <div>{data.basicInfo.email}</div>
                  </div>
                )}
                {data.basicInfo.location && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <path d="M21 10c0 6-9 12-9 12S3 16 3 10a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <div>{data.basicInfo.location}</div>
                  </div>
                )}
              </div>
            )}

            {/* Social profiles: show saved profiles, otherwise show fallback examples */}
            {shouldShow(data.basicInfo?.socialProfiles?.length) && data.basicInfo.socialProfiles.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {data.basicInfo.socialProfiles.map((profile: any, idx: number) => {
                  const username = profile.username || '';
                  const url = profile.platform === 'github'
                    ? `https://github.com/${username}`
                    : profile.platform === 'portfolio'
                      ? (username.startsWith('http') ? username : `https://${username}`)
                      : (username.startsWith('http') ? username : `https://${username}`);
                  const icon = profile.platform === 'github' ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.2.8-.5v-2c-3.3.7-4-1.6-4-1.6-.6-1.5-1.4-1.9-1.4-1.9-1.1-.8.1-.8.1-.8 1.2.1 1.8 1.2 1.8 1.2 1.1 1.9 2.8 1.4 3.5 1.1.1-.9.4-1.4.7-1.7-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.5 1.2-3.4-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.4 1.2a11.6 11.6 0 0 1 6.2 0c2.4-1.5 3.4-1.2 3.4-1.2.6 1.6.2 2.8.1 3.1.8.9 1.2 2 1.2 3.4 0 4.5-2.7 5.5-5.3 5.8.4.4.7 1 .7 2v3c0 .3.2.6.8.5A12 12 0 0 0 12 .5z" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <path d="M10 13l5 3V6z" />
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                    </svg>
                  );
                  return (
                    <a key={idx} href={url} target="_blank" rel="noreferrer" style={{ color: colors.light, textDecoration: 'none', fontSize: 9, display: 'flex', alignItems: 'center', gap: 8 }}>
                      {icon}
                      <span>{username}</span>
                    </a>
                  );
                })}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <a href="https://github.com/narin-dev" target="_blank" rel="noreferrer" style={{ color: colors.light, textDecoration: 'none', fontSize: 9, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.2.8-.5v-2c-3.3.7-4-1.6-4-1.6-.6-1.5-1.4-1.9-1.4-1.9-1.1-.8.1-.8.1-.8 1.2.1 1.8 1.2 1.8 1.2 1.1 1.9 2.8 1.4 3.5 1.1.1-.9.4-1.4.7-1.7-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.5 1.2-3.4-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.4 1.2a11.6 11.6 0 0 1 6.2 0c2.4-1.5 3.4-1.2 3.4-1.2.6 1.6.2 2.8.1 3.1.8.9 1.2 2 1.2 3.4 0 4.5-2.7 5.5-5.3 5.8.4.4.7 1 .7 2v3c0 .3.2.6.8.5A12 12 0 0 0 12 .5z" />
                  </svg>
                  <span>narin-dev</span>
                </a>
                <a href="https://narin-portfolio.example" target="_blank" rel="noreferrer" style={{ color: colors.light, textDecoration: 'none', fontSize: 9, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <path d="M10 13l5 3V6z" />
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                  </svg>
                  <span>narin-portfolio.example</span>
                </a>
              </div>
            )}
          </div>

            <div {...getEditableSectionProps('skills')} style={{ ...getEditableSectionProps('skills').style, width: '100%', marginTop: 10 }}>
            <div style={{ ...getHeadingLockStyle('skills'), fontSize: 10, fontWeight: 700, marginBottom: 8 }}>Skills</div>
            {shouldShow(visibleSkillGroups.length) && visibleSkillGroups.map(([group, skills]) => (
              <div key={group} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 9, color: colors.light, marginBottom: 6 }}>{group}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {skills.map((s, i) => <span key={i} style={{ background: hexToRgba(colors.secondary, 0.12), color: '#fff', padding: '4px 8px', borderRadius: 10, fontSize: 9 }}>{s}</span>)}
                </div>
              </div>
            ))}
          </div>

            <div {...getEditableSectionProps('additional')} style={{ ...getEditableSectionProps('additional').style, width: '100%', marginTop: 12 }}>
            {/* Dynamic Additional Information block: adapt heading when other types provided */}
            {(() => {
              const additional = {
                certifications: data.certifications || [],
                languages: data.languages || [],
                awards: data.awards || [],
                interests: data.interests || [],
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
                <div>
                  <div style={{ ...getHeadingLockStyle('additional'), fontSize: 11, fontWeight: 700, marginBottom: 8 }}>{headerTitle}</div>
                  {presentTypes.map((type) => (
                    <div key={type} style={{ marginBottom: 6 }}>
                      {type !== 'certifications' && presentTypes.length > 1 && (
                        <div style={{ fontSize: 9, color: hexToRgba(colors.light, 0.9), marginBottom: 4, textTransform: 'capitalize' }}>{titleMap[type]}</div>
                      )}
                      {type === 'certifications' && (additional.certifications || []).map((c: any, idx: number) => (
                        <div key={idx} style={{ fontSize: 10, marginBottom: 6 }}>
                          <div style={{ fontWeight: 700 }}>{c.name || c.title || ''}</div>
                          <div style={{ fontSize: 9 }}>{c.issuer || ''} {c.year ? `— ${c.year}` : ''}</div>
                        </div>
                      ))}
                      {type === 'languages' && (additional.languages || []).map((l: any, idx: number) => {
                        const name = typeof l === 'string' ? l : (l.name || l.language || '');
                        const level = typeof l === 'string' ? '' : (l.level || l.proficiency || '');
                        return (
                          <div key={idx} style={{ fontSize: 10, marginBottom: 6 }}>
                            {name}{level ? ` (${level})` : ''}
                          </div>
                        );
                      })}
                      {type === 'awards' && (additional.awards || []).map((a: any, idx: number) => (
                        <div key={idx} style={{ fontSize: 10, marginBottom: 6 }}>
                          <div style={{ fontWeight: 700 }}>{a.name || a.title || ''}</div>
                          <div style={{ fontSize: 9 }}>{a.issuer || a.org || ''} {a.year ? `— ${a.year}` : ''}</div>
                        </div>
                      ))}
                      {type === 'interests' && (additional.interests || []).map((it: any, idx: number) => (
                        <div key={idx} style={{ fontSize: 10, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ width: 18, height: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: colors.light }}>
                            <InterestIcon name={typeof it === 'string' ? it : it.name || ''} size={14} color={colors.light} />
                          </span>
                          <div>{typeof it === 'string' ? it : it.name || ''}</div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </aside>

        <main style={{ flex: 1, padding: '24px', background: '#fff' }}>
          <div style={{ borderBottom: `1px solid ${hexToRgba(colors.primary, 0.08)}`, paddingBottom: 12, marginBottom: 12 }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: colors.primary, fontFamily: fmtFont(headingFont) }}>{data.basicInfo.fullName}</div>
            <div style={{ fontSize: 13, color: colors.secondary, marginTop: 6, fontFamily: fmtFont(headingFont) }}>{data.basicInfo.professionalTitle}</div>
          </div>

          {(forceSample || isTemplateInUse || data.professionalSummary.description) && (
            <section {...getEditableSectionProps('summary')} style={{ ...getEditableSectionProps('summary').style, marginBottom: 12 }}>
              <h3 style={{ ...getHeadingLockStyle('summary'), fontSize: 11, fontWeight: 700, color: colors.primary, fontFamily: fmtFont(headingFont) }}>Profile</h3>
              {shouldShow(data.professionalSummary?.description) && (
                <p style={{ fontSize: 10, color: '#222' }}>{data.professionalSummary.description}</p>
              )}
            </section>
          )}

          {(forceSample || isTemplateInUse || educationItems.length > 0) && (
            <section {...getEditableSectionProps('education')} style={{ ...getEditableSectionProps('education').style, marginBottom: 12 }}>
              <div>
                <h3 style={{ ...getHeadingLockStyle('education'), fontSize: 11, fontWeight: 700, color: colors.primary }}>Education</h3>
                {educationItems.map((item: any, idx: number) => (
                  <div key={idx} style={{ marginTop: idx === 0 ? 6 : 12, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      {shouldShow(item.major) && (
                        <div style={{ fontWeight: 700, fontSize: 10, color: '#222' }}>{item.major}</div>
                      )}
                      {shouldShow(item.university) && (
                        <div style={{ fontSize: 10, color: '#444', marginTop: 4 }}>{item.university}</div>
                      )}
                    </div>
                    <div style={{ minWidth: 80, textAlign: 'right', marginLeft: 16 }}>
                      {shouldShow(item.graduationYear) && (
                        <div style={{ fontSize: 10, fontWeight: 700, color: colors.secondary }}>{item.graduationYear}</div>
                      )}
                      {shouldShow(item.gpax) && (
                        <div style={{ fontSize: 10, color: '#666', marginTop: 4 }}>GPAX: {item.gpax}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {(forceSample || isTemplateInUse || (data.experiences && data.experiences.length > 0)) && (
            <section {...getEditableSectionProps('experience')} style={{ ...getEditableSectionProps('experience').style, marginBottom: 12 }}>
              <h3 style={{ ...getHeadingLockStyle('experience'), fontSize: 11, fontWeight: 700, color: colors.primary }}>Work Experience</h3>
                {shouldShow(data.experiences?.length) && (
                  <div style={{ position: 'relative', paddingLeft: 12 }}>
                    <div style={{ position: 'absolute', left: 6, top: 6, bottom: 0, width: 1, background: hexToRgba(colors.primary, 0.12), borderRadius: 2 }} />
                    {data.experiences.map((exp: any, idx: number) => (
                      <div key={exp.id || idx} style={{ marginTop: idx === 0 ? 0 : 18 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, marginLeft: 12 }}>{exp.title}</div>
                        <div style={{ fontSize: 9, color: colors.secondary, marginLeft: 12 }}>{exp.organization} — {(() => {
                          const endRaw = String(exp.endDate || '').trim();
                          const startRaw = String(exp.startDate || '').trim();
                          const endYearMatch = endRaw.match(/(19|20)\d{2}/);
                          if (endYearMatch) return endYearMatch[0];
                          const startYearMatch = startRaw.match(/(19|20)\d{2}/);
                          return startYearMatch ? startYearMatch[0] : '';
                        })()}</div>
                        <div style={{ fontSize: 10, marginTop: 6, color: '#222', marginLeft: 12, lineHeight: 1.6, wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>{exp.result || exp.situation}</div>
                      </div>
                    ))}
                  </div>
                )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
