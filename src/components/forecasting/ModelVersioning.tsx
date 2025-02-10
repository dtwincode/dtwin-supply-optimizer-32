
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useModelVersions } from '@/hooks/useModelVersions';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

interface ModelVersioningProps {
  modelId: string;
}

export const ModelVersioning = ({ modelId }: ModelVersioningProps) => {
  const { versions, isLoading, createVersion } = useModelVersions(modelId);

  const handleCreateVersion = async () => {
    await createVersion({
      model_name: modelId,
      version: `v${versions.length + 1}`,
      parameters: {},
      accuracy_metrics: {
        mape: 0,
        mae: 0,
        rmse: 0
      },
      metadata: {},
      validation_metrics: {},
      training_data_snapshot: {},
      is_active: false,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Model Versions</h3>
        <Button onClick={handleCreateVersion}>Create New Version</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Version</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>MAPE</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {versions.map((version) => (
            <TableRow key={version.id}>
              <TableCell>{version.version}</TableCell>
              <TableCell>
                {format(new Date(version.created_at), 'MMM dd, yyyy HH:mm')}
              </TableCell>
              <TableCell>
                <Badge variant={version.is_active ? "default" : "secondary"}>
                  {version.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell>
                {version.accuracy_metrics.mape?.toFixed(2)}%
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
