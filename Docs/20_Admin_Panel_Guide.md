# Admin Panel Guide

**Developer by:** Muhammad Kalim  
**Phone/WhatsApp:** +92 333 3836851  
**Product of:** LogixInventor (PVT) Ltd.  
**Email:** info@logixinventor.com  
**Website:** www.logixinventor.com

---

## Overview

The StitchyFlow Admin Panel is a professional, full-featured management dashboard designed with a clean white theme and blue accents. It provides comprehensive control over all aspects of the StitchyFlow platform.

## Access Information

- **URL:** http://localhost:4000
- **Default Credentials:** Set up through backend authentication
- **Authentication:** JWT-based with secure token storage

## Features

### 1. Dashboard
The main dashboard provides an at-a-glance view of your business metrics.

**Widgets (8 Medium-Sized Cards):**
1. Total Customers - Count of all registered customers
2. Total Tailors - Count of all registered tailors
3. Total Orders - Total number of orders placed
4. Total Payments - Count of completed payments
5. Pending Orders - Orders awaiting processing
6. Completed Orders - Successfully completed orders
7. In Progress - Orders currently being worked on
8. Total Revenue - Sum of all completed payments

**Professional Analytics Section:**
- Order Statistics (Pending, In Progress, Completed)
- User Statistics (Customers, Tailors, Revenue)

### 2. Sidebar Navigation

