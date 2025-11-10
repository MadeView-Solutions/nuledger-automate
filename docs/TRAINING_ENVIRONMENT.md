# Training Environment Setup Guide

This guide explains how to set up a training/demo environment for NuLedger with realistic test data.

## Overview

The training environment is a duplicate Supabase project with:
- Same schema as production
- Mock data generated via `fn_seed_scenario()`
- Safe for testing, demos, and training
- Isolated from production data

---

## Step 1: Create Training Project

### Option A: Manual Duplication

1. **Create New Supabase Project**
   - Go to https://supabase.com/dashboard
   - Click "New Project"
   - Name: `nuledger-training` or `nuledger-demo`
   - Choose same region as production for consistency

2. **Apply Schema Migrations**
   ```bash
   # Clone your repository
   git clone <your-repo-url>
   cd nuledger
   
   # Install Supabase CLI
   npm install -g supabase
   
   # Link to training project
   supabase link --project-ref <training-project-ref>
   
   # Apply all migrations
   supabase db push
   ```

3. **Configure Environment Variables**
   - Copy secrets from production (except use training-specific tokens)
   - Go to Project Settings → Edge Functions → Environment Variables
   - Add: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, etc.

### Option B: Using Supabase Branching (Beta)

```bash
# Create a preview branch
supabase branches create training

# Apply migrations
supabase db push --branch training
```

---

## Step 2: Seed Initial Organization & Users

Run this SQL in the training project's SQL Editor:

```sql
-- Create training organization
INSERT INTO public.organizations (id, name, slug)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Demo Law Firm',
  'demo-law-firm'
);

-- Create demo users (requires Auth UI or manual user creation)
-- After creating users in Supabase Auth, add their roles:

-- Replace 'user-uuid-1', 'user-uuid-2', etc. with actual user IDs
INSERT INTO public.user_roles (user_id, organization_id, role) VALUES
  ('user-uuid-1', '00000000-0000-0000-0000-000000000001', 'owner'),
  ('user-uuid-2', '00000000-0000-0000-0000-000000000001', 'admin'),
  ('user-uuid-3', '00000000-0000-0000-0000-000000000001', 'staff');

-- Add organization members
INSERT INTO public.org_members (organization_id, user_id) VALUES
  ('00000000-0000-0000-0000-000000000001', 'user-uuid-1'),
  ('00000000-0000-0000-0000-000000000001', 'user-uuid-2'),
  ('00000000-0000-0000-0000-000000000001', 'user-uuid-3');

-- Create preferences for the organization
INSERT INTO public.preferences (
  organization_id,
  fiscal_start_month,
  currency,
  timezone,
  case_prefix
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  1,
  'USD',
  'America/New_York',
  'DEMO'
);

-- Set up chart of accounts (Personal Injury practice)
INSERT INTO public.accounts (organization_id, code, name, type, is_active)
SELECT 
  '00000000-0000-0000-0000-000000000001',
  code,
  name,
  type,
  true
FROM public.account_templates
WHERE practice_area = 'Personal Injury';
```

---

## Step 3: Generate Test Scenarios

### Create Default Test Scenario

```sql
-- Create comprehensive test scenario
INSERT INTO public.test_scenarios (
  id,
  organization_id,
  name,
  description,
  seed_jsonb
) VALUES (
  '00000000-0000-0000-0000-000000000099',
  '00000000-0000-0000-0000-000000000001',
  'Default Training Scenario',
  'Comprehensive test data for training and demos',
  '{
    "clients": 25,
    "cases": 50,
    "bank_accounts": 3,
    "settlements": 15
  }'::jsonb
);
```

### Execute Seed Function

```sql
-- Generate all test data
SELECT public.fn_seed_scenario('00000000-0000-0000-0000-000000000099');

-- Check results
SELECT 
  passed,
  started_at,
  completed_at,
  log
FROM public.test_runs
WHERE scenario_id = '00000000-0000-0000-0000-000000000099'
ORDER BY started_at DESC
LIMIT 1;
```

---

## Step 4: Add Sample Journal Entries

After running seed scenario, add accounting transactions:

```sql
-- Helper function to create trust deposits for test cases
DO $$
DECLARE
  _case RECORD;
  _org_id UUID := '00000000-0000-0000-0000-000000000001';
BEGIN
  -- For each open case, create a trust deposit
  FOR _case IN 
    SELECT id, case_no 
    FROM public.cases 
    WHERE organization_id = _org_id 
    AND status = 'open'
    LIMIT 10
  LOOP
    -- Create trust deposit of $5,000 per case
    PERFORM public.fn_trust_deposit(
      _org_id,
      _case.id,
      5000.00,
      'Initial trust deposit for ' || _case.case_no
    );
  END LOOP;
END $$;
```

---

## Step 5: Configure Test Integrations

### Filevine (Optional)
Use Filevine sandbox credentials:
```bash
FILEVINE_CLIENT_ID=test-client-id
FILEVINE_CLIENT_SECRET=test-secret
FILEVINE_PAT=sandbox-token
```

### Plaid Banking
Use Plaid Sandbox mode:
```bash
PLAID_CLIENT_ID=your-sandbox-client-id
PLAID_SECRET=your-sandbox-secret
PLAID_ENV=sandbox
```

In Plaid Sandbox, you can use test credentials:
- Username: `user_good`
- Password: `pass_good`

---

## Step 6: Verify Training Environment

### Check Data Integrity

