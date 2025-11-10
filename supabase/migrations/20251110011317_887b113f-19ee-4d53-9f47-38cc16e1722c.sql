-- Test Cases Tables
CREATE TABLE public.test_scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  seed_jsonb JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.test_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id UUID NOT NULL REFERENCES public.test_scenarios(id) ON DELETE CASCADE,
  executed_by UUID NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  passed BOOLEAN,
  log TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Settings Tables
CREATE TABLE public.preferences (
  organization_id UUID PRIMARY KEY REFERENCES public.organizations(id) ON DELETE CASCADE,
  fiscal_start_month INTEGER NOT NULL DEFAULT 1 CHECK (fiscal_start_month >= 1 AND fiscal_start_month <= 12),
  currency TEXT NOT NULL DEFAULT 'USD',
  timezone TEXT NOT NULL DEFAULT 'America/New_York',
  number_format TEXT NOT NULL DEFAULT 'en-US',
  case_prefix TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.account_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_area TEXT NOT NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  type account_type NOT NULL,
  parent_code TEXT,
  description TEXT,
  is_default BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.test_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for test_scenarios
CREATE POLICY "Admins can manage test scenarios"
  ON public.test_scenarios
  FOR ALL
  USING (
    organization_id IN (SELECT user_organizations(auth.uid()))
    AND (has_role(auth.uid(), organization_id, 'owner'::app_role) OR has_role(auth.uid(), organization_id, 'admin'::app_role))
  );

CREATE POLICY "Users can view test scenarios in their organizations"
  ON public.test_scenarios
  FOR SELECT
  USING (organization_id IN (SELECT user_organizations(auth.uid())));

-- RLS Policies for test_runs
CREATE POLICY "Staff can create test runs"
  ON public.test_runs
  FOR INSERT
  WITH CHECK (
    scenario_id IN (
      SELECT id FROM public.test_scenarios 
      WHERE organization_id IN (SELECT user_organizations(auth.uid()))
    )
  );

CREATE POLICY "Users can view test runs in their organizations"
  ON public.test_runs
  FOR SELECT
  USING (
    scenario_id IN (
      SELECT id FROM public.test_scenarios 
      WHERE organization_id IN (SELECT user_organizations(auth.uid()))
    )
  );

CREATE POLICY "Admins can update test runs"
  ON public.test_runs
  FOR UPDATE
  USING (
    scenario_id IN (
      SELECT ts.id FROM public.test_scenarios ts
      WHERE ts.organization_id IN (SELECT user_organizations(auth.uid()))
        AND (has_role(auth.uid(), ts.organization_id, 'owner'::app_role) OR has_role(auth.uid(), ts.organization_id, 'admin'::app_role))
    )
  );

-- RLS Policies for preferences
CREATE POLICY "Admins can manage preferences"
  ON public.preferences
  FOR ALL
  USING (
    organization_id IN (SELECT user_organizations(auth.uid()))
    AND (has_role(auth.uid(), organization_id, 'owner'::app_role) OR has_role(auth.uid(), organization_id, 'admin'::app_role))
  );

CREATE POLICY "Users can view preferences in their organizations"
  ON public.preferences
  FOR SELECT
  USING (organization_id IN (SELECT user_organizations(auth.uid())));

-- RLS Policies for account_templates
CREATE POLICY "Everyone can view account templates"
  ON public.account_templates
  FOR SELECT
  USING (true);

CREATE POLICY "Only owners can manage account templates"
  ON public.account_templates
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.organizations o
      WHERE has_role(auth.uid(), o.id, 'owner'::app_role)
    )
  );

-- Triggers
CREATE TRIGGER update_test_scenarios_updated_at
  BEFORE UPDATE ON public.test_scenarios
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_preferences_updated_at
  BEFORE UPDATE ON public.preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed Scenario Function
CREATE OR REPLACE FUNCTION public.fn_seed_scenario(_scenario_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;

-- Insert default account templates for common practice areas
INSERT INTO public.account_templates (practice_area, code, name, type, description) VALUES
-- Personal Injury
('Personal Injury', '1010', 'Trust Cash - Personal Injury', 'asset', 'Trust account for PI cases'),
('Personal Injury', '1020', 'Operating Cash', 'asset', 'Main operating account'),
('Personal Injury', '1200', 'Accounts Receivable', 'asset', 'Client receivables'),
('Personal Injury', '2100', 'Client Trust Liability', 'liability', 'Client funds held in trust'),
('Personal Injury', '4100', 'Fee Income', 'revenue', 'Legal fees earned'),
('Personal Injury', '5100', 'Case Expenses', 'expense', 'Direct case costs'),
-- Family Law
('Family Law', '1010', 'Trust Cash - Family Law', 'asset', 'Trust account for family law cases'),
('Family Law', '1020', 'Operating Cash', 'asset', 'Main operating account'),
('Family Law', '1200', 'Accounts Receivable', 'asset', 'Client receivables'),
('Family Law', '2100', 'Client Trust Liability', 'liability', 'Client funds held in trust'),
('Family Law', '4100', 'Retainer Income', 'revenue', 'Legal fees earned'),
('Family Law', '5100', 'Case Expenses', 'expense', 'Direct case costs'),
-- Criminal Defense
('Criminal Defense', '1010', 'Trust Cash - Criminal', 'asset', 'Trust account for criminal cases'),
('Criminal Defense', '1020', 'Operating Cash', 'asset', 'Main operating account'),
('Criminal Defense', '1200', 'Accounts Receivable', 'asset', 'Client receivables'),
('Criminal Defense', '2100', 'Client Trust Liability', 'liability', 'Client funds held in trust'),
('Criminal Defense', '4100', 'Defense Fee Income', 'revenue', 'Legal fees earned'),
('Criminal Defense', '5100', 'Case Expenses', 'expense', 'Direct case costs');