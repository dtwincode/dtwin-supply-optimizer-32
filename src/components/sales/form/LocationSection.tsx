
import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LocationSectionProps {
  region: string;
  city: string;
  handleFormChange: (field: string, value: string) => void;
  formErrors: Record<string, string>;
  regions: string[];
  cities: Record<string, string[]>;
}

export const LocationSection: React.FC<LocationSectionProps> = ({
  region,
  city,
  handleFormChange,
  formErrors,
  regions,
  cities,
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="region">Region</Label>
        <Select
          value={region}
          onValueChange={(value) => handleFormChange("region", value)}
        >
          <SelectTrigger className={formErrors.region ? "border-red-500" : ""}>
            <SelectValue placeholder="Select region" />
          </SelectTrigger>
          <SelectContent>
            {regions.map((region) => (
              <SelectItem key={region} value={region}>
                {region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formErrors.region && (
          <p className="text-sm text-red-500">{formErrors.region}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="city">City</Label>
        <Select
          value={city}
          onValueChange={(value) => handleFormChange("city", value)}
          disabled={!region}
        >
          <SelectTrigger className={formErrors.city ? "border-red-500" : ""}>
            <SelectValue placeholder="Select city" />
          </SelectTrigger>
          <SelectContent>
            {region &&
              cities[region as keyof typeof cities]?.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        {formErrors.city && (
          <p className="text-sm text-red-500">{formErrors.city}</p>
        )}
      </div>
    </>
  );
};
