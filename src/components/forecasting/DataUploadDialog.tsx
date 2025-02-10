
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Download, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface DataUploadDialogProps {
  onDataUploaded: () => void;
}

export function DataUploadDialog({ onDataUploaded }: DataUploadDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const downloadTemplate = async () => {
    try {
      const { data, error } = await supabase
        .from('module_settings')
        .select('data_template')
        .eq('module', 'forecasting')
        .single();

      if (error) throw error;

      const template = data.data_template;
      const csvHeader = template.required_columns.join(',');
      const csvRow = Object.values(template.sample_row).join(',');
      const csvContent = `${csvHeader}\n${csvRow}`;

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'forecast_data_template.csv';
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

        // Validate headers against template
        const { data: templateData } = await supabase
          .from('module_settings')
          .select('data_template')
          .eq('module', 'forecasting')
          .single();

        const requiredColumns = templateData?.data_template.required_columns;
        const missingColumns = requiredColumns.filter(col => !headers.includes(col));

        if (missingColumns.length > 0) {
          toast({
            variant: "destructive",
            title: "Invalid Format",
            description: `Missing required columns: ${missingColumns.join(', ')}`,
          });
          return;
        }

        // Process data rows
        const dataRows = rows.slice(1).filter(row => row.trim());
        const processedData = dataRows.map(row => {
          const values = row.split(',').map(v => v.trim());
          const rowData: Record<string, any> = {};
          headers.forEach((header, index) => {
            rowData[header] = values[index];
          });
          return rowData;
        });

        // Upload to database
        const { error } = await supabase
          .from('forecast_data')
          .insert(processedData);

        if (error) throw error;

        toast({
          title: "Success",
          description: `${processedData.length} rows uploaded successfully`,
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
          <DialogTitle>Upload Forecast Data</DialogTitle>
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
