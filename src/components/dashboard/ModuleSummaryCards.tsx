
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { toArabicNumerals } from "@/translations";
import {
  Boxes,
  LineChart,
  ShoppingBag,
  Megaphone,
  Truck,
  FileText
} from "lucide-react";

const modulesSummary = [
  {
    title: "inventorymanagement",
    icon: Boxes,
    stats: "1,234",
    statsKey: "skuCount",
    route: "/inventory",
    color: "text-blue-500",
    bgColor: "bg-blue-50"
  },
  {
    title: "demandforecasting",
    icon: LineChart,
    stats: "92",
    statsKey: "accuracyLabel",
    suffix: "%",
    route: "/forecasting",
    color: "text-green-500",
    bgColor: "bg-green-50"
  },
  {
    title: "salesplanning",
    icon: ShoppingBag,
    stats: "2.1M",
    statsKey: "pipelineValue",
    prefix: "₸",
    route: "/sales-planning",
    color: "text-purple-500",
    bgColor: "bg-purple-50"
  },
  {
    title: "marketingcampaigns",
    icon: Megaphone,
    stats: "12",
    statsKey: "activeCampaigns",
    route: "/marketing",
    color: "text-pink-500",
    bgColor: "bg-pink-50"
  },
  {
    title: "logistics",
    icon: Truck,
    stats: "95.8",
    statsKey: "onTimeDelivery",
    suffix: "%",
    route: "/logistics",
    color: "text-orange-500",
    bgColor: "bg-orange-50"
  },
  {
    title: "reportsAnalytics",
    icon: FileText,
    stats: "24",
    statsKey: "reportCount",
    route: "/reports",
    color: "text-indigo-500",
    bgColor: "bg-indigo-50"
  }
];

const ModuleSummaryCards = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const formatStats = (stats: string, prefix?: string, suffix?: string) => {
    const formattedStats = language === 'ar' ? toArabicNumerals(stats) : stats;
    return `${prefix || ''}${formattedStats}${suffix || ''}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      {modulesSummary.map((module) => (
        <Card 
          key={module.title} 
          className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate(module.route)}
        >
          <div className="flex items-start space-x-4">
            <div className={`p-3 rounded-lg ${module.bgColor}`}>
              <module.icon className={`h-6 w-6 ${module.color}`} />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-lg mb-1">
                {getTranslation(module.title, language)}
              </h4>
              <p className="text-2xl font-semibold mb-2">
                {formatStats(module.stats, module.prefix, module.suffix)}
              </p>
              <p className="text-sm text-gray-500">
                {getTranslation(module.statsKey, language)}
              </p>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="ghost" size="sm">
              {getTranslation('viewDetails', language)} {language === 'ar' ? '←' : '→'}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ModuleSummaryCards;
