import React, { useState } from 'react';
import {
  Box, Typography, Paper, Grid, Chip, ToggleButton, ToggleButtonGroup,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import StarIcon from '@mui/icons-material/Star';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const FOREST = '#1b4332';

function LineChart({ data, color = '#40916c', height = 120 }) {
  const max = Math.max(...data, 1);
  const w = 400; const h = height;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * (h - 12) - 6}`).join(' ');
  const gid = `alg-${color.replace('#', '')}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill={`url(#${gid})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function BarChart({ data, color = '#2563eb', height = 120, labels }) {
  const max = Math.max(...data, 1);
  const w = 400; const h = height; const gap = 8;
  const bw = (w - gap * (data.length - 1)) / data.length;
  return (
    <svg viewBox={`0 0 ${w} ${h + 18}`} style={{ width: '100%', height: height + 18 }}>
      {data.map((v, i) => {
        const bh = Math.max((v / max) * h, 4);
        return (
          <g key={i}>
            <rect x={i * (bw + gap)} y={h - bh} width={bw} height={bh} rx="4" fill={color} opacity="0.85" />
            {labels && <text x={i * (bw + gap) + bw / 2} y={h + 14} textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily="inherit">{labels[i]}</text>}
          </g>
        );
      })}
    </svg>
  );
}

const PERIODS = ['7D', '1M', '3M', '6M', '1Y'];

export default function AnalyticsSection({ isApproved }) {
  const [period, setPeriod] = useState('1M');

  if (!isApproved) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 10 }}>
        <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <LockOutlinedIcon sx={{ fontSize: 32, color: '#94a3b8' }} />
        </Box>
        <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem', mb: 0.75 }}>Section Locked</Typography>
        <Typography sx={{ color: '#64748b', fontSize: '0.85rem', textAlign: 'center', maxWidth: 360 }}>
          Analytics will be available once your tailor account is approved by the admin.
        </Typography>
      </Box>
    );
  }

  const zeros = [0, 0, 0, 0, 0, 0];
  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const kpis = [
    { label: 'Total Revenue', value: 'Rs 0', icon: <AttachMoneyIcon sx={{ fontSize: 22, color: '#40916c' }} />, color: '#40916c', bg: '#f0fdf4' },
    { label: 'Total Orders', value: '0', icon: <TrendingUpIcon sx={{ fontSize: 22, color: '#2563eb' }} />, color: '#2563eb', bg: '#eff6ff' },
    { label: 'Profile Views', value: '0', icon: <VisibilityIcon sx={{ fontSize: 22, color: '#7c3aed' }} />, color: '#7c3aed', bg: '#f5f3ff' },
    { label: 'New Customers', value: '0', icon: <PeopleOutlineIcon sx={{ fontSize: 22, color: '#0891b2' }} />, color: '#0891b2', bg: '#ecfeff' },
    { label: 'Avg. Rating', value: '0.0', icon: <StarIcon sx={{ fontSize: 22, color: '#f59e0b' }} />, color: '#f59e0b', bg: '#fffbeb' },
    { label: 'Repeat Clients', value: '0%', icon: <PeopleOutlineIcon sx={{ fontSize: 22, color: '#16a34a' }} />, color: '#16a34a', bg: '#f0fdf4' },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.2rem' }}>Analytics</Typography>
          <Typography sx={{ color: '#64748b', fontSize: '0.82rem', mt: 0.25 }}>Track your shop performance over time</Typography>
        </Box>
        <ToggleButtonGroup value={period} exclusive onChange={(_, v) => v && setPeriod(v)} size="small"
          sx={{ '& .MuiToggleButton-root': { textTransform: 'none', fontWeight: 700, fontSize: '0.78rem', px: 1.5, py: 0.5, border: '1px solid #e2e8f0', '&.Mui-selected': { bgcolor: FOREST, color: '#fff', borderColor: FOREST } } }}>
          {PERIODS.map((p) => <ToggleButton key={p} value={p}>{p}</ToggleButton>)}
        </ToggleButtonGroup>
      </Box>

      {/* KPI cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {kpis.map((k) => (
          <Grid item xs={6} sm={4} lg={2} key={k.label}>
            <Paper elevation={0} sx={{ borderRadius: '14px', p: 2, border: '1px solid #e2e8f0', bgcolor: '#fff', textAlign: 'center' }}>
              <Box sx={{ width: 40, height: 40, borderRadius: '11px', bgcolor: k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1 }}>{k.icon}</Box>
              <Typography sx={{ fontWeight: 800, fontSize: '1.3rem', color: k.color }}>{k.value}</Typography>
              <Typography sx={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>{k.label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ borderRadius: '14px', p: 3, border: '1px solid #e8ecf1', bgcolor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box>
                <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.98rem' }}>Revenue Over Time</Typography>
                <Typography sx={{ color: '#94a3b8', fontSize: '0.74rem' }}>PKR — last 6 months</Typography>
              </Box>
              <Chip label={period} size="small" sx={{ bgcolor: '#f1f5f9', color: '#64748b', fontSize: '0.68rem', fontWeight: 700 }} />
            </Box>
            <LineChart data={zeros} color="#40916c" height={130} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              {months.map((m) => <Typography key={m} sx={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>{m}</Typography>)}
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ borderRadius: '14px', p: 3, border: '1px solid #e8ecf1', bgcolor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.98rem', mb: 0.5 }}>Orders by Month</Typography>
            <Typography sx={{ color: '#94a3b8', fontSize: '0.74rem', mb: 2 }}>Monthly order volume</Typography>
            <BarChart data={zeros} color="#2563eb" height={130} labels={months} />
          </Paper>
        </Grid>
      </Grid>

      {/* Top services placeholder */}
      <Paper elevation={0} sx={{ borderRadius: '14px', p: 3, border: '1px solid #e8ecf1', bgcolor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.98rem', mb: 2 }}>Top Services</Typography>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <TrendingUpIcon sx={{ fontSize: 44, color: '#e2e8f0', mb: 1 }} />
          <Typography sx={{ color: '#94a3b8', fontSize: '0.85rem' }}>No service data available yet. Start receiving orders to see insights.</Typography>
        </Box>
      </Paper>
    </Box>
  );
}
