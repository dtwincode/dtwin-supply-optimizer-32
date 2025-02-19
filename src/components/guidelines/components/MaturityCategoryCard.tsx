
import React from 'react';
import { Card } from "@/components/ui/card";
import { BarChart2, HelpCircle, Info } from "lucide-react";
import { MaturityCategory } from "../types/maturity";
import { getLevelColor, getLevelName } from "../utils/maturityUtils";

interface MaturityCategoryCardProps {
  category: MaturityCategory;
  isArabic: boolean;
}

export const MaturityCategoryCard: React.FC<MaturityCategoryCardProps> = ({
  category,
  isArabic
}) => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <BarChart2 className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">
          {isArabic ? category.nameAr : category.name}
        </h3>
        <div className="ml-auto">
          <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
        </div>
      </div>
      <div className="space-y-6">
        {category.subcategories.map((subcat, subIdx) => (
          <div key={subIdx} className="space-y-2">
            <div className="flex justify-between text-sm">
              <div className="flex items-center gap-2">
                <span>{isArabic ? subcat.nameAr : subcat.name}</span>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </div>
              <span className="text-muted-foreground font-medium">
                {getLevelName(subcat.level, isArabic)}
              </span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className={`h-full ${getLevelColor(subcat.level)} transition-all`}
                style={{ width: `${(subcat.level / 4) * 100}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {isArabic ? subcat.descriptionAr : subcat.description}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};
