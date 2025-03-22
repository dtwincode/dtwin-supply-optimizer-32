
import React from "react";
import { useToast } from "@/hooks/use-toast";

interface FormHeaderProps {
  isSubmitting: boolean;
  onClose: () => void;
}

export const FormHeader: React.FC<FormHeaderProps> = ({ isSubmitting, onClose }) => {
  return (
    <div className="flex justify-end gap-4 mt-6">
      <button
        type="button"
        className="px-4 py-2 border rounded-md"
        onClick={onClose}
        disabled={isSubmitting}
      >
        Cancel
      </button>
      <button 
        type="submit" 
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating..." : "Create Plan"}
      </button>
    </div>
  );
};
