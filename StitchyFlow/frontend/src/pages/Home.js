import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box, Typography, Button, Container, Grid, Card, CardContent,
  Avatar, Rating, TextField, MenuItem, InputAdornment, Paper,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TuneIcon from '@mui/icons-material/Tune';
import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined';
import SearchIcon from '@mui/icons-material/Search';
import NearMeIcon from '@mui/icons-material/NearMe';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PeopleIcon from '@mui/icons-material/People';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedIcon from '@mui/icons-material/Verified';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { apiFetch, gex } from '../utils/api';

const btnStyles = `
  @keyframes shimmer {
    0%   { left: -100%; }
    100% { left: 160%; }
  }
  @keyframes pulseGreen {
    0%, 100% { box-shadow: 0 4px 14px rgba(22,163,74,0.45); }
    50%       { box-shadow: 0 4px 28px rgba(22,163,74,0.85), 0 0 0 6px rgba(22,163,74,0.15); }
  }
  @keyframes pulseBlue {
    0%, 100% { box-shadow: 0 4px 14px rgba(37,99,235,0.45); }
  50%        { box-shadow: 0 4px 28px rgba(37,99,235,0.85), 0 0 0 6px rgba(37,99,235,0.15); }
  }
  .btn-green {
    position: relative; overflow: hidden;
    animation: pulseGreen 2.4s ease-in-out infinite;
    transition: transform 0.25s cubic-bezier(.34,1.56,.64,1), box-shadow 0.25s ease !important;
  }
  .btn-green::after {
    content: '';
    position: absolute; top: 0; left: -100%;
    width: 60%; height: 100%;
    background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%);
    transform: skewX(-20deg);
  }
  .btn-green:hover { transform: translateY(-4px) scale(1.04) !important; }
  .btn-green:hover::after { animation: shimmer 0.65s ease forwards; }
  .btn-green:active { transform: translateY(1px) scale(0.97) !important; }

  .btn-blue {
    position: relative; overflow: hidden;
    animation: pulseBlue 2.4s ease-in-out infinite;
    transition: transform 0.25s cubic-bezier(.34,1.56,.64,1), box-shadow 0.25s ease !important;
  }
  .btn-blue::after {
    content: '';
    position: absolute; top: 0; left: -100%;
    width: 60%; height: 100%;
    background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%);
    transform: skewX(-20deg);
  }
  .btn-blue:hover { transform: translateY(-4px) scale(1.04) !important; }
  .btn-blue:hover::after { animation: shimmer 0.65s ease forwards; }
  .btn-blue:active { transform: translateY(1px) scale(0.97) !important; }
`;
const reviewsData = [
  {
    id: 1,
    name: 'Sarah Ahmed',
    image: 'https://i.pravatar.cc/150?img=1',
    rating: 5,
    comment: 'Excellent tailoring service! The dress they made for me was perfect. Highly recommended!',
    date: 'March 2026',
  },
  {
    id: 2,
    name: 'Mohammad Khan',
    image: 'https://i.pravatar.cc/150?img=3',
    rating: 5,
    comment: 'Very professional tailors. They understood exactly what I wanted. Will definitely order again.',
    date: 'March 2026',
  },
  {
    id: 3,
    name: 'Fatima Ali',
    image: 'https://i.pravatar.cc/150?img=5',
    rating: 4,
    comment: 'Great quality and timely delivery. The stitching was flawless. Good experience overall.',
    date: 'February 2026',
  },
  {
    id: 4,
    name: 'Ali Hassan',
    image: 'https://i.pravatar.cc/150?img=8',
    rating: 5,
    comment: 'Best tailoring service in town! They paid attention to every detail. Very satisfied.',
    date: 'February 2026',
  },
];


