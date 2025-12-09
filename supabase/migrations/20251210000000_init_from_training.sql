

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE TYPE "public"."account_type" AS ENUM (
    'asset',
    'liability',
    'equity',
    'revenue',
    'expense'
);


ALTER TYPE "public"."account_type" OWNER TO "postgres";


CREATE TYPE "public"."app_role" AS ENUM (
    'owner',
    'admin',
    'staff',
    'read_only'
);


ALTER TYPE "public"."app_role" OWNER TO "postgres";


CREATE TYPE "public"."bank_feed_provider" AS ENUM (
    'plaid',
    'qbo',
    'manual'
);


ALTER TYPE "public"."bank_feed_provider" OWNER TO "postgres";


CREATE TYPE "public"."settlement_item_type" AS ENUM (
    'fee',
    'lien',
    'expense',
    'client'
);


ALTER TYPE "public"."settlement_item_type" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."fn_apply_disbursement_template"("_settlement_id" "uuid", "_template_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  _settlement RECORD;
  _line RECORD;
  _calculated_amount NUMERIC(15,2);
BEGIN
  SELECT * INTO _settlement FROM public.settlements WHERE id = _settlement_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Settlement not found: %', _settlement_id; END IF;
  
  DELETE FROM public.settlement_items WHERE settlement_id = _settlement_id;
  
  FOR _line IN SELECT * FROM public.disbursement_template_lines WHERE template_id = _template_id LOOP
    IF _line.pct IS NOT NULL THEN
      _calculated_amount := (_settlement.gross_amount * _line.pct / 100);
    ELSE
      _calculated_amount := _line.fixed_amount;
    END IF;
    INSERT INTO public.settlement_items (settlement_id, type, label, amount) VALUES (_settlement_id, _line.item_type, _line.label, _calculated_amount);
  END LOOP;
  
  UPDATE public.settlements SET 
    fee_amount = (SELECT COALESCE(SUM(amount), 0) FROM public.settlement_items WHERE settlement_id = _settlement_id AND type = 'fee'),
    liens_total = (SELECT COALESCE(SUM(amount), 0) FROM public.settlement_items WHERE settlement_id = _settlement_id AND type = 'lien'),
    client_net = (SELECT COALESCE(SUM(amount), 0) FROM public.settlement_items WHERE settlement_id = _settlement_id AND type = 'client')
  WHERE id = _settlement_id;
  
  RAISE NOTICE 'Template applied to settlement %', _settlement_id;
END;
$$;


ALTER FUNCTION "public"."fn_apply_disbursement_template"("_settlement_id" "uuid", "_template_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."fn_generate_report"("_report_type" "text", "_params" "jsonb" DEFAULT '{}'::"jsonb") RETURNS TABLE("report_data" "jsonb")
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
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


ALTER FUNCTION "public"."fn_generate_report"("_report_type" "text", "_params" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."fn_issue_check"("_check_id" "uuid") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  _check RECORD;
  _entry_id UUID;
  _bank_account_id UUID;
  _ap_account_id UUID;
BEGIN
  SELECT * INTO _check FROM public.checks WHERE id = _check_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Check not found'; END IF;
  IF _check.status != 'pending' THEN RAISE EXCEPTION 'Check already issued'; END IF;
  
  SELECT account_id INTO _bank_account_id FROM public.bank_accounts WHERE id = _check.bank_account_id;
  SELECT id INTO _ap_account_id FROM public.accounts 
  WHERE organization_id = _check.organization_id AND code LIKE '2%' AND type = 'liability' LIMIT 1;
  
  INSERT INTO public.journal_entries (organization_id, entry_date, created_by, memo)
  VALUES (_check.organization_id, _check.date, auth.uid(), 'Check #' || COALESCE(_check.number, '') || ' to ' || _check.payee)
  RETURNING id INTO _entry_id;
  
  INSERT INTO public.journal_lines (entry_id, account_id, debit, credit) VALUES 
    (_entry_id, _ap_account_id, _check.amount, 0),
    (_entry_id, _bank_account_id, 0, _check.amount);
  
  UPDATE public.checks SET status = 'issued' WHERE id = _check_id;
  
  RETURN _entry_id;
END;
$$;


ALTER FUNCTION "public"."fn_issue_check"("_check_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."fn_match_transactions"("_organization_id" "uuid") RETURNS integer
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  _matched_count INTEGER := 0;
  _transaction RECORD;
  _entry_id UUID;
BEGIN
  FOR _transaction IN 
    SELECT * FROM public.bank_transactions 
    WHERE organization_id = _organization_id 
    AND matched_entry_id IS NULL
  LOOP
    SELECT je.id INTO _entry_id
    FROM public.journal_entries je
    JOIN public.journal_lines jl ON jl.entry_id = je.id
    WHERE je.organization_id = _organization_id
    AND je.entry_date = _transaction.date
    AND ABS((jl.debit - jl.credit) - ABS(_transaction.amount)) < 0.01
    LIMIT 1;
    
    IF _entry_id IS NOT NULL THEN
      UPDATE public.bank_transactions 
      SET matched_entry_id = _entry_id 
      WHERE id = _transaction.id;
      _matched_count := _matched_count + 1;
    END IF;
  END LOOP;
  
  RETURN _matched_count;
END;
$$;


ALTER FUNCTION "public"."fn_match_transactions"("_organization_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."fn_post_settlement"("_settlement_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  _settlement RECORD;
  _entry_id UUID;
  _trust_account_id UUID;
  _revenue_account_id UUID;
  _expense_account_id UUID;
  _client_account_id UUID;
  _item RECORD;
BEGIN
  SELECT * INTO _settlement FROM public.settlements WHERE id = _settlement_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Settlement not found: %', _settlement_id; END IF;
  IF _settlement.status != 'pending' THEN RAISE EXCEPTION 'Settlement already posted'; END IF;
  
  SELECT id INTO _trust_account_id FROM public.accounts WHERE organization_id = _settlement.organization_id AND name ILIKE '%trust%' AND type = 'asset' LIMIT 1;
  SELECT id INTO _revenue_account_id FROM public.accounts WHERE organization_id = _settlement.organization_id AND code LIKE '4%' AND type = 'revenue' LIMIT 1;
  SELECT id INTO _expense_account_id FROM public.accounts WHERE organization_id = _settlement.organization_id AND code LIKE '5%' AND type = 'expense' LIMIT 1;
  SELECT id INTO _client_account_id FROM public.accounts WHERE organization_id = _settlement.organization_id AND code LIKE '2%' AND type = 'liability' LIMIT 1;
  
  INSERT INTO public.journal_entries (organization_id, entry_date, case_id, created_by, memo)
  VALUES (_settlement.organization_id, COALESCE(_settlement.received_date, CURRENT_DATE), _settlement.case_id, auth.uid(), 'Settlement posting for case ' || (SELECT case_no FROM public.cases WHERE id = _settlement.case_id))
  RETURNING id INTO _entry_id;
  
  INSERT INTO public.journal_lines (entry_id, account_id, debit, credit) VALUES (_entry_id, _trust_account_id, _settlement.gross_amount, 0);
  
  FOR _item IN SELECT * FROM public.settlement_items WHERE settlement_id = _settlement_id LOOP
    CASE _item.type
      WHEN 'fee' THEN INSERT INTO public.journal_lines (entry_id, account_id, debit, credit) VALUES (_entry_id, _revenue_account_id, 0, _item.amount);
      WHEN 'lien' THEN INSERT INTO public.journal_lines (entry_id, account_id, debit, credit) VALUES (_entry_id, _expense_account_id, 0, _item.amount);
      WHEN 'expense' THEN INSERT INTO public.journal_lines (entry_id, account_id, debit, credit) VALUES (_entry_id, _expense_account_id, 0, _item.amount);
      WHEN 'client' THEN INSERT INTO public.journal_lines (entry_id, account_id, debit, credit) VALUES (_entry_id, _client_account_id, 0, _item.amount);
    END CASE;
  END LOOP;
  
  UPDATE public.settlements SET status = 'posted' WHERE id = _settlement_id;
  RAISE NOTICE 'Settlement % posted successfully', _settlement_id;
END;
$$;


ALTER FUNCTION "public"."fn_post_settlement"("_settlement_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."fn_refresh_reports"() RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
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


ALTER FUNCTION "public"."fn_refresh_reports"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."fn_seed_scenario"("_scenario_id" "uuid") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  _scenario RECORD;
  _org_id UUID;
  _seed_data JSONB;
  _client_id UUID;
  _case_id UUID;
  _trust_account_id UUID;
  _bank_account_id UUID;
  _run_id UUID;
  _log TEXT := '';
BEGIN
  -- Get scenario
  SELECT * INTO _scenario FROM public.test_scenarios WHERE id = _scenario_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Test scenario not found: %', _scenario_id;
  END IF;
  
  _org_id := _scenario.organization_id;
  _seed_data := _scenario.seed_jsonb;
  
  -- Create test run
  INSERT INTO public.test_runs (scenario_id, executed_by, started_at)
  VALUES (_scenario_id, auth.uid(), now())
  RETURNING id INTO _run_id;
  
  _log := _log || 'Starting test scenario: ' || _scenario.name || E'\n';
  
  BEGIN
    -- Seed Clients
    IF _seed_data ? 'clients' THEN
      FOR i IN 1..COALESCE((_seed_data->>'clients')::INTEGER, 0) LOOP
        INSERT INTO public.clients (organization_id, name, email, phone)
        VALUES (_org_id, 'Test Client ' || i, 'client' || i || '@test.com', '555-000-' || LPAD(i::TEXT, 4, '0'))
        RETURNING id INTO _client_id;
        
        _log := _log || 'Created client: ' || _client_id || E'\n';
      END LOOP;
    END IF;
    
    -- Seed Cases
    IF _seed_data ? 'cases' THEN
      FOR i IN 1..COALESCE((_seed_data->>'cases')::INTEGER, 0) LOOP
        -- Get a random client
        SELECT id INTO _client_id FROM public.clients 
        WHERE organization_id = _org_id 
        ORDER BY RANDOM() LIMIT 1;
        
        IF _client_id IS NULL THEN
          INSERT INTO public.clients (organization_id, name, email)
          VALUES (_org_id, 'Test Client for Case ' || i, 'case' || i || '@test.com')
          RETURNING id INTO _client_id;
        END IF;
        
        INSERT INTO public.cases (organization_id, client_id, case_no, status, practice_area, opened_on)
        VALUES (_org_id, _client_id, 'TEST-' || LPAD(i::TEXT, 5, '0'), 'open', 'Personal Injury', CURRENT_DATE - (i || ' days')::INTERVAL)
        RETURNING id INTO _case_id;
        
        _log := _log || 'Created case: ' || _case_id || E'\n';
      END LOOP;
    END IF;
    
    -- Seed Bank Accounts
    IF _seed_data ? 'bank_accounts' THEN
      FOR i IN 1..COALESCE((_seed_data->>'bank_accounts')::INTEGER, 0) LOOP
        INSERT INTO public.bank_accounts (organization_id, name, type, institution, last4)
        VALUES (_org_id, 'Test Bank Account ' || i, CASE WHEN i % 2 = 0 THEN 'trust' ELSE 'operating' END, 'Test Bank', LPAD((1000 + i)::TEXT, 4, '0'))
        RETURNING id INTO _bank_account_id;
        
        _log := _log || 'Created bank account: ' || _bank_account_id || E'\n';
      END LOOP;
    END IF;
    
    -- Seed Settlements
    IF _seed_data ? 'settlements' THEN
      FOR i IN 1..COALESCE((_seed_data->>'settlements')::INTEGER, 0) LOOP
        -- Get a random case
        SELECT id INTO _case_id FROM public.cases 
        WHERE organization_id = _org_id 
        ORDER BY RANDOM() LIMIT 1;
        
        IF _case_id IS NOT NULL THEN
          INSERT INTO public.settlements (organization_id, case_id, gross_amount, fee_pct, received_date, status)
          VALUES (_org_id, _case_id, (10000 + i * 5000)::NUMERIC, 33.33, CURRENT_DATE - (i || ' days')::INTERVAL, 'pending');
          
          _log := _log || 'Created settlement for case: ' || _case_id || E'\n';
        END IF;
      END LOOP;
    END IF;
    
    -- Mark test run as passed
    UPDATE public.test_runs 
    SET passed = true, completed_at = now(), log = _log
    WHERE id = _run_id;
    
    _log := _log || 'Test scenario completed successfully' || E'\n';
    
  EXCEPTION WHEN OTHERS THEN
    _log := _log || 'ERROR: ' || SQLERRM || E'\n';
    UPDATE public.test_runs 
    SET passed = false, completed_at = now(), log = _log
    WHERE id = _run_id;
    RAISE;
  END;
  
  RETURN _run_id;
END;
$$;


ALTER FUNCTION "public"."fn_seed_scenario"("_scenario_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."fn_trust_deposit"("_organization_id" "uuid", "_case_id" "uuid", "_amount" numeric, "_memo" "text") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  _entry_id UUID;
  _trust_cash_id UUID;
  _trust_liability_id UUID;
BEGIN
  SELECT id INTO _trust_cash_id FROM public.accounts 
  WHERE organization_id = _organization_id AND name ILIKE '%trust%cash%' AND type = 'asset' LIMIT 1;
  
  SELECT id INTO _trust_liability_id FROM public.accounts 
  WHERE organization_id = _organization_id AND name ILIKE '%client%trust%liability%' AND type = 'liability' LIMIT 1;
  
  IF _trust_cash_id IS NULL OR _trust_liability_id IS NULL THEN
    RAISE EXCEPTION 'Trust accounts not found';
  END IF;
  
  INSERT INTO public.journal_entries (organization_id, entry_date, case_id, created_by, memo)
  VALUES (_organization_id, CURRENT_DATE, _case_id, auth.uid(), _memo)
  RETURNING id INTO _entry_id;
  
  INSERT INTO public.journal_lines (entry_id, account_id, debit, credit) VALUES 
    (_entry_id, _trust_cash_id, _amount, 0),
    (_entry_id, _trust_liability_id, 0, _amount);
  
  RETURN _entry_id;
END;
$$;


ALTER FUNCTION "public"."fn_trust_deposit"("_organization_id" "uuid", "_case_id" "uuid", "_amount" numeric, "_memo" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."fn_trust_withdraw"("_organization_id" "uuid", "_case_id" "uuid", "_amount" numeric, "_memo" "text") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  _entry_id UUID;
  _trust_cash_id UUID;
  _trust_liability_id UUID;
  _current_balance NUMERIC;
BEGIN
  SELECT id INTO _trust_cash_id FROM public.accounts 
  WHERE organization_id = _organization_id AND name ILIKE '%trust%cash%' AND type = 'asset' LIMIT 1;
  
  SELECT id INTO _trust_liability_id FROM public.accounts 
  WHERE organization_id = _organization_id AND name ILIKE '%client%trust%liability%' AND type = 'liability' LIMIT 1;
  
  IF _trust_cash_id IS NULL OR _trust_liability_id IS NULL THEN
    RAISE EXCEPTION 'Trust accounts not found';
  END IF;
  
  -- Check current trust balance for case
  SELECT COALESCE(SUM(CASE WHEN jl.debit > 0 THEN -jl.debit ELSE jl.credit END), 0)
  INTO _current_balance
  FROM public.journal_lines jl
  JOIN public.journal_entries je ON je.id = jl.entry_id
  WHERE je.case_id = _case_id AND jl.account_id = _trust_liability_id;
  
  IF (_current_balance - _amount) < 0 THEN
    RAISE EXCEPTION 'Insufficient trust balance for case. Current: %, Requested: %', _current_balance, _amount;
  END IF;
  
  INSERT INTO public.journal_entries (organization_id, entry_date, case_id, created_by, memo)
  VALUES (_organization_id, CURRENT_DATE, _case_id, auth.uid(), _memo)
  RETURNING id INTO _entry_id;
  
  INSERT INTO public.journal_lines (entry_id, account_id, debit, credit) VALUES 
    (_entry_id, _trust_liability_id, _amount, 0),
    (_entry_id, _trust_cash_id, 0, _amount);
  
  RETURN _entry_id;
END;
$$;


ALTER FUNCTION "public"."fn_trust_withdraw"("_organization_id" "uuid", "_case_id" "uuid", "_amount" numeric, "_memo" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."has_role"("_user_id" "uuid", "_org_id" "uuid", "_role" "public"."app_role") RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND organization_id = _org_id
      AND role = _role
  )
$$;


ALTER FUNCTION "public"."has_role"("_user_id" "uuid", "_org_id" "uuid", "_role" "public"."app_role") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."refresh_kpis_daily"() RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
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


ALTER FUNCTION "public"."refresh_kpis_daily"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."user_organizations"("_user_id" "uuid") RETURNS SETOF "uuid"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  SELECT organization_id
  FROM public.org_members
  WHERE user_id = _user_id
$$;


ALTER FUNCTION "public"."user_organizations"("_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."validate_journal_balance"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  total_debit NUMERIC;
  total_credit NUMERIC;
BEGIN
  SELECT COALESCE(SUM(debit), 0), COALESCE(SUM(credit), 0)
  INTO total_debit, total_credit
  FROM public.journal_lines
  WHERE entry_id = COALESCE(NEW.entry_id, OLD.entry_id);
  
  IF total_debit != total_credit THEN
    RAISE EXCEPTION 'Journal entry must be balanced: debits (%) != credits (%)', total_debit, total_credit;
  END IF;
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."validate_journal_balance"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."account_templates" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "practice_area" "text" NOT NULL,
    "code" "text" NOT NULL,
    "name" "text" NOT NULL,
    "type" "public"."account_type" NOT NULL,
    "parent_code" "text",
    "description" "text",
    "is_default" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."account_templates" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."accounts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "organization_id" "uuid" NOT NULL,
    "code" "text" NOT NULL,
    "name" "text" NOT NULL,
    "type" "public"."account_type" NOT NULL,
    "currency" "text" DEFAULT 'USD'::"text" NOT NULL,
    "parent_id" "uuid",
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."accounts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ai_rules" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "organization_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "match_jsonb" "jsonb" NOT NULL,
    "action_jsonb" "jsonb" NOT NULL,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."ai_rules" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."ai_suggestions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "organization_id" "uuid" NOT NULL,
    "transaction_id" "text" NOT NULL,
    "suggested_account_id" "uuid",
    "confidence" numeric(3,2),
    "applied" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."ai_suggestions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bank_accounts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "organization_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "type" "text" NOT NULL,
    "institution" "text",
    "last4" "text",
    "account_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."bank_accounts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bank_feeds" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "organization_id" "uuid" NOT NULL,
    "bank_account_id" "uuid",
    "provider" "public"."bank_feed_provider" NOT NULL,
    "access_token" "text",
    "status" "text" DEFAULT 'active'::"text" NOT NULL,
    "last_sync" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."bank_feeds" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bank_transactions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "organization_id" "uuid" NOT NULL,
    "bank_account_id" "uuid",
    "date" "date" NOT NULL,
    "amount" numeric(15,2) NOT NULL,
    "description" "text",
    "external_id" "text",
    "matched_entry_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."bank_transactions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."case_accounts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "case_id" "uuid" NOT NULL,
    "trust_account_id" "uuid",
    "operating_account_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."case_accounts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."cases" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "organization_id" "uuid" NOT NULL,
    "case_no" "text" NOT NULL,
    "client_id" "uuid" NOT NULL,
    "status" "text" DEFAULT 'open'::"text" NOT NULL,
    "practice_area" "text",
    "opened_on" "date" DEFAULT CURRENT_DATE NOT NULL,
    "settled_on" "date",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."cases" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."checks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "organization_id" "uuid" NOT NULL,
    "bank_account_id" "uuid",
    "payee" "text" NOT NULL,
    "amount" numeric(15,2) NOT NULL,
    "date" "date" NOT NULL,
    "number" "text",
    "memo" "text",
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "attachment_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."checks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."clients" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "organization_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "email" "text",
    "phone" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."clients" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."disbursement_template_lines" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "template_id" "uuid" NOT NULL,
    "label" "text" NOT NULL,
    "pct" numeric(5,2),
    "fixed_amount" numeric(15,2),
    "account_id" "uuid",
    "item_type" "public"."settlement_item_type" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."disbursement_template_lines" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."disbursement_templates" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "organization_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."disbursement_templates" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."expenses" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "organization_id" "uuid" NOT NULL,
    "case_id" "uuid",
    "vendor_id" "uuid",
    "date" "date" NOT NULL,
    "amount" numeric(15,2) NOT NULL,
    "category" "text",
    "memo" "text",
    "reimbursable" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."expenses" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."field_mappings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "filevine_field" "text" NOT NULL,
    "nuledger_field" "text" NOT NULL,
    "mapping_status" "text" DEFAULT 'unmapped'::"text" NOT NULL,
    "data_type" "text" DEFAULT 'text'::"text" NOT NULL,
    "is_required" boolean DEFAULT false NOT NULL,
    "transformation_rule" "text",
    "preset_name" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "field_mappings_data_type_check" CHECK (("data_type" = ANY (ARRAY['text'::"text", 'number'::"text", 'date'::"text", 'boolean'::"text", 'json'::"text"]))),
    CONSTRAINT "field_mappings_mapping_status_check" CHECK (("mapping_status" = ANY (ARRAY['mapped'::"text", 'manual_required'::"text", 'unmapped'::"text"])))
);


ALTER TABLE "public"."field_mappings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."import_maps" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "organization_id" "uuid" NOT NULL,
    "source" "text" NOT NULL,
    "column_map" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."import_maps" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."imports" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "organization_id" "uuid" NOT NULL,
    "source" "text" NOT NULL,
    "file_url" "text",
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "log" "text",
    "records_total" integer DEFAULT 0,
    "records_success" integer DEFAULT 0,
    "records_failed" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid"
);


ALTER TABLE "public"."imports" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."journal_entries" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "organization_id" "uuid" NOT NULL,
    "entry_date" "date" NOT NULL,
    "memo" "text",
    "created_by" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "case_id" "uuid"
);


ALTER TABLE "public"."journal_entries" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."journal_lines" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "entry_id" "uuid" NOT NULL,
    "account_id" "uuid" NOT NULL,
    "debit" numeric(15,2) DEFAULT 0 NOT NULL,
    "credit" numeric(15,2) DEFAULT 0 NOT NULL,
    CONSTRAINT "journal_lines_check" CHECK ((("debit" = (0)::numeric) OR ("credit" = (0)::numeric))),
    CONSTRAINT "journal_lines_credit_check" CHECK (("credit" >= (0)::numeric)),
    CONSTRAINT "journal_lines_debit_check" CHECK (("debit" >= (0)::numeric))
);


ALTER TABLE "public"."journal_lines" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."kpis_daily" (
    "organization_id" "uuid" NOT NULL,
    "date" "date" NOT NULL,
    "cases_open" bigint DEFAULT 0 NOT NULL,
    "trust_balance" numeric(15,2) DEFAULT 0 NOT NULL,
    "op_balance" numeric(15,2) DEFAULT 0 NOT NULL,
    "ar" numeric(15,2) DEFAULT 0 NOT NULL,
    "ap" numeric(15,2) DEFAULT 0 NOT NULL,
    "settled_this_month" numeric(15,2) DEFAULT 0 NOT NULL,
    "write_offs" numeric(15,2) DEFAULT 0 NOT NULL,
    "utilization" numeric(2,2) DEFAULT 0 NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."kpis_daily" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."migration_jobs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "job_type" "text" NOT NULL,
    "data_categories" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "date_range_start" "date",
    "date_range_end" "date",
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "records_total" integer DEFAULT 0,
    "records_success" integer DEFAULT 0,
    "records_skipped" integer DEFAULT 0,
    "records_failed" integer DEFAULT 0,
    "error_logs" "jsonb" DEFAULT '[]'::"jsonb",
    "skip_reasons" "jsonb" DEFAULT '{}'::"jsonb",
    "started_at" timestamp with time zone DEFAULT "now"(),
    "completed_at" timestamp with time zone,
    "created_by" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "migration_jobs_job_type_check" CHECK (("job_type" = ANY (ARRAY['initial_import'::"text", 'ongoing_sync'::"text", 'manual_sync'::"text"]))),
    CONSTRAINT "migration_jobs_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'running'::"text", 'success'::"text", 'failed'::"text", 'partial'::"text"])))
);


ALTER TABLE "public"."migration_jobs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."migration_records" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "migration_job_id" "uuid" NOT NULL,
    "filevine_id" "text" NOT NULL,
    "nuledger_id" "text",
    "record_type" "text" NOT NULL,
    "source_data" "jsonb" NOT NULL,
    "transformed_data" "jsonb",
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "error_message" "text",
    "skip_reason" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "migration_records_record_type_check" CHECK (("record_type" = ANY (ARRAY['case'::"text", 'settlement'::"text", 'client'::"text", 'invoice'::"text", 'contact'::"text"]))),
    CONSTRAINT "migration_records_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'success'::"text", 'failed'::"text", 'skipped'::"text"])))
);


ALTER TABLE "public"."migration_records" OWNER TO "postgres";


CREATE MATERIALIZED VIEW "public"."mv_case_cycle" AS
 SELECT "cases"."organization_id",
    "cases"."practice_area",
    "count"(*) AS "case_count",
    "avg"(
        CASE
            WHEN ("cases"."settled_on" IS NOT NULL) THEN ("cases"."settled_on" - "cases"."opened_on")
            ELSE NULL::integer
        END) AS "avg_open_to_settle_days",
    "min"(
        CASE
            WHEN ("cases"."settled_on" IS NOT NULL) THEN ("cases"."settled_on" - "cases"."opened_on")
            ELSE NULL::integer
        END) AS "min_days",
    "max"(
        CASE
            WHEN ("cases"."settled_on" IS NOT NULL) THEN ("cases"."settled_on" - "cases"."opened_on")
            ELSE NULL::integer
        END) AS "max_days",
    "percentile_cont"((0.5)::double precision) WITHIN GROUP (ORDER BY ((
        CASE
            WHEN ("cases"."settled_on" IS NOT NULL) THEN ("cases"."settled_on" - "cases"."opened_on")
            ELSE NULL::integer
        END)::double precision)) AS "median_days"
   FROM "public"."cases"
  WHERE ("cases"."settled_on" IS NOT NULL)
  GROUP BY "cases"."organization_id", "cases"."practice_area"
  WITH NO DATA;


ALTER TABLE "public"."mv_case_cycle" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."settlements" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "organization_id" "uuid" NOT NULL,
    "case_id" "uuid" NOT NULL,
    "gross_amount" numeric(15,2) NOT NULL,
    "received_date" "date",
    "fee_pct" numeric(5,2),
    "fee_amount" numeric(15,2),
    "liens_total" numeric(15,2) DEFAULT 0,
    "client_net" numeric(15,2),
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."settlements" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."time_entries" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "organization_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "case_id" "uuid",
    "date" "date" NOT NULL,
    "hours" numeric(5,2) NOT NULL,
    "rate" numeric(10,2),
    "billable" boolean DEFAULT true,
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."time_entries" OWNER TO "postgres";


CREATE MATERIALIZED VIEW "public"."mv_case_profitability" AS
 SELECT "c"."organization_id",
    "c"."id" AS "case_id",
    "c"."case_no",
    "date_trunc"('month'::"text", ("c"."opened_on")::timestamp with time zone) AS "period",
    COALESCE("s"."gross_amount", (0)::numeric) AS "revenue",
    COALESCE("sum"("e"."amount"), (0)::numeric) AS "expenses",
    COALESCE("sum"(("te"."hours" * "te"."rate")), (0)::numeric) AS "time_cost",
    ((COALESCE("s"."gross_amount", (0)::numeric) - COALESCE("sum"("e"."amount"), (0)::numeric)) - COALESCE("sum"(("te"."hours" * "te"."rate")), (0)::numeric)) AS "net_profit"
   FROM ((("public"."cases" "c"
     LEFT JOIN "public"."settlements" "s" ON ((("s"."case_id" = "c"."id") AND ("s"."status" = 'posted'::"text"))))
     LEFT JOIN "public"."expenses" "e" ON (("e"."case_id" = "c"."id")))
     LEFT JOIN "public"."time_entries" "te" ON (("te"."case_id" = "c"."id")))
  GROUP BY "c"."organization_id", "c"."id", "c"."case_no", ("date_trunc"('month'::"text", ("c"."opened_on")::timestamp with time zone)), "s"."gross_amount"
  WITH NO DATA;


ALTER TABLE "public"."mv_case_profitability" OWNER TO "postgres";


CREATE MATERIALIZED VIEW "public"."mv_gl_detail" AS
 SELECT "a"."organization_id",
    "a"."id" AS "account_id",
    "a"."code",
    "a"."name",
    "date_trunc"('month'::"text", ("je"."entry_date")::timestamp with time zone) AS "period",
    "count"("jl"."id") AS "transaction_count",
    COALESCE("sum"("jl"."debit"), (0)::numeric) AS "total_debits",
    COALESCE("sum"("jl"."credit"), (0)::numeric) AS "total_credits",
    COALESCE("sum"(("jl"."debit" - "jl"."credit")), (0)::numeric) AS "net_change"
   FROM (("public"."accounts" "a"
     LEFT JOIN "public"."journal_lines" "jl" ON (("jl"."account_id" = "a"."id")))
     LEFT JOIN "public"."journal_entries" "je" ON (("je"."id" = "jl"."entry_id")))
  WHERE ("je"."entry_date" >= ("date_trunc"('year'::"text", (CURRENT_DATE)::timestamp with time zone) - '2 years'::interval))
  GROUP BY "a"."organization_id", "a"."id", "a"."code", "a"."name", ("date_trunc"('month'::"text", ("je"."entry_date")::timestamp with time zone))
  WITH NO DATA;


ALTER TABLE "public"."mv_gl_detail" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."organizations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."organizations" OWNER TO "postgres";


CREATE MATERIALIZED VIEW "public"."mv_kpis_daily" AS
 SELECT "o"."id" AS "organization_id",
    CURRENT_DATE AS "date",
    (0)::bigint AS "cases_open",
    (0)::numeric(15,2) AS "trust_balance",
    (0)::numeric(15,2) AS "op_balance",
    (0)::numeric(15,2) AS "ar",
    (0)::numeric(15,2) AS "ap",
    (0)::numeric(15,2) AS "settled_this_month",
    (0)::numeric(15,2) AS "write_offs",
    (0)::numeric(2,2) AS "utilization"
   FROM "public"."organizations" "o"
  WITH NO DATA;


ALTER TABLE "public"."mv_kpis_daily" OWNER TO "postgres";


CREATE MATERIALIZED VIEW "public"."mv_liens_recovery_rate" AS
 SELECT "s"."organization_id",
    "c"."practice_area",
    "count"(*) AS "case_count",
    "avg"(
        CASE
            WHEN ("s"."gross_amount" > (0)::numeric) THEN ("s"."liens_total" / "s"."gross_amount")
            ELSE (0)::numeric
        END) AS "avg_lien_ratio",
    "sum"("s"."liens_total") AS "total_liens",
    "sum"("s"."gross_amount") AS "total_settlements"
   FROM ("public"."settlements" "s"
     JOIN "public"."cases" "c" ON (("c"."id" = "s"."case_id")))
  WHERE ("s"."status" = 'posted'::"text")
  GROUP BY "s"."organization_id", "c"."practice_area"
  WITH NO DATA;


ALTER TABLE "public"."mv_liens_recovery_rate" OWNER TO "postgres";


CREATE MATERIALIZED VIEW "public"."mv_perf_weekly" AS
 SELECT "time_entries"."organization_id",
    "date_trunc"('week'::"text", ("time_entries"."date")::timestamp with time zone) AS "week_start",
    "count"(DISTINCT "time_entries"."case_id") AS "active_cases",
    "sum"("time_entries"."hours") AS "total_hours",
    "sum"(
        CASE
            WHEN "time_entries"."billable" THEN "time_entries"."hours"
            ELSE (0)::numeric
        END) AS "billable_hours",
    "sum"(("time_entries"."hours" * "time_entries"."rate")) AS "total_revenue",
    "avg"(
        CASE
            WHEN "time_entries"."billable" THEN "time_entries"."rate"
            ELSE NULL::numeric
        END) AS "avg_billable_rate"
   FROM "public"."time_entries"
  GROUP BY "time_entries"."organization_id", ("date_trunc"('week'::"text", ("time_entries"."date")::timestamp with time zone))
  WITH NO DATA;


ALTER TABLE "public"."mv_perf_weekly" OWNER TO "postgres";


CREATE MATERIALIZED VIEW "public"."mv_referral_roi" AS
 SELECT "c"."organization_id",
    'Direct'::"text" AS "referral_source",
    "count"(*) AS "cases_count",
    "sum"(COALESCE("s"."gross_amount", (0)::numeric)) AS "total_revenue",
    "avg"(COALESCE("s"."gross_amount", (0)::numeric)) AS "avg_revenue_per_case"
   FROM ("public"."cases" "c"
     LEFT JOIN "public"."settlements" "s" ON ((("s"."case_id" = "c"."id") AND ("s"."status" = 'posted'::"text"))))
  WHERE (1 = 0)
  GROUP BY "c"."organization_id"
  WITH NO DATA;


ALTER TABLE "public"."mv_referral_roi" OWNER TO "postgres";


CREATE MATERIALIZED VIEW "public"."mv_settlement_distribution" AS
 SELECT "s"."organization_id",
    "date_trunc"('quarter'::"text", ("s"."received_date")::timestamp with time zone) AS "quarter",
    "c"."practice_area",
    "count"(*) AS "settlement_count",
    "avg"("s"."gross_amount") AS "avg_gross",
    "avg"("s"."fee_amount") AS "avg_fee",
    "avg"("s"."liens_total") AS "avg_liens",
    "avg"("s"."client_net") AS "avg_client_net",
    "sum"("s"."gross_amount") AS "total_gross",
    "sum"("s"."fee_amount") AS "total_fees",
    "sum"("s"."client_net") AS "total_client_net"
   FROM ("public"."settlements" "s"
     JOIN "public"."cases" "c" ON (("c"."id" = "s"."case_id")))
  WHERE ("s"."status" = 'posted'::"text")
  GROUP BY "s"."organization_id", ("date_trunc"('quarter'::"text", ("s"."received_date")::timestamp with time zone)), "c"."practice_area"
  WITH NO DATA;


ALTER TABLE "public"."mv_settlement_distribution" OWNER TO "postgres";


CREATE MATERIALIZED VIEW "public"."mv_trial_balance" AS
 SELECT "a"."organization_id",
    CURRENT_DATE AS "as_of",
    "a"."id" AS "account_id",
    "a"."code",
    "a"."name",
    "a"."type",
    COALESCE("sum"(
        CASE
            WHEN ("jl"."debit" > (0)::numeric) THEN "jl"."debit"
            ELSE (- "jl"."credit")
        END), (0)::numeric) AS "balance"
   FROM (("public"."accounts" "a"
     LEFT JOIN "public"."journal_lines" "jl" ON (("jl"."account_id" = "a"."id")))
     LEFT JOIN "public"."journal_entries" "je" ON (("je"."id" = "jl"."entry_id")))
  WHERE ("a"."is_active" = true)
  GROUP BY "a"."organization_id", "a"."id", "a"."code", "a"."name", "a"."type"
  WITH NO DATA;


ALTER TABLE "public"."mv_trial_balance" OWNER TO "postgres";


CREATE MATERIALIZED VIEW "public"."mv_trust_three_way" AS
 SELECT "o"."id" AS "organization_id",
    COALESCE(( SELECT "sum"(
                CASE
                    WHEN ("jl"."debit" > (0)::numeric) THEN "jl"."debit"
                    ELSE (- "jl"."credit")
                END) AS "sum"
           FROM (("public"."journal_lines" "jl"
             JOIN "public"."journal_entries" "je" ON (("je"."id" = "jl"."entry_id")))
             JOIN "public"."accounts" "a" ON (("a"."id" = "jl"."account_id")))
          WHERE (("je"."organization_id" = "o"."id") AND ("a"."type" = 'asset'::"public"."account_type") AND ("a"."name" ~~* '%trust%cash%'::"text"))), (0)::numeric) AS "bank_balance",
    COALESCE(( SELECT "sum"(
                CASE
                    WHEN ("jl"."credit" > (0)::numeric) THEN "jl"."credit"
                    ELSE (- "jl"."debit")
                END) AS "sum"
           FROM (("public"."journal_lines" "jl"
             JOIN "public"."journal_entries" "je" ON (("je"."id" = "jl"."entry_id")))
             JOIN "public"."accounts" "a" ON (("a"."id" = "jl"."account_id")))
          WHERE (("je"."organization_id" = "o"."id") AND ("a"."type" = 'liability'::"public"."account_type") AND ("a"."name" ~~* '%client%trust%'::"text"))), (0)::numeric) AS "client_ledger_total",
    COALESCE(( SELECT "sum"(
                CASE
                    WHEN ("jl"."credit" > (0)::numeric) THEN "jl"."credit"
                    ELSE (- "jl"."debit")
                END) AS "sum"
           FROM (("public"."journal_lines" "jl"
             JOIN "public"."journal_entries" "je" ON (("je"."id" = "jl"."entry_id")))
             JOIN "public"."accounts" "a" ON (("a"."id" = "jl"."account_id")))
          WHERE (("je"."organization_id" = "o"."id") AND ("a"."type" = 'liability'::"public"."account_type") AND ("a"."name" ~~* '%trust%liability%'::"text"))), (0)::numeric) AS "control_account",
    CURRENT_DATE AS "as_of"
   FROM "public"."organizations" "o"
  WITH NO DATA;


ALTER TABLE "public"."mv_trust_three_way" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."org_members" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "organization_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."org_members" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."preferences" (
    "organization_id" "uuid" NOT NULL,
    "fiscal_start_month" integer DEFAULT 1 NOT NULL,
    "currency" "text" DEFAULT 'USD'::"text" NOT NULL,
    "timezone" "text" DEFAULT 'America/New_York'::"text" NOT NULL,
    "number_format" "text" DEFAULT 'en-US'::"text" NOT NULL,
    "case_prefix" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "preferences_fiscal_start_month_check" CHECK ((("fiscal_start_month" >= 1) AND ("fiscal_start_month" <= 12)))
);


ALTER TABLE "public"."preferences" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."reconciliations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "organization_id" "uuid" NOT NULL,
    "bank_account_id" "uuid",
    "statement_start" "date" NOT NULL,
    "statement_end" "date" NOT NULL,
    "ending_balance" numeric(15,2) NOT NULL,
    "status" "text" DEFAULT 'in_progress'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."reconciliations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."settlement_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "settlement_id" "uuid" NOT NULL,
    "type" "public"."settlement_item_type" NOT NULL,
    "label" "text" NOT NULL,
    "amount" numeric(15,2) NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."settlement_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sync_config" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "auto_sync_enabled" boolean DEFAULT false NOT NULL,
    "sync_frequency" "text" DEFAULT 'daily'::"text" NOT NULL,
    "filevine_org_id" "text",
    "filevine_user_id" "text",
    "last_sync_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "sync_config_sync_frequency_check" CHECK (("sync_frequency" = ANY (ARRAY['hourly'::"text", 'daily'::"text", 'weekly'::"text"])))
);


ALTER TABLE "public"."sync_config" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."test_runs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "scenario_id" "uuid" NOT NULL,
    "executed_by" "uuid" NOT NULL,
    "started_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "completed_at" timestamp with time zone,
    "passed" boolean,
    "log" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."test_runs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."test_scenarios" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "organization_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "seed_jsonb" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."test_scenarios" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."trust_checks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "organization_id" "uuid" NOT NULL,
    "case_id" "uuid",
    "payee" "text" NOT NULL,
    "date" "date" NOT NULL,
    "amount" numeric(15,2) NOT NULL,
    "check_no" "text",
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "memo" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."trust_checks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_roles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "organization_id" "uuid" NOT NULL,
    "role" "public"."app_role" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."user_roles" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."v_case_costs" AS
 SELECT "c"."id" AS "case_id",
    "c"."organization_id",
    "c"."case_no",
    COALESCE("sum"("e"."amount"), (0)::numeric) AS "total_expenses",
    COALESCE("sum"(("te"."hours" * "te"."rate")), (0)::numeric) AS "total_time_cost",
    (COALESCE("sum"("e"."amount"), (0)::numeric) + COALESCE("sum"(("te"."hours" * "te"."rate")), (0)::numeric)) AS "total_cost"
   FROM (("public"."cases" "c"
     LEFT JOIN "public"."expenses" "e" ON (("e"."case_id" = "c"."id")))
     LEFT JOIN "public"."time_entries" "te" ON (("te"."case_id" = "c"."id")))
  GROUP BY "c"."id", "c"."organization_id", "c"."case_no";


ALTER TABLE "public"."v_case_costs" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."v_realization" AS
 SELECT "te"."organization_id",
    "te"."case_id",
    "sum"(("te"."hours" * "te"."rate")) AS "billed_amount",
    COALESCE("s"."gross_amount", (0)::numeric) AS "collected_amount",
        CASE
            WHEN ("sum"(("te"."hours" * "te"."rate")) > (0)::numeric) THEN (COALESCE("s"."gross_amount", (0)::numeric) / "sum"(("te"."hours" * "te"."rate")))
            ELSE (0)::numeric
        END AS "realization_rate"
   FROM (("public"."time_entries" "te"
     LEFT JOIN "public"."cases" "c" ON (("c"."id" = "te"."case_id")))
     LEFT JOIN "public"."settlements" "s" ON (("s"."case_id" = "c"."id")))
  WHERE ("te"."billable" = true)
  GROUP BY "te"."organization_id", "te"."case_id", "s"."gross_amount";


ALTER TABLE "public"."v_realization" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."v_uncleared_entries" AS
 SELECT "je"."id",
    "je"."organization_id",
    "je"."entry_date",
    "je"."memo",
    "je"."created_by",
    "je"."created_at",
    "je"."updated_at",
    "je"."case_id",
    "jl"."debit",
    "jl"."credit"
   FROM ("public"."journal_entries" "je"
     JOIN "public"."journal_lines" "jl" ON (("jl"."entry_id" = "je"."id")))
  WHERE (NOT (EXISTS ( SELECT 1
           FROM "public"."bank_transactions" "bt"
          WHERE ("bt"."matched_entry_id" = "je"."id"))));


ALTER TABLE "public"."v_uncleared_entries" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."v_unmatched_bank" AS
 SELECT "bt"."id",
    "bt"."organization_id",
    "bt"."bank_account_id",
    "bt"."date",
    "bt"."amount",
    "bt"."description",
    "bt"."external_id",
    "bt"."matched_entry_id",
    "bt"."created_at",
    "ba"."name" AS "bank_account_name"
   FROM ("public"."bank_transactions" "bt"
     JOIN "public"."bank_accounts" "ba" ON (("ba"."id" = "bt"."bank_account_id")))
  WHERE ("bt"."matched_entry_id" IS NULL);


ALTER TABLE "public"."v_unmatched_bank" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."v_utilization" AS
 SELECT "te"."organization_id",
    "te"."user_id",
    "date_trunc"('week'::"text", ("te"."date")::timestamp with time zone) AS "week_start",
    "sum"("te"."hours") AS "total_hours",
    "sum"(
        CASE
            WHEN "te"."billable" THEN "te"."hours"
            ELSE (0)::numeric
        END) AS "billable_hours",
        CASE
            WHEN ("sum"("te"."hours") > (0)::numeric) THEN ("sum"(
            CASE
                WHEN "te"."billable" THEN "te"."hours"
                ELSE (0)::numeric
            END) / "sum"("te"."hours"))
            ELSE (0)::numeric
        END AS "utilization_rate"
   FROM "public"."time_entries" "te"
  GROUP BY "te"."organization_id", "te"."user_id", ("date_trunc"('week'::"text", ("te"."date")::timestamp with time zone));


ALTER TABLE "public"."v_utilization" OWNER TO "postgres";


ALTER TABLE ONLY "public"."account_templates"
    ADD CONSTRAINT "account_templates_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."accounts"
    ADD CONSTRAINT "accounts_organization_id_code_key" UNIQUE ("organization_id", "code");



ALTER TABLE ONLY "public"."accounts"
    ADD CONSTRAINT "accounts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ai_rules"
    ADD CONSTRAINT "ai_rules_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ai_suggestions"
    ADD CONSTRAINT "ai_suggestions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bank_accounts"
    ADD CONSTRAINT "bank_accounts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bank_feeds"
    ADD CONSTRAINT "bank_feeds_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bank_transactions"
    ADD CONSTRAINT "bank_transactions_bank_account_id_external_id_key" UNIQUE ("bank_account_id", "external_id");



ALTER TABLE ONLY "public"."bank_transactions"
    ADD CONSTRAINT "bank_transactions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."case_accounts"
    ADD CONSTRAINT "case_accounts_case_id_key" UNIQUE ("case_id");



ALTER TABLE ONLY "public"."case_accounts"
    ADD CONSTRAINT "case_accounts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."cases"
    ADD CONSTRAINT "cases_organization_id_case_no_key" UNIQUE ("organization_id", "case_no");



ALTER TABLE ONLY "public"."cases"
    ADD CONSTRAINT "cases_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."checks"
    ADD CONSTRAINT "checks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."clients"
    ADD CONSTRAINT "clients_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."disbursement_template_lines"
    ADD CONSTRAINT "disbursement_template_lines_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."disbursement_templates"
    ADD CONSTRAINT "disbursement_templates_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."expenses"
    ADD CONSTRAINT "expenses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."field_mappings"
    ADD CONSTRAINT "field_mappings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."import_maps"
    ADD CONSTRAINT "import_maps_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."imports"
    ADD CONSTRAINT "imports_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."journal_entries"
    ADD CONSTRAINT "journal_entries_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."journal_lines"
    ADD CONSTRAINT "journal_lines_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."kpis_daily"
    ADD CONSTRAINT "kpis_daily_pkey" PRIMARY KEY ("organization_id", "date");



ALTER TABLE ONLY "public"."migration_jobs"
    ADD CONSTRAINT "migration_jobs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."migration_records"
    ADD CONSTRAINT "migration_records_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."org_members"
    ADD CONSTRAINT "org_members_organization_id_user_id_key" UNIQUE ("organization_id", "user_id");



ALTER TABLE ONLY "public"."org_members"
    ADD CONSTRAINT "org_members_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."organizations"
    ADD CONSTRAINT "organizations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."organizations"
    ADD CONSTRAINT "organizations_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."preferences"
    ADD CONSTRAINT "preferences_pkey" PRIMARY KEY ("organization_id");



ALTER TABLE ONLY "public"."reconciliations"
    ADD CONSTRAINT "reconciliations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."settlement_items"
    ADD CONSTRAINT "settlement_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."settlements"
    ADD CONSTRAINT "settlements_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sync_config"
    ADD CONSTRAINT "sync_config_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."test_runs"
    ADD CONSTRAINT "test_runs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."test_scenarios"
    ADD CONSTRAINT "test_scenarios_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."time_entries"
    ADD CONSTRAINT "time_entries_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."trust_checks"
    ADD CONSTRAINT "trust_checks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_user_id_organization_id_role_key" UNIQUE ("user_id", "organization_id", "role");



CREATE INDEX "idx_ai_rules_organization" ON "public"."ai_rules" USING "btree" ("organization_id");



CREATE INDEX "idx_ai_suggestions_organization" ON "public"."ai_suggestions" USING "btree" ("organization_id");



CREATE INDEX "idx_ai_suggestions_transaction" ON "public"."ai_suggestions" USING "btree" ("transaction_id");



CREATE INDEX "idx_bank_accounts_organization" ON "public"."bank_accounts" USING "btree" ("organization_id");



CREATE INDEX "idx_bank_feeds_organization" ON "public"."bank_feeds" USING "btree" ("organization_id");



CREATE INDEX "idx_bank_transactions_bank_account" ON "public"."bank_transactions" USING "btree" ("bank_account_id");



CREATE INDEX "idx_bank_transactions_external_id" ON "public"."bank_transactions" USING "btree" ("external_id");



CREATE INDEX "idx_bank_transactions_organization" ON "public"."bank_transactions" USING "btree" ("organization_id");



CREATE INDEX "idx_cases_client" ON "public"."cases" USING "btree" ("client_id");



CREATE INDEX "idx_cases_organization" ON "public"."cases" USING "btree" ("organization_id");



CREATE INDEX "idx_cases_status" ON "public"."cases" USING "btree" ("status");



CREATE INDEX "idx_checks_bank_account" ON "public"."checks" USING "btree" ("bank_account_id");



CREATE INDEX "idx_checks_organization" ON "public"."checks" USING "btree" ("organization_id");



CREATE INDEX "idx_checks_status" ON "public"."checks" USING "btree" ("status");



CREATE INDEX "idx_clients_organization" ON "public"."clients" USING "btree" ("organization_id");



CREATE INDEX "idx_disbursement_template_lines_template" ON "public"."disbursement_template_lines" USING "btree" ("template_id");



CREATE INDEX "idx_disbursement_templates_org" ON "public"."disbursement_templates" USING "btree" ("organization_id");



CREATE INDEX "idx_expenses_case" ON "public"."expenses" USING "btree" ("case_id");



CREATE INDEX "idx_expenses_date" ON "public"."expenses" USING "btree" ("date");



CREATE INDEX "idx_expenses_organization" ON "public"."expenses" USING "btree" ("organization_id");



CREATE INDEX "idx_field_mappings_preset" ON "public"."field_mappings" USING "btree" ("preset_name");



CREATE INDEX "idx_journal_entries_case" ON "public"."journal_entries" USING "btree" ("case_id");



CREATE INDEX "idx_kpis_daily_date" ON "public"."kpis_daily" USING "btree" ("date" DESC);



CREATE INDEX "idx_migration_jobs_created" ON "public"."migration_jobs" USING "btree" ("created_at");



CREATE INDEX "idx_migration_jobs_status" ON "public"."migration_jobs" USING "btree" ("status");



CREATE INDEX "idx_migration_records_job" ON "public"."migration_records" USING "btree" ("migration_job_id");



CREATE INDEX "idx_migration_records_status" ON "public"."migration_records" USING "btree" ("status");



CREATE INDEX "idx_migration_records_type" ON "public"."migration_records" USING "btree" ("record_type");



CREATE UNIQUE INDEX "idx_mv_case_cycle" ON "public"."mv_case_cycle" USING "btree" ("organization_id", "practice_area");



CREATE UNIQUE INDEX "idx_mv_case_profitability" ON "public"."mv_case_profitability" USING "btree" ("organization_id", "case_id", "period");



CREATE UNIQUE INDEX "idx_mv_gl_detail" ON "public"."mv_gl_detail" USING "btree" ("organization_id", "account_id", "period");



CREATE INDEX "idx_mv_kpis_daily_date" ON "public"."mv_kpis_daily" USING "btree" ("date" DESC);



CREATE UNIQUE INDEX "idx_mv_kpis_daily_org_date" ON "public"."mv_kpis_daily" USING "btree" ("organization_id", "date");



CREATE UNIQUE INDEX "idx_mv_liens_recovery" ON "public"."mv_liens_recovery_rate" USING "btree" ("organization_id", "practice_area");



CREATE UNIQUE INDEX "idx_mv_referral_roi" ON "public"."mv_referral_roi" USING "btree" ("organization_id", "referral_source");



CREATE UNIQUE INDEX "idx_mv_settlement_dist" ON "public"."mv_settlement_distribution" USING "btree" ("organization_id", "quarter", "practice_area");



CREATE UNIQUE INDEX "idx_mv_trial_balance" ON "public"."mv_trial_balance" USING "btree" ("organization_id", "account_id");



CREATE UNIQUE INDEX "idx_mv_trust_three_way" ON "public"."mv_trust_three_way" USING "btree" ("organization_id");



CREATE UNIQUE INDEX "idx_perf_weekly_org_week" ON "public"."mv_perf_weekly" USING "btree" ("organization_id", "week_start");



CREATE INDEX "idx_reconciliations_bank_account" ON "public"."reconciliations" USING "btree" ("bank_account_id");



CREATE INDEX "idx_reconciliations_organization" ON "public"."reconciliations" USING "btree" ("organization_id");



CREATE INDEX "idx_settlement_items_settlement" ON "public"."settlement_items" USING "btree" ("settlement_id");



CREATE INDEX "idx_settlements_case" ON "public"."settlements" USING "btree" ("case_id");



CREATE INDEX "idx_settlements_organization" ON "public"."settlements" USING "btree" ("organization_id");



CREATE INDEX "idx_settlements_status" ON "public"."settlements" USING "btree" ("status");



CREATE INDEX "idx_time_entries_case" ON "public"."time_entries" USING "btree" ("case_id");



CREATE INDEX "idx_time_entries_date" ON "public"."time_entries" USING "btree" ("date");



CREATE INDEX "idx_time_entries_organization" ON "public"."time_entries" USING "btree" ("organization_id");



CREATE INDEX "idx_time_entries_user" ON "public"."time_entries" USING "btree" ("user_id");



CREATE INDEX "idx_trust_checks_case" ON "public"."trust_checks" USING "btree" ("case_id");



CREATE INDEX "idx_trust_checks_organization" ON "public"."trust_checks" USING "btree" ("organization_id");



CREATE INDEX "idx_trust_checks_status" ON "public"."trust_checks" USING "btree" ("status");



CREATE OR REPLACE TRIGGER "update_accounts_updated_at" BEFORE UPDATE ON "public"."accounts" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_ai_rules_updated_at" BEFORE UPDATE ON "public"."ai_rules" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_bank_accounts_updated_at" BEFORE UPDATE ON "public"."bank_accounts" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_bank_feeds_updated_at" BEFORE UPDATE ON "public"."bank_feeds" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_cases_updated_at" BEFORE UPDATE ON "public"."cases" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_checks_updated_at" BEFORE UPDATE ON "public"."checks" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_clients_updated_at" BEFORE UPDATE ON "public"."clients" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_disbursement_templates_updated_at" BEFORE UPDATE ON "public"."disbursement_templates" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_expenses_updated_at" BEFORE UPDATE ON "public"."expenses" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_field_mappings_updated_at" BEFORE UPDATE ON "public"."field_mappings" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_import_maps_updated_at" BEFORE UPDATE ON "public"."import_maps" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_imports_updated_at" BEFORE UPDATE ON "public"."imports" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_journal_entries_updated_at" BEFORE UPDATE ON "public"."journal_entries" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_migration_records_updated_at" BEFORE UPDATE ON "public"."migration_records" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_organizations_updated_at" BEFORE UPDATE ON "public"."organizations" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_preferences_updated_at" BEFORE UPDATE ON "public"."preferences" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_reconciliations_updated_at" BEFORE UPDATE ON "public"."reconciliations" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_settlements_updated_at" BEFORE UPDATE ON "public"."settlements" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_sync_config_updated_at" BEFORE UPDATE ON "public"."sync_config" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_test_scenarios_updated_at" BEFORE UPDATE ON "public"."test_scenarios" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_time_entries_updated_at" BEFORE UPDATE ON "public"."time_entries" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_trust_checks_updated_at" BEFORE UPDATE ON "public"."trust_checks" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE CONSTRAINT TRIGGER "validate_journal_balance_trigger" AFTER INSERT OR DELETE OR UPDATE ON "public"."journal_lines" DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION "public"."validate_journal_balance"();



ALTER TABLE ONLY "public"."accounts"
    ADD CONSTRAINT "accounts_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."accounts"
    ADD CONSTRAINT "accounts_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."accounts"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."ai_rules"
    ADD CONSTRAINT "ai_rules_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."ai_suggestions"
    ADD CONSTRAINT "ai_suggestions_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."ai_suggestions"
    ADD CONSTRAINT "ai_suggestions_suggested_account_id_fkey" FOREIGN KEY ("suggested_account_id") REFERENCES "public"."accounts"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."bank_accounts"
    ADD CONSTRAINT "bank_accounts_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."bank_accounts"
    ADD CONSTRAINT "bank_accounts_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bank_feeds"
    ADD CONSTRAINT "bank_feeds_bank_account_id_fkey" FOREIGN KEY ("bank_account_id") REFERENCES "public"."bank_accounts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bank_feeds"
    ADD CONSTRAINT "bank_feeds_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bank_transactions"
    ADD CONSTRAINT "bank_transactions_bank_account_id_fkey" FOREIGN KEY ("bank_account_id") REFERENCES "public"."bank_accounts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bank_transactions"
    ADD CONSTRAINT "bank_transactions_matched_entry_id_fkey" FOREIGN KEY ("matched_entry_id") REFERENCES "public"."journal_entries"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."bank_transactions"
    ADD CONSTRAINT "bank_transactions_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."case_accounts"
    ADD CONSTRAINT "case_accounts_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "public"."cases"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."case_accounts"
    ADD CONSTRAINT "case_accounts_operating_account_id_fkey" FOREIGN KEY ("operating_account_id") REFERENCES "public"."accounts"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."case_accounts"
    ADD CONSTRAINT "case_accounts_trust_account_id_fkey" FOREIGN KEY ("trust_account_id") REFERENCES "public"."accounts"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."cases"
    ADD CONSTRAINT "cases_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."cases"
    ADD CONSTRAINT "cases_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."checks"
    ADD CONSTRAINT "checks_bank_account_id_fkey" FOREIGN KEY ("bank_account_id") REFERENCES "public"."bank_accounts"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."checks"
    ADD CONSTRAINT "checks_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."clients"
    ADD CONSTRAINT "clients_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."disbursement_template_lines"
    ADD CONSTRAINT "disbursement_template_lines_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."disbursement_template_lines"
    ADD CONSTRAINT "disbursement_template_lines_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "public"."disbursement_templates"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."disbursement_templates"
    ADD CONSTRAINT "disbursement_templates_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."expenses"
    ADD CONSTRAINT "expenses_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "public"."cases"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."expenses"
    ADD CONSTRAINT "expenses_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."journal_entries"
    ADD CONSTRAINT "journal_entries_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "public"."cases"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."journal_entries"
    ADD CONSTRAINT "journal_entries_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."journal_entries"
    ADD CONSTRAINT "journal_entries_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."journal_lines"
    ADD CONSTRAINT "journal_lines_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id");



ALTER TABLE ONLY "public"."journal_lines"
    ADD CONSTRAINT "journal_lines_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "public"."journal_entries"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."kpis_daily"
    ADD CONSTRAINT "kpis_daily_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."migration_records"
    ADD CONSTRAINT "migration_records_migration_job_id_fkey" FOREIGN KEY ("migration_job_id") REFERENCES "public"."migration_jobs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."org_members"
    ADD CONSTRAINT "org_members_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."org_members"
    ADD CONSTRAINT "org_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."preferences"
    ADD CONSTRAINT "preferences_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reconciliations"
    ADD CONSTRAINT "reconciliations_bank_account_id_fkey" FOREIGN KEY ("bank_account_id") REFERENCES "public"."bank_accounts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reconciliations"
    ADD CONSTRAINT "reconciliations_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."settlement_items"
    ADD CONSTRAINT "settlement_items_settlement_id_fkey" FOREIGN KEY ("settlement_id") REFERENCES "public"."settlements"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."settlements"
    ADD CONSTRAINT "settlements_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "public"."cases"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."settlements"
    ADD CONSTRAINT "settlements_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."test_runs"
    ADD CONSTRAINT "test_runs_scenario_id_fkey" FOREIGN KEY ("scenario_id") REFERENCES "public"."test_scenarios"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."test_scenarios"
    ADD CONSTRAINT "test_scenarios_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."time_entries"
    ADD CONSTRAINT "time_entries_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "public"."cases"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."time_entries"
    ADD CONSTRAINT "time_entries_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."trust_checks"
    ADD CONSTRAINT "trust_checks_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "public"."cases"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."trust_checks"
    ADD CONSTRAINT "trust_checks_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Admins and owners can manage members" ON "public"."org_members" TO "authenticated" USING (("public"."has_role"("auth"."uid"(), "organization_id", 'owner'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), "organization_id", 'admin'::"public"."app_role")));



