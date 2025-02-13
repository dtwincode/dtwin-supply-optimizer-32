
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/index";
import Auth from "./pages/Auth";
import Inventory from "./pages/Inventory";
import Forecasting, { ForecastingProvider } from "./pages/Forecasting";
import Logistics from "./pages/Logistics";
import SalesPlanning from "./pages/SalesPlanning";
import Reports from "./pages/Reports";
import Marketing from "./pages/Marketing";
import AskAI from "./pages/AskAI";
import Tickets from "./pages/Tickets";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { ForecastAnalysisTab } from "./components/forecasting/tabs/ForecastAnalysisTab";
import { ForecastDistributionTab } from "./components/forecasting/tabs/ForecastDistributionTab";
import { DecompositionTab } from "./components/forecasting/tabs/DecompositionTab";
import { WhatIfAnalysisTab } from "./components/forecasting/tabs/WhatIfAnalysisTab";
import { ValidationTab } from "./components/forecasting/tabs/ValidationTab";
import { ExternalFactorsTab } from "./components/forecasting/tabs/ExternalFactorsTab";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<Index />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/forecasting" element={<ForecastingProvider />}>
                <Route index element={<Forecasting />} />
                <Route path="forecast" element={<ForecastAnalysisTab />} />
                <Route path="distribution" element={<ForecastDistributionTab />} />
                <Route path="decomposition" element={<DecompositionTab />} />
                <Route path="scenarios" element={<WhatIfAnalysisTab />} />
                <Route path="validation" element={<ValidationTab />} />
                <Route path="external" element={<ExternalFactorsTab />} />
              </Route>
              <Route path="/logistics" element={<Logistics />} />
              <Route path="/sales-planning" element={<SalesPlanning />} />
              <Route path="/marketing" element={<Marketing />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/ask-ai" element={<AskAI />} />
              <Route path="/tickets" element={<Tickets />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
