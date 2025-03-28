
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

export const processDataByModule = async (
  module: Database["public"]["Enums"]["module_type"],
  headers: string[],
  dataRows: string[]
) => {
  const parseRow = (row: string) => {
    const values = row.split(',').map(v => v.trim());
    const rowData: Record<string, any> = {};
    headers.forEach((header, index) => {
      rowData[header] = values[index] || null;
    });
    return rowData;
  };

  switch (module) {
    case 'forecasting':
      const forecastData = dataRows.map(row => {
        const data = parseRow(row);
        return {
          date: data.date,
          value: parseFloat(data.value),
          category: data.category,
          subcategory: data.subcategory,
          sku: data.sku,
          region: data.region,
          city: data.city,
          channel: data.channel,
          warehouse: data.warehouse,
          notes: data.notes
        };
      });
      return await supabase.from('forecast_data').insert(forecastData);

    case 'inventory':
      const inventoryData = dataRows.map(row => {
        const data = parseRow(row);
        return {
          sku: data.sku,
          name: data.name,
          current_stock: parseInt(data.current_stock),
          min_stock: parseInt(data.min_stock),
          max_stock: parseInt(data.max_stock),
          category: data.category,
          subcategory: data.subcategory,
          location: data.location,
          product_family: data.product_family,
          region: data.region,
          city: data.city,
          channel: data.channel,
          warehouse: data.warehouse,
          notes: data.notes
        };
      });
      return await supabase.from('inventory_data').insert(inventoryData);

    case 'sales':
      const salesData = dataRows.map(row => {
        const data = parseRow(row);
        return {
          date: data.date,
          sku: data.sku,
          quantity: parseInt(data.quantity),
          price: parseFloat(data.price),
          total: parseFloat(data.total),
          category: data.category,
          subcategory: data.subcategory,
          region: data.region,
          city: data.city,
          channel: data.channel,
          warehouse: data.warehouse,
          customer: data.customer,
          payment_method: data.payment_method,
          notes: data.notes
        };
      });
      return await supabase.from('sales_data').insert(salesData);

    case 'marketing':
      const marketingData = dataRows.map(row => {
        const data = parseRow(row);
        return {
          campaign_name: data.campaign_name,
          start_date: data.start_date,
          end_date: data.end_date,
          budget: parseFloat(data.budget),
          target_audience: data.target_audience,
          channel: data.channel,
          region: data.region,
          city: data.city,
          product_category: data.product_category,
          expected_roi: data.expected_roi ? parseFloat(data.expected_roi) : null,
          kpis: data.kpis,
          notes: data.notes
        };
      });
      return await supabase.from('marketing_data').insert(marketingData);

    case 'logistics':
      const logisticsData = dataRows.map(row => {
        const data = parseRow(row);
        return {
          shipment_id: data.shipment_id,
          date: data.date,
          origin: data.origin,
          destination: data.destination,
          status: data.status,
          carrier: data.carrier,
          tracking_number: data.tracking_number,
          estimated_delivery: data.estimated_delivery,
          actual_delivery: data.actual_delivery,
          weight: data.weight ? parseFloat(data.weight) : null,
          cost: data.cost ? parseFloat(data.cost) : null,
          type: data.type,
          priority: data.priority,
          notes: data.notes
        };
      });
      return await supabase.from('logistics_data').insert(logisticsData);

    default:
      throw new Error(`Unsupported module: ${module}`);
  }
};
