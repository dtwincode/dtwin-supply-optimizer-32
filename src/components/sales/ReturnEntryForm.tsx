
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { calculateReturnImpact } from "@/utils/salesUtils";
import { useToast } from "@/hooks/use-toast";
import type { ProductReturn } from "@/types/sales";

const returnSchema = z.object({
  productSku: z.string().min(1, { message: "SKU is required" }),
  quantity: z.coerce.number().positive({ message: "Quantity must be positive" }),
  returnDate: z.string().min(1, { message: "Return date is required" }),
  reason: z.string().min(1, { message: "Reason is required" }),
  condition: z.enum(["new", "damaged", "expired"], { 
    errorMap: () => ({ message: "Please select a valid condition" })
  }),
  region: z.string().min(1, { message: "Region is required" }),
  city: z.string().optional(),
});

type ReturnFormValues = z.infer<typeof returnSchema>;

interface ReturnEntryFormProps {
  onSubmit: (data: ProductReturn) => void;
  onCancel: () => void;
}

export const ReturnEntryForm = ({ onSubmit, onCancel }: ReturnEntryFormProps) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ReturnFormValues>({
    resolver: zodResolver(returnSchema),
    defaultValues: {
      productSku: "",
      quantity: 1,
      returnDate: new Date().toISOString().split('T')[0], // Default to today's date
      reason: "",
      condition: "new",
      region: "",
      city: "",
    },
  });

  const handleSubmit = async (data: ReturnFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Calculate impact based on return data
      const impact = calculateReturnImpact({
        quantity: data.quantity,
        condition: data.condition,
        reason: data.reason
      });
      
      // Create a complete return object
      const returnData: ProductReturn = {
        id: crypto.randomUUID(), // Generate a random ID
        productSku: data.productSku,
        quantity: data.quantity,
        returnDate: data.returnDate,
        reason: data.reason,
        condition: data.condition,
        location: {
          region: data.region,
          city: data.city
        },
        status: "pending", // New returns start in pending status
        impact
      };
      
      onSubmit(returnData);
      
      toast({
        title: getTranslation('sales.returnSubmitted', language) || "Return Submitted",
        description: getTranslation('sales.returnProcessingMessage', language) || "The return has been submitted and is now pending approval.",
      });
    } catch (error) {
      console.error("Error submitting return:", error);
      toast({
        title: getTranslation('sales.returnError', language) || "Error",
        description: getTranslation('sales.returnErrorMessage', language) || "There was an error submitting your return.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="productSku"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{getTranslation('sales.sku', language)}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{getTranslation('sales.quantity', language)}</FormLabel>
              <FormControl>
                <Input type="number" min="1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="returnDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{getTranslation('sales.returnDate', language)}</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{getTranslation('sales.reason', language)}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={getTranslation('sales.reasonPlaceholder', language) || "e.g., Quality defect, Wrong size"} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="condition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{getTranslation('sales.condition', language)}</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={getTranslation('sales.selectCondition', language) || "Select condition"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="new">{getTranslation('sales.new', language)}</SelectItem>
                  <SelectItem value="damaged">{getTranslation('sales.damaged', language)}</SelectItem>
                  <SelectItem value="expired">{getTranslation('sales.expired', language)}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="region"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{getTranslation('sales.region', language)}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{getTranslation('sales.city', language)}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
            {getTranslation('sales.cancel', language)}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting 
              ? getTranslation('sales.submitting', language) || "Submitting..." 
              : getTranslation('sales.submitReturn', language) || "Submit Return"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
