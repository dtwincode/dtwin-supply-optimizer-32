
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { BufferProfile } from "@/types/inventory";

// Mock data for demonstration purposes
const mockBufferProfiles: BufferProfile[] = [
  {
    id: "bp1",
    name: "Electronics - Standard",
    variabilityFactor: "medium_variability",
    leadTimeFactor: "medium",
    moq: 10,
    lotSizeFactor: 1.2,
    description: "Standard buffer profile for electronic components",
    createdAt: new Date(Date.now() - 3600000 * 24 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString()
  },
  {
    id: "bp2",
    name: "Fast Moving Consumer Goods",
    variabilityFactor: "high_variability",
    leadTimeFactor: "short",
    moq: 50,
    lotSizeFactor: 2.0,
    description: "Buffer profile for high turnover consumer goods",
    createdAt: new Date(Date.now() - 3600000 * 24 * 60).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
  },
  {
    id: "bp3",
    name: "Industrial Equipment",
    variabilityFactor: "low_variability",
    leadTimeFactor: "long",
    moq: 5,
    lotSizeFactor: 1.0,
    description: "Buffer profile for industrial machinery and equipment",
    createdAt: new Date(Date.now() - 3600000 * 24 * 90).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 15).toISOString()
  }
];

export const useBufferProfiles = () => {
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<BufferProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      // In a real application, this would be an API call
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setProfiles(mockBufferProfiles);
    } catch (error) {
      console.error("Error fetching buffer profiles:", error);
      toast({
        title: "Error fetching profiles",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createOrUpdateProfile = async (profile: BufferProfile): Promise<BufferProfile> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      if (profile.id) {
        // Update existing profile
        const updatedProfiles = profiles.map(p => 
          p.id === profile.id ? { ...profile, updatedAt: new Date().toISOString() } : p
        );
        setProfiles(updatedProfiles);
        
        toast({
          title: "Profile updated",
          description: `Successfully updated "${profile.name}" buffer profile.`
        });
        
        return profile;
      } else {
        // Create new profile
        const newProfile = {
          ...profile,
          id: `bp${profiles.length + 1}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        setProfiles([...profiles, newProfile]);
        
        toast({
          title: "Profile created",
          description: `Successfully created "${profile.name}" buffer profile.`
        });
        
        return newProfile;
      }
    } catch (error) {
      console.error("Error saving buffer profile:", error);
      toast({
        title: "Error saving profile",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteProfile = async (id: string) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const profileToDelete = profiles.find(p => p.id === id);
      if (!profileToDelete) {
        throw new Error(`Profile with ID ${id} not found`);
      }
      
      const filteredProfiles = profiles.filter(p => p.id !== id);
      setProfiles(filteredProfiles);
      
      toast({
        title: "Profile deleted",
        description: `Successfully deleted "${profileToDelete.name}" buffer profile.`
      });
    } catch (error) {
      console.error("Error deleting buffer profile:", error);
      toast({
        title: "Error deleting profile",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  return {
    profiles,
    loading,
    fetchProfiles,
    createOrUpdateProfile,
    deleteProfile
  };
};
