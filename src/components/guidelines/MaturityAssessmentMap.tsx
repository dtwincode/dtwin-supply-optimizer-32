
import React, { useState } from 'react';
import { useLanguage } from "@/contexts/LanguageContext";
import { industries } from './data/industryData';
import { InstructionsCard } from './components/InstructionsCard';
import { MaturityCategoryCard } from './components/MaturityCategoryCard';
import { MaturityLevelGuide } from './components/MaturityLevelGuide';
import { Industry, MaturityCategory } from './types/maturity';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, BarChart2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const MaturityAssessmentMap = () => {
  const { language, isRTL } = useLanguage();
  const { toast } = useToast();
  const isArabic = language === 'ar';
  const [selectedIndustry, setSelectedIndustry] = useState(industries[0].id);
  const [industryData, setIndustryData] = useState<Industry[]>(industries);
  const [showResults, setShowResults] = useState(false);

  const currentIndustry = industryData.find(i => i.id === selectedIndustry) || industryData[0];

  const calculateCategoryScore = (category: MaturityCategory) => {
    const totalLevels = category.subcategories.reduce((sum, sub) => sum + sub.level, 0);
    const maxPossibleScore = category.subcategories.length * 4;
    return (totalLevels / maxPossibleScore) * 100;
  };

  const calculateOverallScore = () => {
    const totalScore = currentIndustry.maturityData.reduce((sum, category) => {
      return sum + calculateCategoryScore(category);
    }, 0);
    return totalScore / currentIndustry.maturityData.length;
  };

  const handleProcessAssessment = () => {
    setShowResults(true);
    toast({
      title: isArabic ? "تم معالجة التقييم" : "Assessment Processed",
      description: isArabic 
        ? "يمكنك الآن رؤية نتائج تقييم النضج الخاص بك"
        : "You can now view your maturity assessment results",
    });
  };

  const handleUpdateLevel = (categoryIndex: number, subcategoryIndex: number, newLevel: number) => {
    setIndustryData(prevData => {
      const newData = [...prevData];
      const industryIndex = newData.findIndex(i => i.id === selectedIndustry);
      
      if (industryIndex !== -1) {
        const updatedMaturityData = [...newData[industryIndex].maturityData];
        const updatedSubcategories = [...updatedMaturityData[categoryIndex].subcategories];
        
        updatedSubcategories[subcategoryIndex] = {
          ...updatedSubcategories[subcategoryIndex],
          level: newLevel
        };
        
        updatedMaturityData[categoryIndex] = {
          ...updatedMaturityData[categoryIndex],
          subcategories: updatedSubcategories
        };
        
        newData[industryIndex] = {
          ...newData[industryIndex],
          maturityData: updatedMaturityData
        };
      }
      
      return newData;
    });
    setShowResults(false);
  };

  return (
    <div className="p-6 space-y-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <InstructionsCard
        isArabic={isArabic}
        selectedIndustry={selectedIndustry}
        setSelectedIndustry={setSelectedIndustry}
        industries={industryData}
      />

      <div className="grid gap-6 md:grid-cols-2">
        {currentIndustry.maturityData.map((category, categoryIdx) => (
          <MaturityCategoryCard
            key={categoryIdx}
            category={category}
            isArabic={isArabic}
            onUpdateLevel={(subcategoryIndex, newLevel) => 
              handleUpdateLevel(categoryIdx, subcategoryIndex, newLevel)
            }
          />
        ))}
      </div>

      <div className="flex justify-center">
        <Button 
          onClick={handleProcessAssessment}
          className="gap-2"
          size="lg"
        >
          <CheckCircle2 className="w-5 h-5" />
          {isArabic ? "معالجة التقييم" : "Process Assessment"}
        </Button>
      </div>

      {showResults && (
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart2 className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-semibold">
              {isArabic ? "نتائج التقييم" : "Assessment Results"}
            </h3>
          </div>
          
          <div className="space-y-6">
            {currentIndustry.maturityData.map((category, idx) => {
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
      )}

      <MaturityLevelGuide isArabic={isArabic} />
    </div>
  );
};
