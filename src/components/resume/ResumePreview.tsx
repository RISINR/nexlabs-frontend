import React from 'react';
import { ResumeData, ResumeContext, useResume } from '../../contexts/ResumeContext';
import { templates } from '../../data/templates';
import MinimalSleekTemplate from '../templates/MinimalSleekTemplate';
import { PREVIEW_MIN_WIDTH, PREVIEW_MD_WIDTH } from '../../utils/previewSize';

interface ResumePreviewProps {
  scale?: number; // for scaling the preview (0.5 = 50%, 1 = 100%)
  previewTemplateId?: string; // for previewing a template without selecting it
  showExample?: boolean;
  onEditSection?: (
    section: 'basic' | 'photo' | 'contact' | 'education' | 'summary' | 'experience' | 'additional',
    meta?: { bounds?: { top: number; left: number; width: number; height: number } }
  ) => void;
  previewResumeData?: Partial<ResumeData>;
}

export default function ResumePreview({ scale = 1, previewTemplateId, showExample = false, onEditSection, previewResumeData }: ResumePreviewProps) {
  const resumeContext = useResume();
  const { resumeData, displayResumeData } = resumeContext;

  const effectiveDisplayResumeData = previewResumeData
    ? ({
        ...displayResumeData,
        ...previewResumeData,
      } as ResumeData)
    : displayResumeData;

  // Get selected template or default to minimal-sleek
  // If previewTemplateId is provided, use it instead (for template detail page)
  const selectedTemplateId = previewTemplateId || effectiveDisplayResumeData.selectedTemplate || resumeData.selectedTemplate || 'minimal-sleek';
  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);
  const TemplateComponent = selectedTemplate?.Preview || MinimalSleekTemplate;

  const previewScopedContext = previewResumeData
    ? {
        ...resumeContext,
        displayResumeData: effectiveDisplayResumeData,
      }
    : resumeContext;

  return (
    <ResumeContext.Provider value={previewScopedContext}>
      <div className="w-full h-full flex items-center justify-center bg-white">
        <div
          className="relative bg-white overflow-hidden w-full"
          data-resume-paper
          style={{
            aspectRatio: '8.5 / 11',
            height: 'auto',
            margin: '0 auto',
            maxWidth: `${PREVIEW_MD_WIDTH}px`,
            width: '100%',
            // set a consistent base font-size so templates using em/rem scale predictably
            fontSize: '16px',
          }}
        >
          <div className="w-full h-full" style={{ boxSizing: 'border-box' }}>
            <TemplateComponent {...({ scale, showExample, onEditSection } as any)} />
          </div>
        </div>
      </div>
    </ResumeContext.Provider>
  );
}
