import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Time Series Models Implementation
class TimeSeriesModels {
  // Simple Moving Average
  static sma(data: number[], period: number): number[] {
    const result: number[] = [];
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        result.push(NaN);
      } else {
        const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
        result.push(sum / period);
      }
    }
    return result;
  }

  // Weighted Moving Average
  static wma(data: number[], period: number): number[] {
    const result: number[] = [];
    const weights = Array.from({ length: period }, (_, i) => i + 1);
    const weightSum = weights.reduce((a, b) => a + b, 0);
    
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        result.push(NaN);
      } else {
        const slice = data.slice(i - period + 1, i + 1);
        const weightedSum = slice.reduce((sum, val, idx) => sum + val * weights[idx], 0);
        result.push(weightedSum / weightSum);
      }
    }
    return result;
  }

  // Single Exponential Smoothing
  static ses(data: number[], alpha: number): number[] {
    const result: number[] = [data[0]];
    for (let i = 1; i < data.length; i++) {
      result.push(alpha * data[i] + (1 - alpha) * result[i - 1]);
    }
    return result;
  }

  // Double Exponential Smoothing (Holt's)
  static des(data: number[], alpha: number, beta: number): number[] {
    const level: number[] = [data[0]];
    const trend: number[] = [data[1] - data[0]];
    const result: number[] = [data[0]];
    
    for (let i = 1; i < data.length; i++) {
      const prevLevel = level[i - 1];
      const prevTrend = trend[i - 1];
      
      level.push(alpha * data[i] + (1 - alpha) * (prevLevel + prevTrend));
      trend.push(beta * (level[i] - prevLevel) + (1 - beta) * prevTrend);
      result.push(level[i] + trend[i]);
    }
    return result;
  }

  // Triple Exponential Smoothing (Holt-Winters) - Additive
  static tes(data: number[], alpha: number, beta: number, gamma: number, period: number): number[] {
    if (data.length < 2 * period) {
      return Array(data.length).fill(NaN);
    }

    const level: number[] = [];
    const trend: number[] = [];
    const seasonal: number[] = Array(data.length).fill(0);
    const result: number[] = [];

    // Initialize seasonal components
    for (let i = 0; i < period; i++) {
      seasonal[i] = data[i] - data.slice(0, period).reduce((a, b) => a + b, 0) / period;
    }

    level[0] = data[0] - seasonal[0];
    trend[0] = (data[period] - data[0]) / period;
    result[0] = level[0] + trend[0] + seasonal[0];

    for (let i = 1; i < data.length; i++) {
      const seasonalIdx = i % period;
      
      level.push(alpha * (data[i] - seasonal[seasonalIdx]) + (1 - alpha) * (level[i - 1] + trend[i - 1]));
      trend.push(beta * (level[i] - level[i - 1]) + (1 - beta) * trend[i - 1]);
      seasonal[i] = gamma * (data[i] - level[i]) + (1 - gamma) * seasonal[seasonalIdx];
      result.push(level[i] + trend[i] + seasonal[i % period]);
    }
    
    return result;
  }

  // Linear Trend Model
  static linearTrend(data: number[]): number[] {
    const n = data.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = data.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * data[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return x.map(xi => intercept + slope * xi);
  }

  // Croston's Method (for intermittent demand)
  static croston(data: number[], alpha: number): number[] {
    const result: number[] = [];
    let demandEstimate = data[0] || 1;
    let intervalEstimate = 1;
    let periodsSinceLastDemand = 0;

    for (let i = 0; i < data.length; i++) {
      if (data[i] > 0) {
        demandEstimate = alpha * data[i] + (1 - alpha) * demandEstimate;
        if (periodsSinceLastDemand > 0) {
          intervalEstimate = alpha * periodsSinceLastDemand + (1 - alpha) * intervalEstimate;
        }
        periodsSinceLastDemand = 0;
      } else {
        periodsSinceLastDemand++;
      }
      result.push(demandEstimate / intervalEstimate);
    }
    return result;
  }
}

// Performance Metrics
class Metrics {
  static mae(actual: number[], predicted: number[]): number {
    let sum = 0;
    let count = 0;
    for (let i = 0; i < actual.length; i++) {
      if (!isNaN(predicted[i])) {
        sum += Math.abs(actual[i] - predicted[i]);
        count++;
      }
    }
    return count > 0 ? sum / count : Infinity;
  }

  static rmse(actual: number[], predicted: number[]): number {
    let sum = 0;
    let count = 0;
    for (let i = 0; i < actual.length; i++) {
      if (!isNaN(predicted[i])) {
        sum += Math.pow(actual[i] - predicted[i], 2);
        count++;
      }
    }
    return count > 0 ? Math.sqrt(sum / count) : Infinity;
  }

