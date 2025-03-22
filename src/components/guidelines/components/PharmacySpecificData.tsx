
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

export const PharmacySpecificData: React.FC = () => {
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>
          {isArabic ? "خصائص قطاع الصيدلة" : "Pharmacy Industry Specifics"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">
            {isArabic ? "المخزون المتخصص" : "Specialized Inventory"}
          </h3>
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="outline">
              {isArabic ? "تتبع انتهاء الصلاحية" : "Expiry Tracking"}
            </Badge>
            <Badge variant="outline">
              {isArabic ? "سلسلة التبريد" : "Cold Chain"}
            </Badge>
            <Badge variant="outline">
              {isArabic ? "المنتجات المنظمة" : "Regulated Products"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {isArabic 
              ? "يتضمن مخزون الصيدلية متطلبات خاصة مثل تتبع انتهاء الصلاحية وإدارة سلسلة التبريد والمنتجات الخاضعة للتنظيم."
              : "Pharmacy inventory includes special requirements such as expiry tracking, cold chain management, and regulated products."}
          </p>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">
            {isArabic ? "المؤشرات الرئيسية" : "Key Indicators"}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="border rounded p-3">
              <div className="text-lg font-medium">
                {isArabic ? "الحالة التنظيمية" : "Regulatory Status"}
              </div>
              <p className="text-sm text-muted-foreground">
                {isArabic 
                  ? "تتبع حالة الموافقات التنظيمية للمنتجات"
                  : "Tracking regulatory approvals status for products"}
              </p>
            </div>
            <div className="border rounded p-3">
              <div className="text-lg font-medium">
                {isArabic ? "ظروف التخزين" : "Storage Conditions"}
              </div>
              <p className="text-sm text-muted-foreground">
                {isArabic 
                  ? "متطلبات ظروف التخزين المحددة (درجة الحرارة، الرطوبة)"
                  : "Specific storage condition requirements (temperature, humidity)"}
              </p>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">
            {isArabic ? "اعتبارات فريدة" : "Unique Considerations"}
          </h3>
          <ul className="list-disc list-inside text-sm space-y-2 pl-2">
            <li>
              {isArabic
                ? "مراقبة الوصفات الطبية والاتجاهات لتحسين التنبؤ"
                : "Prescription monitoring and trends for improved forecasting"}
            </li>
            <li>
              {isArabic
                ? "متطلبات الامتثال التنظيمي للمنتجات الصيدلانية"
                : "Regulatory compliance requirements for pharmaceutical products"}
            </li>
            <li>
              {isArabic
                ? "دمج البيانات الصحية لتحسين التخطيط والتنبؤ"
                : "Health data integration for better planning and forecasting"}
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
