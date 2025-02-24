
import { useState, useEffect, memo } from "react";
import { MenuIcon, X, Home, TrendingUp, Package, LineChart, Gift, Truck, FileText, Search, Database, TicketPlus, LogOut, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { FloatingAskAI } from "./ai/FloatingAskAI";
import { ThemeToggle } from "./ThemeToggle";
import { CreateTicketDialog } from "./tickets/CreateTicketDialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/button";
import { getTranslation } from "@/translations";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { useNavigate, useLocation, Link } from "react-router-dom";

const navigationItems = [
  { name: "navigationItems.dashboard", icon: Home, href: "/" },
  { name: "navigationItems.forecasting", icon: TrendingUp, href: "/forecasting" },
  { name: "navigationItems.inventory", icon: Package, href: "/inventory" },
  { name: "navigationItems.salesPlanning", icon: LineChart, href: "/sales-planning" },
  { name: "navigationItems.marketing", icon: Gift, href: "/marketing" },
  { name: "navigationItems.logistics", icon: Truck, href: "/logistics" },
  { name: "navigationItems.reports", icon: FileText, href: "/reports" },
  { name: "navigationItems.askAI", icon: Search, href: "/ask-ai" },
  { name: "navigationItems.settings", icon: Database, href: "/settings" },
  { name: "navigationItems.guidelines", icon: BookOpen, href: "/guidelines" }
];

const NavigationList = memo(({ items, location, language, isRTL }: any) => (
  <nav className="p-4 space-y-1">
    {items.map((item: any) => (
      <Link
        key={item.name}
        to={item.href}
        className={cn(
          "flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
          location.pathname === item.href || (item.href === "/" && location.pathname === "")
            ? "bg-dtwin-medium text-white"
            : "text-gray-600 hover:bg-gray-100"
        )}
      >
        <item.icon className={`h-5 w-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
        {getTranslation(item.name, language)}
      </Link>
    ))}
  </nav>
));

NavigationList.displayName = 'NavigationList';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [createTicketOpen, setCreateTicketOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { language, setLanguage, isRTL } = useLanguage();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    } else {
      setIsLoading(false);
    }
  }, [user, navigate]);

  // If loading or no user, show a minimal loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
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
    <div className="min-h-screen bg-background transition-colors duration-300" dir={isRTL ? 'rtl' : 'ltr'}>
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
          <NavigationList 
            items={navigationItems} 
            location={location}
            language={language}
            isRTL={isRTL}
          />
        </div>
      </div>

      <div
        className={cn(
          "transition-all duration-300",
          sidebarOpen ? (isRTL ? 'mr-64' : 'ml-64') : 'ml-0'
        )}
      >
        <div className="bg-white dark:bg-card border-b">
          <div className="flex items-center h-16 px-4">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors mr-4"
              >
                <MenuIcon className="h-5 w-5" />
              </button>
            )}
            <h2 className="font-display text-lg">
              {getCurrentModuleName()}
            </h2>
            <div className="ml-auto flex items-center gap-2">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                    className="px-2 py-1"
                  >
                    {language === 'en' ? 'العربية' : 'English'}
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-48">
                  <p className="text-sm">
                    {language === 'en' ? 'Switch to Arabic language' : 'تغيير اللغة إلى الإنجليزية'}
                  </p>
                </HoverCardContent>
              </HoverCard>

              <HoverCard>
                <HoverCardTrigger asChild>
                  <button
                    onClick={() => setCreateTicketOpen(true)}
                    className="p-2 rounded-full hover:bg-accent transition-colors"
                  >
                    <TicketPlus className="h-4 w-4" />
                  </button>
                </HoverCardTrigger>
                <HoverCardContent className="w-48">
                  <p className="text-sm">
                    {language === 'en' ? 'Create Support Ticket' : 'إنشاء تذكرة دعم'}
                  </p>
                </HoverCardContent>
              </HoverCard>

              <HoverCard>
                <HoverCardTrigger asChild>
                  <div>
                    <ThemeToggle />
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-48">
                  <p className="text-sm">
                    {language === 'en' ? 'Toggle Light/Dark Theme' : 'تبديل السمة الفاتحة/الداكنة'}
                  </p>
                </HoverCardContent>
              </HoverCard>

              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={signOut}
                    className="p-2"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-48">
                  <p className="text-sm">
                    {getTranslation('ui.signOut', language)}
                  </p>
                </HoverCardContent>
              </HoverCard>
            </div>
          </div>
        </div>

        <main className="transition-opacity duration-300">
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

const getCurrentModuleName = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const currentModule = navigationItems.find(item => 
    item.href === currentPath || (item.href === "/" && currentPath === "")
  );
  const { language } = useLanguage();
  return currentModule ? getTranslation(currentModule.name, language) : "";
};

export default DashboardLayout;
