import pandas as pd
import numpy as np
from supabase import create_client, Client
import uuid
from datetime import datetime

# --- Supabase Credentials ---
SUPABASE_URL = "https://mttzjxktvbsixjaqiuxq.supabase.co"
SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10dHpqeGt0dmJzaXhqYXFpdXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTE2OTg0MSwiZXhwIjoyMDU0NzQ1ODQxfQ.xkL_emVJCkz3tWu75ad4x56aoOPJKHLLkr7SImBZuUc"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# --- Parameters ---
NUM_SIMULATIONS = 1000

# --- Functions ---

def fetch_demand_data():
    """Fetch product demand variability & lead time."""
    response = supabase.table('inventory_demand_variability').select('product_id, location_id, demand_variability, lead_time_days').execute()
    data = response.data
    return pd.DataFrame(data)

def run_simulation(row):
    """Run Monte Carlo simulation for one product-location."""
    results = []
    for run in range(NUM_SIMULATIONS):
        simulated_demand = np.random.normal(loc=0, scale=row['demand_variability'])
        simulated_lead_time = np.random.normal(loc=row['lead_time_days'], scale=1)  # Small lead time variance
        calculated_safety_stock = max(0, simulated_demand * np.sqrt(simulated_lead_time))
        results.append({
            "id": str(uuid.uuid4()),
            "product_id": row['product_id'],
            "location_id": row['location_id'],
            "simulation_run": run + 1,
            "simulated_demand": simulated_demand,
            "simulated_lead_time": simulated_lead_time,
            "calculated_safety_stock": calculated_safety_stock,
            "created_at": datetime.now().isoformat()
        })
    return results

def store_simulation_results(results):
    """Store simulation results in Supabase."""
    for record in results:
        supabase.table('safety_stock_simulation').insert(record).execute()

def main():
    print("🔄 Fetching demand data...")
    df = fetch_demand_data()
    print(f"✅ Fetched {len(df)} records.")

    all_results = []
    for _, row in df.iterrows():
        print(f"🎯 Running simulation for {row['product_id']} @ {row['location_id']}...")
        simulation_results = run_simulation(row)
        store_simulation_results(simulation_results)
        print(f"✅ Simulation completed for {row['product_id']} @ {row['location_id']}")

    print("🎯 Monte Carlo Simulation completed successfully.")

if __name__ == "__main__":
    main()
