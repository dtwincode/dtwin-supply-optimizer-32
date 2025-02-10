
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ForecastTableProps {
  data: {
    week: string;
    forecast: number;
    lower: number;
    upper: number;
  }[];
}

export const ForecastTable = ({ data: initialData }: ForecastTableProps) => {
  const [data, setData] = useState(initialData);
  const [editingCell, setEditingCell] = useState<{row: number, col: 'forecast' | 'lower' | 'upper'} | null>(null);
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
      // Validate against bounds
      if (editingCell.col === 'forecast') {
        if (newValue < newData[rowIndex].lower || newValue > newData[rowIndex].upper) {
          toast({
            title: "Out of bounds",
            description: "Forecast must be between lower and upper bounds",
            variant: "destructive",
          });
          return;
        }
      } else if (editingCell.col === 'lower') {
        if (newValue > newData[rowIndex].forecast) {
          toast({
            title: "Invalid bounds",
            description: "Lower bound must be less than forecast",
            variant: "destructive",
          });
          return;
        }
      } else if (editingCell.col === 'upper') {
        if (newValue < newData[rowIndex].forecast) {
          toast({
            title: "Invalid bounds",
            description: "Upper bound must be greater than forecast",
            variant: "destructive",
          });
          return;
        }
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
                <TableCell className="text-right">
                  {editingCell?.row === rowIndex && editingCell?.col === 'forecast' ? (
                    <Input
                      type="number"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      onKeyDown={(e) => handleKeyPress(e, rowIndex)}
                      className="w-24 text-right"
                      autoFocus
                    />
                  ) : (
                    <div
                      onClick={() => handleStartEdit(rowIndex, 'forecast', row.forecast)}
                      className="cursor-pointer hover:bg-gray-100 p-1 rounded"
                    >
                      {row.forecast.toFixed(0)}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {editingCell?.row === rowIndex && editingCell?.col === 'lower' ? (
                    <Input
                      type="number"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      onKeyDown={(e) => handleKeyPress(e, rowIndex)}
                      className="w-24 text-right"
                      autoFocus
                    />
                  ) : (
                    <div
                      onClick={() => handleStartEdit(rowIndex, 'lower', row.lower)}
                      className="cursor-pointer hover:bg-gray-100 p-1 rounded"
                    >
                      {row.lower.toFixed(0)}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {editingCell?.row === rowIndex && editingCell?.col === 'upper' ? (
                    <Input
                      type="number"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      onKeyDown={(e) => handleKeyPress(e, rowIndex)}
                      className="w-24 text-right"
                      autoFocus
                    />
                  ) : (
                    <div
                      onClick={() => handleStartEdit(rowIndex, 'upper', row.upper)}
                      className="cursor-pointer hover:bg-gray-100 p-1 rounded"
                    >
                      {row.upper.toFixed(0)}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {editingCell?.row === rowIndex && (
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleSaveEdit(rowIndex)}
                      >
                        Save
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setEditingCell(null);
                          setTempValue("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
