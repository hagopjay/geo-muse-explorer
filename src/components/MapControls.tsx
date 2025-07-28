import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Square, Trash2, Target } from 'lucide-react';

interface MapControlsProps {
  onToggleDrawing: () => void;
  onClear: () => void;
  isDrawing: boolean;
}

export const MapControls: React.FC<MapControlsProps> = ({
  onToggleDrawing,
  onClear,
  isDrawing
}) => {
  return (
    <Card className="bg-card/80 backdrop-blur-md border-border/50 p-4">
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-foreground mb-2">Map Tools</h3>
        
        <Button
          variant={isDrawing ? "default" : "glass"}
          size="sm"
          onClick={onToggleDrawing}
          className="justify-start"
        >
          <Square className="h-4 w-4" />
          {isDrawing ? 'Stop Drawing' : 'Draw Area'}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onClear}
          className="justify-start"
        >
          <Trash2 className="h-4 w-4" />
          Clear All
        </Button>
      </div>
    </Card>
  );
};