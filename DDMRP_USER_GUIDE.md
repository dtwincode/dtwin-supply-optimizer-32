# DDMRP Inventory Management Tool - Complete Beginner's Guide

---

## 🚀 START HERE: Choose Your Path

### 👋 **First Time User? Never Used DDMRP Before?**
**→ Go to [30-Minute Quick Start](#-30-minute-quick-start-your-first-success)** ⭐ **RECOMMENDED**

### 👤 **Know Your Role? Want Role-Specific Instructions?**
**→ Go to [Choose Your Role](#-choose-your-role-role-based-navigation)**

### 📖 **Want Complete Understanding? Have Time to Read?**
**→ Continue with [Full Guide](#-table-of-contents) below**

### 🎥 **Prefer Video? Visual Learner?**
**→ Go to [Video Tutorials](#-video-tutorials-for-visual-learners)**

### ❓ **Something Broken? Need Help?**
**→ Go to [Troubleshooting](#-troubleshooting--error-messages-guide)**

---

## 📚 Table of Contents

### 🚀 Getting Started (Read This First!)
1. [30-Minute Quick Start](#-30-minute-quick-start-your-first-success) ⭐ **START HERE**
2. [Choose Your Role](#-choose-your-role-role-based-navigation)
3. [Video Tutorials](#-video-tutorials-for-visual-learners)
4. [What is This Tool & Why Use It?](#what-is-this-tool--why-use-it)
5. [Before You Begin: Prerequisites](#-before-you-begin-prerequisites)

### 📖 Understanding DDMRP
6. [Key Terminology & Glossary](#key-terminology--glossary)
7. [Financial Impact & KPIs](#financial-impact--kpis)

### 🛠️ Setup & Configuration
8. [First Day Checklist](#-first-day-checklist-complete-before-go-live)
9. [Sample Data Examples](#-sample-data-real-working-examples)
10. [First Time Setup - Complete Walkthrough](#first-time-setup---complete-walkthrough)
11. [Understanding Every Screen](#understanding-every-screen)
12. [Complete Step-by-Step Workflow](#complete-step-by-step-workflow)

### 📊 Advanced Topics
13. [Multi-Echelon Buffer Positioning](#multi-echelon-buffer-positioning)
14. [Dynamic Adjustments - Real Examples](#dynamic-adjustments---real-examples)
15. [ERP Integration & Data Flow](#erp-integration--data-flow)

### 🎯 Daily Operations
16. [Daily Operations - What to Do Every Day](#daily-operations---what-to-do-every-day)
17. [Understanding What You See](#understanding-what-you-see)
18. [One-Page Quick Reference Card](#-one-page-quick-reference-card-print-this)

### ❌ Avoiding Problems
19. [Common Mistakes (DON'T Do These!)](#-common-mistakes-dont-do-these)
20. [Error Messages Guide](#-error-messages--solutions)
21. [Performance Benchmarks](#️-performance-benchmarks-is-my-system-normal)
22. [Common Questions & Troubleshooting](#common-questions--troubleshooting)

---

## ⚡ 30-Minute Quick Start: Your First Success

### 🎯 Goal
**See your first buffer calculation in 30 minutes or less, even if you've NEVER used DDMRP before.**

### ✅ What You Need RIGHT NOW (Gather These First!)

**Absolute Minimum:**
- ✅ **Product list** - Even just 5-10 products is enough to start
- ✅ **1 location** - Your main warehouse or store
- ✅ **Sales history** - 30 days minimum (90 days preferred)
- ✅ **Lead times** - How many days from order to delivery for each product

**Don't have 90 days of sales?** That's OK! Even 30 days works for learning.

**Don't have lead times?** Use estimates:
- Local supplier: 3-5 days
- Regional supplier: 7-10 days
- International: 14-21 days

---

### 📋 Quick Start Steps (30 Minutes Total)

#### ⏱️ Step 1: Download Templates (2 minutes)

**Actions:**
1. **Login** to the system
2. Click **"Settings"** in left sidebar
3. Click **"Templates"** tab at top
4. Download these 4 files:
   - 📄 Product Master Template
   - 📄 Location Master Template
   - 📄 Historical Sales Template
   - 📄 Lead Time Template

**What you'll get:** Excel/CSV files with column headers

---

#### ⏱️ Step 2: Fill Product Template (5 minutes)

**Open:** product_master_template.csv

**Fill in just 5 products to start:**

```csv
product_id,sku,name,category,subcategory,supplier_id,unit_of_measure,buffer_profile_id
PROD_001,COFFEE-ARB,Arabica Coffee Beans,Beverages,Coffee,SUP_01,KG,BP_DEFAULT
PROD_002,MILK-WHOLE,Whole Milk 1L,Dairy,Milk,SUP_02,LITER,BP_DEFAULT
PROD_003,CUP-12OZ,Paper Cups 12oz,Packaging,Cups,SUP_03,CASE,BP_DEFAULT
PROD_004,SUGAR-WHITE,White Sugar,Ingredients,Sweeteners,SUP_01,KG,BP_DEFAULT
PROD_005,TEA-GREEN,Green Tea Bags,Beverages,Tea,SUP_01,BOX,BP_DEFAULT
```

**💡 Tips:**
- `product_id` - Make it unique (PROD_001, PROD_002, etc.)
- `sku` - Your actual product code
- `buffer_profile_id` - Use "BP_DEFAULT" for now
- `supplier_id` - Make up codes (SUP_01, SUP_02, etc.)

**✅ Success Check:** 5 rows filled (plus header row = 6 total)

---

#### ⏱️ Step 3: Fill Location Template (3 minutes)

**Open:** location_master_template.csv

**Fill in 1 location:**

```csv
location_id,region,channel_id,location_type,restaurant_number
LOC_MAIN_01,Central,CH_RETAIL,Warehouse,WH001
```

**💡 Tips:**
- Use your actual warehouse or main store
- Keep it simple for first test

**✅ Success Check:** 1 location row filled

---

#### ⏱️ Step 4: Fill Sales History (7 minutes)

**Open:** historical_sales_template.csv

**Fill in 30 days of sales for your 5 products:**

```csv
sales_id,product_id,location_id,sales_date,quantity_sold,unit_price
SALE_001,PROD_001,LOC_MAIN_01,2025-09-04,25,15.50
SALE_002,PROD_001,LOC_MAIN_01,2025-09-05,28,15.50
SALE_003,PROD_001,LOC_MAIN_01,2025-09-06,22,15.50
...
```

**💡 Tips:**
- Need 30 rows per product (30 days × 5 products = 150 rows)
- Don't have exact data? **Estimate** is fine for testing:
  - Coffee: 20-30 kg/day
  - Milk: 40-60 liters/day
  - Cups: 5-10 cases/day

**🚀 Quick Fill Trick:**
1. Fill first 7 days manually
2. Copy those 7 rows
3. Paste and change dates to continue

**✅ Success Check:** At least 150 rows (30 days × 5 products)

---

#### ⏱️ Step 5: Fill Lead Times (2 minutes)

**Open:** lead_time_template.csv

**Fill lead times for your 5 products:**

```csv
product_id,location_id,actual_lead_time_days
PROD_001,LOC_MAIN_01,7
PROD_002,LOC_MAIN_01,3
PROD_003,LOC_MAIN_01,14
PROD_004,LOC_MAIN_01,7
PROD_005,LOC_MAIN_01,7
```

**💡 Tips:**
- Local suppliers: 3-5 days
- Regional: 7-10 days
- International: 14-30 days

**✅ Success Check:** 5 lead time rows

---

#### ⏱️ Step 6: Upload Products (2 minutes)

**Actions:**
1. Go to **Settings → Master Data**
2. Find **"Product Master Upload"** section
3. Click **"Choose File"** or drag your product CSV
4. Click **"Upload"**
5. Wait for ✅ green success message

**What you'll see:**
```
✅ Upload Successful!
5 products imported
0 errors
```

**✅ Success Check:** 
- Green success message
- No red errors
- Product count = 5

**❌ If you see errors:** Check your CSV for:
- Missing required columns
- Blank product_id values
- Special characters in names

---

#### ⏱️ Step 7: Upload Locations (1 minute)

**Actions:**
1. Stay in **Settings → Master Data**
2. Find **"Location Master Upload"** section
3. Upload your location CSV
4. Wait for success message

**✅ Success Check:** "1 location imported"

---

#### ⏱️ Step 8: Upload Sales History (2 minutes)

**Actions:**
1. Find **"Historical Sales Upload"** section
2. Upload your sales CSV
3. **This might take 30-60 seconds** (150 rows)

**✅ Success Check:** "150 sales records imported"

---

#### ⏱️ Step 9: Upload Lead Times (1 minute)

**Actions:**
1. Go to **Settings → Lead Time**
2. Upload lead time CSV

**✅ Success Check:** "5 lead time records imported"

---

#### ⏱️ Step 10: Set Decoupling Point (2 minutes)

**What is this?** Telling the system WHERE to hold inventory

**Actions:**
1. Go to **Inventory → Strategic → Decoupling Point Manager**
2. You'll see a table with your 5 products
3. Check the box next to **"Arabica Coffee Beans"** (your highest volume product)
4. Click **"Save Decoupling Points"**

**✅ Success Check:** 
- 1 product marked as decoupling point
- Green confirmation message

---

#### ⏱️ Step 11: Calculate Buffers! (3 minutes)

**🎉 The Magic Moment!**

**Actions:**
1. Go to **Inventory → Configuration → System Settings**
2. Scroll to **"Buffer Calculation"** section
3. Click big blue **"Calculate All Buffers Now"** button
4. Watch progress bar (30-60 seconds)

**What you'll see:**
```
🔄 Processing...
Calculating product 3 of 5 (60%)
Estimated time: 15 seconds...

✅ Calculation Complete!
5 products processed
5 buffer records created
```

**✅ Success Check:** Green success message, no errors

---

#### ⏱️ Step 12: View Your Results! (5 minutes)

**🎉 YOU DID IT! Now see what the system calculated:**

**Actions:**
1. Go to **Inventory → Operational → Buffer Status Grid**
2. You'll see your 5 products with colored zones!

**What you'll see:**
```
┌──────────────────────────────────────────────────────────┐
│  🥤 Arabica Coffee Beans - LOC_MAIN_01                   │
├──────────────────────────────────────────────────────────┤
│  Buffer Status: 🟢 Green Zone (if you uploaded current  │
│                     inventory, otherwise shows TBD)      │
│                                                          │
│  Buffer Zones Calculated:                                │
│  🔴 Red Zone:    0-180 kg                                │
│  🟡 Yellow Zone: 180-360 kg                              │
│  🟢 Green Zone:  360-1,260 kg                            │
│                                                          │
│  📈 ADU (Average Daily Usage): 25.7 kg/day               │
│  🚚 Lead Time: 7 days                                    │
│  📊 Current Stock: Not yet loaded (upload in Step 13)   │
└──────────────────────────────────────────────────────────┘
```

**✅ SUCCESS CRITERIA:**
- ✅ You see Red/Yellow/Green zones with numbers (not zeros)
- ✅ ADU shows a number (matches your sales average)
- ✅ Lead time shows correctly (7 days)
- ✅ All 5 products have buffers calculated

---

### 🎉 Congratulations! You've Completed Quick Start!

**What you accomplished in 30 minutes:**
- ✅ Uploaded master data
- ✅ Calculated DDMRP buffer zones
- ✅ Saw your first Red/Yellow/Green visualization
- ✅ System is now 50% configured!

**🚀 Next Steps:**
1. Upload current inventory (so system knows your starting point)
2. Add remaining products (when ready)
3. Read [Daily Operations](#daily-operations---what-to-do-every-day) to learn daily workflow

**❓ Questions?**
- "Where are my buffer zones?" → Inventory → Operational → Buffer Status Grid
- "ADU is zero?" → Check sales data uploaded correctly
- "Calculation failed?" → Check [Error Messages Guide](#-error-messages--solutions)

---

## 👤 Choose Your Role: Role-Based Navigation

### 👔 "I'm a CEO / CFO / Executive"

**What You Need:**
- **Daily:** Nothing (let your team handle it!)
- **Weekly:** 5-minute dashboard review
- **Monthly:** Financial impact review

**Your Quick Guide:**

**Step 1: View Financial Dashboard (2 minutes)**
```
Navigation: Dashboard (main page after login)

What you'll see:
┌────────────────────────────────────────────┐
│  💵 Working Capital Released: $630,000     │
│  📈 Service Level: 96.2% (Target: 95%)     │
│  💸 Annual Savings: $960,450               │
│  🔄 Inventory Turns: 12.4 (was 8.2)        │
└────────────────────────────────────────────┘
```

**Step 2: Review KPIs Monthly (5 minutes)**
- Go to **Reports → Financial Impact**
- Export executive summary PDF
- Share with board

**That's it! You're done.**

**What NOT to do:**
- ❌ Don't touch buffer calculations
- ❌ Don't modify product settings
- ❌ Don't approve individual purchase orders (delegate this)

**Delegate to:** Inventory Planners for daily operations

---

### 👨‍💼 "I'm an Inventory Planner / Supply Chain Manager"

**What You Need:**
- **Daily:** Execute replenishment orders, monitor alerts (20 min)
- **Weekly:** Review buffer performance, adjust DAF/LTAF (45 min)
- **Monthly:** Analyze trends, optimize buffers (2 hours)

**Your Daily Workflow:**

**Morning Routine (15 minutes):**
1. Go to **Execution Priority** page
2. Sort by Buffer Penetration (lowest first)
3. Items showing <25% = **ORDER TODAY**
4. Items 25-50% = **ORDER THIS WEEK**
5. Create purchase orders

**Your Key Pages:**
- **Execution Priority** - What to order (daily)
- **Buffer Status Grid** - Current inventory health (daily)
- **Breach Alerts** - Critical issues (check immediately)
- **Configuration → Dynamic Adjustments** - Add DAF/LTAF (weekly)
- **Reports → Buffer Performance** - Trend analysis (weekly)

**Read These Sections:**
- [Daily Operations](#daily-operations---what-to-do-every-day)
- [Dynamic Adjustments](#dynamic-adjustments---real-examples)
- [Complete Step-by-Step Workflow](#complete-step-by-step-workflow)

---

### 👷 "I'm a Warehouse Manager / Warehouse Worker"

**What You Need:**
- **Daily:** Check buffer status, count inventory (10 min)
- **Weekly:** Nothing extra
- **Monthly:** Nothing

**Your Simple Daily Workflow:**

**Check What's Critical (5 minutes):**
1. Go to **Inventory → Operational → Buffer Status Grid**
2. Look for 🔴 **RED items** at top
3. Tell your planner: "Product X is in RED zone"
4. That's it!

**Understanding the Colors:**
- 🔴 **RED** = Danger zone, might run out soon → Tell planner immediately
- 🟡 **YELLOW** = Getting low, will order soon → Monitor
- 🟢 **GREEN** = Healthy, plenty of stock → No worries
- ⚫ **BLACK** = Too much, stop receiving → Alert planner

**What NOT to do:**
- ❌ Don't calculate buffers (not your job)
- ❌ Don't create purchase orders (planner does this)
- ❌ Don't change system settings

**When to Alert Your Planner:**
- See 🔴 RED items
- Physical inventory count doesn't match system
- Received shipment but system not updated

---

### 🛒 "I'm a Procurement / Buyer"

**What You Need:**
- **Daily:** Execute approved purchase orders (15 min)
- **Weekly:** Review supplier performance (30 min)

**Your Daily Workflow:**

**Morning: Check What to Order (10 minutes):**
1. Go to **Execution Priority** page
2. Items at top = **MOST URGENT**
3. Click **"Create PO"** button for critical items
4. System shows recommended order quantity
5. Submit to supplier

**Weekly: Supplier Review (30 minutes):**
1. Go to **Inventory → Configuration → Supplier Performance**
2. Check on-time delivery %
3. Update lead times if supplier consistently late

**Your Key Metrics:**
- **On-Time Delivery Rate:** Target >95%
- **Lead Time Accuracy:** Actual vs promised
- **Quality Reject Rate:** Target <2%

**Read These Sections:**
- [Daily Operations](#daily-operations---what-to-do-every-day)
- [Execution Priority](#step-24-use-buffer-penetration-for-prioritization)

---

### 🔧 "I'm a System Administrator / IT"

**What You Need:**
- **Setup:** Configure system initially (4-8 hours)
- **Daily:** Monitor system health (5 min)
- **Monthly:** Database maintenance, backups

**Your Setup Checklist:**
- [ ] User accounts created
- [ ] Roles assigned (admin, planner, viewer)
- [ ] Data upload templates prepared
- [ ] Buffer profiles configured
- [ ] Automated calculation schedule set (weekly)
- [ ] Backup schedule configured
- [ ] Integration with ERP tested (if applicable)

**Daily Monitoring:**
1. Check **Settings → System Settings → Buffer Calculation** for last run status
2. Review error logs (if any)
3. Verify data sync from ERP (if integrated)

**Read These Sections:**
- [Complete Step-by-Step Workflow](#complete-step-by-step-workflow)
- [ERP Integration](#erp-integration--data-flow)
- [Performance Benchmarks](#️-performance-benchmarks-is-my-system-normal)

---

## 🎥 Video Tutorials (For Visual Learners)

### 📹 Getting Started Series

**Video 1: System Overview & First Login (5 min)**
- What is DDMRP and why use it?
- How to login
- Understanding the navigation menu
- Quick tour of main pages

**📌 Status:** Coming Soon - Watch this space!

---

**Video 2: Uploading Your First Data (12 min)**
- Download templates
- Fill in product master
- Upload products, locations, sales
- Verify successful upload
- Common upload errors

**📌 Status:** Coming Soon

---

**Video 3: Your First Buffer Calculation (8 min)**
- Setting decoupling points
- Running buffer calculation
- Understanding results
- Reading buffer zones

**📌 Status:** Coming Soon

---

### 📹 Daily Operations Series

**Video 4: Reading Buffer Status Grid (6 min)**
- Understanding Red/Yellow/Green zones
- What NFP means
- Buffer penetration explained
- When to take action

**📌 Status:** Coming Soon

---

**Video 5: Creating Replenishment Orders (10 min)**
- Using Execution Priority page
- Generating order proposals
- Reviewing and approving orders
- Exporting to ERP

**📌 Status:** Coming Soon

---

### 📹 Advanced Topics

**Video 6: Dynamic Adjustments (15 min)**
- When to use DAF (Demand Adjustment Factor)
- When to use LTAF (Lead Time Adjustment Factor)
- Real-world examples
- Best practices

**📌 Status:** Coming Soon

---

### 🎬 Prefer Reading?

No problem! This entire guide covers everything the videos will teach. Continue reading below for complete written instructions with screenshots and examples.

---

## 📋 Before You Begin: Prerequisites

### 🗂️ Data You MUST Gather First (Before Even Logging In)

Think of this like packing for a trip - gather everything BEFORE you start.

#### ✅ Required Data (Can't Start Without These)

**1. Product Master Data**
- **What you need:** List of ALL products you sell/use
- **Format:** Excel or CSV file
- **Required columns:**
  - Product ID (unique code)
  - SKU (your internal product code)
  - Product name
  - Category
  - Unit of measure (KG, LITER, EACH, CASE, etc.)
- **How to get it:** Export from your current system, or create from scratch
- **Minimum:** 10 products to start

**Example product list:**
```
Product 1: Arabica Coffee Beans, 25kg bags
Product 2: Whole Milk, 1 liter bottles
Product 3: Sugar, 50kg sacks
...
```

---

**2. Location Master Data**
- **What you need:** List of ALL warehouses, stores, DCs
- **Format:** Excel or CSV file
- **Required columns:**
  - Location ID (unique code)
  - Location name
  - Region
  - Location type (Warehouse, Store, DC)
- **Minimum:** 1 location to start

**Example:**
```
Location 1: Main Warehouse, Riyadh, Central Region
```

---

**3. Historical Sales Data**
- **What you need:** Past sales transactions
- **Time period:** Minimum 30 days, **90 days strongly recommended**
- **Format:** Excel or CSV file
- **Required columns:**
  - Product ID
  - Location ID
  - Date
  - Quantity sold
- **How to get it:** Export from POS system or accounting software

**Why 90 days?** System calculates Average Daily Usage (ADU) from this data. More data = more accurate.

**Don't have 90 days?** Use what you have:
- 30 days = OK for testing
- 60 days = Good
- 90 days = Best
- 180+ days = Excellent

---

**4. Supplier Lead Times**
- **What you need:** How long each supplier takes to deliver
- **Format:** Can be rough estimates initially
- **Required info:**
  - Product ID
  - Location ID
  - Lead time in days

**Don't know exact lead times?** Use these estimates:
- Local supplier: 3-5 days
- Regional supplier: 7-10 days
- National supplier: 10-14 days
- International: 14-30 days

**Pro tip:** You can update these later with actual data.

---

#### ⚠️ Optional But Recommended Data

**5. Current Inventory Levels (On-Hand)**
- **What:** How much you have right now
- **Why:** So system knows your starting point
- **Can start without?** Yes, but you won't see buffer status

**6. Open Purchase Orders**
- **What:** Orders you've placed but not yet received
- **Why:** Affects Net Flow Position calculation
- **Can start without?** Yes

**7. Open Sales Orders**
- **What:** Customer orders confirmed but not yet shipped
- **Why:** Shows committed demand
- **Can start without?** Yes

**8. Supplier Performance Data**
- **What:** Historical on-time delivery rates
- **Why:** Helps calculate safety stock more accurately
- **Can start without?** Yes, use default settings

---

### 🖥️ Technical Prerequisites

**Browser Requirements:**
- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ❌ Internet Explorer (not supported)

**Screen Resolution:**
- Minimum: 1280×720
- Recommended: 1920×1080 or higher

**Internet Connection:**
- Minimum: 2 Mbps
- Recommended: 10+ Mbps

**Excel or CSV Editor:**
- Microsoft Excel
- Google Sheets
- LibreOffice Calc
- Any CSV editor

---

### ✅ Pre-Launch Readiness Checklist

**Before contacting IT to provision your account, check these:**

- [ ] Product list prepared (minimum 10 products)
- [ ] At least 1 location defined
- [ ] Sales history collected (30-90 days)
- [ ] Lead times documented (even estimates OK)
- [ ] Team trained on DDMRP basics
- [ ] Roles assigned (who will be planner, who will be viewer?)
- [ ] Integration requirements defined (if integrating with ERP)

**All checked?** You're ready to start!

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

## ✅ First Day Checklist: Complete Before Go-Live

### 🎯 Purpose
**Use this checklist to ensure you've completed ALL setup steps before using the system for real operations.**

Print this page and check off each item as you complete it!

---

### Phase 1: Master Data Upload (MUST Complete First)

```
📦 PRODUCTS
[ ] Product master template downloaded
[ ] Product data filled in (minimum 10 products)
[ ] Products uploaded successfully
[ ] Product count matches uploaded file
[ ] Can see products in Inventory → Strategic tab
[ ] No products showing "null" or blank names

📍 LOCATIONS  
[ ] Location master template downloaded
[ ] Location data filled in (minimum 1 location)
[ ] Locations uploaded successfully
[ ] Locations visible in system

👥 VENDORS/SUPPLIERS
[ ] Vendor master template downloaded
[ ] Vendor data filled in
[ ] Vendors uploaded successfully
[ ] Vendors linked to products

📊 HISTORICAL SALES
[ ] Sales template downloaded
[ ] Sales data filled for 30-90 days
[ ] Sales uploaded successfully
[ ] Sales record count correct (days × products)
[ ] No "orphan" products (sales for non-existent products)

💰 PRODUCT PRICING
[ ] Pricing template downloaded
[ ] Current prices filled in
[ ] Pricing uploaded successfully

🚚 LEAD TIMES
[ ] Lead time template downloaded  
[ ] Lead times filled for all products
[ ] Lead times uploaded successfully
[ ] No zero or blank lead times
```

**✅ Phase 1 Complete?** All boxes checked above = Ready for Phase 2

---

### Phase 2: Configuration & Settings

```
🎯 DECOUPLING POINTS
[ ] Understand what decoupling point means
[ ] Identified strategic products (20-30% of total)
[ ] Set decoupling points in system
[ ] At least 1 decoupling point assigned

📋 BUFFER PROFILES
[ ] Using default profile OR
[ ] Created custom buffer profiles
[ ] Buffer profiles assigned to products

🏢 HIERARCHY (Multi-Location Only)
[ ] Location hierarchy uploaded (if multiple locations)
[ ] Parent-child relationships correct
[ ] Echelon levels assigned

⚙️ SYSTEM SETTINGS
[ ] Reviewed default configuration values
[ ] Adjusted if needed (or using defaults)
```

**✅ Phase 2 Complete?** All boxes checked above = Ready for Phase 3

---

### Phase 3: Validation & Testing (CRITICAL - DON'T SKIP!)

```
🔍 DATA VALIDATION
[ ] Go to: Inventory → Configuration → Analysis Results
[ ] ADU values showing (not zero)
[ ] ADU values look reasonable (compare to your sales average)
[ ] Lead times showing correctly
[ ] No "N/A" or "Error" values

🧪 TEST CALCULATION
[ ] Navigate to: Inventory → Configuration → System Settings
[ ] Click "Calculate All Buffers Now"
[ ] Calculation completed without errors
[ ] Processing time was reasonable (<5 min for <10K records)

📊 VERIFY RESULTS
[ ] Go to: Inventory → Operational → Buffer Status Grid
[ ] See Red/Yellow/Green zones with actual numbers
[ ] Zones are NOT all zeros
[ ] ADU column populated
[ ] DLT column populated
[ ] Buffer zones look reasonable (not impossibly large/small)

🔴 CHECK SPECIFIC PRODUCT
[ ] Pick your highest-volume product
[ ] Find it in Buffer Status Grid
[ ] Red Zone > 0
[ ] Yellow Zone > 0
[ ] Green Zone > 0
[ ] Total Buffer (TOG) = Red + Yellow + Green
[ ] ADU roughly matches your daily sales
```

**✅ Phase 3 Complete?** All boxes checked above = Ready for Phase 4

---

### Phase 4: Current State Snapshot (Optional But Recommended)

```
📦 CURRENT INVENTORY
[ ] Current inventory snapshot template downloaded
[ ] Physical count completed for all products
[ ] Inventory snapshot uploaded
[ ] On-hand quantities showing in system

📬 OPEN PURCHASE ORDERS
[ ] Open PO template downloaded
[ ] Current open POs listed
[ ] POs uploaded
[ ] On-order quantities showing in system

📤 OPEN SALES ORDERS
[ ] Open SO template downloaded
[ ] Current open SOs listed
[ ] SOs uploaded
[ ] Qualified demand showing in system

🧮 NFP CALCULATION
[ ] Net Flow Position (NFP) calculated
[ ] NFP = On Hand + On Order - Qualified Demand
[ ] NFP values look correct
[ ] Buffer status showing colors (Red/Yellow/Green)
```

**✅ Phase 4 Complete?** All boxes checked above = READY FOR GO-LIVE!

---

### Phase 5: Go-Live Readiness (Final Check)

```
👥 TEAM TRAINING
[ ] Planners trained on buffer status interpretation
[ ] Planners know how to use Execution Priority page
[ ] Warehouse staff understand buffer colors
[ ] Procurement knows how to create POs from system

📱 ACCESS & PERMISSIONS
[ ] All users have login credentials
[ ] Roles assigned correctly (admin/planner/viewer)
[ ] Permissions tested (users can access their pages)

🔔 ALERTS CONFIGURED (Optional)
[ ] Email notifications set up (if using)
[ ] Alert recipients configured
[ ] Test alert sent and received

📊 REPORTING
[ ] Dashboard accessible to executives
[ ] Key reports tested (buffer performance, financial impact)
[ ] Export functionality working (CSV, Excel, PDF)

🔄 BACKUP & RECOVERY (IT Task)
[ ] Database backup configured
[ ] Backup schedule verified
[ ] Recovery procedure documented

🚀 STAKEHOLDER SIGN-OFF
[ ] Inventory Manager approves
[ ] Supply Chain Director approves
[ ] IT confirms system ready
[ ] Training completion confirmed
```

---

### 🎉 GO-LIVE CHECKLIST SUMMARY

**Count your checkmarks:**

- **Phase 1 (Master Data):** _____ / 27 ✅
- **Phase 2 (Configuration):** _____ / 9 ✅
- **Phase 3 (Validation):** _____ / 16 ✅
- **Phase 4 (Current State):** _____ / 12 ✅
- **Phase 5 (Readiness):** _____ / 13 ✅

**TOTAL: _____ / 77 ✅**

---

### ✅ READY FOR GO-LIVE?

**Requirements:**
- ✅ **Phase 1:** 100% complete (all 27 boxes)
- ✅ **Phase 2:** 100% complete (all 9 boxes)
- ✅ **Phase 3:** 100% complete (all 16 boxes) - CRITICAL
- ⚠️ **Phase 4:** 50%+ complete (recommended but not mandatory)
- ⚠️ **Phase 5:** 80%+ complete (recommended)

**Minimum to go live:**
- Phases 1, 2, 3 must be 100% complete
- At least 40/77 total boxes checked

**Recommended for smooth launch:**
- All phases 90%+ complete
- At least 70/77 total boxes checked

---

### ❌ Not Ready? Here's What to Do

**If Phase 1 incomplete:**
- STOP. Cannot proceed without master data.
- Go back to [30-Minute Quick Start](#-30-minute-quick-start-your-first-success)
- Complete all uploads

**If Phase 2 incomplete:**
- Review [First Time Setup](#first-time-setup---complete-walkthrough)
- Set at least 1 decoupling point
- Assign buffer profiles

**If Phase 3 incomplete:**
- This is CRITICAL. Do not skip!
- Go to [Step 16: Calculate Buffers](#step-16-calculate-buffers-the-magic-moment)
- Verify all validation checks pass

**If seeing errors:**
- Go to [Error Messages Guide](#-error-messages--solutions)
- Check [Troubleshooting](#common-questions--troubleshooting)

---

## 📊 Sample Data: Real Working Examples

### 🎯 Purpose
**Learn by example! These are real, complete datasets you can use to test the system.**

Copy these examples directly into your templates to see how everything works.

---

### Example 1: Coffee Shop Chain (5 Products)

**Scenario:** Small coffee shop chain with 1 central warehouse supplying 3 locations.

#### Product Master (product_master.csv)

```csv
product_id,sku,name,category,subcategory,supplier_id,unit_of_measure,buffer_profile_id,planning_priority
PROD_COFFEE_001,BEAN-ARB-1KG,Arabica Coffee Beans 1kg,Beverages,Coffee,SUP_BEAN_CO,KG,BP_DEFAULT,HIGH
PROD_MILK_001,MILK-WHOLE-1L,Whole Milk 1L,Dairy,Milk,SUP_DAIRY_01,LITER,BP_PERISHABLE,HIGH
PROD_CUP_001,CUP-12OZ-100,Paper Cups 12oz (100ct),Packaging,Disposables,SUP_PACK_99,CASE,BP_DEFAULT,MEDIUM
PROD_SUGAR_001,SUGAR-WHT-50KG,White Sugar 50kg,Ingredients,Sweeteners,SUP_GRAIN_01,KG,BP_DEFAULT,MEDIUM
PROD_TEA_001,TEA-GRN-100,Green Tea Bags (100ct),Beverages,Tea,SUP_BEAN_CO,BOX,BP_DEFAULT,LOW
```

**Expected Result After Upload:**
- ✅ 5 products visible
- ✅ All have categories assigned
- ✅ All have buffer profiles (BP_DEFAULT or BP_PERISHABLE)

---

#### Location Master (location_master.csv)

```csv
location_id,region,channel_id,location_type,restaurant_number,daily_sales_volume
LOC_WH_CENTRAL,Central,CH_WAREHOUSE,Warehouse,WH001,0
LOC_SHOP_RY01,Central,CH_RETAIL,Store,SHOP001,150
LOC_SHOP_RY02,Central,CH_RETAIL,Store,SHOP002,120
LOC_SHOP_JD01,Western,CH_RETAIL,Store,SHOP003,180
```

**Expected Result:**
- ✅ 4 locations visible
- ✅ 1 warehouse + 3 stores

---

#### Historical Sales (historical_sales_data.csv)

**Sample: Coffee sales for 7 days (expand to 30-90 days)**

```csv
sales_id,product_id,location_id,sales_date,quantity_sold,unit_price,revenue
SALE_001,PROD_COFFEE_001,LOC_SHOP_RY01,2025-09-01,2.5,75.00,187.50
SALE_002,PROD_COFFEE_001,LOC_SHOP_RY01,2025-09-02,2.8,75.00,210.00
SALE_003,PROD_COFFEE_001,LOC_SHOP_RY01,2025-09-03,2.2,75.00,165.00
SALE_004,PROD_COFFEE_001,LOC_SHOP_RY01,2025-09-04,3.1,75.00,232.50
SALE_005,PROD_COFFEE_001,LOC_SHOP_RY01,2025-09-05,2.9,75.00,217.50
SALE_006,PROD_COFFEE_001,LOC_SHOP_RY01,2025-09-06,2.4,75.00,180.00
SALE_007,PROD_COFFEE_001,LOC_SHOP_RY01,2025-09-07,2.7,75.00,202.50
```

**Quick Fill Instructions:**
1. Copy these 7 rows
2. Paste 12 more times (changing dates) to get 90 days
3. Change quantity_sold slightly for variety (2.0-3.5 range)
4. Repeat for all 5 products × all 3 stores = 1,350 rows total

**Expected ADU After Upload:**
- Coffee: ~2.7 kg/day per store
- Milk: ~45 liters/day per store
- Cups: ~6 cases/day per store

---

#### Lead Times (actual_lead_time.csv)

```csv
product_id,location_id,actual_lead_time_days
PROD_COFFEE_001,LOC_WH_CENTRAL,14
PROD_MILK_001,LOC_WH_CENTRAL,2
PROD_CUP_001,LOC_WH_CENTRAL,7
PROD_SUGAR_001,LOC_WH_CENTRAL,10
PROD_TEA_001,LOC_WH_CENTRAL,14
```

**Notes:**
- Coffee & Tea: 14 days (international import)
- Milk: 2 days (local dairy, perishable)
- Cups: 7 days (regional supplier)
- Sugar: 10 days (national supplier)

---

#### Expected Buffer Zones After Calculation

**Coffee (High-volume, long lead time):**
```
Red Zone: ~38 kg (2.7 ADU × 14 DLT × 0.5 × 0.25)
Yellow Zone: ~38 kg
Green Zone: ~95 kg (2.7 × 7 order cycle × 0.5)
Total Buffer (TOG): ~171 kg
```

**Milk (High-volume, short lead time, perishable):**
```
Red Zone: ~12 liters (45 ADU × 2 DLT × 0.5 × 0.25)
Yellow Zone: ~12 liters
Green Zone: ~68 liters (45 × 3 order cycle × 0.5)
Total Buffer (TOG): ~92 liters
```

---

### Example 2: Restaurant Supply (10 Products)

**Scenario:** Fast food restaurant with frozen, chilled, and ambient ingredients.

#### Sample Product Mix

```csv
product_id,sku,name,category,storage_type,lead_time_days
PROD_BUN_001,BUN-SES-24,Sesame Buns (24ct),Bakery,Ambient,5
PROD_PATTY_001,BEEF-80G-40,Beef Patty 80g (40ct),Meat,Frozen,7
PROD_CHEESE_001,CHEZ-SLC-200,Cheese Slices (200ct),Dairy,Chilled,3
PROD_LETTUCE_001,LET-ICE-5KG,Iceberg Lettuce 5kg,Produce,Chilled,2
PROD_PICKLE_001,PICK-SLC-2KG,Pickle Slices 2kg,Condiments,Ambient,10
PROD_SAUCE_001,SAU-BURG-5L,Burger Sauce 5L,Condiments,Ambient,14
PROD_FRIES_001,FRY-STR-2.5KG,Straight Fries 2.5kg,Frozen,Frozen,7
PROD_OIL_001,OIL-VEG-20L,Vegetable Oil 20L,Cooking,Ambient,10
PROD_BEV_001,COLA-24X330,Cola Cans 24×330ml,Beverages,Ambient,7
PROD_BOX_001,BOX-MEAL-500,Meal Boxes (500ct),Packaging,Ambient,14
```

**Product Classification:**
- **Frozen:** Patties, Fries (7-day lead time, high volume)
- **Chilled:** Cheese, Lettuce (2-3 day lead time, moderate volume)
- **Ambient:** Everything else (5-14 day lead time, varies)

**Expected Buffer Profiles:**
- Frozen: Higher green zone (less frequent deliveries)
- Chilled: Smaller green zone (more frequent, perishable)
- Ambient: Standard DDMRP zones

---

### 🎓 How to Use These Examples

**Option 1: Test System (Recommended for First-Timers)**
1. Copy Example 1 (Coffee Shop) data EXACTLY as shown
2. Upload to your test system
3. Run buffer calculation
4. See if results match expected buffer zones above
5. This confirms your system is working correctly!

**Option 2: Adapt to Your Business**
1. Use Examples as templates
2. Replace product names with yours
3. Replace sales quantities with yours
4. Keep the structure the same

**Option 3: Mix and Match**
1. Use some example products
2. Add some of your real products
3. Test with partial real data before full rollout

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

#### Step 16: Calculate Buffers (The Magic Moment!)

**Navigation:** Inventory → Configuration Tab → System Settings

**What This Does:** This is where the system calculates all your buffer zones (Red, Yellow, Green) for every product at every location. Think of it as the "brain" of DDMRP - it takes all your data and turns it into actionable inventory targets.

**🖥️ What You'll See on Screen:**

```
┌─────────────────────────────────────────────────────────┐
│  ⚙️ System Settings                                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Buffer Calculation                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                         │
│  Last Calculation: 2025-10-01 14:30:00                 │
│  Status: ✅ Completed Successfully                      │
│  Products Processed: 847                                │
│  Locations: 23                                          │
│  Total Buffer Records: 19,481                           │
│                                                         │
│  ┌──────────────────────────────────────────┐          │
│  │  🔄 Calculate All Buffers Now            │ ← Click! │
│  └──────────────────────────────────────────┘          │
│                                                         │
│  ⚠️ Warning: Calculation may take 2-5 minutes          │
│     for large datasets (>10,000 records)                │
│                                                         │
│  Advanced Options:                                      │
│  ☑️ Recalculate only changed products                   │
│  ☐ Force full recalculation (slower)                    │
│  ☑️ Apply active DAF/LTAF adjustments                   │
│  ☐ Generate detailed calculation log                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Step-by-Step Instructions:**

**1. Navigate to the System Settings**
   - Click **"Inventory"** in the left sidebar
   - Click the **"Configuration"** tab at the top
   - Scroll down to find **"System Settings"** section

**2. Click "Calculate All Buffers Now" Button**
   - Big blue button in the center
   - You'll see a loading spinner appear

**3. Watch the Progress**
   - Progress bar shows: "Processing product 234 of 847..."
   - Percentage completion: "28%..."
   - Estimated time remaining: "3 minutes 12 seconds..."

**4. Wait for Completion**
   - When done, you'll see a **green success message**:
   ```
   ✅ Buffer Calculation Completed Successfully!
   
   Summary:
   - Products Processed: 847
   - Locations: 23
   - Buffer Records Created: 19,481
   - Calculation Time: 4 minutes 23 seconds
   - Products with DAF Applied: 127
   - Products with LTAF Applied: 89
   ```

---

### 🔧 Behind the Scenes: What the System Does

When you click "Calculate All Buffers", here's what happens (you don't see this, but it helps to understand):

**Step 1: Data Gathering (30 seconds)**
```
System queries:
├─ historical_sales_data (last 90 days)
├─ product_master (all active products)
├─ location_master (all active locations)
├─ buffer_profile_master (buffer settings)
├─ actual_lead_time (lead times per product-location)
├─ demand_adjustment_factor (active DAF entries)
├─ lead_time_adjustment_factor (active LTAF entries)
└─ product_location_pairs (decoupling points)
```

**Step 2: Calculate ADU for Each Product-Location (2 minutes)**
```
For each product-location pair:

Example: Sesame Buns at Riyadh Store 001

1. Fetch sales history:
   └─ Past 90 days: [120, 135, 128, ... 142] buns sold per day
   
2. Calculate base ADU:
   ADU_Base = SUM(90 days) / 90
   ADU_Base = 12,450 / 90 = 138.3 buns/day

3. Check for active DAF:
   └─ Ramadan DAF = 1.5 (active from 2025-03-01 to 2025-03-30)
   └─ ADU_Adjusted = 138.3 × 1.5 = 207.5 buns/day

4. Check trend factor (from performance_tracking):
   └─ 90-day trend = 1.08 (8% growth)
   └─ ADU_Final = 207.5 × 1.08 = 224.1 buns/day
```

**Step 3: Calculate Decoupled Lead Time (30 seconds)**
```
For Sesame Buns at Riyadh Store 001:

1. Fetch actual lead time:
   Actual_LT = 5 days (from actual_lead_time table)

2. Check for active LTAF:
   Active LTAF = 1.3 (supplier delays, valid until 2025-10-15)

3. Calculate DLT:
   DLT = Actual_LT × LTAF
   DLT = 5 days × 1.3 = 6.5 days
```

**Step 4: Fetch Buffer Profile Settings (10 seconds)**
```
Product: Sesame Buns
Buffer Profile: BP_BAKERY_FRESH

From buffer_profile_master:
├─ lt_factor: 0.5
├─ variability_factor: 0.25
├─ order_cycle_days: 7
├─ min_order_qty: 100
└─ rounding_multiple: 24 (case size)
```

**Step 5: Calculate Buffer Zones (2 minutes)**
```
Using DDMRP Formulas:

RED ZONE (Safety Stock):
Red = ADU × DLT × LT_Factor × Variability_Factor
Red = 224.1 × 6.5 × 0.5 × 0.25
Red = 182.1 buns

Enforce MOQ constraint:
Red = MAX(182.1, 100) = 182.1 buns
Red_Final = 182 buns (rounded)

YELLOW ZONE (Cycle Stock):
Yellow = Red (standard DDMRP practice)
Yellow = 182 buns

GREEN ZONE (Replenishment Flexibility):
Green = ADU × Order_Cycle × LT_Factor
Green = 224.1 × 7 × 0.5
Green = 784.4 buns
Green_Final = 784 buns (rounded)

BUFFER THRESHOLDS:
TOR (Top of Red) = Red = 182 buns
TOY (Top of Yellow) = Red + Yellow = 182 + 182 = 364 buns
TOG (Top of Green) = Red + Yellow + Green = 182 + 182 + 784 = 1,148 buns
```

**Step 6: Store Results (1 minute)**
```
System writes to inventory_ddmrp_buffers_view:

product_id: PROD_BUNS_001
location_id: LOC_RY_001
sku: BUN-SESAME-001
adu: 224.1
dlt: 6.5
red_zone: 182
yellow_zone: 182
green_zone: 784
tor: 182
toy: 364
tog: 1,148
buffer_profile_id: BP_BAKERY_FRESH
lt_factor: 0.5
variability_factor: 0.25
order_cycle_days: 7
moq: 100
rounding_multiple: 24
```

---

### ✅ How to Verify It Worked

**Verification Step 1: Check the Dashboard**
```
Navigate to: Inventory → Strategic Tab

You should now see:
┌─────────────────────────────────────────────┐
│  📊 Buffer Overview                         │
├─────────────────────────────────────────────┤
│  Total Buffers Calculated: 19,481           │
│                                             │
│  By Status:                                 │
│  🟢 Green Zone: 12,847 (66%)                │
│  🟡 Yellow Zone: 4,231 (22%)                │
│  🔴 Red Zone: 2,103 (11%)                   │
│  ⚫ Excess: 300 (1%)                         │
│                                             │
│  Last Updated: Just now                     │
└─────────────────────────────────────────────┘
```

**Verification Step 2: Inspect a Specific Product**
```
Navigate to: Inventory → Operational → Buffer Status Grid

Filter: Product = "Sesame Buns", Location = "Riyadh Store 001"

You should see:
┌────────────────────────────────────────────────────────┐
│  🥖 Sesame Buns - Riyadh Store 001                     │
├────────────────────────────────────────────────────────┤
│  Buffer Status: 🟡 Yellow Zone                         │
│  Buffer Penetration: 58%                               │
│                                                        │
│  Current Position:                                     │
│  ├─ On Hand: 420 buns                                 │
│  ├─ On Order: 240 buns                                │
│  ├─ Qualified Demand: 0 buns                          │
│  └─ NFP (Net Flow): 660 buns                          │
│                                                        │
│  Buffer Zones:                                         │
│  ├─ 🔴 Red Zone: 0-182 buns                           │
│  ├─ 🟡 Yellow Zone: 182-364 buns                      │
│  ├─ 🟢 Green Zone: 364-1,148 buns                     │
│  └─ ⚫ Excess: >1,148 buns                             │
│                                                        │
│  📈 ADU: 224 buns/day                                  │
│  🚚 DLT: 6.5 days (LTAF 1.3 applied)                  │
│  📦 MOQ: 100 buns                                      │
│  📏 Rounding: 24 buns (case)                           │
│                                                        │
│  Active Adjustments:                                   │
│  ├─ 🔼 DAF: 1.5 (Ramadan) [expires 2025-03-30]       │
│  └─ ⏱️ LTAF: 1.3 (Supplier delays) [expires 2025-10-15] │
└────────────────────────────────────────────────────────┘
```

**Verification Step 3: Check Calculation Log**
```
Navigate to: Inventory → Configuration → Analysis Results

Recent Calculations:
┌─────────────────────────────────────────────────────┐
│  Calculation Run: 2025-10-03 14:35:22               │
│  ───────────────────────────────────────────────── │
│  ✅ Sesame Buns | Riyadh 001 | Red: 182 | Yellow: 182 | Green: 784 │
│  ✅ Beef Patty  | Riyadh 001 | Red: 89  | Yellow: 89  | Green: 312 │
│  ✅ Cheese Slice| Riyadh 001 | Red: 156 | Yellow: 156 | Green: 546 │
│  ...                                                │
│                                                     │
│  Summary:                                           │
│  Total Products: 847                                │
│  Successful: 847 (100%)                             │
│  Failed: 0                                          │
│  With DAF: 127 products                             │
│  With LTAF: 89 products                             │
└─────────────────────────────────────────────────────┘
```

---

### ⚠️ Troubleshooting Step 16

**Problem 1: "No sales data found for product X"**
```
Cause: Missing historical_sales_data entries

Fix:
1. Go to Settings → Master Data → Historical Sales
2. Verify you uploaded sales for last 90 days
3. Check product_id matches between tables
4. Re-upload missing data
5. Re-run buffer calculation
```

**Problem 2: "Buffer zones are zero"**
```
Cause: Either no ADU or no lead time

Fix:
1. Check ADU calculation:
   - Navigate to Inventory → Configuration → Analysis Results
   - Look for ADU column
   - If zero, check historical_sales_data
   
2. Check lead time:
   - Navigate to Settings → Lead Time
   - Verify actual_lead_time table has entry for this product-location
   - Add missing lead times
   
3. Re-run calculation
```

**Problem 3: "Calculation taking too long (>10 minutes)"**
```
Cause: Large dataset or database performance

Temporary Fix:
1. Cancel current calculation
2. Enable "Recalculate only changed products" option
3. Try again

Permanent Fix (for IT team):
1. Add database indexes on:
   - historical_sales_data (product_id, location_id, sales_date)
   - product_location_pairs (product_id, location_id)
2. Consider running calculation overnight via scheduled job
```

**Problem 4: "Red zone is same as MOQ for all products"**
```
Cause: Calculated red zone is less than MOQ, so MOQ constraint kicks in

This is NORMAL behavior if:
- You have slow-moving products (low ADU)
- You have high MOQs from suppliers

Example:
ADU = 5 units/day
DLT = 3 days
Calculated Red = 5 × 3 × 0.5 × 0.25 = 1.875 units
MOQ = 100 units
Final Red = MAX(1.875, 100) = 100 units ✅

This protects you from ordering too small quantities.
```

---

### 📚 DDMRP Buffer Zone Formulas (Reference)

**For your understanding, here are the exact formulas the system uses:**

```
RED ZONE (Protects against stockout during lead time)
═══════════════════════════════════════════════════
Red = ADU × DLT × LT_Factor × Variability_Factor

Where:
- ADU = Average Daily Usage (calculated from last 90 days)
- DLT = Decoupled Lead Time (Actual_LT × LTAF)
- LT_Factor = Lead time buffer factor (from buffer profile, typically 0.5)
- Variability_Factor = Demand variability buffer (from buffer profile, typically 0.25)

Constraint: Red = MAX(Calculated_Red, MOQ)


YELLOW ZONE (Covers normal replenishment cycle)
═══════════════════════════════════════════════════
Yellow = Red

Note: DDMRP standard practice is Yellow = Red
This creates a "sweet spot" for ordering


GREEN ZONE (Provides flexibility for bulk ordering)
═══════════════════════════════════════════════════
Green = ADU × Order_Cycle × LT_Factor

Where:
- Order_Cycle = How often you want to order (from buffer profile, e.g., 7 days)
- LT_Factor = Same as red zone (0.5 typically)


THRESHOLDS (Action triggers)
═══════════════════════════════════════════════════
TOR (Top of Red) = Red_Zone
TOY (Top of Yellow) = Red_Zone + Yellow_Zone
TOG (Top of Green) = Red_Zone + Yellow_Zone + Green_Zone


DECISION RULES
═══════════════════════════════════════════════════
If NFP ≤ TOR  → 🔴 CRITICAL - Order immediately (expedite if possible)
If TOR < NFP ≤ TOY  → 🟡 CAUTION - Order soon (normal lead time)
If TOY < NFP ≤ TOG  → 🟢 HEALTHY - No action needed
If NFP > TOG  → ⚫ EXCESS - Consider stopping orders
```

---

### 🎓 Why These Formulas Work (The Math Behind DDMRP)

**Red Zone Philosophy:**
"How much do I need to survive the lead time if demand is higher than normal?"

```
Example:
- Normally sell 100 units/day
- Lead time is 5 days
- If perfect world: need 100 × 5 = 500 units

But:
- LT_Factor (0.5) = Only half the lead time is "exposed" (order overlap)
- Variability_Factor (0.25) = Demand can spike 25% above normal

Red = 100 × 5 × 0.5 × 0.25 = 62.5 units

This 62.5 units is your "insurance policy" against:
- Demand spikes during lead time
- Supplier delays
- Forecast errors
```

**Yellow Zone Philosophy:**
"Match the red zone to create a reorder trigger zone"

```
Yellow = Red creates a band where you should order.

When you drop below TOY (top of yellow):
- You still have Red + Yellow = 2× Red units
- This gives you TWO lead times of protection
- Safe to place normal replenishment order
```

**Green Zone Philosophy:**
"How much extra should I carry for economies of scale?"

```
Green = ADU × Order_Cycle × LT_Factor

If you order every 7 days (weekly):
Green = 100 × 7 × 0.5 = 350 units

This allows you to:
- Order in bulk for better pricing
- Reduce order frequency (labor savings)
- Take advantage of truckload discounts
```

---

### 🎯 When to Recalculate Buffers

**Automatic Recalculation (Scheduled):**
The system can auto-recalculate buffers on a schedule:

```
Navigate to: Inventory → Configuration → Auto-Recalculation

┌─────────────────────────────────────────────┐
│  🔄 Automated Buffer Recalculation          │
├─────────────────────────────────────────────┤
│  Status: ✅ Enabled                          │
│  Schedule: Weekly (every Monday 3:00 AM)    │
│  Last Run: 2025-09-30 03:00:00              │
│  Next Run: 2025-10-07 03:00:00              │
│                                             │
│  Recalculation Triggers:                    │
│  ☑️ New sales data uploaded                  │
│  ☑️ Lead times updated                       │
│  ☑️ DAF/LTAF changes                         │
│  ☑️ Buffer profile changes                   │
│                                             │
│  [Edit Schedule] [Disable] [Run Now]       │
└─────────────────────────────────────────────┘
```

**Manual Recalculation (When to Click the Button):**

| Situation | When | Why |
|-----------|------|-----|
| **New products added** | Immediately after upload | New products need initial buffer calculation |
| **Sales patterns changed** | After major events (promotions, seasonality) | ADU needs updating to reflect new reality |
| **Lead times changed** | After supplier updates | DLT affects red/yellow zones significantly |
| **Buffer profiles modified** | After changing LT_Factor or Variability_Factor | Zone sizes need recalculation |
| **DAF/LTAF added or removed** | After adjustment factor changes | Temporary adjustments alter zone sizes |
| **Weekly routine** | Every Monday morning | Keep buffers fresh with latest data |

---

### 💡 Pro Tips for Buffer Calculation

**Tip 1: Start with Conservative Settings**
```
For first 30 days, use higher safety factors:
- LT_Factor: 0.6 (instead of 0.5)
- Variability_Factor: 0.35 (instead of 0.25)

This builds confidence without stockouts.
After 30 days of monitoring, reduce to standard factors.
```

**Tip 2: Compare Before/After**
```
Before clicking "Calculate Buffers", export current buffer levels:
1. Go to Inventory → Operational → Buffer Status Grid
2. Click "Export to Excel"
3. Save as "Buffers_Before_2025-10-03.xlsx"

After calculation, export again:
4. Save as "Buffers_After_2025-10-03.xlsx"
5. Compare in Excel to see changes
```

**Tip 3: Review Extreme Values**
```
After calculation, check for outliers:

Navigate to: Inventory → Configuration → Analysis Results

Sort by:
- Highest Red Zone → Are these reasonable?
- Lowest Red Zone → Below MOQ constraint?
- Highest Green Zone → Check order cycle settings
- Products with >$10,000 buffer value → Review priority
```

**Tip 4: Document Your Settings**
```
Create a "Buffer Calculation Log":

Date: 2025-10-03
Calculated By: Ahmed (Planner)
Reason: Weekly routine update
Products: 847
DAF Active: 127 (Ramadan adjustment)
LTAF Active: 89 (Supplier delays)
Changes:
- Increased red zones by avg 12% (Ramadan)
- 34 products moved from Yellow to Red status
- 15 products now showing excess (promotional items)
Next Review: 2025-10-10
```

---

### 🚀 Next Steps After Buffer Calculation

✅ Step 16 Complete! Your buffers are now calculated.

**What to do next:**
1. ✅ **Step 17:** Upload current inventory snapshot (so system knows where you are TODAY)
2. ✅ **Step 18:** Upload open purchase orders (so system knows what's coming)
3. ✅ **Step 19:** Upload open sales orders (so system knows what's committed)
4. ✅ **Step 20:** Monitor buffer status (see your inventory health)
5. ✅ **Step 21:** Generate replenishment orders (system tells you what to buy)

**Continue to Step 17 below...**

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

## ❌ Common Mistakes (DON'T Do These!)

### 🎯 Purpose
**Learn from others' mistakes! These are the most common errors beginners make. Avoid them!**

---

### Mistake #1: Uploading Data Out of Order

**❌ WRONG:**
```
Day 1: Upload sales data first
Day 2: Oh wait, need to upload products first
Result: Sales upload fails with "Product not found" errors
```

**✅ RIGHT:**
```
ALWAYS upload in this exact order:
1. Products (foundation - everything else references these)
2. Locations (needed for sales, inventory, etc.)
3. Vendors (referenced by products and contracts)
4. Sales history (now products exist)
5. Pricing (references products)
6. Lead times (references products + locations)
7. Everything else
```

**Why This Matters:**
- Sales data has `product_id` column
- If product doesn't exist yet → Foreign key error → Upload fails
- Fixing requires deleting failed records and re-uploading

**How to Remember:**
Think of building a house: Foundation (products/locations) → Walls (sales/pricing) → Roof (buffers/reports)

---

### Mistake #2: Using Forecasted / Expected Sales

**❌ WRONG:**
```
Manager: "We expect to sell 1,000 units next quarter"
Planner uploads: 1,000 units for next 90 days
Result: Completely wrong ADU, buffers way too high
```

**✅ RIGHT:**
```
Upload ONLY actual historical sales
- What you ACTUALLY sold last 90 days
- Not what you hope to sell
- Not budgeted sales
- Not forecasted sales
```

**Why This Matters:**
- ADU (Average Daily Usage) MUST be based on reality
- System calculates: ADU = Sum(actual sales) ÷ 90 days
- Garbage in = Garbage out

**Real Example:**
```
Actual Sales (last 90 days): 50, 45, 60, 55, 48... = Avg 52/day
Forecasted Sales: 100/day (optimistic!)

If you use forecast:
- System calculates ADU = 100/day
- Buffers sized for 100/day demand
- You only sell 52/day
- Result: Massive excess inventory, cash tied up

If you use actual:
- System calculates ADU = 52/day
- Buffers sized correctly
- Inventory matches real demand
```

---

### Mistake #3: Setting ALL Products as Decoupling Points

**❌ WRONG:**
```
Planner: "More buffers = safer, right? Let me mark all 500 products!"
Result: Huge inventory investment, defeats purpose of DDMRP
```

**✅ RIGHT:**
```
Mark only 20-30% of products as decoupling points
Focus on:
- High-volume products (A items)
- Long lead time products
- Critical/strategic products
- Products that protect downstream operations
```

**Why This Matters:**
- Decoupling point = Strategic buffer position
- Not every product needs strategic buffer
- Low-volume items can be ordered as-needed
- Over-buffering wastes working capital

**Selection Criteria:**
```
✅ Mark as Decoupling Point:
- Top 20% by volume
- Lead time >7 days
- Critical for operations
- High demand variability
- Expensive stockout cost

❌ Don't Mark:
- Low-volume items (C items)
- Short lead time (<3 days)
- Easily sourced alternatives
- Stable, predictable demand
- Low stockout impact
```

**Real Example:**
```
Restaurant chain - 847 total products

WRONG Approach (all decoupling):
- 847 products × $5,000 avg buffer value = $4.2M working capital
- Includes slow-movers, condiments, paper goods
- Massive tied-up cash

RIGHT Approach (strategic):
- 170 products (20%) as decoupling points
- Focus on: Beef, chicken, buns, fries, cheese
- 170 × $5,000 = $850K working capital
- Savings: $3.35M freed up!
```

---

### Mistake #4: Ignoring Red Zone Alerts

**❌ WRONG:**
```
Warehouse: "Product X is in RED zone"
Planner: "It's fine, we still have 50 units. I'll order tomorrow."
Next day: Stockout occurs, production stops
```

**✅ RIGHT:**
```
RED ZONE = URGENT ACTION REQUIRED
- Order immediately, same day
- Consider expediting if needed
- Increase order quantity to reach Yellow/Green
- Don't wait until tomorrow
```

**Why This Matters:**
- Red zone = Safety stock (last line of defense)
- Below TOR = Already in danger territory
- Any delay = Risk of stockout
- Stockout cost >> expedite cost

**Understanding Buffer Zones:**
```
BUFFER VISUALIZATION:

TOG (1,000) ───────────────────────── ⚫ Excess (stop ordering)
              🟢 GREEN ZONE (500)
              Comfortable stock
              No action needed
TOY (500) ─────────────────────────── ✅ Order trigger
              🟡 YELLOW ZONE (200)
              Caution - order soon
              Use normal lead time
TOR (300) ─────────────────────────── ⚠️ First alert
              🔴 RED ZONE (300)
              DANGER - order NOW
              Consider expediting
0 ──────────────────────────────────── 🚨 STOCKOUT

Your Position: NFP = 250 units
Status: BELOW TOR → RED ZONE → ORDER TODAY!
```

**Decision Rules:**
- NFP > TOY (500+) = 🟢 Healthy, no action
- TOR < NFP < TOY (300-500) = 🟡 Order this week, normal delivery
- NFP < TOR (< 300) = 🔴 Order TODAY, consider express shipping
- NFP < 50% of Red = 🚨 CRITICAL - Expedite immediately

---

### Mistake #5: Overriding Buffer Calculations Daily

**❌ WRONG:**
```
Planner daily:
- "Coffee ADU looks too high, let me reduce it"
- "Sugar buffer too low, I'll manually increase"
- "Milk ADU wrong, let me fix it"
Result: System becomes manual, loses DDMRP benefits
```

**✅ RIGHT:**
```
Trust the system calculations
Override ONLY when:
- Clear documented reason
- Approved by manager
- Temporary adjustment (not permanent)
- Root cause identified and documented
```

**Why This Matters:**
- System uses 90 days of actual data
- You're using gut feel or recent memory
- Frequent overrides = Losing DDMRP benefits
- Becomes glorified min/max system

**When Override IS Appropriate:**
```
✅ Valid Reasons to Override:
1. Known future event
   Example: "New promotion starts Monday, expect 2× demand"
   Action: Use DAF (Demand Adjustment Factor) = 2.0

2. Supplier change
   Example: "Switched to faster local supplier"
   Action: Update lead time OR use LTAF = 0.7

3. Product discontinuation
   Example: "Phasing out old SKU, replacement coming"
   Action: Manually reduce buffer, don't reorder

4. Data quality issue (temporary)
   Example: "Sales data corrupted for last week"
   Action: Exclude bad data, recalculate

5. Seasonal ramp-up/down
   Example: "Ramadan starts in 2 weeks"
   Action: Apply DAF = 1.8 for duration
```

**Override Log Example:**
```
Date: 2025-10-03
Product: Arabica Coffee (PROD_001)
Current ADU: 52 kg/day (calculated)
Override ADU: 93 kg/day (manual)
Reason: Ramadan promotion confirmed, historical data shows 1.8× spike
Approved By: Supply Chain Manager
Valid Until: 2025-11-05 (30 days)
Review Date: 2025-10-20
```

---

### Mistake #6: Not Updating Sales Data Regularly

**❌ WRONG:**
```
January: Upload 90 days of sales
February-June: No new uploads
June: "Why are my buffers wrong?"
Result: ADU based on 6-month-old data
```

**✅ RIGHT:**
```
Upload new sales data:
- Daily: Automated feed from POS/ERP (best)
- Weekly: Manual upload of last 7 days (good)
- Minimum: Monthly (acceptable but not ideal)

System always uses last 90 days rolling window
```

**Why This Matters:**
- Demand patterns change
- Seasonality shifts
- Promotions affect sales
- Stale data = Wrong ADU = Wrong buffers

**Best Practice:**
```
Weekly Sales Upload Routine:

Monday 9:00 AM:
1. Export last 7 days sales from POS
2. Upload to DDMRP system (5 minutes)
3. System recalculates ADU automatically
4. Buffers adjust to reflect current demand

Result:
- Always using last 90 days (rolling)
- Removes oldest 7 days, adds newest 7 days
- ADU stays current
```

---

### Mistake #7: Mixing Unit of Measure

**❌ WRONG:**
```
Product Master: unit_of_measure = "KG"
Sales Data: quantity_sold = 2.5 (but actually means 2.5 tons!)
Lead Time: actual_lead_time = 7 (but means 7 hours, not days!)
Result: Completely wrong calculations
```

**✅ RIGHT:**
```
Be ABSOLUTELY CONSISTENT with units:
- Weight: Always KG (not grams, tons, pounds)
- Volume: Always LITERS (not ml, gallons)
- Time: Always DAYS (not hours, weeks)
- Count: EACH or CASE (specify case size)
```

**Real Example:**
```
WRONG:
Product: Coffee Beans
Product Master: unit = "KG"
Sales for Jan 5: quantity_sold = 2.5
→ Planner means 2.5 tons (2,500 kg)
→ System calculates ADU = 2.5 kg/day
→ Buffers sized for 2.5 kg/day
→ Result: Massive stockout!

RIGHT:
Product Master: unit = "KG"
Sales for Jan 5: quantity_sold = 2500 (convert tons to kg)
→ System calculates ADU = 2,500 kg/day
→ Buffers sized correctly
```

**Conversion Checklist:**
```
Before uploading sales:
[ ] All weights in KG (1 ton = 1,000 kg)
[ ] All volumes in LITERS (1 gallon = 3.785 L)
[ ] All lead times in DAYS (1 week = 7 days)
[ ] All cases converted to EACH × case_size
```

---

### Mistake #8: Skipping Validation Checks

**❌ WRONG:**
```
Upload products → "Success!"
Upload sales → "Success!"
Calculate buffers → "Success!"
Never check if results make sense
Launch system
Realize 2 weeks later: All ADUs are zero
```

**✅ RIGHT:**
```
After EVERY upload, validate:
1. Record count matches expectation
2. Spot-check 5-10 random records
3. No null/blank values
4. No impossible values (negative quantities)
5. No outliers (1 million units sold in 1 day?)
```

**Validation Checklist After Uploads:**
```
✅ Products Uploaded:
[ ] Count = Expected (e.g., 847 products)
[ ] Open product list, scroll through
[ ] Check first product: name shows correctly
[ ] Check last product: all fields populated
[ ] No products named "null" or blank
[ ] All have valid unit_of_measure

✅ Sales Uploaded:
[ ] Count = Expected (90 days × products × locations)
[ ] Check highest-volume product
[ ] ADU approximately matches your expectations
[ ] No zero or negative quantities
[ ] Dates cover full 90-day period

✅ Buffers Calculated:
[ ] Buffer count = Decoupling points × locations
[ ] Red zone > 0 for all products
[ ] Yellow zone > 0
[ ] Green zone > 0
[ ] ADU column populated (not zero)
[ ] Pick 3 random products → Zones look reasonable
```

---

### Mistake #9: Creating Purchase Orders Before Loading Current Inventory

**❌ WRONG:**
```
Day 1: Upload products, sales, calculate buffers
Day 2: System shows all products in RED
Day 2: Create POs for everything
Day 3: Upload current inventory → Already have plenty!
Result: Double-ordered, massive excess
```

**✅ RIGHT:**
```
Correct sequence:
1. Upload master data
2. Calculate buffers
3. Upload current inventory snapshot (on-hand)
4. Upload open POs (on-order)
5. Upload open SOs (qualified demand)
6. System calculates NFP
7. NOW generate replenishment orders
```

**Why This Matters:**
```
Without current inventory:
NFP = 0 (unknown) + 0 (unknown) - 0 (unknown) = UNKNOWN
System assumes: NFP = 0
Every product shows RED (because NFP < TOR)
Creates orders for everything

With current inventory:
NFP = 500 (on hand) + 200 (on order) - 50 (qualified) = 650
NFP = 650 > TOY (600) = GREEN zone
No order needed
```

---

### Mistake #10: Not Training Team Before Go-Live

**❌ WRONG:**
```
Manager: "New system live tomorrow! Figure it out as you go."
Planners: "What's NFP? What's TOR? Why is everything red??"
Result: Panic, confusion, system abandoned
```

**✅ RIGHT:**
```
Before go-live:
1. Train planners (2-4 hours)
   - DDMRP basics
   - How to read buffer status
   - How to create orders

2. Train warehouse staff (30 min)
   - What colors mean
   - When to alert planners

3. Train procurement (1 hour)
   - Execution priority
   - PO creation

4. Train executives (15 min)
   - Financial dashboard only
```

**Training Checklist:**
```
[ ] All planners completed training
[ ] Planners can explain: NFP, TOR, TOY, TOG
[ ] Planners know how to generate orders
[ ] Warehouse knows what RED/YELLOW/GREEN means
[ ] Procurement knows how to use Execution Priority
[ ] Executives know where to find financial metrics
[ ] Training materials printed and distributed
[ ] Quick reference card posted at each workstation
```

---

## 🔴 Error Messages & Solutions

### 🎯 Purpose
**Understand what error messages mean and how to fix them quickly.**

---

### Error Category 1: Upload Errors

#### Error: "No sales data found for product X"

**Full Message:**
```
⚠️ Warning: No sales data found for product PROD_001
ADU calculation failed for this product
```

**What It Means:**
- Product exists in `product_master`
- But has NO entries in `historical_sales_data`
- System can't calculate ADU without sales history

**How to Fix:**
```
Option 1: Upload Missing Sales (Recommended)
1. Export sales history for PROD_001
2. Verify product_id matches exactly (case-sensitive!)
3. Upload sales data
4. Re-run buffer calculation

Option 2: Manual ADU (Temporary)
1. Navigate to: Inventory → Configuration → Analysis Results
2. Find product PROD_001
3. Click "Manual Override"
4. Enter estimated ADU (e.g., 25 units/day)
5. Save and recalculate

Option 3: Mark Inactive (If Discontinued)
1. Go to: Settings → Master Data → Products
2. Find product PROD_001
3. Set "is_active" = FALSE
4. System will skip this product
```

**Prevention:**
- Always upload sales for ALL active products
- Check sales history covers full 90 days
- Verify product_id consistency across tables

---

#### Error: "Duplicate product_id found"

**Full Message:**
```
❌ Upload Failed
Error: Duplicate key violation on product_id "PROD_001"
This product already exists in the database
```

**What It Means:**
- Trying to upload product with `product_id` that already exists
- Each product must have unique ID

**How to Fix:**
```
Option 1: Update Existing Product
1. Go to: Settings → Master Data → Products
2. Find existing PROD_001
3. Click "Edit"
4. Update fields as needed
5. Save

Option 2: Change Product ID
1. Open your upload CSV
2. Change product_id from "PROD_001" to "PROD_001B"
3. Make sure new ID is unique
4. Re-upload

Option 3: Delete Old Product First (Caution!)
1. Go to: Settings → Master Data → Products
2. Find PROD_001
3. Click "Delete" (WARNING: Deletes all linked data!)
4. Re-upload new product
```

**Prevention:**
- Check existing products before uploading
- Use consistent ID naming convention
- Maintain master product list

---

#### Error: "Invalid date format"

**Full Message:**
```
❌ Upload Failed
Error on row 15: Invalid date format "10/03/2025"
Expected format: YYYY-MM-DD
```

**What It Means:**
- Date column not in correct format
- System expects: `2025-10-03`
- You provided: `10/03/2025` or `03-Oct-2025`

**How to Fix:**
```
1. Open CSV in Excel
2. Select date column
3. Format cells → Custom → Type: "YYYY-MM-DD"
4. Save as CSV (not Excel format!)
5. Re-upload

Or use Find & Replace:
10/03/2025 → 2025-10-03
03-Oct-2025 → 2025-10-03
```

**Correct Format Examples:**
```
✅ 2025-10-03 (RIGHT)
✅ 2025-01-15 (RIGHT - note leading zero)
❌ 10/3/2025 (WRONG - American format)
❌ 03-10-2025 (WRONG - European format)
❌ Oct 3, 2025 (WRONG - text format)
❌ 2025/10/03 (WRONG - slashes instead of dashes)
```

---

#### Error: "Required field missing: unit_of_measure"

**Full Message:**
```
❌ Upload Failed
Error on row 8: Required field "unit_of_measure" is NULL or empty
All products must have a unit of measure
```

**What It Means:**
- Column `unit_of_measure` is blank for some products
- This is a required field

**How to Fix:**
```
1. Open your product CSV
2. Go to row 8 (or error row number)
3. Fill in unit_of_measure column
4. Valid values: KG, LITER, EACH, CASE, BOX, PALLET
5. Save and re-upload
```

**Common Units:**
```
Weight: KG, GRAM, TON
Volume: LITER, GALLON, ML
Count: EACH, DOZEN, HUNDRED
Packaging: CASE, BOX, PALLET, CARTON
```

---

### Error Category 2: Calculation Errors

#### Error: "Buffer calculation failed: ADU is zero"

**Full Message:**
```
⚠️ Warning: Buffer calculation failed for PROD_001
Reason: ADU (Average Daily Usage) = 0
Cannot calculate buffer zones with zero demand
```

**What It Means:**
- Product has sales data uploaded
- But sum of all sales = 0 (or no sales in period)
- Can't create buffers for items with zero demand

**How to Fix:**
```
Diagnosis: Check Sales Data
1. Go to: Inventory → Configuration → Analysis Results
2. Find PROD_001
3. Check "Sales Last 90 Days" column
4. If showing "0" → No sales found

Solution 1: Check Date Range
- Sales might exist but outside 90-day window
- System looks back from today
- If your data is older → Won't be included
- Upload more recent sales data

Solution 2: Check Product-Location Pairing
- Sales uploaded for different location?
- Example: Sales for LOC_A, buffer calculation for LOC_B
- Verify sales and decoupling point use same location_id

Solution 3: Mark Inactive (If Truly Zero Demand)
- If product genuinely has no demand
- Don't waste effort managing buffer
- Mark as inactive in product master

Solution 4: Manual ADU Override
1. Go to: Configuration → Analysis Results
2. Find product
3. Enter manual ADU (e.g., 10 units/day)
4. Document why (new product, launching soon, etc.)
```

---

#### Error: "Lead time not found for product-location"

**Full Message:**
```
❌ Error: Cannot calculate buffer zones
Missing lead time for product PROD_001 at location LOC_001
```

**What It Means:**
- Product marked as decoupling point
- No entry in `actual_lead_time` table for this product-location
- System needs lead time to calculate DLT

**How to Fix:**
```
1. Go to: Settings → Lead Time
2. Download current lead times (to see what's missing)
3. Add missing entry:
   product_id: PROD_001
   location_id: LOC_001
   actual_lead_time_days: [your value, e.g., 7]
4. Upload updated lead time file
5. Re-run buffer calculation
```

**Quick Fix (If Urgent):**
```
Use default lead time:
1. Go to: Settings → System Configuration
2. Find "Default Lead Time (days)"
3. Set to reasonable value (e.g., 7 days)
4. System uses this when specific lead time missing
```

---

### Error Category 3: System Performance Errors

#### Error: "Calculation timeout - took longer than 30 minutes"

**Full Message:**
```
⚠️ Buffer calculation timed out
Processed 18,452 of 25,000 records before timeout
System may be overloaded or database needs optimization
```

**What It Means:**
- Calculation taking too long (>30 min threshold)
- Usually happens with very large datasets (>50,000 product-location pairs)
- Database queries are slow

**How to Fix:**
```
Short-term:
1. Run calculation during off-hours (overnight)
2. Enable "Incremental Calculation" mode
   - Only recalculates changed products
   - Much faster than full recalc

Medium-term (Contact IT):
1. Add database indexes:
   - historical_sales_data (product_id, location_id, sales_date)
   - product_location_pairs (product_id, location_id)
2. Review database server resources (RAM, CPU)

Long-term (For IT):
1. Schedule automated calculation (nightly at 2 AM)
2. Use database partitioning for large tables
3. Consider read-replicas for reporting queries
```

**Expected Calculation Times:**
```
< 1,000 records: 30-60 seconds
1,000-10,000: 2-5 minutes
10,000-50,000: 5-15 minutes
50,000-100,000: 15-30 minutes
> 100,000: 30+ minutes (schedule overnight)
```

---

### Error Category 4: Integration Errors

#### Error: "ERP connection failed"

**Full Message:**
```
❌ Cannot connect to ERP system
Error: Connection timeout after 30 seconds
Check network connectivity and ERP system status
```

**What It Means:**
- System trying to sync with ERP
- Can't establish connection
- Network issue or ERP down

**How to Fix:**
```
1. Check ERP Status:
   - Is ERP system running?
   - Can you access ERP from browser?
   - Check with IT if ERP maintenance ongoing

2. Check Network:
   - Are you on correct network/VPN?
   - Firewall blocking connection?
   - Check with IT for firewall rules

3. Verify Credentials:
   - Go to: Settings → Integration → ERP Connection
   - Test connection button
   - If fails: Update username/password

4. Workaround (Manual Process):
   - Export data from ERP manually
   - Upload via CSV files
   - Continue until integration restored
```

---

## 📄 One-Page Quick Reference Card (Print This!)

### 🎯 Daily Operations Cheat Sheet

**🖨️ PRINT THIS PAGE and keep at your workstation!**

---

### ⏰ Morning Routine (10 minutes)

**Step 1: Check Critical Alerts (2 min)**
```
1. Open Dashboard
2. Look for red alerts banner
3. Click to see details
4. Note products in RED zone
```

**Step 2: Review Execution Priority (5 min)**
```
1. Go to: Execution Priority page
2. Sort by: Buffer Penetration % (lowest first)
3. Action based on %:
   • <25% = 🔴 ORDER TODAY (expedite if possible)
   • 25-50% = 🟠 ORDER THIS WEEK (normal delivery)
   • 50-75% = 🟡 MONITOR (order in next 2 weeks)
   • >75% = 🟢 HEALTHY (no action)
```

**Step 3: Create Purchase Orders (3 min)**
```
1. Select items <50% penetration
2. Click "Generate Replenishment"
3. Review quantities
4. Approve and export to ERP
```

---

### 🎨 Buffer Status Colors - What They Mean

```
VISUAL GUIDE:

TOG ─────────────────────────────────────
      🟢 GREEN ZONE
      • Status: Comfortable excess
      • Action: None needed
      • Typical: 50-100% of TOG
TOY ─────────────────────────────────────
      🟡 YELLOW ZONE  
      • Status: Normal operating range
      • Action: Order this week
      • Typical: Order when NFP drops to TOY
TOR ─────────────────────────────────────
      🔴 RED ZONE
      • Status: Safety stock (danger!)
      • Action: ORDER IMMEDIATELY
      • Risk: Stockout if not ordered NOW
0 ───────────────────────────────────────
      🚨 STOCKOUT!
```

---

### 🧮 Key Formulas (Quick Reference)

**Net Flow Position:**
```
NFP = On Hand + On Order - Qualified Demand

Example:
On Hand: 500 units (current physical inventory)
On Order: 200 units (POs not yet received)
Qualified Demand: 50 units (confirmed sales orders)
NFP = 500 + 200 - 50 = 650 units
```

**Buffer Penetration:**
```
Penetration % = (NFP - TOR) / (TOG - TOR) × 100

Example:
NFP = 650
TOR = 300
TOG = 1,000
Penetration = (650 - 300) / (1,000 - 300) × 100 = 50%
→ Mid-Yellow zone, order this week
```

**Order Quantity:**
```
Order Qty = TOG - NFP
Round to Rounding Multiple
Enforce MOQ if needed

Example:
TOG = 1,000
NFP = 400
Raw Order = 1,000 - 400 = 600 units
Rounding Multiple = 24 (case size)
Rounded = CEIL(600 / 24) × 24 = 25 × 24 = 600 units (no change)
MOQ = 100 units (already met)
Final Order = 600 units
```

**Average Daily Usage:**
```
ADU = Sum(Last 90 Days Sales) / 90

Example:
Total Sales (90 days) = 2,340 units
ADU = 2,340 / 90 = 26 units/day
```

---

### 🚦 Decision Matrix - When to Order

| NFP Position | Zone | Buffer Penetration | Action | Urgency |
|--------------|------|-------------------|--------|---------|
| NFP > TOG | ⚫ Excess | >100% | STOP ordering | None |
| TOY < NFP ≤ TOG | 🟢 Green | 50-100% | No action | Low |
| TOR < NFP ≤ TOY | 🟡 Yellow | 25-50% | Order this week | Medium |
| 0 < NFP ≤ TOR | 🔴 Red | 0-25% | ORDER TODAY | HIGH |
| NFP ≤ 0 | 🚨 Stockout | Negative | EXPEDITE NOW | CRITICAL |

---

### 📞 Emergency Contacts

```
System Issues:
IT Support: __________________
Phone: __________________
Email: __________________

Data Questions:
Data Admin: __________________
Phone: __________________

Supply Chain Approvals:
Manager: __________________
Phone: __________________

Supplier Expedite:
Procurement: __________________
Phone: __________________
```

---

### ⚡ Quick Actions (Bookmark These Pages)

```
Daily Tasks:
• Buffer Status Grid: /inventory → Operational tab
• Execution Priority: /execution-priority
• Create POs: /supply-planning

Weekly Tasks:
• Buffer Performance: /inventory → Analytics tab
• Add DAF/LTAF: /inventory → Configuration → Dynamic Adjustments
• Review Alerts: /inventory → Breach Alerts tab

Monthly Tasks:
• Financial Dashboard: /dashboard
• Performance Reports: /reports
• Buffer Recalculation: /inventory → Configuration → System Settings
```

---

### 🔤 Common Abbreviations

```
ADU = Average Daily Usage (units/day)
ALT = Actual Lead Time (supplier promised days)
DLT = Decoupled Lead Time (ALT × LTAF)
DAF = Demand Adjustment Factor (temporary demand multiplier)
LTAF = Lead Time Adjustment Factor (temporary lead time multiplier)
NFP = Net Flow Position (available inventory)
TOG = Top of Green (maximum buffer level)
TOY = Top of Yellow (order trigger point)
TOR = Top of Red (danger threshold)
MOQ = Minimum Order Quantity (supplier requirement)
PO = Purchase Order
SO = Sales Order
SKU = Stock Keeping Unit (product code)
BOM = Bill of Materials (component list)
```

---

### ✅ End-of-Day Checklist

```
Before leaving:
[ ] All RED zone items ordered or expedited
[ ] Tomorrow's priorities identified
[ ] POs exported to ERP
[ ] Critical alerts acknowledged
[ ] Inventory transactions recorded
[ ] Team briefed on urgent items
```

---

## ⏱️ Performance Benchmarks: Is My System Normal?

### 🎯 Purpose
**Understand if your system is performing normally or needs optimization.**

---

### Buffer Calculation Speed

**Expected Times (By Dataset Size):**

| Product-Location Pairs | Expected Time | Your Time | Status |
|------------------------|---------------|-----------|--------|
| < 1,000 | 30-60 seconds | _______ | ✅ Normal if <2 min |
| 1,000-5,000 | 1-2 minutes | _______ | ✅ Normal if <4 min |
| 5,000-10,000 | 2-4 minutes | _______ | ✅ Normal if <8 min |
| 10,000-25,000 | 4-8 minutes | _______ | ✅ Normal if <15 min |
| 25,000-50,000 | 8-15 minutes | _______ | ✅ Normal if <25 min |
| 50,000-100,000 | 15-25 minutes | _______ | ✅ Normal if <40 min |
| > 100,000 | 25-45 minutes | _______ | ⚠️ Schedule overnight |

**How to Calculate Your Pairs:**
```
Total Pairs = # Decoupling Points × # Locations

Example:
- 850 products total
- 170 marked as decoupling points (20%)
- 15 locations
Total Pairs = 170 × 15 = 2,550 pairs
Expected Time = 1-2 minutes ✅
```

**🔴 If Your Time is 3× Longer Than Expected:**
```
Contact IT for database optimization:
1. Add missing indexes
2. Review database server resources
3. Consider scheduled overnight calculations
```

---

### Page Load Speed

**Expected Load Times:**

| Page | Expected | Your Time | Notes |
|------|----------|-----------|-------|
| Dashboard | <2 seconds | _______ | Initial load, has many metrics |
| Buffer Status Grid | <3 seconds | _______ | Large data table |
| Execution Priority | <2 seconds | _______ | Sorted list |
| Product Details | <1 second | _______ | Single product view |
| Reports | <5 seconds | _______ | Complex calculations |

**🔴 If Pages Load Slowly:**
```
Check these factors:
1. Internet connection speed (run speed test)
2. Browser cache (clear cache and retry)
3. Number of products displayed (use filters)
4. Time of day (peak usage?)
5. Browser version (update if old)
```

---

### Data Upload Speed

**Expected Upload Times:**

| File Size | Records | Expected Time | Your Time |
|-----------|---------|---------------|-----------|
| < 100 KB | < 1,000 rows | 5-10 seconds | _______ |
| 100 KB - 1 MB | 1,000-10,000 rows | 10-30 seconds | _______ |
| 1 MB - 5 MB | 10,000-50,000 rows | 30-90 seconds | _______ |
| 5 MB - 20 MB | 50,000-200,000 rows | 2-5 minutes | _______ |
| > 20 MB | > 200,000 rows | 5-15 minutes | _______ |

**Tips for Faster Uploads:**
```
1. Upload during off-peak hours
2. Split very large files into multiple uploads
3. Remove unnecessary columns before upload
4. Use CSV instead of Excel format
5. Compress files if extremely large
```

---

### Database Query Performance

**Expected Query Times (From System Settings → Performance Monitor):**

| Query Type | Expected | Action If Slower |
|------------|----------|------------------|
| Product Lookup | <100 ms | Add index on product_id |
| Sales History (90 days) | <500 ms | Add index on sales_date |
| Buffer Calculation (single) | <50 ms | Check formula complexity |
| ADU Aggregation | <200 ms | Partition sales table |
| Inventory Snapshot | <100 ms | Add index on snapshot_ts |

**How to Check (For IT):**
```
1. Go to: Settings → System Settings → Performance Monitor
2. Click "Run Diagnostics"
3. Review query execution times
4. Compare to expected times above
5. Optimize slow queries
```

---

### System Resource Usage

**Normal Resource Consumption:**

| Resource | Normal Range | Your System | Alert Level |
|----------|--------------|-------------|-------------|
| CPU Usage | 10-30% average | _______ % | >60% sustained |
| Memory (RAM) | 20-40% of total | _______ % | >75% |
| Database Size | 50-500 MB per 10K records | _______ MB | >5 GB needs cleanup |
| Active Connections | 5-20 concurrent | _______ | >50 needs optimization |

**How to Check (For IT):**
```
1. Go to: Settings → System Settings → Server Health
2. View current resource usage
3. Check historical trends
4. Set up alerts if thresholds exceeded
```

---

### Expected Data Volumes

**Typical Database Sizes:**

| Data Type | Records Per Year | Disk Space | Retention |
|-----------|------------------|------------|-----------|
| Products | 500-5,000 | 5-50 MB | Forever |
| Locations | 10-500 | <5 MB | Forever |
| Daily Sales | 180K-1.8M | 100-1,000 MB | 2-3 years |
| Buffer Calculations | 365K-3.65M | 200-2,000 MB | 1 year |
| Replenishment Orders | 50K-500K | 50-500 MB | 1 year |
| Audit Logs | 100K-1M | 100-1,000 MB | 1 year |

**Example: Medium-Sized Operation:**
```
Products: 2,000
Locations: 25
Decoupling Points: 400 (20%)
Sales Transactions/Day: 5,000

Annual Database Size:
- Products: 20 MB
- Sales: 1,825,000 records = ~500 MB
- Buffers: 146,000 calculations = ~300 MB
- Orders: 120,000 POs = ~200 MB
Total: ~1,020 MB (~1 GB/year)

After 3 years: ~3 GB
```

**🔴 If Database Growing Too Fast:**
```
Actions:
1. Archive old sales data (>2 years)
2. Delete obsolete buffer calculations
3. Purge closed/fulfilled orders (>1 year old)
4. Implement data retention policy
5. Review for duplicate/junk data
```

---

### Network Bandwidth Requirements

**Minimum Requirements:**

| Activity | Minimum Speed | Recommended | Notes |
|----------|---------------|-------------|-------|
| Daily Operations | 2 Mbps | 10 Mbps | Per user |
| Large File Upload | 5 Mbps | 20 Mbps | For 10 MB files |
| Report Generation | 5 Mbps | 10 Mbps | PDF exports |
| Dashboard Refresh | 1 Mbps | 5 Mbps | Real-time updates |
| ERP Integration | 5 Mbps | 20 Mbps | Constant sync |

**How to Test Your Speed:**
```
1. Visit speedtest.net
2. Run test from your location
3. Note Download speed
4. Compare to requirements above
```

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