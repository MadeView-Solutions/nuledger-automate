
import React, { createContext, useContext, useEffect, useState } from 'react';
import { QuickBooksService, QuickBooksAuthState } from '@/services/integrations/quickbooks';
import { useToast } from '@/components/ui/use-toast';

interface QuickBooksContextType {
  authState: QuickBooksAuthState;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  connect: () => void;
  disconnect: () => void;
  handleCallback: (code: string, realmId: string) => Promise<void>;
}

const QuickBooksContext = createContext<QuickBooksContextType | undefined>(undefined);

export const QuickBooksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [service] = useState(() => new QuickBooksService());
  const [authState, setAuthState] = useState<QuickBooksAuthState>({
    accessToken: null,
    refreshToken: null,
    expiresAt: null,
    realmId: null,
    isConnected: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from local storage
  useEffect(() => {
    setAuthState({
      accessToken: localStorage.getItem('qb_access_token'),
      refreshToken: localStorage.getItem('qb_refresh_token'),
      expiresAt: Number(localStorage.getItem('qb_expires_at')) || null,
      realmId: localStorage.getItem('qb_realm_id'),
      isConnected: Boolean(localStorage.getItem('qb_access_token'))
    });
    setIsLoading(false);
  }, []);

  const connect = () => {
    const authUrl = service.getAuthorizationUrl();
    window.location.href = authUrl;
  };

  const disconnect = () => {
    service.disconnect();
    setAuthState({
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      realmId: null,
      isConnected: false
    });
    toast({
      title: "Disconnected from QuickBooks",
      description: "Your QuickBooks integration has been disconnected",
    });
  };

  const handleCallback = async (code: string, realmId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const newAuthState = await service.handleAuthCallback(code, realmId);
      setAuthState(newAuthState);
      toast({
        title: "Connected to QuickBooks",
        description: "Your QuickBooks integration is now active",
      });
    } catch (err) {
      setError('Failed to connect to QuickBooks');
      toast({
        title: "Connection Failed",
        description: "Could not connect to QuickBooks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    authState,
    isConnected: service.isConnected(),
    isLoading,
    error,
    connect,
    disconnect,
    handleCallback
  };

  return (
    <QuickBooksContext.Provider value={value}>
      {children}
    </QuickBooksContext.Provider>
  );
};

export const useQuickBooks = () => {
  const context = useContext(QuickBooksContext);
  if (context === undefined) {
    throw new Error('useQuickBooks must be used within a QuickBooksProvider');
  }
  return context;
};
