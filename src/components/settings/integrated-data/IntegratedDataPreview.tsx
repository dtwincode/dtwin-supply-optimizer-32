
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

const IntegratedDataPreview = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Integrated Data Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Preview integrated data sources and their relationships.
        </p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data Source</TableHead>
              <TableHead>Last Update</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Records</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Product Hierarchy</TableCell>
              <TableCell>2023-06-15</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>1,245</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Location Hierarchy</TableCell>
              <TableCell>2023-06-10</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>89</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Historical Sales</TableCell>
              <TableCell>2023-06-01</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>12,567</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default IntegratedDataPreview;
