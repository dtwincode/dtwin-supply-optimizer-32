
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/contexts/I18nContext";
import { BufferVisualizer } from "./BufferVisualizer";
import { useBufferProfiles } from "@/hooks/useBufferProfiles";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { bufferZoneFormulas } from "@/utils/inventoryUtils";

export const BufferManagementContent = () => {
  const { t } = useI18n();
  const { profiles, loading } = useBufferProfiles();
  
  const [adu, setAdu] = useState(10);
  const [leadTime, setLeadTime] = useState(14);
  const [variability, setVariability] = useState(1);
  const [selectedProfile, setSelectedProfile] = useState<string>("standard");
  
  // Calculated buffer zones based on inputs
  const bufferZones = {
    red: Math.round(adu * (leadTime <= 7 ? 0.7 : leadTime <= 14 ? 1.0 : 1.3) * variability),
    yellow: Math.round(adu * leadTime),
    green: Math.round(adu * leadTime * 0.7)
  };
  
  const totalBuffer = bufferZones.red + bufferZones.yellow + bufferZones.green;
  const netFlowPosition = Math.round(totalBuffer * 0.6); // 40% penetration for demo
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">{t("common.inventory.bufferProfiles")}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Configure buffer profiles for different product categories and manage stock levels.
          </p>
          
          <div className="mt-4">
            {loading ? (
              <div className="text-center py-4">Loading profiles...</div>
            ) : (
              <div className="space-y-4">
                {profiles.map(profile => (
                  <div key={profile.id} className="border rounded p-4">
                    <h4 className="font-medium">{profile.name}</h4>
                    <p className="text-sm text-muted-foreground">{profile.description}</p>
                    <div className="mt-2">
                      <BufferVisualizer 
                        netFlowPosition={Math.round(75 * (profile.variabilityFactor === 'high_variability' ? 0.3 : 0.6))} 
                        bufferZones={{
                          red: 25,
                          yellow: 35,
                          green: 40
                        }}
                        adu={10}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
        
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">{t("common.inventory.bufferConfiguration")}</h3>
          <p className="text-sm text-muted-foreground">
            Configure global buffer settings and calculation parameters.
          </p>
          
          <div className="mt-4 space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-1">{t("common.inventory.leadTimeFactors")}</h4>
              <div className="text-xs text-muted-foreground">
                <p>Short: 0-7 days (0.7x)</p>
                <p>Medium: 8-14 days (1.0x)</p>
                <p>Long: 15+ days (1.3x)</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">{t("common.inventory.variabilityFactor")}</h4>
              <div className="text-xs text-muted-foreground">
                <p>Low: &lt;15% deviation (0.7x)</p>
                <p>Medium: 15-30% deviation (1.0x)</p>
                <p>High: &gt;30% deviation (1.3x)</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">{t("common.inventory.bufferFormulas")}</h4>
              <div className="text-xs text-muted-foreground bg-gray-50 p-2 rounded">
                <p>{bufferZoneFormulas.redZone}</p>
                <p>{bufferZoneFormulas.yellowZone}</p>
                <p>{bufferZoneFormulas.greenZone}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">{t("common.inventory.bufferSimulation")}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {t("common.inventory.bufferSimulationDesc")}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="space-y-2">
            <Label>{t("common.inventory.selectADU")}</Label>
            <Slider
              value={[adu]}
              min={1}
              max={50}
              step={1}
              onValueChange={(value) => setAdu(value[0])}
            />
            <div className="text-sm">{adu} {t("common.inventory.unitsPerDay")}</div>
          </div>
          
          <div className="space-y-2">
            <Label>{t("common.inventory.selectLeadTime")}</Label>
            <Slider
              value={[leadTime]}
              min={1}
              max={30}
              step={1}
              onValueChange={(value) => setLeadTime(value[0])}
            />
            <div className="text-sm">{leadTime} {t("common.inventory.days")}</div>
          </div>
          
          <div className="space-y-2">
            <Label>{t("common.inventory.selectVariability")}</Label>
            <Select 
              value={variability.toString()} 
              onValueChange={(value) => setVariability(parseFloat(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select variability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.7">{t("common.inventory.low")} (0.7x)</SelectItem>
                <SelectItem value="1">{t("common.inventory.medium")} (1.0x)</SelectItem>
                <SelectItem value="1.3">{t("common.inventory.high")} (1.3x)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-2">{t("common.inventory.simulatedBufferVisualization")}</h4>
          <div className="border p-4 rounded">
            <BufferVisualizer 
              netFlowPosition={netFlowPosition} 
              bufferZones={bufferZones}
              adu={adu}
            />
            
            <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
              <div>
                <span className="font-medium">Red Zone:</span> {bufferZones.red}
              </div>
              <div>
                <span className="font-medium">Yellow Zone:</span> {bufferZones.yellow}
              </div>
              <div>
                <span className="font-medium">Green Zone:</span> {bufferZones.green}
              </div>
              <div>
                <span className="font-medium">Total Buffer:</span> {totalBuffer}
              </div>
              <div>
                <span className="font-medium">Net Flow Position:</span> {netFlowPosition}
              </div>
              <div>
                <span className="font-medium">Buffer Penetration:</span> {Math.round((totalBuffer - netFlowPosition) / totalBuffer * 100)}%
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
