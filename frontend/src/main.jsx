import React from 'react'
import ReactDOM from 'react-dom/client'
import * as Sentry from "@sentry/react"
import App from './App.jsx'
import './index.css'

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, 
  // Session Replay
  replaysSessionSampleRate: 0.1, 
  replaysOnErrorSampleRate: 1.0, 
});

console.log('MAIN_JSX: All imports successful. Attempting mount...');

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found in DOM');
  }
  
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('MAIN_JSX: Render successful.');
} catch (error) {
  console.error('MAIN_JSX: FATAL MOUNT ERROR:', error);
  Sentry.captureException(error);
  document.body.innerHTML = `<div style="padding: 20px; color: red;"><h1>Mount Error</h1><pre>${error.message}</pre></div>`;
}
