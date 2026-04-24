import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { installGlobalErrorCapture } from './utils/errorCapture';
import './responsive.css';

// Install AI error capture — catches all uncaught JS errors & unhandled rejections
installGlobalErrorCapture();

if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // eslint-disable-next-line no-console
  console.info('[StitchyFlow:admin] app shell mounted', new Date().toISOString());
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
