
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
    description: "inventoryDescription"
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
    description: "forecastingDescription"
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
    description: "salesDescription"
  },
  {
    title: "marketingCampaigns",
    icon: Megaphone,
    stats: "12",
    statsKey: "activeCampaigns",
    route: "/marketing",
    color: "text-pink-500",
    bgColor: "bg-pink-50",
    description: "marketingDescription"
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
    description: "logisticsDescription"
  },
  {
    title: "reportsAnalytics",
    icon: FileText,
    stats: "24",
    statsKey: "reportCount",
    route: "/reports",
    color: "text-indigo-500",
    bgColor: "bg-indigo-50",
    description: "reportsDescription"
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
            className="h-5 w-5 mr-1" 
          />
        )}
        <span>{formattedStats}{suffix || ''}</span>
      </div>
    );
  };

  return (
    <div>
      <h3 className="font-display text-xl font-semibold mb-4">
        {getTranslation('common.modules.sales', language)}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {modulesSummary.map((module) => (
          <Card 
            key={module.title} 
            className="hover:shadow-lg transition-all duration-300 border-t-4"
            style={{ borderTopColor: module.color.replace('text-', '').includes('blue') ? '#3b82f6' : 
                                     module.color.replace('text-', '').includes('green') ? '#10b981' :
                                     module.color.replace('text-', '').includes('purple') ? '#8b5cf6' :
                                     module.color.replace('text-', '').includes('pink') ? '#ec4899' :
                                     module.color.replace('text-', '').includes('orange') ? '#f97316' : '#6366f1' }}
          >
            <div 
              className="p-6 cursor-pointer"
              onClick={() => navigate(module.route)}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${module.bgColor}`}>
                  <module.icon className={`h-6 w-6 ${module.color}`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg mb-1">
                    {getTranslation(`modulesSummary.${module.title}`, language)}
                  </h4>
                  <div className="text-2xl font-semibold mb-2">
                    {formatStats(module.stats, module.showCurrency, module.suffix)}
                  </div>
                  <p className="text-sm text-gray-500 mb-3">
                    {getTranslation(`common.${module.statsKey}`, language)}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {getTranslation(`common.${module.description}`, language)}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-primary hover:text-primary-foreground hover:bg-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(module.route);
                  }}
                >
                  {getTranslation('common.viewDetails', language)} 
                  {isRTL ? <ChevronLeft className="ml-1 h-4 w-4" /> : <ChevronRight className="ml-1 h-4 w-4" />}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ModuleSummaryCards;
