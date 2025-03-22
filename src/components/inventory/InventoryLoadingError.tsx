
import { Button } from "@/components/ui/button";
import { getTranslation } from "@/translations";
import { useLanguage } from "@/contexts/LanguageContext";
import DashboardLayout from "@/components/DashboardLayout";

interface LoadingViewProps {
  message?: string;
}

export const LoadingView = ({ message }: LoadingViewProps) => {
  const { language } = useLanguage();
  
  return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center">
          <p className="text-muted-foreground">
            {message || getTranslation("common.inventory.loadingData", language)}
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

interface ErrorViewProps {
  onRetry: () => void;
}

export const ErrorView = ({ onRetry }: ErrorViewProps) => {
  const { language } = useLanguage();
  
  return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-red-600 mb-2">
            {language === 'ar' ? "حدث خطأ ما" : "Something went wrong"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {language === 'ar' ? "واجهنا خطأً أثناء تحميل صفحة المخزون." : "We encountered an error while loading the inventory page."}
          </p>
          <Button 
            onClick={onRetry} 
            variant="default"
          >
            {language === 'ar' ? "إعادة تحميل الصفحة" : "Reload Page"}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};
