import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MapControls } from './MapControls';
import { PlacesSidebar } from './PlacesSidebar';
import { ApiKeyInput } from './ApiKeyInput';
import { toast } from 'sonner';

interface MapContainerProps {
  apiKey: string;
}

export const MapContainer: React.FC<MapContainerProps> = ({ apiKey }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [drawingManager, setDrawingManager] = useState<google.maps.drawing.DrawingManager | null>(null);
  const [places, setPlaces] = useState<google.maps.places.PlaceResult[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (!apiKey || !mapRef.current) return;

    const loader = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['places', 'drawing', 'geometry']
    });

    loader.load().then(() => {
      const mapInstance = new google.maps.Map(mapRef.current!, {
        center: { lat: 40.7128, lng: -74.0060 }, // NYC
        zoom: 12,
        styles: [
          {
            "featureType": "all",
            "elementType": "geometry",
            "stylers": [{ "color": "#1a1a2e" }]
          },
          {
            "featureType": "all",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#ffffff" }]
          },
          {
            "featureType": "all",
            "elementType": "labels.text.stroke",
            "stylers": [{ "color": "#000000" }, { "lightness": 13 }]
          },
          {
            "featureType": "administrative",
            "elementType": "geometry.fill",
            "stylers": [{ "color": "#16213e" }]
          },
          {
            "featureType": "administrative",
            "elementType": "geometry.stroke",
            "stylers": [{ "color": "#000000" }, { "lightness": 14 }, { "weight": 1.4 }]
          },
          {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [{ "color": "#08304b" }]
          },
          {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [{ "color": "#0c4152" }, { "lightness": 5 }]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [{ "color": "#000000" }]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [{ "color": "#0b434f" }, { "lightness": 25 }]
          },
          {
            "featureType": "road.arterial",
            "elementType": "geometry.fill",
            "stylers": [{ "color": "#000000" }]
          },
          {
            "featureType": "road.arterial",
            "elementType": "geometry.stroke",
            "stylers": [{ "color": "#0b3d51" }, { "lightness": 16 }]
          },
          {
            "featureType": "road.local",
            "elementType": "geometry",
            "stylers": [{ "color": "#000000" }]
          },
          {
            "featureType": "transit",
            "elementType": "all",
            "stylers": [{ "color": "#146474" }]
          },
          {
            "featureType": "water",
            "elementType": "all",
            "stylers": [{ "color": "#021019" }]
          }
        ],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      const drawingManagerInstance = new google.maps.drawing.DrawingManager({
        drawingMode: null,
        drawingControl: false,
        rectangleOptions: {
          fillColor: '#8b5cf6',
          fillOpacity: 0.2,
          strokeWeight: 2,
          strokeColor: '#8b5cf6',
          clickable: false,
          editable: true,
          zIndex: 1
        }
      });

      drawingManagerInstance.setMap(mapInstance);

      drawingManagerInstance.addListener('rectanglecomplete', (rectangle: google.maps.Rectangle) => {
        setIsDrawing(false);
        const bounds = rectangle.getBounds();
        if (bounds) {
          searchPlacesInBounds(bounds, mapInstance);
        }
      });

      setMap(mapInstance);
      setDrawingManager(drawingManagerInstance);
      toast.success('Map loaded successfully!');
    }).catch(() => {
      toast.error('Failed to load Google Maps');
    });
  }, [apiKey]);

  const searchPlacesInBounds = (bounds: google.maps.LatLngBounds, mapInstance: google.maps.Map) => {
    const service = new google.maps.places.PlacesService(mapInstance);
    const center = bounds.getCenter();
    
    const placeTypes = [
      'restaurant', 'lodging', 'tourist_attraction', 'bank', 
      'hospital', 'pharmacy', 'gas_station', 'shopping_mall', 
      'movie_theater', 'gym', 'spa'
    ];

    let allPlaces: google.maps.places.PlaceResult[] = [];
    let completedRequests = 0;

    placeTypes.forEach(type => {
      const request = {
        location: center,
        radius: 2000,
        type: type,
        fields: ['place_id', 'name', 'geometry', 'rating', 'photos', 'price_level', 'types']
      };

      service.nearbySearch(request, (results, status) => {
        completedRequests++;
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          allPlaces = [...allPlaces, ...results.slice(0, 5)];
        }
        
        if (completedRequests === placeTypes.length) {
          setPlaces(allPlaces);
          toast.success(`Found ${allPlaces.length} places in your area!`);
        }
      });
    });
  };

  const toggleDrawing = () => {
    if (!drawingManager) return;
    
    if (isDrawing) {
      drawingManager.setDrawingMode(null);
      setIsDrawing(false);
    } else {
      drawingManager.setDrawingMode(google.maps.drawing.OverlayType.RECTANGLE);
      setIsDrawing(true);
    }
  };

  const clearMap = () => {
    setPlaces([]);
    setSelectedPlace(null);
    toast.info('Map cleared');
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-background">
      {/* Map Container */}
      <div 
        ref={mapRef} 
        className="absolute inset-0 h-full w-full"
      />

      {/* Controls Overlay */}
      <div className="absolute top-6 left-6 z-10">
        <MapControls 
          onToggleDrawing={toggleDrawing}
          onClear={clearMap}
          isDrawing={isDrawing}
        />
      </div>

      {/* Places Sidebar */}
      <PlacesSidebar 
        places={places}
        selectedPlace={selectedPlace}
        onPlaceSelect={setSelectedPlace}
        map={map}
      />
    </div>
  );
};