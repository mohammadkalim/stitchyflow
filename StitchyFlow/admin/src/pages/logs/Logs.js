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
  CircularProgress, Tooltip, TablePagination
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  History as LogsIcon,
} from '@mui/icons-material';
import Layout from '../../components/Layout';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

const levelColor = {
  error:   { bg: '#fef2f2', color: '#dc2626' },
  warn:    { bg: '#fff7ed', color: '#ea580c' },
  info:    { bg: '#eff6ff', color: '#2563eb' },
  debug:   { bg: '#f0fdf4', color: '#16a34a' },
};

export default function Logs() {
  const [logs, setLogs]         = useState([]);
  const [loading, setLoading]   = useState(false);
  const [search, setSearch]     = useState('');
  const [page, setPage]         = useState(0);
  const [rowsPerPage]           = useState(10);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res   = await fetch(`${API_BASE}/logs/system`, {
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
    l.message?.toLowerCase().includes(search.toLowerCase()) ||
    l.level?.toLowerCase().includes(search.toLowerCase()) ||
    l.source?.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Layout title="Logs">
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
              <LogsIcon />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e' }}>System Logs</Typography>
              <Typography variant="caption" sx={{ color: '#9ca3af' }}>Monitor application activity and errors</Typography>
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
          placeholder="Search logs..."
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
                      {['#', 'Level', 'Message', 'Source', 'Timestamp'].map(h => (
                        <TableCell key={h} sx={{ fontWeight: 700, color: '#374151', fontSize: '0.8rem', py: 1.5 }}>{h}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginated.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 5, color: '#9ca3af' }}>
                          No logs found
                        </TableCell>
                      </TableRow>
                    ) : paginated.map((log, i) => {
                      const lc = levelColor[log.level?.toLowerCase()] || { bg: '#f3f4f6', color: '#6b7280' };
                      return (
                        <TableRow key={log.id || i} hover sx={{ '&:hover': { bgcolor: '#f9fafb' } }}>
                          <TableCell sx={{ color: '#9ca3af', fontSize: '0.78rem' }}>{page * rowsPerPage + i + 1}</TableCell>
                          <TableCell>
                            <Chip label={log.level || 'info'} size="small"
                              sx={{ bgcolor: lc.bg, color: lc.color, fontWeight: 700, fontSize: '0.7rem', height: 22, textTransform: 'uppercase' }} />
                          </TableCell>
                          <TableCell sx={{ fontSize: '0.82rem', color: '#374151', maxWidth: 400 }}>{log.message || '—'}</TableCell>
                          <TableCell sx={{ fontSize: '0.78rem', color: '#6b7280' }}>{log.source || '—'}</TableCell>
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
