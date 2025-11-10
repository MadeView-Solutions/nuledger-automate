# Environment Secrets & Configuration

This document lists all secrets and environment variables used in the NuLedger application.

## Supabase Core Secrets (Auto-Configured)

These are automatically provided by Supabase and used internally:

| Secret Name | Usage | Location |
|-------------|-------|----------|
| `SUPABASE_URL` | Database and API endpoint | All edge functions |
| `SUPABASE_ANON_KEY` | Public API key for client-side requests | Frontend, edge functions |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin access for edge functions | All edge functions (server-side only) |
| `SUPABASE_DB_URL` | Direct database connection string | Migration scripts, background jobs |

**⚠️ Security Notes:**
- Service role key grants full database access - never expose in frontend
- Anon key is safe for client-side use but limited by RLS policies

---

## Integration Secrets (User-Configured)

### Filevine Integration
Used in: `supabase/functions/filevine-client/index.ts`

| Secret Name | Required | Description |
|-------------|----------|-------------|
| `FILEVINE_CLIENT_ID` | Yes | Application client ID from Filevine |
| `FILEVINE_CLIENT_SECRET` | Yes | Application client secret from Filevine |
| `FILEVINE_PAT` | Yes | Personal Access Token for OAuth2 authentication |

**Setup Instructions:**
1. Log into Filevine → Settings → API → Personal Access Tokens
2. Create token with permissions: Cases (Read/Write), Contacts (Read/Write), Financial (Read/Write)
3. Add secrets in Supabase Dashboard → Settings → Edge Functions → Environment Variables

**Used For:**
- Syncing case data from Filevine to NuLedger
- Bi-directional updates between systems
- Client and contact management

---

### Plaid Banking Integration
Used in: `supabase/functions/webhook-plaid/index.ts`

| Secret Name | Required | Description |
|-------------|----------|-------------|
| `PLAID_CLIENT_ID` | Yes | Plaid application client ID |
| `PLAID_SECRET` | Yes | Plaid API secret key |
| `PLAID_ENV` | Yes | Environment: `sandbox`, `development`, or `production` |

**Setup Instructions:**
1. Sign up at https://dashboard.plaid.com
2. Create an application and get credentials
3. Configure webhook URL in Plaid dashboard: `https://<project-ref>.supabase.co/functions/v1/webhook-plaid`
4. Add secrets in Supabase

**Used For:**
- Bank account connection and authentication
- Real-time transaction syncing
- Bank balance monitoring

---

### QuickBooks Integration (Future)
Used in: `supabase/functions/sync-qbo/index.ts` (stub)

| Secret Name | Required | Description |
|-------------|----------|-------------|
| `QBO_CLIENT_ID` | Yes | QuickBooks app client ID |
| `QBO_CLIENT_SECRET` | Yes | QuickBooks app client secret |
| `QBO_REDIRECT_URI` | Yes | OAuth2 redirect URI |

**Status:** Currently stubbed - requires OAuth2 implementation

---

## AI Services (Optional)

### AI Categorization
Used in: `supabase/functions/ai-categorize/index.ts`

Currently uses rule-based matching. For advanced AI categorization:

| Secret Name | Required | Description |
|-------------|----------|-------------|
| `OPENAI_API_KEY` | Optional | For GPT-based transaction categorization |
| `LOVABLE_API_KEY` | Optional | For using Lovable AI Gateway |

**Future Enhancement:**
- Machine learning-based expense categorization
- Smart vendor detection
- Anomaly detection

---

## Storage Buckets

Public access configured via policies:

| Bucket | Public | RLS | Usage |
|--------|--------|-----|-------|
| `attachments` | No | Yes | Case documents, receipts, invoices |
| `exports` | No | Yes | Generated reports, CSV exports |
| `templates` | No | Yes | Disbursement templates, check templates |
| `imports` | No | Yes | CSV files for data import |

**Signed URL Policy:**
- All buckets require authentication
- Signed URLs expire after 60 minutes
- RLS policies enforce organization boundaries

---

## Environment-Specific Configuration

### Development
```bash
SUPABASE_URL=https://mcvxcleslvgntufnrqds.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Production
- Use separate Supabase project for production
- Rotate secrets quarterly
- Enable audit logging
- Configure backup retention

### Training Environment
- Clone production schema but use test data
- Run `fn_seed_scenario()` to populate test cases
- Separate credentials from production

---

## Secret Rotation Guidelines

**Quarterly Rotation:**
- All API keys and tokens
- Service role keys (coordinate with team)

**Immediate Rotation:**
- If key is exposed in logs or code
- On team member departure
- After security incident

**How to Rotate:**
1. Generate new secret in provider dashboard
2. Update in Supabase: Settings → Edge Functions → Edit variable
3. Test edge functions after update
4. Revoke old secret in provider dashboard

---

## Troubleshooting

### Missing Secret Error
```
Error: Missing required environment variables
```
**Solution:** Verify all required secrets are configured in Supabase Dashboard

### Invalid Token Error
```
Error: Authentication failed: 401
```
**Solution:** 
1. Check secret is correct
2. Verify token hasn't expired
3. Confirm permissions in provider dashboard

### RLS Policy Violation
```
Error: new row violates row-level security policy
```
**Solution:**
1. Ensure user is authenticated
2. Verify organization_id matches user's organization
3. Check user has required role (owner/admin/staff)

---

## Security Best Practices

✅ **DO:**
- Store secrets only in Supabase environment variables
- Use service role key only in edge functions
- Implement RLS on all tables with sensitive data
- Rotate secrets regularly
- Use least-privilege access

❌ **DON'T:**
- Commit secrets to Git
- Use service role key in frontend code
- Share secrets across environments
- Log secrets or tokens
- Store secrets in database

---

## Documentation Links

- [Supabase Secrets Management](https://supabase.com/docs/guides/functions/secrets)
- [Filevine API Docs](https://developer.filevine.com/)
- [Plaid API Docs](https://plaid.com/docs/)
- [QuickBooks API Docs](https://developer.intuit.com/app/developer/qbo/docs/get-started)
