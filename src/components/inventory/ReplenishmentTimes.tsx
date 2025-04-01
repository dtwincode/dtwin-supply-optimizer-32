
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';
import { ReplenishmentData } from '@/types/inventory';

interface ReplenishmentTimesProps {
  data: ReplenishmentData[];
  loading?: boolean;
}

export const ReplenishmentTimes: React.FC<ReplenishmentTimesProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">Loading replenishment data...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">No replenishment data available</p>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Internal Transfer</TableHead>
              <TableHead>Replenishment Lead Time</TableHead>
              <TableHead>Total Cycle Time</TableHead>
              <TableHead>Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.sku}</TableCell>
                <TableCell>{item.source || 'N/A'}</TableCell>
                <TableCell>{item.destination || 'N/A'}</TableCell>
                <TableCell>{item.internalTransferTime ? `${item.internalTransferTime} days` : 'N/A'}</TableCell>
                <TableCell>{item.replenishmentLeadTime ? `${item.replenishmentLeadTime} days` : 'N/A'}</TableCell>
                <TableCell>{item.totalCycleTime ? `${item.totalCycleTime} days` : 'N/A'}</TableCell>
                <TableCell>{item.lastUpdated ? formatDate(item.lastUpdated) : 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

function formatDate(dateString: string): string {
  try {
    return format(new Date(dateString), 'MMM d, yyyy');
  } catch (error) {
    return dateString;
  }
}
