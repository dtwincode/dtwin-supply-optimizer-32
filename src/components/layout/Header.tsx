import { MenuIcon, TicketPlus, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateTicketDialog } from "../tickets/CreateTicketDialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useI18n } from "@/contexts/I18nContext";
import { useLocation } from "react-router-dom";
import { navigationItems } from "./Navigation";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  createTicketOpen: boolean;
  language: "en" | "ar";
  setLanguage: (lang: "en" | "ar") => void;
  setCreateTicketOpen: (open: boolean) => void;
  signOut: () => void;
}

const Header = ({
  sidebarOpen,
  setSidebarOpen,
  createTicketOpen,
  language,
  setLanguage,
  setCreateTicketOpen,
  signOut,
}: HeaderProps) => {
  const location = useLocation();
  const { t } = useI18n();

  const getCurrentModuleName = () => {
    const currentPath = location.pathname;
    const currentModule = navigationItems.find(
      (item) =>
        item.href === currentPath || (item.href === "/" && currentPath === "")
    );
    return currentModule ? t(currentModule.name) : "";
  };

  return (
    <div className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b dark:border-gray-800 shadow-sm">
      <div className="flex items-center h-16 px-4">
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mr-4"
          >
            <MenuIcon className="h-5 w-5" />
          </button>
        )}
        <h2 className="font-display text-lg">{getCurrentModuleName()}</h2>
        <div className="ml-auto flex items-center gap-2">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage(language === "en" ? "ar" : "en")}
                className="px-2 py-1"
              >
                {language === "en" ? "العربية" : "English"}
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-48">
              <p className="text-sm">
                {language === "en"
                  ? "Switch to Arabic language"
                  : "تغيير اللغة إلى الإنجليزية"}
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
              <p
                className="text-sm"
                // onClick={() => setCreateTicketOpen(!createTicketOpen)}
              >
                {language === "en"
                  ? "Create Support Ticket"
                  : "إنشاء تذكرة دعم"}
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
                {language === "en"
                  ? "Toggle Light/Dark Theme"
                  : "تبديل السمة الفاتحة/الداكنة"}
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
              <p className="text-sm">{t("common.logout")}</p>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
    </div>
  );
};

export default Header;
