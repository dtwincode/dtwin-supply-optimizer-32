import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Search, Plus, Trash2, Shield, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  product_name: string;
  sku: string;
  category: string;
  location_id: string;
  is_decoupling_point: boolean;
}

export function DecouplingPointManagement() {
  const [decouplingPoints, setDecouplingPoints] = useState<DecouplingPoint[]>([]);
  const [availablePairs, setAvailablePairs] = useState<ProductLocationPair[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPair, setSelectedPair] = useState<ProductLocationPair | null>(null);
  const [bufferProfile, setBufferProfile] = useState("BP_DEFAULT");
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
        .eq("is_strategic", true)
        .order("created_at", { ascending: false });

      if (dpError) throw dpError;
      setDecouplingPoints(dpData || []);

      // Load all product-location pairs
      const { data: productData, error: productError } = await supabase
        .from("product_master")
        .select("product_id, sku, name, category");

      const { data: locationData, error: locationError } = await supabase
        .from("location_master")
        .select("location_id");

      if (productError || locationError) throw productError || locationError;

      // Create all possible pairs and check if they're decoupling points
      const dpSet = new Set(dpData?.map(dp => `${dp.product_id}-${dp.location_id}`) || []);
      const pairs: ProductLocationPair[] = [];

      productData?.forEach(product => {
        locationData?.forEach(location => {
          pairs.push({
            product_id: product.product_id,
            product_name: product.name,
            sku: product.sku,
            category: product.category || "N/A",
            location_id: location.location_id,
            is_decoupling_point: dpSet.has(`${product.product_id}-${location.location_id}`)
          });
        });
      });

      setAvailablePairs(pairs);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDesignate = async () => {
    if (!selectedPair || !reason.trim()) {
      toast.error("Please provide a reason for designation");
      return;
    }

    try {
      const { error } = await supabase.from("decoupling_points").insert({
        product_id: selectedPair.product_id,
        location_id: selectedPair.location_id,
        buffer_profile_id: bufferProfile,
        designation_reason: reason,
        is_strategic: true
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

  const filteredPairs = availablePairs.filter(pair =>
    !pair.is_decoupling_point &&
    (pair.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     pair.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
     pair.location_id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          In DDMRP, buffer zones exist ONLY at strategic decoupling points. Designate product-location pairs where you want to maintain buffers.
        </AlertDescription>
      </Alert>

      {/* Active Decoupling Points */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Active Decoupling Points ({decouplingPoints.length})
          </CardTitle>
          <CardDescription>
            Strategic inventory positions with buffer zones
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : decouplingPoints.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No decoupling points designated yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product ID</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Buffer Profile</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Designated</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {decouplingPoints.map((dp) => (
                  <TableRow key={dp.id}>
                    <TableCell className="font-medium">{dp.product_id}</TableCell>
                    <TableCell>{dp.location_id}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{dp.buffer_profile_id}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{dp.designation_reason || "N/A"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(dp.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(dp.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Available Product-Location Pairs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Designate New Decoupling Points</span>
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </CardTitle>
          <CardDescription>
            Select product-location pairs to designate as strategic decoupling points
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPairs.slice(0, 50).map((pair, idx) => (
                <TableRow key={`${pair.product_id}-${pair.location_id}-${idx}`}>
                  <TableCell className="font-mono text-sm">{pair.sku}</TableCell>
                  <TableCell>{pair.product_name}</TableCell>
                  <TableCell>{pair.category}</TableCell>
                  <TableCell>{pair.location_id}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedPair(pair);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Designate
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredPairs.length > 50 && (
            <p className="text-sm text-muted-foreground text-center mt-4">
              Showing first 50 results. Use search to find specific products.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Designation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Designate Decoupling Point</DialogTitle>
            <DialogDescription>
              This will create a strategic buffer zone for this product-location pair
            </DialogDescription>
          </DialogHeader>
          {selectedPair && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4 space-y-2">
                <p><strong>Product:</strong> {selectedPair.product_name}</p>
                <p><strong>SKU:</strong> {selectedPair.sku}</p>
                <p><strong>Location:</strong> {selectedPair.location_id}</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Buffer Profile</label>
                <Select value={bufferProfile} onValueChange={setBufferProfile}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BP_LOW">BP_LOW - Low Variability</SelectItem>
                    <SelectItem value="BP_MEDIUM">BP_MEDIUM - Medium Variability</SelectItem>
                    <SelectItem value="BP_HIGH">BP_HIGH - High Variability</SelectItem>
                    <SelectItem value="BP_DEFAULT">BP_DEFAULT</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Designation Reason *</label>
                <Textarea
                  placeholder="Why is this a strategic decoupling point? (e.g., high demand variability, long lead time, critical for customer service...)"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDesignate} disabled={!reason.trim()}>
              Designate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