CREATE POLICY "Admins can delete cases" ON "public"."cases" FOR DELETE USING (("public"."has_role"("auth"."uid"(), "organization_id", 'owner'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), "organization_id", 'admin'::"public"."app_role")));



CREATE POLICY "Admins can delete clients" ON "public"."clients" FOR DELETE USING (("public"."has_role"("auth"."uid"(), "organization_id", 'owner'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), "organization_id", 'admin'::"public"."app_role")));



CREATE POLICY "Admins can manage accounts" ON "public"."accounts" TO "authenticated" USING (("public"."has_role"("auth"."uid"(), "organization_id", 'owner'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), "organization_id", 'admin'::"public"."app_role")));



CREATE POLICY "Admins can manage ai rules" ON "public"."ai_rules" USING ((("organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")) AND ("public"."has_role"("auth"."uid"(), "organization_id", 'owner'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), "organization_id", 'admin'::"public"."app_role"))));



CREATE POLICY "Admins can manage all time entries" ON "public"."time_entries" USING ((("organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")) AND ("public"."has_role"("auth"."uid"(), "organization_id", 'owner'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), "organization_id", 'admin'::"public"."app_role"))));



CREATE POLICY "Admins can manage bank accounts" ON "public"."bank_accounts" USING ((("organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")) AND ("public"."has_role"("auth"."uid"(), "organization_id", 'owner'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), "organization_id", 'admin'::"public"."app_role"))));



