
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface Column {
  name: string;
  level: number | null;
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
  hierarchy_level: number | null;
  main_level: number | null;
  created_at?: string;
  updated_at?: string;
}

const generateHierarchyLevels = () => {
  const levels: string[] = [];
  // Main levels (1-8)
  for (let i = 1; i <= 8; i++) {
    levels.push(`${i}.00`); // Main level
    // Sub-levels (1-99 for each main level)
    for (let j = 1; j <= 99; j++) {
      levels.push(`${i}.${j.toString().padStart(2, '0')}`);
    }
  }
  return levels;
};

const HIERARCHY_LEVELS = generateHierarchyLevels();

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

  const handleLevelChange = (columnName: string, level: string) => {
    setMappings(prev => 
      prev.map(mapping => 
        mapping.name === columnName 
          ? { ...mapping, level: level === 'none' ? null : parseFloat(level) } 
          : mapping
      )
    );
  };

  const handleSave = async () => {
    try {
      // Filter out mappings without levels
      const validMappings = mappings.filter((m): m is Column & { level: number } => m.level !== null);
      
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

  const formatLevelDisplay = (level: number | null) => {
    if (level === null) return 'None';
    const levelStr = level.toFixed(2);
    const [main, sub] = levelStr.split('.');
    if (sub === '00') return `Level ${main}`;
    return `Level ${main}.${sub}`;
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
              value={mapping.level === null ? 'none' : mapping.level.toFixed(2)}
              onValueChange={(value) => handleLevelChange(mapping.name, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {HIERARCHY_LEVELS.map((level) => (
                  <SelectItem key={level} value={level}>
                    {formatLevelDisplay(parseFloat(level))}
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
