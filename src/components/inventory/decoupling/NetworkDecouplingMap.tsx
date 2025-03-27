
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DecouplingNetworkBoard } from "./DecouplingNetworkBoard";
import { useDecouplingPoints } from "@/hooks/useDecouplingPoints";
import { Loader2 } from "lucide-react";

export const NetworkDecouplingMap: React.FC = () => {
  const { decouplingNetwork, isNetworkLoading } = useDecouplingPoints();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Network Decoupling Map</CardTitle>
      </CardHeader>
      <CardContent>
        {isNetworkLoading ? (
          <div className="flex h-60 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <DecouplingNetworkBoard network={decouplingNetwork} />
        )}
      </CardContent>
    </Card>
  );
};
