import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Plus, Trash } from "lucide-react";
import { fetchDecouplingPoints, updateDecouplingPoint, deleteDecouplingPoint } from "@/lib/decoupling.service";

interface DecouplingPoint {
  id: string;
  location_id: string;
  buffer_profile_id: string;
  description?: string;
}

export function DecouplingPointContent() {
  const [points, setPoints] = useState<DecouplingPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editProfile, setEditProfile] = useState("");

  const loadPoints = async () => {
    setIsLoading(true);
    try {
      const data = await fetchDecouplingPoints();
      setPoints(data);
    } catch (error) {
      console.error("Error loading decoupling points:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPoints();
  }, []);

  const handleEdit = (id: string, currentProfile: string) => {
    setEditingId(id);
    setEditProfile(currentProfile);
  };

  const handleSave = async (id: string) => {
    try {
      await updateDecouplingPoint(id, editProfile);
      setEditingId(null);
      loadPoints();
    } catch (error) {
      console.error("Error updating decoupling point:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDecouplingPoint(id);
      loadPoints();
    } catch (error) {
      console.error("Error deleting decoupling point:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Decoupling Points Management</h2>
        <Button variant="secondary">
          <Plus className="h-4 w-4 mr-2" />
          Add Point
        </Button>
      </div>

      {isLoading ? (
        <p>Loading decoupling points...</p>
      ) : points.length === 0 ? (
        <p>No decoupling points found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {points.map((point) => (
            <Card key={point.id} className="shadow-md">
              <CardHeader>
                <CardTitle>Location: {point.location_id}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {editingId === point.id ? (
                  <>
                    <Input
                      value={editProfile}
                      onChange={(e) => setEditProfile(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleSave(point.id)}>
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <p>Buffer Profile: {point.buffer_profile_id}</p>
                    <p className="text-sm text-muted-foreground">
                      {point.description || "No description"}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(point.id, point.buffer_profile_id)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(point.id)}>
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
