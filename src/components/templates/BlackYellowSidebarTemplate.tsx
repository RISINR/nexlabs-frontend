import React from 'react';
import { useResume } from '../../contexts/ResumeContext';
import InterestIcon from '../icons/InterestIcon';
import { normalizeTemplateData } from './templateDataNormalizer';

// --- Utility functions (copied from MinimalSleekTemplate) ---
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
  // Black/Yellow theme for this template
  // For this template we keep a dark sidebar and allow the "primaryColor"
  // to drive the accent/secondary color (controlled by the UI color picker).
  return {
    primary: '#22232a', // left panel bg (kept dark for contrast)
    secondary: primaryColor || '#f7c948', // accent color (from picker)
    accent: primaryColor || '#f7c948',
    light: '#fff',
    sidebar: '#22232a',
  };
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
    coursework: [],
  },
  experiences: [
    {
      title: 'Senior Front-end Engineer',
      organization: 'Brightworks Co., Ltd.',
      startDate: '2023',
      endDate: 'Present',
      result: 'Led a redesign of the customer-facing product to improve usability and performance. Implemented a reusable component library in React and TypeScript to speed up feature delivery. Reduced average page load times by 35% through code-splitting and image optimization. Mentored junior engineers and introduced accessibility improvements across the UI.',
    },
    {
      title: 'Front-end Developer',
      organization: 'StudioCraft',
      startDate: '2021',
      endDate: '2022',
      result: 'Built responsive UI components and a design system used by product teams. Collaborated closely with designers to translate Figma into pixel-accurate interfaces and improve accessibility. Reduced CSS bundle sizes and improved rendering performance through refactors. Created Storybook documentation and unit tests to improve component reliability.',
    },
    {
      title: 'Software Engineer Intern',
      organization: 'DataForge',
      startDate: '2019',
      endDate: '2020',
      result: 'Developed internal tools to automate data import and reporting workflows. Wrote unit and integration tests to increase reliability of ETL processes. Optimized scripts to reduce processing time by 30% and improved monitoring for stakeholders. Presented results and supported adoption across operations teams.',
    },
  ],
  professionalSummary: {
    description: 'Product-minded full-stack developer with strong UX sensibilities. Experienced in building designer-friendly frontends using React and Next.js, and integrating with scalable backends.',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL', 'Figma'],
  },
  certifications: [
    { title: 'Front-end Development Certificate', issuer: 'Online Academy', year: '2022' },
    { title: 'Cloud Fundamentals', issuer: 'Cloud Academy', year: '2023' },
  ],
  awards: [
    { title: 'Developer of the Year', issuer: 'Tech Awards', year: '2023' },
  ],
  languages: [
    { name: 'Thai', proficiency: 'Native' },
    { name: 'English', proficiency: 'Fluent' },
  ],
};

