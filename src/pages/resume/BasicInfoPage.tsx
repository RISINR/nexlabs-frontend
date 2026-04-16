import { useState, ChangeEvent, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Navbar } from '../../components/Navbar';
import { useResume, BasicInfo, SocialProfile } from '../../contexts/ResumeContext';
import ResumePreview from '../../components/resume/ResumePreview';
import { ArrowLeft, Upload, X, Minus, Plus, RotateCcw } from 'lucide-react';
import { getAuthUser } from '../../utils/authStorage';
import { useConfirmDialog } from '../../components/ui/ConfirmDialogProvider';
import styles from './BasicInfoPage.module.css';

type PhotoFrameShape = 'square' | 'rounded' | 'circle' | 'none';
const MIN_EDITOR_ZOOM = 0.4;
const MAX_PHOTO_UPLOAD_MB = 5;
const MAX_PHOTO_UPLOAD_BYTES = MAX_PHOTO_UPLOAD_MB * 1024 * 1024;
const SUPPORTED_PHOTO_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
const VALID_SOCIAL_PLATFORMS: SocialProfile['platform'][] = ['linkedin', 'github', 'portfolio', 'behance', 'dribbble', 'other'];
const PHOTO_HISTORY_STORAGE_KEY = 'nexlabs_photo_history_v1';
const MAX_PHOTO_HISTORY_ITEMS = 6;
const MAX_PHOTO_HISTORY_ITEM_LENGTH = 1200000;

