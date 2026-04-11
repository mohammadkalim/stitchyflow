/**
 * Tailor Shops — public landing page linked from main header
 * Developer by: Muhammad Kalim
 * Phone/WhatsApp: +92 333 3836851
 * Product of LogixInventor (PVT) Ltd.
 * Email: info@logixinventor.com
 * Website: www.logixinventor.com
 */
import React from 'react';
import PageTemplate from '../components/PageTemplate';
import StorefrontIcon from '@mui/icons-material/Storefront';

const features = [
  { icon: '🏪', title: 'Verified shops', desc: 'Browse tailoring businesses that list on StitchyFlow with clear services and contact options.' },
  { icon: '📍', title: 'Find your fit', desc: 'Explore categories from alterations to formal wear and pick a shop that matches your style and budget.' },
  { icon: '🤝', title: 'Connect safely', desc: 'Use StitchyFlow to discover tailors, then book and communicate through our platform workflows.' },
];

function TailorShops() {
  return (
    <PageTemplate
      heroBadge="Marketplace"
      heroTitle="Discover Tailor"
      heroHighlight="Shops"
      heroSubtitle="Explore tailoring businesses on StitchyFlow — from quick alterations to full bespoke outfits. Start with our marketplace categories or list your own shop."
      icon={<StorefrontIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.95)' }} />}
      features={features}
      ctaText="Browse marketplace"
      ctaPath="/marketplace/custom-dresses"
    />
  );
}

export default TailorShops;
