import React from 'react';
import PageTemplate from '../../components/PageTemplate';

const features = [
  { icon: '📐', title: 'Custom Measurements', desc: 'Every dress is stitched to your exact body measurements for a flawless fit.' },
  { icon: '🎨', title: 'Design Consultation', desc: 'Work directly with your tailor to choose style, cut, and embellishments.' },
  { icon: '🧵', title: 'Premium Fabrics', desc: 'Choose from a wide range of high-quality fabrics including silk, chiffon, and more.' },
  { icon: '⏱️', title: 'On-Time Delivery', desc: 'We guarantee delivery within your agreed timeline, every time.' },
  { icon: '🔄', title: 'Free Alterations', desc: 'Not satisfied? We offer free alterations until you love your dress.' },
  { icon: '⭐', title: 'Verified Tailors', desc: 'All tailors are background-checked and rated by real customers.' },
];

function CustomDresses() {
  const sliderTheme = {
    heroGradient: 'linear-gradient(135deg, #450002 0%, #450002 100%)',
  };

  return (
    <PageTemplate
      heroBadge="Marketplace · Custom Dresses"
      heroTitle="Perfectly Tailored"
      heroHighlight="Custom Dresses"
      heroSubtitle="Get beautifully crafted custom dresses designed to your exact measurements and style preferences by Pakistan's top verified tailors."
      features={features}
      ctaText="Find a Dress Tailor"
      sliderTheme={sliderTheme}
    />
  );
}
export default CustomDresses;
