import React from 'react';
import styles from '../DashboardStudentPage.module.css';

export default function RecentResumes({ resumes = [], onEdit, grid = false }: any) {
  if (grid) {
    return (
      <div style={{ padding: 12 }}>
        <h4 style={{ margin: 0, marginBottom: 12, fontWeight: 700 }}>Recent Resumes</h4>
        <div className={styles.resumeGrid}>
          {resumes.map((r: any) => (
            <div key={r.id} className={styles.resumeCardThumb}>
              <div className={styles.resumeThumbInner}>
                <div className={styles.thumbOverlay}>
                  <div className={styles.thumbButtons}>
                    <button className={styles.btnPrimary} onClick={() => onEdit?.(r.id)}>✍️ Edit</button>
                    <button className={styles.btnAlt}>🎤 Practice</button>
                  </div>
                </div>
                {/* simulated thumbnail content */}
                <div style={{position:'absolute',inset:12,background:'#fff',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',color:'#0f172a',fontWeight:700}}>Preview</div>
              </div>
              <div className={styles.resumeInfoArea}>
                <div className={styles.resumeInfoName}>{r.name}</div>
                <div className={styles.resumeInfoMeta}>{r.progress >= 90 ? 'Ready' : r.progress >= 60 ? 'Draft' : 'WIP'}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 12 }}>
      <h4 style={{ margin: 0, marginBottom: 8, fontWeight: 700 }}>Recent Resumes</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {resumes.map((r: any) => (
          <div key={r.id} className={styles.resumeCard}>
            <div className={styles.fileIcon}>PDF</div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className={styles.resumeName}>{r.name}</div>
                <div className={styles.statusBadge}>{r.progress >= 90 ? 'Ready' : r.progress >= 60 ? 'Draft' : 'Work-in-progress'}</div>
              </div>
              <div style={{ fontSize: 12, color: '#6b7280', marginTop: 6 }}>Edited {new Date(r.lastEdited).toLocaleString()}</div>
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button onClick={() => onEdit?.(r.id)} className={styles.btnPrimary}>{r.progress >= 95 ? '✨ Optimize with AI' : '✍️ Edit Resume'}</button>
              {r.progress > 20 ? (
                <button className={styles.glowBtn}>🎤 Start Practice</button>
              ) : (
                <button className={styles.btnSecondaryDisabled} disabled>🎤 Start Practice</button>
              )}
              <div style={{ position: 'relative' }}>
                <button className={styles.menuBtn}>⋮</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
