
import { useState } from "react";

export interface FormState {
  startDate: string;
  endDate: string;
  category: string;
  subcategory: string;
  sku: string;
  region: string;
  city: string;
  channelType: string;
  accountName: string;
  targetValue: string;
  confidence: string;
  notes: string;
}

export function useFormValidation(initialState: FormState) {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formState.startDate) errors.startDate = "Start date is required";
    if (!formState.endDate) errors.endDate = "End date is required";
    if (!formState.category) errors.category = "Category is required";
    if (!formState.subcategory) errors.subcategory = "Subcategory is required";
    if (!formState.region) errors.region = "Region is required";
    if (!formState.city) errors.city = "City is required";
    if (!formState.channelType) errors.channelType = "Channel type is required";
    if (!formState.targetValue) errors.targetValue = "Target value is required";
    if (!formState.confidence) errors.confidence = "Confidence is required";

    if (["B2B", "Wholesale"].includes(formState.channelType) && !formState.accountName) {
      errors.accountName = "Account name is required for B2B/Wholesale";
    }

    if (formState.startDate && formState.endDate) {
      const start = new Date(formState.startDate);
      const end = new Date(formState.endDate);
      if (end < start) {
        errors.endDate = "End date must be after start date";
      }
    }

    if (formState.targetValue && Number(formState.targetValue) <= 0) {
      errors.targetValue = "Target value must be greater than 0";
    }
    
    if (formState.confidence) {
      const confidence = Number(formState.confidence);
      if (confidence < 0 || confidence > 100) {
        errors.confidence = "Confidence must be between 0 and 100";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormChange = (field: string, value: string) => {
    setFormState(prev => {
      const newState = { ...prev, [field]: value };
      
      if (field === "category") {
        newState.subcategory = "";
        newState.sku = "";
      }
      if (field === "subcategory") {
        newState.sku = "";
      }
      if (field === "region") {
        newState.city = "";
      }
      if (field === "channelType" && !["B2B", "Wholesale"].includes(value)) {
        newState.accountName = "";
      }
      
      setFormErrors(prev => ({ ...prev, [field]: "" }));
      
      return newState;
    });
  };

  return {
    formState,
    formErrors,
    validateForm,
    handleFormChange
  };
}
