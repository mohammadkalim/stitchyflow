export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const phonePattern = /^\d{10,15}$/;
export const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

export function validateEmail(email) {
  return typeof email === 'string' && emailPattern.test(email.trim());
}

export function validatePhone(phone) {
  if (typeof phone !== 'string') return false;
  const digits = phone.replace(/[^\d]/g, '');
  return phonePattern.test(digits);
}

export function validatePassword(password) {
  return typeof password === 'string' && passwordPattern.test(password);
}

export function normalizePhone(phone) {
  if (typeof phone !== 'string') return '';
  return phone.replace(/[^\d]/g, '');
}

export const passwordRequirements = 'At least 8 characters, one number, and one special character.';
