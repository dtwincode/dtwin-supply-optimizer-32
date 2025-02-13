
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BufferProfile } from '@/types/inventory';
import { Textarea } from "@/components/ui/textarea";

interface BufferProfileDialogProps {
  onSuccess?: () => void;
}

export const BufferProfileDialog = ({ onSuccess }: BufferProfileDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState<Partial<BufferProfile>>({
    variabilityFactor: 'medium_variability',
    leadTimeFactor: 'medium',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('buffer_profiles')
        .insert({
          name: formData.name,
          description: formData.description,
          variability_factor: formData.variabilityFactor,
          lead_time_factor: formData.leadTimeFactor,
          moq: formData.moq,
          lot_size_factor: formData.lotSizeFactor,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Buffer profile created successfully",
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error creating buffer profile:', error);
      toast({
        title: "Error",
        description: "Failed to create buffer profile",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create Buffer Profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Buffer Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="variabilityFactor">Variability Factor</Label>
            <Select
              value={formData.variabilityFactor}
              onValueChange={(value) => setFormData(prev => ({ ...prev, variabilityFactor: value as BufferProfile['variabilityFactor'] }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select variability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high_variability">High Variability</SelectItem>
                <SelectItem value="medium_variability">Medium Variability</SelectItem>
                <SelectItem value="low_variability">Low Variability</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="leadTimeFactor">Lead Time Factor</Label>
            <Select
              value={formData.leadTimeFactor}
              onValueChange={(value) => setFormData(prev => ({ ...prev, leadTimeFactor: value as BufferProfile['leadTimeFactor'] }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select lead time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="long">Long</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="moq">Minimum Order Quantity</Label>
            <Input
              id="moq"
              type="number"
              value={formData.moq || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, moq: parseInt(e.target.value) }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lotSizeFactor">Lot Size Factor</Label>
            <Input
              id="lotSizeFactor"
              type="number"
              step="0.1"
              value={formData.lotSizeFactor || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, lotSizeFactor: parseFloat(e.target.value) }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter description..."
            />
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Buffer Profile"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
