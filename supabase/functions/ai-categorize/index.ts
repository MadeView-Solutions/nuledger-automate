import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { transaction, organizationId } = await req.json();
    
    if (!transaction || !organizationId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    console.log('Processing transaction:', transaction);

    // Step 1: Check AI rules for matches
    const { data: rules, error: rulesError } = await supabaseAdmin
      .from('ai_rules')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('is_active', true);

    if (rulesError) {
      console.error('Error fetching rules:', rulesError);
      throw new Error('Failed to fetch AI rules');
    }

    let matchedRule = null;
    for (const rule of rules || []) {
      const match = rule.match_jsonb as any;
      let isMatch = true;

      // Simple rule matching logic
      if (match.vendor && transaction.description) {
        isMatch = transaction.description.toLowerCase().includes(match.vendor.toLowerCase());
      }
      if (match.amount_min && transaction.amount < match.amount_min) {
        isMatch = false;
      }
      if (match.amount_max && transaction.amount > match.amount_max) {
        isMatch = false;
      }

      if (isMatch) {
        matchedRule = rule;
        break;
      }
    }

    let suggestedAccountId = null;
    let confidence = 0.5;

    if (matchedRule) {
      // Use rule-based suggestion
      const action = matchedRule.action_jsonb as any;
      suggestedAccountId = action.account_id;
      confidence = 0.95;
      console.log('Matched rule:', matchedRule.name);
    } else {
      // Fallback: Use AI to categorize (stub for now)
      // In production, you could call Lovable AI here for smart categorization
      console.log('No rule matched, using default categorization');
      
      // Get the first expense account as default
      const { data: accounts } = await supabaseAdmin
        .from('accounts')
        .select('id')
        .eq('organization_id', organizationId)
        .eq('type', 'expense')
        .limit(1);

      if (accounts && accounts.length > 0) {
        suggestedAccountId = accounts[0].id;
        confidence = 0.3;
      }
    }

    // Create AI suggestion
    if (suggestedAccountId) {
      const { error: suggestionError } = await supabaseAdmin
        .from('ai_suggestions')
        .insert({
          organization_id: organizationId,
          transaction_id: transaction.id || transaction.external_id,
          suggested_account_id: suggestedAccountId,
          confidence: confidence,
          applied: false
        });

      if (suggestionError) {
        console.error('Error creating suggestion:', suggestionError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        suggested_account_id: suggestedAccountId,
        confidence: confidence,
        rule_matched: matchedRule?.name || null
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-categorize:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
