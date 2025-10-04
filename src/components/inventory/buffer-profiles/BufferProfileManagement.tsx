import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit2, Save, X, Filter } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useInventoryFilter } from "../InventoryFilterContext";

interface BufferProfile {
  buffer_profile_id: string;
  name: string;
  description: string | null;
  lt_factor: number;
  variability_factor: number;
  order_cycle_days: number;
  min_order_qty: number;
  rounding_multiple: number;
}

interface BufferProfileOverride {
  product_id: string;
  location_id: string;
  buffer_profile_id: string;
  yellow_multiplier_override: number | null;
  green_multiplier_override: number | null;
}

export function BufferProfileManagement() {
  const { toast } = useToast();
  const { filters } = useInventoryFilter();
  const [profiles, setProfiles] = useState<BufferProfile[]>([]);
  const [overrides, setOverrides] = useState<BufferProfileOverride[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState<string | null>(null);
  const [newProfile, setNewProfile] = useState(false);
  const [formData, setFormData] = useState<Partial<BufferProfile>>({});

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load buffer profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('buffer_profile_master')
        .select('*')
        .order('name');

      if (profilesError) throw profilesError;
      setProfiles(profilesData || []);

      // Load overrides with filters
      let overridesQuery = supabase
        .from('buffer_profile_override')
        .select('*');
      
      if (filters.locationId) {
        overridesQuery = overridesQuery.eq('location_id', filters.locationId);
      }

      const { data: overridesData, error: overridesError } = await overridesQuery;
      if (overridesError) throw overridesError;
      setOverrides(overridesData || []);
    } catch (error: any) {
      toast({
        title: "Error loading data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      if (newProfile) {
        // Insert new profile
        const { error } = await supabase
          .from('buffer_profile_master')
          .insert([{
            buffer_profile_id: formData.buffer_profile_id!,
            name: formData.name!,
            description: formData.description,
            lt_factor: formData.lt_factor || 1.0,
            variability_factor: formData.variability_factor || 0.5,
            order_cycle_days: formData.order_cycle_days || 7,
            min_order_qty: formData.min_order_qty || 0,
            rounding_multiple: formData.rounding_multiple || 1,
          }]);

        if (error) throw error;
        
        toast({
          title: "Profile created",
          description: `Buffer profile ${formData.name} created successfully`,
        });
      } else {
        // Update existing profile
        const { error } = await supabase
          .from('buffer_profile_master')
          .update({
            name: formData.name,
            description: formData.description || null,
            lt_factor: formData.lt_factor,
            variability_factor: formData.variability_factor,
            order_cycle_days: formData.order_cycle_days,
            min_order_qty: formData.min_order_qty,
            rounding_multiple: formData.rounding_multiple,
          })
          .eq('buffer_profile_id', editingProfile!);

        if (error) throw error;

        toast({
          title: "Profile updated",
          description: "Buffer profile updated successfully",
        });
      }

      setEditingProfile(null);
      setNewProfile(false);
      setFormData({});
      loadData();
    } catch (error: any) {
      toast({
        title: "Error saving profile",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (profile: BufferProfile) => {
    setEditingProfile(profile.buffer_profile_id);
    setFormData(profile);
  };

  const handleCancel = () => {
    setEditingProfile(null);
    setNewProfile(false);
    setFormData({});
  };

  const handleNewProfile = () => {
    setNewProfile(true);
    setFormData({
      buffer_profile_id: `BP_${Date.now()}`,
      name: '',
      description: '',
      lt_factor: 1.0,
      variability_factor: 0.5,
      order_cycle_days: 7,
      min_order_qty: 0,
      rounding_multiple: 1,
    });
  };

  if (loading) {
    return <div className="p-8">Loading buffer profiles...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Buffer Profile Management</h1>
          <p className="text-muted-foreground mt-2">
            Configure DDMRP buffer profiles and product-specific overrides
          </p>
        </div>
        <Button onClick={handleNewProfile} disabled={newProfile || editingProfile !== null}>
          <Plus className="mr-2 h-4 w-4" />
          New Profile
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Buffer Profiles</CardTitle>
          <CardDescription>
            Master buffer profiles define default parameters for calculating red, yellow, and green zones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Profile ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>LT Factor</TableHead>
                <TableHead>Variability</TableHead>
                <TableHead>Order Cycle</TableHead>
                <TableHead>MOQ</TableHead>
                <TableHead>Rounding</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {newProfile && (
                <TableRow className="bg-muted/50">
                  <TableCell>
                    <Input
                      value={formData.buffer_profile_id || ''}
                      onChange={(e) => setFormData({ ...formData, buffer_profile_id: e.target.value })}
                      placeholder="BP_NEW"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Profile Name"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.lt_factor || 1.0}
                      onChange={(e) => setFormData({ ...formData, lt_factor: parseFloat(e.target.value) })}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.variability_factor || 0.5}
                      onChange={(e) => setFormData({ ...formData, variability_factor: parseFloat(e.target.value) })}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={formData.order_cycle_days || 7}
                      onChange={(e) => setFormData({ ...formData, order_cycle_days: parseInt(e.target.value) })}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={formData.min_order_qty || 0}
                      onChange={(e) => setFormData({ ...formData, min_order_qty: parseInt(e.target.value) })}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={formData.rounding_multiple || 1}
                      onChange={(e) => setFormData({ ...formData, rounding_multiple: parseInt(e.target.value) })}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveProfile}>
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancel}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {profiles.map((profile) => (
                <TableRow key={profile.buffer_profile_id}>
                  {editingProfile === profile.buffer_profile_id ? (
                    <>
                      <TableCell>{profile.buffer_profile_id}</TableCell>
                      <TableCell>
                        <Input
                          value={formData.name || ''}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.1"
                          value={formData.lt_factor}
                          onChange={(e) => setFormData({ ...formData, lt_factor: parseFloat(e.target.value) })}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.1"
                          value={formData.variability_factor}
                          onChange={(e) => setFormData({ ...formData, variability_factor: parseFloat(e.target.value) })}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={formData.order_cycle_days}
                          onChange={(e) => setFormData({ ...formData, order_cycle_days: parseInt(e.target.value) })}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={formData.min_order_qty}
                          onChange={(e) => setFormData({ ...formData, min_order_qty: parseInt(e.target.value) })}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={formData.rounding_multiple}
                          onChange={(e) => setFormData({ ...formData, rounding_multiple: parseInt(e.target.value) })}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleSaveProfile}>
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancel}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell><Badge variant="outline">{profile.buffer_profile_id}</Badge></TableCell>
                      <TableCell className="font-medium">{profile.name}</TableCell>
                      <TableCell>{profile.lt_factor.toFixed(2)}</TableCell>
                      <TableCell>{profile.variability_factor.toFixed(2)}</TableCell>
                      <TableCell>{profile.order_cycle_days} days</TableCell>
                      <TableCell>{profile.min_order_qty}</TableCell>
                      <TableCell>{profile.rounding_multiple}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(profile)}
                          disabled={editingProfile !== null || newProfile}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Buffer Profile Overrides</CardTitle>
          <CardDescription>
            Product-location specific overrides ({overrides.length} active)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Overrides allow fine-tuning yellow and green zone multipliers for specific product-location combinations.
            Configure these through the Decoupling Point Management interface.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
