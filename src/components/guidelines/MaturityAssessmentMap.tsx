
import React, { useState } from 'react';
import { useLanguage } from "@/contexts/LanguageContext";
import { industries } from './data/industryData';
import { InstructionsCard } from './components/InstructionsCard';
import { MaturityCategoryCard } from './components/MaturityCategoryCard';
import { MaturityLevelGuide } from './components/MaturityLevelGuide';
import { MaturityResults } from './components/MaturityResults';
import { MaturityRecommendations } from './components/MaturityRecommendations';
import { Industry, MaturityCategory } from './types/maturity';
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const MaturityAssessmentMap = () => {
  const { language, isRTL } = useLanguage();
  const { toast } = useToast();
  const isArabic = language === 'ar';
  const [selectedIndustry, setSelectedIndustry] = useState(industries[0].id);
  const [industryData, setIndustryData] = useState<Industry[]>(industries);
  const [showResults, setShowResults] = useState(false);

  const currentIndustry = industryData.find(i => i.id === selectedIndustry) || industryData[0];

  const calculateOverallScore = () => {
    const totalScore = currentIndustry.maturityData.reduce((sum, category) => {
      const categoryScore = category.subcategories.reduce((catSum, sub) => catSum + sub.level, 0);
      const maxPossibleScore = category.subcategories.length * 4;
      return sum + (categoryScore / maxPossibleScore) * 100;
    }, 0);
    return totalScore / currentIndustry.maturityData.length;
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

  const handleProcessAssessment = () => {
    setShowResults(true);
    toast({
      title: isArabic ? "تم معالجة التقييم" : "Assessment Processed",
      description: isArabic 
        ? "يمكنك الآن رؤية نتائج تقييم النضج الخاص بك"
        : "You can now view your maturity assessment results",
    });
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
        <>
          <MaturityResults
            isArabic={isArabic}
            categories={currentIndustry.maturityData}
            calculateOverallScore={calculateOverallScore}
          />
          <MaturityRecommendations
            isArabic={isArabic}
            categories={currentIndustry.maturityData}
            overallScore={calculateOverallScore()}
          />
        </>
      )}

      <MaturityLevelGuide isArabic={isArabic} />
    </div>
  );
};
