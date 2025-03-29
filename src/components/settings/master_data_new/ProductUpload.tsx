import React, { useState } from "react";
import { FileUpload } from "@/components/settings/upload/FileUpload";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { UploadInstructions, FieldDescription } from "./components/UploadInstructions";

const productFields: FieldDescription[] = [
  { name: "sku", description: "Unique product identifier", required: true },
  { name: "name", description: "Product name", required: true },
  { name: "category", description: "Main product category", required: true },
  { name: "subcategory", description: "Product subcategory", required: true },
  { name: "product_family", description: "Product family grouping", required: true },
  { name: "description", description: "Detailed product description", required: false },
  { name: "unit_of_measure", description: "Unit of measurement (e.g., each, kg, liter)", required: false },
  { name: "brand", description: "Product brand name", required: false },
  { name: "weight", description: "Product weight", required: false },
  { name: "dimensions", description: "Product dimensions", required: false },
];

const ProductUpload = () => {
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
        description: `${data.length} products have been uploaded.`,
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
        title="Product Data Upload Instructions"
        description="Upload your product data using CSV or Excel format. The file should include the fields below."
        fields={productFields}
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

export default ProductUpload;
