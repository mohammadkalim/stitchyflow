# StitchyFlow Admin Panel

**Developer by:** Muhammad Kalim  
**Phone/WhatsApp:** +92 333 3836851  
**Product of:** LogixInventor (PVT) Ltd.  
**Email:** info@logixinventor.com  
**Website:** www.logixinventor.com

## Overview

Professional admin panel for StitchyFlow with complete management capabilities.

## Features

### Dashboard
- 8 medium-sized widgets displaying key metrics
- Professional analytics section
- Real-time data visualization
- Clean white theme with blue accents

### Sidebar Navigation
- Collapsible sidebar with toggle button
- Active page highlighted in blue
- Clean icons for each section
- Smooth transitions

### Pages
1. **Dashboard** - Analytics and overview
2. **Users** - Customer management
3. **Orders** - Order tracking and management
4. **Tailors** - Tailor management
5. **Measurements** - Customer measurements
6. **Payments** - Payment tracking
7. **Reports** - Daily, weekly, monthly reports
8. **Settings** - System configuration

### Login Page
- Clean centered popup design
- "StitchyFlow Login" text at top
- No animations, professional look
- White theme with blue buttons
- No username/password hints

## Installation

```bash
cd StitchyFlow/admin
npm install
```

## Running

```bash
npm start
```

Admin panel runs on: http://localhost:4000

## Theme

- Background: White (#ffffff)
- Primary Color: Blue (#2196F3)
- Accent Color: Blue (#1976d2)
- Text: Black (#000000)

## API Integration

All pages connect to backend API at http://localhost:5000

Endpoints:
- GET /api/v1/admin/analytics
- GET /api/v1/admin/users
- GET /api/v1/admin/orders
- GET /api/v1/admin/tailors
- GET /api/v1/admin/measurements
- GET /api/v1/admin/payments
- GET /api/v1/admin/reports

## Authentication

Uses JWT token stored in localStorage as 'adminToken'

## Technology Stack

- React 18
- Material-UI 5
- React Router 6
- Axios
- Material Icons
