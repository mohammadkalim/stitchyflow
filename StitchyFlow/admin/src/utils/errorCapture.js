/**
 * AI Error Capture Utility
 * Automatically captures frontend errors and sends them to the AI Error Handling System
 * Developer by: Muhammad Kalim — LogixInventor (PVT) Ltd.
 */

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

/**
 * Send an error to the AI Error Handling backend
 */
export async function captureError({ message, stack, source = 'frontend', errorType, url, statusCode = 0 }) {
  try {
    await fetch(`${API_BASE}/ai-errors/capture`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source,
        error_type: errorType || 'RuntimeError',
        message: String(message).substring(0, 2000),
        stack_trace: stack ? String(stack).substring(0, 5000) : null,
        url: url || window.location.href,
        user_agent: navigator.userAgent,
        status_code: statusCode
      })
    });
  } catch (_) {
    // Never throw — error capture must never break the app
  }
}

/**
 * Install global window error listeners.
 * Call this once in index.js
 */
export function installGlobalErrorCapture() {
  // Uncaught JS errors
  window.addEventListener('error', (event) => {
    captureError({
      message: event.message || 'Uncaught error',
      stack: event.error?.stack,
      errorType: event.error?.name || 'Error',
      url: event.filename || window.location.href
    });
  });

  // Unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const message = reason?.message || String(reason) || 'Unhandled Promise Rejection';
    captureError({
      message,
      stack: reason?.stack,
      errorType: 'UnhandledRejection',
      statusCode: reason?.response?.status || 0
    });
  });

  // Axios response errors — patch via custom event
  // (Axios interceptor in api.js dispatches this)
  window.addEventListener('axios-error', (event) => {
    const { message, status, url, stack } = event.detail || {};
    captureError({
      message: message || 'Axios request failed',
      stack,
      errorType: 'AxiosError',
      statusCode: status || 0,
      url
    });
  });
}
