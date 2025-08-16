
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
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        Loading...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div 
      style={{
        minHeight: '100vh',
        display: 'flex',
        backgroundColor: '#f8fafc',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif'
      }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          [isRTL ? 'right' : 'left']: 0,
          width: '12rem',
          backgroundColor: 'white',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          borderRight: '1px solid #e5e7eb',
          transform: sidebarOpen ? 'translateX(0)' : (isRTL ? 'translateX(100%)' : 'translateX(-100%)'),
          transition: 'transform 0.3s ease',
          zIndex: 40
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.5rem',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center' }}>
            <Link to="/">
              <img 
                src="/lovable-uploads/ff1ca214-cc5f-4fa6-8bfd-4818cf19a551.png" 
                alt="dtwin logo" 
                style={{ height: '3.5rem', width: 'auto' }}
              />
            </Link>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            style={{
              padding: '0.25rem',
              borderRadius: '0.5rem',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer'
            }}
          >
            <X style={{ height: '1rem', width: '1rem' }} />
          </button>
        </div>
        <Navigation 
          language={language}
          isRTL={isRTL}
        />
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          marginLeft: sidebarOpen ? '12rem' : 0,
          transition: 'margin 0.3s ease'
        }}
      >
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          language={language}
          setLanguage={setLanguage}
          setCreateTicketOpen={setCreateTicketOpen}
          signOut={signOut}
        />

        <main style={{ flex: 1, padding: '1.5rem' }}>
          {children}
          <FloatingAskAI />
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
