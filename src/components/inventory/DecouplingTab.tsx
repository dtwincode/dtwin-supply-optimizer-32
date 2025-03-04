
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { NetworkDecouplingMap } from "./NetworkDecouplingMap";
import { DecouplingPointDialog } from "./DecouplingPointDialog";
import { useDecouplingPoints } from "@/hooks/useDecouplingPoints";
import { PlusCircle, Edit, Trash2 } from "lucide-react"; // Using Lucide icons instead of Radix
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { DecouplingNetwork, DecouplingPoint } from "@/types/inventory/decouplingTypes";

export const DecouplingTab = () => {
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");
  const [selectedPoint, setSelectedPoint] = useState<DecouplingPoint | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const { 
    network, 
    points, 
    loading, 
    error, 
    addDecouplingPoint, 
    updateDecouplingPoint, 
    deleteDecouplingPoint 
  } = useDecouplingPoints();

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load decoupling points",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleAddSuccess = () => {
    toast({
      title: "Success",
      description: "Decoupling point added successfully",
    });
  };

  const handleUpdateSuccess = () => {
    toast({
      title: "Success",
      description: "Decoupling point updated successfully",
    });
    setSelectedPoint(null);
  };

  const handleDeleteConfirm = async () => {
    if (selectedPoint) {
      try {
        await deleteDecouplingPoint(selectedPoint.id);
        toast({
          title: "Success",
          description: "Decoupling point deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete decoupling point",
          variant: "destructive",
        });
      }
      setIsDeleteDialogOpen(false);
      setSelectedPoint(null);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading decoupling points...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Network Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <NetworkDecouplingMap network={network} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Decoupling Points</CardTitle>
          <Button onClick={() => setSelectedLocationId("new")} className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Decoupling Point
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Buffer Profile</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {points.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No decoupling points configured
                  </TableCell>
                </TableRow>
              ) : (
                points.map((point) => (
                  <TableRow key={point.id}>
                    <TableCell>{point.locationId}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {point.type.replace("-", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>{point.bufferProfileId}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedPoint(point)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedPoint(point);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedLocationId && (
        <DecouplingPointDialog
          locationId={selectedLocationId}
          onSuccess={handleAddSuccess}
          open={!!selectedLocationId}
          onOpenChange={(open) => {
            if (!open) setSelectedLocationId("");
          }}
        />
      )}

      {selectedPoint && (
        <DecouplingPointDialog
          locationId={selectedPoint.locationId}
          existingPoint={selectedPoint}
          onSuccess={handleUpdateSuccess}
          open={!!selectedPoint}
          onOpenChange={(open) => {
            if (!open) setSelectedPoint(null);
          }}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              decoupling point.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
