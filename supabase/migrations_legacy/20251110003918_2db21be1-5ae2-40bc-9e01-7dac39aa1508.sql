-- =====================================================
-- TRUST ACCOUNTING
-- =====================================================

-- Create trust_checks table
CREATE TABLE public.trust_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  case_id UUID REFERENCES public.cases(id) ON DELETE SET NULL,
  payee TEXT NOT NULL,
  date DATE NOT NULL,
  amount NUMERIC(15,2) NOT NULL,
  check_no TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  memo TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_trust_checks_organization ON public.trust_checks(organization_id);
CREATE INDEX idx_trust_checks_case ON public.trust_checks(case_id);
CREATE INDEX idx_trust_checks_status ON public.trust_checks(status);

ALTER TABLE public.trust_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view trust checks in their organizations"
ON public.trust_checks FOR SELECT
USING (organization_id IN (SELECT user_organizations(auth.uid())));

CREATE POLICY "Staff can manage trust checks"
ON public.trust_checks FOR ALL
USING (
  organization_id IN (SELECT user_organizations(auth.uid()))
  AND (
    has_role(auth.uid(), organization_id, 'owner'::app_role)
    OR has_role(auth.uid(), organization_id, 'admin'::app_role)
    OR has_role(auth.uid(), organization_id, 'staff'::app_role)
  )
);

CREATE TRIGGER update_trust_checks_updated_at
  BEFORE UPDATE ON public.trust_checks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trust deposit function
