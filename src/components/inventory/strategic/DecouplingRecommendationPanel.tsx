import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertTriangle, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FactorBreakdown {
  score: number;
  weight: number;
  contribution: number;
}

interface ScoringBreakdown {
  variability: FactorBreakdown;
  criticality: FactorBreakdown;
  holding_cost: FactorBreakdown;
  supplier_reliability: FactorBreakdown;
  lead_time: FactorBreakdown;
  volume: FactorBreakdown;
  storage_intensity: FactorBreakdown;
  moq_rigidity: FactorBreakdown;
}

interface ScoringResult {
  product_id: string;
  location_id: string;
  total_score: number;
  recommendation: "PULL_STORE_LEVEL" | "HYBRID_DC_LEVEL" | "PUSH_UPSTREAM";
  breakdown: ScoringBreakdown;
}

interface ProductLocationPair {
  product_id: string;
  location_id: string;
  product_name?: string;
  sku?: string;
  region?: string;
  is_decoupling_point: boolean;
}

export function DecouplingRecommendationPanel() {
  const [pairs, setPairs] = useState<ProductLocationPair[]>([]);
  const [scores, setScores] = useState<Map<string, ScoringResult>>(new Map());
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [selectedPair, setSelectedPair] = useState<string | null>(null);

  useEffect(() => {
    loadPairs();
  }, []);

  const loadPairs = async () => {
    setLoading(true);
    try {
      // Get all product-location pairs
      const { data: products } = await supabase
        .from("product_master")
        .select("product_id, sku, name");
      
      const { data: locations } = await supabase
        .from("location_master")
        .select("location_id, region");

      const { data: decouplingPoints } = await supabase
        .from("decoupling_points")
        .select("product_id, location_id");

      if (products && locations) {
        const decouplingSet = new Set(
          decouplingPoints?.map(dp => `${dp.product_id}_${dp.location_id}`) || []
        );

        const allPairs: ProductLocationPair[] = [];
        products.slice(0, 20).forEach((product) => {
          locations.slice(0, 5).forEach((location) => {
            allPairs.push({
              product_id: product.product_id,
              location_id: location.location_id,
              product_name: product.name || undefined,
              sku: product.sku,
              region: location.region || undefined,
              is_decoupling_point: decouplingSet.has(
                `${product.product_id}_${location.location_id}`
              ),
            });
          });
        });

        setPairs(allPairs);
      }
    } catch (error) {
      console.error("Error loading pairs:", error);
      toast.error("Failed to load product-location pairs");
    } finally {
      setLoading(false);
    }
  };

  const calculateScore = async (productId: string, locationId: string) => {
    try {
      const { data, error } = await supabase.rpc("calculate_8factor_weighted_score", {
        p_product_id: productId,
        p_location_id: locationId,
      });

      if (error) throw error;
      if (data) {
        const scoringResult = data as unknown as ScoringResult;
        setScores(prev => new Map(prev).set(`${productId}_${locationId}`, scoringResult));
        return scoringResult;
      }
    } catch (error) {
      console.error("Error calculating score:", error);
      toast.error("Failed to calculate score");
    }
  };

  const calculateAllScores = async () => {
    setCalculating(true);
    try {
      const newScores = new Map<string, ScoringResult>();
      
      for (const pair of pairs.slice(0, 10)) {
        const score = await calculateScore(pair.product_id, pair.location_id);
        if (score) {
          newScores.set(`${pair.product_id}_${pair.location_id}`, score as ScoringResult);
        }
      }
      
      setScores(newScores);
      toast.success(`Calculated scores for ${newScores.size} pairs`);
    } catch (error) {
      toast.error("Failed to calculate all scores");
    } finally {
      setCalculating(false);
    }
  };

  const getRecommendationBadge = (recommendation: string) => {
    switch (recommendation) {
      case "PULL_STORE_LEVEL":
        return <Badge className="bg-green-500">PULL (Store)</Badge>;
      case "HYBRID_DC_LEVEL":
        return <Badge className="bg-yellow-500">HYBRID (DC)</Badge>;
      case "PUSH_UPSTREAM":
        return <Badge className="bg-blue-500">PUSH (Upstream)</Badge>;
      default:
        return <Badge variant="outline">{recommendation}</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600";
    if (score >= 40) return "text-yellow-600";
    return "text-blue-600";
  };

  const renderFactorBar = (name: string, factor: FactorBreakdown) => {
    const percentage = (factor.score / 100) * 100;
    
    return (
      <div key={name} className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium capitalize">{name.replace(/_/g, " ")}</span>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs">
              {factor.score.toFixed(1)}/100 × {(factor.weight * 100).toFixed(0)}%
            </span>
            <span className="font-semibold">
              = {factor.contribution.toFixed(1)}
            </span>
          </div>
        </div>
        <Progress value={percentage} className="h-2" />
      </div>
    );
  };

  const selectedScore = selectedPair ? scores.get(selectedPair) : null;

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">Loading pairs...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>AI Decoupling Recommendations</CardTitle>
              <CardDescription>
                8-Factor weighted scoring for PULL/HYBRID/PUSH strategy
              </CardDescription>
            </div>
            <Button
              onClick={calculateAllScores}
              disabled={calculating}
            >
              {calculating ? "Calculating..." : "Calculate All Scores"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {pairs.slice(0, 10).map((pair) => {
              const key = `${pair.product_id}_${pair.location_id}`;
              const score = scores.get(key);
              
              return (
                <div
                  key={key}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedPair === key ? "border-primary bg-accent" : "hover:bg-accent/50"
                  }`}
                  onClick={() => setSelectedPair(key)}
                >
                  <div className="flex items-center justify-between">
            <div className="flex-1">
                      <div className="font-medium">{pair.sku} - {pair.product_name ?? 'Unknown Product'}</div>
                      <div className="text-sm text-muted-foreground">
                        {pair.region} ({pair.location_id})
                      </div>
                    </div>
                    
                    {score ? (
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${getScoreColor(score.total_score)}`}>
                            {score.total_score.toFixed(1)}
                          </div>
                          <div className="text-xs text-muted-foreground">Score</div>
                        </div>
                        {getRecommendationBadge(score.recommendation)}
                        {pair.is_decoupling_point && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          calculateScore(pair.product_id, pair.location_id);
                        }}
                      >
                        Calculate
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {selectedScore && (
        <Card>
          <CardHeader>
            <CardTitle>Factor Breakdown - AI Explainability</CardTitle>
            <CardDescription>
              Why the system recommends {selectedScore.recommendation.replace(/_/g, " ")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-accent rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Total Weighted Score</span>
                  <span className={`text-3xl font-bold ${getScoreColor(selectedScore.total_score)}`}>
                    {selectedScore.total_score.toFixed(2)}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {selectedScore.total_score >= 70 && "High score → PULL strategy (store-level decoupling)"}
                  {selectedScore.total_score >= 40 && selectedScore.total_score < 70 && 
                    "Medium score → HYBRID strategy (DC-level decoupling)"}
                  {selectedScore.total_score < 40 && "Low score → PUSH strategy (upstream replenishment)"}
                </div>
              </div>

              <div className="space-y-3">
                {Object.entries(selectedScore.breakdown).map(([key, factor]) => 
                  renderFactorBar(key, factor)
                )}
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-2">Key Insights</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {selectedScore.breakdown.variability.score > 70 && (
                    <li className="flex items-start gap-2">
                      <TrendingUp className="w-4 h-4 mt-0.5 text-red-500" />
                      High demand variability suggests local buffering
                    </li>
                  )}
                  {selectedScore.breakdown.criticality.score > 70 && (
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 mt-0.5 text-yellow-500" />
                      High criticality requires protection through decoupling
                    </li>
                  )}
                  {selectedScore.breakdown.lead_time.score > 70 && (
                    <li className="flex items-start gap-2">
                      <TrendingDown className="w-4 h-4 mt-0.5 text-orange-500" />
                      Long lead times favor closer-to-customer buffers
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
