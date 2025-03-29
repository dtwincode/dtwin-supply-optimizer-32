
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ReplenishmentData } from "@/types/inventory";

interface ReplenishmentTimesProps {
  data: ReplenishmentData[];
}

export const ReplenishmentTimes = ({ data }: ReplenishmentTimesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Replenishment Times</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Internal Transfer (days)</TableHead>
              <TableHead>Lead Time (days)</TableHead>
              <TableHead>Total Cycle Time (days)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.sku}</TableCell>
                <TableCell>{item.lastUpdated ? new Date(item.lastUpdated).toLocaleDateString() : "N/A"}</TableCell>
                <TableCell>{item.locationFrom || item.source || "N/A"}</TableCell>
                <TableCell>{item.locationTo || item.destination || "N/A"}</TableCell>
                <TableCell>{item.internalTransferTime || "N/A"}</TableCell>
                <TableCell>{item.replenishmentLeadTime || "N/A"}</TableCell>
                <TableCell>{item.totalCycleTime || "N/A"}</TableCell>
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">No replenishment data available</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
