/**
 * AI Error Handling System — Premium Corporate UI
 * Developer by: Muhammad Kalim | LogixInventor (PVT) Ltd.
 * Phone/WhatsApp: +92 333 3836851 | info@logixinventor.com
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box, Paper, Typography, Chip, IconButton, Button, Tooltip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogContent, Select, MenuItem, FormControl,
  Alert, Snackbar, LinearProgress, Divider, List,
  ListItem, ListItemIcon, ListItemText, CircularProgress, Avatar
} from '@mui/material';
import {
  BugReport as BugIcon, AutoFixHigh as AIIcon,
  CheckCircle as ResolvedIcon, Delete as DeleteIcon,
  Refresh as RefreshIcon, Visibility as ViewIcon,
  Psychology as BrainIcon, Warning as WarningIcon,
  Error as ErrorIcon, Info as InfoIcon,
  Speed as SpeedIcon, Storage as DBIcon,
  Web as FrontendIcon, Cloud as BackendIcon,
  DeleteSweep as ClearIcon, Close as CloseIcon,
  FiberManualRecord as DotIcon, Shield as ShieldIcon,
  Timeline as TimelineIcon, FlashOn as FlashIcon
} from '@mui/icons-material';
import Layout from '../components/Layout';
import { api } from '../utils/api';

// ── Design tokens ──────────────────────────────────────────────────────────────
const SEVERITY = {
  critical: {
    color: '#EF4444', light: '#FEF2F2', border: '#FECACA',
    gradient: 'linear-gradient(135deg,#EF4444,#DC2626)',
    label: 'Critical', icon: <ErrorIcon sx={{ fontSize: 13 }} />
  },
  high: {
    color: '#F97316', light: '#FFF7ED', border: '#FED7AA',
    gradient: 'linear-gradient(135deg,#F97316,#EA580C)',
    label: 'High', icon: <WarningIcon sx={{ fontSize: 13 }} />
  },
  medium: {
    color: '#EAB308', light: '#FEFCE8', border: '#FEF08A',
    gradient: 'linear-gradient(135deg,#EAB308,#CA8A04)',
    label: 'Medium', icon: <WarningIcon sx={{ fontSize: 13 }} />
  },
  low: {
    color: '#22C55E', light: '#F0FDF4', border: '#BBF7D0',
    gradient: 'linear-gradient(135deg,#22C55E,#16A34A)',
    label: 'Low', icon: <InfoIcon sx={{ fontSize: 13 }} />
  }
};

const SOURCE_CFG = {
  frontend: { icon: <FrontendIcon sx={{ fontSize: 15 }} />, color: '#8B5CF6', bg: '#F5F3FF', label: 'Frontend' },
  backend:  { icon: <BackendIcon  sx={{ fontSize: 15 }} />, color: '#0EA5E9', bg: '#F0F9FF', label: 'Backend'  },
  database: { icon: <DBIcon       sx={{ fontSize: 15 }} />, color: '#F59E0B', bg: '#FFFBEB', label: 'Database' }
};

// ── Stat Card ──────────────────────────────────────────────────────────────────
function StatCard({ label, value, gradient, icon, sub }) {
  return (
    <Box sx={{
      flex: '1 1 150px', minWidth: 140,
      background: gradient,
      borderRadius: '18px',
      p: '1px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.10)'
    }}>
      <Box sx={{
        bgcolor: '#fff', borderRadius: '17px', p: 2.5,
        height: '100%', display: 'flex', flexDirection: 'column', gap: 1
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {label}
          </Typography>
          <Box sx={{
            width: 32, height: 32, borderRadius: '10px',
            background: gradient,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}>
            {React.cloneElement(icon, { sx: { fontSize: 17, color: '#fff' } })}
          </Box>
        </Box>
        <Typography sx={{ fontSize: '2rem', fontWeight: 900, color: '#0F172A', lineHeight: 1 }}>
          {value ?? 0}
        </Typography>
        {sub && <Typography sx={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 500 }}>{sub}</Typography>}
      </Box>
    </Box>
  );
}

// ── Severity Badge ─────────────────────────────────────────────────────────────
function SevBadge({ severity }) {
  const s = SEVERITY[severity] || SEVERITY.medium;
  return (
    <Box sx={{
      display: 'inline-flex', alignItems: 'center', gap: 0.5,
      px: 1.2, py: 0.4, borderRadius: '20px',
      bgcolor: s.light, border: `1px solid ${s.border}`,
      color: s.color, fontWeight: 700, fontSize: '0.7rem'
    }}>
      {s.icon}{s.label}
    </Box>
  );
}

// ── Source Badge ───────────────────────────────────────────────────────────────
function SrcBadge({ source }) {
  const c = SOURCE_CFG[source] || SOURCE_CFG.frontend;
  return (
    <Box sx={{
      display: 'inline-flex', alignItems: 'center', gap: 0.5,
      px: 1.2, py: 0.4, borderRadius: '20px',
      bgcolor: c.bg, color: c.color, fontWeight: 700, fontSize: '0.7rem'
    }}>
      {c.icon}{c.label}
    </Box>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function AIErrorHandling() {
  const [errors, setErrors]           = useState([]);
  const [stats, setStats]             = useState(null);
  const [loading, setLoading]         = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState('');
  const [filterSource, setFilterSource]     = useState('');
  const [filterResolved, setFilterResolved] = useState('false');
  const [selected, setSelected]       = useState(null);
  const [detailOpen, setDetailOpen]   = useState(false);
  const [snackbar, setSnackbar]       = useState({ open: false, msg: '', sev: 'success' });
  const [analyzing, setAnalyzing]     = useState(null);
  const [pulse, setPulse]             = useState(false);
  const intervalRef = useRef(null);

  const toast = (msg, sev = 'success') => setSnackbar({ open: true, msg, sev });

  const fetchAll = useCallback(async () => {
    try {
      const params = {};
      if (filterSeverity) params.severity = filterSeverity;
      if (filterSource)   params.source   = filterSource;
      if (filterResolved) params.resolved  = filterResolved;
      const [errRes, statRes] = await Promise.all([
        api.get('/ai-errors', { params }),
        api.get('/ai-errors/stats')
      ]);
      setErrors(errRes.data.data || []);
      setStats(statRes.data.data || null);
      setPulse(p => !p);
    } catch (_) {}
    finally { setLoading(false); }
  }, [filterSeverity, filterSource, filterResolved]);

  useEffect(() => { setLoading(true); fetchAll(); }, [fetchAll]);

  useEffect(() => {
    if (autoRefresh) intervalRef.current = setInterval(fetchAll, 15000);
    return () => clearInterval(intervalRef.current);
  }, [autoRefresh, fetchAll]);

  const handleResolve = async (id) => {
    try { await api.put(`/ai-errors/${id}/resolve`, { resolved_by: 'Admin' }); toast('Marked as resolved'); fetchAll(); }
    catch (_) { toast('Failed to resolve', 'error'); }
  };

  const handleDelete = async (id) => {
    try { await api.delete(`/ai-errors/${id}`); toast('Deleted'); fetchAll(); if (detailOpen) setDetailOpen(false); }
    catch (_) { toast('Delete failed', 'error'); }
  };

  const handleReanalyze = async (row) => {
    setAnalyzing(row.id);
    try {
      const res = await api.put(`/ai-errors/${row.id}/reanalyze`);
      toast('AI re-analysis complete'); fetchAll();
      if (selected?.id === row.id) setSelected(prev => ({ ...prev, ...res.data.data }));
    } catch (_) { toast('Re-analysis failed', 'error'); }
    finally { setAnalyzing(null); }
  };

  const handleClearResolved = async () => {
    try { const r = await api.delete('/ai-errors/bulk/resolved'); toast(r.data.message); fetchAll(); }
    catch (_) { toast('Clear failed', 'error'); }
  };

  const openDetail = (row) => { setSelected(row); setDetailOpen(true); };

  const sev = stats?.totals || {};
  const criticalCount = sev.critical || 0;

  return (
    <Layout title="AI Error Handling System">

      {/* ── Hero Header ─────────────────────────────────────────────────────── */}
      <Box sx={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%)',
        borderRadius: '24px', p: '2px', mb: 3,
        boxShadow: '0 20px 60px rgba(15,23,42,0.35)'
      }}>
        <Box sx={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%)',
          borderRadius: '22px', p: 3,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2
        }}>
          {/* Left: Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              width: 56, height: 56, borderRadius: '16px',
              background: 'linear-gradient(135deg,#6366F1,#8B5CF6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(99,102,241,0.5)'
            }}>
              <BrainIcon sx={{ color: '#fff', fontSize: 30 }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: '1.35rem', color: '#fff', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                AI Error Handling System
              </Typography>
              <Typography sx={{ fontSize: '0.8rem', color: '#94A3B8', mt: 0.3 }}>
                Real-time error intelligence · Auto-capture · AI-powered analysis
              </Typography>
            </Box>
          </Box>

          {/* Right: Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {/* Live indicator */}
            <Box
              onClick={() => setAutoRefresh(p => !p)}
              sx={{
                display: 'flex', alignItems: 'center', gap: 1,
                px: 2, py: 1, borderRadius: '30px', cursor: 'pointer',
                bgcolor: autoRefresh ? 'rgba(34,197,94,0.15)' : 'rgba(148,163,184,0.1)',
                border: `1px solid ${autoRefresh ? 'rgba(34,197,94,0.4)' : 'rgba(148,163,184,0.2)'}`,
                transition: 'all 0.2s'
              }}
            >
              <Box sx={{
                width: 8, height: 8, borderRadius: '50%',
                bgcolor: autoRefresh ? '#22C55E' : '#64748B',
                boxShadow: autoRefresh ? '0 0 0 3px rgba(34,197,94,0.3)' : 'none',
                animation: autoRefresh ? 'pulse 2s infinite' : 'none',
                '@keyframes pulse': {
                  '0%,100%': { boxShadow: '0 0 0 0 rgba(34,197,94,0.4)' },
                  '50%': { boxShadow: '0 0 0 6px rgba(34,197,94,0)' }
                }
              }} />
              <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: autoRefresh ? '#22C55E' : '#64748B' }}>
                {autoRefresh ? 'LIVE · 15s' : 'PAUSED'}
              </Typography>
            </Box>

            <Tooltip title="Refresh now">
              <IconButton onClick={() => { setLoading(true); fetchAll(); }}
                sx={{ bgcolor: 'rgba(255,255,255,0.08)', color: '#CBD5E1', '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' } }}>
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Button onClick={handleClearResolved} startIcon={<ClearIcon />}
              sx={{
                bgcolor: 'rgba(239,68,68,0.15)', color: '#FCA5A5',
                border: '1px solid rgba(239,68,68,0.3)',
                fontWeight: 700, textTransform: 'none', borderRadius: '10px', fontSize: '0.8rem',
                '&:hover': { bgcolor: 'rgba(239,68,68,0.25)' }
              }}>
              Clear Resolved
            </Button>
          </Box>
        </Box>
      </Box>

      {loading && <LinearProgress sx={{ mb: 2.5, borderRadius: 4, bgcolor: '#E2E8F0', '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg,#6366F1,#8B5CF6)' } }} />}

      {/* ── Critical Alert Banner ────────────────────────────────────────────── */}
      {criticalCount > 0 && (
        <Box sx={{
          mb: 3, p: 2, borderRadius: '14px',
          background: 'linear-gradient(135deg,rgba(239,68,68,0.08),rgba(220,38,38,0.05))',
          border: '1px solid rgba(239,68,68,0.25)',
          display: 'flex', alignItems: 'center', gap: 1.5
        }}>
          <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ShieldIcon sx={{ color: '#fff', fontSize: 20 }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700, color: '#DC2626', fontSize: '0.875rem' }}>
              {criticalCount} Critical Error{criticalCount > 1 ? 's' : ''} Require Immediate Attention
            </Typography>
            <Typography sx={{ fontSize: '0.78rem', color: '#EF4444', opacity: 0.8 }}>
              AI has detected critical issues that may affect system stability. Review and resolve immediately.
            </Typography>
          </Box>
        </Box>
      )}

      {/* ── Stats Grid ──────────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <StatCard label="Total Errors"  value={sev.total}        gradient="linear-gradient(135deg,#6366F1,#8B5CF6)" icon={<BugIcon />}      sub="All time captured" />
        <StatCard label="Critical"      value={sev.critical}     gradient="linear-gradient(135deg,#EF4444,#DC2626)" icon={<ErrorIcon />}    sub="Needs immediate fix" />
        <StatCard label="High Priority" value={sev.high}         gradient="linear-gradient(135deg,#F97316,#EA580C)" icon={<WarningIcon />}  sub="Review soon" />
        <StatCard label="Unresolved"    value={sev.unresolved}   gradient="linear-gradient(135deg,#EAB308,#CA8A04)" icon={<SpeedIcon />}    sub="Pending action" />
        <StatCard label="Resolved"      value={sev.resolved}     gradient="linear-gradient(135deg,#22C55E,#16A34A)" icon={<ResolvedIcon />} sub="Successfully fixed" />
        <StatCard label="AI Auto-Fix"   value={sev.auto_fixable} gradient="linear-gradient(135deg,#0EA5E9,#0284C7)" icon={<AIIcon />}       sub="AI can fix these" />
      </Box>

      {/* ── Filter Bar ──────────────────────────────────────────────────────── */}
      <Paper sx={{
        p: 2, mb: 2.5, borderRadius: '16px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
        display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center'
      }}>
        <Typography sx={{ fontWeight: 700, color: '#475569', fontSize: '0.8rem', mr: 1 }}>FILTER BY</Typography>
        {[
          { label: 'Severity', value: filterSeverity, set: setFilterSeverity,
            opts: [['','All Severities'],['critical','Critical'],['high','High'],['medium','Medium'],['low','Low']] },
          { label: 'Source', value: filterSource, set: setFilterSource,
            opts: [['','All Sources'],['frontend','Frontend'],['backend','Backend'],['database','Database']] },
          { label: 'Status', value: filterResolved, set: setFilterResolved,
            opts: [['','All Status'],['false','Unresolved'],['true','Resolved']] }
        ].map(f => (
          <FormControl key={f.label} size="small" sx={{ minWidth: 160 }}>
            <Select value={f.value} onChange={e => f.set(e.target.value)} displayEmpty
              sx={{ borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600,
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E2E8F0' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#6366F1' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#6366F1' }
              }}>
              {f.opts.map(([v, l]) => <MenuItem key={v} value={v} sx={{ fontSize: '0.85rem', fontWeight: v ? 600 : 400 }}>{l}</MenuItem>)}
            </Select>
          </FormControl>
        ))}
        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#6366F1' }} />
          <Typography sx={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>
            {errors.length} error{errors.length !== 1 ? 's' : ''} found
          </Typography>
        </Box>
      </Paper>

      {/* ── Errors Table ────────────────────────────────────────────────────── */}
      <Paper sx={{ borderRadius: '20px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        {/* Table Header Bar */}
        <Box sx={{
          px: 3, py: 2,
          background: 'linear-gradient(135deg,#0F172A,#1E1B4B)',
          display: 'flex', alignItems: 'center', gap: 1.5
        }}>
          <TimelineIcon sx={{ color: '#818CF8', fontSize: 20 }} />
          <Typography sx={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>Error Intelligence Feed</Typography>
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
            {autoRefresh && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <DotIcon sx={{ fontSize: 10, color: '#22C55E', animation: 'blink 1.5s infinite', '@keyframes blink': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.3 } } }} />
                <Typography sx={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600 }}>AUTO-UPDATING</Typography>
              </Box>
            )}
          </Box>
        </Box>

        <TableContainer sx={{ maxHeight: 500 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {['#', 'Severity', 'Source', 'Category', 'Error Message', 'Hits', 'Last Seen', 'AI Fix', 'Actions'].map(h => (
                  <TableCell key={h} sx={{
                    fontWeight: 800, bgcolor: '#F8FAFC', color: '#475569',
                    fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em',
                    py: 1.5, borderBottom: '2px solid #E2E8F0',
                    whiteSpace: 'nowrap'
                  }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {errors.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={9} sx={{ textAlign: 'center', py: 8 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ width: 72, height: 72, borderRadius: '20px', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.3 }}>
                        <BrainIcon sx={{ fontSize: 38, color: '#fff' }} />
                      </Box>
                      <Typography sx={{ color: '#94A3B8', fontWeight: 600, fontSize: '0.95rem' }}>No errors captured yet</Typography>
                      <Typography sx={{ color: '#CBD5E1', fontSize: '0.8rem' }}>The AI is actively monitoring your system...</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
              {errors.map((row, idx) => {
                const s = SEVERITY[row.severity] || SEVERITY.medium;
                const isCritical = row.severity === 'critical';
                return (
                  <TableRow key={row.id} hover sx={{
                    opacity: row.is_resolved ? 0.5 : 1,
                    bgcolor: isCritical && !row.is_resolved ? 'rgba(239,68,68,0.02)' : 'transparent',
                    borderLeft: isCritical && !row.is_resolved ? '3px solid #EF4444' : '3px solid transparent',
                    transition: 'all 0.15s',
                    '&:hover': { bgcolor: '#F8FAFC', transform: 'translateX(2px)' }
                  }}>
                    <TableCell sx={{ py: 1.5 }}>
                      <Typography sx={{ fontSize: '0.75rem', color: '#CBD5E1', fontWeight: 700, fontFamily: 'monospace' }}>
                        #{row.id}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}><SevBadge severity={row.severity} /></TableCell>
                    <TableCell sx={{ py: 1.5 }}><SrcBadge source={row.source} /></TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', whiteSpace: 'nowrap' }}>
                        {row.category || '—'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1.5, maxWidth: 300 }}>
                      <Typography sx={{ fontSize: '0.8rem', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {row.message}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      <Box sx={{
                        display: 'inline-flex', alignItems: 'center', gap: 0.5,
                        px: 1.2, py: 0.3, borderRadius: '20px',
                        bgcolor: row.occurrence_count > 5 ? '#FEF2F2' : '#F1F5F9',
                        color: row.occurrence_count > 5 ? '#EF4444' : '#64748B',
                        fontWeight: 800, fontSize: '0.75rem'
                      }}>
                        {row.occurrence_count > 5 && <FlashIcon sx={{ fontSize: 11 }} />}
                        {row.occurrence_count}×
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', whiteSpace: 'nowrap' }}>
                        {new Date(row.last_seen_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      {row.auto_fixable
                        ? <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1.2, py: 0.3, borderRadius: '20px', bgcolor: '#EFF6FF', color: '#2563EB', fontWeight: 700, fontSize: '0.7rem', border: '1px solid #BFDBFE' }}>
                            <AIIcon sx={{ fontSize: 11 }} />AI Fix
                          </Box>
                        : <Typography sx={{ fontSize: '0.72rem', color: '#CBD5E1', fontWeight: 600 }}>Manual</Typography>
                      }
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      <Box sx={{ display: 'flex', gap: 0.3 }}>
                        <Tooltip title="View AI Analysis">
                          <IconButton size="small" onClick={() => openDetail(row)}
                            sx={{ width: 28, height: 28, bgcolor: '#EEF2FF', color: '#6366F1', borderRadius: '8px', '&:hover': { bgcolor: '#E0E7FF' } }}>
                            <ViewIcon sx={{ fontSize: 14 }} />
                          </IconButton>
                        </Tooltip>
                        {!row.is_resolved && (
                          <Tooltip title="Mark Resolved">
                            <IconButton size="small" onClick={() => handleResolve(row.id)}
                              sx={{ width: 28, height: 28, bgcolor: '#F0FDF4', color: '#22C55E', borderRadius: '8px', '&:hover': { bgcolor: '#DCFCE7' } }}>
                              <ResolvedIcon sx={{ fontSize: 14 }} />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Re-analyze with AI">
                          <IconButton size="small" onClick={() => handleReanalyze(row)} disabled={analyzing === row.id}
                            sx={{ width: 28, height: 28, bgcolor: '#F0F9FF', color: '#0EA5E9', borderRadius: '8px', '&:hover': { bgcolor: '#E0F2FE' } }}>
                            {analyzing === row.id ? <CircularProgress size={12} /> : <BrainIcon sx={{ fontSize: 14 }} />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" onClick={() => handleDelete(row.id)}
                            sx={{ width: 28, height: 28, bgcolor: '#FEF2F2', color: '#EF4444', borderRadius: '8px', '&:hover': { bgcolor: '#FEE2E2' } }}>
                            <DeleteIcon sx={{ fontSize: 14 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* ── Detail Modal ────────────────────────────────────────────────────── */}
      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="md" fullWidth
        PaperProps={{ sx: { borderRadius: '24px', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.25)' } }}>
        {selected && (() => {
          const s = SEVERITY[selected.severity] || SEVERITY.medium;
          const src = SOURCE_CFG[selected.source] || SOURCE_CFG.frontend;
          return (
            <>
              {/* Modal Header */}
              <Box sx={{
                background: 'linear-gradient(135deg,#0F172A,#1E1B4B)',
                px: 3, py: 2.5,
                display: 'flex', alignItems: 'center', gap: 2
              }}>
                <Box sx={{ width: 46, height: 46, borderRadius: '14px', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(99,102,241,0.5)' }}>
                  <BrainIcon sx={{ color: '#fff', fontSize: 24 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 800, color: '#fff', fontSize: '1.05rem', lineHeight: 1.2 }}>
                    AI Error Analysis
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', mt: 0.2 }}>
                    Error ID #{selected.id} · {selected.category}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <SevBadge severity={selected.severity} />
                  <SrcBadge source={selected.source} />
                  <IconButton onClick={() => setDetailOpen(false)} size="small"
                    sx={{ color: '#64748B', bgcolor: 'rgba(255,255,255,0.08)', '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' } }}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              <DialogContent sx={{ p: 3, bgcolor: '#FAFAFA' }}>
                {/* Error Message Block */}
                <Box sx={{ mb: 3 }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1 }}>
                    Error Message
                  </Typography>
                  <Box sx={{ p: 2.5, bgcolor: '#0F172A', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <Typography sx={{ color: '#F87171', fontFamily: '"Fira Code",monospace', fontSize: '0.85rem', wordBreak: 'break-all', lineHeight: 1.7 }}>
                      {selected.message}
                    </Typography>
                  </Box>
                </Box>

                {/* AI Suggestion */}
                <Box sx={{ mb: 3, p: 2.5, borderRadius: '16px', background: 'linear-gradient(135deg,rgba(99,102,241,0.06),rgba(139,92,246,0.04))', border: '1px solid rgba(99,102,241,0.2)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <Box sx={{ width: 28, height: 28, borderRadius: '8px', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <AIIcon sx={{ color: '#fff', fontSize: 16 }} />
                    </Box>
                    <Typography sx={{ fontWeight: 800, color: '#4338CA', fontSize: '0.875rem' }}>AI Diagnosis & Suggestion</Typography>
                    {selected.auto_fixable && (
                      <Box sx={{ ml: 'auto', display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 1.2, py: 0.3, borderRadius: '20px', bgcolor: '#DBEAFE', color: '#1D4ED8', fontWeight: 700, fontSize: '0.68rem', border: '1px solid #BFDBFE' }}>
                        <FlashIcon sx={{ fontSize: 11 }} />AUTO-FIXABLE
                      </Box>
                    )}
                  </Box>
                  <Typography sx={{ color: '#3730A3', fontSize: '0.875rem', lineHeight: 1.7 }}>
                    {selected.ai_suggestion}
                  </Typography>
                </Box>

                {/* Fix Steps */}
                {selected.fix_steps?.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1.5 }}>
                      Step-by-Step Resolution Guide
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {selected.fix_steps.map((step, i) => (
                        <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, p: 1.5, bgcolor: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                          <Box sx={{ width: 24, height: 24, borderRadius: '8px', background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: 0.1 }}>
                            <Typography sx={{ color: '#fff', fontSize: '0.65rem', fontWeight: 800 }}>{i + 1}</Typography>
                          </Box>
                          <Typography sx={{ fontSize: '0.85rem', color: '#374151', lineHeight: 1.6 }}>{step}</Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}

                <Divider sx={{ my: 2.5 }} />

                {/* Meta Grid */}
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 2 }}>
                  {[
                    ['URL / Page', selected.url],
                    ['IP Address', selected.ip_address],
                    ['HTTP Status', selected.status_code || '—'],
                    ['Occurrences', `${selected.occurrence_count}×`],
                    ['First Captured', new Date(selected.created_at).toLocaleString()],
                    ['Last Seen', new Date(selected.last_seen_at).toLocaleString()],
                    ['Resolution', selected.is_resolved ? `✓ Resolved by ${selected.resolved_by}` : '✗ Unresolved'],
                  ].filter(([, v]) => v).map(([label, val]) => (
                    <Box key={label} sx={{ p: 1.5, bgcolor: '#fff', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                      <Typography sx={{ fontSize: '0.65rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', mb: 0.5 }}>{label}</Typography>
                      <Typography sx={{ fontSize: '0.82rem', color: '#1E293B', fontWeight: 600, wordBreak: 'break-all' }}>{val}</Typography>
                    </Box>
                  ))}
                </Box>

                {/* Stack Trace */}
                {selected.stack_trace && (
                  <Box sx={{ mt: 2.5 }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1 }}>
                      Stack Trace
                    </Typography>
                    <Box sx={{ p: 2, bgcolor: '#0F172A', borderRadius: '14px', maxHeight: 200, overflow: 'auto', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <Typography sx={{ color: '#64748B', fontFamily: '"Fira Code",monospace', fontSize: '0.72rem', whiteSpace: 'pre-wrap', wordBreak: 'break-all', lineHeight: 1.8 }}>
                        {selected.stack_trace}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </DialogContent>

              {/* Modal Footer */}
              <Box sx={{ px: 3, py: 2, bgcolor: '#fff', borderTop: '1px solid #E2E8F0', display: 'flex', gap: 1.5, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <Button onClick={() => handleReanalyze(selected)} startIcon={<BrainIcon />} disabled={analyzing === selected.id}
                  sx={{ textTransform: 'none', fontWeight: 700, color: '#0EA5E9', bgcolor: '#F0F9FF', borderRadius: '10px', px: 2, '&:hover': { bgcolor: '#E0F2FE' } }}>
                  {analyzing === selected.id ? 'Analyzing...' : 'Re-analyze'}
                </Button>
                {!selected.is_resolved && (
                  <Button onClick={() => { handleResolve(selected.id); setDetailOpen(false); }} startIcon={<ResolvedIcon />} variant="contained"
                    sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '10px', px: 2, background: 'linear-gradient(135deg,#22C55E,#16A34A)', boxShadow: '0 4px 12px rgba(34,197,94,0.3)', '&:hover': { background: 'linear-gradient(135deg,#16A34A,#15803D)' } }}>
                    Mark Resolved
                  </Button>
                )}
                <Button onClick={() => handleDelete(selected.id)} startIcon={<DeleteIcon />}
                  sx={{ textTransform: 'none', fontWeight: 700, color: '#EF4444', bgcolor: '#FEF2F2', borderRadius: '10px', px: 2, '&:hover': { bgcolor: '#FEE2E2' } }}>
                  Delete
                </Button>
                <Button onClick={() => setDetailOpen(false)}
                  sx={{ textTransform: 'none', fontWeight: 700, color: '#64748B', bgcolor: '#F1F5F9', borderRadius: '10px', px: 2, '&:hover': { bgcolor: '#E2E8F0' } }}>
                  Close
                </Button>
              </Box>
            </>
          );
        })()}
      </Dialog>

      {/* ── Toast ───────────────────────────────────────────────────────────── */}
      <Snackbar open={snackbar.open} autoHideDuration={3500}
        onClose={() => setSnackbar(p => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snackbar.sev} sx={{ borderRadius: '12px', fontWeight: 600, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
          {snackbar.msg}
        </Alert>
      </Snackbar>

    </Layout>
  );
}
