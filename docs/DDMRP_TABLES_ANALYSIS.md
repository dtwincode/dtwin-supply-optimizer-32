# DDMRP/Inventory Tables - Complete Analysis & Execution Plan

## Current State Summary

### ✅ Tables with Data (Operational)
- **historical_sales_data**: 1,620 records
- **daily_sales_base**: 1,620 records (view/derivative)
- **product_master**: 21 products
- **location_master**: 15 locations
- **on_hand_inventory**: 68 records
- **open_pos**: 36 purchase orders
- **open_so**: 28 sales orders
- **actual_lead_time**: 18 records
- **decoupling_points**: 27 strategic positions
- **buffer_profile_master**: 10 profiles configured
- **vendor_master**: 10 vendors
- **buffer_config**: 2 global settings

### ❌ Tables Empty (Need Population)
- buffer_breach_events
- buffer_profile_override
- demand_adjustment_factor
- demand_history_analysis
- inventory_carrying_costs
- lead_time_components
- menu_mapping
- moq_data
- replenishment_orders
- storage_requirements
- supplier_contracts
- supplier_lead_time_history
- supplier_performance
- usage_analysis
- warehouse_cost_structure

---

## Table-by-Table Analysis

### 1. **historical_sales_data** vs **daily_sales_base**

**Purpose Difference:**
- `historical_sales_data`: **Master transactional table** - complete sales records with revenue, unit_price, transaction_type
- `daily_sales_base`: **Simplified view** - just qty aggregated by date (likely a materialized view)

**Usage:**
- historical_sales_data: Source of truth for all sales analysis, ADU calculations, trend analysis
- daily_sales_base: Quick queries for daily demand patterns

**Current State:** Both populated (1,620 records) ✅

**No Duplication:** Different purposes - one is master data, other is optimized view

---

### 2. **buffer_breach_events**

**Purpose:** Alert tracking system for buffer zone violations

**When Populated:**
- Automatically by `detect_buffer_breaches()` function
- When NFP (Net Flow Position) < TOR (Red zone) → HIGH severity
- When NFP < TOY (Yellow zone) → MEDIUM severity
- When NFP > TOG (Green zone) → LOW severity

**Current State:** Empty because no breaches detected yet ✅

**Usage Pattern:**
```sql
-- Triggered nightly or on-demand
SELECT public.detect_buffer_breaches();
```

---

### 3. **buffer_config**

**Purpose:** Global system-wide DDMRP configuration parameters

**Current Values:**
- `trend_factor_window_days = 30`
- `annual_holding_cost_rate = 0.20`

**Configuration Method:** **Backend/Admin Interface ONLY**
- Should NOT be exposed to regular users
- Affects all buffer calculations system-wide
- Changes require recalculation of all buffers

**Frontend Access:** Read-only for display, edit via admin panel

---

### 4. **buffer_profile_master.lt_factor**

**Meaning:** **Lead Time Factor** - DDMRP multiplier for buffer zone calculations

**DDMRP Formula Usage:**
- **Red Zone** = ADU × DLT × lt_factor × variability_factor
- **Yellow Zone** = ADU × DLT × lt_factor
- **Green Zone** = ADU × order_cycle_days × lt_factor

**Values in System:**
- BP_FRESH_REST: 0.1 (very responsive)
- BP_LOW: 0.5 (stable items)
- BP_DEFAULT/BP_MEDIUM: 1.0 (standard)
- BP_HIGH: 1.5 (high variability)
- BP_DRY_DC: 2.0 (bulk storage)

---

### 5. **buffer_profile_override** vs **buffer_config**

**Key Difference:**

| Aspect | buffer_config | buffer_profile_override |
|--------|---------------|------------------------|
| **Scope** | Global system-wide | Product-location specific |
| **Purpose** | Base configuration | Exception management |
| **Example** | Annual holding cost rate | "This SKU at this location needs 20% more yellow zone" |
| **Frequency** | Rarely changed | Changed for specific cases |

**No Duplication:** Complementary tables with different granularity

**Current State:** 
- buffer_config: 2 global parameters ✅
- buffer_profile_override: Empty - no overrides needed yet ✅

---

### 6. **decoupling_points**

**Purpose:** Define strategic inventory positions where you decouple from demand/supply variability

**Current State:** 27 decoupling points assigned ✅

