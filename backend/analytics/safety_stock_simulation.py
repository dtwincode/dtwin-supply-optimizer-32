import pandas as pd
import numpy as np
import os
import uuid
from datetime import datetime
from backend.supabase.supabase_client import supabase  # ✅ الاتصال المركزي

NUM_SIMULATIONS = 1000

# === Step 1: Fetch Active Demand Nodes ===
def fetch_demand_nodes():
    """Fetch valid demand nodes from active_demand_nodes."""
    response = supabase.table('active_demand_nodes').select('product_id, location_id').execute()
    return pd.DataFrame(response.data)

# === Step 2: Fetch Demand Variability & Lead Time ===
def fetch_demand_data():
    """Fetch demand variability and lead time data."""
    nodes = fetch_demand_nodes()
    if nodes.empty:
        print("⚠️ No active demand nodes found.")
        return pd.DataFrame()

    product_ids = nodes['product_id'].tolist()
    location_ids = nodes['location_id'].tolist()

    response = supabase.table('inventory_demand_variability') \
        .select('product_id, location_id, demand_variability, lead_time_days') \
        .in_('product_id', product_ids) \
        .in_('location_id', location_ids) \
        .execute()

    df = pd.DataFrame(response.data)
    df = df[(df['demand_variability'] > 0) & (df['lead_time_days'].notnull())]
    return df

# === Step 3: Monte Carlo Simulation ===
def run_simulation(row):
    """Run simulation for one product-location pair."""
    results = []
    for run in range(NUM_SIMULATIONS):
        simulated_demand = np.random.normal(loc=0, scale=row['demand_variability'])
        simulated_lead_time = np.random.normal(loc=row['lead_time_days'], scale=1)
        calculated_safety_stock = max(0, simulated_demand * np.sqrt(simulated_lead_time))

        if np.isnan(calculated_safety_stock) or np.isinf(calculated_safety_stock):
            continue

        results.append({
            "id": str(uuid.uuid4()),
            "product_id": row['product_id'],
            "location_id": row['location_id'],
            "simulation_run": run + 1,
            "simulated_demand": simulated_demand,
            "simulated_lead_time": simulated_lead_time,
            "calculated_safety_stock": calculated_safety_stock,
            "created_at": datetime.utcnow().isoformat()
        })
    return results

# === Step 4: Store Results ===
def store_simulation_results(results):
    """Store simulation results in Supabase."""
    for record in results:
        supabase.table('safety_stock_simulation').insert(record).execute()

# === Main Execution ===
def main():
    print("🔄 Fetching valid demand data...")
    df = fetch_demand_data()
    print(f"✅ Fetched {len(df)} valid records.")

    if df.empty:
        print("⚠️ No valid data found. Exiting.")
        return

    total_records = 0
    for _, row in df.iterrows():
        print(f"🎯 Running simulation for {row['product_id']} @ {row['location_id']}...")
        results = run_simulation(row)
        if results:
            store_simulation_results(results)
            total_records += len(results)
        print(f"✅ Simulation done for {row['product_id']} @ {row['location_id']}")

    print(f"🎯 Monte Carlo Simulation completed. Total records stored: {total_records}")

if __name__ == "__main__":
    main()
