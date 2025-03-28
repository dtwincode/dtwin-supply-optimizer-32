
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { format } from 'date-fns';

type PurchaseOrder = {
  id?: string;
  po_number: string;
  sku: string;
  quantity: number;
  status: string;
  supplier?: string;
  order_date?: string;
  expected_delivery_date?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
};

type PurchaseOrderDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  purchaseOrder?: PurchaseOrder | null;
  onSuccess: () => void;
};

export const PurchaseOrderDialog = ({
  open,
  onOpenChange,
  purchaseOrder,
  onSuccess,
}: PurchaseOrderDialogProps) => {
  const { language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<PurchaseOrder>({
    po_number: '',
    sku: '',
    quantity: 0,
    status: 'planned',
    supplier: '',
    expected_delivery_date: format(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    notes: '',
  });

  useEffect(() => {
    if (purchaseOrder) {
      setFormData({
        ...purchaseOrder,
        expected_delivery_date: purchaseOrder.expected_delivery_date 
          ? format(new Date(purchaseOrder.expected_delivery_date), 'yyyy-MM-dd')
          : format(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      });
    } else {
      setFormData({
        po_number: '',
        sku: '',
        quantity: 0,
        status: 'planned',
        supplier: '',
        expected_delivery_date: format(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
        notes: '',
      });
    }
  }, [purchaseOrder, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Ensure required fields are present
      if (!formData.po_number || !formData.sku || formData.quantity <= 0) {
        toast.error(getTranslation("common.validation.requiredFields", language));
        setIsSubmitting(false);
        return;
      }
      
      const orderData = {
        ...formData,
        order_date: formData.order_date || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      let result;

      if (purchaseOrder?.id) {
        // Update existing order
        result = await supabase
          .from('purchase_orders')
          .update({
            po_number: orderData.po_number,
            sku: orderData.sku,
            quantity: orderData.quantity,
            status: orderData.status,
            supplier: orderData.supplier,
            order_date: orderData.order_date,
            expected_delivery_date: orderData.expected_delivery_date,
            notes: orderData.notes,
            updated_at: orderData.updated_at
          })
          .eq('id', purchaseOrder.id);
      } else {
        // Create new order
        result = await supabase
          .from('purchase_orders')
          .insert({
            po_number: orderData.po_number,
            sku: orderData.sku,
            quantity: orderData.quantity,
            status: orderData.status,
            supplier: orderData.supplier,
            order_date: orderData.order_date,
            expected_delivery_date: orderData.expected_delivery_date,
            notes: orderData.notes
          });
      }

      if (result.error) {
        throw result.error;
      }

      toast.success(
        purchaseOrder?.id
          ? getTranslation("supplyPlanning.poUpdated", language)
          : getTranslation("supplyPlanning.poCreated", language)
      );
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving purchase order:', error);
      toast.error(getTranslation("common.error", language));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {purchaseOrder?.id
              ? getTranslation("supplyPlanning.editPurchaseOrder", language)
              : getTranslation("supplyPlanning.createPurchaseOrder", language)}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="po_number">
                {getTranslation("supplyPlanning.poNumber", language)}
              </Label>
              <Input
                id="po_number"
                name="po_number"
                value={formData.po_number}
                onChange={handleChange}
                placeholder="PO-00001"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sku">
                {getTranslation("common.inventory.sku", language)}
              </Label>
              <Input
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="SKU001"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
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
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">
                {getTranslation("supplyPlanning.status", language)}
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={getTranslation("supplyPlanning.selectStatus", language)} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">{getTranslation("supplyPlanning.statusTypes.planned", language)}</SelectItem>
                  <SelectItem value="ordered">{getTranslation("supplyPlanning.statusTypes.ordered", language)}</SelectItem>
                  <SelectItem value="confirmed">{getTranslation("supplyPlanning.statusTypes.confirmed", language)}</SelectItem>
                  <SelectItem value="shipped">{getTranslation("supplyPlanning.statusTypes.shipped", language)}</SelectItem>
                  <SelectItem value="received">{getTranslation("supplyPlanning.statusTypes.received", language)}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supplier">
                {getTranslation("supplyPlanning.supplier", language)}
              </Label>
              <Input
                id="supplier"
                name="supplier"
                value={formData.supplier || ''}
                onChange={handleChange}
                placeholder={getTranslation("supplyPlanning.supplierPlaceholder", language)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expected_delivery_date">
                {getTranslation("supplyPlanning.deliveryDate", language)}
              </Label>
              <Input
                id="expected_delivery_date"
                name="expected_delivery_date"
                type="date"
                value={formData.expected_delivery_date}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">
              {getTranslation("common.notes", language)}
            </Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes || ''}
              onChange={handleChange}
              placeholder={getTranslation("supplyPlanning.notesPlaceholder", language)}
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {getTranslation("common.cancel", language)}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? getTranslation("common.saving", language)
                : getTranslation("common.save", language)}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
