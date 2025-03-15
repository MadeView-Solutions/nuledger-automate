
import { Client } from "@/types/client";
import { AccountingIntegrationService, AccountingAuthState, AccountingConfig } from "./accountingBase";

// QuickBooks specific auth state
export interface QuickBooksAuthState extends AccountingAuthState {
  realmId: string | null; // QuickBooks company ID
}

// Default configuration for QuickBooks
const defaultConfig: AccountingConfig = {
  clientId: import.meta.env.VITE_QUICKBOOKS_CLIENT_ID || '',
  clientSecret: import.meta.env.VITE_QUICKBOOKS_CLIENT_SECRET || '',
  redirectUri: `${window.location.origin}/integrations/quickbooks/callback`,
  environment: 'sandbox',
  scopes: ['com.intuit.quickbooks.accounting', 'com.intuit.quickbooks.payment'],
};

export class QuickBooksService extends AccountingIntegrationService {
  protected authState: QuickBooksAuthState;

  constructor(config: Partial<AccountingConfig> = {}) {
    super({ ...defaultConfig, ...config }, 'qb');
    
    // Initialize QuickBooks specific auth state
    this.authState = {
      ...this.authState,
      realmId: localStorage.getItem('qb_realm_id'),
    };
  }

  /**
   * Generate OAuth authorization URL for QuickBooks
   */
  getAuthorizationUrl(): string {
    const baseUrl = this.config.environment === 'production'
      ? 'https://appcenter.intuit.com/connect/oauth2'
      : 'https://appcenter.intuit.com/connect/oauth2';
    
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      response_type: 'code',
      scope: this.config.scopes.join(' '),
      redirect_uri: this.config.redirectUri,
      state: btoa(JSON.stringify({ timestamp: Date.now() }))
    });

    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Handle the OAuth callback from QuickBooks
   */
  async handleAuthCallback(code: string, realmId: string): Promise<QuickBooksAuthState> {
    try {
      // In a real implementation, this would make a server request to exchange the code
      // for tokens using the client secret (which should be kept secure on your backend)
      
      // This is a placeholder for demonstration
      console.log('Exchanging authorization code for tokens...');
      
      // Mock successful token exchange
      const mockResponse = {
        access_token: 'mock_access_token',
        refresh_token: 'mock_refresh_token',
        expires_in: 3600,
      };

      // Update and store auth state
      this.authState = {
        ...this.authState,
        accessToken: mockResponse.access_token,
        refreshToken: mockResponse.refresh_token,
        expiresAt: Date.now() + mockResponse.expires_in * 1000,
        realmId,
        isConnected: true
      };

      // Store in localStorage
      this.storeAuthState('qb');
      localStorage.setItem('qb_realm_id', realmId);

      return this.authState;
    } catch (error) {
      console.error('Error exchanging code for tokens:', error);
      throw error;
    }
  }

  /**
   * Disconnect from QuickBooks
   */
  disconnect(): void {
    this.authState = {
      ...this.authState,
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      realmId: null,
      isConnected: false
    };
    
    this.clearAuthState('qb');
    localStorage.removeItem('qb_realm_id');
  }

  /**
   * Sync client data to QuickBooks
   */
  async syncClient(client: Client): Promise<boolean> {
    if (!this.isConnected()) {
      throw new Error('Not connected to QuickBooks');
    }

    try {
      // In a real implementation, this would make API calls to QuickBooks
      console.log(`Syncing client ${client.name} to QuickBooks...`);
      
      // Mock successful sync
      return true;
    } catch (error) {
      console.error('Error syncing client to QuickBooks:', error);
      throw error;
    }
  }

  /**
   * Import clients from QuickBooks
   */
  async importClients(): Promise<Partial<Client>[]> {
    if (!this.isConnected()) {
      throw new Error('Not connected to QuickBooks');
    }

    try {
      // In a real implementation, this would make API calls to QuickBooks
      console.log('Importing clients from QuickBooks...');
      
      // Mock successful import
      return [
        {
          name: 'Imported Client 1',
          email: 'client1@example.com',
          type: 'business',
          status: 'active',
        },
        {
          name: 'Imported Client 2',
          email: 'client2@example.com',
          type: 'individual',
          status: 'active',
        }
      ];
    } catch (error) {
      console.error('Error importing clients from QuickBooks:', error);
      throw error;
    }
  }

  /**
   * Refresh auth tokens (would normally be done through a secure backend)
   */
  async refreshTokens(): Promise<boolean> {
    if (!this.authState.refreshToken) {
      return false;
    }

    try {
      // In a real implementation, this would make a server request to refresh tokens
      console.log('Refreshing QuickBooks tokens...');
      
      // Mock successful token refresh
      this.authState = {
        ...this.authState,
        accessToken: 'new_mock_access_token',
        expiresAt: Date.now() + 3600 * 1000
      };

      this.storeAuthState('qb');
      
      return true;
    } catch (error) {
      console.error('Error refreshing tokens:', error);
      return false;
    }
  }
}

// Create a singleton instance for use throughout the application
export const quickbooksService = new QuickBooksService();
