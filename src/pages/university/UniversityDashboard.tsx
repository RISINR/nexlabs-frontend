import { useEffect, useMemo, useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarRange,
  Eye,
  FileText,
  Filter,
  MessageSquare,
  Sparkles,
  Trophy,
  Users
} from 'lucide-react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { Navbar } from '../../components/Navbar';
import './UniversityDashboardCreative.css';

type RadarPoint = {
  skill: string;
  type: 'Hard' | 'Soft';
  competent: number;
  gap: number;
};

type TrendPoint = {
  month: string;
  preTest: number;
  postTest: number;
  simulated?: boolean;
};

type Talent = {
  studentId: string;
  name: string;
  major: string;
  overallScore: number;
  resumeActionId: string;
  interviewActionId: string;
};

type DashboardData = {
  faculty: string;
  summary: {
    facultyAverage: number;
    universityAverage: number;
    studentsAssessed: number;
    studentsTotal: number;
    activeSessions: number;
  };
  skillGaps: {
    radarData: RadarPoint[];
    topMissingSkills: {
      hard: { skill: string; count: number; type: 'Hard' }[];
      soft: { skill: string; count: number; type: 'Soft' }[];
    };
  };
  trend: TrendPoint[];
  topTalent: Talent[];
  dataMode?: {
    usesRealScores?: boolean;
    usesSimulatedTrend?: boolean;
    usesFallbackTalent?: boolean;
  };
};

const FACULTY_NAME = 'Information & Communication Technology (ICT)';
const MONTH_OPTIONS = [4, 5, 6, 7, 8];
const FACULTY_PRESETS = [
  'Information & Communication Technology (ICT)',
  'Computer Engineering',
  'Software Engineering',
  'Data Science',
  'Business Administration'
];

