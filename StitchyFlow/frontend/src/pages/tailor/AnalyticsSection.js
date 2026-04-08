import React, { useState } from 'react';
import {
  Box, Typography, Grid, Paper, Chip, Button,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import RepeatOutlinedIcon from '@mui/icons-material/RepeatOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const G = '#1b4332';
const GL = '#2d6a4f';

const PERIODS = ['7D', '1M', '3M', '6M', '1Y'];

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

function LineChart({ color = GL, height = 140 }) {
  const pts = [30, 45, 38, 60, 52, 75, 68, 85, 72, 90, 80, 95];
  const max = Math.max(...pts);
  const min = Math.min(...pts);
  const w = 100;
  const h = height - 20;
  const norm = pts.map(p => h - ((p - min) / (max - min)) * (h - 10) + 10);
  const d = norm.map((y, i) => `${i === 0 ? 'M' : 'L'}${(i / (pts.length - 1)) * w},${y}`).join(' ');
  const area = `${d} L${w},${h + 10} L0,${h + 10} Z`;
  return (
    <svg width="100%" height={height} viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="lc-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#lc-grad)" />
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BarChart({ color = '#2563eb', height = 140 }) {
  const vals = [40, 65, 50, 80, 60, 90, 70, 85, 55, 75, 88, 95];
  const max = Math.max(...vals);
  const barW = 6;
  const gap = 2;
  const totalW = vals.length * (barW + gap) - gap;
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${totalW} ${height}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      {vals.map((v, i) => {
        const bh = ((v / max) * (height - 20));
        return (
          <rect key={i} x={i * (barW + gap)} y={height - bh - 10} width={barW} height={bh}
            rx="2" fill={color} opacity="0.75" />
        );
      })}
    </svg>
  );
}

function KpiCard({ label, value, sub, icon, color }) {
  return (
    <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', p: 2.5, bgcolor: '#fff' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Box sx={{ width: 40, height: 40, borderRadius: '11px', bgcolor: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {React.cloneElement(icon, { sx: { color, fontSize: 20 } })}
        </Box>
        <Chip label={sub} size="small" sx={{ bgcolor: '#f0fdf4', color: '#16a34a', fontWeight: 700, fontSize: '0.65rem', height: 20 }} />
      </Box>
      <Typography sx={{ fontWeight: 800, fontSize: '1.5rem', color: '#0f172a', lineHeight: 1.2 }}>{value}</Typography>
      <Typography sx={{ color: '#64748b', fontSize: '0.75rem', mt: 0.4 }}>{label}</Typography>
    </Paper>
  );
}

const TOP_SERVICES = [
  { name: 'Shalwar Kameez', orders: 0, revenue: 'Rs 0', pct: 0 },
  { name: 'Suit Stitching', orders: 0, revenue: 'Rs 0', pct: 0 },
  { name: 'Alterations', orders: 0, revenue: 'Rs 0', pct: 0 },
];

const PERF = [
  { label: 'Conversion Rate', value: '0%', color: G },
  { label: 'Avg Order Value', value: 'Rs 0', color: '#2563eb' },
  { label: 'Customer Retention', value: '0%', color: '#7c3aed' },
  { label: 'On-Time Delivery', value: '0%', color: '#d97706' },
];

export default function AnalyticsSection({ isApproved }) {
  const [period, setPeriod] = useState('1M');

  if (!isApproved) return <LockScreen />;

  const kpis = [
    { label: 'Revenue', value: 'Rs 0', sub: '+0%', icon: <TrendingUpIcon />, color: G },
    { label: 'Orders', value: '0', sub: '+0%', icon: <ShoppingBagOutlinedIcon />, color: '#2563eb' },
    { label: 'Profile Views', value: '0', sub: '+0%', icon: <VisibilityOutlinedIcon />, color: '#7c3aed' },
    { label: 'New Customers', value: '0', sub: '+0%', icon: <PersonAddOutlinedIcon />, color: '#d97706' },
    { label: 'Avg Rating', value: '0.0', sub: '0 reviews', icon: <StarBorderIcon />, color: '#f59e0b' },
    { label: 'Repeat Clients', value: '0', sub: '0%', icon: <RepeatOutlinedIcon />, color: '#06b6d4' },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 1.5 }}>
        <Box>
          <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.25rem' }}>Analytics</Typography>
          <Typography sx={{ color: '#64748b', fontSize: '0.82rem', mt: 0.3 }}>Business performance insights</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 0.75, p: 0.5, bgcolor: '#f1f5f9', borderRadius: '12px' }}>
          {PERIODS.map(p => (
            <Button key={p} onClick={() => setPeriod(p)} size="small"
              sx={{
                minWidth: 40, borderRadius: '9px', textTransform: 'none', fontWeight: 700, fontSize: '0.78rem',
                bgcolor: period === p ? '#fff' : 'transparent',
                color: period === p ? G : '#64748b',
                boxShadow: period === p ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                '&:hover': { bgcolor: period === p ? '#fff' : 'rgba(0,0,0,0.04)' },
              }}>
              {p}
            </Button>
          ))}
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {kpis.map((k) => (
          <Grid item xs={6} sm={4} lg={2} key={k.label}>
            <KpiCard {...k} />
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', p: 2.5, bgcolor: '#fff' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>Revenue Trend</Typography>
              <Chip label={period} size="small" sx={{ bgcolor: '#f0fdf4', color: GL, fontWeight: 700, fontSize: '0.72rem', height: 22 }} />
            </Box>
            <LineChart color={GL} height={140} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].slice(0, 6).map(m => (
                <Typography key={m} sx={{ color: '#94a3b8', fontSize: '0.65rem' }}>{m}</Typography>
              ))}
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', p: 2.5, bgcolor: '#fff' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>Orders</Typography>
              <Chip label={period} size="small" sx={{ bgcolor: '#eff6ff', color: '#2563eb', fontWeight: 700, fontSize: '0.72rem', height: 22 }} />
            </Box>
            <BarChart color="#2563eb" height={140} />
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        {/* Top Services */}
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', p: 2.5, bgcolor: '#fff' }}>
            <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem', mb: 2 }}>Top Services</Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1.5, px: 1 }}>
              {['Service', 'Orders', 'Revenue', 'Share'].map(h => (
                <Typography key={h} sx={{ flex: h === 'Service' ? 2 : 1, fontWeight: 700, color: '#94a3b8', fontSize: '0.72rem' }}>{h}</Typography>
              ))}
            </Box>
            {TOP_SERVICES.map((s, i) => (
              <Box key={s.name} sx={{ display: 'flex', gap: 1, px: 1, py: 1.2, borderRadius: '10px', '&:hover': { bgcolor: '#f8fafc' } }}>
                <Box sx={{ flex: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 24, height: 24, borderRadius: '7px', bgcolor: `${G}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 800, color: G }}>{i + 1}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#0f172a' }}>{s.name}</Typography>
                </Box>
                <Typography sx={{ flex: 1, fontSize: '0.82rem', color: '#475569' }}>{s.orders}</Typography>
                <Typography sx={{ flex: 1, fontSize: '0.82rem', color: '#475569' }}>{s.revenue}</Typography>
                <Typography sx={{ flex: 1, fontSize: '0.82rem', color: '#475569' }}>{s.pct}%</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Performance Summary */}
        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', p: 2.5, bgcolor: '#fff' }}>
            <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem', mb: 2 }}>Performance Summary</Typography>
            <Grid container spacing={2}>
              {PERF.map((p) => (
                <Grid item xs={6} key={p.label}>
                  <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                    <Typography sx={{ fontWeight: 800, fontSize: '1.3rem', color: p.color }}>{p.value}</Typography>
                    <Typography sx={{ color: '#64748b', fontSize: '0.72rem', mt: 0.3 }}>{p.label}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
