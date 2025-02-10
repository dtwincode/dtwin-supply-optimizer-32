
import { Card } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const mockData = {
  inventoryLevels: [
    { name: "Product A", stock: 65, buffer: 100 },
    { name: "Product B", stock: 45, buffer: 80 },
    { name: "Product C", stock: 90, buffer: 90 },
    { name: "Product D", stock: 30, buffer: 70 },
    { name: "Product E", stock: 85, buffer: 95 },
  ],
};

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fadeIn">
        {/* Overview Section */}
        <section>
          <h3 className="font-display text-2xl font-semibold mb-4">
            Inventory Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Total SKUs</p>
                <p className="text-3xl font-semibold">1,234</p>
              </div>
            </Card>
            <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Stock Value</p>
                <p className="text-3xl font-semibold">$2.5M</p>
              </div>
            </Card>
            <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Buffer Alerts</p>
                <p className="text-3xl font-semibold text-warning-DEFAULT">12</p>
              </div>
            </Card>
          </div>
        </section>

        {/* Inventory Levels Chart */}
        <section>
          <Card className="p-6">
            <h4 className="font-display text-xl font-semibold mb-4">
              DDMRP Buffer Status
            </h4>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockData.inventoryLevels}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="stock"
                    fill="#10B981"
                    name="Current Stock"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="buffer"
                    fill="#F59E0B"
                    name="Buffer Level"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Index;
