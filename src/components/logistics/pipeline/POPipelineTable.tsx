
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface POPipeline {
  id: string;
  supplier: string;
  stage: string;
  status: string;
  startDate: string;
  eta: string;
  completionRate: number;
  blockers: string | null;
  lastUpdated: string;
  priority: string;
}

interface POPipelineTableProps {
  data: POPipeline[];
}

export const POPipelineTable = ({ data }: POPipelineTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>PO ID</TableHead>
          <TableHead>Supplier</TableHead>
          <TableHead>Stage</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>ETA</TableHead>
          <TableHead>Completion</TableHead>
          <TableHead>Blockers</TableHead>
          <TableHead>Last Updated</TableHead>
          <TableHead>Priority</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((po) => (
          <TableRow key={po.id}>
            <TableCell className="font-medium">{po.id}</TableCell>
            <TableCell>{po.supplier}</TableCell>
            <TableCell>
              <Badge variant="outline" className="capitalize">
                {po.stage}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  po.status === "in-progress"
                    ? "default"
                    : po.status === "delayed"
                    ? "destructive"
                    : "secondary"
                }
                className="capitalize"
              >
                {po.status}
              </Badge>
            </TableCell>
            <TableCell>{po.startDate}</TableCell>
            <TableCell>{po.eta}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      po.completionRate >= 80
                        ? "bg-success"
                        : po.completionRate >= 40
                        ? "bg-warning"
                        : "bg-primary"
                    }`}
                    style={{ width: `${po.completionRate}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground">
                  {po.completionRate}%
                </span>
              </div>
            </TableCell>
            <TableCell>
              {po.blockers ? (
                <span className="text-destructive">{po.blockers}</span>
              ) : (
                <span className="text-muted-foreground">None</span>
              )}
            </TableCell>
            <TableCell>{po.lastUpdated}</TableCell>
            <TableCell>
              <Badge
                variant={
                  po.priority === "high"
                    ? "destructive"
                    : po.priority === "medium"
                    ? "secondary"
                    : "default"
                }
                className="capitalize"
              >
                {po.priority}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
