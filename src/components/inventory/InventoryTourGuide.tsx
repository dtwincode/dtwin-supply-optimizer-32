
import React, { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { useLanguage } from '@/contexts/LanguageContext';
import { useI18n } from '@/contexts/I18nContext';
import { Button } from '@/components/ui/button';
import { InfoIcon, XCircle } from 'lucide-react';

interface InventoryTourGuideProps {
  run: boolean;
  onFinish: () => void;
}

export const InventoryTourGuide: React.FC<InventoryTourGuideProps> = ({ 
  run, 
  onFinish 
}) => {
  const { language } = useLanguage();
  const { t } = useI18n();
  const [steps, setSteps] = useState<Step[]>([]);

  useEffect(() => {
    // Define tour steps when component mounts
    const tourSteps: Step[] = [
      {
        target: '.inventory-header',
        content: language === 'ar' 
          ? 'مرحبًا بك في وحدة المخزون! هنا يمكنك إدارة ومراقبة مستويات المخزون.'
          : 'Welcome to the Inventory Module! Here you can manage and track inventory levels.',
        disableBeacon: true,
        placement: 'bottom',
      },
      {
        target: '.inventory-summary-cards',
        content: language === 'ar'
          ? 'توفر هذه البطاقات نظرة عامة سريعة على حالة المخزون الخاص بك.'
          : 'These cards provide a quick overview of your inventory status.',
        placement: 'bottom',
      },
      {
        target: '.inventory-classifications',
        content: language === 'ar'
          ? 'تصنيفات SKU تساعدك على فهم أهمية كل عنصر في سلسلة التوريد الخاصة بك.'
          : 'SKU classifications help you understand the importance of each item in your supply chain.',
        placement: 'left',
      },
      {
        target: '.inventory-map',
        content: language === 'ar'
          ? 'هذه الخريطة تظهر نقاط الفصل في شبكة سلسلة التوريد الخاصة بك.'
          : 'This map shows decoupling points in your supply chain network.',
        placement: 'right',
      },
      {
        target: '.inventory-chart',
        content: language === 'ar'
          ? 'رسم بياني يوضح اتجاهات المخزون بمرور الوقت لمساعدتك في اتخاذ قرارات أفضل.'
          : 'A chart showing inventory trends over time to help you make better decisions.',
        placement: 'top',
      },
      {
        target: '.inventory-tabs',
        content: language === 'ar'
          ? 'استخدم علامات التبويب هذه للتنقل بين مناطق المخزون المختلفة والمناظر.'
          : 'Use these tabs to navigate between different inventory areas and views.',
        placement: 'top',
      },
      {
        target: '.inventory-filters',
        content: language === 'ar'
          ? 'تصفية البيانات الخاصة بك للعثور بسرعة على عناصر محددة.'
          : 'Filter your data to quickly find specific items.',
        placement: 'bottom-start',
      },
      {
        target: '.decoupling-point-button',
        content: language === 'ar'
          ? 'انقر هنا لإضافة نقاط فصل جديدة إلى سلسلة التوريد الخاصة بك.'
          : 'Click here to add new decoupling points to your supply chain.',
        placement: 'bottom',
      }
    ];
    
    setSteps(tourSteps);
  }, [language]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      onFinish();
    }
  };

  return (
    <>
      <Joyride
        callback={handleJoyrideCallback}
        continuous
        hideCloseButton
        run={run}
        scrollToFirstStep
        showProgress
        showSkipButton
        steps={steps}
        styles={{
          options: {
            zIndex: 10000,
            primaryColor: '#0ea5e9', // Use a color that matches your theme
            textColor: '#334155',
            backgroundColor: '#ffffff',
            arrowColor: '#ffffff',
          },
          tooltipContainer: {
            textAlign: language === 'ar' ? 'right' : 'left',
          },
          buttonBack: {
            marginRight: 10,
          },
          buttonNext: {
            backgroundColor: '#0ea5e9',
          },
        }}
        locale={{
          back: language === 'ar' ? 'السابق' : 'Back',
          close: language === 'ar' ? 'إغلاق' : 'Close',
          last: language === 'ar' ? 'إنهاء' : 'Finish',
          next: language === 'ar' ? 'التالي' : 'Next',
          skip: language === 'ar' ? 'تخطي' : 'Skip',
        }}
      />
    </>
  );
};

// Create a button component to trigger the tour
export const TourButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const { language } = useLanguage();
  const { t } = useI18n();
  
  return (
    <Button
      variant="outline"
      size="sm"
      className="tour-button"
      onClick={onClick}
    >
      <InfoIcon className="h-4 w-4 mr-2" />
      {language === 'ar' ? 'بدء الجولة' : 'Start Tour'}
    </Button>
  );
};
