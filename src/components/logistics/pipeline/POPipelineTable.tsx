
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";

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
  const { language } = useLanguage();
  
  return (
    <Table dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <TableHeader>
        <TableRow>
          <TableHead>{getTranslation("common.id", language) || "PO ID"}</TableHead>
          <TableHead>{getTranslation("logistics.supplier", language) || "Supplier"}</TableHead>
          <TableHead>{getTranslation("logistics.stage", language) || "Stage"}</TableHead>
          <TableHead>{getTranslation("logistics.statusLabel", language) || "Status"}</TableHead>
          <TableHead>{getTranslation("logistics.startDate", language) || "Start Date"}</TableHead>
          <TableHead>{getTranslation("logistics.eta", language) || "ETA"}</TableHead>
          <TableHead>{getTranslation("logistics.completion", language) || "Completion"}</TableHead>
          <TableHead>{getTranslation("logistics.blockers", language) || "Blockers"}</TableHead>
          <TableHead>{getTranslation("logistics.lastUpdated", language) || "Last Updated"}</TableHead>
          <TableHead>{getTranslation("logistics.priority", language) || "Priority"}</TableHead>
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
                <span className="text-muted-foreground">
                  {getTranslation("logistics.none", language) || "None"}
                </span>
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
