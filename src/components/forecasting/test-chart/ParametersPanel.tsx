
import { type ModelParameter } from "@/types/modelParameters";

interface ParametersPanelProps {
  parameters: Array<{
    name: string;
    key: string;
    min: number;
    max: number;
    step: number;
    description: string;
  }>;
  values: Record<string, number>;
  onChange: (key: string, value: number) => void;
}

export const ParametersPanel = ({ parameters, values, onChange }: ParametersPanelProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      {parameters.map((param) => (
        <div key={param.key}>
          <label className="block text-sm font-medium mb-2">
            {param.name}
            <span className="block text-xs text-gray-500">{param.description}</span>
          </label>
          <input
            type="range"
            min={param.min}
            max={param.max}
            step={param.step}
            value={values[param.key]}
            onChange={(e) => onChange(param.key, parseFloat(e.target.value))}
            className="w-full"
          />
          <span className="text-sm text-gray-500">
            {values[param.key]}
          </span>
        </div>
      ))}
    </div>
  );
};
