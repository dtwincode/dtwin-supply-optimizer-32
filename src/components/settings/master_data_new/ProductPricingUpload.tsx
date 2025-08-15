
import React, { useState } from "react";
import { FileUpload } from "@/components/settings/upload/FileUpload";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { UploadInstructions, FieldDescription } from "./components/UploadInstructions";

const productPricingFields: FieldDescription[] = [
  { name: "product_id", description: "Product identifier (SKU)", required: true },
  { name: "location_id", description: "Location identifier where this price applies", required: true },
  { name: "effective_date", description: "Date when price becomes effective (YYYY-MM-DD)", required: true },
  { name: "expiration_date", description: "Date when price expires (YYYY-MM-DD, or leave blank for indefinite)", required: false },
  { name: "base_price", description: "Regular selling price", required: true },
  { name: "cost_price", description: "Cost of the product", required: true },
  { name: "wholesale_price", description: "Wholesale pricing", required: false },
  { name: "discount_price", description: "Discounted selling price", required: false },
  { name: "currency", description: "Currency code (e.g., USD, EUR)", required: false },
  { name: "min_order_qty", description: "Minimum order quantity for this price", required: false },
  { name: "customer_segment", description: "Customer segment this price applies to", required: false },
];

const ProductPricingUpload = () => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUploadComplete = async (data: any[], fileName: string) => {
    try {
      setUploading(true);
      
      // Process data...
      // This would typically include validation and API calls to save the data
      
      toast({
        title: "Upload successful",
        description: `${data.length} product pricing records have been uploaded.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      <UploadInstructions
        title="Product Pricing Upload Instructions"
        description="Upload your product pricing data using CSV or Excel format. The file should include the fields below."
        fields={productPricingFields}
      />
      
      <FileUpload
        onUploadComplete={handleUploadComplete}
        onProgress={setProgress}
        allowedFileTypes={[".csv", ".xlsx"]}
        maxSize={5}
      />
      
      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground">Processing... {progress}%</p>
        </div>
      )}
    </div>
  );
};

export default ProductPricingUpload;