CREATE POLICY "Admins can manage bank feeds" ON "public"."bank_feeds" USING ((("organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")) AND ("public"."has_role"("auth"."uid"(), "organization_id", 'owner'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), "organization_id", 'admin'::"public"."app_role"))));



CREATE POLICY "Admins can manage import maps" ON "public"."import_maps" USING ((("organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")) AND ("public"."has_role"("auth"."uid"(), "organization_id", 'owner'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), "organization_id", 'admin'::"public"."app_role"))));



CREATE POLICY "Admins can manage imports" ON "public"."imports" USING ((("organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")) AND ("public"."has_role"("auth"."uid"(), "organization_id", 'owner'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), "organization_id", 'admin'::"public"."app_role"))));



CREATE POLICY "Admins can manage preferences" ON "public"."preferences" USING ((("organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")) AND ("public"."has_role"("auth"."uid"(), "organization_id", 'owner'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), "organization_id", 'admin'::"public"."app_role"))));



CREATE POLICY "Admins can manage template lines" ON "public"."disbursement_template_lines" USING (("template_id" IN ( SELECT "dt"."id"
   FROM "public"."disbursement_templates" "dt"
  WHERE (("dt"."organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")) AND ("public"."has_role"("auth"."uid"(), "dt"."organization_id", 'owner'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), "dt"."organization_id", 'admin'::"public"."app_role"))))));



