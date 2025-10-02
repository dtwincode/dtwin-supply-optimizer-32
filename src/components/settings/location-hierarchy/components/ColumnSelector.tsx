
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface Header {
  header: string;
  level: number | null;
}

interface ColumnSelectorProps {
  tableName: string;
  combinedHeaders: Header[];
  selectedColumns: Set<string>;
  onSelectedColumnsChange: (columns: Set<string>) => void;
  tempUploadId: string;
  data: any[];
  onSaveSuccess: () => void;
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
  const { user } = useAuth();
  const { toast } = useToast();

  const handleColumnToggle = (header: string) => {
    const newSelectedColumns = new Set(selectedColumns);
    if (newSelectedColumns.has(header)) {
      newSelectedColumns.delete(header);
    } else {
      newSelectedColumns.add(header);
    }
    onSelectedColumnsChange(newSelectedColumns);
  };

  const handleSave = async () => {
    if (!user) return;
    
    try {
      setIsSaving(true);

      // Table removed - hierarchy files functionality disabled
      toast({
        variant: "destructive",
        title: "Feature Disabled",
        description: "Hierarchy files table was removed. Unable to save file.",
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Select Columns to Include</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {combinedHeaders.map(({ header }) => (
            <div key={header} className="flex items-center space-x-2">
              <Checkbox
                id={header}
                checked={selectedColumns.has(header)}
                onCheckedChange={() => handleColumnToggle(header)}
              />
              <label
                htmlFor={header}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {header}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <Button 
        onClick={handleSave} 
        disabled={isSaving || selectedColumns.size === 0}
      >
        {isSaving ? "Saving..." : "Save Permanently"}
      </Button>
    </div>
  );
}
