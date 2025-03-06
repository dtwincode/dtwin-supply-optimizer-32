
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import BaseMap from '../shared/maps/BaseMap';

export const NetworkDecouplingMap: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Supply Network Map</CardTitle>
        <CardDescription>
          Geographic visualization of your supply chain network
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BaseMap latitude={37.7749} longitude={-122.4194} zoom={4} />
      </CardContent>
    </Card>
  );
};
