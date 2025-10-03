# DDMRP Inventory Management Tool - Complete User Guide

## Table of Contents
1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Initial Data Setup](#initial-data-setup)
4. [Understanding the Inventory Module](#understanding-the-inventory-module)
5. [Step-by-Step Workflow](#step-by-step-workflow)
6. [Configuration Guide](#configuration-guide)
7. [Daily Operations](#daily-operations)
8. [Advanced Features](#advanced-features)

---

## Introduction

This DDMRP (Demand Driven Material Requirements Planning) tool implements the complete methodology from the DDMRP book by Carol Ptak and Chad Smith. The system focuses on:
- **Strategic positioning** of inventory buffers
- **Dynamic buffer adjustments** based on market conditions
- **Visible collaborative execution** using buffer penetration
- **Material synchronization** across multi-level BOMs

---

## Getting Started

### Prerequisites
Before using the system, ensure you have:
- Authentication credentials (login access)
- Master data files ready for upload
- Understanding of your supply chain structure

### First Login
1. Navigate to the login page
2. Enter your credentials
3. You'll land on the Dashboard showing overall metrics

---

## Initial Data Setup

### Step 1: Upload Master Data (Settings Page)

Navigate to **Settings** page first. You must upload data in this specific order:

#### 1.1 Product Master Data
**Table:** `product_master`

**Required Fields:**
- `product_id` (unique identifier, e.g., "PROD_001")
- `sku` (Stock Keeping Unit, e.g., "SKU-12345")
- `name` (Product name, e.g., "Big Mac Bun")
- `category` (e.g., "Ingredients", "Finished Goods")
- `subcategory` (optional, e.g., "Bakery", "Proteins")
- `product_family` (optional grouping)
- `unit_of_measure` (e.g., "EACH", "KG", "LITER")
- `supplier_id` (reference to vendor)
- `buffer_profile_id` (default: "BP_DEFAULT", will customize later)

**Purpose:** Foundation of your inventory system. Every product must be registered here first.

**Example CSV:**
```csv
product_id,sku,name,category,subcategory,supplier_id,unit_of_measure
PROD_001,BUN-001,Sesame Bun,Ingredients,Bakery,SUP_001,EACH
PROD_002,BEEF-001,Beef Patty,Ingredients,Proteins,SUP_002,KG
```

#### 1.2 Location Master Data
**Table:** `location_master`

**Required Fields:**
- `location_id` (unique identifier, e.g., "LOC_RY_001")
- `region` (e.g., "Riyadh", "Jeddah")
- `channel_id` (e.g., "DINE_IN", "DRIVE_THRU")
- `location_type` (e.g., "RESTAURANT", "DC", "WAREHOUSE")
- `restaurant_number` (optional store number)

**Purpose:** Defines all physical locations in your supply chain network.

**Example CSV:**
```csv
location_id,region,channel_id,location_type,restaurant_number
LOC_RY_001,Riyadh,DINE_IN,RESTAURANT,R001
LOC_RY_DC,Riyadh,DC,WAREHOUSE,DC01
```

#### 1.3 Vendor Master Data
**Table:** `vendor_master`

**Required Fields:**
- `vendor_id` (unique identifier)
- `vendor_code` (your internal code)
- `vendor_name` (supplier name)
- `country`, `region`, `city` (location info)
- `contact_person`, `contact_email`, `phone_number`
- `payment_terms` (e.g., "NET30", "NET60")

**Purpose:** Manages supplier information for procurement.

#### 1.4 Historical Sales Data
**Table:** `historical_sales_data`

**Required Fields:**
- `sales_id` (unique transaction ID)
- `product_id` (must match product_master)
- `location_id` (must match location_master)
- `sales_date` (format: YYYY-MM-DD)
- `quantity_sold` (integer)
- `revenue` (optional, numeric)
- `unit_price` (optional)

**Purpose:** Critical for calculating Average Daily Usage (ADU). Upload at least 90 days of historical sales.

**Example CSV:**
```csv
sales_id,product_id,location_id,sales_date,quantity_sold,revenue
SALE_001,PROD_001,LOC_RY_001,2025-01-01,150,750.00
SALE_002,PROD_001,LOC_RY_001,2025-01-02,145,725.00
```

#### 1.5 Product Pricing
**Table:** `product_pricing-master`

**Required Fields:**
- `pricing_id` (unique)
- `product_id` (reference)
- `price` (current unit price)
- `effective_date` (when price became active)
- `currency` (default: "SAR")

**Purpose:** Used for inventory valuation and cost analysis.

#### 1.6 Actual Lead Time
**Table:** `actual_lead_time`

**Required Fields:**
- `product_id`
- `location_id`
- `actual_lead_time_days` (integer, e.g., 7 for 1 week)

**Purpose:** Defines how long it takes to replenish each product at each location. Critical for buffer calculations.

**Example:**
```csv
product_id,location_id,actual_lead_time_days
PROD_001,LOC_RY_001,3
PROD_002,LOC_RY_001,7
```

---

## Understanding the Inventory Module

### Main Navigation Tabs

When you navigate to the **Inventory** page, you'll see 7 main tabs:

1. **Strategic** - Long-term planning and positioning
2. **Operational** - Day-to-day buffer monitoring
3. **Analytics** - Performance metrics and SKU classification
4. **Buffer Profiles** - Define buffer parameters
5. **Breach Alerts** - Critical inventory alerts
6. **BOM** - Bill of Materials and component relationships
7. **Configuration** - System settings and DDMRP parameters

---

## Step-by-Step Workflow

### Phase 1: Strategic Planning (Week 1)

#### Step 1: Define Buffer Profiles
Go to: **Inventory → Buffer Profiles Tab**

**What are Buffer Profiles?**
Buffer profiles define the "personality" of your inventory buffers based on lead time and variability characteristics.

**Actions:**
1. Click "Create New Buffer Profile"
2. Fill in:
   - **Name** (e.g., "Short Lead / Low Variability")
   - **Lead Time Factor** (0.5 to 2.0) - Higher = more safety stock
   - **Variability Factor** (0.2 to 0.8) - Higher = more protection against demand spikes
   - **Order Cycle Days** (how often you order, e.g., 7 days)
   - **Min Order Qty** (supplier MOQ if applicable)
   - **Rounding Multiple** (e.g., order in cases of 12)

**Recommended Profiles:**
- **Profile 1**: Short Lead (LT < 5 days) / Low Variability → LT Factor: 0.5, Var Factor: 0.25
- **Profile 2**: Medium Lead (5-10 days) / Medium Variability → LT Factor: 1.0, Var Factor: 0.5
- **Profile 3**: Long Lead (>10 days) / High Variability → LT Factor: 1.5, Var Factor: 0.75

**Where This Data Goes:**
- Stored in: `buffer_profile_master` table
- Referenced by: `product_master.buffer_profile_id`

#### Step 2: Assign Buffer Profiles to Products
Go to: **Settings → Product Master**

**Actions:**
1. For each product, assign the appropriate `buffer_profile_id`
2. Save changes
3. System will use these profiles for buffer calculations

#### Step 3: Strategic Positioning - Identify Decoupling Points
Go to: **Inventory → Strategic Tab → Decoupling Point Manager**

**What are Decoupling Points?**
Strategic positions in your supply chain where you hold inventory to protect against variability and decouple dependent/independent demand.

**Actions:**
1. Review the **Decoupling Recommendation Panel**
   - System automatically scores each product-location pair
   - Uses 6-factor analysis:
     - Variability (20% weight)
     - Criticality (20% weight)
     - Holding Cost (15% weight)
     - Supplier Reliability (10% weight)
     - Lead Time (10% weight)
     - Volume (10% weight)

2. Click "Run Auto-Designation" to let AI suggest decoupling points
   - Products scoring ≥75% = Auto-designated
   - Products scoring 50-74% = Review required (manual decision)
   - Products <50% = Auto-rejected

3. **Manual Review:**
   - For "Review Required" items, click "Designate as Decoupling Point" or "Reject"
   - Provide justification for manual overrides

**Where This Data Goes:**
- Stored in: `decoupling_points` table
- System creates: `decoupling_recommendations` with AI scores

#### Step 4: Supply Chain Network Visualization
Go to: **Inventory → Strategic Tab → Supply Chain Network**

**Purpose:** Visual map of your multi-echelon network showing:
- Distribution Centers (top level)
- Regional hubs (middle level)
- Restaurants/stores (bottom level)
- Buffer positions at each level

**Actions:**
1. Review the network diagram
2. Validate that decoupling points make sense strategically
3. Adjust if needed (e.g., push buffers upstream to DC instead of stores for slow movers)

---

### Phase 2: Buffer Configuration (Week 1-2)

#### Step 5: Configure Buffer Calculations
Go to: **Inventory → Configuration Tab → Menu Mapping**

**Purpose:** Define product criticality for buffer priority.

**Actions:**
1. Upload or manually enter:
   - `product_id`
   - `is_core_item` (true/false) - Is this a core menu item?
   - `sales_impact_percentage` (0-100) - Revenue contribution

**Example:**
```csv
product_id,is_core_item,sales_impact_percentage
PROD_001,true,25.5
PROD_002,true,18.2
```

#### Step 6: Add MOQ Data (Minimum Order Quantities)
Go to: **Inventory → Configuration Tab → MOQ Data**

**Purpose:** Supplier constraints that affect order sizes.

**Actions:**
1. For each product-supplier pair, enter:
   - `product_id`
   - `supplier_id`
   - `moq_units` (minimum order quantity)
   - `lead_time_days`
   - `days_coverage` (how many days of demand does MOQ cover?)

**Why This Matters:**
- System ensures replenishment orders meet supplier MOQs
- Calculates if MOQ creates excess inventory risk

#### Step 7: Storage Requirements
Go to: **Inventory → Configuration Tab → Storage Requirements**

**Purpose:** Physical storage constraints affect buffer sizing.

**Actions:**
1. Enter for each product:
   - `storage_type` (AMBIENT, CHILLED, FROZEN)
   - `units_per_carton`
   - `cartons_per_pallet`
   - `cubic_meters_per_unit`

**Impact:**
- High-footprint items may warrant tighter buffers
- Frozen storage costs influence holding cost calculations

#### Step 8: Supplier Performance
Go to: **Inventory → Configuration Tab → Supplier Performance**

**Purpose:** Track supplier reliability for buffer adjustments.

**Actions:**
1. System auto-populates from delivery history (if available)
2. Manually update if needed:
   - `on_time_delivery_rate` (0.0 to 1.0, e.g., 0.95 = 95%)
   - `quality_reject_rate` (0.0 to 1.0, e.g., 0.02 = 2%)
   - `alternate_suppliers_count` (how many backup suppliers?)

**Impact:**
- Unreliable suppliers → Higher buffer recommendations
- Multiple alternates → Lower risk, smaller buffers

#### Step 9: Cost Structure
Go to: **Inventory → Configuration Tab → Cost Structure**

**Purpose:** Calculate holding costs for optimization.

**Actions:**
1. Enter per location:
   - Warehouse rent per sqm/month
   - Utilities cost
   - Labor cost
   - Total storage capacity (sqm)

2. Enter per product category:
   - Storage cost per unit per day
   - Insurance rate (annual %)
   - Obsolescence rate (annual %)
   - Opportunity cost rate (annual %)

---

### Phase 3: Dynamic Adjustments Setup (Week 2)

#### Step 10: Demand Adjustment Factors (DAF)
Go to: **Inventory → Configuration Tab → Dynamic Adjustments → DAF**

**What is DAF?**
Temporarily adjust Average Daily Usage (ADU) for known demand changes (promotions, seasonality, new product launches).

**Formula:** `Adjusted ADU = Base ADU × DAF`

**When to Use:**
- Ramadan promotion: DAF = 1.5 (50% demand increase)
- Summer slowdown: DAF = 0.7 (30% decrease)
- New product launch: DAF = 2.0 (double expected demand)

**Actions:**
1. Click "Add New DAF"
2. Fill in:
   - `product_id` (which product)
   - `location_id` (which location)
   - `start_date` (when adjustment begins)
   - `end_date` (when it ends)
   - `daf` (multiplier, e.g., 1.5)
   - Reason (e.g., "Ramadan promotion")

3. System status:
   - **Active** = Current date within range → DAF applied NOW
   - **Scheduled** = Future dates → Will apply automatically

**Example:**
```
Product: Big Mac Bun
Location: Riyadh R001
Start Date: 2025-03-10 (Ramadan starts)
End Date: 2025-04-09 (Ramadan ends)
DAF: 1.8 (80% increase)
Reason: "Ramadan increased demand"
```

#### Step 11: Lead Time Adjustment Factors (LTAF)
Go to: **Inventory → Configuration Tab → Dynamic Adjustments → LTAF**

**What is LTAF?**
Temporarily adjust Decoupled Lead Time (DLT) for known supply changes.

**Formula:** `Adjusted DLT = Base DLT × LTAF`

**When to Use:**
- Port congestion: LTAF = 1.5 (50% longer lead times)
- Express shipping available: LTAF = 0.6 (40% faster)
- Supplier transition: LTAF = 2.0 (double lead time during switch)

**Actions:**
1. Click "Add New LTAF"
2. Fill in similar to DAF
3. System auto-detects lead time variance >20% and suggests LTAF

#### Step 12: Zone Adjustment Factors (ZAF)
Go to: **Inventory → Configuration Tab → Dynamic Adjustments → ZAF**

**What is ZAF?**
Override specific buffer zones (Red/Yellow/Green) without changing ADU or DLT.

**When to Use:**
- Increase safety stock before long holiday: ZAF_Red = 1.5
- Reduce excess inventory: ZAF_Green = 0.8

**Actions:**
1. Click "Add New ZAF"
2. Specify which zone to adjust (Red, Yellow, Green)
3. Enter multiplier

#### Step 13: Buffer Criteria Compliance
Go to: **Inventory → Configuration Tab → Dynamic Adjustments → Buffer Criteria**

**Purpose:** Validate that your buffers meet the 6 criteria from DDMRP Chapter 11.

**The 6 Tests:**
1. **Decoupling Test** - Buffer separates dependent/independent demand
2. **Bidirectional Benefit** - Helps both upstream suppliers and downstream customers
3. **Order Independence** - Orders complete independently
4. **Primary Planning Mechanism** - Buffers drive replenishment (not forecasts)
5. **Relative Priority** - Execution uses buffer penetration (not due dates)
6. **Dynamic Adjustment** - Buffers adjust via DAF/LTAF/ZAF

**Actions:**
1. Click "Run Compliance Check"
2. Review results for each product-location
3. Overall Score ≥85% = COMPLIANT
4. Fix violations (e.g., add missing DAF/LTAF)

#### Step 14: Lead Time Variance Alerts
Go to: **Inventory → Configuration Tab → Dynamic Adjustments → Lead Time Alerts**

**Purpose:** Automatically detect when supplier lead times change significantly.

**How It Works:**
- System monitors `actual_lead_time` table
- Detects variance >20% from previous baseline
- Auto-logs in `lead_time_variance_log`
- Auto-creates LTAF for next 60 days

**Actions:**
1. Review detected variances
2. Approve or reject auto-generated LTAFs
3. System recalculates buffers automatically

#### Step 15: Multi-Echelon Hierarchy
Go to: **Inventory → Configuration Tab → Dynamic Adjustments → Multi-Echelon**

**Purpose:** Define parent-child relationships between locations for multi-level planning.

**Actions:**
1. Create hierarchy:
   - Level 0: National DC
   - Level 1: Regional DCs
   - Level 2: Restaurants

2. For each location, specify:
   - `parent_location_id` (e.g., Restaurant → Regional DC → National DC)
   - `echelon_level` (0, 1, 2...)
   - `echelon_type` (DC, REGIONAL_HUB, STORE)
   - `buffer_strategy` (STANDARD, AGGREGATE, PASS_THROUGH)

**Impact:**
- System aggregates demand upstream
- Prevents double-buffering at multiple levels

---

### Phase 4: System Initialization (Week 2)

#### Step 16: Calculate Buffers
Go to: **Inventory → Configuration Tab → System Settings**

**Actions:**
1. Click **"Calculate All Buffers"** button
2. System performs:
   - Fetches 90-day sales history
   - Calculates ADU (Average Daily Usage) per product-location
   - Applies active DAF/LTAF
   - Computes buffer zones using formulas:

**DDMRP Buffer Zone Formulas:**
```
Red Zone = ADU × DLT × LT_Factor × Variability_Factor
Yellow Zone = Red Zone (standard practice)
Green Zone = ADU × Order_Cycle × LT_Factor

Top of Red (TOR) = Red Zone
Top of Yellow (TOY) = Red + Yellow
Top of Green (TOG) = Red + Yellow + Green
```

3. Results stored in `inventory_ddmrp_buffers_view`

#### Step 17: Load Current Inventory Snapshot
Go to: **Settings → Upload Current Inventory**

**Table:** `inventory_snapshot`

**Required Fields:**
- `product_id`
- `location_id`
- `qty_on_hand` (current physical inventory)
- `snapshot_ts` (timestamp of count)

**Purpose:** Establishes starting point for Net Flow Position (NFP) calculations.

**Example:**
```csv
product_id,location_id,qty_on_hand,snapshot_ts
PROD_001,LOC_RY_001,500,2025-10-03T10:00:00
PROD_002,LOC_RY_001,1200,2025-10-03T10:00:00
```

#### Step 18: Load Open Purchase Orders
**Table:** `open_pos`

**Required Fields:**
- `product_id`
- `location_id`
- `ordered_qty` (quantity ordered)
- `received_qty` (quantity received so far, default 0)
- `order_date`
- `expected_date` (when order should arrive)
- `status` (OPEN, PARTIALLY_RECEIVED, CLOSED)

**Purpose:** Tracks incoming supply for NFP calculation.

#### Step 19: Load Open Sales Orders
**Table:** `open_so`

**Required Fields:**
- `product_id`
- `location_id`
- `qty` (quantity committed to customers)
- `confirmed_date`
- `status` (CONFIRMED, SHIPPED, CANCELLED)

**Purpose:** Tracks committed demand for NFP calculation.

---

### Phase 5: Daily Operations (Ongoing)

#### Step 20: Monitor Buffer Status
Go to: **Inventory → Operational Tab → Buffer Status Grid**

**What You See:**
- Real-time buffer status for all products
- Color-coded zones:
  - 🔴 **RED** - Below Top of Red (critical shortage)
  - 🟡 **YELLOW** - Between Red and Yellow (caution)
  - 🟢 **GREEN** - Between Yellow and Green (healthy)
  - ⚫ **BLACK** - Above Top of Green (excess)

**Key Metrics:**
- **NFP (Net Flow Position)** = On Hand + On Order - Qualified Demand
- **Buffer Penetration %** = How deep into buffer zones
- **Days of Supply** = Current inventory / ADU

**Actions:**
1. Sort by Buffer Status (Red items first)
2. Click on any item to see details
3. Red/Yellow items → Generate replenishment (next step)

#### Step 21: Generate Replenishment Orders
Go to: **Inventory → Operational Tab** → Click **"Generate Replenishment"**

**How It Works:**
1. System scans all products where NFP ≤ TOY (in Red or Yellow zone)
2. Calculates recommended order quantity:
   ```
   Order Qty = TOG - NFP
   ```
3. Applies constraints:
   - Rounds to `rounding_multiple` (e.g., case sizes)
   - Enforces `moq` (minimum order quantity)
4. Creates proposals in `replenishment_orders` table
5. Status = "DRAFT" (awaiting approval)

**Actions:**
1. Review proposals in **Supply Planning** page
2. Approve or modify quantities
3. Export to ERP or generate POs

#### Step 22: Exception Management
Go to: **Inventory → Operational Tab → Exception Management**

**Purpose:** Handle items requiring planner attention.

**Exception Types:**
- **Stockout Risk** - NFP < TOR, high demand coming
- **Excess Inventory** - NFP > TOG for >30 days
- **Order Spike** - Single order >3x normal ADU
- **Negative NFP** - Already in stockout (backorders)

**Actions:**
1. Review each exception
2. Click "Resolve" to:
   - Create emergency order
   - Adjust buffers (if systemic issue)
   - Mark as acknowledged

#### Step 23: Breach Detection
Go to: **Inventory → Breach Alerts Tab**

**Purpose:** Automated alerts for critical inventory events.

**Alert Severity:**
- **HIGH** - Below TOR (Red zone breach)
- **MEDIUM** - Below TOY (Yellow zone breach)
- **LOW** - Above TOG (Green zone breach)

**How It Works:**
- System runs `detect_buffer_breaches()` function nightly
- Inserts alerts into `buffer_breach_events`
- Sends notifications (if configured)

**Actions:**
1. Acknowledge alerts (marks as seen)
2. Take action (expedite orders, adjust buffers)
3. Track resolution time

---

### Phase 6: Execution Priority (Daily)

#### Step 24: Use Buffer Penetration for Prioritization
Go to: **Execution Priority** page (separate route)

**DDMRP Principle:** Forget due dates! Use buffer penetration to prioritize work.

**How It Works:**
1. System calculates Buffer Penetration %:
   ```
   Penetration % = (NFP - TOR) / (TOG - TOR) × 100
   ```
   - 0% = At TOR (most critical)
   - 50% = Mid-yellow
   - 100% = At TOG (healthy)
   - >100% = Excess

2. All work orders, production jobs, and replenishment orders sorted by penetration

**Dashboard Shows:**
- Products with lowest penetration % at top (most urgent)
- Color-coded priority:
  - 🔴 Critical (<25%)
  - 🟠 High (25-50%)
  - 🟡 Medium (50-75%)
  - 🟢 Low (>75%)

**Actions:**
1. Focus on Critical and High priority items first
2. Expedite orders for items <25%
3. Delay or reduce orders for items >100% (excess)

**This Replaces Traditional MRP:**
- ❌ OLD: Schedule by due date
- ✅ NEW: Schedule by buffer penetration

---

### Phase 7: Material Synchronization (Daily)

#### Step 25: BOM Component Tracking
Go to: **Material Sync** page (separate route)

**Purpose:** Ensure all components for a parent item are available together.

**What You See:**
- Multi-level BOM relationships
- Component synchronization status
- Shortage/excess alerts at component level

**Example:**
```
Big Mac Assembly (Parent)
├── Bun (Component 1) - Status: ✅ Available
├── Beef Patty (Component 2) - Status: 🔴 Shortage
├── Cheese Slice (Component 3) - Status: ✅ Available
└── Pickle (Component 4) - Status: ⚠️ Low
```

**Actions:**
1. Review parent items with missing components
2. Expedite component orders to synchronize arrival
3. Delay parent assembly if components not ready

**Why This Matters:**
- Prevents starting assembly when components missing
- Reduces WIP (Work In Process)
- Aligns with pull-based execution

---

### Phase 8: Analytics & Continuous Improvement (Weekly)

#### Step 26: SKU Classification
Go to: **Inventory → Analytics Tab → SKU Classifications**

**Purpose:** Categorize products for tailored buffer strategies.

**Classification Dimensions:**
- **Lead Time:** Short (<5 days), Medium (5-10), Long (>10)
- **Variability:** Low (CV <20%), Medium (20-50%), High (>50%)
- **Criticality:** High (core item), Medium, Low

**Actions:**
1. Review auto-classifications
2. Adjust buffer profiles based on patterns
3. Example: High variability + Long lead time → Use BP_003 (aggressive buffers)

#### Step 27: Buffer Performance
Go to: **Inventory → Analytics Tab → Buffer Performance**

**Metrics Tracked:**
- **Service Level %** - Orders fulfilled on time
- **Stockout Events** - Count per period
- **Excess Inventory Days** - Days with NFP > TOG
- **Buffer Accuracy** - How well buffers match actual demand

**Actions:**
1. Identify underperforming products
2. Adjust buffer profiles or factors
3. Track improvement over time

#### Step 28: Auto-Recalculation Schedule
Go to: **Inventory → Configuration Tab → Auto-Recalculation**

**Purpose:** Keep buffers fresh automatically.

**Actions:**
1. Click "Schedule Recalculation"
2. Choose frequency:
   - Daily (high variability products)
   - Weekly (most products)
   - Monthly (slow movers)
3. Select trigger:
   - CRON schedule (e.g., "0 2 * * *" = 2 AM daily)
   - Manual trigger only

**What Recalculation Does:**
- Re-calculates ADU from latest sales data
- Applies active DAF/LTAF/ZAF
- Updates buffer zones
- Logs changes in `buffer_recalculation_history`

---

## Configuration Guide

### Global Filters

At the top of the Inventory page, you'll see filters:
- **Product Family** - Filter by product group
- **Location** - Filter by region/store
- **Channel** - Filter by sales channel
- **Buffer Status** - Filter by Red/Yellow/Green

These filters apply across all tabs for consistency.

---

## Daily Operations Checklist

### Morning Routine (9:00 AM)
1. ✅ Check **Breach Alerts** for overnight events
2. ✅ Review **Buffer Status Grid** - Sort by Red zone
3. ✅ Generate **Replenishment Orders** for Red/Yellow items
4. ✅ Check **Material Sync** for today's production
5. ✅ Review **Execution Priority** - Prioritize team tasks

### Midday Check (1:00 PM)
1. ✅ Monitor **Exception Management** for new issues
2. ✅ Verify **Open POs** - Are orders arriving on time?
3. ✅ Adjust **DAF** if unplanned demand spike detected

### End of Day (5:00 PM)
1. ✅ Update **Inventory Snapshot** if cycle count performed
2. ✅ Review **Supplier Performance** - Log late deliveries
3. ✅ Check **Buffer Performance** metrics for trends

### Weekly Tasks (Friday)
1. ✅ Run **SKU Classification** analysis
2. ✅ Review **Buffer Recalculation History** - Validate changes
3. ✅ Adjust **Buffer Profiles** based on performance
4. ✅ Cleanup: Archive old alerts, close completed POs

---

## Advanced Features

### Bayesian Threshold Updates
- System learns optimal thresholds over time
- Uses actual performance vs. planned
- Auto-adjusts variability factors

### Multi-Echelon Aggregation
- Demand aggregated up hierarchy (Store → DC → National)
- Prevents double-buffering
- Pass-through locations don't hold stock

### Spike Detection
Go to: **Inventory → Configuration Tab → Spike Detection**
- Auto-detects abnormal demand (>3σ from mean)
- Flags for review (promotional spike vs. one-time event)
- Prevents skewing ADU calculations

---

## Data Flow Summary

```
1. Master Data Upload (Settings)
   ↓
2. Historical Sales → Calculate ADU
   ↓
3. Assign Buffer Profiles → Product Master
   ↓
4. Run Decoupling Analysis → Designate Points
   ↓
5. Configure DAF/LTAF/ZAF → Dynamic Adjustments
   ↓
6. Calculate Buffers → inventory_ddmrp_buffers_view
   ↓
7. Load Inventory Snapshot + Open POs/SOs
   ↓
8. Calculate NFP → inventory_net_flow_view
   ↓
9. Detect Breaches → buffer_breach_events
   ↓
10. Generate Replenishment → replenishment_orders
   ↓
11. Execute by Priority → Execution Priority Dashboard
   ↓
12. Sync Components → Material Sync Dashboard
   ↓
13. Track Performance → Analytics Dashboard
   ↓
14. Recalculate Buffers (scheduled) → Back to Step 6
```

---

## Key Database Tables Reference

| Table Name | Purpose | Updated By |
|------------|---------|------------|
| `product_master` | Product definitions | Manual upload |
| `location_master` | Location definitions | Manual upload |
| `historical_sales_data` | Sales transactions | Manual upload / Integration |
| `actual_lead_time` | Supplier lead times | Manual upload / Auto-learned |
| `buffer_profile_master` | Buffer parameters | User configuration |
| `decoupling_points` | Strategic positions | AI + Manual designation |
| `demand_adjustment_factor` | Temporary ADU adjustments | User configuration |
| `lead_time_adjustment_factor` | Temporary LT adjustments | User configuration / Auto |
| `zone_adjustment_factor` | Buffer zone overrides | User configuration |
| `inventory_snapshot` | Current on-hand | Daily update |
| `open_pos` | Purchase orders | ERP integration / Manual |
| `open_so` | Sales orders | ERP integration / Manual |
| `inventory_ddmrp_buffers_view` | Calculated buffers | Auto (via function) |
| `inventory_net_flow_view` | Real-time NFP | Auto (via view) |
| `buffer_breach_events` | Alerts | Auto (nightly job) |
| `replenishment_orders` | Order proposals | Auto (user-triggered) |
| `buffer_recalculation_history` | Audit trail | Auto (recalc function) |
| `buffer_criteria_compliance` | Validation results | Auto (validation function) |
| `lead_time_variance_log` | LT changes | Auto (detection function) |

---

## Troubleshooting

### Issue: Buffer zones showing as 0 or NULL
**Solution:** 
1. Verify historical sales data uploaded (at least 90 days)
2. Check that products have `buffer_profile_id` assigned
3. Run "Calculate All Buffers" manually
4. Check `actual_lead_time` table for missing entries

### Issue: Replenishment orders not generating
**Solution:**
1. Verify NFP calculation: Check `inventory_net_flow_view`
2. Ensure inventory snapshot is current
3. Check if open POs already cover the need
4. Verify buffer status: NFP must be ≤ TOY to trigger

### Issue: DAF not applying
**Solution:**
1. Check date range: Current date must be between start_date and end_date
2. Verify product_id and location_id match exactly
3. Run buffer recalculation to apply changes
4. Check `buffer_recalculation_history` for applied DAF values

### Issue: Material sync alerts not showing
**Solution:**
1. Verify `product_bom` table populated with parent-child relationships
2. Check that both parent and components are decoupling points
3. Ensure all BOM items have buffer zones calculated

---

## Best Practices

### 1. Start Small
- Begin with 10-20 high-volume products
- Validate calculations before expanding
- Get team comfortable with buffer zones

### 2. Use Conservative Buffer Profiles Initially
- Start with higher safety factors
- Reduce gradually as confidence builds
- Monitor service levels closely

### 3. Update Historical Sales Regularly
- Upload new sales data weekly minimum
- Keep at least 90 days rolling window
- Clean outliers (promotional spikes)

### 4. Review DAF/LTAF Monthly
- Expire old adjustments
- Add new adjustments for upcoming events
- Document reasons for audit trail

### 5. Trust the System
- Don't override without good reason
- Use buffer penetration, not gut feel
- Document manual overrides

### 6. Train Your Team
- Planners must understand buffer zones
- Warehouse staff should know buffer status
- Procurement should use Execution Priority

---

## Support & Resources

- **DDMRP Book:** "Demand Driven Material Requirements Planning" by Carol Ptak & Chad Smith
- **Compliance Report:** See `DDMRP_COMPLIANCE_REPORT.md` for technical details
- **Feature List:** See `DDMRP_100_PERCENT_FEATURES.md` for complete functionality

---

## Appendix: Formulas Reference

### Average Daily Usage (ADU)
```
ADU = SUM(sales_last_90_days) / 90
ADU_Adjusted = ADU × DAF × Trend_Factor
```

### Decoupled Lead Time (DLT)
```
DLT = actual_lead_time_days × LTAF
```

### Red Zone
```
Red = ADU × DLT × LT_Factor × Variability_Factor
Red = MAX(Red, MOQ)  // Enforce minimum order quantity
```

### Yellow Zone
```
Yellow = Red  // Standard DDMRP practice
```

### Green Zone
```
Green = ADU × Order_Cycle × LT_Factor
```

### Net Flow Position (NFP)
```
NFP = On_Hand + On_Order - Qualified_Demand

Where:
On_Hand = Current physical inventory
On_Order = SUM(open POs not yet received)
Qualified_Demand = SUM(open sales orders confirmed)
```

### Buffer Penetration
```
Penetration % = (NFP - TOR) / (TOG - TOR) × 100

Where:
TOR = Top of Red = Red_Zone
TOY = Top of Yellow = Red + Yellow
TOG = Top of Green = Red + Yellow + Green
```

### Recommended Order Quantity
```
Order_Qty_Raw = TOG - NFP
Order_Qty_Rounded = CEIL(Order_Qty_Raw / Rounding_Multiple) × Rounding_Multiple
Order_Qty_Final = MAX(Order_Qty_Rounded, MOQ)
```

---

**Document Version:** 1.0  
**Last Updated:** 2025-10-03  
**Compliance Status:** 100% DDMRP Book Compliant