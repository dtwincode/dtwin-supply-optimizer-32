import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { DataUploadDialog } from "@/components/settings/DataUploadDialog";
import { Separator } from "@/components/ui/separator";
import { Database } from "@/integrations/supabase/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ModuleType = Database["public"]["Enums"]["module_type"];

// Using keyof to get the actual table names from Database type
type TableNames = keyof Database["public"]["Tables"];

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
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: moduleSettings } = useQuery<ModuleSetting[]>({
    queryKey: ['moduleSettings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('module_settings')
        .select('*');
      
      if (error) throw error;
      return data as ModuleSetting[];
    }
  });

  const { data: validationLogs, refetch: refetchLogs } = useQuery({
    queryKey: ['validationLogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('data_validation_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    }
  });

  const handleDataUploaded = (module: ModuleType) => {
    console.log(`Data uploaded for ${module} module`);
    refetchLogs();
  };

  const handleClearModuleData = async (module: ModuleType) => {
    try {
      const { error } = await supabase
        .from(module === 'forecasting' ? 'forecast_data' :
              module === 'inventory' ? 'inventory_data' :
              module === 'sales' ? 'sales_data' :
              module === 'marketing' ? 'marketing_data' :
              module === 'logistics' ? 'logistics_data' :
              module === 'product_hierarchy' ? 'product_hierarchy' :
              'location_hierarchy' as const)
        .delete()
        .gt('id', '00000000-0000-0000-0000-000000000000');
      
      if (error) throw error;

      toast({
        title: "Success",
        description: `All ${module} data has been deleted`,
      });

      // Log the deletion
      await supabase.from('data_validation_logs').insert({
        module,
        file_name: 'bulk-delete',
        row_count: 0,
        error_count: 0,
        status: 'completed',
        processed_by: user?.id
      });

      refetchLogs();

    } catch (error) {
      console.error('Error clearing data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to clear ${module} data`,
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">
          {getTranslation('navigationItems.settings', language)}
        </h2>
        <div className="grid gap-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Upload Logs</h3>
            <div className="space-y-4 mb-8">
              {validationLogs?.length === 0 && (
                <p className="text-sm text-muted-foreground">No recent uploads</p>
              )}
              {validationLogs?.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{log.file_name}</span>
                      <Badge variant={log.status === 'completed' ? 'default' : 'destructive'}>
                        {log.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Module: {log.module}</p>
                      <p>Rows: {log.row_count}</p>
                      {log.error_count > 0 && (
                        <p className="text-destructive">Errors: {log.error_count}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(log.created_at), 'MMM d, yyyy HH:mm')}
                  </div>
                </div>
              ))}
            </div>

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

                      <div className="flex gap-2">
                        <DataUploadDialog 
                          module={module.id}
                          onDataUploaded={() => handleDataUploaded(module.id)}
                        />
                        {module.id !== 'location_hierarchy' && module.id !== 'product_hierarchy' && (
                          <Button 
                            variant="destructive" 
                            onClick={() => handleClearModuleData(module.id)}
                            className="gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            Clear All Data
                          </Button>
                        )}
                      </div>
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
