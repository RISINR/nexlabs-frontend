import React from 'react';
import { useResume } from '../../contexts/ResumeContext';
import { sampleData as minimalSampleData } from './MinimalSleekTemplate';
import InterestIcon from '../icons/InterestIcon';
import { normalizeTemplateData } from './templateDataNormalizer';

// Black & White Professional Template
export default function BlackWhiteProfessionalTemplate({
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

  const forceSample = showExample === true;
  const isTemplateInUse = resumeData.selectedTemplate === 'black-white-professional' || resumeData.selectedTemplate === 'black-white-professional-template' || resumeData.selectedTemplate === 'black-white';

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
      resumeData.basicInfo.location?.trim()
    )
  );
  const hasEducationData = Boolean(resumeData.education && (resumeData.education.university || resumeData.education.major || resumeData.education.graduationYear || resumeData.education.gpax));
  const hasExperienceData = resumeData.experiences && resumeData.experiences.length > 0;
  const hasSummaryData = Boolean(resumeData.professionalSummary && (resumeData.professionalSummary.description || (resumeData.professionalSummary.skills && resumeData.professionalSummary.skills.length > 0)));

  let data: any;
  if (forceSample) {
    data = minimalSampleData;
  } else {
    data = {
      basicInfo: isTemplateInUse
        ? (resumeData.basicInfo || { fullName: '', professionalTitle: '', profilePicture: '', email: '', phone: '', location: '', socialProfiles: [] })
        : (hasBasicInfoData ? resumeData.basicInfo : minimalSampleData.basicInfo),
      education: isTemplateInUse
        ? (resumeData.education || { degree: '', major: '', university: '', graduationYear: '', gpax: '', coursework: [] })
        : (hasEducationData ? resumeData.education : minimalSampleData.education),
      experiences: isTemplateInUse ? (resumeData.experiences || []) : (hasExperienceData ? resumeData.experiences : minimalSampleData.experiences),
      professionalSummary: isTemplateInUse ? (resumeData.professionalSummary || { description: '', skills: [] }) : (hasSummaryData ? resumeData.professionalSummary : minimalSampleData.professionalSummary),
      certifications: isTemplateInUse ? (resumeData.certifications || []) : (resumeData.certifications && resumeData.certifications.length > 0 ? resumeData.certifications : minimalSampleData.certifications),
      languages: isTemplateInUse ? ((resumeData as any).languages || []) : [],
      awards: isTemplateInUse ? ((resumeData as any).awards || []) : [],
      interests: isTemplateInUse ? ((resumeData as any).interests || []) : [],
      references: isTemplateInUse ? ((resumeData as any).references || []) : [],
    };
  }

    // Normalize defaults to avoid runtime errors when fields are missing
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
    data.certifications = data.certifications || [];
    data.languages = data.languages || [];
    data.awards = (data as any).awards || [];
    data.interests = (data as any).interests || [];
    data.references = data.references || [];
    data = normalizeTemplateData(data);

  const headingFont = resumeData.headingFont || 'Inter';
  const bodyFont = resumeData.bodyFont || 'Inter';

  const selected = resumeData.templateColor || '#232323';
  const black = selected === '#fff' ? '#232323' : selected;
  const white = '#fff';
  const gray = '#f5f5f5';
  const darkGray = '#444';
  const accent = '#111';
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
  const profileBackground = profileShape === 'none' ? 'transparent' : gray;

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

  const SectionTitle = ({ icon, children, section }: { icon?: React.ReactNode; children: React.ReactNode; section: 'basic' | 'photo' | 'contact' | 'education' | 'summary' | 'experience' | 'additional' | 'skills' }) => (
    <div style={{ zoom: 1 / getSectionZoom(section), transformOrigin: 'left top', display: 'flex', alignItems: 'center', fontWeight: 800, fontSize: 13, letterSpacing: 1, marginBottom: 2, color: black, textTransform: 'uppercase' }}>
      {children}
    </div>
  );

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: gray, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', fontFamily: bodyFont }}>
      <div style={{ width: '100%', maxWidth: '100%', minHeight: '100vh', background: white, borderRadius: 0, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column', overflow: 'hidden', fontSize: 13 }}>
        {/* HEADER (BLACK BAR) */}
        <div style={{ width: '100%', background: black, color: white, display: 'flex', alignItems: 'center', padding: '20px 22px 14px 22px', gap: 18 }}>
          <div {...getEditableSectionProps('photo')} style={{ ...getEditableSectionProps('photo').style, width: 110, height: 110, borderRadius: profileRadius, overflow: 'hidden', background: profileBackground, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: onEditSection ? 'pointer' : 'default' }}>
            {data.basicInfo.profilePicture ? (
              <img src={data.basicInfo.profilePicture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: profileObjectFit }} />
            ) : (
              <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" stroke="#bfc6d1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h1 style={{ fontSize: 26, margin: 0, color: white, fontWeight: 900, letterSpacing: 1, textTransform: 'uppercase', fontFamily: headingFont, lineHeight: 1.1 }}>{data.basicInfo.fullName}</h1>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#e0e0e0', marginTop: 8, letterSpacing: 1 }}>{data.basicInfo.professionalTitle}</div>
          </div>
        </div>

        <div style={{ display: 'flex', flex: 1, background: white, padding: '18px 14px 18px 14px', gap: 18 }}>
          <div style={{ width: 220, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <SectionTitle section="contact">Contact</SectionTitle>
            <div {...getEditableSectionProps('contact')} style={{ ...getEditableSectionProps('contact').style, fontSize: 11, marginBottom: 2 }}>
              {shouldShow(data.basicInfo) && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ width: 20, display: 'inline-block', color: black }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ display: 'block' }} xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.11-.21c1.21.49 2.53.76 3.88.76a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.07 21 3 13.93 3 5a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.35.27 2.67.76 3.88a1 1 0 0 1-.21 1.11l-2.2 2.2z" stroke="currentColor" strokeWidth="2" fill="none"/>
                      </svg>
                    </span>
                    {data.basicInfo.phone}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: 4 }}>
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ width: 20, display: 'inline-block', color: black }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ display: 'block' }} xmlns="http://www.w3.org/2000/svg">
                          <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                          <path d="M22 6.5l-10 7L2 6.5" stroke="currentColor" strokeWidth="2" fill="none"/>
                        </svg>
                      </span>
                      {data.basicInfo.email}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', marginLeft: 0, marginTop: 2 }}>
                      <span style={{ width: 20, display: 'inline-block', color: black }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ display: 'block' }} xmlns="http://www.w3.org/2000/svg">
                          <path d="M17.657 16.657A8 8 0 1 0 7.05 6.05a8 8 0 0 0 10.607 10.607z" stroke="currentColor" strokeWidth="2" fill="none"/>
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
                        </svg>
                      </span>
                      Bangkok, Thailand
                    </span>
                  </div>

                  {shouldShow(data.basicInfo?.socialProfiles?.length) && (
                    <div style={{ marginBottom: 4 }}>
                      {data.basicInfo.socialProfiles.map((profile: any, idx: number) => {
                        let icon = (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ display: 'block', color: black }} xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                          </svg>
                        );
                        let url = '';
                        if (profile.platform === 'github') {
                          icon = (
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ display: 'block', color: black }} xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.48 2.87 8.28 6.84 9.63.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.1-1.5-1.1-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05A9.38 9.38 0 0 1 12 6.84c.85.004 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" fill="currentColor"/>
                            </svg>
                          );
                          url = `https://github.com/${profile.username}`;
                        } else if (profile.platform === 'linkedin') {
                          icon = (
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ display: 'block', color: black }} xmlns="http://www.w3.org/2000/svg">
                              <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 11.28h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.88v1.36h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v5.59z" fill="currentColor"/>
                            </svg>
                          );
                          url = `https://linkedin.com/in/${profile.username}`;
                        } else if (profile.platform === 'portfolio') {
                          icon = (
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ display: 'block', color: black }} xmlns="http://www.w3.org/2000/svg">
                              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                              <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" stroke="currentColor" strokeWidth="2" fill="none"/>
                            </svg>
                          );
                          url = profile.username.startsWith('http') ? profile.username : `https://${profile.username}`;
                        }
                        return (
                          <div key={profile.platform + profile.username} style={{ display: 'flex', alignItems: 'center', marginBottom: 2, color: '#232323' }}>
                            {icon}
                            <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: '#232323', textDecoration: 'none', fontSize: 11, marginLeft: 2, fontFamily: bodyFont }}>
                              {profile.platform.charAt(0).toUpperCase() + profile.platform.slice(1)}{profile.platform !== 'portfolio' && ':'} {profile.username}
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>

            <SectionTitle section="education">Education</SectionTitle>
            {educationItems.length > 0 && (
              <div {...getEditableSectionProps('education')} style={{ ...getEditableSectionProps('education').style, fontSize: 10, marginBottom: 1, lineHeight: 1.3 }}>
                {educationItems.map((item: any, idx: number) => (
                  <div key={idx} style={{ marginBottom: idx === educationItems.length - 1 ? 0 : 5 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {shouldShow(item.university) && (
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                            <span style={{ width: 20, display: 'inline-block', color: black }}>
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ display: 'block' }} xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 3L2 9l10 6 10-6-10-6zm0 13.5V21" stroke="currentColor" strokeWidth="2" fill="none"/>
                              </svg>
                            </span>
                            <span style={{ fontWeight: 700, fontSize: 10 }}>{item.university}</span>
                          </div>
                        )}
                        {shouldShow(item.major) && (
                          <div style={{ fontSize: 9 }}>{item.major}</div>
                        )}
                        {shouldShow(item.gpax) && (
                          <div style={{ color: '#888', fontSize: 9 }}>GPAX: {item.gpax}</div>
                        )}
                      </div>
                      {shouldShow(item.graduationYear) && (
                        <div style={{ color: '#888', fontSize: 9, whiteSpace: 'nowrap', textAlign: 'right', paddingLeft: 8 }}>{item.graduationYear}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <SectionTitle section="skills">Skills</SectionTitle>
            {shouldShow(data.professionalSummary?.skills?.length) && (
              <div {...getEditableSectionProps('skills')} style={{ ...getEditableSectionProps('skills').style, display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 3 }}>
                {data.professionalSummary.skills && data.professionalSummary.skills.length > 0 ? (
                  data.professionalSummary.skills.map((skill: any, idx: number) => (
                    <span key={idx} style={{ color: black, background: white, fontSize: 9, fontWeight: 700, borderRadius: 9, padding: '1px 6px', marginBottom: 1, letterSpacing: 0.1, display: 'inline-block', border: `1px solid ${black}` }}>
                      <span style={{ width: 11, display: 'inline-block', verticalAlign: 'middle', marginRight: 2 }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ display: 'block' }} xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" stroke="currentColor" strokeWidth="2" fill="none"/>
                        </svg>
                      </span>
                      {skill}
                    </span>
                  ))
                ) : (
                  <span style={{ color: black, fontSize: 10 }}>No skills added</span>
                )}
              </div>
            )}

            {(() => {
              const additional = {
                certifications: data.certifications || [],
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
                <div {...getEditableSectionProps('additional')} style={{ ...getEditableSectionProps('additional').style }}>
                  <SectionTitle section="additional">{headerTitle}</SectionTitle>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 2 }}>
                    {presentTypes.map((type) => (
                      <div key={type}>
                        {presentTypes.length > 1 && (
                          <div style={{ fontSize: 8, fontWeight: 700, color: '#333', marginBottom: 2, textTransform: 'capitalize', letterSpacing: 0.5 }}>{titleMap[type]}</div>
                        )}
                        {type === 'certifications' && (additional.certifications || []).map((cert: any, idx: number) => (
                          <div key={(cert.name || cert.title || idx) + idx} style={{ background: white, border: `1px solid ${black}`, borderRadius: 8, padding: '5px 7px', fontSize: 9, color: black, fontWeight: 600, marginBottom: 2 }}>
                            <div>{cert.name || cert.title}</div>
                            <div style={{ fontSize: 8, color: '#666' }}>{cert.org || cert.issuer} {cert.year ? `— ${cert.year}` : ''}</div>
                          </div>
                        ))}
                        {type === 'languages' && (additional.languages || []).map((lang: any, idx: number) => (
                          <div key={idx} style={{ marginBottom: 2, fontSize: 10 }}>{lang.name || lang}{lang.level ? ` (${lang.level})` : ''}</div>
                        ))}
                        {type === 'awards' && (additional.awards || []).map((a: any, idx: number) => (
                          <div key={idx} style={{ marginBottom: 2 }}>
                            <div style={{ fontWeight: 700 }}>{a.name || a.title || ''}</div>
                            <div style={{ color: '#888', fontSize: 10 }}>{a.issuer || a.org || ''} {a.year ? `— ${a.year}` : ''}</div>
                          </div>
                        ))}
                        {type === 'interests' && (additional.interests || []).map((it: any, idx: number) => (
                          <div key={idx} style={{ marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ width: 18, height: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                              <InterestIcon name={typeof it === 'string' ? it : it.name || ''} size={16} color="#9ca3af" />
                            </span>
                            <span style={{ fontSize: 12, color: black }}>{typeof it === 'string' ? it : it.name || ''}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <SectionTitle section="summary" icon={<span style={{ fontSize: 16, fontWeight: 900 }}>●</span>}>About Me</SectionTitle>
            {shouldShow(data.professionalSummary?.description) && (
              <div {...getEditableSectionProps('summary')} style={{ ...getEditableSectionProps('summary').style, fontSize: 11, color: darkGray, marginBottom: 2, marginTop: 0, lineHeight: 1.6 }}>{data.professionalSummary.description}</div>
            )}

            <SectionTitle section="experience" icon={<span style={{ fontSize: 16, fontWeight: 900 }}>●</span>}>Experience</SectionTitle>
            {shouldShow(data.experiences?.length) && (
              <div {...getEditableSectionProps('experience')} style={{ ...getEditableSectionProps('experience').style, fontSize: 11, color: darkGray, marginBottom: 2, marginTop: 0 }}>
                {data.experiences.map((exp: any, idx: number) => (
                  <div key={exp.id || idx} style={{ marginBottom: 12 }}>
                    <div style={{ fontWeight: 800, color: accent, fontSize: 11, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 900 }}>{exp.title}</span>
                        <span style={{ color: '#bbb', fontWeight: 500, fontSize: 9 }}>{(() => {
                          const endRaw = String(exp.endDate || '').trim();
                          const startRaw = String(exp.startDate || '').trim();
                          const endYearMatch = endRaw.match(/(19|20)\d{2}/);
                          if (endYearMatch) return endYearMatch[0];
                          const startYearMatch = startRaw.match(/(19|20)\d{2}/);
                          return startYearMatch ? startYearMatch[0] : '';
                        })()}</span>
                      </div>
                      <div style={{ color: '#888', fontWeight: 600, fontSize: 10 }}>{exp.organization}</div>
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
                      if (!text) return null;
                      const isHighlighted = [
                        'Co-developed an AI-powered career preparation platform for university students.',
                        'Developed a real-time Thai banknote classification system to automate currency sorting.',
                        'Designed a travel assistance application aimed at improving accessibility for senior travelers.',
                      ].some(k => text.includes(k));
                      return isHighlighted ? (
                        <div style={{ marginLeft: 16, marginTop: 2, fontSize: 10, color: darkGray, display: 'flex', alignItems: 'flex-start', lineHeight: 1.6 }}>
                          <span style={{ fontWeight: 'bold', marginRight: 6, flexShrink: 0 }}>&#8226;</span>
                          <span style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>{text}</span>
                        </div>
                      ) : (
                        <div style={{ marginLeft: 0, marginTop: 2, fontSize: 10, color: darkGray, lineHeight: 1.6, wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>{text}</div>
                      );
                    })()}
                  </div>
                ))}
              </div>
            )}

            {/* References section removed per request */}
          </div>
        </div>
      </div>
    </div>
  );
}
