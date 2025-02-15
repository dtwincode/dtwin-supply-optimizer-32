
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { HierarchyColumnMapping } from './HierarchyColumnMapping';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

  useEffect(() => {
    console.log('HierarchyTableView received columns:', columns);
    console.log('HierarchyTableView received combinedHeaders:', combinedHeaders);
  }, [columns, combinedHeaders]);

  const handleMappingSaved = () => {
    toast({
      title: "Success",
      description: "Hierarchy mappings have been updated",
    });
  };

  return (
    <div className="space-y-6">
      <HierarchyColumnMapping 
        tableName={tableName}
        columns={columns}
        onMappingSaved={handleMappingSaved}
      />
      
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Data Preview</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {combinedHeaders.map(({ column, sampleData }) => (
                  <th key={column} className="px-4 py-2 text-left bg-muted">
                    <div className="font-semibold">{column}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Example: {sampleData}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 5).map((row, index) => (
                <tr key={index}>
                  {combinedHeaders.map(({ column }) => (
                    <td key={column} className="px-4 py-2 border-t">
                      {row[column]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
