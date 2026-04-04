import React, { useState } from 'react';
import {
  Box, Typography, Paper, Button, Grid, Chip, TextField,
  Dialog, DialogContent, DialogTitle, IconButton, MenuItem,
} from '@mui/material';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const FOREST = '#1b4332';
const FOREST_LIGHT = '#2d6a4f';

const STATUS_COLORS = {
  Open: { bg: '#eff6ff', color: '#2563eb' },
  'In Progress': { bg: '#fffbeb', color: '#d97706' },
  Resolved: { bg: '#f0fdf4', color: '#16a34a' },
  Closed: { bg: '#f1f5f9', color: '#64748b' },
};

const CATEGORIES = ['Order Issue', 'Payment Problem', 'Account Help', 'Technical Bug', 'Other'];

export default function SupportSection({ isApproved }) {
  const [open, setOpen] = useState(false);
  const [tickets] = useState([]);
  const [form, setForm] = useState({ subject: '', category: '', description: '' });

  if (!isApproved) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 10 }}>
        <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <LockOutlinedIcon sx={{ fontSize: 32, color: '#94a3b8' }} />
        </Box>
        <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem', mb: 0.75 }}>Section Locked</Typography>
        <Typography sx={{ color: '#64748b', fontSize: '0.85rem', textAlign: 'center', maxWidth: 360 }}>
          Support Tickets will be available once your tailor account is approved by the admin.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.2rem' }}>Support Tickets</Typography>
          <Typography sx={{ color: '#64748b', fontSize: '0.82rem', mt: 0.25 }}>Get help from the StitchyFlow support team</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={() => setOpen(true)}
          sx={{ bgcolor: FOREST, color: '#fff', textTransform: 'none', fontWeight: 700, borderRadius: '12px', px: 2.5, boxShadow: 'none', '&:hover': { bgcolor: FOREST_LIGHT } }}>
          New Ticket
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Tickets', value: tickets.length, color: '#2563eb' },
          { label: 'Open', value: 0, color: '#2563eb' },
          { label: 'In Progress', value: 0, color: '#d97706' },
          { label: 'Resolved', value: 0, color: '#16a34a' },
        ].map((s) => (
          <Grid item xs={6} sm={3} key={s.label}>
            <Paper elevation={0} sx={{ borderRadius: '14px', p: 2, border: '1px solid #e2e8f0', bgcolor: '#fff', textAlign: 'center' }}>
              <Typography sx={{ fontWeight: 800, fontSize: '1.6rem', color: s.color }}>{s.value}</Typography>
              <Typography sx={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>{s.label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Ticket list */}
      {tickets.length === 0 ? (
        <Paper elevation={0} sx={{ borderRadius: '14px', p: 6, border: '1px solid #e8ecf1', bgcolor: '#fff', textAlign: 'center' }}>
          <SupportAgentOutlinedIcon sx={{ fontSize: 52, color: '#e2e8f0', mb: 1.5 }} />
          <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem', mb: 0.5 }}>No tickets yet</Typography>
          <Typography sx={{ color: '#94a3b8', fontSize: '0.85rem', mb: 2.5 }}>Having an issue? Submit a support ticket and our team will help you.</Typography>
          <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={() => setOpen(true)}
            sx={{ bgcolor: FOREST, color: '#fff', textTransform: 'none', fontWeight: 700, borderRadius: '12px', px: 3, boxShadow: 'none', '&:hover': { bgcolor: FOREST_LIGHT } }}>
            Submit Ticket
          </Button>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {tickets.map((t, i) => (
            <Paper key={i} elevation={0} sx={{ borderRadius: '14px', p: 2.5, border: '1px solid #e8ecf1', bgcolor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 40, height: 40, borderRadius: '11px', bgcolor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <HelpOutlineIcon sx={{ fontSize: 20, color: '#475569' }} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>{t.subject}</Typography>
                  <Typography sx={{ color: '#94a3b8', fontSize: '0.74rem' }}>{t.category} · {t.date}</Typography>
                </Box>
              </Box>
              <Chip label={t.status} size="small" sx={{ bgcolor: STATUS_COLORS[t.status]?.bg, color: STATUS_COLORS[t.status]?.color, fontWeight: 700, fontSize: '0.72rem' }} />
            </Paper>
          ))}
        </Box>
      )}

      {/* New Ticket Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
          <Typography sx={{ fontWeight: 800, fontSize: '1rem' }}>Submit Support Ticket</Typography>
          <IconButton size="small" onClick={() => setOpen(false)}><CloseIcon fontSize="small" /></IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField label="Subject" fullWidth size="small" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            <TextField select label="Category" fullWidth size="small" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>
            <TextField label="Describe your issue" fullWidth size="small" multiline rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <Button variant="contained" fullWidth
              sx={{ bgcolor: FOREST, color: '#fff', textTransform: 'none', fontWeight: 700, borderRadius: '12px', py: 1.2, boxShadow: 'none', '&:hover': { bgcolor: FOREST_LIGHT } }}>
              Submit Ticket
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
