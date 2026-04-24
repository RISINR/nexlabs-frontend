import { Link, useLocation, useNavigate } from "react-router";
import { useEffect, useState, useRef } from "react";
import { io as ioClient } from 'socket.io-client';
import { motion } from "framer-motion"; 
import imgLogo from "../assets/NexLabsLogo.png";
import { clearAuthSession, getAuthToken } from '../utils/authStorage';
import { BACKEND_ORIGIN, buildApiUrl } from '../utils/apiBase';
import { useConfirmDialog } from './ui/ConfirmDialogProvider';

export function Navbar() {
  const [hasBackground, setHasBackground] = useState(false);
  const [hasHeroSection, setHasHeroSection] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [heroTop, setHeroTop] = useState<number>(0);
  const [user, setUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const confirmDialog = useConfirmDialog();
  const ddRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);
  const [ddMinWidth, setDdMinWidth] = useState<number | null>(null);

  const handleLogoutClick = async () => {
    const confirmed = await confirmDialog({
      title: 'Are you sure you want to log out?',
      description: 'You will need to sign in again to continue.',
      confirmText: 'Log out',
      cancelText: 'Cancel',
      tone: 'danger',
    });
    if (!confirmed) return;
    handleLogout();
  };

  useEffect(() => {
    let heroEl: HTMLElement | null = null;
    const findHero = () => {
      heroEl = document.querySelector('[data-hero-section]') as HTMLElement | null;
      setHasHeroSection(Boolean(heroEl));
      if (heroEl) setHeroTop(heroEl.offsetTop ?? 0);
    };
    const handleScroll = () => {
      if (!heroEl) findHero();
      const navH = navRef.current?.getBoundingClientRect().height ?? 72;
      if (heroEl) {
        // compute absolute bottom of hero (document coordinates)
        const heroTop = heroEl.offsetTop;
        const heroHeight = heroEl.offsetHeight;
        const heroBottomAbs = heroTop + heroHeight;
        // current scroll position + nav height indicates nav has passed hero bottom
        const scrolledPastHero = window.scrollY + navH >= heroBottomAbs - 8;
        setHasBackground(scrolledPastHero);
      } else {
        setHasBackground(window.scrollY > 100);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    // also run once to initialize
    findHero();
    handleScroll();
    // ensure hero presence flag updates on resize
    const onResizeWrapped = () => { findHero(); setHeroTop((document.querySelector('[data-hero-section]') as HTMLElement | null)?.offsetTop ?? 0); };
    window.addEventListener('resize', onResizeWrapped, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener('resize', onResizeWrapped as any);
    };
  }, []);

  // hide on scroll down, show on scroll up
  const lastScrollY = useRef<number>(0);
  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      const delta = current - lastScrollY.current;
      // small threshold to avoid jitter
      if (Math.abs(delta) < 10) return;

      // If navbar has background (we've passed the hero), keep navbar visible
      if (hasBackground) {
        setShowNavbar(true);
        lastScrollY.current = current;
        return;
      }

      // If hero section still visible under the nav, keep navbar fixed/visible
      const heroEl = document.querySelector('[data-hero-section]') as HTMLElement | null;
      const navH = navRef.current?.getBoundingClientRect().height ?? 72;
      const heroRect = heroEl?.getBoundingClientRect();
      const heroVisible = heroRect ? heroRect.bottom > navH + 8 : false;
      if (heroVisible) {
        setShowNavbar(true);
        lastScrollY.current = current;
        return;
      }

      if (current <= 0) {
        setShowNavbar(true);
      } else if (delta > 0 && current > 100) {
        // scrolling down (only hide when past hero) — but we've already returned when hasBackground
        setShowNavbar(false);
      } else if (delta < 0) {
        // scrolling up
        setShowNavbar(true);
      }
      lastScrollY.current = current;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [hasBackground]);

  // expose current navbar height as a CSS variable so pages can offset content
  useEffect(() => {
    const updateNavHeight = () => {
      const h = navRef.current?.getBoundingClientRect().height ?? 72;
      document.documentElement.style.setProperty('--navbar-height', `${h}px`);
    };
    updateNavHeight();
    window.addEventListener('resize', updateNavHeight, { passive: true });
    return () => window.removeEventListener('resize', updateNavHeight as any);
  }, [showNavbar]);

  useEffect(() => {
    const loadUser = () => {
      const stored = localStorage.getItem("nexlabs_user") || sessionStorage.getItem("nexlabs_user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (_) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };
    loadUser();
    const onStorage = (ev?: Event) => {
      try {
        // If the event provided a user payload, use it directly for immediate update
        const detail = (ev as CustomEvent<any>)?.detail;
        if (detail) {
          setUser(detail);
          return;
        }
      } catch (e) {
        // fallback to reading storage
      }
      loadUser();
    };
    window.addEventListener("storage", onStorage as EventListener);
    window.addEventListener("nexlabs:auth-changed", onStorage as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage as EventListener);
      window.removeEventListener("nexlabs:auth-changed", onStorage as EventListener);
    };
  }, []);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!ddRef.current) return;
      if (!ddRef.current.contains(e.target as Node)) setDropdownOpen(false);
    };
    if (dropdownOpen) document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [dropdownOpen]);

  // Measure trigger button width and set as dropdown min-width so the menu adapts to content
  useEffect(() => {
    if (!dropdownOpen) {
      setDdMinWidth(null);
      return;
    }
    const container = ddRef.current;
    if (!container) return;
    const btn = container.querySelector('button');
    const measure = () => {
      const rect = btn instanceof Element ? btn.getBoundingClientRect() : null;
      const w = rect?.width ?? 220;
      // clamp between 180 and 640
      const clamped = Math.max(180, Math.min(w, 640));
      setDdMinWidth(clamped);
    };
    measure();
    window.addEventListener('resize', measure, { passive: true });
    return () => window.removeEventListener('resize', measure as EventListener);
  }, [dropdownOpen]);

  const isActive = (path: string) => location.pathname === path;
  const smoothTransition = {
    y: { type: 'spring', stiffness: 70, damping: 22, mass: 0.9 }
  };

  // If there's no hero section on this page, default to dark text/background.
  const useDarkText = hasBackground || !hasHeroSection;

  const dashboardPath = user?.role === 'university' ? '/university/dashboard' : '/dashboard/student';

  const navItems = user
    ? [
        { name: "Dashboard", path: dashboardPath },
        { name: "Resume AI", path: "/resume" },
        { name: "Interview AI", path: "/interview" },
        { name: "Community", path: "/community" },
      ]
    : [
        { name: "Home", path: "/" },
        { name: "Resume AI", path: "/resume" },
        { name: "Interview AI", path: "/interview" },
        { name: "Academic Partners", path: "/partners" },
      ];

  const initial = user ? ((user.displayName && user.displayName.charAt(0)) || (user.firstName && user.firstName.charAt(0)) || (user.name && user.name.charAt(0)) || 'U') .toUpperCase() : 'U';
  const displayName = user ? (user.displayName || `${(user.firstName || '').trim()} ${(user.lastName || '').trim()}`.trim() || user.name || 'User') : '';
  
  // Shortened display name for responsive navbar: extract first + quoted portion if present, or just first name
  const getShortDisplayName = (fullName: string) => {
    if (!fullName) return 'User';
    const quoteMatch = fullName.match(/^([^"\']+)\s*["\']([^"\']+)["\']/);
    if (quoteMatch) {
      const first = quoteMatch[1].trim();
      const nickname = quoteMatch[2].trim();
      return `${first} "${nickname}"`;
    }
    // Fallback: show first name only if full name has multiple words
    const parts = fullName.split(' ');
    return parts.length > 1 ? parts[0] : fullName;
  };
  const shortDisplayName = getShortDisplayName(displayName);
  
  const role = user?.role || '';
  const mapRoleToStatus = (r: string) => {
    if (!r) return '';
    const key = String(r).toLowerCase();
    if (key === 'user' || key === 'googleuser' || key === 'googleuser') return 'student';
    if (key === 'student') return 'student';
    return r;
  };
  const statusLabel = mapRoleToStatus(role);

  const makeAvatarDataUrl = (nameStr: string) => {
    const initials = (nameStr || 'U').split(' ').map(s => s.charAt(0)).slice(0,2).join('').toUpperCase();
    const bg = '#1f2937';
    const fg = '#ffffff';
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='128' height='128'><rect width='100%' height='100%' fill='${bg}' rx='64'/><text x='50%' y='50%' font-family='Poppins,Arial' font-size='52' fill='${fg}' dominant-baseline='middle' text-anchor='middle'>${initials}</text></svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  };
  const avatarSrc = user && user.avatar ? user.avatar : makeAvatarDataUrl(displayName || initial);

  const handleLogout = () => {
    clearAuthSession();
    setUser(null);
    setDropdownOpen(false);
    navigate("/");
  };

  // Notifications: try backend when authenticated, otherwise fallback to localStorage
  const [notifications, setNotifications] = useState<Array<{id:string; title:string; body:string; time:string; read?:boolean;}>>([]);

  const normalizeNotification = (n: any) => ({
    id: String(n?.id || n?._id || `n-${Date.now()}`),
    title: n?.title || (n?.fromUserId?.displayName ? `Message from ${n.fromUserId.displayName}` : 'NexLabs Notification'),
    body: n?.body || n?.text || '',
    time: n?.time || n?.createdAt || new Date().toISOString(),
    read: !!n?.read,
  });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const token = getAuthToken();
        if (token) {
          const res = await fetch(buildApiUrl('/notifications'), { headers: { Authorization: `Bearer ${token}` } });
          if (res.ok) {
            const data = await res.json();
            const rawList = Array.isArray(data) ? data : (data.notifications || data.data || []);
            const normalized = (rawList || []).map(normalizeNotification);
            const sorted = normalized.slice().sort((a: any, b: any) => {
              // unread first
              const ra = a.read ? 1 : 0;
              const rb = b.read ? 1 : 0;
              if (ra !== rb) return ra - rb;
              // newest first
              const ta = new Date(a.time).getTime();
              const tb = new Date(b.time).getTime();
              return tb - ta;
            });
            if (mounted) setNotifications(sorted);
            return;
          }
        }

        // fallback to localStorage
        const raw = localStorage.getItem('nexlabs_notifications');
        if (raw) {
          const parsed = (JSON.parse(raw) || []).map(normalizeNotification);
          const sorted = parsed.slice().sort((a: any, b: any) => {
            const ra = a.read ? 1 : 0;
            const rb = b.read ? 1 : 0;
            if (ra !== rb) return ra - rb;
            return new Date(b.time).getTime() - new Date(a.time).getTime();
          });
          if (mounted) setNotifications(sorted);
          return;
        }

        const sample = [
          { id: 'nexlabs-sample-1', title: 'NexLabs Update', body: 'NexLabs: Resume processed successfully. Check your updated resume in My Resumes.', time: new Date().toISOString(), read: false }
        ];
        try { localStorage.setItem('nexlabs_notifications', JSON.stringify(sample)); } catch (e) {}
        if (mounted) setNotifications(sample);
      } catch (e) {
        if (mounted) setNotifications([]);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  // Real-time socket: connect when token exists and update notifications live
  // Reconnect whenever `user` changes so new logins immediately join user room.
  useEffect(() => {
    let socket: any = null;
    const token = getAuthToken();
    if (!token) {
      return;
    }
    try {
    socket = ioClient(BACKEND_ORIGIN || window.location.origin, { query: { token } });
    try { (window as any).__nexlabs_socket = socket; } catch (e) {}
      socket.on('connect', () => {
        // connected
      });
      socket.on('notification', (n: any) => {
        const normalized = normalizeNotification(n);
        // prepend and sort: unread/newest first
        setNotifications(prev => {
          const merged = [normalized, ...(prev || [])];
          const sorted = (merged || []).slice().sort((a:any,b:any) => { const ra = a.read?1:0; const rb = b.read?1:0; if(ra!==rb) return ra-rb; return new Date(b.createdAt||b.time).getTime() - new Date(a.createdAt||a.time).getTime(); });
          try { localStorage.setItem('nexlabs_notifications', JSON.stringify(sorted)); } catch(e){}
          return sorted;
        });
        // broadcast a window event so other components (chat UI) can react
        try { window.dispatchEvent(new CustomEvent('nexlabs:notification', { detail: normalized })); } catch(e){}
      });
      socket.on('chat:message', (m: any) => {
        try {
          console.log('[socket] chat:message received in Navbar', m);
          window.dispatchEvent(new CustomEvent('nexlabs:chat:message', { detail: m }));
        } catch(e){}
      });
    } catch (e) {}
    return () => { try { if ((window as any).__nexlabs_socket === socket) (window as any).__nexlabs_socket = null; socket && socket.disconnect(); } catch(e) {} };
  }, [user]);

  useEffect(() => {
    try { localStorage.setItem('nexlabs_notifications', JSON.stringify(notifications)); } catch (e) {}
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const [showAccountNotifications, setShowAccountNotifications] = useState(false);
  const [expandedNotifId, setExpandedNotifId] = useState<string | null>(null);

  const openNotification = async (id: string) => {
    setNotifications(prev => {
      const mapped = prev.map(n => n.id === id ? { ...n, read: true } : n);
      return mapped.slice().sort((a: any, b: any) => {
        const ra = a.read ? 1 : 0;
        const rb = b.read ? 1 : 0;
        if (ra !== rb) return ra - rb;
        return new Date(b.time).getTime() - new Date(a.time).getTime();
      });
    });
    setExpandedNotifId(id);

    const token = getAuthToken();
    if (!token) return;
    try {
      await fetch(buildApiUrl(`/notifications/${id}/read`), { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
    } catch (e) {
      // ignore
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
    setExpandedNotifId(null);
    setShowAccountNotifications(false);
  };

 // ... (ส่วน imports และ logic เดิมคงไว้)

    return (
    <>
    <motion.nav
      initial={false}
      animate={{
          height: hasBackground ? 70 : 80,
          // when over hero -> transparent; when scrolled past hero -> white background
          backgroundColor: hasBackground ? "rgba(255, 255, 255, 0.95)" : "transparent",
          backdropFilter: hasBackground ? "blur(12px)" : "none",
          WebkitBackdropFilter: hasBackground ? "blur(12px)" : "none",
          // soft shadow when background present
          boxShadow: hasBackground
            ? "0 4px 20px -5px rgba(0, 0, 0, 0.05), 0 2px 10px -5px rgba(0, 0, 0, 0.02)"
            : "none",
          borderColor: hasBackground ? "rgba(0, 0, 0, 0.05)" : "transparent",
          // show/hide on scroll (translate only)
          y: showNavbar ? 0 : -72,
          }}
      transition={smoothTransition}
      ref={navRef}
        // position switches between absolute over the hero and fixed at top once scrolled past
        style={{
          position: hasBackground ? 'fixed' : 'absolute',
          top: hasBackground ? 0 : `${heroTop}px`,
          left: 0,
          right: 0,
          zIndex: 50 as any,
        }}
        className="w-full z-50 border-b flex items-center transition-all"
    >
      {/* ใช้ w-full และ px เพื่อให้ดีไซน์กว้างเต็มตาแต่ยังมี margin ด้านข้าง */}
      <div className="w-full px-8 md:px-12 flex items-center justify-between">
        
        {/* --- 1. Left (Logo) --- */}
        <div className="flex-1 flex justify-start items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div 
              className="h-12 w-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-sm  overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img src={imgLogo} alt="Logo" className="w-6.5 h-6.5 object-contain" />
            </motion.div>
            <span
              className={`font-['Poppins'] text-[24px] tracking-tight ${useDarkText ? 'text-black' : 'text-white'}`}
              style={useDarkText ? undefined : { color: '#ffffff' }}
            >
              NexLabs
            </span>
          </Link>
        </div>

        {/* --- 2. Center (Links) --- */}
        <div className="hidden lg:flex items-center justify-center gap-2 flex-[2]">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative font-['Poppins'] text-[14px]  px-4 py-2 rounded-full transition-all duration-300
                ${isActive(item.path)
                  ? `${useDarkText ? 'text-black bg-black/5 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)]' : 'text-white bg-white/5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]'}`
                  : `${useDarkText ? 'text-gray-500 hover:text-black hover:bg-gray-50' : 'text-white/90 hover:text-white hover:bg-white/5'}`
                }
              `}
              style={useDarkText ? undefined : { color: '#ffffff' }}
            >
              {item.name}
              {isActive(item.path) && (
                <motion.span
                  layoutId="activeUnderline"
                  className={`absolute bottom-1 left-4 right-4 h-[1.5px] rounded-full ${useDarkText ? 'bg-black' : 'bg-white/90'}`}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* --- 3. Right (Auth / User Tools) --- */}
        <div className="flex-1 flex justify-end items-center gap-4">
          {!user ? (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className={`font-['Poppins'] text-[14px] transition-colors ${useDarkText ? 'text-gray-600 hover:text-black' : 'text-white/95 hover:text-white'}`}
                style={useDarkText ? undefined : { color: '#ffffff' }}
              >
                Log in
              </Link>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/register"
                  className="px-6 py-2.5 bg-black text-white rounded-full font-['Poppins'] text-[13px] font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  Sign Up
                </Link>
              </motion.div>
            </div>
          ) : (
            <div className="flex items-center gap-5">
              {/* Notification bell - ปรับให้นุ่มนวลขึ้น */}
              <button
                className={`relative p-2 rounded-full transition-all ${useDarkText ? 'text-gray-400 hover:text-black hover:bg-gray-100' : 'text-white/95 hover:text-white hover:bg-white/10'}`}
                style={useDarkText ? undefined : { color: '#ffffff' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
              </button>

              {/* Group: Name + Avatar + Dropdown */}
              <div className="relative" ref={ddRef}>
                <button
                  onClick={() => setDropdownOpen((s) => !s)}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full transition-all ${useDarkText ? 'bg-gray-50/60 hover:bg-white hover:shadow' : 'bg-transparent hover:bg-white/10'}`}
                  style={useDarkText ? undefined : { color: '#ffffff' }}
                >
                  {/* avatar on left */}
                  <div className="h-8 w-8 rounded-full bg-gray-100 text-white flex items-center justify-center text-sm overflow-hidden shadow-sm flex-shrink-0" style={{ width: 32, height: 32 }}>
                    <img src={avatarSrc} alt="avatar" className="h-full w-full" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                  </div>
                  {/* name on right of avatar - responsive sizing and truncation */}
                  <div className="flex flex-col items-start max-w-[140px] sm:max-w-[160px] md:max-w-[180px] truncate">
                    <span
                      className={`font-['Poppins'] text-[14px] sm:text-[15px] ${useDarkText ? 'text-gray-800' : 'text-white'} truncate leading-tight`}
                        style={useDarkText ? undefined : { color: '#ffffff' }}
                    >
                      {shortDisplayName}
                    </span>
                  </div>
                  {/* dropdown indicator */}
                  <svg
                    className={`h-4 w-4 ml-1 transition-transform flex-shrink-0 ${dropdownOpen ? 'rotate-180' : ''} ${useDarkText ? 'text-gray-500' : 'text-white/95'}`}
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

{dropdownOpen && (
<motion.div
  initial={{ opacity: 0, y: 12, scale: 0.97 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  exit={{ opacity: 0, y: 12, scale: 0.97 }}
  transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="absolute mt-4 rounded-[20px] p-3 z-50 origin-top-right w-auto"
            style={{
              transformOrigin: 'top right',
              right: '8px',
              left: 'auto',
              width: 'auto',
              minWidth: ddMinWidth ? `${ddMinWidth}px` : '220px',
              maxWidth: 'min(calc(100vw - 32px), 420px)',
              backgroundColor: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              boxShadow: '0 10px 30px -10px rgba(2,6,23,0.18), 0 6px 18px -12px rgba(2,6,23,0.08)',
              border: '1px solid rgba(2,6,23,0.04)'
            }}
>
  {/* Header Account */}
  <div className="px-4 py-3 mb-2">
    <p className="text-[10px] text-gray-400 uppercase tracking-[0.15em] mb-2">
      Account Summary
    </p>
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[14px] sm:text-[15px] font-semibold text-gray-900 tracking-tight truncate break-words">{displayName}</span>
        {statusLabel && (
          <span className="text-[11px] inline-block text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 font-medium flex-shrink-0">
            {statusLabel}
          </span>
        )}
      </div>
      <span className="text-sm text-gray-500 font-light mt-1 truncate">{user.email || 'dreamthanawat@nexlabs.ai'}</span>
    </div>
  </div>

  <div className="h-[1px] bg-gray-100 my-3 mx-4" />

  {/* Menu Items */}
  <div className="space-y-2">
    {/* University dashboard (visible to university role) */}
    {user?.role === 'university' && (
      <Link
        to="/university/dashboard"
        className="flex items-center gap-3 px-4 py-2 min-h-[44px] text-[13px] text-gray-500 font-normal rounded-[12px] hover:bg-gray-50 hover:text-black transition-all duration-200 group"
      >
        <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-gray-50 text-gray-400 group-hover:text-black group-hover:bg-white transition-all shadow-sm group-hover:shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h18v4H3z"/><path d="M3 11h18v10H3z"/></svg>
        </div>
        University Dashboard
      </Link>
    )}

    {/* Notifications (in-dropdown toggle and inline panel) */}
    <div>
      <button
        onClick={() => setShowAccountNotifications(s => !s)}
        className="flex items-center w-full px-4 py-2 min-h-[44px] text-[13px] text-gray-500 font-normal rounded-[12px] hover:bg-gray-50 hover:text-black transition-all duration-200 group"
      >
        <div className="inline-flex items-center gap-3">
          <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-gray-50 text-gray-400 group-hover:text-black group-hover:bg-white transition-all shadow-sm group-hover:shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
          </div>
          <span className="text-[13px] text-gray-500">Notifications</span>
        </div>
        {unreadCount > 0 && <div className="ml-auto text-xs text-white bg-red-500 px-2 py-0.5 rounded-full">{unreadCount}</div>}
      </button>

      {showAccountNotifications && (
        <motion.div
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 8 }}
          className="absolute top-4 z-50"
          style={{
            right: 'calc(100% + 12px)',
            width: 320,
            maxWidth: 'min(80vw, 320px)',
            backgroundColor: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            boxShadow: '0 8px 30px rgba(2,6,23,0.12)',
            border: '1px solid rgba(2,6,23,0.04)',
            borderRadius: 12,
            padding: 12,
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium">Notifications</div>
            <div className="flex items-center gap-2">
              <button onClick={() => setNotifications(prev => [...prev, { id: `n-${Date.now()}`, title: 'New test notification', body: 'This is a test', time: new Date().toISOString(), read: false }])} className="text-xs text-blue-600">Add</button>
              <button onClick={clearNotifications} className="text-xs text-gray-500">Clear</button>
            </div>
          </div>

          <div className="max-h-56 overflow-auto space-y-2">
            {notifications.length === 0 && (
              <div className="text-sm text-gray-500 p-2">No notifications</div>
            )}
            {notifications.map(n => (
              <div key={n.id} className="border rounded-lg p-2 bg-gray-50">
                <button onClick={() => openNotification(n.id)} className="w-full text-left">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{n.title}</div>
                    <div className="text-xs text-gray-400">{new Date(n.time).toLocaleString()}</div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 truncate">{n.body}</div>
                </button>
                {expandedNotifId === n.id && (
                  <div className="mt-2 text-sm text-gray-700">
                    {n.body}
                    <div className="mt-2 text-right">
                      <button onClick={() => setExpandedNotifId(null)} className="text-xs text-gray-500">Close</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>

    {/* 1. Settings */}
    <Link 
      to="/settings" 
      className="flex items-center gap-3 px-4 py-2 min-h-[44px] text-[13px] text-gray-500 font-normal rounded-[12px] hover:bg-gray-50 hover:text-black transition-all duration-200 group"
    >
      <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-gray-50 text-gray-400 group-hover:text-black group-hover:bg-white transition-all shadow-sm group-hover:shadow-md">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.72l-.22-.39a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      </div>
      Settings
    </Link>

    {/* 2. My Resumes */}
    <Link 
      to="/resume" 
      className="flex items-center gap-3 px-4 py-2 min-h-[44px] text-[13px] text-gray-500 font-normal rounded-[12px] hover:bg-gray-50 hover:text-black transition-all duration-200 group"
    >
      <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-gray-50 text-gray-400 group-hover:text-black group-hover:bg-white transition-all shadow-sm group-hover:shadow-md">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <line x1="10" y1="9" x2="8" y2="9"/>
        </svg>
      </div>
      My Resumes
    </Link>
    

    <div className="h-[1px] bg-gray-100 my-3 mx-4" />

    {/* 3. Log out */}
    <button 
      onClick={handleLogoutClick}
      className="w-full flex items-center gap-3.5 px-4 py-2 min-h-[44px] text-[13px] text-red-400 font-normal rounded-[12px] hover:bg-red-50 hover:text-red-500 transition-all duration-200 group"
    >
      <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-red-50 text-red-400 group-hover:bg-white transition-all shadow-sm group-hover:shadow-md gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
      </div>
      <span className="font-medium">Log out</span>
    </button>
  </div>
</motion.div>
)}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
    {/* notifications drawer removed - replaced by left-panel anchored to dropdown */}
    </>
  );
}