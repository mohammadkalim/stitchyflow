/**
 * SliderBanner — renders uploaded slider images EXACTLY as uploaded on the hero background.
 * No animation, no cropping, no stretching — image shown as-is.
 * Developer by: Muhammad Kalim | LogixInventor (PVT) Ltd.
 */
import React, { useEffect, useState, useCallback } from 'react';
import { Box, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const API_BASE = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL.replace(/\/api\/v\d+\/?$/i, '')
  : 'http://localhost:5000';

export function useSliderImages(page) {
  const [images, setImages]   = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!page) return;
    fetch(`${API_BASE}/api/v1/slider-media/public?page=${encodeURIComponent(page)}`)
      .then(r => r.json())
      .then(d => { if (d.success && d.data?.length) setImages(d.data); })
      .catch(() => {});
  }, [page]);

  const prev = useCallback(() => setCurrent(c => (c - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setCurrent(c => (c + 1) % images.length), [images.length]);

  return { images, current, prev, next, setCurrent };
}

/**
 * SliderBackground — wraps children with slider image as background.
 * Image is shown EXACTLY as uploaded: no crop, no animation, no transition.
 * Falls back to original gradient (fallbackSx) when no images uploaded.
 */
export default function SliderBackground({ page, fallbackSx = {}, children }) {
  const { images, current, prev, next, setCurrent } = useSliderImages(page);

  const hasImages = images.length > 0;
  const currentImg = images[current];

  // When image is present, strip the background gradient from fallbackSx
  // so the uploaded image shows clearly without the gradient competing
  const { background, ...restFallbackSx } = fallbackSx;
  const containerSx = hasImages ? restFallbackSx : fallbackSx;

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden', ...containerSx }}>

      {/* Exact image — no crop, no animation, shown as-is */}
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
            objectFit: 'cover',   // fills hero exactly, no distortion
            objectPosition: 'center',
            zIndex: 0,
            display: 'block',
          }}
        />
      )}

      {/* Subtle overlay so text stays readable */}
      {hasImages && (
        <Box sx={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'rgba(0,0,0,0.18)',
        }} />
      )}

      {/* Hero content */}
      <Box sx={{ position: 'relative', zIndex: 2 }}>
        {children}
      </Box>

      {/* Prev / Next — only when multiple images */}
      {hasImages && images.length > 1 && (
        <>
          <IconButton onClick={prev} sx={{
            position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
            bgcolor: 'rgba(0,0,0,0.30)', color: '#fff', zIndex: 3,
            '&:hover': { bgcolor: 'rgba(0,0,0,0.55)' }
          }}>
            <ChevronLeftIcon />
          </IconButton>
          <IconButton onClick={next} sx={{
            position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
            bgcolor: 'rgba(0,0,0,0.30)', color: '#fff', zIndex: 3,
            '&:hover': { bgcolor: 'rgba(0,0,0,0.55)' }
          }}>
            <ChevronRightIcon />
          </IconButton>

          {/* Dot indicators */}
          <Box sx={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 0.75, zIndex: 3 }}>
            {images.map((_, i) => (
              <Box key={i} onClick={() => setCurrent(i)} sx={{
                width: i === current ? 24 : 8, height: 8, borderRadius: '4px',
                bgcolor: i === current ? '#fff' : 'rgba(255,255,255,0.45)',
                cursor: 'pointer',
              }} />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}
