import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf, AlertTriangle, Skull } from 'lucide-react';

interface AirQualityData {
  aqi: number;
  category: string;
  pollutants: {
    pm25: number;
    pm10: number;
    no2: number;
    o3: number;
  };
}

interface AirQualityOverlayProps {
  position: google.maps.LatLng;
  apiKey: string;
}

export const AirQualityOverlay: React.FC<AirQualityOverlayProps> = ({ position, apiKey }) => {
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!position) return;
    
    setLoading(true);
    // Google Air Quality API call
    fetch(`https://airquality.googleapis.com/v1/currentConditions:lookup?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: {
          latitude: position.lat(),
          longitude: position.lng()
        }
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.indexes && data.indexes.length > 0) {
          const aqiData = data.indexes.find((index: any) => index.code === 'uaqi') || data.indexes[0];
          setAirQuality({
            aqi: aqiData.aqi,
            category: aqiData.category,
            pollutants: {
              pm25: data.pollutants?.find((p: any) => p.code === 'pm25')?.concentration?.value || 0,
              pm10: data.pollutants?.find((p: any) => p.code === 'pm10')?.concentration?.value || 0,
              no2: data.pollutants?.find((p: any) => p.code === 'no2')?.concentration?.value || 0,
              o3: data.pollutants?.find((p: any) => p.code === 'o3')?.concentration?.value || 0,
            }
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [position, apiKey]);

  if (loading || !airQuality) return null;

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return 'text-green-400';
    if (aqi <= 100) return 'text-yellow-400';
    if (aqi <= 150) return 'text-orange-400';
    return 'text-red-400';
  };

  const getAQIIcon = (aqi: number) => {
    if (aqi <= 50) return <Leaf className="h-4 w-4 text-green-400" />;
    if (aqi <= 100) return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
    return <Skull className="h-4 w-4 text-red-400" />;
  };

  return (
    <Card className="absolute top-6 right-80 z-10 w-64 bg-card/95 backdrop-blur-md border-border/50">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          {getAQIIcon(airQuality.aqi)}
          <div>
            <h3 className="font-semibold text-foreground">Air Quality</h3>
            <Badge variant="outline" className={`text-xs ${getAQIColor(airQuality.aqi)}`}>
              AQI {airQuality.aqi} - {airQuality.category}
            </Badge>
          </div>
        </div>
        
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">PM2.5:</span>
            <span className="text-foreground">{airQuality.pollutants.pm25.toFixed(1)} μg/m³</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">PM10:</span>
            <span className="text-foreground">{airQuality.pollutants.pm10.toFixed(1)} μg/m³</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">NO₂:</span>
            <span className="text-foreground">{airQuality.pollutants.no2.toFixed(1)} μg/m³</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">O₃:</span>
            <span className="text-foreground">{airQuality.pollutants.o3.toFixed(1)} μg/m³</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};