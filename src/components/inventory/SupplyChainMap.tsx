
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BaseMap from '../shared/maps/BaseMap';

interface SupplyChainMapProps {
  title?: string;
}

export const SupplyChainMap: React.FC<SupplyChainMapProps> = ({ title = "Supply Chain Network" }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <BaseMap />
      </CardContent>
    </Card>
  );
};
