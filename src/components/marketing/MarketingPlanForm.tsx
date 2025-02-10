
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { MarketingPlan, PromotionType } from "@/types/marketing";

const promotionTypes: { label: string; value: PromotionType }[] = [
  { label: "Black Friday", value: "black-friday" },
  { label: "Holiday Season", value: "holiday-season" },
  { label: "Summer Sale", value: "summer-sale" },
  { label: "Spring Sale", value: "spring-sale" },
  { label: "Custom", value: "custom" },
];

interface MarketingPlanFormProps {
  onClose: () => void;
  onSave?: (plan: MarketingPlan) => void;
}

export const MarketingPlanForm = ({ onClose, onSave }: MarketingPlanFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    promotionType: "",
    startDate: "",
    endDate: "",
    products: [{ sku: "", targetQuantity: 0, discountPercentage: 0 }],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newPlan: MarketingPlan = {
        id: Date.now().toString(),
        ...formData,
        status: "draft",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (onSave) {
        onSave(newPlan);
      }

      toast({
        title: "Success",
        description: "Marketing plan created successfully",
      });

      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create marketing plan",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addProduct = () => {
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, { sku: "", targetQuantity: 0, discountPercentage: 0 }],
    }));
  };

  return (
    <ScrollArea className="h-[500px] pr-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Promotion Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter promotion name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="promotionType">Promotion Type</Label>
            <Select
              value={formData.promotionType}
              onValueChange={(value) => setFormData(prev => ({ ...prev, promotionType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select promotion type" />
              </SelectTrigger>
              <SelectContent>
                {promotionTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter promotion description"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Products</Label>
              <Button type="button" variant="outline" onClick={addProduct}>
                Add Product
              </Button>
            </div>
            {formData.products.map((product, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 p-4 border rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor={`sku-${index}`}>SKU</Label>
                  <Input
                    id={`sku-${index}`}
                    value={product.sku}
                    onChange={(e) => {
                      const newProducts = [...formData.products];
                      newProducts[index].sku = e.target.value;
                      setFormData(prev => ({ ...prev, products: newProducts }));
                    }}
                    placeholder="Enter SKU"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`quantity-${index}`}>Target Quantity</Label>
                  <Input
                    id={`quantity-${index}`}
                    type="number"
                    value={product.targetQuantity}
                    onChange={(e) => {
                      const newProducts = [...formData.products];
                      newProducts[index].targetQuantity = Number(e.target.value);
                      setFormData(prev => ({ ...prev, products: newProducts }));
                    }}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`discount-${index}`}>Discount (%)</Label>
                  <Input
                    id={`discount-${index}`}
                    type="number"
                    value={product.discountPercentage}
                    onChange={(e) => {
                      const newProducts = [...formData.products];
                      newProducts[index].discountPercentage = Number(e.target.value);
                      setFormData(prev => ({ ...prev, products: newProducts }));
                    }}
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Plan"}
          </Button>
        </div>
      </form>
    </ScrollArea>
  );
};
