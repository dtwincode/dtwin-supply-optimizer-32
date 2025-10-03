import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, Plus, Save, Trash2, Calendar, Info, BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { format, isWithinInterval, parseISO } from "date-fns";
import { DAFImplementationGuide } from "./DAFImplementationGuide";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DemandAdjustmentFactor {
  product_id: string;
  location_id: string;
  start_date: string;
  end_date: string;
  daf: number;
  created_at?: string;
}

interface NewDAF {
  product_id: string;
  location_id: string;
  start_date: string;
  end_date: string;
  daf: number;
}

export function DynamicAdjustmentsTab() {
  const { toast } = useToast();
  const [adjustments, setAdjustments] = useState<DemandAdjustmentFactor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newDAF, setNewDAF] = useState<NewDAF>({
    product_id: "",
    location_id: "",
    start_date: "",
    end_date: "",
    daf: 1.0,
  });

  const fetchAdjustments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("demand_adjustment_factor")
        .select("*")
        .order("start_date", { ascending: false });

      if (error) throw error;
      setAdjustments(data || []);
    } catch (error) {
      console.error("Error fetching adjustments:", error);
      toast({
        title: "Error Loading Adjustments",
        description: "Failed to load demand adjustment factors.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdjustments();
  }, []);

  const isActiveAdjustment = (startDate: string, endDate: string) => {
    const now = new Date();
    try {
      return isWithinInterval(now, {
        start: parseISO(startDate),
        end: parseISO(endDate),
      });
    } catch {
      return false;
    }
  };

  const handleAddAdjustment = async () => {
    if (!newDAF.product_id || !newDAF.location_id || !newDAF.start_date || !newDAF.end_date) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (new Date(newDAF.start_date) >= new Date(newDAF.end_date)) {
      toast({
        title: "Validation Error",
        description: "End date must be after start date.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("demand_adjustment_factor")
        .insert([newDAF]);

      if (error) throw error;

      toast({
        title: "Adjustment Added",
        description: `DAF of ${newDAF.daf} added for ${newDAF.product_id} @ ${newDAF.location_id}`,
      });

      setIsDialogOpen(false);
      setNewDAF({
        product_id: "",
        location_id: "",
        start_date: "",
        end_date: "",
        daf: 1.0,
      });
      fetchAdjustments();
    } catch (error) {
      console.error("Error adding adjustment:", error);
      toast({
        title: "Failed to Add Adjustment",
        description: error instanceof Error ? error.message : "Unknown error occurred.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAdjustment = async (productId: string, locationId: string, startDate: string) => {
    try {
      const { error } = await supabase
        .from("demand_adjustment_factor")
        .delete()
        .eq("product_id", productId)
        .eq("location_id", locationId)
        .eq("start_date", startDate);

      if (error) throw error;

      toast({
        title: "Adjustment Deleted",
        description: "The demand adjustment factor has been removed.",
      });

      fetchAdjustments();
    } catch (error) {
      console.error("Error deleting adjustment:", error);
      toast({
        title: "Delete Failed",
        description: error instanceof Error ? error.message : "Failed to delete adjustment.",
        variant: "destructive",
      });
    }
  };

  const getDAFImpactLabel = (daf: number) => {
    if (daf > 1.0) return { label: "Increase", color: "bg-green-500" };
    if (daf < 1.0) return { label: "Decrease", color: "bg-red-500" };
    return { label: "Neutral", color: "bg-gray-500" };
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-96 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs defaultValue="manage" className="space-y-6">
      <TabsList>
        <TabsTrigger value="manage">Manage DAF</TabsTrigger>
        <TabsTrigger value="guide">
          <BookOpen className="h-4 w-4 mr-2" />
          Implementation Guide
        </TabsTrigger>
      </TabsList>

      <TabsContent value="manage" className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Dynamic Adjustment Factors (DAF)
              </CardTitle>
              <CardDescription className="mt-2">
                Manage demand adjustment factors to handle planned promotions, seasonality, or market changes.
                DAF values multiply ADU during buffer calculations.
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add DAF
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Demand Adjustment Factor</DialogTitle>
                  <DialogDescription>
                    Create a new planned adjustment for specific product-location pairs and date ranges.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>DAF Examples:</strong><br />
                      • 1.5 = 50% demand increase (promotions)<br />
                      • 0.7 = 30% demand decrease (off-season)<br />
                      • 1.0 = No adjustment (neutral)
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="product_id">Product ID *</Label>
                      <Input
                        id="product_id"
                        value={newDAF.product_id}
                        onChange={(e) => setNewDAF({ ...newDAF, product_id: e.target.value })}
                        placeholder="e.g., PROD_001"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location_id">Location ID *</Label>
                      <Input
                        id="location_id"
                        value={newDAF.location_id}
                        onChange={(e) => setNewDAF({ ...newDAF, location_id: e.target.value })}
                        placeholder="e.g., LOC_001"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="start_date">Start Date *</Label>
                      <Input
                        id="start_date"
                        type="date"
                        value={newDAF.start_date}
                        onChange={(e) => setNewDAF({ ...newDAF, start_date: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="end_date">End Date *</Label>
                      <Input
                        id="end_date"
                        type="date"
                        value={newDAF.end_date}
                        onChange={(e) => setNewDAF({ ...newDAF, end_date: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="daf">Adjustment Factor (DAF) *</Label>
                      <Input
                        id="daf"
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={newDAF.daf}
                        onChange={(e) => setNewDAF({ ...newDAF, daf: parseFloat(e.target.value) })}
                        placeholder="1.0"
                      />
                      <p className="text-xs text-muted-foreground">
                        Current impact: {((newDAF.daf - 1) * 100).toFixed(0)}% {newDAF.daf > 1 ? "increase" : newDAF.daf < 1 ? "decrease" : "no change"}
                      </p>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddAdjustment}>
                    <Save className="h-4 w-4 mr-2" />
                    Add Adjustment
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {adjustments.length === 0 ? (
            <Alert>
              <AlertDescription>
                No demand adjustment factors configured. Add DAFs to handle planned demand changes like promotions or seasonality.
              </AlertDescription>
            </Alert>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>DAF</TableHead>
                  <TableHead>Impact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adjustments.map((adj, index) => {
                  const isActive = isActiveAdjustment(adj.start_date, adj.end_date);
                  const impact = getDAFImpactLabel(adj.daf);
                  
                  return (
                    <TableRow key={`${adj.product_id}-${adj.location_id}-${adj.start_date}-${index}`}>
                      <TableCell className="font-medium">{adj.product_id}</TableCell>
                      <TableCell>{adj.location_id}</TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(parseISO(adj.start_date), "MMM dd")} - {format(parseISO(adj.end_date), "MMM dd, yyyy")}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">{adj.daf.toFixed(2)}×</TableCell>
                      <TableCell>
                        <Badge className={`${impact.color} text-white`}>
                          {((adj.daf - 1) * 100).toFixed(0)}% {impact.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {isActive ? (
                          <Badge className="bg-green-500 text-white">Active</Badge>
                        ) : new Date(adj.end_date) < new Date() ? (
                          <Badge variant="outline">Expired</Badge>
                        ) : (
                          <Badge variant="outline">Scheduled</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAdjustment(adj.product_id, adj.location_id, adj.start_date)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How DAF Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">📊 Buffer Calculation Impact</h4>
            <p className="text-sm text-muted-foreground">
              When a DAF is active, it multiplies the Average Daily Usage (ADU) in buffer zone calculations:
            </p>
            <div className="bg-muted p-3 rounded-md mt-2 font-mono text-sm">
              <div>Adjusted ADU = Base ADU × DAF</div>
              <div className="mt-1 text-xs text-muted-foreground">
                Example: Base ADU = 100 units, DAF = 1.5 → Adjusted ADU = 150 units
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">🎯 Common Use Cases</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li><strong>Promotions:</strong> DAF 1.3-2.0 for expected demand spikes</li>
              <li><strong>Seasonal Decline:</strong> DAF 0.5-0.8 for off-season periods</li>
              <li><strong>Market Changes:</strong> Adjust for known competitor actions</li>
              <li><strong>Phase-out:</strong> DAF 0.3-0.6 to reduce inventory gradually</li>
            </ul>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>DDI Certification Requirement:</strong> DAF is a core DDMRP component required for certification. 
              It enables planned adjustments to buffer levels based on known future demand changes, 
              separate from reactive adjustments like Trend Factor (TF) or Lead Time Factor (LTF).
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
      </TabsContent>

      <TabsContent value="guide">
        <DAFImplementationGuide />
      </TabsContent>
    </Tabs>
  );
}
