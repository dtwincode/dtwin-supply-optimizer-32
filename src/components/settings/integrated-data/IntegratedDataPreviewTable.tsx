
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IntegratedData } from "./types";

interface IntegratedDataPreviewTableProps {
  data: IntegratedData[];
  isLoading: boolean;
  validationStatus: 'valid' | 'needs_review' | null;
}

export function IntegratedDataPreviewTable({ 
  data, 
  isLoading, 
  validationStatus 
}: IntegratedDataPreviewTableProps) {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data.length) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No integrated data available
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Actual Value</TableHead>
            <TableHead>Validation Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={row.id || index}>
              <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
              <TableCell>{row.sku}</TableCell>
              <TableCell>{row.actual_value}</TableCell>
              <TableCell>{row.validation_status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
