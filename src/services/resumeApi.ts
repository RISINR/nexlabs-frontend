import { useState, useCallback } from 'react';
import { ResumeData } from '../contexts/ResumeContext';
import { getAuthToken } from '../utils/authStorage';

const RAW_API_BASE_URL = import.meta.env.VITE_API_URL || '';
const API_BASE_URL = RAW_API_BASE_URL.replace(/\/$/, '').endsWith('/api')
  ? RAW_API_BASE_URL.replace(/\/$/, '')
  : `${RAW_API_BASE_URL.replace(/\/$/, '')}/api`;

// Helper function to get auth headers with JWT token
function getAuthHeaders() {
  const token = getAuthToken();
  
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
}

async function getErrorMessage(response: Response, fallback: string) {
  const text = await response.text();
  if (!text) return fallback;

  try {
    const parsed = JSON.parse(text);
    return parsed.error || parsed.message || fallback;
  } catch {
    // Backend sometimes returns HTML (e.g. proxy/404). Keep message user-friendly.
    return fallback;
  }
}

interface Resume extends ResumeData {
  _id: string;
  userId: string;
  resumeName: string;
  status: 'draft' | 'completed';
  createdAt: string;
  updatedAt: string;
}

interface ListResumeItem {
  _id: string;
  resumeName: string;
  status: 'draft' | 'completed';
  selectedTemplate: string;
  templateColor?: string;
  headingFont?: string;
  bodyFont?: string;
  sectionFontSizes?: ResumeData['sectionFontSizes'];
  createdAt: string;
  updatedAt: string;
  basicInfo?: ResumeData['basicInfo'];
  education?: ResumeData['education'];
  experiences?: ResumeData['experiences'];
  professionalSummary?: ResumeData['professionalSummary'];
  certifications?: ResumeData['certifications'];
  languages?: ResumeData['languages'];
  awards?: ResumeData['awards'];
  interests?: ResumeData['interests'];
}

// Hook: Create new resume
export const useCreateResume = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createResume = useCallback(
    async (resumeName: string, selectedTemplate: string = '') => {
      setLoading(true);
      setError(null);

      try {
        const token = getAuthToken();

        if (!token) {
          throw new Error('Please login again');
        }

        const response = await fetch(`${API_BASE_URL}/resume/create`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({ resumeName, selectedTemplate }),
        });

        if (!response.ok) {
          const message = await getErrorMessage(response, 'Failed to create resume');
          throw new Error(message);
        }

        const data = await response.json();
        return data.resume;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create resume';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { createResume, loading, error };
};

// Hook: Fetch list of user's resumes
export const useListResumes = () => {
  const [resumes, setResumes] = useState<ListResumeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResumes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/resume/list`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const message = await getErrorMessage(response, 'Failed to fetch resumes');
        throw new Error(message);
      }

      const data = await response.json();
      setResumes(data.resumes || []);
      return data.resumes;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch resumes';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { resumes, fetchResumes, loading, error };
};

// Hook: Fetch single resume
export const useGetResume = () => {
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getResume = useCallback(async (resumeId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/resume/${resumeId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const message = await getErrorMessage(response, 'Failed to fetch resume');
        throw new Error(message);
      }

      const data = await response.json();
      setResume(data.resume);
      return data.resume;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch resume';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { resume, getResume, loading, error };
};

// Hook: Update entire resume
export const useUpdateResume = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateResume = useCallback(async (resumeId: string, updateData: Partial<ResumeData>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/resume/${resumeId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const message = await getErrorMessage(response, 'Failed to update resume');
        throw new Error(message);
      }

      const data = await response.json();
      return data.resume;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update resume';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateResume, loading, error };
};

// Hook: Update single resume section
export const useUpdateResumeSection = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateSection = useCallback(
    async (
      resumeId: string,
      sectionName: string,
      sectionData: any
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_BASE_URL}/resume/${resumeId}/section/${sectionName}`,
          {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify(sectionData),
          }
        );

        if (!response.ok) {
          const message = await getErrorMessage(response, 'Failed to update section');
          throw new Error(message);
        }

        const data = await response.json();
        return data.resume;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update section';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { updateSection, loading, error };
};

// Hook: Update resume status (draft/completed)
export const useUpdateResumeStatus = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = useCallback(async (resumeId: string, status: 'draft' | 'completed') => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/resume/${resumeId}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const message = await getErrorMessage(response, 'Failed to update status');
        throw new Error(message);
      }

      const data = await response.json();
      return data.resume;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update status';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateStatus, loading, error };
};

// Hook: Delete resume
export const useDeleteResume = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteResume = useCallback(async (resumeId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/resume/${resumeId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const message = await getErrorMessage(response, 'Failed to delete resume');
        throw new Error(message);
      }

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete resume';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteResume, loading, error };
};

// Debounced auto-save function
export const useAutoSaveResume = (resumeId: string | null, debounceMs = 1000) => {
  const { updateResume } = useUpdateResume();
  const [isSaving, setIsSaving] = useState(false);

  const autoSave = useCallback(
    async (resumeData: Partial<ResumeData>) => {
      if (!resumeId) return;

      setIsSaving(true);
      try {
        await updateResume(resumeId, resumeData);
      } catch (err) {
        console.error('Auto-save failed:', err);
      } finally {
        setIsSaving(false);
      }
    },
    [resumeId, updateResume]
  );

  return { autoSave, isSaving };
};
