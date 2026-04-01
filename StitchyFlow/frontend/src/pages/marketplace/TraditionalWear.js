import React from 'react';
import PageTemplate from '../../components/PageTemplate';

const features = [
  { icon: '🥻', title: 'Shalwar Kameez', desc: 'Classic and contemporary shalwar kameez stitched to your exact measurements.' },
  { icon: '🎽', title: 'Kurta & Pajama', desc: 'Comfortable and stylish kurta sets for everyday wear and festive occasions.' },
  { icon: '🌙', title: 'Eid & Festive Wear', desc: 'Special occasion outfits with premium fabrics and traditional embroidery.' },
  { icon: '👘', title: 'Sherwani', desc: 'Regal sherwanis for weddings, engagements, and formal events.' },
  { icon: '🧶', title: 'Regional Styles', desc: 'Authentic regional styles from Sindhi, Balochi, Punjabi, and Pashtun traditions.' },
  { icon: '⭐', title: 'Artisan Craftsmanship', desc: 'Skilled artisans preserving traditional techniques with modern precision.' },
];

function TraditionalWear() {
  return (
    <PageTemplate
      heroBadge="Marketplace · Traditional Wear"
      heroTitle="Authentic"
      heroHighlight="Traditional Wear"
      heroSubtitle="Celebrate your culture with beautifully crafted traditional outfits stitched by skilled tailors who understand Pakistani heritage."
      features={features}
      ctaText="Find a Traditional Tailor"
    />
  );
}
export default TraditionalWear;
