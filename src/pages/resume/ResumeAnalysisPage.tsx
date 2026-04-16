import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Navbar } from '../../components/Navbar';
import styles from './ResumeAnalysisPage.module.css';
import { useResume } from '../../contexts/ResumeContext';
import { CheckCircle2, Circle, ChevronDown, ChevronUp, BookOpen, Zap, Code, CheckSquare, AlertCircle, Trophy, Briefcase } from 'lucide-react';

export default function ResumeAnalysisPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { displayResumeData: contextResumeData } = useResume();
  const returnPath = typeof (location.state as any)?.returnPath === 'string' ? (location.state as any).returnPath : '/resume/preview';
  const returnLabel = typeof (location.state as any)?.returnLabel === 'string' ? (location.state as any).returnLabel : 'กลับหน้าแก้ไข';
  
  // Try to get resume data from sessionStorage (sent from preview), fallback to context
  const [resumeData, setResumeData] = useState(contextResumeData);
  
  useEffect(() => {
    try {
      const storedData = sessionStorage.getItem('nexlabs_analysis_resume_data');
      if (storedData) {
        const parsed = JSON.parse(storedData);
        setResumeData(parsed);
      }
    } catch (error) {
      console.error('Failed to parse resume data from storage:', error);
    }
  }, []);
  
  // State for expanded items
  const [expandedBootcamps, setExpandedBootcamps] = useState<Record<number, boolean>>({});
  const [expandedHackathons, setExpandedHackathons] = useState<Record<number, boolean>>({});
  const [expandedPrograms, setExpandedPrograms] = useState<Record<number, boolean>>({});
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  const toggleBootcamp = (id: number) => {
    setExpandedBootcamps(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleHackathon = (id: number) => {
    setExpandedHackathons(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleProgram = (id: number) => {
    setExpandedPrograms(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      alert(`Skill "${newSkill}" added! Please create or import your resume to save it.`);
      setNewSkill('');
      setShowAddSkillModal(false);
    }
  };

  // Calculate scores
  const educationScore = resumeData.education ? 25 : 0;
  const activityScore = Math.min((resumeData.experiences.length / 2) * 20, 20);
  const skillsScore = resumeData.professionalSummary?.skills.length 
    ? Math.min((resumeData.professionalSummary.skills.length / 5) * 18, 18) 
    : 0;
  const formatScore = 8;
  
  const totalScore = Math.round(educationScore + activityScore + skillsScore + formatScore);
  const maxScore = 100;

  // Skills analysis
  const userSkills = resumeData.professionalSummary?.skills || [];
  const recommendedSkills = [
    'React', 'Figma', 'CSS', 'JavaScript', 'TypeScript', 'Node.js', 
    'Git', 'AWS', 'Docker', 'Python'
  ];
  const missingSkills = recommendedSkills.filter(skill => !userSkills.includes(skill));

  // Completeness checklist
  const checklistItems = [
    { label: 'Contact Information', completed: true },
    { label: 'Education', completed: !!resumeData.education },
    { label: 'Experience (2+)', completed: resumeData.experiences.length >= 2 },
  ];

  // Recommendations with detailed data
  const recommendedBootcamps = [
    {
      id: 1,
      title: 'KBTG Kampus',
      description: 'Comprehensive bootcamp to develop technical fundamentals in modern web development, programming practices, and software architecture.',
      duration: '3-6 months',
      level: 'Beginner to Intermediate',
      tags: ['Backend', 'Frontend', 'DevOps'],
      instructor: 'KBTG Development Team',
      price: 'Free',
      topics: 'Web fundamentals, JavaScript, React, Node.js, Database design',
      registerUrl: 'https://kbtgkampus.kbtg.tech'
    },
    {
      id: 2,
      title: 'Junction Bangkok 2026',
      description: 'Real-world hackathon competition with practical problem-solving challenges and networking opportunities with industry professionals.',
      duration: '24-48 hours',
      level: 'All Levels',
      tags: ['Hackathon', 'Networking'],
      instructor: 'Junction Organizers',
      price: 'Free to enter',
      topics: 'Full-stack development, Problem-solving, Collaboration',
      registerUrl: 'https://junction.tech/bangkok'
    },
    {
      id: 3,
      title: 'Thailand Startup Hackathon',
      description: 'Build innovative startup solutions with creative teammates, mentorship from industry leaders, and potential investment opportunities.',
      duration: 'Variable',
      level: 'Intermediate to Advanced',
      tags: ['Innovation', 'Startup'],
      instructor: 'Startup Thailand',
      price: 'Varies',
      topics: 'Startup development, Pitching, Product design, Business strategy',
      registerUrl: 'https://startuphackathon.th'
    },
    {
      id: 4,
      title: 'RESTFUL API Service Workshop',
      description: 'Learn to design, build, and deploy scalable RESTful APIs in real-world scenarios with hands-on projects and best practices.',
      duration: '2 weeks',
      level: 'Intermediate',
      tags: ['Backend', 'API Design'],
      instructor: 'API Experts',
      price: '2,999 THB',
      topics: 'REST principles, Node.js, Express, Database integration, API security',
      registerUrl: 'https://restapi-workshop.dev'
    }
  ];

  const hackathons = [
    {
      id: 1,
      title: 'Junction Bangkok 2026',
      subtitle: 'All for Sustainability',
      date: '1 February 2026',
      prize: '100,000 THB',
      description: 'Compete to develop innovative tech solutions addressing sustainability challenges. Connect with leading tech companies, investors, and mentors from around the world.',
      participants: '500+',
      theme: 'Sustainability',
      registerUrl: 'https://junctionbangkok.dev/register'
    },
    {
      id: 2,
      title: 'Thailand Startup Hackathon',
      subtitle: 'Build Your Dream',
      date: '15 March 2026',
      prize: '150,000 THB',
      description: 'Build your startup dream with mentorship from leading executives and industry pioneers. Network with investors, receive business guidance, and scale your idea to market.',
      participants: '300+',
      theme: 'Entrepreneurship',
      registerUrl: 'https://thailand-startup-hackathon.com/register'
    }
  ];

  const supportPrograms = [
    {
      id: 1,
      title: 'RESTFUL API Service',
      subtitle: 'Backend Development',
      description: 'Comprehensive program to develop production-ready REST APIs. Learn API design patterns, security practices, authentication, and integration with databases.',
      duration: '6-8 weeks',
      price: 'Free',
      registerUrl: 'https://api-service-program.dev/enroll'
    },
    {
      id: 2,
      title: 'Fintech Innovation Lab',
      subtitle: 'Financial Technology',
      description: 'Build cutting-edge financial technology solutions with blockchain, payment systems, and digital banking. Get mentorship from fintech leaders and pitch to investors.',
      duration: '3 months',
      price: 'Free',
      registerUrl: 'https://fintech-innovation-lab.io/apply'
    }
  ];

  return (
    <div className={styles.root}>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.inner}>
          <button
            type="button"
            onClick={() => navigate(returnPath)}
            style={{
              marginBottom: '1rem',
              border: '1px solid #d1d5db',
              background: '#fff',
              color: '#111827',
              borderRadius: '999px',
              padding: '0.65rem 1rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            ← {returnLabel}
          </button>
          <h1 className={styles.title}>Resume Analysis & Growth Plan</h1>
          <div className={styles.grid}>
            {/* Left Column */}
            <div className={styles.leftColumn}>
              <div className={styles.card}>
                <div className={styles.resumePreview}>
                  <div style={{padding:'1.5rem', height:'100%', display:'flex', flexDirection:'column', justifyContent:'space-between', background:'white'}}>
                    <div>
                      <h3 style={{margin:'0 0 0.5rem 0', fontSize:'16px', fontWeight:700, color:'#1f2937'}}>
                        {resumeData.basicInfo?.fullName || 'Your Name'}
                      </h3>
                      <p style={{margin:'0', fontSize:'12px', color:'#6b7280', lineHeight:1.4}}>
                        Front-end Developer | React Specialist
                      </p>
                    </div>
                    <div>
                      <p style={{margin:'1rem 0 0 0', fontSize:'11px', fontWeight:600, color:'#374151', textTransform:'uppercase'}}>Skills</p>
                      <div style={{display:'flex', gap:'0.5rem', marginTop:'0.5rem', flexWrap:'wrap'}}>
                        {(resumeData.professionalSummary?.skills || []).slice(0, 4).map((skill, i) => (
                          <span key={i} style={{fontSize:'10px', padding:'0.25rem 0.5rem', background:'#eff6ff', color:'#1e40af', borderRadius:'3px'}}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div style={{fontSize:'10px', color:'#9ca3af', marginTop:'1rem', textAlign:'center'}}>
                      Preview - Updated: 15/3/2026
                    </div>
                  </div>
                </div>
              </div>

              <div className={`${styles.card} ${styles.cardPadded}`}>
                <h4 className={styles.sectionHeader}>Quick Actions</h4>
                <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
                  <button className={styles.smallBtn} style={{background:'#f3f4f6', color:'#374151', border:'1px solid #e5e7eb', display:'flex', alignItems:'center', gap:'0.5rem'}}>
                    📥 Download PDF
                  </button>
                  <button className={styles.smallBtn} style={{background:'#f3f4f6', color:'#374151', border:'1px solid #e5e7eb', display:'flex', alignItems:'center', gap:'0.5rem'}}>
                    🔗 Share Link
                  </button>
                </div>
              </div>

              <div className={`${styles.card} ${styles.cardPadded}`}>
                <h4 className={styles.sectionHeader}>Completeness</h4>
                <div style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>
                  {checklistItems.map((item, index) => (
                    <div key={index} style={{
                      padding: '0.5rem',
                      background: item.completed ? '#f5f5f5' : '#fefefe',
                      borderRadius: '6px',
                      borderLeft: '2px solid ' + (item.completed ? '#000' : '#d1d5db'),
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      {item.completed ? (
                        <CheckCircle2 size={14} style={{color:'#000', flexShrink:0}} />
                      ) : (
                        <Circle size={14} style={{color:'#9ca3af', flexShrink:0}} />
                      )}
                      <span style={{
                        color: item.completed ? '#000' : '#666',
                        fontWeight: item.completed ? 500 : 400,
                        fontSize:'12px',
                        flex:1
                      }}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Column */}
            <div className={styles.mainColumn}>
              {/* Score Card */}
              <div className={styles.scoreCard} style={{border:'2px solid #d1d5db', borderRadius:'12px', padding:'1.5rem', background:'white'}}>
                <div className={styles.scoreCardContent}>
                  <div className={styles.scoreCardLeft}>
                    <div style={{marginBottom:'1.5rem'}}>
                      <h2 className={styles.sectionHeaderXL} style={{color:'#000', margin:'0 0 0.5rem 0'}}>Front-end Developer</h2>
                      <p style={{margin:'0', fontSize:'13px', color:'#666', fontWeight:500}}>Your Resume Readiness Score</p>
                    </div>
                    <div className={styles.scoreDetails} style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem'}}>
                      <div className={styles.scoreColumn} style={{background:'#f5f5f5', borderRadius:'12px', padding:'1rem', border:'1px solid #d1d5db'}}>
                        <div style={{display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.5rem'}}>
                          <BookOpen size={16} style={{color:'#000'}} />
                          <p className={styles.scoreCategoryLabel} style={{color:'#000', fontSize:'11px', margin:0}}>Education</p>
                        </div>
                        <div className={styles.progressBar} style={{background:'#e5e7eb', borderRadius:'4px', height:'6px', marginTop:'0.5rem'}}>
                          <div className={styles.progressFill} style={{width: String((educationScore / 30) * 100) + '%', background:'#000', borderRadius:'4px', transition:'width 0.3s ease'}} />
                        </div>
                        <p className={styles.scoreValue} style={{color:'#000', fontSize:'14px', fontWeight:700, margin:'0.5rem 0 0 0'}}>{educationScore}/30</p>
                      </div>
                      <div className={styles.scoreColumn} style={{background:'#f5f5f5', borderRadius:'12px', padding:'1rem', border:'1px solid #d1d5db'}}>
                        <div style={{display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.5rem'}}>
                          <Zap size={16} style={{color:'#000'}} />
                          <p className={styles.scoreCategoryLabel} style={{color:'#000', fontSize:'11px', margin:0}}>Activity</p>
                        </div>
                        <div className={styles.progressBar} style={{background:'#e5e7eb', borderRadius:'4px', height:'6px', marginTop:'0.5rem'}}>
                          <div className={styles.progressFill} style={{width: String((activityScore / 40) * 100) + '%', background:'#000', borderRadius:'4px', transition:'width 0.3s ease'}} />
                        </div>
                        <p className={styles.scoreValue} style={{color:'#000', fontSize:'14px', fontWeight:700, margin:'0.5rem 0 0 0'}}>{activityScore}/40</p>
                      </div>
                      <div className={styles.scoreColumn} style={{background:'#f5f5f5', borderRadius:'12px', padding:'1rem', border:'1px solid #d1d5db'}}>
                        <div style={{display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.5rem'}}>
                          <Code size={16} style={{color:'#000'}} />
                          <p className={styles.scoreCategoryLabel} style={{color:'#000', fontSize:'11px', margin:0}}>Skills</p>
                        </div>
                        <div className={styles.progressBar} style={{background:'#e5e7eb', borderRadius:'4px', height:'6px', marginTop:'0.5rem'}}>
                          <div className={styles.progressFill} style={{width: String((skillsScore / 20) * 100) + '%', background:'#000', borderRadius:'4px', transition:'width 0.3s ease'}} />
                        </div>
                        <p className={styles.scoreValue} style={{color:'#000', fontSize:'14px', fontWeight:700, margin:'0.5rem 0 0 0'}}>{skillsScore}/20</p>
                      </div>
                      <div className={styles.scoreColumn} style={{background:'#f5f5f5', borderRadius:'12px', padding:'1rem', border:'1px solid #d1d5db'}}>
                        <div style={{display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.5rem'}}>
                          <CheckSquare size={16} style={{color:'#000'}} />
                          <p className={styles.scoreCategoryLabel} style={{color:'#000', fontSize:'11px', margin:0}}>Format</p>
                        </div>
                        <div className={styles.progressBar} style={{background:'#e5e7eb', borderRadius:'4px', height:'6px', marginTop:'0.5rem'}}>
                          <div className={styles.progressFill} style={{width: String((formatScore / 10) * 100) + '%', background:'#000', borderRadius:'4px', transition:'width 0.3s ease'}} />
                        </div>
                        <p className={styles.scoreValue} style={{color:'#000', fontSize:'14px', fontWeight:700, margin:'0.5rem 0 0 0'}}>{formatScore}/10</p>
                      </div>
                    </div>
                  </div>

                  <div className={styles.scoreCardRight}>
                    <div className={styles.chartWrap}>
                      <div style={{position:'relative', width:'160px', height:'160px'}}>
                        <svg width="160" height="160" viewBox="0 0 200 200" style={{transform:'rotate(-90deg)'}}>
                          <circle cx="100" cy="100" r="80" stroke="#e5e7eb" strokeWidth="20" fill="none" opacity="0.3" />
                          <circle cx="100" cy="100" r="80" stroke="url(#grad)" strokeWidth="20" fill="none" strokeDasharray={String((totalScore / maxScore) * 502.4) + ' 502.4'} strokeLinecap="round" style={{transition:'stroke-dasharray 0.5s ease'}} />
                          <defs>
                            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" style={{stopColor:'#06b6d4', stopOpacity:1}} />
                              <stop offset="100%" style={{stopColor:'#0284c7', stopOpacity:1}} />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className={styles.chartCenter} style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)', textAlign:'center'}}>
                          <span style={{fontSize:48,fontWeight:700, color:'#000', display:'block'}}>{totalScore}</span>
                          <span style={{fontSize:11,color:'#666', display:'block', marginTop:'-0.25rem'}}>/ {maxScore}</span>
                          <span style={{fontSize:10,color:'#666',marginTop:'0.5rem', display:'block', fontWeight:500}}>Score</span>
                        </div>
                      </div>
                      <p style={{fontSize:'12px', color:'#666', margin:'1rem 0 0 0', textAlign:'center', fontWeight:500}}>Ready to apply</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skill Gap Analysis */}
              <div className={`${styles.card} ${styles.cardPadded}`} style={{background:'#fafafa'}}>
                <div style={{marginBottom:'1.5rem'}}>
                  <h3 className={styles.sectionHeaderLarge} style={{display:'flex', alignItems:'center', gap:'0.5rem', margin:'0 0 1rem 0'}}>Skill Gap Analysis</h3>
                  <p style={{fontSize:'12px', color:'#666', margin:'0'}}>(Front-end Developer Track)</p>
                </div>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem'}}>
                  <div style={{background:'white', borderRadius:'12px', padding:'1.25rem', border:'2px solid #d1d5db'}}>
                    <h4 style={{fontSize:'13px', fontWeight:600, color:'#000', margin:'0 0 1rem 0', display:'flex', alignItems:'center', gap:'0.5rem', textTransform:'uppercase', letterSpacing:'0.5px'}}>Your Skills</h4>
                    <div style={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
                      {userSkills.slice(0, 6).map((skill, i) => (
                        <div key={i} style={{display:'flex', alignItems:'center', gap:'0.5rem', padding:'0.5rem', background:'#f5f5f5', borderRadius:'8px', border:'1px solid #d1d5db'}}>
                          <span style={{fontSize:'12px', fontWeight:600, color:'#000'}}>•</span>
                          <span style={{fontSize:'12px', fontWeight:500, color:'#000'}}>{skill}</span>
                        </div>
                      ))}
                      {userSkills.length > 6 && (
                        <div style={{fontSize:'12px', padding:'0.5rem', color:'#666', fontStyle:'italic'}}>+{userSkills.length - 6} more skills</div>
                      )}
                    </div>
                  </div>
                  <div style={{background:'white', borderRadius:'12px', padding:'1.25rem', border:'2px solid #d1d5db'}}>
                    <h4 style={{fontSize:'13px', fontWeight:600, color:'#000', margin:'0 0 1rem 0', display:'flex', alignItems:'center', gap:'0.5rem', textTransform:'uppercase', letterSpacing:'0.5px'}}>Missing Skills</h4>
                    <div style={{display:'flex', flexDirection:'column', gap:'0.5rem'}}>
                      {missingSkills.slice(0, 6).map((skill, i) => (
                        <div key={i} style={{display:'flex', alignItems:'center', gap:'0.5rem', padding:'0.5rem', background:'#f5f5f5', borderRadius:'8px', border:'1px solid #d1d5db'}}>
                          <span style={{fontSize:'12px', fontWeight:600, color:'#000'}}>×</span>
                          <span style={{fontSize:'12px', fontWeight:500, color:'#000'}}>{skill}</span>
                        </div>
                      ))}
                      {missingSkills.length > 6 && (
                        <div style={{fontSize:'12px', padding:'0.5rem', color:'#666', fontStyle:'italic'}}>+{missingSkills.length - 6} more</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Completeness Checklist - Moved to Left Sidebar */}

              {/* Missing Skills */}
              <div className={styles.sectionGroup} style={{border:'2px solid #dc2626', borderRadius:'12px', padding:'1.5rem', background:'#fff'}}>
                <div className={styles.skillDetailHeader}>
                  <div>
                    <h3 className={styles.sectionHeaderLarge}><AlertCircle size={18} style={{display:'inline', marginRight:'0.5rem', color:'#dc2626'}} />Missing Skills (High Demand)</h3>
                    <p style={{fontSize:'13px', color:'#666', margin:'0.25rem 0 0 0'}}>Skills needed to improve your profile</p>
                  </div>
                  <button className={styles.addSkillBtn} onClick={() => setShowAddSkillModal(true)} style={{background:'#dc2626', color:'#fff', border:'1px solid #dc2626', padding:'0.5rem 0.75rem', borderRadius:'6px', cursor:'pointer'}}>+ Add Skill</button>
                </div>
                <div className={styles.tagsWrap}>
                  {missingSkills.map((skill, index) => (
                    <span key={index} className={styles.skillMissing} style={{background:'#fee2e2', color:'#991b1b', border:'1px solid #dc2626'}}>{skill}</span>
                  ))}
                </div>
                <p style={{fontSize:'12px', color:'#666', margin:'1rem 0 0 0', paddingTop:'1rem', borderTop:'1px solid #e5e7eb', fontStyle:'italic'}}>
                  💡 Note: Skills can only be added from resumes created on our platform. Build or import your resume to unlock skill management.
                </p>
              </div>

              {/* Add Skill Modal */}
              {showAddSkillModal && (
                <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000}}>
                  <div style={{background:'white', borderRadius:'12px', padding:'2rem', maxWidth:'400px', width:'90%', boxShadow:'0 20px 50px rgba(0,0,0,0.2)', border:'2px solid #dc2626'}}>
                    <h3 style={{margin:'0 0 1rem 0', fontSize:'18px', fontWeight:700, color:'#000'}}>Add New Skill</h3>
                    <p style={{fontSize:'13px', color:'#666', margin:'0 0 1rem 0'}}>Enter a skill you want to add to your profile</p>
                    <input type="text" placeholder="E.g., Figma, AWS, Docker" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()} style={{width:'100%', padding:'0.75rem', border:'1px solid #d1d5db', borderRadius:'8px', fontSize:'14px', marginBottom:'1rem', boxSizing:'border-box', fontFamily:'inherit'}} autoFocus />
                    <div style={{display:'flex', gap:'0.75rem', justifyContent:'flex-end'}}>
                      <button onClick={() => setShowAddSkillModal(false)} style={{padding:'0.5rem 1rem', border:'1px solid #d1d5db', borderRadius:'6px', background:'#f3f4f6', color:'#374151', fontSize:'14px', fontWeight:500, cursor:'pointer', transition:'all 0.2s ease'}}>Cancel</button>
                      <button onClick={handleAddSkill} style={{padding:'0.5rem 1rem', border:'1px solid #dc2626', borderRadius:'6px', background:'#dc2626', color:'white', fontSize:'14px', fontWeight:500, cursor:'pointer', transition:'all 0.2s ease'}}>Add Skill</button>
                    </div>
                  </div>
                </div>
              )}

              {/* BOOTCAMP SECTION - PRIMARY */}
              <div style={{marginTop:'2rem', paddingTop:'2rem', borderTop:'2px solid #e5e7eb'}}>
                <div className={styles.sectionGroup}>
                  <div className={styles.recSection}>
                    <div className={styles.recSectionTitle}>
                      <div className={styles.recBadge} style={{background:'#000', color:'white'}}><BookOpen size={18} /></div>
                      <div>
                        <h3 style={{fontSize:'18px', fontWeight:700, color:'#000', margin:'0'}}>Bootcamp & Courses</h3>
                        <p style={{fontSize:'12px', color:'#666', margin:'0.25rem 0 0 0'}}>Recommended programs to level up your skills</p>
                      </div>
                    </div>
                    <div className={styles.recItemsList}>
                      {recommendedBootcamps.map((bootcamp) => {
                        return (
                          <div key={bootcamp.id} className={styles.recItem} style={{flexDirection:'column', alignItems:'stretch', background:'#f5f5f5', padding:'1rem', borderRadius:'8px', border:'1px solid #d1d5db', marginBottom:'1rem'}}>
                            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'0.75rem'}}>
                              <div style={{flex:1}}>
                                <p className={styles.recItemTitle} style={{margin:'0 0 0.25rem 0'}}>{bootcamp.title}</p>
                                <p className={styles.recItemSubtitle} style={{margin:'0 0 0.5rem 0', color:'#333'}}>{bootcamp.description}</p>
                              </div>
                            </div>
                            <div style={{padding:'0.75rem 0', display:'flex', flexDirection:'column', gap:'0.75rem'}}>
                              <div style={{display:'flex', gap:'0.5rem', flexWrap:'wrap'}}>
                                {bootcamp.tags.map((tag, idx) => (
                                  <span key={idx} style={{fontSize:'11px', padding:'0.25rem 0.5rem', background:'#fff', color:'#000', borderRadius:'4px', fontWeight:500, border:'1px solid #d1d5db'}}>
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem', fontSize:'12px', color:'#333'}}>
                                <div><strong>Duration:</strong> {bootcamp.duration}</div>
                                <div><strong>Level:</strong> {bootcamp.level}</div>
                                <div><strong>Instructor:</strong> {bootcamp.instructor}</div>
                                <div><strong>Price:</strong> {bootcamp.price}</div>
                              </div>
                              <div style={{fontSize:'12px', color:'#333', lineHeight:'1.5'}}>
                                <strong>Topics:</strong> {bootcamp.topics}
                              </div>
                              <a href={bootcamp.registerUrl} target="_blank" rel="noopener noreferrer" style={{display:'inline-block', marginTop:'0.75rem', padding:'0.5rem 1rem', background:'#000', color:'#fff', borderRadius:'6px', textDecoration:'none', fontSize:'12px', fontWeight:600}}>
                                Register Now →
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECONDARY SECTION - Hackathon & Programs */}
              <div style={{marginTop:'2.5rem', paddingTop:'2rem'}}>
                <h3 style={{fontSize:'16px', fontWeight:700, color:'#000', margin:'0 0 1.5rem 0'}}>Opportunities & Events</h3>
                
                {/* Hackathon Section */}
                <div className={styles.sectionGroup}>
                  <div className={styles.recSection}>
                    <div className={styles.recSectionTitle}>
                      <div className={styles.recBadge} style={{background:'#000', color:'white'}}><Trophy size={18} /></div>
                      <div>
                        <h4 style={{fontSize:'15px', fontWeight:700, color:'#000', margin:'0'}}>Recommended Hackathons</h4>
                        <p style={{fontSize:'12px', color:'#666', margin:'0.25rem 0 0 0'}}>Compete and build with others</p>
                      </div>
                    </div>
                    <div className={styles.recItemsList}>
                      {hackathons.map((hackathon) => {
                        return (
                          <div key={hackathon.id} className={styles.recItem} style={{flexDirection:'column', alignItems:'stretch', background:'#f5f5f5', padding:'1rem', borderRadius:'8px', border:'1px solid #d1d5db', marginBottom:'1rem'}}>
                            <div style={{marginBottom:'0.75rem'}}>
                              <p className={styles.recItemTitle} style={{margin:'0 0 0.25rem 0'}}>{hackathon.title}</p>
                              <p className={styles.recItemSubtitle} style={{margin:'0 0 0.5rem 0', color:'#333'}}>{hackathon.subtitle}</p>
                              <p style={{fontSize:'13px', color:'#333', margin:'0 0 0.75rem 0', lineHeight:'1.5'}}>{hackathon.description}</p>
                            </div>
                            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem', fontSize:'12px', color:'#333'}}>
                              <div><strong>Date:</strong> {hackathon.date}</div>
                              <div><strong>Prize:</strong> {hackathon.prize}</div>
                              <div><strong>Theme:</strong> {hackathon.theme}</div>
                              <div><strong>Participants:</strong> {hackathon.participants}</div>
                            </div>
                            <a href={hackathon.registerUrl} target="_blank" rel="noopener noreferrer" style={{display:'inline-block', marginTop:'0.75rem', padding:'0.5rem 1rem', background:'#000', color:'#fff', borderRadius:'6px', textDecoration:'none', fontSize:'12px', fontWeight:600}}>
                              Register Now →
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Support Programs Section */}
                <div className={styles.sectionGroup}>
                  <div className={styles.recSection}>
                    <div className={styles.recSectionTitle}>
                      <div className={styles.recBadge} style={{background:'#000', color:'white'}}><Briefcase size={18} /></div>
                      <div>
                        <h4 style={{fontSize:'15px', fontWeight:700, color:'#000', margin:'0'}}>Support Programs</h4>
                        <p style={{fontSize:'12px', color:'#666', margin:'0.25rem 0 0 0'}}>Support programs and mentorship</p>
                      </div>
                    </div>
                    <div className={styles.recItemsList}>
                      {supportPrograms.map((program) => {
                        return (
                          <div key={program.id} className={styles.recItem} style={{flexDirection:'column', alignItems:'stretch', background:'#f5f5f5', padding:'1rem', borderRadius:'8px', border:'1px solid #d1d5db', marginBottom:'1rem'}}>
                            <div style={{marginBottom:'0.75rem'}}>
                              <p className={styles.recItemTitle} style={{margin:'0 0 0.25rem 0'}}>{program.title}</p>
                              <p className={styles.recItemSubtitle} style={{margin:'0 0 0.5rem 0', color:'#333'}}>{program.subtitle}</p>
                              <p style={{fontSize:'13px', color:'#333', margin:'0', lineHeight:'1.5'}}>{program.description}</p>
                            </div>
                            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem', fontSize:'12px', color:'#333', marginTop:'0.75rem'}}>
                              <div><strong>Duration:</strong> {program.duration}</div>
                              <div><strong>Price:</strong> {program.price}</div>
                            </div>
                            <a href={program.registerUrl} target="_blank" rel="noopener noreferrer" style={{display:'inline-block', marginTop:'0.75rem', padding:'0.5rem 1rem', background:'#000', color:'#fff', borderRadius:'6px', textDecoration:'none', fontSize:'12px', fontWeight:600}}>
                              Enroll Now →
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className={`${styles.rightColumn} ${styles.stickyRight}`}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
