
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { DecouplingPoint } from "@/types/inventory/decouplingTypes";

interface DecouplingPointDialogProps {
  open: boolean;
  onClose: () => void;
  productId?: string;
  locationId?: string;
  existingPoint?: DecouplingPoint;
  onSuccess?: () => void;
}

export function DecouplingPointDialog({
  open,
  onClose,
  productId = '',
  locationId = '',
  existingPoint,
  onSuccess
}: DecouplingPointDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<{id: string, name: string}[]>([]);
  const [locations, setLocations] = useState<{id: string, name: string}[]>([]);
  const [bufferProfiles, setBufferProfiles] = useState<{id: string, name: string}[]>([]);
  
  const [formData, setFormData] = useState({
    productId: productId || '',
    locationId: locationId || '',
    bufferProfileId: ''
  });

  // Load dropdown data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const { data: productsData } = await supabase
          .from('product_master')
          .select('product_id, name')
          .order('name');
          
        if (productsData) {
          setProducts(productsData.map(p => ({
            id: p.product_id,
            name: p.name || p.product_id
          })));
        }
        
        // Fetch locations
        const { data: locationsData } = await supabase
          .from('location_master')
          .select('location_id, warehouse')
          .order('warehouse');
          
        if (locationsData) {
          setLocations(locationsData.map(l => ({
            id: l.location_id,
            name: l.warehouse || l.location_id
          })));
        }
        
        // Fetch buffer profiles
        const { data: profilesData } = await supabase
          .from('buffer_profiles')
          .select('id, name')
          .order('name');
          
        if (profilesData) {
          setBufferProfiles(profilesData.map(p => ({
            id: p.id,
            name: p.name
          })));
        }
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    };
    
    if (open) {
      fetchData();
      
      // Set form data from props or existing point
      setFormData({
        productId: productId || existingPoint?.id?.split('-')[0] || '',
        locationId: locationId || existingPoint?.locationId || '',
        bufferProfileId: existingPoint?.bufferProfileId || ''
      });
    }
  }, [open, productId, locationId, existingPoint]);

  const handleSubmit = async () => {
    if (!formData.productId || !formData.locationId || !formData.bufferProfileId) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Create an override in the buffer_profile_override table
      const { error } = await supabase
        .from('buffer_profile_override')
        .upsert({
          product_id: formData.productId,
          location_id: formData.locationId,
          buffer_profile_id: formData.bufferProfileId,
          decoupling_point: true
        });

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Decoupling point saved successfully",
      });
      
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving decoupling point:', error);
      toast({
        title: "Error",
        description: "Failed to save decoupling point",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {existingPoint ? 'Edit Decoupling Point' : 'Add Decoupling Point'}
          </DialogTitle>
          <DialogDescription>
            {existingPoint 
              ? 'Modify this decoupling point configuration.' 
              : 'Create a new decoupling point by overriding the system-generated configuration.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="productId" className="text-right">
              Product
            </Label>
            <div className="col-span-3">
              <Select
                value={formData.productId}
                onValueChange={(value) => setFormData({...formData, productId: value})}
                disabled={!!productId || !!existingPoint}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map(product => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="locationId" className="text-right">
              Location
            </Label>
            <div className="col-span-3">
              <Select
                value={formData.locationId}
                onValueChange={(value) => setFormData({...formData, locationId: value})}
                disabled={!!locationId || !!existingPoint}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(location => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bufferProfileId" className="text-right">
              Buffer Profile
            </Label>
            <div className="col-span-3">
              <Select
                value={formData.bufferProfileId}
                onValueChange={(value) => setFormData({...formData, bufferProfileId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select buffer profile" />
                </SelectTrigger>
                <SelectContent>
                  {bufferProfiles.map(profile => (
                    <SelectItem key={profile.id} value={profile.id}>
                      {profile.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
