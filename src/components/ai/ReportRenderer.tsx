import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ReportSection {
  title: string;
  type: "text" | "table" | "metrics" | "insights";
  content: any;
}

interface ReportData {
  title: string;
  summary?: string;
  sections: ReportSection[];
}

interface ReportRendererProps {
  reportData: ReportData;
}

export const ReportRenderer = ({ reportData }: ReportRendererProps) => {
  const { title, summary, sections } = reportData;

  const renderSection = (section: ReportSection, index: number) => {
    switch (section.type) {
      case "text":
        return (
          <div key={index} className="space-y-2">
            <h4 className="font-semibold text-sm">{section.title}</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {section.content}
            </p>
          </div>
        );

      case "table":
        return (
          <div key={index} className="space-y-2">
            <h4 className="font-semibold text-sm">{section.title}</h4>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {section.content.headers?.map(
                      (header: string, i: number) => (
                        <TableHead key={i}>{header}</TableHead>
                      )
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {section.content.rows?.map((row: any[], rowIndex: number) => (
                    <TableRow key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <TableCell key={cellIndex}>{cell}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        );

      case "metrics":
        return (
          <div key={index} className="space-y-2">
            <h4 className="font-semibold text-sm">{section.title}</h4>
            <div className="grid grid-cols-2 gap-4">
              {section.content.metrics?.map((metric: any, i: number) => (
                <Card key={i} className="p-4">
                  <div className="text-sm text-muted-foreground">
                    {metric.label}
                  </div>
                  <div className="text-2xl font-bold mt-1">{metric.value}</div>
                  {metric.trend && (
                    <Badge
                      variant={
                        metric.trend === "up"
                          ? "default"
                          : metric.trend === "down"
                            ? "destructive"
                            : "secondary"
                      }
                      className="mt-2"
                    >
                      {metric.trend === "up" ? "↑" : metric.trend === "down" ? "↓" : "→"}
                      {metric.change}
                    </Badge>
                  )}
                </Card>
              ))}
            </div>
          </div>
        );

      case "insights":
        return (
          <div key={index} className="space-y-2">
            <h4 className="font-semibold text-sm">{section.title}</h4>
            <div className="space-y-2">
              {section.content.items?.map((item: string, i: number) => (
                <div
                  key={i}
                  className="flex items-start space-x-2 text-sm p-3 rounded-lg bg-muted"
                >
                  <span className="text-primary font-bold">•</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          {summary && (
            <p className="text-sm text-muted-foreground mt-2">{summary}</p>
          )}
        </div>

        <Separator />

        {sections.map((section, index) => (
          <div key={index}>
            {renderSection(section, index)}
            {index < sections.length - 1 && <Separator className="my-4" />}
          </div>
        ))}
      </div>
    </Card>
  );
};
