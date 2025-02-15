
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { HierarchyColumnMapping } from './HierarchyColumnMapping';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface HierarchyTableViewProps {
  tableName: string;
  data: any[];
  columns: string[];
}

export function HierarchyTableView({ tableName, data, columns }: HierarchyTableViewProps) {
  const { toast } = useToast();

  const handleMappingSaved = () => {
    toast({
      title: "Success",
      description: "Hierarchy mappings have been updated",
    });
  };

  const formatCellValue = (value: any): string => {
    if (value === null || value === undefined) {
      return '';
    }
    if (typeof value === 'object') {
      try {
        // Handle coordinate objects
        if (value.lat !== undefined && value.lng !== undefined) {
          return `${value.lat}, ${value.lng}`;
        }
        // Handle arrays
        if (Array.isArray(value)) {
          return value.map(item => formatCellValue(item)).join(', ');
        }
        // Handle Date objects
        if (value instanceof Date) {
          return value.toISOString();
        }
        // Handle other objects by converting to JSON string
        const stringified = JSON.stringify(value);
        return stringified === '{}' ? '' : stringified;
      } catch (error) {
        console.error('Error formatting cell value:', error);
        return '[Error formatting value]';
      }
    }
    return String(value);
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
                      {formatCellValue(row[column])}
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
