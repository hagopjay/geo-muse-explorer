import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Star, 
  DollarSign, 
  Phone, 
  Globe, 
  MapPin, 
  Clock,
  Navigation,
  Image as ImageIcon,
  MessageSquare
} from 'lucide-react';

interface PlaceDetailsProps {
  place: google.maps.places.PlaceResult;
  onClose: () => void;
  map: google.maps.Map | null;
}

interface PlaceDetails {
  photos?: google.maps.places.PlacePhoto[];
  reviews?: google.maps.places.PlaceReview[];
  formatted_phone_number?: string;
  website?: string;
  opening_hours?: google.maps.places.PlaceOpeningHours;
  formatted_address?: string;
}

export const PlaceDetails: React.FC<PlaceDetailsProps> = ({ place, onClose, map }) => {
  const [details, setDetails] = useState<PlaceDetails | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!map || !place.place_id) return;

    setLoading(true);
    const service = new google.maps.places.PlacesService(map);
    
    service.getDetails({
      placeId: place.place_id,
      fields: [
        'photos', 
        'reviews', 
        'formatted_phone_number', 
        'website', 
        'opening_hours',
        'formatted_address'
      ]
    }, (result, status) => {
      setLoading(false);
      if (status === google.maps.places.PlacesServiceStatus.OK && result) {
        setDetails(result);
      }
    });
  }, [place.place_id, map]);

  const getDirections = () => {
    if (place.geometry?.location) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${place.geometry.location.lat()},${place.geometry.location.lng()}`;
      window.open(url, '_blank');
    }
  };

  const getPriceLevel = (level?: number) => {
    if (!level) return 'Price not available';
    return '$'.repeat(level) + ' '.repeat(4 - level);
  };

  return (
    <div className="fixed right-0 top-0 h-full w-96 z-20">
      <Card className="h-full rounded-none bg-card/90 backdrop-blur-md border-l border-border/50 shadow-card">
        <CardHeader className="border-b border-border/50 pb-4">
          <div className="flex items-start gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="mt-1"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold text-foreground">
                {place.name}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                {place.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-muted-foreground">
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
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-120px)]">
            <div className="p-4 space-y-6">
              
              {/* Photos Section */}
              {details?.photos && details.photos.length > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Photos
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {details.photos.slice(0, 4).map((photo, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden bg-muted">
                        <img 
                          src={photo.getUrl({ maxWidth: 200, maxHeight: 200 })}
                          alt={`${place.name} photo ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Info */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Contact & Location</h3>
                <div className="space-y-3">
                  {details?.formatted_address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span className="text-sm text-muted-foreground">
                        {details.formatted_address}
                      </span>
                    </div>
                  )}
                  
                  {details?.formatted_phone_number && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a 
                        href={`tel:${details.formatted_phone_number}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {details.formatted_phone_number}
                      </a>
                    </div>
                  )}
                  
                  {details?.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a 
                        href={details.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>

                <Button 
                  onClick={getDirections}
                  variant="gradient"
                  className="w-full mt-4"
                >
                  <Navigation className="h-4 w-4" />
                  Get Directions
                </Button>
              </div>

              {/* Hours */}
              {details?.opening_hours && (
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Hours
                  </h3>
                  <div className="space-y-1">
                    {details.opening_hours.weekday_text?.map((day, index) => (
                      <div key={index} className="text-sm text-muted-foreground">
                        {day}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              {details?.reviews && details.reviews.length > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Reviews
                  </h3>
                  <div className="space-y-4">
                    {details.reviews.slice(0, 3).map((review, index) => (
                      <Card key={index} className="bg-muted/30 border-border/30">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
                              {review.author_name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm text-foreground">
                                  {review.author_name}
                                </span>
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`h-3 w-3 ${
                                        i < (review.rating || 0) 
                                          ? 'fill-yellow-400 text-yellow-400' 
                                          : 'text-muted-foreground'
                                      }`} 
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-3">
                                {review.text}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};