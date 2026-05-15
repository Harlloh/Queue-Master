import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Toaster } from 'react-hot-toast';
import * as Sentry from "@sentry/react";


Sentry.init({
  dsn: "https://e9a7854577b06321a29e8f546776b0f9@o4511149679116288.ingest.de.sentry.io/4511393309524048",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true
});
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <button
      onClick={() => {
        throw new Error('This is your first error!');
      }}
    >
      Break the world
    </button>
    <Toaster />
  </StrictMode>,
)
