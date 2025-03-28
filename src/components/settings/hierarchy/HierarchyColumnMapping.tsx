import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  const [selectedColumns, setSelectedColumns] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

      // Initialize selected columns from existing mappings
      if (existingMappings) {
        const selectedSet = new Set(existingMappings.map(m => m.column_name));
        setSelectedColumns(selectedSet);
      }
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
    
    // Add column to selected columns when level is set
    if (level !== 'none') {
      setSelectedColumns(prev => new Set([...prev, columnName]));
    } else {
      setSelectedColumns(prev => {
        const next = new Set(prev);
        next.delete(columnName);
        return next;
      });
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      // Filter out mappings that are both valid and selected
      const validMappings = mappings.filter((m): m is Column & { level: number } => 
        m.level !== null && selectedColumns.has(m.name)
      );
      
      // Delete ALL existing mappings for this table
      await supabase
        .from('hierarchy_column_mappings')
        .delete()
        .eq('table_name', tableName);

      if (validMappings.length > 0) {
        // Insert new mappings only for selected columns
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
      }

      await queryClient.invalidateQueries({
        queryKey: ['hierarchyMappings', tableName]
      });

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
              disabled={isSaving}
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
        <Button 
          onClick={handleSave}
          disabled={selectedColumns.size === 0 || isSaving}
          className="flex items-center gap-2"
        >
          {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSaving ? 'Saving...' : 'Save Mappings'}
        </Button>
      </div>
    </Card>
  );
}
