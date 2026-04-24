/**
 * Shared “Compare plans” UI (My Businesses payment modal & Promotions page).
 * Developer by: Muhammad Kalim · Product of LogixInventor (PVT) Ltd.
 */
import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Chip,
  Divider,
  Stack,
  Slider,
  IconButton,
  CircularProgress,
} from '@mui/material';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import CloseIcon from '@mui/icons-material/Close';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { PAYMENT_PRICING_TIERS } from './paymentPlanTiers';

export function BusinessPlanPaymentHeader({ onClose }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', pb: onClose ? 1 : 0, pt: onClose ? 2.25 : 0, px: onClose ? { xs: 2, sm: 3 } : 0, bgcolor: onClose ? '#f9fafb' : 'transparent', borderBottom: onClose ? '1px solid #e5e7eb' : 'none' }}>
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
        <Box sx={{ width: 44, height: 44, borderRadius: '10px', bgcolor: onClose ? '#fff' : '#fff', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CreditCardOutlinedIcon sx={{ color: '#111827', fontSize: 24 }} />
        </Box>
        <Box>
          <Typography sx={{ fontSize: '0.6875rem', fontWeight: 700, color: '#6b7280', letterSpacing: '0.1em', textTransform: 'uppercase', mb: 0.5 }}>
            Payment required
          </Typography>
          <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#111827', lineHeight: 1.25 }}>
            Add another business
          </Typography>
          <Typography sx={{ color: '#6b7280', fontSize: '0.8125rem', mt: 0.5, maxWidth: 520 }}>
            Your plan includes one business. Choose a package below, then continue to secure checkout.
          </Typography>
        </Box>
      </Box>
      {onClose ? (
        <IconButton size="small" onClick={onClose} sx={{ color: '#6b7280', border: '1px solid #d1d5db', borderRadius: '8px' }} aria-label="Close">
          <CloseIcon fontSize="small" />
        </IconButton>
      ) : null}
    </Box>
  );
}

export function BusinessPlanComparisonBody({ tierIndex, onTierChange, disabled }) {
  return (
    <Box sx={{ px: { xs: 2, sm: 3 }, pt: 2.5, pb: 1, bgcolor: '#f3f4f6' }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 2.25 },
          mb: 2.5,
          borderRadius: '10px',
          border: '1px solid #e5e7eb',
          bgcolor: '#ffffff',
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.06)',
        }}
      >
        <Typography sx={{ fontSize: '0.6875rem', fontWeight: 800, color: '#6b7280', letterSpacing: '0.1em', textTransform: 'uppercase', mb: 1.5 }}>
          Compare plans — slide or tap a tier
        </Typography>
        <Box sx={{ px: { xs: 0.5, sm: 2 }, pt: 0.5, pb: 0.25 }}>
          <Slider
            value={tierIndex}
            onChange={(_, v) => onTierChange(v)}
            min={0}
            max={2}
            step={1}
            marks={[{ value: 0 }, { value: 1 }, { value: 2 }]}
            disabled={disabled}
            sx={{
              color: '#111827',
              height: 8,
              '& .MuiSlider-track': { border: 'none', bgcolor: '#111827', borderRadius: '4px' },
              '& .MuiSlider-rail': { bgcolor: '#e5e7eb', opacity: 1, borderRadius: '4px' },
              '& .MuiSlider-thumb': {
                width: 24,
                height: 24,
                bgcolor: '#fff',
                border: '2px solid #111827',
                '&:hover, &.Mui-focusVisible': { boxShadow: '0 0 0 8px rgba(17, 24, 39, 0.1)' },
              },
              '& .MuiSlider-mark': {
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: '#d1d5db',
                opacity: 1,
                '&.MuiSlider-markActive': { bgcolor: '#111827' },
              },
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', px: { xs: 0, sm: 0.5 }, mt: 1, gap: 1 }}>
          {PAYMENT_PRICING_TIERS.map((tier, i) => {
            const active = tierIndex === i;
            return (
              <Box
                key={tier.key}
                component="button"
                type="button"
                disabled={disabled}
                onClick={() => onTierChange(i)}
                sx={{
                  flex: 1,
                  minWidth: 0,
                  textAlign: 'center',
                  cursor: disabled ? 'default' : 'pointer',
                  border: 'none',
                  bgcolor: active ? '#f3f4f6' : 'transparent',
                  borderRadius: '8px',
                  py: 1,
                  px: 0.5,
                  transition: 'background 0.15s',
                  '&:hover': { bgcolor: disabled ? undefined : '#f9fafb' },
                }}
              >
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: active ? 800 : 600, color: active ? '#111827' : '#6b7280', lineHeight: 1.3 }}>
                  {tier.name}
                </Typography>
                <Typography sx={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: 600, mt: 0.25 }}>
                  Rs {tier.price.toLocaleString()}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Paper>

      <Grid container spacing={2} sx={{ mt: 0 }}>
        {PAYMENT_PRICING_TIERS.map((tier, i) => {
          const selected = tierIndex === i;
          return (
            <Grid item xs={12} md={4} key={tier.key}>
              <Paper
                elevation={0}
                onClick={() => !disabled && onTierChange(i)}
                sx={{
                  p: 2.25,
                  height: '100%',
                  minHeight: 280,
                  borderRadius: '10px',
                  border: selected ? '2px solid #111827' : '1px solid #e5e7eb',
                  bgcolor: selected ? '#fafafa' : '#ffffff',
                  cursor: disabled ? 'default' : 'pointer',
                  transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
                  boxShadow: selected ? '0 10px 28px rgba(17, 24, 39, 0.1)' : '0 1px 2px rgba(15, 23, 42, 0.04)',
                  position: 'relative',
                  '&:hover': disabled ? {} : { borderColor: '#9ca3af' },
                }}
              >
                <Box sx={{ position: 'absolute', left: 0, right: 0, top: 0, height: 5, borderTopLeftRadius: '8px', borderTopRightRadius: '8px', bgcolor: selected ? '#111827' : '#e5e7eb' }} />
                {tier.popular && (
                  <Chip label="Popular" size="small" sx={{ position: 'absolute', top: 12, right: 12, fontWeight: 800, fontSize: '0.65rem', height: 22, bgcolor: '#111827', color: '#fff' }} />
                )}
                <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#111827', pr: tier.popular ? 6 : 0, mt: 0.5 }}>{tier.name}</Typography>
                <Typography sx={{ fontSize: '0.78rem', color: '#6b7280', mt: 0.35, mb: 1.5 }}>{tier.subtitle}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mb: 1.5 }}>
                  <Typography sx={{ fontWeight: 900, fontSize: '1.65rem', color: '#111827', letterSpacing: '-0.02em' }}>
                    Rs {tier.price.toLocaleString()}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600 }}>{tier.period}</Typography>
                </Box>
                <Divider sx={{ borderColor: '#e5e7eb', my: 1.25 }} />
                <Stack spacing={0.85}>
                  {tier.features.map((line) => (
                    <Box key={line} sx={{ display: 'flex', gap: 0.75, alignItems: 'flex-start' }}>
                      <CheckRoundedIcon sx={{ fontSize: 18, color: '#111827', mt: 0.1, flexShrink: 0 }} />
                      <Typography sx={{ fontSize: '0.8125rem', color: '#374151', lineHeight: 1.45 }}>{line}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      <Paper elevation={0} sx={{ p: 2, mt: 2.5, borderRadius: '10px', border: '1px solid #e5e7eb', bgcolor: '#fafafa' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Box>
            <Typography sx={{ fontSize: '0.8125rem', color: '#6b7280', fontWeight: 600 }}>Selected package</Typography>
            <Typography sx={{ fontSize: '0.9375rem', color: '#111827', fontWeight: 800 }}>{PAYMENT_PRICING_TIERS[tierIndex].name}</Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography sx={{ fontSize: '0.8125rem', color: '#6b7280', fontWeight: 600 }}>Total due</Typography>
            <Typography sx={{ fontSize: '1.25rem', color: '#111827', fontWeight: 900 }}>Rs {PAYMENT_PRICING_TIERS[tierIndex].price.toLocaleString()}</Typography>
          </Box>
        </Box>
      </Paper>

      <Typography sx={{ fontSize: '0.75rem', color: '#9ca3af', mt: 1.75, lineHeight: 1.5 }}>
        Secure checkout will open here once your payment provider is connected. Pay now continues to your storefront to verify branding.
      </Typography>
    </Box>
  );
}

export function BusinessPlanPaymentFooter({ tierIndex, onCancel, onPay, submitting, payDisabled }) {
  const payOff = submitting || payDisabled;
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.25, px: { xs: 2, sm: 3 }, py: 2, bgcolor: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
      <Button variant="outlined" disabled={submitting} onClick={onCancel} sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '8px', borderColor: '#d1d5db', color: '#374151', bgcolor: '#fff' }}>
        Cancel
      </Button>
      <Button
        variant="contained"
        disabled={payOff}
        onClick={onPay}
        sx={{ minWidth: 180, bgcolor: '#111827', color: '#fff', textTransform: 'none', fontWeight: 700, borderRadius: '8px', boxShadow: 'none', '&:hover': { bgcolor: '#000' } }}
      >
        {submitting ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : `Pay Rs ${PAYMENT_PRICING_TIERS[tierIndex].price.toLocaleString()}`}
      </Button>
    </Box>
  );
}
