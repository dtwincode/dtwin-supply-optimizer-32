
import React from 'react';
import { useIndustry } from "@/contexts/IndustryContext";
import { getModuleConfigurations } from "@/utils/industrySpecificUtils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Truck, Warehouse, Package } from "lucide-react";

export const PharmacyLogisticsRequirements: React.FC = () => {
  const { selectedIndustry } = useIndustry();
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  
  const logisticsConfig = getModuleConfigurations(selectedIndustry, 'logistics');
  
  if (selectedIndustry !== 'pharmacy') {
    return null;
  }
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {isArabic ? "متطلبات الخدمات اللوجستية الصيدلانية" : "Pharmaceutical Logistics Requirements"}
          </CardTitle>
          <Badge variant="outline" className="text-sm">
            {isArabic ? "مخصص للصيدليات" : "Pharmacy Specific"}
          </Badge>
        </div>
        <CardDescription>
          {isArabic 
            ? "متطلبات النقل والتخزين والمناولة للمنتجات الصيدلانية"
            : "Transport, storage, and handling requirements for pharmaceutical products"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Truck className="h-5 w-5 text-primary" />
              <h4 className="font-medium">
                {isArabic ? "متطلبات النقل" : "Transport Requirements"}
              </h4>
            </div>
            <div className="space-y-2">
              {logisticsConfig.transportRequirements.map(req => (
                <div key={req} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span className="text-sm">{req}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Warehouse className="h-5 w-5 text-primary" />
              <h4 className="font-medium">
                {isArabic ? "أنواع التخزين" : "Storage Types"}
              </h4>
            </div>
            <div className="space-y-2">
              {logisticsConfig.storageTypes.map(type => (
                <div key={type} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span className="text-sm">{type}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Package className="h-5 w-5 text-primary" />
              <h4 className="font-medium">
                {isArabic ? "متطلبات المناولة" : "Handling Requirements"}
              </h4>
            </div>
            <div className="space-y-2">
              {logisticsConfig.handlingRequirements.map(req => (
                <div key={req} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span className="text-sm">{req}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
