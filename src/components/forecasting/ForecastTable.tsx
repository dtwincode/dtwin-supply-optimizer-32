
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";

interface ForecastTableProps {
  data: {
    week: string;
    forecast: number;
    lower: number;
    upper: number;
  }[];
}

export const ForecastTable = ({ data }: ForecastTableProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Weekly Forecast Distribution</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Week</TableHead>
              <TableHead className="text-right">Forecast</TableHead>
              <TableHead className="text-right">Lower Bound</TableHead>
              <TableHead className="text-right">Upper Bound</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.week}>
                <TableCell>{row.week}</TableCell>
                <TableCell className="text-right">{row.forecast.toFixed(0)}</TableCell>
                <TableCell className="text-right">{row.lower.toFixed(0)}</TableCell>
                <TableCell className="text-right">{row.upper.toFixed(0)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