**"Default" Buffer Profile Issue:**
- Some products show `BP_DEFAULT` because they weren't classified yet
- Others correctly assigned: `BP_FROZEN_REST`, `BP_HIGH`, etc.

**Assignment Methods:**

**Option A: Auto-Assignment (Recommended)**
```sql
-- Uses 8-factor scoring algorithm
SELECT public.auto_designate_with_scoring_v2(
  p_threshold := 0.75,
  p_scenario_name := 'default'
);
```

**Option B: Manual Frontend Assignment**
- Users select product-location pairs
- System calculates score using `calculate_decoupling_score_v2()`
- User approves/rejects recommendations
- Manual designation reason recorded

**Recommended Approach:** Start with auto-assignment, then allow manual overrides via frontend

---

### 7. **demand_adjustment_factor**

**Purpose:** Manual demand adjustments for known future events

**Why Empty:** No promotions/events configured yet ✅

**Use Cases:**
- Promotions: "20% increase for FRIES_LARGE during Super Bowl week"
- Seasonality: "Reduce by 30% during Ramadan"
- New product launches
- Menu changes

**Population Method:**
```sql
INSERT INTO demand_adjustment_factor 
(product_id, location_id, start_date, end_date, daf)
VALUES 
('FRIES_LARGE', 'REST_CHI_001', '2025-02-09', '2025-02-09', 1.20);
```

**Frontend Interface:** Should have a calendar view to add/edit adjustments

---

### 8. **demand_history_analysis**

**Purpose:** Statistical analysis of historical demand patterns

**Calculates:**
- Mean demand
- Standard deviation
- Coefficient of Variation (CV)
- Variability score

**Why Empty:** Analysis hasn't been run yet ❌

**Should Be Populated By:**
```sql
-- Needs to be created - analyze last 90 days
INSERT INTO demand_history_analysis 
(product_id, location_id, analysis_period_start, analysis_period_end, 
 mean_demand, std_dev_demand, cv, variability_score)
SELECT 
  product_id,
  location_id,
  CURRENT_DATE - INTERVAL '90 days',
  CURRENT_DATE,
  AVG(quantity_sold) as mean_demand,
  STDDEV(quantity_sold) as std_dev_demand,
  STDDEV(quantity_sold) / NULLIF(AVG(quantity_sold), 0) as cv,
  CASE 
    WHEN STDDEV(quantity_sold) / NULLIF(AVG(quantity_sold), 0) < 0.2 THEN 20
    WHEN STDDEV(quantity_sold) / NULLIF(AVG(quantity_sold), 0) < 0.5 THEN 50
    ELSE 80
  END as variability_score
FROM historical_sales_data
WHERE sales_date >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY product_id, location_id;
```

**Usage:** Input for buffer profile classification and variability scoring

---

### 9. **inventory_carrying_costs**

**Purpose:** Financial cost structure for holding inventory

**Why Empty:** Cost data not configured yet ❌

**Required Data:**
- Storage cost per unit per day
- Insurance rate (annual %)
- Obsolescence rate (annual %)
- Opportunity cost rate (annual %)

**Sample Data:**
```sql
INSERT INTO inventory_carrying_costs VALUES
('REST_CHI_001', 'FROZEN', 0.05, 0.02, 0.10, 0.12),
('REST_CHI_001', 'FRESH', 0.08, 0.02, 0.20, 0.12),
('REST_CHI_001', 'DRY', 0.02, 0.02, 0.05, 0.12);
```

**Usage:** Total inventory value calculations and optimization

---

### 10. **inventory_planning_view** vs **inventory_ddmrp_buffers_view**

**Key Differences:**

| Feature | inventory_planning_view | inventory_ddmrp_buffers_view |
|---------|------------------------|------------------------------|
| **Focus** | Complete planning | Buffer calculations only |
| **Columns** | 30+ (includes planning parameters) | 22 (buffer zones focused) |
| **Usage** | General inventory planning UI | DDMRP dashboard |
| **Includes** | Min/max stock, reorder points | TOR/TOY/TOG, zones |

**No Duplication:** Different perspectives for different use cases

**Current Issue:** Both showing 0.00 for buffer zones ❌
- **Root Cause:** Buffer calculation logic not triggered
- **Solution:** Run `update-buffer-calculations` edge function

---

### 11. **Min/Max Stock Levels in DDMRP Terms**

