/**
 * Insights Page — Platform Analytics, Tips & Fashion Stories
 * URL: /insights
 * Developer by: Muhammad Kalim | LogixInventor (PVT) Ltd.
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, Container, Grid, Paper, Chip, Button,
  LinearProgress, Avatar, Divider
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StarIcon from '@mui/icons-material/Star';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SliderBackground from '../../components/SliderBanner';

// ── Animated counter hook ─────────────────────────────────────────────────────
function useCounter(target, duration = 1800, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setVal(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return val;
}

// ── Typewriter hook ───────────────────────────────────────────────────────────
function useTypewriter(text, speed = 40) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const t = setInterval(() => {
      setDisplayed(text.slice(0, ++i));
      if (i >= text.length) clearInterval(t);
    }, speed);
    return () => clearInterval(t);
  }, [text, speed]);
  return displayed;
}

// ── Platform stats ────────────────────────────────────────────────────────────
const STATS = [
  { label: 'Registered Users',   value: 1240,  suffix: '+', icon: <PeopleIcon />,       color: '#2563eb', bg: '#eff6ff' },
  { label: 'Active Tailors',     value: 380,   suffix: '+', icon: <ContentCutIcon />,   color: '#7c3aed', bg: '#f5f3ff' },
  { label: 'Orders Completed',   value: 5800,  suffix: '+', icon: <ShoppingCartIcon />, color: '#059669', bg: '#ecfdf5' },
  { label: 'Avg. Rating',        value: 4.8,   suffix: '★', icon: <StarIcon />,         color: '#d97706', bg: '#fffbeb', isFloat: true },
  { label: 'Cities Covered',     value: 28,    suffix: '+', icon: <LocationOnIcon />,   color: '#dc2626', bg: '#fef2f2' },
  { label: 'Revenue (PKR)',       value: 12,    suffix: 'M+',icon: <TrendingUpIcon />,   color: '#0891b2', bg: '#ecfeff' },
];

// ── Monthly growth data ───────────────────────────────────────────────────────
const MONTHLY = [
  { month: 'Nov', orders: 320, users: 85,  revenue: 1.2 },
  { month: 'Dec', orders: 480, users: 140, revenue: 1.9 },
  { month: 'Jan', orders: 390, users: 110, revenue: 1.5 },
  { month: 'Feb', orders: 620, users: 195, revenue: 2.4 },
  { month: 'Mar', orders: 540, users: 160, revenue: 2.1 },
  { month: 'Apr', orders: 780, users: 240, revenue: 3.1 },
];

// ── Top categories ────────────────────────────────────────────────────────────
const CATEGORIES = [
  { name: 'Custom Dresses',   pct: 38, color: '#2563eb' },
  { name: 'Suits & Blazers',  pct: 27, color: '#7c3aed' },
  { name: 'Bridal Wear',      pct: 18, color: '#db2777' },
  { name: 'Traditional Wear', pct: 11, color: '#d97706' },
  { name: 'Alterations',      pct: 6,  color: '#059669' },
];

// ── Tips articles ─────────────────────────────────────────────────────────────
const ARTICLES = [
  { icon: '✂️', tag: 'Tailoring Tips',   title: 'How to Get Perfect Measurements', desc: 'A step-by-step guide to measuring yourself accurately for the best tailored fit.' },
  { icon: '👗', tag: 'Fashion Trends',   title: 'Top Fabric Trends for 2026',       desc: 'Discover which fabrics are dominating Pakistani fashion this year.' },
  { icon: '🧵', tag: 'Fabric Guide',     title: 'Choosing the Right Fabric',        desc: 'From lawn to silk — learn which fabric suits every occasion and season.' },
  { icon: '💼', tag: 'Business Insight', title: 'Growing Your Tailor Business',     desc: 'Practical tips for tailors to attract more customers and scale their shop.' },
  { icon: '🌟', tag: 'Success Story',    title: 'From 5 to 500 Orders a Month',     desc: 'How one Lahore tailor transformed his business using StitchyFlow.' },
  { icon: '📅', tag: 'Seasonal Guide',   title: 'Eid Collection Planning Guide',    desc: 'Start early, choose wisely — your complete Eid wardrobe planning checklist.' },
];

// ── Stat card with animated counter ──────────────────────────────────────────
function StatCard({ stat, animate }) {
  const intVal = useCounter(stat.isFloat ? Math.floor(stat.value * 10) : stat.value, 1600, animate);
  const display = stat.isFloat ? (intVal / 10).toFixed(1) : intVal.toLocaleString();
  return (
    <Paper elevation={0} sx={{
      p: 3, borderRadius: '16px', bgcolor: stat.bg,
      border: `1.5px solid ${stat.color}18`,
      display: 'flex', alignItems: 'center', gap: 2,
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': { transform: 'translateY(-4px)', boxShadow: `0 8px 24px ${stat.color}22` }
    }}>
      <Box sx={{ width: 52, height: 52, borderRadius: '14px', bgcolor: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {React.cloneElement(stat.icon, { sx: { color: '#fff', fontSize: 26 } })}
      </Box>
      <Box>
        <Typography sx={{ fontWeight: 800, fontSize: '1.7rem', color: stat.color, lineHeight: 1 }}>
          {display}{stat.suffix}
        </Typography>
        <Typography sx={{ color: '#6b7280', fontSize: '0.8rem', fontWeight: 500, mt: 0.3 }}>{stat.label}</Typography>
      </Box>
    </Paper>
  );
}

export default function Blog() {
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);
  const statsRef = useRef(null);
  const subtitle = useTypewriter('Stay informed with the latest tailoring tips, fashion trends, and industry insights from the StitchyFlow team.', 30);

  // Trigger counter animation when stats section enters viewport
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setAnimate(true); }, { threshold: 0.2 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const maxOrders = Math.max(...MONTHLY.map(m => m.orders));

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <Header />

      {/* ── Hero with Slider Background ── */}
      <SliderBackground
        page="/insights"
        fallbackSx={{
          mt: '64px',
          background: 'linear-gradient(135deg,#1a3a8f 0%,#1e4db7 40%,#1565c0 65%,#0d7a6e 100%)',
          py: { xs: 8, md: 11 },
          position: 'relative', overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)', zIndex: 1 }} />
        <Box sx={{ position: 'absolute', bottom: -80, left: -40, width: 240, height: 240, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.03)', zIndex: 1 }} />
        <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 2, py: { xs: 8, md: 11 } }}>
          <Chip label="Company · Insights" sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: '#fff', fontWeight: 600, mb: 3, fontSize: '0.8rem' }} />

          {/* Animated title */}
          <Typography variant="h2" sx={{ fontWeight: 800, color: '#fff', fontSize: { xs: '2rem', md: '3rem' }, lineHeight: 1.2, mb: 2 }}>
            Insights, Tips &{' '}
            <Box component="span" sx={{
              color: '#f59e0b',
              display: 'inline-block',
              animation: 'fadeSlideIn 0.8s ease forwards',
              '@keyframes fadeSlideIn': {
                from: { opacity: 0, transform: 'translateY(20px)' },
                to:   { opacity: 1, transform: 'translateY(0)' }
              }
            }}>
              Fashion Stories
            </Box>
          </Typography>

          {/* Typewriter subtitle */}
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.85)', maxWidth: 560, mx: 'auto', lineHeight: 1.8, mb: 4, fontSize: '1.05rem', minHeight: 56 }}>
            {subtitle}
            <Box component="span" sx={{ display: 'inline-block', width: 2, height: '1em', bgcolor: '#f59e0b', ml: 0.3, animation: 'blink 1s step-end infinite', '@keyframes blink': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0 } } }} />
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="contained" onClick={() => navigate('/register')}
              sx={{ bgcolor: '#f59e0b', color: '#fff', fontWeight: 700, borderRadius: '10px', px: 4, py: 1.5, textTransform: 'none', boxShadow: '0 4px 14px rgba(245,158,11,0.4)', '&:hover': { bgcolor: '#d97706' } }}>
              Join StitchyFlow
            </Button>
            <Button variant="outlined" onClick={() => navigate('/home')}
              sx={{ borderColor: 'rgba(255,255,255,0.5)', color: '#fff', fontWeight: 600, borderRadius: '10px', px: 4, py: 1.5, textTransform: 'none', bgcolor: 'rgba(255,255,255,0.08)', '&:hover': { bgcolor: 'rgba(255,255,255,0.15)', borderColor: '#fff' } }}>
              Explore Platform
            </Button>
          </Box>
        </Container>
      </SliderBackground>

      {/* ── Platform Analytics Stats ── */}
      <Box ref={statsRef} sx={{ py: 8, bgcolor: '#fff' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip label="Platform Analytics" icon={<AutoGraphIcon sx={{ fontSize: 16 }} />} sx={{ bgcolor: '#eff6ff', color: '#2563eb', fontWeight: 700, mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a1a2e', mb: 1 }}>
              StitchyFlow by the Numbers
            </Typography>
            <Typography variant="body1" sx={{ color: '#6b7280', maxWidth: 480, mx: 'auto' }}>
              Real-time platform performance and growth metrics
            </Typography>
          </Box>
          <Grid container spacing={2.5}>
            {STATS.map((stat) => (
              <Grid item xs={12} sm={6} md={4} key={stat.label}>
                <StatCard stat={stat} animate={animate} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── Monthly Growth Chart ── */}
      <Box sx={{ py: 8, bgcolor: '#f8fafc' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="flex-start">
            {/* Bar chart */}
            <Grid item xs={12} md={7}>
              <Paper elevation={0} sx={{ p: 4, borderRadius: '20px', border: '1px solid #e5e7eb' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <TrendingUpIcon sx={{ color: '#2563eb' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e' }}>Monthly Orders Growth</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1.5, height: 200 }}>
                  {MONTHLY.map((m) => {
                    const h = (m.orders / maxOrders) * 100;
                    return (
                      <Box key={m.month} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                        <Typography variant="caption" sx={{ color: '#2563eb', fontWeight: 700, fontSize: '0.65rem' }}>{m.orders}</Typography>
                        <Box sx={{
                          width: '100%', height: `${h}%`, minHeight: 4,
                          background: m.orders === maxOrders
                            ? 'linear-gradient(180deg,#1d4ed8,#3b82f6)'
                            : 'linear-gradient(180deg,#93c5fd,#bfdbfe)',
                          borderRadius: '6px 6px 0 0',
                          transition: 'height 1s ease',
                        }} />
                        <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.7rem' }}>{m.month}</Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Paper>
            </Grid>

            {/* Category breakdown */}
            <Grid item xs={12} md={5}>
              <Paper elevation={0} sx={{ p: 4, borderRadius: '20px', border: '1px solid #e5e7eb', height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <CheckroomIcon sx={{ color: '#7c3aed' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e' }}>Top Categories</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {CATEGORIES.map((cat) => (
                    <Box key={cat.name}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151', fontSize: '0.82rem' }}>{cat.name}</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: cat.color, fontSize: '0.82rem' }}>{cat.pct}%</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={cat.pct} sx={{
                        height: 8, borderRadius: '4px', bgcolor: '#f3f4f6',
                        '& .MuiLinearProgress-bar': { bgcolor: cat.color, borderRadius: '4px' }
                      }} />
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ── Revenue Trend ── */}
      <Box sx={{ py: 8, bgcolor: '#fff' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a1a2e', mb: 1 }}>Revenue Trend (PKR Millions)</Typography>
            <Typography variant="body1" sx={{ color: '#6b7280' }}>Monthly revenue growth over the last 6 months</Typography>
          </Box>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '20px', border: '1px solid #e5e7eb' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 160 }}>
              {MONTHLY.map((m, i) => {
                const maxRev = Math.max(...MONTHLY.map(x => x.revenue));
                const h = (m.revenue / maxRev) * 100;
                return (
                  <Box key={m.month} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="caption" sx={{ color: '#059669', fontWeight: 700, fontSize: '0.7rem' }}>PKR {m.revenue}M</Typography>
                    <Box sx={{
                      width: '100%', height: `${h}%`, minHeight: 4,
                      background: `linear-gradient(180deg,#059669,#34d399)`,
                      borderRadius: '6px 6px 0 0',
                    }} />
                    <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.72rem' }}>{m.month}</Typography>
                  </Box>
                );
              })}
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* ── Tips & Articles ── */}
      <Box sx={{ py: 8, bgcolor: '#f8fafc' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip label="Tips & Stories" icon={<EmojiObjectsIcon sx={{ fontSize: 16 }} />} sx={{ bgcolor: '#fef3c7', color: '#d97706', fontWeight: 700, mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a1a2e', mb: 1 }}>Latest Insights</Typography>
            <Typography variant="body1" sx={{ color: '#6b7280' }}>Expert tips, fashion trends, and success stories</Typography>
          </Box>
          <Grid container spacing={3}>
            {ARTICLES.map((a, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Paper elevation={0} sx={{
                  p: 3.5, borderRadius: '18px', border: '1px solid #e5e7eb', bgcolor: '#fff', height: '100%',
                  transition: 'all 0.25s', cursor: 'pointer',
                  '&:hover': { boxShadow: '0 8px 32px rgba(37,99,235,0.1)', transform: 'translateY(-4px)', borderColor: '#bfdbfe' }
                }}>
                  <Box sx={{ width: 52, height: 52, borderRadius: '14px', bgcolor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, fontSize: '1.6rem' }}>
                    {a.icon}
                  </Box>
                  <Chip label={a.tag} size="small" sx={{ bgcolor: '#f3f4f6', color: '#374151', fontWeight: 600, fontSize: '0.68rem', mb: 1.5 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 1, fontSize: '0.95rem', lineHeight: 1.4 }}>{a.title}</Typography>
                  <Typography variant="body2" sx={{ color: '#6b7280', lineHeight: 1.7, fontSize: '0.82rem' }}>{a.desc}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── Seasonal Calendar ── */}
      <Box sx={{ py: 8, bgcolor: '#fff' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 5 }}>
            <CalendarMonthIcon sx={{ color: '#db2777', fontSize: 28 }} />
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a1a2e' }}>Fashion Calendar 2026</Typography>
          </Box>
          <Grid container spacing={2}>
            {[
              { month: 'March–April', event: 'Eid ul-Fitr Collection', color: '#2563eb', tip: 'Book your tailor 6 weeks early for Eid outfits.' },
              { month: 'June–July',   event: 'Wedding Season Peak',    color: '#7c3aed', tip: 'Bridal & sherwani orders surge — plan ahead.' },
              { month: 'Oct–Nov',     event: 'Winter Formals',         color: '#0891b2', tip: 'Wool suits and warm fabrics are in high demand.' },
              { month: 'Dec–Jan',     event: 'Eid ul-Adha & New Year', color: '#d97706', tip: 'Traditional shalwar kameez orders peak this season.' },
            ].map((item) => (
              <Grid item xs={12} sm={6} key={item.month}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: `2px solid ${item.color}22`, bgcolor: `${item.color}08` }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: item.color }} />
                    <Typography variant="caption" sx={{ color: item.color, fontWeight: 700, fontSize: '0.75rem' }}>{item.month}</Typography>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e', fontSize: '0.95rem', mb: 0.5 }}>{item.event}</Typography>
                  <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.82rem' }}>{item.tip}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── CTA ── */}
      <Box sx={{ py: 7, textAlign: 'center', background: 'linear-gradient(135deg,#1a3a8f 0%,#1e4db7 50%,#0d7a6e 100%)' }}>
        <Container maxWidth="sm">
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', mb: 1.5 }}>Ready to Get Started?</Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.75)', mb: 4 }}>
            Join thousands of satisfied customers on StitchyFlow today.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/register')}
            sx={{ bgcolor: '#f59e0b', color: '#fff', fontWeight: 700, borderRadius: '10px', px: 5, py: 1.5, fontSize: '0.95rem', textTransform: 'none', '&:hover': { bgcolor: '#d97706' } }}>
            Create Free Account
          </Button>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
