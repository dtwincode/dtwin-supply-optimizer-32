
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
    <Card className="bg-white dark:bg-card shadow-lg border border-border rounded-xl p-6 h-fit">
      <h4 className="font-bold text-lg text-foreground mb-6 flex items-center">
        <div className="bg-green-500/10 p-2 rounded-lg mr-3">
          <Wallet className="h-5 w-5 text-green-600" />
        </div>
        {getTranslation('common.financialMetrics.title', language)}
      </h4>
      <div className="space-y-4">
        {financialMetrics.map((metric) => (
          <div key={metric.title} className="flex justify-between items-center py-3 border-b last:border-b-0 border-gray-100 dark:border-gray-800">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {getTranslation(`common.financialMetrics.${metric.title}`, language)}
              </p>
              <div className="flex items-center space-x-2">
                <div className="text-lg font-bold flex items-center">
                  <Image 
                    src="/lovable-uploads/b7ca4974-ecc5-4f81-bfc0-6ae96ce56a48.png" 
                    alt="Currency" 
                    className="h-4 w-4 mr-1" 
                  />
                  <span>{language === 'ar' ? toArabicNumerals(metric.value) : metric.value}</span>
                </div>
                <div className={`flex items-center text-sm ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.trend === 'up' ? 
                    <TrendingUp className="h-4 w-4 mr-1" /> : 
                    <TrendingDown className="h-4 w-4 mr-1" />
                  }
                  <span>{language === 'ar' ? toArabicNumerals(metric.change) : metric.change}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default FinancialMetrics;
