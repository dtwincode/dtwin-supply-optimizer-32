
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { SKUClassifications } from "../classification/SKUClassifications";
import { ClassificationManager } from "../classification/ClassificationManager";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { useSkuClassifications } from "@/hooks/useSkuClassifications";

export function ClassificationTab() {
  const { language } = useLanguage();
  const { 
    classifications, 
    loading, 
    refreshClassifications
  } = useSkuClassifications();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>
              {getTranslation("inventory.classification.title", language)}
            </CardTitle>
            <CardDescription>
              {getTranslation("inventory.classification.description", language)}
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refreshClassifications()}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center p-4">Loading classifications...</div>
          ) : (
            <SKUClassifications classifications={classifications} />
          )}
        </CardContent>
      </Card>
      
      <ClassificationManager />
    </div>
  );
}
