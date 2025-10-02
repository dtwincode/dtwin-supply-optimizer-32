-- ============================================================================
-- Fix 1: Populate Missing On-Hand Inventory for All Product-Location Pairs
-- ============================================================================

-- First, insert missing on_hand_inventory records for all product-location pairs
-- Using realistic initial inventory based on ADU
INSERT INTO public.on_hand_inventory (product_id, location_id, qty_on_hand, snapshot_ts)
SELECT DISTINCT
  plp.product_id,
  plp.location_id,
  COALESCE(
    -- Start with 30 days worth of ADU as initial inventory
    (SELECT SUM(quantity_sold) / 90.0 * 30
     FROM historical_sales_data hsd
     WHERE hsd.product_id = plp.product_id 
     AND hsd.location_id = plp.location_id
     AND hsd.sales_date >= CURRENT_DATE - INTERVAL '90 days'),
    50 -- Default for items with no sales history
  ) as qty_on_hand,
  NOW() as snapshot_ts
FROM product_location_pairs plp
WHERE NOT EXISTS (
  SELECT 1 FROM on_hand_inventory ohi
  WHERE ohi.product_id = plp.product_id 
  AND ohi.location_id = plp.location_id
);

-- ============================================================================
-- Fix 2: Populate Missing Open Purchase Orders (on_order)
-- ============================================================================

-- Add realistic open POs for items that need replenishment
INSERT INTO public.open_pos (product_id, location_id, ordered_qty, received_qty, order_date, expected_date, status)
SELECT DISTINCT
  plp.product_id,
  plp.location_id,
  COALESCE(
    -- Order quantity = 14 days of ADU
    (SELECT SUM(quantity_sold) / 90.0 * 14
     FROM historical_sales_data hsd
     WHERE hsd.product_id = plp.product_id 
     AND hsd.location_id = plp.location_id
     AND hsd.sales_date >= CURRENT_DATE - INTERVAL '90 days'),
    30 -- Default order quantity
  ) as ordered_qty,
  0 as received_qty,
  CURRENT_DATE - INTERVAL '3 days' as order_date,
  CURRENT_DATE + INTERVAL '4 days' as expected_date,
  'OPEN' as status
FROM product_location_pairs plp
WHERE NOT EXISTS (
  SELECT 1 FROM open_pos op
  WHERE op.product_id = plp.product_id 
  AND op.location_id = plp.location_id
  AND op.status = 'OPEN'
)
-- Only add POs for items with some sales history
AND EXISTS (
  SELECT 1 FROM historical_sales_data hsd
  WHERE hsd.product_id = plp.product_id 
  AND hsd.location_id = plp.location_id
  LIMIT 1
);

-- ============================================================================
-- Fix 3: Populate Missing Open Sales Orders (qualified_demand)
-- ============================================================================

-- Add realistic open SOs representing near-term demand
INSERT INTO public.open_so (product_id, location_id, qty, confirmed_date, status)
SELECT DISTINCT
  plp.product_id,
  plp.location_id,
  COALESCE(
    -- Demand = 7 days of ADU
    (SELECT SUM(quantity_sold) / 90.0 * 7
     FROM historical_sales_data hsd
     WHERE hsd.product_id = plp.product_id 
     AND hsd.location_id = plp.location_id
     AND hsd.sales_date >= CURRENT_DATE - INTERVAL '90 days'),
    20 -- Default demand
  ) as qty,
  CURRENT_DATE as confirmed_date,
  'CONFIRMED' as status
FROM product_location_pairs plp
WHERE NOT EXISTS (
  SELECT 1 FROM open_so os
  WHERE os.product_id = plp.product_id 
  AND os.location_id = plp.location_id
  AND os.status = 'CONFIRMED'
)
-- Only add SOs for items with some sales history
AND EXISTS (
  SELECT 1 FROM historical_sales_data hsd
  WHERE hsd.product_id = plp.product_id 
  AND hsd.location_id = plp.location_id
  LIMIT 1
);

-- ============================================================================
-- Fix 4: Update Buffer Status Calculation Logic with Edge Case Handling
-- ============================================================================

-- Drop and recreate the inventory_planning_view with improved logic
DROP VIEW IF EXISTS public.inventory_planning_view CASCADE;

