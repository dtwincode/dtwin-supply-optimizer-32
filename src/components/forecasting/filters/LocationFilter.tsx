
import { Card } from "@/components/ui/card";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function LocationFilter() {
  const navigate = useNavigate();

  return (
    <Card className="p-6 w-full">
      <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <UploadCloud className="h-12 w-12 text-muted-foreground" />
        <div className="text-center">
          <h3 className="font-semibold mb-1">No Location Data Configured</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Please upload and configure your location hierarchy data in the settings
          </p>
          <Button 
            variant="outline"
            onClick={() => navigate('/settings')}
          >
            Go to Settings
          </Button>
        </div>
      </div>
    </Card>
  );
}