```sql
-- Verify organizations
SELECT * FROM public.organizations;

-- Verify roles and members
SELECT 
  o.name as org_name,
  ur.role,
  om.user_id
FROM public.organizations o
LEFT JOIN public.user_roles ur ON ur.organization_id = o.id
LEFT JOIN public.org_members om ON om.organization_id = o.id;

-- Check test data counts
SELECT 
  (SELECT COUNT(*) FROM public.clients WHERE organization_id = '00000000-0000-0000-0000-000000000001') as clients,
  (SELECT COUNT(*) FROM public.cases WHERE organization_id = '00000000-0000-0000-0000-000000000001') as cases,
  (SELECT COUNT(*) FROM public.settlements WHERE organization_id = '00000000-0000-0000-0000-000000000001') as settlements,
  (SELECT COUNT(*) FROM public.bank_accounts WHERE organization_id = '00000000-0000-0000-0000-000000000001') as bank_accounts;

-- Verify journal entries
SELECT COUNT(*) FROM public.journal_entries WHERE organization_id = '00000000-0000-0000-0000-000000000001';

-- Check trust balances
SELECT 
  a.name,
  COALESCE(SUM(jl.debit - jl.credit), 0) as balance
FROM public.accounts a
LEFT JOIN public.journal_lines jl ON jl.account_id = a.id
LEFT JOIN public.journal_entries je ON je.id = jl.entry_id
WHERE a.organization_id = '00000000-0000-0000-0000-000000000001'
  AND a.type = 'asset'
GROUP BY a.id, a.name;
```

### Test Edge Functions

```bash
# Test refresh-kpis
curl -X POST \
  https://<training-project-ref>.supabase.co/functions/v1/refresh-kpis \
  -H "Authorization: Bearer <anon-key>"

# Test ai-categorize
curl -X POST \
  https://<training-project-ref>.supabase.co/functions/v1/ai-categorize \
  -H "Authorization: Bearer <anon-key>" \
  -H "Content-Type: application/json" \
  -d '{
    "transaction": {
      "id": "test-123",
      "description": "Office Supplies from Staples",
      "amount": 150.00
    },
    "organizationId": "00000000-0000-0000-0000-000000000001"
  }'
```

---

## Step 7: Frontend Configuration

Update your frontend `.env` file:

```bash
# Training Environment
VITE_SUPABASE_URL=https://<training-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<training-anon-key>
```

Or create a separate deployment:
```bash
# Deploy to different domain
npm run build
# Deploy to training.nuledger.com or demo.nuledger.com
```

---

## Maintenance & Refresh

### Reset Training Data

```sql
-- WARNING: This deletes all data for the training org
DO $$
DECLARE
  _org_id UUID := '00000000-0000-0000-0000-000000000001';
BEGIN
  -- Delete in order to respect foreign keys
  DELETE FROM public.journal_lines 
  WHERE entry_id IN (SELECT id FROM public.journal_entries WHERE organization_id = _org_id);
  
  DELETE FROM public.journal_entries WHERE organization_id = _org_id;
  DELETE FROM public.settlement_items 
  WHERE settlement_id IN (SELECT id FROM public.settlements WHERE organization_id = _org_id);
  
  DELETE FROM public.settlements WHERE organization_id = _org_id;
  DELETE FROM public.expenses WHERE organization_id = _org_id;
  DELETE FROM public.cases WHERE organization_id = _org_id;
  DELETE FROM public.clients WHERE organization_id = _org_id;
  DELETE FROM public.bank_transactions WHERE organization_id = _org_id;
  DELETE FROM public.bank_accounts WHERE organization_id = _org_id;
  
  -- Re-run seed scenario
  PERFORM public.fn_seed_scenario('00000000-0000-0000-0000-000000000099');
END $$;
```

### Schedule Automatic Refresh

Create a Supabase edge function with cron trigger:

```sql
-- Run weekly data refresh
SELECT cron.schedule(
  'refresh-training-data',
  '0 2 * * 0', -- Every Sunday at 2 AM
  $$
  SELECT public.fn_seed_scenario('00000000-0000-0000-0000-000000000099');
  $$
);
```

---

## Demo Scenarios

### Scenario 1: New Case Workflow
1. Create client
2. Create case
3. Accept trust deposit
4. Log expenses
5. Record settlement
6. Run disbursement

### Scenario 2: Bank Reconciliation
1. Import bank statement
2. Match transactions
3. Identify discrepancies
4. Create adjusting entries

### Scenario 3: Trust Accounting Compliance
1. View three-way reconciliation
2. Check client ledger balances
3. Generate trust reports
4. Audit trust transactions

---

## Troubleshooting

### Seed Function Fails
```sql
-- Check error logs
SELECT log FROM public.test_runs 
WHERE passed = false 
ORDER BY started_at DESC LIMIT 1;
```

### RLS Errors During Seeding
- Ensure service role key is used in edge functions
- Verify `SECURITY DEFINER` on `fn_seed_scenario()`

### Missing Accounts
```sql
-- Reload account templates
DELETE FROM public.accounts WHERE organization_id = '00000000-0000-0000-0000-000000000001';

INSERT INTO public.accounts (organization_id, code, name, type, is_active)
SELECT 
  '00000000-0000-0000-0000-000000000001',
  code, name, type, true
FROM public.account_templates
WHERE practice_area = 'Personal Injury';
```

---

## Security Considerations

⚠️ **Important:**
- Never use production data in training
- Limit access to training environment
- Use separate authentication credentials
- Clearly label as "TRAINING" in UI
- Disable production integrations
- Monitor for unauthorized access

---

## Next Steps

After setup:
1. Create user guide for demo scenarios
2. Record video walkthrough
3. Schedule regular data refreshes
4. Monitor edge function logs
5. Collect feedback from training sessions

---

## Support

Issues with training environment? Check:
- [Supabase Docs](https://supabase.com/docs)
- [GitHub Issues](https://github.com/your-repo/issues)
- [Discord Community](#)
