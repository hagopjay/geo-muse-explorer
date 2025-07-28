import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets, Eye } from 'lucide-react';

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  visibility: number;
  condition: string;
  icon: string;
}

interface WeatherOverlayProps {
  position: google.maps.LatLng;
  apiKey: string;
}

export const WeatherOverlay: React.FC<WeatherOverlayProps> = ({ position, apiKey }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!position) return;
    
    setLoading(true);
    // Using OpenWeatherMap as example - you'd use Google Weather API
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${position.lat()}&lon=${position.lng()}&appid=${apiKey}&units=metric`)
      .then(res => res.json())
      .then(data => {
        setWeather({
          temperature: Math.round(data.main.temp),
          humidity: data.main.humidity,
          windSpeed: Math.round(data.wind.speed * 3.6), // m/s to km/h
          visibility: Math.round(data.visibility / 1000), // m to km
          condition: data.weather[0].description,
          icon: data.weather[0].icon
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [position, apiKey]);

  if (loading || !weather) return null;

  const getWeatherIcon = (condition: string) => {
    if (condition.includes('rain')) return <CloudRain className="h-4 w-4" />;
    if (condition.includes('cloud')) return <Cloud className="h-4 w-4" />;
    return <Sun className="h-4 w-4" />;
  };

  return (
    <Card className="absolute top-6 right-6 z-10 w-64 bg-card/95 backdrop-blur-md border-border/50">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          {getWeatherIcon(weather.condition)}
          <div>
            <h3 className="font-semibold text-foreground">Live Weather</h3>
            <p className="text-xs text-muted-foreground capitalize">{weather.condition}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Thermometer className="h-3 w-3 text-orange-400" />
            <span className="text-foreground">{weather.temperature}°C</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Droplets className="h-3 w-3 text-blue-400" />
            <span className="text-foreground">{weather.humidity}%</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Wind className="h-3 w-3 text-cyan-400" />
            <span className="text-foreground">{weather.windSpeed} km/h</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Eye className="h-3 w-3 text-purple-400" />
            <span className="text-foreground">{weather.visibility} km</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};