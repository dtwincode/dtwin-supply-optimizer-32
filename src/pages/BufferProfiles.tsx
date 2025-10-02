import DashboardLayout from "@/components/DashboardLayout";
import { BufferProfileManagement } from "@/components/inventory/buffer-profiles";

export default function BufferProfiles() {
  return (
    <DashboardLayout>
      <BufferProfileManagement />
    </DashboardLayout>
  );
}
