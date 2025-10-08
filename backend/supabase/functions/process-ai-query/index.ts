
// Import necessary modules for Deno
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
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
  console.log('Process AI Query function called');
  
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

    // Check if OpenAI API key is configured
    if (!openAIApiKey) {
      console.error('OpenAI API key not configured');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured in the environment variables' }),
        { status: 500, headers: corsHeaders }
      );
    }

    console.log(`Processing query: "${prompt}"`);
    console.log(`Requested format: ${format}`);
    console.log(`Timestamp: ${timestamp}`);

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Build the system message with enhanced context for supply chain domain
    const systemPrompt = `
You are an AI assistant for dtwin with DIRECT ACCESS to the Supabase database.

**CRITICAL: When users ask about data, tables, inventory, buffers, or any metrics, you MUST:**
1. Use the query_database tool to fetch the actual data
2. NEVER say you cannot access the database
3. NEVER tell users to check the dashboard manually
4. Query first, analyze second

**WRONG RESPONSE EXAMPLE:**
"I'm unable to access specific data about your Supabase backend..."

**CORRECT RESPONSE EXAMPLE:**
Use query_database tool to fetch: SELECT count(*) FROM information_schema.tables WHERE table_schema='public'
Then respond: "You have X tables in your Supabase database..."

${context || ''}

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

    // Make the API call to OpenAI
    console.log('Calling OpenAI API...');
    
    // Detect if query likely needs database access
    const needsData = /\b(how many|count|show|list|what|which|get|fetch|find|display|table|data|inventory|buffer|breach|supplier|lead time|performance|adu|dlt|nfp|tor|toy|tog)\b/i.test(prompt);
    
    // Force tool use for data queries using correct OpenAI format
    const toolChoice = needsData 
      ? { type: "function", function: { name: "query_database" } }
      : 'auto';
    
    console.log('Query needs data access:', needsData, '- Forcing tool use:', needsData);
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          tools: tools,
          tool_choice: toolChoice,
          temperature: 0.3,
          max_tokens: 1500,
        }),
      });

      console.log('OpenAI API response status:', response.status);

      // Process the OpenAI response
      if (!response.ok) {
        console.error('OpenAI API error status:', response.status);
        const errorText = await response.text();
        console.error('OpenAI API error response:', errorText);
        
        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error?.message || `API error: ${response.status}`;
        } catch (e) {
          errorMessage = `API error: ${response.status} - ${errorText.slice(0, 100)}`;
        }
        
        console.error('Parsed error message:', errorMessage);
        
        return new Response(
          JSON.stringify({ error: `OpenAI API error: ${errorMessage}` }),
          { status: 502, headers: corsHeaders }
        );
      }

      const data = await response.json();
      console.log('OpenAI response received');
      
      if (!data.choices || data.choices.length === 0) {
        console.error('Unexpected OpenAI response format:', JSON.stringify(data).slice(0, 200));
        return new Response(
          JSON.stringify({ error: 'Invalid response from OpenAI' }),
          { status: 502, headers: corsHeaders }
        );
      }

      const message = data.choices[0].message;
      
      // Handle tool calls
      if (message.tool_calls && message.tool_calls.length > 0) {
        console.log('Processing tool calls:', message.tool_calls.length);
        
        const toolResults = [];
        for (const toolCall of message.tool_calls) {
          if (toolCall.function.name === 'query_database') {
            const args = JSON.parse(toolCall.function.arguments);
            console.log('Executing database query:', args);
            
            try {
              let query = supabase.from(args.table).select(args.select);
              
              // Apply filters
              if (args.filters) {
                for (const [key, value] of Object.entries(args.filters)) {
                  query = query.eq(key, value);
                }
              }
              
              // Apply limit
              if (args.limit) {
                query = query.limit(Math.min(args.limit, 100));
              } else {
                query = query.limit(10);
              }
              
              const { data: queryData, error: queryError } = await query;
              
              if (queryError) {
                toolResults.push({
                  tool_call_id: toolCall.id,
                  output: JSON.stringify({ error: queryError.message })
                });
              } else {
                toolResults.push({
                  tool_call_id: toolCall.id,
                  output: JSON.stringify({ data: queryData, count: queryData?.length || 0 })
                });
              }
            } catch (err) {
              console.error('Error executing query:', err);
              toolResults.push({
                tool_call_id: toolCall.id,
                output: JSON.stringify({ error: err.message })
              });
            }
          }
        }
        
        // Send tool results back to OpenAI for final response
        const followUpResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: prompt },
              message,
              {
                role: 'tool',
                tool_call_id: toolResults[0].tool_call_id,
                content: toolResults[0].output
              }
            ],
            temperature: 0.3,
            max_tokens: 1500,
          }),
        });
        
        const followUpData = await followUpResponse.json();
        const generatedText = followUpData.choices[0].message.content;
        
        console.log('Generated text with tool results');
        return new Response(
          JSON.stringify({ generatedText }),
          { headers: corsHeaders }
        );
      }

      // No tool calls, return direct response
      const generatedText = message.content;
      console.log('Generated text length:', generatedText?.length || 0);
      
      // Return the successful response
      console.log('Returning successful response');
      return new Response(
        JSON.stringify({ generatedText }),
        { headers: corsHeaders }
      );
    } catch (error) {
      console.error('Error calling OpenAI API:', error.message);
      return new Response(
        JSON.stringify({ error: `Error calling OpenAI API: ${error.message}` }),
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
