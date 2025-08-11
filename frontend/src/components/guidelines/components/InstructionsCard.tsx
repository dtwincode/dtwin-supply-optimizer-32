
import React from 'react';
import { Card } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ClipboardList, Database } from "lucide-react";
import { Industry } from '../types/maturity';

interface InstructionsCardProps {
  isArabic: boolean;
  selectedIndustry: string;
  setSelectedIndustry: (id: string) => void;
  industries: Industry[];
}

export const InstructionsCard: React.FC<InstructionsCardProps> = ({
  isArabic,
  selectedIndustry,
  setSelectedIndustry,
  industries
}) => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <ClipboardList className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">
          {isArabic ? "تعليمات التقييم" : "Assessment Instructions"}
        </h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium mb-2 block">
            {isArabic ? "اختر القطاع" : "Select Industry"}
          </label>
          <Select 
            value={selectedIndustry}
            onValueChange={setSelectedIndustry}
          >
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {industries.map((industry) => (
                <SelectItem key={industry.id} value={industry.id}>
                  {isArabic ? industry.nameAr : industry.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Database className="h-5 w-5 text-primary mt-1" />
            <div>
              <h3 className="font-medium mb-2">
                {isArabic ? "البيانات المطلوبة للتقييم" : "Required Data for Assessment"}
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  {isArabic 
                    ? "• بيانات المبيعات التاريخية (12-24 شهراً على الأقل)"
                    : "• Historical sales data (minimum 12-24 months)"}
                </li>
                <li>
                  {isArabic
                    ? "• معلومات المخزون وأوقات التوريد"
                    : "• Inventory levels and lead times"}
                </li>
                <li>
                  {isArabic
                    ? "• هيكل التسلسل الهرمي للمنتجات والمواقع"
                    : "• Product and location hierarchy structure"}
                </li>
                <li>
                  {isArabic
                    ? "• تقارير أداء سلسلة التوريد"
                    : "• Supply chain performance reports"}
                </li>
                <li>
                  {isArabic
                    ? "• بيانات التكلفة والأسعار"
                    : "• Cost and pricing data"}
                </li>
              </ul>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <ClipboardList className="h-5 w-5 text-primary mt-1" />
            <div>
              <h3 className="font-medium mb-2">
                {isArabic ? "تنسيق البيانات المطلوب" : "Required Data Format"}
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  {isArabic
                    ? "• ملفات Excel (.xlsx) أو CSV منظمة"
                    : "• Organized Excel (.xlsx) or CSV files"}
                </li>
                <li>
                  {isArabic
                    ? "• بيانات نظيفة خالية من القيم المفقودة"
                    : "• Clean data with no missing values"}
                </li>
                <li>
                  {isArabic
                    ? "• تواريخ بتنسيق موحد"
                    : "• Dates in consistent format"}
                </li>
                <li>
                  {isArabic
                    ? "• معرفات فريدة للمنتجات والمواقع"
                    : "• Unique identifiers for products and locations"}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
