
import { Card } from "@/components/ui/card";
import { TableRowData, ColumnHeader } from "./types";
import { HierarchyTable } from "./components/HierarchyTable";

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
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Data Preview</h2>
          <p className="text-muted-foreground">
            Showing 1 to {Math.min(50, data.length)} of {data.length} rows
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <HierarchyTable
          data={data}
          columns={columns}
          combinedHeaders={combinedHeaders}
        />
      </div>
    </Card>
  );
}
