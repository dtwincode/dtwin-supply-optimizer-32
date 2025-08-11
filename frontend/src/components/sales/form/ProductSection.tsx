
import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductSectionProps {
  category: string;
  subcategory: string;
  sku: string;
  handleFormChange: (field: string, value: string) => void;
  formErrors: Record<string, string>;
  productCategories: string[];
  subcategories: Record<string, string[]>;
  skus: Record<string, string[]>;
}

export const ProductSection: React.FC<ProductSectionProps> = ({
  category,
  subcategory,
  sku,
  handleFormChange,
  formErrors,
  productCategories,
  subcategories,
  skus,
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="category">Product Category</Label>
        <Select
          value={category}
          onValueChange={(value) => handleFormChange("category", value)}
        >
          <SelectTrigger className={formErrors.category ? "border-red-500" : ""}>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {productCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formErrors.category && (
          <p className="text-sm text-red-500">{formErrors.category}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="subcategory">Subcategory</Label>
        <Select
          value={subcategory}
          onValueChange={(value) => handleFormChange("subcategory", value)}
          disabled={!category}
        >
          <SelectTrigger className={formErrors.subcategory ? "border-red-500" : ""}>
            <SelectValue placeholder="Select subcategory" />
          </SelectTrigger>
          <SelectContent>
            {category &&
              subcategories[category as keyof typeof subcategories]?.map(
                (subcategory) => (
                  <SelectItem key={subcategory} value={subcategory}>
                    {subcategory}
                  </SelectItem>
                )
              )}
          </SelectContent>
        </Select>
        {formErrors.subcategory && (
          <p className="text-sm text-red-500">{formErrors.subcategory}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="sku">SKU</Label>
        <Select
          value={sku}
          onValueChange={(value) => handleFormChange("sku", value)}
          disabled={!subcategory}
        >
          <SelectTrigger className={formErrors.sku ? "border-red-500" : ""}>
            <SelectValue placeholder="Select SKU" />
          </SelectTrigger>
          <SelectContent>
            {subcategory &&
              skus[subcategory as keyof typeof skus]?.map(
                (sku) => (
                  <SelectItem key={sku} value={sku}>
                    {sku}
                  </SelectItem>
                )
              )}
          </SelectContent>
        </Select>
        {formErrors.sku && (
          <p className="text-sm text-red-500">{formErrors.sku}</p>
        )}
      </div>
    </>
  );
};
