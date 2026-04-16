import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Navbar } from '../../components/Navbar';
import { useResume } from '../../contexts/ResumeContext';
import ResumePreview from '../../components/resume/ResumePreview';
import { ArrowLeft, X, Sparkles, Zap } from 'lucide-react';
import { aiService } from '../../services/aiService';
import styles from './BasicInfoPage.module.css';

// Helper function to get auth headers with JWT token
function getAuthHeaders() {
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('nexlabs_token')
      || sessionStorage.getItem('nexlabs_token')
      || localStorage.getItem('token')
      || sessionStorage.getItem('token')
    : null;
  
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
}

const RAW_API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_BASE = RAW_API_BASE.replace(/\/$/, '').endsWith('/api')
  ? RAW_API_BASE.replace(/\/$/, '')
  : `${RAW_API_BASE.replace(/\/$/, '')}/api`;

export default function ProfessionalSummaryPage() {
  const navigate = useNavigate();
  const { resumeData, updateProfessionalSummary } = useResume();
  const basicInfoRole = resumeData.basicInfo?.professionalTitle?.trim() || '';

  React.useEffect(() => {
    if (!resumeData.basicInfo) {
      navigate('/resume/basic-info');
    } else if (!resumeData.education) {
      navigate('/resume/education');
    }
  }, [resumeData, navigate]);

  const [formData, setFormData] = useState({
    role: basicInfoRole || resumeData.professionalSummary?.role || '',
    experience: resumeData.professionalSummary?.experience || '',
    skills: resumeData.professionalSummary?.skills || [],
    showSkillCategories: resumeData.professionalSummary?.showSkillCategories ?? true,
    goal: resumeData.basicInfo?.futureGoal || resumeData.professionalSummary?.goal || '',
    description: resumeData.professionalSummary?.description || '',
  });

  const isRoleMismatch =
    !!basicInfoRole &&
    !!formData.role &&
    basicInfoRole.toLowerCase() !== formData.role.trim().toLowerCase();

  const [skillInput, setSkillInput] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isPolishing, setIsPolishing] = useState(false);
  const [aiProgressFrame, setAiProgressFrame] = useState(0);
  const [aiStatusLabel, setAiStatusLabel] = useState('');
  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [showManualSkillInput, setShowManualSkillInput] = useState(false);
  const [isFetchingRoleSkills, setIsFetchingRoleSkills] = useState(false);
  const [aiSuggestedSkills, setAiSuggestedSkills] = useState<string[]>([]);
  const [skillModalSearch, setSkillModalSearch] = useState('');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const roleDropdownRef = React.useRef<HTMLDivElement | null>(null);
  const typingIntervalRef = React.useRef<number | null>(null);
  const professionalRoleOptions: { label: string; enabled: boolean }[] = [
    { label: 'Frontend Developer', enabled: true },
    { label: 'Backend Developer', enabled: true },
    { label: 'UI/UX Design', enabled: true },
    { label: 'Full-stack Developer', enabled: true },
    { label: 'Senior Front-end Engineer', enabled: false },
    { label: 'Mobile Developer', enabled: false },
    { label: 'iOS Developer', enabled: false },
    { label: 'Android Developer', enabled: false },
    { label: 'DevOps Engineer', enabled: false },
    { label: 'Site Reliability Engineer', enabled: false },
    { label: 'Data Scientist', enabled: false },
    { label: 'Data Analyst', enabled: false },
    { label: 'Machine Learning Engineer', enabled: false },
    { label: 'AI Engineer', enabled: false },
    { label: 'Product Manager', enabled: false },
    { label: 'UX Researcher', enabled: false },
    { label: 'Product Designer', enabled: false },
    { label: 'QA Engineer', enabled: false },
    { label: 'Test Automation Engineer', enabled: false },
    { label: 'Technical Lead', enabled: false },
    { label: 'Engineering Manager', enabled: false },
    { label: 'Software Engineer', enabled: false },
    { label: 'Systems Engineer', enabled: false },
    { label: 'Security Engineer', enabled: false },
    { label: 'Cloud Engineer', enabled: false },
    { label: 'Infrastructure Engineer', enabled: false },
    { label: 'Database Administrator', enabled: false },
    { label: 'Business Analyst', enabled: false },
    { label: 'Frontend Architect', enabled: false },
    { label: 'Backend Architect', enabled: false },
    { label: 'Site Reliability', enabled: false },
    { label: 'Platform Engineer', enabled: false },
    { label: 'Solution Architect', enabled: false },
    { label: 'Technical Program Manager', enabled: false },
  ];

  const hasBasicRoleInOptions = professionalRoleOptions.some(
    (role) => role.label.toLowerCase() === basicInfoRole.toLowerCase()
  );

  const roleSkillMap: Record<string, string[]> = {
    'frontend developer': ['React', 'TypeScript', 'JavaScript', 'Next.js', 'HTML', 'CSS', 'Tailwind CSS', 'Redux', 'Webpack', 'Vite', 'Accessibility', 'Performance'],
    'backend developer': ['Node.js', 'Express', 'NestJS', 'REST API', 'GraphQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'AWS', 'Microservices', 'System Design'],
    'ui/ux design': ['UI Design', 'UX Design', 'Figma', 'Design Systems', 'Prototyping', 'Wireframing', 'User Research', 'Typography', 'Color Theory', 'Accessibility'],
    'full-stack developer': ['React', 'TypeScript', 'Node.js', 'Express', 'REST API', 'GraphQL', 'PostgreSQL', 'MongoDB', 'Docker', 'AWS', 'System Design', 'CI/CD'],
    'data scientist': ['Python', 'Pandas', 'NumPy', 'scikit-learn', 'TensorFlow', 'PyTorch', 'Machine Learning', 'Data Science', 'SQL', 'Data Engineering'],
    'data analyst': ['SQL', 'Python', 'Pandas', 'Data Science', 'ETL', 'Visualization', 'Communication', 'Critical Thinking'],
    'product manager': ['Product Management', 'Communication', 'Leadership', 'User Research', 'A/B Testing', 'Agile', 'Scrum', 'Problem Solving'],
    'devops engineer': ['Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'AWS', 'Azure', 'GCP', 'Monitoring', 'Prometheus', 'Grafana', 'Linux', 'SRE'],
  };

  const recommendedSkills = React.useMemo(() => {
    const role = formData.role.trim().toLowerCase();
    if (!role) return [];

    if (roleSkillMap[role]) return roleSkillMap[role];

    if (role.includes('frontend')) return roleSkillMap['frontend developer'];
    if (role.includes('backend')) return roleSkillMap['backend developer'];
    if (role.includes('full-stack') || role.includes('full stack')) return roleSkillMap['full-stack developer'];
    if (role.includes('ui') || role.includes('ux') || role.includes('design')) return roleSkillMap['ui/ux design'];
    if (role.includes('data scientist')) return roleSkillMap['data scientist'];
    if (role.includes('data analyst')) return roleSkillMap['data analyst'];
    if (role.includes('product manager')) return roleSkillMap['product manager'];
    if (role.includes('devops') || role.includes('site reliability') || role.includes('platform')) return roleSkillMap['devops engineer'];

    return [];
  }, [formData.role]);

  useEffect(() => {
    if (!basicInfoRole) return;
    if (formData.role.trim().toLowerCase() === basicInfoRole.toLowerCase()) return;

    setFormData((prev) => ({ ...prev, role: basicInfoRole }));
  }, [basicInfoRole, formData.role]);

  useEffect(() => {
    const goalFromBasic = resumeData.basicInfo?.futureGoal || '';
    if (goalFromBasic === formData.goal) return;
    setFormData((prev) => ({ ...prev, goal: goalFromBasic }));
  }, [formData.goal, resumeData.basicInfo?.futureGoal]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(e.target as Node)) {
        setShowRoleDropdown(false);
      }
    };

    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const skillSuggestions = [
    'React', 'React Native', 'Next.js', 'Gatsby', 'Vite', 'Vue.js', 'Angular', 'Svelte', 'Ember.js',
    'TypeScript', 'JavaScript', 'ES6+', 'Node.js', 'Deno', 'Express', 'NestJS', 'Koa', 'Fastify',
    'GraphQL', 'Apollo', 'Relay', 'REST API', 'gRPC', 'WebSocket', 'Socket.IO', 'tRPC',
    'HTML', 'CSS', 'Tailwind CSS', 'Sass', 'Less', 'Bootstrap', 'Styled Components', 'Emotion',
    'Redux', 'MobX', 'Recoil', 'Zustand', 'Context API', 'State Management', 'Flux',
    'Webpack', 'Rollup', 'esbuild', 'Babel', 'Vite Plugin', 'Storybook', 'Lerna', 'Turborepo',
    'SQL', 'PostgreSQL', 'MySQL', 'MariaDB', 'SQLite', 'MongoDB', 'Redis', 'Cassandra', 'Elasticsearch', 'ClickHouse',
    'Kafka', 'RabbitMQ', 'NATS', 'Message Queues', 'Streaming', 'Kinesis', 'Pub/Sub',
    'Python', 'Java', 'Go', 'Rust', 'C++', 'C#', 'Scala', 'Kotlin', 'Swift', 'Objective-C', 'R',
    'Pandas', 'NumPy', 'scikit-learn', 'TensorFlow', 'PyTorch', 'Keras', 'XGBoost', 'LightGBM',
    'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'Data Science', 'Data Engineering', 'ETL', 'Spark', 'Hadoop', 'Flink', 'Airflow',
    'Docker', 'Kubernetes', 'Helm', 'Docker Compose', 'Podman', 'Terraform', 'Pulumi', 'CloudFormation', 'Ansible', 'Puppet', 'Chef',
    'AWS', 'Amazon Web Services', 'EC2', 'S3', 'RDS', 'ECS', 'EKS', 'Lambda', 'Route53', 'VPC', 'IAM',
    'Azure', 'Microsoft Azure', 'Azure Functions', 'Azure DevOps', 'GCP', 'Google Cloud Platform', 'Compute Engine', 'Cloud Run', 'Cloud Functions', 'BigQuery', 'Firebase',
    'Serverless', 'FaaS', 'BaaS', 'CI/CD', 'GitHub Actions', 'GitLab CI', 'CircleCI', 'Jenkins', 'Argo CD', 'Tekton',
    'Monitoring', 'Prometheus', 'Grafana', 'ELK', 'Elastic Stack', 'Datadog', 'New Relic', 'Sentry', 'Honeycomb',
    'Nginx', 'HAProxy', 'Envoy', 'Traefik', 'Load Balancing', 'Caching', 'Redis Cache', 'Varnish', 'Performance Optimization', 'Profiling',
    'Microservices', 'Monolith', 'System Design', 'Distributed Systems', 'Event-driven', 'CQRS', 'SRE', 'Site Reliability',
    'Security', 'Application Security', 'OWASP', 'Penetration Testing', 'Authentication', 'Authorization', 'OAuth', 'OpenID', 'JWT', 'SSO',
    'Testing', 'Unit Testing', 'Integration Testing', 'End-to-End', 'E2E', 'Jest', 'Mocha', 'Chai', 'AVA', 'Cypress', 'Playwright', 'Selenium',
    'Git', 'GitOps', 'Linux', 'Bash', 'Zsh', 'PowerShell', 'Shell Scripting', 'CI', 'DevOps', 'Platform Engineering', 'Observability', 'Logging',
    'Accessibility', 'a11y', 'Internationalization', 'i18n', 'Localization', 'Performance', 'Web Vitals', 'SEO',
    // Design / Figma related
    'Figma', 'Figma Plugins', 'Figma Prototyping', 'FigJam', 'Sketch', 'Adobe XD', 'Adobe Illustrator', 'Adobe Photoshop',
    'Framer', 'Framer Motion', 'Principle', 'InVision', 'ProtoPie', 'Marvel', 'After Effects', 'Lottie',
    'UI Design', 'UX Design', 'Interaction Design', 'Visual Design', 'Product Design', 'Service Design',
    'Design Systems', 'Design Tokens', 'Atomic Design', 'Style Guides', 'Component Libraries', 'Iconography', 'Typography', 'Color Theory',
    'Wireframing', 'Prototyping', 'User Flows', 'Information Architecture', 'User Research', 'Usability Testing', 'A/B Testing', 'Heuristic Evaluation',
    'User Interviews', 'Journey Mapping', 'Persona', 'Content Strategy', 'Copywriting', 'Responsive Design', 'Mobile-first', 'Accessibility Testing',
    'Design Collaboration', 'Cross-functional', 'DesignOps', 'Handoff (Zeplin/Figma)', 'Motion Design', 'Microinteractions', 'Microcopy',
    'Open Source', 'Contribution', 'Community', 'Hackathon', 'Startup', 'Leadership', 'Mentoring', 'Product Management', 'Program Management',
    'Agile', 'Scrum', 'Kanban', 'OKR', 'Project Management', 'Problem Solving', 'Critical Thinking', 'Communication', 'Collaboration', 'Teamwork',
    'Open Source', 'Hackathon', 'Photography', 'Containers', 'Cloud', 'Deployment', 'Security'
  ];

  const filteredSkillSuggestions = skillInput.trim()
    ? skillSuggestions.filter(s => s.toLowerCase().includes(skillInput.trim().toLowerCase()) && !formData.skills.includes(s))
    : skillSuggestions.filter(s => !formData.skills.includes(s));

  const recommendedSkillSet = new Set(recommendedSkills.map((skill) => skill.toLowerCase()));
  const prioritizedSkillSuggestions = recommendedSkills.length > 0
    ? [
        ...filteredSkillSuggestions.filter((skill) => recommendedSkillSet.has(skill.toLowerCase())),
        ...filteredSkillSuggestions.filter((skill) => !recommendedSkillSet.has(skill.toLowerCase())),
      ]
    : filteredSkillSuggestions;

  const modalFilteredSkills = skillModalSearch.trim()
    ? skillSuggestions.filter((skill) => skill.toLowerCase().includes(skillModalSearch.trim().toLowerCase()))
    : skillSuggestions;

  const addSkillByValue = (value: string) => {
    const v = value.trim();
    if (!v) return;
    if (!formData.skills.includes(v)) {
      const nextSkills = [...formData.skills, v];
      setFormData({ ...formData, skills: nextSkills });
    }
    setSkillInput('');
  };

  const handleRoleSkillMatch = async () => {
    if (!formData.role.trim()) {
      return;
    }

    try {
      const data = await aiService.suggestSkillsForRole(formData.role);
      const suggestions = Array.isArray(data?.suggestedSkills) ? data.suggestedSkills : [];
      setAiSuggestedSkills(suggestions.length > 0 ? suggestions : recommendedSkills);
    } catch (error) {
      console.error('Error fetching role skill suggestions:', error);
      setAiSuggestedSkills(recommendedSkills);
    } finally {
      setIsFetchingRoleSkills(false);
    }
  };

  // Auto-save form data in real-time
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.role || formData.experience || formData.skills.length > 0 || formData.goal || formData.description) {
        updateProfessionalSummary(formData);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [formData, updateProfessionalSummary]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/resume/experience-stack');
  };

  const addSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!formData.skills.includes(skillInput.trim())) {
        setFormData({
          ...formData,
          skills: [...formData.skills, skillInput.trim()],
        });
      }
      setSkillInput('');
    }
  };

  // Prevent page scroll when modal/dropdown is open
  React.useEffect(() => {
    if (showSkillsModal || showRoleDropdown) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'auto';
      };
    }
  }, [showSkillsModal, showRoleDropdown]);

  const removeSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skill),
    });
  };

  const toggleSkill = (skill: string) => {
    setFormData((prev) => {
      const nextSkills = prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill];

      updateProfessionalSummary({ ...prev, skills: nextSkills });

      if (prev.skills.includes(skill)) {
        return { ...prev, skills: nextSkills };
      }
      return { ...prev, skills: nextSkills };
    });
  };

  const handleAIPolish = async () => {
    if (!formData.description.trim()) {
      alert('Please write a summary first before polishing');
      return;
    }

    setIsPolishing(true);
    setAiStatusLabel('Polishing your summary');
    try {
      const response = await fetch(`${API_BASE}/resume-ai/improve-summary`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          summary: formData.description,
          role: formData.role,
          skills: formData.skills
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to improve summary');
      }

      const data = await response.json();
      const fullText = typeof data.improvedSummary === 'string' ? data.improvedSummary : '';
      setAiStatusLabel('Applying result with typing effect');
      await typeSummaryWithEffect(fullText);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'AI polish failed';
      alert(`AI Error: ${msg}`);
      console.error('AI Polish error:', error);
    } finally {
      setIsPolishing(false);
      setAiStatusLabel('');
    }
  };

  const handleAISuggest = async () => {
    if (!formData.role.trim()) {
      alert('Please select a role first');
      return;
    }

    setIsPolishing(true);
    setAiStatusLabel('Generating summary');
    try {
      const response = await fetch(`${API_BASE}/resume-ai/generate-summary`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          role: formData.role,
          yearsOfExperience: formData.experience,
          skills: formData.skills,
          education: resumeData.education?.major
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to generate summary');
      }

      const data = await response.json();
      const fullText = typeof data.summary === 'string' ? data.summary : '';
      setAiStatusLabel('Applying result with typing effect');
      await typeSummaryWithEffect(fullText);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'AI suggest failed';
      alert(`AI Error: ${msg}`);
      console.error('AI Suggest error:', error);
    } finally {
      setIsPolishing(false);
      setAiStatusLabel('');
    }
  };

  const typeSummaryWithEffect = React.useCallback(async (text: string) => {
    if (typingIntervalRef.current) {
      window.clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }

    setFormData((prev) => ({ ...prev, description: '' }));

    await new Promise<void>((resolve) => {
      if (!text) {
        resolve();
        return;
      }

      let pointer = 0;
      const step = text.length > 600 ? 6 : 4;
      typingIntervalRef.current = window.setInterval(() => {
        pointer = Math.min(text.length, pointer + step);
        const nextValue = text.slice(0, pointer);
        setFormData((prev) => ({ ...prev, description: nextValue }));

        if (pointer >= text.length && typingIntervalRef.current) {
          window.clearInterval(typingIntervalRef.current);
          typingIntervalRef.current = null;
          resolve();
        }
      }, 20);
    });
  }, []);

  useEffect(() => {
    if (!isPolishing) {
      setAiProgressFrame(0);
      return;
    }

    const timer = window.setInterval(() => {
      setAiProgressFrame((prev) => (prev + 1) % 4);
    }, 240);

    return () => {
      window.clearInterval(timer);
    };
  }, [isPolishing]);

  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        window.clearInterval(typingIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.container}>
      <Navbar />

      <div className={styles.gridLayout}>
        {/* Left Column: Preview */}
        <div className={styles.previewColumn}>
          <div className={styles.previewSticky}>
            <div className={styles.previewCard}>
              <ResumePreview scale={1} />
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className={styles.formColumn}>
          <div className={styles.formSticky}>
            <div className={styles.formCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <button
                  onClick={() => navigate('/resume/education')}
                  type="button"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 0',
                    color: 'rgb(75, 85, 99)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = 'rgb(17, 24, 39)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = 'rgb(75, 85, 99)';
                  }}
                >
                  <ArrowLeft size={16} />
                  <span>Back to Education</span>
                </button>
                <button
                  type="button"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#000000',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    cursor: 'default',
                    padding: '0.5rem 0',
                  }}
                  disabled
                >
                  ✓ Auto-saved
                </button>
              </div>

              {/* Title */}
              <h1 className={styles.formTitle}>Professional</h1>
              <p className={styles.description} style={{ marginBottom: '2rem', marginTop: '-1rem' }}>
                Tell your story and highlight what makes you stand out. Please write in English.
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Professional Roles Section */}
                <div className={styles.formGroup} ref={roleDropdownRef} style={{ position: 'relative' }}>
                  <label className={styles.formLabel}>Professional Role *</label>
                  <button
                    type="button"
                    className={styles.formInput}
                    onClick={() => {}}
                    aria-expanded={showRoleDropdown}
                    aria-haspopup="listbox"
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingRight: '0.9rem',
                      cursor: 'not-allowed',
                      backgroundColor: 'rgb(248, 250, 252)',
                    }}
                  >
                    <span style={{ color: formData.role ? 'rgb(17, 24, 39)' : 'rgb(107, 114, 128)' }}>
                      {formData.role || 'Role not selected yet'}
                    </span>
                    <span style={{ color: 'rgb(107, 114, 128)', fontSize: '0.85rem' }}>Locked</span>
                  </button>
                  <input
                    required
                    value={formData.role}
                    readOnly
                    aria-hidden="true"
                    tabIndex={-1}
                    style={{
                      position: 'absolute',
                      opacity: 0,
                      pointerEvents: 'none',
                      height: 0,
                      width: 0,
                      border: 0,
                      padding: 0,
                    }}
                  />
                  {showRoleDropdown && (
                    <div
                      role="listbox"
                      aria-label="Professional role options"
                      style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        marginTop: '0.4rem',
                        background: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
                        maxHeight: '240px',
                        overflowY: 'auto',
                        zIndex: 40,
                        padding: '0.4rem',
                      }}
                    >
                      {basicInfoRole && !hasBasicRoleInOptions && (
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setFormData({ ...formData, role: basicInfoRole });
                            setShowRoleDropdown(false);
                          }}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: '0.5rem 0.75rem',
                            borderRadius: '0.5rem',
                            border: 'none',
                            background: formData.role === basicInfoRole ? 'rgba(59,130,246,0.1)' : 'transparent',
                            color: '#111827',
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                          }}
                        >
                          {basicInfoRole} (from Basic Info)
                        </button>
                      )}
                      {professionalRoleOptions.map((role) => (
                        <button
                          key={role.label}
                          type="button"
                          disabled={!role.enabled}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            if (!role.enabled) return;
                            setFormData({ ...formData, role: role.label });
                            setShowRoleDropdown(false);
                          }}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: '0.5rem 0.75rem',
                            borderRadius: '0.5rem',
                            border: 'none',
                            background: formData.role === role.label ? 'rgba(59,130,246,0.1)' : 'transparent',
                            color: role.enabled ? '#111827' : '#9ca3af',
                            cursor: role.enabled ? 'pointer' : 'not-allowed',
                            fontSize: '0.95rem',
                          }}
                        >
                          {role.label}{!role.enabled ? ' (Coming soon)' : ''}
                        </button>
                      ))}
                    </div>
                  )}
                  {basicInfoRole && (
                    <p style={{ marginTop: '0.5rem', marginBottom: 0, fontSize: '0.8rem', color: 'rgb(75, 85, 99)' }}>
                      Locked from Basic Info role: {basicInfoRole}
                    </p>
                  )}
                  {isRoleMismatch && (
                    <div
                      style={{
                        marginTop: '0.6rem',
                        padding: '0.7rem 0.85rem',
                        borderRadius: '0.625rem',
                        border: '1px solid rgb(253, 224, 71)',
                        backgroundColor: 'rgb(254, 252, 232)',
                        color: 'rgb(113, 63, 18)',
                        fontSize: '0.82rem',
                        lineHeight: 1.45,
                      }}
                    >
                      This role does not match your Basic Info role ({basicInfoRole}). You can still continue, but it may reduce consistency. This field will be used to guide AI role behavior in future features.
                    </div>
                  )}
                </div>

                {/* Skills Section */}
                <div className={styles.formGroup}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <label className={styles.formLabel} style={{ marginBottom: 0 }}>Key Skills *</label>
                    <button
                      type="button"
                      onClick={handleRoleSkillMatch}
                      disabled={isFetchingRoleSkills || !formData.role.trim()}
                      style={{
                        padding: '0.62rem 1rem',
                        borderRadius: '0.75rem',
                        border: '1px solid rgb(209, 213, 219)',
                        background: 'white',
                        color: 'rgb(17, 24, 39)',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.06)',
                        cursor: isFetchingRoleSkills || !formData.role.trim() ? 'not-allowed' : 'pointer',
                        marginLeft: 'auto',
                        opacity: isFetchingRoleSkills || !formData.role.trim() ? 0.6 : 1,
                      }}
                      onMouseEnter={(e) => {
                        if (isFetchingRoleSkills || !formData.role.trim()) return;
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(15, 23, 42, 0.08)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(15, 23, 42, 0.06)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <motion.span
                        aria-hidden="true"
                        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                        animate={{
                          color: ['#c4f1ff', '#72d1ff', '#2ea6e6', '#1d6fd6', '#72d1ff'],
                          scale: [1, 1.05, 1],
                          y: [0, -1, 0],
                          opacity: [0.9, 1, 0.9],
                        }}
                        transition={{
                          duration: 2.8,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      >
                        <Sparkles size={15} />
                      </motion.span>
                      {isFetchingRoleSkills ? 'Matching Skills...' : 'AI Skill Match'}
                    </button>
                  </div>
                  <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {(aiSuggestedSkills.length > 0 ? aiSuggestedSkills : recommendedSkills).slice(0, 24).map((skill) => {
                      const selected = formData.skills.includes(skill);
                      return (
                        <button
                          key={`ai-${skill}`}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          style={{
                            padding: '0.35rem 0.7rem',
                            borderRadius: '9999px',
                            border: selected ? '1px solid rgb(156, 163, 175)' : '1px solid rgb(229, 231, 235)',
                            background: selected ? 'rgb(243, 244, 246)' : 'white',
                            color: selected ? 'rgb(17, 24, 39)' : 'rgb(55, 65, 81)',
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                          }}
                        >
                          {selected ? '✓ ' : '+'}{skill}
                        </button>
                      );
                    })}
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.9rem', fontSize: '0.82rem', color: 'rgb(55, 65, 81)', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.showSkillCategories}
                      onChange={(e) => setFormData({ ...formData, showSkillCategories: e.target.checked })}
                      style={{ width: '1rem', height: '1rem', accentColor: 'rgb(107, 114, 128)' }}
                    />
                    Show skill categories in the resume preview
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowManualSkillInput((prev) => !prev)}
                    style={{
                      marginTop: '0.9rem',
                      border: 'none',
                      background: 'transparent',
                      color: 'rgb(71, 85, 105)',
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      padding: 0,
                      textDecoration: 'underline',
                    }}
                  >
                    {showManualSkillInput ? 'Hide manual skill input' : 'Type skills manually (secondary)'}
                  </button>
                  {showManualSkillInput && (
                      <>
                        <input
                          type="text"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyDown={addSkill}
                          placeholder="e.g., React, Node.js, Problem Solving"
                          className={styles.formInput}
                          style={{ marginTop: '0.65rem' }}
                        />
                        {showManualSkillInput && prioritizedSkillSuggestions.length > 0 && (
                          <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {prioritizedSkillSuggestions.slice(0, 10).map((sugg, i) => (
                              <button
                                key={i}
                                type="button"
                                onMouseDown={(e) => { e.preventDefault(); addSkillByValue(sugg); }}
                                style={{
                                  padding: '0.35rem 0.6rem',
                                  borderRadius: '9999px',
                                  border: recommendedSkillSet.has(sugg.toLowerCase()) ? '1px solid rgb(209, 213, 219)' : '1px solid rgb(229, 231, 235)',
                                  background: recommendedSkillSet.has(sugg.toLowerCase()) ? 'rgb(249, 250, 251)' : 'white',
                                  color: 'rgb(55, 65, 81)',
                                  cursor: 'pointer',
                                  fontSize: '0.875rem'
                                }}
                              >
                                + {sugg}
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                  )}
                  {formData.skills.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                      {formData.skills.map((skill, index) => (
                        <div
                          key={index}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 0.75rem',
                            backgroundColor: 'white',
                            color: 'rgb(55, 65, 81)',
                            border: '1px solid rgb(229, 231, 235)',
                            borderRadius: '9999px',
                            fontSize: '0.875rem',
                            fontWeight: '500'
                          }}
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: 'rgb(107, 114, 128)',
                              padding: '0',
                              transition: 'color 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.color = 'rgb(31, 41, 55)';
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.color = 'rgb(107, 114, 128)';
                            }}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {showSkillsModal && (
                  <div
                    onClick={() => setShowSkillsModal(false)}
                    style={{
                      position: 'fixed',
                      inset: 0,
                      background: 'rgba(15, 23, 42, 0.45)',
                      zIndex: 1000,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '1rem',
                    }}
                  >
                    <div
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        width: 'min(860px, 100%)',
                        maxHeight: '85vh',
                        background: 'white',
                        borderRadius: '0.9rem',
                        border: '1px solid rgb(226, 232, 240)',
                        boxShadow: '0 20px 45px rgba(2, 6, 23, 0.25)',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', borderBottom: '1px solid rgb(226, 232, 240)' }}>
                        <div>
                          <p style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'rgb(15, 23, 42)' }}>Pick Key Skills</p>
                          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.84rem', color: 'rgb(71, 85, 105)' }}>
                            Suggestions are prioritized for role: {formData.role || 'No role selected'}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowSkillsModal(false)}
                          style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'rgb(71, 85, 105)' }}
                          aria-label="Close skills modal"
                        >
                          <X size={18} />
                        </button>
                      </div>

                      <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgb(241, 245, 249)' }}>
                        <input
                          type="text"
                          value={skillModalSearch}
                          onChange={(e) => setSkillModalSearch(e.target.value)}
                          placeholder="Search skills..."
                          className={styles.formInput}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1rem 1.25rem', overflowY: 'auto' }}>
                        <div>
                          <p style={{ marginTop: 0, marginBottom: '0.65rem', fontSize: '0.86rem', fontWeight: 700, color: 'rgb(30, 64, 175)' }}>
                            Recommended for this role
                          </p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                            {recommendedSkills.length === 0 && (
                              <span style={{ fontSize: '0.84rem', color: 'rgb(100, 116, 139)' }}>
                                No role-specific suggestions yet. You can still choose from all skills.
                              </span>
                            )}
                            {recommendedSkills
                              .filter((skill) => modalFilteredSkills.includes(skill))
                              .map((skill) => {
                                const selected = formData.skills.includes(skill);
                                return (
                                  <button
                                    key={`rec-${skill}`}
                                    type="button"
                                    onClick={() => toggleSkill(skill)}
                                    style={{
                                      padding: '0.4rem 0.65rem',
                                      borderRadius: '9999px',
                                      border: selected ? '1px solid rgb(37, 99, 235)' : '1px solid rgb(191, 219, 254)',
                                      background: selected ? 'rgb(219, 234, 254)' : 'rgb(239, 246, 255)',
                                      color: selected ? 'rgb(30, 64, 175)' : 'rgb(29, 78, 216)',
                                      fontSize: '0.82rem',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    {selected ? '✓ ' : ''}{skill}
                                  </button>
                                );
                              })}
                          </div>
                        </div>

                        <div>
                          <p style={{ marginTop: 0, marginBottom: '0.65rem', fontSize: '0.86rem', fontWeight: 700, color: 'rgb(15, 23, 42)' }}>
                            All skills
                          </p>
                          <div style={{ maxHeight: '360px', overflowY: 'auto', paddingRight: '0.25rem', display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                            {modalFilteredSkills.map((skill) => {
                              const selected = formData.skills.includes(skill);
                              const isRecommended = recommendedSkillSet.has(skill.toLowerCase());
                              return (
                                <button
                                  key={`all-${skill}`}
                                  type="button"
                                  onClick={() => toggleSkill(skill)}
                                  style={{
                                    padding: '0.4rem 0.65rem',
                                    borderRadius: '9999px',
                                    border: selected
                                      ? '1px solid rgb(37, 99, 235)'
                                      : isRecommended
                                      ? '1px solid rgb(147, 197, 253)'
                                      : '1px solid rgba(0,0,0,0.08)',
                                    background: selected
                                      ? 'rgb(219, 234, 254)'
                                      : isRecommended
                                      ? 'rgb(239, 246, 255)'
                                      : 'white',
                                    color: selected ? 'rgb(30, 64, 175)' : 'rgb(30, 41, 59)',
                                    fontSize: '0.82rem',
                                    cursor: 'pointer',
                                  }}
                                >
                                  {selected ? '✓ ' : ''}{skill}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.9rem 1.25rem', borderTop: '1px solid rgb(226, 232, 240)' }}>
                        <span style={{ fontSize: '0.84rem', color: 'rgb(71, 85, 105)' }}>
                          Selected {formData.skills.length} skill(s)
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowSkillsModal(false)}
                          style={{
                            padding: '0.55rem 0.95rem',
                            borderRadius: '0.6rem',
                            border: '1px solid rgb(15, 23, 42)',
                            background: 'rgb(15, 23, 42)',
                            color: 'white',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Experience Section */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Notable Experience *</label>
                  <input
                    type="text"
                    list="experience-suggestions"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    placeholder="e.g., Won Hackathon 2024"
                    className={styles.formInput}
                    required
                  />
                  <datalist id="experience-suggestions">
                    <option value="Hackathon Winner 2024" />
                    <option value="6-month Internship" />
                    <option value="10+ Project Portfolio" />
                    <option value="Startup Experience" />
                    <option value="Leadership Role" />
                  </datalist>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Career Goal (from Basic Info)</label>
                  <textarea
                    value={formData.goal}
                    className={styles.formInput}
                    style={{ minHeight: '92px', resize: 'vertical', backgroundColor: 'rgb(248, 250, 252)' }}
                    readOnly
                  />
                </div>

                {/* Description Section */}
                <div style={{
                  padding: '1.5rem',
                  backgroundColor: 'rgb(248, 250, 255)',
                  borderRadius: '0.75rem',
                  border: '1px solid rgb(224, 227, 231)'
                }}>
                  <label className={styles.formLabel}>Additional Summary (Optional)</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Share more about yourself, your journey, or what drives you..."
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      fontSize: '1rem',
                      color: 'rgb(17, 24, 39)',
                      backgroundColor: 'rgb(255, 255, 255)',
                      border: '1px solid rgb(224, 227, 231)',
                      borderRadius: '0.75rem',
                      outline: 'none',
                      transition: 'all 0.2s',
                      minHeight: '120px',
                      resize: 'vertical',
                      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                    }}
                    onFocus={(e) => {
                      (e.target as HTMLTextAreaElement).style.borderColor = 'rgb(59, 130, 246)';
                      (e.target as HTMLTextAreaElement).style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      (e.target as HTMLTextAreaElement).style.borderColor = 'rgb(224, 227, 231)';
                      (e.target as HTMLTextAreaElement).style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* AI Polish Section */}
                <div style={{
                  padding: '1.25rem',
                  backgroundColor: 'rgb(248, 246, 255)',
                  borderRadius: '0.75rem',
                  border: '1px solid rgb(221, 214, 254)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <motion.span
                      aria-hidden="true"
                      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                      animate={{
                        color: ['#c4f1ff', '#72d1ff', '#2ea6e6', '#1d6fd6', '#72d1ff'],
                        scale: [1, 1.05, 1],
                        y: [0, -1, 0],
                        opacity: [0.9, 1, 0.9],
                      }}
                      transition={{
                        duration: 2.8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    >
                      <Sparkles size={16} />
                    </motion.span>
                    <p style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: 'rgb(17, 24, 39)',
                      margin: 0
                    }}>
                      Professional AI Summary Assistant
                    </p>
                  </div>
                  <p style={{
                    fontSize: '0.8rem',
                    color: 'rgb(75, 85, 99)',
                    margin: 0,
                    opacity: 1
                  }}>
                    Choose AI to generate or improve your summary from your role and skills. Target length: 300-450 words.
                  </p>
                  {isPolishing && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'rgb(255, 255, 255)',
                        border: '1px solid rgb(229, 231, 235)',
                        borderRadius: '0.6rem',
                        padding: '0.52rem 0.72rem',
                        color: 'rgb(55, 65, 81)',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                      }}
                    >
                      <span aria-hidden="true">{['◐', '◓', '◑', '◒'][aiProgressFrame]}</span>
                      <span>{aiStatusLabel || 'AI is processing your request'}...</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={handleAISuggest}
                      disabled={isPolishing}
                      style={{
                        flex: 1,
                        minWidth: '140px',
                        minHeight: '48px',
                        padding: '0.75rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        background: isPolishing
                          ? 'rgb(229, 231, 235)'
                          : '#1d8bd8',
                        color: isPolishing ? 'rgb(107, 114, 128)' : 'white',
                        border: '1px solid #1d8bd8',
                        borderRadius: '0.75rem',
                        cursor: isPolishing ? 'not-allowed' : 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => {
                        if (!isPolishing) {
                          e.currentTarget.style.background = '#167cc2';
                          e.currentTarget.style.boxShadow = '0 8px 20px rgba(29, 139, 216, 0.22)';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isPolishing) {
                          e.currentTarget.style.background = '#1d8bd8';
                          e.currentTarget.style.boxShadow = 'none';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }
                      }}
                    >
                      <Zap size={16} />
                      AI Suggest
                    </button>
                    <button
                      type="button"
                      onClick={handleAIPolish}
                      disabled={isPolishing || !formData.description.trim()}
                      style={{
                        flex: 1,
                        minWidth: '140px',
                        minHeight: '48px',
                        padding: '0.75rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        background: isPolishing || !formData.description.trim()
                          ? 'rgb(229, 231, 235)'
                          : 'white',
                        color: 'rgb(17, 24, 39)',
                        border: '1px solid rgb(209, 213, 219)',
                        borderRadius: '0.75rem',
                        cursor: isPolishing || !formData.description.trim() ? 'not-allowed' : 'pointer',
                        fontWeight: '600',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => {
                        if (!isPolishing && formData.description.trim()) {
                          e.currentTarget.style.boxShadow = '0 8px 20px rgba(15, 23, 42, 0.08)';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isPolishing && formData.description.trim()) {
                          e.currentTarget.style.boxShadow = 'none';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }
                      }}
                    >
                      <Sparkles size={16} style={isPolishing ? { animation: 'spin 1s linear infinite' } : {}} />
                      {isPolishing ? 'Processing...' : 'AI Improve'}
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                  <button
                    type="button"
                    onClick={() => navigate('/resume/education')}
                    style={{
                      padding: '0.875rem 1.5rem',
                      backgroundColor: 'rgb(255, 255, 255)',
                      color: 'rgb(17, 24, 39)',
                      border: '1px solid rgb(224, 227, 231)',
                      borderRadius: '0.75rem',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '600',
                      transition: 'all 0.3s',
                      letterSpacing: '0.3px'
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgb(248, 250, 255)';
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgb(59, 130, 246)';
                      (e.currentTarget as HTMLButtonElement).style.color = 'rgb(59, 130, 246)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgb(255, 255, 255)';
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgb(224, 227, 231)';
                      (e.currentTarget as HTMLButtonElement).style.color = 'rgb(17, 24, 39)';
                    }}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '0.875rem 1.5rem',
                      backgroundColor: '#000000',
                      color: 'white',
                      border: '1px solid #000000',
                      borderRadius: '0.75rem',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '600',
                      transition: 'all 0.3s',
                      letterSpacing: '0.3px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1a1a1a';
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#000000';
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
                    }}
                  >
                    Next: Experience Stack
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
