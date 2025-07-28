import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Key } from 'lucide-react';

interface ApiKeyInputProps {
  onApiKeySubmit: (apiKey: string) => void;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeySubmit }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySubmit(apiKey.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md">
        <Card className="backdrop-blur-md bg-card/80 border-border/50 shadow-card">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center">
              <MapPin className="h-6 w-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Maps Explorer
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your Google Maps API key to begin exploring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="apiKey" className="text-sm font-medium text-foreground">
                  Google Maps API Key
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="Enter your API key..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="pl-10 bg-background/50 border-border/50 backdrop-blur-sm"
                    required
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                variant="gradient" 
                className="w-full"
                disabled={!apiKey.trim()}
              >
                Launch Explorer
              </Button>
            </form>
            <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border/30">
              <p className="text-xs text-muted-foreground">
                Need an API key? Visit{' '}
                <a 
                  href="https://console.cloud.google.com/apis/credentials" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Google Cloud Console
                </a>
                {' '}and enable the Maps JavaScript API, Places API, and Drawing API.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};