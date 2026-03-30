# Performance & Optimization Guide

**Project Name:** StitchyFlow  
**Version:** 1.0  
**Date:** March 30, 2026  
**Prepared by:** Muhammad Kalim, LogixInventor (PVT) Ltd.

---

## 1. Performance Goals

### 1.1 Target Metrics
- Page load time: < 2 seconds
- API response time: < 500ms (95th percentile)
- Time to Interactive (TTI): < 3 seconds
- First Contentful Paint (FCP): < 1.5 seconds
- Concurrent users: 1000+
- Database query time: < 100ms

---

## 2. Frontend Optimization

### 2.1 Code Splitting

```javascript
// Lazy load routes
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Orders = lazy(() => import('./pages/Orders'));

// Use Suspense
<Suspense fallback={<Loading />}>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/orders" element={<Orders />} />
  </Routes>
</Suspense>
```

### 2.2 Image Optimization

```javascript
// Lazy load images
<img 
  src={thumbnail} 
  data-src={fullImage}
  loading="lazy"
  alt="Description"
/>

// Use WebP format
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description">
</picture>
```

### 2.3 Bundle Optimization

```javascript
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10
        }
      }
    }
  }
};
```

### 2.4 Caching Strategy

```javascript
// Service Worker caching
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

---

## 3. Backend Optimization

### 3.1 Async Operations

```javascript
// Use async/await
async function getOrders(userId) {
  try {
    const orders = await Order.findAll({ where: { userId } });
    return orders;
  } catch (error) {
    throw error;
  }
}

// Parallel execution
const [users, orders, payments] = await Promise.all([
  User.findAll(),
  Order.findAll(),
  Payment.findAll()
]);
```

### 3.2 Response Compression

```javascript
const compression = require('compression');
app.use(compression());
```

### 3.3 Connection Pooling

```javascript
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 20,
  queueLimit: 0
});
```

---

## 4. Database Optimization

### 4.1 Indexing Strategy

```sql
-- Create indexes for frequently queried columns
CREATE INDEX idx_orders_customer_status ON orders(customer_id, status);
CREATE INDEX idx_orders_tailor_status ON orders(tailor_id, status);
CREATE INDEX idx_orders_created ON orders(created_at);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role_status ON users(role, status);
```

### 4.2 Query Optimization

```sql
-- Use EXPLAIN to analyze queries
EXPLAIN SELECT * FROM orders WHERE customer_id = 1;

-- Optimize with proper indexes
-- Avoid SELECT *, specify columns
SELECT order_id, order_number, status FROM orders WHERE customer_id = 1;

-- Use LIMIT for pagination
SELECT * FROM orders ORDER BY created_at DESC LIMIT 20 OFFSET 0;
```

### 4.3 Stored Procedures

```sql
-- Use stored procedures for complex operations
DELIMITER $$
CREATE PROCEDURE sp_get_dashboard_stats(IN p_user_id INT)
BEGIN
  SELECT 
    (SELECT COUNT(*) FROM orders WHERE customer_id = p_user_id) as total_orders,
    (SELECT COUNT(*) FROM orders WHERE customer_id = p_user_id AND status = 'completed') as completed_orders,
    (SELECT SUM(final_price) FROM orders WHERE customer_id = p_user_id) as total_spent;
END$$
DELIMITER ;
```

---

## 5. Redis Caching

### 5.1 Cache Implementation

```javascript
const redis = require('redis');
const client = redis.createClient();

// Cache middleware
async function cacheMiddleware(req, res, next) {
  const key = `cache:${req.originalUrl}`;
  
  try {
    const cached = await client.get(key);
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    next();
  } catch (error) {
    next();
  }
}

// Set cache
async function setCache(key, data, ttl = 300) {
  await client.setex(key, ttl, JSON.stringify(data));
}
```

### 5.2 Cache Strategy

```javascript
// Cache user profile (5 minutes)
app.get('/api/users/profile', cacheMiddleware, async (req, res) => {
  const profile = await getUserProfile(req.user.id);
  await setCache(`cache:${req.originalUrl}`, profile, 300);
  res.json(profile);
});

// Cache tailor list (15 minutes)
app.get('/api/tailors', cacheMiddleware, async (req, res) => {
  const tailors = await getTailors();
  await setCache(`cache:${req.originalUrl}`, tailors, 900);
  res.json(tailors);
});
```

### 5.3 Cache Invalidation

```javascript
// Invalidate on update
async function updateOrder(orderId, data) {
  await Order.update(data, { where: { id: orderId } });
  
  // Invalidate related caches
  await client.del(`cache:/api/orders/${orderId}`);
  await client.del(`cache:/api/orders`);
}
```

---

## 6. Load Testing

### 6.1 Artillery Configuration

```yaml
# load-test.yml
config:
  target: 'http://localhost:5000'
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Sustained load"
    - duration: 60
      arrivalRate: 100
      name: "Peak load"

scenarios:
  - name: "Get orders"
    flow:
      - get:
          url: "/api/orders"
          headers:
            Authorization: "Bearer {{token}}"
```

### 6.2 Run Load Tests

```bash
# Install Artillery
npm install -g artillery

# Run test
artillery run load-test.yml

# Generate report
artillery run --output report.json load-test.yml
artillery report report.json
```

---

## 7. Monitoring Performance

### 7.1 Application Metrics

```javascript
// Track response time
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.url} - ${duration}ms`);
  });
  next();
});
```

### 7.2 Database Monitoring

```sql
-- Enable slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1;

-- Check slow queries
SELECT * FROM mysql.slow_log ORDER BY query_time DESC LIMIT 10;
```

---

## 8. Performance Checklist

### 8.1 Frontend
- [ ] Code splitting implemented
- [ ] Images optimized and lazy loaded
- [ ] Bundle size minimized
- [ ] Caching headers configured
- [ ] Gzip compression enabled
- [ ] CDN for static assets (if applicable)

### 8.2 Backend
- [ ] Async operations used
- [ ] Response compression enabled
- [ ] Connection pooling configured
- [ ] Rate limiting implemented
- [ ] Efficient algorithms used

### 8.3 Database
- [ ] Proper indexes created
- [ ] Queries optimized
- [ ] Stored procedures used
- [ ] Connection pooling configured
- [ ] Regular maintenance scheduled

### 8.4 Caching
- [ ] Redis caching implemented
- [ ] Cache strategy defined
- [ ] Cache invalidation working
- [ ] TTL configured appropriately

---

**Document Version:** 1.0  
**Last Updated:** March 30, 2026  
**Author:** Muhammad Kalim  
**Company:** LogixInventor (PVT) Ltd.  
**Contact:** info@logixinventor.com | +92 333 3836851
