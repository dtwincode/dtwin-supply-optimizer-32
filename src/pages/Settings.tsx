
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { DataUploadDialog } from "@/components/settings/DataUploadDialog";
import { Separator } from "@/components/ui/separator";

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
            <h3 className="text-lg font-semibold mb-4">Data Management</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Forecasting Module</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload and manage forecasting data using CSV templates
                </p>
                <DataUploadDialog 
                  module="forecasting" 
                  onDataUploaded={() => {
                    // Handle data refresh if needed
                  }} 
                />
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2">More Settings</h4>
                <p className="text-muted-foreground">
                  {getTranslation('settings.underDevelopment', language)}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
