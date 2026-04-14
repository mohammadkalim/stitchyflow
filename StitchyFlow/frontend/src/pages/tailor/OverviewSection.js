import React, { useState, useEffect, useId } from 'react';
import {
  Box, Typography, Button, Grid, Paper, LinearProgress,
  Chip, CircularProgress, Collapse,
} from '@mui/material';
import AddBusinessOutlinedIcon from '@mui/icons-material/AddBusinessOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import MiscellaneousServicesOutlinedIcon from '@mui/icons-material/MiscellaneousServicesOutlined';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import { apiFetch } from '../../utils/api';

const G = '#1b4332';
const GL = '#2d6a4f';

/** Dark blue — hero “Add Business” / “View Orders” (on emerald strip) */
const HERO_BLUE = '#1e3a8a';
const HERO_BLUE_HOVER = '#172554';
const HERO_BLUE_OUTLINE = 'rgba(147, 197, 253, 0.85)';
const HERO_BLUE_OUTLINE_HOVER = '#bfdbfe';
const HERO_BLUE_GHOST = 'rgba(30, 58, 138, 0.35)';

const DASH = {
  grad: 'linear-gradient(165deg, #075a3d 0%, #06402B 42%, #052a1c 100%)',
  iconBox: 'rgba(52, 211, 153, 0.28)',
};

const MS_DAY = 86400000;

/** API may expose `status` (orders table) or `order_status` (view alias). */
function getOrderStatus(o) {
  return String(o?.status ?? o?.order_status ?? '').toLowerCase();
}

function orderCreatedAt(o) {
  const t = o?.created_at ?? o?.createdAt;
  if (!t) return null;
  const ms = new Date(t).getTime();
  return Number.isNaN(ms) ? null : ms;
}

/** Compare last 7 days vs previous 7 days — count of orders matching predicate. */
function weekOverWeekCount(orders, predicate) {
  const now = Date.now();
  const curStart = now - 7 * MS_DAY;
  const prevStart = now - 14 * MS_DAY;
  let cur = 0;
  let prev = 0;
  for (const o of orders) {
    if (!predicate(o)) continue;
    const tm = orderCreatedAt(o);
    if (tm == null) continue;
    if (tm >= curStart && tm <= now) cur += 1;
    else if (tm >= prevStart && tm < curStart) prev += 1;
  }
  return { cur, prev };
}

function formatWoW(cur, prev) {
  if (cur === 0 && prev === 0) return { text: '—', tone: 'neutral' };
  if (prev === 0 && cur > 0) return { text: 'New', tone: 'up' };
  const pct = Math.round(((cur - prev) / prev) * 100);
  const text = `${pct >= 0 ? '+' : ''}${pct}%`;
  return { text, tone: pct > 0 ? 'up' : pct < 0 ? 'down' : 'neutral' };
}

/** Sum total_amount in each window for completed orders. */
function weekOverWeekRevenue(orders) {
  const now = Date.now();
  const curStart = now - 7 * MS_DAY;
  const prevStart = now - 14 * MS_DAY;
  let cur = 0;
  let prev = 0;
  for (const o of orders) {
    if (getOrderStatus(o) !== 'completed') continue;
    const tm = orderCreatedAt(o);
    if (tm == null) continue;
    const amt = parseFloat(o.total_amount) || 0;
    if (tm >= curStart && tm <= now) cur += amt;
    else if (tm >= prevStart && tm < curStart) prev += amt;
  }
  return { cur, prev };
}

/** One point per day for last `days` days (order counts). */
function dailyOrderBuckets(orders, days = 8) {
  const buckets = Array(days).fill(0);
  const now = Date.now();
  const start = now - days * MS_DAY;
  for (const o of orders) {
    const tm = orderCreatedAt(o);
    if (tm == null || tm < start) continue;
    const idx = Math.min(days - 1, Math.floor((tm - start) / MS_DAY));
    buckets[idx] += 1;
  }
  return buckets;
}

