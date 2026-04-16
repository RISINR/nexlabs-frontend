import { ResumeData } from '../contexts/ResumeContext';

export interface ResumeProgressItem {
  label: string;
  completed: boolean;
}

export interface ResumeProgressSummary {
  completedCount: number;
  totalCount: number;
  percentage: number;
  items: ResumeProgressItem[];
}

const hasText = (value?: string) => Boolean(value && value.trim().length > 0);

const hasMeaningfulExperience = (resume?: ResumeData['experiences']) => {
  if (!Array.isArray(resume) || !resume.length) return false;

  return resume.some((experience) => (
    hasText(experience?.title) &&
    hasText(experience?.organization) &&
    (hasText(experience?.startDate) || hasText(experience?.endDate) || hasText(experience?.role)) &&
    (hasText(experience?.situation) || hasText(experience?.action) || hasText(experience?.result) || (experience?.skills?.length || 0) > 0)
  ));
};

const hasAdditionalInfo = (resume?: ResumeData) => {
  if (!resume) return false;

  return Boolean(
    (resume.certifications || []).some((item) => hasText(item?.name) || hasText(item?.issuer) || hasText(item?.year)) ||
    (resume.languages || []).some((item) => hasText(item?.name) || hasText(item?.level)) ||
    (resume.awards || []).some((item) => hasText(item?.title) || hasText(item?.issuer) || hasText(item?.year)) ||
    (resume.interests || []).some((interest) => hasText(interest))
  );
};

export const calculateResumeProgress = (resume?: Partial<ResumeData> | null): ResumeProgressSummary => {
  const basicInfo = resume?.basicInfo;
  const education = resume?.education;
  const professionalSummary = resume?.professionalSummary;

  const items: ResumeProgressItem[] = [
    {
      label: 'Basic Info',
      completed: Boolean(
        basicInfo &&
        hasText(basicInfo.fullName) &&
        hasText(basicInfo.professionalTitle) &&
        hasText(basicInfo.email) &&
        hasText(basicInfo.phone)
      ),
    },
    {
      label: 'Education',
      completed: Boolean(
        education &&
        hasText(education.university) &&
        hasText(education.major) &&
        hasText(education.graduationYear) &&
        hasText(education.gpax)
      ),
    },
    {
      label: 'Experience',
      completed: hasMeaningfulExperience(resume?.experiences),
    },
    {
      label: 'Professional Summary',
      completed: Boolean(
        professionalSummary &&
        hasText(professionalSummary.role) &&
        hasText(professionalSummary.experience) &&
        hasText(professionalSummary.goal) &&
        hasText(professionalSummary.description) &&
        (professionalSummary.skills || []).some((skill) => hasText(skill))
      ),
    },
    {
      label: 'Additional Info',
      completed: hasAdditionalInfo(resume as ResumeData),
    },
  ];

  const completedCount = items.filter((item) => item.completed).length;
  const totalCount = items.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return { items, completedCount, totalCount, percentage };
};