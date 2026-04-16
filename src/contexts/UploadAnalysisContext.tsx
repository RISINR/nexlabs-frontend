import React, { createContext, useState, useContext } from 'react';

export interface JobAnalysisResult {
  jobId: string;
  jobTitle: string;
  requiredSkills: string[];
  optionalSkills: string[];
  matchedRequiredSkills: string[];
  matchedOptionalSkills: string[];
  missingRequiredSkills: string[];
  missingOptionalSkills: string[];
  matchScore: number;
  rankingScore?: number;
  scoreInterpretation?: {
    band?: string;
    label?: string;
    summary?: string;
  };
  scoreBreakdown?: {
    score?: number;
    requiredScore?: number;
    optionalScore?: number;
    structureScore?: number;
    missingPenalty?: number;
  };
}

export interface SkillGapSummary {
  summary: string;
  priorities: string[];
  nextSteps: string[];
}

export interface ResumeDetails {
  detectedLanguage: string;
  textStats: {
    lineCount: number;
    wordCount: number;
    charCount: number;
  };
  contact: {
    emails: string[];
    phones: string[];
  };
  rawPreview: string;
  translatedPreview: string;
  cleanedPreview: string;
  extractionMode: string;
}

export interface RecommendationsBySection {
  resumeSummary: string[];
  experience: string[];
  projects: string[];
  skills: string[];
}

export interface ExtractedResumeData {
  skills: string[];
  experience: string[];
  projects: string[];
  education: string[];
}

export interface UploadedAnalysis {
  analysisId: string;
  userId?: string;
  overallScore: number;
  language: string;
  normalizedResumeSkills: string[];
  matchedRequiredSkills: string[];
  matchedOptionalSkills: string[];
  missingRequiredSkills: string[];
  missingOptionalSkills: string[];
  jobResults: JobAnalysisResult[];
  skillGapSummary: SkillGapSummary;
  resumeDetails?: ResumeDetails;
  recommendationsBySection?: RecommendationsBySection;
  resumeData?: ExtractedResumeData;
  aiUsage?: {
    summarySource?: string;
    tokenSaving?: {
      clippedTextForAiChars?: number;
      usedHeuristicExtraction?: boolean;
      skippedAiSummary?: boolean;
    };
  };
  selectedJobIds: string[];
  fileName: string;
  fileMimeType?: string;
  filePreviewUrl?: string;
  uploadDate: string;
}

interface UploadAnalysisContextType {
  analysis: UploadedAnalysis | null;
  setAnalysis: (analysis: UploadedAnalysis | null) => void;
}

const UploadAnalysisContext = createContext<UploadAnalysisContextType | undefined>(undefined);

export function UploadAnalysisProvider({ children }: { children: React.ReactNode }) {
  const [analysis, setAnalysis] = useState<UploadedAnalysis | null>(null);

  return (
    <UploadAnalysisContext.Provider value={{ analysis, setAnalysis }}>
      {children}
    </UploadAnalysisContext.Provider>
  );
}

export function useUploadAnalysis() {
  const context = useContext(UploadAnalysisContext);
  if (!context) {
    throw new Error('useUploadAnalysis must be used within UploadAnalysisProvider');
  }
  return context;
}
