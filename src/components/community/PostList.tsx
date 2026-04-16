import React, { useState } from 'react';
import { useConfirmDialog } from '../ui/ConfirmDialogProvider';

export type Post = {
  id: string;
  author: string;
  authorId?: string;
  authorAvatar?: string;
  content: string;
  time: number;
  likes?: number;
  _liked?: boolean;
  image?: string[] | null;
  replies?: { id: string; author: string; authorAvatar?: string; authorId?: string; content: string; time: number }[];
  attachments?: string[] | null;
  isLocal?: boolean;
};

type Props = {
  posts: Post[];
  onLike?: (id: string) => void;
  onTagClick?: (tag: string) => void;
  onReply?: (postId: string, content: string) => void;
  onViewProfile?: (author: string) => void;
  onEdit?: (postId: string, newContent: string) => void;
  onDelete?: (postId: string) => void;
  currentUserId?: string | null;
};

function timeAgo(t: number) {
  const s = Math.floor((Date.now() - t) / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

export default function PostList({ posts, onLike, onTagClick, onReply, onViewProfile, onEdit, onDelete, currentUserId }: Props) {
  const confirmDialog = useConfirmDialog();
  const [openReplyFor, setOpenReplyFor] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const submitReply = (postId: string) => {
    const trimmed = replyText.trim();
    if (!trimmed) return;
    onReply?.(postId, trimmed);
    setReplyText('');
    setOpenReplyFor(null);
  };

  return (
    <div>
      {posts.map(p => (
        <article key={p.id} className="postItem" style={{ padding: 12, borderRadius: 8, background: '#fff', marginBottom: 8, boxShadow: '0 1px 0 rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, overflow: 'hidden' }}>
              {p.authorAvatar ? <img src={p.authorAvatar} alt={p.author} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /> : p.author.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 700, cursor: onViewProfile ? 'pointer' : 'default' }} onClick={() => onViewProfile?.(p.author)}>{p.author}</div>
                <div style={{ color: '#888', fontSize: 12 }}>{timeAgo(p.time)}</div>
              </div>
              <div style={{ marginTop: 6, whiteSpace: 'pre-wrap' }}>{renderWithHashtags(p.content, (tag) => onTagClick?.(tag))}</div>
              {p.image && p.image.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  {(() => {
                    const total = p.image!.length;
                    const showMore = total > 3;
                    const imgs = showMore ? p.image!.slice(0, 3) : p.image!;
                    const containerClass = showMore ? 'postImages images-more' : `postImages images-${total}`;
                    const extra = showMore ? total - 3 : 0;
                    return (
                      <div className={containerClass}>
                        {imgs.map((src, i) => (
                          <div key={i} style={{ position: 'relative' }}>
                            <img src={src} alt={`post-${i}`} className="postImage" />
                            {i === imgs.length - 1 && extra > 0 && (
                              <div className="imageOverlay">+{extra}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}

              {p.attachments && p.attachments.length > 0 && (
                <div style={{ marginTop: 8, display: 'flex', gap: 8, flexDirection: 'column' }}>
                  {p.attachments.map((att, i) => {
                    let parsed: any = null;
                    try { parsed = JSON.parse(att); } catch (e) { parsed = null; }
                    if (parsed && parsed.type === 'profile') {
                      const prof = parsed.profile || {};
                      return (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, borderRadius: 8, background: '#f8fafc', border: '1px solid #eaeef6' }}>
                          <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#ddd', overflow: 'hidden' }}>
                            {prof.avatar ? <img src={prof.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{(prof.displayName||'U').charAt(0)}</div>}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700 }}>{prof.displayName || `${prof.firstName || ''} ${prof.lastName || ''}`.trim()}</div>
                            <div style={{ fontSize: 13, color: '#666' }}>{prof.position || ''}</div>
                          </div>
                          <button style={{ padding: '6px 10px' }}>View profile</button>
                        </div>
                      );
                    }
                    if (parsed && parsed.type === 'resume') {
                      const r = parsed.resumeSummary || {};
                      const preview = parsed.templatePreview || '';
                      return (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, borderRadius: 8, background: '#fff', border: '1px solid #e6eef9' }}>
                          <div style={{ width: 60, height: 72, borderRadius: 6, background: '#f4f7fb', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {preview ? <img src={preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ fontWeight: 700 }}>{(r.basicInfo?.fullName||'R').split(' ').map((s:any)=>s.charAt(0)).slice(0,2).join('')}</div>}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700 }}>{r.basicInfo?.fullName || 'Resume'}</div>
                            <div style={{ fontSize: 13, color: '#666' }}>{r.basicInfo?.professionalTitle || (r.experiences && r.experiences.length ? r.experiences[0].title : '')}</div>
                          </div>
                          <button style={{ padding: '6px 10px' }}>View resume</button>
                        </div>
                      );
                    }
                    // fallback: show raw string unless it's a data URI (hide long base64 blobs)
                    if (typeof att === 'string') {
                      if (att.startsWith('data:')) {
                        // Do not render raw data URI strings under the post (these are large base64 blobs)
                        return null;
                      }
                      return <div key={i} style={{ fontSize: 13, color: '#444' }}>{att}</div>;
                    }
                    return null;
                  })}
                </div>
              )}

              <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
                <button
                  className="likeBtn"
                  onClick={() => onLike?.(p.id)}
                  aria-pressed={!!p._liked}
                  style={{ padding: '6px 8px', display: 'flex', gap: 6, alignItems: 'center', cursor: 'pointer', opacity: p._liked ? 0.85 : 1 }}
                >
                  {p._liked ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 21s-6-4.35-9-7.5C0.5 10.5 3 6 6.5 6c2 0 3 1 3.5 2.5C10.5 7 11.5 6 13.5 6 17 6 19.5 10.5 21 13.5 18 16.65 12 21 12 21z"/></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 21s-6-4.35-9-7.5C0.5 10.5 3 6 6.5 6c2 0 3 1 3.5 2.5C10.5 7 11.5 6 13.5 6 17 6 19.5 10.5 21 13.5 18 16.65 12 21 12 21z" stroke="#333" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  )}
                  <span style={{ fontSize: 13 }}>{p.likes || 0}</span>
                </button>

                <button className="replyBtn" onClick={() => setOpenReplyFor(openReplyFor === p.id ? null : p.id)} style={{ padding: '6px 8px', display: 'flex', gap: 6, alignItems: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#333" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span style={{ fontSize: 13 }}>{p.replies && p.replies.length ? `Reply · ${p.replies.length}` : 'Reply'}</span>
                </button>
                  {/* Edit/Delete (only show when user is the author) */}
                  {currentUserId && String(currentUserId) === String(p.authorId) && (
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => {
                          setEditingPost(p.id);
                          setEditText(p.content || '');
                        }}
                        style={{ padding: '6px 8px', borderRadius: 8 }}
                      >Edit</button>
                      <button
                        onClick={async () => {
                          const ok = await confirmDialog({
                            title: 'ลบโพสต์นี้ใช่ไหม?',
                            description: 'เมื่อยืนยันแล้วจะไม่สามารถกู้คืนได้',
                            confirmText: 'ลบโพสต์',
                            cancelText: 'ยกเลิก',
                            tone: 'danger',
                          });
                          if (!ok) return;
                          onDelete?.(p.id);
                        }}
                        style={{ padding: '6px 8px', borderRadius: 8 }}
                      >Delete</button>
                    </div>
                  )}
              </div>

              {/* replies */}
              {p.replies && p.replies.length > 0 && (
                <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {p.replies.map(r => (
                    <div key={r.id} style={{ background: '#f8fafc', padding: 8, borderRadius: 8, fontSize: 13, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#ddd', overflow: 'hidden', flex: '0 0 32px' }}>
                        {r.authorAvatar ? <img src={r.authorAvatar} alt={r.author} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{(r.author||'U').charAt(0)}</div>}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <button onClick={() => onViewProfile?.(r.author)} style={{ background: 'transparent', border: 'none', padding: 0, margin: 0, cursor: 'pointer', fontWeight: 700 }}>{r.author}</button>
                          <span style={{ fontWeight: 400, color: '#666', fontSize: 12 }}>· {timeAgo(r.time)}</span>
                        </div>
                        <div style={{ marginTop: 6, whiteSpace: 'pre-wrap' }}>{renderWithHashtags(r.content, (tag) => onTagClick?.(tag))}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {openReplyFor === p.id && (
                <div style={{ marginTop: 10, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <textarea value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Write a reply..." style={{ flex: 1, minHeight: 56, padding: 8, borderRadius: 8, border: '1px solid rgba(15,23,42,0.06)' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <button onClick={() => submitReply(p.id)} style={{ padding: '8px 10px', background: '#0b74ff', color: '#fff', border: 'none', borderRadius: 8 }}>Send</button>
                    <button onClick={() => { setOpenReplyFor(null); setReplyText(''); }} style={{ padding: '6px 10px', borderRadius: 8 }}>Cancel</button>
                  </div>
                </div>
              )}

              {/* Inline edit UI */}
              {editingPost === p.id && (
                <div style={{ marginTop: 10 }}>
                  <textarea value={editText} onChange={e => setEditText(e.target.value)} style={{ width: '100%', minHeight: 80, padding: 8, borderRadius: 8, border: '1px solid rgba(15,23,42,0.06)' }} />
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button onClick={() => { onEdit?.(p.id, editText); setEditingPost(null); setEditText(''); }} style={{ padding: '8px 10px', background: '#0b74ff', color: '#fff', border: 'none', borderRadius: 8 }}>Save</button>
                    <button onClick={() => { setEditingPost(null); setEditText(''); }} style={{ padding: '6px 10px', borderRadius: 8 }}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function renderWithHashtags(text: string, onClick?: (tag: string) => void) {
  // supports unicode letters/numbers/underscore/hyphen in tags
  const re = /#[\p{L}\p{N}_-]+/gu;
  const parts: Array<string | { tag: string } > = [];
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > lastIndex) parts.push(text.slice(lastIndex, m.index));
    parts.push({ tag: m[0] });
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));

  return parts.map((part, i) => {
    if (typeof part === 'string') return <span key={i}>{part}</span>;
    return (
      <button
        key={i}
        onClick={() => onClick?.(part.tag)}
        className="hashtag"
        style={{ background: 'transparent', border: 'none', color: 'var(--form-accent-blue)', cursor: 'pointer', padding: 0, margin: 0 }}
      >
        {part.tag}
      </button>
    );
  });
}
