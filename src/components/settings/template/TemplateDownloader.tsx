
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { DataTemplate } from "../validation/types";

interface TemplateDownloaderProps {
  module: Database["public"]["Enums"]["module_type"];
}

export function TemplateDownloader({ module }: TemplateDownloaderProps) {
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

  return (
    <Button variant="outline" onClick={downloadTemplate} className="gap-2">
      <Download className="h-4 w-4" />
      Download Template
    </Button>
  );
}
