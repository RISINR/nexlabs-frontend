import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Navbar } from '../../components/Navbar';
import { useResume, Experience } from '../../contexts/ResumeContext';
import ResumePreview from '../../components/resume/ResumePreview';
import { ArrowLeft, X } from 'lucide-react';
import styles from './BasicInfoPage.module.css';

const typeLabels = {
  project: 'Project/Portfolio',
  work: 'Work/Internship',
  camp: 'Camp/Volunteer',
  competition: 'Competition',
};

const typeDescriptions = {
  project: 'Show personal project work and portfolio items',
  work: 'Highlight work experience and internships',
  camp: 'Share volunteer work and camp activities',
  competition: 'Record competition entries and awards',
};

export default function ExperienceFormPage() {
  const navigate = useNavigate();
  const { type, id } = useParams<{ type: string; id?: string }>();
  const { resumeData, addExperience, updateExperience } = useResume();
  
  const existingExperience = id ? resumeData.experiences.find(exp => exp.id === id) : null;
  
  const [formData, setFormData] = useState<Omit<Experience, 'id'>>({
    type: type as Experience['type'],
    title: existingExperience?.title || '',
    organization: existingExperience?.organization || '',
    role: existingExperience?.role || '',
    startDate: existingExperience?.startDate || '',
    endDate: existingExperience?.endDate || '',
    situation: existingExperience?.situation || '',
    action: existingExperience?.action || '',
    result: existingExperience?.result || '',
    skills: existingExperience?.skills || [],
  });

  const [skillInput, setSkillInput] = useState('');
  const [presentChecked, setPresentChecked] = useState(formData.endDate === 'Present');
  const [showCertificate, setShowCertificate] = useState(false);

  // Auto-save form data in real-time (only when editing existing experience)
  useEffect(() => {
    if (id) {
      const timer = setTimeout(() => {
        updateExperience(id, { ...formData, id });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [formData, id, updateExperience]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (id) {
      updateExperience(id, { ...formData, id });
    } else {
      const newId = Date.now().toString();
      addExperience({ ...formData, id: newId });
    }
    
    navigate('/resume/experience-stack');
  };

  const addSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      setFormData({
        ...formData,
        skills: [...(formData.skills || []), skillInput.trim()],
      });
      setSkillInput('');
    }
  };

  const removeSkill = (index: number) => {
    setFormData({
      ...formData,
      skills: (formData.skills || []).filter((_, i) => i !== index),
    });
  };
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
              {/* Back Button */}
              <button
                onClick={() => navigate('/resume/experience-stack')}
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
                  marginBottom: '1.5rem'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = 'rgb(17, 24, 39)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = 'rgb(75, 85, 99)';
                }}
                >
                <ArrowLeft size={16} />
                <span>Back to experience list</span>
              </button>

              {/* Title and Description */}
              <h1 className={styles.formTitle}>{type && typeLabels[type as keyof typeof typeLabels]}</h1>
              <p className={styles.description} style={{ marginBottom: '2rem', marginTop: '-1rem' }}>
                {type && typeDescriptions[type as keyof typeof typeDescriptions]}
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Title and Role Row */}
                <div className={styles.formGroupRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Title / Project Name *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., AI chatbot development"
                      className={styles.formInput}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Role</label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="e.g., Team lead / Developer"
                      className={styles.formInput}
                    />
                  </div>
                </div>

                {/* Organization */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Organization / Company *</label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="e.g., Tech Innovation Lab"
                    className={styles.formInput}
                    required
                  />
                </div>

                {/* Dates Row */}
                <div className={styles.formGroupRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Start Year *</label>
                    <input
                      type="number"
                      min="1900"
                      max="2100"
                      step="1"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className={styles.formInput}
                      required
                      placeholder="YYYY"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>End Year</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <input
                        type="number"
                        min="1900"
                        max="2100"
                        step="1"
                        value={formData.endDate !== 'Present' ? formData.endDate : ''}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className={styles.formInput}
                        required={!presentChecked}
                        placeholder="YYYY"
                        disabled={presentChecked}
                        style={{ flex: 1 }}
                      />
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95em', cursor: 'pointer', userSelect: 'none' }}>
                        <input
                          type="checkbox"
                          checked={presentChecked}
                          onChange={e => {
                            if (e.target.checked) {
                              setFormData({ ...formData, endDate: 'Present' });
                            } else {
                              setFormData({ ...formData, endDate: '' });
                            }
                            setPresentChecked(e.target.checked);
                          }}
                          style={{ marginRight: '0.3em' }}
                        />
                        Currently Working
                      </label>
                    </div>
                  </div>
                </div>

                {/* STAR Method */}
                <div style={{
                  padding: '1.5rem',
                  backgroundColor: 'rgb(248, 250, 255)',
                  borderRadius: '0.75rem',
                  border: '1px solid rgb(224, 227, 231)'
                }}>
                    <p style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: 'rgb(17, 24, 39)',
                      marginBottom: '1rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      STAR method (Situation, Task, Action, Result)
                    </p>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Situation & Task</label>
                    <textarea
                      value={formData.situation}
                      onChange={(e) => setFormData({ ...formData, situation: e.target.value })}
                      placeholder="Describe the problem or task you faced"
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
                        minHeight: '100px',
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

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Action Taken</label>
                    <textarea
                      value={formData.action}
                      onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                      placeholder="Describe the steps you took to resolve it"
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
                        minHeight: '100px',
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

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Result Achieved</label>
                    <textarea
                      value={formData.result}
                      onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                      placeholder="Describe the outcome or impact"
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
                        minHeight: '140px',
                        lineHeight: '1.6',
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
                </div>

                {/* Skills Section */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Skills Used (Press Enter to add)</label>
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={addSkill}
                    placeholder="e.g., Python, React, Project management"
                    className={styles.formInput}
                  />
                  {(formData.skills || []).length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                      {(formData.skills || []).map((skill, index) => (
                        <div
                          key={index}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 0.75rem',
                            backgroundColor: 'rgb(219, 234, 254)',
                            color: 'rgb(37, 99, 235)',
                            borderRadius: '9999px',
                            fontSize: '0.875rem',
                            fontWeight: '500'
                          }}
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(index)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: 'rgb(37, 99, 235)',
                              padding: '0',
                              transition: 'color 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.color = 'rgb(17, 24, 39)';
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.color = 'rgb(37, 99, 235)';
                            }}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Certificate Section */}
                <div style={{
                  padding: '1rem',
                  backgroundColor: 'rgb(255, 255, 255)',
                  borderRadius: '0.75rem',
                  border: '1px solid rgb(224, 227, 231)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <input
                    type="checkbox"
                    id="certificate"
                    checked={showCertificate}
                    onChange={(e) => setShowCertificate(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <label htmlFor="certificate" style={{ cursor: 'pointer', fontSize: '0.9375rem', fontWeight: '500', color: 'rgb(17, 24, 39)', margin: 0 }}>
                    Has a certificate or credential for this item
                  </label>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                  <button
                    type="button"
                    onClick={() => navigate('/resume/experience-stack')}
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
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '0.875rem 1.5rem',
                      backgroundColor: 'rgb(59, 130, 246)',
                      color: 'white',
                      border: '1px solid rgb(59, 130, 246)',
                      borderRadius: '0.75rem',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '600',
                      transition: 'all 0.3s',
                      letterSpacing: '0.3px'
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgb(37, 99, 235)';
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgb(37, 99, 235)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgb(59, 130, 246)';
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgb(59, 130, 246)';
                    }}
                  >
                    Save Experience
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