CREATE POLICY "Admins can manage templates" ON "public"."disbursement_templates" USING ((("organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")) AND ("public"."has_role"("auth"."uid"(), "organization_id", 'owner'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), "organization_id", 'admin'::"public"."app_role"))));



CREATE POLICY "Admins can manage test scenarios" ON "public"."test_scenarios" USING ((("organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")) AND ("public"."has_role"("auth"."uid"(), "organization_id", 'owner'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), "organization_id", 'admin'::"public"."app_role"))));



CREATE POLICY "Admins can update journal entries" ON "public"."journal_entries" FOR UPDATE TO "authenticated" USING (("public"."has_role"("auth"."uid"(), "organization_id", 'owner'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), "organization_id", 'admin'::"public"."app_role")));



CREATE POLICY "Admins can update test runs" ON "public"."test_runs" FOR UPDATE USING (("scenario_id" IN ( SELECT "ts"."id"
   FROM "public"."test_scenarios" "ts"
  WHERE (("ts"."organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")) AND ("public"."has_role"("auth"."uid"(), "ts"."organization_id", 'owner'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), "ts"."organization_id", 'admin'::"public"."app_role"))))));



CREATE POLICY "Allow all operations on field_mappings" ON "public"."field_mappings" USING (true);



CREATE POLICY "Allow all operations on migration_jobs" ON "public"."migration_jobs" USING (true);



