
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface LogisticsOrder {
  id: number;
  orderRef: string;
  supplier: string;
  items: number;
  status: string;
  etd: string;
  eta: string;
  leadTime: string;
  priority: string;
}

interface LogisticsOrdersTableProps {
  orders: LogisticsOrder[];
}

export const LogisticsOrdersTable = ({ orders }: LogisticsOrdersTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order Ref</TableHead>
          <TableHead>Supplier</TableHead>
          <TableHead>Items</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>ETD</TableHead>
          <TableHead>ETA</TableHead>
          <TableHead>Lead Time</TableHead>
          <TableHead>Priority</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.orderRef}</TableCell>
            <TableCell>{order.supplier}</TableCell>
            <TableCell>{order.items}</TableCell>
            <TableCell>
              <Badge
                variant={
                  order.status === "in-transit"
                    ? "default"
                    : order.status === "delayed"
                    ? "destructive"
                    : "secondary"
                }
                className="capitalize"
              >
                {order.status}
              </Badge>
            </TableCell>
            <TableCell>{order.etd}</TableCell>
            <TableCell>{order.eta}</TableCell>
            <TableCell>{order.leadTime}</TableCell>
            <TableCell>
              <Badge
                variant={
                  order.priority === "high"
                    ? "destructive"
                    : order.priority === "medium"
                    ? "secondary"
                    : "default"
                }
                className="capitalize"
              >
                {order.priority}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
