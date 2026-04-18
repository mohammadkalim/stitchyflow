/**
 * Public Promotions & pricing page — hero slider, plan explorer, tailor-aware Standard vs Pro,
 * and checkout dialog. Local fallbacks: /promotions/promotions-1.png & promotions-2.png (Docs/UI/UX).
 *
 * Developer by: Muhammad Kalim
 * Phone/WhatsApp: +92 333 3836851
 * Product of LogixInventor (PVT) Ltd.
 * Email: info@logixinventor.com
 * Website: www.logixinventor.com
 */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Button,
  Chip,
  Switch,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  InputLabel,
  Alert,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useSliderImages } from '../components/SliderBanner';
import { apiFetch } from '../utils/api';

/** Aligns with tailor dashboard Services — beyond this count, Pro tier applies per shop. */
const MAX_STANDARD_SERVICES = 4;

const LOCAL_SLIDES = ['/promotions/promotions-1.png', '/promotions/promotions-2.png'];

const PLANS = [
  {
    key: 'standard',
    name: 'Standard',
    badge: null,
    monthlyPrice: 0,
    yearlyPrice: 0,
    desc: 'Ideal when you list up to four services per shop.',
    color: '#0f766e',
    btnVariant: 'outlined',
    btnColor: '#0f766e',
    features: [
      { text: `Up to ${MAX_STANDARD_SERVICES} service listings per shop`, included: true },
      { text: 'Business profile & shop page', included: true },
      { text: 'Orders & messaging', included: true },
      { text: 'Priority discovery', included: false },
      { text: 'Analytics dashboard', included: false },
      { text: 'Multiple shop locations', included: false },
      { text: 'Promotions toolkit', included: false },
      { text: 'Dedicated account manager', included: false },
    ],
  },
  {
    key: 'pro',
    name: 'Pro',
    badge: 'Most Popular',
    monthlyPrice: 1999,
    yearlyPrice: 1499,
    desc: 'For busy shops with more than four services or growing fast.',
    color: '#1d4ed8',
    btnVariant: 'contained',
    btnColor: '#1d4ed8',
    features: [
      { text: 'Unlimited service listings', included: true },
      { text: 'Business profile & shop page', included: true },
      { text: 'Orders & messaging', included: true },
      { text: 'Priority discovery', included: true },
      { text: 'Analytics dashboard', included: true },
      { text: 'Multiple shop locations', included: true },
      { text: 'Promotions toolkit', included: true },
      { text: 'Dedicated account manager', included: false },
    ],
  },
  {
    key: 'enterprise',
    name: 'Enterprise',
    badge: 'Best Value',
    monthlyPrice: 4999,
    yearlyPrice: 3999,
    desc: 'For large tailoring businesses and chains.',
    color: '#6d28d9',
    btnVariant: 'contained',
    btnColor: '#6d28d9',
    features: [
      { text: 'Unlimited service listings', included: true },
      { text: 'Unlimited tailor profiles', included: true },
      { text: 'Advanced order management', included: true },
      { text: 'Customer messaging', included: true },
      { text: 'Priority listing', included: true },
      { text: 'Analytics dashboard', included: true },
      { text: 'Multiple shop locations', included: true },
      { text: 'Dedicated account manager', included: true },
    ],
  },
];

const FAQS = [
  { q: 'Can I switch plans anytime?', a: 'Yes. Upgrades take effect immediately; downgrades follow your billing cycle.' },
  { q: 'When does Pro apply?', a: `Once a shop lists more than ${MAX_STANDARD_SERVICES} services, Pro features and pricing apply for that growth tier.` },
  { q: 'What payment methods are accepted?', a: 'JazzCash, EasyPaisa, bank transfer, and major cards — choose in checkout.' },
  { q: 'Can I cancel anytime?', a: 'Yes. No long-term lock-in on monthly plans.' },
];

