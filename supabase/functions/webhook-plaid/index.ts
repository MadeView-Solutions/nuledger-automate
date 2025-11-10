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
    const payload = await req.json();
    console.log('Plaid webhook received:', JSON.stringify(payload));

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Handle different webhook types
    const webhookType = payload.webhook_type;

    switch (webhookType) {
      case 'TRANSACTIONS':
        await handleTransactionsWebhook(payload, supabaseAdmin);
        break;
      
      case 'ITEM':
        await handleItemWebhook(payload, supabaseAdmin);
        break;
      
      default:
        console.log('Unhandled webhook type:', webhookType);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing Plaid webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function handleTransactionsWebhook(payload: any, supabase: any) {
  const { item_id, new_transactions, removed_transactions } = payload;
  
  console.log('Processing transactions webhook for item:', item_id);
  console.log('New transactions:', new_transactions);
  console.log('Removed transactions:', removed_transactions);

  // Find the bank feed for this item
  const { data: feed, error: feedError } = await supabase
    .from('bank_feeds')
    .select('*, bank_accounts(id, organization_id)')
    .eq('access_token', item_id)
    .eq('provider', 'plaid')
    .single();

  if (feedError || !feed) {
    console.error('Bank feed not found for item:', item_id);
    return;
  }

  const organizationId = feed.bank_accounts.organization_id;
  const bankAccountId = feed.bank_accounts.id;

  // Here you would typically fetch the actual transaction details from Plaid API
  // For now, we'll just log that we received the webhook
  
  // In production, you would:
  // 1. Call Plaid API to get transaction details
  // 2. Upsert transactions to bank_transactions table
  // 3. Call AI categorization for each new transaction

  console.log('Would fetch and sync transactions for:', {
    organizationId,
    bankAccountId,
    newCount: new_transactions,
  });

  // Update last sync time
  await supabase
    .from('bank_feeds')
    .update({ last_sync: new Date().toISOString() })
    .eq('id', feed.id);
}

async function handleItemWebhook(payload: any, supabase: any) {
  const { item_id, error: itemError } = payload;
  
  console.log('Processing item webhook for:', item_id);
  
  if (itemError) {
    console.error('Plaid item error:', itemError);
    
    // Update feed status
    await supabase
      .from('bank_feeds')
      .update({ 
        status: 'error',
        last_sync: new Date().toISOString()
      })
      .eq('access_token', item_id)
      .eq('provider', 'plaid');
  }
}
