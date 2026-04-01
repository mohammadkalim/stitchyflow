/**
 * Shows splash on every full page load (including refresh on any route).
 *
 * Developer by: Muhammad Kalim
 * Product of LogixInventor (PVT) Ltd.
 */

import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import SplashScreen, { SPLASH_MS } from '../pages/SplashScreen';

function SplashGate() {
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => {
      setShowSplash(false);
      const path = window.location.pathname;
      if (path === '/' || path === '') {
        navigate('/home', { replace: true });
      }
    }, SPLASH_MS);
    return () => clearTimeout(t);
    // Intentionally once per full page load — refresh always shows splash again.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (showSplash) {
    return <SplashScreen durationMs={SPLASH_MS} />;
  }

  return <Outlet />;
}

export default SplashGate;
