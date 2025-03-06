
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

interface Column {
  accessorKey?: string;
  header: string;
  id?: string;
  cell?: (props: { row: any }) => React.ReactNode;
}

interface PaginationProps {
  pageSize: number;
  pageIndex: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  pagination?: PaginationProps;
}

export const DataTable: React.FC<DataTableProps> = ({ columns, data, pagination }) => {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead key={column.id || column.accessorKey || index}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column, colIndex) => (
                <TableCell key={column.id || column.accessorKey || colIndex}>
                  {column.cell 
                    ? column.cell({ row: { original: row } })
                    : column.accessorKey 
                      ? row[column.accessorKey] 
                      : null}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {pagination && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => pagination.onPageChange(pagination.pageIndex - 1)}
            disabled={pagination.pageIndex === 0}
          >
            Previous
          </Button>
          <div className="text-sm text-muted-foreground">
            Page {pagination.pageIndex + 1} of {pagination.pageCount}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => pagination.onPageChange(pagination.pageIndex + 1)}
            disabled={pagination.pageIndex === pagination.pageCount - 1}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};