**Features:**
- Collapsible design with toggle button
- Active page highlighted in blue (#2196F3)
- Clean icons for each section
- Smooth transitions
- Logout button in header

**Menu Items:**
1. Dashboard - Analytics overview
2. Users - Customer management
3. Orders - Order tracking
4. Tailors - Tailor management
5. Measurements - Measurement records
6. Payments - Payment tracking
7. Reports - Analytics reports
8. Settings - System configuration

### 3. Users Page

**Features:**
- Complete list of all users (customers and tailors)
- Table columns:
  - ID
  - Name
  - Email
  - Phone
  - Role (with blue chip)
  - Status (Active/Inactive with color coding)
- Sortable and searchable
- Real-time data from backend

### 4. Orders Page

**Features:**
- Comprehensive order management
- Table columns:
  - Order ID
  - Customer Name
  - Tailor Name
  - Status (color-coded chips)
  - Total Amount
  - Date
- Status colors:
  - Pending: Orange (#ff9800)
  - In Progress: Blue (#2196F3)
  - Completed: Green (#4caf50)
  - Cancelled: Red (#f44336)

### 5. Tailors Page

**Features:**
- Dedicated tailor management
- Table columns:
  - ID
  - Name
  - Email
  - Phone
  - Specialization
  - Status (Active/Inactive)
- Quick status overview

### 6. Measurements Page

**Features:**
- Customer measurement records
- Table columns:
  - ID
  - Customer Name
  - Garment Type
  - Chest
  - Waist
  - Length
  - Date
- Historical tracking

### 7. Payments Page

**Features:**
- Payment transaction tracking
- Table columns:
  - Payment ID
  - Order ID
  - Customer Name
  - Amount
  - Payment Method
  - Status (Completed/Pending)
  - Date
- Financial overview

### 8. Reports Page

**Three Report Cards:**

**Daily Report:**
- Daily Revenue
- Orders Today

**Weekly Report:**
- Weekly Revenue
- Orders This Week

**Monthly Report:**
- Monthly Revenue
- Orders This Month

### 9. Settings Page

**Configuration Options:**
- Site Name
- Admin Email
- Support Email
- Phone Number
- Save functionality

### 10. Login Page

**Design:**
- Clean centered popup
- "StitchyFlow Login" header text
- White background
- Blue buttons (#2196F3)
- No animations
- No username/password hints
- Professional appearance
- Error message display

## Theme & Design

### Color Scheme
- **Background:** White (#ffffff)
- **Primary Color:** Blue (#2196F3)
- **Secondary Color:** Dark Blue (#1976d2)
- **Text:** Black (#000000)
- **Success:** Green (#4caf50)
- **Warning:** Orange (#ff9800)
- **Error:** Red (#f44336)
- **Border:** Light Gray (#e0e0e0)

### Typography
- Clean, modern fonts
- Proper hierarchy
- Readable sizes
- Professional weight

### Layout
- Responsive design
- Clean spacing
- Consistent padding
- Professional appearance

## API Integration

### Endpoints

All endpoints require JWT authentication via Bearer token.

**Analytics:**
```
GET /api/v1/admin/analytics
Response: {
  total_customers, total_tailors, total_orders,
  total_payments, total_revenue, pending_orders,
  completed_orders, in_progress_orders
}
```

**Users:**
```
GET /api/v1/admin/users
Response: Array of user objects
```

**Orders:**
```
GET /api/v1/admin/orders
Response: Array of order objects with customer and tailor names
```

**Tailors:**
```
GET /api/v1/admin/tailors
Response: Array of tailor objects
```

**Measurements:**
```
GET /api/v1/admin/measurements
Response: Array of measurement objects with customer names
```

**Payments:**
```
GET /api/v1/admin/payments
Response: Array of payment objects with customer names
```

**Reports:**
```
GET /api/v1/admin/reports
Response: {
  daily_revenue, weekly_revenue, monthly_revenue,
  total_orders_today, total_orders_week, total_orders_month
}
```

## Authentication Flow

1. User enters credentials on login page
2. POST request to `/api/v1/auth/login`
3. Receive JWT token
4. Store token in localStorage as 'adminToken'
5. Include token in all subsequent requests
6. Logout removes token and redirects to login

## Security Features

- JWT token authentication
- Protected routes
- Automatic redirect to login if not authenticated
- Secure token storage
- Token validation on each request
- Logout functionality

## Installation & Setup

### Prerequisites
- Node.js 16+
- npm or yarn
- Backend API running on port 5000

### Installation Steps

```bash
# Navigate to admin directory
cd StitchyFlow/admin

# Install dependencies
npm install

# Start development server
npm start
```

The admin panel will be available at http://localhost:4000

### Build for Production

```bash
npm run build
```

## File Structure

```
StitchyFlow/admin/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── Layout.js          # Main layout with sidebar
│   ├── pages/
│   │   ├── Dashboard.js       # Dashboard with widgets
│   │   ├── Login.js           # Login page
│   │   ├── Users.js           # User management
│   │   ├── Orders.js          # Order management
│   │   ├── Tailors.js         # Tailor management
│   │   ├── Measurements.js    # Measurements
│   │   ├── Payments.js        # Payment tracking
│   │   ├── Reports.js         # Analytics reports
│   │   └── Settings.js        # Settings page
│   ├── App.js                 # Main app with routing
│   └── index.js               # Entry point
├── package.json
└── README.md
```

## Troubleshooting

### Common Issues

**1. Cannot connect to backend**
- Ensure backend is running on port 5000
- Check CORS settings in backend
- Verify API endpoints

**2. Authentication fails**
- Check credentials
- Verify JWT token is being sent
- Check token expiration

**3. Data not loading**
- Check network tab for errors
- Verify API responses
- Check console for errors

**4. Sidebar not working**
- Clear browser cache
- Check React Router configuration
- Verify route paths

## Best Practices

1. **Always logout** when finished
2. **Refresh data** regularly for latest information
3. **Check reports** daily for business insights
4. **Monitor orders** for pending items
5. **Review payments** for financial tracking

## Support

For technical support or questions:
- **Email:** info@logixinventor.com
- **Phone:** +92 333 3836851
- **Developer:** Muhammad Kalim
- **Company:** LogixInventor (PVT) Ltd.

---

**Last Updated:** March 30, 2026  
**Version:** 1.1.0
