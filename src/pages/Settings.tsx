
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { DataUploadDialog } from "@/components/settings/DataUploadDialog";
import { Separator } from "@/components/ui/separator";
import { Database } from "@/integrations/supabase/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type ModuleType = Database["public"]["Enums"]["module_type"];

interface DocumentationSection {
  title: string;
  content: string;
}

interface ModuleDocumentation {
  overview: string;
  sections: DocumentationSection[];
}

interface ModuleSettings {
  documentation?: ModuleDocumentation;
  [key: string]: any;
}

interface ModuleSetting {
  id: string;
  module: ModuleType;
  settings: ModuleSettings;
  created_at: string;
  updated_at: string;
}

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

  const { data: moduleSettings } = useQuery({
    queryKey: ['moduleSettings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('module_settings')
        .select('*');
      
      if (error) throw error;
      return data as ModuleSetting[];
    }
  });

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
              {MODULES.map((module, index) => {
                const moduleDoc = moduleSettings?.find(m => m.module === module.id)?.settings?.documentation;
                
                return (
                  <div key={module.id}>
                    <div>
                      <h4 className="text-sm font-medium mb-2">{module.title}</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        {module.description}
                      </p>
                      
                      {moduleDoc && (
                        <div className="mb-4 p-4 bg-muted rounded-lg">
                          <h5 className="font-medium mb-2">Documentation</h5>
                          <p className="text-sm mb-4">{moduleDoc.overview}</p>
                          
                          <div className="space-y-4">
                            {moduleDoc.sections?.map((section: DocumentationSection, idx: number) => (
                              <div key={idx}>
                                <h6 className="font-medium mb-1">{section.title}</h6>
                                <p className="text-sm whitespace-pre-line">{section.content}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <DataUploadDialog 
                        module={module.id}
                        onDataUploaded={() => handleDataUploaded(module.id)}
                      />
                    </div>
                    {index < MODULES.length - 1 && (
                      <Separator className="my-6" />
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
