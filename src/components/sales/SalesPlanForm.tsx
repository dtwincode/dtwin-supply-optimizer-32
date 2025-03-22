
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { DateSection } from "./form/DateSection";
import { ProductSection } from "./form/ProductSection";
import { LocationSection } from "./form/LocationSection";
import { ChannelSection } from "./form/ChannelSection";
import { ValuesSection } from "./form/ValuesSection";
import { FormHeader } from "./form/FormHeader";
import { useFormValidation, FormState } from "./form/useFormValidation";

const subcategories = {
  "Electronics": ["Smartphones", "Laptops", "Tablets", "Accessories"],
  "Fashion": ["Men's Wear", "Women's Wear", "Children's Wear", "Accessories"],
  "Home & Garden": ["Furniture", "Decor", "Garden Tools", "Lighting"]
};

const cities = {
  "North America": ["New York", "Los Angeles", "Toronto", "Chicago"],
  "Europe": ["London", "Paris", "Berlin", "Madrid"],
  "Asia Pacific": ["Tokyo", "Singapore", "Sydney", "Seoul"]
};

const productCategories = ["Electronics", "Fashion", "Home & Garden"];
const regions = ["North America", "Europe", "Asia Pacific"];
const channelTypes = ["B2B", "Wholesale", "Direct"];

const skus = {
  "Smartphones": ["iPhone-15", "Galaxy-S24", "Pixel-8"],
  "Laptops": ["MacBook-Pro", "XPS-13", "ThinkPad-X1"],
  "Tablets": ["iPad-Pro", "Galaxy-Tab", "Surface-Pro"],
  "Accessories": ["AirPods", "Galaxy-Buds", "Pixel-Buds"],
  "Men's Wear": ["MW-001", "MW-002", "MW-003"],
  "Women's Wear": ["WW-001", "WW-002", "WW-003"],
  "Children's Wear": ["CW-001", "CW-002", "CW-003"],
  "Fashion Accessories": ["FA-001", "FA-002", "FA-003"],
  "Furniture": ["F-001", "F-002", "F-003"],
  "Decor": ["D-001", "D-002", "D-003"],
  "Garden Tools": ["GT-001", "GT-002", "GT-003"],
  "Lighting": ["L-001", "L-002", "L-003"]
};

interface SalesPlanFormProps {
  onClose: () => void;
  onSave?: (newPlan: any) => void;
}

export const SalesPlanForm = ({ onClose, onSave }: SalesPlanFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const initialState: FormState = {
    startDate: "",
    endDate: "",
    category: "",
    subcategory: "",
    sku: "",
    region: "",
    city: "",
    channelType: "",
    accountName: "",
    targetValue: "",
    confidence: "",
    notes: ""
  };
  
  const { formState, formErrors, validateForm, handleFormChange } = useFormValidation(initialState);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please check the form for errors",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const newPlan = {
        id: Date.now().toString(),
        timeframe: {
          startDate: formState.startDate,
          endDate: formState.endDate
        },
        planType: "top-down",
        productHierarchy: {
          category: formState.category,
          subcategory: formState.subcategory,
          sku: formState.sku
        },
        location: {
          region: formState.region,
          city: formState.city,
        },
        planningValues: {
          targetValue: Number(formState.targetValue),
          confidence: Number(formState.confidence) / 100,
          notes: formState.notes
        },
        status: "draft",
        lastUpdated: new Date().toISOString(),
        createdBy: "Current User"
      };

      if (onSave) {
        onSave(newPlan);
      }

      toast({
        title: "Success",
        description: "Sales plan created successfully",
      });

      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create sales plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollArea className="h-[80vh] pr-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <DateSection 
          startDate={formState.startDate}
          endDate={formState.endDate}
          handleFormChange={handleFormChange}
          formErrors={formErrors}
        />

        <div className="grid grid-cols-2 gap-4">
          <ProductSection 
            category={formState.category}
            subcategory={formState.subcategory}
            sku={formState.sku}
            handleFormChange={handleFormChange}
            formErrors={formErrors}
            productCategories={productCategories}
            subcategories={subcategories}
            skus={skus}
          />

          <LocationSection 
            region={formState.region}
            city={formState.city}
            handleFormChange={handleFormChange}
            formErrors={formErrors}
            regions={regions}
            cities={cities}
          />

          <ChannelSection 
            channelType={formState.channelType}
            accountName={formState.accountName}
            handleFormChange={handleFormChange}
            formErrors={formErrors}
            channelTypes={channelTypes}
          />

          <ValuesSection 
            targetValue={formState.targetValue}
            confidence={formState.confidence}
            notes={formState.notes}
            handleFormChange={handleFormChange}
            formErrors={formErrors}
          />
        </div>

        <FormHeader isSubmitting={isSubmitting} onClose={onClose} />
      </form>
    </ScrollArea>
  );
};
