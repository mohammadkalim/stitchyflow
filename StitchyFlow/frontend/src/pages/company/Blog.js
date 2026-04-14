import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Container, IconButton, Chip } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PageTemplate from '../../components/PageTemplate';
import { gex } from '../../utils/api';

const features = [
  { icon: '✂️', title: 'Tailoring Tips', desc: 'Expert advice on measurements, fabric care, and getting the best from your tailor.' },
  { icon: '👗', title: 'Fashion Trends', desc: 'Stay updated with the latest fashion trends in Pakistan and globally.' },
  { icon: '🧵', title: 'Fabric Guides', desc: 'In-depth guides on choosing the right fabric for every occasion and season.' },
  { icon: '💼', title: 'Business Insights', desc: 'Tips for tailors on growing their business and attracting more customers.' },
  { icon: '🌟', title: 'Success Stories', desc: 'Real stories from tailors and customers who transformed their lives with StitchyFlow.' },
  { icon: '📅', title: 'Seasonal Guides', desc: 'What to wear for Eid, weddings, winter, and every occasion in between.' },
];

// Fallback placeholder images (fashion/tailoring themed)
const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
  'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80',
  'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=80',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80',
];

function BusinessSlider() {
  const [shops, setShops] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const loadShops = async () => {
      try {
        const data = await gex('/business/public/shops');
        if (!cancelled && data.success && Array.isArray(data.data) && data.data.length > 0) {
          setShops(data.data);
          return;
        }
      } catch {
        // ignore, use fallback data below
      }

      if (!cancelled) {
        setShops(PLACEHOLDER_IMAGES.map((img, i) => ({
          shop_id: i,
          shop_name: ['Royal Stitch Boutique', 'Al-Noor Tailor House', 'Bridal Dreams Studio',
            'Classic Cuts', 'Fashion Hub', 'Elite Tailors'][i] || `Shop ${i + 1}`,
          city: ['Lahore', 'Karachi', 'Islamabad', 'Faisalabad', 'Rawalpindi', 'Multan'][i] || 'Pakistan',
          shop_image: img,
          business_type_name: 'Tailoring',
        })));
      }
    };

    loadShops().finally(() => {
      if (!cancelled) {
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Auto-advance
  useEffect(() => {
    if (shops.length === 0) return;
    timerRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % shops.length);
    }, 4000);
    return () => clearInterval(timerRef.current);
  }, [shops]);

  const prev = () => {
    clearInterval(timerRef.current);
    setCurrent(c => (c - 1 + shops.length) % shops.length);
  };
  const next = () => {
    clearInterval(timerRef.current);
    setCurrent(c => (c + 1) % shops.length);
  };

  if (loading || shops.length === 0) return null;

  // Show 3 visible cards centered on current
  const visible = [-1, 0, 1].map(offset => {
    const idx = (current + offset + shops.length) % shops.length;
    return { shop: shops[idx], offset };
  });

  return (
    <Box sx={{ py: 7, bgcolor: '#f0f4ff' }}>
      <Container maxWidth="lg">
        <Typography variant="h4" sx={{ fontWeight: 800, textAlign: 'center', color: '#1a1a2e', mb: 1 }}>
          Featured Businesses
        </Typography>
        <Typography variant="body1" sx={{ textAlign: 'center', color: '#6b7280', mb: 5 }}>
          Discover top tailoring shops on StitchyFlow
        </Typography>

        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          {/* Prev button */}
          <IconButton onClick={prev} sx={{
            bgcolor: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
            '&:hover': { bgcolor: '#1e4db7', color: '#fff' },
            zIndex: 2, flexShrink: 0,
          }}>
            <ChevronLeftIcon />
          </IconButton>

          {/* Cards */}
          <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'center', overflow: 'hidden', width: '100%', justifyContent: 'center' }}>
            {visible.map(({ shop, offset }) => (
              <Box key={`${shop.shop_id}-${offset}`} sx={{
                flexShrink: 0,
                width: offset === 0 ? { xs: '100%', sm: 340 } : { xs: 0, sm: 260 },
                display: { xs: offset === 0 ? 'block' : 'none', sm: 'block' },
                transition: 'all 0.4s ease',
                transform: offset === 0 ? 'scale(1)' : 'scale(0.92)',
                opacity: offset === 0 ? 1 : 0.65,
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: offset === 0
                  ? '0 12px 40px rgba(30,77,183,0.18)'
                  : '0 4px 16px rgba(0,0,0,0.08)',
                bgcolor: '#fff',
                cursor: offset !== 0 ? 'pointer' : 'default',
              }}
                onClick={() => offset !== 0 && setCurrent((current + offset + shops.length) % shops.length)}
              >
                {/* Image */}
                <Box sx={{ position: 'relative', height: offset === 0 ? 220 : 170, overflow: 'hidden' }}>
                  <Box
                    component="img"
                    src={shop.shop_image || PLACEHOLDER_IMAGES[shop.shop_id % PLACEHOLDER_IMAGES.length]}
                    alt={shop.shop_name}
                    sx={{
                      width: '100%', height: '100%', objectFit: 'cover',
                      transition: 'transform 0.4s',
                      '&:hover': { transform: 'scale(1.04)' },
                    }}
                    onError={e => { e.target.src = PLACEHOLDER_IMAGES[0]; }}
                  />
                  {shop.business_type_name && (
                    <Chip label={shop.business_type_name} size="small" sx={{
                      position: 'absolute', top: 12, left: 12,
                      bgcolor: 'rgba(30,77,183,0.85)', color: '#fff',
                      fontWeight: 600, fontSize: '0.7rem',
                    }} />
                  )}
                </Box>

                {/* Info */}
                <Box sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <StorefrontIcon sx={{ fontSize: 16, color: '#1e4db7' }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1a1a2e', fontSize: '0.95rem', lineHeight: 1.3 }}>
                      {shop.shop_name}
                    </Typography>
                  </Box>
                  {shop.city && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LocationOnIcon sx={{ fontSize: 14, color: '#9ca3af' }} />
                      <Typography variant="caption" sx={{ color: '#6b7280' }}>{shop.city}</Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            ))}
          </Box>

          {/* Next button */}
          <IconButton onClick={next} sx={{
            bgcolor: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
            '&:hover': { bgcolor: '#1e4db7', color: '#fff' },
            zIndex: 2, flexShrink: 0,
          }}>
            <ChevronRightIcon />
          </IconButton>
        </Box>

        {/* Dots */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 3 }}>
          {shops.map((_, i) => (
            <Box key={i} onClick={() => setCurrent(i)} sx={{
              width: i === current ? 24 : 8, height: 8,
              borderRadius: '4px',
              bgcolor: i === current ? '#1e4db7' : '#cbd5e1',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }} />
          ))}
        </Box>
      </Container>
    </Box>
  );
}

function Blog() {
  return (
    <PageTemplate
      heroBadge="Company · Industry Blog"
      heroTitle="Insights, Tips &"
      heroHighlight="Fashion Stories"
      heroSubtitle="Stay informed with the latest tailoring tips, fashion trends, and industry insights from the StitchyFlow team."
      features={features}
      ctaText="Read Latest Posts"
      sliderPage="/blog"
      extraSection={<BusinessSlider />}
    />
  );
}

export default Blog;