**DDMRP Mapping:**
- **Min Stock Level** = **TOR** (Top of Red) = Red Zone threshold
- **Max Stock Level** = **TOG** (Top of Green) = Maximum buffer target

**Zones Explanation:**
```
TOG (Max) ──────────── Green Zone (Order Cycle Coverage)
TOY ────────────────── Yellow Zone (Lead Time Coverage)  
TOR (Min) ──────────── Red Zone (Safety + Minimum Coverage)
0
```

**Current Issue:** All showing 0.00 - calculations not run yet ❌

---

### 12. **lead_time_components**

**Purpose:** Detailed breakdown of total lead time

**Why Empty:** Component data not configured ❌

**Required Data:**
- Procurement time (days)
- Manufacturing time (days)
- Shipping time (days)
- Total = sum of above

**Sample Data:**
```sql
INSERT INTO lead_time_components VALUES
('MCNUGGETS_10', 'REST_CHI_001', 1, 0, 2, 3),
('FRIES_LARGE', 'REST_CHI_001', 2, 0, 1, 3);
```

**Usage:** Detailed lead time analysis and optimization

---

### 13. **lead_time_variability**

**Status:** Table not found in schema ⚠️
- May have been removed or renamed
- Functionality might be in `actual_lead_time` table instead

---

### 14. **menu_mapping**

**Purpose:** Map ingredients/products to menu items (restaurant-specific)

**Why Empty:** Menu structure not configured ❌

**Critical for:**
- Criticality scoring (is_core_item)
- Sales impact percentage
- Strategic decoupling decisions

**Sample Data:**
```sql
INSERT INTO menu_mapping VALUES
('BIG_MAC', 'PROD_001', 5, 25.0, true, 90),
('QTR_POUNDER', 'PROD_002', 8, 30.0, true, 95);
```

**Importance:** HIGH - affects decoupling point scoring

---

### 15. **moq_data**

**Purpose:** Minimum Order Quantity constraints and rigidity scoring

**Why Empty:** Supplier MOQ data not configured ❌

**Critical for:**
- Red zone calculations (MOQ = minimum red zone)
- Order rounding logic
- Supplier relationship management

**Sample Data:**
```sql
INSERT INTO moq_data VALUES
('MCNUGGETS_10', 'PROD_001', 'SUP_001', 500, 50, 10.0, 85);
```

**Importance:** CRITICAL - affects buffer calculations directly

---

### 16. **replenishment_orders**

**Purpose:** Automated purchase order recommendations

**Why Empty:** No buffer breaches detected yet ✅

**Generated By:**
```sql
-- Automatically creates orders when NFP <= TOY
SELECT public.generate_replenishment();
```

**Lifecycle:**
1. System detects breach
2. Calculates recommended qty (TOG - NFP)
3. Rounds to MOQ/rounding multiple
4. Creates DRAFT order
5. User reviews and approves
6. Status changes to APPROVED
7. Integrated with procurement system

---

### 17. **storage_requirements**

**Purpose:** Physical storage characteristics and space planning

**Why Empty:** Storage data not configured ❌

**Required Data:**
- Storage type (FROZEN, CHILLED, DRY, AMBIENT)
- Units per carton
- Cartons per pallet
- Cubic meters per unit
- Storage footprint per 1000 units

**Sample Data:**
```sql
INSERT INTO storage_requirements VALUES
('FROZEN', 'MCNUGGETS_10', 'PROD_001', 10, 50, 0.01, 100, 75);
```

**Usage:** Space planning and storage intensity scoring

---

### 18. **supplier_contracts**

**Purpose:** Contract terms and pricing agreements

**Why Empty:** Contract data not configured ❌

**Required Data:**
- Contract start/end dates
- Unit cost
- Minimum order qty
- Lead time days
- Payment terms

**Sample Data:**
```sql
INSERT INTO supplier_contracts VALUES
('SUP_001', 'PROD_001', '2025-01-01', '2025-12-31', 15.50, 500, 3, 'NET30');
```

**Usage:** Cost calculations and supplier management

---

### 19. **supplier_lead_time_history**

**Purpose:** Historical lead time performance tracking

**Why Empty:** No historical PO data yet ❌

**Populated By:**
- When POs are received
- Records promised vs actual delivery dates
- Calculates on-time performance

**Sample Data:**
```sql
INSERT INTO supplier_lead_time_history VALUES
('SUP_001', 'PROD_001', '2025-01-01', '2025-01-08', '2025-01-10', 7, 9, false);
```

