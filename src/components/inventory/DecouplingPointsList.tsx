
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DecouplingPoint } from '@/types/inventory/decouplingTypes';
import { Edit, Trash2 } from 'lucide-react';

// Sample data for demonstration purposes with properties that match the DecouplingPoint type
const sampleDecouplingPoints: DecouplingPoint[] = [
  {
    id: 'dp1',
    locationId: 'loc-main-warehouse',
    type: 'strategic',
    description: 'Strategic decoupling point for long-term planning',
    bufferProfileId: 'bp1',
  },
  {
    id: 'dp2',
    locationId: 'loc-distribution-center',
    type: 'customer_order',
    description: 'Customer order decoupling point for demand-driven operations',
    bufferProfileId: 'bp2',
  },
  {
    id: 'dp3',
    locationId: 'loc-retail-store',
    type: 'stock_point',
    description: 'Stock point for retail operations',
    bufferProfileId: 'bp3',
  }
];

export const DecouplingPointsList = () => {
  const { language } = useLanguage();

  // Function to get translation with inventory prefix
  const t = (key: string) => getTranslation(`common.inventory.${key}`, language);

  // Function to format the type for display
  const formatType = (type: string) => {
    return t(`${type}DecouplingPoint`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('decouplingPoints')}</CardTitle>
      </CardHeader>
      <CardContent>
        {sampleDecouplingPoints.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('locationId')}</TableHead>
                <TableHead>{t('type')}</TableHead>
                <TableHead>{t('description')}</TableHead>
                <TableHead>{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleDecouplingPoints.map((point) => (
                <TableRow key={point.id}>
                  <TableCell className="font-medium">{point.locationId}</TableCell>
                  <TableCell>{formatType(point.type)}</TableCell>
                  <TableCell>{point.description}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground">{t('noDecouplingPoints')}</p>
          </div>
        )}
        <div className="mt-4">
          <Button variant="outline">{t('addDecouplingPoint')}</Button>
        </div>
      </CardContent>
    </Card>
  );
};
