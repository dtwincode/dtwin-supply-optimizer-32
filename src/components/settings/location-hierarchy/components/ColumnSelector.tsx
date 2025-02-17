
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

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

      // Generate a unique filename using timestamp and random string
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
        // Check for unique constraint violation
        if (uploadError.code === '23505') { // PostgreSQL unique constraint violation code
          throw new Error('A file with this name already exists');
        }
        throw uploadError;
      }

      toast({
        title: "Success",
        description: "File saved successfully",
      });

      // Clear any existing error
      setError(null);

      // Notify parent of successful save
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
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {combinedHeaders.map(({ header, level }) => (
          <div key={header} className="flex items-center space-x-2">
            <Checkbox
              id={header}
              checked={selectedColumns.has(header)}
              onCheckedChange={() => handleToggleColumn(header)}
            />
            <Label htmlFor={header} className="text-sm">
              {header} {level !== null && `(Level ${level})`}
            </Label>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSavePermanently}
          disabled={isSaving || selectedColumns.size === 0}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Permanently'
          )}
        </Button>
      </div>
    </div>
  );
}
