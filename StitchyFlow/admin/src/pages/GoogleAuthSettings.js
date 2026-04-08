import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Paper, Grid, Chip, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Avatar, CircularProgress,
  IconButton, Tooltip, TextField, InputAdornment, TablePagination,
  Divider, Alert, Button,
} from '@mui/material';
import {
  Google as GoogleIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  People as PeopleIcon,
  VerifiedUser as VerifiedIcon,
  Link as LinkIcon,
  ContentCopy as CopyIcon,
  OpenInNew as OpenInNewIcon,
  Security as SecurityIcon,
  Code as CodeIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
} from '@mui/icons-material';
import Layout from '../components/Layout';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'Set in backend .env';
const CLIENT_SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET || 'Set in backend .env';

export default function GoogleAuthSettings() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch]   = useState('');
  const [page, setPage]       = useState(0);
  const [copied, setCopied]   = useState('');

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res   = await fetch(`${API_BASE}/auth/google/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch (_) {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(''), 2000);
    });
  };

  const users    = data?.users || [];
  const filtered = users.filter(u =>
    !search ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    `${u.first_name} ${u.last_name}`.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice(page * 10, page * 10 + 10);

  const statCards = [
    { label: 'Total Users',         value: data?.totalUsers          ?? '—', icon: <PeopleIcon />,          color: '#2563eb', bg: '#eff6ff' },
    { label: 'Google Logins',       value: data?.googleUsers         ?? '—', icon: <GoogleIcon />,          color: '#ea4335', bg: '#fef2f2' },
    { label: 'Active Google Users', value: data?.activeGoogleUsers   ?? '—', icon: <CheckCircleIcon />,     color: '#16a34a', bg: '#f0fdf4' },
    { label: 'Verified Email',      value: data?.verifiedGoogleUsers ?? '—', icon: <VerifiedIcon />,        color: '#7c3aed', bg: '#f5f3ff' },
  ];

  const configRows = [
    { label: 'Client ID',      value: CLIENT_ID,                                              key: 'clientId',     secret: false },
    { label: 'Client Secret',  value: CLIENT_SECRET,                                          key: 'clientSecret', secret: true  },
    { label: 'Callback URL',   value: 'http://localhost:5000/api/v1/auth/google/callback',    key: 'callback',     secret: false },
    { label: 'Frontend URL',   value: 'http://localhost:3000',                                key: 'frontend',     secret: false },
    { label: 'Scope',          value: 'profile, email',                                       key: 'scope',        secret: false },
    { label: 'Strategy',       value: 'passport-google-oauth20',                              key: 'strategy',     secret: false },
    { label: 'Token Type',     value: 'JWT (jsonwebtoken)',                                   key: 'token',        secret: false },
    { label: 'Session',        value: 'false (stateless)',                                    key: 'session',      secret: false },
    { label: 'Status',         value: 'Active',                                               key: 'status',       isChip: true  },
  ];

  const flowSteps = [
    { step: 1, title: 'User clicks "Continue with Google"', desc: 'Frontend redirects to /api/v1/auth/google', color: '#2563eb' },
    { step: 2, title: 'Google OAuth consent screen', desc: 'User grants permission for profile & email', color: '#ea4335' },
    { step: 3, title: 'Google redirects to callback', desc: '/api/v1/auth/google/callback with auth code', color: '#d97706' },
    { step: 4, title: 'Passport verifies & upserts user', desc: 'Auto-register if new, update last_login if existing', color: '#7c3aed' },
    { step: 5, title: 'JWT token issued', desc: 'Token + user data sent to frontend via redirect', color: '#16a34a' },
    { step: 6, title: 'Frontend stores token', desc: 'GoogleAuthSuccess.js saves token → redirects to dashboard', color: '#0891b2' },
  ];

  return (
    <Layout title="Google Login Auth">
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: '14px', bgcolor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #fecaca' }}>
              <GoogleIcon sx={{ color: '#ea4335', fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e' }}>Google Login Auth</Typography>
              <Typography variant="caption" sx={{ color: '#9ca3af' }}>OAuth 2.0 — Client ID & configuration for StitchyFlow</Typography>
            </Box>
          </Box>
          <Tooltip title="Refresh data">
            <IconButton onClick={fetchStats} sx={{ bgcolor: '#f3f4f6', borderRadius: '10px' }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Active banner */}
        <Alert
          icon={<CheckCircleOutlineIcon sx={{ color: '#16a34a' }} />}
          severity="success"
          sx={{ mb: 3, borderRadius: '12px', border: '1px solid #bbf7d0', bgcolor: '#f0fdf4', '& .MuiAlert-message': { width: '100%' } }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
            <Box>
              <Typography sx={{ fontWeight: 700, color: '#15803d', fontSize: '0.9rem' }}>Google OAuth 2.0 is Active</Typography>
              <Typography sx={{ color: '#166534', fontSize: '0.8rem' }}>
                Client ID: <strong>{CLIENT_ID.slice(0, 30)}…</strong> · Strategy: passport-google-oauth20
              </Typography>
            </Box>
            <Button size="small" endIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
              onClick={() => window.open('https://console.cloud.google.com/apis/credentials', '_blank')}
              sx={{ color: '#15803d', textTransform: 'none', fontWeight: 700, fontSize: '0.8rem', border: '1px solid #86efac', borderRadius: '8px', px: 1.5 }}>
              Google Console
            </Button>
          </Box>
        </Alert>

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

        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* OAuth Config */}
          <Grid item xs={12} md={7}>
            <Paper elevation={0} sx={{ borderRadius: '14px', p: 3, border: '1px solid #e5e7eb', height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <LinkIcon sx={{ color: '#2563eb', fontSize: 20 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1a1a2e' }}>OAuth 2.0 Configuration</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                {configRows.map((r) => (
                  <Box key={r.key} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, borderRadius: '10px', bgcolor: '#f9fafb', border: '1px solid #f3f4f6', gap: 1 }}>
                    <Box sx={{ minWidth: 120 }}>
                      <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.05em' }}>
                        {r.label}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      {r.isChip ? (
                        <Chip label={r.value} size="small" sx={{ bgcolor: '#f0fdf4', color: '#16a34a', fontWeight: 700, fontSize: '0.75rem' }} />
                      ) : (
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151', wordBreak: 'break-all', fontSize: '0.78rem', fontFamily: r.secret || r.key === 'clientId' ? 'monospace' : 'inherit' }}>
                          {r.secret ? '••••••••••••••••••••••••' : r.value}
                        </Typography>
                      )}
                    </Box>
                    {!r.isChip && (
                      <Tooltip title={copied === r.key ? 'Copied!' : 'Copy'}>
                        <IconButton size="small" onClick={() => copyToClipboard(r.value, r.key)} sx={{ flexShrink: 0 }}>
                          <CopyIcon sx={{ fontSize: 14, color: copied === r.key ? '#16a34a' : '#9ca3af' }} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>

          {/* Auth Flow */}
          <Grid item xs={12} md={5}>
            <Paper elevation={0} sx={{ borderRadius: '14px', p: 3, border: '1px solid #e5e7eb', height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <SecurityIcon sx={{ color: '#7c3aed', fontSize: 20 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1a1a2e' }}>Auth Flow</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {flowSteps.map((s) => (
                  <Box key={s.step} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
                    <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: 0.1 }}>
                      <Typography sx={{ color: '#fff', fontSize: '0.65rem', fontWeight: 800 }}>{s.step}</Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 700, color: '#1a1a2e', fontSize: '0.8rem' }}>{s.title}</Typography>
                      <Typography sx={{ color: '#9ca3af', fontSize: '0.74rem' }}>{s.desc}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Code snippet */}
        <Paper elevation={0} sx={{ borderRadius: '14px', p: 3, border: '1px solid #e5e7eb', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <CodeIcon sx={{ color: '#374151', fontSize: 20 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1a1a2e' }}>Backend .env Configuration</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ bgcolor: '#0f172a', borderRadius: '10px', p: 2.5, fontFamily: 'monospace', fontSize: '0.82rem', lineHeight: 1.8, position: 'relative' }}>
            <Tooltip title={copied === 'env' ? 'Copied!' : 'Copy'}>
              <IconButton size="small" onClick={() => copyToClipboard(`GOOGLE_CLIENT_ID=${CLIENT_ID}\nGOOGLE_CLIENT_SECRET=${CLIENT_SECRET}\nGOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback`, 'env')}
                sx={{ position: 'absolute', top: 8, right: 8, color: copied === 'env' ? '#4ade80' : '#94a3b8' }}>
                <CopyIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            <Typography component="div" sx={{ fontFamily: 'monospace', fontSize: '0.82rem', lineHeight: 1.8 }}>
              <Box component="span" sx={{ color: '#94a3b8' }}># Google OAuth 2.0{'\n'}</Box>
              <Box component="span" sx={{ color: '#86efac' }}>GOOGLE_CLIENT_ID</Box>
              <Box component="span" sx={{ color: '#fff' }}>=</Box>
              <Box component="span" sx={{ color: '#fbbf24' }}>{CLIENT_ID}</Box>
              <br />
              <Box component="span" sx={{ color: '#86efac' }}>GOOGLE_CLIENT_SECRET</Box>
              <Box component="span" sx={{ color: '#fff' }}>=</Box>
              <Box component="span" sx={{ color: '#fbbf24' }}>{CLIENT_SECRET}</Box>
              <br />
              <Box component="span" sx={{ color: '#86efac' }}>GOOGLE_CALLBACK_URL</Box>
              <Box component="span" sx={{ color: '#fff' }}>=</Box>
              <Box component="span" sx={{ color: '#fbbf24' }}>http://localhost:5000/api/v1/auth/google/callback</Box>
            </Typography>
          </Box>
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
                          <Typography variant="caption" sx={{ color: '#d1d5db' }}>Users who sign in with Google will appear here</Typography>
                        </TableCell>
                      </TableRow>
                    ) : paginated.map((u, i) => (
                      <TableRow key={u.user_id} hover sx={{ '&:hover': { bgcolor: '#fef9f9' } }}>
                        <TableCell sx={{ color: '#9ca3af', fontSize: '0.75rem' }}>{page * 10 + i + 1}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar src={u.profile_image || undefined}
                              sx={{ width: 32, height: 32, bgcolor: '#fef2f2', color: '#ea4335', fontSize: '0.8rem', fontWeight: 700 }}>
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
