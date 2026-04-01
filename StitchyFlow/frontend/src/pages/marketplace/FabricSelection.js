import React from 'react';
import PageTemplate from '../../components/PageTemplate';

const features = [
  { icon: '🧵', title: 'Premium Fabrics', desc: 'Browse silk, chiffon, lawn, cotton, linen, and more from top suppliers.' },
  { icon: '🎨', title: 'Wide Color Range', desc: 'Thousands of colors and prints to match your exact vision.' },
  { icon: '📦', title: 'Fabric Delivery', desc: 'Order fabric online and get it delivered directly to your tailor.' },
  { icon: '🔍', title: 'Quality Verified', desc: 'All fabrics are quality-checked and sourced from trusted suppliers.' },
  { icon: '💡', title: 'Expert Guidance', desc: 'Not sure which fabric to choose? Our experts will guide you.' },
  { icon: '💰', title: 'Wholesale Pricing', desc: 'Bulk fabric orders available at wholesale rates for tailors and businesses.' },
];

function FabricSelection() {
  return (
    <PageTemplate
      heroBadge="Marketplace · Fabric Selection"
      heroTitle="Choose the Perfect"
      heroHighlight="Fabric"
      heroSubtitle="Explore hundreds of premium fabrics for your custom tailoring orders — delivered to your tailor or doorstep."
      features={features}
      ctaText="Browse Fabrics"
    />
  );
}
export default FabricSelection;
