
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Package, MapPin, User } from "lucide-react";

const returnSchema = z.object({
  productSku: z.string().min(1, { message: "SKU is required" }),
  productName: z.string().optional(),
  quantity: z.coerce.number().positive({ message: "Quantity must be positive" }),
  returnDate: z.string().min(1, { message: "Return date is required" }),
  reason: z.string().min(1, { message: "Reason is required" }),
  condition: z.enum(["new", "damaged", "expired"], { 
    errorMap: () => ({ message: "Please select a valid condition" })
  }),
  region: z.string().min(1, { message: "Region is required" }),
  city: z.string().optional(),
  warehouse: z.string().optional(),
  customerId: z.string().optional(),
  customerName: z.string().optional(),
  customerSegment: z.string().optional(),
  priorityLevel: z.enum(["low", "medium", "high"]).default("medium"),
  relatedOrder: z.string().optional(),
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
  const [activeTab, setActiveTab] = useState("product");
  
  const form = useForm<ReturnFormValues>({
    resolver: zodResolver(returnSchema),
    defaultValues: {
      productSku: "",
      productName: "",
      quantity: 1,
      returnDate: new Date().toISOString().split('T')[0], // Default to today's date
      reason: "",
      condition: "new",
      region: "",
      city: "",
      warehouse: "",
      customerId: "",
      customerName: "",
      customerSegment: "",
      priorityLevel: "medium",
      relatedOrder: "",
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
        productName: data.productName,
        quantity: data.quantity,
        returnDate: data.returnDate,
        reason: data.reason,
        condition: data.condition,
        location: {
          region: data.region,
          city: data.city,
          warehouse: data.warehouse
        },
        ...(data.customerId || data.customerName ? {
          customer: {
            id: data.customerId,
            name: data.customerName,
            segment: data.customerSegment
          }
        } : {}),
        status: "recorded", // New returns start in recorded status
        impact,
        priorityLevel: data.priorityLevel,
        tags: [],
        ...(data.relatedOrder ? { relatedOrders: [data.relatedOrder] } : {})
      };
      
      onSubmit(returnData);
      
      toast({
        title: getTranslation('sales.returnSubmitted', language) || "Return Submitted",
        description: getTranslation('sales.returnProcessingMessage', language) || "The return has been recorded and the impact assessment is ready.",
      });
    } catch (error) {
      console.error("Error submitting return:", error);
      toast({
        title: getTranslation('sales.returnError', language) || "Error",
        description: getTranslation('sales.returnErrorMessage', language) || "There was an error recording your return.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="product" className="flex items-center gap-1">
              <Package className="h-4 w-4" />
              {getTranslation('sales.product', language) || "Product"}
            </TabsTrigger>
            <TabsTrigger value="location" className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {getTranslation('sales.location', language) || "Location"}
            </TabsTrigger>
            <TabsTrigger value="customer" className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {getTranslation('sales.customer', language) || "Customer"}
            </TabsTrigger>
          </TabsList>
          
          <div className={activeTab === "product" ? "block" : "hidden"}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                  name="productName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{getTranslation('sales.productName', language) || "Product Name"}</FormLabel>
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
              </div>
              
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
              
              <div className="grid grid-cols-2 gap-4">
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
                  name="priorityLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{getTranslation('sales.priority', language) || "Priority"}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">{getTranslation('sales.low', language) || "Low"}</SelectItem>
                          <SelectItem value="medium">{getTranslation('sales.medium', language) || "Medium"}</SelectItem>
                          <SelectItem value="high">{getTranslation('sales.high', language) || "High"}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="relatedOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{getTranslation('sales.relatedOrderId', language) || "Related Order ID"}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., ORD-12345" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <div className={activeTab === "location" ? "block" : "hidden"}>
            <div className="space-y-4">
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
              
              <div className="grid grid-cols-2 gap-4">
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
                
                <FormField
                  control={form.control}
                  name="warehouse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{getTranslation('sales.warehouse', language) || "Warehouse"}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          
          <div className={activeTab === "customer" ? "block" : "hidden"}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="customerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{getTranslation('sales.customerId', language) || "Customer ID"}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{getTranslation('sales.customerName', language) || "Customer Name"}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="customerSegment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{getTranslation('sales.customerSegment', language) || "Customer Segment"}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={getTranslation('sales.selectSegment', language) || "Select segment"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Retail">{getTranslation('sales.retail', language) || "Retail"}</SelectItem>
                        <SelectItem value="Wholesale">{getTranslation('sales.wholesale', language) || "Wholesale"}</SelectItem>
                        <SelectItem value="Online">{getTranslation('sales.online', language) || "Online"}</SelectItem>
                        <SelectItem value="Other">{getTranslation('sales.other', language) || "Other"}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </Tabs>
        
        <Separator />
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            {getTranslation('sales.cancel', language)}
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting 
              ? getTranslation('sales.submitting', language) || "Submitting..." 
              : getTranslation('sales.submitReturn', language) || "Submit Return"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
