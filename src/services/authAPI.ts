import { clearAuthSession } from '../utils/authStorage';
import { API_BASE_URL } from '../utils/apiBase';

export const authAPI = {
  register: async (firstName: string, lastName: string, email: string, password: string, displayName?: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, password, displayName })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    return response.json();
  },

  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    return response.json();
  },

  ssoLogin: async (email: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/sso-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    return response.json();
  },

  googleLogin: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/google-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    return response.json();
  },

  updateProfile: async (token: string, payload: { firstName?: string; lastName?: string; displayName?: string; position?: string; avatar?: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Could not update profile');
    }
    return response.json();
  },

  getCurrentUser: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Could not fetch current user');
    }
    return response.json();
  },

  getResumes: async (token?: string) => {
    const headers: any = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(`${API_BASE_URL}/resumes`, { headers });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Could not fetch resumes');
    }
    return response.json();
  },

  getCommunityFeed: async () => {
    const response = await fetch(`${API_BASE_URL}/community`);
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Could not fetch community feed');
    }
    return response.json();
  },

  verifyToken: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Token ไม่ถูกต้อง');
    return response.json();
  },

  requestPasswordReset: async (email: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/request-password-reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send reset link');
    }
    return response.json();
  },

  logout: () => {
    clearAuthSession();
  }
};
