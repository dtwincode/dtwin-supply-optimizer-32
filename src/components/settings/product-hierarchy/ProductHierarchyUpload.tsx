
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ProductHierarchyUpload = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Hierarchy Upload</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Upload your product hierarchy data in CSV or Excel format.
        </p>
        <Button>Upload Files</Button>
      </CardContent>
    </Card>
  );
};

export default ProductHierarchyUpload;
