import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting KPI refresh job...');
    
    // Create Supabase client with service role key for admin access
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Call the refresh function for daily KPIs
    const { error: kpiError } = await supabaseAdmin.rpc('refresh_kpis_daily');
    
    if (kpiError) {
      console.error('Error refreshing KPIs:', kpiError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: kpiError.message 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('KPI refresh completed successfully');
    
    // Refresh all materialized views for reports
    console.log('Starting reports refresh...');
    const { error: reportsError } = await supabaseAdmin.rpc('fn_refresh_reports');
    
    if (reportsError) {
      console.error('Error refreshing reports:', reportsError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: reportsError.message 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Reports refresh completed successfully');
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'KPIs and report materialized views refreshed successfully',
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Unexpected error in refresh-kpis function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
