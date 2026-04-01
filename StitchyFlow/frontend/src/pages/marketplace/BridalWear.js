import React from 'react';
import PageTemplate from '../../components/PageTemplate';

const features = [
  { icon: '💍', title: 'Bridal Lehenga', desc: 'Stunning lehengas with intricate embroidery and premium fabrics for your big day.' },
  { icon: '👗', title: 'Wedding Gowns', desc: 'Elegant western and fusion wedding gowns tailored to perfection.' },
  { icon: '🌸', title: 'Embroidery & Embellishments', desc: 'Hand-crafted embroidery, zari, and stone work by skilled artisans.' },
  { icon: '🎀', title: 'Dupatta & Accessories', desc: 'Matching dupattas, veils, and accessories to complete your bridal look.' },
  { icon: '📅', title: 'Advance Booking', desc: 'Book months in advance to ensure your outfit is ready on time.' },
  { icon: '🔒', title: 'Secure Payments', desc: 'Pay securely with our protected payment system and get full refund protection.' },
];

function BridalWear() {
  return (
    <PageTemplate
      heroBadge="Marketplace · Bridal Wear"
      heroTitle="Your Dream"
      heroHighlight="Bridal Look"
      heroSubtitle="Make your wedding day unforgettable with stunning bridal outfits crafted by Pakistan's finest tailors and artisans."
      features={features}
      ctaText="Find a Bridal Tailor"
    />
  );
}
export default BridalWear;
