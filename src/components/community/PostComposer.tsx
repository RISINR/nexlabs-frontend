import React, { useState } from 'react';

type Props = {
  onPost: (content: string, images?: string[] | null) => void;
};

export default function PostComposer({ onPost }: Props) {
  const [text, setText] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed && images.length === 0) return;
    onPost(trimmed, images.length ? images : undefined);
    setText('');
    setImages([]);
  };

  const onFiles = (files?: FileList | null) => {
    // accept only a single image
    if (!files || files.length === 0) return;
    const f = files[0];
    const fr = new FileReader();
    fr.onload = () => {
      setImages([String(fr.result || '')]);
    };
    fr.readAsDataURL(f);
  };

  const removeImage = () => setImages([]);

  // derive current user for avatar/initials
  const stored = localStorage.getItem('nexlabs_user') || sessionStorage.getItem('nexlabs_user');
  const user = stored ? JSON.parse(stored) : null;
  const avatar = user?.avatar;
  const display = user ? (user.displayName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Y') : 'Y';

  return (
    <div style={{ borderRadius: 8, padding: 12, background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.04)', marginBottom: 12 }}>
      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, overflow: 'hidden' }}>
          {avatar ? (
            <img src={avatar} alt={display} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>{display.charAt(0)}</div>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <textarea
            aria-label="Write a post"
            placeholder="Share something with the community..."
            value={text}
            onChange={e => setText(e.target.value)}
            style={{ width: '100%', minHeight: 80, resize: 'vertical', padding: 8, borderRadius: 6, border: '1px solid #e6e6e6' }}
          />

          {images.length > 0 && (
            <div style={{ marginTop: 8, position: 'relative' }}>
              <img src={images[0]} alt={`preview-0`} className="postImagePreview" />
              <button onClick={() => removeImage()} style={{ position: 'absolute', right: 8, top: 8, padding: 6, background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: 6 }}>Remove</button>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, alignItems: 'center' }}>
            <div style={{ color: '#666', fontSize: 13 }}>You can include links, tips or short updates. Max 1 image.</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <label style={{ padding: '6px 10px', borderRadius: 8, background: '#f6f7fb', cursor: 'pointer', border: '1px solid rgba(0,0,0,0.04)' }}>
                Add image
                <input type="file" accept="image/*" onChange={e => onFiles(e.target.files)} style={{ display: 'none' }} />
              </label>
              <button onClick={() => { setText(''); setImages([]); }} style={{ padding: '6px 10px' }}>Clear</button>
              <button onClick={submit} style={{ padding: '6px 12px', background: '#0b74ff', color: '#fff', borderRadius: 6, border: 'none' }}>Post</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
