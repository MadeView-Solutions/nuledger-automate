
import { Client } from "@/types/client";

// QuickBooks API Configuration
export interface QuickBooksConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  environment: 'sandbox' | 'production';
  scopes: string[];
}

// QuickBooks Auth State
export interface QuickBooksAuthState {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  realmId: string | null; // QuickBooks company ID
  isConnected: boolean;
}

// Default configuration
const defaultConfig: QuickBooksConfig = {
  clientId: import.meta.env.VITE_QUICKBOOKS_CLIENT_ID || '',
  clientSecret: import.meta.env.VITE_QUICKBOOKS_CLIENT_SECRET || '',
  redirectUri: `${window.location.origin}/integrations/quickbooks/callback`,
  environment: 'sandbox',
  scopes: ['com.intuit.quickbooks.accounting', 'com.intuit.quickbooks.payment'],
};

// Initial auth state
const initialAuthState: QuickBooksAuthState = {
  accessToken: localStorage.getItem('qb_access_token'),
  refreshToken: localStorage.getItem('qb_refresh_token'),
  expiresAt: Number(localStorage.getItem('qb_expires_at')) || null,
  realmId: localStorage.getItem('qb_realm_id'),
  isConnected: Boolean(localStorage.getItem('qb_access_token')),
};

export class QuickBooksService {
  private config: QuickBooksConfig;
  private authState: QuickBooksAuthState;

  constructor(config: Partial<QuickBooksConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.authState = { ...initialAuthState };
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
        accessToken: mockResponse.access_token,
        refreshToken: mockResponse.refresh_token,
        expiresAt: Date.now() + mockResponse.expires_in * 1000,
        realmId,
        isConnected: true
      };

      // Store in localStorage (in production, consider more secure storage)
      localStorage.setItem('qb_access_token', this.authState.accessToken!);
      localStorage.setItem('qb_refresh_token', this.authState.refreshToken!);
      localStorage.setItem('qb_expires_at', this.authState.expiresAt!.toString());
      localStorage.setItem('qb_realm_id', realmId);

      return this.authState;
    } catch (error) {
      console.error('Error exchanging code for tokens:', error);
      throw error;
    }
  }

  /**
   * Check if the current session is connected to QuickBooks
   */
  isConnected(): boolean {
    return this.authState.isConnected && 
           this.authState.accessToken !== null && 
           (this.authState.expiresAt === null || this.authState.expiresAt > Date.now());
  }

  /**
   * Disconnect from QuickBooks
   */
  disconnect(): void {
    this.authState = {
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      realmId: null,
      isConnected: false
    };
    
    localStorage.removeItem('qb_access_token');
    localStorage.removeItem('qb_refresh_token');
    localStorage.removeItem('qb_expires_at');
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

      localStorage.setItem('qb_access_token', this.authState.accessToken!);
      localStorage.setItem('qb_expires_at', this.authState.expiresAt!.toString());
      
      return true;
    } catch (error) {
      console.error('Error refreshing tokens:', error);
      return false;
    }
  }
}

// Create a singleton instance for use throughout the application
export const quickbooksService = new QuickBooksService();
