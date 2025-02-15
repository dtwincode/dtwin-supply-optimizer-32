
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
    <div className="flex flex-col">
      <h3 className="text-2xl font-bold tracking-tight mb-2">Data Preview</h3>
      <p className="text-lg text-muted-foreground">
        Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} rows
      </p>
    </div>
  );
}
