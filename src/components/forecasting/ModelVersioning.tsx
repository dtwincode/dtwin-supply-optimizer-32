
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModelVersions } from '@/hooks/useModelVersions';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Loader2, Info, Trash2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ModelVersioningProps {
  modelId: string;
}

export const ModelVersioning = ({ modelId }: ModelVersioningProps) => {
  const { versions, isLoading, createVersion, deleteVersion } = useModelVersions(modelId);
  const [selectedVersion, setSelectedVersion] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

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

  const handleDeleteVersion = async (versionId: string) => {
    await deleteVersion(versionId);
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
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Model Versions</h3>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">
                Create versions to track different configurations of your model.
                Each version maintains its own parameters and performance metrics.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
        <Button onClick={handleCreateVersion}>Create New Version</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Version</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>MAPE</TableHead>
            <TableHead className="text-right">Actions</TableHead>
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
              <TableCell className="text-right space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSelectedVersion(version);
                    setShowDetails(true);
                  }}
                >
                  View Details
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteVersion(version.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Version Details: {selectedVersion?.version}</DialogTitle>
            <DialogDescription>
              Model version information and performance metrics
            </DialogDescription>
          </DialogHeader>
          
          {selectedVersion && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Parameters</h4>
                <pre className="bg-muted p-2 rounded-md">
                  {JSON.stringify(selectedVersion.parameters, null, 2)}
                </pre>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Accuracy Metrics</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">MAPE</p>
                    <p className="text-lg font-medium">
                      {selectedVersion.accuracy_metrics.mape?.toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">MAE</p>
                    <p className="text-lg font-medium">
                      {selectedVersion.accuracy_metrics.mae?.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">RMSE</p>
                    <p className="text-lg font-medium">
                      {selectedVersion.accuracy_metrics.rmse?.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetails(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
