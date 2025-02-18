
import DashboardLayout from "@/components/DashboardLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const AIAssistant = () => {
  const { language, isRTL } = useLanguage();

  return (
    <DashboardLayout>
      <div className="flex flex-col p-6" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="flex items-center gap-2 mb-4">
          <Link 
            to="/guidelines"
            className="flex items-center text-sm text-muted-foreground hover:text-primary"
          >
            <ChevronLeft className="h-4 w-4" />
            {language === 'ar' ? "العودة إلى الدليل" : "Back to Guidelines"}
          </Link>
        </div>

        <h1 className="text-3xl font-semibold tracking-tight">
          {language === 'ar' ? "مساعد الذكاء الاصطناعي" : "AI Assistant"}
        </h1>
        
        <Separator className="my-6" />

        <Card className="p-6">
          <div className="prose dark:prose-invert max-w-none">
            <h2>{language === 'ar' ? "استخدام مساعد الذكاء الاصطناعي" : "Using the AI Assistant"}</h2>
            <p>{language === 'ar'
              ? "تعلم كيفية استخدام مساعد الذكاء الاصطناعي للحصول على إجابات فورية وتحسين عملك"
              : "Learn how to use the AI assistant to get instant answers and improve your workflow"}
            </p>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AIAssistant;
