-- ============================================================
-- NuLedger Training Organization Seed Script
-- ============================================================
-- This script creates an initial organization with users, roles,
-- and a complete chart of accounts for testing and training.
--
-- IMPORTANT: Run this in a training/demo environment only!
-- ============================================================

-- Step 1: Create Training Organization
-- ============================================================
INSERT INTO public.organizations (id, name, slug)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Demo Law Firm',
  'demo-law-firm'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug;

-- Step 2: Create Demo User Accounts
-- ============================================================
-- MANUAL STEP REQUIRED:
-- Before running the rest of this script, create users in Supabase Auth:
-- 1. Go to Authentication → Users → Add User
-- 2. Create 3 users:
--    - owner@demolawfirm.com (Owner)
--    - admin@demolawfirm.com (Admin)
--    - staff@demolawfirm.com (Staff)
-- 3. Copy their UUIDs and replace in the INSERT statements below
-- ============================================================

-- Replace these UUIDs with actual user IDs after creating accounts:
DO $$
DECLARE
  _owner_id UUID := NULL;  -- Replace with actual UUID from Supabase Auth
  _admin_id UUID := NULL;  -- Replace with actual UUID from Supabase Auth
  _staff_id UUID := NULL;  -- Replace with actual UUID from Supabase Auth
  _org_id UUID := '00000000-0000-0000-0000-000000000001';
BEGIN
  -- Skip if user IDs not set
  IF _owner_id IS NULL OR _admin_id IS NULL OR _staff_id IS NULL THEN
    RAISE NOTICE 'SKIPPING user role assignment - please set user UUIDs in script';
    RAISE NOTICE 'Create users in Supabase Auth first, then update this script';
    RETURN;
  END IF;

  -- Add organization members
  INSERT INTO public.org_members (organization_id, user_id)
  VALUES 
    (_org_id, _owner_id),
    (_org_id, _admin_id),
    (_org_id, _staff_id)
  ON CONFLICT (organization_id, user_id) DO NOTHING;

  -- Assign roles
  INSERT INTO public.user_roles (user_id, organization_id, role)
  VALUES
    (_owner_id, _org_id, 'owner'::app_role),
    (_admin_id, _org_id, 'admin'::app_role),
    (_staff_id, _org_id, 'staff'::app_role)
  ON CONFLICT (user_id, organization_id, role) DO NOTHING;

  RAISE NOTICE 'Successfully assigned roles to users';
END $$;

-- Step 3: Create Organization Preferences
-- ============================================================
INSERT INTO public.preferences (
  organization_id,
  fiscal_start_month,
  currency,
  timezone,
  number_format,
  case_prefix
) VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  1,                    -- January
  'USD',                -- US Dollars
  'America/New_York',   -- Eastern Time
  'en-US',              -- US number format
  'DEMO'                -- Case prefix: DEMO-00001
)
ON CONFLICT (organization_id) DO UPDATE SET
  fiscal_start_month = EXCLUDED.fiscal_start_month,
  currency = EXCLUDED.currency,
  timezone = EXCLUDED.timezone,
  number_format = EXCLUDED.number_format,
  case_prefix = EXCLUDED.case_prefix;

-- Step 4: Load Chart of Accounts
-- ============================================================
-- Load Personal Injury practice area accounts
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

-- Add additional common accounts
INSERT INTO public.accounts (organization_id, code, name, type, is_active, currency) VALUES
  ('00000000-0000-0000-0000-000000000001', '1500', 'Office Equipment', 'asset', true, 'USD'),
  ('00000000-0000-0000-0000-000000000001', '1600', 'Accumulated Depreciation', 'asset', true, 'USD'),
  ('00000000-0000-0000-0000-000000000001', '2200', 'Payroll Liabilities', 'liability', true, 'USD'),
  ('00000000-0000-0000-0000-000000000001', '3000', 'Owner\'s Equity', 'equity', true, 'USD'),
  ('00000000-0000-0000-0000-000000000001', '3100', 'Retained Earnings', 'equity', true, 'USD'),
  ('00000000-0000-0000-0000-000000000001', '4200', 'Referral Fees Income', 'revenue', true, 'USD'),
  ('00000000-0000-0000-0000-000000000001', '5200', 'Office Rent', 'expense', true, 'USD'),
  ('00000000-0000-0000-0000-000000000001', '5300', 'Utilities', 'expense', true, 'USD'),
  ('00000000-0000-0000-0000-000000000001', '5400', 'Professional Development', 'expense', true, 'USD'),
  ('00000000-0000-0000-0000-000000000001', '5500', 'Marketing & Advertising', 'expense', true, 'USD')
ON CONFLICT DO NOTHING;

-- Step 5: Create Bank Accounts
-- ============================================================
DO $$
DECLARE
  _org_id UUID := '00000000-0000-0000-0000-000000000001';
  _trust_account_id UUID;
  _operating_account_id UUID;
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
  ON CONFLICT DO NOTHING
  RETURNING id INTO _trust_account_id;

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
  ON CONFLICT DO NOTHING
  RETURNING id INTO _operating_account_id;

  RAISE NOTICE 'Created trust account: % and operating account: %', 
    _trust_account_id, _operating_account_id;
END $$;

-- Step 6: Create Default Test Scenario
-- ============================================================
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
    'bank_accounts', 0, -- Already created above
    'settlements', 15
  )
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  seed_jsonb = EXCLUDED.seed_jsonb;

-- Step 7: Execute Test Scenario (Optional - Uncomment to run)
-- ============================================================
-- WARNING: This creates 25 clients, 50 cases, and 15 settlements
-- Uncomment the line below to generate test data:

