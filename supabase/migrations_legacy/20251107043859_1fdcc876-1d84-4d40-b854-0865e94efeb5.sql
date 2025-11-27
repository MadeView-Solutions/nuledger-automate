-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('owner', 'admin', 'staff', 'read_only');

-- Create account_type enum for chart of accounts
CREATE TYPE public.account_type AS ENUM ('asset', 'liability', 'equity', 'revenue', 'expense');

-- Organizations table
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- Organization members table
CREATE TABLE public.org_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(organization_id, user_id)
);

ALTER TABLE public.org_members ENABLE ROW LEVEL SECURITY;

-- User roles table (separate from org_members for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, organization_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check if user has role in org
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _org_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND organization_id = _org_id
      AND role = _role
  )
$$;

-- Helper function to get user's organizations
CREATE OR REPLACE FUNCTION public.user_organizations(_user_id UUID)
RETURNS SETOF UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT organization_id
  FROM public.org_members
  WHERE user_id = _user_id
$$;

-- Chart of Accounts
CREATE TABLE public.accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  type public.account_type NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  parent_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(organization_id, code)
);

ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;

-- Journal Entries
CREATE TABLE public.journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  memo TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

-- Journal Lines (double-entry)
CREATE TABLE public.journal_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID NOT NULL REFERENCES public.journal_entries(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES public.accounts(id),
  debit NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (debit >= 0),
  credit NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (credit >= 0),
  CHECK (debit = 0 OR credit = 0)
);

ALTER TABLE public.journal_lines ENABLE ROW LEVEL SECURITY;

-- Trigger to enforce balanced entries (SUM(dr) = SUM(cr))
CREATE OR REPLACE FUNCTION public.validate_journal_balance()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

CREATE CONSTRAINT TRIGGER validate_journal_balance_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.journal_lines
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION public.validate_journal_balance();

-- RLS Policies for organizations
CREATE POLICY "Users can view their organizations"
  ON public.organizations FOR SELECT
  TO authenticated
  USING (id IN (SELECT public.user_organizations(auth.uid())));

CREATE POLICY "Owners can update their organizations"
  ON public.organizations FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), id, 'owner'));

-- RLS Policies for org_members
CREATE POLICY "Users can view members of their organizations"
  ON public.org_members FOR SELECT
  TO authenticated
  USING (organization_id IN (SELECT public.user_organizations(auth.uid())));

CREATE POLICY "Admins and owners can manage members"
  ON public.org_members FOR ALL
  TO authenticated
  USING (
    public.has_role(auth.uid(), organization_id, 'owner') OR
    public.has_role(auth.uid(), organization_id, 'admin')
  );

-- RLS Policies for user_roles
CREATE POLICY "Users can view roles in their organizations"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (organization_id IN (SELECT public.user_organizations(auth.uid())));

CREATE POLICY "Only owners can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), organization_id, 'owner'));

-- RLS Policies for accounts
CREATE POLICY "Users can view accounts in their organizations"
  ON public.accounts FOR SELECT
  TO authenticated
  USING (organization_id IN (SELECT public.user_organizations(auth.uid())));

CREATE POLICY "Admins can manage accounts"
  ON public.accounts FOR ALL
  TO authenticated
  USING (
    public.has_role(auth.uid(), organization_id, 'owner') OR
    public.has_role(auth.uid(), organization_id, 'admin')
  );

-- RLS Policies for journal_entries
CREATE POLICY "Users can view journal entries in their organizations"
  ON public.journal_entries FOR SELECT
  TO authenticated
  USING (organization_id IN (SELECT public.user_organizations(auth.uid())));

CREATE POLICY "Staff can create journal entries"
  ON public.journal_entries FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (SELECT public.user_organizations(auth.uid())) AND
    (public.has_role(auth.uid(), organization_id, 'owner') OR
     public.has_role(auth.uid(), organization_id, 'admin') OR
     public.has_role(auth.uid(), organization_id, 'staff'))
  );

CREATE POLICY "Admins can update journal entries"
  ON public.journal_entries FOR UPDATE
  TO authenticated
  USING (
    public.has_role(auth.uid(), organization_id, 'owner') OR
    public.has_role(auth.uid(), organization_id, 'admin')
  );

-- RLS Policies for journal_lines
CREATE POLICY "Users can view journal lines in their organizations"
  ON public.journal_lines FOR SELECT
  TO authenticated
  USING (
    entry_id IN (
      SELECT id FROM public.journal_entries
      WHERE organization_id IN (SELECT public.user_organizations(auth.uid()))
    )
  );

CREATE POLICY "Staff can manage journal lines"
  ON public.journal_lines FOR ALL
  TO authenticated
  USING (
    entry_id IN (
      SELECT je.id FROM public.journal_entries je
      WHERE je.organization_id IN (SELECT public.user_organizations(auth.uid()))
      AND (
        public.has_role(auth.uid(), je.organization_id, 'owner') OR
        public.has_role(auth.uid(), je.organization_id, 'admin') OR
        public.has_role(auth.uid(), je.organization_id, 'staff')
      )
    )
  );

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('attachments', 'attachments', false),
  ('exports', 'exports', false),
  ('templates', 'templates', false);

-- Storage RLS policies for attachments bucket (with proper type casting)
CREATE POLICY "Users can view attachments in their organizations"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'attachments' AND
    (storage.foldername(name))[1] IN (SELECT public.user_organizations(auth.uid())::text)
  );

CREATE POLICY "Staff can upload attachments"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'attachments' AND
    (storage.foldername(name))[1] IN (SELECT public.user_organizations(auth.uid())::text)
  );

-- Storage RLS policies for exports bucket
CREATE POLICY "Users can view exports in their organizations"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'exports' AND
    (storage.foldername(name))[1] IN (SELECT public.user_organizations(auth.uid())::text)
  );

CREATE POLICY "Admins can upload exports"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'exports' AND
    (storage.foldername(name))[1] IN (SELECT public.user_organizations(auth.uid())::text)
  );

-- Storage RLS policies for templates bucket
CREATE POLICY "Users can view templates in their organizations"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'templates' AND
    (storage.foldername(name))[1] IN (SELECT public.user_organizations(auth.uid())::text)
  );

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Apply updated_at triggers
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_accounts_updated_at
  BEFORE UPDATE ON public.accounts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_journal_entries_updated_at
  BEFORE UPDATE ON public.journal_entries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();