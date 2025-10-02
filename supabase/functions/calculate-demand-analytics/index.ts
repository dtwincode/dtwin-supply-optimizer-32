import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('🔄 Starting demand analytics calculations...');

    // STEP 1: Calculate demand_history_analysis (CV, std dev, variability scores)
    const { data: salesData, error: salesError } = await supabase
      .from('historical_sales_data')
      .select('product_id, location_id, quantity_sold, sales_date')
      .gte('sales_date', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('sales_date', { ascending: true });

    if (salesError) throw salesError;

    // Group by product_id and location_id
    const grouped = salesData.reduce((acc: any, row: any) => {
      const key = `${row.product_id}_${row.location_id}`;
      if (!acc[key]) {
        acc[key] = {
          product_id: row.product_id,
          location_id: row.location_id,
          quantities: [],
        };
      }
      acc[key].quantities.push(row.quantity_sold);
      return acc;
    }, {});

    // Calculate statistics for each product-location pair
    const demandAnalysis = Object.values(grouped).map((item: any) => {
      const quantities = item.quantities;
      const n = quantities.length;
      
      if (n === 0) return null;

      const mean = quantities.reduce((sum: number, q: number) => sum + q, 0) / n;
      const variance = quantities.reduce((sum: number, q: number) => sum + Math.pow(q - mean, 2), 0) / n;
      const stdDev = Math.sqrt(variance);
      const cv = mean > 0 ? stdDev / mean : 0;

      // Variability score: low (<0.2), medium (0.2-0.5), high (>0.5)
      const variabilityScore = cv < 0.2 ? 20 : cv < 0.5 ? 50 : Math.min(100, 80 + (cv - 0.5) * 40);

      return {
        product_id: item.product_id,
        location_id: item.location_id,
        analysis_period_start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        analysis_period_end: new Date().toISOString().split('T')[0],
        mean_demand: mean,
        std_dev_demand: stdDev,
        cv: cv,
        variability_score: variabilityScore,
      };
    }).filter(Boolean);

    // Upsert into demand_history_analysis
    if (demandAnalysis.length > 0) {
      const { error: analysisError } = await supabase
        .from('demand_history_analysis')
        .upsert(demandAnalysis, { onConflict: 'product_id,location_id,analysis_period_end' });
      
      if (analysisError) {
        console.error('Error inserting demand analysis:', analysisError);
      } else {
        console.log(`✅ Inserted ${demandAnalysis.length} demand history analysis records`);
      }
    }

    // STEP 2: Calculate usage_analysis (volume scores, % of total usage)
    const { data: recentSales, error: recentError } = await supabase
      .from('historical_sales_data')
      .select('product_id, location_id, quantity_sold')
      .gte('sales_date', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

    if (recentError) throw recentError;

    // Group by product-location and calculate weekly usage
    const usageGrouped = recentSales.reduce((acc: any, row: any) => {
      const key = `${row.product_id}_${row.location_id}`;
      if (!acc[key]) {
        acc[key] = {
          product_id: row.product_id,
          location_id: row.location_id,
          total_qty: 0,
        };
      }
      acc[key].total_qty += row.quantity_sold;
      return acc;
    }, {});

    // Calculate total usage across all products
    const totalUsage = Object.values(usageGrouped).reduce((sum: number, item: any) => sum + item.total_qty, 0);

    // Get SKUs for each product
    const { data: products, error: productsError } = await supabase
      .from('product_master')
      .select('product_id, sku');

    if (productsError) throw productsError;

    const skuMap = products.reduce((acc: any, p: any) => {
      acc[p.product_id] = p.sku;
      return acc;
    }, {});

    const usageAnalysis = Object.values(usageGrouped).map((item: any) => {
      const avgWeeklyUsage = item.total_qty / (90 / 7); // 90 days = ~12.86 weeks
      const percentageOfTotal = (item.total_qty / totalUsage) * 100;

      // Volume score: >20% = 90, >10% = 70, >5% = 50, else 20
      const volumeScore = percentageOfTotal >= 20 ? 90 : 
                          percentageOfTotal >= 10 ? 70 : 
                          percentageOfTotal >= 5 ? 50 : 20;

      return {
        sku: skuMap[item.product_id] || item.product_id,
        product_id: item.product_id,
        location_id: item.location_id,
        avg_weekly_usage: avgWeeklyUsage,
        percentage_of_total_usage: percentageOfTotal,
        volume_score: volumeScore,
      };
    });

    // Upsert into usage_analysis
    if (usageAnalysis.length > 0) {
      const { error: usageError } = await supabase
        .from('usage_analysis')
        .upsert(usageAnalysis, { onConflict: 'product_id,location_id' });
      
      if (usageError) {
        console.error('Error inserting usage analysis:', usageError);
      } else {
        console.log(`✅ Inserted ${usageAnalysis.length} usage analysis records`);
      }
    }

    const summary = {
      success: true,
      timestamp: new Date().toISOString(),
      demand_analysis_records: demandAnalysis.length,
      usage_analysis_records: usageAnalysis.length,
    };

    console.log('✅ Demand analytics calculations completed:', summary);

    return new Response(JSON.stringify(summary), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('❌ Error in calculate-demand-analytics:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