function PromotionsHero({ children }) {
  const { images, current, prev, next, setCurrent } = useSliderImages('/promotions');
  const [localIdx, setLocalIdx] = useState(0);

  const useApi = images.length > 0;
  const slideCount = useApi ? images.length : LOCAL_SLIDES.length;
  const activeIdx = useApi ? current : localIdx;

  const goPrev = () => {
    if (useApi) prev();
    else setLocalIdx((i) => (i - 1 + LOCAL_SLIDES.length) % LOCAL_SLIDES.length);
  };
  const goNext = () => {
    if (useApi) next();
    else setLocalIdx((i) => (i + 1) % LOCAL_SLIDES.length);
  };

  const imgSrc = useApi ? images[activeIdx]?.image_url : LOCAL_SLIDES[localIdx];

  return (
    <Box
      sx={{
        mt: '64px',
        position: 'relative',
        overflow: 'hidden',
        minHeight: { xs: 300, md: 380 },
        textAlign: 'center',
      }}
    >
      <Box
        component="img"
        src={imgSrc}
        alt=""
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          zIndex: 0,
          display: 'block',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: 'linear-gradient(180deg, rgba(15,23,42,0.55) 0%, rgba(15,118,110,0.35) 100%)',
        }}
      />
      <IconButton
        onClick={goPrev}
        sx={{
          position: 'absolute',
          left: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 3,
          bgcolor: 'rgba(0,0,0,0.35)',
          color: '#fff',
          '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' },
        }}
        aria-label="Previous slide"
      >
        <ChevronLeftIcon />
      </IconButton>
      <IconButton
        onClick={goNext}
        sx={{
          position: 'absolute',
          right: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 3,
          bgcolor: 'rgba(0,0,0,0.35)',
          color: '#fff',
          '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' },
        }}
        aria-label="Next slide"
      >
        <ChevronRightIcon />
      </IconButton>
      <Box
        sx={{
          position: 'absolute',
          bottom: 14,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 0.75,
          zIndex: 3,
        }}
      >
        {Array.from({ length: slideCount }).map((_, i) => (
          <Box
            key={i}
            onClick={() => (useApi ? setCurrent(i) : setLocalIdx(i))}
            sx={{
              width: i === activeIdx ? 24 : 8,
              height: 8,
              borderRadius: '4px',
              bgcolor: i === activeIdx ? '#fff' : 'rgba(255,255,255,0.45)',
              cursor: 'pointer',
            }}
          />
        ))}
      </Box>
      <Box sx={{ position: 'relative', zIndex: 2 }}>{children}</Box>
    </Box>
  );
}

