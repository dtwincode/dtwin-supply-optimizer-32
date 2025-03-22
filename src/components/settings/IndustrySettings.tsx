
import React from 'react';
import { useIndustry } from "@/contexts/IndustryContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IndustrySelectionDialog } from "@/components/IndustrySelectionDialog";
import { industries } from "@/components/guidelines/data/industryData";
import { getIndustrySpecificColumns, getIndustrySpecificFilters } from '@/utils/inventoryPageUtils';
import { PharmacySpecificData } from '@/components/guidelines/components/PharmacySpecificData';

export const IndustrySettings = () => {
  const { selectedIndustry } = useIndustry();
  const [showDialog, setShowDialog] = React.useState(false);

  const industry = industries.find(ind => ind.id === selectedIndustry);
  const industryColumns = getIndustrySpecificColumns(selectedIndustry);
  const industryFilters = getIndustrySpecificFilters(selectedIndustry);
  
  const openDialog = () => setShowDialog(true);
  const closeDialog = () => setShowDialog(false);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Industry Configuration</CardTitle>
          <CardDescription>
            Current industry settings and customizations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Selected Industry</h3>
              <p className="text-sm text-muted-foreground mt-1">
                All modules are customized based on this industry setting
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-base py-1 px-3">
                {industry?.name || selectedIndustry}
              </Badge>
              <Button variant="outline" onClick={openDialog}>
                Change Industry
              </Button>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Industry-Specific Configuration</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Table Columns</h4>
                <div className="flex flex-wrap gap-2">
                  {industryColumns.map(column => (
                    <Badge key={column.key} variant="secondary">
                      {column.label}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Available Filters</h4>
                <div className="flex flex-wrap gap-2">
                  {industryFilters.map(filter => (
                    <Badge key={filter} variant="secondary">
                      {filter}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {selectedIndustry === 'pharmacy' && (
            <div className="border-t pt-6">
              <PharmacySpecificData />
            </div>
          )}
        </CardContent>
      </Card>
      
      {showDialog && (
        <IndustrySelectionDialog 
          open={showDialog} 
          onOpenChange={closeDialog}
        />
      )}
    </div>
  );
};
