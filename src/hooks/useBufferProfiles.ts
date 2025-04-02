
import { useState, useEffect } from 'react';
import { getBufferProfiles, createBufferProfile } from '@/services/inventoryService';
import { BufferProfile } from '@/types/inventory';
import { useToast } from './use-toast';

export const useBufferProfiles = () => {
  const [profiles, setProfiles] = useState<BufferProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const data = await getBufferProfiles();
      setProfiles(data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching buffer profiles:', err);
      setError(err.message || 'Failed to fetch buffer profiles');
      toast({
        title: 'Error',
        description: 'Failed to load buffer profiles',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const addProfile = async (profile: Omit<BufferProfile, 'id'>) => {
    try {
      const result = await createBufferProfile(profile);
      
      if (result.success && result.data) {
        setProfiles([...profiles, result.data]);
        toast({
          title: 'Success',
          description: 'Buffer profile created successfully'
        });
        return result.data;
      } else {
        throw result.error || new Error('Failed to create buffer profile');
      }
    } catch (err: any) {
      console.error('Error creating buffer profile:', err);
      toast({
        title: 'Error',
        description: `Failed to create buffer profile: ${err.message}`,
        variant: 'destructive'
      });
      return null;
    }
  };

  return {
    profiles,
    loading,
    error,
    fetchProfiles,
    addProfile
  };
};
