
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SKUClassification } from "@/types/inventory";

interface SKUClassificationsProps {
  classifications: SKUClassification[];
}

export function SKUClassifications({ classifications }: SKUClassificationsProps) {
  if (!classifications || classifications.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No SKU classifications available
      </div>
    );
  }

  // Group classifications by their lead time category
  const groupedByLeadTime = classifications.reduce((acc, classification) => {
    const category = classification.lead_time_category || 'unknown';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(classification);
    return acc;
  }, {} as Record<string, SKUClassification[]>);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Object.entries(groupedByLeadTime).map(([category, items]) => (
        <Card key={category} className="overflow-hidden">
          <div className={`h-2 ${getCategoryColor(category)}`} />
          <CardContent className="pt-6">
            <h4 className="text-sm font-medium mb-2 capitalize">
              {category} Lead Time
              <Badge variant="outline" className="ml-2 text-xs">
                {items.length}
              </Badge>
            </h4>
            <ul className="space-y-1 text-sm">
              {items.slice(0, 5).map((item) => (
                <li key={item.id} className="flex justify-between items-center">
                  <span className="truncate">{item.sku}</span>
                  <Badge
                    variant="secondary"
                    className={`text-xs ${getVariabilityColor(item.variability_level)}`}
                  >
                    {item.variability_level || 'unknown'}
                  </Badge>
                </li>
              ))}
              {items.length > 5 && (
                <li className="text-xs text-muted-foreground text-center pt-2">
                  +{items.length - 5} more items
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function getCategoryColor(category: string): string {
  switch (category?.toLowerCase()) {
    case 'short':
      return 'bg-green-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'long':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
}

function getVariabilityColor(variability?: string): string {
  switch (variability?.toLowerCase()) {
    case 'low':
      return 'text-green-600';
    case 'medium':
      return 'text-yellow-600';
    case 'high':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
}
