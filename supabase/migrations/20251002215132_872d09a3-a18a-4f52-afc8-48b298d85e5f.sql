-- ============================================
-- TEST DATA: Simulate Buffer Breaches
-- ============================================
-- Insert low inventory levels to trigger breaches for testing

-- Clear existing on_hand_inventory to start fresh
TRUNCATE on_hand_inventory;

-- Insert realistic inventory levels with some breaches:
-- 1. Items in RED zone (critical - below TOR)
-- 2. Items in YELLOW zone (warning - below TOY)
-- 3. Items in GREEN zone (optimal)
-- 4. Items in BLUE zone (overstock - above TOG)

INSERT INTO on_hand_inventory (product_id, location_id, qty_on_hand, snapshot_ts) VALUES
-- CRITICAL: Items in RED zone (below TOR)
('BIG_MAC', 'REST_CHI_001', 150, NOW()), -- RED: TOR=294.50, this is way below
('FRIES_LARGE', 'REST_ATL_001', 30, NOW()), -- RED: TOR=50, this is below
('QTR_POUNDER', 'REST_CHI_002', 100, NOW()), -- RED: TOR=223.50, this is below

-- WARNING: Items in YELLOW zone (below TOY but above TOR)
('BIG_MAC', 'REST_ATL_001', 400, NOW()), -- YELLOW: TOR=300.07, TOY=600.14
('MCNUGGETS_10', 'REST_CHI_001', 60, NOW()), -- YELLOW: TOR=50, TOY=101.33
('COKE_MEDIUM', 'REST_CHI_002', 150, NOW()), -- YELLOW: TOR=100, TOY=373.54

-- OPTIMAL: Items in GREEN zone (between TOY and TOG)
('QTR_POUNDER', 'REST_ATL_001', 1000, NOW()), -- GREEN: TOY=460.86, TOG=2073.89
('FRIES_LARGE', 'REST_CHI_002', 200, NOW()), -- GREEN: TOY=182.79, TOG=271.32
('MCMUFFIN_EGG', 'REST_CHI_001', 40, NOW()), -- GREEN: TOY=32.82, TOG=52.82

-- OVERSTOCK: Items in BLUE zone (above TOG)
('BIG_MAC', 'REST_CHI_002', 3000, NOW()), -- BLUE: TOG=2718
('MCNUGGETS_10', 'REST_ATL_001', 200, NOW()), -- BLUE: TOG=151.46
('COKE_MEDIUM', 'REST_ATL_001', 700, NOW()); -- BLUE: TOG=661.24

-- Verify the breach scenarios
DO $$
DECLARE
  v_red_count INTEGER;
  v_yellow_count INTEGER;
  v_green_count INTEGER;
  v_blue_count INTEGER;
BEGIN
  -- Count items by buffer status
  SELECT 
    COUNT(CASE WHEN b.buffer_status = 'RED' THEN 1 END),
    COUNT(CASE WHEN b.buffer_status = 'YELLOW' THEN 1 END),
    COUNT(CASE WHEN b.buffer_status = 'GREEN' THEN 1 END),
    COUNT(CASE WHEN b.buffer_status = 'BLUE' THEN 1 END)
  INTO v_red_count, v_yellow_count, v_green_count, v_blue_count
  FROM inventory_planning_view b
  WHERE b.average_daily_usage > 0;

  RAISE NOTICE '📊 Buffer Status Distribution:';
  RAISE NOTICE '  🔴 RED (Critical): % items', v_red_count;
  RAISE NOTICE '  🟡 YELLOW (Warning): % items', v_yellow_count;
  RAISE NOTICE '  🟢 GREEN (Optimal): % items', v_green_count;
  RAISE NOTICE '  🔵 BLUE (Overstock): % items', v_blue_count;
  
  IF v_red_count + v_yellow_count > 0 THEN
    RAISE NOTICE '✅ Test data ready! Run detect-breaches-and-replenish to generate alerts and orders.';
  ELSE
    RAISE WARNING '⚠️  No breaches detected. All items are in GREEN or BLUE zones.';
  END IF;
END $$;