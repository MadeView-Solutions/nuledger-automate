-- Reports: Materialized Views
CREATE MATERIALIZED VIEW mv_trial_balance AS
SELECT 
  a.organization_id,
  CURRENT_DATE as as_of,
  a.id as account_id,
  a.code,
  a.name,
  a.type,
  COALESCE(SUM(CASE WHEN jl.debit > 0 THEN jl.debit ELSE -jl.credit END), 0) as balance
FROM accounts a
LEFT JOIN journal_lines jl ON jl.account_id = a.id
LEFT JOIN journal_entries je ON je.id = jl.entry_id
WHERE a.is_active = true
GROUP BY a.organization_id, a.id, a.code, a.name, a.type;

CREATE UNIQUE INDEX idx_mv_trial_balance ON mv_trial_balance(organization_id, account_id);

-- GL Detail by period
CREATE MATERIALIZED VIEW mv_gl_detail AS
SELECT 
  a.organization_id,
  a.id as account_id,
  a.code,
  a.name,
  DATE_TRUNC('month', je.entry_date) as period,
  COUNT(jl.id) as transaction_count,
  COALESCE(SUM(jl.debit), 0) as total_debits,
  COALESCE(SUM(jl.credit), 0) as total_credits,
  COALESCE(SUM(jl.debit - jl.credit), 0) as net_change
FROM accounts a
LEFT JOIN journal_lines jl ON jl.account_id = a.id
LEFT JOIN journal_entries je ON je.id = jl.entry_id
WHERE je.entry_date >= DATE_TRUNC('year', CURRENT_DATE) - INTERVAL '2 years'
GROUP BY a.organization_id, a.id, a.code, a.name, DATE_TRUNC('month', je.entry_date);

CREATE UNIQUE INDEX idx_mv_gl_detail ON mv_gl_detail(organization_id, account_id, period);

-- Case Profitability
CREATE MATERIALIZED VIEW mv_case_profitability AS
SELECT 
  c.organization_id,
  c.id as case_id,
  c.case_no,
  DATE_TRUNC('month', c.opened_on) as period,
  COALESCE(s.gross_amount, 0) as revenue,
  COALESCE(SUM(e.amount), 0) as expenses,
  COALESCE(SUM(te.hours * te.rate), 0) as time_cost,
  COALESCE(s.gross_amount, 0) - COALESCE(SUM(e.amount), 0) - COALESCE(SUM(te.hours * te.rate), 0) as net_profit
FROM cases c
LEFT JOIN settlements s ON s.case_id = c.id AND s.status = 'posted'
LEFT JOIN expenses e ON e.case_id = c.id
LEFT JOIN time_entries te ON te.case_id = c.id
GROUP BY c.organization_id, c.id, c.case_no, DATE_TRUNC('month', c.opened_on), s.gross_amount;

CREATE UNIQUE INDEX idx_mv_case_profitability ON mv_case_profitability(organization_id, case_id, period);

-- Trust Three-Way Reconciliation
CREATE MATERIALIZED VIEW mv_trust_three_way AS
SELECT 
  o.id as organization_id,
  -- Bank balance (trust cash account)
  COALESCE((
    SELECT SUM(CASE WHEN jl.debit > 0 THEN jl.debit ELSE -jl.credit END)
    FROM journal_lines jl
    JOIN journal_entries je ON je.id = jl.entry_id
    JOIN accounts a ON a.id = jl.account_id
    WHERE je.organization_id = o.id
      AND a.type = 'asset'
      AND a.name ILIKE '%trust%cash%'
  ), 0) as bank_balance,
  -- Client ledger total (sum of all client trust liabilities)
  COALESCE((
    SELECT SUM(CASE WHEN jl.credit > 0 THEN jl.credit ELSE -jl.debit END)
    FROM journal_lines jl
    JOIN journal_entries je ON je.id = jl.entry_id
    JOIN accounts a ON a.id = jl.account_id
    WHERE je.organization_id = o.id
      AND a.type = 'liability'
      AND a.name ILIKE '%client%trust%'
  ), 0) as client_ledger_total,
  -- Control account (trust liability)
  COALESCE((
    SELECT SUM(CASE WHEN jl.credit > 0 THEN jl.credit ELSE -jl.debit END)
    FROM journal_lines jl
    JOIN journal_entries je ON je.id = jl.entry_id
    JOIN accounts a ON a.id = jl.account_id
    WHERE je.organization_id = o.id
      AND a.type = 'liability'
      AND a.name ILIKE '%trust%liability%'
  ), 0) as control_account,
  CURRENT_DATE as as_of
