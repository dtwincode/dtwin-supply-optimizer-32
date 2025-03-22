
import { MenuIcon, TicketPlus, LogOut, Factory } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getTranslation } from "@/translations";
import { useLocation } from "react-router-dom";
import { navigationItems } from "./Navigation";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useIndustry } from "@/contexts/IndustryContext";
import { IndustryType } from "@/contexts/IndustryContext";
import { industries } from "@/components/guidelines/data/industryData";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  language: 'en' | 'ar';  // Updated type to be specific
  setLanguage: (lang: 'en' | 'ar') => void;
  setCreateTicketOpen: (open: boolean) => void;
  signOut: () => void;
}

const Header = ({
  sidebarOpen,
  setSidebarOpen,
  language,
  setLanguage,
  setCreateTicketOpen,
  signOut
}: HeaderProps) => {
  const location = useLocation();
  const { selectedIndustry, setSelectedIndustry } = useIndustry();
  
  const getCurrentModuleName = () => {
    const currentPath = location.pathname;
    const currentModule = navigationItems.find(item => 
      item.href === currentPath || (item.href === "/" && currentPath === "")
    );
    return currentModule ? getTranslation(currentModule.name, language) : "";
  };

  const getCurrentIndustryName = () => {
    const industry = industries.find(i => i.id === selectedIndustry);
    return industry ? (language === 'ar' ? industry.nameAr : industry.name) : "";
  };

  return (
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
          <DropdownMenu>
            <HoverCard>
              <HoverCardTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Factory className="h-3 w-3 mr-1" />
                    {getCurrentIndustryName()}
                  </Button>
                </DropdownMenuTrigger>
              </HoverCardTrigger>
              <HoverCardContent className="w-48">
                <p className="text-sm">
                  {language === 'ar' ? 'تغيير نوع القطاع' : 'Change Industry Type'}
                </p>
              </HoverCardContent>
            </HoverCard>
            <DropdownMenuContent align="end">
              {industries.map((industry) => (
                <DropdownMenuItem 
                  key={industry.id}
                  onClick={() => setSelectedIndustry(industry.id as IndustryType)}
                >
                  {language === 'ar' ? industry.nameAr : industry.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

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
  );
};

export default Header;
