/**
 * Developer by: Muhammad Kalim
 * Phone/WhatsApp: +92 333 3836851
 * Product of LogixInventor (PVT) Ltd.
 * Email: info@logixinventor.com
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Paper, Grid, Chip, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Avatar, CircularProgress,
  IconButton, Tooltip, TextField, InputAdornment, TablePagination,
  Divider
} from '@mui/material';
import {
  Google as GoogleIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  People as PeopleIcon,
  VerifiedUser as VerifiedIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import Layout from '../components/Layout';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

export default function GoogleAuthSettings() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch]   = useState('');
  const [page, setPage]       = useState(0);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res   = await fetch(`${API_BASE}/auth/google/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch (_) {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const users    = data?.users || [];
  const filtered = users.filter(u =>
    !search ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    `${u.first_name} ${u.last_name}`.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice(page * 10, page * 10 + 10);

  const statCards = [
    { label: 'Total Users',         value: data?.totalUsers        ?? '—', icon: <PeopleIcon />,   color: '#2563eb', bg: '#eff6ff' },
    { label: 'Google Logins',       value: data?.googleUsers       ?? '—', icon: <GoogleIcon />,   color: '#ea4335', bg: '#fef2f2' },
    { label: 'Active Google Users', value: data?.activeGoogleUsers ?? '—', icon: <CheckCircleIcon />, color: '#16a34a', bg: '#f0fdf4' },
    { label: 'Verified Email',      value: data?.verifiedGoogleUsers ?? '—', icon: <VerifiedIcon />, color: '#7c3aed', bg: '#f5f3ff' },
  ];

  const configItems = [
    { label: 'Client ID',    value: process.env.REACT_APP_GOOGLE_CLIENT_ID || '369585645019-41svf7movteojitvs8fduobpesrtg739.apps.googleusercontent.com' },
    { label: 'Callback URL', value: 'http://localhost:5000/api/v1/auth/google/callback' },
    { label: 'Frontend URL', value: 'http://localhost:3000' },
    { label: 'Scope',        value: 'profile, email' },
    { label: 'Strategy',     value: 'passport-google-oauth20' },
    { label: 'Status',       value: 'Active', isChip: true },
  ];

  return (
    <Layout title="Google Login Auth">
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GoogleIcon sx={{ color: '#ea4335', fontSize: 26 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e' }}>Google Login Auth</Typography>
              <Typography variant="caption" sx={{ color: '#9ca3af' }}>OAuth 2.0 configuration and Google-registered users</Typography>
            </Box>
          </Box>
          <Tooltip title="Refresh data">
            <IconButton onClick={fetchStats} sx={{ bgcolor: '#f3f4f6', borderRadius: '10px' }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {statCards.map((s) => (
            <Grid item xs={6} sm={3} key={s.label}>
              <Paper elevation={0} sx={{ borderRadius: '14px', p: 2.5, border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 44, height: 44, borderRadius: '12px', bgcolor: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, flexShrink: 0 }}>
                  {s.icon}
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</Typography>
                  <Typography variant="caption" sx={{ color: '#9ca3af' }}>{s.label}</Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* OAuth Config Card */}
        <Paper elevation={0} sx={{ borderRadius: '14px', p: 3, border: '1px solid #e5e7eb', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <LinkIcon sx={{ color: '#2563eb', fontSize: 20 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1a1a2e' }}>OAuth 2.0 Configuration</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {configItems.map((f) => (
              <Grid item xs={12} sm={6} key={f.label}>
                <Box sx={{ p: 2, borderRadius: '10px', bgcolor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                  <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.68rem', letterSpacing: '0.05em' }}>
                    {f.label}
                  </Typography>
                  {f.isChip
                    ? <Box sx={{ mt: 0.5 }}><Chip label={f.value} size="small" sx={{ bgcolor: '#f0fdf4', color: '#16a34a', fontWeight: 700, fontSize: '0.75rem' }} /></Box>
                    : <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151', mt: 0.3, wordBreak: 'break-all', fontSize: '0.8rem' }}>{f.value}</Typography>
                  }
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Google Users Table */}
        <Paper elevation={0} sx={{ borderRadius: '14px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <Box sx={{ p: 2.5, borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <GoogleIcon sx={{ color: '#ea4335', fontSize: 20 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1a1a2e' }}>Google Registered Users</Typography>
              <Chip label={filtered.length} size="small" sx={{ bgcolor: '#fef2f2', color: '#ea4335', fontWeight: 700, fontSize: '0.72rem' }} />
            </Box>
            <TextField size="small" placeholder="Search by name or email..."
              value={search} onChange={e => { setSearch(e.target.value); setPage(0); }}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: '#9ca3af' }} /></InputAdornment> }}
              sx={{ width: 260, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress size={32} sx={{ color: '#ea4335' }} /></Box>
          ) : (
            <>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f9fafb' }}>
                      {['#', 'User', 'Email', 'Role', 'Status', 'Verified', 'Last Login', 'Joined'].map(h => (
                        <TableCell key={h} sx={{ fontWeight: 700, color: '#374151', fontSize: '0.78rem', py: 1.5 }}>{h}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginated.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                          <GoogleIcon sx={{ fontSize: 40, color: '#e5e7eb', mb: 1, display: 'block', mx: 'auto' }} />
                          <Typography variant="body2" sx={{ color: '#9ca3af' }}>No Google users found</Typography>
                        </TableCell>
                      </TableRow>
                    ) : paginated.map((u, i) => (
                      <TableRow key={u.user_id} hover sx={{ '&:hover': { bgcolor: '#fef9f9' } }}>
                        <TableCell sx={{ color: '#9ca3af', fontSize: '0.75rem' }}>{page * 10 + i + 1}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar
                              src={u.profile_image || undefined}
                              sx={{ width: 32, height: 32, bgcolor: '#fef2f2', color: '#ea4335', fontSize: '0.8rem', fontWeight: 700 }}
                            >
                              {u.first_name?.[0]?.toUpperCase() || '?'}
                            </Avatar>
                            <Box>
                              <Typography variant="caption" sx={{ fontWeight: 600, color: '#374151', display: 'block' }}>
                                {u.first_name} {u.last_name}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                                <GoogleIcon sx={{ fontSize: 10, color: '#ea4335' }} />
                                <Typography variant="caption" sx={{ fontSize: '0.65rem', color: '#ea4335' }}>Google</Typography>
                              </Box>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.78rem', color: '#6b7280' }}>{u.email}</TableCell>
                        <TableCell>
                          <Chip label={u.role} size="small" sx={{ fontSize: '0.68rem', height: 20, textTransform: 'capitalize',
                            bgcolor: u.role === 'customer' ? '#eff6ff' : '#f0fdf4',
                            color: u.role === 'customer' ? '#2563eb' : '#16a34a', fontWeight: 600 }} />
                        </TableCell>
                        <TableCell>
                          <Chip label={u.status} size="small" sx={{ fontSize: '0.68rem', height: 20,
                            bgcolor: u.status === 'active' ? '#f0fdf4' : '#fef2f2',
                            color: u.status === 'active' ? '#16a34a' : '#dc2626', fontWeight: 700 }} />
                        </TableCell>
                        <TableCell>
                          <Chip label={u.email_verified ? 'Yes' : 'No'} size="small" sx={{ fontSize: '0.68rem', height: 20,
                            bgcolor: u.email_verified ? '#f0fdf4' : '#fff7ed',
                            color: u.email_verified ? '#16a34a' : '#ea580c', fontWeight: 700 }} />
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                          {u.last_login ? new Date(u.last_login).toLocaleDateString('en-PK') : '—'}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                          {u.created_at ? new Date(u.created_at).toLocaleDateString('en-PK') : '—'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination component="div" count={filtered.length} page={page}
                onPageChange={(_, p) => setPage(p)} rowsPerPage={10} rowsPerPageOptions={[10]}
                sx={{ borderTop: '1px solid #f3f4f6' }} />
            </>
          )}
        </Paper>
      </Box>
    </Layout>
  );
}