FROM organizations o;

CREATE UNIQUE INDEX idx_mv_trust_three_way ON mv_trust_three_way(organization_id);

-- Legal Analytics: Case Cycle Times
CREATE MATERIALIZED VIEW mv_case_cycle AS
SELECT 
  organization_id,
  practice_area,
  COUNT(*) as case_count,
  AVG(CASE WHEN settled_on IS NOT NULL THEN settled_on - opened_on END) as avg_open_to_settle_days,
  MIN(CASE WHEN settled_on IS NOT NULL THEN settled_on - opened_on END) as min_days,
  MAX(CASE WHEN settled_on IS NOT NULL THEN settled_on - opened_on END) as max_days,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY CASE WHEN settled_on IS NOT NULL THEN settled_on - opened_on END) as median_days
FROM cases
WHERE settled_on IS NOT NULL
GROUP BY organization_id, practice_area;

CREATE UNIQUE INDEX idx_mv_case_cycle ON mv_case_cycle(organization_id, practice_area);

-- Settlement Distribution Analysis
CREATE MATERIALIZED VIEW mv_settlement_distribution AS
SELECT 
  s.organization_id,
  DATE_TRUNC('quarter', s.received_date) as quarter,
  c.practice_area,
  COUNT(*) as settlement_count,
  AVG(s.gross_amount) as avg_gross,
  AVG(s.fee_amount) as avg_fee,
  AVG(s.liens_total) as avg_liens,
  AVG(s.client_net) as avg_client_net,
  SUM(s.gross_amount) as total_gross,
  SUM(s.fee_amount) as total_fees,
  SUM(s.client_net) as total_client_net
FROM settlements s
JOIN cases c ON c.id = s.case_id
WHERE s.status = 'posted'
GROUP BY s.organization_id, DATE_TRUNC('quarter', s.received_date), c.practice_area;

CREATE UNIQUE INDEX idx_mv_settlement_dist ON mv_settlement_distribution(organization_id, quarter, practice_area);

-- Liens Recovery Rate
CREATE MATERIALIZED VIEW mv_liens_recovery_rate AS
SELECT 
  s.organization_id,
  c.practice_area,
  COUNT(*) as case_count,
  AVG(CASE WHEN s.gross_amount > 0 THEN s.liens_total / s.gross_amount ELSE 0 END) as avg_lien_ratio,
  SUM(s.liens_total) as total_liens,
  SUM(s.gross_amount) as total_settlements
FROM settlements s
JOIN cases c ON c.id = s.case_id
WHERE s.status = 'posted'
GROUP BY s.organization_id, c.practice_area;

CREATE UNIQUE INDEX idx_mv_liens_recovery ON mv_liens_recovery_rate(organization_id, practice_area);

-- Referral ROI (placeholder view - empty until referral tracking is added)
CREATE MATERIALIZED VIEW mv_referral_roi AS
SELECT 
  c.organization_id,
  'Direct' as referral_source,
  COUNT(*) as cases_count,
  SUM(COALESCE(s.gross_amount, 0)) as total_revenue,
  AVG(COALESCE(s.gross_amount, 0)) as avg_revenue_per_case
FROM cases c
LEFT JOIN settlements s ON s.case_id = c.id AND s.status = 'posted'
WHERE 1=0  -- Empty view initially
GROUP BY c.organization_id;

CREATE UNIQUE INDEX idx_mv_referral_roi ON mv_referral_roi(organization_id, referral_source);

-- Function to refresh all materialized views
CREATE OR REPLACE FUNCTION fn_refresh_reports()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_trial_balance;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_gl_detail;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_case_profitability;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_trust_three_way;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_case_cycle;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_settlement_distribution;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_liens_recovery_rate;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_referral_roi;
  RAISE NOTICE 'All report materialized views refreshed successfully';
