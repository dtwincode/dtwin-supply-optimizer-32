
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Upload, FileUp, Edit, Trash } from "lucide-react";
import { BufferProfile } from "@/types/inventory";
import { useBufferProfiles } from "@/hooks/useBufferProfiles";
import BufferProfilesUpload from "./BufferProfilesUpload";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const BufferProfilesTab = () => {
  const { profiles, loading, fetchProfiles, createOrUpdateProfile } = useBufferProfiles();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAddProfileOpen, setIsAddProfileOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<BufferProfile | null>(null);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState<Partial<BufferProfile>>({
    name: "",
    description: "",
    variabilityFactor: "medium_variability",
    leadTimeFactor: "medium",
    moq: 0,
    lotSizeFactor: 1
  });

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  useEffect(() => {
    if (editingProfile) {
      setFormData({
        name: editingProfile.name,
        description: editingProfile.description || "",
        variabilityFactor: editingProfile.variabilityFactor,
        leadTimeFactor: editingProfile.leadTimeFactor,
        moq: editingProfile.moq || 0,
        lotSizeFactor: editingProfile.lotSizeFactor || 1
      });
    }
  }, [editingProfile]);

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
    setIsAddProfileOpen(true);
  };

  const handleDelete = async (profile: BufferProfile) => {
    // Implement delete functionality
    toast({
      title: "Not implemented",
      description: "Delete functionality will be added in the future update.",
      variant: "default",
    });
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

  // Helper function to safely format variable factor value
  const formatVariabilityFactor = (variabilityFactor?: string) => {
    if (!variabilityFactor) return 'N/A';
    
    return variabilityFactor
      .replace('_', ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  };

  // Helper function to safely format lead time value
  const formatLeadTime = (leadTimeFactor?: string) => {
    if (!leadTimeFactor) return 'N/A';
    
    return leadTimeFactor.charAt(0).toUpperCase() + leadTimeFactor.slice(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Buffer Profiles</h2>
          <p className="text-muted-foreground">
            Manage buffer profiles for inventory management and control
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Upload className="w-4 h-4" />
                Upload
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Upload Buffer Profiles</DialogTitle>
              </DialogHeader>
              <BufferProfilesUpload 
                onDataUploaded={() => {
                  setIsUploadOpen(false);
                  fetchProfiles();
                }} 
              />
            </DialogContent>
          </Dialog>

          <Dialog open={isAddProfileOpen} onOpenChange={(open) => {
            setIsAddProfileOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Profile
              </Button>
            </DialogTrigger>
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
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      ) : (
        <>
          {profiles.length === 0 ? (
            <Card className="p-6 text-center bg-gray-50 dark:bg-gray-900 border border-dashed">
              <div className="flex flex-col items-center gap-3 py-12">
                <FileUp className="h-12 w-12 text-gray-400" />
                <h3 className="text-lg font-medium">No buffer profiles found</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Upload a file with buffer profile data or create new profiles manually.
                </p>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" onClick={() => setIsUploadOpen(true)}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Profiles
                  </Button>
                  <Button onClick={() => setIsAddProfileOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Manually
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Variability Factor</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Lead Time Factor</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">MOQ</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Lot Size Factor</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Description</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {profiles.map((profile) => (
                      <tr key={profile.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-4 py-3 text-sm">{profile.name}</td>
                        <td className="px-4 py-3 text-sm">
                          {formatVariabilityFactor(profile.variabilityFactor)}
                        </td>
                        <td className="px-4 py-3 text-sm capitalize">{formatLeadTime(profile.leadTimeFactor)}</td>
                        <td className="px-4 py-3 text-sm">{profile.moq || 'N/A'}</td>
                        <td className="px-4 py-3 text-sm">{profile.lotSizeFactor || 'N/A'}</td>
                        <td className="px-4 py-3 text-sm">{profile.description || 'N/A'}</td>
                        <td className="px-4 py-3 text-sm text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(profile)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(profile)}>
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BufferProfilesTab;
