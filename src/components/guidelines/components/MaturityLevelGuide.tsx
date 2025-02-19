
import React from 'react';
import { Card } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { getLevelColor, getLevelName } from "../utils/maturityUtils";

interface MaturityLevelGuideProps {
  isArabic: boolean;
}

export const MaturityLevelGuide: React.FC<MaturityLevelGuideProps> = ({
  isArabic
}) => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <BookOpen className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">
          {isArabic ? "دليل مستويات النضج" : "Maturity Level Guide"}
        </h3>
      </div>
      <div className="grid gap-4 md:grid-cols-5">
        {[0, 1, 2, 3, 4].map((level) => (
          <div key={level} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded-full ${getLevelColor(level)}`} />
            <span className="text-sm">
              {getLevelName(level, isArabic)}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};
