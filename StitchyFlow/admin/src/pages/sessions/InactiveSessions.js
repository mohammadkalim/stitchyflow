/**
 * Inactive Sessions - Live Database Page
 * Developer: Muhammad Kalim | LogixInventor (PVT) Ltd.
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Avatar,
  CircularProgress, TextField, InputAdornment, IconButton,
  Tooltip, TablePagination
} from '@mui/material';
import { Search, Refresh, PauseCircle } from '@mui/icons-material';
import Layout from '../../components/Layout';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

export default function InactiveSessions() {
  const [rows, setRows]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [page, setPage]       = useState(0);
  const [rpp, setRpp]         = useState(10);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const qs = search ? `?search=${encodeURIComponent(search)}` : '';
      const res = await fetch(`${API}/sessions/inactive${qs}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setRows(data.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const paginated = rows.slice(page * rpp, page * rpp + rpp);

  return (
    <Layout title="Inactive Sessions">
      <Box>
        <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', mb:3 }}>
          <Box sx={{ display:'flex', alignItems:'center', gap:2 }}>
            <Box sx={{ width:48, height:48, borderRadius:'12px', bgcolor:'#fef9c3', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <PauseCircle sx={{ color:'#d97706', fontSize:26 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight:700, color:'#0f172a' }}>Inactive Sessions</Typography>
              <Typography variant="caption" sx={{ color:'#64748b' }}>Expired or idle sessions — live from database</Typography>
            </Box>
          </Box>
          <Box sx={{ display:'flex', alignItems:'center', gap:1 }}>
            <Chip label={`${rows.length} records`} size="small" sx={{ bgcolor:'#fef9c3', color:'#d97706', fontWeight:700 }} />
            <Tooltip title="Refresh"><IconButton onClick={load} sx={{ bgcolor:'#f8fafc', border:'1px solid #e2e8f0' }}><Refresh sx={{ fontSize:18 }} /></IconButton></Tooltip>
          </Box>
        </Box>

        <TextField size="small" placeholder="Search by user, IP, browser..." value={search}
          onChange={e => { setSearch(e.target.value); setPage(0); }}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize:18, color:'#94a3b8' }} /></InputAdornment> }}
          sx={{ mb:2.5, width:340, '& .MuiOutlinedInput-root': { borderRadius:'10px' } }}
        />

        <Paper elevation={0} sx={{ borderRadius:'14px', border:'1px solid #e2e8f0', overflow:'hidden' }}>
          {loading ? (
            <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center', py:8, gap:2 }}>
              <CircularProgress size={32} sx={{ color:'#d97706' }} />
              <Typography sx={{ color:'#64748b' }}>Loading from database...</Typography>
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow sx={{ '& th': { bgcolor:'#f8fafc', fontWeight:700, fontSize:'0.72rem', color:'#475569', textTransform:'uppercase', letterSpacing:'0.04em', borderBottom:'2px solid #e2e8f0' } }}>
                      <TableCell>#</TableCell><TableCell>User</TableCell><TableCell>IP Address</TableCell>
                      <TableCell>Device</TableCell><TableCell>Browser</TableCell><TableCell>OS</TableCell>
                      <TableCell>Status</TableCell><TableCell>Last Active</TableCell><TableCell>Deactivated</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginated.length === 0 ? (
                      <TableRow><TableCell colSpan={9} align="center" sx={{ py:6, color:'#94a3b8' }}>No inactive sessions found</TableCell></TableRow>
                    ) : paginated.map((row, i) => (
                      <TableRow key={row.session_id} hover sx={{ '&:hover': { bgcolor:'#fffbeb' } }}>
                        <TableCell sx={{ color:'#94a3b8', fontSize:'0.78rem', fontWeight:600 }}>{page * rpp + i + 1}</TableCell>
                        <TableCell>
                          <Box sx={{ display:'flex', alignItems:'center', gap:1.5 }}>
                            <Avatar sx={{ width:32, height:32, fontSize:'0.75rem', fontWeight:700, bgcolor:'#d97706' }}>{(row.user_name || 'U')[0].toUpperCase()}</Avatar>
                            <Box>
                              <Typography sx={{ fontSize:'0.83rem', fontWeight:600, color:'#0f172a' }}>{row.user_name || '—'}</Typography>
                              <Typography sx={{ fontSize:'0.72rem', color:'#94a3b8' }}>{row.user_email || ''}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell><Box sx={{ bgcolor:'#fffbeb', border:'1px solid #fde68a', borderRadius:'6px', px:1, py:0.3, display:'inline-block' }}><Typography sx={{ fontSize:'0.75rem', fontFamily:'monospace', color:'#d97706', fontWeight:600 }}>{row.ip_address || '—'}</Typography></Box></TableCell>
                        <TableCell><Typography sx={{ fontSize:'0.8rem', color:'#475569' }}>{row.device_type === 'desktop' ? '🖥️' : row.device_type === 'mobile' ? '📱' : '📟'} {row.device_type || '—'}</Typography></TableCell>
                        <TableCell><Typography sx={{ fontSize:'0.8rem', color:'#475569' }}>{row.browser || '—'}</Typography></TableCell>
                        <TableCell><Typography sx={{ fontSize:'0.8rem', color:'#475569' }}>{row.os || '—'}</Typography></TableCell>
                        <TableCell><Chip label="inactive" size="small" sx={{ bgcolor:'#fef9c3', color:'#a16207', fontWeight:700, fontSize:'0.68rem', height:22 }} /></TableCell>
                        <TableCell><Typography sx={{ fontSize:'0.78rem', color:'#334155' }}>{row.last_activity ? new Date(row.last_activity).toLocaleString('en-PK') : '—'}</Typography></TableCell>
                        <TableCell><Typography sx={{ fontSize:'0.78rem', color:'#334155' }}>{row.updated_at ? new Date(row.updated_at).toLocaleString('en-PK') : '—'}</Typography></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination component="div" count={rows.length} page={page} onPageChange={(_, p) => setPage(p)} rowsPerPage={rpp} onRowsPerPageChange={e => { setRpp(parseInt(e.target.value)); setPage(0); }} rowsPerPageOptions={[10, 25, 50]} />
            </>
          )}
        </Paper>
      </Box>
    </Layout>
  );
}
