
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
          Preview your integrated data from all sources.
        </p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>1</TableCell>
              <TableCell>Product Data</TableCell>
              <TableCell>Hierarchy</TableCell>
              <TableCell>Integrated</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2</TableCell>
              <TableCell>Location Data</TableCell>
              <TableCell>Hierarchy</TableCell>
              <TableCell>Integrated</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>3</TableCell>
              <TableCell>Sales Data</TableCell>
              <TableCell>Historical</TableCell>
              <TableCell>Integrated</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default IntegratedDataPreview;
