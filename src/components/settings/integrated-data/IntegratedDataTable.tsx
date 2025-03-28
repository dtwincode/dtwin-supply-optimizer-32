
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { IntegratedData } from "./types";
import { useMemo } from "react";

interface IntegratedDataTableProps {
  data: IntegratedData[];
  selectedColumns: Set<string>;
}

export function IntegratedDataTable({ data, selectedColumns }: IntegratedDataTableProps) {
  const columns = useMemo(() => {
    return Array.from(selectedColumns);
  }, [selectedColumns]);

  const getValidationStatusColor = (status?: string) => {
    switch (status) {
      case 'valid':
        return 'bg-green-500';
      case 'needs_review':
        return 'bg-yellow-500';
      case 'pending':
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="relative overflow-x-auto border rounded-md">
      <div className="max-h-[600px] overflow-y-auto">
        <div className="min-w-[1600px]">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map(column => (
                  <TableHead 
                    key={column} 
                    className="text-base whitespace-nowrap px-6 sticky top-0 bg-white"
                  >
                    {column.charAt(0).toUpperCase() + column.slice(1).replace(/_/g, ' ')}
                  </TableHead>
                ))}
                <TableHead className="text-base whitespace-nowrap px-6 sticky top-0 bg-white">
                  Source Files
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} className="text-center py-4">
                    No integrated data available. Click "Integrate Data" to populate the table.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, index) => (
                  <TableRow key={index}>
                    {columns.map(column => (
                      <TableCell key={column} className="whitespace-nowrap px-6">
                        {column === 'date' ? new Date(row[column]).toLocaleDateString() :
                         column === 'actual_value' ? row[column] :
                         column === 'sku' ? row[column] :
                         column === 'validation_status' ? (
                           <Badge 
                             className={`${getValidationStatusColor(row.validation_status)}`}
                           >
                             {row.validation_status || 'pending'}
                           </Badge>
                         ) :
                         row.metadata?.[column] || ''}
                      </TableCell>
                    ))}
                    <TableCell className="whitespace-nowrap px-6">
                      {row.source_files?.map((file: any, idx: number) => (
                        <Badge 
                          key={idx}
                          variant="outline" 
                          className="mr-2"
                        >
                          {file.file_name}
                        </Badge>
                      ))}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
