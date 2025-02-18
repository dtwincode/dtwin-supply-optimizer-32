
import DashboardLayout from "@/components/DashboardLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const ForecastingBasics = () => {
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
          {language === 'ar' ? "أساسيات التنبؤ" : "Forecasting Basics"}
        </h1>
        
        <Separator className="my-6" />

        <Card className="p-6">
          <div className="prose dark:prose-invert max-w-none">
            <h2>{language === 'ar' ? "فهم أساسيات التنبؤ" : "Understanding Forecasting Basics"}</h2>
            {/* Add content here */}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ForecastingBasics;
