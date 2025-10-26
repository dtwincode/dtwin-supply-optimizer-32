import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, MapPin, Sparkles, Loader2 } from "lucide-react";
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

interface DecouplingPoint {
  id: string;
  product_id: string;
  location_id: string;
  buffer_profile_id: string;
  is_strategic: boolean;
  designation_reason: string | null;
  created_at: string;
}

interface ProductLocationPair {
  product_id: string;
  location_id: string;
  product_name?: string;
  sku?: string;
  is_decoupling_point: boolean;
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
      setDecouplingPoints(dpData || []);

      // Load all product-location pairs
      const { data: pairsData, error: pairsError } = await supabase
        .from("product_location_pairs")
        .select("*");

      if (pairsError) throw pairsError;

      // Mark which pairs are already decoupling points
      const enrichedPairs = (pairsData || []).map((pair: any) => ({
        ...pair,
        is_decoupling_point: dpData?.some(
          (dp) =>
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

      {/* Active Decoupling Points - Grid Layout */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Active Strategic Decoupling Points
          </CardTitle>
        </CardHeader>
        <CardContent>
          {decouplingPoints.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No decoupling points designated yet</p>
              <p className="text-sm mt-1">Use Auto-Designate or Manual Designate to begin</p>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {decouplingPoints.map((dp) => (
                <div
                  key={dp.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-base">{dp.product_id}</span>
                        <Badge variant="outline" className="text-xs">{dp.location_id}</Badge>
                        <Badge className="text-xs">{dp.buffer_profile_id}</Badge>
                      </div>
                      {dp.designation_reason && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {dp.designation_reason}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(dp.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
