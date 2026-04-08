import React, { useState } from 'react';
import {
  Box, Typography, Button, Grid, Paper, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, CircularProgress, Alert,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

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

const EMPTY_FORM = { subject: '', category: '', priority: 'medium', description: '' };

const CONTACT_CARDS = [
  { icon: <EmailOutlinedIcon />, label: 'Email Support', value: 'support@stitchyflow.com', color: '#2563eb', bg: '#eff6ff' },
  { icon: <PhoneOutlinedIcon />, label: 'Phone Support', value: '+92 300 123 4567', color: '#16a34a', bg: '#f0fdf4' },
  { icon: <ChatOutlinedIcon />, label: 'Live Chat', value: 'Available 9AM–6PM', color: '#7c3aed', bg: '#f5f3ff' },
  { icon: <AccessTimeOutlinedIcon />, label: 'Response Time', value: 'Within 24 hours', color: '#d97706', bg: '#fffbeb' },
];

export default function SupportSection({ isApproved }) {
  const [tickets] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isApproved) return <LockScreen />;

  const stats = [
    { label: 'Total', value: tickets.length, color: G },
    { label: 'Open', value: tickets.filter(t => t.status === 'open').length, color: '#2563eb' },
    { label: 'In Progress', value: tickets.filter(t => t.status === 'in_progress').length, color: '#d97706' },
    { label: 'Resolved', value: tickets.filter(t => t.status === 'resolved').length, color: '#16a34a' },
  ];

  const openDialog = () => { setForm(EMPTY_FORM); setError(''); setSuccess(false); setDialogOpen(true); };

  const handleSubmit = async () => {
    if (!form.subject.trim() || !form.description.trim()) {
      setError('Subject and description are required.');
      return;
    }
    setSaving(true);
    setError('');
    await new Promise(r => setTimeout(r, 900));
    setSaving(false);
    setSuccess(true);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.25rem' }}>Support Tickets</Typography>
          <Typography sx={{ color: '#64748b', fontSize: '0.82rem', mt: 0.3 }}>Get help from our support team</Typography>
        </Box>
        <Button onClick={openDialog} variant="contained" startIcon={<AddCircleOutlineIcon />}
          sx={{ bgcolor: G, color: '#fff', fontWeight: 700, borderRadius: '12px', textTransform: 'none', px: 2.5, '&:hover': { bgcolor: GL } }}>
          New Ticket
        </Button>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {stats.map((s) => (
          <Grid item xs={6} sm={3} key={s.label}>
            <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', p: 2.5, bgcolor: '#fff', textAlign: 'center' }}>
              <Typography sx={{ fontWeight: 800, fontSize: '1.8rem', color: s.color }}>{s.value}</Typography>
              <Typography sx={{ color: '#64748b', fontSize: '0.78rem', mt: 0.3 }}>{s.label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Contact Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {CONTACT_CARDS.map((c) => (
          <Grid item xs={12} sm={6} md={3} key={c.label}>
            <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', p: 2.5, bgcolor: '#fff' }}>
              <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
                {React.cloneElement(c.icon, { sx: { color: c.color, fontSize: 22 } })}
              </Box>
              <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.88rem', mb: 0.4 }}>{c.label}</Typography>
              <Typography sx={{ color: '#64748b', fontSize: '0.78rem' }}>{c.value}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Ticket List */}
      {tickets.length === 0 ? (
        <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', p: 6, textAlign: 'center', bgcolor: '#fff' }}>
          <ConfirmationNumberOutlinedIcon sx={{ fontSize: 56, color: '#cbd5e1', mb: 1.5 }} />
          <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem', mb: 0.5 }}>No tickets yet</Typography>
          <Typography sx={{ color: '#94a3b8', fontSize: '0.83rem', mb: 2 }}>Submit a support ticket if you need help.</Typography>
          <Button onClick={openDialog} variant="contained"
            sx={{ bgcolor: G, color: '#fff', fontWeight: 700, borderRadius: '12px', textTransform: 'none', px: 3, '&:hover': { bgcolor: GL } }}>
            New Ticket
          </Button>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {tickets.map((t, i) => (
            <Paper key={i} elevation={0} sx={{ borderRadius: '14px', border: '1px solid #e2e8f0', p: 2, bgcolor: '#fff', display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ConfirmationNumberOutlinedIcon sx={{ fontSize: 20, color: GL }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.88rem' }}>{t.subject}</Typography>
                <Typography sx={{ color: '#64748b', fontSize: '0.75rem' }}>{t.category} · {t.priority}</Typography>
              </Box>
              <Chip label={t.status} size="small" sx={{ bgcolor: '#f0fdf4', color: GL, fontWeight: 700, fontSize: '0.68rem', height: 22 }} />
            </Paper>
          ))}
        </Box>
      )}

      {/* New Ticket Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: '20px' } }}>
        <DialogTitle sx={{ fontWeight: 800, color: '#0f172a', pb: 1 }}>New Support Ticket</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          {success ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                <CheckCircleOutlineIcon sx={{ fontSize: 36, color: '#16a34a' }} />
              </Box>
              <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem', mb: 0.75 }}>Ticket Submitted!</Typography>
              <Typography sx={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.7 }}>
                Your support ticket has been submitted. Our team will respond within 24 hours.
              </Typography>
            </Box>
          ) : (
            <>
              {error && <Alert severity="error" sx={{ mb: 2, borderRadius: '10px' }}>{error}</Alert>}
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField label="Subject *" fullWidth value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField select label="Category" fullWidth value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}>
                    {['Account', 'Orders', 'Payments', 'Technical', 'Other'].map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField select label="Priority" fullWidth value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}>
                    {['low', 'medium', 'high', 'urgent'].map(p => <MenuItem key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</MenuItem>)}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Description *" fullWidth multiline rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Describe your issue in detail..."
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                </Grid>
              </Grid>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ color: '#64748b', fontWeight: 700, textTransform: 'none', borderRadius: '12px' }}>
            {success ? 'Close' : 'Cancel'}
          </Button>
          {!success && (
            <Button onClick={handleSubmit} disabled={saving} variant="contained"
              sx={{ bgcolor: G, color: '#fff', fontWeight: 700, borderRadius: '12px', textTransform: 'none', px: 3, '&:hover': { bgcolor: GL } }}>
              {saving ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : 'Submit Ticket'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
