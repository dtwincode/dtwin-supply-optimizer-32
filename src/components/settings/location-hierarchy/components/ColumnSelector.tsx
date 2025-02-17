
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ColumnSelectorProps {
  tableName: string;
  combinedHeaders: { header: string; level: number | null }[];
  selectedColumns: Set<string>;
  onSelectedColumnsChange: (columns: Set<string>) => void;
  tempUploadId?: string;
  data: any[];
  onSaveSuccess?: () => void;
}

export function ColumnSelector({
  tableName,
  combinedHeaders,
  selectedColumns,
  onSelectedColumnsChange,
  tempUploadId,
  data,
  onSaveSuccess,
}: ColumnSelectorProps) {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleToggleColumn = (header: string) => {
    const newSelectedColumns = new Set(selectedColumns);
    if (newSelectedColumns.has(header)) {
      newSelectedColumns.delete(header);
    } else {
      newSelectedColumns.add(header);
    }
    onSelectedColumnsChange(newSelectedColumns);
  };

  const handleSavePermanently = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to save files",
      });
      return;
    }

    if (!tempUploadId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No temporary file found",
      });
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const randomString = Math.random().toString(36).substring(7);
      const fileName = `location_hierarchy_${timestamp}_${randomString}`;

      const { data: uploadData, error: uploadError } = await supabase
        .from('permanent_hierarchy_files')
        .insert({
          file_name: fileName,
          original_name: `location_hierarchy_${timestamp}.csv`,
          data: data,
          hierarchy_type: 'location_hierarchy',
          selected_columns: Array.from(selectedColumns),
          created_by: user.id
        })
        .select()
        .single();

      if (uploadError) {
        if (uploadError.code === '23505') {
          throw new Error('A file with this name already exists');
        }
        throw uploadError;
      }

      toast({
        title: "Success",
        description: "File saved successfully",
      });

      setError(null);
      onSaveSuccess?.();
    } catch (error) {
      console.error('Error saving file:', error);
      setError(error instanceof Error ? error.message : 'Failed to save file');
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to save file'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Select Columns</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Choose the columns you want to include in your hierarchy
          </p>
        </div>
        <Button
          onClick={handleSavePermanently}
          disabled={isSaving || selectedColumns.size === 0}
          className="min-w-[140px]"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Columns'
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {combinedHeaders.map(({ header, level }) => (
            <div key={header} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <Checkbox
                id={header}
                checked={selectedColumns.has(header)}
                onCheckedChange={() => handleToggleColumn(header)}
                className="mt-1"
              />
              <div className="space-y-1">
                <Label 
                  htmlFor={header} 
                  className="text-sm font-medium cursor-pointer"
                >
                  {header}
                </Label>
                {level !== null && (
                  <p className="text-xs text-muted-foreground">
                    Level {level}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
