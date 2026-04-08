/**
 * Deleted Sessions - Live Database Page
 * Developer: Muhammad Kalim | LogixInventor (PVT) Ltd.
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Avatar,
  CircularProgress, TextField, InputAdornment, IconButton,
  Tooltip, TablePagination
} from '@mui/material';
import { Search, Refresh, DeleteForever } from '@mui/icons-material';
import Layout from '../../components/Layout';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

export default function DeletedSessions() {
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
      const res = await fetch(`${API}/sessions/deleted${qs}`, {
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
    <Layout title="Deleted Sessions">
      <Box>
        <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', mb:3 }}>
          <Box sx={{ display:'flex', alignItems:'center', gap:2 }}>
            <Box sx={{ width:48, height:48, borderRadius:'12px', bgcolor:'#fee2e2', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <DeleteForever sx={{ color:'#dc2626', fontSize:26 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight:700, color:'#0f172a' }}>Deleted Sessions</Typography>
              <Typography variant="caption" sx={{ color:'#64748b' }}>Terminated or removed sessions — live from database</Typography>
            </Box>
          </Box>
          <Box sx={{ display:'flex', alignItems:'center', gap:1 }}>
            <Chip label={`${rows.length} records`} size="small" sx={{ bgcolor:'#fee2e2', color:'#dc2626', fontWeight:700 }} />
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
              <CircularProgress size={32} sx={{ color:'#dc2626' }} />
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
                      <TableCell>Location</TableCell><TableCell>Status</TableCell>
                      <TableCell>Last Active</TableCell><TableCell>Deleted At</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginated.length === 0 ? (
                      <TableRow><TableCell colSpan={10} align="center" sx={{ py:6, color:'#94a3b8' }}>No deleted sessions found</TableCell></TableRow>
                    ) : paginated.map((row, i) => (
                      <TableRow key={row.session_id} hover sx={{ '&:hover': { bgcolor:'#fef2f2' } }}>
                        <TableCell sx={{ color:'#94a3b8', fontSize:'0.78rem', fontWeight:600 }}>{page * rpp + i + 1}</TableCell>
                        <TableCell>
                          <Box sx={{ display:'flex', alignItems:'center', gap:1.5 }}>
                            <Avatar sx={{ width:32, height:32, fontSize:'0.75rem', fontWeight:700, bgcolor:'#dc2626' }}>{(row.user_name || 'U')[0].toUpperCase()}</Avatar>
                            <Box>
                              <Typography sx={{ fontSize:'0.83rem', fontWeight:600, color:'#0f172a' }}>{row.user_name || '—'}</Typography>
                              <Typography sx={{ fontSize:'0.72rem', color:'#94a3b8' }}>{row.user_email || ''}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell><Box sx={{ bgcolor:'#fee2e2', border:'1px solid #fecaca', borderRadius:'6px', px:1, py:0.3, display:'inline-block' }}><Typography sx={{ fontSize:'0.75rem', fontFamily:'monospace', color:'#dc2626', fontWeight:600 }}>{row.ip_address || '—'}</Typography></Box></TableCell>
                        <TableCell><Typography sx={{ fontSize:'0.8rem', color:'#475569' }}>{row.device_type === 'desktop' ? '🖥️' : row.device_type === 'mobile' ? '📱' : '📟'} {row.device_type || '—'}</Typography></TableCell>
                        <TableCell><Typography sx={{ fontSize:'0.8rem', color:'#475569' }}>{row.browser || '—'}</Typography></TableCell>
                        <TableCell><Typography sx={{ fontSize:'0.8rem', color:'#475569' }}>{row.os || '—'}</Typography></TableCell>
                        <TableCell><Typography sx={{ fontSize:'0.8rem', color:'#475569' }}>📍 {row.location || '—'}</Typography></TableCell>
                        <TableCell><Chip label="deleted" size="small" sx={{ bgcolor:'#fee2e2', color:'#b91c1c', fontWeight:700, fontSize:'0.68rem', height:22 }} /></TableCell>
                        <TableCell><Typography sx={{ fontSize:'0.78rem', color:'#334155' }}>{row.last_activity ? new Date(row.last_activity).toLocaleString('en-PK') : '—'}</Typography></TableCell>
                        <TableCell><Typography sx={{ fontSize:'0.78rem', color:'#dc2626', fontWeight:600 }}>{row.deleted_at ? new Date(row.deleted_at).toLocaleString('en-PK') : '—'}</Typography></TableCell>
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
