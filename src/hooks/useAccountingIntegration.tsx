
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AccountingAuthState, AccountingIntegrationService, createAccountingServiceAsync } from '@/services/integrations/accountingBase';
import { useToast } from '@/hooks/use-toast';
import { Client } from '@/types/client';

interface AccountingIntegrationContextType {
  serviceName: string;
  authState: AccountingAuthState;
  service: AccountingIntegrationService | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  connect: () => void;
  disconnect: () => void;
  handleCallback: (code: string, state?: string) => Promise<void>;
  syncClient: (client: Client) => Promise<boolean>;
  importClients: () => Promise<Partial<Client>[]>;
}

const AccountingIntegrationContext = createContext<AccountingIntegrationContextType | undefined>(undefined);

interface AccountingIntegrationProviderProps {
  serviceName: string;
  children: React.ReactNode;
}

export const AccountingIntegrationProvider: React.FC<AccountingIntegrationProviderProps> = ({ 
  serviceName, 
  children 
}) => {
  const { toast } = useToast();
  const [service, setService] = useState<AccountingIntegrationService | null>(null);
  const [authState, setAuthState] = useState<AccountingAuthState>({
    accessToken: null,
    refreshToken: null,
    expiresAt: null,
    isConnected: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize the accounting service
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const accountingService = await createAccountingServiceAsync(serviceName);
        if (!mounted) return;
        setService(accountingService);
        
        if (accountingService) {
          setAuthState({
            accessToken: localStorage.getItem(`${serviceName.toLowerCase()}_access_token`),
            refreshToken: localStorage.getItem(`${serviceName.toLowerCase()}_refresh_token`),
            expiresAt: Number(localStorage.getItem(`${serviceName.toLowerCase()}_expires_at`)) || null,
            isConnected: accountingService.isConnected(),
          });
        }
      } catch (err) {
        console.error(`Error initializing ${serviceName} service:`, err);
        setError(`Failed to initialize ${serviceName} service`);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => { mounted = false };
  }, [serviceName]);

  const connect = () => {
    if (!service) {
      toast({
        title: `${serviceName} Error`,
        description: `${serviceName} service is not available`,
        variant: "destructive",
      });
      return;
    }
    
    const authUrl = service.getAuthorizationUrl();
    window.location.href = authUrl;
  };

  const disconnect = () => {
    if (!service) return;
    
    service.disconnect();
    setAuthState({
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      isConnected: false
    });
    
    toast({
      title: `Disconnected from ${serviceName}`,
      description: `Your ${serviceName} integration has been disconnected`,
    });
  };

  const handleCallback = async (code: string, state?: string) => {
    if (!service) {
      setError(`${serviceName} service is not available`);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const newAuthState = await service.handleAuthCallback(code, state);
      setAuthState(newAuthState);
      
      toast({
        title: `Connected to ${serviceName}`,
        description: `Your ${serviceName} integration is now active`,
      });
    } catch (err) {
      setError(`Failed to connect to ${serviceName}`);
      
      toast({
        title: "Connection Failed",
        description: `Could not connect to ${serviceName}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const syncClient = async (client: Client): Promise<boolean> => {
    if (!service || !service.isConnected()) {
      toast({
        title: `${serviceName} Not Connected`,
        description: `Please connect to ${serviceName} first in Integrations.`,
        variant: "destructive",
      });
      return false;
    }

    try {
      const result = await service.syncClient(client);
      
      if (result) {
        toast({
          title: "Client Synced",
          description: `${client.name} was successfully synced with ${serviceName}`,
        });
      }
      
      return result;
    } catch (error) {
      console.error(`Error syncing client with ${serviceName}:`, error);
      
      toast({
        title: "Sync Failed",
        description: `Could not sync client with ${serviceName}. Please try again.`,
        variant: "destructive",
      });
      
      return false;
    }
  };

  const importClients = async (): Promise<Partial<Client>[]> => {
    if (!service || !service.isConnected()) {
      toast({
        title: `${serviceName} Not Connected`,
        description: `Please connect to ${serviceName} first in Integrations.`,
        variant: "destructive",
      });
      return [];
    }

    try {
      return await service.importClients();
    } catch (error) {
      console.error(`Error importing clients from ${serviceName}:`, error);
      
      toast({
        title: "Import Failed",
        description: `Could not import clients from ${serviceName}. Please try again.`,
        variant: "destructive",
      });
      
      return [];
    }
  };

  const value = {
    serviceName,
    authState,
    service,
    isConnected: service?.isConnected() || false,
    isLoading,
    error,
    connect,
    disconnect,
    handleCallback,
    syncClient,
    importClients
  };

  return (
    <AccountingIntegrationContext.Provider value={value}>
      {children}
    </AccountingIntegrationContext.Provider>
  );
};

export const useAccountingIntegration = (serviceName?: string) => {
  const context = useContext(AccountingIntegrationContext);
  
  if (context === undefined) {
    if (serviceName) {
      // Create a temporary placeholder (no dynamic import outside provider)
      const service: AccountingIntegrationService | null = null;
      
      return {
        serviceName,
        authState: {
          accessToken: null,
          refreshToken: null,
          expiresAt: null,
          isConnected: false
        },
        service,
        isConnected: service?.isConnected() || false,
        isLoading: false,
        error: 'Hook used outside provider',
        connect: () => console.warn('Use within provider for full functionality'),
        disconnect: () => console.warn('Use within provider for full functionality'),
        handleCallback: async () => { throw new Error('Use within provider for full functionality'); },
        syncClient: async () => false,
        importClients: async () => []
      };
    }
    
    throw new Error('useAccountingIntegration must be used within an AccountingIntegrationProvider or with a serviceName parameter');
  }
  
  return context;
};
