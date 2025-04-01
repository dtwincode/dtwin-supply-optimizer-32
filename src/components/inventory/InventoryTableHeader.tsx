
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function InventoryTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>SKU</TableHead>
        <TableHead>Name</TableHead>
        <TableHead>On Hand</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Buffer</TableHead>
        <TableHead>Location</TableHead>
        <TableHead>Product Family</TableHead>
        <TableHead>Lead Time</TableHead>
        <TableHead>Variability</TableHead>
        <TableHead>Criticality</TableHead>
        <TableHead>Score</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}
