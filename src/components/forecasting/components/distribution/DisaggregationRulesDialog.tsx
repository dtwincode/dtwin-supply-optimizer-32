
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface DisaggregationRule {
  id: string;
  name: string;
  type: 'even' | 'weighted' | 'historical' | 'custom';
  weightingFactor?: number;
  customPattern?: number[];
  weekPattern?: {
    [key: string]: number;  // Week1: 1.2, Week2: 0.8, etc.
  };
  constraints?: {
    minWeekly?: number;
    maxWeekly?: number;
  };
}

interface Props {
  rules: DisaggregationRule[];
  onUpdateRules: (rules: DisaggregationRule[]) => void;
}

export function DisaggregationRulesDialog({ rules, onUpdateRules }: Props) {
  const [selectedRule, setSelectedRule] = useState<DisaggregationRule | null>(null);
  
  const handleRuleChange = (ruleId: string) => {
    const rule = rules.find(r => r.id === ruleId);
    if (rule) {
      setSelectedRule(rule);
    }
  };

  const handleUpdateRule = (updatedRule: Partial<DisaggregationRule>) => {
    if (!selectedRule) return;

    const newRules = rules.map(rule => 
      rule.id === selectedRule.id ? { ...rule, ...updatedRule } : rule
    );

    onUpdateRules(newRules);
    toast.success("Rule updated successfully");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Settings2 className="h-4 w-4" />
          Disaggregation Rules
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-4">
          <DialogTitle>Configure Disaggregation Rules</DialogTitle>
          <DialogDescription>
            Define how forecast quantities should be distributed across weeks
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Select Rule</Label>
            <Select value={selectedRule?.id} onValueChange={handleRuleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a rule to configure" />
              </SelectTrigger>
              <SelectContent>
                {rules.map((rule) => (
                  <SelectItem key={rule.id} value={rule.id}>
                    {rule.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedRule && (
            <Card className="p-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Rule Name</Label>
                  <Input 
                    value={selectedRule.name}
                    onChange={(e) => handleUpdateRule({ name: e.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Distribution Type</Label>
                  <Select 
                    value={selectedRule.type}
                    onValueChange={(value: DisaggregationRule['type']) => handleUpdateRule({ type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="even">Even Distribution</SelectItem>
                      <SelectItem value="weighted">Weighted Distribution</SelectItem>
                      <SelectItem value="historical">Historical Pattern</SelectItem>
                      <SelectItem value="custom">Custom Pattern</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {selectedRule.type === 'weighted' && (
                  <div className="grid gap-3">
                    <Label>Weekly Weights</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {['Week 1', 'Week 2', 'Week 3', 'Week 4'].map((week) => (
                        <div key={week} className="grid gap-1.5">
                          <Label className="text-xs">{week}</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={selectedRule.weekPattern?.[week] || 1}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value);
                              handleUpdateRule({
                                weekPattern: {
                                  ...(selectedRule.weekPattern || {}),
                                  [week]: value
                                }
                              });
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedRule.type === 'custom' && (
                  <div className="grid gap-2">
                    <Label>Custom Pattern (comma-separated weights)</Label>
                    <Input
                      value={selectedRule.customPattern?.join(', ')}
                      onChange={(e) => {
                        const values = e.target.value.split(',').map(v => parseFloat(v.trim()));
                        if (values.every(v => !isNaN(v))) {
                          handleUpdateRule({ customPattern: values });
                        }
                      }}
                      placeholder="1, 1.2, 0.8, 1.1"
                    />
                  </div>
                )}

                <div className="grid gap-2">
                  <Label>Weekly Constraints</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-1.5">
                      <Label className="text-xs">Min Weekly</Label>
                      <Input
                        type="number"
                        value={selectedRule.constraints?.minWeekly || 0}
                        onChange={(e) => handleUpdateRule({
                          constraints: {
                            ...(selectedRule.constraints || {}),
                            minWeekly: parseInt(e.target.value)
                          }
                        })}
                      />
                    </div>
                    <div className="grid gap-1.5">
                      <Label className="text-xs">Max Weekly</Label>
                      <Input
                        type="number"
                        value={selectedRule.constraints?.maxWeekly || 0}
                        onChange={(e) => handleUpdateRule({
                          constraints: {
                            ...(selectedRule.constraints || {}),
                            maxWeekly: parseInt(e.target.value)
                          }
                        })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
