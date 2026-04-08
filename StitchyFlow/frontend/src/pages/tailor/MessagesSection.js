import React, { useState, useRef } from 'react';
import {
  Box, Typography, Paper, Avatar, TextField, IconButton,
  InputAdornment, Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';

const G = '#1b4332';
const GL = '#2d6a4f';

function LockScreen() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 14 }}>
      <Box sx={{ width: 72, height: 72, borderRadius: '50%', bgcolor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
        <LockOutlinedIcon sx={{ fontSize: 36, color: '#94a3b8' }} />
      </Box>
      <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1.1rem', mb: 0.75 }}>Section Locked</Typography>
      <Typography sx={{ color: '#64748b', fontSize: '0.85rem', textAlign: 'center', maxWidth: 340 }}>
        This section is available after your tailor account is approved by an administrator.
      </Typography>
    </Box>
  );
}

export default function MessagesSection({ isApproved, user }) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState({});
  const bottomRef = useRef(null);

  if (!isApproved) return <LockScreen />;

  const conversations = [];

  const handleSend = () => {
    if (!message.trim() || !selected) return;
    const key = selected.id;
    const newMsg = { id: Date.now(), text: message.trim(), from: 'me', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => ({ ...prev, [key]: [...(prev[key] || []), newMsg] }));
    setMessage('');
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  const chatMessages = selected ? (messages[selected.id] || []) : [];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 2.5 }}>
        <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.25rem' }}>Messages</Typography>
        <Typography sx={{ color: '#64748b', fontSize: '0.82rem', mt: 0.3 }}>Chat with your customers</Typography>
      </Box>

      <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', height: 620, display: 'flex' }}>
        {/* Sidebar */}
        <Box sx={{ width: 300, flexShrink: 0, borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', bgcolor: '#fff' }}>
          {/* Search */}
          <Box sx={{ p: 1.5, borderBottom: '1px solid #f1f5f9' }}>
            <TextField placeholder="Search conversations..." value={search} onChange={e => setSearch(e.target.value)} size="small" fullWidth
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 17, color: '#94a3b8' }} /></InputAdornment> }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', bgcolor: '#f8fafc' } }} />
          </Box>

          {/* Conversation list */}
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            {conversations.length === 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', px: 2 }}>
                <ForumOutlinedIcon sx={{ fontSize: 44, color: '#cbd5e1', mb: 1.5 }} />
                <Typography sx={{ fontWeight: 700, color: '#94a3b8', fontSize: '0.88rem', textAlign: 'center' }}>No conversations yet</Typography>
                <Typography sx={{ color: '#cbd5e1', fontSize: '0.75rem', textAlign: 'center', mt: 0.5 }}>
                  Messages from customers will appear here
                </Typography>
              </Box>
            ) : (
              conversations.map((c) => (
                <Box key={c.id} onClick={() => setSelected(c)} sx={{
                  display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.5,
                  cursor: 'pointer', bgcolor: selected?.id === c.id ? '#f0fdf4' : 'transparent',
                  borderLeft: selected?.id === c.id ? `3px solid ${GL}` : '3px solid transparent',
                  '&:hover': { bgcolor: '#f8fafc' },
                }}>
                  <Avatar sx={{ width: 40, height: 40, bgcolor: `${G}18`, color: G, fontWeight: 700, fontSize: '0.95rem' }}>
                    {c.name[0]}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.85rem' }} noWrap>{c.name}</Typography>
                    <Typography sx={{ color: '#94a3b8', fontSize: '0.73rem' }} noWrap>{c.lastMessage}</Typography>
                  </Box>
                  <Typography sx={{ color: '#cbd5e1', fontSize: '0.68rem', flexShrink: 0 }}>{c.time}</Typography>
                </Box>
              ))
            )}
          </Box>
        </Box>

        {/* Chat Area */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#fafbfc' }}>
          {!selected ? (
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <ChatBubbleOutlineIcon sx={{ fontSize: 56, color: '#cbd5e1', mb: 1.5 }} />
              <Typography sx={{ fontWeight: 700, color: '#94a3b8', fontSize: '0.95rem' }}>Select a conversation</Typography>
              <Typography sx={{ color: '#cbd5e1', fontSize: '0.8rem', mt: 0.5 }}>Choose a conversation from the left to start chatting</Typography>
            </Box>
          ) : (
            <>
              {/* Chat Header */}
              <Box sx={{ px: 2.5, py: 1.75, bgcolor: '#fff', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ width: 38, height: 38, bgcolor: `${G}18`, color: G, fontWeight: 700 }}>
                  {selected.name[0]}
                </Avatar>
                <Box>
                  <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>{selected.name}</Typography>
                  <Typography sx={{ color: '#94a3b8', fontSize: '0.72rem' }}>Online</Typography>
                </Box>
              </Box>

              {/* Messages */}
              <Box sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {chatMessages.length === 0 && (
                  <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Typography sx={{ color: '#cbd5e1', fontSize: '0.8rem' }}>No messages yet. Say hello!</Typography>
                  </Box>
                )}
                {chatMessages.map((m) => (
                  <Box key={m.id} sx={{ display: 'flex', justifyContent: m.from === 'me' ? 'flex-end' : 'flex-start' }}>
                    <Box sx={{
                      maxWidth: '70%', px: 2, py: 1.25, borderRadius: m.from === 'me' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      bgcolor: m.from === 'me' ? G : '#fff',
                      border: m.from === 'me' ? 'none' : '1px solid #e2e8f0',
                    }}>
                      <Typography sx={{ color: m.from === 'me' ? '#fff' : '#0f172a', fontSize: '0.85rem', lineHeight: 1.5 }}>{m.text}</Typography>
                      <Typography sx={{ color: m.from === 'me' ? 'rgba(255,255,255,0.6)' : '#94a3b8', fontSize: '0.65rem', mt: 0.5, textAlign: 'right' }}>{m.time}</Typography>
                    </Box>
                  </Box>
                ))}
                <div ref={bottomRef} />
              </Box>

              <Divider />

              {/* Input */}
              <Box sx={{ px: 2, py: 1.5, bgcolor: '#fff', display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton size="small" sx={{ color: '#94a3b8' }}><AttachFileIcon fontSize="small" /></IconButton>
                <IconButton size="small" sx={{ color: '#94a3b8' }}><EmojiEmotionsOutlinedIcon fontSize="small" /></IconButton>
                <TextField
                  placeholder="Type a message..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  size="small"
                  fullWidth
                  multiline
                  maxRows={3}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: '#f8fafc' } }}
                />
                <IconButton onClick={handleSend} disabled={!message.trim()}
                  sx={{ bgcolor: G, color: '#fff', width: 38, height: 38, borderRadius: '12px', '&:hover': { bgcolor: GL }, '&:disabled': { bgcolor: '#e2e8f0', color: '#94a3b8' } }}>
                  <SendIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Box>
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
