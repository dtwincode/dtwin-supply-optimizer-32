
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
import { ForecastMappingConfig } from "./types";

interface MappingConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (mapping: ForecastMappingConfig) => void;
}

export function MappingConfigDialog({ open, onOpenChange, onSave }: MappingConfigDialogProps) {
  const [mappingName, setMappingName] = useState("");
  const [description, setDescription] = useState("");
  const [mappingType, setMappingType] = useState<'location' | 'product'>('product');
  const [productColumns, setProductColumns] = useState<string[]>([]);
  const [locationColumns, setLocationColumns] = useState<string[]>([]);
  const [historicalColumns, setHistoricalColumns] = useState<string[]>([]);
  const [selectedProductKey, setSelectedProductKey] = useState<string>("");
  const [selectedLocationKey, setSelectedLocationKey] = useState<string>("");
  const [selectedHistoricalKey, setSelectedHistoricalKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchColumns = async () => {
      setIsLoading(true);
      try {
        // Fetch columns from permanent_hierarchy_files
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
    if (!mappingName || !selectedHistoricalKey || 
        (mappingType === 'product' && !selectedProductKey) || 
        (mappingType === 'location' && !selectedLocationKey)) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
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
          product_hierarchy_mapping: mappingType === 'product' ? { key_column: selectedProductKey } : {},
          location_hierarchy_mapping: mappingType === 'location' ? { key_column: selectedLocationKey } : {},
          historical_sales_mapping: { key_column: selectedHistoricalKey },
          product_key_column: mappingType === 'product' ? selectedProductKey : null,
          location_key_column: mappingType === 'location' ? selectedLocationKey : null,
          historical_key_column: selectedHistoricalKey,
          mapping_type: mappingType,
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
            <Label>Mapping Type</Label>
            <Select value={mappingType} onValueChange={(value: 'location' | 'product') => setMappingType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select mapping type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="product">Product-based</SelectItem>
                <SelectItem value="location">Location-based</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {mappingType === 'product' && (
            <div className="grid gap-2">
              <Label>Product Key Column</Label>
              <Select value={selectedProductKey} onValueChange={setSelectedProductKey}>
                <SelectTrigger>
                  <SelectValue placeholder="Select product key column" />
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
          )}

          {mappingType === 'location' && (
            <div className="grid gap-2">
              <Label>Location Key Column</Label>
              <Select value={selectedLocationKey} onValueChange={setSelectedLocationKey}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location key column" />
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
          )}

          <div className="grid gap-2">
            <Label>Historical Sales Key Column</Label>
            <Select value={selectedHistoricalKey} onValueChange={setSelectedHistoricalKey}>
              <SelectTrigger>
                <SelectValue placeholder="Select historical key column" />
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
