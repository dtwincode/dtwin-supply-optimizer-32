
import React, { useState } from 'react';
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
import { BufferProfile } from '@/types/inventory';
import { Textarea } from "@/components/ui/textarea";
import { createBufferProfile, updateBufferProfile } from '@/services/inventoryService';

export interface BufferProfileDialogProps {
  existingProfile?: BufferProfile;
  onSuccess?: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BufferProfileDialog = ({ 
  existingProfile, 
  onSuccess, 
  open, 
  onOpenChange 
}: BufferProfileDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<BufferProfile>>(
    existingProfile || {
      name: '',
      description: '',
      variabilityFactor: 'medium_variability',
      leadTimeFactor: 'medium',
      moq: undefined,
      lotSizeFactor: undefined
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast({
        title: "Validation Error",
        description: "Profile name is required",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      if (existingProfile?.id) {
        await updateBufferProfile({
          ...formData,
          id: existingProfile.id
        } as BufferProfile);
        toast({
          title: "Success",
          description: "Buffer profile updated successfully",
        });
      } else {
        await createBufferProfile(formData as Omit<BufferProfile, 'id'>);
        toast({
          title: "Success",
          description: "Buffer profile created successfully",
        });
      }

      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving buffer profile:', error);
      toast({
        title: "Error",
        description: "Failed to save buffer profile",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {existingProfile ? "Edit Buffer Profile" : "Create Buffer Profile"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="variabilityFactor">Variability</Label>
              <Select
                value={formData.variabilityFactor}
                onValueChange={(value) => setFormData(prev => ({ ...prev, variabilityFactor: value as BufferProfile['variabilityFactor'] }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select variability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high_variability">High</SelectItem>
                  <SelectItem value="medium_variability">Medium</SelectItem>
                  <SelectItem value="low_variability">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="leadTimeFactor">Lead Time</Label>
              <Select
                value={formData.leadTimeFactor}
                onValueChange={(value) => setFormData(prev => ({ ...prev, leadTimeFactor: value as BufferProfile['leadTimeFactor'] }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select lead time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="long">Long</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="moq">MOQ</Label>
              <Input
                id="moq"
                type="number"
                value={formData.moq || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, moq: parseInt(e.target.value) }))}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="lotSizeFactor">Lot Size Factor</Label>
            <Input
              id="lotSizeFactor"
              type="number"
              step="0.1"
              value={formData.lotSizeFactor || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, lotSizeFactor: parseFloat(e.target.value) }))}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the buffer profile..."
              className="mt-1 h-16"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : existingProfile ? "Update Profile" : "Create Profile"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
