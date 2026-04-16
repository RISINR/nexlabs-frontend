import { Navigate } from 'react-router';
import UniversityDashboard from './UniversityDashboard';

export default function UniversityDashboardWrapper() {
  const stored = localStorage.getItem('nexlabs_user') || sessionStorage.getItem('nexlabs_user');
  const user = stored ? JSON.parse(stored) : null;
  const role = String(user?.role || '').toLowerCase();

  if (!user) return <Navigate to="/login" replace />;
  if (role !== 'university' && role !== 'admin') return <Navigate to="/" replace />;

  return <UniversityDashboard />;
}
