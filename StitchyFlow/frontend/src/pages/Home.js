import React, { useState } from 'react';
import { Box, Typography, Button, Container, Grid, Card, CardContent, Avatar, Rating, IconButton, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';
import Header from '../components/Header';
import Footer from '../components/Footer';

const sliderData = [
  {
    title: 'Professional Tailoring Services',
    subtitle: 'Get custom-fit clothing from expert tailors',
    description: 'Connect with skilled tailors for perfectly tailored outfits',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
  },
  {
    title: 'Custom Dress Making',
    subtitle: 'Design your dream outfit',
    description: 'Bring your fashion ideas to life with our expert tailors',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1200',
  },
  {
    title: 'Quality Alterations',
    subtitle: 'Perfect fit, every time',
    description: 'Professional alterations to make your clothes fit perfectly',
    image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1200',
  },
];

const reviewsData = [
  {
    id: 1,
    name: 'Sarah Ahmed',
    image: 'https://i.pravatar.cc/150?img=1',
    rating: 5,
    comment: 'Excellent tailoring service! The dress they made for me was perfect. Highly recommended!',
    date: 'March 2026',
  },
  {
    id: 2,
    name: 'Mohammad Khan',
    image: 'https://i.pravatar.cc/150?img=3',
    rating: 5,
    comment: 'Very professional tailors. They understood exactly what I wanted. Will definitely order again.',
    date: 'March 2026',
  },
  {
    id: 3,
    name: 'Fatima Ali',
    image: 'https://i.pravatar.cc/150?img=5',
    rating: 4,
    comment: 'Great quality and timely delivery. The stitching was flawless. Good experience overall.',
    date: 'February 2026',
  },
  {
    id: 4,
    name: 'Ali Hassan',
    image: 'https://i.pravatar.cc/150?img=8',
    rating: 5,
    comment: 'Best tailoring service in town! They paid attention to every detail. Very satisfied.',
    date: 'February 2026',
  },
];

const services = [
  {
    title: 'Custom Dresses',
    description: 'Get perfectly tailored dresses designed exactly to your preferences',
    icon: '👗',
  },
  {
    title: 'Suits & Blazers',
    description: 'Professional suits and blazers with perfect fit and finish',
    icon: '👔',
  },
  {
    title: 'Traditional Wear',
    description: 'Authentic traditional outfits including shalwar kameez and more',
    icon: '🥻',
  },
  {
    title: 'Alterations',
    description: 'Expert alterations to give your existing clothes a new life',
    icon: '✂️',
  },
];

function Home() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderData.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderData.length) % sliderData.length);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fff' }}>
      <Header />
      
      {/* Hero Slider */}
      <Box sx={{ position: 'relative', height: { xs: '60vh', md: '80vh' }, overflow: 'hidden', mt: '64px' }}>
        {sliderData.map((slide, index) => (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: index === currentSlide ? 1 : 0,
              transition: 'opacity 0.8s ease-in-out',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `linear-gradient(135deg, rgba(144, 238, 144, 0.85) 0%, rgba(0, 191, 255, 0.85) 100%)`,
                zIndex: 1,
              }}
            />
            <Box
              component="img"
              src={slide.image}
              alt={slide.title}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                mixBlendMode: 'overlay',
              }}
            />
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', alignItems: 'center' }}>
              <Box sx={{ maxWidth: 600 }}>
                <Typography 
                  variant="h2" 
                  sx={{ 
                    fontWeight: 700, 
                    color: '#fff',
                    fontSize: { xs: '2rem', md: '3.5rem' },
                    textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                    mb: 1
                  }}
                >
                  {slide.title}
                </Typography>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: '#fff',
                    fontWeight: 500,
                    mb: 2,
                    textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                  }}
                >
                  {slide.subtitle}
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.9)',
                    mb: 3,
                    fontSize: { xs: '1rem', md: '1.2rem' },
                  }}
                >
                  {slide.description}
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/register')}
                  sx={{
                    backgroundColor: '#410093',
                    fontWeight: 600,
                    borderRadius: '10px',
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    boxShadow: '0 4px 20px rgba(65, 0, 147, 0.4)',
                    '&:hover': {
                      backgroundColor: '#7f00ff',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 25px rgba(65, 0, 147, 0.5)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Get Started
                </Button>
              </Box>
            </Container>
          </Box>
        ))}
        
        {/* Slider Controls */}
        <IconButton
          onClick={prevSlide}
          sx={{
            position: 'absolute',
            left: 20,
            top: '50%',
            transform: 'translateY(-50%)',
            bgcolor: 'rgba(255,255,255,0.9)',
            zIndex: 3,
            '&:hover': { bgcolor: '#fff' },
          }}
        >
          <ArrowBackIcon sx={{ color: '#410093' }} />
        </IconButton>
        <IconButton
          onClick={nextSlide}
          sx={{
            position: 'absolute',
            right: 20,
            top: '50%',
            transform: 'translateY(-50%)',
            bgcolor: 'rgba(255,255,255,0.9)',
            zIndex: 3,
            '&:hover': { bgcolor: '#fff' },
          }}
        >
          <ArrowForwardIcon sx={{ color: '#410093' }} />
        </IconButton>
        
      </Box>

      {/* Services Section */}
      <Box sx={{ py: 8, bgcolor: '#f8f9fa' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ fontWeight: 700, textAlign: 'center', mb: 2, color: '#333' }}>
            Our Services
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'center', color: '#666', mb: 6, maxWidth: 600, mx: 'auto' }}>
            Professional tailoring services tailored to your needs
          </Typography>
          <Grid container spacing={4}>
            {services.map((service, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    textAlign: 'center',
                    py: 4,
                    px: 2,
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 40px rgba(65, 0, 147, 0.15)',
                    },
                  }}
                >
                  <Typography sx={{ fontSize: '3rem', mb: 2 }}>{service.icon}</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#333' }}>
                    {service.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    {service.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Reviews Section */}
      <Box sx={{ py: 8, bgcolor: '#fff' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#333' }}>
                Customer Reviews
              </Typography>
              <Typography variant="body1" sx={{ color: '#666', mt: 1 }}>
                See what our customers say about us
              </Typography>
            </Box>
            <Button
              variant="outlined"
              endIcon={<ArrowForwardIcon />}
              sx={{
                borderColor: '#410093',
                color: '#410093',
                fontWeight: 600,
                borderRadius: '10px',
                '&:hover': {
                  borderColor: '#7f00ff',
                  backgroundColor: 'rgba(65, 0, 147, 0.05)',
                },
              }}
            >
              View All Reviews
            </Button>
          </Box>
          
          <Grid container spacing={4}>
            {reviewsData.map((review) => (
              <Grid item xs={12} sm={6} md={3} key={review.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 12px 40px rgba(65, 0, 147, 0.12)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar 
                        src={review.image} 
                        alt={review.name}
                        sx={{ width: 50, height: 50, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#333' }}>
                          {review.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#999' }}>
                          {review.date}
                        </Typography>
                      </Box>
                    </Box>
                    <Rating 
                      value={review.rating} 
                      readOnly 
                      size="small"
                      sx={{ 
                        mb: 1,
                        '& .MuiRating-iconFilled': { color: '#ffc107' },
                      }}
                    />
                    <Typography variant="body2" sx={{ color: '#666', fontStyle: 'italic' }}>
                      "{review.comment}"
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box 
        sx={{ 
          py: 8, 
          background: 'linear-gradient(135deg, #410093 0%, #7f00ff 100%)',
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff', mb: 2 }}>
            Ready to Get Started?
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 4, fontSize: '1.1rem' }}>
            Join thousands of satisfied customers and get your perfect fit today
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                bgcolor: '#fff',
                color: '#410093',
                fontWeight: 700,
                borderRadius: '10px',
                px: 4,
                py: 1.5,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.9)',
                },
              }}
            >
              Sign Up Now
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: '#fff',
                color: '#fff',
                fontWeight: 600,
                borderRadius: '10px',
                px: 4,
                py: 1.5,
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.8)',
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Learn More
            </Button>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}

export default Home;
