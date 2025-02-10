
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
    title: "Inventory Management",
    icon: Boxes,
    stats: "1,234 SKUs",
    description: "Track and manage inventory levels",
    route: "/inventory",
    color: "text-blue-500",
    bgColor: "bg-blue-50"
  },
  {
    title: "Demand Forecasting",
    icon: LineChart,
    stats: "92% accuracy",
    description: "Predict future demand patterns",
    route: "/forecasting",
    color: "text-green-500",
    bgColor: "bg-green-50"
  },
  {
    title: "Sales Planning",
    icon: ShoppingBag,
    stats: "₪2.1M pipeline",
    description: "Plan and track sales activities",
    route: "/sales-planning",
    color: "text-purple-500",
    bgColor: "bg-purple-50"
  },
  {
    title: "Marketing Campaigns",
    icon: Megaphone,
    stats: "12 active",
    description: "Manage marketing initiatives",
    route: "/marketing",
    color: "text-pink-500",
    bgColor: "bg-pink-50"
  },
  {
    title: "Logistics",
    icon: Truck,
    stats: "95.8% on-time",
    description: "Optimize delivery operations",
    route: "/logistics",
    color: "text-orange-500",
    bgColor: "bg-orange-50"
  },
  {
    title: "Reports & Analytics",
    icon: FileText,
    stats: "24 reports",
    description: "Access business insights",
    route: "/reports",
    color: "text-indigo-500",
    bgColor: "bg-indigo-50"
  }
];

const ModuleSummaryCards = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const getModuleDescription = (moduleKey: string): string => {
    return getTranslation(`common.${moduleKey}`, language);
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
                {getTranslation(`modulesSummary.${module.title.replace(/\s+/g, '').toLowerCase()}`, language)}
              </h4>
              <p className="text-2xl font-semibold mb-2">
                {language === 'ar' ? toArabicNumerals(module.stats) : module.stats}
              </p>
              <p className="text-sm text-gray-500">
                {getModuleDescription(module.title.replace(/\s+/g, '').toLowerCase())}
              </p>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="ghost" size="sm">
              {getTranslation('modulesSummary.viewDetails', language)} →
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ModuleSummaryCards;
