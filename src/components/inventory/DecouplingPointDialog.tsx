
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useBufferProfiles } from "@/hooks/useBufferProfiles";
import { DecouplingPoint } from "@/types/inventory/decouplingTypes";

export interface DecouplingPointDialogProps {
  locationId: string;
  existingPoint?: DecouplingPoint;
  onSuccess?: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DecouplingPointDialog = ({
  locationId,
  existingPoint,
  onSuccess,
  open,
  onOpenChange,
}: DecouplingPointDialogProps) => {
  const [type, setType] = useState<DecouplingPoint["type"]>("strategic");
  const [description, setDescription] = useState("");
  const [bufferProfileId, setBufferProfileId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { profiles, loading: loadingProfiles } = useBufferProfiles();
  const { toast } = useToast();

  useEffect(() => {
    if (existingPoint) {
      setType(existingPoint.type);
      setDescription(existingPoint.description || "");
      setBufferProfileId(existingPoint.bufferProfileId);
    } else {
      // Reset form for new creation
      setType("strategic");
      setDescription("");
      setBufferProfileId("");
    }
  }, [existingPoint, open]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Here you would call your API to save or update the decoupling point
      // For example:
      // if (existingPoint) {
      //   await updateDecouplingPoint({
      //     id: existingPoint.id,
      //     locationId,
      //     type,
      //     description,
      //     bufferProfileId
      //   });
      // } else {
      //   await createDecouplingPoint({
      //     locationId,
      //     type,
      //     description,
      //     bufferProfileId
      //   });
      // }
      
      // Success handling
      toast({
        title: "Success",
        description: existingPoint 
          ? "Decoupling point updated successfully" 
          : "Decoupling point created successfully",
      });
      
      if (onSuccess) onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save decoupling point",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {existingPoint ? "Edit Decoupling Point" : "Create Decoupling Point"}
          </DialogTitle>
          <DialogDescription>
            Configure a decoupling point for your supply network.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Location
            </Label>
            <Input
              id="location"
              value={locationId}
              className="col-span-3"
              readOnly
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Select
              value={type}
              onValueChange={(value: DecouplingPoint["type"]) => setType(value)}
            >
              <SelectTrigger id="type" className="col-span-3">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="strategic">Strategic</SelectItem>
                <SelectItem value="customer_order">Customer Order</SelectItem>
                <SelectItem value="stock_point">Stock Point</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="buffer-profile" className="text-right">
              Buffer Profile
            </Label>
            <Select
              value={bufferProfileId}
              onValueChange={setBufferProfileId}
              disabled={loadingProfiles}
            >
              <SelectTrigger id="buffer-profile" className="col-span-3">
                <SelectValue placeholder="Select profile" />
              </SelectTrigger>
              <SelectContent>
                {loadingProfiles ? (
                  <SelectItem value="loading" disabled>
                    Loading profiles...
                  </SelectItem>
                ) : (
                  profiles.map((profile) => (
                    <SelectItem key={profile.id} value={profile.id}>
                      {profile.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : existingPoint ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
