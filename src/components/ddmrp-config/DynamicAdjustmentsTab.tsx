import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, Plus, Save, Trash2, Calendar, Info, BookOpen, Layers, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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

interface ZoneAdjustmentFactor {
  product_id: string;
  location_id: string;
  start_date: string;
  end_date: string;
  zaf: number;
  reason?: string | null;
  created_at?: string;
}

interface LeadTimeAdjustmentFactor {
  product_id: string;
  location_id: string;
  start_date: string;
  end_date: string;
  ltaf: number;
  reason?: string | null;
  created_at?: string;
}

export function DynamicAdjustmentsTab() {
  const { toast } = useToast();
  const [dafAdjustments, setDafAdjustments] = useState<DemandAdjustmentFactor[]>([]);
  const [zafAdjustments, setZafAdjustments] = useState<ZoneAdjustmentFactor[]>([]);
  const [ltafAdjustments, setLtafAdjustments] = useState<LeadTimeAdjustmentFactor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeFactorType, setActiveFactorType] = useState<"daf" | "zaf" | "ltaf">("daf");

  const [newDAF, setNewDAF] = useState({
    product_id: "",
    location_id: "",
    start_date: "",
    end_date: "",
    daf: 1.0,
  });

  const [newZAF, setNewZAF] = useState({
    product_id: "",
    location_id: "",
    start_date: "",
    end_date: "",
    zaf: 1.0,
    reason: "",
  });

  const [newLTAF, setNewLTAF] = useState({
    product_id: "",
    location_id: "",
    start_date: "",
    end_date: "",
    ltaf: 1.0,
    reason: "",
  });

  const fetchAllAdjustments = async () => {
    setIsLoading(true);
    try {
      const [dafData, zafData, ltafData] = await Promise.all([
        supabase.from("demand_adjustment_factor").select("*").order("start_date", { ascending: false }),
        supabase.from("zone_adjustment_factor").select("*").order("start_date", { ascending: false }),
        supabase.from("lead_time_adjustment_factor").select("*").order("start_date", { ascending: false }),
      ]);

      if (dafData.error) throw dafData.error;
      if (zafData.error) throw zafData.error;
      if (ltafData.error) throw ltafData.error;

      setDafAdjustments(dafData.data || []);
      setZafAdjustments(zafData.data || []);
      setLtafAdjustments(ltafData.data || []);
    } catch (error) {
      console.error("Error fetching adjustments:", error);
      toast({
        title: "Error Loading Adjustments",
        description: "Failed to load adjustment factors.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAdjustments();
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

  const handleAddDAF = async () => {
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

    if (newDAF.daf < 0.20 || newDAF.daf > 3.00) {
      toast({
        title: "Validation Error",
        description: "DAF must be between 0.20 and 3.00 per DDMRP standards.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("demand_adjustment_factor").insert([newDAF]);
      if (error) throw error;

      toast({
        title: "DAF Added",
        description: `Demand adjustment of ${newDAF.daf}× added successfully.`,
      });

      setIsDialogOpen(false);
      setNewDAF({ product_id: "", location_id: "", start_date: "", end_date: "", daf: 1.0 });
      fetchAllAdjustments();
    } catch (error) {
      console.error("Error adding DAF:", error);
      toast({
        title: "Failed to Add DAF",
        description: error instanceof Error ? error.message : "Unknown error occurred.",
        variant: "destructive",
      });
    }
  };

  const handleAddZAF = async () => {
    if (!newZAF.product_id || !newZAF.location_id || !newZAF.start_date || !newZAF.end_date) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (new Date(newZAF.start_date) >= new Date(newZAF.end_date)) {
      toast({
        title: "Validation Error",
        description: "End date must be after start date.",
        variant: "destructive",
      });
      return;
    }

    if (newZAF.zaf < 0.20 || newZAF.zaf > 3.00) {
      toast({
        title: "Validation Error",
        description: "ZAF must be between 0.20 and 3.00 per DDMRP standards.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("zone_adjustment_factor").insert([newZAF]);
      if (error) throw error;

      toast({
        title: "ZAF Added",
        description: `Zone adjustment of ${newZAF.zaf}× added successfully.`,
      });

      setIsDialogOpen(false);
      setNewZAF({ product_id: "", location_id: "", start_date: "", end_date: "", zaf: 1.0, reason: "" });
      fetchAllAdjustments();
    } catch (error) {
      console.error("Error adding ZAF:", error);
      toast({
        title: "Failed to Add ZAF",
        description: error instanceof Error ? error.message : "Unknown error occurred.",
        variant: "destructive",
      });
    }
  };

  const handleAddLTAF = async () => {
    if (!newLTAF.product_id || !newLTAF.location_id || !newLTAF.start_date || !newLTAF.end_date) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (new Date(newLTAF.start_date) >= new Date(newLTAF.end_date)) {
      toast({
        title: "Validation Error",
        description: "End date must be after start date.",
        variant: "destructive",
      });
      return;
    }

    if (newLTAF.ltaf < 0.20 || newLTAF.ltaf > 3.00) {
      toast({
        title: "Validation Error",
        description: "LTAF must be between 0.20 and 3.00 per DDMRP standards.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("lead_time_adjustment_factor").insert([newLTAF]);
      if (error) throw error;

      toast({
        title: "LTAF Added",
        description: `Lead time adjustment of ${newLTAF.ltaf}× added successfully.`,
      });

      setIsDialogOpen(false);
      setNewLTAF({ product_id: "", location_id: "", start_date: "", end_date: "", ltaf: 1.0, reason: "" });
      fetchAllAdjustments();
    } catch (error) {
      console.error("Error adding LTAF:", error);
      toast({
        title: "Failed to Add LTAF",
        description: error instanceof Error ? error.message : "Unknown error occurred.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (type: "daf" | "zaf" | "ltaf", productId: string, locationId: string, startDate: string) => {
    try {
      let error;
      if (type === "daf") {
        const result = await supabase.from("demand_adjustment_factor").delete().eq("product_id", productId).eq("location_id", locationId).eq("start_date", startDate);
        error = result.error;
      } else if (type === "zaf") {
        const result = await supabase.from("zone_adjustment_factor").delete().eq("product_id", productId).eq("location_id", locationId).eq("start_date", startDate);
        error = result.error;
      } else {
        const result = await supabase.from("lead_time_adjustment_factor").delete().eq("product_id", productId).eq("location_id", locationId).eq("start_date", startDate);
        error = result.error;
      }

      if (error) throw error;

      toast({
        title: "Adjustment Deleted",
        description: `The ${type.toUpperCase()} has been removed.`,
      });

      fetchAllAdjustments();
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      toast({
        title: "Delete Failed",
        description: error instanceof Error ? error.message : "Failed to delete adjustment.",
        variant: "destructive",
      });
    }
  };

  const getImpactLabel = (value: number) => {
    if (value > 1.0) return { label: "Increase", color: "bg-green-500" };
    if (value < 1.0) return { label: "Decrease", color: "bg-red-500" };
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
    <Tabs defaultValue="factors" className="space-y-6">
      <TabsList>
        <TabsTrigger value="factors">Adjustment Factors</TabsTrigger>
        <TabsTrigger value="guide">
          <BookOpen className="h-4 w-4 mr-2" />
          Implementation Guide
        </TabsTrigger>
      </TabsList>

      <TabsContent value="factors" className="space-y-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>DDMRP Chapter 8: Planned Adjustments</strong><br />
            Three adjustment factors work together: <strong>DAF</strong> (adjusts demand), <strong>ZAF</strong> (adjusts variability), and <strong>LTAF</strong> (adjusts lead time factor).
          </AlertDescription>
        </Alert>

        <Tabs value={activeFactorType} onValueChange={(v) => setActiveFactorType(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daf">
              <TrendingUp className="h-4 w-4 mr-2" />
              DAF ({dafAdjustments.length})
            </TabsTrigger>
            <TabsTrigger value="zaf">
              <Layers className="h-4 w-4 mr-2" />
              ZAF ({zafAdjustments.length})
            </TabsTrigger>
            <TabsTrigger value="ltaf">
              <Clock className="h-4 w-4 mr-2" />
              LTAF ({ltafAdjustments.length})
            </TabsTrigger>
          </TabsList>

          {/* DAF Tab */}
          <TabsContent value="daf" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Demand Adjustment Factor (DAF)</CardTitle>
                    <CardDescription>
                      Adjusts Average Daily Usage (ADU) for planned demand changes (promotions, seasonality).
                    </CardDescription>
                  </div>
                  <Dialog open={isDialogOpen && activeFactorType === "daf"} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => setActiveFactorType("daf")}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add DAF
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Add Demand Adjustment Factor</DialogTitle>
                        <DialogDescription>
                          DAF multiplies ADU in buffer calculations: Adjusted ADU = Base ADU × DAF
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4 py-4">
                        <Alert>
                          <Info className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Range:</strong> 0.20 to 3.00 | <strong>Typical:</strong> 1.20-1.50 (promotions), 0.50-0.80 (decline)
                          </AlertDescription>
                        </Alert>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Product ID *</Label>
                            <Input
                              value={newDAF.product_id}
                              onChange={(e) => setNewDAF({ ...newDAF, product_id: e.target.value })}
                              placeholder="e.g., PROD_001"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Location ID *</Label>
                            <Input
                              value={newDAF.location_id}
                              onChange={(e) => setNewDAF({ ...newDAF, location_id: e.target.value })}
                              placeholder="e.g., LOC_001"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Start Date *</Label>
                            <Input
                              type="date"
                              value={newDAF.start_date}
                              onChange={(e) => setNewDAF({ ...newDAF, start_date: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>End Date *</Label>
                            <Input
                              type="date"
                              value={newDAF.end_date}
                              onChange={(e) => setNewDAF({ ...newDAF, end_date: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2 col-span-2">
                            <Label>DAF Value *</Label>
                            <Input
                              type="number"
                              step="0.05"
                              min="0.20"
                              max="3.00"
                              value={newDAF.daf}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                if (value >= 0.20 && value <= 3.00) {
                                  setNewDAF({ ...newDAF, daf: value });
                                }
                              }}
                            />
                            <p className="text-xs text-muted-foreground">
                              Impact: {((newDAF.daf - 1) * 100).toFixed(0)}% {newDAF.daf > 1 ? "increase" : newDAF.daf < 1 ? "decrease" : "neutral"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddDAF}>
                          <Save className="h-4 w-4 mr-2" />
                          Add DAF
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {dafAdjustments.length === 0 ? (
                  <Alert>
                    <AlertDescription>No DAF configured. Add adjustments to handle planned demand changes.</AlertDescription>
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
                      {dafAdjustments.map((adj, idx) => {
                        const isActive = isActiveAdjustment(adj.start_date, adj.end_date);
                        const impact = getImpactLabel(adj.daf);
                        
                        return (
                          <TableRow key={`daf-${adj.product_id}-${adj.location_id}-${adj.start_date}-${idx}`}>
                            <TableCell className="font-medium">{adj.product_id}</TableCell>
                            <TableCell>{adj.location_id}</TableCell>
                            <TableCell className="text-sm">
                              {format(parseISO(adj.start_date), "MMM dd")} - {format(parseISO(adj.end_date), "MMM dd, yyyy")}
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
                                onClick={() => handleDelete("daf", adj.product_id, adj.location_id, adj.start_date)}
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
          </TabsContent>

          {/* ZAF Tab */}
          <TabsContent value="zaf" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Zone Adjustment Factor (ZAF)</CardTitle>
                    <CardDescription>
                      Adjusts variability factor in buffer zones for temporary variability changes.
                    </CardDescription>
                  </div>
                  <Dialog open={isDialogOpen && activeFactorType === "zaf"} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => setActiveFactorType("zaf")}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add ZAF
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Add Zone Adjustment Factor</DialogTitle>
                        <DialogDescription>
                          ZAF multiplies variability factor: Adjusted VF = Base VF × ZAF
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4 py-4">
                        <Alert>
                          <Info className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Use for:</strong> Temporary supply issues, quality problems, or known variability increases.
                          </AlertDescription>
                        </Alert>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Product ID *</Label>
                            <Input
                              value={newZAF.product_id}
                              onChange={(e) => setNewZAF({ ...newZAF, product_id: e.target.value })}
                              placeholder="e.g., PROD_001"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Location ID *</Label>
                            <Input
                              value={newZAF.location_id}
                              onChange={(e) => setNewZAF({ ...newZAF, location_id: e.target.value })}
                              placeholder="e.g., LOC_001"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Start Date *</Label>
                            <Input
                              type="date"
                              value={newZAF.start_date}
                              onChange={(e) => setNewZAF({ ...newZAF, start_date: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>End Date *</Label>
                            <Input
                              type="date"
                              value={newZAF.end_date}
                              onChange={(e) => setNewZAF({ ...newZAF, end_date: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2 col-span-2">
                            <Label>ZAF Value *</Label>
                            <Input
                              type="number"
                              step="0.05"
                              min="0.20"
                              max="3.00"
                              value={newZAF.zaf}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                if (value >= 0.20 && value <= 3.00) {
                                  setNewZAF({ ...newZAF, zaf: value });
                                }
                              }}
                            />
                          </div>
                          <div className="space-y-2 col-span-2">
                            <Label>Reason</Label>
                            <Textarea
                              value={newZAF.reason}
                              onChange={(e) => setNewZAF({ ...newZAF, reason: e.target.value })}
                              placeholder="e.g., Supplier quality issues expected"
                            />
                          </div>
                        </div>
                      </div>

                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddZAF}>
                          <Save className="h-4 w-4 mr-2" />
                          Add ZAF
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {zafAdjustments.length === 0 ? (
                  <Alert>
                    <AlertDescription>No ZAF configured. Add adjustments to handle variability changes.</AlertDescription>
                  </Alert>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Period</TableHead>
                        <TableHead>ZAF</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {zafAdjustments.map((adj, idx) => {
                        const isActive = isActiveAdjustment(adj.start_date, adj.end_date);
                        
                        return (
                          <TableRow key={`zaf-${adj.product_id}-${adj.location_id}-${adj.start_date}-${idx}`}>
                            <TableCell className="font-medium">{adj.product_id}</TableCell>
                            <TableCell>{adj.location_id}</TableCell>
                            <TableCell className="text-sm">
                              {format(parseISO(adj.start_date), "MMM dd")} - {format(parseISO(adj.end_date), "MMM dd, yyyy")}
                            </TableCell>
                            <TableCell className="font-mono">{adj.zaf.toFixed(2)}×</TableCell>
                            <TableCell className="text-sm">{adj.reason || "-"}</TableCell>
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
                                onClick={() => handleDelete("zaf", adj.product_id, adj.location_id, adj.start_date)}
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
          </TabsContent>

          {/* LTAF Tab */}
          <TabsContent value="ltaf" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Lead Time Adjustment Factor (LTAF)</CardTitle>
                    <CardDescription>
                      Adjusts lead time factor for known temporary lead time changes.
                    </CardDescription>
                  </div>
                  <Dialog open={isDialogOpen && activeFactorType === "ltaf"} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => setActiveFactorType("ltaf")}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add LTAF
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Add Lead Time Adjustment Factor</DialogTitle>
                        <DialogDescription>
                          LTAF multiplies LT factor: Adjusted LTF = Base LTF × LTAF
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4 py-4">
                        <Alert>
                          <Info className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Use for:</strong> Supplier shutdowns, shipping delays, or known lead time extensions.
                          </AlertDescription>
                        </Alert>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Product ID *</Label>
                            <Input
                              value={newLTAF.product_id}
                              onChange={(e) => setNewLTAF({ ...newLTAF, product_id: e.target.value })}
                              placeholder="e.g., PROD_001"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Location ID *</Label>
                            <Input
                              value={newLTAF.location_id}
                              onChange={(e) => setNewLTAF({ ...newLTAF, location_id: e.target.value })}
                              placeholder="e.g., LOC_001"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Start Date *</Label>
                            <Input
                              type="date"
                              value={newLTAF.start_date}
                              onChange={(e) => setNewLTAF({ ...newLTAF, start_date: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>End Date *</Label>
                            <Input
                              type="date"
                              value={newLTAF.end_date}
                              onChange={(e) => setNewLTAF({ ...newLTAF, end_date: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2 col-span-2">
                            <Label>LTAF Value *</Label>
                            <Input
                              type="number"
                              step="0.05"
                              min="0.20"
                              max="3.00"
                              value={newLTAF.ltaf}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                if (value >= 0.20 && value <= 3.00) {
                                  setNewLTAF({ ...newLTAF, ltaf: value });
                                }
                              }}
                            />
                          </div>
                          <div className="space-y-2 col-span-2">
                            <Label>Reason</Label>
                            <Textarea
                              value={newLTAF.reason}
                              onChange={(e) => setNewLTAF({ ...newLTAF, reason: e.target.value })}
                              placeholder="e.g., Supplier holiday shutdown period"
                            />
                          </div>
                        </div>
                      </div>

                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddLTAF}>
                          <Save className="h-4 w-4 mr-2" />
                          Add LTAF
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {ltafAdjustments.length === 0 ? (
                  <Alert>
                    <AlertDescription>No LTAF configured. Add adjustments to handle lead time changes.</AlertDescription>
                  </Alert>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Period</TableHead>
                        <TableHead>LTAF</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ltafAdjustments.map((adj, idx) => {
                        const isActive = isActiveAdjustment(adj.start_date, adj.end_date);
                        
                        return (
                          <TableRow key={`ltaf-${adj.product_id}-${adj.location_id}-${adj.start_date}-${idx}`}>
                            <TableCell className="font-medium">{adj.product_id}</TableCell>
                            <TableCell>{adj.location_id}</TableCell>
                            <TableCell className="text-sm">
                              {format(parseISO(adj.start_date), "MMM dd")} - {format(parseISO(adj.end_date), "MMM dd, yyyy")}
                            </TableCell>
                            <TableCell className="font-mono">{adj.ltaf.toFixed(2)}×</TableCell>
                            <TableCell className="text-sm">{adj.reason || "-"}</TableCell>
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
                                onClick={() => handleDelete("ltaf", adj.product_id, adj.location_id, adj.start_date)}
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
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>How Adjustment Factors Work Together</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-md font-mono text-sm space-y-2">
              <div><strong>Adjusted ADU</strong> = Base ADU × DAF</div>
              <div><strong>Adjusted Variability Factor</strong> = Base VF × ZAF</div>
              <div><strong>Adjusted LT Factor</strong> = Base LTF × LTAF</div>
              <div className="pt-2 border-t mt-2">
                <strong>Red Zone</strong> = Adjusted ADU × DLT × Adjusted LTF × Adjusted VF
              </div>
              <div>
                <strong>Yellow Zone</strong> = Adjusted ADU × DLT × Adjusted LTF
              </div>
              <div>
                <strong>Green Zone</strong> = Adjusted ADU × Order Cycle × Adjusted LTF
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>DDI Certification:</strong> All three planned adjustment factors (DAF, ZAF, LTAF) are required for DDMRP certification. They enable proactive buffer management for known future changes.
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
