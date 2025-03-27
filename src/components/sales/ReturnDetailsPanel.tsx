
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Package, TrendingDown, Tag, FileText, Warehouse, User, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useI18n } from "@/contexts/I18nContext";
import { ProductReturn } from "@/types/sales";

interface ReturnDetailsPanelProps {
  returnData: ProductReturn;
  onClose: () => void;
  onUpdateForecast: (id: string) => void;
}

export const ReturnDetailsPanel = ({ returnData, onClose, onUpdateForecast }: ReturnDetailsPanelProps) => {
  const { language } = useLanguage();
  const { t } = useI18n();
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
                {t(`sales.${returnData.status}`)}
              </Badge>
            </CardTitle>
            <CardDescription>
              {t('sales.returnRecordDetails') || "Return Record Details"}
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
              <h3 className="text-sm font-medium text-gray-500 mb-1">{t('sales.basicInfo') || "Basic Information"}</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-gray-500">{t('sales.sku')}</div>
                  <div className="font-medium">{returnData.productSku}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">{t('sales.quantity')}</div>
                  <div className="font-medium">{returnData.quantity}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">{t('sales.returnDate')}</div>
                  <div className="font-medium flex items-center">
                    <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                    {new Date(returnData.returnDate).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">{t('sales.condition')}</div>
                  <div className="font-medium capitalize">{returnData.condition}</div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">{t('sales.reason')}</h3>
              <p className="text-sm">{returnData.reason}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">{t('sales.location') || "Location"}</h3>
              <div className="flex items-center gap-1 text-sm">
                <Warehouse className="h-3 w-3 text-gray-400" />
                {returnData.location.region}
                {returnData.location.city && ` > ${returnData.location.city}`}
                {returnData.location.warehouse && ` > ${returnData.location.warehouse}`}
              </div>
            </div>
            
            {returnData.customer && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">{t('sales.customer') || "Customer"}</h3>
                <div className="flex items-center gap-1 text-sm">
                  <User className="h-3 w-3 text-gray-400" />
                  {returnData.customer.name}
                  {returnData.customer.segment && <span className="text-xs text-gray-500 ml-1">({returnData.customer.segment})</span>}
                </div>
              </div>
            )}
            
            {returnData.tags && returnData.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">{t('sales.tags') || "Tags"}</h3>
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
              <h3 className="text-sm font-medium text-gray-500 mb-1">{t('sales.impactAnalysis') || "Impact Analysis"}</h3>
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-3">
                  <div className="text-xs text-gray-500">{t('sales.inventory')}</div>
                  <div className="text-lg font-bold text-blue-600">+{returnData.impact.inventory}</div>
                  <div className="text-xs text-gray-500">{t('sales.unitsAdjusted') || "units adjusted"}</div>
                </Card>
                <Card className="p-3">
                  <div className="text-xs text-gray-500">{t('sales.forecast')}</div>
                  <div className="text-lg font-bold text-red-600">{returnData.impact.forecast}</div>
                  <div className="text-xs text-gray-500">{t('sales.forecastImpact') || "forecast impact"}</div>
                </Card>
                <Card className="p-3">
                  <div className="text-xs text-gray-500">{t('sales.revenue') || "Revenue"}</div>
                  <div className="text-lg font-bold text-amber-600">{formatCurrency(returnData.impact.revenue)}</div>
                  <div className="text-xs text-gray-500">{t('sales.financialImpact') || "financial impact"}</div>
                </Card>
                <Card className="p-3">
                  <div className="text-xs text-gray-500">{t('sales.nextPeriodAdjustment') || "Next Period"}</div>
                  <div className="text-lg font-bold text-indigo-600">
                    {returnData.impact.nextPeriodAdjustment !== undefined ? `${returnData.impact.nextPeriodAdjustment}%` : "-"}
                  </div>
                  <div className="text-xs text-gray-500">{t('sales.recommendedAdjustment') || "recommended"}</div>
                </Card>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">{t('sales.analysisNotes') || "Analysis Notes"}</h3>
              <Textarea 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('sales.enterAnalysisNotes') || "Enter analysis and observations..."}
                rows={4}
                disabled={returnData.status === 'analyzed'}
                className={returnData.status === 'analyzed' ? "bg-gray-50" : ""}
              />
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">{t('sales.forecastStatus') || "Forecast Status"}</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-blue-600" />
                  <div>
                    {returnData.forecastUpdated 
                      ? t('sales.forecastUpdated') || "Forecast has been updated" 
                      : t('sales.forecastNotUpdated') || "Forecast needs updating"}
                  </div>
                </div>
                {returnData.status === 'processing' && (
                  <Button size="sm" variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                    {t('sales.viewForecastImpact') || "View Impact"}
                  </Button>
                )}
              </div>
            </div>
            
            {returnData.relatedOrders && returnData.relatedOrders.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">{t('sales.relatedOrders') || "Related Orders"}</h3>
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
          {t('sales.close') || "Close"}
        </Button>
        
        {returnData.status === 'processing' && (
          <Button onClick={() => onUpdateForecast(returnData.id)} className="bg-blue-600 hover:bg-blue-700">
            {t('sales.updateForecast') || "Update Forecast"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
