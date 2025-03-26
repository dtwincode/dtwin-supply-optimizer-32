
import { Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/index";
import Auth from "./pages/Auth";
import Marketing from "./pages/Marketing";
import Forecasting from "./pages/Forecasting";
import Inventory from "./pages/Inventory";
import SalesAndReturns from "./pages/SalesAndReturns";
import Reports from "./pages/Reports";
import Logistics from "./pages/Logistics";
import Settings from "./pages/Settings";
import AskAI from "./pages/AskAI";
import Guidelines from "./pages/Guidelines";
import { GettingStarted, ForecastingBasics, Collaboration, Advanced, AIAssistant } from "./pages/guidelines";
import NotFound from "./pages/NotFound";
import Tickets from "./pages/Tickets";
import SQLConfig from "./pages/SQLConfig";
import SupplyPlanning from "./pages/SupplyPlanning";
import DDSOP from "./pages/DDSOP";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FilterProvider } from "./contexts/FilterContext";
import { Suspense, useEffect } from "react";
import PageLoading from "./components/PageLoading";

// Configure query client with compatible options for v5
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Fix: Correctly implement the event subscription for React Query v5
queryClient.getQueryCache().subscribe(event => {
  if (event.type === 'updated' && event.query.state.status === 'error') {
    console.error('Query error:', event.query.state.error);
  }
});

// Add route debugging component
const RouteDebugger = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    console.log('Routes mounted with children:', children);
    
    // Additional debug logging for route detection
    console.log('Current routes available:', [
      "/", "/auth", "/ddsop", "/forecasting", "/inventory", 
      "/supply-planning", "/sales-and-returns", "/marketing", 
      "/logistics", "/reports", "/ask-ai", "/data", 
      "/guidelines", "/sql-config", "/tickets"
    ]);
  }, [children]);
  
  return <>{children}</>;
};

function App() {
  // Enhanced debug logs
  console.log("App component rendering", new Date().toISOString());
  
  useEffect(() => {
    console.log("App component mounted");
    
    // Log current path to help with debugging
    const path = window.location.pathname;
    console.log("Current path at App mount:", path);
    
    return () => {
      console.log("App component unmounted");
    };
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <FilterProvider>
            <TooltipProvider>
              <Suspense fallback={<PageLoading />}>
                <RouteDebugger>
                  <Routes>
                    {/* Explicit home route */}
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/ddsop" element={<DDSOP />} />
                    <Route path="/forecasting/*" element={<Forecasting />} />
                    <Route path="/inventory" element={<Inventory />} />
                    <Route path="/inventory/:tab" element={<Inventory />} />
                    <Route path="/inventory/classification" element={<Navigate to="/inventory?tab=classification" replace />} />
                    <Route path="/inventory/buffer-zones" element={<Navigate to="/inventory?tab=buffers" replace />} />
                    <Route path="/inventory/decoupling-point" element={<Navigate to="/inventory?tab=decoupling" replace />} />
                    <Route path="/supply-planning" element={<SupplyPlanning />} />
                    <Route path="/sales-and-returns" element={<SalesAndReturns />} />
                    <Route path="/sales-planning" element={<Navigate to="/sales-and-returns" replace />} />
                    <Route path="/returns-management" element={<Navigate to="/sales-and-returns?tab=returns" replace />} />
                    <Route path="/marketing" element={<Marketing />} />
                    <Route path="/logistics" element={<Logistics />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/ask-ai" element={<AskAI />} />
                    <Route path="/data" element={<Settings />} />
                    <Route path="/settings" element={<Navigate to="/data" replace />} />
                    <Route path="/guidelines" element={<Guidelines />} />
                    <Route path="/guidelines/getting-started" element={<GettingStarted />} />
                    <Route path="/guidelines/forecasting-basics" element={<ForecastingBasics />} />
                    <Route path="/guidelines/collaboration" element={<Collaboration />} />
                    <Route path="/guidelines/advanced" element={<Advanced />} />
                    <Route path="/guidelines/ai-assistant" element={<AIAssistant />} />
                    <Route path="/sql-config" element={<SQLConfig />} />
                    <Route path="/tickets" element={<Tickets />} />
                    {/* Improved catch-all route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </RouteDebugger>
              </Suspense>
            </TooltipProvider>
          </FilterProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
