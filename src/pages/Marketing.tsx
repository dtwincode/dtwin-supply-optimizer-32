
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gift, Calendar as CalendarIcon, BarChart, LineChart, LayoutGrid } from "lucide-react";
import { MarketingPlanList } from "@/components/marketing/MarketingPlanList";
import { MarketingMetricsGrid } from "@/components/marketing/MarketingMetricsGrid";
import { MarketingCalendarView } from "@/components/marketing/MarketingCalendarView";
import { MarketingAnalytics } from "@/components/marketing/MarketingAnalytics";
import { MarketingForecastImpact } from "@/components/marketing/MarketingForecastImpact";
import { MarketingIntegration } from "@/components/marketing/MarketingIntegration";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";

const Marketing = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(`marketing.${key}`, language) || key;

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t('marketingModule')}</h1>
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

        <div className="mb-4">
          <MarketingMetricsGrid />
        </div>

        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList>
            <TabsTrigger value="dashboard">
              <LayoutGrid className="h-4 w-4 mr-2" />
              {t('dashboard')}
            </TabsTrigger>
            <TabsTrigger value="calendar">
              <CalendarIcon className="h-4 w-4 mr-2" />
              {t('calendar')}
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart className="h-4 w-4 mr-2" />
              {t('analytics')}
            </TabsTrigger>
            <TabsTrigger value="forecastImpact">
              <LineChart className="h-4 w-4 mr-2" />
              {t('forecastImpact')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Gift className="h-5 w-5" />
                  <h2 className="text-lg font-medium">
                    {language === 'ar' ? 'الحملات النشطة' : 'Active Promotions'}
                  </h2>
                </div>
                <MarketingPlanList />
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5" />
                  <h2 className="text-lg font-medium">
                    {language === 'ar' ? 'التقويم الترويجي' : 'Promotional Calendar'}
                  </h2>
                </div>
                <MarketingCalendarView />
              </div>
            </div>
            <MarketingIntegration />
          </TabsContent>
          
          <TabsContent value="calendar">
            <div className="space-y-4">
              <MarketingCalendarView />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border p-3"
                />
                <MarketingPlanList />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MarketingAnalytics />
              <MarketingIntegration />
            </div>
          </TabsContent>
          
          <TabsContent value="forecastImpact">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MarketingForecastImpact />
              <MarketingIntegration />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Marketing;
