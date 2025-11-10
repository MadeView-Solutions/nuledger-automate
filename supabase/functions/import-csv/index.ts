import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ImportRequest {
  importId: string;
  fileUrl: string;
  source: 'clients' | 'vendors' | 'chart_of_accounts' | 'opening_balances';
  organizationId: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { importId, fileUrl, source, organizationId }: ImportRequest = await req.json();

    console.log(`Starting import for ${source} from ${fileUrl}`);

    // Update import status to processing
    await supabaseClient
      .from('imports')
      .update({ status: 'processing' })
      .eq('id', importId);

    // Fetch the file from storage
    const { data: fileData, error: fileError } = await supabaseClient
      .storage
      .from('imports')
      .download(fileUrl);

    if (fileError) {
      throw new Error(`Failed to fetch file: ${fileError.message}`);
    }

    // Parse CSV (simple implementation - in production use a proper CSV parser)
    const text = await fileData.text();
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    // Get column mapping for this source
    const { data: mapping } = await supabaseClient
      .from('import_maps')
      .select('column_map')
      .eq('organization_id', organizationId)
      .eq('source', source)
      .single();

    const columnMap = mapping?.column_map || {};
    
    let recordsSuccess = 0;
    let recordsFailed = 0;
    const errors: string[] = [];

    // Process each row
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const values = lines[i].split(',').map(v => v.trim());
      const record: Record<string, string> = {};
      
      headers.forEach((header, index) => {
        const mappedField = columnMap[header] || header;
        record[mappedField] = values[index] || '';
      });

      try {
        // Insert based on source type
        if (source === 'clients') {
          await supabaseClient.from('clients').insert({
            organization_id: organizationId,
            name: record.name || record.client_name,
            email: record.email,
            phone: record.phone,
          });
        } else if (source === 'chart_of_accounts') {
          await supabaseClient.from('accounts').insert({
            organization_id: organizationId,
            code: record.code || record.account_code,
            name: record.name || record.account_name,
            type: record.type || 'asset',
            is_active: true,
          });
        }
        
        recordsSuccess++;
      } catch (error) {
        recordsFailed++;
        errors.push(`Row ${i}: ${error.message}`);
        console.error(`Failed to import row ${i}:`, error);
      }
    }

    // Update import record with results
    await supabaseClient
      .from('imports')
      .update({
        status: recordsFailed === 0 ? 'completed' : 'failed',
        records_total: lines.length - 1,
        records_success: recordsSuccess,
        records_failed: recordsFailed,
        log: errors.join('\n'),
      })
      .eq('id', importId);

    console.log(`Import completed: ${recordsSuccess} success, ${recordsFailed} failed`);

    return new Response(
      JSON.stringify({
        success: true,
        recordsSuccess,
        recordsFailed,
        errors: errors.slice(0, 10), // Return first 10 errors
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in import-csv function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
