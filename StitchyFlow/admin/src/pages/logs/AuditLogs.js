/**
 * Developer by: Muhammad Kalim
 * Phone/WhatsApp: +92 333 3836851
 * Product of LogixInventor (PVT) Ltd.
 * Email: info@logixinventor.com
 * Website: www.logixinventor.com
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, IconButton, TextField, InputAdornment,
  CircularProgress, Tooltip, TablePagination, Avatar
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  GppGood as AuditIcon,
} from '@mui/icons-material';
import Layout from '../../components/Layout';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

const actionColor = {
  create: { bg: '#f0fdf4', color: '#16a34a' },
  update: { bg: '#eff6ff', color: '#2563eb' },
  delete: { bg: '#fef2f2', color: '#dc2626' },
  login:  { bg: '#f5f3ff', color: '#7c3aed' },
  logout: { bg: '#fff7ed', color: '#ea580c' },
};

export default function AuditLogs() {
  const [logs, setLogs]       = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch]   = useState('');
  const [page, setPage]       = useState(0);
  const [rowsPerPage]         = useState(10);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res   = await fetch(`${API_BASE}/logs/audit`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data  = await res.json();
      if (data.success && Array.isArray(data.data)) setLogs(data.data);
    } catch (_) {
      // keep empty
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const filtered = logs.filter(l =>
    !search ||
    l.action?.toLowerCase().includes(search.toLowerCase()) ||
    l.user_name?.toLowerCase().includes(search.toLowerCase()) ||
    l.table_name?.toLowerCase().includes(search.toLowerCase()) ||
    l.description?.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Layout title="Audit Logs">
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed' }}>
              <AuditIcon />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e' }}>Audit Logs</Typography>
              <Typography variant="caption" sx={{ color: '#9ca3af' }}>Track all user actions and system changes</Typography>
            </Box>
          </Box>
          <Tooltip title="Refresh">
            <IconButton onClick={fetchLogs} sx={{ bgcolor: '#f3f4f6', '&:hover': { bgcolor: '#e5e7eb' } }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Search */}
        <TextField
          size="small"
          placeholder="Search audit logs..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(0); }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#9ca3af', fontSize: 18 }} /></InputAdornment> }}
          sx={{ mb: 2, width: 320, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
        />

        {/* Table */}
        <Paper elevation={0} sx={{ borderRadius: '14px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress size={32} />
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f9fafb' }}>
                      {['#', 'User', 'Action', 'Entity / Module', 'Entity ID', 'IP Address', 'Timestamp'].map(h => (
                        <TableCell key={h} sx={{ fontWeight: 700, color: '#374151', fontSize: '0.8rem', py: 1.5 }}>{h}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginated.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 5, color: '#9ca3af' }}>
                          No audit logs found
                        </TableCell>
                      </TableRow>
                    ) : paginated.map((log, i) => {
                      const ac = actionColor[log.action?.toLowerCase()] || { bg: '#f3f4f6', color: '#6b7280' };
                      return (
                        <TableRow key={log.id || i} hover sx={{ '&:hover': { bgcolor: '#f9fafb' } }}>
                          <TableCell sx={{ color: '#9ca3af', fontSize: '0.78rem' }}>{page * rowsPerPage + i + 1}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar sx={{ width: 28, height: 28, bgcolor: '#e0e7ff', color: '#4f46e5', fontSize: '0.75rem', fontWeight: 700 }}>
                                {log.user_name?.[0]?.toUpperCase() || '?'}
                              </Avatar>
                              <Typography variant="caption" sx={{ fontWeight: 600, color: '#374151' }}>
                                {log.user_name || '—'}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip label={log.action || '—'} size="small"
                              sx={{ bgcolor: ac.bg, color: ac.color, fontWeight: 700, fontSize: '0.7rem', height: 22, textTransform: 'capitalize' }} />
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.82rem', color: '#374151' }}>{log.entity_type || log.table_name || '—'}</TableCell>
                          <TableCell sx={{ fontSize: '0.78rem', color: '#6b7280' }}>{log.entity_id || log.record_id || '—'}</TableCell>
                          <TableCell sx={{ fontSize: '0.78rem', color: '#9ca3af' }}>{log.ip_address || '—'}</TableCell>
                          <TableCell sx={{ fontSize: '0.78rem', color: '#9ca3af', whiteSpace: 'nowrap' }}>
                            {log.created_at ? new Date(log.created_at).toLocaleString('en-PK') : '—'}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={filtered.length}
                page={page}
                onPageChange={(_, p) => setPage(p)}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[10]}
                sx={{ borderTop: '1px solid #f3f4f6' }}
              />
            </>
          )}
        </Paper>
      </Box>
    </Layout>
  );
}
