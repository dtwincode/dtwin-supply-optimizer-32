
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Calendar } from "@/components/ui/calendar";
import { MarketingPlanForm } from "@/components/marketing/MarketingPlanForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Gift, Calendar as CalendarIcon } from "lucide-react";
import { MarketingPlanList } from "@/components/marketing/MarketingPlanList";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";

const Marketing = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { language } = useLanguage();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {getTranslation('navigationItems.marketing', language)}
            </h1>
            <p className="text-muted-foreground">
              {language === 'ar' 
                ? 'إدارة الحملات الترويجية والفعاليات الموسمية'
                : 'Manage promotional campaigns and seasonal events'}
            </p>
          </div>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button>
                <Gift className="mr-2 h-4 w-4" />
                {language === 'ar' ? 'حملة جديدة' : 'New Promotion'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {language === 'ar' ? 'إنشاء خطة ترويجية جديدة' : 'Create New Promotional Plan'}
                </DialogTitle>
              </DialogHeader>
              <MarketingPlanForm onClose={() => setIsFormOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5" />
              <h2 className="text-lg font-medium">
                {language === 'ar' ? 'عرض التقويم' : 'Calendar View'}
              </h2>
            </div>
            <div className="border rounded-lg p-4">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Gift className="h-5 w-5" />
              <h2 className="text-lg font-medium">
                {language === 'ar' ? 'الحملات النشطة' : 'Active Promotions'}
              </h2>
            </div>
            <MarketingPlanList />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Marketing;
