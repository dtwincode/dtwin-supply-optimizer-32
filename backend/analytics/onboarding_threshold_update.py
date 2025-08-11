import pandas as pd
from datetime import datetime
from backend.supabase.supabase_client import supabase  # ✅ الاتصال المركزي

def update_thresholds(demand_variability_threshold, decoupling_threshold):
    """Update thresholds based on client onboarding input."""
    response = supabase.table("threshold_config").update({
        "demand_variability_threshold": demand_variability_threshold,
        "decoupling_threshold": decoupling_threshold,
        "first_time_adjusted": True,
        "updated_at": datetime.utcnow().isoformat()
    }).eq("id", 1).execute()

    if response.status_code == 200:
        print(f"✅ Thresholds updated successfully: DVT={demand_variability_threshold}, DT={decoupling_threshold}")
    else:
        print("❌ Failed to update thresholds:", response.data)

# --- Example Execution (Simulation Input) ---
if __name__ == "__main__":
    # These values can come from frontend or simulation module
    demand_variability_threshold = 0.65  # Example input
    decoupling_threshold = 0.8           # Example input

    update_thresholds(demand_variability_threshold, decoupling_threshold)
