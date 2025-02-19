
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IntegratedData } from "./types";

interface IntegratedDataTableProps {
  data: IntegratedData[];
}

export function IntegratedDataTable({ data }: IntegratedDataTableProps) {
  return (
    <div className="relative overflow-x-auto border rounded-md">
      <div className="max-h-[600px] overflow-y-auto">
        <div className="min-w-[1600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-base whitespace-nowrap px-6 sticky top-0 bg-white">Date</TableHead>
                <TableHead className="text-base whitespace-nowrap px-6 sticky top-0 bg-white">Sales Value</TableHead>
                <TableHead className="text-base whitespace-nowrap px-6 sticky top-0 bg-white">SKU</TableHead>
                <TableHead className="text-base whitespace-nowrap px-6 sticky top-0 bg-white">Region</TableHead>
                <TableHead className="text-base whitespace-nowrap px-6 sticky top-0 bg-white">City</TableHead>
                <TableHead className="text-base whitespace-nowrap px-6 sticky top-0 bg-white">Warehouse</TableHead>
                <TableHead className="text-base whitespace-nowrap px-6 sticky top-0 bg-white">Channel</TableHead>
                <TableHead className="text-base whitespace-nowrap px-6 sticky top-0 bg-white">Main Product</TableHead>
                <TableHead className="text-base whitespace-nowrap px-6 sticky top-0 bg-white">Product Line</TableHead>
                <TableHead className="text-base whitespace-nowrap px-6 sticky top-0 bg-white">Category</TableHead>
                <TableHead className="text-base whitespace-nowrap px-6 sticky top-0 bg-white">Device Make</TableHead>
                <TableHead className="text-base whitespace-nowrap px-6 sticky top-0 bg-white">Sub Category</TableHead>
                <TableHead className="text-base whitespace-nowrap px-6 sticky top-0 bg-white">Device Model</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={13} className="text-center py-4">
                    No integrated data available. Click "Integrate Data" to populate the table.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="whitespace-nowrap px-6">{new Date(row.date).toLocaleDateString()}</TableCell>
                    <TableCell className="whitespace-nowrap px-6">{row.actual_value}</TableCell>
                    <TableCell className="whitespace-nowrap px-6">{row.sku}</TableCell>
                    <TableCell className="whitespace-nowrap px-6">{row.region}</TableCell>
                    <TableCell className="whitespace-nowrap px-6">{row.city}</TableCell>
                    <TableCell className="whitespace-nowrap px-6">{row.warehouse}</TableCell>
                    <TableCell className="whitespace-nowrap px-6">{row.channel}</TableCell>
                    <TableCell className="whitespace-nowrap px-6">{row.l1_main_prod}</TableCell>
                    <TableCell className="whitespace-nowrap px-6">{row.l2_prod_line}</TableCell>
                    <TableCell className="whitespace-nowrap px-6">{row.l3_prod_category}</TableCell>
                    <TableCell className="whitespace-nowrap px-6">{row.l4_device_make}</TableCell>
                    <TableCell className="whitespace-nowrap px-6">{row.l5_prod_sub_category}</TableCell>
                    <TableCell className="whitespace-nowrap px-6">{row.l6_device_model}</TableCell>
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
