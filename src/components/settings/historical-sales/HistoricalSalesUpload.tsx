
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const HistoricalSalesUpload = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historical Sales Data Upload</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Upload your historical sales data in CSV or Excel format.
        </p>
        <Button>Upload Files</Button>
      </CardContent>
    </Card>
  );
};

export default HistoricalSalesUpload;
