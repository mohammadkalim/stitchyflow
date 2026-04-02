/**
 * Developer by: Muhammad Kalim
 * Product of LogixInventor (PVT) Ltd.
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Paper, Grid, Chip, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Avatar, CircularProgress,
  IconButton, Tooltip, TextField, InputAdornment, TablePagination
} from '@mui/material';
import { Google as GoogleIcon, Refresh as RefreshIcon, Search as SearchIcon } from '@mui/icons-material';
import Layout from '../components/Layout';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

export default function GoogleAuthSettings() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch]   = useState('');
  const [page, setPage]       = useState(0);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res   = await fetch(`${API_BASE}/users`, { headers: { Authorization: `Bearer ${token}` } });
      const data  = await res.json();
      if (data.success) {
        const list = Array.isArray(data.data) ? data.data : (data.data?.users || []);
        // Show only google-registered users (no password hash)
        setUsers(list);
      }
    } catch (_) {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const filtered = users.filter(u =>
    !search ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.first_name?.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice(page * 10, page * 10 + 10);

  const stats = [
    { label: 'Total Users',    value: users.length,                                          color: '#2563eb', bg: '#eff6ff' },
    { label: 'Active',         value: users.filter(u => u.status === 'active').length,        color: '#16a34a', bg: '#f0fdf4' },
    { label: 'Google Logins',  value: users.filter(u => !u.password_hash || u.password_hash === '').length, color: '#ea580c', bg: '#fff7ed' },
    { label: 'Verified Email', value: users.filter(u => u.email_verified).length,             color: '#7c3aed', bg: '#f5f3ff' },
  ];

  return (
    <Layout title="Google Auth">
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GoogleIcon sx={{ color: '#ea4335' }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e' }}>Google Login Auth</Typography>
              <Typography variant="caption" sx={{ color: '#9ca3af' }}>Manage Google OAuth users and settings</Typography>
            </Box>
          </Box>
          <Tooltip title="Refresh"><IconButton onClick={fetchUsers} sx={{ bgcolor: '#f3f4f6' }}><RefreshIcon /></IconButton></Tooltip>
        </Box>

        {/* Config Card */}
        <Paper elevation={0} sx={{ borderRadius: '14px', p: 3, border: '1px solid #e5e7eb', mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 2 }}>OAuth Configuration</Typography>
          <Grid container spacing={2}>
            {[
              { label: 'Client ID',      value: '369585645019-41svf7movteojitvs8fduobpesrtg739.apps.googleusercontent.com' },
              { label: 'Callback URL',   value: 'http://localhost:5000/api/v1/auth/google/callback' },
              { label: 'Frontend URL',   value: 'http://localhost:3000' },
              { label: 'Status',         value: 'Active', isChip: true },
            ].map((f) => (
              <Grid item xs={12} sm={6} key={f.label}>
                <Box sx={{ p: 2, borderRadius: '10px', bgcolor: '#f9fafb', border: '1px solid #f3f4f6' }}>
                  <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.68rem' }}>{f.label}</Typography>
                  {f.isChip
                    ? <Box sx={{ mt: 0.5 }}><Chip label={f.value} size="small" sx={{ bgcolor: '#f0fdf4', color: '#16a34a', fontWeight: 700 }} /></Box>
                    : <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151', mt: 0.3, wordBreak: 'break-all', fontSize: '0.8rem' }}>{f.value}</Typography>
                  }
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Stats */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {stats.map((s) => (
            <Grid item xs={6} sm={3} key={s.label}>
              <Paper elevation={0} sx={{ borderRadius: '14px', p: 2.5, border: '1px solid #e5e7eb', textAlign: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: s.color }}>{s.value}</Typography>
                <Typography variant="caption" sx={{ color: '#9ca3af' }}>{s.label}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Users Table */}
        <Paper elevation={0} sx={{ borderRadius: '14px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1a1a2e' }}>Registered Users</Typography>
            <TextField size="small" placeholder="Search users..."
              value={search} onChange={e => { setSearch(e.target.value); setPage(0); }}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: '#9ca3af' }} /></InputAdornment> }}
              sx={{ width: 240, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }} />
          </Box>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}><CircularProgress size={30} /></Box>
          ) : (
            <>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f9fafb' }}>
                      {['#', 'User', 'Email', 'Role', 'Status', 'Email Verified', 'Joined'].map(h => (
                        <TableCell key={h} sx={{ fontWeight: 700, color: '#374151', fontSize: '0.8rem', py: 1.5 }}>{h}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginated.length === 0 ? (
                      <TableRow><TableCell colSpan={7} align="center" sx={{ py: 5, color: '#9ca3af' }}>No users found</TableCell></TableRow>
                    ) : paginated.map((u, i) => (
                      <TableRow key={u.user_id} hover>
                        <TableCell sx={{ color: '#9ca3af', fontSize: '0.78rem' }}>{page * 10 + i + 1}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 30, height: 30, bgcolor: '#e0e7ff', color: '#4f46e5', fontSize: '0.8rem', fontWeight: 700 }}>
                              {u.first_name?.[0]?.toUpperCase() || '?'}
                            </Avatar>
                            <Typography variant="caption" sx={{ fontWeight: 600, color: '#374151' }}>{u.first_name} {u.last_name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.78rem', color: '#6b7280' }}>{u.email}</TableCell>
                        <TableCell><Chip label={u.role} size="small" sx={{ fontSize: '0.68rem', height: 20, textTransform: 'capitalize' }} /></TableCell>
                        <TableCell>
                          <Chip label={u.status} size="small" sx={{ fontSize: '0.68rem', height: 20,
                            bgcolor: u.status === 'active' ? '#f0fdf4' : '#fef2f2',
                            color:   u.status === 'active' ? '#16a34a' : '#dc2626', fontWeight: 700 }} />
                        </TableCell>
                        <TableCell>
                          <Chip label={u.email_verified ? 'Yes' : 'No'} size="small" sx={{ fontSize: '0.68rem', height: 20,
                            bgcolor: u.email_verified ? '#f0fdf4' : '#fff7ed',
                            color:   u.email_verified ? '#16a34a' : '#ea580c', fontWeight: 700 }} />
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
