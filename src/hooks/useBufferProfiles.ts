
import { useState, useEffect, useCallback } from 'react';
import { BufferProfile } from '@/types/inventory';
import { getBufferProfiles, createBufferProfile, updateBufferProfile } from '@/services/inventoryService';
import { useToast } from '@/hooks/use-toast';

export function useBufferProfiles() {
  const [profiles, setProfiles] = useState<BufferProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getBufferProfiles();
      setProfiles(data);
    } catch (error) {
      console.error('Error fetching buffer profiles:', error);
      toast({
        title: "Error",
        description: "Failed to load buffer profiles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const createOrUpdateProfile = useCallback(async (profile: BufferProfile) => {
    try {
      let savedProfile: BufferProfile;
      
      if (profile.id) {
        savedProfile = await updateBufferProfile(profile);
      } else {
        // Remove id property for creation
        const { id, ...profileWithoutId } = profile;
        savedProfile = await createBufferProfile(profileWithoutId);
      }
      
      setProfiles(prev => {
        const index = prev.findIndex(p => p.id === savedProfile.id);
        if (index >= 0) {
          return [...prev.slice(0, index), savedProfile, ...prev.slice(index + 1)];
        } else {
          return [...prev, savedProfile];
        }
      });
      
      toast({
        title: "Success",
        description: `Buffer profile ${profile.id ? 'updated' : 'created'} successfully`,
      });
      
      return { success: true, profile: savedProfile };
    } catch (error) {
      console.error('Error saving buffer profile:', error);
      toast({
        title: "Error",
        description: `Failed to save buffer profile: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
      return { success: false };
    }
  }, [toast]);

  return {
    profiles,
    loading,
    fetchProfiles,
    createOrUpdateProfile
  };
}
