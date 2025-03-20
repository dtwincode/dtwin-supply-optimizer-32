
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
    <Card className="p-3">
      <h3 className="font-display text-md font-semibold mb-2 px-1">
        {getTranslation('common.modules', language)}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-2">
        {modulesSummary.map((module) => (
          <Card 
            key={module.title} 
            className="hover:shadow-md transition-all duration-300 border-t-2 cursor-pointer"
            style={{ borderTopColor: module.color.replace('text-', '').includes('blue') ? '#3b82f6' : 
                                   module.color.replace('text-', '').includes('green') ? '#10b981' :
                                   module.color.replace('text-', '').includes('purple') ? '#8b5cf6' :
                                   module.color.replace('text-', '').includes('pink') ? '#ec4899' :
                                   module.color.replace('text-', '').includes('orange') ? '#f97316' : '#6366f1' }}
            onClick={() => navigate(module.route)}
          >
            <div className="p-2">
              <div className="flex flex-col items-center text-center">
                <div className={`p-1.5 rounded-lg ${module.bgColor} mb-1`}>
                  <module.icon className={`h-4 w-4 ${module.color}`} />
                </div>
                <h4 className="font-semibold text-sm mb-0.5 line-clamp-1">
                  {getTranslation(`modulesSummary.${module.title}`, language)}
                </h4>
                <div className="text-md font-semibold mb-0.5">
                  {formatStats(module.stats, module.showCurrency, module.suffix)}
                </div>
                <p className="text-xs text-gray-500 line-clamp-1">
                  {getTranslation(`common.${module.statsKey}`, language)}
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
