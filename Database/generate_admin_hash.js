/**
 * Generate Admin Password Hash
 * Developer by: Muhammad Kalim
 * Phone/WhatsApp: +92 333 3836851
 * Product of LogixInventor (PVT) Ltd.
 * Email: info@logixinventor.com
 * Website: www.logixinventor.com
 */

const bcrypt = require('bcrypt');

const password = 'Admin@123';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error generating hash:', err);
    return;
  }
  
  console.log('\n==============================================');
  console.log('StitchyFlow Admin Credentials');
  console.log('==============================================');
  console.log('Email: admin@stitchyflow.com');
  console.log('Password: Admin@123');
  console.log('Password Hash:', hash);
  console.log('==============================================\n');
  console.log('SQL Command to insert admin user:');
  console.log('\nUSE stitchyflow;');
  console.log('\nDELETE FROM users WHERE email = \'admin@stitchyflow.com\';');
  console.log('\nINSERT INTO users (email, password_hash, first_name, last_name, phone, role, status, email_verified)');
  console.log(`VALUES ('admin@stitchyflow.com', '${hash}', 'Admin', 'StitchyFlow', '+92 333 3836851', 'admin', 'active', TRUE);`);
  console.log('\n==============================================\n');
});
