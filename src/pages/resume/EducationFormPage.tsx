import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Navbar } from '../../components/Navbar';
import { useResume } from '../../contexts/ResumeContext';
import ResumePreview from '../../components/resume/ResumePreview';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { API_BASE_URL } from '../../utils/apiBase';
import styles from './BasicInfoPage.module.css';

interface UniversityItem {
  _id: string;
  name: string;
  shortName?: string;
}

interface ProgramItem {
  _id: string;
  name: string;
  level: string;
  faculty?: string[];
}

const MIN_GRADUATION_YEAR = 1900;
const MAX_GRADUATION_YEAR = new Date().getFullYear() + 10;

export default function EducationFormPage() {
  const navigate = useNavigate();
  const { resumeData, updateEducation } = useResume();
  const [gpaxError, setGpaxError] = useState('');
  const [graduationYearError, setGraduationYearError] = useState('');
  const [universities, setUniversities] = useState<UniversityItem[]>([]);
  const [isLoadingUniversities, setIsLoadingUniversities] = useState(true);
  const [universitiesError, setUniversitiesError] = useState('');
  const [universityQuery, setUniversityQuery] = useState(resumeData.education?.university || '');
  const [isUniversitySuggestionsOpen, setIsUniversitySuggestionsOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(resumeData.education?.degree || '');
  const [selectedUniversityId, setSelectedUniversityId] = useState('');
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(false);
  const [programsError, setProgramsError] = useState('');
  const [additionalUniversityQueries, setAdditionalUniversityQueries] = useState<Record<number, string>>({});
  const [additionalUniversitySuggestionOpen, setAdditionalUniversitySuggestionOpen] = useState<Record<number, boolean>>({});
  const [additionalSelectedUniversityIds, setAdditionalSelectedUniversityIds] = useState<Record<number, string>>({});
  const [additionalProgramsByIndex, setAdditionalProgramsByIndex] = useState<Record<number, ProgramItem[]>>({});
  const [additionalProgramsLoading, setAdditionalProgramsLoading] = useState<Record<number, boolean>>({});
  const [additionalProgramsError, setAdditionalProgramsError] = useState<Record<number, string>>({});
  const [additionalSelectedFaculty, setAdditionalSelectedFaculty] = useState<Record<number, string>>({});
  
  const [formData, setFormData] = useState({
    university: resumeData.education?.university || '',
    degree: resumeData.education?.degree || '',
    major: resumeData.education?.major || '',
    graduationYear: resumeData.education?.graduationYear || '',
    gpax: resumeData.education?.gpax || '',
    coursework: resumeData.education?.coursework || [],
    additionalEntries: resumeData.education?.additionalEntries || [],
  });

  const [courseworkInput, setCourseworkInput] = useState('');

  useEffect(() => {
    if (!formData.additionalEntries.length) return;
    setAdditionalUniversityQueries((prev) => {
      const next = { ...prev };
      formData.additionalEntries.forEach((entry, index) => {
        if (typeof next[index] === 'undefined') {
          next[index] = entry.university || '';
        }
      });
      return next;
    });
  }, [formData.additionalEntries]);
  
  // If basic info has not been entered yet, send user back
  React.useEffect(() => {
    if (!resumeData.basicInfo) {
      navigate('/resume/basic-info');
    }
  }, [resumeData.basicInfo, navigate]);

  useEffect(() => {
    let isMounted = true;

    const loadUniversities = async () => {
      try {
        setIsLoadingUniversities(true);
        setUniversitiesError('');

        const response = await fetch(`${API_BASE_URL}/universities`);
        if (!response.ok) {
          throw new Error('Failed to fetch universities');
        }

        const payload = await response.json();
        const list = Array.isArray(payload?.data) ? payload.data : [];
        const sortedList = [...list].sort((a: UniversityItem, b: UniversityItem) =>
          a.name.localeCompare(b.name, 'th', { sensitivity: 'base' })
        );

        if (isMounted) {
          setUniversities(sortedList);
        }
      } catch (error) {
        if (isMounted) {
          setUniversitiesError('Unable to load university list. Please type manually.');
          setUniversities([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingUniversities(false);
        }
      }
    };

    loadUniversities();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!formData.university) {
      setSelectedUniversityId('');
      return;
    }

    const selectedUniversity = universities.find((u) => u.name === formData.university);
    setSelectedUniversityId(selectedUniversity?._id || '');
  }, [formData.university, universities]);

  useEffect(() => {
    if (!formData.additionalEntries.length || universities.length === 0) return;

    formData.additionalEntries.forEach((entry, index) => {
      const selectedUniversity = universities.find((u) => u.name === entry.university);
      const selectedId = selectedUniversity?._id || '';

      if (!selectedId) return;
      if (additionalSelectedUniversityIds[index] === selectedId && (additionalProgramsByIndex[index] || []).length > 0) {
        return;
      }

      setAdditionalSelectedUniversityIds((prev) => ({ ...prev, [index]: selectedId }));
      void loadProgramsForAdditionalUniversity(index, selectedId, entry.major || '');
    });
  }, [
    formData.additionalEntries,
    universities,
    additionalSelectedUniversityIds,
    additionalProgramsByIndex,
  ]);

  const filteredUniversities = useMemo(() => {
    const query = universityQuery.trim().toLowerCase();
    if (!query) return universities.slice(0, 8);
    return universities
      .filter((u) => u.name.toLowerCase().includes(query))
      .slice(0, 8);
  }, [universities, universityQuery]);

  useEffect(() => {
    if (!selectedUniversityId) {
      setPrograms([]);
      setProgramsError('');
      setIsLoadingPrograms(false);
      return;
    }

    let isMounted = true;

    const loadPrograms = async () => {
      try {
        setIsLoadingPrograms(true);
        setProgramsError('');

        const response = await fetch(`${API_BASE_URL}/programs?universityId=${selectedUniversityId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch programs');
        }

        const payload = await response.json();
        const list = Array.isArray(payload?.data) ? payload.data : [];
        const sortedPrograms = [...list].sort((a: ProgramItem, b: ProgramItem) =>
          a.name.localeCompare(b.name, 'th', { sensitivity: 'base' })
        );

        if (isMounted) {
          setPrograms(sortedPrograms);
          if (sortedPrograms.length > 0) {
            const matchedProgram = sortedPrograms.find((program) => program.name === formData.major);
            if (matchedProgram) {
              setSelectedFaculty(matchedProgram.faculty?.[0] || 'General');
            } else {
              const firstProgram = sortedPrograms[0];
              setSelectedFaculty(firstProgram.faculty?.[0] || 'General');
              setFormData((prev) => ({
                ...prev,
                degree: '',
                major: firstProgram.name,
              }));
            }
          }
        }
      } catch (error) {
        if (isMounted) {
          setProgramsError('Unable to load program list for this university. You can type manually.');
          setPrograms([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingPrograms(false);
        }
      }
    };

    loadPrograms();

    return () => {
      isMounted = false;
    };
  }, [selectedUniversityId]);

  const facultyOptions = useMemo(() => {
    const options = Array.from(new Set(programs.map((program) => program.faculty?.[0] || 'General')));
    return options.sort((a, b) => a.localeCompare(b, 'th', { sensitivity: 'base' }));
  }, [programs]);

  const majorOptions = useMemo(() => {
    const majors = programs
      .filter((program) => !selectedFaculty || (program.faculty?.[0] || 'General') === selectedFaculty)
      .map((program) => program.name);
    return majors.sort((a, b) => a.localeCompare(b, 'th', { sensitivity: 'base' }));
  }, [programs, selectedFaculty]);

  // Auto-save form data in real-time
  useEffect(() => {
    const timer = setTimeout(() => {
      const gpaxVal = formData.gpax === '' ? NaN : Number(formData.gpax);
      if (
        formData.university ||
        formData.degree ||
        formData.major ||
        formData.graduationYear ||
        formData.gpax ||
        formData.coursework.length > 0 ||
        formData.additionalEntries.length > 0
      ) {
        updateEducation({
          ...formData,
          degree: '',
          gpax: Number.isNaN(gpaxVal) ? '' : gpaxVal.toFixed(2),
          additionalEntries: formData.additionalEntries.map((entry) => {
            const extraGpax = entry.gpax === '' ? NaN : Number(entry.gpax);
            return {
              ...entry,
              degree: '',
              gpax: Number.isNaN(extraGpax) ? '' : extraGpax.toFixed(2),
            };
          }),
        });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [formData, updateEducation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const graduationYearNumber = Number(formData.graduationYear);
    if (!/^\d{4}$/.test(formData.graduationYear) || graduationYearNumber < MIN_GRADUATION_YEAR || graduationYearNumber > MAX_GRADUATION_YEAR) {
      setGraduationYearError(`Please enter a valid 4-digit year between ${MIN_GRADUATION_YEAR} and ${MAX_GRADUATION_YEAR}`);
      return;
    }

    // validate GPAX before submit
    const gpaxVal = formData.gpax === '' ? NaN : Number(formData.gpax);
    if (isNaN(gpaxVal) || gpaxVal < 0 || gpaxVal > 4) {
      setGpaxError('Please enter GPAX between 0.00 and 4.00');
      return;
    }

    const hasInvalidAdditional = formData.additionalEntries.some((entry) => {
      if (!entry.gpax) return false;
      const value = Number(entry.gpax);
      return Number.isNaN(value) || value < 0 || value > 4;
    });

    if (hasInvalidAdditional) {
      setGpaxError('Additional education GPAX must be between 0.00 and 4.00');
      return;
    }

    updateEducation({
      ...formData,
      degree: '',
      gpax: gpaxVal.toFixed(2),
      additionalEntries: formData.additionalEntries.map((entry) => {
        const extraGpax = entry.gpax === '' ? NaN : Number(entry.gpax);
        return {
          ...entry,
          degree: '',
          gpax: Number.isNaN(extraGpax) ? '' : extraGpax.toFixed(2),
        };
      }),
    });
    navigate('/resume/professional-summary');
  };

  const addAdditionalEducation = () => {
    setFormData((prev) => ({
      ...prev,
      additionalEntries: [
        ...prev.additionalEntries,
        {
          university: '',
          degree: '',
          major: '',
          graduationYear: '',
          gpax: '',
          coursework: [],
        },
      ],
    }));
    setAdditionalUniversityQueries((prev) => ({
      ...prev,
      [formData.additionalEntries.length]: '',
    }));
  };

  const loadProgramsForAdditionalUniversity = async (index: number, universityId: string, currentMajor = '') => {
    if (!universityId) {
      setAdditionalProgramsByIndex((prev) => ({ ...prev, [index]: [] }));
      setAdditionalProgramsError((prev) => ({ ...prev, [index]: '' }));
      setAdditionalProgramsLoading((prev) => ({ ...prev, [index]: false }));
      setAdditionalSelectedFaculty((prev) => ({ ...prev, [index]: '' }));
      return;
    }

    setAdditionalProgramsLoading((prev) => ({ ...prev, [index]: true }));
    setAdditionalProgramsError((prev) => ({ ...prev, [index]: '' }));

    try {
      const response = await fetch(`${API_BASE_URL}/programs?universityId=${universityId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch programs');
      }

      const payload = await response.json();
      const list = Array.isArray(payload?.data) ? payload.data : [];
      const sortedPrograms = [...list].sort((a: ProgramItem, b: ProgramItem) =>
        a.name.localeCompare(b.name, 'th', { sensitivity: 'base' })
      );

      setAdditionalProgramsByIndex((prev) => ({
        ...prev,
        [index]: sortedPrograms,
      }));

      if (sortedPrograms.length > 0) {
        const matchedProgram = sortedPrograms.find((program) => program.name === currentMajor);
        const inferredFaculty = matchedProgram?.faculty?.[0] || sortedPrograms[0].faculty?.[0] || 'General';
        const inferredMajor = matchedProgram?.name || sortedPrograms[0].name;

        setAdditionalSelectedFaculty((prev) => ({
          ...prev,
          [index]: inferredFaculty,
        }));

        updateAdditionalEducation(index, 'major', inferredMajor);
      } else {
        setAdditionalSelectedFaculty((prev) => ({ ...prev, [index]: '' }));
      }
    } catch (error) {
      setAdditionalProgramsByIndex((prev) => ({ ...prev, [index]: [] }));
      setAdditionalProgramsError((prev) => ({
        ...prev,
        [index]: 'Unable to load major data. You can type manually.',
      }));
      setAdditionalSelectedFaculty((prev) => ({ ...prev, [index]: '' }));
    } finally {
      setAdditionalProgramsLoading((prev) => ({ ...prev, [index]: false }));
    }
  };

  const updateAdditionalEducation = (index: number, key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      additionalEntries: prev.additionalEntries.map((entry, i) =>
        i === index ? { ...entry, [key]: value } : entry
      ),
    }));
  };

  const removeAdditionalEducation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      additionalEntries: prev.additionalEntries.filter((_, i) => i !== index),
    }));
    setAdditionalUniversityQueries((prev) => {
      const next: Record<number, string> = {};
      Object.entries(prev).forEach(([key, value]) => {
        const numericKey = Number(key);
        if (numericKey < index) next[numericKey] = value;
        if (numericKey > index) next[numericKey - 1] = value;
      });
      return next;
    });
    setAdditionalUniversitySuggestionOpen((prev) => {
      const next: Record<number, boolean> = {};
      Object.entries(prev).forEach(([key, value]) => {
        const numericKey = Number(key);
        if (numericKey < index) next[numericKey] = value;
        if (numericKey > index) next[numericKey - 1] = value;
      });
      return next;
    });
    setAdditionalSelectedUniversityIds((prev) => {
      const next: Record<number, string> = {};
      Object.entries(prev).forEach(([key, value]) => {
        const numericKey = Number(key);
        if (numericKey < index) next[numericKey] = value;
        if (numericKey > index) next[numericKey - 1] = value;
      });
      return next;
    });
    setAdditionalProgramsByIndex((prev) => {
      const next: Record<number, ProgramItem[]> = {};
      Object.entries(prev).forEach(([key, value]) => {
        const numericKey = Number(key);
        if (numericKey < index) next[numericKey] = value;
        if (numericKey > index) next[numericKey - 1] = value;
      });
      return next;
    });
    setAdditionalProgramsLoading((prev) => {
      const next: Record<number, boolean> = {};
      Object.entries(prev).forEach(([key, value]) => {
        const numericKey = Number(key);
        if (numericKey < index) next[numericKey] = value;
        if (numericKey > index) next[numericKey - 1] = value;
      });
      return next;
    });
    setAdditionalProgramsError((prev) => {
      const next: Record<number, string> = {};
      Object.entries(prev).forEach(([key, value]) => {
        const numericKey = Number(key);
        if (numericKey < index) next[numericKey] = value;
        if (numericKey > index) next[numericKey - 1] = value;
      });
      return next;
    });
    setAdditionalSelectedFaculty((prev) => {
      const next: Record<number, string> = {};
      Object.entries(prev).forEach(([key, value]) => {
        const numericKey = Number(key);
        if (numericKey < index) next[numericKey] = value;
        if (numericKey > index) next[numericKey - 1] = value;
      });
      return next;
    });
  };

  const getFilteredUniversitiesForAdditional = (index: number) => {
    const query = (additionalUniversityQueries[index] || '').trim().toLowerCase();
    if (!query) return universities.slice(0, 8);
    return universities.filter((u) => u.name.toLowerCase().includes(query)).slice(0, 8);
  };

  const handleAdditionalUniversityInputChange = (index: number, value: string) => {
    setAdditionalUniversityQueries((prev) => ({ ...prev, [index]: value }));
    setAdditionalUniversitySuggestionOpen((prev) => ({ ...prev, [index]: true }));
    updateAdditionalEducation(index, 'university', value);

    const matchedUniversity = universities.find(
      (u) => u.name.trim().toLowerCase() === value.trim().toLowerCase()
    );

    if (matchedUniversity?._id) {
      setAdditionalSelectedUniversityIds((prev) => ({ ...prev, [index]: matchedUniversity._id }));
      void loadProgramsForAdditionalUniversity(index, matchedUniversity._id, formData.additionalEntries[index]?.major || '');
    } else {
      setAdditionalSelectedUniversityIds((prev) => ({ ...prev, [index]: '' }));
      setAdditionalProgramsByIndex((prev) => ({ ...prev, [index]: [] }));
      setAdditionalProgramsError((prev) => ({ ...prev, [index]: '' }));
      setAdditionalSelectedFaculty((prev) => ({ ...prev, [index]: '' }));
    }
  };

  const handleAdditionalUniversitySelect = (index: number, value: string) => {
    setAdditionalUniversityQueries((prev) => ({ ...prev, [index]: value }));
    setAdditionalUniversitySuggestionOpen((prev) => ({ ...prev, [index]: false }));
    updateAdditionalEducation(index, 'university', value);

    const selectedUniversity = universities.find((u) => u.name === value);
    const selectedId = selectedUniversity?._id || '';
    setAdditionalSelectedUniversityIds((prev) => ({ ...prev, [index]: selectedId }));

    if (selectedId) {
      void loadProgramsForAdditionalUniversity(index, selectedId, formData.additionalEntries[index]?.major || '');
      return;
    }

    setAdditionalProgramsByIndex((prev) => ({ ...prev, [index]: [] }));
    setAdditionalProgramsError((prev) => ({ ...prev, [index]: '' }));
    setAdditionalSelectedFaculty((prev) => ({ ...prev, [index]: '' }));
  };

  const getAdditionalFacultyOptions = (index: number) => {
    const programsForIndex = additionalProgramsByIndex[index] || [];
    const options = Array.from(new Set(programsForIndex.map((program) => program.faculty?.[0] || 'General')));
    return options.sort((a, b) => a.localeCompare(b, 'th', { sensitivity: 'base' }));
  };

  const getAdditionalMajorOptions = (index: number) => {
    const programsForIndex = additionalProgramsByIndex[index] || [];
    const selectedFacultyForIndex = additionalSelectedFaculty[index] || '';
    const majors = programsForIndex
      .filter((program) => !selectedFacultyForIndex || (program.faculty?.[0] || 'General') === selectedFacultyForIndex)
      .map((program) => program.name);
    return majors.sort((a, b) => a.localeCompare(b, 'th', { sensitivity: 'base' }));
  };

  const handleAdditionalFacultyChange = (index: number, faculty: string) => {
    const programsForIndex = additionalProgramsByIndex[index] || [];
    const majors = programsForIndex
      .filter((program) => (program.faculty?.[0] || 'General') === faculty)
      .map((program) => program.name);

    setAdditionalSelectedFaculty((prev) => ({ ...prev, [index]: faculty }));
    updateAdditionalEducation(index, 'major', majors[0] || '');
  };

  const handleAdditionalMajorChange = (index: number, major: string) => {
    const programsForIndex = additionalProgramsByIndex[index] || [];
    const selectedProgram = programsForIndex.find((program) => program.name === major);
    if (selectedProgram) {
      setAdditionalSelectedFaculty((prev) => ({
        ...prev,
        [index]: selectedProgram.faculty?.[0] || 'General',
      }));
    }
    updateAdditionalEducation(index, 'major', major);
  };

  const addCoursework = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && courseworkInput.trim()) {
      e.preventDefault();
      setFormData({
        ...formData,
        coursework: [...formData.coursework, courseworkInput.trim()],
      });
      setCourseworkInput('');
    }
  };

  const removeCoursework = (index: number) => {
    setFormData({
      ...formData,
      coursework: formData.coursework.filter((_, i) => i !== index),
    });
  };

  const handleUniversitySelect = (universityName: string) => {
    const selectedUniversity = universities.find((u) => u.name === universityName);
    setSelectedUniversityId(selectedUniversity?._id || '');
    setUniversityQuery(universityName);
    setIsUniversitySuggestionsOpen(false);
    setFormData((prev) => ({
      ...prev,
      university: universityName,
      degree: '',
      major: '',
    }));
    setSelectedFaculty('');
  };

  const handleUniversityInputChange = (value: string) => {
    setUniversityQuery(value);
    setIsUniversitySuggestionsOpen(true);
    setFormData((prev) => ({
      ...prev,
      university: value,
    }));
  };

  const handleClearUniversitySelection = () => {
    setUniversityQuery('');
    setIsUniversitySuggestionsOpen(false);
    setSelectedUniversityId('');
    setPrograms([]);
    setProgramsError('');
    setFormData((prev) => ({
      ...prev,
      university: '',
      degree: '',
      major: '',
    }));
    setSelectedFaculty('');
  };

  const handleFacultyChange = (faculty: string) => {
    const majorsForFaculty = programs
      .filter((program) => (program.faculty?.[0] || 'General') === faculty)
      .map((program) => program.name);

    setSelectedFaculty(faculty);

    setFormData((prev) => ({
      ...prev,
      degree: '',
      major: majorsForFaculty.includes(prev.major) ? prev.major : (majorsForFaculty[0] || ''),
    }));
  };

  const handleMajorChange = (major: string) => {
    const selectedProgram = programs.find((program) => program.name === major);
    if (selectedProgram) {
      setSelectedFaculty(selectedProgram.faculty?.[0] || 'General');
    }
    setFormData((prev) => ({
      ...prev,
      major,
      degree: '',
    }));
  };

  const handleGraduationYearChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '').slice(0, 4);

    setFormData((prev) => ({
      ...prev,
      graduationYear: digitsOnly,
    }));

    if (digitsOnly.length === 4) {
      const year = Number(digitsOnly);
      if (year < MIN_GRADUATION_YEAR || year > MAX_GRADUATION_YEAR) {
        setGraduationYearError(`Year must be between ${MIN_GRADUATION_YEAR} and ${MAX_GRADUATION_YEAR}`);
      } else {
        setGraduationYearError('');
      }
      return;
    }

    setGraduationYearError('');
  };

  const handleGraduationYearBlur = () => {
    if (!formData.graduationYear) {
      setGraduationYearError('');
      return;
    }

    if (!/^\d{4}$/.test(formData.graduationYear)) {
      setGraduationYearError('Please enter a 4-digit year');
      return;
    }

    const year = Number(formData.graduationYear);
    if (year < MIN_GRADUATION_YEAR || year > MAX_GRADUATION_YEAR) {
      const clampedYear = Math.min(MAX_GRADUATION_YEAR, Math.max(MIN_GRADUATION_YEAR, year));
      setFormData((prev) => ({
        ...prev,
        graduationYear: String(clampedYear),
      }));
      setGraduationYearError('');
      return;
    }

    setGraduationYearError('');
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <button
                  onClick={() => navigate('/resume/basic-info')}
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
                    <span>Back to Basic Info</span>
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

              <h2 className={styles.formTitle}>Education</h2>
              
              <form id="education-form" onSubmit={handleSubmit} className={styles.formSpace}>
                {/* University */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>University Name</label>
                  {universitiesError ? (
                    <>
                      <input
                        type="text"
                        value={formData.university}
                        onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                        placeholder="Thai University Database"
                        className={styles.formInput}
                        required
                      />
                      <div style={{ color: 'rgb(220,38,38)', marginTop: '0.5rem', fontSize: '0.875rem' }}>
                        {universitiesError}
                      </div>
                    </>
                  ) : (
                    <div style={{ position: 'relative' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                          type="text"
                          value={universityQuery}
                          onChange={(e) => handleUniversityInputChange(e.target.value)}
                          onFocus={() => setIsUniversitySuggestionsOpen(true)}
                          onBlur={() => {
                            setTimeout(() => setIsUniversitySuggestionsOpen(false), 120);
                          }}
                          placeholder={isLoadingUniversities ? 'Loading universities...' : 'Type university name'}
                          className={styles.formInput}
                          style={{ flex: 1 }}
                          required
                          disabled={isLoadingUniversities}
                        />
                        <button
                          type="button"
                          onClick={handleClearUniversitySelection}
                          style={{
                            border: '1px solid rgb(209, 213, 219)',
                            background: '#ffffff',
                            borderRadius: '0.75rem',
                            padding: '0 0.9rem',
                            fontSize: '0.875rem',
                            color: 'rgb(75, 85, 99)',
                            cursor: 'pointer',
                          }}
                          disabled={!formData.university && !universityQuery}
                        >
                          Clear
                        </button>
                      </div>

                      {isUniversitySuggestionsOpen && filteredUniversities.length > 0 && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 'calc(100% + 0.3rem)',
                            left: 0,
                            right: 0,
                            maxHeight: '240px',
                            overflowY: 'auto',
                            border: '1px solid rgb(224, 227, 231)',
                            borderRadius: '0.75rem',
                            background: '#ffffff',
                            zIndex: 20,
                            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.08)',
                          }}
                        >
                          {filteredUniversities.map((uni) => (
                            <button
                              key={uni._id}
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleUniversitySelect(uni.name);
                              }}
                              style={{
                                width: '100%',
                                textAlign: 'left',
                                border: 'none',
                                background: '#ffffff',
                                color: 'rgb(31, 41, 55)',
                                padding: '0.7rem 0.9rem',
                                cursor: 'pointer',
                                fontSize: '0.925rem',
                              }}
                            >
                              {uni.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Faculty */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Faculty</label>
                  {selectedUniversityId && !programsError ? (
                    <div style={{ position: 'relative' }}>
                      <select
                        value={selectedFaculty}
                        onChange={(e) => handleFacultyChange(e.target.value)}
                        className={styles.formInput}
                        required
                        disabled={isLoadingPrograms || facultyOptions.length === 0}
                        style={{
                          appearance: 'none',
                          WebkitAppearance: 'none',
                          MozAppearance: 'none',
                          paddingRight: '2.5rem',
                        }}
                      >
                        <option value="" disabled>
                          {isLoadingPrograms ? 'Loading faculties...' : 'Select faculty'}
                        </option>
                        {facultyOptions.map((faculty) => (
                          <option key={faculty} value={faculty}>
                            {faculty}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={16}
                        style={{
                          position: 'absolute',
                          right: '0.9rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'rgb(107, 114, 128)',
                          pointerEvents: 'none',
                        }}
                      />
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={selectedFaculty}
                      onChange={(e) => setSelectedFaculty(e.target.value)}
                      placeholder="e.g., Faculty of Engineering"
                      className={styles.formInput}
                      required
                    />
                  )}
                </div>

                {/* Major */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Major</label>
                  {selectedUniversityId && !programsError ? (
                    <div style={{ position: 'relative' }}>
                      <select
                        value={formData.major}
                        onChange={(e) => handleMajorChange(e.target.value)}
                        className={styles.formInput}
                        required
                        disabled={isLoadingPrograms || majorOptions.length === 0}
                        style={{
                          appearance: 'none',
                          WebkitAppearance: 'none',
                          MozAppearance: 'none',
                          paddingRight: '2.5rem',
                        }}
                      >
                        <option value="" disabled>
                          {isLoadingPrograms ? 'Loading majors...' : 'Select major'}
                        </option>
                        {majorOptions.map((major) => (
                          <option key={major} value={major}>
                            {major}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={16}
                        style={{
                          position: 'absolute',
                          right: '0.9rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: 'rgb(107, 114, 128)',
                          pointerEvents: 'none',
                        }}
                      />
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={formData.major}
                      onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                      placeholder="e.g., Software Engineering"
                      className={styles.formInput}
                      required
                    />
                  )}
                </div>

                {selectedUniversityId && programsError && (
                  <div style={{ color: 'rgb(220,38,38)', marginTop: '-0.5rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
                    {programsError}
                  </div>
                )}

                {/* Graduation Year + GPAX Row */}
                <div className={styles.formGroupRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Graduation Year <span className={styles.formLabelSmall}></span></label>
                    <input
                      type="text"
                      value={formData.graduationYear}
                      onChange={(e) => handleGraduationYearChange(e.target.value)}
                      onBlur={handleGraduationYearBlur}
                      inputMode="numeric"
                      pattern="[0-9]{4}"
                      placeholder="e.g., 2026"
                      className={styles.formInput}
                      required
                    />
                    {graduationYearError && (
                      <div style={{ color: 'rgb(220,38,38)', marginTop: '0.5rem', fontSize: '0.875rem' }}>
                        {graduationYearError}
                      </div>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>GPAX <span className={styles.formLabelSmall}></span></label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="4"
                      value={formData.gpax}
                      onChange={(e) => {
                        const v = e.target.value;
                        // allow empty or numeric-ish input
                        if (v === '' || /^[0-9]*\.?[0-9]*$/.test(v)) {
                          setFormData({ ...formData, gpax: v });
                          const num = Number(v);
                          if (v !== '' && !isNaN(num) && num > 4) setGpaxError('Maximum GPAX is 4.00');
                          else setGpaxError('');
                        }
                      }}
                      onBlur={() => {
                        const v = formData.gpax;
                        if (v === '') return;
                        const num = Number(v);
                        if (isNaN(num)) {
                          setGpaxError('Invalid number');
                          return;
                        }
                        const clamped = Math.max(0, Math.min(4, num));
                        setFormData({ ...formData, gpax: clamped.toFixed(2) });
                        setGpaxError('');
                      }}
                      placeholder="0.00 - 4.00"
                      className={styles.formInput}
                      required
                    />
                    {gpaxError && <div style={{ color: 'rgb(220,38,38)', marginTop: '0.5rem', fontSize: '0.875rem' }}>{gpaxError}</div>}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                    <label className={styles.formLabel}>Additional Education (Optional)</label>
                    <button
                      type="button"
                      onClick={addAdditionalEducation}
                      style={{
                        border: '1px solid rgb(209, 213, 219)',
                        background: 'white',
                        color: 'rgb(17, 24, 39)',
                        borderRadius: '0.6rem',
                        padding: '0.45rem 0.8rem',
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                      }}
                    >
                      + Add Education Entry
                    </button>
                  </div>

                  {formData.additionalEntries.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.75rem' }}>
                      {formData.additionalEntries.map((entry, index) => (
                        <div
                          key={`edu-extra-${index}`}
                          style={{
                            border: '1px solid rgb(226, 232, 240)',
                            borderRadius: '0.75rem',
                            background: 'rgb(248, 250, 252)',
                            padding: '0.9rem',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                            <p style={{ margin: 0, fontWeight: 600, fontSize: '0.82rem', color: 'rgb(51, 65, 85)' }}>
                              Education #{index + 2} (Continue)
                            </p>
                            <button
                              type="button"
                              onClick={() => removeAdditionalEducation(index)}
                              style={{ border: 'none', background: 'transparent', color: 'rgb(220, 38, 38)', cursor: 'pointer', fontSize: '0.82rem' }}
                            >
                              Remove
                            </button>
                          </div>

                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>University Name</label>
                            <div style={{ position: 'relative' }}>
                              <input
                                type="text"
                                value={additionalUniversityQueries[index] ?? entry.university}
                                onChange={(e) => handleAdditionalUniversityInputChange(index, e.target.value)}
                                onFocus={() => setAdditionalUniversitySuggestionOpen((prev) => ({ ...prev, [index]: true }))}
                                onBlur={() => {
                                  setTimeout(() => {
                                    setAdditionalUniversitySuggestionOpen((prev) => ({ ...prev, [index]: false }));
                                  }, 120);
                                }}
                                placeholder="Type university name"
                                className={styles.formInput}
                              />
                              {additionalUniversitySuggestionOpen[index] && getFilteredUniversitiesForAdditional(index).length > 0 && (
                                <div
                                  style={{
                                    position: 'absolute',
                                    top: 'calc(100% + 0.25rem)',
                                    left: 0,
                                    right: 0,
                                    maxHeight: '180px',
                                    overflowY: 'auto',
                                    border: '1px solid rgb(224, 227, 231)',
                                    borderRadius: '0.65rem',
                                    background: '#ffffff',
                                    zIndex: 25,
                                    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.08)',
                                  }}
                                >
                                  {getFilteredUniversitiesForAdditional(index).map((uni) => (
                                    <button
                                      key={`extra-uni-${index}-${uni._id}`}
                                      type="button"
                                      onMouseDown={(e) => {
                                        e.preventDefault();
                                        handleAdditionalUniversitySelect(index, uni.name);
                                      }}
                                      style={{
                                        width: '100%',
                                        textAlign: 'left',
                                        border: 'none',
                                        background: '#ffffff',
                                        color: 'rgb(31, 41, 55)',
                                        padding: '0.62rem 0.85rem',
                                        cursor: 'pointer',
                                        fontSize: '0.88rem',
                                      }}
                                    >
                                      {uni.name}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Faculty</label>
                            {additionalSelectedUniversityIds[index] && !additionalProgramsError[index] ? (
                              <div style={{ position: 'relative' }}>
                                <select
                                  value={additionalSelectedFaculty[index] || ''}
                                  onChange={(e) => handleAdditionalFacultyChange(index, e.target.value)}
                                  className={styles.formInput}
                                  disabled={additionalProgramsLoading[index] || getAdditionalFacultyOptions(index).length === 0}
                                  style={{
                                    appearance: 'none',
                                    WebkitAppearance: 'none',
                                    MozAppearance: 'none',
                                    paddingRight: '2.5rem',
                                  }}
                                >
                                  <option value="" disabled>
                                    {additionalProgramsLoading[index] ? 'Loading faculties...' : 'Select faculty'}
                                  </option>
                                  {getAdditionalFacultyOptions(index).map((faculty) => (
                                    <option key={`extra-faculty-${index}-${faculty}`} value={faculty}>
                                      {faculty}
                                    </option>
                                  ))}
                                </select>
                                <ChevronDown
                                  size={16}
                                  style={{
                                    position: 'absolute',
                                    right: '0.9rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'rgb(107, 114, 128)',
                                    pointerEvents: 'none',
                                  }}
                                />
                              </div>
                            ) : (
                              <input
                                type="text"
                                value={additionalSelectedFaculty[index] || ''}
                                onChange={(e) => setAdditionalSelectedFaculty((prev) => ({ ...prev, [index]: e.target.value }))}
                                placeholder="Faculty"
                                className={styles.formInput}
                              />
                            )}
                          </div>
                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Major</label>
                            {additionalSelectedUniversityIds[index] && !additionalProgramsError[index] ? (
                              <div style={{ position: 'relative' }}>
                                <select
                                  value={entry.major}
                                  onChange={(e) => handleAdditionalMajorChange(index, e.target.value)}
                                  className={styles.formInput}
                                  disabled={additionalProgramsLoading[index] || getAdditionalMajorOptions(index).length === 0}
                                  style={{
                                    appearance: 'none',
                                    WebkitAppearance: 'none',
                                    MozAppearance: 'none',
                                    paddingRight: '2.5rem',
                                  }}
                                >
                                  <option value="" disabled>
                                    {additionalProgramsLoading[index] ? 'Loading majors...' : 'Select major'}
                                  </option>
                                  {getAdditionalMajorOptions(index).map((major) => (
                                    <option key={`extra-major-${index}-${major}`} value={major}>
                                      {major}
                                    </option>
                                  ))}
                                </select>
                                <ChevronDown
                                  size={16}
                                  style={{
                                    position: 'absolute',
                                    right: '0.9rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'rgb(107, 114, 128)',
                                    pointerEvents: 'none',
                                  }}
                                />
                              </div>
                            ) : (
                              <input
                                type="text"
                                value={entry.major}
                                onChange={(e) => updateAdditionalEducation(index, 'major', e.target.value)}
                                placeholder="Major"
                                className={styles.formInput}
                              />
                            )}
                            {additionalProgramsError[index] && (
                              <div style={{ color: 'rgb(220,38,38)', marginTop: '0.4rem', fontSize: '0.8rem' }}>
                                {additionalProgramsError[index]}
                              </div>
                            )}
                          </div>

                          <div className={styles.formGroupRow}>
                            <div className={styles.formGroup}>
                              <label className={styles.formLabel}>Graduation Year</label>
                              <input
                                type="text"
                                value={entry.graduationYear}
                                onChange={(e) => updateAdditionalEducation(index, 'graduationYear', e.target.value.replace(/\D/g, '').slice(0, 4))}
                                placeholder="Graduation Year"
                                className={styles.formInput}
                              />
                            </div>
                            <div className={styles.formGroup}>
                              <label className={styles.formLabel}>GPAX</label>
                              <input
                                type="number"
                                min="0"
                                max="4"
                                step="0.01"
                                value={entry.gpax}
                                onChange={(e) => updateAdditionalEducation(index, 'gpax', e.target.value)}
                                placeholder="GPAX"
                                className={styles.formInput}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Coursework Section */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Relevant Coursework <span className={styles.formLabelSmall}></span></label>
                  <div style={{ fontSize: '0.8125rem', color: 'rgb(107, 114, 128)', marginBottom: '0.75rem' }}>
                      (กด Enter เพื่อเพิ่มรายวิชา)
                  </div>
                  <div style={{
                    width: '100%',
                    border: '1px solid rgb(209, 213, 219)',
                    borderRadius: '0.75rem',
                    padding: '0.875rem 1rem',
                    minHeight: '50px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    alignItems: 'flex-start',
                    background: 'rgb(249, 250, 251)'
                  }}>
                    {formData.coursework.map((course, index) => (
                      <span
                        key={index}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          backgroundColor: 'rgb(255, 255, 255)',
                          color: 'rgb(55, 65, 81)',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.875rem',
                          border: '1px solid rgb(229, 231, 235)'
                        }}
                      >
                        {course}
                        <button
                          type="button"
                          onClick={() => removeCoursework(index)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'rgb(107, 114, 128)',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            padding: '0',
                          }}
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={courseworkInput}
                      onChange={(e) => setCourseworkInput(e.target.value)}
                      onKeyDown={addCoursework}
                        placeholder="Type course name and press Enter to add"
                      style={{
                        flex: 1,
                        minWidth: '200px',
                        outline: 'none',
                        border: 'none',
                        background: 'transparent',
                        color: 'rgb(31, 41, 55)',
                        fontSize: '1rem',
                        fontFamily: "'Poppins', 'Noto Sans Thai', sans-serif"
                      }}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className={styles.submitButton}
                >
                  Next: Professional Summary
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
