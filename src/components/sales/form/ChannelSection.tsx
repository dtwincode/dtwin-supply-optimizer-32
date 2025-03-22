
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChannelSectionProps {
  channelType: string;
  accountName: string;
  handleFormChange: (field: string, value: string) => void;
  formErrors: Record<string, string>;
  channelTypes: string[];
}

export const ChannelSection: React.FC<ChannelSectionProps> = ({
  channelType,
  accountName,
  handleFormChange,
  formErrors,
  channelTypes,
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="channelType">Channel Type</Label>
        <Select
          value={channelType}
          onValueChange={(value) => handleFormChange("channelType", value)}
        >
          <SelectTrigger className={formErrors.channelType ? "border-red-500" : ""}>
            <SelectValue placeholder="Select channel type" />
          </SelectTrigger>
          <SelectContent>
            {channelTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formErrors.channelType && (
          <p className="text-sm text-red-500">{formErrors.channelType}</p>
        )}
      </div>

      {(channelType === "B2B" || channelType === "Wholesale") && (
        <div className="space-y-2">
          <Label htmlFor="accountName">Account Name</Label>
          <Input
            id="accountName"
            value={accountName}
            onChange={(e) => handleFormChange("accountName", e.target.value)}
            placeholder="Enter account name"
            className={formErrors.accountName ? "border-red-500" : ""}
          />
          {formErrors.accountName && (
            <p className="text-sm text-red-500">{formErrors.accountName}</p>
          )}
        </div>
      )}
    </>
  );
};