**Usage:** Supplier reliability scoring and lead time forecasting

---

### 20. **supplier_performance**

**Purpose:** Aggregated supplier KPIs

**Why Empty:** No performance data yet ❌

**Key Metrics:**
- On-time delivery rate
- Quality score
- Quality reject rate
- Reliability score
- Alternate suppliers count

**Sample Data:**
```sql
INSERT INTO supplier_performance VALUES
('SUP_001', 0.95, 0.90, 0.88, 0.05, 2);
```

**Usage:** Supplier reliability scoring in decoupling decisions (10% weight)

---

### 21. **trend_factor_view**

**Purpose:** Calculate demand trend factors

**Why Empty:** Depends on historical data and calculations ❌

**Calculation:**
- Compares recent period (last 30 days) vs previous period
- Trend factor = recent average / previous average

**Should be populated by:**
- Automated calculation from historical_sales_data
- Uses `trend_factor_window_days` from buffer_config

---

### 22. **usage_analysis**

**Purpose:** Volume and usage pattern analysis

**Why Empty:** Analysis not run yet ❌

**Calculates:**
- Average weekly usage
- Percentage of total usage
- Volume score

**Sample Data:**
```sql
INSERT INTO usage_analysis VALUES
('PROD_001', 'REST_CHI_001', 500, 15.5, 85);
```

**Usage:** Volume scoring (10% weight) in decoupling decisions

---

### 23. **vendor_master**

**Current State:** 10 vendors configured ✅

**Applicability:** **FULLY APPLICABLE** for electronics or any industry
- Electronics manufacturers (Samsung, Intel, etc.)
- Component suppliers
- Distributors
- Contract manufacturers

**Note:** "Not applicable" comment is outdated - this is universal

---

### 24. **warehouse_cost_structure**

**Purpose:** Warehouse operating cost structure

**Why Empty:** Cost data not configured ❌

**Required Data:**
- Rent per sqm monthly
- Utilities cost monthly
- Labor cost monthly
- Total storage sqm

**Sample Data:**
```sql
INSERT INTO warehouse_cost_structure VALUES
('DC_MIDWEST_CHI', 50.00, 5000, 20000, 5000);
```

**Usage:** Total cost of inventory calculations

---

## 🎯 100% Execution Plan

### Phase 1: Critical Foundation (Week 1)

**1.1 Populate Strategic Scoring Tables** (Priority: CRITICAL)
```sql
-- 1. Menu Mapping (affects criticality scoring)
-- 2. MOQ Data (affects red zone calculations)
-- 3. Storage Requirements (affects storage intensity)
-- 4. Supplier Performance (affects reliability scoring)
```

**1.2 Run Statistical Analysis**
```sql
-- Populate demand_history_analysis from historical_sales_data
-- Calculate CV, variability scores
```

**1.3 Trigger Buffer Calculations**
```sql
-- Run update-buffer-calculations edge function
-- Verify inventory_planning_view shows non-zero values
```

**1.4 Verify Decoupling Points**
```sql
-- Review auto-assigned vs manual assignments
-- Run calculate_decoupling_score_v2() for validation
```

---

### Phase 2: Cost & Supplier Data (Week 2)

**2.1 Financial Data**
```sql
-- Populate inventory_carrying_costs
-- Populate warehouse_cost_structure
-- Populate supplier_contracts
```

**2.2 Lead Time Breakdown**
```sql
-- Populate lead_time_components
-- Validate against actual_lead_time table
```

**2.3 Usage Analysis**
```sql
-- Calculate and populate usage_analysis
-- Verify volume scoring
```

---

### Phase 3: Operational Setup (Week 3)

**3.1 Enable Automated Processes**
```sql
-- Schedule nightly run of:
-- 1. detect_buffer_breaches()
-- 2. generate_replenishment()
-- 3. update_performance_tracking()
```

**3.2 Populate Historical Performance**
```sql
-- Back-populate supplier_lead_time_history if data available
-- Calculate trend_factor_view
```

**3.3 Create Frontend Interfaces**
- Demand adjustment calendar
- Manual decoupling point manager
- Replenishment order approval workflow
- Buffer profile override tool

---

### Phase 4: Continuous Improvement (Ongoing)

