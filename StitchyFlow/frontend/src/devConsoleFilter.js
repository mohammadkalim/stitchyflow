/**
 * Dev-only: hide React’s “Download React DevTools” info log (CRA / react-dom).
 * Does not affect production builds. Extension-injected errors cannot be filtered here.
 */
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  const origInfo = console.info;
  console.info = (...args) => {
    const msg = args[0];
    if (
      typeof msg === 'string' &&
      (msg.includes('Download the React DevTools') || msg.includes('reactjs.org/link/react-devtools'))
    ) {
      return;
    }
    origInfo.apply(console, args);
  };
}
