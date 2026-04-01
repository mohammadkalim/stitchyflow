import React, { useState } from 'react';
import {
  Box, Typography, Container, Grid, Paper, Button, Chip, Switch, Divider
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PLANS = [
  {
    name: 'Starter',
    badge: null,
    monthlyPrice: 0,
    yearlyPrice: 0,
    desc: 'Perfect for individual tailors just getting started.',
    color: '#6b7280',
    btnVariant: 'outlined',
    btnColor: '#6b7280',
    features: [
      { text: 'Up to 5 orders/month',       included: true },
      { text: '1 tailor profile',            included: true },
      { text: 'Basic order management',      included: true },
      { text: 'Customer messaging',          included: true },
      { text: 'Priority listing',            included: false },
      { text: 'Analytics dashboard',         included: false },
      { text: 'Multiple shop locations',     included: false },
      { text: 'Dedicated account manager',   included: false },
    ],
  },
  {
    name: 'Professional',
    badge: 'Most Popular',
    monthlyPrice: 1999,
    yearlyPrice: 1499,
    desc: 'Ideal for growing tailoring businesses.',
    color: '#2563eb',
    btnVariant: 'contained',
    btnColor: '#2563eb',
    features: [
      { text: 'Unlimited orders',            included: true },
      { text: 'Up to 5 tailor profiles',     included: true },
      { text: 'Advanced order management',   included: true },
      { text: 'Customer messaging',          included: true },
      { text: 'Priority listing',            included: true },
      { text: 'Analytics dashboard',         included: true },
      { text: 'Multiple shop locations',     included: false },
      { text: 'Dedicated account manager',   included: false },
    ],
  },
  {
    name: 'Enterprise',
    badge: 'Best Value',
    monthlyPrice: 4999,
    yearlyPrice: 3999,
    desc: 'For large tailoring businesses and chains.',
    color: '#7c3aed',
    btnVariant: 'contained',
    btnColor: '#7c3aed',
    features: [
      { text: 'Unlimited orders',            included: true },
      { text: 'Unlimited tailor profiles',   included: true },
      { text: 'Advanced order management',   included: true },
      { text: 'Customer messaging',          included: true },
      { text: 'Priority listing',            included: true },
      { text: 'Analytics dashboard',         included: true },
      { text: 'Multiple shop locations',     included: true },
      { text: 'Dedicated account manager',   included: true },
    ],
  },
];

const FAQS = [
  { q: 'Can I switch plans anytime?', a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.' },
  { q: 'Is there a free trial?', a: 'Yes! The Starter plan is free forever. Professional and Enterprise plans come with a 14-day free trial.' },
  { q: 'What payment methods are accepted?', a: 'We accept JazzCash, EasyPaisa, bank transfer, and all major credit/debit cards.' },
  { q: 'Can I cancel anytime?', a: 'Absolutely. No contracts, no cancellation fees. Cancel anytime from your dashboard.' },
];

function Promotions() {
  const navigate = useNavigate();
  const [yearly, setYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(1); // default Professional

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <Header />

      {/* Hero */}
      <Box sx={{
        mt: '64px',
        background: 'linear-gradient(135deg, #1a3a8f 0%, #1e4db7 40%, #1565c0 65%, #0d7a6e 100%)',
        py: { xs: 7, md: 10 },
        textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <Box sx={{ position: 'absolute', top: -60, right: -60, width: 280, height: 280, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)' }} />
        <Container maxWidth="md">
          <Chip label="Pricing & Promotions" sx={{ bgcolor: 'rgba(255,255,255,0.12)', color: '#fff', fontWeight: 600, mb: 3, fontSize: '0.8rem' }} />
          <Typography variant="h2" sx={{ fontWeight: 800, color: '#fff', fontSize: { xs: '2rem', md: '3rem' }, mb: 2 }}>
            Simple, Transparent{' '}
            <Box component="span" sx={{ color: '#f59e0b' }}>Pricing</Box>
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', maxWidth: 480, mx: 'auto', lineHeight: 1.8, mb: 4 }}>
            Choose the plan that fits your tailoring business. No hidden fees, no surprises.
          </Typography>

          {/* Billing Toggle */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
            <Typography variant="body2" sx={{ color: yearly ? 'rgba(255,255,255,0.5)' : '#fff', fontWeight: 600 }}>Monthly</Typography>
            <Switch checked={yearly} onChange={(e) => setYearly(e.target.checked)}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': { color: '#f59e0b' },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#f59e0b' },
              }} />
            <Typography variant="body2" sx={{ color: yearly ? '#fff' : 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
              Yearly
            </Typography>
            <Chip label="Save 25%" size="small" sx={{ bgcolor: '#f59e0b', color: '#fff', fontWeight: 700, fontSize: '0.7rem' }} />
          </Box>
        </Container>
      </Box>

      {/* Pricing Slider Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Plan Selector Slider */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 1 }}>
            Select Your Plan
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280' }}>
            Drag the slider to explore plans
          </Typography>
        </Box>

        {/* Thorn Slider Track */}
        <Box sx={{ px: { xs: 2, md: 8 }, mb: 6 }}>
          {/* Plan Labels */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
            {PLANS.map((p, i) => (
              <Box key={p.name} onClick={() => setSelectedPlan(i)}
                sx={{ textAlign: 'center', cursor: 'pointer', flex: 1 }}>
                <Typography variant="body2" sx={{
                  fontWeight: selectedPlan === i ? 700 : 500,
                  color: selectedPlan === i ? PLANS[i].color : '#9ca3af',
                  transition: 'all 0.2s',
                  fontSize: '0.9rem',
                }}>
                  {p.name}
                </Typography>
                {p.badge && (
                  <Chip label={p.badge} size="small" sx={{
                    bgcolor: selectedPlan === i ? p.color : '#e5e7eb',
                    color: selectedPlan === i ? '#fff' : '#9ca3af',
                    fontSize: '0.62rem', fontWeight: 700, height: 18, mt: 0.3,
                  }} />
                )}
              </Box>
            ))}
          </Box>

          {/* Slider Track with Thorns */}
          <Box sx={{ position: 'relative', height: 48, display: 'flex', alignItems: 'center' }}>
            {/* Track background */}
            <Box sx={{
              position: 'absolute', left: 0, right: 0, height: 6,
              bgcolor: '#e5e7eb', borderRadius: '10px',
            }} />
            {/* Active fill */}
            <Box sx={{
              position: 'absolute', left: 0, height: 6,
              width: `${(selectedPlan / (PLANS.length - 1)) * 100}%`,
              bgcolor: PLANS[selectedPlan].color,
              borderRadius: '10px',
              transition: 'width 0.3s ease, background-color 0.3s ease',
            }} />

            {/* Thorn notches */}
            {PLANS.map((p, i) => {
              const pct = i === 0 ? 0 : i === PLANS.length - 1 ? 100 : (i / (PLANS.length - 1)) * 100;
              const isActive = i <= selectedPlan;
              const isCurrent = i === selectedPlan;
              return (
                <Box key={p.name} onClick={() => setSelectedPlan(i)}
                  sx={{
                    position: 'absolute',
                    left: `calc(${pct}% - ${isCurrent ? 14 : 8}px)`,
                    cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    transition: 'all 0.25s',
                    zIndex: isCurrent ? 3 : 2,
                  }}>
                  {/* Thorn spike above */}
                  <Box sx={{
                    width: 0, height: 0,
                    borderLeft: `${isCurrent ? 8 : 5}px solid transparent`,
                    borderRight: `${isCurrent ? 8 : 5}px solid transparent`,
                    borderBottom: `${isCurrent ? 12 : 8}px solid ${isActive ? p.color : '#d1d5db'}`,
                    mb: '-1px',
                    transition: 'all 0.25s',
                  }} />
                  {/* Circle knob */}
                  <Box sx={{
                    width: isCurrent ? 28 : 18,
                    height: isCurrent ? 28 : 18,
                    borderRadius: '50%',
                    bgcolor: isActive ? p.color : '#d1d5db',
                    border: `3px solid ${isCurrent ? '#fff' : 'transparent'}`,
                    boxShadow: isCurrent ? `0 0 0 3px ${p.color}40, 0 4px 12px ${p.color}50` : 'none',
                    transition: 'all 0.25s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {isCurrent && (
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#fff' }} />
                    )}
                  </Box>
                  {/* Thorn spike below */}
                  <Box sx={{
                    width: 0, height: 0,
                    borderLeft: `${isCurrent ? 8 : 5}px solid transparent`,
                    borderRight: `${isCurrent ? 8 : 5}px solid transparent`,
                    borderTop: `${isCurrent ? 12 : 8}px solid ${isActive ? p.color : '#d1d5db'}`,
                    mt: '-1px',
                    transition: 'all 0.25s',
                  }} />
                </Box>
              );
            })}

            {/* Invisible range input for drag */}
            <Box
              component="input"
              type="range"
              min={0} max={PLANS.length - 1} step={1}
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(Number(e.target.value))}
              sx={{
                position: 'absolute', left: 0, right: 0, width: '100%',
                opacity: 0, cursor: 'pointer', height: 48, zIndex: 4,
              }}
            />
          </Box>

          {/* Price display under slider */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            {PLANS.map((p, i) => (
              <Box key={p.name} sx={{ textAlign: 'center', flex: 1 }}>
                <Typography variant="caption" sx={{
                  color: selectedPlan === i ? p.color : '#9ca3af',
                  fontWeight: selectedPlan === i ? 700 : 400,
                  fontSize: '0.78rem',
                }}>
                  {p.monthlyPrice === 0 ? 'Free' : `PKR ${(yearly ? p.yearlyPrice : p.monthlyPrice).toLocaleString()}/mo`}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Selected Plan Card */}
        {(() => {
          const plan = PLANS[selectedPlan];
          return (
            <Paper elevation={0} sx={{
              borderRadius: '24px',
              border: `2px solid ${plan.color}`,
              boxShadow: `0 12px 48px ${plan.color}25`,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
            }}>
              {/* Card Header */}
              <Box sx={{
                background: `linear-gradient(135deg, ${plan.color} 0%, ${plan.color}cc 100%)`,
                px: 5, py: 4,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexWrap: 'wrap', gap: 2,
              }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff' }}>{plan.name}</Typography>
                    {plan.badge && (
                      <Chip label={plan.badge} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.25)', color: '#fff', fontWeight: 700 }} />
                    )}
                  </Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>{plan.desc}</Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  {plan.monthlyPrice === 0 ? (
                    <Typography variant="h2" sx={{ fontWeight: 900, color: '#fff' }}>Free</Typography>
                  ) : (
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.5, justifyContent: 'flex-end' }}>
                        <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 0.8, fontSize: '0.9rem' }}>PKR</Typography>
                        <Typography variant="h2" sx={{ fontWeight: 900, color: '#fff', lineHeight: 1 }}>
                          {(yearly ? plan.yearlyPrice : plan.monthlyPrice).toLocaleString()}
                        </Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.7)', mb: 0.8 }}>/mo</Typography>
                      </Box>
                      {yearly && (
                        <Typography variant="caption" sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,0.2)', px: 1.5, py: 0.4, borderRadius: '20px' }}>
                          Save PKR {((plan.monthlyPrice - plan.yearlyPrice) * 12).toLocaleString()}/year
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Features Grid */}
              <Box sx={{ p: 5, bgcolor: '#fff' }}>
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  {plan.features.map((f) => (
                    <Grid item xs={12} sm={6} key={f.text}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        {f.included
                          ? <CheckCircleIcon sx={{ fontSize: 20, color: '#10b981', flexShrink: 0 }} />
                          : <CancelIcon sx={{ fontSize: 20, color: '#d1d5db', flexShrink: 0 }} />}
                        <Typography variant="body2" sx={{ color: f.included ? '#374151' : '#9ca3af', fontWeight: f.included ? 500 : 400 }}>
                          {f.text}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                <Button variant="contained" size="large" onClick={() => navigate('/register')}
                  sx={{
                    bgcolor: plan.color, color: '#fff', fontWeight: 700,
                    borderRadius: '12px', px: 6, py: 1.6,
                    textTransform: 'none', fontSize: '1rem',
                    boxShadow: `0 6px 20px ${plan.color}40`,
                    '&:hover': { bgcolor: plan.color, filter: 'brightness(0.9)' },
                  }}>
                  {plan.monthlyPrice === 0 ? 'Get Started Free' : 'Start 14-Day Free Trial'}
                </Button>
              </Box>
            </Paper>
          );
        })()}
      </Container>

      {/* FAQ */}
      <Box sx={{ bgcolor: '#fff', py: 8 }}>
        <Container maxWidth="md">
          <Typography variant="h4" sx={{ fontWeight: 800, textAlign: 'center', color: '#1a1a2e', mb: 1 }}>
            Frequently Asked Questions
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'center', color: '#6b7280', mb: 6 }}>
            Everything you need to know about our pricing
          </Typography>
          <Grid container spacing={3}>
            {FAQS.map((faq) => (
              <Grid item xs={12} md={6} key={faq.q}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: '14px', border: '1px solid #e5e7eb', height: '100%' }}>
                  <Typography variant="body1" sx={{ fontWeight: 700, color: '#1a1a2e', mb: 1 }}>{faq.q}</Typography>
                  <Typography variant="body2" sx={{ color: '#6b7280', lineHeight: 1.7 }}>{faq.a}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Bottom CTA */}
      <Box sx={{
        py: 7, textAlign: 'center',
        background: 'linear-gradient(135deg, #1a3a8f 0%, #1e4db7 50%, #0d7a6e 100%)',
      }}>
        <Container maxWidth="sm">
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', mb: 1.5 }}>
            Ready to Grow Your Business?
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.75)', mb: 4 }}>
            Join 500+ tailors already growing with StitchyFlow.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/register')}
            sx={{
              bgcolor: '#f59e0b', color: '#fff', fontWeight: 700,
              borderRadius: '10px', px: 5, py: 1.5, fontSize: '0.95rem',
              textTransform: 'none',
              '&:hover': { bgcolor: '#d97706' },
            }}>
            Start Free Today
          </Button>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}

export default Promotions;
