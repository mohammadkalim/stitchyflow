import React from 'react';
import PageTemplate from '../../components/PageTemplate';

const features = [
  { icon: '👔', title: 'Bespoke Suits', desc: 'Fully custom suits tailored to your body shape, fabric choice, and style.' },
  { icon: '🧥', title: 'Blazers & Jackets', desc: 'Sharp blazers for formal events, office wear, or casual occasions.' },
  { icon: '📏', title: 'Precise Measurements', desc: 'Our tailors take detailed measurements for a sharp, professional silhouette.' },
  { icon: '🎨', title: 'Lining & Details', desc: 'Choose your lining, buttons, lapels, and pocket styles.' },
  { icon: '🏢', title: 'Corporate Packages', desc: 'Bulk orders for corporate teams with consistent quality and branding.' },
  { icon: '⭐', title: 'Expert Craftsmanship', desc: 'Tailors with years of experience in formal and semi-formal wear.' },
];

function SuitsBlazer() {
  return (
    <PageTemplate
      heroBadge="Marketplace · Suits & Blazers"
      heroTitle="Sharp & Professional"
      heroHighlight="Suits & Blazers"
      heroSubtitle="Elevate your wardrobe with bespoke suits and blazers crafted by expert tailors across Pakistan."
      features={features}
      ctaText="Find a Suit Tailor"
    />
  );
}
export default SuitsBlazer;
