export function setStoredUser(user: any) {
  try {
    const prevRaw = localStorage.getItem('nexlabs_user') || sessionStorage.getItem('nexlabs_user');
    const preserveKeys = ['featuredResume', 'templatePreview', 'bio', 'tools', 'excerpt', 'displayName', 'profile', 'publicEnabled'];
    let merged = { ...(user || {}) };
    if (prevRaw) {
      try {
        const prev = JSON.parse(prevRaw || '{}');
        preserveKeys.forEach(k => {
          if ((prev[k] !== undefined && prev[k] !== null && prev[k] !== '') && (merged[k] === undefined || merged[k] === null || merged[k] === '')) {
            merged[k] = prev[k];
          }
        });
      } catch (e) {
        // ignore parse errors
      }
    }

    const hasLocalToken = !!(localStorage.getItem('nexlabs_token') || localStorage.getItem('token'));
    const storage = hasLocalToken ? localStorage : sessionStorage;
    storage.setItem('nexlabs_user', JSON.stringify(merged));
    try { window.dispatchEvent(new CustomEvent('nexlabs:auth-changed', { detail: merged })); } catch (e) {}
  } catch (e) {
    // fallback naive write
    try {
      const hasLocalToken = !!(localStorage.getItem('nexlabs_token') || localStorage.getItem('token'));
      const storage = hasLocalToken ? localStorage : sessionStorage;
      storage.setItem('nexlabs_user', JSON.stringify(user || {}));
      try { window.dispatchEvent(new CustomEvent('nexlabs:auth-changed', { detail: user })); } catch (e) {}
    } catch (err) {
      // no-op
    }
  }
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem('nexlabs_user') || sessionStorage.getItem('nexlabs_user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}
