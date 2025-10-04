import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { CheckCircle, AlertTriangle, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { useInventoryConfig } from '@/hooks/useInventoryConfig';
import { useInventoryFilter } from '../InventoryFilterContext';

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
  recommendation: 'PULL_STORE_LEVEL' | 'HYBRID_DC_LEVEL' | 'PUSH_UPSTREAM';
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
  const { getConfig, isLoading: configLoading } = useInventoryConfig();
  const { filters } = useInventoryFilter();
  const [pairs, setPairs] = useState<ProductLocationPair[]>([]);
  const [scores, setScores] = useState<Map<string, ScoringResult>>(new Map());
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [selectedPair, setSelectedPair] = useState<ProductLocationPair | null>(null);
  const [showOverrideDialog, setShowOverrideDialog] = useState(false);
  const [overrideReason, setOverrideReason] = useState('');
  const [overrideAction, setOverrideAction] = useState<'accept' | 'reject'>('accept');

  useEffect(() => {
    if (!configLoading) {
      loadPairs();
    }
  }, [configLoading, filters]);

  const loadPairs = async () => {
    setLoading(true);
    try {
      let productsQuery = supabase
        .from('product_master')
        .select('product_id, sku, name, category');
      
      if (filters.productCategory) {
        productsQuery = productsQuery.eq('category', filters.productCategory);
      }
      
      const { data: products } = await productsQuery;

      let locationsQuery = supabase
        .from('location_master')
        .select('location_id, region, channel_id');
      
      if (filters.locationId) {
        locationsQuery = locationsQuery.eq('location_id', filters.locationId);
      }
      if (filters.channelId) {
        locationsQuery = locationsQuery.eq('channel_id', filters.channelId);
      }
      
      const { data: locations } = await locationsQuery;

      const { data: decouplingPoints } = await supabase
        .from('decoupling_points')
        .select('product_id, location_id');

      if (products && locations) {
        const decouplingSet = new Set(
          decouplingPoints?.map((dp) => `${dp.product_id}_${dp.location_id}`) || []
        );

        const allPairs: ProductLocationPair[] = [];
        const productsLimit = getConfig('recommendation_products_limit', 20);
        const locationsLimit = getConfig('recommendation_locations_limit', 5);
        
        products.slice(0, productsLimit).forEach((product) => {
          locations.slice(0, locationsLimit).forEach((location) => {
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
      console.error('Error loading pairs:', error);
      toast.error('Failed to load product-location pairs');
    } finally {
      setLoading(false);
    }
  };

  const calculateScore = async (productId: string, locationId: string) => {
    try {
      const { data, error } = await supabase.rpc('calculate_8factor_weighted_score', {
        p_product_id: productId,
        p_location_id: locationId,
      });

      if (error) throw error;
      if (data) {
        const scoringResult = data as unknown as ScoringResult;
        setScores((prev) => new Map(prev).set(`${productId}_${locationId}`, scoringResult));
        
        // Save recommendation to database
        await supabase.from('decoupling_recommendations').insert({
          product_id: productId,
          location_id: locationId,
          total_score: scoringResult.total_score,
          recommendation: scoringResult.recommendation,
          factor_breakdown: scoringResult.breakdown as any,
          planner_decision: 'pending',
        });
        
        return scoringResult;
      }
    } catch (error) {
      console.error('Error calculating score:', error);
      toast.error('Failed to calculate score');
    }
  };

  const calculateAllScores = async () => {
    setCalculating(true);
    try {
      const newScores = new Map<string, ScoringResult>();
      const batchSize = getConfig('recommendation_calculation_batch_size', 10);

      for (const pair of pairs.slice(0, batchSize)) {
        const score = await calculateScore(pair.product_id, pair.location_id);
        if (score) {
          newScores.set(`${pair.product_id}_${pair.location_id}`, score as ScoringResult);
        }
      }

      setScores(newScores);
      toast.success(`Calculated scores for ${newScores.size} pairs`);
    } catch (error) {
      toast.error('Failed to calculate all scores');
    } finally {
      setCalculating(false);
    }
  };

  const handleAccept = (pair: ProductLocationPair, score: ScoringResult) => {
    setSelectedPair(pair);
    setOverrideAction('accept');

    if (score.recommendation === 'PUSH_UPSTREAM') {
      setShowOverrideDialog(true);
    } else {
      confirmAction(pair, score, 'System recommended');
    }
  };

  const handleReject = (pair: ProductLocationPair, score: ScoringResult) => {
    setSelectedPair(pair);
    setOverrideAction('reject');

    if (score.recommendation !== 'PUSH_UPSTREAM') {
      setShowOverrideDialog(true);
    } else {
      confirmAction(pair, score, 'System recommended rejection');
    }
  };

  const confirmAction = async (
    pair: ProductLocationPair,
    score: ScoringResult,
    reason: string
  ) => {
    try {
      const isOverride = reason.startsWith('Manual override:');
      
      if (overrideAction === 'accept') {
        const { error } = await supabase.from('decoupling_points').insert({
          product_id: pair.product_id,
          location_id: pair.location_id,
          buffer_profile_id: 'BP_DEFAULT',
          is_strategic: true,
          designation_reason: reason,
        });

        if (error) throw error;
        
        // Update recommendation decision
        await supabase
          .from('decoupling_recommendations')
          .update({
            planner_decision: 'accepted',
            decision_reason: reason,
            decided_at: new Date().toISOString(),
          })
          .eq('product_id', pair.product_id)
          .eq('location_id', pair.location_id)
          .order('created_at', { ascending: false })
          .limit(1);
        
        // Log manual override if applicable
        if (isOverride) {
          await supabase.from('manual_overrides').insert({
            product_id: pair.product_id,
            location_id: pair.location_id,
            ai_recommendation: score.recommendation,
            planner_decision: 'accept_override',
            justification: reason.replace('Manual override: ', ''),
            override_type: 'accept_push',
          });
        }
        
        toast.success(`Decoupling point created for ${pair.sku} at ${pair.region}`);
      } else {
        // Update recommendation decision
        await supabase
          .from('decoupling_recommendations')
          .update({
            planner_decision: 'rejected',
            decision_reason: reason,
            decided_at: new Date().toISOString(),
          })
          .eq('product_id', pair.product_id)
          .eq('location_id', pair.location_id)
          .order('created_at', { ascending: false })
          .limit(1);
        
        // Log manual override if applicable
        if (isOverride) {
          await supabase.from('manual_overrides').insert({
            product_id: pair.product_id,
            location_id: pair.location_id,
            ai_recommendation: score.recommendation,
            planner_decision: 'reject_override',
            justification: reason.replace('Manual override: ', ''),
            override_type: 'reject_pull_hybrid',
          });
        }
        
        toast.info(`${pair.sku} at ${pair.region} rejected`);
      }

      setShowOverrideDialog(false);
      setOverrideReason('');
      loadPairs();
    } catch (error) {
      console.error('Error confirming action:', error);
      toast.error('Failed to save decision');
    }
  };

  const getRecommendationBadge = (recommendation: string) => {
    switch (recommendation) {
      case 'PULL_STORE_LEVEL':
        return <Badge className="bg-green-500">PULL (Store)</Badge>;
      case 'HYBRID_DC_LEVEL':
        return <Badge className="bg-yellow-500">HYBRID (DC)</Badge>;
      case 'PUSH_UPSTREAM':
        return <Badge className="bg-blue-500">PUSH (Upstream)</Badge>;
      default:
        return <Badge variant="outline">{recommendation}</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    const pullThreshold = getConfig('decoupling_score_pull_threshold', 70);
    const hybridThreshold = getConfig('decoupling_score_hybrid_threshold', 40);
    
    if (score >= pullThreshold) return 'text-green-600';
    if (score >= hybridThreshold) return 'text-yellow-600';
    return 'text-blue-600';
  };

  const renderFactorBar = (name: string, factor: FactorBreakdown) => {
    const percentage = (factor.score / 100) * 100;

    return (
      <div key={name} className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium capitalize">{name.replace(/_/g, ' ')}</span>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs">
              {factor.score.toFixed(1)}/100 × {(factor.weight * 100).toFixed(0)}%
            </span>
            <span className="font-semibold">= {factor.contribution.toFixed(1)}</span>
          </div>
        </div>
        <Progress value={percentage} className="h-2" />
      </div>
    );
  };

  const selectedKey = selectedPair ? `${selectedPair.product_id}_${selectedPair.location_id}` : null;
  const selectedScore = selectedKey ? scores.get(selectedKey) : null;

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
              <CardDescription>8-Factor weighted scoring for PULL/HYBRID/PUSH strategy</CardDescription>
            </div>
            <Button onClick={calculateAllScores} disabled={calculating}>
              {calculating ? 'Calculating...' : 'Calculate All Scores'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {pairs.slice(0, getConfig('recommendation_pairs_display_limit', 10)).map((pair) => {
              const key = `${pair.product_id}_${pair.location_id}`;
              const score = scores.get(key);

              return (
                <div
                  key={key}
                  className={`p-3 border rounded-lg transition-colors ${
                    selectedKey === key ? 'border-primary bg-accent' : 'hover:bg-accent/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium">
                        {pair.sku} - {pair.product_name ?? 'Unknown Product'}
                      </div>
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
                      </div>
                    ) : null}
                  </div>

                  {score && (
                    <div className="flex gap-2 mt-3 pt-3 border-t">
                      <Button size="sm" onClick={() => handleAccept(pair, score)}>
                        Accept
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleReject(pair, score)}>
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedPair(pair)}
                      >
                        View Details
                      </Button>
                    </div>
                  )}

                  {!score && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-3"
                      onClick={() => calculateScore(pair.product_id, pair.location_id)}
                    >
                      Calculate Score
                    </Button>
                  )}
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
              Why the system recommends {selectedScore.recommendation.replace(/_/g, ' ')}
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
                  {selectedScore.total_score >= getConfig('decoupling_score_pull_threshold', 70) && 'High score → PULL strategy (store-level decoupling)'}
                  {selectedScore.total_score >= getConfig('decoupling_score_hybrid_threshold', 40) &&
                    selectedScore.total_score < getConfig('decoupling_score_pull_threshold', 70) &&
                    'Medium score → HYBRID strategy (DC-level decoupling)'}
                  {selectedScore.total_score < getConfig('decoupling_score_hybrid_threshold', 40) && 'Low score → PUSH strategy (upstream replenishment)'}
                </div>
              </div>

              <div className="space-y-3">
                {Object.entries(selectedScore.breakdown).map(([key, factor]) => renderFactorBar(key, factor))}
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

      {/* Manual Override Dialog */}
      <Dialog open={showOverrideDialog} onOpenChange={setShowOverrideDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Manual Override Warning
            </DialogTitle>
            <DialogDescription>
              {overrideAction === 'accept' ? (
                <span>
                  The AI system recommends <strong>PUSH (no decoupling)</strong> for this product-location pair.
                  Proceeding will override this recommendation.
                </span>
              ) : (
                <span>
                  The AI system recommends <strong>PULL/HYBRID (decoupling)</strong> for this product-location pair.
                  Rejecting will override this recommendation.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Manual overrides should be used sparingly and with clear justification. This decision will be
                flagged as a "manual exception" in the system.
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Label htmlFor="reason">Justification / Reason *</Label>
              <Textarea
                id="reason"
                placeholder="Explain why you're overriding the AI recommendation..."
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOverrideDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!overrideReason.trim()) {
                  toast.error('Please provide a justification');
                  return;
                }
                if (selectedPair && selectedScore) {
                  confirmAction(selectedPair, selectedScore, `Manual override: ${overrideReason}`);
                }
              }}
              disabled={!overrideReason.trim()}
            >
              Confirm Override
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
