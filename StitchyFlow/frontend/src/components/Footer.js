import React from 'react';
import { Box, Typography, Grid, IconButton, Link } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#0a1929',
        color: '#fff',
        pt: 4,
        pb: 3,
        px: { xs: 2, md: 6 },
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#fff' }}>
            StitchyFlow
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2, fontSize: '0.85rem' }}>
            Professional Tailoring Marketplace connecting customers with skilled tailors for custom clothing solutions.
          </Typography>
          <Box>
            <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#00bfff' } }}>
              <FacebookIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#00bfff' } }}>
              <TwitterIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#00bfff' } }}>
              <InstagramIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#00bfff' } }}>
              <LinkedInIcon fontSize="small" />
            </IconButton>
          </Box>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#fff', fontSize: '1rem' }}>
            Quick Links
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {['Home', 'Services', 'About Us', 'Contact'].map((item) => (
              <Link
                key={item}
                href="#"
                underline="none"
                sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', '&:hover': { color: '#fff' } }}
              >
                {item}
              </Link>
            ))}
          </Box>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#fff', fontSize: '1rem' }}>
            Contact Us
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOnIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.7)' }} />
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>
                123 Fashion Street, Karachi, Pakistan
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PhoneIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.7)' }} />
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>
                +92 333 3836851
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmailIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.7)' }} />
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>
                info@logixinventor.com
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', mt: 3, pt: 2, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>
          © 2026 StitchyFlow. All rights reserved. Powered by LogixInventor (PVT) Ltd.
        </Typography>
      </Box>
    </Box>
  );
}

export default Footer;
