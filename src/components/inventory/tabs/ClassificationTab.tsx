
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { SKUClassifications } from "../classification/SKUClassifications";
import { ClassificationManager } from "../classification/ClassificationManager";
import { useEffect, useState } from "react";
import { SKUClassification } from "@/types/inventory";
import { supabase } from "@/lib/supabaseClient";

export function ClassificationTab() {
  const { language } = useLanguage();
  const [classifications, setClassifications] = useState<SKUClassification[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchClassifications() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("sku_classification")
          .select("*");
          
        if (error) {
          console.error("Error fetching classifications:", error);
        } else if (data) {
          setClassifications(data);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchClassifications();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {getTranslation("inventory.classification.title", language)}
          </CardTitle>
          <CardDescription>
            {getTranslation("inventory.classification.description", language)}
          </CardDescription>
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
