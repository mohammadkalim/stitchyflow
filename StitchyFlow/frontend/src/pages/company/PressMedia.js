import React from 'react';
import PageTemplate from '../../components/PageTemplate';

const features = [
  { icon: '📰', title: 'Press Releases', desc: 'Official announcements, product launches, and company milestones.' },
  { icon: '🖼️', title: 'Media Kit', desc: 'Download our brand assets, logos, and official photography for press use.' },
  { icon: '🎙️', title: 'Interview Requests', desc: 'Request an interview with our leadership team for your publication.' },
  { icon: '📊', title: 'Company Stats', desc: 'Key metrics, growth figures, and platform statistics for journalists.' },
  { icon: '🤝', title: 'Partnerships', desc: 'Explore co-marketing, sponsorship, and strategic partnership opportunities.' },
  { icon: '📧', title: 'Media Contact', desc: 'Reach our press team at info@logixinventor.com for all media inquiries.' },
];

function PressMedia() {
  return (
    <PageTemplate
      heroBadge="Company · Press & Media"
      heroTitle="StitchyFlow in the"
      heroHighlight="Press"
      heroSubtitle="Find official press resources, media kits, and contact information for journalists and media partners."
      features={features}
      ctaText="Contact Press Team"
    />
  );
}
export default PressMedia;
