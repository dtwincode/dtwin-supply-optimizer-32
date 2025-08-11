
import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SavedFilesListProps {
  tableName: string;
}

export function SavedFilesList({ tableName }: SavedFilesListProps) {
  const [savedFiles, setSavedFiles] = useState<any[]>([]);

  const fetchSavedFiles = async () => {
    try {
      const { data: files, error } = await supabase
        .from('permanent_hierarchy_files')
        .select('*')
        .eq('hierarchy_type', tableName)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedFiles(files || []);
    } catch (error) {
      console.error('Error fetching saved files:', error);
    }
  };

  useEffect(() => {
    fetchSavedFiles();
    // Set up a refresh interval
    const interval = setInterval(fetchSavedFiles, 5000);
    return () => clearInterval(interval);
  }, [tableName]);

  const handleDownload = async (fileData: any) => {
    try {
      const data = fileData.data;
      const selectedCols = fileData.selected_columns;
      
      const filteredData = data.map((row: any) => {
        const filtered: any = {};
        selectedCols.forEach((col: string) => {
          filtered[col] = row[col];
        });
        return filtered;
      });

      const headers = selectedCols.join(',');
      const rows = filteredData.map((row: any) => 
        selectedCols.map(col => `"${row[col] || ''}"`).join(',')
      );
      const csv = [headers, ...rows].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileData.original_name}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "File downloaded successfully",
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to download file",
      });
    }
  };

  if (savedFiles.length === 0) {
    return null;
  }

  return (
    <Card className="p-4 mt-6">
      <h4 className="text-sm font-medium mb-3">Saved Files</h4>
      <div className="space-y-3">
        {savedFiles.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between p-2 bg-secondary/50 rounded-lg"
          >
            <div>
              <p className="font-medium">{file.original_name}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(file.created_at).toLocaleDateString()}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDownload(file)}
              className="h-8 w-8"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}
