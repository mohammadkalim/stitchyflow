import React, { useState } from 'react';
import {
  Box, Typography, Paper, Divider, Accordion, AccordionSummary, AccordionDetails, Chip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import PrivacyTipOutlinedIcon from '@mui/icons-material/PrivacyTipOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';

const FOREST = '#1b4332';

const SECTIONS = [
  {
    icon: <AssignmentOutlinedIcon sx={{ fontSize: 20, color: FOREST }} />,
    title: 'Terms of Service',
    badge: 'Last updated: Jan 2025',
    items: [
      { q: '1. Acceptance of Terms', a: 'By registering as a tailor on StitchyFlow, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use the platform.' },
      { q: '2. Tailor Responsibilities', a: 'As a tailor, you are responsible for providing accurate business information, delivering orders on time, maintaining professional conduct, and keeping your shop profile up to date.' },
      { q: '3. Order Fulfillment', a: 'You must fulfill accepted orders within the agreed timeframe. Repeated cancellations or delays may result in account suspension or removal from the platform.' },
      { q: '4. Commission & Payments', a: 'StitchyFlow charges a platform commission on each completed order. Payment is processed and released to your registered bank account within 3–5 business days after order completion.' },
      { q: '5. Account Suspension', a: 'StitchyFlow reserves the right to suspend or terminate accounts that violate these terms, receive repeated negative reviews, or engage in fraudulent activity.' },
    ],
  },
  {
    icon: <PrivacyTipOutlinedIcon sx={{ fontSize: 20, color: '#2563eb' }} />,
    title: 'Privacy Policy',
    badge: 'Last updated: Jan 2025',
    items: [
      { q: 'Data We Collect', a: 'We collect your name, email, phone number, business details, and transaction history to operate the platform and improve your experience.' },
      { q: 'How We Use Your Data', a: 'Your data is used to manage your account, process payments, send notifications, and provide customer support. We do not sell your personal data to third parties.' },
      { q: 'Data Security', a: 'We use industry-standard encryption and security measures to protect your personal and financial information. All data is stored on secure servers.' },
      { q: 'Cookies', a: 'StitchyFlow uses cookies to maintain your session, remember preferences, and analyze platform usage. You can manage cookie settings in your browser.' },
      { q: 'Your Rights', a: 'You have the right to access, update, or delete your personal data at any time by contacting our support team or through your account settings.' },
    ],
  },
  {
    icon: <SecurityOutlinedIcon sx={{ fontSize: 20, color: '#7c3aed' }} />,
    title: 'Vendor Code of Conduct',
    badge: 'Mandatory',
    items: [
      { q: 'Professional Standards', a: 'All tailors must maintain professional communication with customers, deliver quality work, and represent StitchyFlow values of trust and excellence.' },
      { q: 'Prohibited Activities', a: 'Tailors must not engage in price manipulation, fake reviews, off-platform transactions, or any form of harassment toward customers or staff.' },
      { q: 'Dispute Resolution', a: 'In case of disputes with customers, both parties must first attempt resolution through the platform\'s messaging system before escalating to support.' },
      { q: 'Intellectual Property', a: 'You retain ownership of your designs and work. By uploading media to StitchyFlow, you grant us a license to display it on the platform for promotional purposes.' },
    ],
  },
];

export default function TermsSection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
        <GavelOutlinedIcon sx={{ fontSize: 24, color: FOREST }} />
        <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.2rem' }}>Terms & Privacy</Typography>
      </Box>
      <Typography sx={{ color: '#64748b', fontSize: '0.82rem', mb: 3 }}>
        Please read these policies carefully. By using StitchyFlow as a vendor, you agree to all terms below.
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {SECTIONS.map((section) => (
          <Paper key={section.title} elevation={0} sx={{ borderRadius: '14px', border: '1px solid #e8ecf1', bgcolor: '#fff', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <Box sx={{ px: 3, py: 2, display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: '1px solid #f1f5f9' }}>
              <Box sx={{ width: 38, height: 38, borderRadius: '10px', bgcolor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {section.icon}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>{section.title}</Typography>
              </Box>
              <Chip label={section.badge} size="small" sx={{ bgcolor: '#f1f5f9', color: '#64748b', fontSize: '0.68rem', fontWeight: 600 }} />
            </Box>
            <Box sx={{ px: 1 }}>
              {section.items.map((item, i) => (
                <Accordion key={i} expanded={expanded === `${section.title}-${i}`}
                  onChange={(_, v) => setExpanded(v ? `${section.title}-${i}` : false)}
                  elevation={0} disableGutters
                  sx={{ '&:before': { display: 'none' }, borderBottom: i < section.items.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: 18, color: '#94a3b8' }} />}
                    sx={{ px: 2, py: 0.5, minHeight: 48, '& .MuiAccordionSummary-content': { my: 0 } }}>
                    <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.85rem' }}>{item.q}</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: 2, pt: 0, pb: 2 }}>
                    <Typography sx={{ color: '#475569', fontSize: '0.82rem', lineHeight: 1.75 }}>{item.a}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Paper>
        ))}
      </Box>

      <Paper elevation={0} sx={{ borderRadius: '14px', p: 2.5, mt: 3, border: '1px solid #c8e6c9', bgcolor: '#e8f5e9' }}>
        <Typography sx={{ fontWeight: 700, color: FOREST, fontSize: '0.85rem', mb: 0.5 }}>Questions about our policies?</Typography>
        <Typography sx={{ color: '#1b4332', fontSize: '0.8rem', lineHeight: 1.65 }}>
          Contact our support team at <Box component="span" sx={{ fontWeight: 700 }}>hello@stitchyflow.com</Box> or submit a support ticket from the Support Tickets section.
        </Typography>
      </Paper>
    </Box>
  );
}
