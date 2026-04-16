/**
 * AI API Service - Gemini Integration
 * ใช้สำหรับเรียก Gemini AI endpoints จาก frontend
 */

import type {
  BiasDailySeriesApiResponse,
  BiasThresholdListApiResponse,
  BiasThresholdUpdatePayload,
  BiasThresholdUpsertApiResponse,
} from './aiBiasSchemas';

const env = (import.meta as ImportMeta & { env?: Record<string, string> }).env || {};
const API_BASE_URL = env.VITE_API_URL || 'http://localhost:5000';

class AIService {
  private baseURL: string;

  constructor() {
    this.baseURL = `${API_BASE_URL}/api/ai`;
  }

  /**
   * ได้รับ JWT token จาก localStorage
   */
  private getToken(): string {
    return (
      localStorage.getItem('nexlabs_token') ||
      sessionStorage.getItem('nexlabs_token') ||
      localStorage.getItem('token') ||
      sessionStorage.getItem('token') ||
      ''
    );
  }

  /**
   * วิเคราะห์เรซูเม่
   * @param resumeText - ข้อความเรซูเม่
   */
  async analyzeResume(resumeText: string) {
    try {
      const response = await fetch(`${this.baseURL}/analyze-resume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify({ resumeText })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error analyzing resume:', error);
      throw error;
    }
  }

  /**
   * สร้างคำแนะนำเรซูเม่
   * @param jobTitle - ชื่อตำแหน่ง
   * @param experience - ประสบการณ์
   * @param skills - ทักษะ
   */
  async generateResumeSuggestions(
    jobTitle: string,
    experience: string,
    skills: string
  ) {
    try {
      const response = await fetch(`${this.baseURL}/resume-suggestions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify({ jobTitle, experience, skills })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating resume suggestions:', error);
      throw error;
    }
  }

  /**
   * สร้างคำถามสัมภาษณ์
   * @param jobTitle - ชื่อตำแหน่ง
   * @param industry - อุตสาหกรรม
   * @param level - ระดับ (beginner, intermediate, advanced)
   */
  async generateInterviewQuestions(
    jobTitle: string,
    industry: string,
    level: string
  ) {
    try {
      const response = await fetch(`${this.baseURL}/interview-questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify({ jobTitle, industry, level })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating interview questions:', error);
      throw error;
    }
  }

  /**
   * ให้คะแนนคำตอบสัมภาษณ์
   * @param question - คำถาม
   * @param answer - คำตอบ
   */
  async rateInterviewAnswer(question: string, answer: string) {
    try {
      const response = await fetch(`${this.baseURL}/rate-interview-answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify({ question, answer })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error rating interview answer:', error);
      throw error;
    }
  }

  async getJobDescriptions() {
    try {
      const response = await fetch(`${this.baseURL}/job-descriptions`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error loading job descriptions:', error);
      throw error;
    }
  }

  async uploadAndAnalyzeResume(file: File, jobIds: string[]) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('jobIds', JSON.stringify(jobIds));

      const response = await fetch(`${this.baseURL}/upload-and-analyze`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody?.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error uploading and analyzing resume:', error);
      throw error;
    }
  }

  async analyzeResumeContext(
    resumeText: string,
    jobIds: string[],
    fileName = 'resume-builder',
    resumeFingerprint?: string
  ) {
    try {
      const response = await fetch(`${this.baseURL}/analyze-resume-context`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify({ resumeText, jobIds, fileName, resumeFingerprint })
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody?.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error analyzing resume context:', error);
      throw error;
    }
  }

  async getAnalysisById(analysisId: string) {
    try {
      const response = await fetch(`${this.baseURL}/analysis/${analysisId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error loading analysis by id:', error);
      throw error;
    }
  }

  async getUserAnalyses(limit: number = 20, skip: number = 0) {
    try {
      const url = new URL(`${this.baseURL}/user/analyses`);
      url.searchParams.append('limit', String(limit));
      url.searchParams.append('skip', String(skip));

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error loading user analyses:', error);
      throw error;
    }
  }

  async deleteAnalysis(analysisId: string) {
    try {
      const response = await fetch(`${this.baseURL}/analysis/${analysisId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting analysis:', error);
      throw error;
    }
  }

  async deleteUserAnalyses() {
    try {
      const response = await fetch(`${this.baseURL}/user/analyses`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting user analyses:', error);
      throw error;
    }
  }

  async suggestSkillsForRole(roleTitle: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/resume-ai/suggest-skills-for-role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify({ roleTitle })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error suggesting skills for role:', error);
      throw error;
    }
  }

  async getBiasDailySeries(days: number = 30, jobIds: string[] = []): Promise<BiasDailySeriesApiResponse> {
    try {
      const url = new URL(`${this.baseURL}/admin/bias-audit/daily-series`);
      url.searchParams.append('days', String(days));
      if (jobIds.length) {
        url.searchParams.append('jobIds', jobIds.join(','));
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error loading bias daily series:', error);
      throw error;
    }
  }

  async getBiasThresholds(): Promise<BiasThresholdListApiResponse> {
    try {
      const response = await fetch(`${this.baseURL}/admin/bias-thresholds`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error loading bias thresholds:', error);
      throw error;
    }
  }

  async updateBiasThreshold(jobId: string, payload: BiasThresholdUpdatePayload): Promise<BiasThresholdUpsertApiResponse> {
    try {
      const response = await fetch(`${this.baseURL}/admin/bias-thresholds/${encodeURIComponent(jobId)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getToken()}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating bias threshold:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const aiService = new AIService();
export default AIService;