CREATE POLICY "Allow all operations on migration_records" ON "public"."migration_records" USING (true);



CREATE POLICY "Allow all operations on sync_config" ON "public"."sync_config" USING (true);



CREATE POLICY "Everyone can view account templates" ON "public"."account_templates" FOR SELECT USING (true);



CREATE POLICY "Only owners can manage account templates" ON "public"."account_templates" USING ((EXISTS ( SELECT 1
   FROM "public"."organizations" "o"
  WHERE "public"."has_role"("auth"."uid"(), "o"."id", 'owner'::"public"."app_role"))));



CREATE POLICY "Only owners can manage roles" ON "public"."user_roles" TO "authenticated" USING ("public"."has_role"("auth"."uid"(), "organization_id", 'owner'::"public"."app_role"));



CREATE POLICY "Owners can update their organizations" ON "public"."organizations" FOR UPDATE TO "authenticated" USING ("public"."has_role"("auth"."uid"(), "id", 'owner'::"public"."app_role"));



CREATE POLICY "Staff can create cases" ON "public"."cases" FOR INSERT WITH CHECK ((("organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")) AND ("public"."has_role"("auth"."uid"(), "organization_id", 'owner'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), "organization_id", 'admin'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), "organization_id", 'staff'::"public"."app_role"))));



