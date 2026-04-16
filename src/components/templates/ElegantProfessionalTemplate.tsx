import React from 'react';
import { useResume } from '../../contexts/ResumeContext';
import InterestIcon from '../icons/InterestIcon';
import { normalizeTemplateData } from './templateDataNormalizer';

// Helper functions from MinimalSleekTemplate
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

// Anonymized sample data (English, Thai-style name) used when preview forces example
const sampleData = {
  basicInfo: {
    fullName: 'Narin Chaiyaporn',
    professionalTitle: 'Full-stack Engineer & Product Designer',
    profilePicture: '',
    email: 'narin.chai@example.com',
    phone: '+66 81 234 5678',
    location: 'Bangkok, Thailand',
    socialProfiles: [
      { platform: 'github', username: 'narinchai' },
      { platform: 'linkedin', username: 'narin-chai' },
    ],
  },
  education: {
    university: 'Chulalongkorn University',
    graduationYear: '2020',
    degree: "Bachelor of Engineering",
    major: 'Computer Engineering',
    gpax: '3.64',
  },
  professionalSummary: {
    description: 'Versatile engineer combining front-end craftsmanship with pragmatic backend design. Delivered user-centered features at scale and collaborated closely with product teams to improve retention and performance.',
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'Docker', 'AWS', 'Figma'],
  },
  experiences: [
    {
      id: 'exp-1',
      title: 'Senior Full-stack Engineer',
      organization: 'NexLabs (Contract)',
      startDate: '2022',
      endDate: 'Present',
      situation: 'Led a cross-functional team rebuilding the order management flow for a B2B platform.',
      result: 'Improved throughput by redesigning APIs and reducing page load time, increasing conversion by 18% within six months and reducing operational errors.',
    },
    {
      id: 'exp-2',
      title: 'Frontend Engineer',
      organization: 'BrightApps Co.',
      startDate: '2020',
      endDate: '2022',
      situation: 'Implemented a design system and migrated key pages to a component-driven architecture.',
      result: 'Cut time-to-market for new UIs by ~35% and improved accessibility and consistency across the product suite.',
    },
    {
      id: 'exp-3',
      title: 'Software Engineer Intern',
      organization: 'Smart Solutions Lab',
      startDate: '2019',
      endDate: '2019',
      situation: 'Built automation scripts and small services for internal tooling.',
      result: 'Automated repetitive reporting tasks and reduced manual work by several hours per week for the data team.',
    },
  ],
  certifications: [
    { name: 'AWS Certified Developer – Associate', issuer: 'Amazon Web Services', year: '2021' },
    { name: 'Certified Kubernetes Application Developer', issuer: 'CNCF', year: '2022' },
    { name: 'Interaction Design Foundation — UI Design', issuer: 'IDF', year: '2020' },
  ],
};

// Main component for the new template

interface Props {
  showExample?: boolean;
  onEditSection?: (
    section: 'basic' | 'photo' | 'contact' | 'education' | 'summary' | 'experience' | 'additional',
    meta?: { bounds?: { top: number; left: number; width: number; height: number } }
  ) => void;
}

