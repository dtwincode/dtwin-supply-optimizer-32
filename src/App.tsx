
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from "@/components/theme-provider"
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Toaster } from "@/components/ui/toaster"

import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Settings from './pages/Settings';
import Auth from './pages/Auth';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { FilterProvider } from './contexts/FilterContext';
import { DataSourceProvider } from '@/contexts/DataSourceContext';

function App() {
  const queryClient = new QueryClient();

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <LanguageProvider>
            <AuthProvider>
              <FilterProvider>
                <DataSourceProvider>
                  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/inventory" element={<Inventory />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/auth" element={<Auth />} />
                    </Routes>
                    <Toaster />
                  </ThemeProvider>
                </DataSourceProvider>
              </FilterProvider>
            </AuthProvider>
          </LanguageProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
