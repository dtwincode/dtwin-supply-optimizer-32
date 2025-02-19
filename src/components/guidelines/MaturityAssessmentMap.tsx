import React, { useState } from 'react';
import { useLanguage } from "@/contexts/LanguageContext";
import { industries } from './data/industryData';
import { InstructionsCard } from './components/InstructionsCard';
import { MaturityCategoryCard } from './components/MaturityCategoryCard';
import { MaturityLevelGuide } from './components/MaturityLevelGuide';
import { Industry, MaturityCategory } from './types/maturity';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, BarChart2, Lightbulb } from "lucide-react";
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

  const getRecommendations = (score: number, category: MaturityCategory) => {
    if (category.name === "Demand Forecasting") {
      if (score < 25) {
        return isArabic 
          ? `تحتاج إلى تطوير عملية جمع البيانات الأساسية. المتطلبات: بيانات المبيعات التاريخية لمدة 12 شهراً على الأقل، تحليل الاتجاهات الموسمية، وتتبع تأثير العروض الترويجية`
          : `Need to develop basic data collection process. Requirements: Historical sales data for at least 12 months, seasonal trend analysis, and promotional impact tracking`;
      } else if (score < 50) {
        return isArabic
          ? `تحسين جودة البيانات وأتمتة التحليل. المتطلبات: نظام تنبؤ آلي، تكامل بيانات نقاط البيع، وتحليل متقدم للاتجاهات`
          : `Improve data quality and automate analysis. Requirements: Automated forecasting system, POS data integration, and advanced trend analysis`;
      } else if (score < 75) {
        return isArabic
          ? `تطبيق تقنيات متقدمة. المتطلبات: تحليلات البيانات الضخمة، التعلم الآلي للتنبؤ، وتكامل بيانات السوق الخارجية`
          : `Implement advanced techniques. Requirements: Big data analytics, ML forecasting, and external market data integration`;
      } else {
        return isArabic
          ? `الحفاظ على التميز وتحسين الدقة. المتطلبات: تحديث مستمر للنماذج، تحليل السيناريوهات، والتكامل مع سلسلة التوريد`
          : `Maintain excellence and improve accuracy. Requirements: Continuous model updates, scenario analysis, and supply chain integration`;
      }
    }
    
    return isArabic 
      ? `تطوير ${category.nameAr} من خلال تحسين العمليات وجمع البيانات المناسبة`
      : `Develop ${category.name} through process improvement and appropriate data collection`;
  };

  const getDataRequirements = (score: number) => {
    if (score < 25) {
      return {
        data: isArabic 
          ? ["بيانات المبيعات الأساسية", "معلومات المخزون الأساسية", "بيانات العملاء الأساسية"]
          : ["Basic sales data", "Basic inventory information", "Basic customer data"],
        tools: isArabic
          ? ["جداول Excel أساسية", "نظام نقاط البيع الأساسي"]
          : ["Basic Excel sheets", "Basic POS system"],
        collaboration: isArabic
          ? ["تنسيق أسبوعي بين الأقسام", "مشاركة التقارير الأساسية"]
          : ["Weekly department coordination", "Basic report sharing"]
      };
    } else if (score < 50) {
      return {
        data: isArabic
          ? ["بيانات مبيعات تفصيلية", "تتبع المخزون في الوقت الفعلي", "تحليل سلوك العملاء"]
          : ["Detailed sales data", "Real-time inventory tracking", "Customer behavior analysis"],
        tools: isArabic
          ? ["نظام تخطيط موارد المؤسسات", "أدوات التحليل المتقدمة", "لوحات المعلومات التفاعلية"]
          : ["ERP system", "Advanced analytics tools", "Interactive dashboards"],
        collaboration: isArabic
          ? ["اجتماعات يومية للفريق", "مشاركة التحليلات في الوقت الفعلي", "تكامل البيانات بين الإدارات"]
          : ["Daily team meetings", "Real-time analytics sharing", "Cross-department data integration"]
      };
    } else if (score < 75) {
      return {
        data: isArabic
          ? ["بيانات السوق الخارجية", "تحليلات التنبؤ المتقدمة", "بيانات سلسلة التوريد الكاملة"]
          : ["External market data", "Advanced forecasting analytics", "Complete supply chain data"],
        tools: isArabic
          ? ["منصة تحليلات متكاملة", "أدوات التعلم الآلي", "نظام تخطيط متقدم"]
          : ["Integrated analytics platform", "Machine learning tools", "Advanced planning system"],
        collaboration: isArabic
          ? ["تعاون في الوقت الفعلي", "مشاركة التنبؤات الآلية", "تكامل مع الموردين"]
          : ["Real-time collaboration", "Automated forecast sharing", "Supplier integration"]
      };
    } else {
      return {
        data: isArabic
          ? ["بيانات السوق الشاملة", "تحليلات متقدمة للعملاء", "بيانات سلسلة التوريد العالمية"]
          : ["Comprehensive market data", "Advanced customer analytics", "Global supply chain data"],
        tools: isArabic
          ? ["منصة ذكاء أعمال متكاملة", "أدوات تحليل متقدمة", "نظام تخطيط شامل"]
          : ["Integrated BI platform", "Advanced analytics suite", "Comprehensive planning system"],
        collaboration: isArabic
          ? ["تكامل شامل بين الأقسام", "تعاون مع الشركاء الخارجيين", "مشاركة البيانات في الوقت الفعلي"]
          : ["Full department integration", "External partner collaboration", "Real-time data sharing"]
      };
    }
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

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Lightbulb className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-semibold">
                {isArabic ? "التوصيات والمتطلبات" : "Recommendations & Requirements"}
              </h3>
            </div>
            
            <div className="space-y-6">
              {currentIndustry.maturityData.map((category, idx) => {
                const score = calculateCategoryScore(category);
                return (
                  <div key={idx} className="p-4 bg-secondary/50 rounded-lg">
                    <h4 className="font-medium mb-2">
                      {isArabic ? category.nameAr : category.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {getRecommendations(score, category)}
                    </p>
                  </div>
                );
              })}
              
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <h4 className="font-medium mb-2">
                  {isArabic ? "المتطلبات التفصيلية" : "Detailed Requirements"}
                </h4>
                {(() => {
                  const requirements = getDataRequirements(calculateOverallScore());
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
        </>
      )}

      <MaturityLevelGuide isArabic={isArabic} />
    </div>
  );
};
