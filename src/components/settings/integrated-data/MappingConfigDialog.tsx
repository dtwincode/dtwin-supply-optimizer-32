
import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ForecastMappingConfig } from "./types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Info, X, Check, Save, Trash2, Database, ArrowRight, File } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface MappingConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (mapping: ForecastMappingConfig) => void;
  selectedMapping?: ForecastMappingConfig | null;
  onDelete?: () => void;
  savedMappings: ForecastMappingConfig[];
}

interface DataPreview {
  data: any[];
  columns: string[];
}

export function MappingConfigDialog({ 
  open, 
  onOpenChange, 
  onSave,
  selectedMapping,
  onDelete,
  savedMappings
}: MappingConfigDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentMapping, setCurrentMapping] = useState<ForecastMappingConfig | null>(null);
  const [mappingName, setMappingName] = useState("");
  const [description, setDescription] = useState("");
  const [useProductMapping, setUseProductMapping] = useState(false);
  const [useLocationMapping, setUseLocationMapping] = useState(false);
  const [selectedProductKey, setSelectedProductKey] = useState("");
  const [selectedLocationKey, setSelectedLocationKey] = useState("");
  const [selectedHistoricalProductKey, setSelectedHistoricalProductKey] = useState("");
  const [selectedHistoricalLocationKey, setSelectedHistoricalLocationKey] = useState("");
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [configStep, setConfigStep] = useState<'sources' | 'mapping' | 'columns'>('sources');
  const [dataPreviews, setDataPreviews] = useState<{
    historical: DataPreview | null;
    product: DataPreview | null;
    location: DataPreview | null;
  }>({
    historical: null,
    product: null,
    location: null
  });

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      if (selectedMapping) {
        setMappingName(selectedMapping.mapping_name);
        setDescription(selectedMapping.description || "");
        setUseProductMapping(selectedMapping.use_product_mapping);
        setUseLocationMapping(selectedMapping.use_location_mapping);
        setSelectedProductKey(selectedMapping.product_key_column || "");
        setSelectedLocationKey(selectedMapping.location_key_column || "");
        setSelectedHistoricalProductKey(selectedMapping.historical_product_key_column || "");
        setSelectedHistoricalLocationKey(selectedMapping.historical_location_key_column || "");
        setSelectedColumns(selectedMapping.selected_columns || []);
        setCurrentMapping(selectedMapping);
        setConfigStep('columns');
      } else {
        resetForm();
        setConfigStep('sources');
      }
      fetchDataPreviews();
    }
  }, [open, selectedMapping]);

  // Fetch previews of all data sources
  const fetchDataPreviews = async () => {
    setIsLoading(true);
    try {
      // Fetch historical sales preview
      const { data: historicalData } = await supabase
        .from('permanent_hierarchy_files')
        .select('data')
        .eq('hierarchy_type', 'historical_sales')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // Fetch product hierarchy preview
      const { data: productData } = await supabase
        .from('permanent_hierarchy_files')
        .select('data')
        .eq('hierarchy_type', 'product_hierarchy')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // Fetch location hierarchy preview
      const { data: locationData } = await supabase
        .from('permanent_hierarchy_files')
        .select('data')
        .eq('hierarchy_type', 'location_hierarchy')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      const previews = {
        historical: historicalData?.data && Array.isArray(historicalData.data) && historicalData.data.length > 0 
          ? { data: historicalData.data.slice(0, 5), columns: Object.keys(historicalData.data[0]) } 
          : null,
        product: productData?.data && Array.isArray(productData.data) && productData.data.length > 0 
          ? { data: productData.data.slice(0, 5), columns: Object.keys(productData.data[0]) } 
          : null,
        location: locationData?.data && Array.isArray(locationData.data) && locationData.data.length > 0 
          ? { data: locationData.data.slice(0, 5), columns: Object.keys(locationData.data[0]) } 
          : null
      };

      setDataPreviews(previews);

      // Set available columns for selection
      if (historicalData?.data && Array.isArray(historicalData.data) && historicalData.data.length > 0) {
        const columns = Object.keys(historicalData.data[0]);
        setAvailableColumns(columns);
      }
    } catch (error) {
      console.error('Error fetching data previews:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data previews",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = useCallback(() => {
    setMappingName("");
    setDescription("");
    setUseProductMapping(false);
    setUseLocationMapping(false);
    setSelectedProductKey("");
    setSelectedLocationKey("");
    setSelectedHistoricalProductKey("");
    setSelectedHistoricalLocationKey("");
    setSelectedColumns([]);
    setCurrentMapping(null);
    setConfigStep('sources');
  }, []);

  const handleSelectMapping = useCallback((config: ForecastMappingConfig) => {
    setCurrentMapping(config);
    setMappingName(config.mapping_name);
    setDescription(config.description || "");
    setUseProductMapping(config.use_product_mapping);
    setUseLocationMapping(config.use_location_mapping);
    setSelectedProductKey(config.product_key_column || "");
    setSelectedLocationKey(config.location_key_column || "");
    setSelectedHistoricalProductKey(config.historical_product_key_column || "");
    setSelectedHistoricalLocationKey(config.historical_location_key_column || "");
    setSelectedColumns(config.selected_columns || []);
    setConfigStep('columns');
  }, []);

  const handleActivate = useCallback((config: ForecastMappingConfig, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      onSave(config);
      toast({
        title: "Configuration Activated",
        description: "Selected mapping configuration: " + config.mapping_name,
      });
    } catch (error) {
      console.error("Error activating mapping:", error);
      toast({
        title: "Error",
        description: "Failed to activate mapping configuration",
        variant: "destructive",
      });
    }
  }, [onSave]);

  const handleToggleColumn = useCallback((column: string) => {
    setSelectedColumns(prev => {
      const isSelected = prev.includes(column);
      if (isSelected) {
        return prev.filter(c => c !== column);
      } else {
        return [...prev, column];
      }
    });
  }, []);

  const handleSave = useCallback(async () => {
    if (!mappingName) {
      toast({
        title: "Error",
        description: "Please provide a name for the configuration",
        variant: "destructive",
      });
      return;
    }

    if (selectedColumns.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one column",
        variant: "destructive",
      });
      return;
    }

    // Validate mapping configuration
    if (useProductMapping && (!selectedProductKey || !selectedHistoricalProductKey)) {
      toast({
        title: "Error",
        description: "Please select both product key columns for mapping",
        variant: "destructive",
      });
      return;
    }

    if (useLocationMapping && (!selectedLocationKey || !selectedHistoricalLocationKey)) {
      toast({
        title: "Error",
        description: "Please select both location key columns for mapping",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const newMapping = {
        mapping_name: mappingName,
        description,
        use_product_mapping: useProductMapping,
        use_location_mapping: useLocationMapping,
        product_key_column: selectedProductKey,
        location_key_column: selectedLocationKey,
        historical_product_key_column: selectedHistoricalProductKey,
        historical_location_key_column: selectedHistoricalLocationKey,
        selected_columns_array: selectedColumns, // Store as array instead of using selected_columns
        columns_config: JSON.stringify(selectedColumns), // Store as JSON string for backward compatibility
      };

      const { data, error } = await supabase
        .from("forecast_integration_mappings")
        .insert([newMapping])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Configuration saved successfully",
      });

      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving mapping:", error);
      toast({
        title: "Error",
        description: "Failed to save configuration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    mappingName,
    description,
    useProductMapping,
    useLocationMapping,
    selectedProductKey,
    selectedLocationKey,
    selectedHistoricalProductKey,
    selectedHistoricalLocationKey,
    selectedColumns,
    onOpenChange,
    resetForm,
  ]);

  const handleConfirmDelete = useCallback(() => {
    if (onDelete) {
      onDelete();
      setShowDeleteConfirm(false);
      // Dialog will be closed by the useIntegratedData hook after deletion
    }
  }, [onDelete]);

  const handleNextStep = () => {
    if (configStep === 'sources') {
      setConfigStep('mapping');
    } else if (configStep === 'mapping') {
      setConfigStep('columns');
    }
  };

  const handlePrevStep = () => {
    if (configStep === 'columns') {
      setConfigStep('mapping');
    } else if (configStep === 'mapping') {
      setConfigStep('sources');
    }
  };

  // Render table for data preview
  const renderDataPreviewTable = (data: any[] | null, columns: string[] | null) => {
    if (!data || !columns || data.length === 0) {
      return <div className="text-center p-4 text-muted-foreground">No data available</div>;
    }

    return (
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map(column => (
                <TableHead key={column} className="whitespace-nowrap">{column}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                {columns.map(column => (
                  <TableCell key={column} className="truncate max-w-[200px]">
                    {row[column]?.toString() || ''}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader className="sticky top-0 bg-background z-10 pb-4">
            <DialogTitle>Integration Mapping Configuration</DialogTitle>
            <DialogDescription>
              Configure how different data hierarchies should be mapped together
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Saved Configurations Section */}
            <div className="space-y-2">
              <Label>Saved Configurations</Label>
              <ScrollArea className="h-[150px] rounded-md border">
                <div className="p-4 space-y-2">
                  {savedMappings.map((config) => (
                    <Card
                      key={config.id}
                      onClick={() => handleSelectMapping(config)}
                      className={`p-4 cursor-pointer hover:border-primary transition-colors ${
                        currentMapping?.id === config.id ? "border-primary bg-primary/5" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{config.mapping_name}</h4>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Info className="h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80">
                                <div className="space-y-2">
                                  <h5 className="font-medium">Configuration Details</h5>
                                  <div className="text-sm">
                                    <p><span className="font-medium">Product Mapping:</span> {config.use_product_mapping ? "Yes" : "No"}</p>
                                    <p><span className="font-medium">Location Mapping:</span> {config.use_location_mapping ? "Yes" : "No"}</p>
                                    {config.description && (
                                      <p><span className="font-medium">Description:</span> {config.description}</p>
                                    )}
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                          {config.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {config.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => handleActivate(config, e)}
                            className="h-8 w-8 hover:bg-primary hover:text-primary-foreground"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          {currentMapping?.id === config.id && onDelete && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowDeleteConfirm(true);
                              }}
                              className="h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                  {savedMappings.length === 0 && (
                    <p className="text-muted-foreground text-sm p-2">No saved configurations</p>
                  )}
                </div>
              </ScrollArea>
            </div>

            <Separator />

            {/* Configuration Progress Indicator */}
            <div className="flex items-center justify-between mb-4">
              <div 
                className={`flex flex-col items-center ${configStep === 'sources' ? 'text-primary' : 'text-muted-foreground'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${configStep === 'sources' ? 'border-primary bg-primary/10' : 'border-muted-foreground bg-muted-foreground/10'}`}>
                  1
                </div>
                <span className="text-xs mt-1">Data Sources</span>
              </div>
              <div className={`w-12 h-0.5 ${configStep === 'sources' ? 'bg-muted-foreground/30' : 'bg-primary'}`} />
              <div 
                className={`flex flex-col items-center ${configStep === 'mapping' ? 'text-primary' : 'text-muted-foreground'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${configStep === 'mapping' ? 'border-primary bg-primary/10' : 'border-muted-foreground bg-muted-foreground/10'}`}>
                  2
                </div>
                <span className="text-xs mt-1">Mapping</span>
              </div>
              <div className={`w-12 h-0.5 ${configStep === 'columns' ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
              <div 
                className={`flex flex-col items-center ${configStep === 'columns' ? 'text-primary' : 'text-muted-foreground'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${configStep === 'columns' ? 'border-primary bg-primary/10' : 'border-muted-foreground bg-muted-foreground/10'}`}>
                  3
                </div>
                <span className="text-xs mt-1">Columns</span>
              </div>
            </div>

            {/* Step 1: Data Sources Preview */}
            {configStep === 'sources' && (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Available Data Sources</Label>
                    {isLoading && <span className="text-sm text-muted-foreground">Loading previews...</span>}
                  </div>
                  
                  <Tabs defaultValue="historical" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="historical" className="flex items-center gap-2">
                        <File className="h-4 w-4" />
                        <span>Historical Sales</span>
                        {dataPreviews.historical ? 
                          <Badge variant="outline" className="ml-1 bg-green-50 text-green-700 border-green-200">Available</Badge> : 
                          <Badge variant="outline" className="ml-1 bg-red-50 text-red-700 border-red-200">Missing</Badge>
                        }
                      </TabsTrigger>
                      <TabsTrigger value="product" className="flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        <span>Product Hierarchy</span>
                        {dataPreviews.product ? 
                          <Badge variant="outline" className="ml-1 bg-green-50 text-green-700 border-green-200">Available</Badge> : 
                          <Badge variant="outline" className="ml-1 bg-red-50 text-red-700 border-red-200">Missing</Badge>
                        }
                      </TabsTrigger>
                      <TabsTrigger value="location" className="flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        <span>Location Hierarchy</span>
                        {dataPreviews.location ? 
                          <Badge variant="outline" className="ml-1 bg-green-50 text-green-700 border-green-200">Available</Badge> : 
                          <Badge variant="outline" className="ml-1 bg-red-50 text-red-700 border-red-200">Missing</Badge>
                        }
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="historical" className="mt-4">
                      <Card className="p-2">
                        <h3 className="text-sm font-medium mb-2 px-2">Historical Sales Preview</h3>
                        <ScrollArea className="h-[300px]">
                          {renderDataPreviewTable(
                            dataPreviews.historical?.data || null, 
                            dataPreviews.historical?.columns || null
                          )}
                        </ScrollArea>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="product" className="mt-4">
                      <Card className="p-2">
                        <h3 className="text-sm font-medium mb-2 px-2">Product Hierarchy Preview</h3>
                        <ScrollArea className="h-[300px]">
                          {renderDataPreviewTable(
                            dataPreviews.product?.data || null, 
                            dataPreviews.product?.columns || null
                          )}
                        </ScrollArea>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="location" className="mt-4">
                      <Card className="p-2">
                        <h3 className="text-sm font-medium mb-2 px-2">Location Hierarchy Preview</h3>
                        <ScrollArea className="h-[300px]">
                          {renderDataPreviewTable(
                            dataPreviews.location?.data || null, 
                            dataPreviews.location?.columns || null
                          )}
                        </ScrollArea>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Configuration Name</Label>
                  <Input
                    id="name"
                    value={mappingName}
                    onChange={(e) => setMappingName(e.target.value)}
                    placeholder="Enter configuration name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter configuration description"
                  />
                </div>
              </>
            )}

            {/* Step 2: Mapping Configuration */}
            {configStep === 'mapping' && (
              <div className="space-y-6">
                <div className="rounded-md border p-4 bg-blue-50">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800">Mapping Data Hierarchies</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Define how product and location data should be mapped between historical sales and your
                        hierarchies. This helps the system link sales data with the correct products and locations.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Product Mapping Section */}
                  <Card className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="useProductMapping"
                          checked={useProductMapping}
                          onCheckedChange={(checked) => setUseProductMapping(checked as boolean)}
                        />
                        <label
                          htmlFor="useProductMapping"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Use Product Mapping
                        </label>
                      </div>

                      {useProductMapping && (
                        <div className="space-y-4 mt-2">
                          <div className="grid grid-cols-3 gap-4 items-center">
                            <div className="space-y-2 col-span-1">
                              <Label htmlFor="historicalProductKey">Historical Product Key</Label>
                              <Select
                                value={selectedHistoricalProductKey}
                                onValueChange={setSelectedHistoricalProductKey}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select column" />
                                </SelectTrigger>
                                <SelectContent>
                                  {dataPreviews.historical?.columns.map((column) => (
                                    <SelectItem key={column} value={column}>
                                      {column}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="flex justify-center items-center">
                              <ArrowRight className="h-5 w-5 text-muted-foreground" />
                            </div>
                            
                            <div className="space-y-2 col-span-1">
                              <Label htmlFor="productKey">Product Hierarchy Key</Label>
                              <Select
                                value={selectedProductKey}
                                onValueChange={setSelectedProductKey}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select column" />
                                </SelectTrigger>
                                <SelectContent>
                                  {dataPreviews.product?.columns.map((column) => (
                                    <SelectItem key={column} value={column}>
                                      {column}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          {selectedHistoricalProductKey && selectedProductKey && (
                            <div className="rounded-md border p-3 bg-green-50">
                              <div className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-green-700">
                                  Products in historical sales will be matched with product hierarchy using these keys
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* Location Mapping Section */}
                  <Card className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="useLocationMapping"
                          checked={useLocationMapping}
                          onCheckedChange={(checked) => setUseLocationMapping(checked as boolean)}
                        />
                        <label
                          htmlFor="useLocationMapping"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Use Location Mapping
                        </label>
                      </div>

                      {useLocationMapping && (
                        <div className="space-y-4 mt-2">
                          <div className="grid grid-cols-3 gap-4 items-center">
                            <div className="space-y-2 col-span-1">
                              <Label htmlFor="historicalLocationKey">Historical Location Key</Label>
                              <Select
                                value={selectedHistoricalLocationKey}
                                onValueChange={setSelectedHistoricalLocationKey}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select column" />
                                </SelectTrigger>
                                <SelectContent>
                                  {dataPreviews.historical?.columns.map((column) => (
                                    <SelectItem key={column} value={column}>
                                      {column}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="flex justify-center items-center">
                              <ArrowRight className="h-5 w-5 text-muted-foreground" />
                            </div>
                            
                            <div className="space-y-2 col-span-1">
                              <Label htmlFor="locationKey">Location Hierarchy Key</Label>
                              <Select
                                value={selectedLocationKey}
                                onValueChange={setSelectedLocationKey}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select column" />
                                </SelectTrigger>
                                <SelectContent>
                                  {dataPreviews.location?.columns.map((column) => (
                                    <SelectItem key={column} value={column}>
                                      {column}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          {selectedHistoricalLocationKey && selectedLocationKey && (
                            <div className="rounded-md border p-3 bg-green-50">
                              <div className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-green-700">
                                  Locations in historical sales will be matched with location hierarchy using these keys
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {/* Step 3: Column Selection */}
            {configStep === 'columns' && (
              <div className="space-y-4">
                <div className="rounded-md border p-4 bg-blue-50">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800">Select Columns to Include</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Choose which columns from your historical sales data to include in the integrated dataset.
                        These columns will be available for forecasting and analysis.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Column Selection</Label>
                  <ScrollArea className="h-[300px] rounded-md border">
                    <div className="p-4 space-y-2">
                      {availableColumns.map((column) => (
                        <div key={column} className="flex items-center space-x-2">
                          <Checkbox
                            id={`column-${column}`}
                            checked={selectedColumns.includes(column)}
                            onCheckedChange={() => handleToggleColumn(column)}
                          />
                          <label
                            htmlFor={`column-${column}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {column}
                          </label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                <div className="rounded-md border p-3 bg-amber-50">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-700">
                      Selected columns: {selectedColumns.length}/{availableColumns.length}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="sticky bottom-0 bg-background pt-4">
            <div className="flex justify-between w-full">
              {currentMapping && onDelete && configStep === 'columns' && (
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteConfirm(true)}
                  type="button"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
              <div className="flex gap-2 ml-auto">
                {configStep !== 'sources' && (
                  <Button variant="outline" onClick={handlePrevStep}>
                    Back
                  </Button>
                )}
                
                {configStep !== 'columns' ? (
                  <Button onClick={handleNextStep}>
                    Next
                  </Button>
                ) : (
                  <Button onClick={handleSave} disabled={isLoading}>
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? "Saving..." : "Save Configuration"}
                  </Button>
                )}
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Mapping Configuration</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the "{currentMapping?.mapping_name}" configuration?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
