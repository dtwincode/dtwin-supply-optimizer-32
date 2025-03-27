
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useI18n } from "@/contexts/I18nContext";
import { BufferVisualizer } from "./BufferVisualizer";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export const BufferManagementTab = () => {
  const { t } = useI18n();

  // Mock data for visualization
  const mockBufferZones = {
    red: 20,
    yellow: 30,
    green: 50
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{t("common.inventory.bufferManagement")}</CardTitle>
            <CardDescription>
              {t("common.inventory.bufferManagementDesc")}
            </CardDescription>
          </div>
          <Button size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            {t("common.inventory.createBufferProfile")}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">{t("common.inventory.bufferProfiles")}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Configure buffer profiles for different product categories and manage stock levels.
              </p>
              <div className="mt-4">
                <div className="border rounded p-4 mb-2">
                  <h4 className="font-medium">Standard Components</h4>
                  <div className="mt-2">
                    <BufferVisualizer 
                      netFlowPosition={60} 
                      bufferZones={mockBufferZones}
                      adu={10}
                    />
                  </div>
                </div>
                
                <div className="border rounded p-4">
                  <h4 className="font-medium">Critical Parts</h4>
                  <div className="mt-2">
                    <BufferVisualizer 
                      netFlowPosition={40} 
                      bufferZones={{
                        red: 30,
                        yellow: 30,
                        green: 40
                      }}
                      adu={5}
                    />
                  </div>
                </div>
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
                    <p>Short: 0-14 days</p>
                    <p>Medium: 15-45 days</p>
                    <p>Long: 46+ days</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">{t("common.inventory.variabilityFactor")}</h4>
                  <div className="text-xs text-muted-foreground">
                    <p>Low: &lt;15% deviation</p>
                    <p>Medium: 15-30% deviation</p>
                    <p>High: &gt;30% deviation</p>
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
                <label className="text-sm font-medium">{t("common.inventory.selectADU")}</label>
                <select className="w-full border rounded p-2">
                  <option value="5">5 {t("common.inventory.unitsPerDay")}</option>
                  <option value="10">10 {t("common.inventory.unitsPerDay")}</option>
                  <option value="20">20 {t("common.inventory.unitsPerDay")}</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("common.inventory.selectLeadTime")}</label>
                <select className="w-full border rounded p-2">
                  <option value="short">{t("common.inventory.short")} (7 {t("common.inventory.days")})</option>
                  <option value="medium">{t("common.inventory.medium")} (30 {t("common.inventory.days")})</option>
                  <option value="long">{t("common.inventory.long")} (60 {t("common.inventory.days")})</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("common.inventory.selectVariability")}</label>
                <select className="w-full border rounded p-2">
                  <option value="low">{t("common.inventory.low")} (10%)</option>
                  <option value="medium">{t("common.inventory.medium")} (20%)</option>
                  <option value="high">{t("common.inventory.high")} (40%)</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2">{t("common.inventory.simulatedBufferVisualization")}</h4>
              <BufferVisualizer 
                netFlowPosition={75} 
                bufferZones={{
                  red: 25,
                  yellow: 35,
                  green: 40
                }}
                adu={10}
              />
            </div>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};
