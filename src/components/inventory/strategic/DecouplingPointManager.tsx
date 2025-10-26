import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, MapPin, Sparkles, Loader2, Package, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useInventoryConfig } from "@/hooks/useInventoryConfig";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DecouplingPoint {
  id: string;
  product_id: string;
  location_id: string;
  buffer_profile_id: string;
  is_strategic: boolean;
  designation_reason: string | null;
  created_at: string;
  product_name?: string;
  sku?: string;
}

interface ProductLocationPair {
  product_id: string;
  location_id: string;
  product_name?: string;
  sku?: string;
  is_decoupling_point: boolean;
}

interface LocationSummary {
  location_id: string;
  product_count: number;
  avg_score: number;
  buffer_profiles: string[];
  products: DecouplingPoint[];
}

export function DecouplingPointManager() {
  const { getConfig } = useInventoryConfig();
  const [decouplingPoints, setDecouplingPoints] = useState<DecouplingPoint[]>([]);
  const [availablePairs, setAvailablePairs] = useState<ProductLocationPair[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPair, setSelectedPair] = useState<ProductLocationPair | null>(null);
  const [bufferProfile, setBufferProfile] = useState("BP_DEFAULT");
  const [reason, setReason] = useState("");
  const [autoDesignating, setAutoDesignating] = useState(false);
  const [scoringResults, setScoringResults] = useState<any>(null);
  const [locationSummaries, setLocationSummaries] = useState<LocationSummary[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationSummary | null>(null);
  const [drillDownOpen, setDrillDownOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load existing decoupling points
      const { data: dpData, error: dpError } = await supabase
        .from("decoupling_points")
        .select("*")
        .order("created_at", { ascending: false });

      if (dpError) throw dpError;
      
      // Get unique product IDs
      const productIds = [...new Set(dpData?.map(dp => dp.product_id) || [])];
      
      // Fetch product details
      const { data: productsData } = await supabase
        .from("product_master")
        .select("product_id, sku, name")
        .in("product_id", productIds);
      
      const productMap = new Map(productsData?.map(p => [p.product_id, p]) || []);
      
      const enrichedDpData = (dpData || []).map((dp: any) => {
        const product = productMap.get(dp.product_id);
        return {
          ...dp,
          sku: product?.sku,
          product_name: product?.name,
        };
      });
      
      setDecouplingPoints(enrichedDpData);

      // Group by location
      const locationMap = new Map<string, LocationSummary>();
      
      enrichedDpData.forEach((dp: DecouplingPoint) => {
        if (!locationMap.has(dp.location_id)) {
          locationMap.set(dp.location_id, {
            location_id: dp.location_id,
            product_count: 0,
            avg_score: 39, // Mock score - في الواقع يجي من الـ backend
            buffer_profiles: [],
            products: [],
          });
        }
        
        const summary = locationMap.get(dp.location_id)!;
        summary.product_count++;
        summary.products.push(dp);
        
        if (!summary.buffer_profiles.includes(dp.buffer_profile_id)) {
          summary.buffer_profiles.push(dp.buffer_profile_id);
        }
      });
      
      setLocationSummaries(Array.from(locationMap.values()));

      // Load all product-location pairs
      const { data: pairsData, error: pairsError } = await supabase
        .from("product_location_pairs")
        .select("*");

      if (pairsError) throw pairsError;

      // Mark which pairs are already decoupling points
      const enrichedPairs = (pairsData || []).map((pair: any) => ({
        ...pair,
        is_decoupling_point: enrichedDpData?.some(
          (dp: DecouplingPoint) =>
            dp.product_id === pair.product_id && dp.location_id === pair.location_id
        ),
      }));

      setAvailablePairs(enrichedPairs);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load decoupling points");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDesignate = async () => {
    if (!selectedPair) return;

    try {
      const { error } = await supabase.from("decoupling_points").insert({
        product_id: selectedPair.product_id,
        location_id: selectedPair.location_id,
        buffer_profile_id: bufferProfile,
        is_strategic: true,
        designation_reason: reason || null,
      });

      if (error) throw error;

      toast.success("Decoupling point designated successfully");
      setIsDialogOpen(false);
      setSelectedPair(null);
      setReason("");
      loadData();
    } catch (error) {
      console.error("Error designating decoupling point:", error);
      toast.error("Failed to designate decoupling point");
    }
  };

  const handleRemove = async (id: string) => {
    try {
      const { error } = await supabase
        .from("decoupling_points")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Decoupling point removed");
      loadData();
    } catch (error) {
      console.error("Error removing decoupling point:", error);
      toast.error("Failed to remove decoupling point");
    }
  };

  const handleAutoDesignate = async () => {
    setAutoDesignating(true);
    try {
      const threshold = getConfig('auto_designate_threshold', 0.75);
      
      toast.info("Starting auto-designation analysis...");
      
      const { data, error } = await supabase.functions.invoke('auto-designate-decoupling', {
        body: {
          threshold,
          scenario_name: "default",
          batch_size: 100
        }
      });

      if (error) throw error;

      const results = data as any;
      setScoringResults(results);
      
      toast.success(
        `Auto-Designation Complete: ${results?.summary?.auto_designated || 0} points designated`,
        { description: `${results?.summary?.review_required || 0} require review, ${results?.summary?.auto_rejected || 0} rejected` }
      );

      loadData();
    } catch (error) {
      console.error("Error auto-designating:", error);
      toast.error("Failed to auto-designate decoupling points");
    } finally {
      setAutoDesignating(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-64 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Decoupling Point Management</h3>
              <p className="text-sm text-muted-foreground">
                {decouplingPoints.length} active decoupling points | {availablePairs.filter(p => !p.is_decoupling_point).length} available pairs
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleAutoDesignate}
                disabled={autoDesignating}
                variant="default"
                size="lg"
              >
                {autoDesignating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing 9 Factors...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Auto-Designate (AI)
                  </>
                )}
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Manual Designate
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Designate Decoupling Point</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Product-Location Pair</Label>
                    <Select
                      onValueChange={(value) => {
                        const pair = availablePairs.find(
                          (p) => `${p.product_id}-${p.location_id}` === value
                        );
                        setSelectedPair(pair || null);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a pair" />
                      </SelectTrigger>
                      <SelectContent>
                        {availablePairs
                          .filter((p) => !p.is_decoupling_point)
                          .map((pair) => (
                            <SelectItem
                              key={`${pair.product_id}-${pair.location_id}`}
                              value={`${pair.product_id}-${pair.location_id}`}
                            >
                              {pair.product_id} @ {pair.location_id}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Buffer Profile</Label>
                    <Select value={bufferProfile} onValueChange={setBufferProfile}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BP_DEFAULT">Default</SelectItem>
                        <SelectItem value="BP_LOW">Low Variability</SelectItem>
                        <SelectItem value="BP_MEDIUM">Medium Variability</SelectItem>
                        <SelectItem value="BP_HIGH">High Variability</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Reason (Optional)</Label>
                    <Textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Why is this a strategic decoupling point?"
                    />
                  </div>
                  <Button onClick={handleDesignate} className="w-full">
                    Designate
                  </Button>
                </div>
              </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      {scoringResults && (
        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle className="text-base">Latest Auto-Designation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Analyzed</p>
                <p className="text-xl font-bold">{scoringResults.summary?.total_analyzed || 0}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Designated</p>
                <p className="text-xl font-bold text-green-600">
                  {scoringResults.summary?.auto_designated || 0}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Review</p>
                <p className="text-xl font-bold text-yellow-600">
                  {scoringResults.summary?.review_required || 0}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Rejected</p>
                <p className="text-xl font-bold text-red-600">
                  {scoringResults.summary?.auto_rejected || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Location-Level Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Strategic Decoupling Locations
          </CardTitle>
          <CardDescription>
            Locations designated as strategic decoupling points for inventory buffering
          </CardDescription>
        </CardHeader>
        <CardContent>
          {locationSummaries.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No decoupling points designated yet</p>
              <p className="text-sm mt-1">Use Auto-Designate or Manual Designate to begin</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {locationSummaries.map((location) => (
                <Card
                  key={location.location_id}
                  className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary/50"
                  onClick={() => {
                    setSelectedLocation(location);
                    setDrillDownOpen(true);
                  }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        <CardTitle className="text-base">{location.location_id}</CardTitle>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Products</span>
                      <div className="flex items-center gap-1">
                        <Package className="h-4 w-4" />
                        <span className="font-semibold">{location.product_count}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Avg Score</span>
                      <Badge variant="secondary">{location.avg_score.toFixed(1)}</Badge>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm text-muted-foreground">Buffer Profiles</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {location.buffer_profiles.map((bp) => (
                          <Badge key={bp} variant="outline" className="text-xs">
                            {bp.replace("BP_", "")}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Drill-Down Dialog */}
      <Dialog open={drillDownOpen} onOpenChange={setDrillDownOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {selectedLocation?.location_id} - Product Details
            </DialogTitle>
          </DialogHeader>
          {selectedLocation && (
            <div className="space-y-4">
              <div className="flex gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Total Products</p>
                  <p className="text-2xl font-bold">{selectedLocation.product_count}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Score</p>
                  <p className="text-2xl font-bold">{selectedLocation.avg_score.toFixed(1)}</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Buffer Profiles</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedLocation.buffer_profiles.map((bp) => (
                      <Badge key={bp} variant="outline">
                        {bp}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Buffer Profile</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedLocation.products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-mono text-sm">{product.sku || product.product_id}</TableCell>
                      <TableCell>{product.product_name || "-"}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{product.buffer_profile_id}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {product.designation_reason || "-"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemove(product.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
