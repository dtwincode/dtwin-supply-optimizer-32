
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

interface MappingConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (mapping: ForecastMappingConfig) => void;
}

export function MappingConfigDialog({ open, onOpenChange, onSave }: MappingConfigDialogProps) {
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
          is_active: true,
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Integration Mapping Configuration</DialogTitle>
          <DialogDescription>
            Configure how different data hierarchies should be mapped together
          </DialogDescription>
        </DialogHeader>

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

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Configuration"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
