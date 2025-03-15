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
import { Info, X, Check, Save, Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

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
      } else {
        resetForm();
      }
    }
  }, [open, selectedMapping]);

  // Fetch available columns
  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const { data: historicalData } = await supabase
          .from('permanent_hierarchy_files')
          .select('data')
          .eq('hierarchy_type', 'historical_sales')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (historicalData?.data && Array.isArray(historicalData.data) && historicalData.data.length > 0) {
          const firstRow = historicalData.data[0];
          const columns = Object.keys(firstRow);
          setAvailableColumns(columns);
        }
      } catch (error) {
        console.error('Error fetching columns:', error);
        toast({
          title: "Error",
          description: "Failed to fetch available columns",
          variant: "destructive",
        });
      }
    };

    if (open) {
      fetchColumns();
    }
  }, [open]);

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
        selected_columns: selectedColumns,
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

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
          <DialogHeader className="sticky top-0 bg-background z-10 pb-4">
            <DialogTitle>Integration Mapping Configuration</DialogTitle>
            <DialogDescription>
              Configure how different data hierarchies should be mapped together
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Saved Configurations</Label>
              <ScrollArea className="h-[200px] rounded-md border">
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
                              }}
                              className="h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
                            >
                              <X className="h-4 w-4" />
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

            <div className="space-y-4">
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

              <div className="space-y-2">
                <Label>Column Selection</Label>
                <ScrollArea className="h-[200px] rounded-md border">
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

              <div className="space-y-2">
                <Label>Mapping Options</Label>
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
                    <div className="space-y-2 pl-6">
                      <div className="space-y-2">
                        <Label htmlFor="productKey">Product Key Column</Label>
                        <Select
                          value={selectedProductKey}
                          onValueChange={setSelectedProductKey}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select product key column" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedColumns.map((column) => (
                              <SelectItem key={column} value={column}>
                                {column}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="historicalProductKey">Historical Product Key Column</Label>
                        <Select
                          value={selectedHistoricalProductKey}
                          onValueChange={setSelectedHistoricalProductKey}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select historical product key column" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedColumns.map((column) => (
                              <SelectItem key={column} value={column}>
                                {column}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

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
                    <div className="space-y-2 pl-6">
                      <div className="space-y-2">
                        <Label htmlFor="locationKey">Location Key Column</Label>
                        <Select
                          value={selectedLocationKey}
                          onValueChange={setSelectedLocationKey}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select location key column" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedColumns.map((column) => (
                              <SelectItem key={column} value={column}>
                                {column}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="historicalLocationKey">Historical Location Key Column</Label>
                        <Select
                          value={selectedHistoricalLocationKey}
                          onValueChange={setSelectedHistoricalLocationKey}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select historical location key column" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedColumns.map((column) => (
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
              </div>
            </div>
          </div>

          <DialogFooter className="sticky bottom-0 bg-background pt-4">
            <div className="flex justify-between w-full">
              {currentMapping && onDelete && (
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteConfirm(true)}
                  type="button"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Saving..." : "Save New Configuration"}
                </Button>
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
