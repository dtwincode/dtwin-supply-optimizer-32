// GEMINI-ONLY EDGE FUNCTION - COMPLETELY REBUILT
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

serve(async (req) => {
  console.log('🚀 GEMINI FUNCTION STARTED - REBUILT VERSION 3.0');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { prompt, context, format = 'text', timestamp } = body;
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Missing prompt' }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (!lovableApiKey) {
      return new Response(
        JSON.stringify({ error: 'LOVABLE_API_KEY not configured' }),
        { status: 500, headers: corsHeaders }
      );
    }

    console.log('📊 Fetching live database statistics...');
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    let databaseContext = '\n\n## LIVE DATABASE SNAPSHOT:\n';
    
    try {
      const { count: productCount } = await supabase
        .from('product_master')
        .select('*', { count: 'exact', head: true });
      
      const { count: locationCount } = await supabase
        .from('location_master')
        .select('*', { count: 'exact', head: true });
      
      const { count: breachCount } = await supabase
        .from('buffer_breach_alerts')
        .select('*', { count: 'exact', head: true })
        .eq('acknowledged', false);
      
      const { count: decouplingCount } = await supabase
        .from('decoupling_points')
        .select('*', { count: 'exact', head: true });
      
      databaseContext += `Total products: ${productCount || 0}\n`;
      databaseContext += `Total locations: ${locationCount || 0}\n`;
      databaseContext += `Active buffer breaches: ${breachCount || 0}\n`;
      databaseContext += `Decoupling points: ${decouplingCount || 0}\n`;
      
      console.log('✅ Database stats fetched:', { productCount, locationCount, breachCount, decouplingCount });
    } catch (err) {
      console.error('❌ Database fetch error:', err);
      databaseContext += 'Database connection error\n';
    }

    const systemPrompt = `You are a supply chain data analyst for dtwin with DIRECT database query access.

${databaseContext}

${context || ''}

## AVAILABLE TABLES:
- location_master: Locations (location_id, region, channel_id, location_type, restaurant_number)
- product_master: Products (product_id, sku, name, category, subcategory)
- inventory_ddmrp_buffers_view: Buffer zones (product_id, location_id, nfp, tor, toy, tog, adu)
- buffer_breach_alerts: Breaches (product_id, location_id, breach_type, severity, detected_at, acknowledged)
- decoupling_points: Strategic positions (product_id, location_id, is_strategic, designation_reason)
- historical_sales_data: Sales (product_id, location_id, sales_date, quantity_sold, revenue)

## OUTPUT FORMAT: ${format}

${format === 'chart' ? `
CHART FORMAT: Return JSON like this:
{
  "type": "chart",
  "chartData": {
    "type": "bar"|"line"|"pie",
    "title": "Chart Title",
    "data": [{"name": "Item 1", "value": 100}, ...],
    "xKey": "name",
    "yKey": "value"
  }
}
` : format === 'report' ? `
REPORT FORMAT: Return JSON like this:
{
  "type": "report",
  "reportData": {
    "title": "Report Title",
    "summary": "Executive summary",
    "sections": [
      {"title": "Section 1", "type": "text", "content": "Text content"},
      {"title": "Metrics", "type": "metrics", "content": {"metrics": [{"label": "Metric", "value": "100", "trend": "up", "change": "+5%"}]}},
      {"title": "Data Table", "type": "table", "content": {"headers": ["Col1", "Col2"], "rows": [["A", "B"]]}},
      {"title": "Key Insights", "type": "insights", "content": {"items": ["Insight 1", "Insight 2"]}}
    ]
  }
}
` : ''}

RULES:
1. Use query_database tool to fetch data when needed
2. If format is "chart" or "report", return ONLY valid JSON (no markdown, no explanation)
3. For "text" format, provide clear narrative responses

Current time: ${timestamp || new Date().toISOString()}`;

    console.log('🤖 Calling Gemini 2.5 Flash with database tools...');
    
    // Define database query tool for AI
    const tools = [
      {
        type: "function",
        function: {
          name: "query_database",
          description: "Query the Supabase database to get specific data like products, locations, inventory levels, etc.",
          parameters: {
            type: "object",
            properties: {
              table: {
                type: "string",
                description: "Table to query (e.g., 'location_master', 'product_master', 'inventory_ddmrp_buffers_view')"
              },
              select: {
                type: "string",
                description: "Columns to select (e.g., '*', 'location_id,region,channel_id')"
              },
              limit: {
                type: "number",
                description: "Maximum rows to return (default 10, max 50)"
              }
            },
            required: ["table", "select"]
          }
        }
      }
    ];
    
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        tools: tools,
        max_tokens: 1500,
      }),
    });

    console.log('📡 Gemini response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Gemini error:', errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded' }),
          { status: 429, headers: corsHeaders }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required - add credits' }),
          { status: 402, headers: corsHeaders }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Gemini API error: ' + response.status }),
        { status: 502, headers: corsHeaders }
      );
    }

    const data = await response.json();
    console.log('✅ Gemini response received');
    console.log('Response structure:', JSON.stringify(data).slice(0, 500));
    
    if (!data.choices || data.choices.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid Gemini response' }),
        { status: 502, headers: corsHeaders }
      );
    }

    const choice = data.choices[0];
    console.log('Choice finish_reason:', choice.finish_reason);
    console.log('Has tool_calls?', !!choice.message.tool_calls);
    
    // Check if AI wants to call database tool
    if (choice.message.tool_calls && choice.message.tool_calls.length > 0) {
      console.log('🔧 AI requested', choice.message.tool_calls.length, 'tool call(s)');
      const toolCall = choice.message.tool_calls[0];
      console.log('Tool:', toolCall.function.name);
      console.log('Arguments:', toolCall.function.arguments);
      
      const args = JSON.parse(toolCall.function.arguments);
      
      console.log('📊 Querying table:', args.table, 'select:', args.select, 'limit:', args.limit || 10);
      
      // Execute database query
      const { data: queryData, error } = await supabase
        .from(args.table)
        .select(args.select)
        .limit(args.limit || 10);
      
      if (error) {
        console.error('❌ Database query error:', error);
        return new Response(
          JSON.stringify({ generatedText: `Database error: ${error.message}` }),
          { headers: corsHeaders }
        );
      }
      
      console.log('✅ Query returned', queryData?.length, 'rows');
      console.log('Sample data:', JSON.stringify(queryData?.[0]));
      
      // Call AI again with query results
      const followupResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${lovableApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt },
            choice.message,
            {
              role: 'tool',
              tool_call_id: toolCall.id,
              content: JSON.stringify(queryData)
            }
          ],
          max_tokens: 1500,
        }),
      });
      
      const followupData = await followupResponse.json();
      const generatedText = followupData.choices[0].message.content;
      console.log('📤 Returning response with query results, length:', generatedText?.length);
      
      return new Response(
        JSON.stringify({ generatedText }),
        { headers: corsHeaders }
      );
    }

    // No tool call - return direct response
    console.log('ℹ️ No tool calls made by AI');
    const generatedText = choice.message.content;
    console.log('📤 Returning direct response, length:', generatedText?.length);
    
    return new Response(
      JSON.stringify({ generatedText }),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('💥 Unexpected error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