export const ElegantProfessionalTemplate: React.FC<Props> = ({ showExample = false, onEditSection }) => {
  // Responsive styles
  const responsiveStyles = `
    @media (max-width: 700px) {
      .elegant-resume-root {
        flex-direction: column !important;
        max-width: 100vw !important;
        min-height: 100vh !important;
        border-radius: 0 !important;
        margin: 0 !important;
      }
      .elegant-resume-sidebar {
        width: 100% !important;
        min-width: 0 !important;
        max-width: 100vw !important;
        border-right: none !important;
        border-bottom: 1px solid #e0e4e0 !important;
        align-items: center !important;
        padding: 18px 8vw 12px 8vw !important;
      }
      .elegant-resume-profile {
        width: 80px !important;
        height: 80px !important;
        margin-bottom: 12px !important;
      }
      .elegant-resume-main {
        padding: 18px 16px !important;
        max-width: 100vw !important;
        font-size: 13px !important;
      }
    }
  `;
  
  // use resumeData and selectTemplateColor from context
  const { displayResumeData: resumeData, selectTemplateColor } = useResume();
  
  // Helper functions for editable sections
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
  
  // When `showExample` is true we force the anonymized sample
  const forceSample = showExample === true;
  const isTemplateInUse = resumeData.selectedTemplate === 'elegant-professional';

  const shouldShow = (sectionData: any) => forceSample || Boolean(sectionData) || !isTemplateInUse;

  const hasBasicInfo = Boolean(resumeData.basicInfo && (resumeData.basicInfo.fullName || resumeData.basicInfo.email || resumeData.basicInfo.phone || resumeData.basicInfo.location));
  const hasExperiences = Boolean(resumeData.experiences && resumeData.experiences.length > 0);
  const hasSummary = Boolean(resumeData.professionalSummary && (resumeData.professionalSummary.description || (resumeData.professionalSummary.skills && resumeData.professionalSummary.skills.length > 0)));

  let data: any;
  if (forceSample) {
    data = sampleData;
  } else {
    data = {
      basicInfo: isTemplateInUse ? (resumeData.basicInfo || { fullName: '', professionalTitle: '', profilePicture: '', email: '', phone: '', location: '', socialProfiles: [] }) : (hasBasicInfo ? resumeData.basicInfo : sampleData.basicInfo),
      education: isTemplateInUse ? (resumeData.education || { university: '', graduationYear: '', degree: '', major: '', gpax: '' }) : (resumeData.education || sampleData.education),
      professionalSummary: isTemplateInUse ? (resumeData.professionalSummary || { description: '', skills: [] }) : (hasSummary ? resumeData.professionalSummary : sampleData.professionalSummary),
      experiences: isTemplateInUse ? (resumeData.experiences || []) : (hasExperiences ? resumeData.experiences : sampleData.experiences),
      certifications: isTemplateInUse ? (resumeData.certifications || []) : (resumeData.certifications && resumeData.certifications.length > 0 ? resumeData.certifications : sampleData.certifications),
      languages: isTemplateInUse ? (resumeData.languages || []) : (resumeData.languages && resumeData.languages.length > 0 ? resumeData.languages : []),
      awards: isTemplateInUse ? (resumeData.awards || []) : (resumeData.awards && resumeData.awards.length > 0 ? resumeData.awards : []),
      interests: isTemplateInUse ? (resumeData.interests || []) : (resumeData.interests && resumeData.interests.length > 0 ? resumeData.interests : []),
    };
  }
  // Ensure data fields default to safe types to avoid runtime .map on undefined
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
    university: '',
    graduationYear: '',
    degree: '',
    major: '',
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
  data.awards = (data as any).awards || [];
  data.interests = (data as any).interests || [];
  data = normalizeTemplateData(data);

  // เพิ่มสีใหม่ให้เลือกดูโดดเด่นขึ้น
  const colorOptions = [
    '#1e40af', // Blue
    '#059669', // Green
    '#dc2626', // Red
    '#7c3aed', // Purple
    '#7c8b7e', // Muted Green
    '#26332d', // Dark Green
    '#f59e42', // Orange
    '#eab308', // Yellow
  ];

  const selectedColor = (resumeData && resumeData.templateColor) ? resumeData.templateColor : '#7c8b7e';
  const colors = getColorVariants(selectedColor);

  const skills = (data.professionalSummary && data.professionalSummary.skills && data.professionalSummary.skills.length > 0)
    ? data.professionalSummary.skills
    : sampleData.professionalSummary.skills;

  const certifications = data.certifications || sampleData.certifications;

  const headingFont = resumeData.headingFont || 'Inter, Poppins, sans-serif';
  const bodyFont = resumeData.bodyFont || 'Inter, Poppins, sans-serif';
  const fmtFont = (f: string, fallback = 'sans-serif') => {
    if (!f) return fallback;
    if (f.includes(',')) return f;
    return f.includes(' ') ? `"${f}", ${fallback}` : `${f}, ${fallback}`;
  };

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
      degree: data.education?.degree || '',
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
  const profileBorder = 'none';
  const profileShadow = profileShape === 'none' ? 'none' : '0 3px 8px rgba(44,62,80,0.10)';
  const profileObjectFit = profileShape === 'none' ? 'contain' : 'cover';

  return (
    <>
      <style>{responsiveStyles}</style>

      <div className="elegant-resume-root" style={{
        display: 'flex',
        flexDirection: 'row',
        background: '#fff',
        borderRadius: 0,
        boxShadow: `0 2px 16px ${hexToRgba(colors.primary, 0.07)}`,
        fontFamily: fmtFont(bodyFont),
        color: colors.sidebar,
        minHeight: '100vh',
        height: 'auto',
        width: '100%',
        maxWidth: '100%',
        margin: 0,
        overflow: 'hidden',
        fontSize: 13,
        padding: 0,
        boxSizing: 'border-box',
      }}>
      {/* Sidebar */}
      <aside className="elegant-resume-sidebar" style={{
        background: colors.primary,
        width: 220,
        minWidth: 180,
        maxWidth: 240,
        padding: '18px 10px 18px 10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        borderRight: `2px solid ${colors.secondary}`,
        height: '100vh',
        maxHeight: '100vh',
        overflowY: 'auto',
        boxSizing: 'border-box',
        color: '#fff',
        fontFamily: fmtFont(bodyFont),
      }}>
        {/* Profile Picture */}
        <div {...getEditableSectionProps('photo')} style={{ ...getEditableSectionProps('photo').style, width: 120, height: 120, borderRadius: profileRadius, overflow: 'hidden', marginBottom: 18, border: profileBorder, boxShadow: profileShadow, cursor: onEditSection ? 'pointer' : 'default' }}>
          {data.basicInfo.profilePicture ? (
            <img className="elegant-resume-profile" src={data.basicInfo.profilePicture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: profileObjectFit }} />
          ) : (
            <div className="elegant-resume-profile" style={{ width: '100%', height: '100%', background: colors.light, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" stroke="#bfc6d1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            </div>
          )}
        </div>
        {/* Name & Title */}
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <h1 style={{ fontSize: 22, margin: 0, color: '#fff', fontWeight: 900, letterSpacing: 1, fontFamily: fmtFont(headingFont) }}>{data.basicInfo.fullName}</h1>
          <div style={{
            fontSize: 14,
            fontWeight: 700,
            color: '#fff',
            marginTop: 7,
            letterSpacing: 0.6,
            background: 'transparent',
            borderRadius: 0,
            padding: 0,
            boxShadow: 'none',
            display: 'inline-block',
            fontFamily: fmtFont(headingFont)
          }}>{data.basicInfo.professionalTitle}</div>
        </div>
        {/* Contact Info */}
        <div {...getEditableSectionProps('contact')} style={{ ...getEditableSectionProps('contact').style, width: '100%', marginBottom: 6 }}>
          <div style={{ ...getHeadingLockStyle('contact'), fontSize: 10, fontWeight: 700, marginBottom: 6, letterSpacing: 1, color: '#fff' }}>Contact</div>
          <div style={{ borderBottom: `1px solid ${hexToRgba(colors.light, 0.25)}`, marginBottom: 6 }} />
          {shouldShow(data.basicInfo) && (
            <>
              <div style={{ fontSize: 9, marginBottom: 2, display: 'flex', alignItems: 'center', gap: 4, color: '#fff' }}>
                <span style={{ display: 'inline-block', width: 15, color: '#fff' }}>
                  {/* Phone icon */}
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ display: 'block' }} xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.11-.21c1.21.49 2.53.76 3.88.76a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.07 21 3 13.93 3 5a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.35.27 2.67.76 3.88a1 1 0 0 1-.21 1.11l-2.2 2.2z" stroke="#fff" strokeWidth="2" fill="none"/>
                  </svg>
                </span>
                <span style={{ color: '#fff', fontWeight: 700 }}>{data.basicInfo.phone}</span>
              </div>
              <div style={{ fontSize: 9, marginBottom: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ display: 'inline-block', width: 15, color: '#fff' }}>
                  {/* Email icon */}
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ display: 'block' }} xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="4" width="20" height="16" rx="2" stroke="#fff" strokeWidth="2" fill="none"/>
                    <path d="M22 6.5l-10 7L2 6.5" stroke="#fff" strokeWidth="2" fill="none"/>
                  </svg>
                </span>
                <span style={{ color: '#fff', fontWeight: 700 }}>{data.basicInfo.email}</span>
              </div>
              <div style={{ fontSize: 9, marginBottom: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ display: 'inline-block', width: 15, color: '#fff' }}>
                  {/* Location icon */}
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ display: 'block' }} xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.657 16.657A8 8 0 1 0 7.05 6.05a8 8 0 0 0 10.607 10.607z" stroke="#fff" strokeWidth="2" fill="none"/>
                    <circle cx="12" cy="12" r="3" stroke="#fff" strokeWidth="2" fill="none"/>
                  </svg>
                </span>
                <span style={{ color: '#fff', fontWeight: 700 }}>{data.basicInfo.location}</span>
              </div>
              <div style={{ borderBottom: `1px solid ${hexToRgba(colors.light, 0.25)}`, margin: '6px 0' }} />
              {/* Social Profiles */}
              {shouldShow(data.basicInfo?.socialProfiles?.length) && (
                <div style={{ marginTop: 2 }}>
                  {data.basicInfo.socialProfiles.map((profile: any, idx: number) => {
                    let iconSvg = null;
                    // Use modern, consistent icons (all using colors.light)
                    if (profile.platform === 'github') {
                      iconSvg = (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ display: 'block' }} xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.48 2.87 8.28 6.84 9.63.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.1-1.5-1.1-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05A9.38 9.38 0 0 1 12 6.84c.85.004 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" fill="#fff"/>
                        </svg>
                      );
                    } else if (profile.platform === 'linkedin') {
                      iconSvg = (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ display: 'block' }} xmlns="http://www.w3.org/2000/svg">
                          <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 11.28h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.88v1.36h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v5.59z" fill="#fff"/>
                        </svg>
                      );
                    } else if (profile.platform === 'portfolio') {
                      iconSvg = (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ display: 'block' }} xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="2" fill="none"/>
                          <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" stroke="#fff" strokeWidth="2" fill="none"/>
                        </svg>
                      );
                    } else {
                      iconSvg = (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ display: 'block' }} xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="2" fill="none"/>
                        </svg>
                      );
                    }
                    return (
                      <div key={profile.platform + profile.username + idx} style={{ fontSize: 9, color: '#fff', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 1, fontWeight: 700 }}>
                        <span style={{ display: 'inline-block', width: 17, textAlign: 'center', color: '#fff' }}>{iconSvg}</span>
                        <span style={{ color: '#fff', fontSize: 10 }}>{profile.username}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
        {/* Skills (Key Skills) */}
        <div {...getEditableSectionProps('skills')} style={{ ...getEditableSectionProps('skills').style, width: '100%', marginBottom: 4 }}>
          <div style={{ ...getHeadingLockStyle('skills'), fontWeight: 700, color: '#fff', marginBottom: 3, fontSize: 10, letterSpacing: 1, textTransform: 'capitalize' }}>Skills</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {shouldShow(skills?.length) && (
              (skills && skills.length > 0) ? (
                skills.map((skill: any, idx: number) => (
                  <span key={idx} style={{
                    color: '#fff',
                    background: hexToRgba(colors.secondary, 0.18),
                    fontSize: 9,
                    fontWeight: 600,
                    borderRadius: 12,
                    padding: '3px 10px',
                    marginBottom: 2,
                    letterSpacing: 0.2,
                    display: 'inline-block',
                  }}>{skill}</span>
                ))
              ) : (
                <span style={{ color: '#fff', fontSize: 9 }}>No skills added</span>
              )
            )}
          </div>
        </div>
        {/* Additional Information (Certifications / Languages / Awards / Interests) */}
        <div {...getEditableSectionProps('additional')} style={{ ...getEditableSectionProps('additional').style, width: '100%', marginBottom: 8 }}>
          {(() => {
            const additional = {
              certifications: certifications || [],
              languages: data.languages || [],
              awards: (data as any).awards || [],
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
              <>
                <div style={{ ...getHeadingLockStyle('additional'), fontWeight: 700, color: '#fff', marginBottom: 6, fontSize: 10, letterSpacing: 1, textTransform: 'capitalize' }}>{headerTitle}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {presentTypes.map((type) => (
                    <div key={type}>
                      {presentTypes.length > 1 && (
                        <div style={{ fontSize: 8, fontWeight: 700, color: colors.accent, marginBottom: 3, textTransform: 'capitalize', letterSpacing: 0.5 }}>{titleMap[type]}</div>
                      )}
                      {type === 'certifications' && (additional.certifications || []).map((cert: any) => (
                        <div
                          key={cert.name}
                          style={{
                            background: colors.secondary,
                            borderRadius: 8,
                            padding: '6px 8px',
                            display: 'flex',
                            flexDirection: 'column',
                            fontSize: 9,
                            color: '#fff',
                            fontWeight: 600,
                            marginBottom: 2,
                          }}>
                          <span>{cert.name}</span>
                          <span style={{ fontSize: 8, color: colors.accent }}>{(cert.org || cert.issuer || '')} {cert.year ? `— ${cert.year}` : ''}</span>
                        </div>
                      ))}
                      {type === 'languages' && (additional.languages || []).map((l: any, idx: number) => (
                        <div key={idx} style={{ fontSize: 9, color: '#fff', marginBottom: 2 }}>{typeof l === 'string' ? l : l.name || ''}{typeof l !== 'string' && l.level ? ` (${l.level})` : ''}</div>
                      ))}
                      {type === 'awards' && (additional.awards || []).map((a: any, idx: number) => (
                        <div key={idx} style={{ fontSize: 9, color: '#fff', marginBottom: 2 }}>
                          <div style={{ fontWeight: 700 }}>{a.name || a.title || ''}</div>
                          <div style={{ fontSize: 9, color: colors.accent }}>{a.issuer || a.org || ''} {a.year ? `— ${a.year}` : ''}</div>
                        </div>
                      ))}
                      {type === 'interests' && (additional.interests || []).map((it: any, idx: number) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <span style={{ width: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                            <InterestIcon name={typeof it === 'string' ? it : (it.name || '')} size={14} color="#fff" />
                          </span>
                          <span style={{ fontSize: 9, color: '#fff' }}>{typeof it === 'string' ? it : it.name || ''}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </div>
        {/* Membership */}

      </aside>
      {/* Main Content */}
          <main className="elegant-resume-main" style={{
        flex: 1,
        padding: '12px 8px',
        background: '#fff', // พื้นหลังขวา ขาวล้วน
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        minHeight: 0,
        boxSizing: 'border-box',
        overflow: 'auto',
        fontSize: 10,
        maxWidth: 540,
        margin: 0,
        color: colors.sidebar,
            fontFamily: bodyFont,
      }}>
        {/* Professional Summary */}
        <section {...getEditableSectionProps('summary')} style={{ ...getEditableSectionProps('summary').style, marginBottom: 8 }}>
          <div style={{
            ...getHeadingLockStyle('summary'),
            fontSize: 13,
            color: colors.primary,
            fontWeight: 800,
            marginBottom: 2,
            letterSpacing: 0.3,
            textTransform: 'capitalize',
            background: colors.light,
            borderRadius: 6,
            padding: '4px 10px',
            display: 'inline-block',
          }}>Professional summary</div>
          {shouldShow(data.professionalSummary?.description) && (
            <div style={{
              fontSize: 10,
              color: '#232323',
              background: '#f7fafc',
              borderRadius: 6,
              padding: '8px 10px',
              boxShadow: `0 1px 4px ${hexToRgba(colors.primary, 0.06)}`,
              maxWidth: '100%',
              wordBreak: 'break-word',
              overflowWrap: 'anywhere',
              border: `1px solid ${hexToRgba(colors.primary, 0.08)}`,
              marginBottom: 8,
            }}>
              {data.professionalSummary.description}
            </div>
          )}
        </section>
        {/* Education */}
        <section {...getEditableSectionProps('education')} style={{ ...getEditableSectionProps('education').style, marginBottom: 8 }}>
          <div style={{
            ...getHeadingLockStyle('education'),
            fontSize: 13,
            color: colors.primary,
            fontWeight: 800,
            marginBottom: 2,
            letterSpacing: 0.3,
            textTransform: 'capitalize',
            background: colors.light,
            borderRadius: 6,
            padding: '4px 10px',
            display: 'inline-block',
          }}>Education</div>
          {educationItems.map((item: any, idx: number) => (
            <div key={idx} style={{
              background: '#f7fafc',
              borderRadius: 6,
              padding: '6px 10px',
              marginBottom: 0,
              marginTop: idx === 0 ? 0 : 6,
              boxShadow: `0 1px 4px ${hexToRgba(colors.primary, 0.08)}`,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              color: '#232323',
              border: `1px solid ${hexToRgba(colors.primary, 0.08)}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: '#232323', fontSize: 11 }}>{item.university}</div>
                  {shouldShow(item.degree) && (
                    <div style={{ fontSize: 9, fontWeight: 600, color: '#232323' }}>{item.degree}</div>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                  {shouldShow(item.graduationYear) && (
                    <span style={{ color: '#232323', fontSize: 9, fontWeight: 700, whiteSpace: 'nowrap' }}>{item.graduationYear}</span>
                  )}
                  {shouldShow(item.gpax) && (
                    <span style={{ color: '#232323', fontSize: 9, fontWeight: 700, whiteSpace: 'nowrap' }}>GPAX: {item.gpax}</span>
                  )}
                </div>
              </div>
              {shouldShow(item.major) && (
                <div style={{ fontSize: 10, fontWeight: 600, color: '#232323' }}>{item.major}</div>
              )}
            </div>
          ))}
        </section>
        {/* Experience */}
        <section {...getEditableSectionProps('experience')} style={{ ...getEditableSectionProps('experience').style }}>
          <div style={{
            ...getHeadingLockStyle('experience'),
            fontSize: 13,
            color: colors.primary,
            fontWeight: 800,
            marginBottom: 2,
            letterSpacing: 0.3,
            textTransform: 'capitalize',
            background: colors.light,
            borderRadius: 6,
            padding: '4px 10px',
            display: 'inline-block',
          }}>Experience</div>
            {shouldShow(data.experiences?.length) && data.experiences.map((exp: any) => (
            <div key={exp.id} style={{
              background: '#f7fafc',
              borderRadius: 6,
              padding: '6px 7px',
              marginBottom: 2,
              boxShadow: `0 1px 4px ${hexToRgba(colors.primary, 0.08)}`,
              maxWidth: '100%',
              wordBreak: 'break-word',
              overflowWrap: 'anywhere',
              border: `1px solid ${hexToRgba(colors.primary, 0.08)}`,
              color: '#232323',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 0 }}>
                <div style={{ fontWeight: 700, color: colors.primary, fontSize: 11, maxWidth: '70%', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{exp.title}</div>
                <span style={{ color: colors.primary, fontSize: 10, fontWeight: 700, maxWidth: '28%', wordBreak: 'break-word', overflowWrap: 'anywhere', textAlign: 'right' }}>{(() => {
                  const endRaw = String(exp.endDate || '').trim();
                  const startRaw = String(exp.startDate || '').trim();
                  const endYearMatch = endRaw.match(/(19|20)\d{2}/);
                  if (endYearMatch) return endYearMatch[0];
                  const startYearMatch = startRaw.match(/(19|20)\d{2}/);
                  return startYearMatch ? startYearMatch[0] : '';
                })()}</span>
              </div>
              <div style={{ color: colors.accent, fontSize: 10.5, marginBottom: 0, maxWidth: '100%', wordBreak: 'break-word', overflowWrap: 'anywhere', fontWeight: 600 }}>{exp.organization}</div>
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
                  <div style={{ fontSize: 10, color: '#232323', marginBottom: 0, maxWidth: '100%', wordBreak: 'break-word', overflowWrap: 'anywhere', lineHeight: 1.6 }}>{text}</div>
                ) : null;
              })()}
            </div>
          ))}
        </section>
        {/* Additional Information is displayed in the sidebar to avoid duplication */}
      </main>
      </div>
    </>
  );
};

export default ElegantProfessionalTemplate;
