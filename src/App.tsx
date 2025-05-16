import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { DownloadForm } from './components/DownloadForm';
import { DownloadList } from './components/DownloadList';
import { ServerStatus } from './components/ServerStatus';
import { ApiKeyProvider } from './contexts/ApiKeyContext';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <ApiKeyProvider>
      <Layout isLoading={isLoading}>
        <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto">
          <ServerStatus />
          <DownloadForm />
          <DownloadList />
        </div>
      </Layout>
    </ApiKeyProvider>
  );
}

export default App;