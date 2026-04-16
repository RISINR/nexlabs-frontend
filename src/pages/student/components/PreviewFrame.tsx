import React, { useState } from "react";
import styles from '../DashboardStudentPage.module.css';

type Props = {
  publicEnabled: boolean;
  publicHandle: string;
  publicUrl: string;
  featuredResume?: { name?: string };
  profileCompleteness?: number;
  profile?: any;
  onEdit?: (id: string) => void;
  onSaveProfile?: (profile: any) => void;
  resumes?: { id: string; name: string; date?: number }[];
};

export default function PreviewFrame({ publicEnabled, publicHandle, publicUrl, featuredResume, profileCompleteness = 60, profile, onEdit, onSaveProfile, resumes }: Props) {
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<any>({
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    displayName: profile?.displayName || (profile?.firstName || '') + ' ' + (profile?.lastName || ''),
    title: profile?.title || '',
    location: profile?.location || profile?.faculty || '',
    featuredResume: profile?.featuredResume || featuredResume?.name || '',
    tools: (profile?.tools || []).slice(),
    excerpt: profile?.excerpt || '',
    profileCompleteness: profileCompleteness,
    templatePreview: profile?.templatePreview || null,
  });
  const [showResumePicker, setShowResumePicker] = useState(false);

  const formatMDY = (ts?: number) => {
    if (!ts) return '';
    const d = new Date(ts);
    return `${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()}`;
  };

  // keep form in sync when profile prop changes
  React.useEffect(() => {
    setForm({
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      displayName: profile?.displayName || (profile?.firstName || '') + ' ' + (profile?.lastName || ''),
      title: profile?.title || '',
      location: profile?.location || profile?.faculty || '',
      featuredResume: profile?.featuredResume || featuredResume?.name || '',
      tools: (profile?.tools || []).slice(),
      excerpt: profile?.excerpt || '',
      profileCompleteness: profileCompleteness,
      templatePreview: profile?.templatePreview || null,
    });
  }, [profile, featuredResume, profileCompleteness]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // noop
    }
  };

  return (
    <div className={styles.virtualDeviceWrap}>
      <div className={styles.deviceShell}>
        <div style={{ padding: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ width: 10, height: 10, borderRadius: 999, background: publicEnabled ? '#16a34a' : '#f59e0b' }} />
              <div style={{ fontWeight: 700 }}>{publicEnabled ? 'Live' : 'Private'}</div>
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div className={styles.urlBar}>
                <div style={{ fontSize: 13, color: '#374151' }}>nexlabs.io/p/{publicHandle}</div>
              </div>
              <button className={styles.previewBtn} onClick={onCopy}>Copy</button>
              <button className={styles.previewBtn} onClick={() => setEditing(true)}>Edit</button>
            </div>
          </div>
        </div>

        <div className={styles.deviceScreen}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {/* Avatar: use profile.avatar if present, otherwise generated SVG placeholder */}
            <div style={{ width: 56, height: 56, borderRadius: 999, overflow: 'hidden', background: '#e6eef8', flexShrink: 0 }}>
              {profile?.avatar ? (
                <img src={profile.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              ) : (
                <img
                  src={(() => {
                    const nameStr = (profile?.displayName || `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim() || 'U').trim();
                    const initials = nameStr.split(' ').map(s => s.charAt(0)).slice(0,2).join('').toUpperCase();
                    const bg = '#1f2937';
                    const fg = '#ffffff';
                    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='128' height='128'><rect width='100%' height='100%' fill='${bg}' rx='64'/><text x='50%' y='50%' font-family='Poppins,Arial' font-size='52' fill='${fg}' dominant-baseline='middle' text-anchor='middle'>${initials}</text></svg>`;
                    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
                  })()}
                  alt="avatar"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              )}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{profile ? `${profile.displayName || `${profile.firstName || ''} ${profile.lastName || ''}`.trim()}` : 'Full Name'}</div>
              <div style={{ color: '#6b7280', fontSize: 13 }}>{profile ? `${profile.title || ''}${(profile.title && (profile.location || profile.faculty)) ? ' • ' : ''}${profile.location || profile.faculty || ''}` : 'Primary Role • Location'}</div>
            </div>
          </div>

          <div style={{ marginTop: 12, borderRadius: 8, padding: 10, border: '1px solid rgba(15,23,42,0.04)', background: '#fff' }}>
            {!editing && (
              <>
                <div style={{ fontSize: 13, color: '#475569' }}>Featured Resume</div>
                <div style={{ fontWeight: 700, marginTop: 6 }}>{featuredResume?.name || profile?.featuredResume || 'No resume selected'}</div>
                <div style={{ marginTop: 8 }}>
                  <div className={styles.skillRow}>
                    {(profile?.tools || []).slice(0,6).map((t: string) => (
                      <div key={t} className={styles.skillBadge}>{t}</div>
                    ))}
                    {(!profile?.tools || profile.tools.length === 0) && (
                      <>
                        <div className={styles.skillBadge}>React</div>
                        <div className={styles.skillBadge}>Figma</div>
                        <div className={styles.skillBadge}>STAR</div>
                      </>
                    )}
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <div style={{ fontSize: 13, color: '#475569' }}>About</div>
                    <div style={{ marginTop: 6, color: '#374151' }}>{profile?.excerpt || '—'}</div>
                  </div>
                </div>
              </>
            )}

            {editing && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 13, color: '#475569' }}>Full Name</label>
                <div className={styles.previewEditRow}>
                  <input className={styles.previewEditInput} value={form.displayName || ''} onChange={e=>setForm({...form, displayName: e.target.value})} placeholder="Public display name (shown on navbar/community)" />
                  <input className={styles.previewEditInput} value={form.firstName} onChange={e=>setForm({...form, firstName: e.target.value})} placeholder="First name" />
                  <input className={styles.previewEditInput} value={form.lastName} onChange={e=>setForm({...form, lastName: e.target.value})} placeholder="Last name" />
                </div>

                <label style={{ fontSize: 13, color: '#475569' }}>Role • Location</label>
                <div className={styles.previewEditRow}>
                  <input className={styles.previewEditInput} value={form.title} onChange={e=>setForm({...form, title: e.target.value})} placeholder="Role" />
                  <input className={styles.previewEditInput} value={form.location} onChange={e=>setForm({...form, location: e.target.value})} placeholder="Location" />
                </div>

                <div style={{ marginTop: 6, fontSize: 13, color: '#6b7280' }}>Profile completeness: {form.profileCompleteness}%</div>

                <label style={{ fontSize: 13, color: '#475569' }}>Featured Resume</label>
                <input className={styles.previewEditInput} value={form.featuredResume} onChange={e=>setForm({...form, featuredResume: e.target.value})} placeholder="Resume name" />

                <label style={{ fontSize: 13, color: '#475569' }}>Skills & Tools (comma separated)</label>
                <input className={styles.previewEditInput} value={(form.tools||[]).join(', ')} onChange={e=>setForm({...form, tools: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})} placeholder="React, Figma, ..." />

                <label style={{ fontSize: 13, color: '#475569' }}>About</label>
                <textarea className={styles.previewEditInput} value={form.excerpt || ''} onChange={e => setForm({...form, excerpt: e.target.value})} placeholder="Short description about you, to show on community preview" style={{minHeight:80}} />

                {/* Profile completeness control removed from edit form as requested */}

                <label style={{ fontSize: 13, color: '#475569' }}>Template Preview (upload)</label>
                <input type="file" accept="image/*" onChange={e=>{
                  const f = e.target.files?.[0];
                  if(!f) return;
                  const reader = new FileReader();
                  reader.onload = () => setForm({...form, templatePreview: reader.result});
                  reader.readAsDataURL(f);
                }} />

                {form.templatePreview && <img src={form.templatePreview} alt="preview" style={{width:'100%',height:120,objectFit:'cover',borderRadius:8}} />}

                <div style={{ marginTop: 8 }}>
                  <button onClick={() => setShowResumePicker(s => !s)} style={{padding:'8px 10px',borderRadius:8,border:'1px solid rgba(15,23,42,0.06)',background:'#fff',cursor:'pointer'}}>Choose from my resumes</button>
                </div>

                {showResumePicker && (
                  <div style={{marginTop:8,display:'flex',flexDirection:'column',gap:8,maxHeight:180,overflow:'auto',paddingRight:6}}>
                    {(resumes || []).slice().sort((a,b)=> (b.date||0) - (a.date||0)).map(r => (
                      <button key={r.id} onClick={() => { setForm({...form, featuredResume: r.name}); setShowResumePicker(false); }} style={{textAlign:'left',padding:8,borderRadius:8,border:'1px solid rgba(15,23,42,0.04)',background:'#fff',cursor:'pointer'}}>
                        <div style={{fontWeight:700}}>{r.name}</div>
                        <div style={{fontSize:12,color:'#6b7280'}}>{r.date ? formatMDY(r.date) : ''}</div>
                      </button>
                    ))}
                    {(!(resumes || []).length) && (<div style={{color:'#6b7280'}}>No resumes found</div>)}
                  </div>
                )}

                <div style={{ display:'flex',gap:8,marginTop:6 }}>
                  <button onClick={() => {
                    // Save changes
                    const updated = {
                      ...profile,
                      displayName: form.displayName,
                      firstName: form.firstName,
                      lastName: form.lastName,
                      title: form.title,
                      location: form.location,
                      featuredResume: form.featuredResume,
                      tools: form.tools,
                      excerpt: form.excerpt,
                      templatePreview: form.templatePreview,
                    };
                    if(onSaveProfile) onSaveProfile(updated);
                    setEditing(false);
                  }} style={{padding:'8px 10px',background:'#0b74ff',color:'#fff',border:0,borderRadius:8}}>Save</button>
                  <button onClick={() => { setEditing(false); setForm({
                    firstName: profile?.firstName || '',
                    lastName: profile?.lastName || '',
                    title: profile?.title || '',
                    location: profile?.location || profile?.faculty || '',
                    featuredResume: profile?.featuredResume || featuredResume?.name || '',
                    tools: (profile?.tools || []).slice(),
                    profileCompleteness: profileCompleteness,
                    templatePreview: profile?.templatePreview || null,
                  }); }} style={{padding:'8px 10px',border: '1px solid rgba(15,23,42,0.06)',borderRadius:8}}>Cancel</button>
                </div>
              </div>
            )}
          </div>

            {/* Profile completeness bar removed as requested */}

            {profile?.templatePreview && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 13, color: '#475569', marginBottom: 8 }}>Template Preview</div>
                <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(15,23,42,0.04)' }}>
                  <img src={profile.templatePreview} alt="template preview" style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block' }} />
                </div>
              </div>
            )}
        </div>
      </div>

      {copied && <div style={{ fontSize: 12, color: '#16a34a', textAlign: 'center', marginTop: 8 }}>Link copied</div>}
    </div>
  );
}
