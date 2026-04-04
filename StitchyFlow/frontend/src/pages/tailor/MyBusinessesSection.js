import React, { useState } from 'react';
import {
  Box, Typography, Paper, Button, Grid, Chip, Divider,
  TextField, Dialog, DialogContent, DialogTitle, IconButton,
} from '@mui/material';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const FOREST = '#1b4332';
const FOREST_LIGHT = '#2d6a4f';

export default function MyBusinessesSection({ isApproved }) {
  const [open, setOpen] = useState(false);
  const [businesses] = useState([]);

  if (!isApproved) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 10 }}>
        <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <LockOutlinedIcon sx={{ fontSize: 32, color: '#94a3b8' }} />
        </Box>
        <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem', mb: 0.75 }}>Section Locked</Typography>
        <Typography sx={{ color: '#64748b', fontSize: '0.85rem', textAlign: 'center', maxWidth: 360 }}>
          My Businesses will be available once your tailor account is approved by the admin.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.2rem' }}>My Businesses</Typography>
          <Typography sx={{ color: '#64748b', fontSize: '0.82rem', mt: 0.25 }}>Manage your registered tailor shops</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={() => setOpen(true)}
          sx={{ bgcolor: FOREST, color: '#fff', textTransform: 'none', fontWeight: 700, borderRadius: '12px', px: 2.5, boxShadow: 'none', '&:hover': { bgcolor: FOREST_LIGHT } }}>
          Add Business
        </Button>
      </Box>

      {/* Stats row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Businesses', value: businesses.length, color: '#2563eb', bg: '#eff6ff' },
          { label: 'Active', value: 0, color: '#16a34a', bg: '#f0fdf4' },
          { label: 'Under Review', value: 0, color: '#d97706', bg: '#fffbeb' },
          { label: 'Suspended', value: 0, color: '#dc2626', bg: '#fef2f2' },
        ].map((s) => (
          <Grid item xs={6} sm={3} key={s.label}>
            <Paper elevation={0} sx={{ borderRadius: '14px', p: 2, border: '1px solid #e2e8f0', bgcolor: '#fff', textAlign: 'center' }}>
              <Typography sx={{ fontWeight: 800, fontSize: '1.6rem', color: s.color }}>{s.value}</Typography>
              <Typography sx={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>{s.label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Business list */}
      {businesses.length === 0 ? (
        <Paper elevation={0} sx={{ borderRadius: '14px', p: 6, border: '1px solid #e8ecf1', bgcolor: '#fff', textAlign: 'center' }}>
          <StorefrontOutlinedIcon sx={{ fontSize: 52, color: '#e2e8f0', mb: 1.5 }} />
          <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem', mb: 0.5 }}>No businesses yet</Typography>
          <Typography sx={{ color: '#94a3b8', fontSize: '0.85rem', mb: 2.5 }}>Register your first tailor shop to start receiving orders.</Typography>
          <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={() => setOpen(true)}
            sx={{ bgcolor: FOREST, color: '#fff', textTransform: 'none', fontWeight: 700, borderRadius: '12px', px: 3, boxShadow: 'none', '&:hover': { bgcolor: FOREST_LIGHT } }}>
            Register Business
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={2.5}>
          {businesses.map((b, i) => (
            <Grid item xs={12} sm={6} lg={4} key={i}>
              <Paper elevation={0} sx={{ borderRadius: '14px', p: 2.5, border: '1px solid #e8ecf1', bgcolor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                    <Box sx={{ width: 42, height: 42, borderRadius: '11px', bgcolor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <StorefrontOutlinedIcon sx={{ fontSize: 22, color: '#475569' }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.92rem' }}>{b.name}</Typography>
                      <Typography sx={{ color: '#94a3b8', fontSize: '0.74rem' }}>{b.type}</Typography>
                    </Box>
                  </Box>
                  <Chip label={b.status || 'Active'} size="small" sx={{ bgcolor: '#f0fdf4', color: '#16a34a', fontWeight: 700, fontSize: '0.68rem' }} />
                </Box>
                <Divider sx={{ my: 1.5 }} />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button size="small" startIcon={<EditOutlinedIcon sx={{ fontSize: 14 }} />}
                    sx={{ color: '#2563eb', textTransform: 'none', fontWeight: 600, fontSize: '0.78rem' }}>Edit</Button>
                  <Button size="small" startIcon={<DeleteOutlineIcon sx={{ fontSize: 14 }} />}
                    sx={{ color: '#dc2626', textTransform: 'none', fontWeight: 600, fontSize: '0.78rem' }}>Delete</Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add Business Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
          <Typography sx={{ fontWeight: 800, fontSize: '1rem' }}>Register New Business</Typography>
          <IconButton size="small" onClick={() => setOpen(false)}><CloseIcon fontSize="small" /></IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField label="Business Name" fullWidth size="small" />
            <TextField label="Business Type" fullWidth size="small" />
            <TextField label="Location / Address" fullWidth size="small" />
            <TextField label="Contact Number" fullWidth size="small" />
            <TextField label="Description" fullWidth size="small" multiline rows={3} />
            <Button variant="contained" fullWidth
              sx={{ bgcolor: FOREST, color: '#fff', textTransform: 'none', fontWeight: 700, borderRadius: '12px', py: 1.2, boxShadow: 'none', '&:hover': { bgcolor: FOREST_LIGHT } }}>
              Submit for Review
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
