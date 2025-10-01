import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface Column {
  name: string;
  level: number | null;
}

interface HierarchyColumnMappingProps {
  tableName: string;
  columns: string[];
  onMappingSaved: () => void;
}

export function HierarchyColumnMapping({ tableName, columns, onMappingSaved }: HierarchyColumnMappingProps) {
  const [mappings, setMappings] = useState<Column[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (columns) {
      const initialMappings = columns.map(col => ({
        name: col,
        level: null
      }));
      setMappings(initialMappings);
    }
  }, [columns]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Save to local storage for now
      localStorage.setItem(`hierarchy_mappings_${tableName}`, JSON.stringify(mappings));

      toast({
        title: "Success",
        description: "Column mappings saved successfully",
      });

      onMappingSaved();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save column mappings",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Map Hierarchy Levels</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="font-medium">Column</div>
          <div className="font-medium">Hierarchy Level</div>
        </div>
        {mappings.map((mapping) => (
          <div key={mapping.name} className="grid grid-cols-2 gap-4 items-center">
            <div>{mapping.name}</div>
            <div className="text-muted-foreground">Not configured</div>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <Button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSaving ? 'Saving...' : 'Save Mappings'}
        </Button>
      </div>
    </Card>
  );
}