CREATE POLICY "Staff can create clients" ON "public"."clients" FOR INSERT WITH CHECK ((("organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")) AND ("public"."has_role"("auth"."uid"(), "organization_id", 'owner'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), "organization_id", 'admin'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), "organization_id", 'staff'::"public"."app_role"))));



CREATE POLICY "Staff can create journal entries" ON "public"."journal_entries" FOR INSERT TO "authenticated" WITH CHECK ((("organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")) AND ("public"."has_role"("auth"."uid"(), "organization_id", 'owner'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), "organization_id", 'admin'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), "organization_id", 'staff'::"public"."app_role"))));



CREATE POLICY "Staff can create test runs" ON "public"."test_runs" FOR INSERT WITH CHECK (("scenario_id" IN ( SELECT "test_scenarios"."id"
   FROM "public"."test_scenarios"
  WHERE ("test_scenarios"."organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")))));



CREATE POLICY "Staff can manage ai suggestions" ON "public"."ai_suggestions" USING ((("organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")) AND ("public"."has_role"("auth"."uid"(), "organization_id", 'owner'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), "organization_id", 'admin'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), "organization_id", 'staff'::"public"."app_role"))));



CREATE POLICY "Staff can manage bank transactions" ON "public"."bank_transactions" USING ((("organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")) AND ("public"."has_role"("auth"."uid"(), "organization_id", 'owner'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), "organization_id", 'admin'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), "organization_id", 'staff'::"public"."app_role"))));



