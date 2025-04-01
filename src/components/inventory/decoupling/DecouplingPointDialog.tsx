import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { fetchInventoryPlanningView } from "@/lib/inventory-planning.service";

interface DecouplingPointDialogProps {
  open: boolean;
  onClose: () => void;
  productId: string;
  locationId: string;
}

export function DecouplingPointDialog({
  open,
  onClose,
  productId,
  locationId,
}: DecouplingPointDialogProps) {
  const [point, setPoint] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadDecouplingPoint = async () => {
    setIsLoading(true);
    const data = await fetchInventoryPlanningView();
    const match = data.find(
      (item) =>
        item.product_id === productId &&
        item.location_id === locationId &&
        item.decoupling_point === true
    );
    setPoint(match);
    setIsLoading(false);
  };

  useEffect(() => {
    if (open) {
      loadDecouplingPoint();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Decoupling Point Details</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <p>Loading...</p>
        ) : point ? (
          <div className="space-y-2 text-sm">
            <p><strong>Product:</strong> {point.product_id}</p>
            <p><strong>Location:</strong> {point.location_id}</p>
            <p><strong>Lead Time (Days):</strong> {point.lead_time_days}</p>
            <p><strong>Demand Variability:</strong> {point.demand_variability}</p>
            <p><strong>Min Stock Level:</strong> {point.min_stock_level}</p>
            <p><strong>Max Stock Level:</strong> {point.max_stock_level}</p>
            <p><strong>Buffer Profile:</strong> {point.buffer_profile_id}</p>
          </div>
        ) : (
          <p>No decoupling point found.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
