/**
 * Promotional splash modal on selected routes (configured in admin Splash Ads).
 * Tries /api/v1/admin/ads, /ca-sub/ads, /ads so tracking works if one mount is missing.
 * Shown again on every full page load / refresh (no sessionStorage “seen once” gate).
 */
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Dialog,
  Box,
  IconButton,
  Typography,
  Button,
  Stack
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ImageNotSupportedOutlinedIcon from '@mui/icons-material/ImageNotSupportedOutlined';
import { getApiBase } from '../utils/api';

const ADS_PREFIXES = ['/admin/ads', '/ca-sub/ads', '/ads'];

function track(adsRootUrl, eventName, body) {
  return fetch(`${adsRootUrl}/${eventName}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }).catch(() => {});
}

/** Resolves stored image URLs (absolute, protocol-relative, site-relative /uploads/..., or bare host). */
function normalizeMediaUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const t = url.trim();
  if (!t) return '';
  if (/^https?:\/\//i.test(t)) return t;
  if (t.startsWith('//')) return `https:${t}`;
  if (t.startsWith('/')) {
    const base = getApiBase();
    if (base.startsWith('http')) {
      try {
        const u = new URL(base);
        return `${u.origin}${t}`;
      } catch {
        /* fall through */
      }
    }
    if (typeof window !== 'undefined') {
      return `${window.location.origin}${t}`;
    }
    return t;
  }
  return `https://${t}`;
}

function formatDestinationLabel(url) {
  if (!url || typeof url !== 'string') return '';
  const t = url.trim();
  try {
    const u = new URL(/^https?:\/\//i.test(t) ? t : `https://${t}`);
    return u.hostname.replace(/^www\./i, '');
  } catch {
    return t.length > 48 ? `${t.slice(0, 45)}…` : t;
  }
}

async function fetchAdsForPage(pathname) {
  const base = getApiBase();
  const q = `?page=${encodeURIComponent(pathname)}`;
  for (const prefix of ADS_PREFIXES) {
    const url = `${base}${prefix}${q}`;
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const json = await res.json();
      if (json.success && json.data?.length) {
        return { data: json.data, adsRoot: `${base}${prefix}` };
      }
    } catch {
      /* try next */
    }
  }
  return null;
}

export default function SplashAdOverlay() {
  const { pathname } = useLocation();
  const [ad, setAd] = useState(null);
  const [open, setOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const adsRootRef = useRef('');

  const load = useCallback(async () => {
    setAd(null);
    setOpen(false);
    setImageError(false);
    adsRootRef.current = '';
    try {
      const result = await fetchAdsForPage(pathname);
      if (!result) return;

      const first = result.data[0];
      adsRootRef.current = result.adsRoot;
      setAd(first);
      setOpen(true);
      track(result.adsRoot, 'impression', { ad_id: first.id, page: pathname });
    } catch {
      /* ignore */
    }
  }, [pathname]);

  useEffect(() => {
    load();
  }, [load]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleImageClick = () => {
    if (!ad) return;
    const root = adsRootRef.current;
    if (root) {
      track(root, 'click', { ad_id: ad.id, page: pathname });
    }
    if (ad.redirect_url) {
      const dest = normalizeMediaUrl(ad.redirect_url);
      if (dest) window.open(dest, '_blank', 'noopener,noreferrer');
    }
    handleClose();
  };

  if (!ad) return null;

  const imageSrc = normalizeMediaUrl(ad.image_url);
  const destinationLabel = formatDestinationLabel(ad.redirect_url);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      fullWidth={false}
      scroll="paper"
      sx={{
        '& .MuiDialog-container': {
          alignItems: 'center',
          justifyContent: 'center'
        }
      }}
      BackdropProps={{
        sx: {
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(15, 23, 42, 0.72)'
        }
      }}
      PaperProps={{
        elevation: 0,
        sx: {
          m: { xs: 2, sm: 3 },
          width: '100%',
          maxWidth: { xs: 'min(92vw, 560px)', sm: 'min(88vw, 640px)' },
          maxHeight: 'min(86vh, 720px)',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: { xs: 2, sm: 3 },
          overflow: 'hidden',
          bgcolor: '#ffffff',
          boxShadow:
            '0 32px 64px -16px rgba(15, 23, 42, 0.35), 0 0 0 1px rgba(15, 23, 42, 0.06)'
        }
      }}
    >
      {/* Header */}
      <Box
        sx={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 2,
          px: { xs: 2, sm: 3 },
          pt: { xs: 2, sm: 2.5 },
          pb: 2,
          borderBottom: '1px solid',
          borderColor: 'rgba(15, 23, 42, 0.08)',
          bgcolor: '#fafbfc'
        }}
      >
        <Stack spacing={0.5} sx={{ minWidth: 0, pr: 1 }}>
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: '1.125rem', sm: '1.375rem' },
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: 1.3,
              color: '#0f172a'
            }}
          >
            {ad.title}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              fontWeight: 600,
              color: 'rgba(15, 23, 42, 0.45)',
              fontSize: '0.65rem'
            }}
          >
            Featured promotion
          </Typography>
        </Stack>
        <IconButton
          onClick={handleClose}
          aria-label="Close"
          sx={{
            flexShrink: 0,
            mt: -0.5,
            color: 'rgba(15, 23, 42, 0.45)',
            bgcolor: 'rgba(15, 23, 42, 0.06)',
            '&:hover': { bgcolor: 'rgba(15, 23, 42, 0.1)', color: '#0f172a' }
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Hero image */}
      <Box
        sx={{
          position: 'relative',
          flex: '1 1 auto',
          minHeight: { xs: 160, sm: 200 },
          maxHeight: { xs: '36vh', sm: '40vh' },
          bgcolor: '#f1f5f9',
          borderBottom: '1px solid rgba(15, 23, 42, 0.06)'
        }}
      >
        {!imageError && imageSrc ? (
          <Box
            component="img"
            src={imageSrc}
            alt={ad.title || 'Promotion'}
            onError={() => setImageError(true)}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              objectPosition: 'center',
              display: 'block'
            }}
          />
        ) : (
          <Stack
            alignItems="center"
            justifyContent="center"
            spacing={1}
            sx={{ height: '100%', minHeight: { xs: 160, sm: 200 }, px: 2 }}
          >
            <ImageNotSupportedOutlinedIcon sx={{ fontSize: 48, color: 'rgba(15, 23, 42, 0.25)' }} />
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Image could not be loaded. Check that the image URL is public and uses https.
            </Typography>
          </Stack>
        )}
      </Box>

      {/* Footer CTA */}
      <Box
        sx={{
          flexShrink: 0,
          px: { xs: 2, sm: 3 },
          py: { xs: 2.5, sm: 3 },
          mt: { xs: 1, sm: 1.5 },
          bgcolor: '#ffffff',
          borderTop: '1px solid rgba(15, 23, 42, 0.06)'
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems={{ xs: 'stretch', sm: 'flex-end' }}
          justifyContent="space-between"
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5,
              minWidth: 0,
              width: { xs: '100%', sm: 'auto' },
              mt: { xs: 0, sm: 1 }
            }}
          >
            <Box
              sx={{
                px: 2,
                py: 1,
                borderRadius: 2,
                bgcolor: '#f8fbff',
                border: '1px solid rgba(56, 189, 248, 0.18)',
                width: { xs: '100%', sm: 'auto' },
                minHeight: 48,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: '#0f172a',
                  fontWeight: 600,
                  wordBreak: 'break-word'
                }}
              >
                {destinationLabel || '—'}
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            size="large"
            onClick={handleImageClick}
            endIcon={<OpenInNewIcon />}
            sx={{
              width: { xs: '100%', sm: 'auto' },
              flexShrink: 0,
              px: 3,
              py: 1.25,
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '1rem',
              borderRadius: 2,
              boxShadow: '0 4px 14px rgba(41, 182, 246, 0.45)',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(41, 182, 246, 0.5)'
              }
            }}
          >
            Visit website
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
}
