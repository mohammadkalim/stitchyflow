import React from 'react';
import PageTemplate from '../../components/PageTemplate';

const features = [
  { icon: '✂️', title: 'Size Adjustments', desc: 'Let in or take out seams to achieve the perfect fit for any garment.' },
  { icon: '📏', title: 'Length Alterations', desc: 'Hem trousers, skirts, dresses, and sleeves to your exact preferred length.' },
  { icon: '🔧', title: 'Repairs & Fixes', desc: 'Fix broken zippers, torn seams, missing buttons, and more.' },
  { icon: '🔄', title: 'Restyling', desc: 'Transform old outfits into modern styles with creative alterations.' },
  { icon: '⚡', title: 'Express Service', desc: 'Need it fast? Our express alteration service delivers in 24–48 hours.' },
  { icon: '💰', title: 'Affordable Pricing', desc: 'Transparent, competitive pricing with no hidden charges.' },
];

function Alterations() {
  return (
    <PageTemplate
      heroBadge="Marketplace · Alterations"
      heroTitle="Perfect Fit,"
      heroHighlight="Every Time"
      heroSubtitle="Give your wardrobe a new life with expert alteration services from verified tailors across Pakistan."
      features={features}
      ctaText="Book an Alteration"
    />
  );
}
export default Alterations;