CREATE OR REPLACE VIEW public.inventory_planning_view AS
SELECT
  -- Product & Location Information
  b.product_id,
  b.sku,
  b.product_name,
  b.category,
  b.subcategory,
  b.location_id,
  b.region,
  b.channel_id,
  b.buffer_profile_id,
  
  -- DDMRP Calculations
  b.adu as average_daily_usage,
  b.dlt as lead_time_days,
  
  -- Net Flow Position Components
  COALESCE(n.on_hand, 0) as on_hand,
  COALESCE(n.on_order, 0) as on_order,
  COALESCE(n.qualified_demand, 0) as qualified_demand,
  COALESCE(n.nfp, 0) as nfp,
  
  -- Buffer Zones
  COALESCE(b.red_zone, 0) as red_zone,
  COALESCE(b.yellow_zone, 0) as yellow_zone,
  COALESCE(b.green_zone, 0) as green_zone,
  
  -- Thresholds
  COALESCE(b.tor, 0) as tor,
  COALESCE(b.toy, 0) as toy,
  COALESCE(b.tog, 0) as tog,
  
  -- MOQ & Rounding
  COALESCE(b.moq, 0) as min_order_qty,
  COALESCE(b.rounding_multiple, 1) as rounding_multiple,
  
  -- Improved Buffer Status with Edge Case Handling
  CASE 
    -- Edge case: No buffer zones defined (zero ADU or no profile)
    WHEN COALESCE(b.tog, 0) = 0 THEN 'UNKNOWN'
    
    -- Normal DDMRP status calculation
    WHEN COALESCE(n.nfp, 0) < COALESCE(b.tor, 0) THEN 'RED'
    WHEN COALESCE(n.nfp, 0) < COALESCE(b.toy, 0) THEN 'YELLOW'
    WHEN COALESCE(n.nfp, 0) < COALESCE(b.tog, 0) THEN 'GREEN'
    
    -- Above TOG = excess inventory
    ELSE 'BLUE'
  END as buffer_status,
  
  -- Stock Level Mappings for Frontend Compatibility
  COALESCE(b.tor, 0) as min_stock_level,
  COALESCE(b.tog, 0) as max_stock_level,
  COALESCE(b.toy, 0) as reorder_level,
  COALESCE(n.on_hand, 0) as current_stock_level,
  
  -- Decoupling Point Flag
  EXISTS(
    SELECT 1 FROM decoupling_points dp 
    WHERE dp.product_id = b.product_id 
    AND dp.location_id = b.location_id
  ) as decoupling_point,
  
  -- Demand Variability (CV from demand_history_analysis)
  COALESCE(
    (SELECT cv FROM demand_history_analysis dha 
     WHERE dha.product_id = b.product_id 
     AND dha.location_id = b.location_id
     ORDER BY analysis_period_end DESC 
     LIMIT 1),
    0.5
  ) as demand_variability

FROM public.inventory_ddmrp_buffers_view b
LEFT JOIN public.inventory_net_flow_view n 
  ON b.product_id = n.product_id 
  AND b.location_id = n.location_id;

-- ============================================================================
-- Fix 5: Add Data Validation Triggers
-- ============================================================================

-- Trigger 1: Ensure on_hand_inventory qty cannot be negative
CREATE OR REPLACE FUNCTION validate_on_hand_inventory()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.qty_on_hand < 0 THEN
    RAISE EXCEPTION 'On-hand quantity cannot be negative for product % at location %', 
      NEW.product_id, NEW.location_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_validate_on_hand ON public.on_hand_inventory;
CREATE TRIGGER trigger_validate_on_hand
  BEFORE INSERT OR UPDATE ON public.on_hand_inventory
  FOR EACH ROW
  EXECUTE FUNCTION validate_on_hand_inventory();

-- Trigger 2: Ensure open_pos quantities are valid
CREATE OR REPLACE FUNCTION validate_open_pos()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.ordered_qty <= 0 THEN
    RAISE EXCEPTION 'Ordered quantity must be positive for product % at location %', 
      NEW.product_id, NEW.location_id;
  END IF;
  
  IF NEW.received_qty < 0 THEN
    RAISE EXCEPTION 'Received quantity cannot be negative for product % at location %', 
      NEW.product_id, NEW.location_id;
  END IF;
  
  IF NEW.received_qty > NEW.ordered_qty THEN
    RAISE EXCEPTION 'Received quantity cannot exceed ordered quantity for product % at location %', 
      NEW.product_id, NEW.location_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_validate_open_pos ON public.open_pos;
CREATE TRIGGER trigger_validate_open_pos
  BEFORE INSERT OR UPDATE ON public.open_pos
  FOR EACH ROW
  EXECUTE FUNCTION validate_open_pos();

-- Trigger 3: Ensure open_so quantities are positive
CREATE OR REPLACE FUNCTION validate_open_so()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.qty <= 0 THEN
    RAISE EXCEPTION 'Sales order quantity must be positive for product % at location %', 
      NEW.product_id, NEW.location_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_validate_open_so ON public.open_so;
CREATE TRIGGER trigger_validate_open_so
  BEFORE INSERT OR UPDATE ON public.open_so
  FOR EACH ROW
  EXECUTE FUNCTION validate_open_so();

-- Trigger 4: Auto-update snapshot_ts on on_hand_inventory changes
CREATE OR REPLACE FUNCTION update_inventory_snapshot_ts()
RETURNS TRIGGER AS $$
BEGIN
  NEW.snapshot_ts = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_snapshot_ts ON public.on_hand_inventory;
CREATE TRIGGER trigger_update_snapshot_ts
  BEFORE UPDATE ON public.on_hand_inventory
  FOR EACH ROW
  WHEN (OLD.qty_on_hand IS DISTINCT FROM NEW.qty_on_hand)
  EXECUTE FUNCTION update_inventory_snapshot_ts();

-- ============================================================================
-- Verification Queries (for logging purposes)
-- ============================================================================

-- Log summary of changes
DO $$
DECLARE
  v_inventory_count INTEGER;
  v_pos_count INTEGER;
  v_so_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_inventory_count FROM on_hand_inventory;
  SELECT COUNT(*) INTO v_pos_count FROM open_pos WHERE status = 'OPEN';
  SELECT COUNT(*) INTO v_so_count FROM open_so WHERE status = 'CONFIRMED';
  
  RAISE NOTICE 'Data Population Complete:';
  RAISE NOTICE '  - On-hand inventory records: %', v_inventory_count;
  RAISE NOTICE '  - Open purchase orders: %', v_pos_count;
  RAISE NOTICE '  - Open sales orders: %', v_so_count;
END $$;