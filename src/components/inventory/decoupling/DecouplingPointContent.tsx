import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface DecouplingPoint {
  id: string;
  location_id: string;
  buffer_profile_id: string;
  description: string;
  created_at: string;
}

export const DecouplingPointContent: React.FC = () => {
  const [decouplingPoints, setDecouplingPoints] = useState<DecouplingPoint[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDecouplingPoints();
  }, []);

  const fetchDecouplingPoints = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("decoupling_points")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching decoupling points:", error.message);
    } else {
      setDecouplingPoints(data as DecouplingPoint[]);
    }
    setLoading(false);
  };

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {loading ? (
        <p>Loading decoupling points...</p>
      ) : decouplingPoints.length === 0 ? (
        <p>No decoupling points found.</p>
      ) : (
        decouplingPoints.map((point) => (
          <Card key={point.id} className="shadow-md hover:shadow-lg transition rounded-2xl">
            <CardContent className="p-4 space-y-2">
              <h3 className="text-lg font-semibold">Location: {point.location_id}</h3>
              <p className="text-sm">Buffer Profile: {point.buffer_profile_id}</p>
              <p className="text-sm text-muted-foreground">{point.description}</p>
              <p className="text-xs text-gray-500">Created: {new Date(point.created_at).toLocaleDateString()}</p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};
