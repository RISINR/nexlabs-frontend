import { useNavigate, useParams } from 'react-router';
import { Navbar } from '../../components/Navbar';
import { ArrowLeft, Palette, Eye, EyeOff } from 'lucide-react';
import { templates } from '../../data/templates';
import ResumePreview from '../../components/resume/ResumePreview';
import { useResume } from '../../contexts/ResumeContext';
import { useState, useEffect, useRef } from 'react';
import styles from './TemplateDetailPage.module.css';

export default function TemplateDetailPage() {
  const navigate = useNavigate();
  const { templateId } = useParams();
  const { resumeData, selectTemplate, selectTemplateColor, selectHeadingFont, selectBodyFont, clearFormData } = useResume();
  const [selectedColor, setSelectedColor] = useState<string>(resumeData.templateColor || '#1e40af');
  const [headingFont, setHeadingFont] = useState<string>(resumeData.headingFont || 'Inter');
  const [bodyFont, setBodyFont] = useState<string>(resumeData.bodyFont || 'Inter');
  const hasCleared = useRef(false);

  const currentTemplate = templates.find(t => t.id === templateId);

  // Font options
  const fontOptions = [
    { value: 'Inter', label: 'Inter', category: 'Professional' },
    { value: 'Roboto', label: 'Roboto', category: 'Professional' },
    { value: 'Open Sans', label: 'Open Sans', category: 'Professional' },
    { value: 'Poppins', label: 'Poppins', category: 'Creative' },
    { value: 'Montserrat', label: 'Montserrat', category: 'Creative' },
    { value: 'Raleway', label: 'Raleway', category: 'Creative' },
    { value: 'Merriweather', label: 'Merriweather', category: 'Classic' },
    { value: 'PT Serif', label: 'PT Serif', category: 'Classic' },
    { value: 'Lora', label: 'Lora', category: 'Classic' },
  ];

  // Clear selectedTemplate on mount so preview shows sample data
  useEffect(() => {
    if (!hasCleared.current) {
      selectTemplate('');
      hasCleared.current = true;
    }
  }, [selectTemplate]);

  const [showExample, setShowExample] = useState(Boolean(
    templateId === 'modern-creative' ||
    templateId === 'minimal-sleek' ||
    templateId === 'elegant-professional' ||
    templateId === 'black-white-professional' ||
    templateId === 'black-yellow-sidebar' ||
    templateId === 'professional-compact'
  ));

  const handleNext = () => {
    if (currentTemplate?.id) selectTemplate(currentTemplate.id);
    // Clear any user-entered form data when the template is chosen
    clearFormData();
    navigate('/resume/basic-info');
  }

  return (
    <div className={styles.container}>
      <Navbar />
      
      <div className={styles.gridLayout}>
        {/* Left Column: Preview */}
        <div className={styles.previewColumn}>
          <div className={styles.previewContainer}>
            <div className={styles.previewCard} style={{ position: 'relative' }}>
              <button
                onClick={() => setShowExample(prev => !prev)}
                title={showExample ? 'Showing example data' : 'Show example data'}
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  zIndex: 30,
                  width: 40,
                  height: 40,
                  borderRadius: 9999,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'white',
                  boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
                  border: '1px solid #e5e7eb',
                  cursor: 'pointer'
                }}
              >
                {showExample ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
              <ResumePreview previewTemplateId={templateId} showExample={showExample} />
            </div>
          </div>
        </div>

        {/* Right Column: Template Info */}
        <div className={styles.infoColumn}>
          <div className={styles.infoCard}>
            {/* Back Button */}
            <button
              onClick={() => navigate('/resume/templates')}
              className={styles.backButton}
            >
              <ArrowLeft size={16} />
              <span>Back to Templates</span>
            </button>

            {/* Header */}
            <div className={styles.header}>
              <h1 className={styles.title}>
                {currentTemplate?.name || 'Template'}
              </h1>
              <p className={styles.subtitle}>
                250+ people picked this template
              </p>
            </div>

            {/* Color Selection */}
            {currentTemplate && (
              <div className={styles.colorSection}>
                <label className={styles.colorLabel}>Color</label>
                <div className={styles.colorPicker}>
                  {currentTemplate.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        setSelectedColor(color);
                        selectTemplateColor(color);
                      }}
                      className={`${styles.colorButton} ${selectedColor === color ? styles.colorButtonActive : ''}`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                  {/* Custom Color Picker */}
                  <label
                    title="Pick custom color"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      border: selectedColor && !currentTemplate.colors.includes(selectedColor)
                        ? `2px solid #3b82f6`
                        : '2px solid #e5e7eb',
                      cursor: 'pointer',
                      background: selectedColor || '#f3f4f6',
                      transition: 'all 200ms ease',
                      position: 'relative',
                    }}
                  >
                    {!selectedColor || currentTemplate.colors.includes(selectedColor) ? (
                      <Palette size={20} color="#9ca3af" />
                    ) : null}
                    <input
                      type="color"
                      value={selectedColor}
                      onChange={(e) => {
                        const newColor = e.target.value;
                        setSelectedColor(newColor);
                        selectTemplateColor(newColor);
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        opacity: 0,
                        position: 'absolute',
                      }}
                      title="Pick custom color"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Font Selection */}
            {currentTemplate && (
              <div className={styles.colorSection}>
                <label className={styles.colorLabel}>Fonts</label>
                
                {/* Heading Font */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.35rem', display: 'block', fontWeight: '600' }}>
                    Heading Font
                  </label>
                  <select
                    value={headingFont}
                    onChange={(e) => {
                      setHeadingFont(e.target.value);
                      selectHeadingFont(e.target.value);
                    }}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #e5e7eb',
                      fontSize: '0.875rem',
                      fontFamily: headingFont,
                      cursor: 'pointer',
                      backgroundColor: 'white',
                    }}
                  >
                    {fontOptions.map((font) => (
                      <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                        {font.label} - {font.category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Body Font */}
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.35rem', display: 'block', fontWeight: '600' }}>
                    Body Font
                  </label>
                  <select
                    value={bodyFont}
                    onChange={(e) => {
                      setBodyFont(e.target.value);
                      selectBodyFont(e.target.value);
                    }}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #e5e7eb',
                      fontSize: '0.875rem',
                      fontFamily: bodyFont,
                      cursor: 'pointer',
                      backgroundColor: 'white',
                    }}
                  >
                    {fontOptions.map((font) => (
                      <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                        {font.label} - {font.category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Features */}
            <div className={styles.features}>
              {[
                { icon: '✓', title: 'Color Customization', desc: 'Tailor the Resume to your professional identity.' },
                { icon: '✓', title: 'ATS-optimized', desc: 'Ensure your resume passes through Applicant Tracking Systems.' },
                { icon: '✓', title: '1-column layout', desc: 'Clean and organized structure.' },
                { icon: '✓', title: 'Multi-format Download', desc: 'Export as PDF, Word, or TXT.' },
              ].map((feature, idx) => (
                <div key={idx} className={styles.featureItem}>
                  <span className={styles.featureIcon}>{feature.icon}</span>
                  <div>
                    <p className={styles.featureTitle}>{feature.title}</p>
                    <p className={styles.featureDesc}>{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Info Cards Grid */}
            <div className={styles.cardsGrid}>
              <div className={styles.card}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginTop: '0.125rem' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <div>
                    <p className={styles.cardTitle}>Get Personalised Suggestions</p>
                    <p className={styles.cardDesc}>AI analyzes your background</p>
                  </div>
                </div>
              </div>

              <div className={styles.card}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginTop: '0.125rem' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <div>
                    <p className={styles.cardTitle}>Download in Multiple Formats</p>
                    <p className={styles.cardDesc}>PDF, Word, or TXT</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className={styles.actionButtons}>
              <button
                onClick={handleNext}
                className={styles.useButton}
              >
                Use this template
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
