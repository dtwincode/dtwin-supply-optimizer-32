
// Import necessary modules for Deno
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Define CORS headers to allow requests from any origin
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

serve(async (req) => {
  console.log('=== GEMINI EDGE FUNCTION V2.0 STARTED ===');
  console.log('Request method:', req.method);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Processing request...');
    console.log('Request headers:', JSON.stringify(Object.fromEntries([...req.headers])));

    // Parse the request body
    let body;
    try {
      body = await req.json();
      console.log('Request body parsed successfully:', JSON.stringify(body));
    } catch (e) {
      console.error('Error parsing request body:', e);
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const { prompt, context, format = 'text', timestamp } = body;
    
    if (!prompt) {
      console.error('Missing prompt in request');
      return new Response(
        JSON.stringify({ error: 'Missing prompt in request' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Check if Lovable API key is configured
    if (!lovableApiKey) {
      console.error('Lovable API key not configured');
      return new Response(
        JSON.stringify({ error: 'Lovable API key not configured in the environment variables' }),
        { status: 500, headers: corsHeaders }
      );
    }

    console.log(`Processing query: "${prompt}"`);
    console.log(`Requested format: ${format}`);
    console.log(`Timestamp: ${timestamp}`);

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // ALWAYS PRE-FETCH BASIC DATABASE STATS
    let databaseContext = '';
    console.log('Pre-fetching basic database statistics...');
    console.log('Supabase URL:', supabaseUrl);
    console.log('Supabase Key exists:', !!supabaseKey);
    
    try {
      // Test simple query first
      const { count: productCount, error: productError } = await supabase
        .from('product_master')
        .select('*', { count: 'exact', head: true });
      
      console.log('Product count query result:', { productCount, error: productError });
      
      if (productError) {
        console.error('Error fetching product count:', productError);
        databaseContext = `\nDatabase connection error: ${productError.message}\n`;
      } else {
        databaseContext += `\n\n## CURRENT DATABASE STATE:\n`;
        databaseContext += `Total products: ${productCount || 0}\n`;
        
        // Get location count
        const { count: locationCount, error: locationError } = await supabase
          .from('location_master')
          .select('*', { count: 'exact', head: true });
        
        console.log('Location count query result:', { locationCount, error: locationError });
        
        if (!locationError && locationCount !== null) {
          databaseContext += `Total locations: ${locationCount}\n`;
        }
        
        // Get buffer breach count
        const { count: breachCount, error: breachError } = await supabase
          .from('buffer_breach_alerts')
          .select('*', { count: 'exact', head: true })
          .eq('acknowledged', false);
        
        console.log('Breach count query result:', { breachCount, error: breachError });
        
        if (!breachError && breachCount !== null) {
          databaseContext += `Active buffer breaches (unacknowledged): ${breachCount}\n`;
        }
        
        // Get decoupling points count
        const { count: decouplingCount, error: decouplingError } = await supabase
          .from('decoupling_points')
          .select('*', { count: 'exact', head: true });
        
        console.log('Decoupling count query result:', { decouplingCount, error: decouplingError });
        
        if (!decouplingError && decouplingCount !== null) {
          databaseContext += `Total decoupling points: ${decouplingCount}\n`;
        }
      }
      } catch (err) {
        console.error('Error fetching database context:', err);
        databaseContext = '\n## DATABASE ERROR:\nCould not fetch database statistics. Error: ' + err.message + '\n';
      }
    
    console.log('=== DATABASE CONTEXT RESULT ===');
    console.log('Length:', databaseContext.length);
    console.log('Content:', databaseContext);
    console.log('===============================');

    // Build the system message with enhanced context for supply chain domain
    const systemPrompt = `
You are a supply chain data analyst assistant for dtwin with access to live database statistics.

**=== LIVE DATABASE SNAPSHOT (Fetched just now) ===**
${databaseContext || 'No database statistics available'}
**===============================================**

${context || ''}

**CRITICAL INSTRUCTIONS:**
1. You HAVE database access - the snapshot above shows REAL data from the production database
2. When users ask "how many products/locations" or "can you read the database", cite EXACT numbers from the snapshot above
3. Example: "Yes! Your database currently has [X] total products across [Y] locations, with [Z] active buffer breaches"
4. ALWAYS use specific numbers from the snapshot - NEVER say "I don't have access"
5. If the snapshot is empty or shows an error, explain that there was a connection issue

Output format: ${format === 'chart' ? 'Describe what chart data to display with specific metrics' : 
              format === 'report' ? 'Provide structured report with data-driven insights' : 
              'Clear and concise response with specific data points from the live database snapshot'}

Current timestamp: ${timestamp || new Date().toISOString()}
`;

## AVAILABLE TABLES IN YOUR DATABASE:

**Buffer Management Tables:**
- inventory_ddmrp_buffers_view: Red/Yellow/Green zones, TOR/TOY/TOG, ADU, DLT
- buffer_profile_master: Buffer configurations
- buffer_breach_alerts: Active breaches
- buffer_recalculation_history: Buffer adjustment history
- decoupling_points: Strategic inventory positions

**Demand & Planning Tables:**
- historical_sales_data: Sales transactions
- demand_history_analysis: CV, variability, mean/std dev
- product_classification: ABC-XYZ classification
- product_master: Product catalog
- location_master: Location data

**Inventory & Execution Tables:**
- inventory_net_flow_view: NFP, on-hand, on-order
- replenishment_orders: Purchase order recommendations
- open_pos: Open purchase orders
- open_so: Open sales orders
- onhand_latest_view: Current inventory levels

**Performance & Analytics Tables:**
- supplier_performance: OTIF rates, reliability
- actual_lead_time: Lead time tracking
- usage_analysis: Volume and usage patterns
- performance_tracking: KPI tracking

**Adjustment Factor Tables:**
- demand_adjustment_factor (DAF): Demand adjustments
- lead_time_adjustment_factor (LTAF): Lead time adjustments
- zone_adjustment_factor (ZAF): Zone adjustments

## QUERY EXAMPLES:
- Count tables: SELECT count(*) FROM information_schema.tables WHERE table_schema='public'
- List tables: SELECT table_name FROM information_schema.tables WHERE table_schema='public'
- Buffer breaches: SELECT * FROM buffer_breach_alerts WHERE acknowledged=false
- Inventory levels: SELECT product_id, nfp, tor, toy FROM inventory_ddmrp_buffers_view LIMIT 10

## HOW TO USE query_database TOOL:
The tool accepts these parameters:
- table: Table/view name (e.g., 'buffer_breach_alerts', 'information_schema.tables')
- select: Columns to return (e.g., '*', 'product_id,nfp,tor', 'count(*)')
- filters: Optional filters as object (e.g., {severity: 'CRITICAL', acknowledged: false})
- limit: Max rows (default 10, max 100)

## YOU MUST:
- Use query_database for ANY question about data, tables, counts, or current state
- Query information_schema.tables to see all available tables
- Fetch actual data before providing answers
- Calculate metrics from real database records
- Provide data-driven insights with specific numbers

## DDMRP TERMINOLOGY:
- NFP: Net Flow Position (on_hand + on_order - qualified_demand)
- TOR: Top of Red (minimum buffer level)
- TOY: Top of Yellow (reorder point)
- TOG: Top of Green (maximum buffer level)
- ADU: Average Daily Usage
- DLT: Decoupled Lead Time
- DAF/LTAF/ZAF: Dynamic adjustment factors

Output format: ${format === 'chart' ? 'Describe what chart data to display with specific metrics' : 
              format === 'report' ? 'Provide structured report with data-driven insights' : 
              'Clear and concise response with specific data points'}

Current timestamp: ${timestamp || new Date().toISOString()}
`;

    console.log('Final system prompt length:', systemPrompt.length);
    console.log('System prompt preview:', systemPrompt.slice(0, 500));

    // Define tools for database querying
    const tools = [
      {
        type: "function",
        function: {
          name: "query_database",
          description: "Execute a SELECT query on the Supabase database to retrieve real-time data. Use this to answer questions about current inventory, buffers, performance, etc.",
          parameters: {
            type: "object",
            properties: {
              table: {
                type: "string",
                description: "The table or view to query (e.g., 'inventory_ddmrp_buffers_view', 'buffer_breach_alerts', 'historical_sales_data')"
              },
              select: {
                type: "string",
                description: "Columns to select (e.g., '*', 'product_id,nfp,tor', 'count(*)')"
              },
              filters: {
                type: "object",
                description: "Optional filters as key-value pairs (e.g., {severity: 'CRITICAL', acknowledged: false})"
              },
              limit: {
                type: "number",
                description: "Maximum number of rows to return (default 10, max 100)"
              }
            },
            required: ["table", "select"]
          }
        }
      }
    ];

    // Make the API call to Lovable AI with database query tools
    console.log('Calling Lovable AI (Gemini 2.5 Flash) with database access');
    
    try {
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
          tools: undefined, // Tools disabled for now - using pre-fetched data only
          max_tokens: 1500,
        }),
      });

      console.log('Lovable AI response status:', response.status);

      // Process the Lovable AI response
      if (!response.ok) {
        console.error('Lovable AI error status:', response.status);
        const errorText = await response.text();
        console.error('Lovable AI error response:', errorText);
        
        // Handle rate limiting (429) and payment required (402)
        if (response.status === 429) {
          return new Response(
            JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
            { status: 429, headers: corsHeaders }
          );
        }
        
        if (response.status === 402) {
          return new Response(
            JSON.stringify({ error: 'Payment required. Please add credits to your Lovable workspace.' }),
            { status: 402, headers: corsHeaders }
          );
        }
        
        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error?.message || `API error: ${response.status}`;
        } catch (e) {
          errorMessage = `API error: ${response.status} - ${errorText.slice(0, 100)}`;
        }
        
        console.error('Parsed error message:', errorMessage);
        
        return new Response(
          JSON.stringify({ error: `Lovable AI error: ${errorMessage}` }),
          { status: 502, headers: corsHeaders }
        );
      }

      const data = await response.json();
      console.log('Lovable AI response received');
      console.log('Response data:', JSON.stringify(data).slice(0, 500));
      
      if (!data.choices || data.choices.length === 0) {
        console.error('Unexpected Lovable AI response format:', JSON.stringify(data).slice(0, 200));
        return new Response(
          JSON.stringify({ error: 'Invalid response from Lovable AI' }),
          { status: 502, headers: corsHeaders }
        );
      }

      const generatedText = data.choices[0].message.content;
      console.log('Generated text:', generatedText?.slice(0, 200));
      
      // Return the successful response
      console.log('Returning successful response');
      return new Response(
        JSON.stringify({ generatedText }),
        { headers: corsHeaders }
      );
    } catch (error) {
      console.error('Error calling Lovable AI:', error.message);
      return new Response(
        JSON.stringify({ error: `Error calling Lovable AI: ${error.message}` }),
        { status: 500, headers: corsHeaders }
      );
    }
  } catch (error) {
    // Catch and log any unexpected errors
    console.error('Unexpected error in process-ai-query:', error.message, error.stack);
    return new Response(
      JSON.stringify({ error: `Unexpected error: ${error.message}` }),
      { status: 500, headers: corsHeaders }
    );
  }
});
