import SimpleDashboardLayout from "@/components/SimpleDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Package, 
  Shield, 
  Zap, 
  TrendingUp,
  DollarSign,
  TrendingDown,
  Percent,
  Leaf
} from "lucide-react";

export default function Dashboard() {
  return (
    <SimpleDashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">dashboard</h1>
        </div>

        {/* Key Metrics */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Total SKUs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1234</div>
                <div className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +5.2%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Buffer Penetration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78%</div>
                <div className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +3.4%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Order Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">92%</div>
                <div className="text-sm text-orange-600 flex items-center mt-1">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  -1.2%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Flow Index
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.2x</div>
                <div className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +0.3x
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Financial Metrics */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Financial Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Revenue</div>
                <div className="text-right">
                  <div className="text-2xl font-bold">¥12.4M</div>
                  <div className="text-sm text-green-600 flex items-center justify-end mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +8.2%
                  </div>
                </div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground mb-1">Operating Costs</div>
                <div className="text-right">
                  <div className="text-2xl font-bold">¥4.2M</div>
                  <div className="text-sm text-red-600 flex items-center justify-end mt-1">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    -3.1%
                  </div>
                </div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground mb-1">Profit Margin</div>
                <div className="text-right">
                  <div className="text-2xl font-bold">¥24.5%</div>
                  <div className="text-sm text-green-600 flex items-center justify-end mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +2.1%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sustainability Metrics */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Leaf className="h-5 w-5" />
            Sustainability Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Carbon Footprint</div>
              <div className="text-right">
                <div className="text-2xl font-bold">-18.5%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SimpleDashboardLayout>
  );
}