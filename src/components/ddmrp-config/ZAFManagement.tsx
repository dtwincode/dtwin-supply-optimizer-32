import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ZAF {
  product_id: string;
  location_id: string;
  start_date: string;
  end_date: string;
  yellow_multiplier: number;
  green_multiplier: number;
  reason?: string;
  created_at: string;
}

export function ZAFManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    product_id: "",
    location_id: "",
    start_date: "",
    end_date: "",
    yellow_multiplier: "1.0",
    green_multiplier: "1.0",
    reason: "",
  });

  // Fetch existing ZAFs
  const { data: zafs, isLoading } = useQuery({
    queryKey: ["zone-adjustment-factors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("zone_adjustment_factor" as any)
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as unknown as ZAF[];
    },
  });

  // Create ZAF mutation
  const createZAF = useMutation({
    mutationFn: async (newZAF: Omit<ZAF, "created_at">) => {
      const { error } = await supabase
        .from("zone_adjustment_factor" as any)
        .insert([newZAF]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zone-adjustment-factors"] });
      toast({
        title: "ZAF Created",
        description: "Zone Adjustment Factor has been created successfully.",
      });
      setShowForm(false);
      setFormData({
        product_id: "",
        location_id: "",
        start_date: "",
        end_date: "",
        yellow_multiplier: "1.0",
        green_multiplier: "1.0",
        reason: "",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete ZAF mutation
  const deleteZAF = useMutation({
    mutationFn: async ({ product_id, location_id, start_date }: { product_id: string; location_id: string; start_date: string }) => {
      const { error } = await supabase
        .from("zone_adjustment_factor" as any)
        .delete()
        .eq("product_id", product_id)
        .eq("location_id", location_id)
        .eq("start_date", start_date);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["zone-adjustment-factors"] });
      toast({
        title: "ZAF Deleted",
        description: "Zone Adjustment Factor has been deleted.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createZAF.mutate({
      product_id: formData.product_id,
      location_id: formData.location_id,
      start_date: formData.start_date,
      end_date: formData.end_date,
      yellow_multiplier: parseFloat(formData.yellow_multiplier),
      green_multiplier: parseFloat(formData.green_multiplier),
      reason: formData.reason,
    });
  };

  const isActiveZAF = (zaf: ZAF) => {
    const today = new Date().toISOString().split("T")[0];
    return zaf.start_date <= today && zaf.end_date >= today;
  };

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Zone Adjustment Factor (ZAF)</strong> - Temporarily adjust Yellow and Green zones independently of Red zone. 
          Use for seasonal capacity changes or strategic stock positioning without affecting safety stock (Red zone).
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li><strong>Yellow Multiplier:</strong> Adjust replenishment zone (e.g., 1.5 = 50% larger yellow zone)</li>
            <li><strong>Green Multiplier:</strong> Adjust top-of-buffer zone (e.g., 0.8 = 20% smaller green zone)</li>
            <li><strong>Example:</strong> Pre-build for promotion: Yellow=1.2, Green=1.5</li>
          </ul>
        </AlertDescription>
      </Alert>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Zone Adjustment Factors (ZAF)</h3>
        <Button onClick={() => setShowForm(!showForm)} variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Add ZAF
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create Zone Adjustment Factor</CardTitle>
            <CardDescription>
              Define zone multipliers for specific date ranges
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="product_id">Product ID</Label>
                  <Input
                    id="product_id"
                    value={formData.product_id}
                    onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="location_id">Location ID</Label>
                  <Input
                    id="location_id"
                    value={formData.location_id}
                    onChange={(e) => setFormData({ ...formData, location_id: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="yellow_multiplier">Yellow Zone Multiplier</Label>
                  <Input
                    id="yellow_multiplier"
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="5.0"
                    value={formData.yellow_multiplier}
                    onChange={(e) => setFormData({ ...formData, yellow_multiplier: e.target.value })}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    1.0 = no change, &gt;1.0 = expand, &lt;1.0 = compress
                  </p>
                </div>
                <div>
                  <Label htmlFor="green_multiplier">Green Zone Multiplier</Label>
                  <Input
                    id="green_multiplier"
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="5.0"
                    value={formData.green_multiplier}
                    onChange={(e) => setFormData({ ...formData, green_multiplier: e.target.value })}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    1.0 = no change, &gt;1.0 = expand, &lt;1.0 = compress
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="reason">Reason</Label>
                <Textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="e.g., Pre-build for Q1 promotion, Capacity constraint during maintenance"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={createZAF.isPending}>
                  {createZAF.isPending ? "Creating..." : "Create ZAF"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Active & Scheduled ZAFs</CardTitle>
          <CardDescription>
            Manage zone adjustment factors for your inventory items
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading ZAFs...</p>
          ) : zafs && zafs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Date Range</TableHead>
                  <TableHead className="text-center">Yellow × </TableHead>
                  <TableHead className="text-center">Green ×</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {zafs.map((zaf) => (
                  <TableRow key={`${zaf.product_id}-${zaf.location_id}-${zaf.start_date}`}>
                    <TableCell>
                      {isActiveZAF(zaf) ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                          Scheduled
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{zaf.product_id}</TableCell>
                    <TableCell>{zaf.location_id}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(zaf.start_date).toLocaleDateString()} - {new Date(zaf.end_date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-semibold">{zaf.yellow_multiplier}×</TableCell>
                    <TableCell className="text-center font-semibold">{zaf.green_multiplier}×</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{zaf.reason || "-"}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          deleteZAF.mutate({
                            product_id: zaf.product_id,
                            location_id: zaf.location_id,
                            start_date: zaf.start_date,
                          })
                        }
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No ZAFs configured yet. Click "Add ZAF" to create one.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
