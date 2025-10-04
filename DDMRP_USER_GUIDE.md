# DDMRP Inventory Management Tool - Complete Beginner's Guide

## 📚 Table of Contents
1. [What is This Tool & Why Use It?](#what-is-this-tool--why-use-it)
2. [Key Terminology & Glossary](#key-terminology--glossary)
3. [Financial Impact & KPIs](#financial-impact--kpis)
4. [First Time Setup - Complete Walkthrough](#first-time-setup---complete-walkthrough)
5. [Understanding Every Screen](#understanding-every-screen)
6. [Complete Step-by-Step Workflow](#complete-step-by-step-workflow)
7. [Multi-Echelon Buffer Positioning](#multi-echelon-buffer-positioning)
8. [Dynamic Adjustments - Real Examples](#dynamic-adjustments---real-examples)
9. [ERP Integration & Data Flow](#erp-integration--data-flow)
10. [Daily Operations - What to Do Every Day](#daily-operations---what-to-do-every-day)
11. [Understanding What You See](#understanding-what-you-see)
12. [Common Questions & Troubleshooting](#common-questions--troubleshooting)

---

## What is This Tool & Why Use It?

### The Problem This Solves
Traditional inventory management asks: *"How much will we sell next month?"* (forecasting)

DDMRP asks a better question: *"What do we need to protect our operations TODAY?"*

### What Makes This Different?
Instead of guessing future demand and ordering based on forecasts, this tool:
1. **Positions inventory strategically** where it matters most
2. **Adjusts automatically** when market conditions change
3. **Shows you exactly** what to order and when, ranked by priority
4. **Prevents both** stockouts AND excess inventory

### Who Should Use This?
- **Supply Chain Managers** - Plan inventory strategy
- **Inventory Planners** - Execute daily replenishment orders
- **Warehouse Managers** - Monitor stock levels and breaches
- **Procurement Teams** - Create and track purchase orders
- **CFOs/Finance Teams** - Track working capital reduction
- **Analysts** - Review performance metrics

---

## Key Terminology & Glossary

### 🔑 Essential Terms You MUST Understand

**CRITICAL DISTINCTION: Actual Lead Time vs Decoupled Lead Time**

| Term | Abbreviation | Definition | Used For | Example |
|------|--------------|------------|----------|---------|
| **Actual Lead Time** | ALT | The **real-world** time from placing an order to receiving it | Baseline data entry | Supplier promises 5 days |
| **Decoupled Lead Time** | DLT | The **adjusted** lead time used in buffer calculations<br/>**Formula: DLT = ALT × LTAF** | Buffer zone calculations | ALT 5 days × LTAF 1.4 = **DLT 7 days** |
| **Lead Time Adjustment Factor** | LTAF | Multiplier to adjust lead times temporarily | Dynamic adjustments | Port congestion: LTAF = 1.5<br/>Express shipping: LTAF = 0.6 |

**⚠️ REMEMBER:** Always enter **Actual Lead Time** in the database. The system automatically calculates **DLT** by applying any active LTAF.

---

### Buffer Zone Terms

| Term | What It Means | Visual Color | When to Order |
|------|--------------|--------------|---------------|
| **Green Zone** | Comfortable excess inventory | 🟢 Green | No action needed |
| **Yellow Zone** | Normal operating range | 🟡 Yellow | Consider ordering |
| **Red Zone** | Safety stock (protection against stockouts) | 🔴 Red | **ORDER NOW!** |
| **TOR** (Top of Red) | Threshold where you enter danger zone | Red line | First alert |
| **TOY** (Top of Yellow) | Target inventory level after replenishment | Yellow line | Order trigger |
| **TOG** (Top of Green) | Maximum buffer level | Green line | Stop ordering |

---

### Demand & Supply Terms

| Term | Full Name | What It Calculates | Formula |
|------|-----------|-------------------|---------|
| **ADU** | Average Daily Usage | How much you sell per day on average | Sum(90 days sales) ÷ 90 |
| **ADU Adjusted** | Adjusted ADU | ADU with promotions/trends applied | ADU × DAF × Trend Factor |
| **DAF** | Demand Adjustment Factor | Temporary demand multiplier | Ramadan: DAF = 1.8 (+80%) |
| **NFP** | Net Flow Position | Current available inventory position | On Hand + On Order - Qualified Demand |
| **Buffer Penetration** | How deep into buffer you've consumed | Shows urgency % | (TOG - NFP) ÷ TOG × 100% |

---

### Planning & Execution Terms

| Term | Definition | Example |
|------|------------|---------|
| **Decoupling Point** | Strategic position where you hold buffer inventory | Riyadh DC (not each store) |
| **Qualified Demand** | Confirmed orders that must be fulfilled | Open sales orders |
| **On Order** | Purchase orders placed but not yet received | 500 units arriving Friday |
| **MOQ** | Minimum Order Quantity (supplier requirement) | Must order at least 100 units |
| **Rounding Multiple** | Order in multiples (cases, pallets) | Order in cases of 24 |

---

## Financial Impact & KPIs

### 💰 Why Executives Should Care

Traditional inventory management focuses on **service level** (% of orders filled). DDMRP focuses on **return on investment** by reducing working capital while maintaining/improving service.

---

### Key Financial Metrics

#### 1. **Working Capital Reduction**

**What It Measures:** Cash freed up from inventory reduction

**Visual in Dashboard:**
```
┌─────────────────────────────────────────┐
│ 💵 Working Capital Impact               │
├─────────────────────────────────────────┤
│ Before DDMRP: $2,450,000               │
│ After DDMRP:  $1,820,000               │
│ Cash Released: $630,000 (25.7% ↓)      │
│                                         │
│ Opportunity Cost Avoided: $63,000/year │
│ (10% cost of capital)                  │
└─────────────────────────────────────────┘
```

**How It's Calculated:**
```
Average Inventory Value = Σ(On Hand × Unit Cost) across all products
Working Capital Freed = Old Avg Inventory - New Avg Inventory
Annual Savings = Working Capital Freed × Cost of Capital %
```

---

#### 2. **Stockout Cost Avoided**

**What It Measures:** Revenue protected by preventing stockouts

**Visual in Dashboard:**
```
┌─────────────────────────────────────────┐
│ 🚫 Stockout Prevention                  │
├─────────────────────────────────────────┤
│ Potential Stockouts Prevented: 43       │
│ Average Lost Sale per Stockout: $1,850 │
│ Total Revenue Protected: $79,550        │
│                                         │
│ Customer Satisfaction Score: 96.2%      │
│ (Target: >95%)                          │
└─────────────────────────────────────────┘
```

**Formula:**
```
Stockout Cost = # Breaches Prevented × Avg Order Value × (1 + Lost Customer %)
```

---

#### 3. **Inventory Turnover Improvement**

**What It Measures:** How efficiently inventory converts to sales

**Visual in Dashboard:**
```
┌─────────────────────────────────────────┐
│ 🔄 Inventory Turnover                   │
├─────────────────────────────────────────┤
│ Before: 8.2 turns/year                  │
│ After:  12.4 turns/year                 │
│ Improvement: +51.2%                     │
│                                         │
│ Days of Inventory:                      │
│ Before: 44.5 days                       │
│ After:  29.4 days                       │
│ Improvement: -15.1 days                 │
└─────────────────────────────────────────┘
```

**Formula:**
```
Inventory Turnover = Annual COGS ÷ Average Inventory Value
Days of Inventory = 365 ÷ Inventory Turnover
```

---

#### 4. **Obsolescence Reduction**

**What It Measures:** Write-offs avoided due to expired/obsolete stock

**Visual in Dashboard:**
```
┌─────────────────────────────────────────┐
│ 🗑️ Obsolescence Prevention              │
├─────────────────────────────────────────┤
│ Products at Risk (>80% shelf life): 3   │
│ Est. Obsolescence Cost: $12,400         │
│                                         │
│ Last Quarter Write-Offs:               │
│ Before DDMRP: $87,200                   │
│ After DDMRP:  $18,500 (-78.8%)          │
└─────────────────────────────────────────┘
```

---

#### 5. **Holding Cost Savings**

**What It Measures:** Reduced warehouse, insurance, and opportunity costs

**Visual in Dashboard:**
```
┌─────────────────────────────────────────┐
│ 🏭 Annual Holding Cost Savings          │
├─────────────────────────────────────────┤
│ Storage Cost Reduction:    $42,000     │
│ Insurance Premium Savings:  $8,500     │
│ Opportunity Cost Avoided:  $63,000     │
│ Obsolescence Prevention:   $68,700     │
│ ─────────────────────────────────────   │
│ Total Annual Savings:     $182,200     │
└─────────────────────────────────────────┘
```

---

### Executive Dashboard - What Leadership Sees

When executives log in, they see a **Financial Summary Card** on the main dashboard:

```
╔══════════════════════════════════════════════════════╗
║  📊 DDMRP Financial Impact Summary - Q1 2025        ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║  💵 Working Capital Released:        $630,000       ║
║  📈 Revenue Protected (Stockouts):    $79,550       ║
║  💸 Annual Holding Cost Savings:     $182,200       ║
║  🗑️ Obsolescence Reduction:          $68,700        ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║  🎯 Total Financial Benefit:         $960,450       ║
║                                                      ║
║  📊 Service Level: 96.2% (Target: 95%)              ║
║  🔄 Inventory Turns: 12.4 (Industry Avg: 8.5)       ║
║  ⏱️ Order Fill Rate: 98.7% (Target: 95%)            ║
║                                                      ║
╚══════════════════════════════════════════════════════╝
```

**How to Present to CFO:**

"By implementing DDMRP, we reduced inventory by 25.7% ($630K working capital freed), while **improving** service level from 92% to 96.2%. This translates to nearly $1M in annual financial benefit with better customer satisfaction."

---

## First Time Setup - Complete Walkthrough

### Before You Start - What You Need

Think of this system like building a house. Before you can live in it, you need to build the foundation. The foundation is your **master data**.

**Required Data Files (prepare these FIRST):**
1. ✅ **Product List** - What do you sell/use?
2. ✅ **Location List** - Where do you store/sell products?
3. ✅ **Vendor/Supplier List** - Who supplies your products?
4. ✅ **Historical Sales** - Past 90 days minimum (more is better)
5. ✅ **Product Prices** - How much does each product cost?
6. ✅ **Lead Times** - How long does each supplier take to deliver?

**Optional But Recommended:**
- Supplier performance history
- Storage requirements (frozen, chilled, ambient)
- Minimum order quantities (MOQs)
- Bill of materials (if you manufacture)

---

## Logging In for the First Time

### Step 1: Open the Application
1. Open your web browser (Chrome, Firefox, Safari, or Edge)
2. Navigate to the application URL (provided by your IT team)
3. You'll see a **login page** with two input fields

### Step 2: Enter Your Credentials
1. **Email Address Field** - Type your work email (e.g., `ahmed@company.com`)
2. **Password Field** - Enter your password (case-sensitive!)
3. Click the blue **"Sign In"** button

**What You'll See After Login:**
- You'll be taken to the **Dashboard** page
- At the top, you'll see your name and company logo
- On the left side, there's a navigation menu with these options:
  - 📊 Dashboard
  - 📦 Inventory
  - 🎯 Execution Priority
  - 🔄 Material Sync
  - 📝 Reports
  - ⚙️ Settings

---

## Understanding the Navigation

### The Left Sidebar - Your Command Center

Think of the left sidebar like the main menu of a restaurant - it shows you everything available.

**1. Dashboard (📊)**
- **What it shows:** Overall health of your inventory system
- **When to use it:** Daily, first thing in the morning
- **What you'll see:** 
  - Total products being managed
  - How many locations you have
  - Products in each buffer zone (Green/Yellow/Red)
  - Critical alerts
  - Financial metrics (inventory value, carrying costs)

**2. Inventory (📦) - YOUR MAIN WORKSPACE**
- **What it shows:** Detailed inventory planning and management
- **When to use it:** Throughout the day for planning and monitoring
- **What you'll see:** 7 different tabs (explained in detail below)

**3. Execution Priority (🎯)**
- **What it shows:** What to order RIGHT NOW, sorted by urgency
- **When to use it:** Every morning to plan your day
- **What you'll see:** Products sorted by "buffer penetration" (how deep into the buffer you've gone)

**4. Material Sync (🔄)**
- **What it shows:** Component shortages for manufactured items
- **When to use it:** If you have bills of materials (BOMs)
- **What you'll see:** Missing components that could stop production

**5. Reports (📝)**
- **What it shows:** Historical analysis and trends
- **When to use it:** Weekly/monthly reviews
- **What you'll see:** Performance charts, trend analysis, KPI reports

**6. Settings (⚙️) - START HERE ON DAY 1**
- **What it shows:** Data upload and system configuration
- **When to use it:** Initial setup, then whenever adding new products/locations
- **What you'll see:** Upload forms for all master data tables

---

## Your First Day - Complete Setup Walkthrough

### IMPORTANT: Do These Steps IN ORDER (Day 1-3)

Think of this like assembling furniture - if you skip steps, things won't work properly!

---

## Step-by-Step: Uploading Master Data (Settings Page)

### Getting to the Settings Page

1. Look at the **left sidebar menu**
2. Click on **⚙️ Settings** (usually at the bottom)
3. You'll see a page with multiple tabs at the top:
   - **Master Data** (start here)
   - **Hierarchy**
   - **Lead Time**
   - **Replenishment**
   - **Templates** (download sample files here!)

---

### BEFORE Uploading: Download Sample Templates

**👉 CLICK THIS FIRST: Settings → Templates Tab**

**What You'll See:**
- A list of buttons labeled "Download Template" for each data type
- These are Excel/CSV files showing EXACTLY what format you need

**Actions:**
1. Click **"Download Product Master Template"**
2. Open the file in Excel
3. You'll see column headers like:
   ```
   product_id | sku | name | category | subcategory | supplier_id | unit_of_measure
   ```
4. Replace the sample data with YOUR actual products
5. Save the file (keep it as CSV format)

**Repeat for all templates:**
- Product Master Template
- Location Master Template
- Vendor Master Template
- Historical Sales Template
- Product Pricing Template
- Lead Time Template

---

## Upload Sequence (MUST Follow This Order!)

### 📦 Step 1: Upload Products First

**Why First?** Everything else references products. No products = nothing else works.

**Navigation:**
1. Click **Settings** (left sidebar)
2. Click **Master Data** tab (top of page)
3. Look for the section titled **"Product Master Upload"**
4. You'll see a **dashed box** with text "Click to upload or drag file here"

**What to Upload:**
- **File:** Your completed product master CSV
- **Table Name:** `product_master`

**Required Columns Explained (what each means):**

| Column | What It Means | Example Value | Why It Matters |
|--------|---------------|---------------|----------------|
| `product_id` | Unique code for this product (like a serial number) | `PROD_001` | System uses this to link everything together |
| `sku` | Stock Keeping Unit (your internal product code) | `BUN-SESAME-001` | What you use in warehouse/POS |
| `name` | Product name (what humans call it) | `Sesame Seed Bun` | Shows on screens and reports |
| `category` | Main group | `Ingredients` | For filtering and analysis |
| `subcategory` | Subgroup | `Bakery` | More specific filtering |
| `supplier_id` | Who supplies this? | `SUP_001` | Links to vendor table (upload vendors first if possible) |
| `unit_of_measure` | How do you count it? | `EACH`, `KG`, `LITER` | For accurate calculations |
| `buffer_profile_id` | What buffer rules apply? | `BP_DEFAULT` | Start with default, customize later |

**Example Row:**
```csv
PROD_001,BUN-SESAME-001,Sesame Seed Bun,Ingredients,Bakery,SUP_001,EACH,BP_DEFAULT
```

**Actions:**
1. Click the **dashed upload box**
2. Select your product CSV file
3. Wait for upload (you'll see a progress bar)
4. ✅ **Success Message:** "Successfully uploaded 150 products"
5. ❌ **Error Message:** If you see errors, check:
   - File format is CSV (not Excel .xlsx)
   - No empty rows
   - All required columns present
   - No special characters in IDs

---

### 📍 Step 2: Upload Locations Second

**Why Second?** Products need to be stored somewhere. Locations define WHERE.

**Navigation:**
Same Settings page, scroll down to **"Location Master Upload"** section

**Required Columns Explained:**

| Column | What It Means | Example | Why It Matters |
|--------|---------------|---------|----------------|
| `location_id` | Unique location code | `LOC_RY_001` | System identifier |
| `region` | Geographic area | `Riyadh`, `Jeddah` | For regional analysis |
| `channel_id` | Type of channel | `DINE_IN`, `DRIVE_THRU`, `DELIVERY` | Different demand patterns |
| `location_type` | Physical type | `RESTAURANT`, `WAREHOUSE`, `DC` | Determines buffer strategy |
| `restaurant_number` | Your store number (optional) | `R001` | Links to your POS system |

**Example Row:**
```csv
LOC_RY_001,Riyadh,DINE_IN,RESTAURANT,R001
LOC_JD_DC,Jeddah,DC,WAREHOUSE,DC01
```

**What You'll See After Upload:**
- Confirmation message with count
- New locations appear in dropdown filters throughout the app

---

### 🏭 Step 3: Upload Vendors/Suppliers Third

**Why Third?** Products reference suppliers. Need suppliers loaded first.

**Navigation:**
Settings → Master Data → **"Vendor Master Upload"**

**Required Columns:**

| Column | Example | Purpose |
|--------|---------|---------|
| `vendor_id` | `SUP_001` | Unique supplier code |
| `vendor_code` | `BAKERY_SUPPLY_CO` | Your internal supplier code |
| `vendor_name` | `National Bakery Supplies` | Company name |
| `country` | `Saudi Arabia` | Location |
| `contact_email` | `orders@bakery.com` | For communication |
| `payment_terms` | `NET30`, `NET60` | Payment timing |

---

### 📊 Step 4: Upload Historical Sales (CRITICAL!)

**Why Critical?** This calculates Average Daily Usage (ADU) - the foundation of all buffers!

**Minimum Requirement:** 90 days of daily sales data
**Recommended:** 1 year for better seasonality detection

**Navigation:**
Settings → Master Data → **"Historical Sales Upload"**

**Required Columns Explained:**

| Column | What It Means | Example | Format |
|--------|---------------|---------|--------|
| `sales_id` | Unique transaction ID | `SALE_20250101_001` | Any unique text |
| `product_id` | What was sold? | `PROD_001` | Must match product_master |
| `location_id` | Where was it sold? | `LOC_RY_001` | Must match location_master |
| `sales_date` | When? | `2025-01-15` | YYYY-MM-DD format |
| `quantity_sold` | How many units? | `150` | Whole number |
| `revenue` | Sales value (optional) | `750.00` | Decimal number |

**CRITICAL:** Every product-location combination needs sales history!

**Example Data:**
```csv
SALE_001,PROD_001,LOC_RY_001,2025-01-01,150,750.00
SALE_002,PROD_001,LOC_RY_001,2025-01-02,145,725.00
SALE_003,PROD_001,LOC_RY_001,2025-01-03,160,800.00
```

**What Happens Behind the Scenes:**
1. System groups by product_id + location_id
2. Calculates average daily quantity over 90 days
3. This becomes your base ADU (Average Daily Usage)
4. ADU drives ALL buffer calculations

---

### 💰 Step 5: Upload Product Pricing

**Navigation:**
Settings → Master Data → **"Product Pricing Upload"**

**Columns:**
- `product_id` - Which product
- `price` - Unit cost
- `effective_date` - When this price started
- `currency` - Usually `SAR`

**Why It Matters:**
- Inventory valuation reports
- Holding cost calculations
- ROI analysis

---

### ⏱️ Step 6: Upload Lead Times (EXTREMELY IMPORTANT!)

**Why Important?** Lead time determines buffer sizes. Wrong lead time = wrong buffers!

**Navigation:**
Settings → Lead Time Tab → **"Upload Lead Time Data"**

**Columns:**

| Column | What It Means | Example | How to Determine |
|--------|---------------|---------|------------------|
| `product_id` | Which product | `PROD_001` | - |
| `location_id` | At which location | `LOC_RY_001` | - |
| `actual_lead_time_days` | Days from order to delivery | `7` | Ask your supplier! |

**Example:**
```csv
PROD_001,LOC_RY_001,3
PROD_002,LOC_RY_001,7
PROD_003,LOC_JD_DC,14
```

**How to Find Lead Time:**
1. **Check with supplier:** "If I order today, when will it arrive?"
2. **Look at past orders:** Average time from PO to receipt
3. **Include:** Order processing + manufacturing + shipping + receiving
4. **Don't Include:** Internal consumption time

**Common Lead Times:**
- Local supplier: 1-3 days
- Regional supplier: 5-10 days
- International: 30-60 days
- Made-to-order: 7-21 days

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

## Multi-Echelon Buffer Positioning - Concrete Examples

### 🏢 What is Multi-Echelon Buffering?

Think of it like a water distribution system:
- **Central reservoir** (National DC) - Large volume, slower replenishment
- **Regional tanks** (Regional DCs) - Medium volume, moderate speed
- **Household taps** (Stores) - Small volume, instant access

**The Goal:** Buffer where it makes most sense financially and operationally

---

### Real Example: Fast Food Chain in Saudi Arabia

#### Scenario: Big Mac Buns Distribution

**Product:** Sesame Seed Buns  
**ADU per Store:** 150 buns/day  
**Supplier Lead Time:** 14 days (imported from regional bakery)  
**Network:** 1 National DC → 3 Regional DCs → 50 Stores

---

### ❌ WRONG Approach: Buffer at Every Level (Double Buffering)

```
National DC Buffer:  7,500 buns (7 days × 150/store × 50 stores)
Regional DC Buffer:  2,500 buns each (7 days × 150/store × 17 stores avg)
Store Buffer:          750 buns each (5 days × 150/day)

Total Network Inventory: 57,500 buns
Working Capital Tied Up: $34,500 (@ $0.60/bun)
```

**Problems:**
- Massive excess inventory
- High obsolescence risk (buns have 7-day shelf life)
- Cash unnecessarily locked up

---

### ✅ CORRECT Approach: Strategic Positioning

**Buffer Positioning Decision Matrix:**

| Level | Buffer Size | Reasoning | Visual |
|-------|-------------|-----------|--------|
| **National DC** | 14 days supply<br/>(105,000 buns) | Covers supplier lead time<br/>Protects entire network | 🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢 |
| **Regional DC** | 3 days supply<br/>(7,650 buns each) | Covers transport time<br/>Aggregates regional demand | 🟡🟡🟡 |
| **Stores** | 1 day supply<br/>(150 buns each) | Minimum display stock<br/>No protection buffer | 🔴 |

**Calculation Example:**

```
National DC (Riyadh Central):
- Total Network ADU: 150 buns/store × 50 stores = 7,500 buns/day
- Supplier Lead Time: 14 days
- Buffer Zones:
  ├─ Red Zone:   7,500 × 14 × 0.5 × 0.25 = 13,125 buns
  ├─ Yellow Zone: 13,125 buns (= Red)
  └─ Green Zone:  7,500 × 7 × 0.5 = 26,250 buns
  Total Buffer (TOG): 52,500 buns

Regional DC (Riyadh East):
- Regional ADU: 150 × 17 stores = 2,550 buns/day
- DC-to-Store Lead Time: 1 day
- Buffer Zones:
  ├─ Red Zone:   2,550 × 1 × 0.5 × 0.25 = 319 buns
  ├─ Yellow Zone: 319 buns
  └─ Green Zone:  2,550 × 3 × 0.5 = 3,825 buns
  Total Buffer (TOG): 4,463 buns

Store (Al Olaya Branch):
- Store ADU: 150 buns/day
- Display Stock Only: 1 day
- Buffer Zones:
  ├─ Red Zone:   0 (no safety stock)
  ├─ Yellow Zone: 75 buns (half-day)
  └─ Green Zone:  75 buns (half-day)
  Total Buffer (TOG): 150 buns
```

**Total Network Inventory: 63,813 buns**  
**Working Capital: $38,288 (vs $57,500 with double buffering)**  
**Savings: $19,212 (33% reduction) while maintaining 98% service level**

---

### How System Prevents Double Buffering

**Configuration in System:**

```
Location: Riyadh East Regional DC
├─ parent_location_id: "NATIONAL_DC_RY"
├─ echelon_level: 1
├─ echelon_type: "REGIONAL_HUB"
└─ buffer_strategy: "AGGREGATE"

Location: Al Olaya Store
├─ parent_location_id: "REGIONAL_DC_RY_EAST"
├─ echelon_level: 2
├─ echelon_type: "STORE"
└─ buffer_strategy: "PASS_THROUGH" ← Key Setting!
```

**What `PASS_THROUGH` Means:**
- Store does NOT hold strategic buffer
- Orders replenish display stock only
- Regional DC absorbs demand variability
- System aggregates store demand to Regional DC level

---

### Visual: Multi-Echelon Network View

When you go to **Inventory → Strategic → Supply Chain Network**, you'll see:

```
                    🏭 National DC (Riyadh Central)
                    Buffer: 52,500 buns (14 days)
                    Status: 🟢 Green (85% of TOG)
                           |
        ┌──────────────────┼──────────────────┐
        │                  │                  │
    🏢 Regional DC      🏢 Regional DC     🏢 Regional DC
    (Riyadh East)      (Jeddah)           (Dammam)
    Buffer: 4,463      Buffer: 3,825       Buffer: 4,012
    Status: 🟡 Yellow  Status: 🟢 Green    Status: 🟡 Yellow
        │                  │                  │
    ┌───┼───┐          ┌───┼───┐          ┌───┼───┐
    🏪 🏪 🏪          🏪 🏪 🏪          🏪 🏪 🏪
    Stores (17)       Stores (18)         Stores (15)
    Min Stock Only    Min Stock Only      Min Stock Only
```

---

### When to Buffer at Each Level?

| Echelon | Buffer Here If... | Don't Buffer If... | Example |
|---------|-------------------|-------------------|---------|
| **National DC** | Long supplier lead time (>7 days)<br/>High demand volume<br/>Central sourcing | Short lead times<br/>Drop-ship model | Imported ingredients |
| **Regional DC** | Regional demand variability<br/>Transport complexity<br/>Local regulations | Direct store delivery<br/>Fresh/perishable items | Dry goods, frozen items |
| **Store** | Display requirements<br/>Extremely fast-moving items<br/>Customer-facing variety | Strategic DDMRP buffers<br/>Slow movers | Only display stock |

---

## Dynamic Adjustments - Real Examples (Expanded)

### 📈 Positive Scenarios (Demand/Supply Improvements)

#### Example 1: Supplier Express Shipping Promotion

**Scenario:**
Your bread supplier offers a 2-week promotion with free express airfreight (normally 7-day delivery becomes 3-day).

**Actions:**
```
Navigate to: Inventory → Configuration → Dynamic Adjustments → LTAF

Product: All Bread Products
Location: All Locations
Start Date: 2025-02-01
End Date: 2025-02-14
LTAF: 0.43 (3 days ÷ 7 days = 0.43)
Reason: "Supplier express airfreight promotion"
```

**Impact:**
```
BEFORE Promotion:
- Actual Lead Time: 7 days
- DLT (for buffers): 7 days
- Red Zone: 1,050 buns (150 ADU × 7 days × 0.5 × 0.25)
- Total Buffer (TOG): 4,725 buns

DURING Promotion (with LTAF = 0.43):
- Actual Lead Time: Still 7 days (in database)
- DLT (calculated): 7 × 0.43 = 3 days
- Red Zone: 450 buns (150 ADU × 3 days × 0.5 × 0.25)
- Total Buffer (TOG): 2,025 buns

Inventory Freed: 2,700 buns per location
Cash Freed: 2,700 × $0.60 = $1,620 per store × 50 stores = $81,000
```

**What You'll See:**
- Yellow "LTAF Active" badge on buffer status screen
- Tooltip shows: "Lead time temporarily reduced due to express shipping"
- Buffers automatically shrink for 2 weeks
- After Feb 14, LTAF expires → buffers return to normal

---

#### Example 2: New Local Supplier (Shorter Lead Time)

**Scenario:**
You switch from imported beef (21-day lead time) to local Saudi supplier (3-day lead time).

**Long-term Action (Permanent):**
```
Navigate to: Settings → Lead Time Upload

Update actual_lead_time table:
product_id: BEEF_PATTY_001
location_id: ALL_LOCATIONS
actual_lead_time_days: 3 (change from 21)
```

**Short-term Bridge (During Transition):**
```
Navigate to: Inventory → Configuration → LTAF

Add LTAF during 60-day transition period:
LTAF: 0.5 (gradual reduction)
Reason: "Supplier transition - testing local supplier reliability"
```

**Financial Impact:**
```
Old Buffer (21-day lead time):
- Red Zone: 3,150 units
- Total Buffer: 14,175 units
- Inventory Value: $113,400 (@ $8/patty)

New Buffer (3-day lead time):
- Red Zone: 450 units
- Total Buffer: 2,025 units
- Inventory Value: $16,200

Working Capital Released: $97,200 per location! 🎉
```

---

### 📉 Negative Scenarios (Demand Spikes, Supply Issues)

#### Example 3: Port Congestion (Supply Risk)

**Scenario:**
Red Sea shipping delays add 10 days to your 14-day seafood lead time.

**Actions:**
```
Navigate to: Inventory → Configuration → LTAF

Product: All Seafood Items
LTAF: 1.71 (24 days ÷ 14 days = 1.71)
Start Date: Immediate
End Date: 90 days (until port clears)
Reason: "Red Sea port congestion - confirmed by supplier"
```

**Impact:**
```
Buffer automatically increases:
- Old Red Zone: 2,100 units (14-day supply)
- New Red Zone: 3,591 units (24-day equivalent)
- Additional Safety Stock: +1,491 units

Prevents stockouts worth: 
$8,500/stockout × 12 prevented = $102,000 revenue protected
```

**System Alerts You'll See:**
```
┌─────────────────────────────────────────────┐
│ ⚠️ SUPPLY RISK ALERT                        │
├─────────────────────────────────────────────┤
│ Active LTAF detected for 15 products        │
│ Reason: Port congestion                     │
│                                             │
│ Recommendation:                             │
│ • Increase PO now (+1,491 units)            │
│ • Monitor supplier communication            │
│ • Review LTAF in 30 days                    │
└─────────────────────────────────────────────┘
```

---

#### Example 4: Marketing Campaign (Demand Spike)

**Scenario:**
National Day promotion: "Buy 1 Get 1 Free" on all sandwiches (expected +120% demand).

**Actions:**
```
Navigate to: Inventory → Configuration → DAF

Product: All Sandwich Ingredients
DAF: 2.2 (120% increase = ×2.2 multiplier)
Start Date: 2025-09-23 (National Day)
End Date: 2025-09-25 (3-day event)
Reason: "National Day BOGO promotion"
```

**Calculation:**
```
Normal ADU: 150 buns/day
Campaign ADU: 150 × 2.2 = 330 buns/day

Buffers adjust automatically:
- Old Red Zone: 525 buns
- New Red Zone (with DAF): 1,155 buns
- Pre-order recommendation: +630 buns BEFORE campaign starts

Revenue impact: Prevents stockouts during peak sales event
Campaign Sales: $45,000 (protected)
```

---

### ⚖️ Combined Adjustments (DAF + LTAF Together)

#### Example 5: Perfect Storm Scenario

**Scenario:**
Ramadan promotion (+80% demand) **AND** supplier factory maintenance (lead time doubles from 7 to 14 days).

**Actions:**
```
1. Add DAF:
   - DAF: 1.8 (Ramadan demand increase)
   - Duration: 30 days

2. Add LTAF:
   - LTAF: 2.0 (supplier maintenance)
   - Duration: 21 days
```

**Impact:**
```
Base Buffer:
- ADU: 150 buns/day
- Lead Time: 7 days
- Red Zone: 525 buns

With DAF ONLY (1.8):
- Adjusted ADU: 270 buns/day
- Red Zone: 945 buns

With LTAF ONLY (2.0):
- Adjusted DLT: 14 days
- Red Zone: 1,050 buns

With BOTH (DAF × LTAF):
- Adjusted ADU: 270 buns/day
- Adjusted DLT: 14 days
- Red Zone: 1,890 buns (+260% vs base!)

System Recommendation: Order 1,365 extra units IMMEDIATELY
Investment: $819
Revenue Protected: $12,500 (stockouts avoided)
ROI: 1,426% 🎯
```

**Visual on Screen:**
```
🟢🟡🔴 Buffer Status for PROD_BUN_001
├─ Base Red Zone: 525 units
├─ 📈 DAF Active (+80%): "Ramadan promotion"
├─ ⏱️ LTAF Active (×2.0): "Supplier maintenance"
└─ 🎯 Effective Red Zone: 1,890 units

Current NFP: 1,245 units
Status: 🟡 YELLOW (66% buffer penetration)
Action: ORDER NOW - Qty Recommended: 1,365 units
```

---

## ERP Integration & Data Flow

### 🔄 How DDMRP Connects to Your ERP System

This DDMRP system is designed to work **alongside** your existing ERP (SAP, Oracle, Microsoft Dynamics, etc.), not replace it.

**Division of Responsibilities:**

| System | Owns | Responsibilities |
|--------|------|------------------|
| **Your ERP** | Master data<br/>Transactions<br/>Financial records | Product master<br/>Purchase orders<br/>Sales orders<br/>Inventory transactions<br/>Accounting |
| **DDMRP System** | Planning logic<br/>Buffer calculations<br/>Replenishment proposals | Calculate buffers<br/>Generate recommendations<br/>Monitor buffer health<br/>Alert on breaches |

**Think of it as:** ERP = Transaction System, DDMRP = Decision Support System

---

### Data Flow Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      YOUR ERP SYSTEM                     │
│  (SAP, Oracle, Dynamics, NetSuite, etc.)                │
└──────────┬──────────────────────────┬───────────────────┘
           │                          │
           │ INBOUND DATA             │ OUTBOUND DATA
           │ (Daily Extract)          │ (Replenishment Proposals)
           ▼                          ▼
┌──────────────────────────┐    ┌──────────────────────────┐
│  📥 ERP → DDMRP          │    │  📤 DDMRP → ERP          │
│                          │    │                          │
│  • Product Master        │    │  • Purchase Requisitions │
│  • Location Master       │    │  • Replenishment Orders  │
│  • Vendor Master         │    │  • Buffer Alerts         │
│  • Historical Sales      │    │  • Exception Reports     │
│  • Current Inventory     │    │                          │
│  • Open POs              │    │                          │
│  • Open Sales Orders     │    │                          │
│  • Lead Times            │    │                          │
└──────────────────────────┘    └──────────────────────────┘
           │                          │
           │                          │
           ▼                          ▼
┌─────────────────────────────────────────────────────────┐
│             🧠 DDMRP PLANNING ENGINE                     │
│                                                          │
│  • Calculate Buffers (ADU, DLT, Zones)                  │
│  • Monitor NFP (Net Flow Position)                      │
│  • Detect Breaches (Below TOY)                          │
│  • Generate Replenishment Recommendations               │
│  • Apply Dynamic Adjustments (DAF/LTAF/ZAF)             │
└─────────────────────────────────────────────────────────┘
```

---

### Integration Method 1: CSV/Excel Files (Manual)

**Best For:** Initial setup, small companies, proof of concept

**Daily Workflow:**

**Morning (8:00 AM):**
```
1. Export from ERP:
   ├─ File: inventory_snapshot_20250604.csv
   ├─ Format: product_id, location_id, qty_on_hand, snapshot_date
   └─ Upload to: DDMRP Settings → Master Data → Inventory Snapshot

2. Export open POs:
   ├─ File: open_pos_20250604.csv
   ├─ Format: product_id, location_id, ordered_qty, expected_date
   └─ Upload to: DDMRP Settings → Open Purchase Orders

3. Export sales orders:
   ├─ File: open_sos_20250604.csv
   ├─ Format: product_id, location_id, qty, confirmed_date
   └─ Upload to: DDMRP Settings → Open Sales Orders
```

**Evening (4:00 PM):**
```
4. Export from DDMRP:
   ├─ Navigate to: Execution Priority page
   ├─ Click: "Export Replenishment Proposals"
   ├─ File: replenishment_proposals_20250604.csv
   └─ Format: product_id, location_id, qty_recommend, target_due_date

5. Import to ERP:
   ├─ Convert proposals to Purchase Requisitions
   ├─ Review and approve in ERP
   └─ Generate POs from approved requisitions
```

**File Formats:**

**Export Format (DDMRP → ERP):**
```csv
product_id,sku,location_id,qty_recommend,priority_level,buffer_penetration_pct,reason,target_due_date,supplier_id,unit_cost,total_value
PROD_001,BUN-001,LOC_RY_001,1500,HIGH,78.5,"NFP below TOY",2025-06-07,SUP_001,0.60,900.00
PROD_002,BEEF-001,LOC_JD_002,250,MEDIUM,62.3,"NFP below TOY",2025-06-08,SUP_002,8.00,2000.00
```

---

### Integration Method 2: Database-to-Database (Semi-Automated)

**Best For:** Medium companies with IT resources

**Setup (One-Time):**
```sql
-- 1. Create database link from ERP to DDMRP
-- (Example for Oracle ERP to PostgreSQL DDMRP)

CREATE DATABASE LINK ddmrp_link
CONNECT TO ddmrp_user IDENTIFIED BY [password]
USING 'ddmrp_host:5432/ddmrp_db';

-- 2. Create scheduled job to sync data daily
CREATE OR REPLACE PROCEDURE sync_to_ddmrp IS
BEGIN
  -- Export inventory snapshot
  INSERT INTO ddmrp.inventory_snapshot@ddmrp_link
  SELECT product_id, location_id, qty_on_hand, SYSDATE
  FROM erp.inventory_balances
  WHERE snapshot_date = TRUNC(SYSDATE);
  
  -- Export open POs
  INSERT INTO ddmrp.open_pos@ddmrp_link
  SELECT product_id, location_id, ordered_qty, expected_receipt_date
  FROM erp.purchase_orders
  WHERE status = 'OPEN';
  
  COMMIT;
END;
```

**Reverse Sync (DDMRP → ERP):**
```sql
-- Import replenishment proposals from DDMRP
INSERT INTO erp.purchase_requisitions (
  req_number, product_id, location_id, qty, 
  requester, reason, due_date, status
)
SELECT 
  'REQ-' || TO_CHAR(SYSDATE, 'YYYYMMDD') || '-' || proposal_id,
  product_id,
  location_id,
  qty_recommend,
  'DDMRP_SYSTEM',
  reason,
  target_due_date,
  'PENDING_APPROVAL'
FROM ddmrp.replenishment_orders@ddmrp_link
WHERE proposal_ts >= TRUNC(SYSDATE)
AND status = 'DRAFT';
```

---

### Integration Method 3: REST API (Fully Automated)

**Best For:** Large enterprises, real-time integration

**DDMRP API Endpoints:**

```typescript
// 1. Push real-time sales data to DDMRP
POST /api/sales/transactions
Headers: { Authorization: "Bearer {api_key}" }
Body: {
  "sales": [
    {
      "transaction_id": "TXN_20250604_001",
      "product_id": "PROD_001",
      "location_id": "LOC_RY_001",
      "quantity_sold": 150,
      "transaction_date": "2025-06-04T14:30:00Z",
      "revenue": 750.00
    }
  ]
}

// 2. Get replenishment recommendations
GET /api/replenishment/recommendations
Query Params: ?location_id=LOC_RY_001&priority=HIGH
Response: {
  "recommendations": [
    {
      "product_id": "PROD_001",
      "sku": "BUN-001",
      "location_id": "LOC_RY_001",
      "qty_recommend": 1500,
      "priority": "HIGH",
      "buffer_penetration": 78.5,
      "reason": "NFP below TOY",
      "target_due_date": "2025-06-07",
      "supplier_id": "SUP_001",
      "unit_cost": 0.60,
      "total_value": 900.00
    }
  ]
}

// 3. Webhook for breach alerts
POST /api/webhooks/configure
Body: {
  "webhook_url": "https://your-erp.com/api/ddmrp/alerts",
  "events": ["buffer_breach", "stockout_risk"],
  "auth_token": "{your_token}"
}

// When breach occurs, DDMRP sends:
POST https://your-erp.com/api/ddmrp/alerts
Body: {
  "event_type": "buffer_breach",
  "timestamp": "2025-06-04T15:45:00Z",
  "product_id": "PROD_001",
  "location_id": "LOC_RY_001",
  "breach_type": "below_tor",
  "current_nfp": 245,
  "tor_threshold": 525,
  "severity": "HIGH",
  "recommended_action": "Order 1,280 units immediately"
}
```

---

### Real-Time POS Integration

**For Live Sales Data (Restaurant/Retail):**

```typescript
// Example: Integrate with POS system

// Option A: Webhook from POS to DDMRP
// POS sends transaction immediately after sale
POST https://ddmrp-system.com/api/sales/realtime
Body: {
  "register_id": "POS_RY_001_R1",
  "transaction_id": "TXN_123456",
  "items": [
    { "product_id": "PROD_001", "quantity": 2 },
    { "product_id": "PROD_015", "quantity": 1 }
  ],
  "timestamp": "2025-06-04T12:34:56Z"
}

// Option B: DDMRP polls POS API every 15 minutes
GET https://pos-system.com/api/sales/recent
Query: ?since=2025-06-04T12:00:00Z&location=LOC_RY_001
```

**Benefits of Real-Time POS Integration:**
- ✅ ADU updates continuously (vs daily batch)
- ✅ Faster breach detection
- ✅ Better demand sensing
- ✅ Automatic DAF suggestions based on trends

---

### Automated PO Creation Workflow

**Fully Automated Approval (for low-value items):**

```
┌────────────────────────────────────────────────────────┐
│ 1. DDMRP Detects Breach                                │
│    NFP falls below TOY → Generate recommendation       │
└─────────────────┬──────────────────────────────────────┘
                  │
                  ▼
┌────────────────────────────────────────────────────────┐
│ 2. Auto-Approval Rules Check                           │
│    ├─ Item Value < $500? ✓                             │
│    ├─ Supplier Reliability > 95%? ✓                    │
│    └─ Budget Available? ✓                              │
└─────────────────┬──────────────────────────────────────┘
                  │
                  ▼
┌────────────────────────────────────────────────────────┐
│ 3. Auto-Create PO in ERP                               │
│    ├─ PO Number: PO-20250604-001                       │
│    ├─ Supplier: SUP_001                                │
│    ├─ Quantity: 1,500 units                            │
│    ├─ Total Value: $900                                │
│    └─ Expected Delivery: 2025-06-07                    │
└─────────────────┬──────────────────────────────────────┘
                  │
                  ▼
┌────────────────────────────────────────────────────────┐
│ 4. Send PO to Supplier                                 │
│    ├─ Email: orders@supplier.com                       │
│    ├─ EDI: X12 850 Purchase Order                      │
│    └─ Portal: Upload to supplier web portal            │
└─────────────────┬──────────────────────────────────────┘
                  │
                  ▼
┌────────────────────────────────────────────────────────┐
│ 5. Update DDMRP On-Order Quantity                      │
│    ├─ Add 1,500 units to "On Order"                    │
│    ├─ NFP increases immediately                        │
│    └─ Buffer status changes: 🔴 Red → 🟡 Yellow        │
└────────────────────────────────────────────────────────┘
```

**Semi-Automated (for high-value items):**

Same flow, but adds approval step:

```
3a. Create PR (Purchase Requisition) instead of PO
     ↓
3b. Notify Procurement Manager via email/Slack
     ↓
3c. Manager reviews in ERP and approves
     ↓
3d. ERP converts PR to PO automatically
```

---

### EDI Integration (Electronic Data Interchange)

**For Large Suppliers:**

```
┌──────────────────────────────────────────────────────┐
│ DDMRP → Your ERP → EDI Gateway → Supplier           │
└──────────────────────────────────────────────────────┘

EDI Documents Supported:
├─ 850: Purchase Order (DDMRP replenishment → Supplier)
├─ 855: Purchase Order Acknowledgment (Supplier confirms)
├─ 856: Advance Ship Notice (Supplier ships goods)
└─ 810: Invoice (Supplier bills you)
```

**Example X12 850 PO (generated from DDMRP recommendation):**
```
ST*850*0001~
BEG*00*NE*PO-20250604-001**20250604~
REF*DP*DEPT-001~
DTM*002*20250607~  (Requested delivery date)
N1*ST*Riyadh Distribution Center~
N3*King Fahd Road~
N4*Riyadh**11564*SA~
PO1*1*1500*EA*0.60**VP*PROD_001*SK*BUN-001~  (Line item)
CTT*1~
SE*9*0001~
```

---

### Zapier Integration (No-Code Automation)

**For Small Teams:**

**Use Case:** Send Slack alert when critical buffer breach occurs

**Setup Steps:**

1. **In DDMRP System:**
   ```
   Navigate to: Settings → Integrations → Zapier Webhooks
   Click: "Generate Webhook URL"
   Copy URL: https://hooks.zapier.com/hooks/catch/123456/abcdef/
   ```

2. **Configure Trigger:**
   ```
   Trigger Event: "Buffer Breach Detected"
   Filter: breach_severity = "HIGH"
   Webhook URL: [paste from step 1]
   ```

3. **In Zapier:**
   ```
   Trigger: Webhook (Catch Hook)
   Action: Send Slack Message
   
   Message Template:
   🚨 URGENT: Stock Alert!
   
   Product: {{product_name}}
   Location: {{location_name}}
   Current Stock: {{current_nfp}} units
   Recommended Order: {{qty_recommend}} units
   Supplier: {{supplier_name}}
   
   👉 Action Required: Create PO immediately
   ```

**Result:** Procurement team gets instant Slack notification instead of checking dashboard

---

### Common Integration Patterns

#### Pattern 1: Morning Batch + Evening Proposal

```
Daily Schedule:
├─ 06:00 AM: ERP exports overnight sales → DDMRP imports
├─ 06:30 AM: DDMRP recalculates buffers
├─ 07:00 AM: Planners review Execution Priority screen
├─ 04:00 PM: DDMRP exports replenishment proposals
└─ 04:30 PM: ERP imports proposals → Procurement reviews
```

#### Pattern 2: Real-Time with Hourly Reconciliation

```
Continuous:
├─ POS sales stream to DDMRP every transaction
├─ DDMRP monitors NFP in real-time
└─ Alerts trigger immediately on breach

Hourly (top of each hour):
├─ Reconcile inventory with ERP
├─ Sync open POs/SOs
└─ Update buffer calculations
```

#### Pattern 3: Hybrid (Real-Time Sales + Daily Master Data)

```
Real-Time (24/7):
└─ POS sales → DDMRP → Instant NFP updates

Daily (Morning):
├─ Product master sync
├─ Vendor master sync
├─ Lead time updates
└─ Inventory reconciliation

Weekly (Sunday):
└─ Full historical sales reload (data quality check)
```

---

### Troubleshooting Integration Issues

**Problem:** "Replenishment proposals don't match ERP inventory"

**Solution:**
```
1. Check timestamp sync:
   - DDMRP uses: inventory_snapshot.snapshot_ts
   - ERP uses: inventory_balances.as_of_date
   - Must match exactly!

2. Verify units of measure:
   - DDMRP: "EACH"
   - ERP: "CS" (cases)
   - Convert: 1 CS = 24 EACH

3. Location ID mapping:
   - DDMRP: "LOC_RY_001"
   - ERP: "Site: 1001, Warehouse: WH01"
   - Create mapping table
```

---

**Problem:** "System recommends ordering but supplier already shipped"

**Solution:**
```
Enable real-time PO updates:

Supplier sends ASN (856 EDI):
↓
ERP receives and updates PO status
↓
ERP sends webhook to DDMRP:
POST /api/pos/update
{
  "po_id": "PO-123",
  "status": "IN_TRANSIT",
  "expected_arrival": "2025-06-06"
}
↓
DDMRP increases "On Order" immediately
↓
NFP recalculates → No duplicate recommendation
```

---

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