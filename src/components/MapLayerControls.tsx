import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Map, 
  Satellite, 
  Navigation, 
  Layers,
  Cloud,
  Leaf,
  Sun,
  Camera,
  Route
} from 'lucide-react';

interface MapLayerControlsProps {
  mapType: 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
  onMapTypeChange: (type: 'roadmap' | 'satellite' | 'hybrid' | 'terrain') => void;
  showWeather: boolean;
  onToggleWeather: () => void;
  showAirQuality: boolean;
  onToggleAirQuality: () => void;
  showSolar: boolean;
  onToggleSolar: () => void;
  showTraffic: boolean;
  onToggleTraffic: () => void;
  onToggleStreetView: () => void;
}

export const MapLayerControls: React.FC<MapLayerControlsProps> = ({
  mapType,
  onMapTypeChange,
  showWeather,
  onToggleWeather,
  showAirQuality,
  onToggleAirQuality,
  showSolar,
  onToggleSolar,
  showTraffic,
  onToggleTraffic,
  onToggleStreetView
}) => {
  const mapTypes = [
    { type: 'roadmap' as const, icon: Map, label: 'Road' },
    { type: 'satellite' as const, icon: Satellite, label: 'Satellite' },
    { type: 'hybrid' as const, icon: Layers, label: 'Hybrid' },
    { type: 'terrain' as const, icon: Navigation, label: 'Terrain' }
  ];

  return (
    <Card className="absolute top-6 left-80 z-10 bg-card/95 backdrop-blur-md border-border/50">
      <CardContent className="p-4 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">Map Type</h3>
          <div className="grid grid-cols-2 gap-2">
            {mapTypes.map(({ type, icon: Icon, label }) => (
              <Button
                key={type}
                variant={mapType === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => onMapTypeChange(type)}
                className="text-xs"
              >
                <Icon className="h-3 w-3 mr-1" />
                {label}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">Data Layers</h3>
          <div className="space-y-2">
            <Button
              variant={showWeather ? 'default' : 'outline'}
              size="sm"
              onClick={onToggleWeather}
              className="w-full justify-start text-xs"
            >
              <Cloud className="h-3 w-3 mr-2" />
              Weather
              {showWeather && <Badge variant="secondary" className="ml-auto text-xs">ON</Badge>}
            </Button>

            <Button
              variant={showAirQuality ? 'default' : 'outline'}
              size="sm"
              onClick={onToggleAirQuality}
              className="w-full justify-start text-xs"
            >
              <Leaf className="h-3 w-3 mr-2" />
              Air Quality
              {showAirQuality && <Badge variant="secondary" className="ml-auto text-xs">ON</Badge>}
            </Button>

            <Button
              variant={showSolar ? 'default' : 'outline'}
              size="sm"
              onClick={onToggleSolar}
              className="w-full justify-start text-xs"
            >
              <Sun className="h-3 w-3 mr-2" />
              Solar Data
              {showSolar && <Badge variant="secondary" className="ml-auto text-xs">ON</Badge>}
            </Button>

            <Button
              variant={showTraffic ? 'default' : 'outline'}
              size="sm"
              onClick={onToggleTraffic}
              className="w-full justify-start text-xs"
            >
              <Route className="h-3 w-3 mr-2" />
              Traffic
              {showTraffic && <Badge variant="secondary" className="ml-auto text-xs">ON</Badge>}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onToggleStreetView}
              className="w-full justify-start text-xs"
            >
              <Camera className="h-3 w-3 mr-2" />
              Street View
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};