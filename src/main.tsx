
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Toaster } from "sonner"

// Debug CSS loading
console.log('🔍 CSS Debug: main.tsx loading, checking if CSS imports work');
console.log('🔍 CSS Debug: index.css import should be processed by Vite');

// Test if basic CSS is working by adding inline styles as fallback
const rootElement = document.getElementById('root')!;
rootElement.style.fontFamily = 'system-ui, -apple-system, sans-serif';

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
    <Toaster />
  </React.StrictMode>,
)
