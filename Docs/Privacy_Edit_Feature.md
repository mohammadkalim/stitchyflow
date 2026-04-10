# Privacy Edit Feature - Complete Documentation

**Developer by:** Muhammad Kalim  
**Phone/WhatsApp:** +92 333 3836851  
**Product of:** LogixInventor (PVT) Ltd.  
**Email:** info@logixinventor.com  
**Website:** www.logixinventor.com

---

## Overview

The Privacy Edit feature allows administrators to edit the main website's static pages:
- **About StitchyFlow**
- **Privacy Policy**
- **Terms & Conditions**
- **Sitemap**

All content is stored in the database and can be edited with a professional rich text editor that supports **text formatting and image uploads**.

---

## Features

### ✅ Text Editing
- Bold, Italic, Underline
- Headings (H2, H3)
- Paragraphs
- Bullet Lists
- Numbered Lists
- Links

### ✅ Image Upload (NEW)
- Upload images directly into the content
- Supported formats: JPG, PNG, WEBP, GIF, SVG
- Maximum file size: 5MB
- Automatic image optimization (JPEG/PNG)
- Images stored in `/uploads/privacy/` directory

### ✅ SEO Optimization
- Meta Title
- Meta Description
- Active/Inactive toggle

### ✅ Professional UI/UX
- Blue color scheme (#1565C0, #1976D2, #42A5F5)
- Tabbed interface
- Preview/Edit toggle
- Real-time database sync
- Success/error notifications
- Responsive design

---

## Database Table

### Table: `privacy_pages`

```sql
CREATE TABLE `privacy_pages` (
  `id`          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  `page_key`    VARCHAR(50)     NOT NULL UNIQUE,
  `title`       VARCHAR(255)    NOT NULL,
  `content`     LONGTEXT        NOT NULL,
  `meta_title`  VARCHAR(255)    DEFAULT NULL,
  `meta_desc`   VARCHAR(500)    DEFAULT NULL,
  `is_active`   TINYINT(1)      NOT NULL DEFAULT 1,
  `created_at`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_page_key` (`page_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Default Data

| Page Key | Title | Status |
|----------|-------|--------|
| `about` | About StitchyFlow | Active |
| `privacy` | Privacy Policy | Active |
| `terms` | Terms & Conditions | Active |
| `sitemap` | Sitemap | Active |

---

## API Endpoints

### 1. Get All Pages
```http
GET /api/v1/privacy-pages
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "page_key": "about",
      "title": "About StitchyFlow",
      "content": "<h2>About StitchyFlow</h2>...",
      "meta_title": "About StitchyFlow",
      "meta_desc": "Learn about StitchyFlow.",
      "is_active": 1,
      "created_at": "2026-04-10T07:44:52.000Z",
      "updated_at": "2026-04-10T07:44:52.000Z"
    }
  ]
}
```

### 2. Get Single Page
```http
GET /api/v1/privacy-pages/:key
```
**Example:** `/api/v1/privacy-pages/about`

### 3. Update Page (Admin Only)
```http
PUT /api/v1/privacy-pages/:key
Authorization: Bearer <admin_token>
Content-Type: application/json
```
**Request Body:**
```json
{
  "title": "About StitchyFlow",
  "content": "<h2>About StitchyFlow</h2><p>Updated content...</p>",
  "meta_title": "About StitchyFlow - Professional Tailoring",
  "meta_desc": "Learn about StitchyFlow platform.",
  "is_active": true
}
```

### 4. Upload Image (Admin Only) - NEW
```http
POST /api/v1/privacy-pages/upload-image
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data
```
**Request Body:**
- `image`: Image file (max 5MB, JPG/PNG/WEBP/GIF/SVG)

**Response:**
```json
{
  "success": true,
  "data": {
    "imageUrl": "/uploads/privacy/1234567890-image_optimized.jpg"
  }
}
```

---

## How to Access

### Option 1: Via Settings Page
1. Go to http://localhost:4000/settings
2. Click "Privacy & Pages" tab in the left sidebar
3. Select a page tab (About, Privacy, Terms, Sitemap)
4. Edit content using the rich text editor
5. Click "Save Changes"

### Option 2: Direct Route
1. Go to http://localhost:4000/privacy-pages
2. Navigate between tabs
3. Edit and save

### Option 3: Via Sidebar Menu
1. Look for "Privacy & Pages" in the admin sidebar
2. Click to navigate

---

## How to Use Image Upload

1. **Open the Editor**
   - Navigate to Settings → Privacy & Pages
   - Select any page tab

2. **Insert Image**
   - Click the 🖼️ (image) button in the toolbar
   - Select an image file from your computer
   - Wait for upload (shows ⏳ while uploading)
   - Image will be inserted at cursor position

3. **Format Image** (Optional)
   - Click on the inserted image to select it
   - Use the toolbar to add links around it if needed

4. **Save Changes**
   - Click "Save Changes" button
   - Image will be saved in the HTML content

---

## Image Storage

- **Directory:** `/StitchyFlow/backend/uploads/privacy/`
- **URL Pattern:** `http://localhost:5000/uploads/privacy/[filename]`
- **Optimization:** 
  - JPEG/PNG images are automatically optimized
  - Resized to max 1920x1080
  - Compressed to 85% quality
  - Saved as `_optimized.jpg`

---

## Technology Stack

### Backend
- **Node.js** + **Express.js**
- **Multer** - File upload handling
- **Sharp** - Image processing and optimization
- **MySQL** - Database storage

### Frontend
- **React.js** + **Material-UI**
- **contentEditable** - Rich text editing
- **Axios** - API communication

---

## Security

- ✅ Authentication required for updates (JWT token)
- ✅ File type validation (images only)
- ✅ File size limit (5MB)
- ✅ Image optimization to prevent large files
- ✅ Safe filename generation

---

## Troubleshooting

### Image Upload Fails
- Check file size (max 5MB)
- Check file type (JPG, PNG, WEBP, GIF, SVG only)
- Ensure backend server is running
- Check console for error messages

### Content Not Saving
- Ensure you're logged in as admin
- Check browser console for errors
- Verify backend API is accessible
- Check database connection

### Images Not Displaying
- Verify backend uploads directory exists
- Check file permissions on uploads folder
- Ensure backend static file serving is configured

---

## Credentials

### Admin Panel
- **URL:** http://localhost:4000
- **Username:** admin@stitchyflow.com
- **Password:** admin123

### Backend API
- **URL:** http://localhost:5000
- **Health Check:** http://localhost:5000/health

### Database
- **Host:** localhost:3306
- **phpMyAdmin:** http://localhost:8080/phpmyadmin
- **Username:** root
- **Password:** 12345
- **Database:** stitchyflow

---

## Changelog

### April 10, 2026
- ✅ Added image upload functionality
- ✅ Implemented automatic image optimization
- ✅ Added image upload button to rich text toolbar
- ✅ Updated backend route for image uploads
- ✅ Enhanced UI with upload progress indicator

---

## Support

For technical support or questions:
- **Email:** info@logixinventor.com
- **Phone/WhatsApp:** +92 333 3836851
- **Website:** www.logixinventor.com

---

**Last Updated:** April 10, 2026