CREATE OR REPLACE FUNCTION public.fn_trust_deposit(
  _organization_id UUID,
  _case_id UUID,
  _amount NUMERIC,
  _memo TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Trust withdraw function with balance check
CREATE OR REPLACE FUNCTION public.fn_trust_withdraw(
  _organization_id UUID,
  _case_id UUID,
  _amount NUMERIC,
  _memo TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- =====================================================
-- CHECK LEDGER
-- =====================================================

-- Create bank_accounts table
CREATE TABLE public.bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  institution TEXT,
  last4 TEXT,
  account_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create checks table
CREATE TABLE public.checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  bank_account_id UUID REFERENCES public.bank_accounts(id) ON DELETE SET NULL,
  payee TEXT NOT NULL,
  amount NUMERIC(15,2) NOT NULL,
  date DATE NOT NULL,
  number TEXT,
  memo TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  attachment_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_bank_accounts_organization ON public.bank_accounts(organization_id);
CREATE INDEX idx_checks_organization ON public.checks(organization_id);
CREATE INDEX idx_checks_bank_account ON public.checks(bank_account_id);
CREATE INDEX idx_checks_status ON public.checks(status);

ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view bank accounts in their organizations"
ON public.bank_accounts FOR SELECT
USING (organization_id IN (SELECT user_organizations(auth.uid())));

CREATE POLICY "Admins can manage bank accounts"
ON public.bank_accounts FOR ALL
USING (
  organization_id IN (SELECT user_organizations(auth.uid()))
  AND (
    has_role(auth.uid(), organization_id, 'owner'::app_role)
    OR has_role(auth.uid(), organization_id, 'admin'::app_role)
  )
);

CREATE POLICY "Users can view checks in their organizations"
ON public.checks FOR SELECT
USING (organization_id IN (SELECT user_organizations(auth.uid())));

CREATE POLICY "Staff can manage checks"
ON public.checks FOR ALL
USING (
  organization_id IN (SELECT user_organizations(auth.uid()))
  AND (
    has_role(auth.uid(), organization_id, 'owner'::app_role)
    OR has_role(auth.uid(), organization_id, 'admin'::app_role)
    OR has_role(auth.uid(), organization_id, 'staff'::app_role)
  )
);

CREATE TRIGGER update_bank_accounts_updated_at
  BEFORE UPDATE ON public.bank_accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_checks_updated_at
  BEFORE UPDATE ON public.checks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to issue check
CREATE OR REPLACE FUNCTION public.fn_issue_check(_check_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- =====================================================
-- AI BOOKKEEPING
-- =====================================================

-- Create ai_rules table
CREATE TABLE public.ai_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  match_jsonb JSONB NOT NULL,
  action_jsonb JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ai_suggestions table
CREATE TABLE public.ai_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  transaction_id TEXT NOT NULL,
  suggested_account_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
  confidence NUMERIC(3,2),
  applied BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_ai_rules_organization ON public.ai_rules(organization_id);
CREATE INDEX idx_ai_suggestions_organization ON public.ai_suggestions(organization_id);
CREATE INDEX idx_ai_suggestions_transaction ON public.ai_suggestions(transaction_id);

ALTER TABLE public.ai_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view ai rules in their organizations"
ON public.ai_rules FOR SELECT
USING (organization_id IN (SELECT user_organizations(auth.uid())));

CREATE POLICY "Admins can manage ai rules"
ON public.ai_rules FOR ALL
USING (
  organization_id IN (SELECT user_organizations(auth.uid()))
  AND (
    has_role(auth.uid(), organization_id, 'owner'::app_role)
    OR has_role(auth.uid(), organization_id, 'admin'::app_role)
  )
);

CREATE POLICY "Users can view ai suggestions in their organizations"
ON public.ai_suggestions FOR SELECT
USING (organization_id IN (SELECT user_organizations(auth.uid())));

CREATE POLICY "Staff can manage ai suggestions"
ON public.ai_suggestions FOR ALL
USING (
  organization_id IN (SELECT user_organizations(auth.uid()))
  AND (
    has_role(auth.uid(), organization_id, 'owner'::app_role)
    OR has_role(auth.uid(), organization_id, 'admin'::app_role)
    OR has_role(auth.uid(), organization_id, 'staff'::app_role)
  )
);

CREATE TRIGGER update_ai_rules_updated_at
  BEFORE UPDATE ON public.ai_rules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- BANK RECONCILIATION
-- =====================================================

-- Create bank feed provider enum
CREATE TYPE public.bank_feed_provider AS ENUM ('plaid', 'qbo', 'manual');

-- Create bank_feeds table
CREATE TABLE public.bank_feeds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  bank_account_id UUID REFERENCES public.bank_accounts(id) ON DELETE CASCADE,
  provider public.bank_feed_provider NOT NULL,
  access_token TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  last_sync TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bank_transactions table
CREATE TABLE public.bank_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  bank_account_id UUID REFERENCES public.bank_accounts(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  amount NUMERIC(15,2) NOT NULL,
  description TEXT,
  external_id TEXT,
  matched_entry_id UUID REFERENCES public.journal_entries(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(bank_account_id, external_id)
);

-- Create reconciliations table
CREATE TABLE public.reconciliations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  bank_account_id UUID REFERENCES public.bank_accounts(id) ON DELETE CASCADE,
  statement_start DATE NOT NULL,
  statement_end DATE NOT NULL,
  ending_balance NUMERIC(15,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_bank_feeds_organization ON public.bank_feeds(organization_id);
CREATE INDEX idx_bank_transactions_organization ON public.bank_transactions(organization_id);
CREATE INDEX idx_bank_transactions_bank_account ON public.bank_transactions(bank_account_id);
CREATE INDEX idx_bank_transactions_external_id ON public.bank_transactions(external_id);
CREATE INDEX idx_reconciliations_organization ON public.reconciliations(organization_id);
CREATE INDEX idx_reconciliations_bank_account ON public.reconciliations(bank_account_id);

ALTER TABLE public.bank_feeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reconciliations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view bank feeds in their organizations"
ON public.bank_feeds FOR SELECT
USING (organization_id IN (SELECT user_organizations(auth.uid())));

CREATE POLICY "Admins can manage bank feeds"
ON public.bank_feeds FOR ALL
USING (
  organization_id IN (SELECT user_organizations(auth.uid()))
  AND (
    has_role(auth.uid(), organization_id, 'owner'::app_role)
    OR has_role(auth.uid(), organization_id, 'admin'::app_role)
  )
);

CREATE POLICY "Users can view bank transactions in their organizations"
ON public.bank_transactions FOR SELECT
USING (organization_id IN (SELECT user_organizations(auth.uid())));

CREATE POLICY "Staff can manage bank transactions"
ON public.bank_transactions FOR ALL
USING (
  organization_id IN (SELECT user_organizations(auth.uid()))
  AND (
    has_role(auth.uid(), organization_id, 'owner'::app_role)
    OR has_role(auth.uid(), organization_id, 'admin'::app_role)
    OR has_role(auth.uid(), organization_id, 'staff'::app_role)
  )
);

CREATE POLICY "Users can view reconciliations in their organizations"
ON public.reconciliations FOR SELECT
USING (organization_id IN (SELECT user_organizations(auth.uid())));

CREATE POLICY "Staff can manage reconciliations"
ON public.reconciliations FOR ALL
USING (
  organization_id IN (SELECT user_organizations(auth.uid()))
  AND (
    has_role(auth.uid(), organization_id, 'owner'::app_role)
    OR has_role(auth.uid(), organization_id, 'admin'::app_role)
    OR has_role(auth.uid(), organization_id, 'staff'::app_role)
  )
);

CREATE TRIGGER update_bank_feeds_updated_at
  BEFORE UPDATE ON public.bank_feeds
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reconciliations_updated_at
  BEFORE UPDATE ON public.reconciliations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to match transactions
CREATE OR REPLACE FUNCTION public.fn_match_transactions(_organization_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Create helper views
CREATE OR REPLACE VIEW public.v_unmatched_bank AS
SELECT 
  bt.*,
  ba.name as bank_account_name
FROM public.bank_transactions bt
JOIN public.bank_accounts ba ON ba.id = bt.bank_account_id
WHERE bt.matched_entry_id IS NULL;

CREATE OR REPLACE VIEW public.v_uncleared_entries AS
SELECT 
  je.*,
  jl.debit,
  jl.credit
FROM public.journal_entries je
JOIN public.journal_lines jl ON jl.entry_id = je.id
WHERE NOT EXISTS (
  SELECT 1 FROM public.bank_transactions bt 
  WHERE bt.matched_entry_id = je.id
);

-- Revoke API access to helper views
REVOKE ALL ON public.v_unmatched_bank FROM anon;
REVOKE ALL ON public.v_unmatched_bank FROM authenticated;
REVOKE ALL ON public.v_uncleared_entries FROM anon;
REVOKE ALL ON public.v_uncleared_entries FROM authenticated;