
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useThresholdConfig } from "@/hooks/useThresholdConfig";
import { Calendar, RefreshCw } from "lucide-react";

export function ThresholdScheduler() {
  const { toast } = useToast();
  const { updateConfig, loading, configureAutomaticUpdates } = useThresholdConfig();

  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>(
    (updateConfig?.preferred_frequency as 'daily' | 'weekly' | 'monthly') || 'monthly'
  );
  const [day, setDay] = useState<number>(updateConfig?.preferred_day || 1);
  const [isConfiguring, setIsConfiguring] = useState(false);

  const handleUpdateSchedule = async () => {
    try {
      setIsConfiguring(true);
      
      const success = await configureAutomaticUpdates(frequency, day);
      
      if (success) {
        toast({
          title: "Schedule Updated",
          description: `Automatic updates will now run ${frequency}.`,
        });
      } else {
        throw new Error("Failed to update schedule");
      }
    } catch (error) {
      console.error("Error updating schedule:", error);
      toast({
        title: "Error",
        description: "Failed to update schedule. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConfiguring(false);
    }
  };

  // Generate day options for monthly frequency
  const getDayOptions = () => {
    const options = [];
    for (let i = 1; i <= 28; i++) {
      options.push(
        <SelectItem key={i} value={i.toString()}>
          Day {i}
        </SelectItem>
      );
    }
    return options;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Automatic Threshold Updates</CardTitle>
        <CardDescription>
          Schedule automatic Bayesian threshold learning updates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="frequency">Update Frequency</Label>
              <Select 
                value={frequency} 
                onValueChange={(val) => setFrequency(val as 'daily' | 'weekly' | 'monthly')}
                disabled={loading || isConfiguring}
              >
                <SelectTrigger id="frequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {frequency === 'monthly' && (
              <div className="space-y-2">
                <Label htmlFor="day">Day of Month</Label>
                <Select 
                  value={day.toString()} 
                  onValueChange={(val) => setDay(parseInt(val))}
                  disabled={loading || isConfiguring}
                >
                  <SelectTrigger id="day">
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {getDayOptions()}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          {updateConfig && (
            <div className="bg-muted/50 p-3 rounded-md space-y-1">
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground">Currently set to: {updateConfig.preferred_frequency}</span>
              </div>
              
              {updateConfig.next_run_at && (
                <div className="flex items-center text-sm">
                  <RefreshCw className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Next update: {new Date(updateConfig.next_run_at).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <Button 
          onClick={handleUpdateSchedule} 
          disabled={loading || isConfiguring}
          className="w-full"
        >
          {isConfiguring ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Updating Schedule...
            </>
          ) : (
            "Save Schedule"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
