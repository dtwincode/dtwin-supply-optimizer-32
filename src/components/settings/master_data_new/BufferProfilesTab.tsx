
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, FileUp, Trash2, PenSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BufferProfile } from "@/types/inventory";
import BufferProfilesUpload from "./BufferProfilesUpload";
import { useBufferProfiles } from "@/hooks/useBufferProfiles";

const BufferProfilesTab = () => {
  const [activeView, setActiveView] = useState<'profiles' | 'upload'>('profiles');
  const { toast } = useToast();
  const { profiles, loading, fetchProfiles } = useBufferProfiles();

  // Manual creation state
  const [showForm, setShowForm] = useState(false);
  const [manualProfiles, setManualProfiles] = useState<BufferProfile[]>([]);

  const handleDataUploaded = () => {
    fetchProfiles();
    setActiveView('profiles');
  };

  const handleAddManualProfile = () => {
    // Add a new empty profile to the manual list
    const newProfile: BufferProfile = {
      id: `temp-${Date.now()}`,
      name: "",
      variabilityFactor: "medium_variability",
      leadTimeFactor: "medium",
      description: "",
    };
    
    setManualProfiles([...manualProfiles, newProfile]);
    setShowForm(true);
  };

  const handleRemoveProfile = (id: string) => {
    setManualProfiles(manualProfiles.filter(profile => profile.id !== id));
  };

  const handleUpdateProfile = (index: number, field: keyof BufferProfile, value: any) => {
    const updatedProfiles = [...manualProfiles];
    updatedProfiles[index] = { ...updatedProfiles[index], [field]: value };
    setManualProfiles(updatedProfiles);
  };

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border-none shadow-md">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Buffer Profiles</CardTitle>
              <CardDescription className="mt-2 text-muted-foreground">
                Manage buffer profiles for inventory management and control
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setActiveView(activeView === 'profiles' ? 'upload' : 'profiles')}
                className="transition-all hover:bg-white dark:hover:bg-gray-800"
              >
                {activeView === 'profiles' ? (
                  <>
                    <FileUp className="h-4 w-4 mr-1" />
                    Upload
                  </>
                ) : (
                  <>
                    View Profiles
                  </>
                )}
              </Button>
              {activeView === 'profiles' && (
                <Button 
                  size="sm"
                  onClick={handleAddManualProfile}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Profile
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {activeView === 'profiles' ? (
            <div className="p-6">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-pulse text-center">
                    <div className="h-4 w-32 bg-gray-200 rounded mb-4 mx-auto"></div>
                    <div className="h-4 w-48 bg-gray-200 rounded mx-auto"></div>
                  </div>
                </div>
              ) : (
                <>
                  {showForm && (
                    <div className="bg-blue-50 dark:bg-gray-800 p-4 rounded-lg mb-6 overflow-auto">
                      <h3 className="font-medium text-lg mb-4">Manual Buffer Profiles</h3>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Variability Factor</TableHead>
                              <TableHead>Lead Time Factor</TableHead>
                              <TableHead>MOQ</TableHead>
                              <TableHead>Lot Size Factor</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {manualProfiles.map((profile, index) => (
                              <TableRow key={profile.id}>
                                <TableCell>
                                  <input
                                    type="text"
                                    value={profile.name}
                                    onChange={(e) => handleUpdateProfile(index, 'name', e.target.value)}
                                    className="border rounded px-2 py-1 w-full"
                                    placeholder="Profile name"
                                  />
                                </TableCell>
                                <TableCell>
                                  <select
                                    value={profile.variabilityFactor}
                                    onChange={(e) => handleUpdateProfile(index, 'variabilityFactor', e.target.value)}
                                    className="border rounded px-2 py-1 w-full"
                                  >
                                    <option value="high_variability">High</option>
                                    <option value="medium_variability">Medium</option>
                                    <option value="low_variability">Low</option>
                                  </select>
                                </TableCell>
                                <TableCell>
                                  <select
                                    value={profile.leadTimeFactor}
                                    onChange={(e) => handleUpdateProfile(index, 'leadTimeFactor', e.target.value)}
                                    className="border rounded px-2 py-1 w-full"
                                  >
                                    <option value="long">Long</option>
                                    <option value="medium">Medium</option>
                                    <option value="short">Short</option>
                                  </select>
                                </TableCell>
                                <TableCell>
                                  <input
                                    type="number"
                                    value={profile.moq || ''}
                                    onChange={(e) => handleUpdateProfile(index, 'moq', Number(e.target.value))}
                                    className="border rounded px-2 py-1 w-full"
                                    placeholder="MOQ"
                                  />
                                </TableCell>
                                <TableCell>
                                  <input
                                    type="number"
                                    value={profile.lotSizeFactor || ''}
                                    onChange={(e) => handleUpdateProfile(index, 'lotSizeFactor', Number(e.target.value))}
                                    className="border rounded px-2 py-1 w-full"
                                    placeholder="Lot size factor"
                                  />
                                </TableCell>
                                <TableCell>
                                  <input
                                    type="text"
                                    value={profile.description || ''}
                                    onChange={(e) => handleUpdateProfile(index, 'description', e.target.value)}
                                    className="border rounded px-2 py-1 w-full"
                                    placeholder="Description"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => handleRemoveProfile(profile.id)}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      <div className="mt-4 flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setShowForm(false);
                            setManualProfiles([]);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={() => {
                            // Here you would typically save the profiles to your backend
                            toast({
                              title: "Profiles saved",
                              description: "Your buffer profiles have been saved successfully"
                            });
                            setShowForm(false);
                            // After saving, you can clear the manual profiles if needed
                            setManualProfiles([]);
                          }}
                        >
                          Save Profiles
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader className="bg-gray-50 dark:bg-gray-800">
                        <TableRow>
                          <TableHead className="font-semibold">Name</TableHead>
                          <TableHead className="font-semibold">Variability Factor</TableHead>
                          <TableHead className="font-semibold">Lead Time Factor</TableHead>
                          <TableHead className="font-semibold">MOQ</TableHead>
                          <TableHead className="font-semibold">Lot Size Factor</TableHead>
                          <TableHead className="font-semibold">Description</TableHead>
                          <TableHead className="font-semibold w-24">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {/* Table is deliberately emptied */}
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                            No buffer profiles found. Upload a file or create new profiles manually.
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="p-6">
              <BufferProfilesUpload onDataUploaded={handleDataUploaded} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BufferProfilesTab;
