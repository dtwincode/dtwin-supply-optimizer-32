
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { ProductReturn } from "@/types/sales";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Calendar, Package, TrendingDown, Tag, FileText, Warehouse, User, X } from "lucide-react";

interface ReturnDetailsPanelProps {
  returnData: ProductReturn;
  onClose: () => void;
  onUpdateForecast: (id: string) => void;
}

export const ReturnDetailsPanel = ({ returnData, onClose, onUpdateForecast }: ReturnDetailsPanelProps) => {
  const { language } = useLanguage();
  const [notes, setNotes] = useState(returnData.analysisNotes || "");
  
  const getStatusColor = (status: ProductReturn['status']) => {
    switch (status) {
      case 'recorded': return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case 'processing': return "bg-blue-100 text-blue-800 border-blue-300";
      case 'analyzed': return "bg-green-100 text-green-800 border-green-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const formatCurrency = (value?: number) => {
    if (value === undefined) return "-";
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  return (
    <Card className="border-l-4 border-l-blue-600">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              {returnData.productName || returnData.productSku}
              <Badge className={getStatusColor(returnData.status)}>
                {getTranslation(`sales.${returnData.status}`, language)}
              </Badge>
            </CardTitle>
            <CardDescription>
              {getTranslation('sales.returnRecordDetails', language) || "Return Record Details"}
            </CardDescription>
          </div>
          <Button size="sm" variant="ghost" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">{getTranslation('sales.basicInfo', language) || "Basic Information"}</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-gray-500">{getTranslation('sales.sku', language)}</div>
                  <div className="font-medium">{returnData.productSku}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">{getTranslation('sales.quantity', language)}</div>
                  <div className="font-medium">{returnData.quantity}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">{getTranslation('sales.returnDate', language)}</div>
                  <div className="font-medium flex items-center">
                    <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                    {new Date(returnData.returnDate).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">{getTranslation('sales.condition', language)}</div>
                  <div className="font-medium capitalize">{returnData.condition}</div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">{getTranslation('sales.reason', language)}</h3>
              <p className="text-sm">{returnData.reason}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">{getTranslation('sales.location', language) || "Location"}</h3>
              <div className="flex items-center gap-1 text-sm">
                <Warehouse className="h-3 w-3 text-gray-400" />
                {returnData.location.region}
                {returnData.location.city && ` > ${returnData.location.city}`}
                {returnData.location.warehouse && ` > ${returnData.location.warehouse}`}
              </div>
            </div>
            
            {returnData.customer && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">{getTranslation('sales.customer', language) || "Customer"}</h3>
                <div className="flex items-center gap-1 text-sm">
                  <User className="h-3 w-3 text-gray-400" />
                  {returnData.customer.name}
                  {returnData.customer.segment && <span className="text-xs text-gray-500 ml-1">({returnData.customer.segment})</span>}
                </div>
              </div>
            )}
            
            {returnData.tags && returnData.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">{getTranslation('sales.tags', language) || "Tags"}</h3>
                <div className="flex flex-wrap gap-1">
                  {returnData.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs font-normal flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">{getTranslation('sales.impactAnalysis', language) || "Impact Analysis"}</h3>
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-3">
                  <div className="text-xs text-gray-500">{getTranslation('sales.inventory', language)}</div>
                  <div className="text-lg font-bold text-blue-600">+{returnData.impact.inventory}</div>
                  <div className="text-xs text-gray-500">{getTranslation('sales.unitsAdjusted', language) || "units adjusted"}</div>
                </Card>
                <Card className="p-3">
                  <div className="text-xs text-gray-500">{getTranslation('sales.forecast', language)}</div>
                  <div className="text-lg font-bold text-red-600">{returnData.impact.forecast}</div>
                  <div className="text-xs text-gray-500">{getTranslation('sales.forecastImpact', language) || "forecast impact"}</div>
                </Card>
                <Card className="p-3">
                  <div className="text-xs text-gray-500">{getTranslation('sales.revenue', language) || "Revenue"}</div>
                  <div className="text-lg font-bold text-amber-600">{formatCurrency(returnData.impact.revenue)}</div>
                  <div className="text-xs text-gray-500">{getTranslation('sales.financialImpact', language) || "financial impact"}</div>
                </Card>
                <Card className="p-3">
                  <div className="text-xs text-gray-500">{getTranslation('sales.nextPeriodAdjustment', language) || "Next Period"}</div>
                  <div className="text-lg font-bold text-indigo-600">
                    {returnData.impact.nextPeriodAdjustment !== undefined ? `${returnData.impact.nextPeriodAdjustment}%` : "-"}
                  </div>
                  <div className="text-xs text-gray-500">{getTranslation('sales.recommendedAdjustment', language) || "recommended"}</div>
                </Card>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">{getTranslation('sales.analysisNotes', language) || "Analysis Notes"}</h3>
              <Textarea 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)}
                placeholder={getTranslation('sales.enterAnalysisNotes', language) || "Enter analysis and observations..."}
                rows={4}
                disabled={returnData.status === 'analyzed'}
                className={returnData.status === 'analyzed' ? "bg-gray-50" : ""}
              />
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">{getTranslation('sales.forecastStatus', language) || "Forecast Status"}</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-blue-600" />
                  <div>
                    {returnData.forecastUpdated 
                      ? getTranslation('sales.forecastUpdated', language) || "Forecast has been updated" 
                      : getTranslation('sales.forecastNotUpdated', language) || "Forecast needs updating"}
                  </div>
                </div>
                {returnData.status === 'processing' && (
                  <Button size="sm" variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                    {getTranslation('sales.viewForecastImpact', language) || "View Impact"}
                  </Button>
                )}
              </div>
            </div>
            
            {returnData.relatedOrders && returnData.relatedOrders.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">{getTranslation('sales.relatedOrders', language) || "Related Orders"}</h3>
                <div className="flex gap-2">
                  {returnData.relatedOrders.map((order, index) => (
                    <Badge key={index} variant="secondary" className="text-xs font-normal flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {order}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="justify-between border-t p-4 mt-4">
        <Button variant="outline" onClick={onClose}>
          {getTranslation('sales.close', language) || "Close"}
        </Button>
        
        {returnData.status === 'processing' && (
          <Button onClick={() => onUpdateForecast(returnData.id)} className="bg-blue-600 hover:bg-blue-700">
            {getTranslation('sales.updateForecast', language) || "Update Forecast"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
