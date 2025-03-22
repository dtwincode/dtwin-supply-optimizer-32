
import React from 'react';
import { useIndustry } from "@/contexts/IndustryContext";
import { getModuleConfigurations } from "@/utils/industrySpecificUtils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, RotateCcw, ClipboardCheck } from "lucide-react";

export const PharmacyDDSOP: React.FC = () => {
  const { selectedIndustry } = useIndustry();
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  
  const ddsopConfig = getModuleConfigurations(selectedIndustry, 'ddsop');
  
  if (selectedIndustry !== 'pharmacy') {
    return null;
  }
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {isArabic ? "متطلبات DDSOP الصيدلانية" : "Pharmaceutical DDSOP Requirements"}
          </CardTitle>
          <Badge variant="outline" className="text-sm">
            {isArabic ? "مخصص للصيدليات" : "Pharmacy Specific"}
          </Badge>
        </div>
        <CardDescription>
          {isArabic 
            ? "متطلبات تخطيط العمليات وتنفيذها في قطاع الصيدلة"
            : "Planning and execution requirements in the pharmacy sector"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-5 w-5 text-primary" />
              <h4 className="font-medium">
                {isArabic ? "آفاق التخطيط" : "Planning Horizons"}
              </h4>
            </div>
            <div className="space-y-2">
              {ddsopConfig.planningHorizons.map(horizon => (
                <div key={horizon} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span className="text-sm">{horizon}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <RotateCcw className="h-5 w-5 text-primary" />
              <h4 className="font-medium">
                {isArabic ? "دورات المراجعة" : "Review Cycles"}
              </h4>
            </div>
            <div className="space-y-2">
              {ddsopConfig.reviewCycles.map(cycle => (
                <div key={cycle} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span className="text-sm">{cycle}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <ClipboardCheck className="h-5 w-5 text-primary" />
              <h4 className="font-medium">
                {isArabic ? "فحوصات الامتثال" : "Compliance Checks"}
              </h4>
            </div>
            <div className="space-y-2">
              {ddsopConfig.complianceChecks.map(check => (
                <div key={check} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span className="text-sm">{check}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
