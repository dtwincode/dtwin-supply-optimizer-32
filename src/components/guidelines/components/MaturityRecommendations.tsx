
import React from 'react';
import { Card } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import { MaturityCategory } from '../types/maturity';
import { calculateCategoryScore, getRecommendations, getDataRequirements } from '../utils/maturityUtils';

interface MaturityRecommendationsProps {
  isArabic: boolean;
  categories: MaturityCategory[];
  overallScore: number;
}

export const MaturityRecommendations: React.FC<MaturityRecommendationsProps> = ({
  isArabic,
  categories,
  overallScore
}) => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Lightbulb className="h-6 w-6 text-primary" />
        <h3 className="text-xl font-semibold">
          {isArabic ? "التوصيات والمتطلبات" : "Recommendations & Requirements"}
        </h3>
      </div>
      
      <div className="space-y-6">
        {categories.map((category, idx) => {
          const score = calculateCategoryScore(category);
          return (
            <div key={idx} className="p-4 bg-secondary/50 rounded-lg">
              <h4 className="font-medium mb-2">
                {isArabic ? category.nameAr : category.name}
              </h4>
              <p className="text-sm text-muted-foreground">
                {getRecommendations(score, category, isArabic)}
              </p>
            </div>
          );
        })}
        
        <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
          <h4 className="font-medium mb-2">
            {isArabic ? "المتطلبات التفصيلية" : "Detailed Requirements"}
          </h4>
          {(() => {
            const requirements = getDataRequirements(overallScore, isArabic);
            return (
              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-medium mb-1">
                    {isArabic ? "البيانات المطلوبة" : "Required Data"}
                  </h5>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {requirements.data.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="text-sm font-medium mb-1">
                    {isArabic ? "الأدوات والأنظمة" : "Tools & Systems"}
                  </h5>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {requirements.tools.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="text-sm font-medium mb-1">
                    {isArabic ? "متطلبات التعاون" : "Collaboration Requirements"}
                  </h5>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {requirements.collaboration.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </Card>
  );
};
