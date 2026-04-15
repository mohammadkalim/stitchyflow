/**
 * Dev server: forward API + static uploads to StitchyFlow backend so <img src="/images/..."> works on :3000.
 * When this file exists, CRA uses it for proxying (keep /api here too).
 * Target overridable: REACT_APP_PROXY_TARGET=http://127.0.0.1:5000
 */
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function setupProxy(app) {
  const target = process.env.REACT_APP_PROXY_TARGET || 'http://127.0.0.1:5000';
  const opts = { target, changeOrigin: true };
  app.use('/api', createProxyMiddleware(opts));
  app.use('/images', createProxyMiddleware(opts));
  app.use('/uploads', createProxyMiddleware(opts));
};
