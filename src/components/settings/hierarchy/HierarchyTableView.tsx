
import { Card } from "@/components/ui/card";
import { TableRowData, ColumnHeader } from "./types";
import { HierarchyTable } from "./components/HierarchyTable";
import { useState } from "react";
import { ColumnSelector } from "./components/ColumnSelector";

interface HierarchyTableViewProps {
  data: TableRowData[];
  tableName: string;
  columns: string[];
  combinedHeaders: ColumnHeader[];
}

export function HierarchyTableView({ 
  data, 
  tableName, 
  columns, 
  combinedHeaders 
}: HierarchyTableViewProps) {
  const [selectedColumns, setSelectedColumns] = useState<Set<string>>(new Set(columns));

  return (
    <Card className="p-6">
      <div className="flex items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Data Preview</h2>
          <p className="text-muted-foreground">
            Showing all {data.length} rows
          </p>
        </div>
      </div>

      <ColumnSelector
        tableName={tableName}
        combinedHeaders={combinedHeaders}
        selectedColumns={selectedColumns}
        onSelectedColumnsChange={setSelectedColumns}
      />

      <div className="space-y-4">
        <HierarchyTable
          data={data}
          columns={Array.from(selectedColumns)}
          combinedHeaders={combinedHeaders}
        />
      </div>
    </Card>
  );
}