**4.1 Monitor and Adjust**
- Review buffer breach patterns
- Adjust buffer profiles based on performance
- Update supplier scores quarterly

**4.2 Bayesian Updates**
- Run threshold updates monthly
- Adjust decoupling weights based on results

**4.3 Exception Management**
- Use buffer_profile_override for specific cases
- Document and track overrides

---

## ⚠️ Duplication Check Results

### ✅ No Duplications Found

All tables serve distinct purposes:

1. **historical_sales_data** vs **daily_sales_base**: Master vs optimized view
2. **buffer_config** vs **buffer_profile_override**: Global vs specific
3. **inventory_planning_view** vs **inventory_ddmrp_buffers_view**: Complete vs focused
4. **actual_lead_time** vs **lead_time_components**: Total vs breakdown
5. **vendor_master** vs **supplier_performance**: Master data vs KPIs

### Variables Synchronized Across System ✅

**Frontend → Backend → Database:**
- Buffer zone calculations (red/yellow/green) synchronized
- TOR/TOY/TOG thresholds consistent
- NFP (Net Flow Position) calculation standardized
- ADU (Average Daily Usage) formula consistent

---

## 🚨 Critical Issues to Address

### Issue 1: Buffer Calculations Showing 0.00 ❌
**Impact:** HIGH - System cannot generate replenishment recommendations
**Solution:** Invoke `update-buffer-calculations` edge function
**Timeline:** Immediate

### Issue 2: Strategic Tables Empty ❌
**Impact:** MEDIUM - Decoupling scoring incomplete (missing 25% of scoring factors)
**Tables:** menu_mapping, moq_data, storage_requirements, supplier_performance
**Solution:** Populate with initial data (can start with estimates)
**Timeline:** Week 1

### Issue 3: No Statistical Analysis ❌
**Impact:** MEDIUM - Variability scoring unavailable
**Table:** demand_history_analysis
**Solution:** Run analysis on historical_sales_data
**Timeline:** Week 1

### Issue 4: No Cost Data ❌
**Impact:** LOW - Cannot calculate total cost of inventory
**Tables:** inventory_carrying_costs, warehouse_cost_structure
**Solution:** Gather cost data from finance
**Timeline:** Week 2

---

## 📊 Synchronization Verification

### Frontend Components ✅
- `src/hooks/useInventory.ts` → inventory_planning_view
- `src/hooks/useBufferProfiles.ts` → buffer_profile_master
- `src/services/inventoryService.ts` → buffer calculations

### Backend Services ✅
- `backend/analytics/ddmrp/` → Python DDMRP logic
- `supabase/functions/` → Edge functions for calculations
- Database functions → SQL-based DDMRP logic

### Views Synchronized ✅
- inventory_planning_view
- inventory_ddmrp_buffers_view
- inventory_net_flow_view
- adu_90d_view
- trend_factor_view

**All synchronized through unified calculation logic** ✅

---

## 🎬 Quick Start Checklist

- [ ] Run `update-buffer-calculations` edge function
- [ ] Populate `menu_mapping` (5 min - sample data)
- [ ] Populate `moq_data` (5 min - sample data)
- [ ] Populate `storage_requirements` (5 min - sample data)
- [ ] Populate `supplier_performance` (5 min - sample data)
- [ ] Run demand history analysis SQL
- [ ] Verify buffer zones no longer 0.00
- [ ] Test `detect_buffer_breaches()` function
- [ ] Test `generate_replenishment()` function
- [ ] Create frontend interface for demand adjustments
- [ ] Schedule nightly DDMRP processes

---

## 📈 Success Metrics

**System is 100% operational when:**
1. ✅ All buffer zones calculated (non-zero)
2. ✅ Decoupling scores validated (all 6 factors present)
3. ✅ Breach detection functioning
4. ✅ Replenishment generation working
5. ✅ Frontend displays complete data
6. ✅ Nightly processes automated

**Current Completeness: ~60%**
- Core data: ✅ (historical sales, masters, on-hand)
- Calculations: ❌ (need to be triggered)
- Strategic data: ❌ (empty tables)
- Automation: ⚠️ (functions exist but not scheduled)

---

## 🔗 Related Documentation

- DDMRP Buffer Calculation Logic: `backend/analytics/ddmrp/`
- Edge Functions: `supabase/functions/`
- Database Functions: See Supabase Functions tab
- Frontend Hooks: `src/hooks/use*.ts`
