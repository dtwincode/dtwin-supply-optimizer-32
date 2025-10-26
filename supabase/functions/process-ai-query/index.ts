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
    // ⚠️ SECURITY: Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('❌ Missing Authorization header');
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Missing authentication' }),
        { status: 401, headers: corsHeaders }
      );
    }

    // Create authenticated Supabase client to verify user
    const supabaseAuth = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
    
    if (authError || !user) {
      console.error('❌ Invalid authentication:', authError?.message);
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid authentication token' }),
        { status: 401, headers: corsHeaders }
      );
    }

    console.log('✅ User authenticated:', user.id);

    // ⚠️ SECURITY: Check user has planner or admin role
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: roles, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    if (roleError || !roles || roles.length === 0) {
      console.error('❌ User has no roles assigned');
      return new Response(
        JSON.stringify({ error: 'Forbidden: User does not have required permissions' }),
        { status: 403, headers: corsHeaders }
      );
    }

    const userRoles = roles.map(r => r.role);
    const hasAccess = userRoles.includes('admin') || userRoles.includes('planner');

    if (!hasAccess) {
      console.error('❌ User lacks planner/admin role:', userRoles);
      return new Response(
        JSON.stringify({ error: 'Forbidden: Requires planner or admin role' }),
        { status: 403, headers: corsHeaders }
      );
    }

    console.log('✅ User authorized with roles:', userRoles);

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

## CRITICAL: OUTPUT FORMAT IS "${format}"

${format === 'chart' ? `
YOU MUST RETURN ONLY THIS EXACT JSON STRUCTURE (NO OTHER TEXT):
{
  "type": "chart",
  "chartData": {
    "type": "bar",
    "title": "Your Chart Title Here",
    "data": [
      {"name": "Category 1", "value": 150},
      {"name": "Category 2", "value": 230},
      {"name": "Category 3", "value": 180}
    ],
    "xKey": "name",
    "yKey": "value"
  }
}

EXAMPLE: If user asks "Show breaches by severity as chart", query buffer_breach_alerts, then return:
{
  "type": "chart",
  "chartData": {
    "type": "pie",
    "title": "Buffer Breaches by Severity",
    "data": [
      {"name": "CRITICAL", "value": 25},
      {"name": "HIGH", "value": 45},
      {"name": "MEDIUM", "value": 30}
    ],
    "xKey": "name",
    "yKey": "value"
  }
}
` : format === 'report' ? `
YOU MUST RETURN ONLY THIS EXACT JSON STRUCTURE (NO OTHER TEXT):
{
  "type": "report",
  "reportData": {
    "title": "Your Report Title",
    "summary": "Brief executive summary here",
    "sections": [
      {
        "title": "Key Metrics",
        "type": "metrics",
        "content": {
          "metrics": [
            {"label": "Total Items", "value": "150", "trend": "up", "change": "+12%"}
          ]
        }
      },
      {
        "title": "Details",
        "type": "table",
        "content": {
          "headers": ["Column 1", "Column 2"],
          "rows": [["Data 1", "Data 2"]]
        }
      }
    ]
  }
}
` : `
For TEXT format: Provide clear, conversational responses with real data from database queries.
`}

MANDATORY RULES:
1. Use query_database tool to fetch real data from tables
2. For "chart" or "report" format: Return ONLY valid JSON, no markdown code blocks, no explanations
3. Chart types: "bar", "line", or "pie"
4. Always use real data from queries, never fake data

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
