
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { EditableCell } from "./table/EditableCell";
import { RowActions } from "./table/RowActions";
import { ForecastData, EditingCell } from "./table/types";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('forecast_data')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setData(data.filter(row => row.id !== id));
      
      toast({
        title: "Success",
        description: "Forecast data deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete forecast data",
        variant: "destructive",
      });
    }
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
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Subcategory</TableHead>
              <TableHead className="text-right">Forecast</TableHead>
              <TableHead className="text-right">Lower Bound</TableHead>
              <TableHead className="text-right">Upper Bound</TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={row.week}>
                <TableCell>{row.week}</TableCell>
                <TableCell>{row.sku}</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>{row.subcategory}</TableCell>
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
                  <div className="flex gap-2">
                    <RowActions
                      isEditing={editingCell?.row === rowIndex}
                      onSave={() => handleSaveEdit(rowIndex)}
                      onCancel={() => {
                        setEditingCell(null);
                        setTempValue("");
                      }}
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(row.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
