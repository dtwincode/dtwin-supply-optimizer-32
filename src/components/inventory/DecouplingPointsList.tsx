
import { useState, useEffect } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useDecouplingPoints } from "@/hooks/useDecouplingPoints";
import { DecouplingPoint } from "@/types/inventory/decouplingTypes";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { SkeletonTable } from "@/components/ui/skeleton";
import { RefreshCw, Edit, Trash } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { DecouplingPointDialog } from "./DecouplingPointDialog";

export const DecouplingPointsList = () => {
  const { decouplingPoints, isLoading, deleteDecouplingPoint, refreshDecouplingPoints } = useDecouplingPoints();
  const [selectedPoint, setSelectedPoint] = useState<DecouplingPoint | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    refreshDecouplingPoints();
  }, [refreshDecouplingPoints]);

  const handleEdit = (point: DecouplingPoint) => {
    setSelectedPoint(point);
    setEditDialogOpen(true);
  };

  const handleDelete = (point: DecouplingPoint) => {
    setSelectedPoint(point);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedPoint) {
      await deleteDecouplingPoint(selectedPoint.id);
      setDeleteDialogOpen(false);
    }
  };

  const handleEditSuccess = () => {
    setEditDialogOpen(false);
  };

  if (isLoading) {
    return <SkeletonTable rows={5} columns={5} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{getTranslation("common.inventory.decouplingPoints", language)}</h2>
        <Button size="sm" variant="outline" onClick={() => refreshDecouplingPoints()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          {getTranslation("common.inventory.refresh", language)}
        </Button>
      </div>

      {decouplingPoints.length === 0 ? (
        <div className="text-center p-8 border rounded-lg">
          <p className="text-muted-foreground">
            {getTranslation("common.inventory.noDecouplingPoints", language)}
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{getTranslation("common.inventory.locationId", language)}</TableHead>
              <TableHead>{getTranslation("common.inventory.type", language)}</TableHead>
              <TableHead>{getTranslation("common.inventory.description", language)}</TableHead>
              <TableHead className="text-right">{getTranslation("common.inventory.actions", language)}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {decouplingPoints.map((point) => (
              <TableRow key={point.id}>
                <TableCell>{point.locationId}</TableCell>
                <TableCell>{getTranslation(`common.inventory.${point.type}DecouplingPoint`, language)}</TableCell>
                <TableCell>{point.description || "-"}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(point)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(point)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{getTranslation("common.delete", language)}</AlertDialogTitle>
            <AlertDialogDescription>
              {getTranslation("common.inventory.confirmDelete", language)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{getTranslation("common.cancel", language)}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              {getTranslation("common.delete", language)}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {selectedPoint && (
        <DecouplingPointDialog
          pointData={selectedPoint}
          locationId={selectedPoint.locationId}
          onSuccess={handleEditSuccess}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
        />
      )}
    </div>
  );
};
