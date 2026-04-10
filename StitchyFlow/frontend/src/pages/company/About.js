import React from 'react';
import PageTemplate from '../../components/PageTemplate';

const features = [
  { icon: '🏢', title: 'Our Mission', desc: 'To make quality tailoring accessible to everyone in Pakistan through technology and trust.' },
  { icon: '🌍', title: 'Our Vision', desc: 'Become South Asia\'s most trusted tailoring marketplace by 2027.' },
  { icon: '👥', title: 'Our Team', desc: 'A passionate team of developers, designers, and fashion experts based in Karachi.' },
  { icon: '🔒', title: 'Trust & Safety', desc: 'Every tailor is verified, reviewed, and held to our strict quality standards.' },
  { icon: '🚀', title: 'Innovation', desc: 'We continuously improve our platform with AI-powered matching and smart recommendations.' },
  { icon: '🤝', title: 'Community', desc: 'We support local tailors and artisans by giving them a digital platform to grow.' },
];

function About() {
  return (
    <PageTemplate
      heroBadge="Company · About Us"
      heroTitle="About"
      heroHighlight="StitchyFlow"
      heroSubtitle="Pakistan's leading tailoring marketplace — connecting customers with verified, skilled tailors through a secure and automated platform."
      features={features}
      ctaText="Join StitchyFlow"
      sliderPage="/about"
    />
  );
}
export default About;