function dailyRevenueBuckets(orders, days = 8) {
  const buckets = Array(days).fill(0);
  const now = Date.now();
  const start = now - days * MS_DAY;
  for (const o of orders) {
    if (getOrderStatus(o) !== 'completed') continue;
    const tm = orderCreatedAt(o);
    if (tm == null || tm < start) continue;
    const idx = Math.min(days - 1, Math.floor((tm - start) / MS_DAY));
    buckets[idx] += parseFloat(o.total_amount) || 0;
  }
  return buckets;
}

const TONE_SX = {
  up: { bgcolor: '#ecfdf5', color: '#15803d', border: '1px solid rgba(22,163,74,0.2)' },
  down: { bgcolor: '#fef2f2', color: '#b91c1c', border: '1px solid rgba(220,38,38,0.18)' },
  neutral: { bgcolor: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0' },
};

function KpiCardWithSpark({ label, value, icon, color, trend, trendTone, sparkSeries }) {
  const uid = useId().replace(/:/g, '');
  const raw = sparkSeries && sparkSeries.length ? sparkSeries : [4, 7, 5, 9, 8, 11, 10, 12];
  const max = Math.max(...raw, 1);
  const min = Math.min(...raw);
  const span = max - min || 1;
  const norm = raw.map((p) => 40 - ((p - min) / span) * 36);
  const d = norm.map((y, i) => `${i === 0 ? 'M' : 'L'}${(i / (raw.length - 1)) * 100},${y}`).join(' ');
  const muted = !sparkSeries || sparkSeries.every((v) => v === 0);
  const stroke = muted ? '#cbd5e1' : color;
  const fillOpacity = muted ? 0.08 : 0.22;
  const sx = TONE_SX[trendTone] || TONE_SX.neutral;

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '16px',
        border: '1px solid #e8edf3',
        p: 2.5,
        bgcolor: '#fff',
        height: '100%',
        boxShadow: '0 1px 2px rgba(15,23,42,0.04), 0 8px 24px rgba(15,23,42,0.06)',
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: '0 4px 12px rgba(15,23,42,0.08), 0 16px 40px rgba(15,23,42,0.07)' },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
        <Box
          sx={{
            width: 46,
            height: 46,
            borderRadius: '13px',
            bgcolor: `${color}14`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid ${color}22`,
          }}
        >
          {React.cloneElement(icon, { sx: { color, fontSize: 22 } })}
        </Box>
        <Chip label={trend} size="small" sx={{ ...sx, fontWeight: 700, fontSize: '0.68rem', height: 24 }} />
      </Box>
      <Typography sx={{ fontWeight: 800, fontSize: '1.65rem', color: '#0f172a', lineHeight: 1.15, mt: 1.25, letterSpacing: '-0.02em' }}>
        {value}
      </Typography>
      <Typography sx={{ color: '#64748b', fontSize: '0.78rem', mt: 0.5, fontWeight: 500 }}>{label}</Typography>
      <Box sx={{ mt: 1.75 }}>
        <svg width="100%" height="44" viewBox="0 0 100 44" preserveAspectRatio="none" style={{ display: 'block' }}>
          <defs>
            <linearGradient id={`kpi-sp-${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity={String(fillOpacity)} />
              <stop offset="100%" stopColor={stroke} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${d} L100,44 L0,44 Z`} fill={`url(#kpi-sp-${uid})`} />
          <path d={d} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Box>
    </Paper>
  );
}

function QuickAction({ icon, label, desc, color, onClick }) {
  return (
    <Paper elevation={0} onClick={onClick} sx={{
      borderRadius: '16px', border: '1px solid #e2e8f0', p: 2.5, bgcolor: '#fff',
      cursor: 'pointer', transition: 'all 0.18s',
      '&:hover': { borderColor: color, boxShadow: `0 4px 20px ${color}22`, transform: 'translateY(-2px)' },
    }}>
      <Box sx={{ width: 48, height: 48, borderRadius: '14px', bgcolor: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
        {React.cloneElement(icon, { sx: { color, fontSize: 24 } })}
      </Box>
      <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>{label}</Typography>
      <Typography sx={{ color: '#64748b', fontSize: '0.75rem', mt: 0.4 }}>{desc}</Typography>
    </Paper>
  );
}

export default function OverviewSection({ user, isApproved, onNavigate, showHeroBanner = false }) {
  const [shops, setShops] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch('/business/shops/enriched').catch(() => ({ data: [] })),
      apiFetch('/orders').catch(() => ({ data: [] })),
    ]).then(([s, o]) => {
      setShops(Array.isArray(s?.data) ? s.data : []);
      setOrders(Array.isArray(o?.data) ? o.data : []);
    }).finally(() => setLoading(false));
  }, []);

  const completedOrders = orders.filter((o) => getOrderStatus(o) === 'completed');
  const totalRevenue = completedOrders.reduce((s, o) => s + (parseFloat(o.total_amount) || 0), 0);

  const orderWoW = weekOverWeekCount(orders, () => true);
  const revWoW = weekOverWeekRevenue(orders);
  const completedWoW = weekOverWeekCount(orders, (o) => getOrderStatus(o) === 'completed');

  const trendOrders = formatWoW(orderWoW.cur, orderWoW.prev);
  const revTrend = formatWoW(revWoW.cur, revWoW.prev);
  const trendCompleted = formatWoW(completedWoW.cur, completedWoW.prev);

  const activeShops = shops.filter((s) => s.shop_status === 'active').length;
  const shopLabel = shops.length === 0 ? '—' : `${activeShops} active`;

  const fulfillmentPct = orders.length > 0
    ? Math.round((completedOrders.length / orders.length) * 100)
    : 0;

  const sparkOrders = dailyOrderBuckets(orders, 8);
  const sparkRev = dailyRevenueBuckets(orders, 8);
  const sparkCompleted = dailyOrderBuckets(
    orders.filter((o) => getOrderStatus(o) === 'completed'),
    8
  );
  const sparkShops = shops.length
    ? Array.from({ length: 8 }, (_, i) => (i < Math.min(8, shops.length) ? 1 + i * 0.15 : 0.5))
    : null;

  const kpis = [
    {
      label: 'Total Revenue',
      value: `Rs ${totalRevenue.toLocaleString()}`,
      icon: <AttachMoneyIcon />,
      color: G,
      trend: revWoW.cur === 0 && revWoW.prev === 0 ? '—' : revTrend.text,
      trendTone: revTrend.tone,
      sparkSeries: sparkRev,
    },
    {
      label: 'Total Orders',
      value: orders.length,
      icon: <ShoppingBagOutlinedIcon />,
      color: '#2563eb',
      trend: trendOrders.text,
      trendTone: trendOrders.tone,
      sparkSeries: sparkOrders,
    },
    {
      label: 'My Businesses',
      value: shops.length,
      icon: <StorefrontOutlinedIcon />,
      color: '#7c3aed',
      trend: shopLabel,
      trendTone: 'neutral',
      sparkSeries: sparkShops || sparkOrders.map(() => 0),
    },
    {
      label: 'Completed',
      value: completedOrders.length,
      icon: <StarBorderIcon />,
      color: '#d97706',
      trend: orders.length === 0
        ? '—'
        : (trendCompleted.text !== '—' ? trendCompleted.text : `${fulfillmentPct}% of orders`),
      trendTone: trendCompleted.text !== '—' ? trendCompleted.tone : (fulfillmentPct >= 50 ? 'up' : 'neutral'),
      sparkSeries: sparkCompleted,
    },
  ];

  const quickActions = [
    { icon: <AddBusinessOutlinedIcon />, label: 'Add Business', desc: 'Register a new shop', color: G, navKey: 'businesses' },
    { icon: <MiscellaneousServicesOutlinedIcon />, label: 'Add Service', desc: 'List a new service', color: '#2563eb', navKey: 'services' },
    { icon: <LocalOfferOutlinedIcon />, label: 'Create Promo', desc: 'Launch a promotion', color: '#7c3aed', navKey: 'promotions' },
    { icon: <CalendarTodayOutlinedIcon />, label: 'View Orders', desc: 'Manage your orders', color: '#d97706', navKey: 'bookings' },
  ];

  return (
    <Box>
      <Collapse in={showHeroBanner} timeout={280} unmountOnExit>
        <Box sx={{ mb: 3 }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: '16px',
              overflow: 'hidden',
              background: DASH.grad,
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 14px 40px rgba(6, 64, 43, 0.32)',
              position: 'relative',
            }}
          >
            <Box sx={{ position: 'absolute', top: -48, right: -32, width: 220, height: 220, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)' }} />
            <Box sx={{ p: { xs: 2.5, md: 3.25 }, position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{
                  width: 52,
                  height: 52,
                  borderRadius: '12px',
                  bgcolor: DASH.iconBox,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: '1px solid rgba(255,255,255,0.14)',
                }}
                >
                  <StorefrontOutlinedIcon sx={{ color: '#ecfdf5', fontSize: 26 }} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 200 }}>
                  <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: { xs: '1.05rem', sm: '1.12rem' }, lineHeight: 1.2, mb: 0.35 }}>
                    Business Dashboard
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.78)', fontSize: '0.8rem', mb: 0.2 }}>
                    Welcome back,{' '}
                    <Box component="span" sx={{ color: '#fff', fontWeight: 700 }}>
                      {user?.firstName} {user?.lastName}
                    </Box>
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.62)', fontSize: '0.78rem', mt: 0.35 }}>
                    {isApproved ? '✓ Verified Tailor' : '⏳ Pending Approval'} · {shops.length} Business{shops.length !== 1 ? 'es' : ''}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1.25, flexWrap: 'wrap', ml: { xs: 0, sm: 'auto' } }}>
                  <Button onClick={() => onNavigate('businesses')} variant="contained" startIcon={<AddBusinessOutlinedIcon />}
                    sx={{
                      bgcolor: HERO_BLUE,
                      color: '#fff',
                      fontWeight: 700,
                      borderRadius: '12px',
                      textTransform: 'none',
                      px: 2.2,
                      boxShadow: '0 2px 8px rgba(30, 58, 138, 0.45)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      '&:hover': { bgcolor: HERO_BLUE_HOVER, boxShadow: '0 4px 14px rgba(23, 37, 84, 0.5)' },
                    }}>
                    Add Business
                  </Button>
                  <Button onClick={() => onNavigate('bookings')} variant="outlined" startIcon={<CalendarTodayOutlinedIcon />}
                    sx={{
                      borderColor: HERO_BLUE_OUTLINE,
                      color: '#fff',
                      fontWeight: 700,
                      borderRadius: '12px',
                      textTransform: 'none',
                      px: 2.2,
                      bgcolor: HERO_BLUE_GHOST,
                      '&:hover': {
                        borderColor: HERO_BLUE_OUTLINE_HOVER,
                        bgcolor: 'rgba(30, 58, 138, 0.55)',
                      },
                    }}>
                    View Orders
                  </Button>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Collapse>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress sx={{ color: G }} /></Box>
      ) : (
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          {kpis.map((k) => (
            <Grid item xs={12} sm={6} lg={3} key={k.label}>
              <KpiCardWithSpark
                label={k.label}
                value={k.value}
                icon={k.icon}
                color={k.color}
                trend={k.trend}
                trendTone={k.trendTone}
                sparkSeries={k.sparkSeries}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem', mb: 1.5 }}>Quick Actions</Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {quickActions.map(({ navKey, ...action }) => (
          <Grid item xs={6} sm={3} key={action.label}>
            <QuickAction {...action} onClick={() => onNavigate(navKey)} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', p: 2.5, bgcolor: '#fff' }}>
            <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem', mb: 2 }}>Recent Orders</Typography>
            {orders.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 5 }}>
                <InboxOutlinedIcon sx={{ fontSize: 48, color: '#cbd5e1', mb: 1 }} />
                <Typography sx={{ color: '#94a3b8', fontSize: '0.85rem' }}>No orders yet</Typography>
              </Box>
            ) : (
              orders.slice(0, 5).map(o => (
                <Box key={o.order_id} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.2, borderBottom: '1px solid #f1f5f9' }}>
                  <Box sx={{ width: 36, height: 36, borderRadius: '10px', bgcolor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShoppingBagOutlinedIcon sx={{ fontSize: 18, color: GL }} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.83rem', color: '#0f172a' }} noWrap>#{o.order_number}</Typography>
                    <Typography sx={{ color: '#64748b', fontSize: '0.73rem' }}>{o.customer_name || 'Customer'}</Typography>
                  </Box>
                  <Chip label={getOrderStatus(o) || 'pending'} size="small"
                    sx={{ bgcolor: '#f0fdf4', color: GL, fontWeight: 700, fontSize: '0.68rem', height: 22, textTransform: 'capitalize' }} />
                </Box>
              ))
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', p: 2.5, bgcolor: '#fff', mb: 2.5 }}>
            <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem', mb: 2 }}>Your Businesses</Typography>
            {shops.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <StorefrontOutlinedIcon sx={{ fontSize: 40, color: '#cbd5e1', mb: 1 }} />
                <Typography sx={{ color: '#94a3b8', fontSize: '0.82rem' }}>No businesses yet</Typography>
                <Button size="small" onClick={() => onNavigate('businesses')}
                  sx={{ mt: 1, color: GL, fontWeight: 700, textTransform: 'none', fontSize: '0.78rem' }}>+ Add Business</Button>
              </Box>
            ) : (
              shops.slice(0, 3).map(s => (
                <Box key={s.shop_id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1, borderBottom: '1px solid #f1f5f9' }}>
                  <Box sx={{ width: 34, height: 34, borderRadius: '9px', bgcolor: `${G}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <StorefrontOutlinedIcon sx={{ fontSize: 17, color: G }} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.82rem', color: '#0f172a' }} noWrap>{s.shop_name}</Typography>
                    <Typography sx={{ color: '#64748b', fontSize: '0.72rem' }}>{s.city || 'N/A'}</Typography>
                  </Box>
                  <Chip label={s.shop_status || 'active'} size="small"
                    sx={{ bgcolor: '#f0fdf4', color: GL, fontWeight: 700, fontSize: '0.65rem', height: 20 }} />
                </Box>
              ))
            )}
          </Paper>

          <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', p: 2.5, bgcolor: '#fff', mb: 2.5 }}>
            <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem', mb: 2 }}>Business Stats</Typography>
            {[
              { label: 'Profile Completion', value: shops.length > 0 ? 72 : 10, color: G },
              { label: 'Order Fulfillment', value: fulfillmentPct, color: '#2563eb' },
              { label: 'Active Businesses', value: shops.filter(s => s.shop_status === 'active').length > 0 ? 100 : 0, color: '#d97706' },
            ].map(s => (
              <Box key={s.label} sx={{ mb: 1.8 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography sx={{ fontSize: '0.78rem', color: '#475569', fontWeight: 500 }}>{s.label}</Typography>
                  <Typography sx={{ fontSize: '0.78rem', color: '#0f172a', fontWeight: 700 }}>{s.value}%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={s.value}
                  sx={{ height: 6, borderRadius: 3, bgcolor: '#f1f5f9', '& .MuiLinearProgress-bar': { bgcolor: s.color, borderRadius: 3 } }} />
              </Box>
            ))}
          </Paper>

          <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', p: 2.5, bgcolor: '#fff', mb: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <NotificationsNoneIcon sx={{ fontSize: 20, color: GL }} />
              <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>Notifications</Typography>
            </Box>
            <Typography sx={{ color: '#94a3b8', fontSize: '0.82rem', textAlign: 'center', py: 2 }}>No new notifications</Typography>
          </Paper>

          <Paper elevation={0} sx={{ borderRadius: '16px', p: 2.5, background: `linear-gradient(135deg, ${G}, ${GL})` }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
              <TipsAndUpdatesOutlinedIcon sx={{ color: '#fff', fontSize: 22, mt: 0.2 }} />
              <Box>
                <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.88rem', mb: 0.5 }}>Pro Tip</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.78rem', lineHeight: 1.6 }}>
                  Complete your business profile to attract more customers. Profiles with photos get 3x more inquiries.
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
