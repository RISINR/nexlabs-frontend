import React, { useEffect, useState } from 'react';
import { Navbar } from "../../components/Navbar";
import { useResume } from '../../contexts/ResumeContext';
import styles from './DashboardStudentPage.module.css';
import StrategicOverview from './components/StrategicOverview';
import RecentResumes from './components/RecentResumes';
import AIInsights from './components/AIInsights';
import PreviewFrame from './components/PreviewFrame';
import LineChart from './components/LineChart';
import RadarChart from './components/RadarChart';
import ResumeHistory from './components/ResumeHistory';
import ActionIcon from '../../components/icons/ActionIcon';

export default function DashboardStudentPage() {
  const [user, setUser] = useState<any>({ firstName: 'Natchanon', lastName: 'Demo', faculty: 'Graphic Design', title: 'UX Designer', location: 'Bangkok, TH', excerpt: 'Product-focused portfolio with case studies.', tools: ['React','Figma'], badges: ['Expert Reviewer'], rating: 4.7, templatePreview: '/images/templates/template-ux1.png' });
  const [resumes, setResumes] = useState<any[]>([]);
  const [resumePickerOpen, setResumePickerOpen] = useState<boolean>(false);
  const [interviewPickerOpen, setInterviewPickerOpen] = useState<boolean>(false);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [statusPublic, setStatusPublic] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem('nexlabs_user') || sessionStorage.getItem('nexlabs_user');
      if (raw) {
        const obj = JSON.parse(raw || '{}');
        if (typeof obj.publicEnabled === 'boolean') return obj.publicEnabled;
      }
    } catch (e) {
      // ignore
    }
    return false;
  });

  useEffect(() => {
    // Try to load actual user from backend if token present
    (async () => {
      try {
        const token = localStorage.getItem('nexlabs_token') || sessionStorage.getItem('nexlabs_token');
        if (!token) return;
        const { authAPI } = await import('../../services/authAPI');
        const res = await authAPI.getCurrentUser(token);
        if (res && res.success && res.user) {
          const u = res.user;
          setUser(prev => ({
            ...prev,
            firstName: u.firstName || (u.name || '').split(' ')[0] || prev.firstName,
            lastName: u.lastName || ((u.name || '').split(' ').slice(1).join(' ')) || prev.lastName,
            title: u.position || prev.title,
            avatar: u.avatar || prev.avatar,
            email: u.email || prev.email,
            displayName: u.displayName || prev.displayName
          }));
          // ensure statusPublic reflects server value when available
          if (typeof u.publicEnabled === 'boolean') setStatusPublic(!!u.publicEnabled);
        }
      } catch (e) {
        // ignore silently
      }
    })();

    // load resumes from backend if available
    (async () => {
      try {
        const token = localStorage.getItem('nexlabs_token') || sessionStorage.getItem('nexlabs_token');
        const { authAPI } = await import('../../services/authAPI');
        const res = await authAPI.getResumes(token || undefined);
        if (res && res.success && Array.isArray(res.data)) {
          // map to expected shape
          const items = res.data.map((r: any) => ({ id: r._id, name: r.name, date: new Date(r.createdAt).getTime(), score: r.score || 0, templatePreview: r.templatePreview }));
          setResumes(items);
        } else {
          // fallback sample
          setResumes([
            { id: 'r1', name: 'Resume v1.0', date: new Date('2026-02-18').getTime(), score: 72 },
            { id: 'r2', name: 'Resume v2.0', date: new Date('2026-02-28').getTime(), score: 78 },
            { id: 'r3', name: 'Resume v3.0', date: new Date('2026-03-15').getTime(), score: 85 },
          ]);
        }
      } catch (e) {
        setResumes([
          { id: 'r1', name: 'Resume v1.0', date: new Date('2026-02-18').getTime(), score: 72 },
          { id: 'r2', name: 'Resume v2.0', date: new Date('2026-02-28').getTime(), score: 78 },
          { id: 'r3', name: 'Resume v3.0', date: new Date('2026-03-15').getTime(), score: 85 },
        ]);
      }
    })();
    setInterviews([
      { id: 'i1', name: 'Interview #1', date: new Date('2026-02-20').getTime() },
      { id: 'i2', name: 'Interview #2', date: new Date('2026-03-05').getTime() },
    ]);
  }, []);

  // Show fixed readiness score (requested): 85%
  const readinessScore = 85;

  const { updateBasicInfo } = useResume();

  const onEdit = (id: string) => alert('Open editor: ' + id);

  const togglePublic = async (enabled: boolean) => {
    setStatusPublic(enabled);
    let mergedProfile: any = null;
    try {
      const merged = { ...(JSON.parse(localStorage.getItem('nexlabs_user') || sessionStorage.getItem('nexlabs_user') || '{}')), publicEnabled: enabled };
      mergedProfile = merged;
      localStorage.setItem('nexlabs_user', JSON.stringify(merged));
      sessionStorage.setItem('nexlabs_user', JSON.stringify(merged));
      try { window.dispatchEvent(new CustomEvent('nexlabs:auth-changed')); } catch(e) {}
      try { window.dispatchEvent(new CustomEvent('nexlabs:profile-updated', { detail: merged })); } catch(e) {}
      try { localStorage.setItem('nexlabs_public_changed', String(Date.now())); } catch(e) {}
    } catch (e) {
      // ignore
    }

    const token = localStorage.getItem('nexlabs_token') || sessionStorage.getItem('nexlabs_token');
    if (token) {
      try {
        const { authAPI } = await import('../../services/authAPI');
        const res = await authAPI.updateProfile(token, { publicEnabled: enabled });
        const latest = (res && res.user) ? { ...(mergedProfile || {}), ...res.user } : (mergedProfile || { publicEnabled: enabled });
        try { window.dispatchEvent(new CustomEvent('nexlabs:profile-updated', { detail: latest })); } catch(e) {}
        try { localStorage.setItem('nexlabs_public_changed', String(Date.now())); } catch(e) {}
      } catch (e) {
        console.warn('Could not persist publicEnabled', e);
      }
    }
  };
  const onSaveProfile = async (updated: any) => {
    setUser(prev => ({ ...prev, ...updated }));
    let mergedLocalProfile: any = null;
    // always persist locally first
    try {
      const mergedLocal = { ...(JSON.parse(localStorage.getItem('nexlabs_user') || sessionStorage.getItem('nexlabs_user') || '{}')), ...(updated || {}) };
      // ensure `bio` is populated from `excerpt` for backend/public display
      if ((!mergedLocal.bio || mergedLocal.bio === '') && mergedLocal.excerpt) mergedLocal.bio = mergedLocal.excerpt;
      mergedLocalProfile = mergedLocal;
      localStorage.setItem('nexlabs_user', JSON.stringify(mergedLocal));
      sessionStorage.setItem('nexlabs_user', JSON.stringify(mergedLocal));
      try { window.dispatchEvent(new Event('nexlabs:auth-changed')); } catch (e) { /* ignore */ }
      try { window.dispatchEvent(new CustomEvent('nexlabs:profile-updated', { detail: mergedLocal })); } catch (e) { /* ignore */ }
    } catch (e) {
      // ignore storage errors
    }

    // If token present, attempt backend update for persistence
    const token = localStorage.getItem('nexlabs_token') || sessionStorage.getItem('nexlabs_token');
    if (token) {
      try {
        const { authAPI } = await import('../../services/authAPI');
        const payload: any = {
          firstName: updated.firstName,
          lastName: updated.lastName,
          displayName: updated.displayName || `${updated.firstName || ''} ${updated.lastName || ''}`.trim(),
          position: updated.title || updated.position,
          avatar: updated.avatar,
          location: updated.location,
          tools: updated.tools,
          excerpt: updated.excerpt,
          featuredResume: updated.featuredResume,
          templatePreview: updated.templatePreview,
          bio: updated.bio || updated.excerpt,
        };
        const res = await authAPI.updateProfile(token, payload);
        if (res && res.user) {
          const storage = localStorage.getItem('nexlabs_token') ? localStorage : sessionStorage;
            try {
              const prev = storage.getItem('nexlabs_user');
              const prevObj = prev ? JSON.parse(prev) : {};
              const merged = { ...prevObj, ...(res.user || {}), displayName: payload.displayName || (res.user && (res.user.displayName || res.user.name)), firstName: payload.firstName || (res.user && res.user.firstName), lastName: payload.lastName || (res.user && res.user.lastName), position: payload.position || (res.user && res.user.position), avatar: payload.avatar || (res.user && res.user.avatar) };
              const { setStoredUser } = await import('../../utils/userStorage');
              setStoredUser(merged);
              try { window.dispatchEvent(new CustomEvent('nexlabs:auth-changed')); } catch(e) {}
              try { window.dispatchEvent(new CustomEvent('nexlabs:profile-updated', { detail: merged })); } catch(e) {}
            // update ResumeContext basicInfo
            try {
              const basic = {
                fullName: merged.displayName || `${merged.firstName || ''} ${merged.lastName || ''}`.trim(),
                professionalTitle: merged.position || '',
                email: merged.email || '',
                phone: merged.phone || '',
                location: merged.location || '',
                profilePicture: merged.avatar || undefined,
                socialProfiles: merged.socialProfiles || [],
              };
              updateBasicInfo(basic as any);
            } catch (e) { /* ignore */ }
          } catch (e) {
            // fallback: persist returned user using helper (preserves preview keys)
            try {
              const { setStoredUser } = await import('../../utils/userStorage');
              setStoredUser(res.user);
              window.dispatchEvent(new CustomEvent('nexlabs:auth-changed'));
              window.dispatchEvent(new CustomEvent('nexlabs:profile-updated', { detail: res.user }));
            } catch (err) {
              try {
                localStorage.setItem('nexlabs_user', JSON.stringify(res.user));
                window.dispatchEvent(new CustomEvent('nexlabs:auth-changed'));
                window.dispatchEvent(new CustomEvent('nexlabs:profile-updated', { detail: res.user }));
              } catch (ee) {}
            }
          }
          alert('Profile saved');
          return;
        }
      } catch (err: any) {
        // backend update failed — leave local changes but inform user
        console.warn('Profile update failed', err);
        alert('Saved locally, but failed to persist to server: ' + (err?.message || 'Unknown error'));
        return;
      }
    }

    // no token — local only
    try { if (mergedLocalProfile) window.dispatchEvent(new CustomEvent('nexlabs:profile-updated', { detail: mergedLocalProfile })); } catch (e) {}
    alert('Profile saved (local only)');
  };

  // Dummy timeline events (resume + interview events)
  const timeline = [
    { label: 'Resume v1.0', score: 72 },
    { label: 'Interview #1', score: 70 },
    { label: 'Resume v2.0', score: 78 },
    { label: 'Interview #2', score: 82 },
    { label: 'Resume v3.0', score: 85 },
  ];

  const badges = [
    { icon: 'palette', label: 'Layout King' },
    { icon: 'crown', label: 'Resume Master' },
    { icon: 'note', label: 'STAR Pro' },
  ];
  // incoming requests removed per user request
  const reviews = [{ by: 'Tui', stars: 5, text: 'Great structure and clarity.' }, { by: 'Pom', stars: 4, text: 'Strong visuals; tweak header spacing.' }];

  return (
    <div className={styles.root} style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      <Navbar />

      <main className={styles.container}>
        {/* HERO: Overview & Readiness */}
        <section className={styles.hero}>
          <div className={styles.heroLeft}>
            <div className={styles.heroScore} style={{ position: 'relative' }}>
              <svg viewBox="0 0 36 36" style={{ width: 110, height: 110 }}>
                <path d="M18 2a16 16 0 1 0 0 32 16 16 0 0 0 0-32" fill="#e6eef6" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#e6eef6" strokeWidth="4" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#06b6d4" strokeWidth="4" strokeDasharray={`${(readinessScore/100)*88} 88`} strokeLinecap="round" transform="rotate(-90 18 18)" />
                <text x="18" y="20" fontSize="6" fontWeight={700} textAnchor="middle" fill="#0f172a">{readinessScore}%</text>
              </svg>
            </div>

            <div className={styles.heroMeta}>
              <div className={styles.heroName}>{user.firstName} {user.lastName}</div>
              <div className={styles.heroSubtitle}>{user.title}</div>
              <div style={{ marginTop: 8 }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" checked={statusPublic} onChange={e => togglePublic(e.target.checked)} />
                  <span style={{ color: '#0f172a' }}>{statusPublic ? 'Public' : 'Private'}</span>
                </label>
              </div>
            </div>
          </div>

          <div className={styles.heroActions}>
            <button className={styles.btnPrimary} onClick={() => setResumePickerOpen(true)}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <ActionIcon name="edit" size={16} />
                <span>Edit Resume</span>
              </span>
            </button>
            <button className={styles.btnAlt} onClick={() => setInterviewPickerOpen(true)}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <ActionIcon name="mic" size={16} />
                <span>Practice Interview</span>
              </span>
            </button>
          </div>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 20 }}>
          <div>
            {/* Evolution Tracking */}
            <section className={`${styles.card} ${styles.evolutionCard}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div className={styles.sectionHeader}>Evolution Tracking</div>
                <div className={styles.pageDesc}>Track, Compare & Level Up</div>
              </div>

              {/* Line Chart (simple SVG) */}
              <div className={styles.lineChart}>
                <LineChart data={timeline} />
                <div className={styles.timelineLabels}>
                  {timeline.map((t, i) => (
                    <div key={i} className={styles.timelineItem}>
                      <div className={styles.timelineLabelText}>{t.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Radar Chart + Resume Iterations */}
              <div className={styles.radarResumeWrap}>
                <div className={styles.radarBox}>
                  <div className={styles.sectionHeader}>Interview Comparison</div>
                  <RadarChart />
                  <div className={styles.pageDesc}>Interview #1 vs #2 — สีเขียวคือการปรับปรุง</div>
                </div>

                <div className={styles.resumeHistory}>
                  <div className={styles.sectionHeader}>Resume Iteration History</div>
                  <div style={{ marginTop: 8 }}>
                    <ResumeHistory resumes={resumes} onEdit={onEdit} />
                  </div>
                </div>
              </div>
            </section>

            {/* Skill & Community */}
            <section className={styles.card} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 800 }}>Skill & Community Validation</div>
                <div style={{ color: '#6b7280' }}>Social proof from peers</div>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                {badges.map((b, i) => (
                  <div key={i} style={{ background: '#fff', padding: '6px 10px', borderRadius: 999, border: '1px solid rgba(15,23,42,0.04)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <ActionIcon name={b.icon} size={14} />
                    <span style={{ fontWeight: 600 }}>{b.label}</span>
                  </div>
                ))}
              </div>

              {/* Incoming Requests section removed per user request */}
            </section>

            <section className={styles.card} style={{ marginBottom: 16 }}>
              <div className={styles.sectionHeader}>Peer Reviews</div>
              <div style={{ marginTop: 8 }}>
                {reviews.map((r,i) => (
                  <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid rgba(15,23,42,0.03)' }}>
                    <div style={{ fontWeight: 700 }}>{r.by} • {'★'.repeat(r.stars)}</div>
                    <div style={{ color: '#374151' }}>{r.text}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Roadmap & Daily Mission */}
            <section className={`${styles.card} ${styles.roadmapCard}`}>
              <div className={styles.sectionHeader}>Roadmap & Daily Mission</div>
              <div style={{ marginTop: 8 }}>Next Milestone: Practice 1 mock interview to improve Soft Skills score.</div>
              <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                <button className={styles.btnPrimary} onClick={() => alert('Start Mission')}>Start Daily Mission</button>
                <button className={styles.btnAlt} onClick={() => alert('View Industry Pulse')}>Industry Pulse</button>
              </div>
            </section>
          </div>

          <aside className={styles.sidebar}>
            <div className={styles.previewSticky}>
              <div style={{ width: 420 }}>
                <div style={{ background: '#fff', padding: 12, borderRadius: 8, border: '1px solid rgba(15,23,42,0.04)', marginBottom: 12 }}>
                  <div className={styles.sectionHeader}>Resume & Profile Preview</div>
                  <div style={{ marginTop: 8 }}>
                    <PreviewFrame publicEnabled={true} publicHandle={'natchanon'} publicUrl={'https://nexlabs.io/p/natchanon'} featuredResume={resumes[resumes.length-1]} profileCompleteness={readinessScore} profile={user} onEdit={onEdit} onSaveProfile={onSaveProfile} resumes={resumes} />
                  </div>
                </div>

                <div style={{ background: '#fff', padding: 12, borderRadius: 8, border: '1px solid rgba(15,23,42,0.04)' }}>
                  <div className={styles.sectionHeader}>AI Improvement Tips</div>
                  <div className={styles.pageDesc} style={{ marginTop: 8 }}>เพิ่ม White Space ในส่วน Header อีกนิด จะทำให้อ่านง่ายขึ้น 15%.</div>
                  <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ color: '#6b7280' }}>Shareable Link</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className={styles.btnAlt} onClick={() => navigator.clipboard?.writeText('https://nexlabs.io/p/natchanon')}>Copy</button>
                      <button className={styles.btnAlt} onClick={() => alert('Share link')}>Share</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
      {resumePickerOpen && (
        <div style={{position:'fixed',inset:0,background:'rgba(2,6,23,0.45)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:400}} onClick={() => setResumePickerOpen(false)}>
          <div role="dialog" aria-modal="true" aria-label="Select resume version" onClick={e=>e.stopPropagation()} style={{width:420,maxWidth:'90%',background:'#fff',borderRadius:12,padding:18}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
              <div style={{fontWeight:800}}>Select Resume Version</div>
              <button onClick={() => setResumePickerOpen(false)} style={{background:'transparent',border:0,cursor:'pointer'}}>✕</button>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:8,maxHeight:320,overflow:'auto'}}>
              {resumes.slice().sort((a,b)=>b.date - a.date).map(r => (
                <button key={r.id} onClick={() => { onEdit(r.id); setResumePickerOpen(false); }} style={{textAlign:'left',padding:12,borderRadius:8,border:'1px solid rgba(15,23,42,0.06)',background:'#fff',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <div style={{fontWeight:700}}>{r.name}</div>
                    <div style={{fontSize:13,color:'#6b7280'}}>{new Date(r.date).toLocaleDateString()}</div>
                  </div>
                  <div style={{fontSize:13,color:'#0b74ff',fontWeight:800}}>Edit</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {interviewPickerOpen && (
        <div style={{position:'fixed',inset:0,background:'rgba(2,6,23,0.45)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:400}} onClick={() => setInterviewPickerOpen(false)}>
          <div role="dialog" aria-modal="true" aria-label="Select resume for practice" onClick={e=>e.stopPropagation()} style={{width:420,maxWidth:'90%',background:'#fff',borderRadius:12,padding:18}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
              <div style={{fontWeight:800}}>Practice with Resume</div>
              <button onClick={() => setInterviewPickerOpen(false)} style={{background:'transparent',border:0,cursor:'pointer'}}>✕</button>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:8,maxHeight:320,overflow:'auto'}}>
              {resumes.slice().sort((a,b)=>b.date - a.date).map(r => (
                <button key={r.id} onClick={() => { alert('Start practice with ' + r.name); setInterviewPickerOpen(false); }} style={{textAlign:'left',padding:12,borderRadius:8,border:'1px solid rgba(15,23,42,0.06)',background:'#fff',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <div style={{fontWeight:700}}>{r.name}</div>
                    <div style={{fontSize:13,color:'#6b7280'}}>{new Date(r.date).toLocaleDateString()}</div>
                  </div>
                  <div style={{fontSize:13,color:'#0b74ff',fontWeight:800}}>Practice</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
