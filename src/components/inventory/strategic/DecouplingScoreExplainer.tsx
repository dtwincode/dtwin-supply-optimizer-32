import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Package, DollarSign, Truck, Clock, BarChart3, Archive, Target, AlertTriangle } from "lucide-react";

const factors = [
  {
    name: "Bullwhip Effect",
    weight: 15,
    icon: TrendingUp,
    color: "text-red-500",
    description: "Order variability vs demand variability ratio. >1.5 indicates critical amplification.",
    dataSource: "bullwhip_analysis table",
    scoring: "Ratio ≥3.0 = 100pts | 2.0-3.0 = 85pts | 1.5-2.0 = 70pts"
  },
  {
    name: "Demand Variability",
    weight: 20,
    icon: BarChart3,
    color: "text-orange-500",
    description: "Coefficient of variation from historical demand. High CV = high score.",
    dataSource: "demand_history_analysis table",
    scoring: "CV <0.2 = 20pts | 0.2-0.5 = 50pts | >0.5 = 80-100pts"
  },
  {
    name: "Criticality",
    weight: 20,
    icon: AlertTriangle,
    color: "text-yellow-500",
    description: "Business impact based on core menu items and sales contribution.",
    dataSource: "menu_mapping table",
    scoring: "Core + >50% sales = 90pts | Core = 80pts | >50% sales = 70pts"
  },
  {
    name: "Holding Cost",
    weight: 15,
    icon: DollarSign,
    color: "text-green-500",
    description: "Storage cost intensity (shelf life, temperature, price).",
    dataSource: "storage_requirements + product_pricing-master",
    scoring: "Short shelf life + frozen + high price = up to 100pts"
  },
  {
    name: "Supplier Reliability",
    weight: 10,
    icon: Truck,
    color: "text-blue-500",
    description: "OTIF performance and alternate supplier availability.",
    dataSource: "supplier_performance table",
    scoring: "Low OTIF + single source = high score | Multiple suppliers = low score"
  },
  {
    name: "Lead Time",
    weight: 10,
    icon: Clock,
    color: "text-purple-500",
    description: "Actual lead time in days. Longer = higher score.",
    dataSource: "actual_lead_time table",
    scoring: "≤1 day = 20pts | 3-7 days = 50pts | >14 days = 90pts"
  },
  {
    name: "Volume",
    weight: 10,
    icon: Package,
    color: "text-pink-500",
    description: "Percentage of total location usage (90-day average).",
    dataSource: "usage_analysis table",
    scoring: "≥20% = 90pts | 10-20% = 70pts | 5-10% = 50pts"
  },
  {
    name: "Storage Intensity",
    weight: 7.5,
    icon: Archive,
    color: "text-indigo-500",
    description: "Physical footprint and temperature requirements.",
    dataSource: "storage_requirements table",
    scoring: "High footprint + frozen = up to 100pts"
  },
  {
    name: "MOQ Rigidity",
    weight: 7.5,
    icon: Target,
    color: "text-cyan-500",
    description: "Days of coverage required by minimum order quantity.",
    dataSource: "moq_data table",
    scoring: "≥14 days = 90pts | 7-14 days = 70pts | <3 days = 20pts"
  }
];

export function DecouplingScoreExplainer() {
  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="border-primary/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            9-Factor Weighted Scoring Model
          </CardTitle>
          <CardDescription>
            DDMRP-compliant methodology for strategic decoupling point designation.
            Each factor contributes to a total score (0-100), with scores ≥70 triggering auto-designation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Auto-Designate Threshold</span>
                <Badge variant="default">≥ 70 points</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Review Required</span>
                <Badge variant="secondary">50-69 points</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Auto-Reject</span>
                <Badge variant="outline">&lt; 50 points</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Factor Breakdown */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {factors.map((factor) => {
          const Icon = factor.icon;
          return (
            <Card key={factor.name} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-5 w-5 ${factor.color}`} />
                    <CardTitle className="text-base">{factor.name}</CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {factor.weight}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Progress value={factor.weight} className="h-2" />
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {factor.description}
                  </p>
                  
                  <div className="text-xs space-y-1">
                    <div className="flex items-start gap-1">
                      <span className="font-semibold text-foreground">Data:</span>
                      <span className="text-muted-foreground font-mono">{factor.dataSource}</span>
                    </div>
                    <div className="flex items-start gap-1">
                      <span className="font-semibold text-foreground">Score:</span>
                      <span className="text-muted-foreground">{factor.scoring}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Methodology Card */}
      <Card>
        <CardHeader>
          <CardTitle>Why These 9 Factors?</CardTitle>
          <CardDescription>
            Based on DDMRP principles from Ptak & Smith's "Demand Driven Material Requirements Planning"
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="border-l-4 border-primary pl-4 py-2">
              <p className="font-semibold text-foreground mb-1">
                🎯 Bullwhip Effect (15%) - The Critical Criterion
              </p>
              <p>
                The primary reason for decoupling is to <strong>absorb demand amplification</strong>. 
                When orders become more variable than customer demand (ratio &gt;1.0), it creates 
                instability upstream. Strategic buffers at these points break the chain of amplification.
              </p>
            </div>

            <div className="border-l-4 border-orange-500 pl-4 py-2">
              <p className="font-semibold text-foreground mb-1">
                📊 Variability & Criticality (40% combined)
              </p>
              <p>
                High variability + business criticality = maximum need for buffering. 
                These items directly impact service levels and revenue.
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4 py-2">
              <p className="font-semibold text-foreground mb-1">
                💰 Holding & Storage Costs (22.5% combined)
              </p>
              <p>
                Expensive, perishable, or space-intensive items justify concentrated 
                inventory at fewer strategic locations rather than dispersed buffers.
              </p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <p className="font-semibold text-foreground mb-1">
                🚚 Supply & Constraint Factors (27.5% combined)
              </p>
              <p>
                Long lead times, unreliable suppliers, high volumes, and rigid MOQs all 
                increase the operational value of maintaining a strategic buffer position.
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground italic">
              <strong>Benchmark Alignment:</strong> This model aligns with SAP IBP's "Order Variability Factor" 
              and Microsoft Dynamics 365's "Demand Amplification Ratio" for decoupling point logic. 
              All calculations follow official DDMRP methodology as defined by the Demand Driven Institute (DDI).
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
