import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BufferBreachEvent } from "@/types/inventory/planningTypes";

export function useBreachData() {
  const [breaches, setBreaches] = useState<BufferBreachEvent[]>([]);
  const [unacknowledgedCount, setUnacknowledgedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBreaches = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('buffer_breach_events' as any)
          .select('*')
          .order('detected_ts', { ascending: false })
          .limit(100);

        if (error) {
          console.error("Breach fetch error:", error);
          return;
        }

        const breachData = (data || []) as unknown as BufferBreachEvent[];
        setBreaches(breachData);
        setUnacknowledgedCount(breachData.filter(b => !b.acknowledged).length);
      } catch (error) {
        console.error("Error loading breaches:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBreaches();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('buffer_breach_events')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'buffer_breach_events' },
        () => loadBreaches()
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { breaches, unacknowledgedCount, isLoading };
}
