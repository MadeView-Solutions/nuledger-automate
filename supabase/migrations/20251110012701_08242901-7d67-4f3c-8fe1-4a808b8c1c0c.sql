-- ============================================================
-- Seed Initial Organization
-- ============================================================

-- 1. Create Demo Organization
INSERT INTO public.organizations (id, name, slug)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Demo Law Firm',
  'demo-law-firm'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug;

-- 2. Create Organization Preferences
INSERT INTO public.preferences (
  organization_id,
  fiscal_start_month,
  currency,
  timezone,
  number_format,
  case_prefix
) VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  1,
  'USD',
  'America/New_York',
  'en-US',
  'DEMO'
)
ON CONFLICT (organization_id) DO UPDATE SET
  fiscal_start_month = EXCLUDED.fiscal_start_month,
  currency = EXCLUDED.currency,
  timezone = EXCLUDED.timezone,
  number_format = EXCLUDED.number_format,
  case_prefix = EXCLUDED.case_prefix;

-- 3. Load Chart of Accounts from Templates
INSERT INTO public.accounts (
  organization_id, 
  code, 
  name, 
  type, 
  is_active,
  currency
)
SELECT 
  '00000000-0000-0000-0000-000000000001'::uuid,
  code,
  name,
  type,
  true,
  'USD'
FROM public.account_templates
WHERE practice_area = 'Personal Injury'
ON CONFLICT DO NOTHING;

-- 4. Create Bank Accounts
DO $$
DECLARE
  _org_id UUID := '00000000-0000-0000-0000-000000000001';
BEGIN
  -- Trust Account
  INSERT INTO public.bank_accounts (
    organization_id,
    name,
    type,
    institution,
    last4,
    account_id
  )
  SELECT
    _org_id,
    'Client Trust Account',
    'trust',
    'Demo Bank',
    '1234',
    a.id
  FROM public.accounts a
  WHERE a.organization_id = _org_id 
    AND a.code = '1010'
  LIMIT 1
  ON CONFLICT DO NOTHING;

  -- Operating Account
  INSERT INTO public.bank_accounts (
    organization_id,
    name,
    type,
    institution,
    last4,
    account_id
  )
  SELECT
    _org_id,
    'Operating Account',
    'operating',
    'Demo Bank',
    '5678',
    a.id
  FROM public.accounts a
  WHERE a.organization_id = _org_id 
    AND a.code = '1020'
  LIMIT 1
  ON CONFLICT DO NOTHING;
END $$;

-- 5. Create Default Test Scenario
INSERT INTO public.test_scenarios (
  id,
  organization_id,
  name,
  description,
  seed_jsonb
) VALUES (
  '00000000-0000-0000-0000-000000000099'::uuid,
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Comprehensive Training Scenario',
  'Full test dataset including clients, cases, settlements, and transactions',
  jsonb_build_object(
    'clients', 25,
    'cases', 50,
    'settlements', 15
  )
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  seed_jsonb = EXCLUDED.seed_jsonb;