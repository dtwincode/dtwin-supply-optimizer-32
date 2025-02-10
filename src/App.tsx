
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Inventory from "./pages/Inventory";
import Forecasting from "./pages/Forecasting";
import Logistics from "./pages/Logistics";
import SalesPlanning from "./pages/SalesPlanning";
import Reports from "./pages/Reports";
import Marketing from "./pages/Marketing";
import AskAI from "./pages/AskAI";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/forecasting" element={<Forecasting />} />
          <Route path="/logistics" element={<Logistics />} />
          <Route path="/sales-planning" element={<SalesPlanning />} />
          <Route path="/marketing" element={<Marketing />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/ask-ai" element={<AskAI />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
