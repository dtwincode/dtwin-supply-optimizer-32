
// Fix the insert at line ~70
const formattedData = dataToUpload.map(item => ({
  product_id: item.product_id,
  quantity_on_hand: item.quantity_on_hand,
  location_id: defaultLocationId, // Add required location_id 
}));

const { error } = await supabase
  .from('inventory_data')
  .insert(formattedData);
