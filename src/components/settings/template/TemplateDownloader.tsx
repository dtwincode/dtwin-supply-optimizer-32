
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { DataTemplate } from "../validation/types";

interface TemplateDownloaderProps {
  module: Database["public"]["Enums"]["module_type"];
}

export function TemplateDownloader({ module }: TemplateDownloaderProps) {
  const { toast } = useToast();

  const downloadTemplate = async () => {
    toast({
      variant: "destructive",
      title: "Feature Disabled",
      description: "Module settings table was removed. Template download is unavailable.",
    });
  };

  return (
    <Button variant="outline" onClick={downloadTemplate} className="gap-2">
      <Download className="h-4 w-4" />
      Download Template
    </Button>
  );
}