export default function BlackYellowSidebarTemplate({
  showExample = false,
  onEditSection,
}: {
  showExample?: boolean;
  onEditSection?: (
    section: 'basic' | 'photo' | 'contact' | 'education' | 'summary' | 'experience' | 'additional',
    meta?: { bounds?: { top: number; left: number; width: number; height: number } }
  ) => void;
}) {
  const { displayResumeData: resumeData } = useResume();
  // showExample controls whether to force sample data (preview eye open)
  const forceSample = showExample === true;
  const isTemplateInUse = resumeData.selectedTemplate === 'black-yellow-sidebar';

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
      resumeData.education.graduationYear?.trim()
    )
  );
  const hasExperienceData = resumeData.experiences && resumeData.experiences.length > 0;
  const hasSummaryData = Boolean(resumeData.professionalSummary && (resumeData.professionalSummary.description || (resumeData.professionalSummary.skills && resumeData.professionalSummary.skills.length > 0)));

  // Use the selected template color from resumeData (picker on the right)
  const selectedColor = resumeData.templateColor || '#f7c948';
  const colors = getColorVariants(selectedColor);
  const headingFont = resumeData.headingFont || 'Inter';
  const bodyFont = resumeData.bodyFont || 'Inter';

  // Prefer real resume data when available; fall back to sampleData unless forced to sample
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
        : (hasBasicInfoData ? resumeData.basicInfo : sampleData.basicInfo),
      education: isTemplateInUse
        ? (resumeData.education || { degree: '', major: '', university: '', graduationYear: '', gpax: '', coursework: [] })
        : (hasEducationData ? resumeData.education : sampleData.education),
      experiences: isTemplateInUse ? (resumeData.experiences || []) : (hasExperienceData ? resumeData.experiences : sampleData.experiences),
      professionalSummary: isTemplateInUse
        ? (resumeData.professionalSummary || { description: '', skills: [] })
        : (hasSummaryData ? resumeData.professionalSummary : sampleData.professionalSummary),
      awards: isTemplateInUse ? (resumeData.awards || []) : (resumeData.awards && resumeData.awards.length > 0 ? resumeData.awards : sampleData.awards),
      certifications: isTemplateInUse ? (resumeData.certifications || []) : (resumeData.certifications && resumeData.certifications.length > 0 ? resumeData.certifications : sampleData.certifications),
      languages: isTemplateInUse ? (resumeData.languages || []) : (resumeData.languages && resumeData.languages.length > 0 ? resumeData.languages : sampleData.languages),
      interests: isTemplateInUse ? (resumeData.interests || []) : (resumeData.interests && resumeData.interests.length > 0 ? resumeData.interests : (sampleData as any).interests || []),
    };
  }
  // Normalize fields to safe defaults to avoid runtime .map on undefined
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
    description: '',
    skills: [],
    ...(data.professionalSummary || {}),
  };
  data.awards = data.awards || [];
  data.certifications = data.certifications || [];
  data.languages = data.languages || [];
  data.interests = (data as any).interests || [];
  data = normalizeTemplateData(data);

  const { basicInfo, education, experiences, professionalSummary, awards, certifications, languages } = data;
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
          : '1rem';
  const profileFrameBorder = profileShape === 'none' ? 'none' : `3px solid ${colors.secondary}`;
  const profileFrameShadow = profileShape === 'none' ? 'none' : '0 4px 12px rgba(0,0,0,0.12)';
  const profileObjectFit = profileShape === 'none' ? 'contain' : 'cover';

  // computed helpers
  const initials = (basicInfo?.fullName || '').split(' ').filter(Boolean).map((n: string) => n[0]).slice(0,2).join('').toUpperCase();
  const typ = {
    h1: '1.3rem',
    h2: '0.78rem',
    h3: '0.72rem',
    body: '0.72rem',
    small: '0.62rem',
    h1LS: -0.3,
    h2LS: 0.3,
    h3LS: 0.6,
  };

  const toYearToken = (value: any) => {
    const raw = String(value || '').trim();
    if (!raw) return '';
    const yearMatch = raw.match(/(19|20)\d{2}/);
    return yearMatch ? yearMatch[0] : '';
  };

  const formatExperienceEndYear = (startDate: any, endDate: any) => {
    const end = toYearToken(endDate);
    if (end) return end;
    return toYearToken(startDate);
  };

  const additionalEducationEntries = Array.isArray((education as any)?.additionalEntries)
    ? (education as any).additionalEntries.filter((entry: any) =>
        Boolean(
          String(entry?.university || '').trim()
          || String(entry?.major || '').trim()
          || String(entry?.graduationYear || '').trim()
        )
      )
    : [];

  const educationItems = [
    {
      university: education?.university || '',
      degree: education?.degree || '',
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
    )
  );

  // Normalize certifications: support both `title` (sampleData) and `name` (resumeData)
  const normalizedCerts = (certifications || []).map((c: any) => ({
    title: c.title || c.name || '',
    issuer: c.issuer || '',
    year: c.year || '',
  }));

  // sort certifications newest-first (by numeric year when available)
  const sortedCerts = normalizedCerts.slice().sort((a: any, b: any) => {
    const ay = parseInt((a?.year || '').toString().replace(/[^0-9]/g, ''), 10) || 0;
    const by = parseInt((b?.year || '').toString().replace(/[^0-9]/g, ''), 10) || 0;
    return by - ay;
  });

  // allow a custom priority order (user-specified): Meta -> AWS -> Google
  const certPriority = [
    'Meta Front-End Developer Certificate',
    'AWS Certified Cloud Practitioner',
    'Google UX Design Professional Certificate',
  ];
  const orderedCerts = (() => {
    const remaining = new Set(sortedCerts.map((c: any) => c.title));
    const out: typeof sortedCerts = [];
    for (const key of certPriority) {
      for (const c of sortedCerts) {
        if (!remaining.has(c.title)) continue;
        // match by inclusion to be forgiving
        if (c.title && c.title.includes(key)) {
          out.push(c);
          remaining.delete(c.title);
        }
      }
    }
    // append any that weren't in the priority list
    for (const c of sortedCerts) {
      if (remaining.has(c.title)) {
        out.push(c);
        remaining.delete(c.title);
      }
    }
    return out;
  })();

  // --- Layout ---
  return (
    <div
      className="w-full h-full flex justify-center bg-[#f7f7f7] p-0"
      style={{
        fontSize: 'clamp(7px, 0.8vw, 10px)',
        fontFamily: `'${bodyFont}', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
        boxSizing: 'border-box',
      }}
    >
      <div
        className="w-full h-full flex flex-row"
        style={{
          width: '100%',
          height: '100%',
          background: '#fff',
          boxShadow: 'none',
          borderRadius: 0,
          overflow: 'hidden',
          padding: 0,
          margin: 0,
        }}
      >
        {/* LEFT SIDEBAR */}
        <div
          style={{
            width: '33%',
            background: colors.sidebar,
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '1rem 0.5rem 0.6rem 0.5rem',
            gap: '0.5rem',
            boxSizing: 'border-box',
          }}
        >
          {/* Profile Picture */}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            <div {...getEditableSectionProps('photo')} style={{ ...getEditableSectionProps('photo').style, width: 140, height: 140, maxWidth: '100%', maxHeight: 180, borderRadius: profileRadius, overflow: 'hidden', cursor: onEditSection ? 'pointer' : 'default', border: profileFrameBorder, boxShadow: profileFrameShadow }}>
              {basicInfo?.profilePicture ? (
                <img
                  src={basicInfo.profilePicture}
                  alt="Profile"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: profileObjectFit,
                  }}
                />
              ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: profileRadius,
                      background: '#444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: colors.secondary,
                    }}
                  >
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
          </div>

          {/* CONTACT (moved from right) */}
          <div style={{ width: '100%', marginBottom: 6 }}>
            <h3 style={{ ...getHeadingLockStyle('contact'), color: '#ffffff', fontWeight: 800, fontSize: typ.h3, margin: 0, letterSpacing: '0.06em', textTransform: 'uppercase', paddingBottom: 6, borderBottom: `1px solid ${hexToRgba(colors.primary, 0.06)}` }}>CONTACT</h3>
            <div {...getEditableSectionProps('contact')} style={{ ...getEditableSectionProps('contact').style, fontSize: typ.body, color: '#fff', fontWeight: 500, marginTop: 8, lineHeight: 1.35, wordBreak: 'break-word', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {shouldShow(basicInfo?.phone) && (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ color: colors.secondary, display: 'inline-flex', width: 16, height: 16, alignItems: 'center', justifyContent: 'center' }} aria-hidden>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.86 19.86 0 0 1 3.08 5.18 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.72c.12 1.05.4 2.07.84 3.02a2 2 0 0 1-.45 2.11L9.91 11.09a14.05 14.05 0 0 0 6 6l1.24-1.24a2 2 0 0 1 2.11-.45c.95.44 1.97.72 3.02.84A2 2 0 0 1 22 16.92z" fill="currentColor" />
                    </svg>
                  </span>
                  <span>{basicInfo.phone}</span>
                </div>
              )}

              {shouldShow(basicInfo?.location) && (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginLeft: 0 }}>
                  <span style={{ color: colors.secondary, display: 'inline-flex', width: 16, height: 16, alignItems: 'center', justifyContent: 'center' }} aria-hidden>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
                      <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" fill="currentColor" />
                    </svg>
                  </span>
                  <span style={{ color: '#ffffff' }}>{basicInfo.location}</span>
                </div>
              )}

              {shouldShow(basicInfo?.email) && (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ color: colors.secondary, display: 'inline-flex', width: 16, height: 16, alignItems: 'center', justifyContent: 'center' }} aria-hidden>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
                      <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z" fill="currentColor" />
                    </svg>
                  </span>
                  <span style={{ wordBreak: 'break-word' }}>{basicInfo.email}</span>
                </div>
              )}

              {shouldShow(basicInfo?.socialProfiles?.length) && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {basicInfo.socialProfiles.map((profile: any, idx: number) => {
                    const name = profile.username;
                    const platform = profile.platform;
                    const icon = (() => {
                      switch (platform) {
                        case 'github':
                          return (
                            <svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                              <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.38 7.86 10.89.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.36-1.3-1.72-1.3-1.72-1.06-.73.08-.72.08-.72 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.72 1.27 3.38.97.11-.75.41-1.27.74-1.56-2.56-.29-5.26-1.28-5.26-5.71 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.05 11.05 0 012.9-.39c.98.01 1.97.13 2.9.39 2.2-1.5 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.45-2.71 5.41-5.29 5.69.42.36.79 1.08.79 2.18 0 1.57-.01 2.84-.01 3.23 0 .31.21.68.8.56A11.51 11.51 0 0023.5 12C23.5 5.73 18.27.5 12 .5z" />
                            </svg>
                          );
                        case 'linkedin':
                          return (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M4.98 3.5C3.88 3.5 3 4.38 3 5.5s.88 2 1.98 2H5c1.1 0 2-.9 2-2s-.9-2-2-2h-.02zM3 8.5h4v12H3v-12zM9.5 8.5h3.73v1.65h.05c.52-.98 1.8-2.01 3.7-2.01 3.96 0 4.69 2.61 4.69 6v6.36h-4v-5.65c0-1.35-.02-3.08-1.88-3.08-1.88 0-2.17 1.47-2.17 2.99v5.74h-4v-12z" fill="currentColor" />
                            </svg>
                          );
                        case 'portfolio':
                          return (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
                              <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" stroke="currentColor" strokeWidth="1.5" fill="none" />
                            </svg>
                          );
                        case 'behance':
                        case 'dribbble':
                          return (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.2" fill="none" />
                            </svg>
                          );
                        case 'other':
                        default:
                          return (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.2" fill="none" />
                            </svg>
                          );
                      }
                    })();

                    return (
                      <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span style={{ color: colors.secondary, display: 'inline-flex', width: 16, height: 16, alignItems: 'center', justifyContent: 'center' }} aria-hidden>
                          {icon}
                        </span>
                        <span>{name}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          
          {/* Skills */}
          {(forceSample || isTemplateInUse || (professionalSummary?.skills && professionalSummary.skills.length > 0)) && (
            <div {...getEditableSectionProps('skills')} style={{ ...getEditableSectionProps('skills').style, width: '100%', marginBottom: 6 }}>
              <h3 style={{ ...getHeadingLockStyle('skills'), color: '#ffffff', fontWeight: 800, fontSize: typ.h3, margin: 0, letterSpacing: '0.06em', textTransform: 'uppercase', paddingBottom: 6, borderBottom: `1px solid ${hexToRgba(colors.primary, 0.06)}` }}>SKILLS</h3>
              {shouldShow(professionalSummary?.skills?.length) && (
                <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {professionalSummary.skills.map((s: any, i: number) => (
                    <span
                      key={i}
                      style={{
                        background: hexToRgba(colors.light, 0.08),
                        color: '#fff',
                        padding: '3px 10px',
                        borderRadius: 999,
                        fontSize: typ.small,
                        fontWeight: 700,
                        lineHeight: 1,
                        display: 'inline-block',
                        maxWidth: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

              {/* Dynamic Additional Info (Awards / Certifications / Languages / Interests) - on left sidebar */}
              {(() => {
                const additional = {
                  certifications: certifications || [],
                  awards: awards || [],
                  languages: data.languages || [],
                  interests: (data as any).interests || [],
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
                  <div {...getEditableSectionProps('additional')} style={{ ...getEditableSectionProps('additional').style, width: '100%', marginBottom: 6 }}>
                    <h3 style={{ ...getHeadingLockStyle('additional'), color: '#ffffff', fontWeight: 800, fontSize: typ.h3, margin: 0, letterSpacing: '0.06em', textTransform: 'uppercase', paddingBottom: 6, borderBottom: `1px solid ${hexToRgba(colors.primary, 0.06)}` }}>{headerTitle}</h3>
                    {presentTypes.map((type) => (
                      <div key={type} style={{ marginTop: 8 }}>
                        {type === 'awards' && shouldShow(additional.awards.length) && (
                            <div style={{ marginTop: 4, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px' }}>
                              {additional.awards.map((a: any, i: number) => (
                                <div key={i} style={{ minWidth: 0, lineHeight: 1.2 }}>
                                  <div style={{ fontWeight: 700, color: '#fff', fontSize: typ.small, wordBreak: 'break-word' }}>{a.title || a.name || ''}</div>
                                  <div style={{ fontSize: typ.small, color: hexToRgba('#ffffff', 0.9), wordBreak: 'break-word' }}>{a.issuer || a.org || ''} {a.year ? `— ${a.year}` : ''}</div>
                                </div>
                              ))}
                            </div>
                        )}
                        {type === 'certifications' && shouldShow(additional.certifications.length) && (
                            <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                            {orderedCerts.map((c: any, i: number) => {
                              const issuer = c.issuer || '';
                              const isNoDash = /Meta|Amazon|Google|Cloud Academy|Online Academy|Design Institute/i.test(issuer);
                              const accentTitles = [
                                'Google UX Design Professional Certificate',
                                'Meta Front-End Developer Certificate',
                                'AWS Certified Cloud Practitioner',
                              ];
                              const titleColor = accentTitles.some(k => (c.title || '').includes(k)) ? colors.secondary : '#fff';
                                return (
                                <div key={i} style={{ background: hexToRgba('#ffffff', 0.04), padding: '8px 10px', borderRadius: 8, minWidth: 0 }}>
                                  <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', flexWrap: 'wrap' }}>
                                    <div style={{ fontWeight: 800, color: titleColor, fontSize: typ.small, wordBreak: 'break-word' }}>{c.title}</div>
                                    <div style={{ fontSize: typ.small, color: hexToRgba('#ffffff', 0.9), fontWeight: 600, wordBreak: 'break-word' }}>
                                      {isNoDash ? `${issuer}${c.year ? ` — ${c.year}` : ''}` : `— ${issuer}${c.year ? ` — ${c.year}` : ''}`}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        {type === 'languages' && shouldShow(additional.languages.length) && (
                          <>
                            {presentTypes.length > 1 && (
                              <div style={{ fontSize: typ.small, fontWeight: 700, color: '#fff', marginBottom: 4, textTransform: 'capitalize', letterSpacing: 0.5 }}>{titleMap[type]}</div>
                            )}
                            <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px' }}>
                              {additional.languages.map((l: any, i: number) => (
                                <div key={i} style={{ color: '#fff', fontSize: typ.small, marginBottom: 0, wordBreak: 'break-word' }}>
                                {(() => {
                                  const name = typeof l === 'string' ? l : (l.name || l.language || '');
                                  const level = typeof l === 'string' ? '' : (l.level || l.proficiency || '');
                                  return name + (level ? ` — ${level}` : '');
                                })()}
                              </div>
                            ))}
                            </div>
                          </>
                        )}
                        {type === 'interests' && shouldShow(additional.interests.length) && (
                          <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px' }}>
                            {additional.interests.map((it: any, i: number) => (
                              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 0, minWidth: 0 }}>
                                <span style={{ width: 18, height: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#f3f4f6' }}>
                                  <InterestIcon name={typeof it === 'string' ? it : (it.name || '')} size={14} color="#f3f4f6" />
                                </span>
                                <div style={{ color: '#fff', fontSize: typ.small, wordBreak: 'break-word' }}>{typeof it === 'string' ? it : it.name || ''}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })()}
        </div>
        <div style={{ flex: 1, background: '#fff', color: '#22232a', padding: '1rem 1rem 0.6rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', overflow: 'hidden', boxSizing: 'border-box' }}>
          {/* Name & Title with accent bar */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 6, height: 48, background: colors.secondary, borderRadius: 4, marginTop: 2 }} />
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: typ.h1, fontWeight: 900, margin: 0, color: '#111827', letterSpacing: `${typ.h1LS}px`, fontFamily: headingFont }}>{basicInfo?.fullName}</h1>
              <div style={{ fontWeight: 800, color: colors.secondary, fontSize: typ.h2, margin: '0.06rem 0 0.28rem 0', letterSpacing: `${typ.h2LS}px`, fontFamily: headingFont }}>{basicInfo?.professionalTitle}</div>
            </div>
          </div>
          {/* Profile */}
          {(professionalSummary?.description) && (
            <div style={{ marginBottom: 8 }}>
              <h3 style={{ color: '#111827', fontWeight: 800, fontSize: typ.h3, margin: 0, letterSpacing: '0.06em', textTransform: 'uppercase', paddingBottom: 6, borderBottom: `1px solid ${hexToRgba(colors.primary, 0.06)}` }}>PROFILE</h3>
              <div style={{ fontSize: typ.body, color: '#374151', fontWeight: 500, marginTop: 8, lineHeight: 1.35, whiteSpace: 'normal', wordBreak: 'break-word' }}>{professionalSummary.description}</div>
            </div>
          )}
          {/* ...existing code... */}
          {/* Education */}
          {educationItems.length > 0 && (
            <div {...getEditableSectionProps('education')} style={{ ...getEditableSectionProps('education').style, marginBottom: 8 }}>
                <h3 style={{ ...getHeadingLockStyle('education'), color: '#111827', fontWeight: 800, fontSize: typ.h3, margin: 0, letterSpacing: '0.06em', textTransform: 'uppercase', paddingBottom: 6, borderBottom: `1px solid ${hexToRgba(colors.primary, 0.06)}` }}>EDUCATION</h3>
                {educationItems.map((item: any, idx: number) => (
                  <div key={idx} style={{ marginBottom: idx === educationItems.length - 1 ? 0 : 6, marginTop: idx === 0 ? 6 : 0, paddingBottom: idx === educationItems.length - 1 ? 0 : 6, borderBottom: idx === educationItems.length - 1 ? 'none' : `1px solid ${hexToRgba(colors.primary, 0.06)}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {shouldShow(item.degree) && (
                          <div style={{ fontSize: '0.70rem', fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>{item.degree}</div>
                        )}
                        {shouldShow(item.university) && (
                          <div style={{ fontSize: '0.68rem', color: '#111827', marginTop: 2, lineHeight: 1.2 }}>{item.university}</div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center', marginTop: 4 }}>
                          {shouldShow(item.major) && (
                            <div style={{ color: '#4b5563', fontSize: '0.66rem', lineHeight: 1.15 }}>{item.major}</div>
                          )}
                          {shouldShow(item.gpax) && (
                            <div style={{ textAlign: 'right', color: '#6b7280', fontSize: '0.64rem', whiteSpace: 'nowrap' }}>
                              GPAX: {Number(item.gpax).toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>
                      {shouldShow(item.graduationYear) && (
                        <div style={{ color: '#111827', fontWeight: 800, fontSize: '0.66rem', whiteSpace: 'nowrap' }}>{item.graduationYear}</div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
          {/* Work Experience (compact timeline) */}
          {(forceSample || isTemplateInUse || (experiences && experiences.length > 0)) && (
            <div {...getEditableSectionProps('experience')} style={{ ...getEditableSectionProps('experience').style, marginBottom: 8 }}>
              <h3 style={{ ...getHeadingLockStyle('experience'), color: '#111827', fontWeight: 800, fontSize: typ.h3, margin: 0, letterSpacing: '0.06em', textTransform: 'uppercase', paddingBottom: 6, borderBottom: `1px solid ${hexToRgba(colors.primary, 0.06)}` }}>WORK EXPERIENCE</h3>
              {shouldShow(experiences?.length) && (
                <div style={{ marginTop: 10 }}>
                  {experiences.map((exp: any, idx: number) => (
                    <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
                      {/* Leading bullet (keep) */}
                      <div style={{ width: 14, display: 'flex', justifyContent: 'center' }}>
                        <div style={{ width: 8, height: 8, background: colors.secondary, borderRadius: 8, marginTop: 6 }} />
                      </div>

                      {/* Main content with title/org on the left and dates on the right */}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
                          <div style={{ fontWeight: 800, fontSize: '0.72rem', color: '#111827' }}>{exp.title} - {exp.organization}</div>
                          <div style={{ textAlign: 'right', color: colors.secondary, fontSize: '0.64rem', fontWeight: 700 }}>{formatExperienceEndYear(exp.startDate, exp.endDate)}</div>
                        </div>
                        {exp.result && <div style={{ marginTop: 4, fontSize: '0.68rem', color: '#22232a', lineHeight: 1.6, wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>{exp.result}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
