
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { toArabicNumerals } from "@/translations";
import Image from "../ui/image";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

const financialMetrics = [
  {
    title: "revenue",
    value: "12.4M",
    change: "+8.2%",
    trend: "up",
    color: "text-green-500",
  },
  {
    title: "operatingCosts",
    value: "4.2M",
    change: "-3.1%",
    trend: "down",
    color: "text-red-500",
  },
  {
    title: "profitMargin",
    value: "24.5%",
    change: "+2.1%",
    trend: "up",
    color: "text-blue-500",
  }
];

const FinancialMetrics = () => {
  const { language } = useLanguage();

  return (
    <Card className="p-3">
      <h4 className="font-display text-md font-semibold mb-2 flex items-center">
        <Wallet className="h-4 w-4 mr-1 text-primary" />
        {getTranslation('financialMetrics.title', language)}
      </h4>
      <div className="grid grid-cols-1 gap-2">
        {financialMetrics.map((metric) => (
          <div key={metric.title} className="border-b last:border-b-0 pb-2 last:pb-0">
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500 font-medium">
                {getTranslation(`financialMetrics.${metric.title}`, language)}
              </p>
              <div className="text-sm font-semibold flex items-center">
                <Image 
                  src="/lovable-uploads/b7ca4974-ecc5-4f81-bfc0-6ae96ce56a48.png" 
                  alt="Currency" 
                  className="h-3 w-3 mr-0.5" 
                />
                <span>{language === 'ar' ? toArabicNumerals(metric.value) : metric.value}</span>
              </div>
            </div>
            <div className={`flex items-center text-xs ${
              metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
            }`}>
              {metric.trend === 'up' ? 
                <TrendingUp className="h-3 w-3 mr-0.5" /> : 
                <TrendingDown className="h-3 w-3 mr-0.5" />
              }
              <span>{language === 'ar' ? toArabicNumerals(metric.change) : metric.change}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default FinancialMetrics;
