import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, CheckCircle, Activity, Play } from "lucide-react";
import { useSpikeDetection } from "@/hooks/useSpikeDetection";
import PageLoading from "@/components/PageLoading";

export const SpikeDetectionTab = () => {
  const { spikeParameters, spikeDetections, isLoadingParams, isLoadingDetections, updateSpikeParams, qualifyAllOrders } = useSpikeDetection();
  const [horizonFactor, setHorizonFactor] = useState("0.5");
  const [thresholdFactor, setThresholdFactor] = useState("2.0");

  if (isLoadingParams || isLoadingDetections) {
    return <PageLoading />;
  }

  const spikes = spikeDetections?.filter(d => d.is_spike) || [];
  const totalSpikes = spikes.length;
  const totalUnqualified = spikes.reduce((sum, s) => sum + Number(s.unqualified_qty), 0);

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Order Spike Detection (DDMRP Chapter 9)</CardTitle>
              <CardDescription>
                Automatically detect and qualify abnormal orders to prevent buffer distortion
              </CardDescription>
            </div>
            <Button
              onClick={() => qualifyAllOrders.mutate()}
              disabled={qualifyAllOrders.isPending}
            >
              <Play className="mr-2 h-4 w-4" />
              Run Qualification
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Total Orders</span>
              </div>
              <p className="text-2xl font-bold">{spikeDetections?.length || 0}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <span className="text-sm font-medium">Detected Spikes</span>
              </div>
              <p className="text-2xl font-bold text-destructive">{totalSpikes}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-success" />
                <span className="text-sm font-medium">Unqualified Qty</span>
              </div>
              <p className="text-2xl font-bold">{totalUnqualified.toFixed(0)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="detections">
        <TabsList>
          <TabsTrigger value="detections">Spike Detections</TabsTrigger>
          <TabsTrigger value="parameters">Configuration</TabsTrigger>
          <TabsTrigger value="qualified">All Orders</TabsTrigger>
        </TabsList>

        {/* Spike Detections Tab */}
        <TabsContent value="detections">
          <Card>
            <CardHeader>
              <CardTitle>Detected Order Spikes</CardTitle>
              <CardDescription>
                Orders exceeding spike threshold within spike horizon
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Order Qty</TableHead>
                    <TableHead className="text-right">Qualified</TableHead>
                    <TableHead className="text-right">Unqualified</TableHead>
                    <TableHead className="text-right">Threshold</TableHead>
                    <TableHead className="text-right">Days Out</TableHead>
                    <TableHead>Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {spikes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground">
                        No spikes detected
                      </TableCell>
                    </TableRow>
                  ) : (
                    spikes.map((detection, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{detection.sku}</div>
                            <div className="text-sm text-muted-foreground">{detection.product_name}</div>
                          </div>
                        </TableCell>
                        <TableCell>{detection.location_id}</TableCell>
                        <TableCell className="text-right font-medium">{detection.order_qty}</TableCell>
                        <TableCell className="text-right text-success">{detection.qualified_qty}</TableCell>
                        <TableCell className="text-right text-destructive font-medium">
                          {detection.unqualified_qty}
                        </TableCell>
                        <TableCell className="text-right">{detection.spike_threshold_qty?.toFixed(0)}</TableCell>
                        <TableCell className="text-right">{detection.days_until_due}</TableCell>
                        <TableCell className="text-sm">{detection.qualification_reason}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Parameters Tab */}
        <TabsContent value="parameters">
          <Card>
            <CardHeader>
              <CardTitle>Global Spike Parameters</CardTitle>
              <CardDescription>
                Default parameters for spike detection (DDMRP Chapter 9 defaults)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6 max-w-2xl">
                <div className="space-y-2">
                  <Label htmlFor="horizonFactor">Spike Horizon Factor</Label>
                  <Input
                    id="horizonFactor"
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="2.0"
                    value={horizonFactor}
                    onChange={(e) => setHorizonFactor(e.target.value)}
                    placeholder="0.5"
                  />
                  <p className="text-sm text-muted-foreground">
                    Multiplier for DLT (default: 0.5x DLT)
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thresholdFactor">Spike Threshold Factor</Label>
                  <Input
                    id="thresholdFactor"
                    type="number"
                    step="0.5"
                    min="1.0"
                    max="10.0"
                    value={thresholdFactor}
                    onChange={(e) => setThresholdFactor(e.target.value)}
                    placeholder="2.0"
                  />
                  <p className="text-sm text-muted-foreground">
                    Multiplier for ADU (default: 2x ADU)
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 border rounded-lg bg-muted/50">
                <h4 className="font-semibold mb-2">DDMRP Book Recommendations:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• <strong>Spike Horizon:</strong> 0.5x DLT (orders within half the lead time)</li>
                  <li>• <strong>Spike Threshold:</strong> 2x ADU (orders exceeding twice daily average)</li>
                  <li>• <strong>Purpose:</strong> Prevent abnormal orders from distorting buffer calculations</li>
                  <li>• <strong>Impact:</strong> Spikes are excluded from NFP calculation</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* All Orders Tab */}
        <TabsContent value="qualified">
          <Card>
            <CardHeader>
              <CardTitle>All Qualified Orders</CardTitle>
              <CardDescription>Complete order qualification history</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Order Qty</TableHead>
                    <TableHead className="text-right">Qualified</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Days Out</TableHead>
                    <TableHead>Qualified At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!spikeDetections || spikeDetections.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">
                        No orders qualified yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    spikeDetections.map((detection, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{detection.sku}</div>
                            <div className="text-sm text-muted-foreground">{detection.product_name}</div>
                          </div>
                        </TableCell>
                        <TableCell>{detection.location_id}</TableCell>
                        <TableCell className="text-right">{detection.order_qty}</TableCell>
                        <TableCell className="text-right">{detection.qualified_qty}</TableCell>
                        <TableCell>
                          {detection.is_spike ? (
                            <Badge variant="destructive">SPIKE</Badge>
                          ) : (
                            <Badge variant="default">QUALIFIED</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">{detection.days_until_due}</TableCell>
                        <TableCell>{new Date(detection.qualified_at).toLocaleDateString()}</TableCell>
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
