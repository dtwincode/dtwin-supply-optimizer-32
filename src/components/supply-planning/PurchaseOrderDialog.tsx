
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';

interface PurchaseOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  purchaseOrder: any | null;
  onSuccess: () => void;
}

const formSchema = z.object({
  po_number: z.string().min(1, { message: "PO number is required" }),
  sku: z.string().min(1, { message: "SKU is required" }),
  quantity: z.coerce.number().positive({ message: "Quantity must be positive" }),
  supplier: z.string().optional(),
  status: z.enum(['planned', 'ordered', 'confirmed', 'shipped', 'received']),
  notes: z.string().optional(),
  expected_delivery_date: z.date().optional(),
});

export const PurchaseOrderDialog = ({
  open,
  onOpenChange,
  purchaseOrder,
  onSuccess
}: PurchaseOrderDialogProps) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      po_number: '',
      sku: '',
      quantity: 0,
      supplier: '',
      status: 'planned' as const,
      notes: '',
      expected_delivery_date: undefined,
    },
  });

  useEffect(() => {
    if (purchaseOrder) {
      form.reset({
        po_number: purchaseOrder.po_number,
        sku: purchaseOrder.sku,
        quantity: purchaseOrder.quantity,
        supplier: purchaseOrder.supplier || '',
        status: purchaseOrder.status as any,
        notes: purchaseOrder.notes || '',
        expected_delivery_date: purchaseOrder.expected_delivery_date 
          ? new Date(purchaseOrder.expected_delivery_date) 
          : undefined,
      });
    } else {
      form.reset({
        po_number: `PO-${Date.now()}`,
        sku: '',
        quantity: 0,
        supplier: '',
        status: 'planned',
        notes: '',
        expected_delivery_date: undefined,
      });
    }
  }, [purchaseOrder, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (purchaseOrder) {
        // Update existing purchase order
        const { error } = await supabase
          .from('purchase_orders')
          .update({
            po_number: values.po_number,
            sku: values.sku,
            quantity: values.quantity,
            supplier: values.supplier || null,
            status: values.status,
            notes: values.notes || null,
            expected_delivery_date: values.expected_delivery_date?.toISOString() || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', purchaseOrder.id);

        if (error) throw error;

        toast({
          title: getTranslation("supplyPlanning.notifications.poUpdated", language),
          description: getTranslation("supplyPlanning.notifications.poUpdatedDesc", language),
        });
      } else {
        // Create new purchase order
        const { error } = await supabase
          .from('purchase_orders')
          .insert({
            po_number: values.po_number,
            sku: values.sku,
            quantity: values.quantity,
            supplier: values.supplier || null,
            status: values.status,
            notes: values.notes || null,
            order_date: new Date().toISOString(),
            expected_delivery_date: values.expected_delivery_date?.toISOString() || null,
          });

        if (error) throw error;

        toast({
          title: getTranslation("supplyPlanning.notifications.poCreated", language),
          description: getTranslation("supplyPlanning.notifications.poCreatedDesc", language),
        });
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving purchase order:', error);
      toast({
        title: getTranslation("supplyPlanning.notifications.poError", language),
        description: getTranslation("supplyPlanning.notifications.poErrorDesc", language),
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {purchaseOrder 
              ? getTranslation("supplyPlanning.editPurchaseOrder", language)
              : getTranslation("supplyPlanning.createPurchaseOrder", language)
            }
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="po_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{getTranslation("supplyPlanning.poNumber", language)}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{getTranslation("inventory.sku", language)}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{getTranslation("supplyPlanning.quantity", language)}</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supplier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{getTranslation("supplyPlanning.supplier", language)}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{getTranslation("supplyPlanning.status", language)}</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={getTranslation("supplyPlanning.selectStatus", language)} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="planned">
                          {getTranslation("supplyPlanning.status.planned", language)}
                        </SelectItem>
                        <SelectItem value="ordered">
                          {getTranslation("supplyPlanning.status.ordered", language)}
                        </SelectItem>
                        <SelectItem value="confirmed">
                          {getTranslation("supplyPlanning.status.confirmed", language)}
                        </SelectItem>
                        <SelectItem value="shipped">
                          {getTranslation("supplyPlanning.status.shipped", language)}
                        </SelectItem>
                        <SelectItem value="received">
                          {getTranslation("supplyPlanning.status.received", language)}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expected_delivery_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{getTranslation("supplyPlanning.deliveryDate", language)}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>{getTranslation("supplyPlanning.selectDate", language)}</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{getTranslation("supplyPlanning.notes", language)}</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder={getTranslation("supplyPlanning.notesPlaceholder", language)}
                      className="min-h-[80px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">
                {purchaseOrder 
                  ? getTranslation("common.update", language)
                  : getTranslation("common.create", language)
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
