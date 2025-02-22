
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IntegratedData } from "./types";
import { useMemo } from "react";

interface IntegratedDataTableProps {
  data: IntegratedData[];
}

export function IntegratedDataTable({ data }: IntegratedDataTableProps) {
  // استخراج جميع الأعمدة الفريدة من البيانات
  const columns = useMemo(() => {
    const uniqueColumns = new Set<string>();
    
    // إضافة الأعمدة الثابتة
    uniqueColumns.add('date');
    uniqueColumns.add('actual_value');
    uniqueColumns.add('sku');
    
    // إضافة الأعمدة الديناميكية من metadata
    data.forEach(row => {
      Object.keys(row.metadata || {}).forEach(key => {
        uniqueColumns.add(key);
      });
    });
    
    return Array.from(uniqueColumns);
  }, [data]);

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
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center py-4">
                    لا توجد بيانات متكاملة متاحة. انقر على "دمج البيانات" لملء الجدول.
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
                         row.metadata?.[column] || ''}
                      </TableCell>
                    ))}
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
