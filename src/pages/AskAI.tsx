
import DashboardLayout from "@/components/DashboardLayout";
import { AskAI } from "@/components/ai/AskAI";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";

const AskAIPage = () => {
  const { language } = useLanguage();

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {getTranslation('navigationItems.askAI', language)}
            </h1>
            <p className="text-muted-foreground">
              {language === 'ar' 
                ? 'اطرح أسئلة واحصل على رؤى حول بيانات سلسلة التوريد الخاصة بك'
                : 'Ask questions and get insights about your supply chain data'}
            </p>
          </div>
        </div>
        <AskAI />
      </div>
    </DashboardLayout>
  );
};

export default AskAIPage;
