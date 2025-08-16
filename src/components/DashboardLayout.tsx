
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

  // Handle initial auth check and loading state
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    } else {
      setTimeout(() => {
        setIsLoading(false);
        setIsContentVisible(true);
      }, 100);
    }
  }, [user, navigate]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded"></div>
          <div className="h-32 w-96 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div 
      className={cn(
        "min-h-screen bg-background flex debug-test",
        isContentVisible ? "opacity-100" : "opacity-0",
        "transition-all duration-300 ease-in-out"
      )} 
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{
        /* DEBUG: Inline styles as fallback */
        minHeight: '100vh',
        display: 'flex',
        backgroundColor: '#f8fafc',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      <div
        className={cn(
          "fixed top-0 bottom-0 z-40 h-full transition-transform duration-300 ease-out",
          isRTL ? 'right-0' : 'left-0',
          sidebarOpen ? "translate-x-0" : isRTL ? 'translate-x-full' : '-translate-x-full'
        )}
      >
        <div className="h-full w-48 bg-card shadow-lg border-r border-border">
          <div className="flex items-center justify-between p-2 border-b border-border">
            <div className="flex items-center w-full justify-center">
              <Link to="/">
                <img 
                  src="/lovable-uploads/ff1ca214-cc5f-4fa6-8bfd-4818cf19a551.png" 
                  alt="dtwin logo" 
                  className="h-14 w-auto"
                />
              </Link>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-lg hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <Navigation 
            language={language}
            isRTL={isRTL}
          />
        </div>
      </div>

      <div
        className={cn(
          "flex flex-col flex-1 transition-all duration-300 ease-in-out",
          sidebarOpen ? (isRTL ? 'mr-48' : 'ml-48') : 'ml-0'
        )}
      >
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          language={language}
          setLanguage={setLanguage}
          setCreateTicketOpen={setCreateTicketOpen}
          signOut={signOut}
        />

        <main 
          className={cn(
            "flex-1 transition-all duration-300 ease-in-out",
            isContentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <div className="p-6">
            {children}
            <FloatingAskAI />
          </div>
        </main>
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
