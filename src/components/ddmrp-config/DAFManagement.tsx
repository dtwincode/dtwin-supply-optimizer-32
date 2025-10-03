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

interface DAF {
  product_id: string;
  location_id: string;
  start_date: string;
  end_date: string;
  daf: number;
  created_at: string;
}

export function DAFManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    product_id: "",
    location_id: "",
    start_date: "",
    end_date: "",
    daf: "1.0",
  });

  const { data: dafs, isLoading } = useQuery({
    queryKey: ["demand-adjustment-factors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("demand_adjustment_factor")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as DAF[];
    },
  });

  const createDAF = useMutation({
    mutationFn: async (newDAF: Omit<DAF, "created_at">) => {
      const { error } = await supabase
        .from("demand_adjustment_factor")
        .insert([newDAF]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["demand-adjustment-factors"] });
      toast({ title: "DAF Created", description: "Demand Adjustment Factor created successfully." });
      setShowForm(false);
      setFormData({ product_id: "", location_id: "", start_date: "", end_date: "", daf: "1.0" });
    },
  });

  const deleteDAF = useMutation({
    mutationFn: async ({ product_id, location_id, start_date }: { product_id: string; location_id: string; start_date: string }) => {
      const { error } = await supabase
        .from("demand_adjustment_factor")
        .delete()
        .eq("product_id", product_id)
        .eq("location_id", location_id)
        .eq("start_date", start_date);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["demand-adjustment-factors"] });
      toast({ title: "DAF Deleted" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createDAF.mutate({
      product_id: formData.product_id,
      location_id: formData.location_id,
      start_date: formData.start_date,
      end_date: formData.end_date,
      daf: parseFloat(formData.daf),
    });
  };

  const isActiveDAF = (daf: DAF) => {
    const today = new Date().toISOString().split("T")[0];
    return daf.start_date <= today && daf.end_date >= today;
  };

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Demand Adjustment Factor (DAF)</strong> - Adjust ADU for planned demand changes (promotions, seasonality).
          Formula: Adjusted ADU = Base ADU × DAF
        </AlertDescription>
      </Alert>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Demand Adjustment Factors (DAF)</h3>
        <Button onClick={() => setShowForm(!showForm)} variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Add DAF
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create Demand Adjustment Factor</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Product ID</Label>
                  <Input value={formData.product_id} onChange={(e) => setFormData({ ...formData, product_id: e.target.value })} required />
                </div>
                <div>
                  <Label>Location ID</Label>
                  <Input value={formData.location_id} onChange={(e) => setFormData({ ...formData, location_id: e.target.value })} required />
                </div>
                <div>
                  <Label>Start Date</Label>
                  <Input type="date" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} required />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input type="date" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} required />
                </div>
                <div className="col-span-2">
                  <Label>DAF Value (0.2-3.0)</Label>
                  <Input type="number" step="0.1" min="0.2" max="3.0" value={formData.daf} onChange={(e) => setFormData({ ...formData, daf: e.target.value })} required />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">Create DAF</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Active & Scheduled DAFs</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? <p>Loading...</p> : dafs && dafs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Date Range</TableHead>
                  <TableHead>DAF</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dafs.map((daf) => (
                  <TableRow key={`${daf.product_id}-${daf.location_id}-${daf.start_date}`}>
                    <TableCell>{isActiveDAF(daf) ? <span className="text-green-600">Active</span> : <span className="text-gray-500">Scheduled</span>}</TableCell>
                    <TableCell>{daf.product_id}</TableCell>
                    <TableCell>{daf.location_id}</TableCell>
                    <TableCell>{daf.start_date} - {daf.end_date}</TableCell>
                    <TableCell className="font-semibold">{daf.daf}×</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => deleteDAF.mutate({ product_id: daf.product_id, location_id: daf.location_id, start_date: daf.start_date })}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : <p className="text-center py-8 text-muted-foreground">No DAFs configured</p>}
        </CardContent>
      </Card>
    </div>
  );
}
