
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SKUClassification } from "@/types/inventory/classificationTypes"; // Direct import
import { format } from 'date-fns';

interface SKUClassificationsProps {
  classifications: SKUClassification[];
}

export const SKUClassifications: React.FC<SKUClassificationsProps> = ({ classifications }) => {
  if (!classifications || classifications.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">No classifications available</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-xl font-semibold mb-4">SKU Classifications</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classifications.map((classification, index) => (
          <Card key={classification.id || `sku-${index}`} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">{classification.sku}</h4>
                  <p className="text-sm text-muted-foreground">{classification.category || 'No category'}</p>
                </div>
                <Badge variant={getLeadTimeBadgeVariant(classification.classification.leadTimeCategory)}>
                  {classification.classification.leadTimeCategory}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Variability</p>
                  <Badge variant={getVariabilityBadgeVariant(classification.classification.variabilityLevel)}>
                    {classification.classification.variabilityLevel}
                  </Badge>
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Criticality</p>
                  <Badge variant={getCriticalityBadgeVariant(classification.classification.criticality)}>
                    {classification.classification.criticality}
                  </Badge>
                </div>
              </div>

              {classification.classification.score !== undefined && (
                <div className="mt-3">
                  <p className="text-xs text-muted-foreground">Score</p>
                  <p className="font-medium">{classification.classification.score}</p>
                </div>
              )}

              {classification.last_updated && (
                <p className="text-xs text-muted-foreground mt-3">
                  Last updated: {formatDate(classification.last_updated)}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Helper functions for badge variants
function getLeadTimeBadgeVariant(leadTime: 'short' | 'medium' | 'long'): "default" | "secondary" | "destructive" | "outline" {
  switch (leadTime) {
    case 'short': return 'default';
    case 'medium': return 'secondary';
    case 'long': return 'destructive';
    default: return 'outline';
  }
}

function getVariabilityBadgeVariant(variability: 'low' | 'medium' | 'high'): "default" | "secondary" | "destructive" | "outline" {
  switch (variability) {
    case 'low': return 'default';
    case 'medium': return 'secondary';
    case 'high': return 'destructive';
    default: return 'outline';
  }
}

function getCriticalityBadgeVariant(criticality: 'low' | 'medium' | 'high'): "default" | "secondary" | "destructive" | "outline" {
  switch (criticality) {
    case 'low': return 'default';
    case 'medium': return 'secondary';
    case 'high': return 'destructive';
    default: return 'outline';
  }
}

function formatDate(dateString: string): string {
  try {
    return format(new Date(dateString), 'MMM d, yyyy');
  } catch (error) {
    return dateString;
  }
}
