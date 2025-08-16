
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
    <Card className="bg-card shadow-[var(--shadow-card)] border-border rounded-xl p-6 h-fit">
      <h4 className="font-bold text-lg text-card-foreground mb-6 flex items-center">
        <div className="bg-success/10 p-2 rounded-lg mr-3">
          <Leaf className="h-5 w-5 text-success" />
        </div>
        {getTranslation('common.sustainabilityMetrics.title', language)}
      </h4>
      <div className="space-y-4">
        {sustainabilityMetrics.map((metric) => (
          <div key={metric.title} className="flex justify-between items-center py-3 border-b last:border-b-0 border-border">
            <div className="space-y-1">
              <p className="text-sm font-medium text-card-foreground">
                {getTranslation(`common.sustainabilityMetrics.${metric.title}`, language)}
              </p>
              <div className="flex items-center space-x-2">
                <div className="text-lg font-bold text-card-foreground">
                  <span>{language === 'ar' ? toArabicNumerals(metric.value) : metric.value}</span>
                </div>
                <div className={`flex items-center text-sm ${
                  (metric.title === 'carbonFootprint' && metric.trend === 'down') || 
                  (metric.title !== 'carbonFootprint' && metric.trend === 'up') 
                    ? 'text-success' : 'text-danger'
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
