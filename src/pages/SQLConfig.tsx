
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { FileUpload } from "@/components/settings/upload/FileUpload";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

const SQLConfig = () => {
  const [isValidating, setIsValidating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [hasValidationErrors, setHasValidationErrors] = useState(false);
  const [selectedProductLevel, setSelectedProductLevel] = useState<string>("all");
  const [selectedLocationLevel, setSelectedLocationLevel] = useState<string>("all");
  const { toast } = useToast();

  const productHierarchyLevels = [
    { value: "l1", label: "Main Product" },
    { value: "l2", label: "Product Line" },
    { value: "l3", label: "Product Category" },
    { value: "l4", label: "Device Make" },
    { value: "l5", label: "Product Sub Category" },
    { value: "l6", label: "Device Model" },
    { value: "l7", label: "Device Color" },
    { value: "l8", label: "Device Storage" },
  ];

  const locationHierarchyLevels = [
    { value: "country", label: "Country" },
    { value: "region", label: "Region" },
    { value: "city", label: "City" },
    { value: "channel", label: "Channel" },
    { value: "warehouse", label: "Warehouse" },
  ];

  const handleFileSelect = (file: File) => {
    setFile(file);
    setHasValidationErrors(false);
    setProgress(0);
  };

  const handleProcessUpload = async () => {
    try {
      setIsValidating(true);
      // Simulating upload progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 500);

      // Store the selected hierarchy levels in localStorage
      localStorage.setItem('selectedProductLevel', selectedProductLevel);
      localStorage.setItem('selectedLocationLevel', selectedLocationLevel);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Success",
        description: "Configuration updated successfully",
      });

    } catch (error) {
      console.error('Error processing upload:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process the upload",
      });
    } finally {
      setIsValidating(false);
      setProgress(0);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">SQL Configuration</h2>
          <p className="text-muted-foreground">
            Configure SQL data upload and hierarchy levels
          </p>
        </div>
        <Separator />

        <div className="grid gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">File Upload</h3>
            <FileUpload
              isValidating={isValidating}
              onFileSelect={handleFileSelect}
              onProcessUpload={handleProcessUpload}
              progress={progress}
              file={file}
              hasValidationErrors={hasValidationErrors}
            />
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Hierarchy Level Configuration</h3>
            <div className="grid gap-6">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Product Hierarchy Level
                </label>
                <Select value={selectedProductLevel} onValueChange={setSelectedProductLevel}>
                  <SelectTrigger className="w-[300px]">
                    <SelectValue placeholder="Select product hierarchy level" />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="h-[200px]">
                      <SelectItem value="all">All Levels</SelectItem>
                      {productHierarchyLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Location Hierarchy Level
                </label>
                <Select value={selectedLocationLevel} onValueChange={setSelectedLocationLevel}>
                  <SelectTrigger className="w-[300px]">
                    <SelectValue placeholder="Select location hierarchy level" />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="h-[200px]">
                      <SelectItem value="all">All Levels</SelectItem>
                      {locationHierarchyLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SQLConfig;
