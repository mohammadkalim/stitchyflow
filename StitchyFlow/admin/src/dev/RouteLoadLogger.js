/**
 * Logs each admin URL change (full page / scene) for local QA.
 * Enable: development by default, or set REACT_APP_ROUTE_LOGS=1 in .env for production builds.
 *
 * Developer by: Muhammad Kalim
 * Product of LogixInventor (PVT) Ltd.
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function loggingEnabled() {
  if (process.env.NODE_ENV === 'development') return true;
  return String(process.env.REACT_APP_ROUTE_LOGS || '').toLowerCase() === '1' ||
    String(process.env.REACT_APP_ROUTE_LOGS || '').toLowerCase() === 'true';
}

export default function RouteLoadLogger({ appId = 'admin' }) {
  const location = useLocation();

  useEffect(() => {
    if (!loggingEnabled()) return;
    const path = `${location.pathname}${location.search || ''}`;
    // eslint-disable-next-line no-console
    console.info(`[StitchyFlow:${appId}] scene loaded`, path, new Date().toISOString());
  }, [location.pathname, location.search, location.key, appId]);

  return null;
}
