import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Grid, Paper, Chip, Button, CircularProgress, Alert, Tooltip, Skeleton, IconButton,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import RepeatOutlinedIcon from '@mui/icons-material/RepeatOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import { apiFetch } from '../../utils/api';
import { dedupeOrdersByOrderId, buildTailorAnalyticsFromOrders } from '../../utils/tailorAnalyticsFromOrders';

const G = '#1b4332';
const GL = '#2d6a4f';

const PERIODS = [
  { key: '7D', api: '7d' },
  { key: '1M', api: '1m' },
  { key: '3M', api: '3m' },
  { key: '6M', api: '6m' },
  { key: '1Y', api: '1y' },
];

function LockScreen() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 14 }}>
      <Box sx={{ width: 72, height: 72, borderRadius: '50%', bgcolor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
        <LockOutlinedIcon sx={{ fontSize: 36, color: '#94a3b8' }} />
      </Box>
      <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1.1rem', mb: 0.75 }}>Section Locked</Typography>
      <Typography sx={{ color: '#64748b', fontSize: '0.85rem', textAlign: 'center', maxWidth: 340 }}>
        This section is available after your tailor account is approved by an administrator.
      </Typography>
    </Box>
  );
}

function formatRs(n) {
  const x = typeof n === 'number' ? n : parseFloat(n) || 0;
  return `Rs ${Math.round(x).toLocaleString()}`;
}

function DeltaChip({ pct }) {
  const n = typeof pct === 'number' ? pct : 0;
  const up = n >= 0;
  const label = `${up ? '+' : ''}${n}%`;
  return (
    <Chip
      icon={up ? <TrendingUpIcon sx={{ fontSize: '14px !important' }} /> : <TrendingDownIcon sx={{ fontSize: '14px !important' }} />}
      label={label}
      size="small"
      sx={{
        bgcolor: up ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.08)',
        color: up ? '#15803d' : '#b91c1c',
        fontWeight: 700,
        fontSize: '0.65rem',
        height: 22,
        '& .MuiChip-icon': { color: 'inherit' },
      }}
    />
  );
}

