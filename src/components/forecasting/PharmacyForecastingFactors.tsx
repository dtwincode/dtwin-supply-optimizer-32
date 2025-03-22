
import React from 'react';
import { useIndustry } from "@/contexts/IndustryContext";
import { getModuleConfigurations } from "@/utils/industrySpecificUtils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

export const PharmacyForecastingFactors: React.FC = () => {
  const { selectedIndustry } = useIndustry();
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  
  const forecastingConfig = getModuleConfigurations(selectedIndustry, 'forecasting');
  
  if (selectedIndustry !== 'pharmacy') {
    return null;
  }
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {isArabic ? "عوامل التنبؤ الصيدلاني" : "Pharmacy Forecasting Factors"}
          </CardTitle>
          <Badge variant="outline" className="text-sm">
            {isArabic ? "مخصص للصيدليات" : "Pharmacy Specific"}
          </Badge>
        </div>
        <CardDescription>
          {isArabic 
            ? "العوامل الإضافية التي تؤثر على دقة التنبؤ في قطاع الصيدلة"
            : "Additional factors affecting forecast accuracy in the pharmacy sector"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">
              {isArabic ? "العوامل الإضافية" : "Additional Factors"}
            </h4>
            <div className="flex flex-wrap gap-2">
              {forecastingConfig.additionalFactors.map(factor => (
                <Badge key={factor} variant="secondary">
                  {factor}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">
              {isArabic ? "الأطر الزمنية" : "Time Frames"}
            </h4>
            <div className="flex flex-wrap gap-2">
              {forecastingConfig.timeFrames.map(timeFrame => (
                <Badge key={timeFrame} variant="outline">
                  {timeFrame}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">
              {isArabic ? "المؤشرات الرئيسية" : "Key Indicators"}
            </h4>
            <div className="flex flex-wrap gap-2">
              {forecastingConfig.indicators.map(indicator => (
                <Badge key={indicator} variant="default">
                  {indicator}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