CREATE POLICY "Staff can manage case accounts" ON "public"."case_accounts" USING (("case_id" IN ( SELECT "c"."id"
   FROM "public"."cases" "c"
  WHERE (("c"."organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")) AND ("public"."has_role"("auth"."uid"(), "c"."organization_id", 'owner'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), "c"."organization_id", 'admin'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), "c"."organization_id", 'staff'::"public"."app_role"))))));



CREATE POLICY "Staff can manage checks" ON "public"."checks" USING ((("organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")) AND ("public"."has_role"("auth"."uid"(), "organization_id", 'owner'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), "organization_id", 'admin'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), "organization_id", 'staff'::"public"."app_role"))));



CREATE POLICY "Staff can manage expenses" ON "public"."expenses" USING ((("organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")) AND ("public"."has_role"("auth"."uid"(), "organization_id", 'owner'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), "organization_id", 'admin'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), "organization_id", 'staff'::"public"."app_role"))));



CREATE POLICY "Staff can manage journal lines" ON "public"."journal_lines" TO "authenticated" USING (("entry_id" IN ( SELECT "je"."id"
   FROM "public"."journal_entries" "je"
  WHERE (("je"."organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")) AND ("public"."has_role"("auth"."uid"(), "je"."organization_id", 'owner'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), "je"."organization_id", 'admin'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), "je"."organization_id", 'staff'::"public"."app_role"))))));



CREATE POLICY "Staff can manage reconciliations" ON "public"."reconciliations" USING ((("organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")) AND ("public"."has_role"("auth"."uid"(), "organization_id", 'owner'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), "organization_id", 'admin'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), "organization_id", 'staff'::"public"."app_role"))));



CREATE POLICY "Staff can manage settlement items" ON "public"."settlement_items" USING (("settlement_id" IN ( SELECT "s"."id"
   FROM "public"."settlements" "s"
  WHERE (("s"."organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")) AND ("public"."has_role"("auth"."uid"(), "s"."organization_id", 'owner'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), "s"."organization_id", 'admin'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), "s"."organization_id", 'staff'::"public"."app_role"))))));



CREATE POLICY "Staff can manage settlements" ON "public"."settlements" USING ((("organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")) AND ("public"."has_role"("auth"."uid"(), "organization_id", 'owner'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), "organization_id", 'admin'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), "organization_id", 'staff'::"public"."app_role"))));



CREATE POLICY "Staff can manage trust checks" ON "public"."trust_checks" USING ((("organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")) AND ("public"."has_role"("auth"."uid"(), "organization_id", 'owner'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), "organization_id", 'admin'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), "organization_id", 'staff'::"public"."app_role"))));



CREATE POLICY "Staff can update cases" ON "public"."cases" FOR UPDATE USING ((("organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")) AND ("public"."has_role"("auth"."uid"(), "organization_id", 'owner'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), "organization_id", 'admin'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), "organization_id", 'staff'::"public"."app_role"))));



CREATE POLICY "Staff can update clients" ON "public"."clients" FOR UPDATE USING ((("organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")) AND ("public"."has_role"("auth"."uid"(), "organization_id", 'owner'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), "organization_id", 'admin'::"public"."app_role") OR "public"."has_role"("auth"."uid"(), "organization_id", 'staff'::"public"."app_role"))));



CREATE POLICY "Users can create their own time entries" ON "public"."time_entries" FOR INSERT WITH CHECK ((("organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")) AND ("user_id" = "auth"."uid"())));



CREATE POLICY "Users can update their own time entries" ON "public"."time_entries" FOR UPDATE USING ((("organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")) AND ("user_id" = "auth"."uid"())));



CREATE POLICY "Users can view KPIs for their organizations" ON "public"."kpis_daily" FOR SELECT TO "authenticated" USING (("organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")));



CREATE POLICY "Users can view accounts in their organizations" ON "public"."accounts" FOR SELECT TO "authenticated" USING (("organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")));



CREATE POLICY "Users can view ai rules in their organizations" ON "public"."ai_rules" FOR SELECT USING (("organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")));



CREATE POLICY "Users can view ai suggestions in their organizations" ON "public"."ai_suggestions" FOR SELECT USING (("organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")));



CREATE POLICY "Users can view bank accounts in their organizations" ON "public"."bank_accounts" FOR SELECT USING (("organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")));



CREATE POLICY "Users can view bank feeds in their organizations" ON "public"."bank_feeds" FOR SELECT USING (("organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")));



CREATE POLICY "Users can view bank transactions in their organizations" ON "public"."bank_transactions" FOR SELECT USING (("organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")));



CREATE POLICY "Users can view case accounts in their organizations" ON "public"."case_accounts" FOR SELECT USING (("case_id" IN ( SELECT "cases"."id"
   FROM "public"."cases"
  WHERE ("cases"."organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")))));



CREATE POLICY "Users can view cases in their organizations" ON "public"."cases" FOR SELECT USING (("organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")));



CREATE POLICY "Users can view checks in their organizations" ON "public"."checks" FOR SELECT USING (("organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")));



CREATE POLICY "Users can view clients in their organizations" ON "public"."clients" FOR SELECT USING (("organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")));



CREATE POLICY "Users can view expenses in their organizations" ON "public"."expenses" FOR SELECT USING (("organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")));



CREATE POLICY "Users can view import maps in their organizations" ON "public"."import_maps" FOR SELECT USING (("organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")));



CREATE POLICY "Users can view imports in their organizations" ON "public"."imports" FOR SELECT USING (("organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")));



CREATE POLICY "Users can view journal entries in their organizations" ON "public"."journal_entries" FOR SELECT TO "authenticated" USING (("organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")));



CREATE POLICY "Users can view journal lines in their organizations" ON "public"."journal_lines" FOR SELECT TO "authenticated" USING (("entry_id" IN ( SELECT "journal_entries"."id"
   FROM "public"."journal_entries"
  WHERE ("journal_entries"."organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")))));



CREATE POLICY "Users can view members of their organizations" ON "public"."org_members" FOR SELECT TO "authenticated" USING (("organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")));



CREATE POLICY "Users can view preferences in their organizations" ON "public"."preferences" FOR SELECT USING (("organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")));



CREATE POLICY "Users can view reconciliations in their organizations" ON "public"."reconciliations" FOR SELECT USING (("organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")));



CREATE POLICY "Users can view roles in their organizations" ON "public"."user_roles" FOR SELECT TO "authenticated" USING (("organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")));



CREATE POLICY "Users can view settlement items in their organizations" ON "public"."settlement_items" FOR SELECT USING (("settlement_id" IN ( SELECT "settlements"."id"
   FROM "public"."settlements"
  WHERE ("settlements"."organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")))));



CREATE POLICY "Users can view settlements in their organizations" ON "public"."settlements" FOR SELECT USING (("organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")));



CREATE POLICY "Users can view template lines in their organizations" ON "public"."disbursement_template_lines" FOR SELECT USING (("template_id" IN ( SELECT "disbursement_templates"."id"
   FROM "public"."disbursement_templates"
  WHERE ("disbursement_templates"."organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")))));



CREATE POLICY "Users can view templates in their organizations" ON "public"."disbursement_templates" FOR SELECT USING (("organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")));



CREATE POLICY "Users can view test runs in their organizations" ON "public"."test_runs" FOR SELECT USING (("scenario_id" IN ( SELECT "test_scenarios"."id"
   FROM "public"."test_scenarios"
  WHERE ("test_scenarios"."organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")))));



CREATE POLICY "Users can view test scenarios in their organizations" ON "public"."test_scenarios" FOR SELECT USING (("organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")));



CREATE POLICY "Users can view their organizations" ON "public"."organizations" FOR SELECT TO "authenticated" USING (("id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")));



CREATE POLICY "Users can view time entries in their organizations" ON "public"."time_entries" FOR SELECT USING (("organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")));



CREATE POLICY "Users can view trust checks in their organizations" ON "public"."trust_checks" FOR SELECT USING (("organization_id" IN ( SELECT "public"."user_organizations"("auth"."uid"()) AS "user_organizations")));



