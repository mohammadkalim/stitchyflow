/**
 * SliderBanner — renders uploaded slider images EXACTLY as uploaded on the hero background.
 * No animation, no cropping, no stretching — image shown as-is.
 * Developer by: Muhammad Kalim | LogixInventor (PVT) Ltd.
 */
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Box, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const API_BASE = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL.replace(/\/api\/v\d+\/?$/i, '')
  : 'http://localhost:5000';

const DEFAULT_OVERLAY = 'rgba(0,0,0,0.18)';

export function useSliderImages(page) {
  const [images, setImages] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!page) {
      setImages([]);
      setCurrent(0);
      return;
    }

    fetch(`${API_BASE}/api/v1/slider-media/public?page=${encodeURIComponent(page)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && Array.isArray(d.data) && d.data.length) {
          setImages(d.data);
          setCurrent(0);
          return;
        }

        setImages([]);
        setCurrent(0);
      })
      .catch(() => {
        setImages([]);
        setCurrent(0);
      });
  }, [page]);

  const prev = useCallback(() => setCurrent((c) => (c - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % images.length), [images.length]);

  return { images, current, prev, next, setCurrent };
}

/**
 * SliderBackground — wraps children with slider image as background.
 * Uses DB-provided slide colors when available, otherwise falls back to page theme colors.
 */
export default function SliderBackground({ page, fallbackSx = {}, theme = {}, children }) {
  const { images, current, prev, next, setCurrent } = useSliderImages(page);

  const hasImages = images.length > 0;
  const currentImg = images[current];

  const resolvedTheme = useMemo(() => {
    const dbBackground = currentImg?.bg_color;
    const dbText = currentImg?.text_color;

    return {
      heroGradient: dbBackground || theme.heroGradient || fallbackSx.background,
      heroTextColor: dbText || theme.heroTextColor || '#ffffff',
      heroMutedTextColor: theme.heroMutedTextColor || 'rgba(255,255,255,0.8)',
      heroTitleHighlightColor: theme.heroTitleHighlightColor,
      heroCtaBoxShadow: theme.heroCtaBoxShadow,
      heroAccentColor: theme.heroAccentColor || '#f59e0b',
      heroAccentHoverColor: theme.heroAccentHoverColor || '#d97706',
      heroBadgeBg: theme.heroBadgeBg || 'rgba(255,255,255,0.12)',
      heroBadgeTextColor: theme.heroBadgeTextColor || 'rgba(255,255,255,0.9)',
      heroSecondaryButtonBorder: theme.heroSecondaryButtonBorder || 'rgba(255,255,255,0.5)',
      heroSecondaryButtonBg: theme.heroSecondaryButtonBg || 'rgba(255,255,255,0.08)',
      heroSecondaryButtonHoverBg: theme.heroSecondaryButtonHoverBg || 'rgba(255,255,255,0.15)',
      sliderOverlay: theme.sliderOverlay || DEFAULT_OVERLAY,
      sliderNavBg: theme.sliderNavBg || 'rgba(0,0,0,0.30)',
      sliderNavHoverBg: theme.sliderNavHoverBg || 'rgba(0,0,0,0.55)',
      sliderDotActive: theme.sliderDotActive || '#ffffff',
      sliderDotInactive: theme.sliderDotInactive || 'rgba(255,255,255,0.45)',
    };
  }, [currentImg, fallbackSx.background, theme]);

  const { background, ...restFallbackSx } = fallbackSx;
  const containerSx = {
    position: 'relative',
    overflow: 'hidden',
    ...(hasImages
      ? {
          ...restFallbackSx,
          background: resolvedTheme.heroGradient,
        }
      : {
          ...fallbackSx,
          background: resolvedTheme.heroGradient || fallbackSx.background,
        }),
  };

  return (
    <Box sx={containerSx}>
      {hasImages && (
        <Box
          component="img"
          src={currentImg.image_url}
          alt="slider"
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
      )}

      {hasImages && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            background: resolvedTheme.sliderOverlay,
          }}
        />
      )}

      <Box sx={{ position: 'relative', zIndex: 2 }}>
        {typeof children === 'function' ? children(resolvedTheme) : children}
      </Box>

      {hasImages && images.length > 1 && (
        <>
          <IconButton
            onClick={prev}
            sx={{
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: resolvedTheme.sliderNavBg,
              color: resolvedTheme.heroTextColor,
              zIndex: 3,
              '&:hover': { bgcolor: resolvedTheme.sliderNavHoverBg },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
          <IconButton
            onClick={next}
            sx={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: resolvedTheme.sliderNavBg,
              color: resolvedTheme.heroTextColor,
              zIndex: 3,
              '&:hover': { bgcolor: resolvedTheme.sliderNavHoverBg },
            }}
          >
            <ChevronRightIcon />
          </IconButton>

          <Box sx={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 0.75, zIndex: 3 }}>
            {images.map((_, i) => (
              <Box
                key={i}
                onClick={() => setCurrent(i)}
                sx={{
                  width: i === current ? 24 : 8,
                  height: 8,
                  borderRadius: '4px',
                  bgcolor: i === current ? resolvedTheme.sliderDotActive : resolvedTheme.sliderDotInactive,
                  cursor: 'pointer',
                }}
              />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}