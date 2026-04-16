import React from 'react';
import styles from '../DashboardStudentPage.module.css';

export default function AIInsights({ items = [] }: any) {
  return (
    <div style={{ padding: 12 }}>
      <h4 style={{ margin: 0, marginBottom: 8, fontWeight: 700 }}>AI Insights</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
        {items.length ? items.map((t: string, i: number) => (
          <div key={i} className={styles.aiFeedItemSpec}>
            <div className={styles.aiIcon}>✨</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#0f172a', fontWeight: 600 }}>{t}</div>
              <div style={{ marginTop: 6 }}>
                <a className={styles.aiCTA} href="#" onClick={(e)=>{e.preventDefault(); alert('Improve now')}}>Improve now →</a>
              </div>
            </div>
          </div>
        )) : <div style={{ color: '#6b7280' }}>No suggestions yet.</div>}
      </div>
    </div>
  );
}
