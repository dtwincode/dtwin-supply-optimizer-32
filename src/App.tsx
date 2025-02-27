
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/index";
import Auth from "./pages/Auth";
import Marketing from "./pages/Marketing";
import Forecasting from "./pages/Forecasting";
import Inventory from "./pages/Inventory";
import SalesPlanning from "./pages/SalesPlanning";
import Reports from "./pages/Reports";
import Logistics from "./pages/Logistics";
import Settings from "./pages/Settings";
import AskAI from "./pages/AskAI";
import Guidelines from "./pages/Guidelines";
import { GettingStarted, ForecastingBasics, Collaboration, Advanced, AIAssistant } from "./pages/guidelines";
import NotFound from "./pages/NotFound";
import Tickets from "./pages/Tickets";
import SQLConfig from "./pages/SQLConfig";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from './components/ui/toaster';
import { FilterProvider } from "./contexts/FilterContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LanguageProvider>
            <FilterProvider>
              <TooltipProvider>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/marketing" element={<Marketing />} />
                  <Route path="/forecasting/*" element={<Forecasting />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/sales-planning" element={<SalesPlanning />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/logistics" element={<Logistics />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/guidelines" element={<Guidelines />} />
                  <Route path="/guidelines/getting-started" element={<GettingStarted />} />
                  <Route path="/guidelines/forecasting-basics" element={<ForecastingBasics />} />
                  <Route path="/guidelines/collaboration" element={<Collaboration />} />
                  <Route path="/guidelines/advanced" element={<Advanced />} />
                  <Route path="/guidelines/ai-assistant" element={<AIAssistant />} />
                  <Route path="/sql-config" element={<SQLConfig />} />
                  <Route path="/ask-ai" element={<AskAI />} />
                  <Route path="/tickets" element={<Tickets />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
              </TooltipProvider>
            </FilterProvider>
          </LanguageProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;

