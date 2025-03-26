
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

  // Handle initial auth check and loading state with longer delays
  useEffect(() => {
    document.body.style.opacity = '0';
    const initialDelay = setTimeout(() => {
      document.body.style.opacity = '1';
      document.body.style.transition = 'opacity 0.5s ease-in-out';
      
      if (!user) {
        navigate('/auth');
      } else {
        setTimeout(() => {
          setIsLoading(false);
        }, 500); // Increased delay for smoother transition
      }
    }, 100);

    return () => {
      clearTimeout(initialDelay);
      document.body.style.opacity = '';
      document.body.style.transition = '';
    };
  }, [user, navigate]);

  // Handle content visibility after loading completes
  useEffect(() => {
    if (!isLoading) {
      const visibilityDelay = setTimeout(() => {
        setIsContentVisible(true);
      }, 300); // Increased delay for content visibility

      return () => clearTimeout(visibilityDelay);
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center transition-all duration-500">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded"></div>
          <div className="h-32 w-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div 
      className={cn(
        "min-h-screen bg-background",
        isContentVisible ? "opacity-100" : "opacity-0",
        "transition-all duration-500 ease-in-out"
      )} 
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div
        className={cn(
          "fixed top-0 h-screen transition-all duration-500 ease-out z-40",
          isRTL ? 'right-0' : 'left-0',
          sidebarOpen ? "translate-x-0" : isRTL ? 'translate-x-full' : '-translate-x-full'
        )}
      >
        <div className="h-full w-48 bg-white shadow-lg">
          <div className="flex items-center justify-between p-2 border-b">
            <div className="flex items-center w-full justify-center">
              <Link to="/">
                <img 
                  src="/lovable-uploads/ff1ca214-cc5f-4fa6-8bfd-4818cf19a551.png" 
                  alt="dtwin logo" 
                  className="h-16 w-auto"
                />
              </Link>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
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
          "transition-all duration-500 ease-in-out",
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
            "transition-all duration-500 ease-in-out",
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
