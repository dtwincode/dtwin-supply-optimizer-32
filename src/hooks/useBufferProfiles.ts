import { useEffect, useState } from "react"; // ✅ تأكد من الاستيراد

// ✅ حذف استيراد الدوال غير الموجودة واستبداله بدالة واحدة موجودة فعليًا
import { fetchInventoryPlanningView } from "@/lib/inventory-planning.service";

// ✅ تعريف BufferProfile بناءً على mock data المتوفرة لديك
interface BufferProfile {
  id: number;
  sku: string;
  product_name: string;
  category: string;
  subcategory: string;
  location_id: string;
  channel_id: string;
  current_stock_level: number;
  average_daily_usage: number;
  min_stock_level: number;
  max_stock_level: number;
  reorder_level: number;
  lead_time_days: number;
  decoupling_point: boolean;
  buffer_status: string;
  red_zone: number;
  yellow_zone: number;
  green_zone: number;
}

export function useBufferProfiles() {
  const [profiles, setProfiles] = useState<BufferProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadProfiles = async () => {
    setIsLoading(true);
    try {
      const data = await fetchInventoryPlanningView(); // ✅ دالة موجودة فعليًا
      setProfiles(data);
    } catch (error) {
      console.error("Error loading buffer profiles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  return {
    profiles,
    isLoading,
    reload: loadProfiles,
    // ❌ لا تضيف دوال غير معرفة مثل create/update/delete إلا إذا كانت موجودة في inventory-planning.service.ts
  };
}
