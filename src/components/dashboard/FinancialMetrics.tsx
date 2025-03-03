
import { Card } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { toArabicNumerals } from "@/translations";

const financialMetrics = [
  {
    title: "Revenue",
    value: "₸ 12.4M",
    change: "+8.2%",
    trend: "up",
  },
  {
    title: "Operating Costs",
    value: "₸ 4.2M",
    change: "-3.1%",
    trend: "down",
  },
  {
    title: "Profit Margin",
    value: "24.5%",
    change: "+2.1%",
    trend: "up",
  }
];

const FinancialMetrics = () => {
  const { language } = useLanguage();

  return (
    <div className="mb-8">
      <h4 className="font-display text-xl font-semibold mb-4">
        {getTranslation('financialMetrics.title', language)}
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {financialMetrics.map((metric) => (
          <Card key={metric.title} className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {getTranslation(`financialMetrics.${metric.title.toLowerCase()}`, language)}
                </p>
                <p className="text-2xl font-semibold mt-1">
                  {language === 'ar' ? toArabicNumerals(metric.value) : metric.value}
                </p>
                <p className={`text-sm mt-1 ${
                  metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {language === 'ar' ? toArabicNumerals(metric.change) : metric.change}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FinancialMetrics;
