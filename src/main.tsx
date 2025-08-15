
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { Toaster } from "sonner"
import { ErrorBoundary } from "@/components/ErrorBoundary"

// Add global error handler with more information
if (typeof window !== 'undefined') {
  window.onerror = function(message, source, lineno, colno, error) {
    console.error('Global error caught:', { 
      message, 
      source, 
      lineno, 
      colno, 
      error,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    });
    return false;
  };
  
  // Add enhanced debugging for router issues
  console.log("Browser details on load:", {
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
    href: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString()
  });
}

// Make sure root element exists with improved error handling
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Root element #root not found in HTML');
  const errorDiv = document.createElement('div');
  errorDiv.innerHTML = '<h1>Application Error</h1><p>Root element not found</p>';
  document.body.appendChild(errorDiv);
} else {
  console.log('Found root element, initializing app...');
  
  try {
    // Log that we're about to create the root
    console.log('Creating React root...');
    const root = ReactDOM.createRoot(rootElement);
    
    // Log that we're about to render
    console.log('Rendering application...');
    root.render(
      <React.StrictMode>
        <ErrorBoundary
          onError={(error, info) => {
            console.error("Root error boundary caught:", { error, info, time: new Date().toISOString() });
          }}
        >
          <BrowserRouter>
            <App />
            <Toaster richColors closeButton position="top-right" />
          </BrowserRouter>
        </ErrorBoundary>
      </React.StrictMode>,
    );
    console.log('App successfully rendered');
  } catch (error) {
    console.error('Failed to render application:', error);
    const errorDiv = document.createElement('div');
    errorDiv.innerHTML = `<h1>Application Error</h1><p>${error.message}</p>`;
    document.body.appendChild(errorDiv);
  }
}
