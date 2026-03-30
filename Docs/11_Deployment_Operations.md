# Deployment & Operations Guide

**Project Name:** StitchyFlow  
**Version:** 1.0  
**Date:** March 30, 2026  
**Prepared by:** Muhammad Kalim, LogixInventor (PVT) Ltd.

---

## 1. Production Environment

### 1.1 Server Requirements
- **OS:** Ubuntu 20.04 LTS or higher
- **CPU:** 4 cores minimum
- **RAM:** 8GB minimum
- **Storage:** 100GB SSD
- **Network:** Static IP, domain name

### 1.2 Software Stack
- Node.js 14+
- MySQL 8.0+
- Redis 6+
- PM2 (latest)
- OpenLiteSpeed (latest)
- Certbot (latest)

---

## 2. Server Setup

### 2.1 Initial Server Configuration

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs

# Install MySQL
sudo apt install -y mysql-server
sudo mysql_secure_installation

# Install Redis
sudo apt install -y redis-server
sudo systemctl enable redis-server

# Install PM2
sudo npm install -g pm2

# Install Git
sudo apt install -y git
```

### 2.2 OpenLiteSpeed Installation

```bash
# Add repository
wget -O - http://rpms.litespeedtech.com/debian/enable_lst_debian_repo.sh | sudo bash

# Install OpenLiteSpeed
sudo apt install -y openlitespeed

# Start service
sudo systemctl start lsws
sudo systemctl enable lsws
```

### 2.3 SSL Certificate Setup

```bash
# Install Certbot
sudo apt install -y certbot

# Obtain certificate
sudo certbot certonly --webroot -w /usr/local/lsws/Example/html \
  -d stitchyflow.com -d www.stitchyflow.com

# Auto-renewal
sudo crontab -e
# Add: 0 0 * * * certbot renew --quiet
```

---

## 3. Application Deployment

### 3.1 Clone Repository

```bash
cd /var/www
sudo git clone <repository-url> stitchyflow
cd stitchyflow
sudo chown -R www-data:www-data /var/www/stitchyflow
```

### 3.2 Backend Deployment

```bash
cd /var/www/stitchyflow/backend

# Install dependencies
npm install --production

# Configure environment
cp .env.example .env
nano .env
# Update with production values

# Setup database
mysql -u root -p < database/schema.sql
```

### 3.3 Frontend Build

```bash
cd /var/www/stitchyflow/frontend
npm install
npm run build

cd /var/www/stitchyflow/admin
npm install
npm run build
```

---

## 4. PM2 Configuration

### 4.1 Ecosystem File

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'stitchyflow-api',
    script: './backend/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/api-err.log',
    out_file: './logs/api-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    min_uptime: '10s',
    max_restarts: 10
  }]
};
```

### 4.2 Start Application

```bash
cd /var/www/stitchyflow
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## 5. OpenLiteSpeed Configuration

### 5.1 Virtual Host Setup

1. Access WebAdmin: https://your-server:7080
2. Create Virtual Host
3. Configure settings:
   - Document Root: `/var/www/stitchyflow/frontend/build`
   - Domain: stitchyflow.com
   - Enable SSL

### 5.2 Reverse Proxy for API

Add context in Virtual Host:
- URI: `/api/`
- Type: Proxy
- Web Server Address: `http://localhost:5000`

### 5.3 Static File Serving

Configure for frontend and admin builds

---

## 6. Database Configuration

### 6.1 Production Database Setup

```sql
CREATE DATABASE stitchyflow CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER 'stitchyflow_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT SELECT, INSERT, UPDATE, DELETE, EXECUTE ON stitchyflow.* TO 'stitchyflow_user'@'localhost';
FLUSH PRIVILEGES;
```

### 6.2 Import Schema

```bash
mysql -u root -p stitchyflow < database/schema.sql
mysql -u root -p stitchyflow < database/procedures.sql
mysql -u root -p stitchyflow < database/seed.sql
```

---

## 7. Monitoring Setup

### 7.1 PM2 Monitoring

```bash
# Install PM2 monitoring
pm2 install pm2-logrotate

# Configure log rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### 7.2 Application Monitoring

```bash
# View logs
pm2 logs

# Monitor processes
pm2 monit

# Check status
pm2 status
```

---

## 8. Backup Strategy

### 8.1 Database Backup

```bash
#!/bin/bash
# backup-db.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/stitchyflow"
mkdir -p $BACKUP_DIR

mysqldump -u root -p stitchyflow | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Keep last 30 days
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +30 -delete
```

### 8.2 Application Backup

```bash
#!/bin/bash
# backup-app.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/stitchyflow"

tar -czf $BACKUP_DIR/app_$DATE.tar.gz /var/www/stitchyflow

# Keep last 7 days
find $BACKUP_DIR -name "app_*.tar.gz" -mtime +7 -delete
```

### 8.3 Automated Backups

```bash
# Add to crontab
crontab -e

# Daily database backup at 2 AM
0 2 * * * /usr/local/bin/backup-db.sh

# Weekly application backup on Sunday at 3 AM
0 3 * * 0 /usr/local/bin/backup-app.sh
```

---

## 9. Maintenance Procedures

### 9.1 Application Updates

```bash
cd /var/www/stitchyflow
git pull origin main
cd backend && npm install
cd ../frontend && npm install && npm run build
cd ../admin && npm install && npm run build
pm2 restart all
```

### 9.2 Database Maintenance

```bash
# Optimize tables
mysqlcheck -u root -p --optimize stitchyflow

# Analyze tables
mysqlcheck -u root -p --analyze stitchyflow
```

---

## 10. Troubleshooting

### 10.1 Application Not Starting

```bash
# Check PM2 logs
pm2 logs

# Check Node.js version
node --version

# Check environment variables
pm2 env 0
```

### 10.2 Database Connection Issues

```bash
# Check MySQL status
sudo systemctl status mysql

# Test connection
mysql -u stitchyflow_user -p -h localhost stitchyflow
```

### 10.3 High Memory Usage

```bash
# Check PM2 processes
pm2 list

# Restart application
pm2 restart all

# Clear Redis cache
redis-cli FLUSHALL
```

---

**Document Version:** 1.0  
**Last Updated:** March 30, 2026  
**Author:** Muhammad Kalim  
**Company:** LogixInventor (PVT) Ltd.  
**Contact:** info@logixinventor.com | +92 333 3836851
