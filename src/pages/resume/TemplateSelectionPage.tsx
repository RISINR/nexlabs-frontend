import { useNavigate } from 'react-router';
import { Navbar } from '../../components/Navbar';
import { useResume } from '../../contexts/ResumeContext';
import { useState } from 'react';
import { templates, categories, TemplateItem } from '../../data/templates';
import styles from './TemplateSelectionPage.module.css';
import { motion } from 'framer-motion';


export default function TemplateSelectionPage() {
  const navigate = useNavigate();
  const { selectTemplate } = useResume();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  const filteredTemplates: TemplateItem[] =
    selectedCategory === 'all' ? templates : templates.filter(t => t.category === selectedCategory);

  const handleSelectTemplate = (templateId: string) => {
    selectTemplate(templateId);
    navigate(`/resume/template/${templateId}`);
  };

  return (
    <div className={styles.container}>
      <Navbar />
      
      <div className={styles.contentWrapper}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Please choose a template</h1>
          <p className={styles.subtitle}>Empowering your career with AI-driven Resume</p>
        </div>

        {/* Category Filter */}
        <div className={styles.filterContainer}>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`${styles.filterButton} ${
                selectedCategory === category.id 
                  ? styles.filterButtonActive 
                  : styles.filterButtonInactive
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className={styles.gridWrapper}>
            <div className={styles.grid}>
              {filteredTemplates.map((template) => (
                <motion.div
                  key={template.id}
                  className={styles.templateCard}
                  style={{ '--template-primary-color': template.colors[0] } as React.CSSProperties}
                  onMouseEnter={() => setHoveredTemplate(template.id)}
                  onMouseLeave={() => setHoveredTemplate(null)}
                  onClick={() => handleSelectTemplate(template.id)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  layout
                >
                  <div className={styles.templatePreview} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflow: 'hidden', background: '#fff' }}>
                    {/* Show the full template preview, no zoom, crop to fit card */}
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflow: 'hidden' }}>
                      <div style={{ minWidth: 0, minHeight: 0, width: '100%', height: 'auto', maxHeight: '100%' }}>
                        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
                          <template.Preview />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                
                  <p className={styles.templateName}>{template.name}</p>

                  {hoveredTemplate === template.id && (
                    <motion.div className={styles.hoverOverlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.12 }}>
                      <button className={styles.previewButton}>
                        Preview template
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
        </div>
      </div>
    </div>
  );
}
