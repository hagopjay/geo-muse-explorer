import React, { useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

interface StreetViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  position: google.maps.LatLng;
  apiKey: string;
  placeName: string;
}

export const StreetViewModal: React.FC<StreetViewModalProps> = ({
  isOpen,
  onClose,
  position,
  apiKey,
  placeName
}) => {
  const streetViewRef = useRef<HTMLDivElement>(null);
  const panoramaRef = useRef<google.maps.StreetViewPanorama | null>(null);

  useEffect(() => {
    if (!isOpen || !streetViewRef.current || !position) return;

    const panorama = new google.maps.StreetViewPanorama(streetViewRef.current, {
      position,
      pov: { heading: 0, pitch: 0 },
      zoom: 1,
      visible: true,
      addressControl: false,
      showRoadLabels: true,
      motionTracking: false,
      motionTrackingControl: false
    });

    panoramaRef.current = panorama;

    return () => {
      if (panoramaRef.current) {
        panoramaRef.current = null;
      }
    };
  }, [isOpen, position]);

  const resetView = () => {
    if (panoramaRef.current) {
      panoramaRef.current.setPov({ heading: 0, pitch: 0 });
      panoramaRef.current.setZoom(1);
    }
  };

  const zoomIn = () => {
    if (panoramaRef.current) {
      const currentZoom = panoramaRef.current.getZoom();
      panoramaRef.current.setZoom(Math.min(currentZoom + 0.5, 3));
    }
  };

  const zoomOut = () => {
    if (panoramaRef.current) {
      const currentZoom = panoramaRef.current.getZoom();
      panoramaRef.current.setZoom(Math.max(currentZoom - 0.5, 0));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[80vh] p-0 bg-card border-border">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-foreground">Street View - {placeName}</DialogTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={resetView}>
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
              <Button variant="outline" size="sm" onClick={zoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={zoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 p-6 pt-4">
          <div 
            ref={streetViewRef} 
            className="w-full h-full rounded-lg border border-border overflow-hidden"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};