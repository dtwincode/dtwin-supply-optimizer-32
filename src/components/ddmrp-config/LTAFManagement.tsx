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

interface LTAF {
  product_id: string;
  location_id: string;
  start_date: string;
  end_date: string;
  ltaf: number;
  reason?: string;
  created_at: string;
}

export function LTAFManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    product_id: "",
    location_id: "",
    start_date: "",
    end_date: "",
    ltaf: "1.0",
    reason: "",
  });

  // Fetch existing LTAFs
  const { data: ltafs, isLoading } = useQuery({
    queryKey: ["lead-time-adjustment-factors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lead_time_adjustment_factor")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as unknown as LTAF[];
    },
  });

  // Create LTAF mutation
  const createLTAF = useMutation({
    mutationFn: async (newLTAF: Omit<LTAF, "created_at">) => {
      const { error } = await supabase
        .from("lead_time_adjustment_factor")
        .insert([newLTAF]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead-time-adjustment-factors"] });
      toast({
        title: "LTAF Created",
        description: "Lead Time Adjustment Factor has been created successfully.",
      });
      setShowForm(false);
      setFormData({
        product_id: "",
        location_id: "",
        start_date: "",
        end_date: "",
        ltaf: "1.0",
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

  // Delete LTAF mutation
  const deleteLTAF = useMutation({
    mutationFn: async ({ product_id, location_id, start_date }: { product_id: string; location_id: string; start_date: string }) => {
      const { error } = await supabase
        .from("lead_time_adjustment_factor")
        .delete()
        .eq("product_id", product_id)
        .eq("location_id", location_id)
        .eq("start_date", start_date);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead-time-adjustment-factors"] });
      toast({
        title: "LTAF Deleted",
        description: "Lead Time Adjustment Factor has been deleted.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createLTAF.mutate({
      product_id: formData.product_id,
      location_id: formData.location_id,
      start_date: formData.start_date,
      end_date: formData.end_date,
      ltaf: parseFloat(formData.ltaf),
      reason: formData.reason,
    });
  };

  const isActiveLTAF = (ltaf: LTAF) => {
    const today = new Date().toISOString().split("T")[0];
    return ltaf.start_date <= today && ltaf.end_date >= today;
  };

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Lead Time Adjustment Factor (LTAF)</strong> - Adjust Decoupled Lead Time (DLT) for 
          temporary supplier delays, transportation issues, or capacity constraints.
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li><strong>LTAF &gt; 1.0:</strong> Supplier lead time increased (e.g., 1.5 = 50% longer lead time)</li>
            <li><strong>LTAF &lt; 1.0:</strong> Supplier lead time decreased (e.g., 0.8 = 20% faster delivery)</li>
            <li><strong>Example:</strong> Port congestion: LTAF=1.3 for 60 days</li>
          </ul>
        </AlertDescription>
      </Alert>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Lead Time Adjustment Factors (LTAF)</h3>
        <Button onClick={() => setShowForm(!showForm)} variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Add LTAF
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create Lead Time Adjustment Factor</CardTitle>
            <CardDescription>
              Define lead time multipliers for specific date ranges
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

              <div>
                <Label htmlFor="ltaf">LTAF Multiplier</Label>
                <Input
                  id="ltaf"
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="5.0"
                  value={formData.ltaf}
                  onChange={(e) => setFormData({ ...formData, ltaf: e.target.value })}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  1.0 = no change, &gt;1.0 = longer lead time, &lt;1.0 = shorter lead time
                </p>
              </div>

              <div>
                <Label htmlFor="reason">Reason</Label>
                <Textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="e.g., Port congestion, Supplier capacity constraint, New shipping route"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={createLTAF.isPending}>
                  {createLTAF.isPending ? "Creating..." : "Create LTAF"}
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
          <CardTitle>Active & Scheduled LTAFs</CardTitle>
          <CardDescription>
            Manage lead time adjustment factors for your inventory items
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading LTAFs...</p>
          ) : ltafs && ltafs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Date Range</TableHead>
                  <TableHead className="text-center">LTAF Multiplier</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ltafs.map((ltaf) => (
                  <TableRow key={`${ltaf.product_id}-${ltaf.location_id}-${ltaf.start_date}`}>
                    <TableCell>
                      {isActiveLTAF(ltaf) ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                          Scheduled
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{ltaf.product_id}</TableCell>
                    <TableCell>{ltaf.location_id}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(ltaf.start_date).toLocaleDateString()} - {new Date(ltaf.end_date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-semibold">{ltaf.ltaf}×</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{ltaf.reason || "-"}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          deleteLTAF.mutate({
                            product_id: ltaf.product_id,
                            location_id: ltaf.location_id,
                            start_date: ltaf.start_date,
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
              No LTAFs configured yet. Click "Add LTAF" to create one.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
