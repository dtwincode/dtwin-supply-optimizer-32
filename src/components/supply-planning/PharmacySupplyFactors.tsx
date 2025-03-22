
import React from 'react';
import { useIndustry } from "@/contexts/IndustryContext";
import { getModuleConfigurations } from "@/utils/industrySpecificUtils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Pill, ClipboardCheck, Timer } from "lucide-react";

export const PharmacySupplyFactors: React.FC = () => {
  const { selectedIndustry } = useIndustry();
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  
  const supplyConfig = getModuleConfigurations(selectedIndustry, 'supplyPlanning');
  
  if (selectedIndustry !== 'pharmacy') {
    return null;
  }
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {isArabic ? "متطلبات التوريد الصيدلاني" : "Pharmacy Supply Requirements"}
          </CardTitle>
          <Badge variant="outline" className="text-sm">
            {isArabic ? "مخصص للصيدليات" : "Pharmacy Specific"}
          </Badge>
        </div>
        <CardDescription>
          {isArabic 
            ? "متطلبات وعوامل التوريد الخاصة بالمنتجات الصيدلانية"
            : "Supply requirements and factors specific to pharmaceutical products"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <ClipboardCheck className="h-5 w-5 text-primary" />
              <h4 className="font-medium">
                {isArabic ? "متطلبات الموردين" : "Supplier Requirements"}
              </h4>
            </div>
            <div className="space-y-2">
              {supplyConfig.supplierRequirements.map(req => (
                <div key={req} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span className="text-sm">{req}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Pill className="h-5 w-5 text-primary" />
              <h4 className="font-medium">
                {isArabic ? "أنواع الطلبات" : "Order Types"}
              </h4>
            </div>
            <div className="space-y-2">
              {supplyConfig.orderTypes.map(type => (
                <div key={type} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span className="text-sm">{type}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Timer className="h-5 w-5 text-primary" />
              <h4 className="font-medium">
                {isArabic ? "عوامل وقت التوريد" : "Lead Time Factors"}
              </h4>
            </div>
            <div className="space-y-2">
              {supplyConfig.leadTimeFactors.map(factor => (
                <div key={factor} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span className="text-sm">{factor}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
