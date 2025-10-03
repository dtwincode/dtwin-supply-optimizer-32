import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RefreshCw, History, Clock, TrendingUp, TrendingDown } from "lucide-react";
import { useBufferRecalculation } from "@/hooks/useBufferRecalculation";
import PageLoading from "@/components/PageLoading";

export const BufferRecalculationTab = () => {
  const { 
    recalcHistory, 
    schedules, 
    isLoadingHistory, 
    isLoadingSchedules, 
    triggerRecalculation, 
    updateSchedule 
  } = useBufferRecalculation();

  if (isLoadingHistory || isLoadingSchedules) {
    return <PageLoading />;
  }

  const activeSchedule = schedules?.[0];
  const recentRecalcs = recalcHistory?.slice(0, 20) || [];

  const handleToggleSchedule = () => {
    if (activeSchedule) {
      updateSchedule.mutate({
        id: activeSchedule.id,
        is_active: !activeSchedule.is_active,
      });
    }
  };

  const handleManualRecalc = () => {
    triggerRecalculation.mutate({});
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Automated Buffer Recalculation</CardTitle>
              <CardDescription>
                Scheduled buffer updates with dynamic adjustment factors (DAF/LTAF)
              </CardDescription>
            </div>
            <Button
              onClick={handleManualRecalc}
              disabled={triggerRecalculation.isPending}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Recalculate Now
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-4">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">{activeSchedule?.schedule_name}</p>
                <p className="text-sm text-muted-foreground">
                  Schedule: {activeSchedule?.cron_expression} (Daily at 2 AM)
                </p>
                {activeSchedule?.last_run_at && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Last run: {new Date(activeSchedule.last_run_at).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="schedule-active">Active</Label>
              <Switch
                id="schedule-active"
                checked={activeSchedule?.is_active || false}
                onCheckedChange={handleToggleSchedule}
                disabled={updateSchedule.isPending}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="history">
        <TabsList>
          <TabsTrigger value="history">Recalculation History</TabsTrigger>
          <TabsTrigger value="details">Change Details</TabsTrigger>
        </TabsList>

        {/* History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Recent Buffer Recalculations
              </CardTitle>
              <CardDescription>
                Audit trail of automatic and manual buffer adjustments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Red Zone</TableHead>
                    <TableHead className="text-right">Yellow Zone</TableHead>
                    <TableHead className="text-right">Green Zone</TableHead>
                    <TableHead>Trigger</TableHead>
                    <TableHead>Factors</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentRecalcs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground">
                        No recalculations yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentRecalcs.map((recalc) => {
                      const redChange = ((recalc.new_red_zone - recalc.old_red_zone) / recalc.old_red_zone) * 100;
                      const yellowChange = ((recalc.new_yellow_zone - recalc.old_yellow_zone) / recalc.old_yellow_zone) * 100;
                      const greenChange = ((recalc.new_green_zone - recalc.old_green_zone) / recalc.old_green_zone) * 100;

                      return (
                        <TableRow key={recalc.id}>
                          <TableCell className="text-sm">
                            {new Date(recalc.recalc_ts).toLocaleString()}
                          </TableCell>
                          <TableCell className="font-medium">{recalc.product_id}</TableCell>
                          <TableCell>{recalc.location_id}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <span>{recalc.new_red_zone.toFixed(0)}</span>
                              {redChange !== 0 && (
                                redChange > 0 ? (
                                  <TrendingUp className="h-3 w-3 text-orange-500" />
                                ) : (
                                  <TrendingDown className="h-3 w-3 text-green-500" />
                                )
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              ({redChange > 0 ? '+' : ''}{redChange.toFixed(1)}%)
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <span>{recalc.new_yellow_zone.toFixed(0)}</span>
                              {yellowChange !== 0 && (
                                yellowChange > 0 ? (
                                  <TrendingUp className="h-3 w-3 text-orange-500" />
                                ) : (
                                  <TrendingDown className="h-3 w-3 text-green-500" />
                                )
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              ({yellowChange > 0 ? '+' : ''}{yellowChange.toFixed(1)}%)
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <span>{recalc.new_green_zone.toFixed(0)}</span>
                              {greenChange !== 0 && (
                                greenChange > 0 ? (
                                  <TrendingUp className="h-3 w-3 text-orange-500" />
                                ) : (
                                  <TrendingDown className="h-3 w-3 text-green-500" />
                                )
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              ({greenChange > 0 ? '+' : ''}{greenChange.toFixed(1)}%)
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant={recalc.triggered_by === 'AUTOMATIC' ? 'default' : 'secondary'}>
                              {recalc.triggered_by}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs">
                            <div className="space-y-0.5">
                              <div>DAF: {recalc.daf_applied.toFixed(2)}</div>
                              <div>LTAF: {recalc.ltaf_applied.toFixed(2)}</div>
                              <div>Trend: {recalc.trend_factor.toFixed(2)}</div>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Change Details Tab */}
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Change Analysis</CardTitle>
              <CardDescription>
                Before/after comparison with applied adjustment factors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Old ADU</TableHead>
                    <TableHead className="text-right">New ADU</TableHead>
                    <TableHead className="text-right">Old DLT</TableHead>
                    <TableHead className="text-right">New DLT</TableHead>
                    <TableHead>Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentRecalcs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">
                        No change details available
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentRecalcs.slice(0, 10).map((recalc) => (
                      <TableRow key={recalc.id}>
                        <TableCell className="font-medium">{recalc.product_id}</TableCell>
                        <TableCell>{recalc.location_id}</TableCell>
                        <TableCell className="text-right">{recalc.old_adu.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-medium">
                          {recalc.new_adu.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">{recalc.old_dlt}</TableCell>
                        <TableCell className="text-right font-medium">{recalc.new_dlt}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {recalc.change_reason}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
