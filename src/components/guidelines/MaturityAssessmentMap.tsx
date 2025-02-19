
import React, { useState } from 'react';
import { useLanguage } from "@/contexts/LanguageContext";
import { industries } from './data/industryData';
import { InstructionsCard } from './components/InstructionsCard';
import { MaturityCategoryCard } from './components/MaturityCategoryCard';
import { MaturityLevelGuide } from './components/MaturityLevelGuide';

export const MaturityAssessmentMap = () => {
  const { language, isRTL } = useLanguage();
  const isArabic = language === 'ar';
  const [selectedIndustry, setSelectedIndustry] = useState(industries[0].id);

  const currentIndustry = industries.find(i => i.id === selectedIndustry) || industries[0];

  return (
    <div className="p-6 space-y-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <InstructionsCard
        isArabic={isArabic}
        selectedIndustry={selectedIndustry}
        setSelectedIndustry={setSelectedIndustry}
        industries={industries}
      />

      <div className="grid gap-6 md:grid-cols-2">
        {currentIndustry.maturityData.map((category, idx) => (
          <MaturityCategoryCard
            key={idx}
            category={category}
            isArabic={isArabic}
          />
        ))}
      </div>

      <MaturityLevelGuide isArabic={isArabic} />
    </div>
  );
};