export default function BasicInfoPage() {
  const navigate = useNavigate();
  const confirmDialog = useConfirmDialog();
  const {
    resumeData,
    updateBasicInfo,
    updateProfessionalSummary,
    updateEducation,
    addExperience,
    deleteExperience,
    updateCertifications,
    updateLanguages,
    updateAwards,
    updateInterests,
    selectHeadingFont,
    selectBodyFont,
  } = useResume();
  const existing = resumeData.basicInfo;
  const initialPhotoShape: PhotoFrameShape =
    (existing?.photoFrameShape as PhotoFrameShape) || 'rounded';
  const fallbackNameParts = (existing?.fullName || '').trim().split(/\s+/);
  const fallbackFirstName = fallbackNameParts[0] || '';
  const fallbackLastName = fallbackNameParts.slice(1).join(' ');

                {/* Email + Phone */}
  const [formData, setFormData] = useState<BasicInfo>({
    profilePicture: existing?.profilePicture || '',
    photoFrameShape: initialPhotoShape,
    fullName: existing?.fullName || '',
    firstName: existing?.firstName || fallbackFirstName,
    lastName: existing?.lastName || fallbackLastName,
    professionalTitle: existing?.professionalTitle || '',
    futureGoal: existing?.futureGoal || resumeData.professionalSummary?.goal || '',
    email: existing?.email || '',
    phone: existing?.phone || '',
    location: existing?.location || '',
    socialProfiles: existing?.socialProfiles || [],
  });

  const [photoPreview, setPhotoPreview] = useState<string>(existing?.profilePicture || '');
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [editorImageSrc, setEditorImageSrc] = useState<string>(existing?.profilePicture || '');
  const [editorZoom, setEditorZoom] = useState(1);
  const [editorOffset, setEditorOffset] = useState({ x: 0, y: 0 });
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false);
  const [dragStartPoint, setDragStartPoint] = useState({ x: 0, y: 0 });
  const [dragStartOffset, setDragStartOffset] = useState({ x: 0, y: 0 });
  const [editorSize, setEditorSize] = useState({ width: 360, height: 360 });
  const [imageNaturalSize, setImageNaturalSize] = useState({ width: 0, height: 0 });
  const [isPhotoDragOver, setIsPhotoDragOver] = useState(false);
  const [photoUploadError, setPhotoUploadError] = useState('');
  const [photoHistory, setPhotoHistory] = useState<string[]>([]);
  const [mockFillMode, setMockFillMode] = useState<'fill-empty' | 'overwrite-all'>('fill-empty');
  const editorViewportRef = useRef<HTMLDivElement | null>(null);
  const editorFileInputRef = useRef<HTMLInputElement | null>(null);
  const photoFrameShape = (formData.photoFrameShape || 'rounded') as PhotoFrameShape;
  const currentUserRole = String(getAuthUser()?.role || '').toLowerCase();
  const canSeeMockDataControls =
    currentUserRole === 'admin'
    || currentUserRole === 'university'
    || currentUserRole === 'univercity';

  const buildMockProfileByRole = (role: string) => {
    const normalized = role.toLowerCase();
    const baseTime = Date.now();

    if (normalized.includes('backend')) {
      return {
        summarySkills: ['Node.js', 'Express', 'MongoDB', 'REST API', 'System Design', 'Docker'],
        summaryDescription: 'Backend developer focused on building scalable API services, optimizing database performance, and improving release reliability through clean architecture and automation. Strong collaboration with frontend and product teams to deliver business outcomes with stable and secure systems.',
        experiences: [
          {
            id: `mock-${baseTime}-1`, type: 'work' as const, title: 'Backend Developer Intern', organization: 'NexLabs Platform Team', role: 'Backend Developer', startDate: '2024', endDate: 'Present',
            situation: 'The team had slow API responses and duplicate endpoint logic across modules.',
            action: 'Refactored service layers, introduced shared validation middleware, and optimized MongoDB indexes for high-traffic endpoints.',
            result: 'Reduced average API response time by 42% and cut bug-fix turnaround time by 35%.',
            skills: ['Node.js', 'Express', 'MongoDB', 'REST API', 'Performance Optimization']
          },
          {
            id: `mock-${baseTime}-2`, type: 'project' as const, title: 'Resume API Pipeline', organization: 'University Capstone', role: 'API Lead', startDate: '2023', endDate: '2024',
            situation: 'Needed a robust resume processing flow that could handle varied user input and AI enrichment.',
            action: 'Designed versioned APIs, added request sanitization, and built monitoring logs for AI operations.',
            result: 'Improved processing reliability and enabled faster debugging for production incidents.',
            skills: ['API Design', 'Logging', 'Validation', 'Team Collaboration']
          }
        ]
      };
    }

    if (normalized.includes('ux') || normalized.includes('ui') || normalized.includes('design')) {
      return {
        summarySkills: ['Figma', 'Design Systems', 'User Research', 'Prototyping', 'Accessibility'],
        summaryDescription: 'UI/UX designer who translates user insights into practical product experiences. Experienced in building reusable design systems, validating decisions with usability testing, and partnering with engineers to launch consistent interfaces with measurable improvements in engagement.',
        experiences: [
          {
            id: `mock-${baseTime}-1`, type: 'project' as const, title: 'Student Dashboard Redesign', organization: 'NexLabs Design Sprint', role: 'UX Designer', startDate: '2024', endDate: 'Present',
            situation: 'Users struggled to find critical dashboard actions and progress metrics.',
            action: 'Mapped user journeys, created high-fidelity prototypes in Figma, and ran moderated usability tests with students.',
            result: 'Increased task completion rate by 31% and reduced navigation confusion in post-test interviews.',
            skills: ['Figma', 'User Research', 'Wireframing', 'Usability Testing']
          },
          {
            id: `mock-${baseTime}-2`, type: 'competition' as const, title: 'Hackathon Product Design', organization: 'Campus Innovation Challenge', role: 'Product Designer', startDate: '2023', endDate: '2023',
            situation: 'Team needed a clear prototype to pitch an AI career assistant concept in limited time.',
            action: 'Built a complete prototype flow and defined a compact visual system for fast handoff.',
            result: 'Won top-3 placement and received strong feedback on clarity and user-centric interaction flow.',
            skills: ['Prototyping', 'Storytelling', 'Design Systems']
          }
        ]
      };
    }

    return {
      summarySkills: ['React', 'TypeScript', 'JavaScript', 'Problem Solving', 'Communication', 'Git'],
      summaryDescription: 'Frontend-focused software developer building responsive, maintainable web experiences with strong attention to usability and performance. Comfortable collaborating across design and backend teams, translating business needs into production-ready features with measurable user impact.',
      experiences: [
        {
          id: `mock-${baseTime}-1`, type: 'work' as const, title: 'Frontend Developer Intern', organization: 'NexLabs Product Team', role: 'Frontend Developer', startDate: '2024', endDate: 'Present',
          situation: 'The app had inconsistent UI behavior and duplicated component logic across pages.',
          action: 'Refactored reusable React components, standardized state flows, and improved loading interactions across core screens.',
          result: 'Reduced UI regressions and improved perceived responsiveness based on user feedback sessions.',
          skills: ['React', 'TypeScript', 'Component Architecture', 'UX Collaboration']
        },
        {
          id: `mock-${baseTime}-2`, type: 'project' as const, title: 'AI Resume Builder Experience', organization: 'Personal Project', role: 'Full-stack Builder', startDate: '2023', endDate: '2024',
          situation: 'Users needed a guided resume workflow with real-time preview and AI-assisted writing.',
          action: 'Implemented multi-step flow, autosave draft behavior, and role-based AI content assistance.',
          result: 'Delivered an end-to-end MVP used in demos with positive feedback on usability and clarity.',
          skills: ['React', 'Node.js', 'REST API', 'Product Thinking']
        }
      ]
    };
  };

  const handleGenerateMockAllSections = async () => {
    const role = (formData.professionalTitle || resumeData.professionalSummary?.role || 'Frontend Developer').trim();
    const profile = buildMockProfileByRole(role);
    const shouldProceed = await confirmDialog({
      title: 'Generate mock data for all resume sections?',
      description: 'Existing values may be replaced in related sections.',
      confirmText: 'Generate',
      cancelText: 'Cancel',
    });
    if (!shouldProceed) return;

    const shouldOverwriteAll = mockFillMode === 'overwrite-all';
    const existingBasic = resumeData.basicInfo;

    const nextBasicInfo: BasicInfo = {
      profilePicture: shouldOverwriteAll ? '' : (existingBasic?.profilePicture || ''),
      photoFrameShape: shouldOverwriteAll ? 'rounded' : ((existingBasic?.photoFrameShape as PhotoFrameShape) || 'rounded'),
      firstName: shouldOverwriteAll ? 'Nex' : (existingBasic?.firstName || 'Nex'),
      lastName: shouldOverwriteAll ? 'Labs' : (existingBasic?.lastName || 'Labs'),
      fullName: shouldOverwriteAll ? 'Nex Labs' : `${existingBasic?.firstName || 'Nex'} ${existingBasic?.lastName || 'Labs'}`.trim(),
      professionalTitle: shouldOverwriteAll ? role : (existingBasic?.professionalTitle || role),
      futureGoal: shouldOverwriteAll
        ? `Grow as a high-impact ${role} and deliver measurable product outcomes.`
        : (existingBasic?.futureGoal || `Grow as a high-impact ${role} and deliver measurable product outcomes.`),
      email: shouldOverwriteAll ? 'nexlabs.demo@example.com' : (existingBasic?.email || 'nexlabs.demo@example.com'),
      phone: shouldOverwriteAll ? '+66-81-234-5678' : (existingBasic?.phone || '+66-81-234-5678'),
      location: shouldOverwriteAll ? 'Bangkok, Thailand' : (existingBasic?.location || 'Bangkok, Thailand'),
      socialProfiles: shouldOverwriteAll ? [] : (existingBasic?.socialProfiles || []),
    };

    setFormData(nextBasicInfo);
    updateBasicInfo(nextBasicInfo);

    updateEducation({
      university: shouldOverwriteAll ? 'Chulalongkorn University' : (resumeData.education?.university || 'Chulalongkorn University'),
      degree: '',
      major: shouldOverwriteAll ? 'Computer Engineering' : (resumeData.education?.major || 'Computer Engineering'),
      graduationYear: shouldOverwriteAll ? '2026' : (resumeData.education?.graduationYear || '2026'),
      gpax: shouldOverwriteAll ? '3.62' : (resumeData.education?.gpax || '3.62'),
      coursework: !shouldOverwriteAll && resumeData.education?.coursework?.length
        ? resumeData.education.coursework
        : ['Data Structures', 'Database Systems', 'Software Engineering', 'Human-Computer Interaction'],
      additionalEntries: shouldOverwriteAll ? [] : (resumeData.education?.additionalEntries || []),
    });

    updateProfessionalSummary({
      role: shouldOverwriteAll ? role : (resumeData.professionalSummary?.role || role),
      experience: shouldOverwriteAll
        ? '2+ years through internships and major projects'
        : (resumeData.professionalSummary?.experience || '2+ years through internships and major projects'),
      skills: shouldOverwriteAll || !resumeData.professionalSummary?.skills?.length
        ? profile.summarySkills
        : (resumeData.professionalSummary?.skills || profile.summarySkills),
      goal: shouldOverwriteAll
        ? `Become a trusted ${role} who can own feature delivery end to end.`
        : (resumeData.professionalSummary?.goal || `Become a trusted ${role} who can own feature delivery end to end.`),
      description: shouldOverwriteAll
        ? profile.summaryDescription
        : (resumeData.professionalSummary?.description || profile.summaryDescription),
      aiGenerated: resumeData.professionalSummary?.aiGenerated,
      aiGeneratedAt: resumeData.professionalSummary?.aiGeneratedAt,
    });

    if (shouldOverwriteAll || resumeData.experiences.length === 0) {
      resumeData.experiences.forEach((exp) => deleteExperience(exp.id));
      profile.experiences.slice(0, 4).forEach((exp) => addExperience(exp));
    }

    if (shouldOverwriteAll || (resumeData.certifications?.length || 0) === 0) {
      updateCertifications([
        { name: 'Google Professional Certificate', issuer: 'Google', year: '2024' },
        { name: 'Agile Foundations', issuer: 'PMI', year: '2023' },
      ]);
    }
    if (shouldOverwriteAll || (resumeData.languages?.length || 0) === 0) {
      updateLanguages([
        { name: 'Thai', level: 'Native' },
        { name: 'English', level: 'Professional' },
      ]);
    }
    if (shouldOverwriteAll || (resumeData.awards?.length || 0) === 0) {
      updateAwards([
        { title: 'Top 3 in Campus Innovation Challenge', issuer: 'University Innovation Hub', year: '2024' },
      ]);
    }
    if (shouldOverwriteAll || (resumeData.interests?.length || 0) === 0) {
      updateInterests(['Open Source', 'Hackathon', 'Product Design']);
    }
  };

  const getCleanSocialProfiles = (profiles: SocialProfile[]) =>
    profiles
      .map((profile) => {
        const username = profile.username?.trim();
        if (!username) return null;

        const platform = VALID_SOCIAL_PLATFORMS.includes(profile.platform)
          ? profile.platform
          : 'other';

        return { platform, username };
      })
      .filter((profile): profile is SocialProfile => Boolean(profile));

  const readPhotoHistory = () => {
    if (typeof window === 'undefined') return [];

    try {
      const raw = localStorage.getItem(PHOTO_HISTORY_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((item) => typeof item === 'string' && item.startsWith('data:image/'));
    } catch {
      return [];
    }
  };

  const savePhotoHistory = (items: string[]) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(PHOTO_HISTORY_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore quota errors
    }
  };

  const pushPhotoToHistory = (photoDataUrl: string) => {
    if (!photoDataUrl || photoDataUrl.length > MAX_PHOTO_HISTORY_ITEM_LENGTH) return;

    setPhotoHistory((prev) => {
      const deduped = [photoDataUrl, ...prev.filter((item) => item !== photoDataUrl)];
      const next = deduped.slice(0, MAX_PHOTO_HISTORY_ITEMS);
      savePhotoHistory(next);
      return next;
    });
  };

  const handleSelectPhotoFromHistory = (photoDataUrl: string) => {
    setEditorImageSrc(photoDataUrl);
    setPhotoPreview(photoDataUrl);
    setFormData((prev) => ({ ...prev, profilePicture: photoDataUrl }));
    pushPhotoToHistory(photoDataUrl);
    setPhotoUploadError('');
  };

  const getEditorBaseScale = () => {
    if (
      !editorSize.width ||
      !editorSize.height ||
      !imageNaturalSize.width ||
      !imageNaturalSize.height
    ) {
      return 1;
    }

    // Fit image inside viewport by default so initial crop is not too deep.
    return Math.min(
      editorSize.width / imageNaturalSize.width,
      editorSize.height / imageNaturalSize.height
    );
  };

  const setPhotoFrameShape = (shape: PhotoFrameShape) => {
    setFormData((prev) => ({ ...prev, photoFrameShape: shape }));
  };

  const getPhotoShapeClass = (shape: PhotoFrameShape) => {
    if (shape === 'circle') return styles.photoShapeCircle;
    if (shape === 'square') return styles.photoShapeSquare;
    if (shape === 'none') return styles.photoShapeNone;
    return styles.photoShapeRounded;
  };

  const getEditorViewportShapeClass = (shape: PhotoFrameShape) => {
    if (shape === 'circle') return styles.photoViewportCircle;
    if (shape === 'square') return styles.photoViewportSquare;
    if (shape === 'none') return styles.photoViewportNone;
    return styles.photoViewportRounded;
  };

  const drawRoundedRectPath = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) => {
    const r = Math.max(0, Math.min(radius, width / 2, height / 2));
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + r);
    ctx.lineTo(x + width, y + height - r);
    ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    ctx.lineTo(x + r, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  };

  const applyCanvasShapeClip = (
    ctx: CanvasRenderingContext2D,
    shape: PhotoFrameShape,
    size: number
  ) => {
    if (shape === 'square' || shape === 'none') return;

    if (shape === 'circle') {
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      return;
    }

    drawRoundedRectPath(ctx, 0, 0, size, size, size * 0.16);
    ctx.clip();
  };

  const removeCurrentPhoto = () => {
    setPhotoPreview('');
    setEditorImageSrc('');
    setImageNaturalSize({ width: 0, height: 0 });
    setEditorZoom(1);
    setEditorOffset({ x: 0, y: 0 });
    setIsPhotoDragOver(false);
    setPhotoUploadError('');
    setFormData((prev) => ({ ...prev, profilePicture: '' }));
  };

  const clampEditorOffset = (offset: { x: number; y: number }, zoomLevel = editorZoom) => {
    if (
      !editorSize.width ||
      !editorSize.height ||
      !imageNaturalSize.width ||
      !imageNaturalSize.height
    ) {
      return { x: 0, y: 0 };
    }

    const baseScale = getEditorBaseScale();

    const scaledWidth = imageNaturalSize.width * baseScale * zoomLevel;
    const scaledHeight = imageNaturalSize.height * baseScale * zoomLevel;

    const maxOffsetX = Math.max(0, (scaledWidth - editorSize.width) / 2);
    const maxOffsetY = Math.max(0, (scaledHeight - editorSize.height) / 2);

    return {
      x: Math.max(-maxOffsetX, Math.min(maxOffsetX, offset.x)),
      y: Math.max(-maxOffsetY, Math.min(maxOffsetY, offset.y)),
    };
  };

  const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(file);
    });

  const loadImageMeta = (src: string) =>
    new Promise<{ width: number; height: number }>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = src;
    });

  const validatePhotoFile = (file: File) => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    const isSupported = SUPPORTED_PHOTO_EXTENSIONS.includes(fileExtension);

    if (!isSupported) {
      return 'Only JPG, PNG, and WEBP files are supported.';
    }

    if (file.size > MAX_PHOTO_UPLOAD_BYTES) {
      return `File size must be ${MAX_PHOTO_UPLOAD_MB}MB or smaller.`;
    }

    return '';
  };

  const processPhotoEditorFile = async (file: File) => {
    const validationMessage = validatePhotoFile(file);
    if (validationMessage) {
      setPhotoUploadError(validationMessage);
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      const meta = await loadImageMeta(dataUrl);
      setEditorImageSrc(dataUrl);
      setImageNaturalSize(meta);
      setEditorZoom(1);
      setEditorOffset({ x: 0, y: 0 });
      setPhotoUploadError('');
    } catch {
      setPhotoUploadError('Unable to load this image. Please try another file.');
    }
  };

  const openPhotoModal = () => {
    setIsPhotoModalOpen(true);
    setEditorZoom(1);
    setEditorOffset({ x: 0, y: 0 });
    setEditorImageSrc(photoPreview || '');
    setPhotoUploadError('');
  };

  const handlePhotoEditorFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await processPhotoEditorFile(file);
    e.target.value = '';
  };

  const handlePhotoEditorDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsPhotoDragOver(true);
  };

  const handlePhotoEditorDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsPhotoDragOver(false);
  };

  const handlePhotoEditorDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsPhotoDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await processPhotoEditorFile(file);
  };

  const handleEditorMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!editorImageSrc) return;
    e.preventDefault();
    setIsDraggingPhoto(true);
    setDragStartPoint({ x: e.clientX, y: e.clientY });
    setDragStartOffset(editorOffset);
  };

  const saveEditedPhoto = async () => {
    if (!editorImageSrc || !editorSize.width || !editorSize.height) return;

    try {
      if (photoFrameShape === 'none') {
        // None mode keeps the original upload without any crop/mask edits.
        setPhotoPreview(editorImageSrc);
        setFormData((prev) => ({ ...prev, profilePicture: editorImageSrc }));
        pushPhotoToHistory(editorImageSrc);
        setIsPhotoModalOpen(false);
        return;
      }

      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image for crop'));
        img.src = editorImageSrc;
      });

      const outputSize = 512;
      const baseScale = getEditorBaseScale();
      const finalScale = baseScale * editorZoom;

      const scaledWidth = img.naturalWidth * finalScale;
      const scaledHeight = img.naturalHeight * finalScale;

      const topLeftX = editorSize.width / 2 - scaledWidth / 2 + editorOffset.x;
      const topLeftY = editorSize.height / 2 - scaledHeight / 2 + editorOffset.y;

      const pixelScale = outputSize / editorSize.width;

      const canvas = document.createElement('canvas');
      canvas.width = outputSize;
      canvas.height = outputSize;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const needsClip = photoFrameShape === 'rounded' || photoFrameShape === 'circle';

      if (needsClip) {
        ctx.save();
        applyCanvasShapeClip(ctx, photoFrameShape, outputSize);
      }

      ctx.drawImage(
        img,
        topLeftX * pixelScale,
        topLeftY * pixelScale,
        scaledWidth * pixelScale,
        scaledHeight * pixelScale
      );

      if (needsClip) {
        ctx.restore();
      }

      // Always export PNG to preserve transparent areas and avoid white frame artifacts.
      const cropped = canvas.toDataURL('image/png');

      setPhotoPreview(cropped);
      setFormData((prev) => ({ ...prev, profilePicture: cropped }));
      pushPhotoToHistory(cropped);
      setIsPhotoModalOpen(false);
    } catch {
      // Keep editor open so user can retry when save fails.
    }
  };

  // Role / Professional title suggestions
  const roleOptions: { label: string; enabled: boolean }[] = [
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
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [roleFilter, setRoleFilter] = useState(formData.professionalTitle || '');
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const roleRef = useRef<HTMLDivElement | null>(null);

  const [showProvinceDropdown, setShowProvinceDropdown] = useState(false);
  const [provinceFilter, setProvinceFilter] = useState(formData.location || '');
  const [highlightProvinceIndex, setHighlightProvinceIndex] = useState(-1);
  const provinceRef = useRef<HTMLDivElement | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<{ thai: string; eng: string } | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');

  // Font selection options (Heading / Body)
  const fontOptions = [
    'Inter',
    'Poppins',
    'Roboto',
    'Montserrat',
    'Merriweather',
    'Playfair Display',
    'Lora',
    'Georgia',
    'Times New Roman'
  ];
  const currentHeadingFont = resumeData.headingFont || 'Inter';
  const currentBodyFont = resumeData.bodyFont || 'Inter';

  useEffect(() => {
    if (!resumeData.selectedTemplate) {
      navigate('/resume/templates');
    }
  }, [navigate, resumeData.selectedTemplate]);

  useEffect(() => {
    const existingHistory = readPhotoHistory();
    const existingPhoto = existing?.profilePicture || '';

    if (existingPhoto && existingPhoto.startsWith('data:image/')) {
      const merged = [existingPhoto, ...existingHistory.filter((item) => item !== existingPhoto)].slice(0, MAX_PHOTO_HISTORY_ITEMS);
      setPhotoHistory(merged);
      savePhotoHistory(merged);
      return;
    }

    setPhotoHistory(existingHistory);
  }, [existing?.profilePicture]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setShowRoleDropdown(false);
        setHighlightIndex(-1);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Prevent page scroll when modal/dropdown is open
  useEffect(() => {
    if (isPhotoModalOpen || showRoleDropdown || showProvinceDropdown) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'auto';
      };
    }
  }, [isPhotoModalOpen, showRoleDropdown, showProvinceDropdown]);

  useEffect(() => {
    if (!isPhotoModalOpen) return;

    const updateEditorSize = () => {
      if (!editorViewportRef.current) return;
      const rect = editorViewportRef.current.getBoundingClientRect();
      setEditorSize({ width: Math.max(1, rect.width), height: Math.max(1, rect.height) });
    };

    updateEditorSize();
    window.addEventListener('resize', updateEditorSize);
    return () => window.removeEventListener('resize', updateEditorSize);
  }, [isPhotoModalOpen]);

  useEffect(() => {
    if (!editorImageSrc) {
      setImageNaturalSize({ width: 0, height: 0 });
      setEditorOffset({ x: 0, y: 0 });
      return;
    }

    let mounted = true;
    loadImageMeta(editorImageSrc)
      .then((meta) => {
        if (!mounted) return;
        setImageNaturalSize(meta);
        setEditorOffset((prev) => clampEditorOffset(prev));
      })
      .catch(() => {
        if (!mounted) return;
        setImageNaturalSize({ width: 0, height: 0 });
      });

    return () => {
      mounted = false;
    };
  }, [editorImageSrc]);

  useEffect(() => {
    const incomingPhoto = resumeData.basicInfo?.profilePicture || '';
    if (!incomingPhoto) return;

    setPhotoPreview(incomingPhoto);
    setEditorImageSrc(incomingPhoto);
    pushPhotoToHistory(incomingPhoto);
  }, [resumeData.basicInfo?.profilePicture]);

  useEffect(() => {
    if (!isDraggingPhoto) return;

    const onMove = (e: MouseEvent) => {
      const raw = {
        x: dragStartOffset.x + (e.clientX - dragStartPoint.x),
        y: dragStartOffset.y + (e.clientY - dragStartPoint.y),
      };
      setEditorOffset(clampEditorOffset(raw));
    };

    const onUp = () => setIsDraggingPhoto(false);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isDraggingPhoto, dragStartOffset, dragStartPoint, editorZoom, editorSize, imageNaturalSize]);

  // Auto-save form data in real-time
  useEffect(() => {
    const timer = setTimeout(() => {
      const fullName = `${formData.firstName || ''} ${formData.lastName || ''}`.trim();
      const cleaned = {
        ...formData,
        fullName,
        socialProfiles: getCleanSocialProfiles(formData.socialProfiles),
      };
      updateBasicInfo(cleaned);

      if (cleaned.professionalTitle.trim()) {
        updateProfessionalSummary({
          role: cleaned.professionalTitle,
          goal: cleaned.futureGoal || '',
          experience: resumeData.professionalSummary?.experience || '',
          skills: resumeData.professionalSummary?.skills || [],
          description: resumeData.professionalSummary?.description || '',
          aiGenerated: resumeData.professionalSummary?.aiGenerated,
          aiGeneratedAt: resumeData.professionalSummary?.aiGeneratedAt,
        });
      }
    }, 500); // Debounce 500ms

    return () => clearTimeout(timer);
  }, [formData, resumeData.professionalSummary, updateBasicInfo, updateProfessionalSummary]);

  const filteredRoles = roleFilter.trim()
    ? roleOptions.filter((r) => r.label.toLowerCase().includes(roleFilter.trim().toLowerCase()))
    : roleOptions;

  const handleRoleInputChange = (value: string) => {
    setRoleFilter(value);
    setFormData({ ...formData, professionalTitle: value });
    setShowRoleDropdown(true);
    setHighlightIndex(-1);
  };

  const clearRoleSelection = () => {
    setRoleFilter('');
    setFormData({ ...formData, professionalTitle: '' });
    setShowRoleDropdown(false);
    setHighlightIndex(-1);
  };

  // Province (location) searchable dropdown — full 77 provinces with English names
  const provinceOptions = [
    { thai: 'กรุงเทพมหานคร', eng: 'Bangkok' }, { thai: 'กระบี่', eng: 'Krabi' }, { thai: 'กาญจนบุรี', eng: 'Kanchanaburi' },
    { thai: 'กาฬสินธุ์', eng: 'Kalasin' }, { thai: 'กำแพงเพชร', eng: 'Kamphaeng Phet' }, { thai: 'ขอนแก่น', eng: 'Khon Kaen' },
    { thai: 'จันทบุรี', eng: 'Chanthaburi' }, { thai: 'ฉะเชิงเทรา', eng: 'Chachoengsao' }, { thai: 'ชลบุรี', eng: 'Chonburi' },
    { thai: 'ชัยนาท', eng: 'Chai Nat' }, { thai: 'ชัยภูมิ', eng: 'Chaiyaphum' }, { thai: 'ชุมพร', eng: 'Chumphon' },
    { thai: 'เชียงราย', eng: 'Chiang Rai' }, { thai: 'เชียงใหม่', eng: 'Chiang Mai' }, { thai: 'ตรัง', eng: 'Trang' },
    { thai: 'ตราด', eng: 'Trat' }, { thai: 'ตาก', eng: 'Tak' }, { thai: 'นครนายก', eng: 'Nakhon Nayok' },
    { thai: 'นครปฐม', eng: 'Nakhon Pathom' }, { thai: 'นครพนม', eng: 'Nakhon Phanom' }, { thai: 'นครราชสีมา', eng: 'Nakhon Ratchasima' },
    { thai: 'นครศรีธรรมราช', eng: 'Nakhon Si Thammarat' }, { thai: 'นครสวรรค์', eng: 'Nakhon Sawan' }, { thai: 'นนทบุรี', eng: 'Nonthaburi' },
    { thai: 'นราธิวาส', eng: 'Narathiwat' }, { thai: 'น่าน', eng: 'Nan' }, { thai: 'บึงกาฬ', eng: 'Bueng Kan' },
    { thai: 'บุรีรัมย์', eng: 'Buri Ram' }, { thai: 'ปทุมธานี', eng: 'Pathum Thani' }, { thai: 'ประจวบคีรีขันธ์', eng: 'Prachuap Khiri Khan' },
    { thai: 'ปราจีนบุรี', eng: 'Prachinburi' }, { thai: 'ปัตตานี', eng: 'Pattani' }, { thai: 'พระนครศรีอยุธยา', eng: 'Phra Nakhon Si Ayutthaya' },
    { thai: 'พังงา', eng: 'Phang Nga' }, { thai: 'พัทลุง', eng: 'Phatthalung' }, { thai: 'พิจิตร', eng: 'Phichit' },
    { thai: 'พิษณุโลก', eng: 'Phitsanulok' }, { thai: 'เพชรบุรี', eng: 'Phetchaburi' }, { thai: 'เพชรบูรณ์', eng: 'Phetchabun' },
    { thai: 'แพร่', eng: 'Phrae' }, { thai: 'ภูเก็ต', eng: 'Phuket' }, { thai: 'มหาสารคาม', eng: 'Maha Sarakham' },
    { thai: 'มุกดาหาร', eng: 'Mukdahan' }, { thai: 'แม่ฮ่องสอน', eng: 'Mae Hong Son' }, { thai: 'ยโสธร', eng: 'Yasothon' },
    { thai: 'ยะลา', eng: 'Yala' }, { thai: 'ร้อยเอ็ด', eng: 'Roi Et' }, { thai: 'ระนอง', eng: 'Ranong' },
    { thai: 'ระยอง', eng: 'Rayong' }, { thai: 'ราชบุรี', eng: 'Ratchaburi' }, { thai: 'ลพบุรี', eng: 'Lopburi' },
    { thai: 'ลำปาง', eng: 'Lampang' }, { thai: 'ลำพูน', eng: 'Lamphun' }, { thai: 'เลย', eng: 'Loei' },
    { thai: 'ศรีสะเกษ', eng: 'Si Sa Ket' }, { thai: 'สกลนคร', eng: 'Sakon Nakhon' }, { thai: 'สงขลา', eng: 'Songkhla' },
    { thai: 'สตูล', eng: 'Satun' }, { thai: 'สมุทรปราการ', eng: 'Samut Prakan' }, { thai: 'สมุทรสงคราม', eng: 'Samut Songkhram' },
    { thai: 'สมุทรสาคร', eng: 'Samut Sakhon' }, { thai: 'สระแก้ว', eng: 'Sa Kaeo' }, { thai: 'สระบุรี', eng: 'Saraburi' },
    { thai: 'สิงห์บุรี', eng: 'Sing Buri' }, { thai: 'สุโขทัย', eng: 'Sukhothai' }, { thai: 'สุพรรณบุรี', eng: 'Suphan Buri' },
    { thai: 'สุราษฎร์ธานี', eng: 'Surat Thani' }, { thai: 'สุรินทร์', eng: 'Surin' }, { thai: 'หนองคาย', eng: 'Nong Khai' },
    { thai: 'หนองบัวลำภู', eng: 'Nong Bua Lam Phu' }, { thai: 'อำนาจเจริญ', eng: 'Amnat Charoen' }, { thai: 'อุดรธานี', eng: 'Udon Thani' },
    { thai: 'อุตรดิตถ์', eng: 'Uttaradit' }, { thai: 'อุทัยธานี', eng: 'Uthai Thani' }, { thai: 'อุบลราชธานี', eng: 'Ubon Ratchathani' },
    { thai: 'อ่างทอง', eng: 'Ang Thong' }
  ];

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (provinceRef.current && !provinceRef.current.contains(e.target as Node)) {
        setShowProvinceDropdown(false);
        setHighlightProvinceIndex(-1);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const filteredProvinces = provinceFilter.trim()
    ? provinceOptions.filter(p => p.thai.includes(provinceFilter.trim()) || p.eng.toLowerCase().includes(provinceFilter.trim().toLowerCase()))
    : provinceOptions;

  const handleProvinceInputChange = (value: string) => {
    setProvinceFilter(value);
    setFormData({ ...formData, location: value });
    setShowProvinceDropdown(true);
    setHighlightProvinceIndex(-1);
  };

  const clearProvinceSelection = () => {
    setProvinceFilter('');
    setFormData({ ...formData, location: '' });
    setSelectedProvince(null);
    setSelectedDistrict('');
    setShowProvinceDropdown(false);
    setHighlightProvinceIndex(-1);
  };

  const selectProvince = (p: string) => {
    const found = provinceOptions.find(x => x.thai === p || x.eng === p || x.eng.toLowerCase() === p.toLowerCase());
    if (found) {
      setSelectedProvince(found);
      // store province in English
      setFormData({ ...formData, location: found.eng });
      setProvinceFilter(found.eng);
    } else {
      setSelectedProvince({ thai: p, eng: p });
      setFormData({ ...formData, location: p });
      setProvinceFilter(p);
    }
    setSelectedDistrict('');
    setShowProvinceDropdown(false);
    setHighlightProvinceIndex(-1);
  };

  // District mapping (sample for common provinces). For provinces not listed, fallback to free-text district input.
  const districtMap: Record<string, string[]> = {
    'Bangkok': ['Phra Nakhon (พระนคร)','Dusit (ดุสิต)','Nong Chok (หนองจอก)','Bang Rak (บางรัก)','Bang Khen (บางเขน)','Bang Kapi (บางกะปิ)','Bang Khun Thian (บางขุนเทียน)','Bang Khlo (บางคอแหลม)','Bang Khae (บางแค)','Bang Sue (บางซื่อ)','Bang Na (บางนา)','Bang Bon (บางบอน)','Pathum Wan (ปทุมวัน)','Pom Prap Sattru Phai (ป้อมปราบศัตรูพ่าย)','Phaya Thai (พญาไท)','Phra Khanong (พระโขนง)','Min Buri (มีนบุรี)','Ratchathewi (ราชเทวี)','Ratcha (ราษฎร์บูรณะ)','Saphan Sung (สะพานสูง)','Samphanthawong (สัมพันธวงศ์)','Samsen (สามเสนใน)','Sai Mai (สายไหม)'],
    'Chiang Mai': ['Mueang (เมืองเชียงใหม่)','Mae Rim (แม่ริม)','San Sai (สันทราย)','San Pa Tong (สันป่าตอง)','Doi Saket (ดอยสะเก็ด)'],
    'Khon Kaen': ['Mueang (เมืองขอนแก่น)','Chumphae (ชุมแพ)','Ban Phai (บ้านไผ่)','Phu Wiang (ภูเวียง)'],
    'Chon Buri': ['Mueang (เมืองชลบุรี)','Si Racha (ศรีราชา)','Phanat Nikhom (พนัสนิคม)','Bang Lamung (บางละมุง)'],
    'Nonthaburi': ['Mueang (เมืองนนทบุรี)','Bang Bua Thong (บางบัวทอง)','Bang Yai (บางใหญ่)','Thai Sai (ไทรน้อย)'],
    'Nakhon Ratchasima': ['Mueang (เมืองนครราชสีมา)','Pak Chong (ปากช่อง)','Si Khiaw (สีคิ้ว)','Chumphon (ชุมพวง)'],
    'Songkhla': ['Mueang (เมืองสงขลา)','Hat Yai (หาดใหญ่)','Sai Dao (สะเดา)','Chana (จะนะ)']
  };

  const hasDistricts = selectedProvince && Boolean(districtMap[selectedProvince.eng]);

  const handleProvinceKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showProvinceDropdown) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightProvinceIndex(i => Math.min(i + 1, filteredProvinces.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightProvinceIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightProvinceIndex >= 0 && highlightProvinceIndex < filteredProvinces.length) {
        selectProvince(filteredProvinces[highlightProvinceIndex].thai);
      } else if (provinceFilter.trim()) {
        selectProvince(provinceFilter.trim());
      }
    } else if (e.key === 'Escape') {
      setShowProvinceDropdown(false);
      setHighlightProvinceIndex(-1);
    }
  };

  const selectRole = (role: string) => {
    setFormData({ ...formData, professionalTitle: role });
    setRoleFilter(role);
    setShowRoleDropdown(false);
    setHighlightIndex(-1);
  };

  const handleRoleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showRoleDropdown) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((i) => {
        for (let next = i + 1; next < filteredRoles.length; next += 1) {
          if (filteredRoles[next].enabled) return next;
        }
        return i;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((i) => {
        for (let next = i - 1; next >= 0; next -= 1) {
          if (filteredRoles[next].enabled) return next;
        }
        return i;
      });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightIndex >= 0 && highlightIndex < filteredRoles.length) {
        const highlighted = filteredRoles[highlightIndex];
        if (highlighted.enabled) {
          selectRole(highlighted.label);
        }
      } else if (roleFilter.trim()) {
        const matchedEnabledRole = roleOptions.find(
          (role) => role.enabled && role.label.toLowerCase() === roleFilter.trim().toLowerCase()
        );
        if (matchedEnabledRole) {
          selectRole(matchedEnabledRole.label);
        }
      }
    } else if (e.key === 'Escape') {
      setShowRoleDropdown(false);
      setHighlightIndex(-1);
    }
  };

  const platformOptions: { value: SocialProfile['platform']; label: string; placeholder: string }[] = [
    { value: 'linkedin', label: 'LinkedIn', placeholder: 'john-doe' },
    { value: 'github', label: 'GitHub', placeholder: 'johndoe' },
    { value: 'portfolio', label: 'Portfolio', placeholder: 'johndoe.dev' },
    { value: 'behance', label: 'Behance', placeholder: 'johndoe' },
    { value: 'dribbble', label: 'Dribbble', placeholder: 'johndoe' },
    { value: 'other', label: 'Other', placeholder: 'username or URL' },
  ];

  const handleProfileChange = (index: number, field: keyof SocialProfile, value: string) => {
    const profiles = [...formData.socialProfiles];
    profiles[index] = { ...profiles[index], [field]: value };
    setFormData({ ...formData, socialProfiles: profiles });
  };

  const addProfile = () => {
    setFormData({ ...formData, socialProfiles: [...formData.socialProfiles, { platform: 'linkedin', username: '' }] });
  };

  const removeProfile = (index: number) => {
    setFormData({
      ...formData,
      socialProfiles: formData.socialProfiles.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // filter out empty social profiles before saving
    const fullName = `${formData.firstName || ''} ${formData.lastName || ''}`.trim();
    const cleaned = {
      ...formData,
      fullName,
      socialProfiles: getCleanSocialProfiles(formData.socialProfiles),
    };
    updateBasicInfo(cleaned);
    navigate('/resume/education');
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
          {/* Removed debug JSON panel per user request */}
        </div>

        {/* Right Column: Form */}
        <div className={styles.formColumn}>
          <div className={styles.formSticky}>
            <div className={styles.formCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <button
                  onClick={() => navigate('/resume/templates')}
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
                  <span>Back to Templates</span>
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

              <h2 className={styles.formTitle}>Basic & Contact Info</h2>

              {canSeeMockDataControls && (
                <div style={{
                  padding: '0.9rem',
                  border: '1px solid rgb(191, 219, 254)',
                  borderRadius: '0.75rem',
                  background: 'rgb(239, 246, 255)',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  flexWrap: 'wrap',
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    <span style={{ fontSize: '0.82rem', color: 'rgb(30, 64, 175)', fontWeight: 600 }}>
                      One-click start: generate mock data for all resume sections.
                    </span>
                    <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => setMockFillMode('fill-empty')}
                        style={{
                          padding: '0.36rem 0.62rem',
                          borderRadius: '9999px',
                          border: mockFillMode === 'fill-empty' ? '1px solid rgb(37, 99, 235)' : '1px solid rgb(191, 219, 254)',
                          background: mockFillMode === 'fill-empty' ? 'rgb(219, 234, 254)' : 'white',
                          color: 'rgb(30, 64, 175)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        เติมเฉพาะช่องว่าง
                      </button>
                      <button
                        type="button"
                        onClick={() => setMockFillMode('overwrite-all')}
                        style={{
                          padding: '0.36rem 0.62rem',
                          borderRadius: '9999px',
                          border: mockFillMode === 'overwrite-all' ? '1px solid rgb(30, 58, 138)' : '1px solid rgb(191, 219, 254)',
                          background: mockFillMode === 'overwrite-all' ? 'rgb(30, 64, 175)' : 'white',
                          color: mockFillMode === 'overwrite-all' ? 'white' : 'rgb(30, 64, 175)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        เขียนทับทั้งหมด
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateMockAllSections}
                    style={{
                      padding: '0.48rem 0.82rem',
                      borderRadius: '0.55rem',
                      border: '1px solid rgb(59, 130, 246)',
                      background: 'white',
                      color: 'rgb(29, 78, 216)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Generate Mock Data
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className={styles.formSpace}>
                {/* Upload Photo Section */}
                <div className={styles.photoSection}>
                  <div 
                    className={`${styles.photoContainer} ${getPhotoShapeClass(photoFrameShape)}`}
                    onClick={openPhotoModal}
                  >
                    {photoPreview ? (
                      <img src={photoPreview} alt="Profile" className={styles.photoPreview} />
                    ) : (
                      <div style={{ textAlign: 'center' }}>
                        <div className={styles.photoPlaceholderIcon}>
                          <svg
                            width="42"
                            height="42"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                        </div>
                      </div>
                    )}
                    <span className={styles.photoHoverHint}>Click to edit</span>
                  </div>
                  <p className={styles.photoLabel}>Upload & Edit Profile Picture</p>
                  {photoPreview && (
                    <button
                      type="button"
                      className={styles.photoInlineRemoveButton}
                      onClick={removeCurrentPhoto}
                    >
                      Remove Photo
                    </button>
                  )}
                </div>

                {/* Name */}
                <div className={styles.formGroupRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>First Name</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="e.g., Narin"
                      className={styles.formInput}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Last Name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="e.g., Chaiyaporn"
                      className={styles.formInput}
                      required
                    />
                  </div>
                </div>

                {/* Professional Title (searchable dropdown) */}
                <div className={styles.formGroup} ref={roleRef} style={{ position: 'relative' }}>
                  <label className={styles.formLabel}>Professional Title</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={roleFilter}
                      onChange={(e) => handleRoleInputChange(e.target.value)}
                      onFocus={() => setShowRoleDropdown(true)}
                      onKeyDown={handleRoleKeyDown}
                      placeholder="e.g., Frontend, Backend, UI/UX Design"
                      className={styles.formInput}
                      required
                      aria-expanded={showRoleDropdown}
                      aria-haspopup="listbox"
                      aria-activedescendant={highlightIndex >= 0 ? `role-${highlightIndex}` : undefined}
                      style={{ paddingRight: '2.6rem' }}
                    />
                    {roleFilter && (
                      <button
                        type="button"
                        aria-label="Clear professional title"
                        onClick={clearRoleSelection}
                        style={{
                          position: 'absolute',
                          right: '0.75rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          border: 'none',
                          background: 'transparent',
                          color: '#6b7280',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 0,
                        }}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  {showRoleDropdown && (
                    <div
                      role="listbox"
                      aria-label="Role suggestions"
                      style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        marginTop: '0.4rem',
                        background: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
                        maxHeight: '220px',
                        overflowY: 'auto',
                        zIndex: 40,
                        padding: '0.5rem'
                      }}
                    >
                      <div style={{ padding: '0.25rem 0.5rem 0.5rem 0.5rem', color: '#6b7280', fontSize: '0.8125rem' }}>
                        Roles with "Coming soon" are not selectable yet.
                      </div>
                      {filteredRoles.length === 0 && (
                        <div style={{ padding: '0.5rem', color: '#6b7280' }}>No suggestions</div>
                      )}
                      {filteredRoles.map((r, idx) => (
                        <div
                          id={`role-${idx}`}
                          key={r.label + idx}
                          role="option"
                          aria-disabled={!r.enabled}
                          aria-selected={highlightIndex === idx}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            if (r.enabled) {
                              selectRole(r.label);
                            }
                          }}
                          onMouseEnter={() => {
                            if (r.enabled) {
                              setHighlightIndex(idx);
                            }
                          }}
                          style={{
                            padding: '0.5rem 0.75rem',
                            borderRadius: '0.5rem',
                            background:
                              r.enabled && highlightIndex === idx
                                ? 'rgba(59,130,246,0.08)'
                                : 'transparent',
                            color: r.enabled
                              ? highlightIndex === idx
                                ? '#0f172a'
                                : '#111827'
                              : '#9ca3af',
                            cursor: r.enabled ? 'pointer' : 'not-allowed',
                            fontSize: '0.95rem'
                          }}
                        >
                          {r.label} {!r.enabled ? '(Coming soon)' : ''}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Future Goal</label>
                  <textarea
                    value={formData.futureGoal}
                    onChange={(e) => setFormData({ ...formData, futureGoal: e.target.value })}
                    placeholder="e.g., Build impactful products used by millions of students"
                    className={styles.formInput}
                    style={{ minHeight: '96px', resize: 'vertical' }}
                    required
                  />
                </div>

                {/* Email + Phone */}
                <div className={styles.formGroupRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g., you@example.com"
                      className={styles.formInput}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g., +66 81 234 5678"
                      className={styles.formInput}
                      required
                    />
                  </div>
                </div>

                {/* Location / Province (searchable) */}
                <div className={styles.formGroup} ref={provinceRef} style={{ position: 'relative' }}>
                  <label className={styles.formLabel}>Location / Province</label>
                  <div style={{ position: 'relative', marginTop: '0.2rem', marginBottom: '1.2rem' }}>
                    <input
                      type="text"
                      value={provinceFilter}
                      onChange={(e) => handleProvinceInputChange(e.target.value)}
                      onFocus={() => setShowProvinceDropdown(true)}
                      onKeyDown={handleProvinceKeyDown}
                      placeholder="(Search Province / View Suggestions)"
                      className={styles.formInput}
                      required
                      aria-expanded={showProvinceDropdown}
                      aria-haspopup="listbox"
                      aria-activedescendant={highlightProvinceIndex >= 0 ? `province-${highlightProvinceIndex}` : undefined}
                      style={{
                        fontSize: '1.05rem',
                        padding: '1.1rem 2.8rem 1.1rem 1.2rem',
                        border: '1.5px solid #e0e3e7',
                        borderRadius: '0.75rem',
                        background: '#f9fafb',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                        width: '100%',
                        transition: 'border 0.2s',
                        position: 'relative'
                      }}
                    />
                    {provinceFilter && (
                      <button
                        type="button"
                        aria-label="Clear location"
                        onClick={clearProvinceSelection}
                        style={{
                          position: 'absolute',
                          right: '0.85rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          border: 'none',
                          background: 'transparent',
                          color: '#6b7280',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 0,
                        }}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  {showProvinceDropdown && (
                    <div
                      role="listbox"
                      aria-label="Province suggestions"
                      style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        marginTop: '0.4rem',
                        background: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
                        maxHeight: '220px',
                        overflowY: 'auto',
                        zIndex: 40,
                        padding: '0.25rem'
                      }}
                    >
                      {filteredProvinces.length === 0 && (
                        <div style={{ padding: '0.5rem', color: '#6b7280' }}>No suggestions</div>
                      )}
                      {filteredProvinces.map((p, idx) => (
                        <div
                          id={`province-${idx}`}
                          key={p.thai + idx}
                          role="option"
                          aria-selected={highlightProvinceIndex === idx}
                          onMouseDown={(e) => { e.preventDefault(); selectProvince(p.thai); }}
                          onMouseEnter={() => setHighlightProvinceIndex(idx)}
                          style={{
                            padding: '0.5rem 0.75rem',
                            borderRadius: '0.5rem',
                            background: highlightProvinceIndex === idx ? 'rgba(59,130,246,0.08)' : 'transparent',
                            color: highlightProvinceIndex === idx ? '#0f172a' : '#111827',
                            cursor: 'pointer',
                            fontSize: '0.95rem'
                          }}
                        >
                          {p.eng} {p.thai ? `(${p.thai})` : ''}
                        </div>
                      ))}
                    </div>
                  )}
                  {selectedProvince && (
                    <div style={{ marginTop: '0.5rem' }}>
                      {hasDistricts ? (
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.875rem', color: '#374151' }}>อำเภอ</label>
                          <select
                            value={selectedDistrict}
                            onChange={(e) => { setSelectedDistrict(e.target.value); const englishPart = e.target.value.split(' (')[0]; setFormData({ ...formData, location: englishPart ? `${englishPart}, ${selectedProvince.eng}` : selectedProvince.eng }); }}
                            style={{
                              width: '100%', padding: '0.8rem 1rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb',
                              background: 'white', fontSize: '0.95rem'
                            }}
                          >
                            <option value="">Select District</option>
                            {districtMap[selectedProvince.eng].map(d => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.875rem', color: '#374151' }}>District (Manual Entry)</label>
                          <input
                            type="text"
                            value={selectedDistrict}
                            onChange={(e) => { setSelectedDistrict(e.target.value); const englishPart = e.target.value.split(' (')[0]; setFormData({ ...formData, location: englishPart ? `${englishPart}, ${selectedProvince.eng}` : selectedProvince.eng }); }}
                            placeholder="Enter district name"
                            className={styles.formInput}
                            style={{ marginTop: 0 }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                  <div style={{ borderBottom: '1px solid #e5e7eb', margin: '0.5rem 0 1.2rem 0', width: '100%' }} />
                </div>

                {/* Social Profiles [Dynamic List] - moved to bottom */}
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Social Profiles</label>
                  <div style={{ fontSize: '0.8125rem', color: 'rgb(156, 163, 175)', marginBottom: '0.75rem' }}>
                    Select platform & enter username
                  </div>
                  <div className={styles.linksGrid}>
                    {formData.socialProfiles.map((profile, idx) => (
                      <div key={idx} className={styles.linkRow}>
                        <select
                          value={profile.platform}
                          onChange={(e) => handleProfileChange(idx, 'platform', e.target.value)}
                          style={{
                            padding: '0.75rem 0.5rem',
                            fontSize: '0.875rem',
                            border: '1px solid var(--form-input-border)',
                            borderRadius: '0.75rem',
                            backgroundColor: 'var(--form-input-bg)',
                            color: 'var(--form-text)',
                            outline: 'none',
                            minWidth: '120px',
                            cursor: 'pointer',
                          }}
                        >
                          {platformOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={profile.username}
                          onChange={(e) => handleProfileChange(idx, 'username', e.target.value)}
                          placeholder={platformOptions.find(o => o.value === profile.platform)?.placeholder || 'username'}
                          className={styles.linkInput}
                        />
                        <button
                          type="button"
                          onClick={() => removeProfile(idx)}
                          className={styles.removeButton}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addProfile}
                    className={styles.addLinkButton}
                    style={{ marginTop: '0.75rem', display: 'block' }}
                  >
                    + Add social profile
                  </button>
                </div>



                {/* Submit Button */}
                <button
                  type="submit"
                  className={styles.submitButton}
                >
                  Next: Education
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {isPhotoModalOpen && (
        <div className={styles.photoModalOverlay} onMouseDown={() => setIsPhotoModalOpen(false)}>
          <div className={styles.photoModal} onMouseDown={(e) => e.stopPropagation()}>
            <div className={styles.photoModalHeader}>
              <h3 className={styles.photoModalTitle}>Edit Photo</h3>
              <button
                type="button"
                className={styles.photoModalCloseButton}
                onClick={() => setIsPhotoModalOpen(false)}
                aria-label="Close photo editor"
              >
                <X size={16} />
              </button>
            </div>

            <div className={styles.photoModalBody}>
              <div
                ref={editorViewportRef}
                className={`${styles.photoEditorViewport} ${getEditorViewportShapeClass(photoFrameShape)} ${
                  isPhotoDragOver ? styles.photoEditorDropActive : ''
                } ${
                  isDraggingPhoto ? styles.photoEditorDragging : ''
                }`}
                onMouseDown={handleEditorMouseDown}
                onDragOver={handlePhotoEditorDragOver}
                onDragLeave={handlePhotoEditorDragLeave}
                onDrop={handlePhotoEditorDrop}
              >
                {editorImageSrc ? (
                  <img
                    src={editorImageSrc}
                    alt="Editor preview"
                    draggable={false}
                    className={styles.photoEditorImage}
                    style={{
                      width: `${imageNaturalSize.width * getEditorBaseScale()}px`,
                      height: `${imageNaturalSize.height * getEditorBaseScale()}px`,
                      transform: `translate(calc(-50% + ${editorOffset.x}px), calc(-50% + ${editorOffset.y}px)) scale(${editorZoom})`,
                    }}
                  />
                ) : (
                  <div className={styles.photoEditorEmptyState}>
                    <button
                      type="button"
                      className={styles.photoEditorEmptyUploadButton}
                      onClick={() => editorFileInputRef.current?.click()}
                    >
                      <Upload size={22} />
                      <span>Select a photo to start editing</span>
                      <small>or drag and drop JPG/PNG/WEBP (max 5MB)</small>
                    </button>
                  </div>
                )}

              </div>

              <div className={styles.photoShapePicker}>
                <button
                  type="button"
                  className={`${styles.photoShapeButton} ${photoFrameShape === 'none' ? styles.photoShapeButtonActive : ''}`}
                  onClick={() => setPhotoFrameShape('none')}
                >
                  None
                </button>
                <button
                  type="button"
                  className={`${styles.photoShapeButton} ${photoFrameShape === 'square' ? styles.photoShapeButtonActive : ''}`}
                  onClick={() => setPhotoFrameShape('square')}
                >
                  Soft Edge
                </button>
                <button
                  type="button"
                  className={`${styles.photoShapeButton} ${photoFrameShape === 'rounded' ? styles.photoShapeButtonActive : ''}`}
                  onClick={() => setPhotoFrameShape('rounded')}
                >
                  Rounded
                </button>
                <button
                  type="button"
                  className={`${styles.photoShapeButton} ${photoFrameShape === 'circle' ? styles.photoShapeButtonActive : ''}`}
                  onClick={() => setPhotoFrameShape('circle')}
                >
                  Circle
                </button>
              </div>

              <div className={styles.photoEditorToolbar}>
                <button
                  type="button"
                  className={styles.photoEditorGhostButton}
                  onClick={() => editorFileInputRef.current?.click()}
                >
                  <Upload size={15} />
                  <span>Upload</span>
                </button>

                <button
                  type="button"
                  className={styles.photoEditorGhostButton}
                  onClick={() => {
                    setEditorZoom(1);
                    setEditorOffset({ x: 0, y: 0 });
                  }}
                  disabled={!editorImageSrc}
                >
                  <RotateCcw size={15} />
                  <span>Reset</span>
                </button>

                <button
                  type="button"
                  className={`${styles.photoEditorGhostButton} ${styles.photoEditorDangerButton}`}
                  onClick={removeCurrentPhoto}
                  disabled={!editorImageSrc && !photoPreview}
                >
                  <X size={15} />
                  <span>Remove</span>
                </button>

                <input
                  ref={editorFileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={handlePhotoEditorFileSelect}
                  className={styles.fileInput}
                  style={{ display: 'none' }}
                />
              </div>

              {photoUploadError && (
                <div className={styles.photoUploadError}>{photoUploadError}</div>
              )}

              {photoHistory.length > 0 && (
                <div className={styles.photoHistorySection}>
                  <div className={styles.photoHistoryHeader}>Previously used photos</div>
                  <div className={styles.photoHistoryGrid}>
                    {photoHistory.map((photo, index) => (
                      <button
                        key={`photo-history-${index}`}
                        type="button"
                        className={`${styles.photoHistoryItem} ${editorImageSrc === photo ? styles.photoHistoryItemActive : ''}`}
                        onClick={() => handleSelectPhotoFromHistory(photo)}
                      >
                        <img src={photo} alt={`History ${index + 1}`} className={styles.photoHistoryThumb} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.photoEditorFooter}>
                <div className={styles.photoZoomGroup}>
                  <button
                    type="button"
                    className={styles.photoZoomButton}
                    onClick={() => {
                      const nextZoom = Math.max(
                        MIN_EDITOR_ZOOM,
                        Number((editorZoom - 0.1).toFixed(2))
                      );
                      setEditorZoom(nextZoom);
                      setEditorOffset((prev) => clampEditorOffset(prev, nextZoom));
                    }}
                    disabled={!editorImageSrc}
                    aria-label="Zoom out"
                  >
                    <Minus size={14} />
                  </button>

                  <input
                    type="range"
                    min={MIN_EDITOR_ZOOM}
                    max={3}
                    step={0.01}
                    value={editorZoom}
                    disabled={!editorImageSrc}
                    onChange={(e) => {
                      const nextZoom = Number(e.target.value);
                      setEditorZoom(nextZoom);
                      setEditorOffset((prev) => clampEditorOffset(prev, nextZoom));
                    }}
                    className={styles.photoZoomSlider}
                  />

                  <button
                    type="button"
                    className={styles.photoZoomButton}
                    onClick={() => {
                      const nextZoom = Math.min(3, Number((editorZoom + 0.1).toFixed(2)));
                      setEditorZoom(nextZoom);
                      setEditorOffset((prev) => clampEditorOffset(prev, nextZoom));
                    }}
                    disabled={!editorImageSrc}
                    aria-label="Zoom in"
                  >
                    <Plus size={14} />
                  </button>

                  <span className={styles.photoZoomPercent}>{Math.round(editorZoom * 100)}%</span>
                </div>
                <button
                  type="button"
                  className={styles.photoSaveButton}
                  onClick={saveEditedPhoto}
                  disabled={!editorImageSrc}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}