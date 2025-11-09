-- Create materialized view for daily KPIs (stores actual computed data)
CREATE MATERIALIZED VIEW IF NOT EXISTS public.mv_kpis_daily AS
SELECT 
  o.id as organization_id,
  CURRENT_DATE as date,
  0::bigint as cases_open,
  0::numeric(15,2) as trust_balance,
  0::numeric(15,2) as op_balance,
  0::numeric(15,2) as ar,
  0::numeric(15,2) as ap,
  0::numeric(15,2) as settled_this_month,
  0::numeric(15,2) as write_offs,
  0::numeric(2,2) as utilization
FROM public.organizations o;

-- Create index on organization_id and date for fast lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_kpis_daily_org_date 
ON public.mv_kpis_daily (organization_id, date);

CREATE INDEX IF NOT EXISTS idx_mv_kpis_daily_date 
ON public.mv_kpis_daily (date DESC);

-- Create a wrapper table for RLS (this is the table users will query)
CREATE TABLE IF NOT EXISTS public.kpis_daily (
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  cases_open BIGINT NOT NULL DEFAULT 0,
  trust_balance NUMERIC(15,2) NOT NULL DEFAULT 0,
  op_balance NUMERIC(15,2) NOT NULL DEFAULT 0,
  ar NUMERIC(15,2) NOT NULL DEFAULT 0,
  ap NUMERIC(15,2) NOT NULL DEFAULT 0,
  settled_this_month NUMERIC(15,2) NOT NULL DEFAULT 0,
  write_offs NUMERIC(15,2) NOT NULL DEFAULT 0,
  utilization NUMERIC(2,2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (organization_id, date)
);

CREATE INDEX IF NOT EXISTS idx_kpis_daily_date ON public.kpis_daily (date DESC);

-- Enable RLS on the table
ALTER TABLE public.kpis_daily ENABLE ROW LEVEL SECURITY;

-- RLS policy for kpis_daily table
DROP POLICY IF EXISTS "Users can view KPIs for their organizations" ON public.kpis_daily;
CREATE POLICY "Users can view KPIs for their organizations"
  ON public.kpis_daily FOR SELECT
  TO authenticated
  USING (organization_id IN (SELECT public.user_organizations(auth.uid())));

-- Function to refresh KPIs and copy to the RLS-protected table
CREATE OR REPLACE FUNCTION public.refresh_kpis_daily()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  start_date DATE;
  end_date DATE;
BEGIN
  -- Set date range (last 90 days)
  end_date := CURRENT_DATE;
  start_date := end_date - INTERVAL '90 days';
  
  -- Delete and insert into the RLS-protected table
  DELETE FROM public.kpis_daily WHERE date >= start_date;
  
  -- Insert daily KPIs for each organization
  INSERT INTO public.kpis_daily (
    organization_id,
    date,
    cases_open,
    trust_balance,
    op_balance,
    ar,
    ap,
    settled_this_month,
    write_offs,
    utilization,
    updated_at
  )
  SELECT 
    o.id as organization_id,
    d.date,
    -- Placeholder calculations - will be updated as you add case management tables
    0::bigint as cases_open,
    -- Trust balance: sum of all trust account balances as of date
    COALESCE(
      (SELECT SUM(CASE WHEN jl.debit > 0 THEN jl.debit ELSE -jl.credit END)
       FROM journal_lines jl
       JOIN journal_entries je ON je.id = jl.entry_id
       JOIN accounts a ON a.id = jl.account_id
       WHERE je.organization_id = o.id
         AND je.entry_date <= d.date
         AND a.name ILIKE '%trust%'
         AND a.type = 'asset'), 0) as trust_balance,
    -- Operating balance
    COALESCE(
      (SELECT SUM(CASE WHEN jl.debit > 0 THEN jl.debit ELSE -jl.credit END)
       FROM journal_lines jl
       JOIN journal_entries je ON je.id = jl.entry_id
       JOIN accounts a ON a.id = jl.account_id
       WHERE je.organization_id = o.id
         AND je.entry_date <= d.date
         AND a.name ILIKE '%operating%'
         AND a.type = 'asset'), 0) as op_balance,
    -- Accounts Receivable (1200 range)
    COALESCE(
      (SELECT SUM(CASE WHEN jl.debit > 0 THEN jl.debit ELSE -jl.credit END)
       FROM journal_lines jl
       JOIN journal_entries je ON je.id = jl.entry_id
       JOIN accounts a ON a.id = jl.account_id
       WHERE je.organization_id = o.id
         AND je.entry_date <= d.date
         AND a.code LIKE '1200%'
         AND a.type = 'asset'), 0) as ar,
    -- Accounts Payable (2000 range)
    COALESCE(
      (SELECT SUM(CASE WHEN jl.credit > 0 THEN jl.credit ELSE -jl.debit END)
       FROM journal_lines jl
       JOIN journal_entries je ON je.id = jl.entry_id
       JOIN accounts a ON a.id = jl.account_id
       WHERE je.organization_id = o.id
         AND je.entry_date <= d.date
         AND a.code LIKE '2000%'
         AND a.type = 'liability'), 0) as ap,
    -- Settled this month - placeholder
    0::numeric(15,2) as settled_this_month,
    -- Write-offs - placeholder
    0::numeric(15,2) as write_offs,
    -- Utilization - placeholder
    0::numeric(2,2) as utilization,
    now() as updated_at
  FROM public.organizations o
  CROSS JOIN generate_series(start_date, end_date, '1 day'::interval) AS d(date)
  ON CONFLICT (organization_id, date) 
  DO UPDATE SET
    cases_open = EXCLUDED.cases_open,
    trust_balance = EXCLUDED.trust_balance,
    op_balance = EXCLUDED.op_balance,
    ar = EXCLUDED.ar,
    ap = EXCLUDED.ap,
    settled_this_month = EXCLUDED.settled_this_month,
    write_offs = EXCLUDED.write_offs,
    utilization = EXCLUDED.utilization,
    updated_at = EXCLUDED.updated_at;
    
  -- Log completion
  RAISE NOTICE 'KPI refresh completed for % organizations', (SELECT COUNT(*) FROM public.organizations);
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.refresh_kpis_daily() TO service_role;

-- Initial refresh
SELECT public.refresh_kpis_daily();