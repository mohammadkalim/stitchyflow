import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { installGlobalErrorCapture } from './utils/errorCapture';

// Install AI error capture — catches all uncaught JS errors & unhandled rejections
installGlobalErrorCapture();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
