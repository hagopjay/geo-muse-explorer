import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sun, Zap, DollarSign, Calendar } from 'lucide-react';

interface SolarData {
  solarPotential: 'HIGH' | 'MEDIUM' | 'LOW';
  maxArrayPanelsCount: number;
  yearlyEnergyDcKwh: number;
  carbonOffsetFactorKgPerMwh: number;
  panelCapacityWatts: number;
}

interface SolarDataOverlayProps {
  position: google.maps.LatLng;
  apiKey: string;
}

export const SolarDataOverlay: React.FC<SolarDataOverlayProps> = ({ position, apiKey }) => {
  const [solarData, setSolarData] = useState<SolarData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!position) return;
    
    setLoading(true);
    // Google Solar API call
    fetch(`https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${position.lat()}&location.longitude=${position.lng()}&key=${apiKey}`)
      .then(res => res.json())
      .then(data => {
        if (data.solarPotential) {
          setSolarData({
            solarPotential: data.solarPotential,
            maxArrayPanelsCount: data.maxArrayPanelsCount || 0,
            yearlyEnergyDcKwh: data.maxArrayAreaMeters2 * 150 || 0, // Estimated
            carbonOffsetFactorKgPerMwh: data.carbonOffsetFactorKgPerMwh || 400,
            panelCapacityWatts: data.panelCapacityWatts || 250
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [position, apiKey]);

  if (loading || !solarData) return null;

  const getSolarColor = (potential: string) => {
    switch (potential) {
      case 'HIGH': return 'text-green-400 bg-green-400/20';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-400/20';
      case 'LOW': return 'text-red-400 bg-red-400/20';
      default: return 'text-muted-foreground bg-muted/20';
    }
  };

  return (
    <Card className="absolute bottom-6 right-6 z-10 w-72 bg-card/95 backdrop-blur-md border-border/50">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Sun className="h-4 w-4 text-yellow-400" />
          <div>
            <h3 className="font-semibold text-foreground">Solar Potential</h3>
            <Badge className={`text-xs ${getSolarColor(solarData.solarPotential)}`}>
              {solarData.solarPotential} POTENTIAL
            </Badge>
          </div>
        </div>
        
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-3 w-3 text-blue-400" />
              <span className="text-muted-foreground">Max Panels:</span>
            </div>
            <span className="text-foreground font-medium">{solarData.maxArrayPanelsCount}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3 text-green-400" />
              <span className="text-muted-foreground">Yearly Energy:</span>
            </div>
            <span className="text-foreground font-medium">{(solarData.yearlyEnergyDcKwh / 1000).toFixed(1)} MWh</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-3 w-3 text-emerald-400" />
              <span className="text-muted-foreground">Panel Capacity:</span>
            </div>
            <span className="text-foreground font-medium">{solarData.panelCapacityWatts}W each</span>
          </div>
          
          <div className="pt-2 border-t border-border">
            <span className="text-xs text-muted-foreground">
              Carbon offset: {solarData.carbonOffsetFactorKgPerMwh} kg CO₂/MWh
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};