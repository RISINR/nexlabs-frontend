import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import styles from '../DashboardStudentPage.module.css';

export default function StrategicOverview({ data = [], profileCompleteness = 60, goal, onGoalChange }: any) {
  return (
    <div className={styles.card} style={{ padding: 12 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 12, alignItems: 'center' }}>
        <div style={{ width: '100%' }}>
          <div className={styles.radarWrap}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={data} outerRadius={60}>
                <PolarGrid strokeOpacity={0.06} />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                <Radar dataKey="A" stroke="#0061FF" fill="#0061FF" fillOpacity={0.12} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <div style={{ fontSize: 13, color: '#475569' }}>Resume Score</div>
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 12 }} className={styles.resumeScoreWrap}>
            <div style={{ flex: 1 }}>
              <div style={{ height: 12, borderRadius: 999, background: '#f1f5f9' }}>
                <div style={{ width: `${profileCompleteness}%`, height: '100%', background: '#06b6d4', borderRadius: 999 }} />
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className={styles.resumeScorePct}>{profileCompleteness}%</div>
              <div className={styles.profileStrength}>Profile Strength</div>
            </div>
          </div>

          <div style={{ marginTop: 10 }}>
            <select className={styles.goalSelect} value={goal} onChange={(e) => onGoalChange?.(e.target.value)}>
              <option>UX Designer</option>
              <option>Fullstack Developer</option>
              <option>Data Scientist</option>
              <option>Product Manager</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
