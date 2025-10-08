import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Inventory from "./pages/Inventory";
import Settings from "./pages/Settings";
import DDSOP from "./pages/DDSOP";
import DDMRP from "./pages/DDMRP";
import DDOM from "./pages/DDOM";
import { AuthProvider } from "./contexts/AuthContext";
import Auth from "./pages/Auth";
import { LanguageProvider } from "./contexts/LanguageContext";
import { I18nProvider } from "./contexts/I18nContext";
import Index from "./pages";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Reports from "./pages/Reports";
import AskAIPage from "./pages/AskAI";
import SQLConfig from "./pages/SQLConfig";

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
                <Route path="/supply-planning" element={<DDOM />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/ddmrp" element={<DDMRP />} />
                <Route path="/ddsop" element={<DDSOP />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/ask-ai" element={<AskAIPage />} />
                <Route path="/data" element={<SQLConfig />} />
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
