
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

interface HierarchyTableHeaderProps {
  startIndex: number;
  endIndex: number;
  totalItems: number;
  onSave: () => Promise<void>;
  isSaving: boolean;
}

export function HierarchyTableHeader({ 
  startIndex, 
  endIndex, 
  totalItems,
  onSave,
  isSaving 
}: HierarchyTableHeaderProps) {
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      await onSave();
      toast({
        title: "Success",
        description: "Column mappings saved successfully",
      });
    } catch (error) {
      console.error('Save error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save column mappings",
      });
    }
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="text-lg font-semibold">Data Preview</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} rows
        </p>
      </div>
      <Button
        onClick={handleSave}
        className="ml-auto"
        disabled={isSaving}
      >
        <Save className="h-4 w-4" />
        {isSaving ? "Saving..." : "Save Mappings"}
      </Button>
    </div>
  );
}
