
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { toArabicNumerals } from "@/translations";
import Image from "../ui/image";
import {
  Boxes,
  LineChart,
  ShoppingBag,
  Megaphone,
  Truck,
  FileText,
  ChevronRight,
  ChevronLeft
} from "lucide-react";

const modulesSummary = [
  {
    title: "inventoryManagement",
    icon: Boxes,
    stats: "1,234",
    statsKey: "skuCount",
    route: "/inventory",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    title: "demandForecasting",
    icon: LineChart,
    stats: "92",
    statsKey: "accuracyLabel",
    suffix: "%",
    route: "/forecasting",
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
  {
    title: "salesPlanning",
    icon: ShoppingBag,
    stats: "2.1M",
    statsKey: "pipelineValue",
    showCurrency: true,
    route: "/sales-planning",
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
  {
    title: "marketingCampaigns",
    icon: Megaphone,
    stats: "12",
    statsKey: "activeCampaigns",
    route: "/marketing",
    color: "text-pink-500",
    bgColor: "bg-pink-50",
  },
  {
    title: "logistics",
    icon: Truck,
    stats: "95.8",
    statsKey: "onTimeDelivery",
    suffix: "%",
    route: "/logistics",
    color: "text-orange-500",
    bgColor: "bg-orange-50",
  },
  {
    title: "reportsAnalytics",
    icon: FileText,
    stats: "24",
    statsKey: "reportCount",
    route: "/reports",
    color: "text-indigo-500",
    bgColor: "bg-indigo-50",
  }
];

const ModuleSummaryCards = () => {
  const navigate = useNavigate();
  const { language, isRTL } = useLanguage();

  const formatStats = (stats: string, showCurrency?: boolean, suffix?: string) => {
    const formattedStats = language === 'ar' ? toArabicNumerals(stats) : stats;
    
    return (
      <div className="flex items-center">
        {showCurrency && (
          <Image 
            src="/lovable-uploads/b7ca4974-ecc5-4f81-bfc0-6ae96ce56a48.png" 
            alt="Currency" 
            className="h-4 w-4 mr-0.5" 
          />
        )}
        <span>{formattedStats}{suffix || ''}</span>
      </div>
    );
  };

  return (
    <Card className="bg-card shadow-[var(--shadow-card)] border-border p-6">
      <h3 className="font-display text-lg font-semibold mb-4 text-card-foreground">
        {getTranslation('common.ui.modules', language)}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {modulesSummary.map((module) => (
          <Card 
            key={module.title} 
            className="hover:shadow-[var(--shadow-primary)] transition-all duration-300 border-t-4 border-t-primary cursor-pointer bg-card"
            onClick={() => navigate(module.route)}
          >
            <div className="p-4">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="p-2 rounded-lg bg-primary/10 mb-1">
                  <module.icon className="h-5 w-5 text-primary" />
                </div>
                <h4 className="font-semibold text-sm mb-1 line-clamp-2 text-card-foreground">
                  {getTranslation(`modulesSummary.${module.title}`, language)}
                </h4>
                <div className="text-lg font-bold mb-1 text-card-foreground">
                  {formatStats(module.stats, module.showCurrency, module.suffix)}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {getTranslation(`common.ui.${module.statsKey}`, language)}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};

export default ModuleSummaryCards;
