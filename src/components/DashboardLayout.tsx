
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
      // Add a slight delay before removing loading state to ensure smooth transition
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }
  }, [user, navigate]);

  // Handle content visibility after loading completes
  useEffect(() => {
    if (!isLoading) {
      // Delay showing content to ensure smooth transition
      setTimeout(() => {
        setIsContentVisible(true);
      }, 100);
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center transition-opacity duration-300">
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
        "transition-all duration-300 ease-in-out"
      )} 
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div
        className={cn(
          "fixed top-0 h-screen transition-transform duration-300 ease-out z-40",
          isRTL ? 'right-0' : 'left-0',
          sidebarOpen ? "translate-x-0" : isRTL ? 'translate-x-full' : '-translate-x-full'
        )}
      >
        <div className="h-full w-64 bg-white shadow-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center w-full justify-center">
              <Link to="/">
                <img 
                  src="/lovable-uploads/ff1ca214-cc5f-4fa6-8bfd-4818cf19a551.png" 
                  alt="dtwin logo" 
                  className="h-24 w-auto"
                />
              </Link>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
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
          "transition-all duration-300 ease-in-out",
          sidebarOpen ? (isRTL ? 'mr-64' : 'ml-64') : 'ml-0'
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
            "transition-opacity duration-300 ease-in-out",
            isContentVisible ? "opacity-100" : "opacity-0"
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
