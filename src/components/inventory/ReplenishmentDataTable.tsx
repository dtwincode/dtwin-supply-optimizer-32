
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReplenishmentData } from '@/types/inventory';

interface ReplenishmentDataTableProps {
  data: ReplenishmentData[];
  loading?: boolean;
}

export function ReplenishmentDataTable({ data, loading = false }: ReplenishmentDataTableProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Replenishment Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">Loading replenishment data...</div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Replenishment Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">No replenishment data available</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Replenishment Data</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expected Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.sku}</TableCell>
                <TableCell>{item.source}</TableCell>
                <TableCell>{item.destination}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>
                  <StatusBadge status={item.status} />
                </TableCell>
                <TableCell>
                  {item.expectedDate ? new Date(item.expectedDate).toLocaleDateString() : 'N/A'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
  
  switch (status?.toLowerCase()) {
    case 'in transit':
      variant = "default";
      break;
    case 'delayed':
      variant = "destructive";
      break;
    case 'delivered':
      variant = "secondary";
      break;
    default:
      variant = "outline";
  }
  
  return <Badge variant={variant}>{status || 'Unknown'}</Badge>;
}
