/**
 * Session Logs - Live Database Page
 * Developer: Muhammad Kalim | LogixInventor (PVT) Ltd.
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Avatar,
  CircularProgress, TextField, InputAdornment, IconButton,
  Tooltip, TablePagination
} from '@mui/material';
import { Search, Refresh, History } from '@mui/icons-material';
import Layout from '../../components/Layout';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

const ACTION_COLORS = {
  LOGIN:          { bg:'#dcfce7', color:'#15803d' },
  LOGOUT:         { bg:'#fef9c3', color:'#a16207' },
  TERMINATED:     { bg:'#fee2e2', color:'#b91c1c' },
  CREATED:        { bg:'#dbeafe', color:'#1d4ed8' },
  STATUS_CHANGED: { bg:'#ede9fe', color:'#6d28d9' },
};

export default function SessionLogs() {
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
      const res = await fetch(`${API}/sessions/logs${qs}`, {
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
    <Layout title="Session Logs">
      <Box>
        <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', mb:3 }}>
          <Box sx={{ display:'flex', alignItems:'center', gap:2 }}>
            <Box sx={{ width:48, height:48, borderRadius:'12px', bgcolor:'#dbeafe', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <History sx={{ color:'#2563eb', fontSize:26 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight:700, color:'#0f172a' }}>Session Logs</Typography>
              <Typography variant="caption" sx={{ color:'#64748b' }}>Complete audit trail of all session events — live from database</Typography>
            </Box>
          </Box>
          <Box sx={{ display:'flex', alignItems:'center', gap:1 }}>
            <Chip label={`${rows.length} records`} size="small" sx={{ bgcolor:'#dbeafe', color:'#2563eb', fontWeight:700 }} />
            <Tooltip title="Refresh"><IconButton onClick={load} sx={{ bgcolor:'#f8fafc', border:'1px solid #e2e8f0' }}><Refresh sx={{ fontSize:18 }} /></IconButton></Tooltip>
          </Box>
        </Box>

        <TextField size="small" placeholder="Search by action, IP, user, details..." value={search}
          onChange={e => { setSearch(e.target.value); setPage(0); }}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize:18, color:'#94a3b8' }} /></InputAdornment> }}
          sx={{ mb:2.5, width:340, '& .MuiOutlinedInput-root': { borderRadius:'10px' } }}
        />

        <Paper elevation={0} sx={{ borderRadius:'14px', border:'1px solid #e2e8f0', overflow:'hidden' }}>
          {loading ? (
            <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center', py:8, gap:2 }}>
              <CircularProgress size={32} sx={{ color:'#2563eb' }} />
              <Typography sx={{ color:'#64748b' }}>Loading from database...</Typography>
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow sx={{ '& th': { bgcolor:'#f8fafc', fontWeight:700, fontSize:'0.72rem', color:'#475569', textTransform:'uppercase', letterSpacing:'0.04em', borderBottom:'2px solid #e2e8f0' } }}>
                      <TableCell>#</TableCell><TableCell>Log ID</TableCell><TableCell>Session</TableCell>
                      <TableCell>User</TableCell><TableCell>Action</TableCell><TableCell>IP Address</TableCell>
                      <TableCell>Details</TableCell><TableCell>Timestamp</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginated.length === 0 ? (
                      <TableRow><TableCell colSpan={8} align="center" sx={{ py:6, color:'#94a3b8' }}>No session logs found</TableCell></TableRow>
                    ) : paginated.map((row, i) => {
                      const ac = ACTION_COLORS[row.action] || { bg:'#f1f5f9', color:'#475569' };
                      return (
                        <TableRow key={row.log_id} hover sx={{ '&:hover': { bgcolor:'#eff6ff' } }}>
                          <TableCell sx={{ color:'#94a3b8', fontSize:'0.78rem', fontWeight:600 }}>{page * rpp + i + 1}</TableCell>
                          <TableCell><Typography sx={{ fontSize:'0.78rem', fontFamily:'monospace', color:'#64748b', fontWeight:600 }}>#{row.log_id}</Typography></TableCell>
                          <TableCell><Typography sx={{ fontSize:'0.78rem', fontFamily:'monospace', color:'#64748b' }}>{row.session_id ? `#${row.session_id}` : '—'}</Typography></TableCell>
                          <TableCell>
                            <Box sx={{ display:'flex', alignItems:'center', gap:1 }}>
                              <Avatar sx={{ width:28, height:28, fontSize:'0.7rem', fontWeight:700, bgcolor:'#2563eb' }}>{(row.user_name || 'U')[0].toUpperCase()}</Avatar>
                              <Box>
                                <Typography sx={{ fontSize:'0.8rem', fontWeight:600, color:'#0f172a' }}>{row.user_name || '—'}</Typography>
                                <Typography sx={{ fontSize:'0.7rem', color:'#94a3b8' }}>{row.user_email || ''}</Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell><Chip label={row.action?.replace('_',' ')} size="small" sx={{ bgcolor:ac.bg, color:ac.color, fontWeight:700, fontSize:'0.68rem', height:22 }} /></TableCell>
                          <TableCell><Box sx={{ bgcolor:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:'6px', px:1, py:0.3, display:'inline-block' }}><Typography sx={{ fontSize:'0.75rem', fontFamily:'monospace', color:'#2563eb', fontWeight:600 }}>{row.ip_address || '—'}</Typography></Box></TableCell>
                          <TableCell sx={{ maxWidth:220 }}><Typography sx={{ fontSize:'0.78rem', color:'#64748b', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{row.details || '—'}</Typography></TableCell>
                          <TableCell><Typography sx={{ fontSize:'0.78rem', color:'#334155' }}>{row.created_at ? new Date(row.created_at).toLocaleString('en-PK') : '—'}</Typography></TableCell>
                        </TableRow>
                      );
                    })}
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