function Home() {
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [subcategories, setSubcategories] = useState([]);
  const [subcategoriesLoading, setSubcategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState('');

  const selectedCategoryName = useMemo(() => {
    if (!category) return '';
    const c = categories.find((x) => String(x.id) === String(category));
    return c?.name || '';
  }, [category, categories]);

  const selectedSubcategoryName = useMemo(() => {
    if (!subcategory) return '';
    const s = subcategories.find((x) => String(x.id) === String(subcategory));
    return s?.name || '';
  }, [subcategory, subcategories]);

  const reviewsRef = useRef(null);
  const handleViewAllReviews = () => {
    reviewsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setCategoriesLoading(true);
        setCategoriesError('');
        const res = await gex('/catalog/categories');
        if (!cancelled) setCategories(Array.isArray(res?.data) ? res.data : []);
      } catch (err) {
        if (!cancelled) {
          setCategories([]);
          const msg = err?.message || '';
          const offline = /failed to fetch|networkerror|load failed/i.test(msg);
          setCategoriesError(
            offline
              ? 'Cannot reach the API. Start the backend on port 5000, then restart the frontend (npm start) so the dev proxy applies.'
              : `Categories could not load: ${msg || 'Check that the API is running.'}`
          );
        }
      } finally {
        if (!cancelled) setCategoriesLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!category) {
      setSubcategory('');
      setSubcategories([]);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setSubcategoriesLoading(true);
        const res = await gex(`/catalog/subcategories?category_id=${encodeURIComponent(category)}`);
        if (!cancelled) setSubcategories(Array.isArray(res?.data) ? res.data : []);
      } catch {
        if (!cancelled) setSubcategories([]);
      } finally {
        if (!cancelled) setSubcategoriesLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [category]);

  const pushSearchParams = () => {
    const p = new URLSearchParams();
    if (category) p.set('categoryId', category);
    if (subcategory) p.set('subcategoryId', subcategory);
    if (searchQuery.trim()) p.set('q', searchQuery.trim());
    const qs = p.toString();
    navigate(qs ? `/register?${qs}` : '/register');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fff' }}>
      <style>{btnStyles}</style>
      <Header />
      
      {/* Hero Slider */}
      <Box sx={{
        position: 'relative',
        background: 'linear-gradient(135deg, #1a3a8f 0%, #1e4db7 30%, #1565c0 55%, #0d7a6e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mt: '64px',
        overflow: 'hidden',
        py: { xs: 8, md: 12 },
        minHeight: { xs: 'auto', md: '88vh' },
      }}>
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          {/* Main Heading */}
          <Typography variant="h3" sx={{
            fontWeight: 800,
            color: '#fff',
            fontSize: { xs: '2rem', md: '3rem' },
            mb: 2,
            mt: { xs: 2, md: 4 },
            lineHeight: 1.2,
          }}>
            Your Perfect Tailor with{' '}
            <Box component="span" sx={{ color: '#f59e0b' }}>StitchyFlow</Box>
          </Typography>

          {/* Subtitle */}
          <Typography variant="body1" sx={{
            color: 'rgba(255,255,255,0.85)',
            fontSize: { xs: '0.95rem', md: '1.1rem' },
            mb: 5,
            maxWidth: 520,
            mx: 'auto',
            lineHeight: 1.7,
          }}>
            Connect with skilled tailors, book custom stitching services, and get perfectly fitted outfits for weddings, formal wear, and everyday fashion.
          </Typography>

          {/* Search Card */}
          <Paper elevation={0} sx={{
            borderRadius: '20px',
            p: { xs: 3, md: 4 },
            bgcolor: '#fff',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            maxWidth: 780,
            width: '100%',
            mx: 'auto',
          }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 0.5, fontSize: { xs: '1.2rem', md: '1.4rem' } }}>
              Find Your Perfect Tailoring Service
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b7280', mb: 3, fontSize: '0.9rem' }}>
              Search from hundreds of verified tailors across Pakistan
            </Typography>

            {/* Fields Row — categories & subcategories from live DB */}
            <Grid container spacing={2} sx={{ mb: 1 }}>
              <Grid item xs={12} md={4}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', mb: 0.8 }}>
                  Category
                </Typography>
                <TextField
                  select
                  fullWidth
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setSubcategory('');
                  }}
                  disabled={categoriesLoading}
                  SelectProps={{ displayEmpty: true }}
                  inputProps={{ 'aria-label': 'Category' }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TuneIcon sx={{ color: '#8b5cf6', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    borderRadius: '10px',
                    bgcolor: '#fafafa',
                    fontSize: '0.95rem',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d1d5db' },
                    '& .MuiSelect-select': { py: 1.4 },
                  }}
                >
                  <MenuItem value="">
                    <em>{categoriesLoading ? 'Loading categories…' : 'All Categories'}</em>
                  </MenuItem>
                  {categories.map((c) => (
                    <MenuItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', mb: 0.8 }}>
                  Subcategory
                </Typography>
                <TextField
                  select
                  fullWidth
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  disabled={!category || subcategoriesLoading}
                  SelectProps={{ displayEmpty: true }}
                  inputProps={{ 'aria-label': 'Subcategory' }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LabelOutlinedIcon sx={{ color: '#2563eb', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    borderRadius: '10px',
                    bgcolor: '#fafafa',
                    fontSize: '0.95rem',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d1d5db' },
                    '& .MuiSelect-select': { py: 1.4 },
                  }}
                >
                  <MenuItem value="">
                    <em>
                      {!category
                        ? 'Select a category first'
                        : subcategoriesLoading
                          ? 'Loading…'
                          : subcategories.length === 0
                            ? 'No subcategories'
                            : 'All subcategories'}
                    </em>
                  </MenuItem>
                  {subcategories.map((s) => (
                    <MenuItem key={s.id} value={String(s.id)}>
                      {s.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', mb: 0.8 }}>
                  Search
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Search tailors, services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#f59e0b', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      fontSize: '0.95rem',
                      '& input': { py: 1.4 },
                    },
                  }}
                />
              </Grid>
            </Grid>

            <Paper
              elevation={0}
              sx={{
                mb: 2,
                p: 2,
                borderRadius: '12px',
                textAlign: 'left',
                border: '1px solid #bfdbfe',
                background: 'linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)',
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#1e40af', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Current selection (live database)
              </Typography>
              {categoriesLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1.5 }}>
                  <CircularProgress size={22} thickness={4} sx={{ color: '#2563eb' }} />
                  <Typography variant="body2" sx={{ color: '#475569' }}>
                    Loading categories…
                  </Typography>
                </Box>
              ) : categoriesError ? (
                <Typography variant="body2" sx={{ color: '#b91c1c', mt: 1.5, fontWeight: 600 }}>
                  {categoriesError}
                </Typography>
              ) : (
                <Box sx={{ mt: 1.5 }}>
                  <Typography variant="body2" sx={{ color: '#334155', mb: 0.75 }}>
                    <Box component="span" sx={{ fontWeight: 700, color: '#64748b' }}>Category: </Box>
                    {selectedCategoryName || (
                      <Box component="span" sx={{ fontStyle: 'italic', color: '#94a3b8' }}>All categories</Box>
                    )}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#334155', mb: 1 }}>
                    <Box component="span" sx={{ fontWeight: 700, color: '#64748b' }}>Subcategory: </Box>
                    {!category ? (
                      <Box component="span" sx={{ fontStyle: 'italic', color: '#94a3b8' }}>Choose a category first</Box>
                    ) : subcategoriesLoading ? (
                      <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={16} thickness={4} />
                        Loading…
                      </Box>
                    ) : selectedSubcategoryName ? (
                      selectedSubcategoryName
                    ) : (
                      <Box component="span" sx={{ fontStyle: 'italic', color: '#94a3b8' }}>
                        {subcategories.length === 0 ? 'No subcategories for this category' : 'All subcategories'}
                      </Box>
                    )}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                    {categories.length} categor{categories.length === 1 ? 'y' : 'ies'} in database
                    {category && !subcategoriesLoading && subcategories.length > 0
                      ? ` · ${subcategories.length} subcategor${subcategories.length === 1 ? 'y' : 'ies'} under this category`
                      : ''}
                  </Typography>
                </Box>
              )}
            </Paper>

            {/* Buttons Row */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Button fullWidth variant="contained"
                  startIcon={<NearMeIcon />}
                  className="btn-green"
                  onClick={pushSearchParams}
                  sx={{
                    bgcolor: '#16a34a',
                    fontWeight: 700,
                    borderRadius: '10px',
                    py: 1.6,
                    fontSize: '1rem',
                    textTransform: 'none',
                  }}>
                  Find Near Me
                </Button>
              </Grid>
              <Grid item xs={12} md={6}>
                <Button fullWidth variant="contained"
                  startIcon={<SearchIcon />}
                  className="btn-blue"
                  onClick={pushSearchParams}
                  sx={{
                    bgcolor: '#2563eb',
                    fontWeight: 700,
                    borderRadius: '10px',
                    py: 1.6,
                    fontSize: '1rem',
                    textTransform: 'none',
                  }}>
                  Search Tailors
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ py: 8, bgcolor: '#f0f4ff' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ fontWeight: 800, textAlign: 'center', mb: 1, color: '#1a1a2e' }}>
            How It{' '}
            <Box component="span" sx={{ color: '#2563eb' }}>Works</Box>
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'center', color: '#6b7280', mb: 6, maxWidth: 500, mx: 'auto', lineHeight: 1.7 }}>
            We've streamlined the tailoring process into three simple, transparent steps.
          </Typography>

          <Grid container spacing={3}>
            {[
              {
                icon: <SearchIcon sx={{ color: '#2563eb', fontSize: 28 }} />,
                num: '1',
                title: 'Tailor Dhundein',
                desc: 'Apne qareeb ke verified aur professional tailors browse karein. Reviews, pricing aur portfolio compare karein aasani se.',
              },
              {
                icon: <NearMeIcon sx={{ color: '#2563eb', fontSize: 28 }} />,
                num: '2',
                title: 'Booking Karein',
                desc: 'Apni pasand ki date chunein, service customize karein aur hamare secure payment system se booking confirm karein.',
              },
              {
                icon: <CheckCircleOutlineIcon sx={{ color: '#2563eb', fontSize: 28 }} />,
                num: '3',
                title: 'Perfect Fit Paein',
                desc: 'Aap aaraam karein — hum aapke tailor se saari details coordinate karein ge taake aapka outfit bilkul perfect ho.',
              },
            ].map((step) => (
              <Grid item xs={12} md={4} key={step.num}>
                <Paper elevation={0} sx={{
                  borderRadius: '16px',
                  p: 4,
                  bgcolor: '#fff',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  {/* Big number watermark */}
                  <Typography sx={{
                    position: 'absolute', top: 16, right: 24,
                    fontSize: '5rem', fontWeight: 900,
                    color: 'rgba(37,99,235,0.08)', lineHeight: 1,
                    userSelect: 'none',
                  }}>
                    {step.num}
                  </Typography>

                  {/* Icon box */}
                  <Box sx={{
                    width: 56, height: 56,
                    borderRadius: '14px',
                    bgcolor: '#eff6ff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    mb: 3,
                  }}>
                    {step.icon}
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 1.5 }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6b7280', lineHeight: 1.7 }}>
                    {step.desc}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Trusted by Thousands Section */}
      <Box sx={{ py: 6, bgcolor: '#f0f4ff' }}>
        <Container maxWidth="md">
          <Paper elevation={0} sx={{
            borderRadius: '20px',
            p: { xs: 4, md: 5 },
            bgcolor: '#fff',
            boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
            textAlign: 'center',
          }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a1a2e', mb: 1 }}>
              Trusted by Thousands
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b7280', mb: 5 }}>
              Powering Pakistan's largest and most vibrant tailoring community.
            </Typography>

            <Grid container spacing={0}>
              {[
                { icon: <PeopleIcon sx={{ fontSize: 32, color: '#2563eb' }} />, value: '500+', label: 'TRUSTED TAILORS',    color: '#2563eb' },
                { icon: <CheckCircleOutlineIcon sx={{ fontSize: 32, color: '#16a34a' }} />, value: '10K+', label: 'ORDERS COMPLETED', color: '#16a34a' },
                { icon: <LocationOnOutlinedIcon sx={{ fontSize: 32, color: '#7c3aed' }} />, value: '50+',  label: 'CITIES COVERED',   color: '#7c3aed' },
                { icon: <StarOutlineIcon sx={{ fontSize: 32, color: '#ea580c' }} />,        value: '4.9',  label: 'AVERAGE RATING',   color: '#ea580c' },
              ].map((stat, idx, arr) => (
                <Grid item xs={6} md={3} key={stat.label} sx={{
                  borderRight: idx < arr.length - 1 ? { md: '1px solid #e5e7eb' } : 'none',
                  py: 1,
                }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                    {stat.icon}
                    <Typography sx={{ fontSize: '2.4rem', fontWeight: 800, color: stat.color, lineHeight: 1.1, mt: 0.5 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#9ca3af', letterSpacing: '0.08em', fontSize: '0.7rem' }}>
                      {stat.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Container>
      </Box>

      {/* List Your Business CTA */}
      <Box sx={{
        py: { xs: 7, md: 9 },
        background: 'linear-gradient(135deg, #1a3a8f 0%, #1e4db7 40%, #1565c0 65%, #0d7a6e 100%)',
        textAlign: 'center',
      }}>
        <Container maxWidth="md">
          <Typography variant="h3" sx={{
            fontWeight: 800, color: '#fff',
            fontSize: { xs: '1.8rem', md: '2.6rem' },
            mb: 2,
          }}>
            List Your Business on StitchyFlow
          </Typography>
          <Typography variant="body1" sx={{
            color: 'rgba(255,255,255,0.8)',
            mb: 5, maxWidth: 520, mx: 'auto', lineHeight: 1.7,
          }}>
            Join thousands of premier tailors who trust StitchyFlow to expand their reach and grow their business exponentially.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              onClick={() => navigate('/register')}
              sx={{
                bgcolor: '#fff', color: '#1e4db7',
                fontWeight: 700, borderRadius: '10px',
                px: 4, py: 1.5, fontSize: '0.95rem',
                textTransform: 'none',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
              }}>
              List Your Business +
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/login')}
              sx={{
                borderColor: 'rgba(255,255,255,0.6)', color: '#fff',
                fontWeight: 700, borderRadius: '10px',
                px: 4, py: 1.5, fontSize: '0.95rem',
                textTransform: 'none',
                backdropFilter: 'blur(4px)',
                bgcolor: 'rgba(255,255,255,0.1)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.2)', borderColor: '#fff' },
              }}>
              Tailer Shop Login
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Trust Badges Bar */}
      <Box sx={{ py: 3, bgcolor: '#fff', borderBottom: '1px solid #f3f4f6' }}>
        <Container maxWidth="md">
          <Grid container spacing={2} justifyContent="center" alignItems="center">
            {[
              { icon: <SecurityIcon sx={{ color: '#16a34a', fontSize: 28 }} />, title: 'Secure Payments', sub: 'SSL encrypted transactions' },
              { icon: <VerifiedIcon sx={{ color: '#2563eb', fontSize: 28 }} />,  title: 'Verified Tailors',  sub: 'Background checked professionals' },
              { icon: <AccessTimeIcon sx={{ color: '#0d9488', fontSize: 28 }} />, title: '24/7 Support',     sub: 'Always here to help' },
            ].map((item) => (
              <Grid item xs={12} md={4} key={item.title}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: { xs: 'center', md: 'center' } }}>
                  {item.icon}
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1a1a2e' }}>{item.title}</Typography>
                    <Typography variant="caption" sx={{ color: '#6b7280' }}>{item.sub}</Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* What Our Customers Say */}
      <Box ref={reviewsRef} sx={{ py: 8, bgcolor: '#f0f4ff' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a1a2e', mb: 1 }}>
              What Our Customers Say
            </Typography>
            <Typography variant="body1" sx={{ color: '#6b7280', maxWidth: 480, mx: 'auto', lineHeight: 1.7 }}>
              Real stories from real customers who trusted StitchyFlow for their special moments.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {reviewsData.map((review) => (
              <Grid item xs={12} sm={6} md={3} key={review.id}>
                <Card sx={{
                  height: '100%', borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
                  border: '1px solid #e5e7eb',
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 12px 32px rgba(37,99,235,0.12)' },
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar src={review.image} alt={review.name} sx={{ width: 46, height: 46, mr: 1.5 }} />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1a1a2e' }}>{review.name}</Typography>
                        <Typography variant="caption" sx={{ color: '#9ca3af' }}>{review.date}</Typography>
                      </Box>
                    </Box>
                    <Rating value={review.rating} readOnly size="small"
                      sx={{ mb: 1.5, '& .MuiRating-iconFilled': { color: '#f59e0b' } }} />
                    <Typography variant="body2" sx={{ color: '#6b7280', fontStyle: 'italic', lineHeight: 1.6 }}>
                      "{review.comment}"
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Button variant="text" endIcon={<ArrowForwardIcon />}
              onClick={handleViewAllReviews}
              sx={{ color: '#2563eb', fontWeight: 600, textTransform: 'none', fontSize: '0.95rem' }}>
              View all reviews
            </Button>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}

export default Home;
