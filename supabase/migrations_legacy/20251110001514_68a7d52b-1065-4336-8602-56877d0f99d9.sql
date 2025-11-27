-- Create clients table (if not exists)
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cases table
CREATE TABLE IF NOT EXISTS public.cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  case_no TEXT NOT NULL,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'open',
  practice_area TEXT,
  opened_on DATE NOT NULL DEFAULT CURRENT_DATE,
  settled_on DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(organization_id, case_no)
);

-- Create case_accounts mapping table
CREATE TABLE IF NOT EXISTS public.case_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  trust_account_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
  operating_account_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(case_id)
);

-- Add case_id to journal_entries for case-level tracking (only if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'journal_entries' 
    AND column_name = 'case_id'
  ) THEN
    ALTER TABLE public.journal_entries
    ADD COLUMN case_id UUID REFERENCES public.cases(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clients_organization ON public.clients(organization_id);
CREATE INDEX IF NOT EXISTS idx_cases_organization ON public.cases(organization_id);
CREATE INDEX IF NOT EXISTS idx_cases_client ON public.cases(client_id);
CREATE INDEX IF NOT EXISTS idx_cases_status ON public.cases(status);
CREATE INDEX IF NOT EXISTS idx_journal_entries_case ON public.journal_entries(case_id);

-- Enable RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_accounts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for clients
DROP POLICY IF EXISTS "Users can view clients in their organizations" ON public.clients;
CREATE POLICY "Users can view clients in their organizations"
ON public.clients FOR SELECT
USING (organization_id IN (SELECT user_organizations(auth.uid())));

DROP POLICY IF EXISTS "Staff can create clients" ON public.clients;
CREATE POLICY "Staff can create clients"
ON public.clients FOR INSERT
WITH CHECK (
  organization_id IN (SELECT user_organizations(auth.uid()))
  AND (
    has_role(auth.uid(), organization_id, 'owner'::app_role)
    OR has_role(auth.uid(), organization_id, 'admin'::app_role)
    OR has_role(auth.uid(), organization_id, 'staff'::app_role)
  )
);

DROP POLICY IF EXISTS "Staff can update clients" ON public.clients;
CREATE POLICY "Staff can update clients"
ON public.clients FOR UPDATE
USING (
  organization_id IN (SELECT user_organizations(auth.uid()))
  AND (
    has_role(auth.uid(), organization_id, 'owner'::app_role)
    OR has_role(auth.uid(), organization_id, 'admin'::app_role)
    OR has_role(auth.uid(), organization_id, 'staff'::app_role)
  )
);

DROP POLICY IF EXISTS "Admins can delete clients" ON public.clients;
CREATE POLICY "Admins can delete clients"
ON public.clients FOR DELETE
USING (
  has_role(auth.uid(), organization_id, 'owner'::app_role)
  OR has_role(auth.uid(), organization_id, 'admin'::app_role)
);

-- RLS Policies for cases
DROP POLICY IF EXISTS "Users can view cases in their organizations" ON public.cases;
CREATE POLICY "Users can view cases in their organizations"
ON public.cases FOR SELECT
USING (organization_id IN (SELECT user_organizations(auth.uid())));

DROP POLICY IF EXISTS "Staff can create cases" ON public.cases;
CREATE POLICY "Staff can create cases"
ON public.cases FOR INSERT
WITH CHECK (
  organization_id IN (SELECT user_organizations(auth.uid()))
  AND (
    has_role(auth.uid(), organization_id, 'owner'::app_role)
    OR has_role(auth.uid(), organization_id, 'admin'::app_role)
    OR has_role(auth.uid(), organization_id, 'staff'::app_role)
  )
);

DROP POLICY IF EXISTS "Staff can update cases" ON public.cases;
CREATE POLICY "Staff can update cases"
ON public.cases FOR UPDATE
USING (
  organization_id IN (SELECT user_organizations(auth.uid()))
  AND (
    has_role(auth.uid(), organization_id, 'owner'::app_role)
    OR has_role(auth.uid(), organization_id, 'admin'::app_role)
    OR has_role(auth.uid(), organization_id, 'staff'::app_role)
  )
);

DROP POLICY IF EXISTS "Admins can delete cases" ON public.cases;
CREATE POLICY "Admins can delete cases"
ON public.cases FOR DELETE
USING (
  has_role(auth.uid(), organization_id, 'owner'::app_role)
  OR has_role(auth.uid(), organization_id, 'admin'::app_role)
);

-- RLS Policies for case_accounts
DROP POLICY IF EXISTS "Users can view case accounts in their organizations" ON public.case_accounts;
CREATE POLICY "Users can view case accounts in their organizations"
ON public.case_accounts FOR SELECT
USING (
  case_id IN (
    SELECT id FROM public.cases 
    WHERE organization_id IN (SELECT user_organizations(auth.uid()))
  )
);

DROP POLICY IF EXISTS "Staff can manage case accounts" ON public.case_accounts;
CREATE POLICY "Staff can manage case accounts"
ON public.case_accounts FOR ALL
USING (
  case_id IN (
    SELECT c.id FROM public.cases c
    WHERE c.organization_id IN (SELECT user_organizations(auth.uid()))
    AND (
      has_role(auth.uid(), c.organization_id, 'owner'::app_role)
      OR has_role(auth.uid(), c.organization_id, 'admin'::app_role)
      OR has_role(auth.uid(), c.organization_id, 'staff'::app_role)
    )
  )
);

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_clients_updated_at ON public.clients;
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_cases_updated_at ON public.cases;
CREATE TRIGGER update_cases_updated_at
  BEFORE UPDATE ON public.cases
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();