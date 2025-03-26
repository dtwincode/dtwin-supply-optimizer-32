
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { Toaster } from "sonner"

// Make sure root element exists
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Root element #root not found in HTML');
  const errorDiv = document.createElement('div');
  errorDiv.innerHTML = '<h1>Application Error</h1><p>Root element not found</p>';
  document.body.appendChild(errorDiv);
} else {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
        <Toaster position="top-right" />
      </BrowserRouter>
    </React.StrictMode>,
  )
}
