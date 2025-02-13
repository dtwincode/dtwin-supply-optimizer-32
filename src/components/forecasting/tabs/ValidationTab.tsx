
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { type ValidationResult, type CrossValidationResult } from "@/utils/forecasting/statistics";

interface ForecastContextType {
  validationResults: ValidationResult;
  crossValidationResults: CrossValidationResult;
}

export const ValidationTab = () => {
  const navigate = useNavigate();
  const { validationResults, crossValidationResults } = useOutletContext<ForecastContextType>();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/forecasting")}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Forecasting
        </Button>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Forecast Validation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Statistical Tests</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className={`mr-2 ${validationResults.biasTest ? 'text-green-500' : 'text-red-500'}`}>
                  {validationResults.biasTest ? '✓' : '×'}
                </span>
                Bias Test
              </li>
              <li className="flex items-center">
                <span className={`mr-2 ${validationResults.residualNormality ? 'text-green-500' : 'text-red-500'}`}>
                  {validationResults.residualNormality ? '✓' : '×'}
                </span>
                Residual Normality
              </li>
              <li className="flex items-center">
                <span className={`mr-2 ${validationResults.heteroskedasticityTest ? 'text-green-500' : 'text-red-500'}`}>
                  {validationResults.heteroskedasticityTest ? '✓' : '×'}
                </span>
                Heteroskedasticity Test
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Cross Validation Results</h4>
            <div className="space-y-2">
              <p>Train MAPE: {crossValidationResults.trainMetrics.mape.toFixed(2)}%</p>
              <p>Test MAPE: {crossValidationResults.testMetrics.mape.toFixed(2)}%</p>
              <p>Validation MAPE: {crossValidationResults.validationMetrics.mape.toFixed(2)}%</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
