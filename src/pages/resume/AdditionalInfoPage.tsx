import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Navbar } from '../../components/Navbar';
import { useResume, Certification, Language, Award } from '../../contexts/ResumeContext';
import ResumePreview from '../../components/resume/ResumePreview';
import InterestIcon from '../../components/icons/InterestIcon';
import { ArrowLeft, Plus, X, Award as AwardIcon, Globe, BadgeCheck, Sparkles } from 'lucide-react';
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

const RAW_API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_BASE = RAW_API_BASE.replace(/\/$/, '').endsWith('/api')
  ? RAW_API_BASE.replace(/\/$/, '')
  : `${RAW_API_BASE.replace(/\/$/, '')}/api`;

const languageLevels = [
  'Native',
  'Fluent',
  'Professional',
  'Intermediate',
  'Basic',
];

type SectionType = 'certifications' | 'languages' | 'awards' | 'interests';

const sectionOptions: { key: SectionType; label: string; icon: React.ReactNode; description: string }[] = [
  { key: 'certifications', label: 'Certifications / Courses', icon: <BadgeCheck size={20} />, description: 'Courses and certifications you have completed' },
  { key: 'languages', label: 'Languages', icon: <Globe size={20} />, description: 'Languages you speak' },
  { key: 'awards', label: 'Awards / Achievements', icon: <AwardIcon size={20} />, description: 'Awards and accomplishments' },
  { key: 'interests', label: 'Interests / Hobbies', icon: <Sparkles size={20} />, description: 'Hobbies or personal interests' },
];

