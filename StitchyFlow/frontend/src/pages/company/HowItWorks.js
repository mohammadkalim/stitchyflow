import React from 'react';
import PageTemplate from '../../components/PageTemplate';

const features = [
  { icon: '🔍', title: 'Step 1: Browse', desc: 'Search and filter verified tailors by category, location, rating, and price.' },
  { icon: '📋', title: 'Step 2: Choose', desc: 'Review tailor profiles, portfolios, and customer reviews to find your match.' },
  { icon: '📅', title: 'Step 3: Book', desc: 'Select your service, provide measurements, and confirm your booking securely.' },
  { icon: '💳', title: 'Step 4: Pay Safely', desc: 'Pay through our secure payment system — funds are held until you approve.' },
  { icon: '👗', title: 'Step 5: Receive', desc: 'Get your perfectly stitched outfit delivered to your doorstep on time.' },
  { icon: '⭐', title: 'Step 6: Review', desc: 'Rate your tailor and help the community find the best professionals.' },
];

function HowItWorks() {
  return (
    <PageTemplate
      heroBadge="Company · How It Works"
      heroTitle="Simple Steps to Your"
      heroHighlight="Perfect Outfit"
      heroSubtitle="We've streamlined the tailoring process into six simple, transparent steps so you always know what to expect."
      features={features}
      ctaText="Get Started Now"
    />
  );
}
export default HowItWorks;
