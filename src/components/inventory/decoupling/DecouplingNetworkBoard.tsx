import React, { useState, useEffect } from 'react';
import { useDecouplingPoints } from '@/hooks/useDecouplingPoints';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DecouplingPoint } from '@/types/inventory/decouplingTypes';
import { InventoryItem } from '@/types/inventory';
import { CircleOff, CircleDot, Network } from 'lucide-react'; // Change Process to Network
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { useToast } from '@/hooks/use-toast';

interface DecouplingPointCardProps {
  point: DecouplingPoint;
  onDelete: (id: string) => void;
}

const DecouplingPointCard: React.FC<DecouplingPointCardProps> = ({ point, onDelete }) => {
  const [isManualOverride, setIsManualOverride] = useState(point.isOverride || false);
  const { toast } = useToast();

  const handleToggle = () => {
    setIsManualOverride(!isManualOverride);
    toast({
      title: "Decoupling Point Override",
      description: `Decoupling point ${point.id} has been manually overridden.`,
    });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-sm font-medium">{point.id}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 text-sm">
        <div className="flex items-center space-x-2">
          <CircleDot className="h-4 w-4 text-green-500" />
          <span>{point.locationId}</span>
        </div>
        <div className="text-muted-foreground text-xs">Type: {point.type}</div>
        <div className="text-muted-foreground text-xs">Buffer Profile: {point.bufferProfileId}</div>
        <div className="flex items-center justify-between mt-2">
          <Toggle variant="outline" size="sm" pressed={isManualOverride} onPressedChange={handleToggle}>
            Override
          </Toggle>
          <Button variant="destructive" size="sm" onClick={() => onDelete(point.id)}>
            Remove
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

interface DecouplingNetworkBoardProps {
  items: InventoryItem[];
}

export const DecouplingNetworkBoard: React.FC<DecouplingNetworkBoardProps> = ({ items }) => {
  const { decouplingPoints, loading, error, deleteDecouplingPoint, createDecouplingPoint } = useDecouplingPoints();
  const [showAll, setShowAll] = useState(false);
  const [newProductId, setNewProductId] = useState('');
  const [newLocationId, setNewLocationId] = useState('');
  const [newBufferProfileId, setNewBufferProfileId] = useState('default-profile');
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    try {
      await deleteDecouplingPoint(id);
      toast({
        title: "Decoupling Point Deleted",
        description: `Decoupling point ${id} has been successfully removed.`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete decoupling point",
        variant: "destructive",
      });
    }
  };

  const handleCreate = async () => {
    if (!newProductId || !newLocationId) {
      toast({
        title: "Error",
        description: "Product ID and Location ID are required",
        variant: "destructive",
      });
      return;
    }

    try {
      await createDecouplingPoint({
        productId: newProductId,
        locationId: newLocationId,
        bufferProfileId: newBufferProfileId,
      });
      toast({
        title: "Decoupling Point Created",
        description: `Decoupling point ${newProductId}-${newLocationId} has been successfully created.`,
      });
      setNewProductId('');
      setNewLocationId('');
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create decoupling point",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="p-4">Loading decoupling points...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error.message}</div>;
  }

  const visiblePoints = showAll ? decouplingPoints : decouplingPoints.slice(0, 6);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Decoupling Network</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {visiblePoints.map((point) => (
              <DecouplingPointCard key={point.id} point={point} onDelete={handleDelete} />
            ))}
          </div>
          {decouplingPoints.length > 6 && (
            <Button variant="secondary" size="sm" onClick={() => setShowAll(!showAll)} className="mt-4">
              {showAll ? "Show Less" : "Show All"}
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Create New Decoupling Point</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Product ID</label>
            <input
              type="text"
              value={newProductId}
              onChange={(e) => setNewProductId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location ID</label>
            <input
              type="text"
              value={newLocationId}
              onChange={(e) => setNewLocationId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Buffer Profile ID</label>
            <input
              type="text"
              value={newBufferProfileId}
              onChange={(e) => setNewBufferProfileId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleCreate}>Create</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
