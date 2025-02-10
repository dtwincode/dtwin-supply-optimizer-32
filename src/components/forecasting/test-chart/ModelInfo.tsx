
interface ModelInfoProps {
  description: string;
  bestUseCase: string;
  recommendedParams: Record<string, any>;
}

export const ModelInfo = ({ description, bestUseCase, recommendedParams }: ModelInfoProps) => {
  return (
    <div className="mb-6 p-4 bg-muted rounded-lg">
      <h4 className="font-medium mb-2">{description}</h4>
      <p className="text-sm text-muted-foreground mb-2">Best Use Case: {bestUseCase}</p>
      <div className="text-sm text-muted-foreground">
        Recommended Parameters:
        {Object.entries(recommendedParams).map(([key, value]) => (
          <span key={key} className="ml-2">
            {key}: {value}
          </span>
        ))}
      </div>
    </div>
  );
};
