
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";

const Settings = () => {
  const { language } = useLanguage();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">
          {getTranslation('navigationItems.settings', language)}
        </h2>
        <div className="grid gap-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              {getTranslation('settings.comingSoon', language)}
            </h3>
            <p className="text-muted-foreground">
              {getTranslation('settings.underDevelopment', language)}
            </p>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
