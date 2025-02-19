
import React from 'react';
import { Card } from "@/components/ui/card";
import { BarChart2 } from "lucide-react";
import { MaturityCategory } from '../types/maturity';
import { calculateCategoryScore } from '../utils/maturityUtils';

interface MaturityResultsProps {
  isArabic: boolean;
  categories: MaturityCategory[];
  calculateOverallScore: () => number;
}

export const MaturityResults: React.FC<MaturityResultsProps> = ({
  isArabic,
  categories,
  calculateOverallScore
}) => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <BarChart2 className="h-6 w-6 text-primary" />
        <h3 className="text-xl font-semibold">
          {isArabic ? "نتائج التقييم" : "Assessment Results"}
        </h3>
      </div>
      
      <div className="space-y-6">
        {categories.map((category, idx) => {
          const score = calculateCategoryScore(category);
          return (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">
                  {isArabic ? category.nameAr : category.name}
                </span>
                <span className="text-sm font-medium">
                  {score.toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all"
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          );
        })}
        
        <div className="pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-lg">
              {isArabic ? "النتيجة الإجمالية" : "Overall Score"}
            </span>
            <span className="font-semibold text-lg text-primary">
              {calculateOverallScore().toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
