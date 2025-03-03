
// Import necessary modules for Deno
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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

    // Build the system message with enhanced context for supply chain domain
    const systemPrompt = `
You are an AI assistant for dtwin, a cloud-based demand-driven supply chain planning platform.
Your role is to help demand planners analyze and optimize their supply chain.

${context || ''}

Current capabilities:
- You can answer questions about supply chain management concepts
- You can explain DDMRP principles and methodologies
- You can provide insights and best practices for demand planning
- You can suggest ways to improve forecast accuracy and inventory management

When responding:
- Be precise and concise in your explanations
- Provide actionable insights when possible
- Format your response in a way that's easy to understand
- When you don't know something specific to the user's data, acknowledge it but provide general best practices

Output format: ${format === 'chart' ? 'Describe what the chart should show and what insights it would reveal' : 
              format === 'report' ? 'Provide a structured report with sections and insights' : 
              'Clear and concise textual response'}

Current timestamp: ${timestamp || new Date().toISOString()}
`;

    // Make the API call to OpenAI
    console.log('Calling OpenAI API...');
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', // Using the fast and efficient model
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 1000,
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

      const generatedText = data.choices[0].message.content;
      console.log('Generated text length:', generatedText.length);
      
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
