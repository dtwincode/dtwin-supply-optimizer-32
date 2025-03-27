
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Plus } from "lucide-react";
import { SKUClassification } from "@/components/inventory/types";

// Sample mock data - In a real app, this would come from a hook or context
const mockClassifications: SKUClassification[] = [
  {
    sku: "SKU001",
    classification: {
      leadTimeCategory: "long",
      variabilityLevel: "medium",
      criticality: "high",
      score: 85
    },
    lastUpdated: "2024-05-15T10:30:00Z"
  },
  {
    sku: "SKU002",
    classification: {
      leadTimeCategory: "medium",
      variabilityLevel: "low",
      criticality: "medium",
      score: 65
    },
    lastUpdated: "2024-05-14T14:20:00Z"
  },
  {
    sku: "SKU003",
    classification: {
      leadTimeCategory: "short",
      variabilityLevel: "high",
      criticality: "low",
      score: 45
    },
    lastUpdated: "2024-05-13T08:45:00Z"
  }
];

export function ClassificationManager() {
  const [classifications, setClassifications] = useState<SKUClassification[]>(mockClassifications);
  const [isLoading, setIsLoading] = useState(false);

  const refreshClassifications = () => {
    setIsLoading(true);
    // In a real implementation, this would call an API
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "outline";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Classification Management</CardTitle>
          <CardDescription>
            Manage your product classifications based on lead time and variability
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshClassifications}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Classification
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Lead Time</TableHead>
              <TableHead>Variability</TableHead>
              <TableHead>Criticality</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Last Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classifications.map((item) => (
              <TableRow key={item.sku}>
                <TableCell className="font-medium">{item.sku}</TableCell>
                <TableCell className="capitalize">{item.classification.leadTimeCategory}</TableCell>
                <TableCell className="capitalize">{item.classification.variabilityLevel}</TableCell>
                <TableCell>
                  <Badge variant={getCriticalityColor(item.classification.criticality) as any}>
                    {item.classification.criticality}
                  </Badge>
                </TableCell>
                <TableCell>{item.classification.score}</TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {new Date(item.lastUpdated).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