-- SELECT public.fn_seed_scenario('00000000-0000-0000-0000-000000000099'::uuid);

-- Step 8: Create Sample Disbursement Template
-- ============================================================
DO $$
DECLARE
  _org_id UUID := '00000000-0000-0000-0000-000000000001';
  _template_id UUID;
  _fee_account_id UUID;
  _expense_account_id UUID;
  _client_liability_id UUID;
BEGIN
  -- Get account IDs
  SELECT id INTO _fee_account_id 
  FROM public.accounts 
  WHERE organization_id = _org_id AND code = '4100' LIMIT 1;
  
  SELECT id INTO _expense_account_id 
  FROM public.accounts 
  WHERE organization_id = _org_id AND code = '5100' LIMIT 1;
  
  SELECT id INTO _client_liability_id 
  FROM public.accounts 
  WHERE organization_id = _org_id AND code = '2100' LIMIT 1;

  -- Create template
  INSERT INTO public.disbursement_templates (
    organization_id,
    name
  ) VALUES (
    _org_id,
    'Standard Personal Injury - 33.33%'
  )
  RETURNING id INTO _template_id;

  -- Add template lines
  INSERT INTO public.disbursement_template_lines (
    template_id,
    item_type,
    label,
    pct,
    account_id
  ) VALUES
    (_template_id, 'fee'::settlement_item_type, 'Attorney Fees (33.33%)', 33.33, _fee_account_id),
    (_template_id, 'lien'::settlement_item_type, 'Medical Liens', NULL, _expense_account_id),
    (_template_id, 'expense'::settlement_item_type, 'Case Expenses', NULL, _expense_account_id),
    (_template_id, 'client'::settlement_item_type, 'Client Net Proceeds', NULL, _client_liability_id);

  RAISE NOTICE 'Created disbursement template: %', _template_id;
END $$;

-- Step 9: Add Sample AI Rules
-- ============================================================
DO $$
DECLARE
  _org_id UUID := '00000000-0000-0000-0000-000000000001';
  _office_expense_id UUID;
  _travel_expense_id UUID;
BEGIN
  -- Get expense account IDs
  SELECT id INTO _office_expense_id 
  FROM public.accounts 
  WHERE organization_id = _org_id AND name ILIKE '%office%expense%' LIMIT 1;
  
  SELECT id INTO _travel_expense_id 
  FROM public.accounts 
  WHERE organization_id = _org_id AND name ILIKE '%case%expense%' LIMIT 1;

  -- Create AI categorization rules
  INSERT INTO public.ai_rules (
    organization_id,
    name,
    match_jsonb,
    action_jsonb,
    is_active
  ) VALUES
    (
      _org_id,
      'Office Supplies Rule',
      jsonb_build_object('vendor', 'Staples'),
      jsonb_build_object('account_id', _office_expense_id),
      true
    ),
    (
      _org_id,
      'Travel Expenses Rule',
      jsonb_build_object('vendor', 'Uber'),
      jsonb_build_object('account_id', _travel_expense_id),
      true
    );

  RAISE NOTICE 'Created AI categorization rules';
END $$;

-- Step 10: Verification Queries
-- ============================================================
DO $$
DECLARE
  _org_id UUID := '00000000-0000-0000-0000-000000000001';
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'SEED SCRIPT COMPLETED';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Organization: %', (SELECT name FROM public.organizations WHERE id = _org_id);
  RAISE NOTICE 'Accounts created: %', (SELECT COUNT(*) FROM public.accounts WHERE organization_id = _org_id);
  RAISE NOTICE 'Bank accounts: %', (SELECT COUNT(*) FROM public.bank_accounts WHERE organization_id = _org_id);
  RAISE NOTICE 'Disbursement templates: %', (SELECT COUNT(*) FROM public.disbursement_templates WHERE organization_id = _org_id);
  RAISE NOTICE 'AI rules: %', (SELECT COUNT(*) FROM public.ai_rules WHERE organization_id = _org_id);
  RAISE NOTICE '========================================';
  RAISE NOTICE 'NEXT STEPS:';
  RAISE NOTICE '1. Create users in Supabase Auth';
  RAISE NOTICE '2. Update user UUIDs in Step 2 of this script';
  RAISE NOTICE '3. Re-run Step 2 to assign roles';
  RAISE NOTICE '4. Uncomment Step 7 to generate test data';
  RAISE NOTICE '========================================';
END $$;

-- ============================================================
-- Optional: Verify Setup
-- ============================================================

-- Uncomment to see summary:
/*
SELECT 
  'Organizations' as entity,
  COUNT(*)::text as count
FROM public.organizations
WHERE id = '00000000-0000-0000-0000-000000000001'

UNION ALL

SELECT 
  'Accounts' as entity,
  COUNT(*)::text as count
FROM public.accounts
WHERE organization_id = '00000000-0000-0000-0000-000000000001'

UNION ALL

SELECT 
  'Bank Accounts' as entity,
  COUNT(*)::text as count
FROM public.bank_accounts
WHERE organization_id = '00000000-0000-0000-0000-000000000001'

UNION ALL

SELECT 
  'Users with Roles' as entity,
  COUNT(*)::text as count
FROM public.user_roles
WHERE organization_id = '00000000-0000-0000-0000-000000000001'

UNION ALL

SELECT 
  'Test Scenarios' as entity,
  COUNT(*)::text as count
FROM public.test_scenarios
WHERE organization_id = '00000000-0000-0000-0000-000000000001';
*/
