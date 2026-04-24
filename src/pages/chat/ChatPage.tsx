import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import styles from '../community/CommunityPage.module.css';
import { MOCK } from '../community/CommunityPage';
import { buildApiUrl } from '../../utils/apiBase';

export default function ChatPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const profile = useMemo(() => MOCK.find(p => p.id === id) || null, [id]);
  const [messages, setMessages] = useState<Array<any>>([
    { id: 'sys0', from: 'system', text: profile ? `Chat with ${profile.name}` : 'Chat', createdAt: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const socketRef = useRef<any>(null);

  // Listen for incoming chat messages (socket and window forwarded events)
  useEffect(() => {
    const socket = (window as any).__nexlabs_socket;
    socketRef.current = socket;

    const handler = (payload: any) => {
      try {
        const p = payload && payload.detail ? payload.detail : payload;
        // payload may be { chatId, message } or chatPayload from server
        const chatId = p && p.chatId ? String(p.chatId) : null;
        const msg = p && (p.message || p);
        // If message's sender matches current chat partner or chatId indicates this convo, push
        const senderId = msg && msg.sender && (msg.sender._id || msg.sender);
        if (!msg) return;
        // If this message is from or to the current profile id, append
        // Server sends chat:message with chatId and message.sender
        if (String(senderId) === String(id) || (msg && msg._id && chatId && String(chatId).includes(id))) {
          setMessages(prev => [...prev, { id: msg._id || ('m_'+Math.random().toString(36).slice(2,9)), from: 'them', text: msg.text || msg, createdAt: msg.createdAt || Date.now(), sender: msg.sender }]);
        } else {
          // If chatId absent but payload seems like message from id
          if (String(senderId) === String(id)) {
            setMessages(prev => [...prev, { id: msg._id || ('m_'+Math.random().toString(36).slice(2,9)), from: 'them', text: msg.text || msg, createdAt: msg.createdAt || Date.now(), sender: msg.sender }]);
          }
        }
      } catch (e) { }
    };

    try { if (socket && socket.on) socket.on('chat:message', handler); } catch (e) {}
    try { window.addEventListener('nexlabs:chat:message', handler as any); } catch (e) {}

    return () => {
      try { if (socket && socket.off) socket.off('chat:message', handler); } catch (e) {}
      try { window.removeEventListener('nexlabs:chat:message', handler as any); } catch (e) {}
    };
  }, [id]);

  const send = async () => {
    const v = input.trim();
    if (!v) return;
    const tempId = 't' + Math.random().toString(36).slice(2,9);
    // optimistic UI
    setMessages(prev => [...prev, { id: tempId, from: 'me', text: v, pending: true, createdAt: Date.now() }]);
    setInput('');

    const socket = socketRef.current || (window as any).__nexlabs_socket;
    const token = localStorage.getItem('nexlabs_token') || sessionStorage.getItem('nexlabs_token');

    if (socket && socket.connected) {
      try {
        socket.emit('chat:send', { to: id, text: v, tempId }, (ack: any) => {
          if (ack && ack.success && ack.message) {
            const m = ack.message;
            setMessages(prev => prev.map(msg => msg.id === tempId ? { id: m._id || msg.id, from: 'me', text: m.text || msg.text, pending: false, createdAt: m.createdAt || Date.now(), sender: m.sender } : msg));
          } else {
            // mark failed
            setMessages(prev => prev.map(msg => msg.id === tempId ? { ...msg, pending: false, failed: true } : msg));
          }
        });
        return;
      } catch (e) {
        // fallthrough to HTTP
      }
    }

    // fallback: HTTP POST
    try {
      const res = await fetch(buildApiUrl(`/chats/${encodeURIComponent(String(id))}`), { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' }, body: JSON.stringify({ text: v }) });
      const json = await res.json();
      if (json && json.success && json.message) {
        const m = json.message;
        setMessages(prev => prev.map(msg => msg.id === tempId ? { id: m._id || msg.id, from: 'me', text: m.text || msg.text, pending: false, createdAt: m.createdAt || Date.now(), sender: m.sender } : msg));
      } else {
        setMessages(prev => prev.map(msg => msg.id === tempId ? { ...msg, pending: false, failed: true } : msg));
      }
    } catch (e) {
      setMessages(prev => prev.map(msg => msg.id === tempId ? { ...msg, pending: false, failed: true } : msg));
    }
  };

  return (
    <div style={{padding:24}}>
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}>
        <button onClick={() => navigate(-1)} style={{border:0,background:'transparent',cursor:'pointer'}}>←</button>
        <h3 style={{margin:0}}>{profile ? profile.name : 'Chat'}</h3>
      </div>

      <div style={{maxWidth:820,display:'flex',gap:16}}>
        <div style={{flex:1}}>
          <div className={styles.chatWindow} style={{position:'relative',right:'auto',bottom:'auto'}}>
            <div className={styles.chatHeader}>
              {profile ? profile.name : 'Chat'}
            </div>
            <div className={styles.chatMessages}>
              {messages.map(m => (
                <div key={m.id} className={m.from === 'user' ? `${styles.chatMsg} user` : styles.chatMsg}>{m.text}</div>
              ))}
            </div>
            <div className={styles.chatInputRow}>
              <input className={styles.chatInput} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') send(); }} placeholder="Write a message..." />
              <button className={styles.chatSend} onClick={send}>Send</button>
            </div>
          </div>
        </div>

        <aside style={{width:260}}>
          <div style={{background:'#fff',padding:12,borderRadius:8}}>Profile</div>
        </aside>
      </div>
    </div>
  );
}
