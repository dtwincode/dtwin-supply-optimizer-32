
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { ReturnEntryForm } from "./ReturnEntryForm";
import type { ProductReturn } from "@/types/sales";

interface ReturnEntryDialogProps {
  onSubmit: (data: ProductReturn) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ReturnEntryDialog = ({ onSubmit, open, onOpenChange }: ReturnEntryDialogProps) => {
  const { language } = useLanguage();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          {getTranslation('sales.newReturn', language)}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{getTranslation('sales.newReturn', language)}</DialogTitle>
        </DialogHeader>
        <ReturnEntryForm 
          onSubmit={(data) => {
            onSubmit(data);
            onOpenChange(false);
          }}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
