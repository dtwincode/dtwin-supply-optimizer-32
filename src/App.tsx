
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
import Forecasting from './pages/Forecasting';
import SalesPlanning from './pages/SalesPlanning';
import Marketing from './pages/Marketing';
import Logistics from './pages/Logistics';
import Reports from './pages/Reports';
import AskAI from './pages/AskAI';
import Guidelines from './pages/Guidelines';

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
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/forecasting/*" element={<Forecasting />} />
                      <Route path="/inventory" element={<Inventory />} />
                      <Route path="/sales-planning" element={<SalesPlanning />} />
                      <Route path="/marketing" element={<Marketing />} />
                      <Route path="/logistics" element={<Logistics />} />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/ask-ai" element={<AskAI />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/data" element={<Settings />} /> {/* Redirecting /data to Settings temporarily */}
                      <Route path="/guidelines/*" element={<Guidelines />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="*" element={<Dashboard />} /> {/* Catch-all route to prevent blank pages */}
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
