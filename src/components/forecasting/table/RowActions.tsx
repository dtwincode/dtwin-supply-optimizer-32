
import { Button } from "@/components/ui/button";

interface RowActionsProps {
  isEditing: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export const RowActions = ({ isEditing, onSave, onCancel }: RowActionsProps) => {
  if (!isEditing) return null;

  return (
    <div className="flex gap-2">
      <Button size="sm" onClick={onSave}>
        Save
      </Button>
      <Button size="sm" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  );
};
