import React from 'react';
import PageTemplate from '../../components/PageTemplate';

const features = [
  { icon: '💻', title: 'Engineering', desc: 'Build scalable systems and features that power Pakistan\'s top tailoring platform.' },
  { icon: '🎨', title: 'Design', desc: 'Create beautiful, user-friendly interfaces that delight millions of users.' },
  { icon: '📈', title: 'Growth & Marketing', desc: 'Drive user acquisition and brand awareness across Pakistan.' },
  { icon: '🤝', title: 'Operations', desc: 'Ensure smooth day-to-day operations and tailor onboarding processes.' },
  { icon: '🛡️', title: 'Trust & Safety', desc: 'Keep our platform safe and maintain quality standards for all users.' },
  { icon: '🌟', title: 'Why Join Us?', desc: 'Competitive salary, remote-friendly, learning budget, and a mission-driven culture.' },
];

function Careers() {
  return (
    <PageTemplate
      heroBadge="Company · Careers"
      heroTitle="Build the Future of"
      heroHighlight="Tailoring with Us"
      heroSubtitle="Join a passionate team at StitchyFlow and help us transform how Pakistan experiences custom clothing."
      features={features}
      ctaText="View Open Positions"
    />
  );
}
export default Careers;
