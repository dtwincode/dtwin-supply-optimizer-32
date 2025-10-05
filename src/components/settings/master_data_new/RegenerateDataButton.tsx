import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { regenerateHistoricalSalesData } from '@/lib/regenerate-sales-data';

export const RegenerateDataButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleRegenerate = async () => {
    setIsLoading(true);
    try {
      await regenerateHistoricalSalesData(90);
      toast({
        title: "Success",
        description: "Historical sales data regenerated with realistic pricing variations",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to regenerate data. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleRegenerate}
      disabled={isLoading}
      className="gap-2"
    >
      <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
      {isLoading ? 'Regenerating...' : 'Regenerate Sales Data'}
    </Button>
  );
};
