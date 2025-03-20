
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { toArabicNumerals } from "@/translations";
import Image from "../ui/image";
import { TrendingUp, TrendingDown, Wallet, CreditCard, Coins } from "lucide-react";

const financialMetrics = [
  {
    title: "revenue",
    value: "12.4M",
    change: "+8.2%",
    trend: "up",
    icon: Wallet,
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
  {
    title: "operatingCosts",
    value: "4.2M",
    change: "-3.1%",
    trend: "down",
    icon: CreditCard,
    color: "text-red-500",
    bgColor: "bg-red-50",
  },
  {
    title: "profitMargin",
    value: "24.5%",
    change: "+2.1%",
    trend: "up",
    icon: Coins,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  }
];

const FinancialMetrics = () => {
  const { language } = useLanguage();

  return (
    <div>
      <h4 className="font-display text-xl font-semibold mb-3 flex items-center">
        <Wallet className="h-5 w-5 mr-2 text-primary" />
        {getTranslation('financialMetrics.title', language)}
      </h4>
      <div className="grid grid-cols-1 gap-3">
        {financialMetrics.map((metric) => (
          <Card key={metric.title} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  {getTranslation(`financialMetrics.${metric.title}`, language)}
                </p>
                <div className="text-xl font-semibold mt-1 flex items-center">
                  <Image 
                    src="/lovable-uploads/b7ca4974-ecc5-4f81-bfc0-6ae96ce56a48.png" 
                    alt="Currency" 
                    className="h-5 w-5 mr-1" 
                  />
                  <span>{language === 'ar' ? toArabicNumerals(metric.value) : metric.value}</span>
                </div>
                <div className={`flex items-center text-sm mt-1 ${
                  metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {metric.trend === 'up' ? 
                    <TrendingUp className="h-4 w-4 mr-1" /> : 
                    <TrendingDown className="h-4 w-4 mr-1" />
                  }
                  <span>{language === 'ar' ? toArabicNumerals(metric.change) : metric.change}</span>
                  <span className="ml-1 text-xs text-gray-500">{getTranslation('common.thisQuarter', language)}</span>
                </div>
              </div>
              <div className={`${metric.bgColor} p-2 rounded-full`}>
                <metric.icon className={`h-5 w-5 ${metric.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FinancialMetrics;
