
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { toArabicNumerals } from "@/translations";
import Image from "../ui/image";

const financialMetrics = [
  {
    title: "revenue",
    value: "12.4M",
    change: "+8.2%",
    trend: "up",
  },
  {
    title: "operatingCosts",
    value: "4.2M",
    change: "-3.1%",
    trend: "down",
  },
  {
    title: "profitMargin",
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
                  {getTranslation(`financialMetrics.${metric.title}`, language)}
                </p>
                <div className="text-2xl font-semibold mt-1 flex items-center">
                  <Image 
                    src="/lovable-uploads/b7ca4974-ecc5-4f81-bfc0-6ae96ce56a48.png" 
                    alt="Currency" 
                    className="h-5 w-5 mr-1" 
                  />
                  <span>{language === 'ar' ? toArabicNumerals(metric.value) : metric.value}</span>
                </div>
                <p className={`text-sm mt-1 ${
                  metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {language === 'ar' ? toArabicNumerals(metric.change) : metric.change}
                </p>
              </div>
              <Image 
                src="/lovable-uploads/b7ca4974-ecc5-4f81-bfc0-6ae96ce56a48.png" 
                alt="Currency" 
                className="h-8 w-8" 
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FinancialMetrics;
