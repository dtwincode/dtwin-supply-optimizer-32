import { useState, useEffect } from "react";
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
import { Info, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface MappingConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (mapping: ForecastMappingConfig) => void;
  selectedMapping?: ForecastMappingConfig | null;
  onDelete?: () => void;
  savedMappings: ForecastMappingConfig[];
}

export function MappingConfigDialog({ 
  open, 
  onOpenChange, 
  onSave,
  selectedMapping,
  onDelete,
  savedMappings
}: MappingConfigDialogProps) {
  const [mappingName, setMappingName] = useState("");
  const [description, setDescription] = useState("");
  const [useProductMapping, setUseProductMapping] = useState(false);
  const [useLocationMapping, setUseLocationMapping] = useState(false);
  const [productColumns, setProductColumns] = useState<string[]>([]);
  const [locationColumns, setLocationColumns] = useState<string[]>([]);
  const [historicalColumns, setHistoricalColumns] = useState<string[]>([]);
  const [selectedProductKey, setSelectedProductKey] = useState<string>("");
  const [selectedLocationKey, setSelectedLocationKey] = useState<string>("");
  const [selectedHistoricalProductKey, setSelectedHistoricalProductKey] = useState<string>("");
  const [selectedHistoricalLocationKey, setSelectedHistoricalLocationKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentMapping, setCurrentMapping] = useState<ForecastMappingConfig | null>(null);

  useEffect(() => {
    const fetchColumns = async () => {
      setIsLoading(true);
      try {
        const { data: productData } = await supabase
          .from('permanent_hierarchy_files')
          .select('data')
          .eq('hierarchy_type', 'product_hierarchy')
          .order('created_at', { ascending: false })
          .limit(1);

        const { data: locationData } = await supabase
          .from('permanent_hierarchy_files')
          .select('data')
          .eq('hierarchy_type', 'location_hierarchy')
          .order('created_at', { ascending: false })
          .limit(1);

        const { data: historicalData } = await supabase
          .from('permanent_hierarchy_files')
          .select('data')
          .eq('hierarchy_type', 'historical_sales')
          .order('created_at', { ascending: false })
          .limit(1);

        if (productData?.[0]?.data) {
          const sampleRow = Array.isArray(productData[0].data) ? productData[0].data[0] : {};
          setProductColumns(Object.keys(sampleRow));
        }

        if (locationData?.[0]?.data) {
          const sampleRow = Array.isArray(locationData[0].data) ? locationData[0].data[0] : {};
          setLocationColumns(Object.keys(sampleRow));
        }

        if (historicalData?.[0]?.data) {
          const sampleRow = Array.isArray(historicalData[0].data) ? historicalData[0].data[0] : {};
          setHistoricalColumns(Object.keys(sampleRow));
        }
      } catch (error) {
        console.error('Error fetching columns:', error);
        toast({
          title: "Error",
          description: "Failed to fetch columns from hierarchies",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (open) {
      fetchColumns();
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      setCurrentMapping(null);
      setMappingName("");
      setDescription("");
      setUseProductMapping(false);
      setUseLocationMapping(false);
      setSelectedProductKey("");
      setSelectedLocationKey("");
      setSelectedHistoricalProductKey("");
      setSelectedHistoricalLocationKey("");
    }
  }, [open]);

  const handleSelectMapping = (config: ForecastMappingConfig) => {
    try {
      setCurrentMapping(config);
      setMappingName(config.mapping_name);
      setDescription(config.description || '');
      setUseProductMapping(config.use_product_mapping);
      setUseLocationMapping(config.use_location_mapping);
      setSelectedProductKey(config.product_key_column || '');
      setSelectedLocationKey(config.location_key_column || '');
      setSelectedHistoricalProductKey(config.historical_product_key_column || '');
      setSelectedHistoricalLocationKey(config.historical_location_key_column || '');
      onSave(config);
      
      toast({
        title: "Configuration Selected",
        description: "Selected mapping configuration: " + config.mapping_name,
      });
    } catch (error) {
      console.error('Error selecting mapping:', error);
      toast({
        title: "Error",
        description: "Failed to select mapping configuration",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!currentMapping) {
      toast({
        title: "Error",
        description: "No mapping configuration selected",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('forecast_integration_mappings')
        .delete()
        .eq('id', currentMapping.id);

      if (error) throw error;

      onDelete?.();
      setCurrentMapping(null);
      setMappingName("");
      setDescription("");
      setUseProductMapping(false);
      setUseLocationMapping(false);
      setSelectedProductKey("");
      setSelectedLocationKey("");
      setSelectedHistoricalProductKey("");
      setSelectedHistoricalLocationKey("");

      toast({
        title: "Success",
        description: "Mapping configuration deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting mapping:', error);
      toast({
        title: "Error",
        description: "Failed to delete mapping configuration",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    if (!mappingName || 
        (!selectedHistoricalProductKey && !selectedHistoricalLocationKey) ||
        (!selectedProductKey && !selectedLocationKey) ||
        (!useProductMapping && !useLocationMapping)) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and select at least one mapping type with corresponding keys",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('forecast_integration_mappings')
        .insert({
          mapping_name: mappingName,
          description,
          product_hierarchy_mapping: useProductMapping ? { 
            key_column: selectedProductKey,
            historical_key_column: selectedHistoricalProductKey
          } : {},
          location_hierarchy_mapping: useLocationMapping ? { 
            key_column: selectedLocationKey,
            historical_key_column: selectedHistoricalLocationKey
          } : {},
          historical_sales_mapping: { 
            product_key_column: selectedHistoricalProductKey,
            location_key_column: selectedHistoricalLocationKey
          },
          product_key_column: useProductMapping ? selectedProductKey : null,
          location_key_column: useLocationMapping ? selectedLocationKey : null,
          historical_product_key_column: useProductMapping ? selectedHistoricalProductKey : null,
          historical_location_key_column: useLocationMapping ? selectedHistoricalLocationKey : null,
          use_product_mapping: useProductMapping,
          use_location_mapping: useLocationMapping,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      onSave(data as ForecastMappingConfig);
      onOpenChange(false);
      toast({
        title: "Success",
        description: "Mapping configuration saved successfully",
      });
    } catch (error) {
      console.error('Error saving mapping:', error);
      toast({
        title: "Error",
        description: "Failed to save mapping configuration",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
        <DialogHeader className="sticky top-0 bg-background z-10 pb-4">
          <DialogTitle>Integration Mapping Configuration</DialogTitle>
          <DialogDescription>
            Configure how different data hierarchies should be mapped together
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label>Saved Configurations</Label>
          <ScrollArea className="h-[200px] rounded-md border">
            <div className="p-4 space-y-2">
              {savedMappings.map((config) => (
                <Card
                  key={config.id}
                  onClick={() => handleSelectMapping(config)}
                  className={`p-4 cursor-pointer hover:border-primary transition-colors ${
                    currentMapping?.id === config.id ? 'border-primary bg-primary/5' : ''
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
                                <p><span className="font-medium">Product Mapping:</span> {config.use_product_mapping ? 'Yes' : 'No'}</p>
                                <p><span className="font-medium">Location Mapping:</span> {config.use_location_mapping ? 'Yes' : 'No'}</p>
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
                    {currentMapping?.id === config.id && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete?.();
                        }}
                        className="h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
              {savedMappings.length === 0 && (
                <p className="text-muted-foreground text-sm p-2">No saved configurations</p>
              )}
            </div>
          </ScrollArea>
        </div>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Mapping Name</Label>
            <Input
              id="name"
              value={mappingName}
              onChange={(e) => setMappingName(e.target.value)}
              placeholder="Enter mapping name"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter mapping description"
            />
          </div>

          <div className="grid gap-2">
            <Label>Mapping Types</Label>
            <div className="flex flex-col gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="product-mapping"
                  checked={useProductMapping}
                  onCheckedChange={(checked) => setUseProductMapping(checked as boolean)}
                />
                <Label htmlFor="product-mapping">Product-based Mapping</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="location-mapping"
                  checked={useLocationMapping}
                  onCheckedChange={(checked) => setUseLocationMapping(checked as boolean)}
                />
                <Label htmlFor="location-mapping">Location-based Mapping</Label>
              </div>
            </div>
          </div>

          {useProductMapping && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>Product Hierarchy Key Column</Label>
                <Select value={selectedProductKey} onValueChange={setSelectedProductKey}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product hierarchy key column" />
                  </SelectTrigger>
                  <SelectContent>
                    {productColumns.map((column) => (
                      <SelectItem key={column} value={column}>
                        {column}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Historical Sales Product Key Column</Label>
                <Select value={selectedHistoricalProductKey} onValueChange={setSelectedHistoricalProductKey}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select historical sales product key" />
                  </SelectTrigger>
                  <SelectContent>
                    {historicalColumns.map((column) => (
                      <SelectItem key={column} value={column}>
                        {column}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {useLocationMapping && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>Location Hierarchy Key Column</Label>
                <Select value={selectedLocationKey} onValueChange={setSelectedLocationKey}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location hierarchy key column" />
                  </SelectTrigger>
                  <SelectContent>
                    {locationColumns.map((column) => (
                      <SelectItem key={column} value={column}>
                        {column}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Historical Sales Location Key Column</Label>
                <Select value={selectedHistoricalLocationKey} onValueChange={setSelectedHistoricalLocationKey}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select historical sales location key" />
                  </SelectTrigger>
                  <SelectContent>
                    {historicalColumns.map((column) => (
                      <SelectItem key={column} value={column}>
                        {column}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="sticky bottom-0 bg-background pt-4">
          <div className="flex justify-between w-full">
            {currentMapping && (
              <Button
                variant="destructive"
                onClick={handleDelete}
                type="button"
              >
                Delete
              </Button>
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Configuration"}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
