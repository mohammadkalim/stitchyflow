/**
 * Tailor Shops — public landing page linked from main header
 * Developer by: Muhammad Kalim
 * Phone/WhatsApp: +92 333 3836851
 * Product of LogixInventor (PVT) Ltd.
 * Email: info@logixinventor.com
 * Website: www.logixinventor.com
 */
import React, { useState, useEffect } from 'react';
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

function TailorShops() {
  const [shops, setShops] = useState([]);
  const [shopsLoading, setShopsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let fetchGeneration = 0;

    const load = () => {
      const gen = ++fetchGeneration;
      setShopsLoading(true);
      gex('/business/public/shops', { cache: 'no-store' })
        .then((d) => {
          if (cancelled || gen !== fetchGeneration) return;
          const list = d.success && Array.isArray(d.data) ? d.data : [];
          setShops(list);
        })
        .catch(() => {
          if (cancelled || gen !== fetchGeneration) return;
          setShops([]);
        })
        .finally(() => {
          if (!cancelled && gen === fetchGeneration) setShopsLoading(false);
        });
    };

    load();

    const onVisible = () => {
      if (document.visibilityState === 'visible') load();
    };
    window.addEventListener(PUBLIC_SHOPS_CHANGED_EVENT, load);
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      cancelled = true;
      window.removeEventListener(PUBLIC_SHOPS_CHANGED_EVENT, load);
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
