-- =====================================================
-- EXPENSE & PERFORMANCE TRACKING - TABLES
-- =====================================================

-- Create expenses table
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  case_id UUID REFERENCES public.cases(id) ON DELETE SET NULL,
  vendor_id UUID,
  date DATE NOT NULL,
  amount NUMERIC(15,2) NOT NULL,
  category TEXT,
  memo TEXT,
  reimbursable BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create time_entries table
CREATE TABLE public.time_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  case_id UUID REFERENCES public.cases(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  hours NUMERIC(5,2) NOT NULL,
  rate NUMERIC(10,2),
  billable BOOLEAN DEFAULT true,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =====================================================
-- SETTLEMENT MANAGEMENT - TABLES
-- =====================================================

-- Create settlement item type enum
CREATE TYPE public.settlement_item_type AS ENUM ('fee', 'lien', 'expense', 'client');

-- Create settlements table
CREATE TABLE public.settlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  gross_amount NUMERIC(15,2) NOT NULL,
  received_date DATE,
  fee_pct NUMERIC(5,2),
  fee_amount NUMERIC(15,2),
  liens_total NUMERIC(15,2) DEFAULT 0,
  client_net NUMERIC(15,2),
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create settlement_items table
CREATE TABLE public.settlement_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  settlement_id UUID NOT NULL REFERENCES public.settlements(id) ON DELETE CASCADE,
  type public.settlement_item_type NOT NULL,
  label TEXT NOT NULL,
  amount NUMERIC(15,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =====================================================
-- DISBURSEMENT TEMPLATES - TABLES
-- =====================================================

-- Create disbursement_templates table
CREATE TABLE public.disbursement_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create disbursement_template_lines table
CREATE TABLE public.disbursement_template_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES public.disbursement_templates(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  pct NUMERIC(5,2),
  fixed_amount NUMERIC(15,2),
  account_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
  item_type public.settlement_item_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_expenses_organization ON public.expenses(organization_id);
CREATE INDEX idx_expenses_case ON public.expenses(case_id);
CREATE INDEX idx_expenses_date ON public.expenses(date);
CREATE INDEX idx_time_entries_organization ON public.time_entries(organization_id);
CREATE INDEX idx_time_entries_case ON public.time_entries(case_id);
CREATE INDEX idx_time_entries_user ON public.time_entries(user_id);
CREATE INDEX idx_time_entries_date ON public.time_entries(date);
CREATE INDEX idx_settlements_organization ON public.settlements(organization_id);
CREATE INDEX idx_settlements_case ON public.settlements(case_id);
CREATE INDEX idx_settlements_status ON public.settlements(status);
CREATE INDEX idx_settlement_items_settlement ON public.settlement_items(settlement_id);
CREATE INDEX idx_disbursement_templates_org ON public.disbursement_templates(organization_id);
CREATE INDEX idx_disbursement_template_lines_template ON public.disbursement_template_lines(template_id);

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settlement_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disbursement_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disbursement_template_lines ENABLE ROW LEVEL SECURITY;

-- RLS Policies for expenses
CREATE POLICY "Users can view expenses in their organizations"
ON public.expenses FOR SELECT
USING (organization_id IN (SELECT user_organizations(auth.uid())));

CREATE POLICY "Staff can manage expenses"
ON public.expenses FOR ALL
USING (
  organization_id IN (SELECT user_organizations(auth.uid()))
  AND (
    has_role(auth.uid(), organization_id, 'owner'::app_role)
    OR has_role(auth.uid(), organization_id, 'admin'::app_role)
    OR has_role(auth.uid(), organization_id, 'staff'::app_role)
  )
);

-- RLS Policies for time_entries
CREATE POLICY "Users can view time entries in their organizations"
ON public.time_entries FOR SELECT
USING (organization_id IN (SELECT user_organizations(auth.uid())));

CREATE POLICY "Users can create their own time entries"
ON public.time_entries FOR INSERT
WITH CHECK (
  organization_id IN (SELECT user_organizations(auth.uid()))
  AND user_id = auth.uid()
);

CREATE POLICY "Users can update their own time entries"
ON public.time_entries FOR UPDATE
USING (
  organization_id IN (SELECT user_organizations(auth.uid()))
  AND user_id = auth.uid()
);

CREATE POLICY "Admins can manage all time entries"
ON public.time_entries FOR ALL
USING (
  organization_id IN (SELECT user_organizations(auth.uid()))
  AND (
    has_role(auth.uid(), organization_id, 'owner'::app_role)
    OR has_role(auth.uid(), organization_id, 'admin'::app_role)
  )
);

-- RLS Policies for settlements
CREATE POLICY "Users can view settlements in their organizations"
ON public.settlements FOR SELECT
USING (organization_id IN (SELECT user_organizations(auth.uid())));

CREATE POLICY "Staff can manage settlements"
ON public.settlements FOR ALL
USING (
  organization_id IN (SELECT user_organizations(auth.uid()))
  AND (
    has_role(auth.uid(), organization_id, 'owner'::app_role)
    OR has_role(auth.uid(), organization_id, 'admin'::app_role)
    OR has_role(auth.uid(), organization_id, 'staff'::app_role)
  )
);

-- RLS Policies for settlement_items
CREATE POLICY "Users can view settlement items in their organizations"
ON public.settlement_items FOR SELECT
USING (
  settlement_id IN (
    SELECT id FROM public.settlements 
    WHERE organization_id IN (SELECT user_organizations(auth.uid()))
  )
);

CREATE POLICY "Staff can manage settlement items"
ON public.settlement_items FOR ALL
USING (
  settlement_id IN (
    SELECT s.id FROM public.settlements s
    WHERE s.organization_id IN (SELECT user_organizations(auth.uid()))
    AND (
      has_role(auth.uid(), s.organization_id, 'owner'::app_role)
      OR has_role(auth.uid(), s.organization_id, 'admin'::app_role)
      OR has_role(auth.uid(), s.organization_id, 'staff'::app_role)
    )
  )
);

-- RLS Policies for disbursement_templates
CREATE POLICY "Users can view templates in their organizations"
ON public.disbursement_templates FOR SELECT
USING (organization_id IN (SELECT user_organizations(auth.uid())));

CREATE POLICY "Admins can manage templates"
ON public.disbursement_templates FOR ALL
USING (
  organization_id IN (SELECT user_organizations(auth.uid()))
  AND (
    has_role(auth.uid(), organization_id, 'owner'::app_role)
    OR has_role(auth.uid(), organization_id, 'admin'::app_role)
  )
);

-- RLS Policies for disbursement_template_lines
CREATE POLICY "Users can view template lines in their organizations"
ON public.disbursement_template_lines FOR SELECT
USING (
  template_id IN (
    SELECT id FROM public.disbursement_templates 
    WHERE organization_id IN (SELECT user_organizations(auth.uid()))
  )
);

CREATE POLICY "Admins can manage template lines"
ON public.disbursement_template_lines FOR ALL
USING (
  template_id IN (
    SELECT dt.id FROM public.disbursement_templates dt
    WHERE dt.organization_id IN (SELECT user_organizations(auth.uid()))
    AND (
      has_role(auth.uid(), dt.organization_id, 'owner'::app_role)
      OR has_role(auth.uid(), dt.organization_id, 'admin'::app_role)
    )
  )
);

-- =====================================================
-- TRIGGERS
-- =====================================================

CREATE TRIGGER update_expenses_updated_at
  BEFORE UPDATE ON public.expenses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_time_entries_updated_at
  BEFORE UPDATE ON public.time_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_settlements_updated_at
  BEFORE UPDATE ON public.settlements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_disbursement_templates_updated_at
  BEFORE UPDATE ON public.disbursement_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- VIEWS (after tables exist)
-- =====================================================

-- View for case costs
CREATE OR REPLACE VIEW public.v_case_costs AS
SELECT 
  c.id as case_id,
  c.organization_id,
  c.case_no,
  COALESCE(SUM(e.amount), 0) as total_expenses,
  COALESCE(SUM(te.hours * te.rate), 0) as total_time_cost,
  COALESCE(SUM(e.amount), 0) + COALESCE(SUM(te.hours * te.rate), 0) as total_cost
FROM public.cases c
LEFT JOIN public.expenses e ON e.case_id = c.id
LEFT JOIN public.time_entries te ON te.case_id = c.id
GROUP BY c.id, c.organization_id, c.case_no;

-- View for utilization
CREATE OR REPLACE VIEW public.v_utilization AS
SELECT 
  te.organization_id,
  te.user_id,
  DATE_TRUNC('week', te.date) as week_start,
  SUM(te.hours) as total_hours,
  SUM(CASE WHEN te.billable THEN te.hours ELSE 0 END) as billable_hours,
  CASE 
    WHEN SUM(te.hours) > 0 
    THEN SUM(CASE WHEN te.billable THEN te.hours ELSE 0 END) / SUM(te.hours)
    ELSE 0 
  END as utilization_rate
FROM public.time_entries te
GROUP BY te.organization_id, te.user_id, DATE_TRUNC('week', te.date);

-- View for realization
CREATE OR REPLACE VIEW public.v_realization AS
SELECT 
  te.organization_id,
  te.case_id,
  SUM(te.hours * te.rate) as billed_amount,
  COALESCE(s.gross_amount, 0) as collected_amount,
  CASE 
    WHEN SUM(te.hours * te.rate) > 0 
    THEN COALESCE(s.gross_amount, 0) / SUM(te.hours * te.rate)
    ELSE 0 
  END as realization_rate
FROM public.time_entries te
LEFT JOIN public.cases c ON c.id = te.case_id
LEFT JOIN public.settlements s ON s.case_id = c.id
WHERE te.billable = true
GROUP BY te.organization_id, te.case_id, s.gross_amount;

-- Materialized view for weekly performance
CREATE MATERIALIZED VIEW public.mv_perf_weekly AS
SELECT 
  organization_id,
  DATE_TRUNC('week', date) as week_start,
  COUNT(DISTINCT case_id) as active_cases,
  SUM(hours) as total_hours,
  SUM(CASE WHEN billable THEN hours ELSE 0 END) as billable_hours,
  SUM(hours * rate) as total_revenue,
  AVG(CASE WHEN billable THEN rate ELSE NULL END) as avg_billable_rate
FROM public.time_entries
GROUP BY organization_id, DATE_TRUNC('week', date);

CREATE UNIQUE INDEX idx_perf_weekly_org_week ON public.mv_perf_weekly(organization_id, week_start);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to post settlement to accounting
CREATE OR REPLACE FUNCTION public.fn_post_settlement(_settlement_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
  -- Get settlement details
  SELECT * INTO _settlement
  FROM public.settlements
  WHERE id = _settlement_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Settlement not found: %', _settlement_id;
  END IF;
  
  IF _settlement.status != 'pending' THEN
    RAISE EXCEPTION 'Settlement already posted';
  END IF;
  
  -- Get account IDs
  SELECT id INTO _trust_account_id
  FROM public.accounts
  WHERE organization_id = _settlement.organization_id
    AND name ILIKE '%trust%'
    AND type = 'asset'
  LIMIT 1;
  
  SELECT id INTO _revenue_account_id
  FROM public.accounts
  WHERE organization_id = _settlement.organization_id
    AND code LIKE '4%'
    AND type = 'revenue'
  LIMIT 1;
  
  SELECT id INTO _expense_account_id
  FROM public.accounts
  WHERE organization_id = _settlement.organization_id
    AND code LIKE '5%'
    AND type = 'expense'
  LIMIT 1;
  
  SELECT id INTO _client_account_id
  FROM public.accounts
  WHERE organization_id = _settlement.organization_id
    AND code LIKE '2%'
    AND type = 'liability'
  LIMIT 1;
  
  -- Create journal entry
  INSERT INTO public.journal_entries (organization_id, entry_date, case_id, created_by, memo)
  VALUES (
    _settlement.organization_id,
    COALESCE(_settlement.received_date, CURRENT_DATE),
    _settlement.case_id,
    auth.uid(),
    'Settlement posting for case ' || (SELECT case_no FROM public.cases WHERE id = _settlement.case_id)
  )
  RETURNING id INTO _entry_id;
  
  -- Debit trust account for gross amount received
  INSERT INTO public.journal_lines (entry_id, account_id, debit, credit)
  VALUES (_entry_id, _trust_account_id, _settlement.gross_amount, 0);
  
  -- Process settlement items
  FOR _item IN 
    SELECT * FROM public.settlement_items WHERE settlement_id = _settlement_id
  LOOP
    CASE _item.type
      WHEN 'fee' THEN
        INSERT INTO public.journal_lines (entry_id, account_id, debit, credit)
        VALUES (_entry_id, _revenue_account_id, 0, _item.amount);
      WHEN 'lien' THEN
        INSERT INTO public.journal_lines (entry_id, account_id, debit, credit)
        VALUES (_entry_id, _expense_account_id, 0, _item.amount);
      WHEN 'expense' THEN
        INSERT INTO public.journal_lines (entry_id, account_id, debit, credit)
        VALUES (_entry_id, _expense_account_id, 0, _item.amount);
      WHEN 'client' THEN
        INSERT INTO public.journal_lines (entry_id, account_id, debit, credit)
        VALUES (_entry_id, _client_account_id, 0, _item.amount);
    END CASE;
  END LOOP;
  
  -- Update settlement status
  UPDATE public.settlements
  SET status = 'posted'
  WHERE id = _settlement_id;
  
  RAISE NOTICE 'Settlement % posted successfully', _settlement_id;
END;
$$;

-- Function to apply disbursement template
CREATE OR REPLACE FUNCTION public.fn_apply_disbursement_template(
  _settlement_id UUID,
  _template_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _settlement RECORD;
  _line RECORD;
  _calculated_amount NUMERIC(15,2);
BEGIN
  -- Get settlement details
  SELECT * INTO _settlement
  FROM public.settlements
  WHERE id = _settlement_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Settlement not found: %', _settlement_id;
  END IF;
  
  -- Clear existing items
  DELETE FROM public.settlement_items WHERE settlement_id = _settlement_id;
  
  -- Apply template lines
  FOR _line IN 
    SELECT * FROM public.disbursement_template_lines 
    WHERE template_id = _template_id
  LOOP
    -- Calculate amount based on percentage or fixed
    IF _line.pct IS NOT NULL THEN
      _calculated_amount := (_settlement.gross_amount * _line.pct / 100);
    ELSE
      _calculated_amount := _line.fixed_amount;
    END IF;
    
    -- Insert settlement item
    INSERT INTO public.settlement_items (settlement_id, type, label, amount)
    VALUES (_settlement_id, _line.item_type, _line.label, _calculated_amount);
  END LOOP;
  
  -- Update settlement totals
  UPDATE public.settlements
  SET 
    fee_amount = (SELECT COALESCE(SUM(amount), 0) FROM public.settlement_items WHERE settlement_id = _settlement_id AND type = 'fee'),
    liens_total = (SELECT COALESCE(SUM(amount), 0) FROM public.settlement_items WHERE settlement_id = _settlement_id AND type = 'lien'),
    client_net = (SELECT COALESCE(SUM(amount), 0) FROM public.settlement_items WHERE settlement_id = _settlement_id AND type = 'client')
  WHERE id = _settlement_id;
  
  RAISE NOTICE 'Template applied to settlement %', _settlement_id;
END;
$$;