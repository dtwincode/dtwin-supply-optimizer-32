
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import type { Json } from "@/integrations/supabase/types";

interface ColumnHeader {
  header: string;
  level: number | null;
}

interface ColumnSelectorProps {
  tableName: string;
  combinedHeaders: ColumnHeader[];
  selectedColumns: Set<string>;
  onSelectedColumnsChange: (columns: Set<string>) => void;
  tempUploadId?: string | null;
  data?: any[];
  onSaveSuccess?: () => void;
  hierarchyType: string;
}

export function ColumnSelector({
  tableName,
  combinedHeaders,
  selectedColumns,
  onSelectedColumnsChange,
  tempUploadId,
  data,
  onSaveSuccess,
  hierarchyType
}: ColumnSelectorProps) {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleToggle = (column: string) => {
    const newColumns = new Set(selectedColumns);
    if (newColumns.has(column)) {
      newColumns.delete(column);
    } else {
      newColumns.add(column);
    }
    onSelectedColumnsChange(newColumns);
  };

  const handleSavePermanently = async () => {
    if (isSaving) {
      return;
    }

    if (!data || !tempUploadId || !user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No data available to save",
      });
      return;
    }

    setIsSaving(true);

    try {
      const timestamp = new Date().getTime().toString();
      const fileName = `${hierarchyType}_${timestamp}`;
      const originalName = data[0]?.original_name?.toString() || `${hierarchyType}.csv`;

      // Table removed - hierarchy files functionality disabled
      toast({
        variant: "destructive",
        title: "Feature Disabled",
        description: "Hierarchy files table was removed. Unable to save file.",
      });
    } catch (error) {
      console.error('Error saving permanent data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save data permanently"
      });
    } finally {
      setTimeout(() => {
        setIsSaving(false);
      }, 1000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Column Selection</h3>
          <Button 
            onClick={handleSavePermanently}
            disabled={selectedColumns.size === 0 || isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Permanently'}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Select the columns you want to include in the hierarchy
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {combinedHeaders.map(({ header }) => (
          <div key={header} className="flex items-center justify-between space-x-2">
            <Label className="flex flex-col">
              <span>{header}</span>
            </Label>
            <Switch
              checked={selectedColumns.has(header)}
              onCheckedChange={() => handleToggle(header)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
