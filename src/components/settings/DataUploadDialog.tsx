
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Download, Upload, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface DataTemplate {
  required_columns: string[];
  optional_columns: string[];
  sample_row: Record<string, string | number>;
}

interface ValidationRules {
  data_types?: Record<string, string>;
  required_columns: string[];
  constraints?: {
    min_rows?: number;
    max_rows?: number;
    allow_duplicates?: boolean;
  };
}

interface ValidationError {
  row: number;
  column: string;
  message: string;
}

interface DataUploadDialogProps {
  module: Database["public"]["Enums"]["module_type"];
  onDataUploaded: () => void;
}

export function DataUploadDialog({ module, onDataUploaded }: DataUploadDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const downloadTemplate = async () => {
    try {
      const { data, error } = await supabase
        .from('module_settings')
        .select('data_template, validation_rules')
        .eq('module', module)
        .single();

      if (error) throw error;

      const template = data.data_template as unknown as DataTemplate;
      if (!template || !template.required_columns || !template.sample_row) {
        throw new Error('Invalid template format');
      }

      const allColumns = [...template.required_columns, ...(template.optional_columns || [])];
      const csvHeader = allColumns.join(',');
      const csvRow = allColumns.map(col => template.sample_row[col] || '').join(',');
      const csvContent = `${csvHeader}\n${csvRow}`;

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${module}_data_template.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Template Downloaded",
        description: "You can now fill in your data using this template",
      });
    } catch (error) {
      console.error('Error downloading template:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to download template",
      });
    }
  };

  const validateData = async (headers: string[], rows: string[][]): Promise<ValidationError[]> => {
    const errors: ValidationError[] = [];
    
    try {
      const { data: settings } = await supabase
        .from('module_settings')
        .select('validation_rules, data_template')
        .eq('module', module)
        .single();

      if (!settings) throw new Error('Module settings not found');

      const rules = settings.validation_rules as unknown as ValidationRules;
      const template = settings.data_template as unknown as DataTemplate;

      // Check required columns
      const missingColumns = template.required_columns.filter(col => !headers.includes(col));
      if (missingColumns.length > 0) {
        errors.push({
          row: 0,
          column: missingColumns.join(', '),
          message: `Missing required columns: ${missingColumns.join(', ')}`
        });
      }

      // Validate each row
      rows.forEach((row, index) => {
        const rowNumber = index + 1;
        headers.forEach((header, colIndex) => {
          const value = row[colIndex];
          const dataType = rules.data_types?.[header];

          if (dataType) {
            switch (dataType) {
              case 'numeric':
                if (value && isNaN(Number(value))) {
                  errors.push({
                    row: rowNumber,
                    column: header,
                    message: `Invalid numeric value: ${value}`
                  });
                }
                break;
              case 'date':
                if (value && isNaN(Date.parse(value))) {
                  errors.push({
                    row: rowNumber,
                    column: header,
                    message: `Invalid date format: ${value}`
                  });
                }
                break;
              case 'integer':
                if (value && (!Number.isInteger(Number(value)) || isNaN(Number(value)))) {
                  errors.push({
                    row: rowNumber,
                    column: header,
                    message: `Invalid integer value: ${value}`
                  });
                }
                break;
            }
          }
        });
      });

    } catch (error) {
      console.error('Validation error:', error);
      errors.push({
        row: 0,
        column: 'general',
        message: 'Failed to validate data'
      });
    }

    return errors;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'text/csv') {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please upload a CSV file",
        });
        return;
      }
      setFile(file);
      setValidationErrors([]);
      setProgress(0);
    }
  };

  const processUpload = async () => {
    if (!file) return;

    try {
      setIsValidating(true);
      setProgress(10);

      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        const rows = text.split('\n');
        const headers = rows[0].split(',').map(h => h.trim());
        const dataRows = rows.slice(1).filter(row => row.trim());
        
        setProgress(30);
        
        // Validate data
        const errors = await validateData(headers, dataRows.map(row => row.split(',')));
        setValidationErrors(errors);
        
        setProgress(50);

        if (errors.length > 0) {
          // Log validation errors
          await supabase.from('data_validation_logs').insert({
            module,
            file_name: file.name,
            row_count: dataRows.length,
            error_count: errors.length,
            validation_errors: errors as unknown as Record<string, unknown>[],
            status: 'failed'
          });

          toast({
            variant: "destructive",
            title: "Validation Failed",
            description: `Found ${errors.length} errors in the data`,
          });
          setIsValidating(false);
          return;
        }

        setProgress(70);

        // Process data rows based on module type
        const { error } = await processDataByModule(module, headers, dataRows);

        if (error) throw error;

        // Log successful validation
        await supabase.from('data_validation_logs').insert({
          module,
          file_name: file.name,
          row_count: dataRows.length,
          error_count: 0,
          status: 'completed'
        });

        setProgress(100);
        
        toast({
          title: "Success",
          description: `Data uploaded successfully for ${module} module`,
        });
        setIsOpen(false);
        onDataUploaded();
      };

      reader.readAsText(file);
    } catch (error) {
      console.error('Error processing upload:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process upload",
      });
    } finally {
      setIsValidating(false);
      setProgress(0);
    }
  };

  const processDataByModule = async (
    module: Database["public"]["Enums"]["module_type"],
    headers: string[],
    dataRows: string[]
  ) => {
    const parseRow = (row: string) => {
      const values = row.split(',').map(v => v.trim());
      const rowData: Record<string, any> = {};
      headers.forEach((header, index) => {
        rowData[header] = values[index] || null;
      });
      return rowData;
    };

    switch (module) {
      case 'forecasting':
        const forecastData = dataRows.map(row => {
          const data = parseRow(row);
          return {
            date: data.date,
            value: parseFloat(data.value),
            category: data.category,
            subcategory: data.subcategory,
            sku: data.sku,
            region: data.region,
            city: data.city,
            channel: data.channel,
            warehouse: data.warehouse,
            notes: data.notes
          };
        });
        return await supabase.from('forecast_data').insert(forecastData);

      case 'inventory':
        const inventoryData = dataRows.map(row => {
          const data = parseRow(row);
          return {
            sku: data.sku,
            name: data.name,
            current_stock: parseInt(data.current_stock),
            min_stock: parseInt(data.min_stock),
            max_stock: parseInt(data.max_stock),
            category: data.category,
            subcategory: data.subcategory,
            location: data.location,
            product_family: data.product_family,
            region: data.region,
            city: data.city,
            channel: data.channel,
            warehouse: data.warehouse,
            notes: data.notes
          };
        });
        return await supabase.from('inventory_data').insert(inventoryData);

      case 'sales':
        const salesData = dataRows.map(row => {
          const data = parseRow(row);
          return {
            date: data.date,
            sku: data.sku,
            quantity: parseInt(data.quantity),
            price: parseFloat(data.price),
            total: parseFloat(data.total),
            category: data.category,
            subcategory: data.subcategory,
            region: data.region,
            city: data.city,
            channel: data.channel,
            warehouse: data.warehouse,
            customer: data.customer,
            payment_method: data.payment_method,
            notes: data.notes
          };
        });
        return await supabase.from('sales_data').insert(salesData);

      case 'marketing':
        const marketingData = dataRows.map(row => {
          const data = parseRow(row);
          return {
            campaign_name: data.campaign_name,
            start_date: data.start_date,
            end_date: data.end_date,
            budget: parseFloat(data.budget),
            target_audience: data.target_audience,
            channel: data.channel,
            region: data.region,
            city: data.city,
            product_category: data.product_category,
            expected_roi: data.expected_roi ? parseFloat(data.expected_roi) : null,
            kpis: data.kpis,
            notes: data.notes
          };
        });
        return await supabase.from('marketing_data').insert(marketingData);

      case 'logistics':
        const logisticsData = dataRows.map(row => {
          const data = parseRow(row);
          return {
            shipment_id: data.shipment_id,
            date: data.date,
            origin: data.origin,
            destination: data.destination,
            status: data.status,
            carrier: data.carrier,
            tracking_number: data.tracking_number,
            estimated_delivery: data.estimated_delivery,
            actual_delivery: data.actual_delivery,
            weight: data.weight ? parseFloat(data.weight) : null,
            cost: data.cost ? parseFloat(data.cost) : null,
            type: data.type,
            priority: data.priority,
            notes: data.notes
          };
        });
        return await supabase.from('logistics_data').insert(logisticsData);

      default:
        throw new Error(`Unsupported module: ${module}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Data
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload {module} Data</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-4">
            <Button variant="outline" onClick={downloadTemplate} className="gap-2">
              <Download className="h-4 w-4" />
              Download Template
            </Button>
            
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="cursor-pointer"
              disabled={isValidating}
            />

            {isValidating && (
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-muted-foreground text-center">
                  Validating and processing data...
                </p>
              </div>
            )}

            {validationErrors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p>Found {validationErrors.length} errors:</p>
                    <ul className="list-disc pl-4 max-h-32 overflow-y-auto">
                      {validationErrors.slice(0, 5).map((error, index) => (
                        <li key={index} className="text-sm">
                          Row {error.row}: {error.message}
                        </li>
                      ))}
                      {validationErrors.length > 5 && (
                        <li className="text-sm">
                          ... and {validationErrors.length - 5} more errors
                        </li>
                      )}
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {file && !isValidating && (
              <Button onClick={processUpload} className="gap-2" disabled={validationErrors.length > 0}>
                <Upload className="h-4 w-4" />
                Process Upload
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
