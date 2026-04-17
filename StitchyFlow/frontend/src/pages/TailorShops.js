/**
 * Tailor Shops — public landing page linked from main header
 * Developer by: Muhammad Kalim
 * Phone/WhatsApp: +92 333 3836851
 * Product of LogixInventor (PVT) Ltd.
 * Email: info@logixinventor.com
 * Website: www.logixinventor.com
 */
import React, { useState, useEffect, useRef } from 'react';
import PageTemplate from '../components/PageTemplate';
import { gex, PUBLIC_SHOPS_CHANGED_EVENT } from '../utils/api';

/** Brand slider: #1310ca · rgb(19, 16, 202) · hsl(241, 85%, 43%) */
const TAILOR_SHOPS_BRAND = '#1310ca';
const TAILOR_SHOPS_BRAND_HSL = 'hsl(241, 85%, 43%)';

const tailorShopsSliderTheme = {
  heroGradient: `linear-gradient(135deg, ${TAILOR_SHOPS_BRAND} 0%, rgba(19, 16, 202, 0.92) 38%, ${TAILOR_SHOPS_BRAND_HSL} 68%, #0e0ba3 100%)`,
  heroTextColor: '#ffffff',
  heroMutedTextColor: 'rgba(255,255,255,0.86)',
  heroTitleHighlightColor: '#f0efff',
  heroAccentColor: TAILOR_SHOPS_BRAND,
  heroAccentHoverColor: '#1a16e0',
  heroCtaBoxShadow: '0 4px 14px rgba(19, 16, 202, 0.45)',
  heroBadgeBg: 'rgba(19, 16, 202, 0.22)',
  heroBadgeTextColor: '#ffffff',
  heroSecondaryButtonBorder: 'rgba(255,255,255,0.7)',
  heroSecondaryButtonBg: 'rgba(19, 16, 202, 0.2)',
  heroSecondaryButtonHoverBg: 'rgba(19, 16, 202, 0.32)',
  sliderOverlay: 'linear-gradient(135deg, rgba(19, 16, 202, 0.5) 0%, rgba(19, 16, 202, 0.2) 100%)',
  sliderNavBg: 'rgba(19, 16, 202, 0.35)',
  sliderNavHoverBg: 'rgba(19, 16, 202, 0.52)',
  sliderDotActive: '#ffffff',
  sliderDotInactive: 'rgba(19, 16, 202, 0.5)',
};
const PINNED_TOP_SHOP_NAMES = new Set(['asdasd']);

function getShopRankTimestamp(shop) {
  const raw = shop?.updated_at || shop?.created_at || '';
  const t = Date.parse(String(raw));
  return Number.isNaN(t) ? 0 : t;
}

function prioritizeTopEightShops(list) {
  const rows = Array.isArray(list) ? list : [];
  const sorted = [...rows].sort((a, b) => {
    const aPinned = PINNED_TOP_SHOP_NAMES.has(String(a?.shop_name || '').trim().toLowerCase()) ? 1 : 0;
    const bPinned = PINNED_TOP_SHOP_NAMES.has(String(b?.shop_name || '').trim().toLowerCase()) ? 1 : 0;
    if (aPinned !== bPinned) return bPinned - aPinned;
    // Show active businesses first, then latest updates.
    const aActive = String(a?.shop_status || '').toLowerCase() === 'active' ? 1 : 0;
    const bActive = String(b?.shop_status || '').toLowerCase() === 'active' ? 1 : 0;
    if (aActive !== bActive) return bActive - aActive;
    return getShopRankTimestamp(b) - getShopRankTimestamp(a);
  });
  return sorted;
}

function TailorShops() {
  const [shops, setShops] = useState([]);
  const [shopsLoading, setShopsLoading] = useState(true);
  const shopsLoadingRef = useRef(shopsLoading);
  shopsLoadingRef.current = shopsLoading;

  useEffect(() => {
    let cancelled = false;
    let fetchGeneration = 0;

    /**
     * Loads shops via Ajax (`fetch` through `gex`) without a full browser reload.
     * When `showLoading` is false, updates the list in the background (e.g. tab focus) so the page does not jump back to the spinner.
     */
    const load = async ({ showLoading = true } = {}) => {
      const gen = ++fetchGeneration;
      if (showLoading) setShopsLoading(true);
      try {
        const d = await gex('/business/public/shops', { cache: 'no-store' });
        if (cancelled || gen !== fetchGeneration) return;
        const list = d.success && Array.isArray(d.data) ? d.data : [];
        setShops(prioritizeTopEightShops(list));
      } catch {
        if (cancelled || gen !== fetchGeneration) return;
        if (showLoading) setShops([]);
      } finally {
        if (!cancelled && gen === fetchGeneration && showLoading) setShopsLoading(false);
      }
    };

    void load({ showLoading: true });

    const onPublicShopsChanged = () => {
      void load({ showLoading: true });
    };

    const onVisible = () => {
      if (document.visibilityState !== 'visible') return;
      if (shopsLoadingRef.current) return;
      void load({ showLoading: false });
    };

    window.addEventListener(PUBLIC_SHOPS_CHANGED_EVENT, onPublicShopsChanged);
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      cancelled = true;
      window.removeEventListener(PUBLIC_SHOPS_CHANGED_EVENT, onPublicShopsChanged);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  return (
    <PageTemplate
      heroTitle="Discover Tailor"
      heroHighlight="Shops"
      heroSubtitle="Explore tailoring businesses on StitchyFlow — from quick alterations to full bespoke outfits. Start with our marketplace categories or list your own shop."
      useShopSection
      shops={shops}
      shopsLoading={shopsLoading}
      shopSectionTitle="Tailor shops"
      shopSectionSubtitle="Verified tailoring businesses on StitchyFlow — services, locations, and specializations."
      showHeroButtons={false}
      sliderPage="/tailor-shops"
      sliderTheme={tailorShopsSliderTheme}
      shopVisitUrlBuilder={(shop) => (shop?.shop_id != null ? `/tailor-shops/view/${shop.shop_id}` : null)}
    />
  );
}

export default TailorShops;
