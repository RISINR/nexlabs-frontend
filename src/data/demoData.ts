import { ResumeData, BasicInfo, Education, Experience, ProfessionalSummary, Certification, Language, Award } from '../contexts/ResumeContext';

export const demoBasicInfo: BasicInfo = {
  profilePicture: undefined,
  photoFrameShape: 'rounded',
  fullName: 'Sarah Anderson',
  firstName: 'Sarah',
  lastName: 'Anderson',
  professionalTitle: 'Senior Product Designer',
  futureGoal: 'Lead Design at Tech Innovation Company',
  email: 'sarah.anderson@email.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  socialProfiles: [
    {
      platform: 'linkedin',
      username: 'sarah-anderson-design'
    },
    {
      platform: 'portfolio',
      username: 'sarahdesign.com'
    },
    {
      platform: 'github',
      username: 'sarahdesigns'
    }
  ]
};

export const demoEducation: Education = {
  university: 'California Institute of Technology (Caltech)',
  degree: 'Master of Science',
  major: 'Human-Computer Interaction',
  graduationYear: '2019',
  gpax: '3.92',
  coursework: [
    'User Interface Design',
    'User Research & Testing',
    'Design Systems',
    'Web Development'
  ],
  additionalEntries: [
    {
      university: 'University of Washington',
      degree: 'Bachelor of Arts',
      major: 'Graphic Design',
      graduationYear: '2017',
      gpax: '3.85',
      coursework: [
        'Digital Design',
        'Branding',
        'Typography'
      ]
    }
  ]
};

export const demoExperiences: Experience[] = [
  {
    id: '1',
    type: 'work',
    title: 'Senior Product Designer',
    organization: 'TechVision Inc.',
    role: 'Design Lead',
    startDate: '2021-03',
    endDate: 'present',
    situation: 'The company needed to redesign their flagship product to improve user engagement and reduce churn rate.',
    action: 'Led a cross-functional team of 5 designers to conduct user research, create wireframes, and develop a comprehensive design system.',
    result: 'Increased user engagement by 45%, reduced onboarding time by 30%, and improved NPS score from 42 to 72.',
    skills: ['Figma', 'Prototyping', 'User Research', 'Design Systems', 'Leadership']
  },
  {
    id: '2',
    type: 'work',
    title: 'Product Designer',
    organization: 'Digital Innovations LLC',
    role: 'UX/UI Designer',
    startDate: '2019-07',
    endDate: '2021-02',
    situation: 'The mobile app had low retention rates and poor user feedback scores.',
    action: 'Redesigned the entire user interface and created new user flows based on extensive user testing and analytics data.',
    result: 'Improved app retention rate by 35% and achieved 4.8-star rating on app stores.',
    skills: ['UI Design', 'Mobile Design', 'Sketch', 'User Testing', 'Analytics']
  },
  {
    id: '3',
    type: 'project',
    title: 'Sustainable E-commerce Platform',
    organization: 'Side Project',
    startDate: '2020-06',
    endDate: '2020-12',
    situation: 'Created a platform for small businesses to sell eco-friendly products.',
    action: 'Designed the complete user interface and user experience for customer and vendor dashboards.',
    result: 'Launched successfully with 500+ registered vendors and 10K+ monthly active users.',
    skills: ['UX Design', 'Figma', 'Product Strategy']
  },
  {
    id: '4',
    type: 'camp',
    title: 'Design Leadership Workshop',
    organization: 'Design bootcamp Academy',
    startDate: '2020-01',
    endDate: '2020-02',
    situation: 'Participated in an intensive design leadership program.',
    action: 'Completed courses on design thinking, team management, and product strategy.',
    result: 'Earned certificate of completion and applied learnings to lead design team at current company.',
    skills: ['Design Thinking', 'Leadership', 'Communication']
  },
  {
    id: '5',
    type: 'competition',
    title: 'Global Design Challenge 2019',
    organization: 'International Design Association',
    startDate: '2019-04',
    endDate: '2019-06',
    situation: 'Competed in international design competition with 500+ participants.',
    action: 'Created an innovative health-tech application prototype and presented to judges.',
    result: 'Won 2nd place award and received media coverage in design publications.',
    skills: ['Design', 'Presentation', 'Innovation']
  }
];

export const demoProfessionalSummary: ProfessionalSummary = {
  role: 'Senior Product Designer',
  experience: '5+ years',
  skills: ['Product Design', 'UX/UI Design', 'Design Systems', 'Figma', 'Prototyping', 'User Research', 'Leadership', 'Design Thinking'],
  goal: 'To lead design initiatives at a forward-thinking tech company, creating products that make meaningful impact in users\' lives while driving business growth.',
  description: 'Passionate designer with proven track record of creating user-centered products that drive engagement and business results. Experienced in leading cross-functional teams, conducting user research, and implementing design systems. Strong advocate for design thinking and agile methodology.'
};

export const demoCertifications: Certification[] = [
  {
    name: 'Google UX Design Certificate',
    issuer: 'Google',
    year: '2021'
  },
  {
    name: 'Figma Advanced Certification',
    issuer: 'Figma Academy',
    year: '2021'
  }
];

export const demoLanguages: Language[] = [
  {
    name: 'English',
    level: 'Native'
  },
  {
    name: 'Spanish',
    level: 'Fluent'
  }
];

export const completeDemoResume: ResumeData = {
  selectedTemplate: 'modern-creative',
  templateColor: '#7c3aed',
  headingFont: 'Inter',
  bodyFont: 'Inter',
  basicInfo: demoBasicInfo,
  education: demoEducation,
  experiences: demoExperiences,
  professionalSummary: demoProfessionalSummary,
  certifications: demoCertifications,
  languages: demoLanguages,
  sectionFontSizes: {
    basic: 1,
    education: 1,
    summary: 1,
    experience: 1,
    additional: 1,
  }
};
