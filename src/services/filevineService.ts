/**
 * Filevine Service - Frontend client for Filevine API integration
 * 
 * This service provides a clean interface for the React frontend to interact
 * with the Filevine API through Supabase Edge Functions.
 */

export interface FilevineAuthResponse {
  success: boolean;
  token?: string;
  userOrgs?: {
    userId: string;
    organizations: Array<{
      orgId: string;
      orgName: string;
      isActive: boolean;
    }>;
  };
  error?: string;
}

export interface FilevineCase {
  caseId: string;
  caseName: string;
  caseNumber: string;
  status: string;
  clientName: string;
  openDate: string;
  lastModified: string;
  practiceArea: string;
  assignedAttorney: string;
}

export interface FilevineContact {
  contactId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  type: string;
  company?: string;
}

class FilevineService {
  private baseUrl = '/functions/v1/filevine-client';
  private userId: string | null = null;
  private orgId: string | null = null;

  /**
   * Test authentication and get user organizations
   */
  async authenticate(): Promise<FilevineAuthResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'authenticate'
        }),
      });

      const result = await response.json();
      
      if (result.success && result.data?.userOrgs) {
        this.userId = result.data.userOrgs.userId;
        // Set the first active organization as default
        const activeOrg = result.data.userOrgs.organizations.find((org: any) => org.isActive);
        if (activeOrg) {
          this.orgId = activeOrg.orgId;
        }
      }

      return {
        success: result.success,
        token: result.data?.token,
        userOrgs: result.data?.userOrgs,
        error: result.error
      };
    } catch (error) {
      console.error('Authentication failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Authentication failed'
      };
    }
  }

  /**
   * Get user organizations
   */
  async getUserOrganizations() {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'get-user-orgs'
        }),
      });

      const result = await response.json();
      return result.success ? result.data : null;
    } catch (error) {
      console.error('Failed to get user organizations:', error);
      return null;
    }
  }

  /**
   * Set the active organization
   */
  setActiveOrganization(orgId: string, userId?: string) {
    this.orgId = orgId;
    if (userId) this.userId = userId;
  }

  /**
   * Generic API request method
   */
  async apiRequest(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', data?: any) {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'api-request',
          endpoint,
          method,
          data,
          userId: this.userId,
          orgId: this.orgId
        }),
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'API request failed');
      }

      return result.data;
    } catch (error) {
      console.error(`API request to ${endpoint} failed:`, error);
      throw error;
    }
  }

  /**
   * Get all cases from Filevine
   */
  async getCases(): Promise<FilevineCase[]> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'get-cases',
          userId: this.userId,
          orgId: this.orgId
        }),
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to get cases');
      }

      return result.data || [];
    } catch (error) {
      console.error('Failed to get cases:', error);
      throw error;
    }
  }

  /**
   * Get a specific case by ID
   */
  async getCase(caseId: string): Promise<FilevineCase | null> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'get-case',
          data: { caseId },
          userId: this.userId,
          orgId: this.orgId
        }),
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to get case');
      }

      return result.data;
    } catch (error) {
      console.error(`Failed to get case ${caseId}:`, error);
      throw error;
    }
  }

  /**
   * Update a case in Filevine
   */
  async updateCase(caseId: string, caseData: Partial<FilevineCase>): Promise<FilevineCase> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update-case',
          data: { caseId, caseData },
          userId: this.userId,
          orgId: this.orgId
        }),
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to update case');
      }

      return result.data;
    } catch (error) {
      console.error(`Failed to update case ${caseId}:`, error);
      throw error;
    }
  }

  /**
   * Get all contacts from Filevine
   */
  async getContacts(): Promise<FilevineContact[]> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'get-contacts',
          userId: this.userId,
          orgId: this.orgId
        }),
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to get contacts');
      }

      return result.data || [];
    } catch (error) {
      console.error('Failed to get contacts:', error);
      throw error;
    }
  }

  /**
   * Sync a case from Filevine to NuLedger
   * This method would integrate with your local case management system
   */
  async syncCase(filevineCase: FilevineCase): Promise<boolean> {
    try {
      // Here you would implement the logic to sync the case data
      // with your local NuLedger database/system
      console.log('Syncing case:', filevineCase);
      
      // For now, return success
      // In a real implementation, you'd make API calls to your backend
      return true;
    } catch (error) {
      console.error('Failed to sync case:', error);
      return false;
    }
  }

  /**
   * Bulk sync all cases from Filevine
   */
  async syncAllCases(): Promise<{ success: number; failed: number; errors: string[] }> {
    const result = {
      success: 0,
      failed: 0,
      errors: [] as string[]
    };

    try {
      const cases = await this.getCases();
      
      for (const filevineCase of cases) {
        try {
          const synced = await this.syncCase(filevineCase);
          if (synced) {
            result.success++;
          } else {
            result.failed++;
            result.errors.push(`Failed to sync case ${filevineCase.caseId}`);
          }
        } catch (error) {
          result.failed++;
          result.errors.push(`Error syncing case ${filevineCase.caseId}: ${error}`);
        }
      }
    } catch (error) {
      result.errors.push(`Failed to get cases: ${error}`);
    }

    return result;
  }

  /**
   * Test the connection to Filevine
   */
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const authResult = await this.authenticate();
      if (authResult.success) {
        return {
          success: true,
          message: `Successfully connected to Filevine. Found ${authResult.userOrgs?.organizations?.length || 0} organizations.`
        };
      } else {
        return {
          success: false,
          message: authResult.error || 'Authentication failed'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Connection test failed'
      };
    }
  }
}

// Export singleton instance
export const filevineService = new FilevineService();
export default FilevineService;