export default function AdditionalInfoPage() {
  const navigate = useNavigate();
  const { resumeData, updateCertifications, updateLanguages, updateAwards, updateInterests } = useResume();
  const [isLoadingAI, setIsLoadingAI] = React.useState(false);
  const [aiProgressFrame, setAiProgressFrame] = React.useState(0);
  const [aiStatusLabel, setAiStatusLabel] = React.useState('');
  const awardTypingRefs = React.useRef<Record<number, number>>({});

  // Determine which sections already have data
  const initialActive = new Set<SectionType>();
  if (resumeData.certifications && resumeData.certifications.length > 0) initialActive.add('certifications');
  if (resumeData.languages && resumeData.languages.length > 0) initialActive.add('languages');
  if (resumeData.awards && resumeData.awards.length > 0) initialActive.add('awards');
  if (resumeData.interests && resumeData.interests.length > 0) initialActive.add('interests');

  const [activeSection, setActiveSection] = useState<SectionType | null>(
    initialActive.size > 0 ? [...initialActive][0] : null
  );

  const [certifications, setCertifications] = useState<Certification[]>(
    resumeData.certifications || []
  );
  const [languages, setLanguages] = useState<Language[]>(
    resumeData.languages || []
  );
  const [awards, setAwards] = useState<Award[]>(
    resumeData.awards || []
  );
  const [interests, setInterests] = useState<string[]>(
    resumeData.interests || []
  );
  const [interestInput, setInterestInput] = useState('');

  React.useEffect(() => {
    if (!resumeData.basicInfo) {
      navigate('/resume/basic-info');
    }
  }, [resumeData.basicInfo, navigate]);

  // Auto-save all sections in real-time
  useEffect(() => {
    const timer = setTimeout(() => {
      // Keep draft rows in local UI state, but only persist meaningful values
      // to shared resume state to avoid preview crashes from empty object rows.
      const persistedCertifications = certifications.filter(
        (c) => Boolean(c.name?.trim())
      );
      const persistedLanguages = languages.filter(
        (l) => Boolean(l.name?.trim() || l.level?.trim())
      );
      const persistedAwards = awards.filter(
        (a) => Boolean(a.title?.trim())
      );
      const persistedInterests = interests
        .map((i) => i.trim())
        .filter(Boolean);

      updateCertifications(persistedCertifications);
      updateLanguages(persistedLanguages);
      updateAwards(persistedAwards);
      updateInterests(persistedInterests);
    }, 500);
    return () => clearTimeout(timer);
  }, [certifications, languages, awards, interests, updateCertifications, updateLanguages, updateAwards, updateInterests]);

  const toggleSection = (key: SectionType) => {
    setActiveSection(prev => prev === key ? null : key);
  };

  const delay = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

  const appendCertificationsAnimated = async (items: Certification[]) => {
    for (const item of items) {
      setCertifications((prev) => [...prev, item]);
      await delay(110);
    }
  };

  const appendLanguagesAnimated = async (items: Language[]) => {
    for (const item of items) {
      setLanguages((prev) => [...prev, item]);
      await delay(110);
    }
  };

  const typeAwardTitle = async (index: number, fullText: string) => {
    const sanitized = fullText || '';
    if (awardTypingRefs.current[index]) {
      window.clearInterval(awardTypingRefs.current[index]);
      delete awardTypingRefs.current[index];
    }

    updateAwardItem(index, 'title', '');
    await new Promise<void>((resolve) => {
      if (!sanitized) {
        resolve();
        return;
      }

      let pointer = 0;
      const step = sanitized.length > 250 ? 5 : 3;
      const timer = window.setInterval(() => {
        pointer = Math.min(pointer + step, sanitized.length);
        updateAwardItem(index, 'title', sanitized.slice(0, pointer));

        if (pointer >= sanitized.length) {
          window.clearInterval(timer);
          delete awardTypingRefs.current[index];
          resolve();
        }
      }, 20);

      awardTypingRefs.current[index] = timer;
    });
  };

  // AI suggestion handlers
  const handleAISuggestCertifications = async () => {
    setIsLoadingAI(true);
    setAiStatusLabel('AI กำลังแนะนำ Certifications');
    try {
      const response = await fetch(`${API_BASE}/resume-ai/suggest-certifications`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          profession: resumeData.basicInfo?.professionalTitle,
          skills: resumeData.professionalSummary?.skills,
          yearsOfExperience: resumeData.professionalSummary?.experience
        })
      });

      if (!response.ok) throw new Error('Failed to suggest certifications');
      const data = await response.json();
      const nextCerts = Array.isArray(data.certifications) ? data.certifications : [];
      await appendCertificationsAnimated(nextCerts);
    } catch (error) {
      alert('Failed to get certification suggestions');
    } finally {
      setIsLoadingAI(false);
      setAiStatusLabel('');
    }
  };

  const handleAISuggestLanguages = async () => {
    setIsLoadingAI(true);
    setAiStatusLabel('AI กำลังแนะนำ Languages');
    try {
      const response = await fetch(`${API_BASE}/resume-ai/suggest-languages`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          profession: resumeData.basicInfo?.professionalTitle,
          location: resumeData.basicInfo?.location,
          yearsOfExperience: resumeData.professionalSummary?.experience
        })
      });

      if (!response.ok) throw new Error('Failed to suggest languages');
      const data = await response.json();
      const newLangs = data.languages.map((lang: string) => ({ name: lang, level: 'Not specified' }));
      await appendLanguagesAnimated(newLangs);
    } catch (error) {
      alert('Failed to get language suggestions');
    } finally {
      setIsLoadingAI(false);
      setAiStatusLabel('');
    }
  };

  const handleAIImproveAward = async (index: number) => {
    const award = awards[index];
    if (!award.title.trim()) {
      alert('Please fill in the award title first');
      return;
    }

    setIsLoadingAI(true);
    setAiStatusLabel('AI กำลังปรับข้อความ Award');
    try {
      const response = await fetch(`${API_BASE}/resume-ai/improve-achievement`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          achievement: award.title,
          profession: resumeData.basicInfo?.professionalTitle
        })
      });

      if (!response.ok) throw new Error('Failed to improve award');
      const data = await response.json();
      await typeAwardTitle(index, data.improvedAchievement || '');
    } catch (error) {
      alert('Failed to improve award description');
    } finally {
      setIsLoadingAI(false);
      setAiStatusLabel('');
    }
  };

  useEffect(() => {
    if (!isLoadingAI) {
      setAiProgressFrame(0);
      return;
    }

    const timer = window.setInterval(() => {
      setAiProgressFrame((prev) => (prev + 1) % 4);
    }, 220);

    return () => {
      window.clearInterval(timer);
    };
  }, [isLoadingAI]);

  useEffect(() => {
    return () => {
      Object.values(awardTypingRefs.current).forEach((timer) => window.clearInterval(timer));
      awardTypingRefs.current = {};
    };
  }, []);
  const interestSuggestions = [
    'ฟุตบอล', 'แบดมินตัน', 'บาสเกตบอล', 'เทนนิส', 'วิ่ง', 'ปั่นจักรยาน', 'ว่ายน้ำ', 'ถ่ายภาพ', 'กีตาร์', 'เล่นกีตาร์', 'ดนตรี', 'ร้องเพลง',
    'วาดรูป', 'ภาพประกอบ', 'การ์ตูน', 'แอนิเมชัน', 'อ่านหนังสือ', 'เขียนหนังสือ', 'เกม', 'อีสปอร์ต', 'ท่องเที่ยว', 'แบ็กแพ็ก', 'คาเฟ่ฮอปปิง',
    'โยคะ', 'ฟิตเนส', 'ยกน้ำหนัก', 'เวทเทรนนิง', 'มวย', 'มวยไทย', 'มวยสากล', 'วอลเลย์บอล', 'เทควันโด', 'มวยปล้ำ', 'กอล์ฟ', 'ปิงปอง', 'เทเบิลเทนนิส',
    'สเก็ตบอร์ด', 'สกู๊ตเตอร์', 'ปีนเขา', 'ปีนผา', 'ดำน้ำ', 'พายเรือ', 'ไตรกีฬา', 'วิ่งมาราธอน', 'เดินป่า', 'แคมป์ปิ้ง', 'ตกปลา', 'กีฬา',
    'ทำอาหาร', 'ทำขนม', 'เบเกอรี่', 'บาร์บีคิว', 'ชิมอาหาร', 'ทำสวน', 'ปลูกต้นไม้', 'เกษตร', 'งานช่าง', 'DIY', 'งานไม้', 'เย็บปัก', 'งานฝีมือ',
    'ถ่ายวิดีโอ', 'ตัดต่อวิดีโอ', 'พอดแคสต์', 'บล็อก', 'บล็อกการเดินทาง', 'ออกแบบ', 'UX', 'UI', 'วาดดิจิทัล', 'ดนตรีคลาสสิค', 'ดนตรีสากล',
    'การแสดง', 'เต้น', 'บัลเล่ต์', 'ฮิปฮอป', 'ร้องเพลงประสานเสียง', 'คีตกวี', 'กีตาร์เบส', 'เปียโน', 'กลอง', 'ดนตรีอิเล็กทรอนิกส์',
    'เขียนโปรแกรม', 'โอเพ่นซอร์ส', 'แฮกกาธอน', 'คอมพิวเตอร์', 'ฮาร์ดแวร์', 'อิเล็กทรอนิกส์', 'หุ่นยนต์', 'AI', 'ข้อมูล',
    'อาสาสมัคร', 'การกุศล', 'ประชาสังคม', 'จิตอาสา', 'สังคมสงเคราะห์'
  ];

  const filteredSuggestions = interestInput.trim()
    ? interestSuggestions.filter(s => s.toLowerCase().includes(interestInput.trim().toLowerCase()) && !interests.includes(s))
    : interestSuggestions.filter(s => !interests.includes(s));

  // Certification handlers
  const addCertification = () => {
    setCertifications([...certifications, { name: '', issuer: '', year: '' }]);
  };
  const updateCert = (index: number, field: keyof Certification, value: string) => {
    const updated = [...certifications];
    updated[index] = { ...updated[index], [field]: value };
    setCertifications(updated);
  };
  const removeCert = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  // Language handlers
  const addLanguage = () => {
    setLanguages([...languages, { name: '', level: '' }]);
  };
  const updateLang = (index: number, field: keyof Language, value: string) => {
    const updated = [...languages];
    updated[index] = { ...updated[index], [field]: value };
    setLanguages(updated);
  };
  const removeLang = (index: number) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  // Award handlers
  const addAward = () => {
    setAwards([...awards, { title: '', issuer: '', year: '' }]);
  };
  const updateAwardItem = (index: number, field: keyof Award, value: string) => {
    const updated = [...awards];
    updated[index] = { ...updated[index], [field]: value };
    setAwards(updated);
  };
  const removeAward = (index: number) => {
    setAwards(awards.filter((_, i) => i !== index));
  };

  // Interest handlers
  const addInterest = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && interestInput.trim()) {
      e.preventDefault();
      if (!interests.includes(interestInput.trim())) {
        setInterests([...interests, interestInput.trim()]);
      }
      setInterestInput('');
    }
  };
  const removeInterest = (index: number) => {
    setInterests(interests.filter((_, i) => i !== index));
  };

  const addInterestByValue = (value: string) => {
    const v = value.trim();
    if (!v) return;
    if (!interests.includes(v)) setInterests([...interests, v]);
    setInterestInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validCerts = activeSection === 'certifications' ? certifications.filter(c => c.name.trim()) : [];
    const validLangs = activeSection === 'languages' ? languages.filter(l => l.name.trim()) : [];
    const validAwards = activeSection === 'awards' ? awards.filter(a => a.title.trim()) : [];
    let validInterests = interests;
    if (activeSection === 'interests' && interestInput.trim()) {
      // Add the current input to the array if not duplicate
      if (!interests.includes(interestInput.trim())) {
        validInterests = [...interests, interestInput.trim()];
      }
    }
    validInterests = activeSection === 'interests' ? validInterests : [];
    // Only update the section that the user is actively editing to avoid
    // clearing or overwriting other sections unintentionally.
    if (activeSection === 'certifications') updateCertifications(validCerts);
    if (activeSection === 'languages') updateLanguages(validLangs);
    if (activeSection === 'awards') updateAwards(validAwards);
    if (activeSection === 'interests') updateInterests(validInterests);
    navigate('/resume/preview', { state: { showExample: false } });
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <button
                  onClick={() => navigate('/resume/experience-stack')}
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
                  <span>Back to Experience Stack</span>
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

              <h2 className={styles.formTitle}>Additional Information</h2>
              <p style={{ color: 'rgb(107, 114, 128)', fontSize: '0.875rem', marginBottom: '1.5rem', marginTop: '-1rem', fontStyle: 'italic' }}>
                Select information categories that help highlight your strengths clearly — you don't need to fill everything, just focus on what's most important
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* â”€â”€â”€ SECTION PICKER â”€â”€â”€ */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {sectionOptions.map((opt) => {
                    const isActive = activeSection === opt.key;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => toggleSection(opt.key)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.75rem',
                          padding: '1rem',
                          backgroundColor: isActive ? 'rgb(249, 250, 251)' : 'white',
                          border: isActive ? '2px solid rgb(209, 213, 219)' : '1.5px solid rgb(224, 227, 231)',
                          borderRadius: '0.75rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          textAlign: 'left',
                        }}
                      >
                        <div style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          width: '2.25rem', height: '2.25rem', borderRadius: '0.5rem', flexShrink: 0,
                          backgroundColor: 'rgb(59, 130, 246)',
                          color: 'white',
                          transition: 'all 0.2s',
                        }}>
                          {opt.icon}
                        </div>
                        <div>
                          <p style={{ margin: 0, fontWeight: '600', fontSize: '0.875rem', color: 'rgb(17, 24, 39)' }}>
                            {opt.label}
                          </p>
                          <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgb(107, 114, 128)', fontStyle: 'italic' }}>
                            {opt.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {isLoadingAI && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: 'rgb(255, 255, 255)',
                      border: '1px solid rgb(229, 231, 235)',
                      borderRadius: '0.7rem',
                      padding: '0.56rem 0.8rem',
                      color: 'rgb(55, 65, 81)',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                    }}
                  >
                    <span aria-hidden="true">{['◐', '◓', '◑', '◒'][aiProgressFrame]}</span>
                    <span>{aiStatusLabel || 'AI กำลังประมวลผล'}...</span>
                  </div>
                )}

                {/* â”€â”€â”€ CERTIFICATIONS FORM â”€â”€â”€ */}
                {activeSection === 'certifications' && (
                  <div style={{
                    padding: '1.5rem',
                    backgroundColor: 'rgb(249, 250, 251)',
                    borderRadius: '0.75rem',
                    border: '1px solid rgb(229, 231, 235)',
                    animation: 'fadeIn 0.2s ease'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <label className={styles.formLabel} style={{ margin: 0 }}>
                        🎓 Certifications / Courses
                      </label>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          type="button"
                          onClick={handleAISuggestCertifications}
                          disabled={isLoadingAI}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                            padding: '0.4rem 0.75rem', fontSize: '0.8125rem', fontWeight: '600',
                            color: 'rgb(17, 24, 39)', backgroundColor: 'white',
                            border: '1px solid rgb(209, 213, 219)', borderRadius: '0.5rem',
                            cursor: isLoadingAI ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                            opacity: isLoadingAI ? 0.6 : 1
                          }}
                        >
                          <Sparkles size={14} /> {isLoadingAI ? 'Suggesting...' : 'AI Suggest'}
                        </button>
                        <button
                          type="button"
                          onClick={addCertification}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                            padding: '0.4rem 0.75rem', fontSize: '0.8125rem', fontWeight: '600',
                            color: 'rgb(17, 24, 39)', backgroundColor: 'white',
                            border: '1px solid rgb(209, 213, 219)', borderRadius: '0.5rem',
                            cursor: 'pointer', transition: 'all 0.2s'
                          }}
                        >
                          <Plus size={14} /> Add
                        </button>
                      </div>
                    </div>
                    {certifications.length === 0 && (
                      <p style={{ color: 'rgb(156, 163, 175)', fontSize: '0.875rem', textAlign: 'center', padding: '1rem 0' }}>
                        No certifications added yet
                      </p>
                    )}
                    {certifications.map((cert, idx) => (
                      <div key={idx} style={{
                        display: 'flex', gap: '0.5rem', alignItems: 'flex-start',
                        marginBottom: '0.75rem', flexWrap: 'wrap'
                      }}>
                        <input
                          type="text"
                          value={cert.name}
                          onChange={(e) => updateCert(idx, 'name', e.target.value)}
                          placeholder="Certification or Course Name"
                          className={styles.formInput}
                          style={{ flex: '2', minWidth: '150px' }}
                        />
                        <input
                          type="text"
                          value={cert.issuer}
                          onChange={(e) => updateCert(idx, 'issuer', e.target.value)}
                          placeholder="หน่วยงานผู้ออก"
                          className={styles.formInput}
                          style={{ flex: '2', minWidth: '150px' }}
                        />
                        <input
                          type="text"
                          value={cert.year}
                          onChange={(e) => updateCert(idx, 'year', e.target.value)}
                          placeholder="Year (e.g., 2022)"
                          className={styles.formInput}
                          style={{ flex: '0.7', minWidth: '70px' }}
                        />
                        <button
                          type="button"
                          onClick={() => removeCert(idx)}
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: '2rem', height: '2.5rem', background: 'none', border: 'none',
                            cursor: 'pointer', color: 'rgb(239, 68, 68)', flexShrink: 0, marginTop: '0.1rem'
                          }}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* â”€â”€â”€ LANGUAGES FORM â”€â”€â”€ */}
                {activeSection === 'languages' && (
                  <div style={{
                    padding: '1.5rem',
                    backgroundColor: 'rgb(249, 250, 251)',
                    borderRadius: '0.75rem',
                    border: '1px solid rgb(229, 231, 235)',
                    animation: 'fadeIn 0.2s ease'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <label className={styles.formLabel} style={{ margin: 0 }}>
                        🌐 Languages
                      </label>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          type="button"
                          onClick={handleAISuggestLanguages}
                          disabled={isLoadingAI}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                            padding: '0.4rem 0.75rem', fontSize: '0.8125rem', fontWeight: '600',
                            color: 'rgb(17, 24, 39)', backgroundColor: 'white',
                            border: '1px solid rgb(209, 213, 219)', borderRadius: '0.5rem',
                            cursor: isLoadingAI ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                            opacity: isLoadingAI ? 0.6 : 1
                          }}
                        >
                          <Sparkles size={14} /> {isLoadingAI ? 'Suggesting...' : 'AI Suggest'}
                        </button>
                        <button
                          type="button"
                          onClick={addLanguage}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                            padding: '0.4rem 0.75rem', fontSize: '0.8125rem', fontWeight: '600',
                            color: 'rgb(17, 24, 39)', backgroundColor: 'white',
                            border: '1px solid rgb(209, 213, 219)', borderRadius: '0.5rem',
                            cursor: 'pointer', transition: 'all 0.2s'
                          }}
                        >
                          <Plus size={14} /> Add
                        </button>
                      </div>
                    </div>
                    {languages.length === 0 && (
                      <p style={{ color: 'rgb(156, 163, 175)', fontSize: '0.875rem', textAlign: 'center', padding: '1rem 0' }}>
                        No languages added yet
                      </p>
                    )}
                    {languages.map((lang, idx) => (
                      <div key={idx} style={{
                        display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem'
                      }}>
                        <input
                          type="text"
                          value={lang.name}
                          onChange={(e) => updateLang(idx, 'name', e.target.value)}
                          placeholder="e.g., Thai, English, Chinese"
                          className={styles.formInput}
                          style={{ flex: '1' }}
                        />
                        <select
                          value={lang.level}
                          onChange={(e) => updateLang(idx, 'level', e.target.value)}
                          className={styles.formInput}
                          style={{ flex: '1', appearance: 'auto' }}
                        >
                          <option value="">Select level</option>
                          {languageLevels.map((lvl) => (
                            <option key={lvl} value={lvl}>{lvl}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => removeLang(idx)}
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: '2rem', height: '2.5rem', background: 'none', border: 'none',
                            cursor: 'pointer', color: 'rgb(239, 68, 68)', flexShrink: 0
                          }}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* â”€â”€â”€ AWARDS FORM â”€â”€â”€ */}
                {activeSection === 'awards' && (
                  <div style={{
                    padding: '1.5rem',
                    backgroundColor: 'rgb(249, 250, 251)',
                    borderRadius: '0.75rem',
                    border: '1px solid rgb(229, 231, 235)',
                    animation: 'fadeIn 0.2s ease'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <label className={styles.formLabel} style={{ margin: 0 }}>
                        🏆 Awards / Achievements
                      </label>
                      <button
                        type="button"
                        onClick={addAward}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                          padding: '0.4rem 0.75rem', fontSize: '0.8125rem', fontWeight: '600',
                          color: 'rgb(17, 24, 39)', backgroundColor: 'white',
                          border: '1px solid rgb(209, 213, 219)', borderRadius: '0.5rem',
                          cursor: 'pointer', transition: 'all 0.2s'
                        }}
                      >
                        <Plus size={14} /> Add
                      </button>
                    </div>
                    {awards.length === 0 && (
                      <p style={{ color: 'rgb(156, 163, 175)', fontSize: '0.875rem', textAlign: 'center', padding: '1rem 0' }}>
                        No awards added yet
                      </p>
                    )}
                    {awards.map((award, idx) => (
                      <div key={idx} style={{
                        display: 'flex', gap: '0.5rem', alignItems: 'flex-start',
                        marginBottom: '0.75rem', flexWrap: 'wrap'
                      }}>
                        <input
                          type="text"
                          value={award.title}
                          onChange={(e) => updateAwardItem(idx, 'title', e.target.value)}
                          placeholder="Award Name"
                          className={styles.formInput}
                          style={{ flex: '2', minWidth: '150px' }}
                        />
                          <input
                            type="text"
                            value={award.issuer}
                            onChange={(e) => updateAwardItem(idx, 'issuer', e.target.value)}
                            placeholder="Awarding Organization"
                            className={styles.formInput}
                            style={{ flex: '2', minWidth: '150px' }}
                          />
                          <input
                            type="text"
                            value={award.year}
                            onChange={(e) => updateAwardItem(idx, 'year', e.target.value)}
                            placeholder="Year (e.g., 2021)"
                            className={styles.formInput}
                            style={{ flex: '0.7', minWidth: '70px' }}
                          />
                        <button
                          type="button"
                          onClick={() => handleAIImproveAward(idx)}
                          disabled={isLoadingAI || !award.title.trim()}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                            padding: '0.4rem 0.75rem', fontSize: '0.8125rem', fontWeight: '600',
                            color: 'rgb(17, 24, 39)', backgroundColor: 'white',
                            border: '1px solid rgb(209, 213, 219)', borderRadius: '0.5rem',
                            cursor: (isLoadingAI || !award.title.trim()) ? 'not-allowed' : 'pointer', 
                            transition: 'all 0.2s',
                            opacity: (isLoadingAI || !award.title.trim()) ? 0.6 : 1,
                            flexShrink: 0,
                            marginTop: '0.1rem'
                          }}
                        >
                          <Sparkles size={14} /> {isLoadingAI ? 'Improving...' : 'Improve'}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeAward(idx)}
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: '2rem', height: '2.5rem', background: 'none', border: 'none',
                            cursor: 'pointer', color: 'rgb(239, 68, 68)', flexShrink: 0, marginTop: '0.1rem'
                          }}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* â”€â”€â”€ INTERESTS FORM â”€â”€â”€ */}
                {activeSection === 'interests' && (
                  <div style={{
                    padding: '1.5rem',
                    backgroundColor: 'rgb(249, 250, 251)',
                    borderRadius: '0.75rem',
                    border: '1px solid rgb(229, 231, 235)',
                    animation: 'fadeIn 0.2s ease'
                  }}>
                    <label className={styles.formLabel}>
                      💡 Interests / Hobbies <span style={{ color: 'rgb(156, 163, 175)', fontWeight: '400', fontSize: '0.8125rem' }}>(Press Enter to add)</span>
                    </label>
                    <input
                      type="text"
                      value={interestInput}
                      onChange={(e) => setInterestInput(e.target.value)}
                      onKeyDown={addInterest}
                      placeholder="e.g., Open Source, Hackathon, Photography"
                      className={styles.formInput}
                    />
                    {filteredSuggestions.length > 0 && (
                      <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {filteredSuggestions.slice(0, 8).map((s, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => addInterestByValue(s)}
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: 8,
                              padding: '0.35rem 0.6rem', background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, cursor: 'pointer', fontSize: '0.9rem'
                            }}
                          >
                            <span style={{ width: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                              <InterestIcon name={s} size={16} color="#c0c0c0" />
                            </span>
                            <span>{s}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    {interests.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                        {interests.map((item, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                              padding: '0.5rem 0.75rem',
                              backgroundColor: 'white', color: 'rgb(55, 65, 81)',
                              border: '1px solid rgb(229, 231, 235)',
                              borderRadius: '9999px', fontSize: '0.875rem', fontWeight: '500'
                            }}
                          >
                            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginRight: 6 }}>
                              <InterestIcon name={item} size={16} color="#c0c0c0" />
                            </span>
                            {item}
                            <button
                              type="button"
                              onClick={() => removeInterest(idx)}
                              style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: 'rgb(107, 114, 128)', padding: '0'
                              }}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between', marginTop: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      // Save and skip â€” go directly to preview
                      const validCerts = activeSection === 'certifications' ? certifications.filter(c => c.name.trim()) : [];
                      const validLangs = activeSection === 'languages' ? languages.filter(l => l.name.trim()) : [];
                      const validAwards = activeSection === 'awards' ? awards.filter(a => a.title.trim()) : [];
                      let validInterests = interests;
                      if (activeSection === 'interests' && interestInput.trim()) {
                        if (!interests.includes(interestInput.trim())) {
                          validInterests = [...interests, interestInput.trim()];
                        }
                      }
                      validInterests = activeSection === 'interests' ? validInterests : [];
                      if (activeSection === 'certifications') updateCertifications(validCerts);
                      if (activeSection === 'languages') updateLanguages(validLangs);
                      if (activeSection === 'awards') updateAwards(validAwards);
                      if (activeSection === 'interests') updateInterests(validInterests);
                      navigate('/resume/preview', { state: { showExample: false } });
                    }}
                    style={{
                      padding: '0.875rem 1.5rem',
                      backgroundColor: 'rgb(255, 255, 255)',
                      color: 'rgb(17, 24, 39)',
                      border: '1px solid rgb(224, 227, 231)',
                      borderRadius: '0.75rem',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '600',
                      transition: 'all 0.3s',
                      letterSpacing: '0.3px'
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgb(248, 250, 255)';
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgb(59, 130, 246)';
                      (e.currentTarget as HTMLButtonElement).style.color = 'rgb(59, 130, 246)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgb(255, 255, 255)';
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgb(224, 227, 231)';
                      (e.currentTarget as HTMLButtonElement).style.color = 'rgb(17, 24, 39)';
                    }}
                  >
                    Skip
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '0.875rem 1.5rem',
                      backgroundColor: '#000000',
                      color: 'white',
                      border: '1px solid #000000',
                      borderRadius: '0.75rem',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '600',
                      transition: 'all 0.3s',
                      letterSpacing: '0.3px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1a1a1a';
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#000000';
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
                    }}
                  >
                    Finish & Preview
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
