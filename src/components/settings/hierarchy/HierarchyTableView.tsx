
import { Card } from "@/components/ui/card";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableRowData, ColumnHeader } from "./types";
import { HierarchyTableHeader } from "./components/HierarchyTableHeader";
import { HierarchyTable } from "./components/HierarchyTable";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface HierarchyTableViewProps {
  data: TableRowData[];
  tableName: string;
  columns: string[];
  combinedHeaders: ColumnHeader[];
}

export function HierarchyTableView({ 
  data, 
  tableName, 
  columns, 
  combinedHeaders 
}: HierarchyTableViewProps) {
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSave = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please log in to save hierarchy data",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('permanent_hierarchy_data')
        .insert({
          hierarchy_type: tableName,
          data: data,
          is_active: true,
          version: 1,
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Hierarchy data has been saved permanently",
      });
    } catch (error) {
      console.error('Error saving hierarchy data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save hierarchy data"
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Data Preview</h2>
          <p className="text-muted-foreground">
            Showing 1 to {Math.min(50, data.length)} of {data.length} rows
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSave}
          className="gap-2 hover:bg-green-100"
        >
          <Save className="h-4 w-4 text-green-600" />
          Save Permanently
        </Button>
      </div>

      <div className="space-y-4">
        <HierarchyTableHeader
          tableName={tableName}
          columns={columns}
          combinedHeaders={combinedHeaders}
        />
        <HierarchyTable
          data={data}
          columns={columns}
        />
      </div>
    </Card>
  );
}
