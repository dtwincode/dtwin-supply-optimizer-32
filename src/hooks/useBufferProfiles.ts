import { useEffect, useState } from "react";
import {
  fetchBufferProfiles,
  createBufferProfile,
  updateBufferProfile,
  deleteBufferProfile,
} from "@/lib/inventory-service";

interface BufferProfile {
  id: string;
  name: string;
  red_zone_pct: number;
  yellow_zone_pct: number;
  green_zone_pct: number;
}

export function useBufferProfiles() {
  const [profiles, setProfiles] = useState<BufferProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadProfiles = async () => {
    setIsLoading(true);
    try {
      const data = await fetchBufferProfiles();
      setProfiles(data);
    } catch (error) {
      console.error("Error loading buffer profiles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addProfile = async (profile: Omit<BufferProfile, "id">) => {
    await createBufferProfile(profile);
    loadProfiles();
  };

  const editProfile = async (id: string, profile: Partial<BufferProfile>) => {
    await updateBufferProfile(id, profile);
    loadProfiles();
  };

  const removeProfile = async (id: string) => {
    await deleteBufferProfile(id);
    loadProfiles();
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  return {
    profiles,
    isLoading,
    reload: loadProfiles,
    addProfile,
    editProfile,
    removeProfile,
  };
}
