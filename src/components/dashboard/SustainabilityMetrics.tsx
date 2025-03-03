
import { Card } from "@/components/ui/card";
import { Leaf, Wind, TreeDeciduous } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { toArabicNumerals } from "@/translations";

const sustainabilityMetrics = [
  {
    title: "Carbon Footprint",
    value: "-18.5%",
    change: "-2.3%",
    trend: "down",
    icon: Leaf,
  },
  {
    title: "Waste Reduction",
    value: "24.8%",
    change: "+4.2%",
    trend: "up",
    icon: Wind,
  },
  {
    title: "Green Suppliers",
    value: "72.4%",
    change: "+5.7%",
    trend: "up",
    icon: TreeDeciduous,
  }
];

const SustainabilityMetrics = () => {
  const { language } = useLanguage();

  return (
    <div className="mb-8">
      <h4 className="font-display text-xl font-semibold mb-4">
        {getTranslation('sustainabilityMetrics.title', language)}
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sustainabilityMetrics.map((metric) => (
          <Card key={metric.title} className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {getTranslation(`sustainabilityMetrics.${metric.title.toLowerCase().replace(/\s+/g, '')}`, language)}
                </p>
                <div className="text-2xl font-semibold mt-1">
                  <span>{language === 'ar' ? toArabicNumerals(metric.value) : metric.value}</span>
                </div>
                <p className={`text-sm mt-1 ${
                  metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {language === 'ar' ? toArabicNumerals(metric.change) : metric.change}
                </p>
              </div>
              <metric.icon className="h-8 w-8 text-success-500" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SustainabilityMetrics;
