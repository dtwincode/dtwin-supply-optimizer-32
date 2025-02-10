
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { EditableCell } from "./table/EditableCell";
import { RowActions } from "./table/RowActions";
import { ForecastData, EditingCell } from "./table/types";

interface ForecastTableProps {
  data: ForecastData[];
}

export const ForecastTable = ({ data: initialData }: ForecastTableProps) => {
  const [data, setData] = useState(initialData);
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [tempValue, setTempValue] = useState("");
  const { toast } = useToast();

  const handleStartEdit = (rowIndex: number, column: 'forecast' | 'lower' | 'upper', value: number) => {
    setEditingCell({ row: rowIndex, col: column });
    setTempValue(value.toString());
  };

  const handleSaveEdit = (rowIndex: number) => {
    const newValue = parseFloat(tempValue);
    
    if (isNaN(newValue)) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid number",
        variant: "destructive",
      });
      return;
    }

    const newData = [...data];
    if (editingCell?.col) {
      if (!validateEdit(rowIndex, editingCell.col, newValue)) {
        return;
      }

      newData[rowIndex][editingCell.col] = newValue;
      setData(newData);
      
      toast({
        title: "Success",
        description: "Forecast updated successfully",
      });
    }
    
    setEditingCell(null);
    setTempValue("");
  };

  const validateEdit = (rowIndex: number, column: 'forecast' | 'lower' | 'upper', value: number): boolean => {
    if (column === 'forecast') {
      if (value < data[rowIndex].lower || value > data[rowIndex].upper) {
        toast({
          title: "Out of bounds",
          description: "Forecast must be between lower and upper bounds",
          variant: "destructive",
        });
        return false;
      }
    } else if (column === 'lower') {
      if (value > data[rowIndex].forecast) {
        toast({
          title: "Invalid bounds",
          description: "Lower bound must be less than forecast",
          variant: "destructive",
        });
        return false;
      }
    } else if (column === 'upper') {
      if (value < data[rowIndex].forecast) {
        toast({
          title: "Invalid bounds",
          description: "Upper bound must be greater than forecast",
          variant: "destructive",
        });
        return false;
      }
    }
    return true;
  };

  const handleKeyPress = (e: React.KeyboardEvent, rowIndex: number) => {
    if (e.key === 'Enter') {
      handleSaveEdit(rowIndex);
    } else if (e.key === 'Escape') {
      setEditingCell(null);
      setTempValue("");
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Weekly Forecast Distribution</h3>
        <div className="text-sm text-muted-foreground">
          Click on values to edit
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Week</TableHead>
              <TableHead className="text-right">Forecast</TableHead>
              <TableHead className="text-right">Lower Bound</TableHead>
              <TableHead className="text-right">Upper Bound</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={row.week}>
                <TableCell>{row.week}</TableCell>
                <TableCell>
                  <EditableCell
                    value={row.forecast}
                    isEditing={editingCell?.row === rowIndex && editingCell?.col === 'forecast'}
                    tempValue={tempValue}
                    onEdit={() => handleStartEdit(rowIndex, 'forecast', row.forecast)}
                    onChange={setTempValue}
                    onKeyDown={(e) => handleKeyPress(e, rowIndex)}
                  />
                </TableCell>
                <TableCell>
                  <EditableCell
                    value={row.lower}
                    isEditing={editingCell?.row === rowIndex && editingCell?.col === 'lower'}
                    tempValue={tempValue}
                    onEdit={() => handleStartEdit(rowIndex, 'lower', row.lower)}
                    onChange={setTempValue}
                    onKeyDown={(e) => handleKeyPress(e, rowIndex)}
                  />
                </TableCell>
                <TableCell>
                  <EditableCell
                    value={row.upper}
                    isEditing={editingCell?.row === rowIndex && editingCell?.col === 'upper'}
                    tempValue={tempValue}
                    onEdit={() => handleStartEdit(rowIndex, 'upper', row.upper)}
                    onChange={setTempValue}
                    onKeyDown={(e) => handleKeyPress(e, rowIndex)}
                  />
                </TableCell>
                <TableCell>
                  <RowActions
                    isEditing={editingCell?.row === rowIndex}
                    onSave={() => handleSaveEdit(rowIndex)}
                    onCancel={() => {
                      setEditingCell(null);
                      setTempValue("");
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
