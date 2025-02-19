
import React, { useState, useEffect } from 'react';
import { useLanguage } from "@/contexts/LanguageContext";
import { industries } from './data/industryData';
import { InstructionsCard } from './components/InstructionsCard';
import { MaturityCategoryCard } from './components/MaturityCategoryCard';
import { MaturityLevelGuide } from './components/MaturityLevelGuide';
import { MaturityResults } from './components/MaturityResults';
import { MaturityRecommendations } from './components/MaturityRecommendations';
import { Industry, MaturityCategory } from './types/maturity';
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const MaturityAssessmentMap = () => {
  const { language, isRTL } = useLanguage();
  const { toast } = useToast();
  const isArabic = language === 'ar';
  const [selectedIndustry, setSelectedIndustry] = useState(industries[0].id);
  const [industryData, setIndustryData] = useState<Industry[]>(industries);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<string | null>(null);

  useEffect(() => {
    setIndustryData(industries);
    console.log('Industry data updated:', industries[0].maturityData.length, 'categories');
  }, []);

  const currentIndustry = industryData.find(i => i.id === selectedIndustry) || industryData[0];

  const calculateOverallScore = () => {
    const totalScore = currentIndustry.maturityData.reduce((sum, category) => {
      const categoryScore = category.subcategories.reduce((catSum, sub) => catSum + sub.level, 0);
      const maxPossibleScore = category.subcategories.length * 4;
      return sum + (categoryScore / maxPossibleScore) * 100;
    }, 0);
    return totalScore / currentIndustry.maturityData.length;
  };

  const handleIndustryChange = (newIndustryId: string) => {
    setSelectedIndustry(newIndustryId);
    setShowResults(false);
    setAiRecommendations(null);
    console.log('Industry changed to:', newIndustryId);
  };

  const handleUpdateLevel = (categoryIndex: number, subcategoryIndex: number, newLevel: number) => {
    console.log('Updating level:', { categoryIndex, subcategoryIndex, newLevel });
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
    setAiRecommendations(null);
  };

  const generateAssessmentPrompt = () => {
    const overallScore = calculateOverallScore();
    return `As a DDMRP and Supply Chain expert, analyze this maturity assessment for a ${currentIndustry.name} company:

Overall Maturity Score: ${overallScore.toFixed(1)}%

Detailed Assessment:
${currentIndustry.maturityData.map(category => {
  const categoryScore = (category.subcategories.reduce((sum, sub) => sum + sub.level, 0) / 
    (category.subcategories.length * 4)) * 100;
  
  return `
${category.name} (Score: ${categoryScore.toFixed(1)}%)
Subcategories:
${category.subcategories.map(sub => 
  `- ${sub.name}: Level ${sub.level}/4 (${sub.description})`
).join('\n')}
`}).join('\n')}

Based on this assessment, please provide:
1. Specific recommendations for improvement, prioritized by impact and ease of implementation
2. Required data, systems, and capabilities needed for advancement
3. Implementation roadmap with clear milestones
4. Potential challenges and risk mitigation strategies
5. Industry-specific considerations and best practices`;
  };

  const handleProcessAssessment = async () => {
    setLoading(true);
    console.log('Starting assessment processing...');
    
    try {
      const { data, error } = await supabase.functions.invoke('process-ai-query', {
        body: { 
          prompt: generateAssessmentPrompt() 
        },
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('Response received:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (!data?.generatedText) {
        throw new Error('No response text received from AI');
      }

      setAiRecommendations(data.generatedText);
      setShowResults(true);
      
      toast({
        title: isArabic ? "تم معالجة التقييم" : "Assessment Processed",
        description: isArabic 
          ? "يمكنك الآن رؤية نتائج تقييم النضج الخاص بك"
          : "You can now view your maturity assessment results",
      });
    } catch (error) {
      console.error('Error processing assessment:', error);
      toast({
        title: isArabic ? "حدث خطأ" : "Error",
        description: isArabic 
          ? "حدث خطأ أثناء معالجة التقييم. يرجى المحاولة مرة أخرى"
          : "An error occurred while processing the assessment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <InstructionsCard
        isArabic={isArabic}
        selectedIndustry={selectedIndustry}
        setSelectedIndustry={handleIndustryChange}
        industries={industryData}
      />

      <div className="grid gap-6 md:grid-cols-2">
        {currentIndustry.maturityData.map((category, categoryIdx) => (
          <MaturityCategoryCard
            key={`${selectedIndustry}-${categoryIdx}`}
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
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <CheckCircle2 className="w-5 h-5" />
          )}
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
            aiRecommendations={aiRecommendations}
          />
        </>
      )}

      <MaturityLevelGuide isArabic={isArabic} />
    </div>
  );
};
