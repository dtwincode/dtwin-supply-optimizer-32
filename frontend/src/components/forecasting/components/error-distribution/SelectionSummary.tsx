
import { ErrorBin } from "./types";

interface SelectionSummaryProps {
  visibleData: ErrorBin[];
}

export const SelectionSummary = ({ visibleData }: SelectionSummaryProps) => {
  return (
    <div className="mt-4 p-4 bg-muted rounded-lg shadow-sm">
      <h4 className="text-sm font-medium mb-3">Selection Summary</h4>
      <div className="grid grid-cols-2 gap-6 text-sm">
        <div>
          <span className="text-muted-foreground">Total Errors:</span>
          <span className="ml-2 font-medium">
            {visibleData.reduce((sum, bin) => sum + bin.count, 0)}
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">Average Error:</span>
          <span className="ml-2 font-medium">
            {(visibleData
              .reduce((sum, bin) => sum + (bin.errorRange[0] + bin.errorRange[1]) / 2 * bin.count, 0) /
              visibleData
                .reduce((sum, bin) => sum + bin.count, 0))
              .toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
};
