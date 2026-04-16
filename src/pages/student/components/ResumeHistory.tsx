import React from 'react';
import styles from '../DashboardStudentPage.module.css';

export default function ResumeHistory({ resumes, onEdit }: { resumes: any[]; onEdit: (id: string) => void }) {
  return (
    <div>
      {resumes.map(r => (
        <div key={r.id} className={styles.resumeEntry}>
          <div className={styles.resumeMeta}>
            <div>{r.name}</div>
            <div>{new Date(r.date).toLocaleDateString()}</div>
          </div>
          <div>
            <button className={`${styles.btnAlt} ${styles.resumeViewBtn}`} onClick={() => onEdit(r.id)}>Edit</button>
          </div>
        </div>
      ))}
    </div>
  );
}
