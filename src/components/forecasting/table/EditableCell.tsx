
import { Input } from "@/components/ui/input";

interface EditableCellProps {
  value: number;
  isEditing: boolean;
  tempValue: string;
  onEdit: () => void;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export const EditableCell = ({
  value,
  isEditing,
  tempValue,
  onEdit,
  onChange,
  onKeyDown,
}: EditableCellProps) => {
  if (isEditing) {
    return (
      <Input
        type="number"
        value={tempValue}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        className="w-24 text-right"
        autoFocus
      />
    );
  }

  return (
    <div
      onClick={onEdit}
      className="cursor-pointer hover:bg-gray-100 p-1 rounded text-right"
    >
      {value.toFixed(0)}
    </div>
  );
};
