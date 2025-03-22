
import React from 'react';
import { useIndustry } from "@/contexts/IndustryContext";
import { getIndustryKPIDescriptions } from "@/utils/industrySpecificUtils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

export const IndustrySpecificKPIs: React.FC = () => {
  const { selectedIndustry } = useIndustry();
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  
  const kpis = getIndustryKPIDescriptions(selectedIndustry);
  const industryName = selectedIndustry.charAt(0).toUpperCase() + selectedIndustry.slice(1);
  
  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {isArabic ? `مؤشرات الأداء الخاصة بقطاع ${industryName}` : `${industryName}-Specific KPIs`}
          </CardTitle>
          <Badge variant="outline" className="text-sm">
            {isArabic ? "مخصص للصناعة" : "Industry Specific"}
          </Badge>
        </div>
        <CardDescription>
          {isArabic 
            ? "مؤشرات الأداء الرئيسية المخصصة لقطاعك"
            : "Key performance indicators customized for your industry"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(kpis).map(([key, description]) => (
            <div key={key} className="p-4 border rounded-lg">
              <h4 className="font-medium text-sm uppercase text-muted-foreground">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </h4>
              <p className="mt-2 text-sm">{description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
