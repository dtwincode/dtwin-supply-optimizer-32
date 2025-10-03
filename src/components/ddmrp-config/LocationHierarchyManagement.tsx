import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Network, Plus, Trash2, Info } from "lucide-react";
import { toast } from "sonner";
import PageLoading from "@/components/PageLoading";

interface LocationHierarchy {
  id: string;
  location_id: string;
  parent_location_id: string | null;
  echelon_level: number;
  echelon_type: string;
  buffer_strategy: string;
  is_active: boolean;
}

interface Location {
  location_id: string;
  region: string;
}

export function LocationHierarchyManagement() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    location_id: "",
    parent_location_id: "",
    echelon_level: "1",
    echelon_type: "STORE",
    buffer_strategy: "standard",
  });

  // Fetch hierarchy
  const { data: hierarchies, isLoading } = useQuery({
    queryKey: ["location-hierarchy"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("location_hierarchy" as any)
        .select("*")
        .order("echelon_level", { ascending: true });

      if (error) throw error;
      return data as unknown as LocationHierarchy[];
    },
  });

  // Fetch available locations
  const { data: locations } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("location_master")
        .select("location_id, region");

      if (error) throw error;
      return data as Location[];
    },
  });

  // Create hierarchy
  const createHierarchy = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase
        .from("location_hierarchy" as any)
        .insert([{
          location_id: data.location_id,
          parent_location_id: data.parent_location_id || null,
          echelon_level: parseInt(data.echelon_level),
          echelon_type: data.echelon_type,
          buffer_strategy: data.buffer_strategy,
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["location-hierarchy"] });
      toast.success("Location hierarchy created");
      setShowForm(false);
      setFormData({
        location_id: "",
        parent_location_id: "",
        echelon_level: "1",
        echelon_type: "STORE",
        buffer_strategy: "standard",
      });
    },
    onError: (error: Error) => {
      toast.error(`Failed to create hierarchy: ${error.message}`);
    },
  });

  // Delete hierarchy
  const deleteHierarchy = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("location_hierarchy" as any)
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["location-hierarchy"] });
      toast.success("Location hierarchy deleted");
    },
  });

  if (isLoading) return <PageLoading />;

  const echelonCounts = hierarchies?.reduce((acc, h) => {
    acc[h.echelon_type] = (acc[h.echelon_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Multi-Echelon Distribution (Chapter 6, Page 115-120)</strong> - Define
          parent-child location relationships for advanced distribution network planning. Each
          echelon can have specific buffer strategies (standard, echelon-specific, consolidated).
        </AlertDescription>
      </Alert>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hierarchies?.length || 0}</div>
          </CardContent>
        </Card>

        {["PLANT", "DC", "REGIONAL_DC", "WAREHOUSE", "STORE"].map((type) => (
          <Card key={type}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">{type.replace("_", " ")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{echelonCounts?.[type] || 0}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Hierarchy Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Network className="h-5 w-5" />
          Location Network Hierarchy
        </h3>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Location
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Location to Hierarchy</CardTitle>
            <CardDescription>
              Define echelon level and parent relationships
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createHierarchy.mutate(formData);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location_id">Location *</Label>
                  <Select
                    value={formData.location_id}
                    onValueChange={(value) => setFormData({ ...formData, location_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations?.map((loc) => (
                        <SelectItem key={loc.location_id} value={loc.location_id}>
                          {loc.location_id} ({loc.region})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="parent_location_id">Parent Location</Label>
                  <Select
                    value={formData.parent_location_id}
                    onValueChange={(value) => setFormData({ ...formData, parent_location_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="None (top level)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {hierarchies?.map((h) => (
                        <SelectItem key={h.id} value={h.location_id}>
                          {h.location_id} (Level {h.echelon_level})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="echelon_level">Echelon Level *</Label>
                  <Input
                    id="echelon_level"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.echelon_level}
                    onChange={(e) => setFormData({ ...formData, echelon_level: e.target.value })}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    1=Plant, 2=DC, 3=Regional, 4+=Store
                  </p>
                </div>

                <div>
                  <Label htmlFor="echelon_type">Echelon Type *</Label>
                  <Select
                    value={formData.echelon_type}
                    onValueChange={(value) => setFormData({ ...formData, echelon_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PLANT">Plant</SelectItem>
                      <SelectItem value="DC">Distribution Center</SelectItem>
                      <SelectItem value="REGIONAL_DC">Regional DC</SelectItem>
                      <SelectItem value="WAREHOUSE">Warehouse</SelectItem>
                      <SelectItem value="STORE">Store</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="buffer_strategy">Buffer Strategy *</Label>
                  <Select
                    value={formData.buffer_strategy}
                    onValueChange={(value) => setFormData({ ...formData, buffer_strategy: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="echelon_specific">Echelon Specific</SelectItem>
                      <SelectItem value="consolidated">Consolidated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={createHierarchy.isPending}>
                  {createHierarchy.isPending ? "Creating..." : "Create Hierarchy"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Hierarchy Table */}
      <Card>
        <CardHeader>
          <CardTitle>Network Hierarchy</CardTitle>
          <CardDescription>
            Multi-echelon location relationships and buffer strategies
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hierarchies && hierarchies.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Level</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>Echelon Type</TableHead>
                  <TableHead>Buffer Strategy</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hierarchies.map((hierarchy) => (
                  <TableRow key={hierarchy.id}>
                    <TableCell>
                      <Badge variant="outline">L{hierarchy.echelon_level}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{hierarchy.location_id}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {hierarchy.parent_location_id || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge>{hierarchy.echelon_type.replace("_", " ")}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{hierarchy.buffer_strategy}</TableCell>
                    <TableCell>
                      {hierarchy.is_active ? (
                        <Badge className="bg-green-600">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteHierarchy.mutate(hierarchy.id)}
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
              No location hierarchies configured. Click "Add Location" to create one.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
