/**
 * Footer Component — with dynamic social media links from DB
 * Developer by: Muhammad Kalim
 * Phone/WhatsApp: +92 333 3836851
 * Product of LogixInventor (PVT) Ltd.
 * Email: info@logixinventor.com
 * Website: www.logixinventor.com
 */
import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, IconButton, Container, Divider, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import PinterestIcon from '@mui/icons-material/Pinterest';
import ShareIcon from '@mui/icons-material/Share';
import LanguageIcon from '@mui/icons-material/Language';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContentCutIcon from '@mui/icons-material/ContentCut';

const API_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1').replace(/\/$/, '');

// Map platform name → MUI icon
function getSocialIcon(platform, size = 18) {
  const sx = { fontSize: size };
  const p = (platform || '').toLowerCase();
  if (p === 'facebook')  return <FacebookIcon sx={sx} />;
  if (p === 'instagram') return <InstagramIcon sx={sx} />;
  if (p === 'twitter')   return <TwitterIcon sx={sx} />;
  if (p === 'youtube')   return <YouTubeIcon sx={sx} />;
  if (p === 'linkedin')  return <LinkedInIcon sx={sx} />;
  if (p === 'pinterest') return <PinterestIcon sx={sx} />;
  if (p === 'tiktok' || p === 'snapchat' || p === 'whatsapp') return <ShareIcon sx={sx} />;
  return <LanguageIcon sx={sx} />;
}

const linkSx = {
  color: 'rgba(255,255,255,0.55)',
  fontSize: '0.82rem',
  display: 'block',
  mb: 1,
  cursor: 'pointer',
  transition: 'color 0.2s',
  '&:hover': { color: '#fff' },
};

function Footer() {
  const navigate = useNavigate();
  const [socialLinks, setSocialLinks] = useState([]);

  /* Fetch social media links for footer from DB */
  useEffect(() => {
    fetch(`${API_BASE}/social-media`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setSocialLinks((data.data || []).filter(l => l.show_footer && l.is_active));
        }
      })
      .catch(() => {});
  }, []);

  // Split footer links by position
  const leftLinks  = socialLinks.filter(l => l.footer_position === 'left');
  const rightLinks = socialLinks.filter(l => l.footer_position === 'right');

  // Render a set of social icon buttons
  const renderSocialIcons = (links) => links.map(link => (
    <Tooltip key={link.id} title={link.label} arrow>
      <IconButton
        size="small"
        component="a"
        href={link.url}
        target="_blank"
        rel="noreferrer"
        sx={{
          color: link.color || 'rgba(255,255,255,0.5)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '6px', p: 0.6,
          '&:hover': {
            color: link.color || '#fff',
            borderColor: link.color || 'rgba(255,255,255,0.4)',
            bgcolor: 'rgba(255,255,255,0.06)',
          },
          transition: 'all 0.18s',
        }}
      >
        {getSocialIcon(link.platform)}
      </IconButton>
    </Tooltip>
  ));

  return (
    <Box component="footer" sx={{ bgcolor: '#0d1b2a', color: '#fff' }}>
      <Container maxWidth="lg" sx={{ pt: 6, pb: 4 }}>
        <Grid container spacing={4}>

          {/* Col 1 — Brand */}
          <Grid item xs={12} md={3}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2 }}>
              <Box sx={{
                width: 36, height: 36, borderRadius: '8px',
                bgcolor: '#2563eb',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <ContentCutIcon sx={{ color: '#fff', fontSize: 18 }} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#fff', lineHeight: 1.1 }}>
                  StitchyFlow
                </Typography>
                <Typography sx={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Enterprise Edition
                </Typography>
              </Box>
            </Box>

            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', lineHeight: 1.7, mb: 3, maxWidth: 220 }}>
              Pakistan's leading tailoring marketplace. We connect customers with verified tailors through our secure, automated marketplace infrastructure.
            </Typography>

            {/* Social Icons — Left position from DB */}
            {leftLinks.length > 0 ? (
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {renderSocialIcons(leftLinks)}
              </Box>
            ) : (
              /* Fallback static icons if no DB links configured */
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {[FacebookIcon, InstagramIcon, LinkedInIcon, TwitterIcon].map((Icon, i) => (
                  <IconButton key={i} size="small"
                    sx={{
                      color: 'rgba(255,255,255,0.5)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '6px', p: 0.6,
                      '&:hover': { color: '#fff', borderColor: 'rgba(255,255,255,0.4)', bgcolor: 'rgba(255,255,255,0.06)' },
                    }}>
                    <Icon fontSize="small" />
                  </IconButton>
                ))}
              </Box>
            )}
          </Grid>

          {/* Col 2 — Marketplace */}
          <Grid item xs={6} md={3}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', mb: 2 }}>
              Marketplace
            </Typography>
            {[
              { label: 'All Tailors',     path: '/All-tailers' },
              { label: 'Suits & Blazers', path: '/marketplace/suits-blazers' },
              { label: 'Bridal Wear',     path: '/marketplace/bridal-wear' },
              { label: 'Traditional Wear',path: '/marketplace/traditional-wear' },
              { label: 'Alterations',     path: '/marketplace/alterations' },
              { label: 'Fabric Selection',path: '/marketplace/fabric-selection' },
            ].map((item) => (
              <Box key={item.label} onClick={() => navigate(item.path)} sx={linkSx}>· {item.label}</Box>
            ))}
          </Grid>

          {/* Col 3 — Company */}
          <Grid item xs={6} md={3}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', mb: 2 }}>
              Company
            </Typography>
            {[
              { label: 'About StitchyFlow', path: '/about' },
              { label: 'How It Works',      path: '/how-it-works' },
              { label: 'Careers',           path: '/careers' },
              { label: 'Press & Media',     path: '/press-media' },
              { label: 'Industry Blog',     path: '/blog' },
            ].map((item) => (
              <Box key={item.label} onClick={() => navigate(item.path)} sx={linkSx}>{item.label}</Box>
            ))}
          </Grid>

          {/* Col 4 — Contact */}
          <Grid item xs={12} md={3}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', mb: 2 }}>
              Contact
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <PhoneIcon sx={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', mt: 0.2 }} />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem' }}>
                  +92 333 3836851
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <EmailIcon sx={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', mt: 0.2 }} />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem' }}>
                  info@logixinventor.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <LocationOnIcon sx={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', mt: 0.2 }} />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', lineHeight: 1.5 }}>
                  DHA Phase 6,<br />Karachi, Sindh, Pakistan
                </Typography>
              </Box>
            </Box>

            {/* Right-position social icons */}
            {rightLinks.length > 0 && (
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 2 }}>
                {renderSocialIcons(rightLinks)}
              </Box>
            )}
          </Grid>

        </Grid>
      </Container>

      {/* Bottom Bar */}
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
      <Container maxWidth="lg">
        <Box sx={{
          py: 2,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 1,
        }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>
            © 2026 LogixInventor (PVT) Ltd.
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
            <CheckCircleIcon sx={{ fontSize: 13, color: '#16a34a' }} />
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
              Secure Platform
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            {[
              { label: 'Privacy', path: '/privacy' },
              { label: 'Terms', path: '/terms' },
              { label: 'Sitemap', path: '/sitemap' },
            ].map((item) => (
              <Box key={item.label} onClick={() => navigate(item.path)}
                sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', cursor: 'pointer', '&:hover': { color: '#fff' } }}>
                {item.label}
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