ALTER TABLE "public"."account_templates" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."accounts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."ai_rules" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."ai_suggestions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bank_accounts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bank_feeds" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bank_transactions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."case_accounts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."cases" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."checks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."clients" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."disbursement_template_lines" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."disbursement_templates" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."expenses" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."field_mappings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."import_maps" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."imports" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."journal_entries" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."journal_lines" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."kpis_daily" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."migration_jobs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."migration_records" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."org_members" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."organizations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."preferences" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."reconciliations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."settlement_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."settlements" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."sync_config" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."test_runs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."test_scenarios" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."time_entries" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."trust_checks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_roles" ENABLE ROW LEVEL SECURITY;


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."fn_apply_disbursement_template"("_settlement_id" "uuid", "_template_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."fn_apply_disbursement_template"("_settlement_id" "uuid", "_template_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."fn_apply_disbursement_template"("_settlement_id" "uuid", "_template_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."fn_generate_report"("_report_type" "text", "_params" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."fn_generate_report"("_report_type" "text", "_params" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."fn_generate_report"("_report_type" "text", "_params" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."fn_issue_check"("_check_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."fn_issue_check"("_check_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."fn_issue_check"("_check_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."fn_match_transactions"("_organization_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."fn_match_transactions"("_organization_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."fn_match_transactions"("_organization_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."fn_post_settlement"("_settlement_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."fn_post_settlement"("_settlement_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."fn_post_settlement"("_settlement_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."fn_refresh_reports"() TO "anon";
GRANT ALL ON FUNCTION "public"."fn_refresh_reports"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."fn_refresh_reports"() TO "service_role";



GRANT ALL ON FUNCTION "public"."fn_seed_scenario"("_scenario_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."fn_seed_scenario"("_scenario_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."fn_seed_scenario"("_scenario_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."fn_trust_deposit"("_organization_id" "uuid", "_case_id" "uuid", "_amount" numeric, "_memo" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."fn_trust_deposit"("_organization_id" "uuid", "_case_id" "uuid", "_amount" numeric, "_memo" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."fn_trust_deposit"("_organization_id" "uuid", "_case_id" "uuid", "_amount" numeric, "_memo" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."fn_trust_withdraw"("_organization_id" "uuid", "_case_id" "uuid", "_amount" numeric, "_memo" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."fn_trust_withdraw"("_organization_id" "uuid", "_case_id" "uuid", "_amount" numeric, "_memo" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."fn_trust_withdraw"("_organization_id" "uuid", "_case_id" "uuid", "_amount" numeric, "_memo" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."has_role"("_user_id" "uuid", "_org_id" "uuid", "_role" "public"."app_role") TO "anon";
GRANT ALL ON FUNCTION "public"."has_role"("_user_id" "uuid", "_org_id" "uuid", "_role" "public"."app_role") TO "authenticated";
GRANT ALL ON FUNCTION "public"."has_role"("_user_id" "uuid", "_org_id" "uuid", "_role" "public"."app_role") TO "service_role";



GRANT ALL ON FUNCTION "public"."refresh_kpis_daily"() TO "anon";
GRANT ALL ON FUNCTION "public"."refresh_kpis_daily"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."refresh_kpis_daily"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."user_organizations"("_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."user_organizations"("_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."user_organizations"("_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."validate_journal_balance"() TO "anon";
GRANT ALL ON FUNCTION "public"."validate_journal_balance"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."validate_journal_balance"() TO "service_role";



GRANT ALL ON TABLE "public"."account_templates" TO "anon";
GRANT ALL ON TABLE "public"."account_templates" TO "authenticated";
GRANT ALL ON TABLE "public"."account_templates" TO "service_role";



GRANT ALL ON TABLE "public"."accounts" TO "anon";
GRANT ALL ON TABLE "public"."accounts" TO "authenticated";
GRANT ALL ON TABLE "public"."accounts" TO "service_role";



GRANT ALL ON TABLE "public"."ai_rules" TO "anon";
GRANT ALL ON TABLE "public"."ai_rules" TO "authenticated";
GRANT ALL ON TABLE "public"."ai_rules" TO "service_role";



GRANT ALL ON TABLE "public"."ai_suggestions" TO "anon";
GRANT ALL ON TABLE "public"."ai_suggestions" TO "authenticated";
GRANT ALL ON TABLE "public"."ai_suggestions" TO "service_role";



GRANT ALL ON TABLE "public"."bank_accounts" TO "anon";
GRANT ALL ON TABLE "public"."bank_accounts" TO "authenticated";
GRANT ALL ON TABLE "public"."bank_accounts" TO "service_role";



GRANT ALL ON TABLE "public"."bank_feeds" TO "anon";
GRANT ALL ON TABLE "public"."bank_feeds" TO "authenticated";
GRANT ALL ON TABLE "public"."bank_feeds" TO "service_role";



GRANT ALL ON TABLE "public"."bank_transactions" TO "anon";
GRANT ALL ON TABLE "public"."bank_transactions" TO "authenticated";
GRANT ALL ON TABLE "public"."bank_transactions" TO "service_role";



GRANT ALL ON TABLE "public"."case_accounts" TO "anon";
GRANT ALL ON TABLE "public"."case_accounts" TO "authenticated";
GRANT ALL ON TABLE "public"."case_accounts" TO "service_role";



GRANT ALL ON TABLE "public"."cases" TO "anon";
GRANT ALL ON TABLE "public"."cases" TO "authenticated";
GRANT ALL ON TABLE "public"."cases" TO "service_role";



GRANT ALL ON TABLE "public"."checks" TO "anon";
GRANT ALL ON TABLE "public"."checks" TO "authenticated";
GRANT ALL ON TABLE "public"."checks" TO "service_role";



GRANT ALL ON TABLE "public"."clients" TO "anon";
GRANT ALL ON TABLE "public"."clients" TO "authenticated";
GRANT ALL ON TABLE "public"."clients" TO "service_role";



GRANT ALL ON TABLE "public"."disbursement_template_lines" TO "anon";
GRANT ALL ON TABLE "public"."disbursement_template_lines" TO "authenticated";
GRANT ALL ON TABLE "public"."disbursement_template_lines" TO "service_role";



GRANT ALL ON TABLE "public"."disbursement_templates" TO "anon";
GRANT ALL ON TABLE "public"."disbursement_templates" TO "authenticated";
GRANT ALL ON TABLE "public"."disbursement_templates" TO "service_role";



GRANT ALL ON TABLE "public"."expenses" TO "anon";
GRANT ALL ON TABLE "public"."expenses" TO "authenticated";
GRANT ALL ON TABLE "public"."expenses" TO "service_role";



GRANT ALL ON TABLE "public"."field_mappings" TO "anon";
GRANT ALL ON TABLE "public"."field_mappings" TO "authenticated";
GRANT ALL ON TABLE "public"."field_mappings" TO "service_role";



GRANT ALL ON TABLE "public"."import_maps" TO "anon";
GRANT ALL ON TABLE "public"."import_maps" TO "authenticated";
GRANT ALL ON TABLE "public"."import_maps" TO "service_role";



GRANT ALL ON TABLE "public"."imports" TO "anon";
GRANT ALL ON TABLE "public"."imports" TO "authenticated";
GRANT ALL ON TABLE "public"."imports" TO "service_role";



GRANT ALL ON TABLE "public"."journal_entries" TO "anon";
GRANT ALL ON TABLE "public"."journal_entries" TO "authenticated";
GRANT ALL ON TABLE "public"."journal_entries" TO "service_role";



GRANT ALL ON TABLE "public"."journal_lines" TO "anon";
GRANT ALL ON TABLE "public"."journal_lines" TO "authenticated";
GRANT ALL ON TABLE "public"."journal_lines" TO "service_role";



GRANT ALL ON TABLE "public"."kpis_daily" TO "anon";
GRANT ALL ON TABLE "public"."kpis_daily" TO "authenticated";
GRANT ALL ON TABLE "public"."kpis_daily" TO "service_role";



GRANT ALL ON TABLE "public"."migration_jobs" TO "anon";
GRANT ALL ON TABLE "public"."migration_jobs" TO "authenticated";
GRANT ALL ON TABLE "public"."migration_jobs" TO "service_role";



GRANT ALL ON TABLE "public"."migration_records" TO "anon";
GRANT ALL ON TABLE "public"."migration_records" TO "authenticated";
GRANT ALL ON TABLE "public"."migration_records" TO "service_role";



GRANT ALL ON TABLE "public"."mv_case_cycle" TO "anon";
GRANT ALL ON TABLE "public"."mv_case_cycle" TO "authenticated";
GRANT ALL ON TABLE "public"."mv_case_cycle" TO "service_role";



GRANT ALL ON TABLE "public"."settlements" TO "anon";
GRANT ALL ON TABLE "public"."settlements" TO "authenticated";
GRANT ALL ON TABLE "public"."settlements" TO "service_role";



GRANT ALL ON TABLE "public"."time_entries" TO "anon";
GRANT ALL ON TABLE "public"."time_entries" TO "authenticated";
GRANT ALL ON TABLE "public"."time_entries" TO "service_role";



GRANT ALL ON TABLE "public"."mv_case_profitability" TO "anon";
GRANT ALL ON TABLE "public"."mv_case_profitability" TO "authenticated";
GRANT ALL ON TABLE "public"."mv_case_profitability" TO "service_role";



GRANT ALL ON TABLE "public"."mv_gl_detail" TO "anon";
GRANT ALL ON TABLE "public"."mv_gl_detail" TO "authenticated";
GRANT ALL ON TABLE "public"."mv_gl_detail" TO "service_role";



GRANT ALL ON TABLE "public"."organizations" TO "anon";
GRANT ALL ON TABLE "public"."organizations" TO "authenticated";
GRANT ALL ON TABLE "public"."organizations" TO "service_role";



GRANT ALL ON TABLE "public"."mv_kpis_daily" TO "service_role";



GRANT ALL ON TABLE "public"."mv_liens_recovery_rate" TO "anon";
GRANT ALL ON TABLE "public"."mv_liens_recovery_rate" TO "authenticated";
GRANT ALL ON TABLE "public"."mv_liens_recovery_rate" TO "service_role";



GRANT ALL ON TABLE "public"."mv_perf_weekly" TO "service_role";



GRANT ALL ON TABLE "public"."mv_referral_roi" TO "anon";
GRANT ALL ON TABLE "public"."mv_referral_roi" TO "authenticated";
GRANT ALL ON TABLE "public"."mv_referral_roi" TO "service_role";



GRANT ALL ON TABLE "public"."mv_settlement_distribution" TO "anon";
GRANT ALL ON TABLE "public"."mv_settlement_distribution" TO "authenticated";
GRANT ALL ON TABLE "public"."mv_settlement_distribution" TO "service_role";



GRANT ALL ON TABLE "public"."mv_trial_balance" TO "anon";
GRANT ALL ON TABLE "public"."mv_trial_balance" TO "authenticated";
GRANT ALL ON TABLE "public"."mv_trial_balance" TO "service_role";



GRANT ALL ON TABLE "public"."mv_trust_three_way" TO "anon";
GRANT ALL ON TABLE "public"."mv_trust_three_way" TO "authenticated";
GRANT ALL ON TABLE "public"."mv_trust_three_way" TO "service_role";



GRANT ALL ON TABLE "public"."org_members" TO "anon";
GRANT ALL ON TABLE "public"."org_members" TO "authenticated";
GRANT ALL ON TABLE "public"."org_members" TO "service_role";



GRANT ALL ON TABLE "public"."preferences" TO "anon";
GRANT ALL ON TABLE "public"."preferences" TO "authenticated";
GRANT ALL ON TABLE "public"."preferences" TO "service_role";



GRANT ALL ON TABLE "public"."reconciliations" TO "anon";
GRANT ALL ON TABLE "public"."reconciliations" TO "authenticated";
GRANT ALL ON TABLE "public"."reconciliations" TO "service_role";



GRANT ALL ON TABLE "public"."settlement_items" TO "anon";
GRANT ALL ON TABLE "public"."settlement_items" TO "authenticated";
GRANT ALL ON TABLE "public"."settlement_items" TO "service_role";



GRANT ALL ON TABLE "public"."sync_config" TO "anon";
GRANT ALL ON TABLE "public"."sync_config" TO "authenticated";
GRANT ALL ON TABLE "public"."sync_config" TO "service_role";



GRANT ALL ON TABLE "public"."test_runs" TO "anon";
GRANT ALL ON TABLE "public"."test_runs" TO "authenticated";
GRANT ALL ON TABLE "public"."test_runs" TO "service_role";



GRANT ALL ON TABLE "public"."test_scenarios" TO "anon";
GRANT ALL ON TABLE "public"."test_scenarios" TO "authenticated";
GRANT ALL ON TABLE "public"."test_scenarios" TO "service_role";



GRANT ALL ON TABLE "public"."trust_checks" TO "anon";
GRANT ALL ON TABLE "public"."trust_checks" TO "authenticated";
GRANT ALL ON TABLE "public"."trust_checks" TO "service_role";



GRANT ALL ON TABLE "public"."user_roles" TO "anon";
GRANT ALL ON TABLE "public"."user_roles" TO "authenticated";
GRANT ALL ON TABLE "public"."user_roles" TO "service_role";



GRANT ALL ON TABLE "public"."v_case_costs" TO "service_role";



GRANT ALL ON TABLE "public"."v_realization" TO "service_role";



GRANT ALL ON TABLE "public"."v_uncleared_entries" TO "service_role";



GRANT ALL ON TABLE "public"."v_unmatched_bank" TO "service_role";



GRANT ALL ON TABLE "public"."v_utilization" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