  static mape(actual: number[], predicted: number[]): number {
    let sum = 0;
    let count = 0;
    for (let i = 0; i < actual.length; i++) {
      if (!isNaN(predicted[i]) && actual[i] !== 0) {
        sum += Math.abs((actual[i] - predicted[i]) / actual[i]);
        count++;
      }
    }
    return count > 0 ? (sum / count) * 100 : Infinity;
  }

  static smape(actual: number[], predicted: number[]): number {
    let sum = 0;
    let count = 0;
    for (let i = 0; i < actual.length; i++) {
      if (!isNaN(predicted[i])) {
        const denominator = Math.abs(actual[i]) + Math.abs(predicted[i]);
        if (denominator > 0) {
          sum += Math.abs(actual[i] - predicted[i]) / denominator;
          count++;
        }
      }
    }
    return count > 0 ? (sum / count) * 100 : Infinity;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { productIds, locationIds } = await req.json();

    // Fetch historical sales data for specified product-location pairs
    let query = supabaseClient
      .from('historical_sales_data')
      .select('product_id, location_id, sales_date, quantity_sold')
      .gte('sales_date', new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString())
      .order('sales_date', { ascending: true });

    if (productIds && productIds.length > 0) {
      query = query.in('product_id', productIds);
    }
    if (locationIds && locationIds.length > 0) {
      query = query.in('location_id', locationIds);
    }

    const { data: salesData, error: salesError } = await query;
    if (salesError) throw salesError;

    // Group by product-location pairs
    const pairs = new Map<string, { product_id: string; location_id: string; data: number[] }>();
    
    salesData?.forEach((row: any) => {
      const key = `${row.product_id}|${row.location_id}`;
      if (!pairs.has(key)) {
        pairs.set(key, { product_id: row.product_id, location_id: row.location_id, data: [] });
      }
      pairs.get(key)!.data.push(row.quantity_sold);
    });

    const results: any[] = [];

    // Evaluate models for each pair
    for (const [key, pair] of pairs.entries()) {
      if (pair.data.length < 30) continue; // Need minimum data

      const models = [
        { name: 'SMA_7', params: { period: 7 }, forecast: TimeSeriesModels.sma(pair.data, 7) },
        { name: 'SMA_14', params: { period: 14 }, forecast: TimeSeriesModels.sma(pair.data, 14) },
        { name: 'SMA_30', params: { period: 30 }, forecast: TimeSeriesModels.sma(pair.data, 30) },
        { name: 'WMA_7', params: { period: 7 }, forecast: TimeSeriesModels.wma(pair.data, 7) },
        { name: 'WMA_14', params: { period: 14 }, forecast: TimeSeriesModels.wma(pair.data, 14) },
        { name: 'SES_0.1', params: { alpha: 0.1 }, forecast: TimeSeriesModels.ses(pair.data, 0.1) },
        { name: 'SES_0.3', params: { alpha: 0.3 }, forecast: TimeSeriesModels.ses(pair.data, 0.3) },
        { name: 'SES_0.5', params: { alpha: 0.5 }, forecast: TimeSeriesModels.ses(pair.data, 0.5) },
        { name: 'DES', params: { alpha: 0.3, beta: 0.1 }, forecast: TimeSeriesModels.des(pair.data, 0.3, 0.1) },
        { name: 'TES_7', params: { alpha: 0.3, beta: 0.1, gamma: 0.1, period: 7 }, forecast: TimeSeriesModels.tes(pair.data, 0.3, 0.1, 0.1, 7) },
        { name: 'LinearTrend', params: {}, forecast: TimeSeriesModels.linearTrend(pair.data) },
        { name: 'Croston', params: { alpha: 0.1 }, forecast: TimeSeriesModels.croston(pair.data, 0.1) },
      ];

      let bestModel: any = null;
      let bestScore = Infinity;

      for (const model of models) {
        const mae = Metrics.mae(pair.data, model.forecast);
        const rmse = Metrics.rmse(pair.data, model.forecast);
        const mape = Metrics.mape(pair.data, model.forecast);
        const smape = Metrics.smape(pair.data, model.forecast);

        // Use SMAPE as primary metric for model selection
        if (smape < bestScore) {
          bestScore = smape;
          bestModel = {
            product_id: pair.product_id,
            location_id: pair.location_id,
            model_name: model.name,
            mae,
            rmse,
            mape,
            smape,
            training_samples: pair.data.length,
            model_params: model.params,
            is_best_model: false
          };
        }

        results.push({
          product_id: pair.product_id,
          location_id: pair.location_id,
          model_name: model.name,
          mae,
          rmse,
          mape,
          smape,
          training_samples: pair.data.length,
          model_params: model.params,
          is_best_model: false
        });
      }

      if (bestModel) {
        bestModel.is_best_model = true;
      }
    }

    // Save results to database
    if (results.length > 0) {
      const { error: insertError } = await supabaseClient
        .from('forecast_model_selection')
        .upsert(results, { onConflict: 'product_id,location_id,model_name' });

      if (insertError) throw insertError;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        pairs_evaluated: pairs.size,
        models_tested: results.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error evaluating models:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
