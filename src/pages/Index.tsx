import React, { useState } from 'react';
import { MapContainer } from '@/components/MapContainer';
import { ApiKeyInput } from '@/components/ApiKeyInput';

const Index = () => {
  const [apiKey, setApiKey] = useState<string>('');

  const handleApiKeySubmit = (key: string) => {
    setApiKey(key);
  };

  return (
    <div className="min-h-screen bg-background">
      {!apiKey ? (
        <ApiKeyInput onApiKeySubmit={handleApiKeySubmit} />
      ) : (
        <MapContainer apiKey={apiKey} />
      )}
    </div>
  );
};

export default Index;
