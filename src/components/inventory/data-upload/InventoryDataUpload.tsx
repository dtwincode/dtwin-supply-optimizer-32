
import { useState } from "react";
import FileUpload from "@/components/settings/upload/FileUpload";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export interface InventoryDataUploadProps {
  onDataUploaded?: (data: any[], type: string) => void;
}

export function InventoryDataUpload({ onDataUploaded }: InventoryDataUploadProps) {
  const [uploadedData, setUploadedData] = useState<any[]>([]);
  const [dataType, setDataType] = useState<string>("inventory");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileUpload = (files: File[]) => {
    // This would normally process the files to extract data
    // For now, we'll simulate with mock data
    const mockData = [
      { sku: "SKU001", name: "Product 1", currentStock: 100 },
      { sku: "SKU002", name: "Product 2", currentStock: 150 },
    ];
    
    setUploadedData(mockData);
    setError(null);
    
    toast({
      title: "Data upload success",
      description: `Uploaded ${mockData.length} records from ${files[0]?.name || "file"}`,
    });
    
    if (onDataUploaded) {
      onDataUploaded(mockData, dataType);
    }
  };

  const handleUploadError = (errorMessage: string) => {
    setError(errorMessage);
    toast({
      variant: "destructive",
      title: "Upload Failed",
      description: errorMessage,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Inventory Data Upload</CardTitle>
        <CardDescription>
          Upload your custom inventory data in CSV or Excel format
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="inventory" onValueChange={setDataType}>
          <TabsList className="mb-4">
            <TabsTrigger value="inventory">Basic Inventory</TabsTrigger>
            <TabsTrigger value="classification">Classification</TabsTrigger>
            <TabsTrigger value="leadtime">Lead Time</TabsTrigger>
            <TabsTrigger value="replenishment">Replenishment</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="space-y-4">
            <Alert>
              <AlertDescription>
                Upload inventory items with your own product hierarchy. Required fields: 
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="outline">sku</Badge>
                  <Badge variant="outline">name</Badge>
                  <Badge variant="outline">currentStock</Badge>
                  <Badge variant="outline">location</Badge>
                </div>
                <div className="mt-2">
                  Optional fields include any custom hierarchy levels you need:
                  <div className="mt-1 flex flex-wrap gap-2">
                    <Badge variant="secondary">category</Badge>
                    <Badge variant="secondary">subcategory</Badge>
                    <Badge variant="secondary">productFamily</Badge>
                    <Badge variant="secondary">region</Badge>
                    <Badge variant="secondary">city</Badge>
                    <Badge variant="secondary">any_custom_field</Badge>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
            <FileUpload 
              onUploadComplete={handleFileUpload}
              onError={handleUploadError}
              allowedFileTypes={[".csv", ".xlsx"]}
            />
          </TabsContent>

          <TabsContent value="classification" className="space-y-4">
            <Alert>
              <AlertDescription>
                Upload SKU classifications. Required fields:
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="outline">sku</Badge>
                  <Badge variant="outline">leadTimeCategory</Badge>
                  <Badge variant="outline">variabilityLevel</Badge>
                  <Badge variant="outline">criticality</Badge>
                </div>
                <div className="mt-2">
                  <Badge variant="outline">leadTimeCategory</Badge>: must be 'short', 'medium', or 'long'<br />
                  <Badge variant="outline">variabilityLevel</Badge>: must be 'low', 'medium', or 'high'<br />
                  <Badge variant="outline">criticality</Badge>: must be 'low', 'medium', or 'high'
                </div>
              </AlertDescription>
            </Alert>
            <FileUpload 
              onUploadComplete={handleFileUpload}
              onError={handleUploadError}
              allowedFileTypes={[".csv", ".xlsx"]}
            />
          </TabsContent>

          <TabsContent value="leadtime" className="space-y-4">
            <Alert>
              <AlertDescription>
                Upload lead time data. Required fields:
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="outline">sku</Badge>
                  <Badge variant="outline">supplier_id</Badge>
                  <Badge variant="outline">predicted_lead_time</Badge>
                  <Badge variant="outline">confidence_score</Badge>
                  <Badge variant="outline">prediction_date</Badge>
                </div>
              </AlertDescription>
            </Alert>
            <FileUpload 
              onUploadComplete={handleFileUpload}
              onError={handleUploadError}
              allowedFileTypes={[".csv", ".xlsx"]}
            />
          </TabsContent>

          <TabsContent value="replenishment" className="space-y-4">
            <Alert>
              <AlertDescription>
                Upload replenishment data. Required fields:
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="outline">sku</Badge>
                  <Badge variant="outline">internalTransferTime</Badge>
                  <Badge variant="outline">replenishmentLeadTime</Badge>
                  <Badge variant="outline">totalCycleTime</Badge>
                  <Badge variant="outline">locationFrom</Badge>
                  <Badge variant="outline">locationTo</Badge>
                </div>
              </AlertDescription>
            </Alert>
            <FileUpload 
              onUploadComplete={handleFileUpload}
              onError={handleUploadError}
              allowedFileTypes={[".csv", ".xlsx"]}
            />
          </TabsContent>
        </Tabs>

        {uploadedData.length > 0 && (
          <div className="mt-4">
            <div className="text-sm text-muted-foreground mb-2">
              Preview of uploaded data ({uploadedData.length} records):
            </div>
            <div className="border rounded-md p-4 max-h-60 overflow-auto">
              <pre className="text-xs whitespace-pre-wrap">
                {JSON.stringify(uploadedData.slice(0, 5), null, 2)}
                {uploadedData.length > 5 && '...'}
              </pre>
            </div>
            <div className="mt-4 flex justify-end">
              <Button 
                onClick={() => {
                  toast({
                    title: "Data saved",
                    description: `${uploadedData.length} records have been saved.`
                  });
                }}
              >
                Save Data
              </Button>
            </div>
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