function PricingPayDialog({
  open,
  onClose,
  shop,
  shops,
  shopId,
  onShopChange,
  countByShop,
  yearly,
  onConfirmPay,
}) {
  const [tier, setTier] = useState('standard');
  const [payMethod, setPayMethod] = useState('jazzcash');

  const serviceCount = shop && countByShop ? countByShop[shop.shop_id] || 0 : 0;

  useEffect(() => {
    if (!open || !shop) return;
    setTier(serviceCount > MAX_STANDARD_SERVICES ? 'pro' : 'standard');
  }, [open, shop, serviceCount]);

  if (!shop) return null;

  const standardPlan = PLANS[0];
  const proPlan = PLANS[1];
  const proPrice = yearly ? proPlan.yearlyPrice : proPlan.monthlyPrice;
  const multiShop = Array.isArray(shops) && shops.length > 1;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        elevation: 0,
        sx: {
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          bgcolor: '#ffffff',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          py: 2.5,
          px: 3,
          borderBottom: '1px solid #f1f5f9',
          bgcolor: '#fafafa',
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.15rem', color: '#0f172a', letterSpacing: '-0.02em' }}>
            Checkout
          </Typography>
          <Typography sx={{ color: '#64748b', fontSize: '0.85rem', mt: 0.5 }}>
            {shop.shop_name} · {serviceCount} service{serviceCount === 1 ? '' : 's'} listed
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose} aria-label="Close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ px: 3, py: 3, bgcolor: '#ffffff' }}>
        {multiShop && (
          <FormControl fullWidth size="small" sx={{ mb: 2.5 }}>
            <InputLabel id="promo-pay-shop-label">Business</InputLabel>
            <Select
              labelId="promo-pay-shop-label"
              label="Business"
              value={String(shopId)}
              onChange={(e) => onShopChange(e.target.value)}
              sx={{ borderRadius: '12px' }}
            >
              {shops.map((s) => (
                <MenuItem key={s.shop_id} value={String(s.shop_id)}>
                  {s.shop_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {serviceCount > MAX_STANDARD_SERVICES && (
          <Alert severity="info" sx={{ mb: 2.5, borderRadius: '12px', bgcolor: '#eff6ff', border: '1px solid #bfdbfe' }}>
            This shop has more than {MAX_STANDARD_SERVICES} services — <strong>Pro</strong> is the recommended tier.
          </Alert>
        )}
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              onClick={() => setTier('standard')}
              sx={{
                p: 2.5,
                borderRadius: '16px',
                cursor: 'pointer',
                border: tier === 'standard' ? `2px solid ${standardPlan.color}` : '1px solid #e2e8f0',
                bgcolor: tier === 'standard' ? 'rgba(15,118,110,0.06)' : '#fff',
                transition: 'all 0.2s',
                height: '100%',
              }}
            >
              <Typography sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>{standardPlan.name}</Typography>
              <Typography sx={{ fontSize: '0.8rem', color: '#64748b', mb: 2, minHeight: 40 }}>{standardPlan.desc}</Typography>
              <Typography sx={{ fontWeight: 900, fontSize: '1.75rem', color: standardPlan.color }}>Free</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8' }}>PKR 0 / mo</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              onClick={() => setTier('pro')}
              sx={{
                p: 2.5,
                borderRadius: '16px',
                cursor: 'pointer',
                border: tier === 'pro' ? `2px solid ${proPlan.color}` : '1px solid #e2e8f0',
                bgcolor: tier === 'pro' ? 'rgba(29,78,216,0.06)' : '#fff',
                transition: 'all 0.2s',
                height: '100%',
                position: 'relative',
              }}
            >
              <Chip
                label={proPlan.badge}
                size="small"
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  bgcolor: proPlan.color,
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.65rem',
                }}
              />
              <Typography sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5, pr: 10 }}>{proPlan.name}</Typography>
              <Typography sx={{ fontSize: '0.8rem', color: '#64748b', mb: 2, minHeight: 40 }}>{proPlan.desc}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: '#64748b' }}>PKR</Typography>
                <Typography sx={{ fontWeight: 900, fontSize: '1.75rem', color: proPlan.color }}>
                  {proPrice.toLocaleString()}
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: '#64748b' }}>/ mo</Typography>
              </Box>
              {yearly && (
                <Typography sx={{ fontSize: '0.72rem', color: '#16a34a', mt: 0.5 }}>Billed yearly — save vs monthly</Typography>
              )}
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <FormControl component="fieldset" fullWidth>
          <FormLabel sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem', mb: 1.5 }}>
            Payment method
          </FormLabel>
          <RadioGroup row value={payMethod} onChange={(e) => setPayMethod(e.target.value)}>
            <FormControlLabel value="jazzcash" control={<Radio size="small" />} label="JazzCash" sx={{ mr: 2 }} />
            <FormControlLabel value="easypaisa" control={<Radio size="small" />} label="EasyPaisa" sx={{ mr: 2 }} />
            <FormControlLabel value="card" control={<Radio size="small" />} label="Card" />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2.5, borderTop: '1px solid #f1f5f9', bgcolor: '#fafafa', gap: 1 }}>
        <Button onClick={onClose} sx={{ textTransform: 'none', color: '#64748b' }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => onConfirmPay(tier, payMethod)}
          startIcon={<PaymentsOutlinedIcon />}
          sx={{
            textTransform: 'none',
            fontWeight: 700,
            borderRadius: '12px',
            px: 3,
            py: 1,
            bgcolor: '#0f766e',
            boxShadow: 'none',
            '&:hover': { bgcolor: '#115e59', boxShadow: 'none' },
          }}
        >
          Complete &amp; view shop
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function Promotions() {
  const navigate = useNavigate();
  const [yearly, setYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(1);
  const [tailorCtx, setTailorCtx] = useState(null);
  const [payOpen, setPayOpen] = useState(false);
  const [payShopId, setPayShopId] = useState('');

  const user = useMemo(() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const loadTailorContext = useCallback(async () => {
    if (!user || user.role !== 'tailor') {
      setTailorCtx(null);
      return;
    }
    try {
      const [shopsRes, servicesRes] = await Promise.all([
        apiFetch('/business/shops/enriched', { cache: 'no-store' }),
        apiFetch('/business/services', { cache: 'no-store' }),
      ]);
      const shops = shopsRes.data || [];
      const services = servicesRes.data || [];
      const countByShop = {};
      shops.forEach((s) => {
        countByShop[s.shop_id] = 0;
      });
      services.forEach((sv) => {
        if (countByShop[sv.shop_id] != null) countByShop[sv.shop_id] += 1;
      });
      setTailorCtx({ shops, services, countByShop });
    } catch {
      setTailorCtx(null);
    }
  }, [user]);

  useEffect(() => {
    void loadTailorContext();
  }, [loadTailorContext]);

  useEffect(() => {
    if (tailorCtx?.shops?.length && !payShopId) {
      setPayShopId(String(tailorCtx.shops[0].shop_id));
    }
  }, [tailorCtx, payShopId]);

  const selectedPayShop = useMemo(() => {
    if (!tailorCtx?.shops?.length) return null;
    return tailorCtx.shops.find((s) => String(s.shop_id) === String(payShopId)) || tailorCtx.shops[0];
  }, [tailorCtx, payShopId]);

  const handleConfirmPay = (tier, method) => {
    const shop = selectedPayShop;
    if (!shop) return;
    void tier;
    void method;
    setPayOpen(false);
    navigate(`/tailor-shops/view/${shop.shop_id}`);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#ffffff' }}>
      <Header />

      <PromotionsHero>
        <Container maxWidth="md" sx={{ position: 'relative', py: { xs: 7, md: 10 } }}>
          <Chip
            label="Pricing & plans"
            sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 600, mb: 3, fontSize: '0.8rem' }}
          />
          <Typography variant="h2" sx={{ fontWeight: 800, color: '#fff', fontSize: { xs: '2rem', md: '3rem' }, mb: 2 }}>
            Simple, transparent{' '}
            <Box component="span" sx={{ color: '#5eead4' }}>
              pricing
            </Box>
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.88)', maxWidth: 520, mx: 'auto', lineHeight: 1.8, mb: 4 }}>
            After you create a business, manage rates here. More than {MAX_STANDARD_SERVICES} services per shop unlocks Pro.
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            <Typography variant="body2" sx={{ color: yearly ? 'rgba(255,255,255,0.5)' : '#fff', fontWeight: 600 }}>
              Monthly
            </Typography>
            <Switch
              checked={yearly}
              onChange={(e) => setYearly(e.target.checked)}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': { color: '#5eead4' },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#5eead4' },
              }}
            />
            <Typography variant="body2" sx={{ color: yearly ? '#fff' : 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
              Yearly
            </Typography>
            <Chip label="Save 25%" size="small" sx={{ bgcolor: '#f59e0b', color: '#fff', fontWeight: 700, fontSize: '0.7rem' }} />
          </Box>
        </Container>
      </PromotionsHero>

      {tailorCtx && tailorCtx.shops.length > 0 && (
        <Box sx={{ bgcolor: '#ffffff', borderBottom: '1px solid #f1f5f9' }}>
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>
              Your businesses
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 2.5 }}>
              Pricing reflects how many services each shop lists. Pay here to jump to your public shop page.
            </Typography>
            <Paper
              elevation={0}
              sx={{
                borderRadius: '16px',
                border: '1px solid #e8ecf1',
                overflow: 'hidden',
              }}
            >
              {tailorCtx.shops.map((s) => {
                const n = tailorCtx.countByShop[s.shop_id] || 0;
                const needsPro = n > MAX_STANDARD_SERVICES;
                return (
                  <Box
                    key={s.shop_id}
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 2,
                      px: 2.5,
                      py: 2,
                      borderBottom: '1px solid #f1f5f9',
                      '&:last-child': { borderBottom: 'none' },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <StorefrontOutlinedIcon sx={{ color: '#0f766e' }} />
                      <Box>
                        <Typography sx={{ fontWeight: 700, color: '#0f172a' }}>{s.shop_name}</Typography>
                        <Typography sx={{ fontSize: '0.8rem', color: '#64748b' }}>
                          {n} service{n === 1 ? '' : 's'} · {needsPro ? 'Pro tier' : 'Standard tier'}
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      variant="contained"
                      onClick={() => {
                        setPayShopId(String(s.shop_id));
                        setPayOpen(true);
                      }}
                      sx={{
                        bgcolor: '#0f766e',
                        textTransform: 'none',
                        fontWeight: 700,
                        borderRadius: '12px',
                        px: 2.5,
                        boxShadow: 'none',
                        '&:hover': { bgcolor: '#115e59', boxShadow: 'none' },
                      }}
                    >
                      Pay &amp; open shop
                    </Button>
                  </Box>
                );
              })}
            </Paper>
            {tailorCtx.shops.length > 1 && (
              <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mt: 1.5 }}>
                Use the checkout to pick Standard or Pro before opening the selected shop.
              </Typography>
            )}
          </Container>
        </Box>
      )}

      <Container maxWidth="lg" sx={{ py: 8, bgcolor: '#ffffff' }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>
            Select your plan
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Drag the slider to compare Standard, Pro, and Enterprise
          </Typography>
        </Box>

        <Box sx={{ px: { xs: 2, md: 8 }, mb: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
            {PLANS.map((p, i) => (
              <Box key={p.name} onClick={() => setSelectedPlan(i)} sx={{ textAlign: 'center', cursor: 'pointer', flex: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: selectedPlan === i ? 700 : 500,
                    color: selectedPlan === i ? PLANS[i].color : '#94a3b8',
                    transition: 'all 0.2s',
                    fontSize: '0.9rem',
                  }}
                >
                  {p.name}
                </Typography>
                {p.badge && (
                  <Chip
                    label={p.badge}
                    size="small"
                    sx={{
                      bgcolor: selectedPlan === i ? p.color : '#f1f5f9',
                      color: selectedPlan === i ? '#fff' : '#94a3b8',
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      height: 18,
                      mt: 0.3,
                    }}
                  />
                )}
              </Box>
            ))}
          </Box>

          <Box sx={{ position: 'relative', height: 48, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ position: 'absolute', left: 0, right: 0, height: 6, bgcolor: '#f1f5f9', borderRadius: '10px' }} />
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                height: 6,
                width: `${(selectedPlan / (PLANS.length - 1)) * 100}%`,
                bgcolor: PLANS[selectedPlan].color,
                borderRadius: '10px',
                transition: 'width 0.3s ease, background-color 0.3s ease',
              }}
            />
            {PLANS.map((p, i) => {
              const pct = i === 0 ? 0 : i === PLANS.length - 1 ? 100 : (i / (PLANS.length - 1)) * 100;
              const isActive = i <= selectedPlan;
              const isCurrent = i === selectedPlan;
              return (
                <Box
                  key={p.name}
                  onClick={() => setSelectedPlan(i)}
                  sx={{
                    position: 'absolute',
                    left: `calc(${pct}% - ${isCurrent ? 14 : 8}px)`,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    transition: 'all 0.25s',
                    zIndex: isCurrent ? 3 : 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 0,
                      height: 0,
                      borderLeft: `${isCurrent ? 8 : 5}px solid transparent`,
                      borderRight: `${isCurrent ? 8 : 5}px solid transparent`,
                      borderBottom: `${isCurrent ? 12 : 8}px solid ${isActive ? p.color : '#e2e8f0'}`,
                      mb: '-1px',
                      transition: 'all 0.25s',
                    }}
                  />
                  <Box
                    sx={{
                      width: isCurrent ? 28 : 18,
                      height: isCurrent ? 28 : 18,
                      borderRadius: '50%',
                      bgcolor: isActive ? p.color : '#e2e8f0',
                      border: `3px solid ${isCurrent ? '#fff' : 'transparent'}`,
                      boxShadow: isCurrent ? `0 0 0 3px ${p.color}40, 0 4px 12px ${p.color}50` : 'none',
                      transition: 'all 0.25s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isCurrent && <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#fff' }} />}
                  </Box>
                  <Box
                    sx={{
                      width: 0,
                      height: 0,
                      borderLeft: `${isCurrent ? 8 : 5}px solid transparent`,
                      borderRight: `${isCurrent ? 8 : 5}px solid transparent`,
                      borderTop: `${isCurrent ? 12 : 8}px solid ${isActive ? p.color : '#e2e8f0'}`,
                      mt: '-1px',
                      transition: 'all 0.25s',
                    }}
                  />
                </Box>
              );
            })}
            <Box
              component="input"
              type="range"
              min={0}
              max={PLANS.length - 1}
              step={1}
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(Number(e.target.value))}
              sx={{
                position: 'absolute',
                left: 0,
                right: 0,
                width: '100%',
                opacity: 0,
                cursor: 'pointer',
                height: 48,
                zIndex: 4,
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            {PLANS.map((p, i) => (
              <Box key={p.name} sx={{ textAlign: 'center', flex: 1 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: selectedPlan === i ? p.color : '#94a3b8',
                    fontWeight: selectedPlan === i ? 700 : 400,
                    fontSize: '0.78rem',
                  }}
                >
                  {p.monthlyPrice === 0 ? 'Free' : `PKR ${(yearly ? p.yearlyPrice : p.monthlyPrice).toLocaleString()}/mo`}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {(() => {
          const plan = PLANS[selectedPlan];
          return (
            <Paper
              elevation={0}
              sx={{
                borderRadius: '24px',
                border: `1px solid #e8ecf1`,
                boxShadow: '0 12px 48px rgba(15,23,42,0.06)',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
              }}
            >
              <Box
                sx={{
                  background: `linear-gradient(135deg, ${plan.color} 0%, ${plan.color}cc 100%)`,
                  px: { xs: 3, sm: 5 },
                  py: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 2,
                }}
              >
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff' }}>
                      {plan.name}
                    </Typography>
                    {plan.badge && (
                      <Chip label={plan.badge} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.25)', color: '#fff', fontWeight: 700 }} />
                    )}
                  </Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                    {plan.desc}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  {plan.monthlyPrice === 0 ? (
                    <Typography variant="h2" sx={{ fontWeight: 900, color: '#fff' }}>
                      Free
                    </Typography>
                  ) : (
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.5, justifyContent: 'flex-end' }}>
                        <Typography sx={{ color: 'rgba(255,255,255,0.85)', mb: 0.8, fontSize: '0.9rem' }}>PKR</Typography>
                        <Typography variant="h2" sx={{ fontWeight: 900, color: '#fff', lineHeight: 1 }}>
                          {(yearly ? plan.yearlyPrice : plan.monthlyPrice).toLocaleString()}
                        </Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.85)', mb: 0.8 }}>/mo</Typography>
                      </Box>
                      {yearly && (
                        <Typography
                          variant="caption"
                          sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,0.2)', px: 1.5, py: 0.4, borderRadius: '20px' }}
                        >
                          Save PKR {((plan.monthlyPrice - plan.yearlyPrice) * 12).toLocaleString()}/year
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>
              </Box>

              <Box sx={{ p: { xs: 3, sm: 5 }, bgcolor: '#ffffff' }}>
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  {plan.features.map((f) => (
                    <Grid item xs={12} sm={6} key={f.text}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        {f.included ? (
                          <CheckCircleIcon sx={{ fontSize: 20, color: '#0d9488', flexShrink: 0 }} />
                        ) : (
                          <CancelIcon sx={{ fontSize: 20, color: '#e2e8f0', flexShrink: 0 }} />
                        )}
                        <Typography
                          variant="body2"
                          sx={{ color: f.included ? '#334155' : '#94a3b8', fontWeight: f.included ? 500 : 400 }}
                        >
                          {f.text}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{
                    bgcolor: plan.color,
                    color: '#fff',
                    fontWeight: 700,
                    borderRadius: '12px',
                    px: 6,
                    py: 1.6,
                    textTransform: 'none',
                    fontSize: '1rem',
                    boxShadow: 'none',
                    '&:hover': { bgcolor: plan.color, filter: 'brightness(0.92)', boxShadow: 'none' },
                  }}
                >
                  {plan.monthlyPrice === 0 ? 'Get started free' : 'Start 14-day trial'}
                </Button>
              </Box>
            </Paper>
          );
        })()}
      </Container>

      <Box sx={{ bgcolor: '#ffffff', py: 8, borderTop: '1px solid #f1f5f9' }}>
        <Container maxWidth="md">
          <Typography variant="h4" sx={{ fontWeight: 800, textAlign: 'center', color: '#0f172a', mb: 1 }}>
            Frequently asked questions
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'center', color: '#64748b', mb: 6 }}>
            Billing, tiers, and your shop page
          </Typography>
          <Grid container spacing={3}>
            {FAQS.map((faq) => (
              <Grid item xs={12} md={6} key={faq.q}>
                <Paper
                  elevation={0}
                  sx={{ p: 3, borderRadius: '14px', border: '1px solid #e8ecf1', height: '100%', bgcolor: '#fafafa' }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 700, color: '#0f172a', mb: 1 }}>
                    {faq.q}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.7 }}>
                    {faq.a}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box
        sx={{
          py: 7,
          textAlign: 'center',
          bgcolor: '#ffffff',
          borderTop: '1px solid #f1f5f9',
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mb: 1.5 }}>
            Ready to grow your business?
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', mb: 4 }}>
            Join tailors already listing on StitchyFlow.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/register')}
            sx={{
              bgcolor: '#0f766e',
              color: '#fff',
              fontWeight: 700,
              borderRadius: '12px',
              px: 5,
              py: 1.5,
              fontSize: '0.95rem',
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': { bgcolor: '#115e59', boxShadow: 'none' },
            }}
          >
            Start free today
          </Button>
        </Container>
      </Box>

      <Footer />

      <PricingPayDialog
        open={payOpen}
        onClose={() => setPayOpen(false)}
        shop={selectedPayShop}
        shops={tailorCtx?.shops}
        shopId={payShopId}
        onShopChange={(id) => setPayShopId(String(id))}
        countByShop={tailorCtx?.countByShop}
        yearly={yearly}
        onConfirmPay={handleConfirmPay}
      />
    </Box>
  );
}

export default Promotions;
