import pandas as pd
from supabase import create_client, Client
from datetime import datetime
import numpy as np

# --- Supabase Credentials ---
SUPABASE_URL = "https://mttzjxktvbsixjaqiuxq.supabase.co"
SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10dHpqeGt0dmJzaXhqYXFpdXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTE2OTg0MSwiZXhwIjoyMDU0NzQ1ODQxfQ.xkL_emVJCkz3tWu75ad4x56aoOPJKHLLkr7SImBZuUc"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# --- Step 1: Fetch historical performance data ---
def fetch_performance_data():
    response = supabase.table('performance_tracking').select('*').execute()
    data = response.data
    return pd.DataFrame(data)

# --- Step 2: Bayesian Update Logic ---
def bayesian_threshold_update(df):
    # Calculate probabilities
    total_periods = len(df)
    stockout_rate = df['stockout_count'].sum() / total_periods
    overstock_rate = df['overstock_count'].sum() / total_periods

    # Apply Bayesian formula (simple version)
    new_demand_threshold = 0.6 + stockout_rate * 0.2 - overstock_rate * 0.1
    new_decoupling_threshold = 0.75 + stockout_rate * 0.1 - overstock_rate * 0.05

    # Boundaries
    new_demand_threshold = min(max(new_demand_threshold, 0.3), 0.9)
    new_decoupling_threshold = min(max(new_decoupling_threshold, 0.5), 0.95)

    return new_demand_threshold, new_decoupling_threshold

# --- Step 3: Update the threshold_config table ---
def update_threshold_config(new_demand, new_decoupling):
    supabase.table('threshold_config').update({
        "demand_variability_threshold": new_demand,
        "decoupling_threshold": new_decoupling,
        "updated_at": datetime.now().isoformat()
    }).eq('id', 1).execute()

# --- Main Execution ---
def main():
    print("🔄 Fetching performance data...")
    df = fetch_performance_data()

    if df.empty:
        print("⚠️ No performance data found. Skipping threshold update.")
        return

    print("📊 Running Bayesian threshold update...")
    new_demand, new_decoupling = bayesian_threshold_update(df)

    print(f"✅ New thresholds calculated: Demand = {new_demand:.2f}, Decoupling = {new_decoupling:.2f}")

    print("💾 Updating threshold config...")
    update_threshold_config(new_demand, new_decoupling)

    print("🎯 Threshold update completed.")

if __name__ == "__main__":
    main()
