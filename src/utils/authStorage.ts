export type AuthUser = Record<string, any>;

function pickStorage(remember = true): Storage {
  return remember ? localStorage : sessionStorage;
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return (
    localStorage.getItem('nexlabs_token') ||
    sessionStorage.getItem('nexlabs_token') ||
    localStorage.getItem('token') ||
    sessionStorage.getItem('token')
  );
}

export function getAuthUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('nexlabs_user') || sessionStorage.getItem('nexlabs_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setAuthSession(token: string, user?: AuthUser, remember = true) {
  if (typeof window === 'undefined') return;
  const target = pickStorage(remember);
  const other = target === localStorage ? sessionStorage : localStorage;

  target.setItem('nexlabs_token', token);
  if (user) {
    target.setItem('nexlabs_user', JSON.stringify(user));
  }

  // Keep legacy key for backward compatibility with older code paths.
  target.setItem('token', token);

  // Ensure single active storage to avoid stale auth state.
  other.removeItem('nexlabs_token');
  other.removeItem('nexlabs_user');
  other.removeItem('token');

  try {
    window.dispatchEvent(new CustomEvent('nexlabs:auth-changed', { detail: user || null }));
  } catch {
    // ignore
  }
}

export function clearAuthSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('nexlabs_token');
  localStorage.removeItem('nexlabs_user');
  localStorage.removeItem('token');
  localStorage.removeItem('keepLoggedIn');
  sessionStorage.removeItem('nexlabs_token');
  sessionStorage.removeItem('nexlabs_user');
  sessionStorage.removeItem('token');
  try {
    window.dispatchEvent(new CustomEvent('nexlabs:auth-changed', { detail: null }));
  } catch {
    // ignore
  }
}

export function migrateLegacyAuth() {
  if (typeof window === 'undefined') return;

  const legacyToken = localStorage.getItem('token') || sessionStorage.getItem('token');
  const currentToken = localStorage.getItem('nexlabs_token') || sessionStorage.getItem('nexlabs_token');
  if (!currentToken && legacyToken) {
    const remember = localStorage.getItem('keepLoggedIn') === 'true';
    setAuthSession(legacyToken, getAuthUser() || undefined, remember);
  }
}
