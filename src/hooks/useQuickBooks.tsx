
import React from 'react';
import { AccountingIntegrationProvider, useAccountingIntegration } from './useAccountingIntegration';

// Provider component
export const QuickBooksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AccountingIntegrationProvider serviceName="QuickBooks">
      {children}
    </AccountingIntegrationProvider>
  );
};

// Hook for using QuickBooks integration
export const useQuickBooks = () => {
  return useAccountingIntegration('QuickBooks');
};
