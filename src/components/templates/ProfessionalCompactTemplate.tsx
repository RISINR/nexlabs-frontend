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
      id: 'exp-1',
      title: 'Senior Front-end Engineer',
      organization: 'Brightworks Co., Ltd.',
      startDate: '2023',
      endDate: 'Present',
      result: 'Led a redesign of the customer-facing product to improve usability and performance. Implemented a reusable component library in React and TypeScript to speed up feature delivery. Reduced average page load times by 35% through code-splitting and image optimization. Mentored junior engineers and introduced accessibility improvements across the UI.',
    },
    {
      id: 'exp-2',
      title: 'Front-end Developer',
      organization: 'StudioCraft',
      startDate: '2021',
      endDate: '2022',
      result: 'Built responsive UI components and a design system used by product teams. Collaborated closely with designers to translate Figma into pixel-accurate interfaces and improve accessibility. Reduced CSS bundle sizes and improved rendering performance through refactors. Created Storybook documentation and unit tests to improve component reliability.',
    },
    {
      id: 'exp-3',
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
    { title: 'UX Design Fundamentals', issuer: 'Design Institute', year: '2021' },
  ],
  languages: [],
};

export default function ProfessionalCompactTemplate({
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
  const isTemplateInUse = resumeData.selectedTemplate === 'professional-compact';
  const headingFont = resumeData.headingFont || 'Inter';
  const bodyFont = resumeData.bodyFont || 'Inter';

  const forceSample = showExample === true;

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

  const hasBasicInfo = Boolean(
    resumeData.basicInfo && (
      resumeData.basicInfo.fullName?.trim() ||
      resumeData.basicInfo.professionalTitle?.trim() ||
      resumeData.basicInfo.email?.trim() ||
      resumeData.basicInfo.phone?.trim() ||
      resumeData.basicInfo.location?.trim()
    )
  );
  const hasEducation = Boolean(resumeData.education && Object.keys(resumeData.education).length > 0);
  const hasExperiences = Boolean(resumeData.experiences && resumeData.experiences.length > 0);
  const hasSummary = Boolean(resumeData.professionalSummary && Object.keys(resumeData.professionalSummary).length > 0);

  let data: any;
  if (forceSample) {
    data = sampleData;
  } else {
    data = {
      basicInfo: isTemplateInUse
        ? (resumeData.basicInfo || { fullName: '', professionalTitle: '', profilePicture: '', email: '', phone: '', location: '', socialProfiles: [] })
        : (hasBasicInfo ? resumeData.basicInfo : sampleData.basicInfo),
      education: isTemplateInUse ? (resumeData.education || { degree: '', major: '', university: '', graduationYear: '', gpax: '', coursework: [] }) : (hasEducation ? resumeData.education : sampleData.education),
      experiences: isTemplateInUse ? (resumeData.experiences || []) : (hasExperiences ? resumeData.experiences : sampleData.experiences),
      professionalSummary: isTemplateInUse ? (resumeData.professionalSummary || { description: '', skills: [] }) : (hasSummary ? resumeData.professionalSummary : sampleData.professionalSummary),
      languages: isTemplateInUse ? (resumeData.languages || []) : (resumeData.languages && resumeData.languages.length > 0 ? resumeData.languages : []),
      certifications: isTemplateInUse ? (resumeData.certifications || []) : (resumeData.certifications && resumeData.certifications.length > 0 ? resumeData.certifications : sampleData.certifications),
      awards: isTemplateInUse ? (resumeData.awards || []) : (resumeData.awards && resumeData.awards.length > 0 ? resumeData.awards : []),
      interests: isTemplateInUse ? (resumeData.interests || []) : (resumeData.interests && resumeData.interests.length > 0 ? resumeData.interests : []),
    };
  }

  // Normalize shape to avoid runtime errors
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
  data.professionalSummary = {
    description: '',
    skills: [],
    ...(data.professionalSummary || {}),
  };
  data.experiences = data.experiences || [];
  data.languages = data.languages || [];
  data.certifications = data.certifications || [];
  data.awards = data.awards || [];
  data.interests = data.interests || [];
  data = normalizeTemplateData(data);

  const additionalEducationEntries = (data.education?.additionalEntries || []).filter(
    (entry: any) =>
      String(entry?.university || '').trim() ||
      String(entry?.major || '').trim() ||
      String(entry?.graduationYear || '').trim()
  );
  const educationItems = [
    data.education,
    ...additionalEducationEntries,
  ].filter(
    (entry: any) =>
      String(entry?.university || '').trim() ||
      String(entry?.major || '').trim() ||
      String(entry?.graduationYear || '').trim()
  );

  const { basicInfo, education, experiences, professionalSummary, certifications, languages, awards, interests } = data;
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
  const profileBorder = 'none';
  const profileBackground = profileShape === 'none' ? 'transparent' : '#f7f7f7';
  const profileObjectFit = profileShape === 'none' ? 'contain' : 'cover';

  const normalizedSkills = (data.professionalSummary && data.professionalSummary.skills && data.professionalSummary.skills.length > 0)
    ? [...new Set(data.professionalSummary.skills.map((s:any) => s.trim()).filter(Boolean))]
    : [];

  return (
    <div className="w-full h-full flex justify-center bg-white p-0" style={{ fontSize: 'clamp(8px, 1.4vw, 13px)', fontFamily: `'${bodyFont}', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` }}>
      <div style={{ width: '100%', maxWidth: '100%', background: '#fff', padding: '1rem', boxSizing: 'border-box', position: 'relative' }}>
        <div style={{ width: '100%', padding: '0.6rem 0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ width: '100%', maxWidth: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: colors.primary, fontFamily: headingFont }}>{basicInfo?.fullName}</h1>
              <div style={{ marginTop: 4, color: '#6b7280', fontWeight: 700, fontSize: '0.82rem' }}>{basicInfo?.professionalTitle}</div>
            </div>
            <div {...getEditableSectionProps('contact')} style={{ ...getEditableSectionProps('contact').style, position: 'relative', textAlign: 'right', color: '#374151', fontSize: '0.78rem' }}>
              {shouldShow(data.basicInfo) && basicInfo?.email && <div>{basicInfo.email}</div>}
              {shouldShow(data.basicInfo) && basicInfo?.phone && <div>{basicInfo.phone}</div>}
              {shouldShow(data.basicInfo) && basicInfo?.location && <div>{basicInfo.location}</div>}
              {basicInfo?.socialProfiles && basicInfo.socialProfiles.length > 0 && (
                <div style={{ position: 'absolute', right: 0, top: '120px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                  {basicInfo.socialProfiles.map((s:any, i:number) => {
                    const username = s.username || '';
                    let href = username;
                    if (!/^https?:\/\//i.test(username)) {
                      if (s.platform === 'github') href = `https://github.com/${username}`;
                      else href = username.includes('.') ? `https://${username}` : `https://${username}`;
                    }
                    const isGithub = s.platform === 'github';
                    return (
                      <a key={i} href={href} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none', padding: '2px 0', whiteSpace: 'nowrap' }}>
                        {isGithub ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: colors.secondary }}>
                            <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.41 7.86 10.94.57.1.78-.25.78-.55 0-.27-.01-1-.02-1.96-3.2.69-3.88-1.54-3.88-1.54-.52-1.33-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.67 1.25 3.32.96.1-.75.4-1.25.73-1.54-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.3 1.18-3.11-.12-.29-.51-1.47.11-3.06 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 2.87-.39c.97 0 1.95.13 2.87.39 2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.77.11 3.06.74.81 1.18 1.85 1.18 3.11 0 4.43-2.7 5.4-5.28 5.69.41.35.77 1.03.77 2.08 0 1.5-.01 2.71-.01 3.08 0 .3.2.66.79.55A11.52 11.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" /></svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: colors.secondary }}>
                            <path d="M10 14L21 3" />
                            <path d="M21 3v7a2 2 0 0 1-2 2h-7" />
                            <path d="M14 10H3a2 2 0 0 0-2 2v7" />
                          </svg>
                        )}
                        <span style={{ fontSize: '0.72rem', color: '#374151', fontWeight: 700 }}>{username}</span>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
          <div {...getEditableSectionProps('photo')} style={{ ...getEditableSectionProps('photo').style, width: 110, height: 110, borderRadius: profileRadius, overflow: 'hidden', border: profileBorder, background: profileBackground, cursor: onEditSection ? 'pointer' : 'default' }}>
            {basicInfo?.profilePicture ? (
              <img src={basicInfo.profilePicture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: profileObjectFit }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.secondary }}>
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              </div>
            )}
          </div>
        </div>

        {(forceSample || isTemplateInUse || professionalSummary?.description) && (
          <div {...getEditableSectionProps('summary')} style={{ ...getEditableSectionProps('summary').style, marginTop: 12, padding: '0.5rem 0.4rem', borderTop: `1px solid ${hexToRgba(colors.primary, 0.12)}`, borderBottom: `1px solid ${hexToRgba(colors.primary, 0.06)}` }}>
            <h2 style={{ ...getHeadingLockStyle('summary'), margin: 0, fontSize: '0.68rem', fontWeight: 900, textTransform: 'uppercase', color: colors.primary, fontFamily: headingFont }}>About Me</h2>
            {shouldShow(data.professionalSummary?.description) && (
              <p style={{ marginTop: 8, color: '#4b5563', fontSize: '0.62rem', lineHeight: 1.5 }}>{professionalSummary.description}</p>
            )}
          </div>
        )}

        <div style={{ display: 'flex', gap: 16, marginTop: 14 }}>
          <div {...getEditableSectionProps('experience')} style={{ ...getEditableSectionProps('experience').style, flex: 0.62 }}>
            <h3 style={{ ...getHeadingLockStyle('experience'), margin: '0 0 6px 0', fontSize: '0.66rem', fontWeight: 900, textTransform: 'uppercase', color: colors.primary, fontFamily: headingFont }}>Experience</h3>
            {shouldShow(data.experiences?.length) && experiences && experiences.map((exp:any, idx:number) => (
              <div key={exp.id || idx} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: '0.64rem', color: colors.secondary, fontWeight: 700 }}>{(() => {
                  const endRaw = String(exp.endDate || '').trim();
                  const startRaw = String(exp.startDate || '').trim();
                  const endYearMatch = endRaw.match(/(19|20)\d{2}/);
                  if (endYearMatch) return endYearMatch[0];
                  const startYearMatch = startRaw.match(/(19|20)\d{2}/);
                  return startYearMatch ? startYearMatch[0] : '';
                })()}</div>
                <div style={{ marginTop: 6, fontWeight: 800, fontSize: '0.72rem' }}>{exp.title} - {exp.organization}</div>
                {exp.result && (
                  <div style={{ marginTop: 8, color: '#374151', fontSize: '0.62rem', lineHeight: 1.6, wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>{exp.result}</div>
                )}
              </div>
            ))}
          </div>

          <div style={{ flex: 0.38, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(forceSample || isTemplateInUse || education) && (
              <div {...getEditableSectionProps('education')} style={{ ...getEditableSectionProps('education').style }}>
                <h4 style={{ ...getHeadingLockStyle('education'), margin: 0, fontSize: '0.64rem', fontWeight: 900, textTransform: 'uppercase', color: colors.primary, fontFamily: headingFont }}>Education</h4>
                {shouldShow(data.education) && educationItems.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    {educationItems.map((edu: any, idx: number) => (
                      <div key={idx} style={{ marginBottom: idx === educationItems.length - 1 ? 0 : 8 }}>
                        <div style={{ fontWeight: 800, fontSize: '0.68rem' }}>{edu.university}</div>
                        <div style={{ color: '#6b7280', fontWeight: 700, fontSize: '0.62rem' }}>{edu.major || ''}</div>
                        <div style={{ marginTop: 6, color: '#374151', fontSize: 11 }}>{edu.graduationYear}{edu.gpax ? ` · GPAX ${edu.gpax}` : ''}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {(() => {
              // Additional info: include certifications here to avoid duplicate separate block.
              const savedAdditional = {
                certifications: data.certifications || [],
                languages: data.languages || [],
                awards: data.awards || [],
                interests: data.interests || [],
              };

              const sampleAdditional = {
                certifications: (sampleData as any).certifications || [],
                languages: (sampleData as any).languages || [],
                awards: (sampleData as any).awards || [],
                interests: (sampleData as any).interests || [],
              };

              const additionalSource = forceSample ? sampleAdditional : savedAdditional;
              const presentTypes = Object.entries(additionalSource).filter(([, items]) => Array.isArray(items) && items.length > 0).map(([k]) => k);
              if (presentTypes.length === 0) return null;

              const titleMap: Record<string, string> = {
                certifications: 'Certifications',
                languages: 'Languages you speak',
                awards: 'Awards / Achievements',
                interests: 'Hobbies & interests',
              };

              const headerTitle = presentTypes.length === 1 ? titleMap[presentTypes[0]] || 'Additional Information' : 'Additional Information';

              return (
                <div {...getEditableSectionProps('additional')} style={{ ...getEditableSectionProps('additional').style }}>
                  <h4 style={{ ...getHeadingLockStyle('additional'), margin: '8px 0 0 0', fontSize: '0.64rem', fontWeight: 900, textTransform: 'uppercase', color: colors.primary, fontFamily: headingFont }}>{headerTitle}</h4>
                  <div style={{ marginTop: 8 }}>
                    {presentTypes.map((type) => (
                      <div key={type} style={{ marginBottom: 8 }}>
                        {type === 'certifications' && (additionalSource.certifications || []).map((cert:any, i:number) => (
                          <div key={i} style={{ display: 'flex', flexDirection: 'column', marginBottom: 8 }}>
                            <div style={{ fontWeight: 800, fontSize: '0.66rem', color: '#111827' }}>{cert.name || cert.title}</div>
                            <div style={{ color: '#6b7280', fontSize: '0.62rem' }}>{cert.issuer || cert.org} {cert.year ? `— ${cert.year}` : ''}</div>
                          </div>
                        ))}
                        {type === 'languages' && (
                          <>
                            {presentTypes.length > 1 && (
                              <div style={{ fontWeight: 800, fontSize: '0.64rem', color: colors.primary, marginBottom: 4 }}>{titleMap[type]}</div>
                            )}
                            {(additionalSource.languages || []).map((lang:any, i:number) => {
                          const name = typeof lang === 'string' ? lang : (lang.name || lang.language || '');
                          const rawLevel = typeof lang === 'string' ? '' : (lang.level || lang.proficiency || '');
                          return (
                            <div key={i} style={{ marginBottom: 6 }}>
                              <div style={{ fontWeight: 800, fontSize: '0.64rem' }}>{name}{rawLevel ? ` — ${rawLevel}` : ''}</div>
                            </div>
                          );
                        })}
                          </>
                        )}
                        {type === 'awards' && (additionalSource.awards || []).map((a:any, i:number) => (
                          <div key={i} style={{ display: 'flex', flexDirection: 'column', marginBottom: 6 }}>
                            <div style={{ fontWeight: 800, fontSize: '0.64rem' }}>{a.title || a.name || ''}</div>
                            <div style={{ color: '#6b7280', fontSize: '0.62rem' }}>{a.issuer || a.org || ''} {a.year ? `— ${a.year}` : ''}</div>
                          </div>
                        ))}
                        {type === 'interests' && (additionalSource.interests || []).map((it:any, i:number) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                            <span style={{ width: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                              <InterestIcon name={typeof it === 'string' ? it : (it.name || '')} size={14} color="#9ca3af" />
                            </span>
                            <div style={{ fontSize: '0.62rem' }}>{typeof it === 'string' ? it : it.name || ''}</div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {(forceSample || isTemplateInUse || (normalizedSkills.length > 0)) && (
              <div {...getEditableSectionProps('skills')} style={{ ...getEditableSectionProps('skills').style }}>
                <h4 style={{ ...getHeadingLockStyle('skills'), margin: 0, fontSize: '0.64rem', fontWeight: 900, textTransform: 'uppercase', color: colors.primary, fontFamily: headingFont }}>Skills</h4>
                {shouldShow(normalizedSkills.length) && (
                  <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {normalizedSkills.map((s:any, i:number) => (
                      <span key={i} style={{ background: '#f5f5f5', padding: '4px 7px', borderRadius: 12, fontWeight: 700, fontSize: 10 }}>{s}</span>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
