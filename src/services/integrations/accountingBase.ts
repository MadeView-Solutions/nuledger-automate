
import { Client } from "@/types/client";

// Base Authentication State for accounting integrations
export interface AccountingAuthState {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  company?: string | null;
  isConnected: boolean;
}

// Base configuration for accounting integrations
export interface AccountingConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  environment: 'sandbox' | 'production' | 'development';
  scopes: string[];
}

/**
 * Base class for all accounting software integrations
 * This provides a common interface that all specific implementations can follow
 */
export abstract class AccountingIntegrationService {
  protected config: AccountingConfig;
  protected authState: AccountingAuthState;

  constructor(config: Partial<AccountingConfig>, servicePrefix: string) {
    // Default config is placeholder, should be overridden by specific implementations
    this.config = {
      clientId: '',
      clientSecret: '',
      redirectUri: '',
      environment: 'sandbox',
      scopes: [],
      ...config
    };
    
    // Initialize auth state from localStorage using the service prefix
    this.authState = {
      accessToken: localStorage.getItem(`${servicePrefix}_access_token`),
      refreshToken: localStorage.getItem(`${servicePrefix}_refresh_token`),
      expiresAt: Number(localStorage.getItem(`${servicePrefix}_expires_at`)) || null,
      company: localStorage.getItem(`${servicePrefix}_company`),
      isConnected: Boolean(localStorage.getItem(`${servicePrefix}_access_token`))
    };
  }

  // Common methods that all accounting integrations should implement
  
  /**
   * Generate OAuth authorization URL 
   */
  abstract getAuthorizationUrl(): string;

  /**
   * Handle the OAuth callback
   */
  abstract handleAuthCallback(code: string, state?: string): Promise<AccountingAuthState>;

  /**
   * Check if the current session is connected
   */
  isConnected(): boolean {
    return this.authState.isConnected && 
           this.authState.accessToken !== null && 
           (this.authState.expiresAt === null || this.authState.expiresAt > Date.now());
  }

  /**
   * Disconnect from the service
   */
  abstract disconnect(): void;

  /**
   * Sync client data
   */
  abstract syncClient(client: Client): Promise<boolean>;

  /**
   * Import clients from the service
   */
  abstract importClients(): Promise<Partial<Client>[]>;

  /**
   * Refresh auth tokens
   */
  abstract refreshTokens(): Promise<boolean>;
  
  /**
   * Store authentication state in localStorage
   */
  protected storeAuthState(servicePrefix: string): void {
    if (this.authState.accessToken) {
      localStorage.setItem(`${servicePrefix}_access_token`, this.authState.accessToken);
    } else {
      localStorage.removeItem(`${servicePrefix}_access_token`);
    }
    
    if (this.authState.refreshToken) {
      localStorage.setItem(`${servicePrefix}_refresh_token`, this.authState.refreshToken);
    } else {
      localStorage.removeItem(`${servicePrefix}_refresh_token`);
    }
    
    if (this.authState.expiresAt) {
      localStorage.setItem(`${servicePrefix}_expires_at`, this.authState.expiresAt.toString());
    } else {
      localStorage.removeItem(`${servicePrefix}_expires_at`);
    }
    
    if (this.authState.company) {
      localStorage.setItem(`${servicePrefix}_company`, this.authState.company);
    } else {
      localStorage.removeItem(`${servicePrefix}_company`);
    }
  }
  
  /**
   * Clear authentication state from localStorage
   */
  protected clearAuthState(servicePrefix: string): void {
    localStorage.removeItem(`${servicePrefix}_access_token`);
    localStorage.removeItem(`${servicePrefix}_refresh_token`);
    localStorage.removeItem(`${servicePrefix}_expires_at`);
    localStorage.removeItem(`${servicePrefix}_company`);
  }
}

/**
 * Factory function to create an accounting integration service (async, ESM-friendly)
 * Uses dynamic import to avoid require() in the browser
 */
export const createAccountingServiceAsync = async (
  type: string
): Promise<AccountingIntegrationService | null> => {
  switch (type.toLowerCase()) {
    case "quickbooks":
    case "quickbooksonline": {
      try {
        const mod = await import("./quickbooks");
        const { QuickBooksService } = mod as any;
        return new QuickBooksService();
      } catch (e) {
        console.error("Failed to load QuickBooks integration module:", e);
        return null;
      }
    }
    default:
      console.warn(`Accounting service type '${type}' not supported`);
      return null;
  }
};

// Backward-compat sync factory (returns null to avoid require() in ESM)
export const createAccountingService = (_type: string): AccountingIntegrationService | null => {
  console.warn(
    "createAccountingService is now async. Use createAccountingServiceAsync instead. Returning null."
  );
  return null;
};
