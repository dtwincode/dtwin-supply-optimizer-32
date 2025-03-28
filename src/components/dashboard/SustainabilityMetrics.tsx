import { Card } from "@/components/ui/card";
import { Leaf, TrendingUp, TrendingDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation, toArabicNumerals } from "@/translations";

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
    <Card className="p-3">
      <h4 className="font-display text-md font-semibold mb-2 flex items-center">
        <Leaf className="h-4 w-4 mr-1 text-success-500" />
        {getTranslation('sustainabilityMetrics.title', language)}
      </h4>
      <div className="grid grid-cols-1 gap-2">
        {sustainabilityMetrics.map((metric) => (
          <div key={metric.title} className="border-b last:border-b-0 pb-2 last:pb-0">
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500 font-medium">
                {getTranslation(`sustainabilityMetrics.${metric.title}`, language)}
              </p>
              <div className="text-sm font-semibold">
                <span>{language === 'ar' ? toArabicNumerals(metric.value) : metric.value}</span>
              </div>
            </div>
            <div className={`flex items-center text-xs ${
              (metric.title === 'carbonFootprint' && metric.trend === 'down') || 
              (metric.title !== 'carbonFootprint' && metric.trend === 'up') 
                ? 'text-green-500' : 'text-red-500'
            }`}>
              {(metric.title === 'carbonFootprint' && metric.trend === 'down') || 
               (metric.title !== 'carbonFootprint' && metric.trend === 'up') ? 
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

export default SustainabilityMetrics;
