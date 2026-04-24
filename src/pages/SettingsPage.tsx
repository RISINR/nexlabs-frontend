import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";
import ProfileForm from "../components/settings/ProfileForm";
import AccountForm from "../components/settings/AccountForm";
import { buildBackendUrl } from '../utils/apiBase';
import styles from './SettingsPage.module.css';

// Simple Icon Components
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);
const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
);

function validateEmail(e: string) {
  return /\S+@\S+\.\S+/.test(e);
}

export default function SettingsPage() {
  const navigate = useNavigate();
  // State
  const [activeTab, setActiveTab] = useState<'profile' | 'account'>('profile');
  const [name, setName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [position, setPosition] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [githubSSOConnected, setGithubSSOConnected] = useState(false);
  const [githubConnected, setGithubConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("nexlabs_user") || sessionStorage.getItem("nexlabs_user");
    if (stored) {
      try {
        const u = JSON.parse(stored);
        // Prefer public displayName when initializing the Display Name field
        setName(u.displayName || u.name || "");
        if (u.firstName || u.lastName) {
          setFirstName(u.firstName || "");
          setLastName(u.lastName || "");
        } else if (u.name) {
          const parts = String(u.name).trim().split(/\s+/);
          setFirstName(parts.shift() || "");
          setLastName(parts.join(' ') || "");
        }
        setPosition(u.position || "");
        setEmail(u.email || "");
        setAvatar(u.avatar || "");
        setGithubSSOConnected(!!u.githubSSOConnected);
        setGithubConnected(!!u.githubConnected);
      } catch (e) { }
    }
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const onPickFile = (file?: File) => {
    const f = file || fileRef.current?.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(String(reader.result));
    };
    reader.readAsDataURL(f);
  };

  const handleSaveProfile = async () => {
    setError(null);
    // prefer explicit display name if provided, otherwise combine first/last
    const combined = `${firstName} ${lastName}`.trim();
    const displayName = name?.trim() || combined;
    if (!displayName) return setError("Name is required");
    setLoading(true);
    try {
      const storedToken = localStorage.getItem('nexlabs_token') || sessionStorage.getItem('nexlabs_token');
      if (!storedToken) throw new Error('Not authenticated');
      const payload = { firstName, lastName, displayName, position, avatar };
      const res = await (await import('../services/authAPI')).authAPI.updateProfile(storedToken, payload);
      // update local storage with returned user
      const storage = localStorage.getItem('nexlabs_token') ? localStorage : sessionStorage;
      storage.setItem('nexlabs_user', JSON.stringify(res.user));
      try { window.dispatchEvent(new CustomEvent('nexlabs:auth-changed')); } catch(e) {}
      setToast('Profile updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAccount = async () => {
    setError(null);
    if (!validateEmail(email)) return setError("Please enter a valid email");
    if (password && password.length < 6) return setError("Password must be at least 6 characters");
    if (password && password !== confirmPassword) return setError("Passwords do not match");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    const storedToken = localStorage.getItem("nexlabs_token");
    const storage = storedToken ? localStorage : sessionStorage;
    const prev = storage.getItem("nexlabs_user");
    const userObj = prev ? JSON.parse(prev) : {};
    userObj.email = email;
    storage.setItem("nexlabs_user", JSON.stringify(userObj));
    setLoading(false);
    setToast("Security settings updated");
  };

  const handleLogout = () => {
    localStorage.removeItem("nexlabs_token");
    localStorage.removeItem("nexlabs_user");
    sessionStorage.removeItem("nexlabs_token");
    sessionStorage.removeItem("nexlabs_user");
    try { window.dispatchEvent(new CustomEvent("nexlabs:auth-changed")); } catch(e) {}
    navigate("/");
  };

  const handleConnectGitHubSSO = () => {
    // Open SSO window (backend endpoint should handle the OAuth flow)
    try {
      window.open(buildBackendUrl('/auth/github/university'), 'github_sso', 'width=600,height=700');
    } catch (e) {
      console.warn('Could not open SSO window', e);
    }
    setGithubSSOConnected(true);
    const stored = localStorage.getItem('nexlabs_user') || sessionStorage.getItem('nexlabs_user');
    const userObj = stored ? JSON.parse(stored) : {};
    userObj.githubSSOConnected = true;
    const storedToken = localStorage.getItem('nexlabs_token');
    const storage = storedToken ? localStorage : sessionStorage;
    storage.setItem('nexlabs_user', JSON.stringify(userObj));
    setToast('Connected GitHub (University SSO)');
  };

  const handleDisconnectGitHub = () => {
    setGithubConnected(false);
    const stored = localStorage.getItem('nexlabs_user') || sessionStorage.getItem('nexlabs_user');
    const userObj = stored ? JSON.parse(stored) : {};
    delete userObj.githubConnected;
    const storedToken = localStorage.getItem('nexlabs_token');
    const storage = storedToken ? localStorage : sessionStorage;
    storage.setItem('nexlabs_user', JSON.stringify(userObj));
    setToast('Disconnected GitHub');
  };

  const handleConnectGitHub = () => {
    try {
      window.open(buildBackendUrl('/auth/github'), 'github_connect', 'width=600,height=700');
    } catch (e) {
      console.warn('Could not open GitHub window', e);
    }
    setGithubConnected(true);
    const stored = localStorage.getItem('nexlabs_user') || sessionStorage.getItem('nexlabs_user');
    const userObj = stored ? JSON.parse(stored) : {};
    userObj.githubConnected = true;
    const storedToken = localStorage.getItem('nexlabs_token');
    const storage = storedToken ? localStorage : sessionStorage;
    storage.setItem('nexlabs_user', JSON.stringify(userObj));
    setToast('Connected GitHub');
  };

  const handleDisconnectGitHubSSO = () => {
    setGithubSSOConnected(false);
    const stored = localStorage.getItem('nexlabs_user') || sessionStorage.getItem('nexlabs_user');
    const userObj = stored ? JSON.parse(stored) : {};
    delete userObj.githubSSOConnected;
    const storedToken = localStorage.getItem('nexlabs_token');
    const storage = storedToken ? localStorage : sessionStorage;
    storage.setItem('nexlabs_user', JSON.stringify(userObj));
    setToast('Disconnected GitHub SSO');
  };

  // --- UI Components ---

  const SidebarItem = ({ id, label, icon, active }: { id: 'profile' | 'account', label: string, icon: any, active: boolean }) => (
    <motion.button
      onClick={() => setActiveTab(id)}
      layout
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.995 }}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
        active 
          ? "bg-blue-50 text-blue-700 font-medium shadow-sm ring-1 ring-blue-100" 
          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      <div className={`${active ? "text-black-600" : "text-gray-400"}`}>
        {icon}
      </div>
      <span className="text-sm">{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600"></div>}
    </motion.button>
  );

  const InputField = ({ label, value, onChange, type = "text", placeholder, subtext }: any) => (
    <div className="mb-5">
      <label className="block text-sm text-gray-700 mb-1.5">{label}</label>
      <input 
        type={type}
        value={value} 
        onChange={onChange} 
        placeholder={placeholder}
        className="block w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all placeholder:text-gray-300" 
      />
      {subtext && <p className="text-xs text-gray-400 mt-1.5">{subtext}</p>}
    </div>
  );

  // Placeholder example for Display Name: prefer explicit `name`, then first+last
  const displayExample = (name && String(name).trim())
    ? String(name).trim()
    : (`${(firstName || '').trim()} ${(lastName || '').trim()}`.trim() || 'e.g. Korina Villanueva');

  return (
    // Adjusted: reduce outer min height and use navbar height variable for top offset
    <div className="min-h-0 bg-slate-50 flex flex-col items-center font-[Poppins]">
      <Navbar />
      
      <div
        className="w-full max-w-5xl px-4 sm:px-6 pb-8 animate-fade-in-up"
        style={{ paddingTop: 'calc(var(--navbar-height) + 12px)' }}
      >
        
        {/* Header */}


        {/* Main Card */}
          <div className={styles.cardContainer}>
          <motion.div
            layout
            initial={{ opacity: 0, y: 8, scale: 0.995 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.36, ease: 'easeOut' }}
            className={`${styles.cardInner} mainCard flex flex-col md:flex-row`}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 16,
              overflow: 'hidden',
              boxShadow: '0 10px 30px -18px rgba(2,6,23,0.12), 0 6px 18px -24px rgba(2,6,23,0.06)',
              border: '1px solid rgba(15,23,42,0.10)'
            }}
          >
            {/* Label inside card (top-left) */}
            <div style={{position: 'absolute', top: 12, left: 20}} className="text-sm font-semibold text-gray-700">
              Settings
            </div>
            {/* Log out inside card (top-right) */}
            <button onClick={handleLogout}
              style={{position: 'absolute', top: 12, right: 12}}
              className="px-3 py-1.5 text-sm font-medium text-red-600 bg-white hover:bg-red-50 border border-red-100 rounded-full transition-colors shadow-sm"
            >
              Log out
            </button>
          
          {/* Sidebar */}
          <aside className="w-full md:w-64 bg-slate-50/50 border-b md:border-b-0 md:border-r border-gray-100 p-4 flex-shrink-0">
            <div className="flex flex-col items-center mb-8 text-center pt-2">
              <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                <div className={styles.avatarContainer} onClick={() => fileRef.current?.click()}>
                  {avatar ? (
                    <img src={avatar} alt="avatar" className={styles.avatarImg} />
                  ) : (
                    <div style={{fontSize:36,fontWeight:700,color:'#1f2937'}}>{(firstName?.charAt(0).toUpperCase() || name?.charAt(0)?.toUpperCase() || 'U')}</div>
                  )}
                </div>
                <div className={styles.avatarActions}>
                  <button onClick={() => fileRef.current?.click()}>Change</button>
                  <button className="remove" onClick={() => setAvatar('')}>Remove</button>
                </div>
                <h3 className="mt-3 text-sm font-medium text-gray-900">{(firstName || lastName) ? `${firstName} ${lastName}`.trim() : (name || "User Name")}</h3>
                <p className="text-xs text-gray-500">{position || "Position"}</p>
              </div>
            </div>

            <nav className="space-y-2">
              <SidebarItem 
                id="profile" 
                label="Public Profile" 
                icon={<UserIcon />} 
                active={activeTab === 'profile'} 
              />
              <SidebarItem 
                id="account" 
                label="Account Security" 
                icon={<LockIcon />} 
                active={activeTab === 'account'} 
              />
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 p-4 md:p-6 relative">
            
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={() => onPickFile()} />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.24 }}
              >
                {activeTab === 'profile' && (
                  <ProfileForm
                    firstName={firstName}
                    lastName={lastName}
                    name={name}
                    position={position}
                    avatar={avatar}
                    loading={loading}
                    error={error}
                    displayExample={displayExample}
                    onChangeFirst={(v) => setFirstName(v)}
                    onChangeLast={(v) => setLastName(v)}
                    onChangeName={(v) => setName(v)}
                    onChangePosition={(v) => setPosition(v)}
                    onSave={handleSaveProfile}
                  />
                )}

                {activeTab === 'account' && (
                  <AccountForm
                    email={email}
                    password={password}
                    confirmPassword={confirmPassword}
                    loading={loading}
                    error={error}
                    githubConnected={githubConnected}
                    githubSSOConnected={githubSSOConnected}
                    onChangeEmail={(v) => setEmail(v)}
                    onChangePassword={(v) => setPassword(v)}
                    onChangeConfirm={(v) => setConfirmPassword(v)}
                    onSave={handleSaveAccount}
                    onConnectGitHub={handleConnectGitHub}
                    onDisconnectGitHub={handleDisconnectGitHub}
                    onConnectGitHubSSO={handleConnectGitHubSSO}
                    onDisconnectGitHubSSO={handleDisconnectGitHubSSO}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </main>
          </motion.div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-bounce-in">
          <div className="bg-gray-900/90 backdrop-blur text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3">
            <div className="bg-green-500 rounded-full p-0.5">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
            </div>
            <span className="font-medium text-sm">{toast}</span>
          </div>
        </div>
      )}
    </div>
  );
}