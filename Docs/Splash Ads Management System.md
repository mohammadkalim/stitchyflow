# Splash Ads Management System (Full Module Guide)

## 🎯 Goal

Create a **Splash Ads Management System** for your Tailors Marketplace website with:

* Admin Panel ([http://localhost:4000/dashboard](http://localhost:4000/dashboard))
* Main Website ([http://localhost:3000/](http://localhost:3000/))
* Control ads from admin → show on selected pages

---

# 🧩 Module Structure

## Admin Panel Sidebar

Add a new menu:

* Ads Management

  * Splash Ads
  * Ads Analytics

---

# 📊 Database Design

## Table: ads

```
CREATE TABLE ads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  image_url TEXT,
  redirect_url TEXT,
  start_date DATETIME,
  end_date DATETIME,
  status ENUM('active','inactive') DEFAULT 'active',
  pages JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Table: ads_analytics

```
CREATE TABLE ads_analytics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ad_id INT,
  page VARCHAR(255),
  impressions INT DEFAULT 0,
  clicks INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

# 🧑‍💻 Admin Panel Pages

## 1️⃣ Splash Ads Page

Features:

* Add New Ad
* Upload Image
* Set Redirect URL
* Select Pages (multi-select)
* Start / End Date
* Status (Active / Inactive)

### Pages Options:

* /home
* /marketplace/custom-dresses
* /about
* /marketplace/fabric-selection
* /tailor-dashboard
* /customer-dashboard

### Example Form (React)

```jsx
const [form, setForm] = useState({
  title: "",
  image_url: "",
  redirect_url: "",
  pages: [],
  status: "active"
});

const handleSubmit = async () => {
  await fetch("http://localhost:4000/api/ads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form)
  });
};
```

---

## 2️⃣ Ads Analytics Page

Show:

* Total Impressions
* Total Clicks
* CTR (Click Through Rate)
* Page-wise performance

### Example Query

```sql
SELECT ad_id, page, SUM(impressions) as impressions, SUM(clicks) as clicks
FROM ads_analytics
GROUP BY ad_id, page;
```

---

# ⚙️ Backend APIs (Node.js / Express)

## Create Ad

```
POST /api/ads
```

## Get Active Ads

```
GET /api/ads?page=/home
```

## Track Impression

```
POST /api/ads/impression
```

## Track Click

```
POST /api/ads/click
```

---

# 🌐 Frontend Integration (Main Website)

## Splash Ads Component

```jsx
import { useEffect, useState } from "react";

export default function SplashAd({ page }) {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:4000/api/ads?page=${page}`)
      .then(res => res.json())
      .then(data => setAds(data));
  }, [page]);

  if (!ads.length) return null;

  const ad = ads[0];

  return (
    <div className="splash-ad">
      <a href={ad.redirect_url} target="_blank">
        <img src={ad.image_url} alt={ad.title} />
      </a>
    </div>
  );
}
```

---

# 📍 Use on Pages

Add this component:

```jsx
<SplashAd page="/home" />
<SplashAd page="/marketplace/custom-dresses" />
<SplashAd page="/about" />
<SplashAd page="/marketplace/fabric-selection" />
<SplashAd page="/tailor-dashboard" />
<SplashAd page="/customer-dashboard" />
```

---

# 📈 Tracking Logic

## Impression (on load)

```jsx
useEffect(() => {
  fetch("http://localhost:4000/api/ads/impression", {
    method: "POST",
    body: JSON.stringify({ ad_id: ad.id, page })
  });
}, []);
```

## Click Tracking

```jsx
const handleClick = () => {
  fetch("http://localhost:4000/api/ads/click", {
    method: "POST",
    body: JSON.stringify({ ad_id: ad.id, page })
  });
};
```

---

# 🎨 UI Suggestions

## Splash Ad Style

* Fullscreen overlay OR top banner
* Close button (X)
* Auto-hide after 5 seconds

```css
.splash-ad {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}
```

---

# ✅ Features Summary

✔ Admin controls everything
✔ Select specific pages
✔ Schedule ads
✔ Track impressions & clicks
✔ Show ads dynamically on frontend
✔ Analytics dashboard

---

# 🚀 Next Step (Optional)

* Add video ads support
* Add multiple ads rotation
* Add user targeting (tailor / customer)
* Add frequency control (once per user)

---

If you want, I can also:

* Build full React Admin UI
* Create Node.js backend ready code
* Design database with Sequelize / Prisma
