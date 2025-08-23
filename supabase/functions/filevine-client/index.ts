import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

/**
 * Filevine API Client for NuLedger
 * 
 * This Edge Function provides a comprehensive API client for Filevine integration.
 * It handles OAuth2 authentication using Personal Access Token (PAT) flow,
 * token management, and provides a wrapper for all Filevine API requests.
 * 
 * Required Environment Variables:
 * - FILEVINE_CLIENT_ID: Your Filevine application client ID
 * - FILEVINE_CLIENT_SECRET: Your Filevine application client secret
 * - FILEVINE_PAT: Personal Access Token from Filevine
 * 
 * Usage:
 * POST /filevine-client with { action: 'authenticate' } to get initial token
 * POST /filevine-client with { action: 'api-request', endpoint: '/fv-app/v2/cases', method: 'GET' }
 */

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

interface UserOrgResponse {
  userId: string;
  organizations: Array<{
    orgId: string;
    orgName: string;
    isActive: boolean;
  }>;
}

class FilevineClient {
  private baseUrl = 'https://api.filevine.com';
  private tokenUrl = 'https://identity.filevine.com/connect/token';
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(
    private clientId: string,
    private clientSecret: string,
    private personalAccessToken: string
  ) {}

  /**
   * Get a valid Bearer token, refreshing if necessary
   */
  async getFilevineToken(): Promise<string> {
    // Check if current token is still valid (with 5 minute buffer)
    if (this.accessToken && Date.now() < (this.tokenExpiry - 300000)) {
      return this.accessToken;
    }

    try {
      const response = await fetch(this.tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'personal_access_token',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          personal_access_token: this.personalAccessToken,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Authentication failed: ${response.status} - ${errorText}`);
      }

      const tokenData: TokenResponse = await response.json();
      this.accessToken = tokenData.access_token;
      this.tokenExpiry = Date.now() + (tokenData.expires_in * 1000);

      console.log('Successfully obtained Filevine access token');
      return this.accessToken;
    } catch (error) {
      console.error('Failed to obtain Filevine token:', error);
      throw new Error(`Token acquisition failed: ${error.message}`);
    }
  }

  /**
   * Get User ID and Organization ID dynamically after authentication
   */
  async getUserOrgs(): Promise<UserOrgResponse> {
    const token = await this.getFilevineToken();
    
    try {
      const response = await fetch(`${this.baseUrl}/fv-app/v2/utils/GetUserOrgsWithToken`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get user orgs: ${response.status}`);
      }

      const data = await response.json();
      console.log('Successfully retrieved user organizations');
      return data;
    } catch (error) {
      console.error('Failed to get user organizations:', error);
      throw error;
    }
  }

  /**
   * Generic API request wrapper
   * Automatically handles authentication, headers, and error handling
   */
  async apiRequest(
    endpoint: string, 
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', 
    data?: any,
    userId?: string,
    orgId?: string
  ): Promise<any> {
    const token = await this.getFilevineToken();
    
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    // Add Filevine-specific headers if provided
    if (userId) headers['x-fv-userid'] = userId;
    if (orgId) headers['x-fv-orgid'] = orgId;

    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        // Handle token expiry
        if (response.status === 401) {
          console.log('Token expired, attempting to refresh...');
          this.accessToken = null; // Force token refresh
          const newToken = await this.getFilevineToken();
          headers['Authorization'] = `Bearer ${newToken}`;
          
          // Retry the request with new token
          const retryResponse = await fetch(url, {
            method,
            headers,
            body: data ? JSON.stringify(data) : undefined,
          });

          if (!retryResponse.ok) {
            const errorText = await retryResponse.text();
            throw new Error(`API request failed after retry: ${retryResponse.status} - ${errorText}`);
          }

          return await retryResponse.json();
        }

        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request to ${endpoint} failed:`, error);
      throw error;
    }
  }

  /**
   * Common API endpoints for easy access
   */
  async getCases(userId?: string, orgId?: string) {
    return this.apiRequest('/fv-app/v2/cases', 'GET', undefined, userId, orgId);
  }

  async getCase(caseId: string, userId?: string, orgId?: string) {
    return this.apiRequest(`/fv-app/v2/cases/${caseId}`, 'GET', undefined, userId, orgId);
  }

  async updateCase(caseId: string, caseData: any, userId?: string, orgId?: string) {
    return this.apiRequest(`/fv-app/v2/cases/${caseId}`, 'PUT', caseData, userId, orgId);
  }

  async getContacts(userId?: string, orgId?: string) {
    return this.apiRequest('/fv-app/v2/contacts', 'GET', undefined, userId, orgId);
  }
}

serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  }

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get environment variables
    const clientId = Deno.env.get('FILEVINE_CLIENT_ID');
    const clientSecret = Deno.env.get('FILEVINE_CLIENT_SECRET');
    const personalAccessToken = Deno.env.get('FILEVINE_PAT');

    if (!clientId || !clientSecret || !personalAccessToken) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required environment variables. Please configure FILEVINE_CLIENT_ID, FILEVINE_CLIENT_SECRET, and FILEVINE_PAT.' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const client = new FilevineClient(clientId, clientSecret, personalAccessToken);
    const { action, endpoint, method, data, userId, orgId } = await req.json();

    let result;

    switch (action) {
      case 'authenticate':
        // Test authentication and get user organizations
        const token = await client.getFilevineToken();
        const userOrgs = await client.getUserOrgs();
        result = { 
          success: true, 
          token: token.substring(0, 10) + '...', // Don't return full token
          userOrgs 
        };
        break;

      case 'get-user-orgs':
        result = await client.getUserOrgs();
        break;

      case 'api-request':
        if (!endpoint) {
          throw new Error('Endpoint is required for api-request action');
        }
        result = await client.apiRequest(endpoint, method || 'GET', data, userId, orgId);
        break;

      case 'get-cases':
        result = await client.getCases(userId, orgId);
        break;

      case 'get-case':
        if (!data?.caseId) {
          throw new Error('caseId is required for get-case action');
        }
        result = await client.getCase(data.caseId, userId, orgId);
        break;

      case 'update-case':
        if (!data?.caseId || !data?.caseData) {
          throw new Error('caseId and caseData are required for update-case action');
        }
        result = await client.updateCase(data.caseId, data.caseData, userId, orgId);
        break;

      case 'get-contacts':
        result = await client.getContacts(userId, orgId);
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Filevine client error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
})

/* 
FILEVINE INTEGRATION SETUP GUIDE:

1. Generate Personal Access Token (PAT) in Filevine:
   - Log into your Filevine account
   - Go to Settings → API → Personal Access Tokens
   - Create a new token with appropriate permissions:
     * Cases: Read, Write
     * Contacts: Read, Write
     * Financial: Read, Write (if needed)
   - Copy the generated token

2. Configure Environment Variables in Supabase:
   - Go to your Supabase project dashboard
   - Navigate to Settings → Edge Functions → Environment Variables
   - Add the following variables:
     * FILEVINE_CLIENT_ID: Your application's client ID
     * FILEVINE_CLIENT_SECRET: Your application's client secret
     * FILEVINE_PAT: The Personal Access Token from step 1

3. Using the API Client:
   // Example usage from your React components:
   const response = await fetch('/functions/v1/filevine-client', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       action: 'get-cases',
       userId: 'your-user-id',
       orgId: 'your-org-id'
     })
   });

4. Common Endpoints:
   - GET /fv-app/v2/cases - Get all cases
   - GET /fv-app/v2/cases/{caseId} - Get specific case
   - PUT /fv-app/v2/cases/{caseId} - Update case
   - GET /fv-app/v2/contacts - Get contacts
   - GET /fv-app/v2/utils/GetUserOrgsWithToken - Get user organizations

5. Error Handling:
   - The client automatically retries on token expiry
   - All errors are logged and returned with descriptive messages
   - Check Supabase logs for detailed error information

6. Security Notes:
   - Never expose API keys or tokens in frontend code
   - All sensitive data is handled server-side in Edge Functions
   - Tokens are automatically refreshed before expiry
*/