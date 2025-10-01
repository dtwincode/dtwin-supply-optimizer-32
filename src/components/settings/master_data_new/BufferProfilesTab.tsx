
import React, { useState } from "react";
import { FileUpload } from "@/components/settings/upload/FileUpload";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { UploadInstructions, FieldDescription } from "./components/UploadInstructions";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { useBufferProfiles } from "@/hooks/useBufferProfiles";
import { BufferProfile } from "@/types/inventory";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const bufferProfileFields: FieldDescription[] = [
  { name: "name", description: "Unique name for the buffer profile", required: true },
  { name: "variabilityFactor", description: "Demand variability level (low_variability, medium_variability, high_variability)", required: true },
  { name: "leadTimeFactor", description: "Lead time classification (short, medium, long)", required: true },
  { name: "moq", description: "Minimum Order Quantity for the product", required: false },
  { name: "lotSizeFactor", description: "Factor used to calculate lot sizes for ordering", required: false },
  { name: "description", description: "Detailed description of the buffer profile", required: false },
];

const BufferProfilesTab = () => {
  const { toast } = useToast();
  const { profiles, isLoading: loading, reload: fetchProfiles } = useBufferProfiles();
  
  const createOrUpdateProfile = async (profile: BufferProfile) => {
    // This would integrate with your backend
    console.log("Creating/updating profile:", profile);
  };
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isAddProfileOpen, setIsAddProfileOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<BufferProfile | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<BufferProfile>>({
    name: "",
    description: "",
    variabilityFactor: "medium_variability",
    leadTimeFactor: "medium",
    moq: 0,
    lotSizeFactor: 1
  });

  const handleUploadComplete = async (data: any[], fileName: string) => {
    try {
      setUploading(true);
      
      // Process data... (would be implemented in a real application)
      
      toast({
        title: "Upload successful",
        description: `${data.length} buffer profiles have been uploaded.`,
      });
      
      // Refresh profiles after upload
      fetchProfiles();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.variabilityFactor || !formData.leadTimeFactor) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const profileToSave: BufferProfile = {
        ...(editingProfile || {}),
        ...formData,
        name: formData.name!,
        variabilityFactor: formData.variabilityFactor!,
        leadTimeFactor: formData.leadTimeFactor!,
      } as BufferProfile;

      await createOrUpdateProfile(profileToSave);
      
      // Reset form
      setFormData({
        name: "",
        description: "",
        variabilityFactor: "medium_variability",
        leadTimeFactor: "medium",
        moq: 0,
        lotSizeFactor: 1
      });
      
      setIsAddProfileOpen(false);
      setEditingProfile(null);
      
      // Refresh profiles
      fetchProfiles();
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleEdit = (profile: BufferProfile) => {
    setEditingProfile(profile);
    setFormData({
      name: profile.name,
      description: profile.description || "",
      variabilityFactor: profile.variabilityFactor,
      leadTimeFactor: profile.leadTimeFactor,
      moq: profile.moq || 0,
      lotSizeFactor: profile.lotSizeFactor || 1
    });
    setIsAddProfileOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      variabilityFactor: "medium_variability",
      leadTimeFactor: "medium",
      moq: 0,
      lotSizeFactor: 1
    });
    setEditingProfile(null);
  };

  // Helper function to format variability factor for display
  const formatVariabilityFactor = (value: string) => {
    if (!value) return 'N/A';
    return value.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  // Helper function to format lead time for display
  const formatLeadTime = (value: string) => {
    if (!value) return 'N/A';
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const columns = [
    { header: "Name", accessorKey: "name" },
    { 
      header: "Variability Factor", 
      accessorKey: "variabilityFactor",
      cell: ({ row }: { row: { original: BufferProfile } }) => (
        <span>{formatVariabilityFactor(row.original.variabilityFactor)}</span>
      )
    },
    { 
      header: "Lead Time Factor", 
      accessorKey: "leadTimeFactor",
      cell: ({ row }: { row: { original: BufferProfile } }) => (
        <span className="capitalize">{formatLeadTime(row.original.leadTimeFactor)}</span>
      )
    },
    { 
      header: "MOQ", 
      accessorKey: "moq",
      cell: ({ row }: { row: { original: BufferProfile } }) => (
        <span>{row.original.moq || 'N/A'}</span>
      )
    },
    { 
      header: "Lot Size Factor", 
      accessorKey: "lotSizeFactor",
      cell: ({ row }: { row: { original: BufferProfile } }) => (
        <span>{row.original.lotSizeFactor || 'N/A'}</span>
      )
    },
    { 
      header: "Description", 
      accessorKey: "description",
      cell: ({ row }: { row: { original: BufferProfile } }) => (
        <span>{row.original.description || 'N/A'}</span>
      )
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }: { row: { original: BufferProfile } }) => (
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => handleEdit(row.original)}>
            Edit
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <UploadInstructions
        title="Buffer Profiles Upload Instructions"
        description="Upload your buffer profiles data using CSV or Excel format. The file should include the fields below."
        fields={bufferProfileFields}
      />
      
      <div className="flex flex-wrap gap-4">
        <Button variant="outline" onClick={() => setIsAddProfileOpen(true)} className="flex gap-2">
          <Plus className="h-4 w-4" />
          Add Profile
        </Button>
        
        <FileUpload
          onUploadComplete={handleUploadComplete}
          onProgress={setProgress}
          allowedFileTypes={[".csv", ".xlsx"]}
          maxSize={5}
        />
      </div>
      
      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground">Processing... {progress}%</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
        </div>
      ) : (
        <div className="border rounded-md">
          <DataTable
            columns={columns}
            data={profiles}
          />
        </div>
      )}
      
      <Dialog open={isAddProfileOpen} onOpenChange={(open) => {
        setIsAddProfileOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingProfile ? "Edit Buffer Profile" : "Add New Buffer Profile"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right font-medium">
                Name*
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="variabilityFactor" className="text-right font-medium">
                Variability Factor*
              </label>
              <Select
                value={formData.variabilityFactor}
                onValueChange={(value) => handleSelectChange("variabilityFactor", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select variability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low_variability">Low Variability</SelectItem>
                  <SelectItem value="medium_variability">Medium Variability</SelectItem>
                  <SelectItem value="high_variability">High Variability</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="leadTimeFactor" className="text-right font-medium">
                Lead Time Factor*
              </label>
              <Select
                value={formData.leadTimeFactor}
                onValueChange={(value) => handleSelectChange("leadTimeFactor", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select lead time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="long">Long</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="moq" className="text-right font-medium">
                MOQ
              </label>
              <Input
                id="moq"
                name="moq"
                type="number"
                value={formData.moq}
                onChange={handleNumberChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="lotSizeFactor" className="text-right font-medium">
                Lot Size Factor
              </label>
              <Input
                id="lotSizeFactor"
                name="lotSizeFactor"
                type="number"
                step="0.1"
                value={formData.lotSizeFactor}
                onChange={handleNumberChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="description" className="text-right font-medium">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="col-span-3"
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddProfileOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingProfile ? "Update Profile" : "Add Profile"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BufferProfilesTab;
