
import { Card } from "@/components/ui/card";
import { Leaf, TrendingUp, TrendingDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { toArabicNumerals } from "@/translations";

const sustainabilityMetrics = [
  {
    title: "carbonFootprint",
    value: "-18.5%",
    change: "-2.3%",
    trend: "down",
    color: "text-green-500",
  },
  {
    title: "wasteReduction",
    value: "24.8%",
    change: "+4.2%",
    trend: "up",
    color: "text-blue-500",
  },
  {
    title: "greenSuppliers",
    value: "72.4%",
    change: "+5.7%",
    trend: "up",
    color: "text-emerald-500",
  }
];

const SustainabilityMetrics = () => {
  const { language } = useLanguage();

  return (
    <Card className="p-6 h-fit">
      <h4 className="font-display text-lg font-semibold mb-4 flex items-center">
        <Leaf className="h-5 w-5 mr-2 text-green-600" />
        {getTranslation('common.sustainabilityMetrics.title', language)}
      </h4>
      <div className="space-y-3">
        {sustainabilityMetrics.map((metric) => (
          <div key={metric.title} className="flex justify-between items-center py-3 border-b last:border-b-0 border-gray-100 dark:border-gray-800">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {getTranslation(`common.sustainabilityMetrics.${metric.title}`, language)}
              </p>
              <div className="flex items-center space-x-2">
                <div className="text-lg font-bold">
                  <span>{language === 'ar' ? toArabicNumerals(metric.value) : metric.value}</span>
                </div>
                <div className={`flex items-center text-sm ${
                  (metric.title === 'carbonFootprint' && metric.trend === 'down') || 
                  (metric.title !== 'carbonFootprint' && metric.trend === 'up') 
                    ? 'text-green-600' : 'text-red-600'
                }`}>
                  {(metric.title === 'carbonFootprint' && metric.trend === 'down') || 
                   (metric.title !== 'carbonFootprint' && metric.trend === 'up') ? 
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

export default SustainabilityMetrics;
