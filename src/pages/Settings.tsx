
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { DataUploadDialog } from "@/components/settings/DataUploadDialog";
import { Separator } from "@/components/ui/separator";
import { Database } from "@/integrations/supabase/types";

type ModuleType = Database["public"]["Enums"]["module_type"];

const MODULES: { id: ModuleType; title: string; description: string }[] = [
  {
    id: "forecasting",
    title: "Forecasting Module",
    description: "Upload and manage forecasting data using CSV templates"
  },
  {
    id: "inventory",
    title: "Inventory Module",
    description: "Upload and manage inventory data using CSV templates"
  },
  {
    id: "sales",
    title: "Sales Module",
    description: "Upload and manage sales data using CSV templates"
  },
  {
    id: "marketing",
    title: "Marketing Module",
    description: "Upload and manage marketing campaign data using CSV templates"
  },
  {
    id: "logistics",
    title: "Logistics Module",
    description: "Upload and manage logistics and shipment data using CSV templates"
  },
  {
    id: "location_hierarchy",
    title: "Location Hierarchy",
    description: "Upload and manage location hierarchy data using CSV templates"
  },
  {
    id: "product_hierarchy",
    title: "Product Hierarchy",
    description: "Upload and manage product hierarchy data using CSV templates"
  }
];

const Settings = () => {
  const { language } = useLanguage();

  const handleDataUploaded = (module: ModuleType) => {
    console.log(`Data uploaded for ${module} module`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">
          {getTranslation('navigationItems.settings', language)}
        </h2>
        <div className="grid gap-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Data Management</h3>
            <div className="space-y-6">
              {MODULES.map((module, index) => (
                <div key={module.id}>
                  <div>
                    <h4 className="text-sm font-medium mb-2">{module.title}</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      {module.description}
                    </p>
                    <DataUploadDialog 
                      module={module.id}
                      onDataUploaded={() => handleDataUploaded(module.id)}
                    />
                  </div>
                  {index < MODULES.length - 1 && (
                    <Separator className="my-6" />
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
