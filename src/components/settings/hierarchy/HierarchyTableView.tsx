
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { HierarchyColumnMapping } from './HierarchyColumnMapping';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface HierarchyTableViewProps {
  tableName: string;
  data: any[];
}

export function HierarchyTableView({ tableName, data }: HierarchyTableViewProps) {
  const [columns, setColumns] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (data && data.length > 0) {
      setColumns(Object.keys(data[0]));
    }
  }, [data]);

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
                {columns.map((column) => (
                  <th key={column} className="px-4 py-2 text-left bg-muted">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 5).map((row, index) => (
                <tr key={index}>
                  {columns.map((column) => (
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
