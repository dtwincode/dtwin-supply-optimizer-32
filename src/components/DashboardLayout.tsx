
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { FloatingAskAI } from "./ai/FloatingAskAI";
import { CreateTicketDialog } from "./tickets/CreateTicketDialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Navigation from "./layout/Navigation";
import Header from "./layout/Header";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [createTicketOpen, setCreateTicketOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const { language, setLanguage, isRTL } = useLanguage();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Handle initial auth check and loading state with shorter delays
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    } else {
      setIsLoading(false);
      setIsContentVisible(true);
    }
  }, [user, navigate]);

  if (isLoading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <div className={`dashboard-layout ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className={`sidebar ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="flex items-center justify-between p-2 border-b">
          <Link to="/">
            <img 
              src="/lovable-uploads/ff1ca214-cc5f-4fa6-8bfd-4818cf19a551.png" 
              alt="dtwin logo" 
              className="h-14 w-auto"
            />
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="p-1">
            <X className="h-4 w-4" />
          </button>
        </div>
        <Navigation language={language} isRTL={isRTL} />
      </div>

      <div className="main-content">
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          language={language}
          setLanguage={setLanguage}
          setCreateTicketOpen={setCreateTicketOpen}
          signOut={signOut}
        />
        {children}
        <FloatingAskAI />
      </div>

      <CreateTicketDialog 
        isOpen={createTicketOpen}
        onOpenChange={setCreateTicketOpen}
        onSubmit={(ticket) => {
          console.log('New ticket:', ticket);
          setCreateTicketOpen(false);
        }}
      />
    </div>
  );
};

export default DashboardLayout;
