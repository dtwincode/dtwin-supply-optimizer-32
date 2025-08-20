import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Inventory from "./pages/Inventory";
import Settings from "./pages/Settings";
import Forecasting from "./pages/Forecasting";
import DDSOP from "./pages/DDSOP";
import DDMRP from "./pages/DDMRP";
import DDOM from "./pages/DDOM";
import SalesAndReturnsPage from "./pages/SalesAndReturns";
import { AuthProvider } from "./contexts/AuthContext";
import Auth from "./pages/Auth";
import SupplyPlanning from "./pages/SupplyPlanning";
import { LanguageProvider } from "./contexts/LanguageContext";
import { I18nProvider } from "./contexts/I18nContext";
import Index from "./pages";
import Marketing from "./pages/Marketing";
import Logistics from "./pages/Logistics";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Reports from "./pages/Reports";
import AskAIPage from "./pages/AskAI";
import SQLConfig from "./pages/SQLConfig";
import Guidelines from "./pages/Guidelines";
import ForecastingBasics from "./pages/guidelines/ForecastingBasics";
import Collaboration from "./pages/guidelines/Collaboration";
import Advanced from "./pages/guidelines/Advanced";
import AIAssistant from "./pages/guidelines/AIAssistant";
import GettingStarted from "./pages/guidelines/GettingStarted";
import { WhatIfAnalysisTab } from "./components/forecasting/tabs/WhatIfAnalysisTab";

const queryClient = new QueryClient();
// Layout wrapper
const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="app-container">
    <main>{children}</main>
  </div>
);
const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <LanguageProvider>
        <I18nProvider>
          <AuthProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/forecasting" element={<Forecasting />} />
                {/* <Route
                  path="/forecasting/distribution"
                  element={<Forecasting />}
                />
                <Route path="/forecasting/what-if" />
                <Route path="/forecasting/external" element={<Forecasting />} />
                <Route
                  path="/forecasting/lifecycle"
                  element={<Forecasting />}
                /> */}
                <Route path="/ddmrp" element={<DDMRP />} />
                <Route path="/ddom" element={<DDOM />} />
                <Route path="/ddsop" element={<DDSOP />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/supply-planning" element={<SupplyPlanning />} />
                <Route
                  path="/sales-and-returns"
                  element={<SalesAndReturnsPage />}
                />
                <Route path="/marketing" element={<Marketing />} />
                <Route path="/logistics" element={<Logistics />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/ask-ai" element={<AskAIPage />} />
                <Route path="/data" element={<SQLConfig />} />
                <Route path="/guidelines" element={<Guidelines />}></Route>
                <Route
                  path="/guidelines/forecasting-basics"
                  element={<ForecastingBasics />}
                ></Route>
                <Route
                  path="/guidelines/collaboration"
                  element={<Collaboration />}
                ></Route>
                <Route
                  path="/guidelines/advanced"
                  element={<Advanced />}
                ></Route>
                <Route
                  path="/guidelines/ai-assistant"
                  element={<AIAssistant />}
                ></Route>
                <Route
                  path="/guidelines/getting-started"
                  element={<GettingStarted />}
                ></Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </AuthProvider>
        </I18nProvider>
      </LanguageProvider>
    </BrowserRouter>
  </QueryClientProvider>
);
export default App;
