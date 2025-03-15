
import React, { useEffect, useState } from 'react';
import { useQuickBooks } from '@/hooks/useQuickBooks';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const QuickBooksCallback = () => {
  const { handleCallback } = useQuickBooks();
  const [status, setStatus] = useState('Processing your QuickBooks connection...');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const processAuth = async () => {
      try {
        // Parse URL query parameters
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        const realmId = searchParams.get('realmId');
        
        if (!code || !realmId) {
          setStatus('Error: Missing authorization data');
          setTimeout(() => navigate('/integrations'), 3000);
          return;
        }
        
        // Process the OAuth callback
        await handleCallback(code, realmId);
        setStatus('Connected successfully! Redirecting...');
        setTimeout(() => navigate('/integrations'), 2000);
      } catch (error) {
        console.error('Error processing QuickBooks callback:', error);
        setStatus('Connection failed. Redirecting back...');
        setTimeout(() => navigate('/integrations'), 3000);
      }
    };

    processAuth();
  }, [handleCallback, location.search, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
        <h1 className="text-xl font-semibold mb-2">QuickBooks Integration</h1>
        <p className="text-muted-foreground">{status}</p>
      </div>
    </div>
  );
};

export default QuickBooksCallback;
