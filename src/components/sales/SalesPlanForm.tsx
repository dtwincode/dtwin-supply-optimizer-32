
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
  
  const [formState, setFormState] = useState({
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
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formState.startDate) errors.startDate = "Start date is required";
    if (!formState.endDate) errors.endDate = "End date is required";
    if (!formState.category) errors.category = "Category is required";
    if (!formState.subcategory) errors.subcategory = "Subcategory is required";
    if (!formState.region) errors.region = "Region is required";
    if (!formState.city) errors.city = "City is required";
    if (!formState.channelType) errors.channelType = "Channel type is required";
    if (!formState.targetValue) errors.targetValue = "Target value is required";
    if (!formState.confidence) errors.confidence = "Confidence is required";

    if (["B2B", "Wholesale"].includes(formState.channelType) && !formState.accountName) {
      errors.accountName = "Account name is required for B2B/Wholesale";
    }

    if (formState.startDate && formState.endDate) {
      const start = new Date(formState.startDate);
      const end = new Date(formState.endDate);
      if (end < start) {
        errors.endDate = "End date must be after start date";
      }
    }

    if (formState.targetValue && Number(formState.targetValue) <= 0) {
      errors.targetValue = "Target value must be greater than 0";
    }
    
    if (formState.confidence) {
      const confidence = Number(formState.confidence);
      if (confidence < 0 || confidence > 100) {
        errors.confidence = "Confidence must be between 0 and 100";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormChange = (field: string, value: string) => {
    setFormState(prev => {
      const newState = { ...prev, [field]: value };
      
      if (field === "category") {
        newState.subcategory = "";
        newState.sku = "";
      }
      if (field === "subcategory") {
        newState.sku = "";
      }
      if (field === "region") {
        newState.city = "";
      }
      if (field === "channelType" && !["B2B", "Wholesale"].includes(value)) {
        newState.accountName = "";
      }
      
      setFormErrors(prev => ({ ...prev, [field]: "" }));
      
      return newState;
    });
  };

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
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={formState.startDate}
              onChange={(e) => handleFormChange("startDate", e.target.value)}
              className={formErrors.startDate ? "border-red-500" : ""}
            />
            {formErrors.startDate && (
              <p className="text-sm text-red-500">{formErrors.startDate}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={formState.endDate}
              onChange={(e) => handleFormChange("endDate", e.target.value)}
              className={formErrors.endDate ? "border-red-500" : ""}
            />
            {formErrors.endDate && (
              <p className="text-sm text-red-500">{formErrors.endDate}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Product Category</Label>
            <Select
              value={formState.category}
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
              value={formState.subcategory}
              onValueChange={(value) => handleFormChange("subcategory", value)}
              disabled={!formState.category}
            >
              <SelectTrigger className={formErrors.subcategory ? "border-red-500" : ""}>
                <SelectValue placeholder="Select subcategory" />
              </SelectTrigger>
              <SelectContent>
                {formState.category &&
                  subcategories[formState.category as keyof typeof subcategories].map(
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
            <Label htmlFor="region">Region</Label>
            <Select
              value={formState.region}
              onValueChange={(value) => handleFormChange("region", value)}
            >
              <SelectTrigger className={formErrors.region ? "border-red-500" : ""}>
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors.region && (
              <p className="text-sm text-red-500">{formErrors.region}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Select
              value={formState.city}
              onValueChange={(value) => handleFormChange("city", value)}
              disabled={!formState.region}
            >
              <SelectTrigger className={formErrors.city ? "border-red-500" : ""}>
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {formState.region &&
                  cities[formState.region as keyof typeof cities].map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {formErrors.city && (
              <p className="text-sm text-red-500">{formErrors.city}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sku">SKU</Label>
            <Select
              value={formState.sku}
              onValueChange={(value) => handleFormChange("sku", value)}
              disabled={!formState.subcategory}
            >
              <SelectTrigger className={formErrors.sku ? "border-red-500" : ""}>
                <SelectValue placeholder="Select SKU" />
              </SelectTrigger>
              <SelectContent>
                {formState.subcategory &&
                  skus[formState.subcategory as keyof typeof skus]?.map(
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

          <div className="space-y-2">
            <Label htmlFor="channelType">Channel Type</Label>
            <Select
              value={formState.channelType}
              onValueChange={(value) => handleFormChange("channelType", value)}
            >
              <SelectTrigger className={formErrors.channelType ? "border-red-500" : ""}>
                <SelectValue placeholder="Select channel type" />
              </SelectTrigger>
              <SelectContent>
                {channelTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors.channelType && (
              <p className="text-sm text-red-500">{formErrors.channelType}</p>
            )}
          </div>

          {(formState.channelType === "B2B" || formState.channelType === "Wholesale") && (
            <div className="space-y-2">
              <Label htmlFor="accountName">Account Name</Label>
              <Input
                id="accountName"
                value={formState.accountName}
                onChange={(e) => handleFormChange("accountName", e.target.value)}
                placeholder="Enter account name"
                className={formErrors.accountName ? "border-red-500" : ""}
              />
              {formErrors.accountName && (
                <p className="text-sm text-red-500">{formErrors.accountName}</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="targetValue">Target Value ($)</Label>
            <Input
              id="targetValue"
              type="number"
              min="0"
              value={formState.targetValue}
              onChange={(e) => handleFormChange("targetValue", e.target.value)}
              className={formErrors.targetValue ? "border-red-500" : ""}
            />
            {formErrors.targetValue && (
              <p className="text-sm text-red-500">{formErrors.targetValue}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confidence">Confidence (%)</Label>
            <Input
              id="confidence"
              type="number"
              min="0"
              max="100"
              value={formState.confidence}
              onChange={(e) => handleFormChange("confidence", e.target.value)}
              className={formErrors.confidence ? "border-red-500" : ""}
            />
            {formErrors.confidence && (
              <p className="text-sm text-red-500">{formErrors.confidence}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            placeholder="Add any additional notes or comments..."
            value={formState.notes}
            onChange={(e) => handleFormChange("notes", e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
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
