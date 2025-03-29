
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { InfoIcon } from "lucide-react";

export interface FieldDescription {
  name: string;
  description: string;
  required: boolean;
}

interface UploadInstructionsProps {
  title: string;
  description: string;
  fields: FieldDescription[];
}

export const UploadInstructions = ({ title, description, fields }: UploadInstructionsProps) => {
  return (
    <Card className="mb-6 border-muted bg-muted/20">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <InfoIcon className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-medium mb-1">{title}</h3>
              <p className="text-muted-foreground">{description}</p>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-medium mb-2">Required Fields:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {fields.map((field) => (
                <div key={field.name} className="flex items-start gap-2">
                  <div className="bg-primary/10 text-primary font-medium px-2 py-1 rounded text-xs uppercase mt-0.5">
                    {field.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {field.description}
                    {field.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
