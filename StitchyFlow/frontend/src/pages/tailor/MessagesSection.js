import React, { useState } from 'react';
import {
  Box, Typography, Paper, TextField, IconButton, Divider,
  List, ListItem, ListItemAvatar, Avatar, ListItemText, Badge, InputAdornment,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SearchIcon from '@mui/icons-material/Search';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';

const FOREST = '#1b4332';
const NAVY = '#0d1b2a';

const MOCK_CONVERSATIONS = [];

export default function MessagesSection({ isApproved, user }) {
  const [selected, setSelected] = useState(null);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');

  if (!isApproved) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 10 }}>
        <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <LockOutlinedIcon sx={{ fontSize: 32, color: '#94a3b8' }} />
        </Box>
        <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem', mb: 0.75 }}>Section Locked</Typography>
        <Typography sx={{ color: '#64748b', fontSize: '0.85rem', textAlign: 'center', maxWidth: 360 }}>
          Messages will be available once your tailor account is approved by the admin.
        </Typography>
      </Box>
    );
  }

  const filtered = MOCK_CONVERSATIONS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.2rem', mb: 0.5 }}>Messages</Typography>
      <Typography sx={{ color: '#64748b', fontSize: '0.82rem', mb: 3 }}>Chat with your customers</Typography>

      <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e8ecf1', bgcolor: '#fff', overflow: 'hidden', display: 'flex', height: 560 }}>
        {/* Sidebar */}
        <Box sx={{ width: 280, borderRight: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <Box sx={{ p: 1.5 }}>
            <TextField
              fullWidth size="small" placeholder="Search conversations…" value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: '#94a3b8' }} /></InputAdornment> }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', fontSize: '0.82rem' } }}
            />
          </Box>
          <Divider />
          {filtered.length === 0 ? (
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3 }}>
              <MessageOutlinedIcon sx={{ fontSize: 36, color: '#e2e8f0', mb: 1 }} />
              <Typography sx={{ color: '#94a3b8', fontSize: '0.8rem', textAlign: 'center' }}>No conversations yet</Typography>
            </Box>
          ) : (
            <List disablePadding sx={{ flex: 1, overflowY: 'auto' }}>
              {filtered.map((c) => (
                <ListItem key={c.id} button selected={selected?.id === c.id} onClick={() => setSelected(c)}
                  sx={{ px: 1.5, py: 1.25, '&.Mui-selected': { bgcolor: '#f0fdf4' }, '&:hover': { bgcolor: '#f8fafc' } }}>
                  <ListItemAvatar sx={{ minWidth: 44 }}>
                    <Badge badgeContent={c.unread} color="error" overlap="circular">
                      <Avatar sx={{ width: 36, height: 36, bgcolor: NAVY, fontSize: '0.85rem' }}>{c.name[0]}</Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography sx={{ fontWeight: 700, fontSize: '0.84rem', color: '#0f172a' }}>{c.name}</Typography>}
                    secondary={<Typography sx={{ fontSize: '0.74rem', color: '#94a3b8', noWrap: true }}>{c.last}</Typography>}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        {/* Chat area */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {selected ? (
            <>
              <Box sx={{ px: 2.5, py: 1.75, borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ width: 34, height: 34, bgcolor: NAVY, fontSize: '0.82rem' }}>{selected.name[0]}</Avatar>
                <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>{selected.name}</Typography>
              </Box>
              <Box sx={{ flex: 1, p: 2, overflowY: 'auto' }} />
              <Box sx={{ p: 1.5, borderTop: '1px solid #f1f5f9', display: 'flex', gap: 1 }}>
                <TextField fullWidth size="small" placeholder="Type a message…" value={input} onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && setInput('')}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px', fontSize: '0.85rem' } }} />
                <IconButton onClick={() => setInput('')} sx={{ bgcolor: FOREST, color: '#fff', borderRadius: '12px', '&:hover': { bgcolor: '#2d6a4f' } }}>
                  <SendIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Box>
            </>
          ) : (
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <MessageOutlinedIcon sx={{ fontSize: 52, color: '#e2e8f0', mb: 1.5 }} />
              <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem', mb: 0.5 }}>No conversation selected</Typography>
              <Typography sx={{ color: '#94a3b8', fontSize: '0.82rem' }}>Select a conversation from the left to start chatting.</Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
