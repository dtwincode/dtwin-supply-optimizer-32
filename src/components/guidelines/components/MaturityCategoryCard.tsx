
import React from 'react';
import { Card } from "@/components/ui/card";
import { BarChart2, HelpCircle, Info } from "lucide-react";
import { MaturityCategory } from "../types/maturity";
import { getLevelColor, getLevelName } from "../utils/maturityUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MaturityCategoryCardProps {
  category: MaturityCategory;
  isArabic: boolean;
  onUpdateLevel: (subcategoryIndex: number, newLevel: number) => void;
}

export const MaturityCategoryCard: React.FC<MaturityCategoryCardProps> = ({
  category,
  isArabic,
  onUpdateLevel
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
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <span>{isArabic ? subcat.nameAr : subcat.name}</span>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </div>
              <Select
                value={subcat.level.toString()}
                onValueChange={(value) => onUpdateLevel(subIdx, parseInt(value))}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue>
                    {getLevelName(subcat.level, isArabic)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {[0, 1, 2, 3, 4].map((level) => (
                    <SelectItem key={level} value={level.toString()}>
                      {getLevelName(level, isArabic)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
