
import React from 'react';
import { Card } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Industry } from "../types/maturity";

interface InstructionsCardProps {
  isArabic: boolean;
  selectedIndustry: string;
  setSelectedIndustry: (industry: string) => void;
  industries: Industry[];
}

export const InstructionsCard: React.FC<InstructionsCardProps> = ({
  isArabic,
  selectedIndustry,
  setSelectedIndustry,
  industries
}) => {
  return (
    <Card className="p-6 border-primary/20">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <BookOpen className="h-5 w-5 text-primary" />
        </div>
        <div className="space-y-4 flex-grow">
          <div>
            <h3 className="font-semibold text-lg mb-2">
              {isArabic ? "كيفية استخدام تقييم النضج" : "How to Use the Maturity Assessment"}
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                {isArabic 
                  ? "١. اختر القطاع الصناعي الخاص بك"
                  : "1. Select your industry sector"}
              </p>
              <p>
                {isArabic 
                  ? "٢. راجع كل فئة ومؤشراتها الفرعية لفهم مستوى نضجك الحالي"
                  : "2. Review each category and its subcategories to understand your current maturity level"}
              </p>
              <p>
                {isArabic
                  ? "٣. قيّم مستواك الحالي باستخدام المقياس من ٠ إلى ٤"
                  : "3. Assess your current level using the 0-4 scale"}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              {isArabic ? "اختر القطاع" : "Select Industry"}
            </label>
            <Select
              value={selectedIndustry}
              onValueChange={setSelectedIndustry}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder={isArabic ? "اختر القطاع" : "Select industry"} />
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
        </div>
      </div>
    </Card>
  );
};
