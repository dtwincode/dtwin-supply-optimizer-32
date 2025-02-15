
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

type HierarchyLevel = 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6' | 'L7' | 'L8';

interface Column {
  name: string;
  level: HierarchyLevel | null;
}

interface HierarchyColumnMappingProps {
  tableName: string;
  columns: string[];
  onMappingSaved: () => void;
}

interface HierarchyMapping {
  id: string;
  table_name: string;
  column_name: string;
  hierarchy_level: HierarchyLevel | null;
  created_at?: string;
  updated_at?: string;
}

const HIERARCHY_LEVELS: HierarchyLevel[] = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8'];

export function HierarchyColumnMapping({ tableName, columns, onMappingSaved }: HierarchyColumnMappingProps) {
  const [mappings, setMappings] = useState<Column[]>([]);
  const { toast } = useToast();

  // Fetch existing mappings
  const { data: existingMappings } = useQuery({
    queryKey: ['hierarchyMappings', tableName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hierarchy_column_mappings')
        .select('*')
        .eq('table_name', tableName);

      if (error) throw error;
      return data as HierarchyMapping[];
    }
  });

  useEffect(() => {
    if (columns) {
      const initialMappings = columns.map(col => ({
        name: col,
        level: existingMappings?.find(m => m.column_name === col)?.hierarchy_level || null
      }));
      setMappings(initialMappings);
    }
  }, [columns, existingMappings]);

  const handleLevelChange = (columnName: string, level: HierarchyLevel | '') => {
    setMappings(prev => 
      prev.map(mapping => 
        mapping.name === columnName 
          ? { ...mapping, level: level || null } 
          : mapping
      )
    );
  };

  const handleSave = async () => {
    try {
      // Filter out mappings without levels
      const validMappings = mappings.filter((m): m is Column & { level: HierarchyLevel } => m.level !== null);
      
      // Delete existing mappings for this table
      await supabase
        .from('hierarchy_column_mappings')
        .delete()
        .eq('table_name', tableName);

      // Insert new mappings
      const { error } = await supabase
        .from('hierarchy_column_mappings')
        .insert(
          validMappings.map(m => ({
            table_name: tableName,
            column_name: m.name,
            hierarchy_level: m.level
          }))
        );

      if (error) throw error;

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
            <Select
              value={mapping.level || ''}
              onValueChange={(value) => handleLevelChange(mapping.name, value as HierarchyLevel | '')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {HIERARCHY_LEVELS.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <Button onClick={handleSave}>Save Mappings</Button>
      </div>
    </Card>
  );
}