export default function UniversityDashboard() {
  const [dashboard, setDashboard] = useState<DashboardData>(buildMockDashboardData());
  const [selectedFaculty, setSelectedFaculty] = useState(FACULTY_NAME);
  const [selectedMonths, setSelectedMonths] = useState(5);
  const [facultyOptions, setFacultyOptions] = useState<string[]>(FACULTY_PRESETS);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const loadFacultyOptions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/programs');
        if (!response.ok) {
          return;
        }

        const payload = await response.json();
        const programs = Array.isArray(payload?.data) ? payload.data : [];
        const fromPrograms = programs
          .flatMap((item: { faculty?: string[] }) => (Array.isArray(item?.faculty) ? item.faculty : []))
          .map((name: string) => String(name || '').trim())
          .filter(Boolean);

        if (fromPrograms.length) {
          const merged = Array.from(new Set([...FACULTY_PRESETS, ...fromPrograms]));
          setFacultyOptions(merged);
        }
      } catch {
        // Keep presets when options API is unavailable.
      }
    };

    loadFacultyOptions();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const loadDashboard = async () => {
      setLoading(true);
      setLoadError(null);
      const mock = buildMockDashboardData();

      try {
        const token = localStorage.getItem('nexlabs_token') || sessionStorage.getItem('nexlabs_token');
        const response = await fetch(
          `http://localhost:5000/api/university/faculty-dashboard?faculty=${encodeURIComponent(selectedFaculty)}&months=${selectedMonths}`,
          {
            signal: controller.signal,
            headers: token ? { Authorization: `Bearer ${token}` } : {}
          }
        );

        if (!response.ok) {
          if (response.status !== 401) {
            setLoadError('ใช้ข้อมูลตัวอย่างชั่วคราว เนื่องจากดึงข้อมูลจริงไม่สำเร็จ');
          }
          setDashboard(mock);
          return;
        }

        const payload = await response.json();
        const realData = payload?.data as Partial<DashboardData> | undefined;
        setDashboard(mergeDashboardData({ ...mock, faculty: selectedFaculty }, realData));
      } catch (error) {
        if (!controller.signal.aborted) {
          setDashboard({ ...mock, faculty: selectedFaculty });
          setLoadError('เชื่อมต่อ backend ไม่ได้ ระบบสลับเป็น mock preview อัตโนมัติ');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();
    return () => controller.abort();
  }, [selectedFaculty, selectedMonths]);

  const assessmentPercent = useMemo(() => {
    if (!dashboard.summary.studentsTotal) {
      return 0;
    }
    return Math.round((dashboard.summary.studentsAssessed / dashboard.summary.studentsTotal) * 100);
  }, [dashboard.summary.studentsAssessed, dashboard.summary.studentsTotal]);

  const readinessDiff = Math.round((dashboard.summary.facultyAverage - dashboard.summary.universityAverage) * 10) / 10;
  const isTrendingUp = readinessDiff >= 0;

  return (
    <div className="career-dashboard-shell font-thai">
      <Navbar />
      <main className="career-main">
        <header className="career-hero">
          <div className="career-hero-title">
            <p className="career-chip">
              <Sparkles size={13} />
              Career Analytics
            </p>
            <h1>NexLabs - Career Readiness Dashboard</h1>
            <p className="career-subtitle">Faculty: {dashboard.faculty || FACULTY_NAME}</p>
            <p className="career-description">
              วิเคราะห์ความพร้อมของนักศึกษาระดับคณะด้วยคะแนนจริง, ช่องว่างทักษะ, และแนวโน้มพัฒนาแบบเรียลไทม์
            </p>
          </div>

          <div className="career-controls">
            <div className="mode-wrap">
              <DataModeBadge data={dashboard} loading={loading} />
            </div>

            <div className="filter-grid">
              <label>
                <span className="label-title">
                    <Filter size={12} />
                    Faculty
                </span>
                <select value={selectedFaculty} onChange={(event) => setSelectedFaculty(event.target.value)}>
                  {facultyOptions.map((faculty) => (
                    <option key={faculty} value={faculty}>
                      {faculty}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className="label-title">
                    <CalendarRange size={12} />
                    Trend Months
                </span>
                <select value={selectedMonths} onChange={(event) => setSelectedMonths(Number(event.target.value))}>
                  {MONTH_OPTIONS.map((month) => (
                    <option key={month} value={month}>
                      Last {month} months
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {loadError && <p className="load-error">{loadError}</p>}
          </div>
        </header>

        <section className="metric-grid">
          <article className="metric-card">
            <p className="metric-label">Faculty Average Score</p>
            <div className="metric-row">
              <p className="metric-value">{dashboard.summary.facultyAverage}/100</p>
              <div className={`trend-pill ${isTrendingUp ? 'up' : 'down'}`}>
                {isTrendingUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {isTrendingUp ? '+' : ''}{readinessDiff}
              </div>
            </div>
            <p className="metric-subtext">University Avg: {dashboard.summary.universityAverage}/100</p>
          </article>

          <article className="metric-card">
            <p className="metric-label">Students Assessed</p>
            <p className="metric-value">
              {dashboard.summary.studentsAssessed}/{dashboard.summary.studentsTotal}
            </p>
            <div className="coverage-track">
              <div className="coverage-bar" style={{ width: `${Math.max(0, Math.min(100, assessmentPercent))}%` }} />
            </div>
            <p className="metric-subtext">Coverage {assessmentPercent}%</p>
          </article>

          <article className="metric-card">
            <p className="metric-label">Active Sessions</p>
            <div className="metric-row">
              <div className="metric-icon">
                <Users size={20} />
              </div>
              <p className="metric-value">{dashboard.summary.activeSessions}</p>
            </div>
            <p className="metric-subtext">Updated from recent student activity</p>
          </article>
        </section>

        <section className="content-grid">
          <article className="insight-panel">
            <div className="panel-head">
              <h2>Critical Skill Gaps</h2>
              <span className="tag hard-soft">Hard + Soft</span>
            </div>
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={dashboard.skillGaps.radarData}>
                  <PolarGrid stroke="#d7deeb" />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: '#334155', fontSize: 11 }} />
                  <Radar name="Competent" dataKey="competent" stroke="#0f766e" fill="#2dd4bf" fillOpacity={0.25} />
                  <Radar name="Gap" dataKey="gap" stroke="#c2410c" fill="#fb923c" fillOpacity={0.32} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <SkillGapRanking data={dashboard.skillGaps.topMissingSkills} />
          </article>

          <article className="insight-panel">
            <div className="panel-head">
              <h2>Career Readiness Trends</h2>
              <span className="tag info">Realtime</span>
            </div>
            <p className="panel-note">Monthly average score comparison (Pre-Test vs Post-Test)</p>
            <div className="chart-wrap chart-tall">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dashboard.trend} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 12 }} />
                  <YAxis domain={[40, 100]} tick={{ fill: '#475569', fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="preTest" name="Pre-Test" stroke="#0284c7" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="postTest" name="Post-Test" stroke="#059669" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </article>

          <aside className="insight-panel talent-panel">
            <div className="panel-head">
              <h2>Top Faculty Talent</h2>
              <Trophy size={18} className="trophy" />
            </div>
            <ul className="talent-list">
              {dashboard.topTalent.map((student) => (
                <li key={student.studentId} className="talent-row">
                  <div className="talent-main-row">
                    <div className="talent-profile">
                      <Avatar name={student.name} />
                      <div>
                        <p className="talent-name">{student.name}</p>
                        <p className="talent-major">{student.major}</p>
                      </div>
                    </div>
                    <div className="talent-score">{student.overallScore}</div>
                  </div>
                  <div className="talent-actions">
                    <button
                      type="button"
                      className="talent-btn"
                      onClick={() => window.alert(`View resume: ${student.name}`)}
                    >
                      <FileText size={13} />
                      View Resume
                    </button>
                    <button
                      type="button"
                      className="talent-btn"
                      onClick={() => window.alert(`View interview: ${student.name}`)}
                    >
                      <MessageSquare size={13} />
                      View Interview
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </section>

        <section className="insight-panel overview-panel">
          <div className="panel-head">
            <h3>
              <Eye size={18} />
              Faculty Readiness Overview
            </h3>
          </div>
          <p className="overview-text">
            ค่าเฉลี่ยความพร้อมของนักศึกษาคณะนี้อยู่ที่ <strong>{dashboard.summary.facultyAverage}/100</strong> เทียบกับค่าเฉลี่ยทั้งมหาวิทยาลัยที่ <strong>{dashboard.summary.universityAverage}/100</strong>
          </p>
        </section>

        {loading && (
          <div className="live-loading">
            Updating dashboard...
          </div>
        )}
      </main>
    </div>
  );
}

function DataModeBadge({ data, loading }: { data: DashboardData; loading: boolean }) {
  if (loading) {
    return <span className="mode-badge mode-loading">Loading data...</span>;
  }

  const usesReal = Boolean(data.dataMode?.usesRealScores);
  const hasSimulation = Boolean(data.dataMode?.usesSimulatedTrend || data.dataMode?.usesFallbackTalent);
  const label = usesReal ? (hasSimulation ? 'Data: Mixed (Real + Mock)' : 'Data: Real') : 'Data: Mock';
  const colorClass = usesReal ? (hasSimulation ? 'mode-mixed' : 'mode-real') : 'mode-mock';

  return <span className={`mode-badge ${colorClass}`}>{label}</span>;
}

function SkillGapRanking({
  data
}: {
  data: DashboardData['skillGaps']['topMissingSkills'];
}) {
  const rows = [...data.hard, ...data.soft].sort((a, b) => b.count - a.count).slice(0, 6);
  return (
    <div className="ranking-list">
      {rows.map((item, index) => (
        <div key={`${item.skill}-${index}`} className="ranking-row">
          <div className="ranking-left">
            <span className="ranking-index">{index + 1}</span>
            <span className="ranking-skill">{item.skill}</span>
            <span className={`ranking-tag ${item.type === 'Hard' ? 'hard' : 'soft'}`}>
              {item.type}
            </span>
          </div>
          <div className="ranking-count-wrap">
            <span className="ranking-count">{item.count} students</span>
            <span className="ranking-bar" style={{ width: `${Math.min(100, Math.max(8, Math.round((item.count / 150) * 100)))}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="avatar-circle">
      {initials || 'ST'}
    </div>
  );
}

function buildMockDashboardData(): DashboardData {
  return {
    faculty: FACULTY_NAME,
    summary: {
      facultyAverage: 78,
      universityAverage: 72,
      studentsAssessed: 412,
      studentsTotal: 450,
      activeSessions: 12
    },
    skillGaps: {
      radarData: [
        { skill: 'Docker', type: 'Hard', competent: 68, gap: 32 },
        { skill: 'Cloud AWS', type: 'Hard', competent: 61, gap: 39 },
        { skill: 'CI/CD', type: 'Hard', competent: 57, gap: 43 },
        { skill: 'Communication', type: 'Soft', competent: 74, gap: 26 },
        { skill: 'Tone Management', type: 'Soft', competent: 65, gap: 35 },
        { skill: 'Problem Solving', type: 'Soft', competent: 76, gap: 24 }
      ],
      topMissingSkills: {
        hard: [
          { skill: 'Cloud AWS', count: 132, type: 'Hard' },
          { skill: 'CI/CD', count: 120, type: 'Hard' },
          { skill: 'Docker', count: 115, type: 'Hard' }
        ],
        soft: [
          { skill: 'Tone Management', count: 94, type: 'Soft' },
          { skill: 'Communication', count: 88, type: 'Soft' },
          { skill: 'Presentation', count: 73, type: 'Soft' }
        ]
      }
    },
    trend: [
      { month: 'Nov', preTest: 64, postTest: 72 },
      { month: 'Dec', preTest: 66, postTest: 74 },
      { month: 'Jan', preTest: 67, postTest: 76 },
      { month: 'Feb', preTest: 69, postTest: 77 },
      { month: 'Mar', preTest: 70, postTest: 78 }
    ],
    topTalent: [
      { studentId: 'st-01', name: 'Nicha Vong', major: 'Computer Engineering', overallScore: 94, resumeActionId: 'st-01', interviewActionId: 'st-01' },
      { studentId: 'st-02', name: 'Krit Mahasak', major: 'Information Systems', overallScore: 92, resumeActionId: 'st-02', interviewActionId: 'st-02' },
      { studentId: 'st-03', name: 'Ploy Sirin', major: 'Software Engineering', overallScore: 91, resumeActionId: 'st-03', interviewActionId: 'st-03' },
      { studentId: 'st-04', name: 'Anan Kittipong', major: 'Data Science', overallScore: 90, resumeActionId: 'st-04', interviewActionId: 'st-04' },
      { studentId: 'st-05', name: 'Fah Panita', major: 'Digital Business Technology', overallScore: 89, resumeActionId: 'st-05', interviewActionId: 'st-05' }
    ],
    dataMode: {
      usesRealScores: false,
      usesSimulatedTrend: true,
      usesFallbackTalent: true
    }
  };
}

function mergeDashboardData(mock: DashboardData, incoming?: Partial<DashboardData>): DashboardData {
  if (!incoming) {
    return mock;
  }

  return {
    faculty: incoming.faculty || mock.faculty,
    summary: {
      facultyAverage: sanitizeNumber(incoming.summary?.facultyAverage, mock.summary.facultyAverage),
      universityAverage: sanitizeNumber(incoming.summary?.universityAverage, mock.summary.universityAverage),
      studentsAssessed: sanitizeNumber(incoming.summary?.studentsAssessed, mock.summary.studentsAssessed),
      studentsTotal: sanitizeNumber(incoming.summary?.studentsTotal, mock.summary.studentsTotal),
      activeSessions: sanitizeNumber(incoming.summary?.activeSessions, mock.summary.activeSessions)
    },
    skillGaps: {
      radarData: Array.isArray(incoming.skillGaps?.radarData) && incoming.skillGaps?.radarData.length
        ? incoming.skillGaps.radarData
        : mock.skillGaps.radarData,
      topMissingSkills: {
        hard: Array.isArray(incoming.skillGaps?.topMissingSkills?.hard) && incoming.skillGaps?.topMissingSkills?.hard.length
          ? incoming.skillGaps.topMissingSkills.hard
          : mock.skillGaps.topMissingSkills.hard,
        soft: Array.isArray(incoming.skillGaps?.topMissingSkills?.soft) && incoming.skillGaps?.topMissingSkills?.soft.length
          ? incoming.skillGaps.topMissingSkills.soft
          : mock.skillGaps.topMissingSkills.soft
      }
    },
    trend: Array.isArray(incoming.trend) && incoming.trend.length ? incoming.trend : mock.trend,
    topTalent: Array.isArray(incoming.topTalent) && incoming.topTalent.length ? incoming.topTalent : mock.topTalent,
    dataMode: {
      usesRealScores: incoming.dataMode?.usesRealScores ?? true,
      usesSimulatedTrend: incoming.dataMode?.usesSimulatedTrend ?? false,
      usesFallbackTalent: incoming.dataMode?.usesFallbackTalent ?? false
    }
  };
}

function sanitizeNumber(value: unknown, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}
