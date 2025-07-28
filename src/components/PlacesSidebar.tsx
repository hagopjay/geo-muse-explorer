import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MapPin, 
  Star, 
  DollarSign, 
  Navigation, 
  Image,
  ChevronRight,
  X,
  Phone,
  Globe,
  Clock
} from 'lucide-react';
import { PlaceDetails } from './PlaceDetails';

interface PlacesSidebarProps {
  places: google.maps.places.PlaceResult[];
  selectedPlace: google.maps.places.PlaceResult | null;
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
  map: google.maps.Map | null;
  onOpenStreetView: (position: google.maps.LatLng, placeName: string) => void;
}

export const PlacesSidebar: React.FC<PlacesSidebarProps> = ({
  places,
  selectedPlace,
  onPlaceSelect,
  map,
  onOpenStreetView
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  const getPlaceTypeIcon = (types: string[] = []) => {
    if (types.includes('restaurant') || types.includes('food')) return '🍽️';
    if (types.includes('lodging')) return '🏨';
    if (types.includes('tourist_attraction')) return '🎯';
    if (types.includes('bank')) return '🏦';
    if (types.includes('hospital')) return '🏥';
    if (types.includes('shopping_mall') || types.includes('store')) return '🛒';
    if (types.includes('gas_station')) return '⛽';
    if (types.includes('movie_theater')) return '🎬';
    if (types.includes('gym')) return '💪';
    if (types.includes('spa')) return '🧘';
    return '📍';
  };

  const getPriceLevel = (level?: number) => {
    if (!level) return null;
    return '$'.repeat(level);
  };

  const focusOnPlace = (place: google.maps.places.PlaceResult) => {
    if (map && place.geometry?.location) {
      map.setCenter(place.geometry.location);
      map.setZoom(16);
      
      new google.maps.Marker({
        position: place.geometry.location,
        map: map,
        title: place.name,
        animation: google.maps.Animation.BOUNCE,
      });
    }
  };

  if (selectedPlace) {
    return <PlaceDetails place={selectedPlace} onClose={() => onPlaceSelect(null)} map={map} onOpenStreetView={onOpenStreetView} />;
  }

  return (
    <div className={`fixed right-0 top-0 h-full z-20 transition-all duration-300 ${
      isMinimized ? 'w-16' : 'w-96'
    }`}>
      <Card className="h-full rounded-none bg-card/90 backdrop-blur-md border-l border-border/50 shadow-card">
        <CardHeader className="border-b border-border/50 pb-4">
          <div className="flex items-center justify-between">
            {!isMinimized && (
              <CardTitle className="text-lg font-semibold text-foreground">
                Discovered Places
              </CardTitle>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(!isMinimized)}
              className="ml-auto"
            >
              {isMinimized ? <ChevronRight className="h-4 w-4" /> : <X className="h-4 w-4" />}
            </Button>
          </div>
          {!isMinimized && places.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {places.length} places found in your selected area
            </p>
          )}
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-120px)]">
              {places.length === 0 ? (
                <div className="p-6 text-center">
                  <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Draw a rectangle on the map to discover places in that area
                  </p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {places.map((place, index) => (
                    <Card key={place.place_id || index} className="cursor-pointer hover:shadow-card transition-all duration-200 bg-card/50 border-border/30">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">{getPlaceTypeIcon(place.types)}</div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-foreground truncate">
                              {place.name}
                            </h4>
                            
                            <div className="flex items-center gap-2 mt-1">
                              {place.rating && (
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs text-muted-foreground">
                                    {place.rating}
                                  </span>
                                </div>
                              )}
                              
                              {place.price_level && (
                                <Badge variant="outline" className="text-xs">
                                  {getPriceLevel(place.price_level)}
                                </Badge>
                              )}
                            </div>

                            <div className="flex gap-2 mt-3">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => focusOnPlace(place)}
                                className="text-xs"
                              >
                                <Navigation className="h-3 w-3" />
                                View
                              </Button>
                              
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => onPlaceSelect(place)}
                                className="text-xs"
                              >
                                Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        )}
      </Card>
    </div>
  );
};