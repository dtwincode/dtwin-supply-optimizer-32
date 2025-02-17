
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
  tempUploadId?: string;
}

export function HierarchyTableView({ 
  data, 
  tableName, 
  columns, 
  combinedHeaders,
  tempUploadId
}: HierarchyTableViewProps) {
  const [selectedColumns, setSelectedColumns] = useState<Set<string>>(new Set(columns));

  return (
    <Card className="p-6">
      <ColumnSelector
        tableName={tableName}
        combinedHeaders={combinedHeaders}
        selectedColumns={selectedColumns}
        onSelectedColumnsChange={setSelectedColumns}
        tempUploadId={tempUploadId}
        data={data} // Pass the data to ColumnSelector
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
