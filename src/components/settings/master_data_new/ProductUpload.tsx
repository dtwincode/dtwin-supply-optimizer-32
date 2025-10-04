
import React, { useState } from "react";
import { FileUpload } from "@/components/settings/upload/FileUpload";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { UploadInstructions, FieldDescription } from "./components/UploadInstructions";
import { uploadProduct, clearAllProducts } from "@/lib/product.service";
import { AlertCircle, CheckCircle, FileType, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";

// Field definitions exactly matching the product_master table schema
const productFields: FieldDescription[] = [
  { name: "sku", description: "Unique product identifier", required: true },
  { name: "name", description: "Product name", required: true },
  { name: "category", description: "Main product category", required: false },
  { name: "subcategory", description: "Product subcategory", required: false },
  { name: "product_family", description: "Product family grouping", required: false },
  { name: "planning_priority", description: "Planning priority", required: false },
  { name: "notes", description: "Additional product notes", required: false },
];

// Sample CSV content for download - Burgerizzr menu data
const sampleCSVContent = `sku,name,category,subcategory,product_family,planning_priority,notes
BST-001,Zinger Shong Box,Bestsellers/Limited Offers,Combo Boxes,Combos,High,Fresh crispy chicken sandwich with ketchup mayo and crunchy lettuce legendary shong side sauce and a tub of crushed Cheetos fries next to epic curly fries
BST-002,Dbl Dbl Fraizerr Loaded Fries,Bestsellers/Limited Offers,Loaded Fries,Sides,High,Loaded fries with a mix of the awesome Double Double sauce and melted cheese over meat
BST-003,Tenderizzr,Bestsellers/Limited Offers,Chicken Tenders,Sides,High,Four juicy generously sized chicken strips served with signature Tenderizzr sauce perfectly paired with curly fries and a soft brioche bun on the side
BST-004,Duo Hibherizzr,Bestsellers/Limited Offers,Combo Boxes,Combos,High,2 fresh fried chicken burgers with the deliciousness of shaqra al-aseel (sea basil) with mahbahar sauce and fries
BST-005,Dbl Dbl X Hibherizzr,Bestsellers/Limited Offers,Special Burgers,Burgers,High,Double Double Hibherizzr burger (double meat and double melted cheese - two 214g fresh Angus beef patties) served with curly fries Hibherizzr sauce crispy fried onions and a shaqra chili pepper
BST-006,Hibherizzr Shaqra,Bestsellers/Limited Offers,Special Burgers,Burgers,High,Fresh fried chicken burger with the deliciousness of Shaqraa Al-Aseel with mahbahar cheese 2 mahbahar tenders Raizar Habahar sauce mahbahar fries and a unique shaqraa shagra
BST-007,Hibherizzr Tortilla,Bestsellers/Limited Offers,Tortilla Wraps,Sandwiches,High,Fresh fried chicken tortilla with delicious Aseel Shaqra squid with mahbahara cheese 2 mahbahara tenders Raizezzar Habahara sauce mahbahara fries and a unique shaqraa habahara
BST-008,Duo Cali Burgers,Bestsellers/Limited Offers,Combo Boxes,Combos,High,2 Cali Style burgers with luxurious curly fries Cali sauce and Ranch sauce
BST-009,Cali Burger,Bestsellers/Limited Offers,Special Burgers,Burgers,High,Classic taste of the Cali Style burger with luxurious and crispy fries
BST-010,Break Box,Bestsellers/Limited Offers,Combo Boxes,Combos,High,Contains a burger of your choice and sauce of your choice with three pieces of Winger and potatoes
GBX-001,Meltizzr Burgerizzr Box,Gathering Boxes,Family Boxes,Combos,High,A special box with a choice of multiple burgers (meat chicken or fried chicken) with wings fries and three sauces on the side
GBX-002,Classic Burgerizzr Box,Gathering Boxes,Family Boxes,Combos,High,Contains 6 classic burgers (meat chicken fried chicken or mixed) with chicken wings with sauce sided with fries and three sauces
GBX-003,Bbq Classic Box,Gathering Boxes,Sharing Boxes,Combos,High,Burgerizzr's distinctive grilling box contains all the ingredients for the burger ready to grill (you only need to grill the ingredients)
SBX-001,Dbl Dbl,Solo Boxes,Individual Combos,Combos,High,Contains a Double Double burger (double meat and double melted cheese - two 214g fresh Angus beef patties) curly fries Double Double sauce crispy fried onions and a pickle
BEF-001,Classic Beef Burger,Beef Burgers,Grilled Beef,Burgers,Medium,Classic fresh grilled beef burger with luxurious brioche bread lettuce tomato onion pickles and special Burgerizzr sauce
BEF-002,Meltizzr Beef Burger,Beef Burgers,Grilled Beef,Burgers,Medium,Fresh grilled beef burger with delicious and light potato bread lettuce tomatoes and special Burgerizzr sauce
BEF-003,Classic Beef Keto,Beef Burgers,Keto Beef,Burgers,Medium,Classic keto burger with fresh and delicious meat wrapped with lettuce pickles and awesome Burgerizzr sauce
CHK-001,Classic Chicken Burger,Chicken Burgers,Grilled Chicken,Burgers,Medium,Delicious classic chicken burger with fresh ingredients grilled chicken breast luxurious brioche bread lettuce pickles special Burgerizzr sauce and mayonnaise
CHK-002,Classic Fried Burger,Chicken Burgers,Fried Chicken,Burgers,Medium,Fresh fried chicken breast burger with luxurious brioche bread lettuce awesome Burgerizzr sauce pickle pieces and mayonnaise
CHK-003,Meltizzr Chicken Burger,Chicken Burgers,Grilled Chicken,Burgers,Medium,Fresh chicken burger of grilled chicken thighs with delicious and light potato bread lettuce and special Burgerizzr sauce
CHK-004,Meltizzr Fried Chicken Burger,Chicken Burgers,Fried Chicken,Burgers,Medium,Fresh fried chicken burger in delicious and light potato bread with lettuce special Burgerizzr sauce and mayonnaise
CHK-005,Classic Chicken Keto,Chicken Burgers,Keto Chicken,Burgers,Medium,Classic keto burger with fresh chicken delicious with its ingredients: grilled chicken breast wrapped with lettuce pickles and special Burgerizzr sauce
SND-001,Classic Tortilla Sandwich,Sandwiches/Wraps,Tortilla Wraps,Sandwiches,Medium,Tortilla sandwich of crispy chicken breasts lettuce fresh tomatoes tortilla sauce and cheese
SID-001,Curly Fries,Sides & Appetizers,Fries,Sides,Low,Crispy mellolo potatoes
SID-002,French Fries,Sides & Appetizers,Fries,Sides,Low,French fries
SID-003,Chicken Strips,Sides & Appetizers,Chicken Tenders,Sides,Medium,Two soft and crispy tenders with awesome Burgerizzr sauce
SID-004,Nuggets,Sides & Appetizers,Nuggets,Sides,Medium,Delicious pieces
SID-005,Wingers,Sides & Appetizers,Wings,Sides,Medium,Soft and crispy boneless wings with a sauce of your choice
SAU-001,Burgerizzr Sauce,Sauces,Signature Sauces,Condiments,Low,The awesome classic Burgerizzr sauce
SAU-002,Dbl Dbl Sauce,Sauces,Signature Sauces,Condiments,Low,The luxurious and awesome Double Double sauce
SAU-003,Hibherizzr Sauce,Sauces,Signature Sauces,Condiments,Low,Sauce with the addition of the amazing Shaqra sea basil with its heat and sweetness
SAU-004,Other Sauces,Sauces,Standard Sauces,Condiments,Low,A collection of delicious and famous sauces
DRK-001,Soft Drinks,Drinks,Soft Drinks,Beverages,Low,Soft drinks (e.g. Pepsi 7 Up)
DRK-002,Juices,Drinks,Juices,Beverages,Low,Refreshing juices
DRK-003,Water,Drinks,Water,Beverages,Low,Water bottle`;

const ProductUpload = () => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);

  const handleUploadComplete = async (data: any[], fileName: string) => {
    try {
      setUploading(true);
      setUploadStatus('idle');
      setErrorMessage(null);
      
      // Create a Blob and File from the data
      let fileContent: Blob;
      if (fileName.endsWith('.csv')) {
        // Create CSV content from the data
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(row => Object.values(row).join(','));
        const csvContent = [headers, ...rows].join('\n');
        fileContent = new Blob([csvContent], { type: 'text/csv' });
      } else {
        // Just stringify the JSON data
        fileContent = new Blob([JSON.stringify(data)], { type: 'application/json' });
      }
      
      const file = new File([fileContent], fileName, { 
        type: fileName.endsWith('.csv') ? 'text/csv' : 'application/json' 
      });

      // Upload the product data
      const result = await uploadProduct(file);
      
      if (result) {
        setUploadStatus('success');
        toast({
          title: "Upload successful",
          description: `${data.length} products have been uploaded.`,
        });
      } else {
        setUploadStatus('error');
        setErrorMessage("Failed to upload product data. Please check the file format.");
        toast({
          variant: "destructive",
          title: "Upload failed",
          description: "There was an error processing your product data.",
        });
      }
      
      return result;
    } catch (error) {
      setUploadStatus('error');
      const errorMsg = error instanceof Error ? error.message : "Unknown error occurred";
      setErrorMessage(errorMsg);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: errorMsg,
      });
      return false;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleClearAll = async () => {
    try {
      setClearing(true);
      const result = await clearAllProducts();
      
      if (result) {
        setUploadStatus('success');
        toast({
          title: "Products cleared",
          description: "All products have been removed from the database.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Clear failed",
          description: "Failed to clear products. Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Clear failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setClearing(false);
    }
  };

  const downloadSampleCSV = () => {
    const element = document.createElement("a");
    const file = new Blob([sampleCSVContent], {type: 'text/csv'});
    element.href = URL.createObjectURL(file);
    element.download = "burgerizzr_products.csv";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <UploadInstructions
            title="Product Data Upload Instructions"
            description="Upload your product data using CSV format. The file should include the exact field names shown below to match the database structure."
            fields={productFields}
          />
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="destructive" 
              size="sm"
              disabled={clearing}
              className="ml-4"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Products
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete all products from the database. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleClearAll} className="bg-destructive text-destructive-foreground">
                Delete All
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      
      <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800 dark:text-amber-300">Important Note</h4>
              <p className="text-sm text-amber-700 dark:text-amber-400 mb-2">
                Download the Burgerizzr menu CSV below. This file contains all 37 menu items with proper SKUs, categories, and subcategories.
                You can upload it directly or modify it as needed.
              </p>
              <button 
                onClick={downloadSampleCSV}
                className="text-sm inline-flex items-center px-3 py-1 bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 rounded-md hover:bg-amber-300 dark:hover:bg-amber-700 transition-colors"
              >
                <FileType className="h-4 w-4 mr-2" />
                Download Burgerizzr Menu CSV
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <FileUpload
        onUploadComplete={handleUploadComplete}
        onProgress={setProgress}
        allowedFileTypes={[".csv"]}
        maxSize={5}
      />
      
      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground">Processing... {progress}%</p>
        </div>
      )}
      
      {uploadStatus === 'success' && (
        <Alert className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Upload successful</AlertTitle>
          <AlertDescription>
            The product data has been successfully processed and saved.
          </AlertDescription>
        </Alert>
      )}
      
      {uploadStatus === 'error' && (
        <Alert className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Upload failed</AlertTitle>
          <AlertDescription>
            {errorMessage || "There was an error processing your data. Please check the file format and try again."}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ProductUpload;
