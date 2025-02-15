
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { HierarchyColumnMapping } from './HierarchyColumnMapping';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";

interface ColumnHeader {
  column: string;
  sampleData: string;
}

interface HierarchyTableViewProps {
  tableName: string;
  data: any[];
  columns: string[];
  combinedHeaders?: ColumnHeader[];
}

export function HierarchyTableView({ 
  tableName, 
  data, 
  columns,
  combinedHeaders = []
}: HierarchyTableViewProps) {
  const { toast } = useToast();
  const [selectedColumns, setSelectedColumns] = useState<string[]>(columns);

  useEffect(() => {
    console.log('HierarchyTableView received columns:', columns);
    console.log('HierarchyTableView received combinedHeaders:', combinedHeaders);
    setSelectedColumns(columns);
  }, [columns, combinedHeaders]);

  const handleColumnToggle = (column: string) => {
    setSelectedColumns(prev => {
      if (prev.includes(column)) {
        return prev.filter(c => c !== column);
      } else {
        return [...prev, column];
      }
    });
  };

  const handleMappingSaved = () => {
    toast({
      title: "Success",
      description: "Hierarchy mappings have been updated",
    });
  };

  return (
    <div className="space-y-6">
      {selectedColumns.length > 0 && (
        <HierarchyColumnMapping 
          tableName={tableName}
          columns={selectedColumns}
          onMappingSaved={handleMappingSaved}
        />
      )}
      
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Select Columns to Map</h3>
        <div className="space-y-4 mb-6">
          {combinedHeaders.map(({ column }) => (
            <div key={column} className="flex items-center space-x-2">
              <Checkbox
                id={column}
                checked={selectedColumns.includes(column)}
                onCheckedChange={() => handleColumnToggle(column)}
              />
              <label
                htmlFor={column}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {column}
              </label>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-4">Data Preview</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  {combinedHeaders.map(({ column, sampleData }) => (
                    selectedColumns.includes(column) && (
                      <th key={column} className="px-4 py-2 text-left bg-muted">
                        <div className="font-semibold">{column}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Example: {sampleData}
                        </div>
                      </th>
                    )
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 5).map((row, index) => (
                  <tr key={index}>
                    {combinedHeaders.map(({ column }) => (
                      selectedColumns.includes(column) && (
                        <td key={column} className="px-4 py-2 border-t">
                          {row[column]}
                        </td>
                      )
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
}
