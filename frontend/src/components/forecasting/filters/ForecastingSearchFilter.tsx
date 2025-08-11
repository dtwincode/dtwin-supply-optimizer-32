
import { Input } from "@/components/ui/input";

interface ForecastingSearchFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const ForecastingSearchFilter = ({
  searchQuery,
  setSearchQuery,
}: ForecastingSearchFilterProps) => {
  return (
    <Input
      placeholder="Search forecasts..."
      className="w-[300px]"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  );
};
