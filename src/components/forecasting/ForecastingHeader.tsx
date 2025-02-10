
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileDown, Wand2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ModelParametersDialog } from "./ModelParametersDialog";

interface ForecastingHeaderProps {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  handleExport: () => void;
  findBestModel: () => void;
  modelConfigs: any[];
}

export const ForecastingHeader = ({
  selectedModel,
  setSelectedModel,
  handleExport,
  findBestModel,
  modelConfigs,
}: ForecastingHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-4">
        <Select value={selectedModel} onValueChange={setSelectedModel}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Model" />
          </SelectTrigger>
          <SelectContent>
            {modelConfigs.map(model => (
              <SelectItem key={model.id} value={model.id}>
                {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedModel && (
          <ModelParametersDialog
            model={modelConfigs.find(m => m.id === selectedModel)!}
            onParametersChange={(modelId, parameters) => {
              console.log("Parameters updated:", modelId, parameters);
            }}
          />
        )}
        <Button 
          variant="outline" 
          onClick={findBestModel}
          className="flex items-center gap-2"
        >
          <Wand2 className="w-4 h-4" />
          Find Best Model
        </Button>
        <Button variant="outline" onClick={handleExport}>
          <FileDown className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
};
