import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useResume } from '../../contexts/ResumeContext';
import { Navbar } from '../../components/Navbar';
import PostComposer from '../../components/community/PostComposer';
import PostList, { Post } from '../../components/community/PostList';
import styles from './CommunityPage.module.css';

// helper to detect MongoDB ObjectId strings
const isObjectId = (id?: string | null) => typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);
// Inline A4 mock (SVG) used as a fallback if external preview fails to load
const A4_MOCK = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 210 297' width='595' height='842'>
  <rect x='0' y='0' width='210' height='297' fill='%23ffffff' stroke='%23e6e9ee' stroke-width='1'/>
  <rect x='8' y='8' width='194' height='281' fill='%23fafbff' rx='6'/> 
  <g fill='%238a98b2' font-family='Inter, Arial, sans-serif'>
    <text x='50%' y='40%' text-anchor='middle' font-size='12'>Template Preview</text>
    <text x='50%' y='50%' text-anchor='middle' font-size='10'>A4 (210×297mm)</text>
    <text x='50%' y='60%' text-anchor='middle' font-size='9'>Demo mock</text>
  </g>
</svg>
`);

const DEMO_NAMES = new Set(['Natchanon','Jane Doe','Arun']);

/*
  Full redesign of Community page: cleaner header, refined filters, gallery/list toggle,
  improved cards, accessible modal with focus trap, right sidebar with controlled news.
*/

type Profile = {
  id: string;
  name: string;
  title: string;
  school?: string;
  skills: string[];
  badges?: string[];
  views: number;
  lastActive: number;
  excerpt?: string;
  location?: string;
  featuredResume?: string;
  tools?: string[];
  rating?: number;
  templatePreview?: string;
  avatar?: string;
};

export const MOCK: Profile[] = [
  { id: 'u4', name: 'May', title: 'Motion Designer', school: 'MotionSchool', skills: ['#Motion', '#AE'], badges: ['Motion Specialist'], views: 2100, lastActive: Date.now() - 1000 * 60 * 60 * 2, excerpt: 'Reels and animated case studies.', location: 'Bangkok, TH', featuredResume: 'Motion_Reel_2026', tools: ['After Effects','Figma'], rating: 4.9, templatePreview: '/images/templates/template-motion1.png' },
];

const NEWS = [
  { id: 'n1', tag: 'Platform', title: 'Motion Graphic templates updated — new previews available', image: 'https://picsum.photos/seed/motion/900/540' },
  { id: 'n2', tag: 'Industry', title: 'Color trends 2027: palettes designers should know', image: 'https://picsum.photos/seed/color/900/540' },
  { id: 'n3', tag: 'Jobs', title: 'UI/UX Intern — Studio X (apply by Apr 10)', image: 'https://picsum.photos/seed/intern/900/540' },
  { id: 'n4', tag: 'Community', title: 'Community highlights and recent milestones', image: 'https://picsum.photos/seed/community/900/540' },
];

const MOCK_POSTS: Post[] = [
  { id: 'p2', author: 'May', content: 'Looking for motion designers to collaborate on a short reel. Anyone want to join a #team? #Motion #portfolio', time: Date.now() - 1000 * 60 * 60 * 6, likes: 12, replies: [], image: ['https://picsum.photos/seed/motion/900/540'] },
  { id: 'p5', author: 'May', content: 'We are forming a team for the design competition — looking for researchers and prototypers. #หาTeam #competition #UXUI', time: Date.now() - 1000 * 60 * 60 * 48, likes: 9, replies: [], image: ['https://picsum.photos/seed/competition/900/540'] },
];

export default function CommunityPage() {
  const pageVariants = {
    hidden: { opacity: 0, y: 6 },
    show: { opacity: 1, y: 0, transition: { when: 'beforeChildren', staggerChildren: 0.04 } },
  };

  const listContainer = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.36 } },
  };
  const [profiles, setProfiles] = useState<Profile[]>(MOCK);
  const [query, setQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'popular' | 'recent'>('popular');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [selected, setSelected] = useState<Profile | null>(null);
  const [connected, setConnected] = useState<Record<string, boolean>>({});
  const [savedProfiles, setSavedProfiles] = useState<Record<string, boolean>>({});
  const [invitedProfiles, setInvitedProfiles] = useState<Record<string, boolean>>({});
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);

  const LOCAL_KEY = 'nexlabs_local_posts';
  const loadLocalPosts = (): Post[] => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY) || sessionStorage.getItem(LOCAL_KEY);
      if (!raw) return [];
      const arr = JSON.parse(raw || '[]');
      if (Array.isArray(arr)) return arr as Post[];
    } catch (e) {}
    return [];
  };
  const saveLocalPosts = (arr: Post[]) => {
    try { localStorage.setItem(LOCAL_KEY, JSON.stringify(arr)); } catch (e) {}
  };

  // Load server feed (public posts) on mount, rehydrate local unsynced posts and attempt sync
  useEffect(() => {
    let mounted = true;

    

    (async () => {
      // fetch server posts
      let serverMapped: Post[] = [];
      try {
        const res = await fetch('/api/community');
        if (res.ok) {
          const data = await res.json();
          const items = data.data || [];
          const storedUserRaw = localStorage.getItem('nexlabs_user') || sessionStorage.getItem('nexlabs_user');
          const storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : null;
          const myId = storedUser?._id || storedUser?.id || null;
          serverMapped = items.map((post: any): Post => {
            const authorObj = post.authorId || {};
            const authorName = authorObj.displayName || ((authorObj.firstName || '') + ' ' + (authorObj.lastName || '')).trim() || 'User';
            return {
              id: post._id || post.id,
              author: authorName,
              authorId: (authorObj && (authorObj._id || authorObj)) || (post.authorId || undefined),
              authorAvatar: authorObj.avatar || undefined,
              content: post.body || post.title || '',
              time: post.createdAt ? new Date(post.createdAt).getTime() : Date.now(),
              likes: Array.isArray(post.likes) ? post.likes.length : (post.likes || 0),
              _liked: myId && Array.isArray(post.likes) ? post.likes.some((l:any) => String(l) === String(myId)) : false,
              image: Array.isArray(post.attachments) ? post.attachments.filter((a:any) => typeof a === 'string' && a.startsWith('data:')) : undefined,
              attachments: post.attachments || [],
              replies: Array.isArray(post.comments) ? post.comments.map((c:any) => ({ id: c._id || ('r'+Math.random().toString(36).slice(2,9)), author: (c.authorId && (c.authorId.displayName || (c.authorId.firstName || '') + ' ' + (c.authorId.lastName || ''))) || 'Someone', authorAvatar: c.authorId?.avatar || undefined, authorId: (c.authorId && (c.authorId._id || c.authorId)) || undefined, content: c.text || '', time: c.createdAt ? new Date(c.createdAt).getTime() : Date.now() })) : undefined,
            };
          });
        }
      } catch (e) {
        // ignore
      }

      // rehydrate local unsynced posts
      const localPosts = loadLocalPosts();

      if (!mounted) return;
      // merge server posts first, then any local posts that are not present on server
      const serverIds = new Set(serverMapped.map(m => m.id));
      const localsOnly = localPosts.filter(p => !serverIds.has(p.id));
      setPosts(() => [...serverMapped, ...localsOnly]);

      // try to sync local posts if token available
      const token = localStorage.getItem('nexlabs_token') || sessionStorage.getItem('nexlabs_token');
      if (token && localPosts.length) {
        const remaining: Post[] = [];
        for (const lp of localPosts) {
          try {
            const res = await fetch('/api/community', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify({ body: lp.content || '', attachments: lp.image || [], isPublic: true }),
            });
            if (res.ok) {
              const data = await res.json();
              const created = data.post || data.data || null;
              if (created) {
                const mapped = {
                  id: created._id || created.id,
                    author: (created.authorId && (created.authorId.displayName || `${created.authorId.firstName || ''} ${created.authorId.lastName || ''}`.trim())) || 'User',
                    authorId: (created.authorId && (created.authorId._id || created.authorId)) || created.authorId || undefined,
                    authorAvatar: created.authorId?.avatar || undefined,
                  content: created.body || created.title || '',
                  time: created.createdAt ? new Date(created.createdAt).getTime() : Date.now(),
                  likes: Array.isArray(created.likes) ? created.likes.length : (created.likes || 0),
                  image: Array.isArray(created.attachments) ? created.attachments.filter((a:any) => typeof a === 'string' && a.startsWith('data:')) : undefined,
                  attachments: created.attachments || [],
                  replies: Array.isArray(created.comments) ? created.comments.map((c:any) => ({ id: c._id || ('r'+Math.random().toString(36).slice(2,9)), author: (c.authorId && (c.authorId.displayName || (c.authorId.firstName || '') + ' ' + (c.authorId.lastName || ''))) || 'Someone', authorAvatar: c.authorId?.avatar || undefined, authorId: (c.authorId && (c.authorId._id || c.authorId)) || undefined, content: c.text || '', time: c.createdAt ? new Date(c.createdAt).getTime() : Date.now() })) : undefined,
                } as Post;
                setPosts(prev => {
                  // remove local placeholder if present and prepend server post
                  const filt = prev.filter(x => x.id !== lp.id);
                  return [mapped, ...filt];
                });
                continue; // synced
              }
            }
          } catch (e) {
            // keep local
          }
          remaining.push(lp);
        }
        // save remaining locals
        saveLocalPosts(remaining);
      }
    })();

    return () => { mounted = false; };
  }, []);

  // Load public users (those who set publicEnabled) and merge into members
  useEffect(() => {
    let mounted = true;
    const fetchPublicUsers = async () => {
      try {
        // Prefer server-provided full public profiles (includes latest resume) if available
        let res = await fetch('/api/users/public-full');
        if (!res.ok) {
          res = await fetch('/api/users/public');
        }
        if (!res.ok) return;
        const data = await res.json();
        const users = data.data || [];

        // If server returned resumes in the payload (public-full), use them directly.
        const mapped: Profile[] = users.map((u: any) => {
          const userId = u.id || u._id || u._id || u.id;
          const resume = u.resume || null;
          return ({
            id: userId,
            name: u.displayName || `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.displayName || 'User',
            title: u.position || '',
            school: undefined,
            skills: Array.isArray(u.tools) ? u.tools : [],
            badges: [],
            views: typeof u.views === 'number' ? u.views : 0,
            lastActive: Date.now(),
            excerpt: (u.bio && String(u.bio).trim()) || (resume && resume.content && resume.content.professionalSummary ? (resume.content.professionalSummary.description || '') : '') || '',
            location: '',
            featuredResume: u.featuredResume || (resume ? (resume.name || resume._id) : undefined),
            tools: Array.isArray(u.tools) ? u.tools : (resume && resume.content && resume.content.professionalSummary ? (resume.content.professionalSummary.skills || []) : []),
            rating: undefined,
            templatePreview: u.templatePreview || (resume ? resume.templatePreview || undefined : undefined),
            avatar: u.avatar || undefined,
          });
        });
        if (!mounted) return;
        setProfiles(prev => {
          const mappedIds = new Set(mapped.map(m => m.id));
          // keep only previous profiles that are not in the public list
          const others = prev.filter(p => !mappedIds.has(p.id));
          return [...mapped, ...others];
        });
      } catch (e) {
        // ignore
      }
    };

    // initial fetch
    fetchPublicUsers();

    // refresh on window focus
    const onFocus = () => fetchPublicUsers();
    window.addEventListener('focus', onFocus);

    // immediate refresh when dashboard/profile updates happen
    const onAuthChanged = () => fetchPublicUsers();
    const onProfileUpdated = () => fetchPublicUsers();
    window.addEventListener('nexlabs:auth-changed', onAuthChanged as EventListener);
    window.addEventListener('nexlabs:profile-updated', onProfileUpdated as EventListener);

    // poll every 30s
    const id = setInterval(() => fetchPublicUsers(), 30 * 1000);

    return () => {
      mounted = false;
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('nexlabs:auth-changed', onAuthChanged as EventListener);
      window.removeEventListener('nexlabs:profile-updated', onProfileUpdated as EventListener);
      clearInterval(id);
    };
  }, []);
  const [postTagFilter, setPostTagFilter] = useState<string | null>(null);
  const [postFilter, setPostFilter] = useState<'all'|'new'|'most_commented'|'popular'|'with_images'>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const filterRef = useRef<HTMLDivElement | null>(null);

  const newsRef = useRef<HTMLDivElement | null>(null);
  const membersRef = useRef<HTMLDivElement | null>(null);
  const [newsSelected, setNewsSelected] = useState<{id:string;tag:string;title:string;image?:string} | null>(null);
  const [newsComments, setNewsComments] = useState<Record<string, {id:string;author:string;content:string;time:number}[]>>({});
  const [templateOpen, setTemplateOpen] = useState<string | null>(null);
  const [fsOpen, setFsOpen] = useState<string | null>(null);
  const [fsZoom, setFsZoom] = useState<number>(1);
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  // removed floating FAB menu; unread chats surface in the chat list
  const [chatMessages, setChatMessages] = useState<Array<{id:string,from:'user'|'bot',text:string,createdAt?:number,parentMessageId?:string | null}>>([]);
  const [replyTo, setReplyTo] = useState<{id:string,text:string} | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [recentContacts, setRecentContacts] = useState<Profile[]>(() => profiles.filter(p => !DEMO_NAMES.has(p.name)).slice(0,3));
  const [senderInfoMap, setSenderInfoMap] = useState<Record<string,{name?:string; avatar?:string}>>({});
  // persist recent contacts so they remain until the user removes them
  useEffect(() => {
    try {
      const raw = localStorage.getItem('nexlabs_recent_contacts');
      if (raw) {
        const parsed = JSON.parse(raw || '[]');
        if (Array.isArray(parsed) && parsed.length) {
          const filtered = parsed.filter((p: any) => !DEMO_NAMES.has(p.name));
          if (filtered.length) setRecentContacts(filtered);
          else setRecentContacts([]);
          try { localStorage.setItem('nexlabs_recent_contacts', JSON.stringify(filtered)); } catch (e) {}
        }
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem('nexlabs_recent_contacts', JSON.stringify((recentContacts || []).filter((p: any) => !DEMO_NAMES.has(p.name)))); } catch (e) {}
  }, [recentContacts]);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [notificationsList, setNotificationsList] = useState<any[]>([]);
  const [unreadBySender, setUnreadBySender] = useState<Record<string, {id:string;text:string;createdAt?:number;parentMessageId?:string|null;}[]>>({});
  const messageRefs = React.useRef<Record<string, HTMLElement | null>>({});
  const pendingJumpTo = React.useRef<string | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // focus trap basics for modal
  useEffect(() => {
    if (selected) {
      lastFocused.current = document.activeElement as HTMLElement | null;
      document.body.style.overflow = 'hidden';
      setTimeout(() => modalRef.current?.focus(), 60);
    } else {
      document.body.style.overflow = '';
      lastFocused.current?.focus?.();
    }
    return () => { document.body.style.overflow = ''; };
  }, [selected]);

  const filtered = useMemo(() => {
    let list = profiles.slice();
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.title.toLowerCase().includes(q) || (p.school||'').toLowerCase().includes(q) || p.skills.join(' ').toLowerCase().includes(q));
    }
    if (skillFilter) list = list.filter(p => p.skills.includes(skillFilter));
    if (sortBy === 'popular') list.sort((a,b) => b.views - a.views); else list.sort((a,b) => b.lastActive - a.lastActive);
    return list;
  }, [profiles, query, skillFilter, sortBy]);

  const toggleConnect = (id: string) => setConnected(s => ({ ...s, [id]: !s[id] }));

  // Build a profile object from the currently logged-in user + latest resume (if available)
  const buildProfileFromCurrentUser = async () => {
    try {
      const stored = localStorage.getItem('nexlabs_user') || sessionStorage.getItem('nexlabs_user');
      if (!stored) return null;
      const user = JSON.parse(stored);
      // try fetch resumes for current user to get featured resume / templatePreview
      const token = localStorage.getItem('nexlabs_token') || sessionStorage.getItem('nexlabs_token');
      let featuredResume: string | undefined = undefined;
      let templatePreview: string | undefined = undefined;
      if (token) {
        try {
          const res = await fetch('/api/resumes', { headers: { Authorization: `Bearer ${token}` } });
          if (res.ok) {
            const data = await res.json();
            const items = data.data || [];
            if (items && items.length) {
              const latest = items[0];
              featuredResume = latest.name || latest._id || undefined;
              templatePreview = latest.templatePreview || undefined;
            }
          }
        } catch (e) {
          // ignore fetch errors
        }
      }

      const profile: Profile = {
        id: user._id || user.id || 'me',
        name: user.displayName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || 'You',
        title: user.position || '',
        school: user.school || undefined,
        skills: (user.skills && Array.isArray(user.skills)) ? user.skills : [],
        badges: user.badges || [],
        views: typeof user.views === 'number' ? user.views : 0,
        lastActive: Date.now(),
        excerpt: user.bio || '',
        location: user.location || '',
        featuredResume: featuredResume,
        tools: user.tools || (user.skills || []),
        avatar: user.avatar || undefined,
        rating: undefined,
        templatePreview: templatePreview,
      };
      return profile;
    } catch (err) {
      return null;
    }
  };

  // Synchronous derived profile for rendering modal from live resume/context + stored user
  const { resumeData } = useResume();

  // If current user has publicEnabled, insert them into members list
  React.useEffect(() => {
    let mounted = true;
    const ensureMe = async () => {
      try {
        const stored = localStorage.getItem('nexlabs_user') || sessionStorage.getItem('nexlabs_user');
        if (!stored) return;
        const user = JSON.parse(stored);
        const userId = user?._id || user?.id;
        if (!user || !userId) return;

        // remove my card immediately when public is disabled
        if (!user.publicEnabled) {
          if (!mounted) return;
          setProfiles(prev => prev.filter(p => String(p.id) !== String(userId)));
          return;
        }

        const prof = await buildProfileFromCurrentUser();
        if (!prof) return;
        if (!mounted) return;
        setProfiles(prev => {
          const idx = prev.findIndex(p => String(p.id) === String(prof.id));
          if (idx === -1) return [prof, ...prev];
          const next = prev.slice();
          next[idx] = { ...next[idx], ...prof };
          return next;
        });
      } catch (e) {
        // ignore
      }
    };
    ensureMe();

    const onAuth = () => { ensureMe(); };
    const onProfileUpdated = () => { ensureMe(); };
    window.addEventListener('nexlabs:auth-changed', onAuth as EventListener);
    window.addEventListener('nexlabs:profile-updated', onProfileUpdated as EventListener);
    window.addEventListener('storage', onAuth as EventListener);
    return () => {
      mounted = false;
      window.removeEventListener('nexlabs:auth-changed', onAuth as EventListener);
      window.removeEventListener('nexlabs:profile-updated', onProfileUpdated as EventListener);
      window.removeEventListener('storage', onAuth as EventListener);
    };
  }, [resumeData]);
  const getDisplayProfile = (sel: Profile | null): Profile | null => {
    if (!sel) return null;
    const stored = localStorage.getItem('nexlabs_user') || sessionStorage.getItem('nexlabs_user');
      const user = stored ? JSON.parse(stored) : null;

    const nameMatchesUser = user && (() => {
      const display = user.displayName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name;
      return display && (display === sel.name || sel.name.includes(display) || display.includes(sel.name));
    })();

    if (sel.id === 'me' || nameMatchesUser) {
      const skillsFromResume: string[] = [];
      if (resumeData) {
        if (Array.isArray(resumeData.interests) && resumeData.interests.length) skillsFromResume.push(...resumeData.interests.map((s:any)=>String(s)));
        if (Array.isArray(resumeData.experiences) && resumeData.experiences.length) {
          resumeData.experiences.forEach((e:any) => { if (Array.isArray(e.skills)) skillsFromResume.push(...e.skills); });
        }
      }

      // prefer skills from resume, fallback to user.tools or sel.tools/skills
      let toolsArr = [] as string[];
      if (skillsFromResume.length) toolsArr = skillsFromResume.map((s:any)=>String(s));
      else if (user?.tools && Array.isArray(user.tools)) toolsArr = user.tools.map((s:any)=>String(s));
      else toolsArr = (sel.tools || sel.skills || []).map((s:any)=>String(s));

      // Normalize common tool names (ensure React and Figma appear cleanly)
      const normalizeTool = (raw: string) => {
        const v = String(raw || '').trim();
        if (!v) return '';
        // If it's a hashtag (starts with #), keep as-is (single leading #)
        if (v.startsWith('#')) {
          return '#' + v.replace(/^#+/, '').trim();
        }
        const low = v.toLowerCase();
        if (['react', 'reactjs', 'react.js'].includes(low)) return 'React';
        if (['figma'].includes(low)) return 'Figma';
        // remove leading hashes or special chars then Title-case other multi-word tools
        const cleaned = v.replace(/^#+/, '');
        return cleaned.split(/\s+/).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
      };

      toolsArr = toolsArr.map(normalizeTool).filter(Boolean);

      // include avatar: prefer resume picture, then stored user, then selection
      const avatar = (resumeData && resumeData.basicInfo && resumeData.basicInfo.profilePicture) ? resumeData.basicInfo.profilePicture : (user?.avatar || sel.avatar || undefined);

      // dedupe and trim skills/tools, keep top 8
      const tools = Array.from(new Set(toolsArr.map(t => String(t).trim()))).filter(Boolean).slice(0,8);

      // featured resume: prefer stored user's featuredResume (persisted from PreviewFrame), then resume fetch/name (sel.featuredResume), then fallback
      const persistedFeatured = user?.featuredResume || user?.profile?.featuredResume || undefined;
      const featured = persistedFeatured || sel.featuredResume || undefined;

      // template preview image: prefer stored user's templatePreview, then sel.templatePreview
      const templatePreview = user?.templatePreview || user?.profile?.templatePreview || sel.templatePreview || undefined;

      const profile: Profile = {
        id: user?._id || user?.id || sel.id || 'me',
        name: user ? (user.displayName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name) : sel.name,
        title: user?.position || sel.title || '',
        school: sel.school,
        skills: tools,
        badges: user?.badges || sel.badges || [],
        views: sel.views || 0,
        lastActive: sel.lastActive || Date.now(),
        excerpt: resumeData?.professionalSummary?.description || user?.excerpt || user?.bio || sel.excerpt || '',
        location: resumeData?.basicInfo?.location || user?.location || sel.location || '',
        featuredResume: featured,
        tools: tools,
        avatar: avatar,
        rating: sel.rating,
        templatePreview: templatePreview,
      };
      return profile;
    }
    return sel;
  };

  const handleOpenProfile = async (p: Profile) => {
    const stored = localStorage.getItem('nexlabs_user') || sessionStorage.getItem('nexlabs_user');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        const display = user.displayName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name;
        if (display && (display === p.name || p.name.includes(display) || display.includes(p.name))) {
          const prof = await buildProfileFromCurrentUser();
          if (prof) { setSelected(prof); return; }
        }
      } catch (e) {
        // fallback to default
      }
    }

    // Optimistically increment local UI count and inform server (only if id looks like a real user id)
    try {
      // update local profiles state quickly for immediate feedback
      setProfiles(prev => prev.map(x => x.id === p.id ? { ...x, views: (x.views || 0) + 1 } : x));
      // fire-and-forget POST to increment server-side view count
      if (isObjectId(p.id)) {
        fetch(`/api/users/${encodeURIComponent(p.id)}/view`, { method: 'POST' }).then(async res => {
          if (res.ok) {
            const data = await res.json();
            const newViews = data.views;
            setProfiles(prev => prev.map(x => x.id === p.id ? { ...x, views: newViews } : x));
          }
        }).catch(() => {/* ignore network errors */});
      }
    } catch (e) {}

    setSelected(p);
  };

  const previewCurrentUser = async () => {
    const prof = await buildProfileFromCurrentUser();
    if (prof) setSelected(prof);
  };

  const handleAddPost = (content: string, images?: string[] | null) => {
    (async () => {
      const token = localStorage.getItem('nexlabs_token') || sessionStorage.getItem('nexlabs_token');
      const mapServerPost = (post: any): Post => {
        const authorObj = post.authorId || {};
        const authorName = authorObj.displayName || ((authorObj.firstName || '') + ' ' + (authorObj.lastName || '')).trim() || 'User';
        return {
          id: post._id || post.id || ('p' + Math.random().toString(36).slice(2,9)),
          author: authorName,
          authorId: (authorObj && (authorObj._id || authorObj)) || (post.authorId || undefined),
          authorAvatar: authorObj.avatar || undefined,
          content: post.body || post.title || '',
          time: post.createdAt ? new Date(post.createdAt).getTime() : Date.now(),
          likes: Array.isArray(post.likes) ? post.likes.length : (post.likes || 0),
          image: Array.isArray(post.attachments) ? post.attachments.filter((a:any) => typeof a === 'string' && a.startsWith('data:')) : undefined,
          attachments: post.attachments || [],
          replies: Array.isArray(post.comments) ? post.comments.map((c:any) => ({ id: c._id || ('r'+Math.random().toString(36).slice(2,9)), author: (c.authorId && (c.authorId.displayName || (c.authorId.firstName || '') + ' ' + (c.authorId.lastName || ''))) || 'Someone', authorAvatar: c.authorId?.avatar || undefined, authorId: (c.authorId && (c.authorId._id || c.authorId)) || undefined, content: c.text || '', time: c.createdAt ? new Date(c.createdAt).getTime() : Date.now() })) : undefined,
        };
      };

      if (token) {
        try {
          const res = await fetch('/api/community', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ body: content || '', attachments: images || [], isPublic: true }),
          });
          if (res.ok) {
            const data = await res.json();
            const created = data.post || data.data || null;
            if (created) {
              setPosts(prev => [mapServerPost(created), ...prev]);
              return;
            }
          }
        } catch (e) {
          // ignore and fallback to local
        }
      }

      const stored = localStorage.getItem('nexlabs_user') || sessionStorage.getItem('nexlabs_user');
      const user = stored ? JSON.parse(stored) : null;
      const localId = 'local-' + Math.random().toString(36).slice(2,9);
      const p: Post = { id: localId, author: user ? (user.displayName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'You') : 'You', authorId: user?._id || user?.id || undefined, authorAvatar: user?.avatar, content, time: Date.now(), likes: 0, image: images && images.length ? images : undefined, isLocal: true };
      // persist locally so the post survives refresh
      try {
        const prevLocal = loadLocalPosts();
        saveLocalPosts([p, ...prevLocal]);
      } catch (e) {}
      setPosts(prev => [p, ...prev]);
    })();
  };

  const handleLike = async (id: string) => {
    const stored = localStorage.getItem('nexlabs_user') || sessionStorage.getItem('nexlabs_user');
    const user = stored ? JSON.parse(stored) : null;
    const token = localStorage.getItem('nexlabs_token') || sessionStorage.getItem('nexlabs_token');

    // if not authenticated, fallback to local optimistic like
    if (!user || !token) {
      setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: (p.likes || 0) + 1 } : p));
      return;
    }

    const post = posts.find(p => p.id === id);
    if (!post) return;

    // If already liked, call unlike
    if ((post as any)._liked) {
      try {
        const res = await fetch(`/api/community/${encodeURIComponent(id)}/unlike`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) {
          // fallback: decrement locally
          setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: Math.max(0, (p.likes || 1) - 1), _liked: false } : p));
          return;
        }
        const data = await res.json();
        const likesCount = data.likesCount || Math.max(0, (post.likes || 1) - 1);
        setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: likesCount, _liked: false } : p));
        return;
      } catch (e) {
        setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: Math.max(0, (p.likes || 1) - 1), _liked: false } : p));
        return;
      }
    }

    // Not liked yet -> send like
    try {
      const res = await fetch(`/api/community/${encodeURIComponent(id)}/like`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) {
        // fallback optimistic
        setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: (p.likes || 0) + 1, _liked: true } : p));
        return;
      }
      const data = await res.json();
      const likesCount = data.likesCount || (post && post.likes) || 0;
      setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: likesCount, _liked: true } : p));
    } catch (e) {
      setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: (p.likes || 0) + 1, _liked: true } : p));
    }
  };

  let filteredPosts = posts.slice();
  if (postTagFilter) filteredPosts = filteredPosts.filter(p => (p.content + (p.image ? p.image.join(' ') : '')).includes(postTagFilter));

  // apply post filters
  if (postFilter === 'new') {
    filteredPosts = filteredPosts.slice().sort((a,b) => b.time - a.time);
  } else if (postFilter === 'most_commented') {
    filteredPosts = filteredPosts.slice().sort((a,b) => (b.replies?.length || 0) - (a.replies?.length || 0));
  } else if (postFilter === 'popular') {
    filteredPosts = filteredPosts.slice().sort((a,b) => (b.likes || 0) - (a.likes || 0));
  } else if (postFilter === 'with_images') {
    filteredPosts = filteredPosts.filter(p => p.image && p.image.length > 0);
  }

  const handleTagClick = (tag: string) => {
    setPostTagFilter(prev => prev === tag ? null : tag);
  };

  const handleReply = (postId: string, content: string) => {
    (async () => {
      const token = localStorage.getItem('nexlabs_token') || sessionStorage.getItem('nexlabs_token');
      const stored = localStorage.getItem('nexlabs_user') || sessionStorage.getItem('nexlabs_user');
      const user = stored ? JSON.parse(stored) : null;

      if (token && user) {
        try {
          const res = await fetch(`/api/community/${encodeURIComponent(postId)}/reply`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ text: content })
          });
          if (res.ok) {
            const data = await res.json();
            const c = data.comment || data.data || null;
            if (c) {
              const author = c.authorId && (c.authorId.displayName || `${c.authorId.firstName || ''} ${c.authorId.lastName || ''}`.trim()) || 'Someone';
              const mapped = { id: c._id || ('r'+Math.random().toString(36).slice(2,9)), author, authorAvatar: c.authorId?.avatar || undefined, authorId: c.authorId?._id || c.authorId || undefined, content: c.text || content, time: c.createdAt ? new Date(c.createdAt).getTime() : Date.now() };
              setPosts(prev => prev.map(p => p.id === postId ? { ...p, replies: [...(p.replies||[]), mapped] } : p));
              return;
            }
          }
        } catch (e) {
          // fall through to local add
        }
      }
      // fallback: add locally
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, replies: [...(p.replies||[]), { id: 'r'+Math.random().toString(36).slice(2,9), author: user ? (user.displayName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'You') : 'You', authorAvatar: user?.avatar || undefined, authorId: user?._id || user?.id || undefined, content, time: Date.now() }] } : p));
    })();
  };

  const handleEditPost = async (postId: string, newContent: string) => {
    const token = localStorage.getItem('nexlabs_token') || sessionStorage.getItem('nexlabs_token');
    // optimistic update
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, content: newContent } : p));
    if (!token) return; // no auth -> local change only
    try {
      const res = await fetch(`/api/community/${encodeURIComponent(postId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ body: newContent }),
      });
      if (!res.ok) {
        // optionally revert or refetch - keep optimistic for now
        return;
      }
      const data = await res.json();
      const updated = data.post || data.data || null;
      if (updated) {
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, content: updated.body || newContent } : p));
      }
    } catch (e) {
      // ignore network errors
    }
  };

  const handleDeletePost = async (postId: string) => {
    // remove locally first
    setPosts(prev => prev.filter(p => p.id !== postId));
    const token = localStorage.getItem('nexlabs_token') || sessionStorage.getItem('nexlabs_token');
    if (!token) return;
    try {
      const res = await fetch(`/api/community/${encodeURIComponent(postId)}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) {
        // If delete failed, we could refetch; for now do nothing (post already removed locally)
      }
    } catch (e) {
      // ignore
    }
  };

  const scrollNews = (delta:number) => { const el = newsRef.current; if(el) el.scrollBy({ left: delta, behavior: 'smooth' }); };

  const scrollMembersBy = (count: number) => {
    const el = membersRef.current; if (!el) return;
    const first = el.querySelector<HTMLElement>('[class*="memberCard"]');
    const gap = 12; // matches CSS gap
    const w = first ? first.offsetWidth + gap : 200;
    el.scrollBy({ left: count * w, behavior: 'smooth' });
  };

  const openFullscreen = (url?: string | null) => {
    if (!url && selected) url = selected.templatePreview || null;
    if (!url) return;
    setFsZoom(1);
    setFsOpen(url);
  };

  const closeFullscreen = () => setFsOpen(null);

  const zoomIn = () => setFsZoom(z => Math.min(3, +(z + 0.25).toFixed(2)));
  const zoomOut = () => setFsZoom(z => Math.max(0.5, +(z - 0.25).toFixed(2)));

  const fsPrev = () => {
    if (!selected) return;
    const idx = profiles.findIndex(p => p.id === selected.id);
    if (idx > 0) {
      const prev = profiles[idx - 1];
      setSelected(prev);
      setFsOpen(prev.templatePreview || null);
    }
  };

  const fsNext = () => {
    if (!selected) return;
    const idx = profiles.findIndex(p => p.id === selected.id);
    if (idx >= 0 && idx < profiles.length - 1) {
      const next = profiles[idx + 1];
      setSelected(next);
      setFsOpen(next.templatePreview || null);
    }
  };

  const sendChat = () => {
    const v = chatInput.trim();
    if (!v) return;
    if (!selectedContactId) return;
    const makeId = (pref = 'm') => pref + Math.random().toString(36).slice(2,9);
    const id = makeId('m');
    const msg = { id, from: 'user', text: v, parentMessageId: replyTo?.id || null };

    // append to UI immediately
    setChatMessages(prev => [...prev, msg]);
    setChatInput('');
    setReplyTo(null);

    // attempt to send via socket if available, otherwise fall back to HTTP POST
    (async () => {
      const socket = (window as any).__nexlabs_socket;
      const token = localStorage.getItem('nexlabs_token') || sessionStorage.getItem('nexlabs_token');

      if (socket && socket.connected) {
        // emit via socket with tempId so we can reconcile optimistic message
        try {
          socket.emit('chat:send', { to: selectedContactId, text: v, parentMessageId: replyTo?.id || null, tempId: id }, (resp: any) => {
            try {
              if (resp && resp.success && resp.message) {
                const _rawUser = localStorage.getItem('nexlabs_user') || sessionStorage.getItem('nexlabs_user') || '{}';
                const _me = JSON.parse(_rawUser || '{}');
                const _meId = _me && (_me._id || _me.id || _me.userId) ? String(_me._id || _me.id || _me.userId) : null;
                // replace optimistic message with server message
                setChatMessages(prev => prev.map(m => m.id === id ? {
                  id: resp.message._id || resp.message.id || id,
                  from: (resp.message.sender && (String(resp.message.sender._id || resp.message.sender) === _meId)) ? 'user' : 'bot',
                  text: resp.message.text || v,
                  createdAt: resp.message.createdAt ? new Date(resp.message.createdAt).getTime() : Date.now(),
                  parentMessageId: resp.message.parentMessageId || null
                } : m));
                try { const raw = localStorage.getItem('nexlabs_chat_conversations') || '{}'; const conv = JSON.parse(raw || '{}'); conv[selectedContactId] = conv[selectedContactId] || []; conv[selectedContactId].push(resp.message); localStorage.setItem('nexlabs_chat_conversations', JSON.stringify(conv)); } catch(e){}
                return;
              }
            } catch (e) { /* ignore ack handling errors */ }
          });
          return;
        } catch (e) {
          // fall through to HTTP fallback
        }
      }

      // HTTP POST fallback (existing behavior)
      if (token) {
        try {
          const res = await fetch(`/api/chats/${encodeURIComponent(selectedContactId)}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ text: v, parentMessageId: replyTo?.id || null }) });
          if (res.ok) {
            const g = await fetch(`/api/chats/${encodeURIComponent(selectedContactId)}`, { headers: { Authorization: `Bearer ${token}` } });
            if (g.ok) {
              const data = await g.json();
              const msgs = data.data || [];
              const _rawUser = localStorage.getItem('nexlabs_user') || sessionStorage.getItem('nexlabs_user') || '{}';
              const _me = JSON.parse(_rawUser || '{}');
              const _meId = _me && (_me._id || _me.id || _me.userId) ? String(_me._id || _me.id || _me.userId) : null;
              const mapped = (msgs || []).map((m:any) => {
                const senderId = m && m.sender ? (m.sender._id ? String(m.sender._id) : String(m.sender)) : null;
                return {
                  id: m._id || m.id || ('m'+Math.random().toString(36).slice(2,9)),
                  from: senderId && _meId && senderId === _meId ? 'user' : 'bot',
                  text: m.text || m.body || '',
                  createdAt: m.createdAt ? new Date(m.createdAt).getTime() : (m.createdAt || Date.now()),
                  parentMessageId: m.parentMessageId || null
                };
              });
              setChatMessages(mapped);
              try { const raw = localStorage.getItem('nexlabs_chat_conversations') || '{}'; const conv = JSON.parse(raw || '{}'); conv[selectedContactId] = mapped; localStorage.setItem('nexlabs_chat_conversations', JSON.stringify(conv)); } catch(e){}
              return;
            }
          }
        } catch (e) {
          // fall back to local-only
        }
      }

      // fallback local persistence (no auto-reply)
      try {
        const raw = localStorage.getItem('nexlabs_chat_conversations') || '{}';
        const conv = JSON.parse(raw || '{}');
        conv[selectedContactId] = conv[selectedContactId] || [];
        conv[selectedContactId].push(msg);
        localStorage.setItem('nexlabs_chat_conversations', JSON.stringify(conv));
      } catch (e) { /* ignore storage errors */ }
      // (previously there was a mock auto-reply here; removed to avoid spurious "Auto-reply" messages)
    })();
  };

  const chatMessagesRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!selectedContactId) return;
    const el = chatMessagesRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [chatMessages, selectedContactId]);

  // when messages load, if there's a pending jump target, scroll to it and highlight
  useEffect(() => {
    const targetId = pendingJumpTo.current;
    if (!targetId) return;
    // clear pending so future updates don't retrigger
    pendingJumpTo.current = null;
    // wait a tick for DOM to render
    setTimeout(() => {
      const el = messageRefs.current[targetId];
      const container = chatMessagesRef.current;
      if (el && container) {
        const top = el.offsetTop - container.offsetTop - 16;
        container.scrollTo({ top, behavior: 'smooth' as ScrollBehavior });
        // highlight briefly
        const prevBg = el.style.background;
        el.style.transition = 'background 0.25s ease';
        el.style.background = 'rgba(250,204,21,0.12)';
        setTimeout(() => { try { el.style.background = prevBg || ''; } catch (e) {} }, 1600);
      }
    }, 120);
  }, [chatMessages]);

  const openChatWith = (id: string, jumpToId: string | null = null) => {
    const c = profiles.find(p => p.id === id);
    if (!c) return;
    // set pending jump target (scroll to this message after messages load)
    pendingJumpTo.current = jumpToId || null;
    setSelectedContactId(id);
    setChatOpen(true);
    // try load from server if authenticated, otherwise fall back to localStorage
    (async () => {
      const token = localStorage.getItem('nexlabs_token') || sessionStorage.getItem('nexlabs_token');
      if (token) {
        try {
          const res = await fetch(`/api/chats/${encodeURIComponent(id)}`, { headers: { Authorization: `Bearer ${token}` } });
          if (res.ok) {
            const data = await res.json();
            const msgs = data.data || [];
              const _rawUser2 = localStorage.getItem('nexlabs_user') || sessionStorage.getItem('nexlabs_user') || '{}';
              const _me2 = JSON.parse(_rawUser2 || '{}');
              const _meId2 = _me2 && (_me2._id || _me2.id || _me2.userId) ? String(_me2._id || _me2.id || _me2.userId) : null;
              const mapped = (msgs || []).map((m:any) => {
                const senderId = m && m.sender ? (m.sender._id ? String(m.sender._id) : String(m.sender)) : null;
                return {
                  id: m._id || m.id || ('m'+Math.random().toString(36).slice(2,9)),
                  from: senderId && _meId2 && senderId === _meId2 ? 'user' : 'bot',
                  text: m.text || m.body || '',
                  createdAt: m.createdAt ? new Date(m.createdAt).getTime() : (m.createdAt || Date.now()),
                  parentMessageId: m.parentMessageId || null
                };
              });
              setChatMessages(mapped);
            return;
          }
        } catch (e) { /* ignore and fallback */ }
      }
      // fallback: load persisted conversation if available, otherwise show starter messages
      try {
        const raw = localStorage.getItem('nexlabs_chat_conversations') || '{}';
        const convs = JSON.parse(raw || '{}');
        const convo = convs[id] || [];
        if (Array.isArray(convo) && convo.length) setChatMessages(convo);
        else setChatMessages([{ id: 'c1', from: 'bot', text: `Conversation with ${c.name}` }]);
      } catch (e) {
        setChatMessages([{ id: 'c1', from: 'bot', text: `Conversation with ${c.name}` }]);
      }
    })();

    // ensure this contact appears in recentContacts
    try {
      setRecentContacts(prev => {
        const merged = [c, ...prev.filter(x => x.id !== c.id)];
        return merged.slice(0, 5);
      });
    } catch (e) { /* ignore */ }
    // Optimistically clear unread in the UI immediately, then mark notifications read on the server in background.
    try {
      const idsToMark = unreadBySender[id] || [];
      setUnreadBySender(prev => { const copy = { ...(prev || {}) }; const norm = String(id); Object.keys(copy).forEach(k => { if (String(k) === norm) delete copy[k]; }); return copy; });
      setNotificationsList(prev => prev.map(n => { const from = (n.fromUserId && (n.fromUserId._id || n.fromUserId)) || n.fromUserId || n.from || null; if (from && String(from) === String(id)) return { ...n, read: true }; return n; }));
      (async () => {
        try {
          const token = localStorage.getItem('nexlabs_token') || sessionStorage.getItem('nexlabs_token');
          if (idsToMark.length && token) {
            for (const nobj of idsToMark) {
              const nid = nobj && (nobj.id || nobj._id) ? (nobj.id || nobj._id) : String(nobj);
              try { await fetch(`/api/notifications/${encodeURIComponent(nid)}/read`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } }); } catch (e) { }
            }
          }
        } catch (e) {}
      })();
    } catch (e) {}
  };

  // FAB menu removed — no click-outside handling needed

  const removeContact = (id: string) => {
    try {
      setRecentContacts(prev => prev.filter(x => x.id !== id));
      setUnreadBySender(prev => { const copy = { ...(prev || {}) }; const norm = String(id); Object.keys(copy).forEach(k => { if (String(k) === norm) delete copy[k]; }); return copy; });
      setSenderInfoMap(prev => { const copy = { ...(prev || {}) }; const norm = String(id); Object.keys(copy).forEach(k => { if (String(k) === norm) delete copy[k]; }); return copy; });
      if (selectedContactId === id) {
        setSelectedContactId(null);
        setChatMessages([]);
      }
    } catch (e) {}
  };

  const totalUnread = React.useMemo(() => {
    try {
      return Object.values(unreadBySender || {}).reduce((s, arr) => s + (Array.isArray(arr) ? arr.length : 0), 0);
    } catch (e) { return 0; }
  }, [unreadBySender]);

  // load notifications when chat panel opens (to show per-contact unread badges)
  useEffect(() => {
    let mounted = true;
    const loadNotifs = async () => {
      try {
        const token = localStorage.getItem('nexlabs_token') || sessionStorage.getItem('nexlabs_token');
        if (!token) {
          // fallback: read from localStorage (same key as Navbar)
          const raw = localStorage.getItem('nexlabs_notifications');
          if (!raw) return;
          const parsed = JSON.parse(raw || '[]');
          if (!mounted) return;
          setNotificationsList(parsed || []);
          const map: Record<string, {id:string;text:string;createdAt?:number;}[]> = {};
          (parsed || []).forEach((n: any) => {
            const from = (n.fromUserId && (n.fromUserId._id || n.fromUserId)) || n.fromUserId || n.from || null;
            if (!from) return;
            const key = String(from);
            if (!n.read) map[key] = map[key] || [];
            if (!n.read) map[key].push({ id: n._id || n.id || String(Math.random()), text: n.text || n.body || (n.title || ''), createdAt: n.createdAt ? new Date(n.createdAt).getTime() : (n.time ? new Date(n.time).getTime() : undefined), parentMessageId: n.parentMessageId || null });
          });
          setUnreadBySender(map);
          return;
        }

        const res = await fetch('/api/notifications', { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) return;
        const data = await res.json();
        const notes = data.data || data || [];
        if (!mounted) return;
        setNotificationsList(notes || []);
        const map: Record<string, {id:string;text:string;createdAt?:number;}[]> = {};
        (notes || []).forEach((n: any) => {
          const from = (n.fromUserId && (n.fromUserId._id || n.fromUserId)) || n.fromUserId || n.from || null;
          if (!from) return;
          const key = String(from);
          if (!n.read) {
            map[key] = map[key] || [];
            map[key].push({ id: n._id || n.id || String(Math.random()), text: n.text || n.body || '', createdAt: n.createdAt ? new Date(n.createdAt).getTime() : undefined, parentMessageId: n.parentMessageId || null });
          }
        });
        setUnreadBySender(map);
      } catch (e) {
        // ignore
      }
    };
    if (chatOpen) loadNotifs();
    return () => { mounted = false; };
  }, [chatOpen]);

  // listen for real-time notifications dispatched from Navbar socket handler
  useEffect(() => {
    const handler = (ev: any) => {
      const n = ev.detail || ev;
      if (!n) return;
      const from = (n.fromUserId && (n.fromUserId._id || n.fromUserId)) || n.fromUserId || n.from || null;
      if (!from) return;
      const key = String(from);
      setNotificationsList(prev => [n, ...(prev || [])]);
      setUnreadBySender(prev => {
        const copy: Record<string,{id:string;text:string;createdAt?:number;parentMessageId?:string|null;}[]> = { ...(prev || {}) };
        copy[key] = copy[key] || [];
        copy[key].push({ id: n._id || n.id || String(Math.random()), text: n.text || n.body || '', createdAt: n.createdAt ? new Date(n.createdAt).getTime() : undefined, parentMessageId: n.parentMessageId || null });
        return copy;
      });
      // ensure sender appears in recentContacts top
      try {
        const p = profiles.find(x => x.id === String(from));
        if (p) setRecentContacts(prev => { const merged = [p, ...prev.filter(x => x.id !== p.id)]; return merged.slice(0,5); });
      } catch (e) {}
    };
    window.addEventListener('nexlabs:notification', handler as any);
    return () => window.removeEventListener('nexlabs:notification', handler as any);
  }, [profiles]);

  // listen for incoming chat messages from Navbar (socket forward)
  useEffect(() => {
    const handler = (ev: any) => {
      const payload = ev.detail || ev;
      if (!payload) return;
      // payload shape: { chatId, message: { _id, sender, text, createdAt } }
      const msg = payload.message || payload;
      try { console.log('[chat-handler] incoming payload', payload, 'message:', msg); } catch(e) {}
      if (!msg) return;

      const stored = localStorage.getItem('nexlabs_user') || sessionStorage.getItem('nexlabs_user');
      const me = stored ? JSON.parse(stored) : null;
      const myId = me?._id || me?.id || null;
      const senderId = (msg.sender && (msg.sender._id || msg.sender)) || msg.senderId || null;

      try { console.log('[chat-handler] myId:', myId, 'senderId:', senderId); } catch(e) {}

      // ignore events originating from the current user (prevent echo/duplication)
      try {
        if (myId && senderId && String(myId) === String(senderId)) return;
      } catch (e) {}

      // If sender object provided, cache its basic info for UI (name/avatar)
      try {
        if (msg.sender && typeof msg.sender === 'object') {
          const sid = String(msg.sender._id || msg.sender.id || msg.sender);
          const name = msg.sender.displayName || ((msg.sender.firstName || '') + ' ' + (msg.sender.lastName || '')).trim() || undefined;
          const avatar = msg.sender.avatar || undefined;
          if (sid) setSenderInfoMap(prev => ({ ...(prev || {}), [sid]: { ...(prev[sid] || {}), name, avatar } }));
          // also ensure recentContacts contains this sender with minimal profile
          try {
            const existing = profiles.find(x => String(x.id) === String(sid));
            if (!existing) {
              const p: Profile = { id: sid, name: name || sid, title: '', skills: [], badges: [], views: 0, lastActive: Date.now(), excerpt: '', location: '', featuredResume: undefined, tools: [], avatar: avatar, rating: 0, templatePreview: undefined };
              setRecentContacts(prev => { const merged = [p, ...prev.filter(x => x.id !== p.id)]; return merged.slice(0,5); });
            } else {
              setRecentContacts(prev => { const merged = [existing, ...prev.filter(x => x.id !== existing.id)]; return merged.slice(0,5); });
            }
          } catch (e) {}
        }
      } catch (e) {}

      // If sender was not provided as an object but we have an id, ensure they appear in recentContacts too
      try {
        if (!(msg.sender && typeof msg.sender === 'object') && senderId) {
          const sid = String(senderId);
          const existing = profiles.find(x => String(x.id) === sid);
          const name = existing ? existing.name : sid;
          const avatar = existing ? existing.avatar : undefined;
          const p: Profile = existing || { id: sid, name, title: '', skills: [], badges: [], views: 0, lastActive: Date.now(), excerpt: '', location: '', featuredResume: undefined, tools: [], avatar: avatar, rating: 0, templatePreview: undefined };
          setRecentContacts(prev => { const merged = [p, ...prev.filter(x => x.id !== p.id)]; return merged.slice(0,5); });
        }
      } catch (e) {}

      // Ensure sender is present in recentContacts (robust add/move) even if earlier branches returned
      try {
        const sidCandidate = (msg && msg.sender && (msg.sender._id || msg.sender.id || msg.sender)) || senderId || null;
        const sidStr = sidCandidate ? String(sidCandidate) : null;
        if (sidStr) {
          const nameFromMsg = msg && msg.sender && (msg.sender.displayName || msg.sender.name);
          const avatarFromMsg = msg && msg.sender && msg.sender.avatar;
          setRecentContacts(prev => {
            try {
              const existing = (prev || []).find(x => String(x.id) === sidStr);
              if (existing) return [existing, ...prev.filter(x => String(x.id) !== sidStr)].slice(0,5);
              const p: Profile = { id: sidStr, name: nameFromMsg || sidStr, title: '', skills: [], badges: [], views: 0, lastActive: Date.now(), excerpt: '', location: '', featuredResume: undefined, tools: [], avatar: avatarFromMsg || undefined, rating: 0, templatePreview: undefined };
              return [p, ...(prev || []).filter(x => String(x.id) !== sidStr)].slice(0,5);
            } catch (e) { return prev || []; }
          });
        }
      } catch (e) {}

      // If chat with this sender is open, append message to UI
      if (selectedContactId && senderId && String(selectedContactId) === String(senderId)) {
        setChatMessages(prev => [...prev, { id: msg._id || msg.id || ('m' + Math.random().toString(36).slice(2,9)), from: (String(msg.sender) === String(myId) ? 'user' : 'bot'), text: msg.text || msg.body || '', createdAt: msg.createdAt ? new Date(msg.createdAt).getTime() : Date.now(), parentMessageId: msg.parentMessageId || null }]);
        // Do NOT auto-clear unread markers — conversation remains until user removes it
        return;
      }

      // otherwise increment unread count for sender
      try {
        const fromKey = String(senderId || 'unknown');
        setUnreadBySender(prev => {
          const copy: Record<string,{id:string;text:string;createdAt?:number;parentMessageId?:string|null;}[]> = { ...(prev || {}) };
          copy[fromKey] = copy[fromKey] || [];
          copy[fromKey].push({ id: msg._id || msg.id || String(Math.random()), text: msg.text || msg.body || '', createdAt: msg.createdAt ? new Date(msg.createdAt).getTime() : Date.now(), parentMessageId: msg.parentMessageId || null });
          return copy;
        });
        // Ensure sender appears in recentContacts / senderInfoMap even if previously removed
        (async () => {
          try {
            const sid = String(senderId || fromKey);
            // If we already have sender info, just ensure they are in recentContacts
            const hasProfile = profiles.find(x => String(x.id) === sid);
            if (hasProfile) {
              setRecentContacts(prev => { const merged = [hasProfile, ...prev.filter(x => String(x.id) !== sid)]; return merged.slice(0,5); });
            } else {
              // try fetching minimal user info from server
              try {
                const res = await fetch(`/api/users/${encodeURIComponent(sid)}`);
                if (res.ok) {
                  const data = await res.json();
                  const u = data && (data.data || data) || null;
                  if (u) {
                    const p: Profile = { id: String(u._id || u.id || sid), name: u.displayName || (u.firstName ? (u.firstName + ' ' + (u.lastName || '')).trim() : (u.name || sid)), title: u.title || '', skills: u.skills || [], badges: [], views: 0, lastActive: Date.now(), excerpt: u.excerpt || '', location: u.location || '', featuredResume: undefined, tools: [], avatar: u.avatar || u.photo || undefined, rating: 0, templatePreview: undefined };
                    setSenderInfoMap(prev => ({ ...(prev || {}), [p.id]: { name: p.name, avatar: p.avatar } }));
                    setRecentContacts(prev => { const merged = [p, ...prev.filter(x => String(x.id) !== p.id)]; return merged.slice(0,5); });
                  }
                } else {
                  // fallback: add minimal placeholder so name shows as id
                  const p: Profile = { id: sid, name: sid, title: '', skills: [], badges: [], views: 0, lastActive: Date.now(), excerpt: '', location: '', featuredResume: undefined, tools: [], avatar: undefined, rating: 0, templatePreview: undefined };
                  setRecentContacts(prev => { const merged = [p, ...prev.filter(x => String(x.id) !== sid)]; return merged.slice(0,5); });
                }
              } catch (e) {
                const p: Profile = { id: sid, name: sid, title: '', skills: [], badges: [], views: 0, lastActive: Date.now(), excerpt: '', location: '', featuredResume: undefined, tools: [], avatar: undefined, rating: 0, templatePreview: undefined };
                setRecentContacts(prev => { const merged = [p, ...prev.filter(x => String(x.id) !== sid)]; return merged.slice(0,5); });
              }
            }
          } catch (e) {}
        })();
      } catch (e) {}
    };

    window.addEventListener('nexlabs:chat:message', handler as any);
    return () => window.removeEventListener('nexlabs:chat:message', handler as any);
  }, [selectedContactId]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!filterRef.current) return;
      if (!(e.target instanceof Node)) return;
      if (!filterRef.current.contains(e.target)) setShowFilterDropdown(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <div className={styles.root}>
      <Navbar />

      <main className={styles.wrap}>
        <header className={styles.headerBar}>
          <div>
            <h2 className={styles.pageTitle}>NexLabs Community</h2>
            <p className={styles.pageDesc}>Discover portfolios, connect with peers, and keep up with design news.</p>
          </div>

          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10}}>
            <div className={styles.searchWrap}>
              <input aria-label="Search community" className={styles.search} placeholder="Search name, skill, or institution" value={query} onChange={e => setQuery(e.target.value)} />
              {query && <button className={styles.clear} onClick={() => setQuery('')} aria-label="Clear search">✕</button>}
            </div>
            {import.meta.env.DEV && (
              <button className={styles.devPreviewBtn} onClick={() => previewCurrentUser()} title="Preview your profile (dev only)">Preview</button>
            )}
          </div>

          <div className={styles.headerControls}>
            <div className={styles.toggleRow}>
              <div className={styles.viewToggle} role="tablist" aria-label="View toggle">
                <button aria-pressed={view==='grid'} onClick={() => setView('grid')} className={styles.iconBtn}>▦</button>
                <button aria-pressed={view==='list'} onClick={() => setView('list')} className={styles.iconBtn}>☰</button>
              </div>
              <select value={sortBy} onChange={e=>setSortBy(e.target.value as any)} className={styles.sort}> 
                <option value="popular">Most Viewed</option>
                <option value="recent">Recently Active</option>
              </select>
            </div>
          </div>
        </header>

          {/* Upcoming was here — moved back to sidebar */}

        <div className={styles.pageGrid}>
          <section className={styles.leftCol}>
              <div className={styles.sectionCard}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
                  <div className={styles.sectionHeader}>Members</div>
                  <div style={{display:'flex',gap:8,alignItems:'center'}}>
                    <button aria-label="Prev members" onClick={() => scrollMembersBy(-1)} className={`${styles.membersNavBtn} ${styles.membersNavBtnLight}`}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button aria-label="Next members" onClick={() => scrollMembersBy(1)} className={`${styles.membersNavBtn} ${styles.membersNavBtnDark}`}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div className={styles.membersRowWrap} style={{ flex: 1 }}>
                      <motion.div ref={membersRef} className={styles.membersRow} variants={listContainer} initial="hidden" animate="show">
                        {filtered.map(p => (
                          <motion.div
                            key={p.id}
                            className={styles.memberCard}
                            onClick={() => handleOpenProfile(p)}
                            onMouseEnter={async () => {
                              // fetch fresh server-side views on first hover (only for real user ids)
                              try {
                                if ((p as any)._viewsFetched) return;
                                if (!isObjectId(p.id)) return;
                                const res = await fetch(`/api/users/${encodeURIComponent(p.id)}`);
                                if (!res.ok) return;
                                const data = await res.json();
                                const u = data.data || data;
                                if (!u) return;
                                setProfiles(prev => prev.map(x => x.id === p.id ? { ...x, views: typeof u.views === 'number' ? u.views : (x.views || 0), _viewsFetched: true } : x));
                              } catch (e) {
                                // ignore
                              }
                            }}
                            variants={itemVariant}
                            whileHover={{ y: -6, scale: 1.01 }}
                          >
                          {/* views badge removed per UI request */}
                          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                  <div className={styles.memberAvatar}>
                                    {p.avatar ? (
                                      <img src={p.avatar} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                                    ) : (
                                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{p.name.charAt(0)}</div>
                                    )}
                                  </div>
                            <div>
                              <div style={{ fontWeight: 800 }}>{p.name}</div>
                              <div style={{ fontSize: 13, color: 'var(--nl-muted)' }}>{p.title}</div>
                            </div>
                          </div>
                              <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{p.skills.slice(0,2).map(s => <span key={s} className={styles.skillPill}>{s}</span>)}</div>
                                <div style={{display:'flex',alignItems:'center',gap:8}}>
                                  <button className={styles.connect} title={`Start chat with ${p.name}`} onClick={e => {
                                      e.stopPropagation();
                                      // Open chat directly with this member (auto-select) so first message triggers notifications
                                      try { openChatWith(p.id); } catch (err) { setChatOpen(true); setSelectedContactId(p.id); }
                                    }} aria-label={`Chat with ${p.name}`}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                      <path d="M21 6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2v3l3-3h9a2 2 0 0 0 2-2V6z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                    </svg>
                                  </button>
                                </div>
                              </div>

                              <div className={styles.memberActions} onClick={e => e.stopPropagation()}>
                                <div className={styles.viewsInline} aria-hidden>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.2" />
                                  </svg>
                                  <span className={styles.actionSmallLabel}>{p.views}</span>
                                </div>

                                <button title="Save" className={styles.actionIcon} onClick={() => setSavedProfiles(s => ({ ...s, [p.id]: !s[p.id] }))}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path d="M12 21l-7-4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v12l-7 4z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                </button>

                                <button title="Invite" className={styles.actionIcon} onClick={() => { setInvitedProfiles(s => ({ ...s, [p.id]: true })); alert(`Invite sent to ${p.name}`); }}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M7 10a4 4 0 1 1 8 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                </button>
                              </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>

                  
                </div>
              </div>

              <div className={styles.sectionCard}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
                  <div className={styles.sectionHeader}>Community Feed {postTagFilter && (<span style={{fontSize:13, color:'var(--form-accent-blue)', marginLeft:8}}>{postTagFilter} <button onClick={()=>setPostTagFilter(null)} style={{marginLeft:8}}>×</button></span>)}</div>
                  <div className={styles.postFilters} ref={filterRef}>
                    <button className={styles.filterIconBtn} onClick={() => setShowFilterDropdown(s => !s)} aria-haspopup="true" aria-expanded={showFilterDropdown} title="Filters">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                        <path d="M22 3H2l8 9v7l4 2v-9l8-9z" fill="currentColor" />
                      </svg>
                    </button>
                    {showFilterDropdown && (
                      <div className={styles.filterMenu} role="menu">
                        <button className={styles.filterMenuItem} onClick={() => { setPostFilter('all'); setShowFilterDropdown(false); }}>All</button>
                        <button className={styles.filterMenuItem} onClick={() => { setPostFilter('new'); setShowFilterDropdown(false); }}>New</button>
                        <button className={styles.filterMenuItem} onClick={() => { setPostFilter('most_commented'); setShowFilterDropdown(false); }}>Most commented</button>
                        <button className={styles.filterMenuItem} onClick={() => { setPostFilter('popular'); setShowFilterDropdown(false); }}>Popular</button>
                        <button className={styles.filterMenuItem} onClick={() => { setPostFilter('with_images'); setShowFilterDropdown(false); }}>With images</button>
                      </div>
                    )}
                  </div>
                </div>
                  {/* current user id used to show edit/delete only for own posts */}
                  {(() => {
                    try {
                      const raw = localStorage.getItem('nexlabs_user') || sessionStorage.getItem('nexlabs_user');
                      const parsed = raw ? JSON.parse(raw) : null;
                      // attach below via closure
                      (window as any).__nexlabs_current_user_id = parsed?._id || parsed?.id || null;
                    } catch (e) { (window as any).__nexlabs_current_user_id = null; }
                    return <PostComposer onPost={handleAddPost} />;
                  })()}
                  <div className={styles.postsFullWidth}>
                    <PostList posts={filteredPosts} currentUserId={(window as any).__nexlabs_current_user_id || null} onLike={handleLike} onTagClick={handleTagClick} onReply={handleReply} onViewProfile={(author) => {
                      const prof = profiles.find(p => p.name === author);
                      if (prof) setSelected(prof);
                    }} onEdit={handleEditPost} onDelete={handleDeletePost} />
                  </div>
              </div>
          </section>

          <aside className={styles.rightCol}>
            <div className={styles.sideCard}>
              <div className={styles.sideTitle}>Upcoming</div>
              <div className={styles.sideItem}>Portfolio Review — Apr 10</div>
              <div className={styles.sideItem}>Mock Interview — Apr 14</div>
            </div>
            <div className={styles.sideCard}>
              <div className={styles.sideTitle}>Trending Tags</div>
              <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                {['#UXUI','#portfolio','#Motion','#Prototyping','#Research','#internship','#review','#competition','#หาTeam'].map(t => (
                  <button
                    key={t}
                    onClick={() => {
                      setSkillFilter(skillFilter===t?null:t);
                      setPostTagFilter((prev) => prev === t ? null : t);
                    }}
                    className={`${styles.chip} ${skillFilter===t?styles.chipActive:''}`}
                  >{t}</button>
                ))}
              </div>
            </div>

            <div className={styles.sideCard}>
              <div className={styles.sideTitle}>Top Contributors</div>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {profiles.slice(0,4).map(p => (
                  <div key={p.id} style={{display:'flex',alignItems:'center',gap:10}}>
                    <div className={styles.memberAvatarSmall}>{p.name.charAt(0)}</div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,fontSize:13}}>{p.name}</div>
                      <div style={{fontSize:12,color:'var(--nl-muted)'}}>{p.title}</div>
                    </div>
                    <div style={{fontSize:12,color:'var(--nl-muted)'}}>{p.views}</div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* Bottom full-width News & Updates strip */}
        <div className={styles.newsStripWrap}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
            <div className={styles.sideTitle}>News & Updates</div>
            <div className={styles.newsNav}>
              <button onClick={()=>scrollNews(-320)} className={`${styles.newsNavBtn} ${styles.newsNavBtnLight}`} aria-label="Scroll news left">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button onClick={()=>scrollNews(320)} className={`${styles.newsNavBtn} ${styles.newsNavBtnDark}`} aria-label="Scroll news right">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
            <div className={styles.newsStrip} ref={newsRef} tabIndex={0} aria-live="polite">
              {NEWS.map(n => (
                <div key={n.id} className={styles.newsCard} role="article" style={{cursor:'pointer'}} onClick={() => setNewsSelected(n)}>
                  {n.image && <img src={n.image} alt={n.title} className={styles.newsImage} />}
                  <div className={styles.newsInfo}>
                    <div className={styles.newsCardTag}>{n.tag}</div>
                    <div className={styles.newsCardTitle}>{n.title}</div>
                    <div className={styles.newsCardDesc}>Read more — click to view details</div>
                  </div>
                </div>
              ))}
            </div>
        </div>
          {/* Modal for profile */}
          {selected && (
            <div className={styles.modalBackdrop} onClick={()=>setSelected(null)}>
              <div className={styles.modal} role="dialog" aria-modal="true" aria-label={`${selected.name} profile`} ref={modalRef} tabIndex={-1} onClick={e=>e.stopPropagation()}>
                <button className={styles.modalClose} aria-label="Close" onClick={()=>setSelected(null)}>
                  <span aria-hidden>✕</span>
                </button>
                {/* Combined modal: template preview (left) and profile (right) below */}
                  <div className={styles.modalInner}>
                    {/* Left: Template preview column */}
                    <div className={styles.templateColumn}>
                      <div style={{display:'flex',alignItems:'center'}}>
                        <div className={styles.profileSectionTitle}>Template Preview</div>
                      </div>
                          <div className={styles.templatePreviewWrap + ((selected && getDisplayProfile(selected)?.templatePreview) ? ' ' + styles.templatePreviewA4 : '')}>
                          {(() => {
                            const dp = getDisplayProfile(selected);
                            const previewUrl = dp?.templatePreview || (selected ? selected.templatePreview : null);
                            if (previewUrl) return (
                              <img
                                src={previewUrl}
                                alt="template preview"
                                className={styles.templatePreview}
                                onClick={() => openFullscreen(previewUrl)}
                                style={{cursor:'zoom-in'}}
                                onError={(e) => {
                                  const t = e.currentTarget as HTMLImageElement;
                                  if (!t.dataset.fallback) { t.dataset.fallback = '1'; t.src = A4_MOCK; }
                                }}
                              />
                            );
                            return (<img src={A4_MOCK} alt="template preview mock" className={styles.templatePreview} onClick={() => openFullscreen(A4_MOCK)} style={{cursor:'zoom-in'}} />);
                          })()}
                          </div>
                      <div className={styles.previewActionsRow}>
                        <div className={styles.templateCaption}>ตัวอย่างเทมเพลต — ปรับ UX/UI ให้เหมาะกับงาน Motion ของเราใหม่</div>
                        {selected.templatePreview ? (
                        <button className={styles.previewBtn} onClick={() => openFullscreen(selected.templatePreview)}>ดูตัวอย่าง</button>
                      ) : (
                        <button className={styles.btnSecondary} disabled>ดูตัวอย่าง</button>
                      )}
                      </div>
                    </div>

                    {/* Right: Profile column */}
                    <div className={styles.profileColumn}>
                      <div className={styles.profileHeader}>
                          <div style={{display:'flex',gap:12,alignItems:'center'}}>
                          {(() => {
                            const dp = getDisplayProfile(selected);
                            return (
                              <>
                                <div className={styles.modalAvatar} style={{width:80,height:80,borderRadius:12,overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center',background:'#eee'}}>
                                  {dp?.avatar ? (
                                    <img src={dp.avatar} alt={dp.name || ''} style={{width:'100%',height:'100%',objectFit:'cover'}} />
                                  ) : (
                                    <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800}}>{(dp?.name || (selected && selected.name) || '?').charAt(0)}</div>
                                  )}
                                </div>
                                <div>
                                  <h3 className={styles.modalName}>{dp?.name || (selected && selected.name)}</h3>
                                  <div className={styles.modalMeta}>{dp?.title || (selected && selected.title)} · {dp?.location || selected?.location || selected?.school}</div>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                        {/* rating and badge intentionally removed per request */}
                      </div>

                      <div className={styles.profileDetails}>
                        <div className={styles.profileLeft}>
                          <div className={styles.profileSection}>
                            <div className={styles.profileSectionTitle}>Featured Resume</div>
                            <div className={styles.profileResume}>{getDisplayProfile(selected)?.featuredResume || selected.featuredResume || '—'}</div>
                          </div>

                          <div className={styles.profileSection}>
                            <div className={styles.profileSectionTitle}>Skills & Tools</div>
                            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                              {(getDisplayProfile(selected)?.tools || selected.tools || selected.skills || []).slice(0,8).map((t,i) => (
                                <div key={String(t) + i} className={styles.skillTag}>{String(t).replace('#','')}</div>
                              ))}
                            </div>
                          </div>
                          <div className={styles.profileSection}>
                            <div className={styles.profileSectionTitle}>About</div>
                              <div className={styles.profileBio}>{(getDisplayProfile(selected)?.excerpt) || selected.excerpt || '—'}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          )}

          {/* Modal for news item with comments */}
          {newsSelected && (
            <div className={styles.modalBackdrop} onClick={()=>setNewsSelected(null)}>
              <div className={styles.modal} role="dialog" aria-modal="true" aria-label={`${newsSelected.title}`} tabIndex={-1} onClick={e=>e.stopPropagation()}>
                <button className={styles.modalClose} aria-label="Close" onClick={()=>setNewsSelected(null)}>✕</button>
                <div style={{display:'flex',flexDirection:'column',gap:12}}>
                  {newsSelected.image && <img src={newsSelected.image} alt={newsSelected.title} className={styles.newsModalImage} />}
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div>
                      <div style={{fontSize:12,color:'var(--nl-muted)',fontWeight:800}}>{newsSelected.tag}</div>
                      <h3 style={{margin:'6px 0'}}>{newsSelected.title}</h3>
                    </div>
                  </div>

                  <div style={{borderTop:'1px solid rgba(15,23,42,0.04)',paddingTop:8}}>
                    <div style={{fontWeight:700,marginBottom:8}}>Comments</div>
                    <div style={{display:'flex',flexDirection:'column',gap:8,maxHeight:320,overflow:'auto',paddingRight:6}}>
                      {(newsComments[newsSelected.id] || []).map(c => (
                        <div key={c.id} style={{background:'#f8fafc',padding:8,borderRadius:8}}>
                          <div style={{fontWeight:700}}>{c.author} <span style={{fontWeight:400,color:'#666',fontSize:12}}>· {new Date(c.time).toLocaleString()}</span></div>
                          <div style={{marginTop:6}}>{c.content}</div>
                        </div>
                      ))}
                      {(!(newsComments[newsSelected.id] || []).length) && (
                        <div style={{color:'var(--nl-muted)'}}>No comments yet. Be the first to comment.</div>
                      )}
                    </div>
                  </div>

                  <div style={{display:'flex',gap:8,marginTop:6}}>
                    <textarea id="newsComment" placeholder="Write a comment..." style={{flex:1,minHeight:72,padding:8,borderRadius:8,border:'1px solid rgba(15,23,42,0.06)'}} />
                    <div style={{display:'flex',flexDirection:'column',gap:8}}>
                      <button onClick={() => {
                        const ta = document.getElementById('newsComment') as HTMLTextAreaElement | null;
                        const v = ta?.value.trim();
                        if(!v) return;
                        const id = 'c'+Math.random().toString(36).slice(2,9);
                        setNewsComments(prev => ({...prev, [newsSelected.id]: [...(prev[newsSelected.id]||[]), {id,author:'You',content:v,time: Date.now()}]}));
                        if(ta) ta.value = '';
                      }} style={{padding:'8px 10px',background:'#0b74ff',color:'#fff',border:0,borderRadius:8}}>Send</button>
                      <button onClick={() => { const ta = document.getElementById('newsComment') as HTMLTextAreaElement | null; if(ta) ta.value=''; }} style={{padding:'6px 10px'}}>Clear</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {templateOpen && (
            <div className={styles.modalBackdrop} onClick={() => setTemplateOpen(null)}>
              <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Template preview" tabIndex={-1} onClick={e => e.stopPropagation()}>
                <button className={styles.modalClose} aria-label="Close" onClick={() => setTemplateOpen(null)}>✕</button>
                <div style={{display:'flex',flexDirection:'column',gap:12}}>
                  <img
                    src={templateOpen}
                    alt="Template preview"
                    className={styles.newsModalImage}
                    onError={(e) => {
                      const t = e.currentTarget as HTMLImageElement;
                      if (!t.dataset.fallback) { t.dataset.fallback = '1'; t.src = A4_MOCK; }
                    }}
                  />
                  <div style={{textAlign:'right',fontSize:13,color:'var(--nl-muted)'}}>ตัวอย่างเทมเพลต</div>
                </div>
              </div>
            </div>
          )}

          {fsOpen && (
            <div className={styles.fsBackdrop} onClick={closeFullscreen}>
              <div className={styles.fsModal} role="dialog" aria-modal="true" aria-label="Fullscreen template preview" onClick={e => e.stopPropagation()}>
                <button className={styles.fsClose} aria-label="Close" onClick={closeFullscreen}>✕</button>
                <div className={styles.fsControls}>
                  <button className={styles.fsBtn} onClick={fsPrev} aria-label="Previous">◀</button>
                  <div style={{display:'flex',gap:8}}>
                    <button className={styles.fsBtn} onClick={zoomOut} aria-label="Zoom out">−</button>
                    <button className={styles.fsBtn} onClick={() => setFsZoom(1)} aria-label="Reset">Reset</button>
                    <button className={styles.fsBtn} onClick={zoomIn} aria-label="Zoom in">+</button>
                  </div>
                  <button className={styles.fsBtn} onClick={fsNext} aria-label="Next">▶</button>
                </div>
                <div className={styles.fsImage}>
                  <img src={fsOpen} alt="Fullscreen preview" style={{transform:`scale(${fsZoom})`}} onError={(e) => { const t = e.currentTarget as HTMLImageElement; if(!t.dataset.fallback){ t.dataset.fallback='1'; t.src = A4_MOCK; } }} />
                </div>
              </div>
            </div>
          )}

      </main>
      {/* Floating chat FAB */}
      <div style={{position:'relative'}}>
      <button className={styles.chatFab} aria-label="Open chat" onClick={() => {
        setChatOpen(s => {
          const willOpen = !s;
          if (willOpen) {
            setSelectedContactId(null);
            setChatMessages([]);
            setChatInput('');
          }
          return willOpen;
        });
      }}>
        <svg className={styles.chatFabIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" fill="#fff" />
        </svg>
            {totalUnread > 0 && (
              <span className={styles.chatBadge}>{totalUnread > 99 ? '99+' : totalUnread}</span>
            )}
      </button>

      {/* show top sender name if available */}
      {totalUnread > 0 && (() => {
        try {
          const map = unreadBySender || {};
          const senderIds = Object.keys(map || {});
          if (!senderIds.length) return null;
          // choose the sender with the largest unread count
          senderIds.sort((a, b) => ((map[b] || []).length || 0) - ((map[a] || []).length || 0));
          const topId = senderIds[0];
          const unreadCountForTop = (map[topId] || []).length || 0;
          const others = Math.max(0, totalUnread - unreadCountForTop);
          const nameFromMap = senderInfoMap && senderInfoMap[topId] && senderInfoMap[topId].name;
          const profile = profiles.find(p => String(p.id) === String(topId));
          const displayName = nameFromMap || (profile && profile.name) || String(topId).slice(0,8);
          const label = others > 0 ? `${displayName} และ ${others} คน` : `${displayName}`;
          return (<div className={styles.chatBadgeLabel} onClick={() => { try { openChatWith(topId); } catch (e) { setChatOpen(true); setSelectedContactId(topId); } }}>{label}</div>);
        } catch (e) { return null; }
      })()}

      {/* FAB unread menu removed — unread chats surface in the chat panel contact list */}
      </div>

      {chatOpen && (
        <div className={styles.chatWindow} role="dialog" aria-label="Chat">
          <div className={styles.chatHeader}>
            {selectedContactId ? (
                <>
                <button onClick={() => { setSelectedContactId(null); }} style={{background:'transparent',border:0,color:'#fff',cursor:'pointer',marginRight:8}}>‹ Back</button>
                <span style={{fontWeight:800}}>{profiles.find(p => p.id === selectedContactId)?.name || (senderInfoMap[selectedContactId] && senderInfoMap[selectedContactId].name) || selectedContactId}</span>
                {selectedContactId && unreadBySender[String(selectedContactId)] && unreadBySender[String(selectedContactId)].length > 0 && (
                  <span style={{marginLeft:8,background:'#ef4444',color:'#fff',padding:'2px 8px',borderRadius:12,fontSize:12,fontWeight:700}}>{unreadBySender[String(selectedContactId)].length}</span>
                )}
                <button onClick={() => setChatOpen(false)} style={{float:'right',background:'transparent',border:0,cursor:'pointer',color:'#fff'}}>✕</button>
                <button onClick={() => { removeContact(selectedContactId || ''); setChatOpen(false); }} aria-label="Remove conversation" title="Remove conversation" style={{float:'right',background:'transparent',border:0,cursor:'pointer',color:'#fff',marginRight:8}}>🗑</button>
              </>
            ) : (
              <>
                <span>Chat</span>
                <button onClick={() => setChatOpen(false)} style={{float:'right',background:'transparent',border:0,cursor:'pointer',color:'#fff'}}>✕</button>
              </>
            )}
          </div>

          {/* show contacts only when no contact is selected */}
          {!selectedContactId && (
            <div className={styles.chatContacts}>
              {recentContacts.map(c => (
                <div key={c.id} className={styles.chatContact} onClick={() => openChatWith(c.id)} style={{display:'flex',alignItems:'center',gap:8,justifyContent:'space-between'}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,flex:1}}>
                    <div className={styles.chatContactAvatar}>{c.name.charAt(0)}</div>
                    <div className={styles.chatContactName} style={{display:'flex',alignItems:'center',gap:8,flex:1}}>
                      <span style={{flex:1}}>{c.name}</span>
                      {unreadBySender[String(c.id)] && unreadBySender[String(c.id)].length > 0 && (
                        <span style={{background:'#ef4444',color:'#fff',padding:'2px 8px',borderRadius:12,fontSize:12,fontWeight:700}}>{unreadBySender[String(c.id)].length}</span>
                      )}
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); removeContact(c.id); }} aria-label="Remove conversation" title="Remove conversation" style={{background:'transparent',border:0,color:'var(--nl-muted)',cursor:'pointer',marginLeft:8}}>✕</button>
                </div>
              ))}
            </div>
          )}

          {selectedContactId ? (
            <div className={styles.chatMessages} ref={chatMessagesRef}>
              {chatMessages.length === 0 && <div style={{color:'rgba(255,255,255,0.6)'}}>No messages yet</div>}
              {chatMessages.map(m => {
                const parent = m.parentMessageId ? chatMessages.find(x => x.id === m.parentMessageId) : null;
                return (
                  <div key={m.id} data-message-id={m.id} ref={el => { if (el) messageRefs.current[m.id] = el; else delete messageRefs.current[m.id]; }} style={{display:'flex',flexDirection:'column',gap:6}}>
                    <div className={`${styles.chatMsg} ${m.from === 'user' ? styles.chatMsgUser : styles.chatMsgOther}`}>
                      {parent && (
                        <div style={{fontSize:12,opacity:0.85,background:'rgba(0,0,0,0.04)',padding:6,borderRadius:6,marginBottom:6}}>
                          <div style={{fontWeight:700,fontSize:12}}>In reply to</div>
                          <div style={{fontSize:12,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{parent.text}</div>
                        </div>
                      )}
                      <div style={{whiteSpace:'pre-wrap'}}>{m.text}</div>
                    </div>
                    <div style={{display:'flex',justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start'}}>
                      <button onClick={() => { setReplyTo({ id: m.id, text: (m.text || '').slice(0,200) }); const ta = document.querySelector(`.${styles.chatInput}`) as HTMLTextAreaElement | null; ta?.focus(); }} style={{background:'transparent',border:0,color:'rgba(255,255,255,0.7)',fontSize:12,cursor:'pointer'}}>Reply</button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
          {selectedContactId ? (
            <div style={{padding:12}}>
              {replyTo && (
                <div style={{marginBottom:8,background:'rgba(255,255,255,0.06)',padding:8,borderRadius:8,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div style={{fontSize:13}}><strong>Replying to</strong>: {replyTo.text.length > 120 ? replyTo.text.slice(0,120) + '…' : replyTo.text}</div>
                  <button onClick={() => setReplyTo(null)} style={{background:'transparent',border:0,color:'rgba(255,255,255,0.8)',cursor:'pointer'}}>Cancel</button>
                </div>
              )}
              <div className={styles.chatInputRow}>
                <textarea className={styles.chatInput} value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Write a message..." onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); } }} />
                <button className={styles.chatSend} onClick={sendChat} disabled={!chatInput.trim()} aria-label="Send message">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                    <path d="M22 2L11 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" fill="currentColor" />
                  </svg>
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