function LineChartLive({ points, color = GL, height = 160 }) {
  const vals = points.map((p) => Number(p.value) || 0);
  const max = Math.max(...vals, 1);
  const min = Math.min(...vals, 0);
  const range = max - min || 1;
  const w = 100;
  const h = height - 28;
  const norm = vals.map((p) => h - ((p - min) / range) * (h - 14) + 8);
  if (vals.length < 2) {
    const y = h / 2;
    const d = `M0,${y} L${w},${y}`;
    return (
      <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" style={{ display: 'block' }}>
        <path d={d} fill="none" stroke={color} strokeWidth="1.2" strokeDasharray="4 3" opacity="0.5" strokeLinecap="round" />
      </svg>
    );
  }
  const d = norm.map((y, i) => `${i === 0 ? 'M' : 'L'}${(i / (norm.length - 1)) * w},${y}`).join(' ');
  const area = `${d} L${w},${h + 12} L0,${h + 12} Z`;
  const gradId = `lc-${color.replace(/#/g, '')}`;
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BarChartLive({ points, color = '#2563eb', height = 160 }) {
  const vals = points.map((p) => Number(p.value) || 0);
  const max = Math.max(...vals, 1);
  const n = vals.length || 1;
  const pad = 1.5;
  const slot = (100 - 2 * pad) / n;
  const barW = Math.max(2.2, slot * 0.7);
  return (
    <svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      {vals.map((v, i) => {
        const bh = (v / max) * (height - 28);
        const x = pad + i * slot + (slot - barW) / 2;
        return (
          <rect
            key={i}
            x={x}
            y={height - bh - 12}
            width={barW}
            height={Math.max(bh, 0)}
            rx="1.5"
            fill={color}
            opacity="0.82"
          />
        );
      })}
    </svg>
  );
}

function KpiCard({ label, value, delta, deltaNeutral, icon, color, tooltip }) {
  const inner = (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '16px',
        border: '1px solid #e8ecf1',
        p: 2.5,
        bgcolor: '#fff',
        boxShadow: '0 1px 3px rgba(15,23,42,0.04)',
        height: '100%',
        transition: 'box-shadow 0.2s, border-color 0.2s',
        '&:hover': { boxShadow: '0 8px 24px rgba(15,23,42,0.06)', borderColor: '#dce3eb' },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Box sx={{ width: 42, height: 42, borderRadius: '12px', bgcolor: `${color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {React.cloneElement(icon, { sx: { color, fontSize: 22 } })}
        </Box>
        {deltaNeutral != null && deltaNeutral !== '' ? (
          <Chip label={deltaNeutral} size="small" sx={{ bgcolor: '#f1f5f9', color: '#64748b', fontWeight: 700, fontSize: '0.65rem', height: 22 }} />
        ) : (
          <DeltaChip pct={typeof delta === 'number' ? delta : 0} />
        )}
      </Box>
      <Typography sx={{ fontWeight: 800, fontSize: '1.45rem', color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.15 }}>{value}</Typography>
      <Typography sx={{ color: '#64748b', fontSize: '0.78rem', mt: 0.5, fontWeight: 500 }}>{label}</Typography>
    </Paper>
  );
  if (tooltip) {
    return (
      <Tooltip title={tooltip} arrow placement="top">
        <Box sx={{ height: '100%' }}>{inner}</Box>
      </Tooltip>
    );
  }
  return inner;
}

const emptySeries = (n = 10) => Array.from({ length: n }, (_, i) => ({ label: `${i + 1}`, value: 0 }));

export default function AnalyticsSection({ isApproved }) {
  const [periodUi, setPeriodUi] = useState('1M');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [payload, setPayload] = useState(null);

  const apiPeriod = PERIODS.find((p) => p.key === periodUi)?.api || '1m';

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch('/orders');
      const raw = Array.isArray(res?.data) ? res.data : [];
      const orders = dedupeOrdersByOrderId(raw);
      const tr = orders.map((o) => o.tailor_rating).find((x) => x != null && x !== '');
      const reviewMeta = {
        avgRating: tr != null ? parseFloat(tr) : 0,
        reviewCount: 0,
      };
      setPayload(buildTailorAnalyticsFromOrders(orders, apiPeriod, reviewMeta));
    } catch (e) {
      setError(e.message || 'Failed to load analytics');
      setPayload(null);
    } finally {
      setLoading(false);
    }
  }, [apiPeriod]);

  useEffect(() => {
    if (isApproved) load();
  }, [isApproved, load]);

  if (!isApproved) return <LockScreen />;

  const k = payload?.kpis;
  const revenueSeries = Array.isArray(payload?.revenueSeries) && payload.revenueSeries.length ? payload.revenueSeries : emptySeries();
  const ordersSeries = Array.isArray(payload?.ordersSeries) && payload.ordersSeries.length ? payload.ordersSeries : emptySeries();
  const topServices = Array.isArray(payload?.topServices) ? payload.topServices : [];
  const perf = payload?.performance || {};

  const kpis = k
    ? [
        { label: 'Revenue', value: formatRs(k.revenue), delta: k.revenueDeltaPct, icon: <TrendingUpIcon />, color: G },
        { label: 'Orders', value: String(k.orders), delta: k.ordersDeltaPct, icon: <ShoppingBagOutlinedIcon />, color: '#2563eb' },
        {
          label: 'Active clients',
          value: String(k.profileViews),
          delta: k.profileViewsDeltaPct,
          icon: <VisibilityOutlinedIcon />,
          color: '#7c3aed',
          tooltip: 'Distinct customers with at least one non-cancelled order in this period.',
        },
        { label: 'New customers', value: String(k.newCustomers), delta: k.newCustomersDeltaPct, icon: <PersonAddOutlinedIcon />, color: '#d97706' },
        {
          label: 'Avg rating',
          value: (Number(k.avgRating) || 0).toFixed(1),
          delta: undefined,
          deltaNeutral: (k.reviewCount ?? 0) > 0 ? `${k.reviewCount} reviews` : 'From profile',
          icon: <StarBorderIcon />,
          color: '#f59e0b',
        },
        {
          label: 'Repeat clients',
          value: String(k.repeatClients),
          delta: k.repeatDeltaPct,
          icon: <RepeatOutlinedIcon />,
          color: '#0891b2',
          tooltip:
            (k.repeatSharePct ?? 0) > 0
              ? `${k.repeatSharePct}% of active clients placed more than one order this period.`
              : 'Customers with two or more orders in this period.',
        },
      ]
    : [];

  const perfCards = [
    { label: 'Order completion', value: `${perf.completionRate ?? 0}%`, color: G, hint: 'Completed vs active orders' },
    { label: 'Avg order value', value: formatRs(perf.avgOrderValue ?? 0), color: '#2563eb', hint: 'Revenue ÷ orders' },
    { label: 'Client retention', value: `${perf.retentionRate ?? 0}%`, color: '#7c3aed', hint: 'Repeat buyers ÷ unique clients' },
    { label: 'On-time delivery', value: `${perf.onTimeRate ?? 0}%`, color: '#d97706', hint: 'Among completed orders with dates' },
  ];

  const xLabels = revenueSeries.map((p) => p.label);
  const labelStep = Math.max(1, Math.ceil(xLabels.length / 6));

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 1.5 }}>
        <Box>
          <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.35rem', letterSpacing: '-0.02em' }}>Analytics</Typography>
          <Typography sx={{ color: '#64748b', fontSize: '0.88rem', mt: 0.4, maxWidth: 520 }}>
            Business performance from your live orders, payments, and reviews — compared to the prior period.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ display: 'flex', gap: 0.5, p: 0.5, bgcolor: '#eef2f6', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            {PERIODS.map((p) => (
              <Button
                key={p.key}
                onClick={() => setPeriodUi(p.key)}
                size="small"
                sx={{
                  minWidth: 44,
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  py: 0.65,
                  bgcolor: periodUi === p.key ? '#fff' : 'transparent',
                  color: periodUi === p.key ? G : '#64748b',
                  boxShadow: periodUi === p.key ? '0 2px 8px rgba(15,23,42,0.08)' : 'none',
                  '&:hover': { bgcolor: periodUi === p.key ? '#fff' : 'rgba(255,255,255,0.6)' },
                }}
              >
                {p.key}
              </Button>
            ))}
          </Box>
          <IconButton
            onClick={load}
            disabled={loading}
            size="small"
            sx={{ border: '1px solid #e2e8f0', borderRadius: '12px', color: '#64748b', bgcolor: '#fff' }}
          >
            {loading ? <CircularProgress size={18} /> : <RefreshIcon fontSize="small" />}
          </IconButton>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {loading && !payload ? (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid item xs={6} sm={4} lg={2} key={i}>
              <Skeleton variant="rounded" height={120} sx={{ borderRadius: '16px' }} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {kpis.map((item) => (
            <Grid item xs={6} sm={4} lg={2} key={item.label}>
              <KpiCard
                label={item.label}
                value={item.value}
                delta={item.delta}
                deltaNeutral={item.deltaNeutral}
                icon={item.icon}
                color={item.color}
                tooltip={item.tooltip}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} md={7}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: '18px',
              border: '1px solid #e8ecf1',
              p: 2.75,
              bgcolor: '#fff',
              boxShadow: '0 1px 3px rgba(15,23,42,0.04)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem' }}>Revenue trend</Typography>
              <Chip label={periodUi} size="small" sx={{ bgcolor: 'rgba(45,106,79,0.1)', color: GL, fontWeight: 700, fontSize: '0.72rem', height: 24 }} />
            </Box>
            {loading && !payload ? <Skeleton variant="rounded" height={160} /> : <LineChartLive points={revenueSeries} color={GL} height={168} />}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1.25, px: 0.25 }}>
              {xLabels.map((m, i) => (
                <Typography
                  key={`${m}-${i}`}
                  sx={{ color: '#94a3b8', fontSize: '0.62rem', fontWeight: 500, flex: 1, textAlign: 'center', opacity: i % labelStep === 0 ? 1 : 0 }}
                >
                  {i % labelStep === 0 ? m : ''}
                </Typography>
              ))}
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={5}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: '18px',
              border: '1px solid #e8ecf1',
              p: 2.75,
              bgcolor: '#fff',
              boxShadow: '0 1px 3px rgba(15,23,42,0.04)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem' }}>Orders</Typography>
              <Chip label={periodUi} size="small" sx={{ bgcolor: '#eff6ff', color: '#2563eb', fontWeight: 700, fontSize: '0.72rem', height: 24 }} />
            </Box>
            {loading && !payload ? <Skeleton variant="rounded" height={160} /> : <BarChartLive points={ordersSeries} color="#2563eb" height={168} />}
            <Typography sx={{ color: '#94a3b8', fontSize: '0.72rem', mt: 1.25 }}>Volume by segment of the selected period</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={7}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: '18px',
              border: '1px solid #e8ecf1',
              p: 2.75,
              bgcolor: '#fff',
              boxShadow: '0 1px 3px rgba(15,23,42,0.04)',
            }}
          >
            <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem', mb: 2 }}>Top services</Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1.5, px: 1 }}>
              {['Service', 'Orders', 'Revenue', 'Share'].map((h) => (
                <Typography key={h} sx={{ flex: h === 'Service' ? 2 : 1, fontWeight: 700, color: '#94a3b8', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {h}
                </Typography>
              ))}
            </Box>
            {topServices.length === 0 ? (
              <Typography sx={{ color: '#94a3b8', fontSize: '0.85rem', py: 3, textAlign: 'center' }}>No orders in this period yet.</Typography>
            ) : (
              topServices.map((s, i) => (
                <Box
                  key={`${s.name}-${i}`}
                  sx={{
                    display: 'flex',
                    gap: 1,
                    px: 1,
                    py: 1.25,
                    borderRadius: '12px',
                    transition: 'background 0.15s',
                    '&:hover': { bgcolor: '#f8fafc' },
                  }}
                >
                  <Box sx={{ flex: 2, display: 'flex', alignItems: 'center', gap: 1.1 }}>
                    <Box sx={{ width: 28, height: 28, borderRadius: '9px', bgcolor: `${G}16`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: G }}>{i + 1}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>{s.name}</Typography>
                  </Box>
                  <Typography sx={{ flex: 1, fontSize: '0.86rem', color: '#475569', fontWeight: 500 }}>{s.orders}</Typography>
                  <Typography sx={{ flex: 1, fontSize: '0.86rem', color: '#475569', fontWeight: 500 }}>{formatRs(s.revenue)}</Typography>
                  <Typography sx={{ flex: 1, fontSize: '0.86rem', color: '#475569', fontWeight: 600 }}>{s.sharePct}%</Typography>
                </Box>
              ))
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: '18px',
              border: '1px solid #e8ecf1',
              p: 2.75,
              bgcolor: '#fff',
              boxShadow: '0 1px 3px rgba(15,23,42,0.04)',
            }}
          >
            <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1rem', mb: 2 }}>Performance summary</Typography>
            <Grid container spacing={2}>
              {perfCards.map((p) => (
                <Grid item xs={6} key={p.label}>
                  <Tooltip title={p.hint} arrow>
                    <Box
                      sx={{
                        p: 1.75,
                        borderRadius: '14px',
                        bgcolor: '#f8fafc',
                        border: '1px solid #eef2f6',
                        cursor: 'default',
                        transition: 'border-color 0.15s',
                        '&:hover': { borderColor: '#dce3eb' },
                      }}
                    >
                      <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', color: p.color, letterSpacing: '-0.02em' }}>{p.value}</Typography>
                      <Typography sx={{ color: '#64748b', fontSize: '0.74rem', mt: 0.35, fontWeight: 500 }}>{p.label}</Typography>
                    </Box>
                  </Tooltip>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
