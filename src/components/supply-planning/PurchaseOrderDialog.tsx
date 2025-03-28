
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { format } from "date-fns";

interface PurchaseOrderData {
  id?: string;
  po_number?: string;
  sku: string;
  quantity: number;
  status: string;
  supplier?: string;
  expected_delivery_date?: string;
  notes?: string;
}

interface PurchaseOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  purchaseOrder?: PurchaseOrderData | null;
  onSuccess?: () => void;
}

export function PurchaseOrderDialog({
  open,
  onOpenChange,
  purchaseOrder,
  onSuccess,
}: PurchaseOrderDialogProps) {
  const { language } = useLanguage();
  const { toast } = useToast();
  const isEdit = !!purchaseOrder?.id;
  
  const [formData, setFormData] = useState<PurchaseOrderData>(
    purchaseOrder || {
      sku: "",
      quantity: 0,
      status: "planned",
    }
  );
  const [deliveryDate, setDeliveryDate] = useState<string>(
    purchaseOrder?.expected_delivery_date
      ? format(new Date(purchaseOrder.expected_delivery_date), "yyyy-MM-dd")
      : ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number(value) : value,
    }));
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      status: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const poData = {
        ...formData,
        expected_delivery_date: deliveryDate ? new Date(deliveryDate).toISOString() : null,
        updated_at: new Date().toISOString(),
      };

      // For new POs, add creation metadata
      if (!isEdit) {
        poData.po_number = `PO-${Date.now()}`;
        poData.status = formData.status || "planned";
        Object.assign(poData, {
          order_date: new Date().toISOString(),
          created_at: new Date().toISOString(),
        });
      }

      const { error } = isEdit
        ? await supabase
            .from("purchase_orders")
            .update(poData)
            .eq("id", purchaseOrder.id!)
        : await supabase.from("purchase_orders").insert(poData);

      if (error) throw error;

      toast({
        title: isEdit ? "Purchase Order Updated" : "Purchase Order Created",
        description: isEdit
          ? `PO ${purchaseOrder.po_number} has been updated`
          : "A new purchase order has been created",
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error saving purchase order:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "There was a problem saving your purchase order. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit
              ? getTranslation("supplyPlanning.editPurchaseOrder", language)
              : getTranslation("supplyPlanning.createPurchaseOrder", language)}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sku">
              {getTranslation("common.inventory.sku", language)}
            </Label>
            <Input
              id="sku"
              name="sku"
              value={formData.sku}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">
              {getTranslation("supplyPlanning.quantity", language)}
            </Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="supplier">
              {getTranslation("supplyPlanning.supplier", language)}
            </Label>
            <Input
              id="supplier"
              name="supplier"
              value={formData.supplier || ""}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">
              {getTranslation("supplyPlanning.status", language)}
            </Label>
            <Select
              value={formData.status}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planned">
                  {getTranslation(
                    "supplyPlanning.statusTypes.planned",
                    language
                  )}
                </SelectItem>
                <SelectItem value="ordered">
                  {getTranslation(
                    "supplyPlanning.statusTypes.ordered",
                    language
                  )}
                </SelectItem>
                <SelectItem value="confirmed">
                  {getTranslation(
                    "supplyPlanning.statusTypes.confirmed",
                    language
                  )}
                </SelectItem>
                <SelectItem value="shipped">
                  {getTranslation(
                    "supplyPlanning.statusTypes.shipped",
                    language
                  )}
                </SelectItem>
                <SelectItem value="received">
                  {getTranslation(
                    "supplyPlanning.statusTypes.received",
                    language
                  )}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expected_delivery_date">
              {getTranslation("supplyPlanning.deliveryDate", language)}
            </Label>
            <Input
              id="expected_delivery_date"
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">
              {getTranslation("supplyPlanning.notes", language) || "Notes"}
            </Label>
            <Input
              id="notes"
              name="notes"
              value={formData.notes || ""}
              onChange={handleInputChange}
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? getTranslation("common.saving", language)
                : isEdit
                ? getTranslation("common.save", language)
                : getTranslation("common.create", language)}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
