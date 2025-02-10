
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Download, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

interface DataTemplate {
  required_columns: string[];
  optional_columns: string[];
  sample_row: Record<string, string | number>;
}

interface DataUploadDialogProps {
  module: Database["public"]["Enums"]["module_type"];
  onDataUploaded: () => void;
}

export function DataUploadDialog({ module, onDataUploaded }: DataUploadDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const downloadTemplate = async () => {
    try {
      const { data, error } = await supabase
        .from('module_settings')
        .select('data_template')
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
    }
  };

  const processUpload = async () => {
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        const rows = text.split('\n');
        const headers = rows[0].split(',').map(h => h.trim());

        const { data: templateData } = await supabase
          .from('module_settings')
          .select('data_template')
          .eq('module', module)
          .single();

        const template = templateData?.data_template as unknown as DataTemplate;
        if (!template || !template.required_columns) {
          throw new Error('Invalid template format');
        }

        const missingColumns = template.required_columns.filter(col => !headers.includes(col));

        if (missingColumns.length > 0) {
          toast({
            variant: "destructive",
            title: "Invalid Format",
            description: `Missing required columns: ${missingColumns.join(', ')}`,
          });
          return;
        }

        // Process data rows based on module
        const dataRows = rows.slice(1).filter(row => row.trim());
        let error;

        switch (module) {
          case 'forecasting':
            const forecastData = dataRows.map(row => {
              const values = row.split(',').map(v => v.trim());
              return {
                date: values[headers.indexOf('date')],
                value: parseFloat(values[headers.indexOf('value')]),
                category: values[headers.indexOf('category')] || null,
                subcategory: values[headers.indexOf('subcategory')] || null,
                sku: values[headers.indexOf('sku')] || null,
                region: values[headers.indexOf('region')] || null,
                city: values[headers.indexOf('city')] || null,
                channel: values[headers.indexOf('channel')] || null,
                warehouse: values[headers.indexOf('warehouse')] || null,
                notes: values[headers.indexOf('notes')] || null
              };
            });
            ({ error } = await supabase.from('forecast_data').insert(forecastData));
            break;

          case 'inventory':
            const inventoryData = dataRows.map(row => {
              const values = row.split(',').map(v => v.trim());
              return {
                sku: values[headers.indexOf('sku')],
                name: values[headers.indexOf('name')],
                current_stock: parseInt(values[headers.indexOf('current_stock')]),
                min_stock: parseInt(values[headers.indexOf('min_stock')]),
                max_stock: parseInt(values[headers.indexOf('max_stock')]),
                category: values[headers.indexOf('category')] || null,
                subcategory: values[headers.indexOf('subcategory')] || null,
                location: values[headers.indexOf('location')] || null,
                product_family: values[headers.indexOf('product_family')] || null,
                region: values[headers.indexOf('region')] || null,
                city: values[headers.indexOf('city')] || null,
                channel: values[headers.indexOf('channel')] || null,
                warehouse: values[headers.indexOf('warehouse')] || null,
                notes: values[headers.indexOf('notes')] || null
              };
            });
            ({ error } = await supabase.from('inventory_data').insert(inventoryData));
            break;

          case 'sales':
            const salesData = dataRows.map(row => {
              const values = row.split(',').map(v => v.trim());
              return {
                date: values[headers.indexOf('date')],
                sku: values[headers.indexOf('sku')],
                quantity: parseInt(values[headers.indexOf('quantity')]),
                price: parseFloat(values[headers.indexOf('price')]),
                total: parseFloat(values[headers.indexOf('total')]),
                category: values[headers.indexOf('category')] || null,
                subcategory: values[headers.indexOf('subcategory')] || null,
                region: values[headers.indexOf('region')] || null,
                city: values[headers.indexOf('city')] || null,
                channel: values[headers.indexOf('channel')] || null,
                warehouse: values[headers.indexOf('warehouse')] || null,
                customer: values[headers.indexOf('customer')] || null,
                payment_method: values[headers.indexOf('payment_method')] || null,
                notes: values[headers.indexOf('notes')] || null
              };
            });
            ({ error } = await supabase.from('sales_data').insert(salesData));
            break;

          case 'marketing':
            const marketingData = dataRows.map(row => {
              const values = row.split(',').map(v => v.trim());
              return {
                campaign_name: values[headers.indexOf('campaign_name')],
                start_date: values[headers.indexOf('start_date')],
                end_date: values[headers.indexOf('end_date')],
                budget: parseFloat(values[headers.indexOf('budget')]),
                target_audience: values[headers.indexOf('target_audience')],
                channel: values[headers.indexOf('channel')] || null,
                region: values[headers.indexOf('region')] || null,
                city: values[headers.indexOf('city')] || null,
                product_category: values[headers.indexOf('product_category')] || null,
                expected_roi: values[headers.indexOf('expected_roi')] ? parseFloat(values[headers.indexOf('expected_roi')]) : null,
                kpis: values[headers.indexOf('kpis')] || null,
                notes: values[headers.indexOf('notes')] || null
              };
            });
            ({ error } = await supabase.from('marketing_data').insert(marketingData));
            break;
        }

        if (error) throw error;

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
            />
            {file && (
              <Button onClick={processUpload} className="gap-2">
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