END;
$$;

-- Function to generate specific reports
CREATE OR REPLACE FUNCTION fn_generate_report(
  _report_type TEXT,
  _params JSONB DEFAULT '{}'::JSONB
)
RETURNS TABLE(report_data JSONB)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  CASE _report_type
    WHEN 'trial_balance' THEN
      RETURN QUERY
      SELECT jsonb_build_object(
        'report_type', 'trial_balance',
        'as_of', as_of,
        'data', jsonb_agg(jsonb_build_object(
          'code', code,
          'name', name,
          'type', type,
          'balance', balance
        ))
      )
      FROM mv_trial_balance
      WHERE organization_id = (_params->>'organization_id')::uuid
      GROUP BY organization_id, as_of;
      
    WHEN 'case_profitability' THEN
      RETURN QUERY
      SELECT jsonb_build_object(
        'report_type', 'case_profitability',
        'data', jsonb_agg(jsonb_build_object(
          'case_no', case_no,
          'period', period,
          'revenue', revenue,
          'expenses', expenses,
          'time_cost', time_cost,
          'net_profit', net_profit
        ))
      )
      FROM mv_case_profitability
      WHERE organization_id = (_params->>'organization_id')::uuid
      GROUP BY organization_id;
      
    WHEN 'trust_three_way' THEN
      RETURN QUERY
      SELECT jsonb_build_object(
        'report_type', 'trust_three_way',
        'bank_balance', bank_balance,
        'client_ledger_total', client_ledger_total,
        'control_account', control_account,
        'variance', bank_balance - client_ledger_total,
        'as_of', as_of
      )
      FROM mv_trust_three_way
      WHERE organization_id = (_params->>'organization_id')::uuid;
      
    ELSE
      RAISE EXCEPTION 'Unknown report type: %', _report_type;
  END CASE;
END;
$$;

-- Migration & Sync: Tables
CREATE TABLE imports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  source TEXT NOT NULL, -- 'csv', 'qbo', 'manual'
  file_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  log TEXT,
  records_total INTEGER DEFAULT 0,
  records_success INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID
);

CREATE TABLE import_maps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  source TEXT NOT NULL, -- 'clients', 'vendors', 'chart_of_accounts', 'opening_balances'
  column_map JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS for imports
ALTER TABLE imports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage imports"
ON imports
FOR ALL
USING (
  organization_id IN (SELECT user_organizations(auth.uid()))
  AND (has_role(auth.uid(), organization_id, 'owner') OR has_role(auth.uid(), organization_id, 'admin'))
);

CREATE POLICY "Users can view imports in their organizations"
ON imports
FOR SELECT
USING (organization_id IN (SELECT user_organizations(auth.uid())));

-- RLS for import_maps
ALTER TABLE import_maps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage import maps"
ON import_maps
FOR ALL
USING (
  organization_id IN (SELECT user_organizations(auth.uid()))
  AND (has_role(auth.uid(), organization_id, 'owner') OR has_role(auth.uid(), organization_id, 'admin'))
);

CREATE POLICY "Users can view import maps in their organizations"
ON import_maps
FOR SELECT
USING (organization_id IN (SELECT user_organizations(auth.uid())));

-- Triggers
CREATE TRIGGER update_imports_updated_at
BEFORE UPDATE ON imports
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_import_maps_updated_at
BEFORE UPDATE ON import_maps
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Storage bucket for imports
INSERT INTO storage.buckets (id, name, public)
VALUES ('imports', 'imports', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for imports storage bucket
CREATE POLICY "Admins can upload to imports bucket"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'imports' 
  AND (storage.foldername(name))[1] IN (
    SELECT o.id::text 
    FROM organizations o 
    WHERE o.id IN (SELECT user_organizations(auth.uid()))
      AND (has_role(auth.uid(), o.id, 'owner') OR has_role(auth.uid(), o.id, 'admin'))
  )
);

CREATE POLICY "Users can view imports in their org folders"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'imports'
  AND (storage.foldername(name))[1] IN (
    SELECT o.id::text
    FROM organizations o
    WHERE o.id IN (SELECT user_organizations(auth.uid()))
  )
);