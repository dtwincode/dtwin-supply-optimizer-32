
import { Card } from "@/components/ui/card";
import { Leaf, Wind, TreeDeciduous, TrendingUp, TrendingDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { toArabicNumerals } from "@/translations";

const sustainabilityMetrics = [
  {
    title: "carbonFootprint",
    value: "-18.5%",
    change: "-2.3%",
    trend: "down",
    icon: Leaf,
    color: "text-green-500",
    bgColor: "bg-green-50",
    description: "yearlyReduction"
  },
  {
    title: "wasteReduction",
    value: "24.8%",
    change: "+4.2%",
    trend: "up",
    icon: Wind,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    description: "wasteEfficiency"
  },
  {
    title: "greenSuppliers",
    value: "72.4%",
    change: "+5.7%",
    trend: "up",
    icon: TreeDeciduous,
    color: "text-emerald-500",
    bgColor: "bg-emerald-50",
    description: "sustainableSourcing"
  }
];

const SustainabilityMetrics = () => {
  const { language } = useLanguage();

  return (
    <div className="mb-8">
      <h4 className="font-display text-xl font-semibold mb-4 flex items-center">
        <Leaf className="h-5 w-5 mr-2 text-success-500" />
        {getTranslation('sustainabilityMetrics.title', language)}
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sustainabilityMetrics.map((metric) => (
          <Card key={metric.title} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  {getTranslation(`sustainabilityMetrics.${metric.title}`, language)}
                </p>
                <div className="text-2xl font-semibold mt-1">
                  <span>{language === 'ar' ? toArabicNumerals(metric.value) : metric.value}</span>
                </div>
                <div className={`flex items-center text-sm mt-1 ${
                  (metric.title === 'carbonFootprint' && metric.trend === 'down') || 
                  (metric.title !== 'carbonFootprint' && metric.trend === 'up') 
                    ? 'text-green-500' : 'text-red-500'
                }`}>
                  {(metric.title === 'carbonFootprint' && metric.trend === 'down') || 
                   (metric.title !== 'carbonFootprint' && metric.trend === 'up') ? 
                    <TrendingUp className="h-4 w-4 mr-1" /> : 
                    <TrendingDown className="h-4 w-4 mr-1" />
                  }
                  <span>{language === 'ar' ? toArabicNumerals(metric.change) : metric.change}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {getTranslation(`sustainabilityMetrics.${metric.description}`, language)}
                </p>
              </div>
              <div className={`${metric.bgColor} p-3 rounded-full`}>
                <metric.icon className={`h-6 w-6 ${metric.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SustainabilityMetrics;
