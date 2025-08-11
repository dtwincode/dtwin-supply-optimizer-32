
import React from 'react';
import { Loader2 } from 'lucide-react';

const PageLoading = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading application...</p>
      </div>
    </div>
  );
};

export default PageLoading;
