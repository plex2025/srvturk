import React, { createContext, useState, useContext, useEffect } from 'react';

interface ApiKeyContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
}

const ApiKeyContext = createContext<ApiKeyContextType>({
  apiKey: '',
  setApiKey: () => {}
});

export const useApiKey = () => useContext(ApiKeyContext);

export const ApiKeyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to the provided API key or empty string
  const [apiKey, setApiKey] = useState<string>('yfQdaYOk4Dd7dbjnUWkX');

  useEffect(() => {
    // In a real implementation, we might load this from localStorage or a server
    // For now, we'll just use the default value
  }, []);

  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey }}>
      {children}
    </ApiKeyContext.Provider>
  );
};