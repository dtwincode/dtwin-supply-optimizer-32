
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";
import { SKUClassification } from "./types";

interface SKUClassificationsProps {
  classifications: SKUClassification[];
}

export function SKUClassifications({ classifications }: SKUClassificationsProps) {
  const getClassificationBadgeColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid gap-4">
      {classifications.map((item) => (
        <Card key={item.sku} className="p-4">
          <div className="flex items-start gap-4">
            <Tag className="w-5 h-5" />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">{item.sku}</h4>
                <p className="text-sm text-muted-foreground">
                  Updated: {new Date(item.lastUpdated).toLocaleDateString()}
                </p>
              </div>
              <div className="mt-2 flex gap-2 flex-wrap">
                <Badge className={getClassificationBadgeColor(item.classification.leadTimeCategory)}>
                  Lead Time: {item.classification.leadTimeCategory}
                </Badge>
                <Badge className={getClassificationBadgeColor(item.classification.variabilityLevel)}>
                  Variability: {item.classification.variabilityLevel}
                </Badge>
                <Badge className={getClassificationBadgeColor(item.classification.criticality)}>
                  Criticality: {item.classification.criticality}
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
