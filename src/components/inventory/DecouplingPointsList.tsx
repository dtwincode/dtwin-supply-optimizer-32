
import { useState, useEffect } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useDecouplingPoints } from "@/hooks/useDecouplingPoints";
import { DecouplingPoint } from "@/types/inventory/decouplingTypes";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { SkeletonTable } from "@/components/ui/skeleton-table";
import { RefreshCw, Edit, Trash } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";
import { DecouplingPointDialog } from "./DecouplingPointDialog";

export const DecouplingPointsList = () => {
  const { decouplingPoints, isLoading, deleteDecouplingPoint, refreshDecouplingPoints } = useDecouplingPoints();
  const [selectedPoint, setSelectedPoint] = useState<DecouplingPoint | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { t } = useI18n();

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
        <h2 className="text-xl font-semibold">{t("common.inventory.decouplingPoints")}</h2>
        <Button size="sm" variant="outline" onClick={() => refreshDecouplingPoints()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          {t("common.inventory.refresh")}
        </Button>
      </div>

      {decouplingPoints.length === 0 ? (
        <div className="text-center p-8 border rounded-lg">
          <p className="text-muted-foreground">
            {t("common.inventory.noDecouplingPoints")}
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("common.inventory.locationId")}</TableHead>
              <TableHead>{t("common.inventory.type")}</TableHead>
              <TableHead>{t("common.inventory.description")}</TableHead>
              <TableHead className="text-right">{t("common.inventory.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {decouplingPoints.map((point) => (
              <TableRow key={point.id}>
                <TableCell>{point.locationId}</TableCell>
                <TableCell>{t(`common.inventory.${point.type}DecouplingPoint`)}</TableCell>
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
            <AlertDialogTitle>{t("common.delete")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("common.inventory.confirmDelete")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {selectedPoint && (
        <DecouplingPointDialog
          existingPoint={selectedPoint}
          locationId={selectedPoint.locationId}
          onSuccess={handleEditSuccess}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
        />
      )}
    </div>
  );
};
