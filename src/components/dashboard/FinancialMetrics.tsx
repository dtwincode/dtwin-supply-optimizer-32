
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
    <Card className="bg-card shadow-[var(--shadow-card)] border-border rounded-xl p-6 h-fit">
      <h4 className="font-bold text-lg text-card-foreground mb-6 flex items-center">
        <div className="bg-success/10 p-2 rounded-lg mr-3">
          <Wallet className="h-5 w-5 text-success" />
        </div>
        {getTranslation('common.financialMetrics.title', language)}
      </h4>
      <div className="space-y-4">
        {financialMetrics.map((metric) => (
          <div key={metric.title} className="flex justify-between items-center py-3 border-b last:border-b-0 border-border">
            <div className="space-y-1">
              <p className="text-sm font-medium text-card-foreground">
                {getTranslation(`common.financialMetrics.${metric.title}`, language)}
              </p>
              <div className="flex items-center space-x-2">
                <div className="text-lg font-bold flex items-center text-card-foreground">
                  <Image 
                    src="/lovable-uploads/b7ca4974-ecc5-4f81-bfc0-6ae96ce56a48.png" 
                    alt="Currency" 
                    className="h-4 w-4 mr-1" 
                  />
                  <span>{language === 'ar' ? toArabicNumerals(metric.value) : metric.value}</span>
                </div>
                <div className={`flex items-center text-sm ${
                  metric.trend === 'up' ? 'text-success' : 'text-danger'
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
