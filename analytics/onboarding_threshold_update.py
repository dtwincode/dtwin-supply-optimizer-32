import pandas as pd
from supabase import create_client, Client
from datetime import datetime

# --- Supabase Credentials ---
SUPABASE_URL = "https://mttzjxktvbsixjaqiuxq.supabase.co"
SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10dHpqeGt0dmJzaXhqYXFpdXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTE2OTg0MSwiZXhwIjoyMDU0NzQ1ODQxfQ.xkL_emVJCkz3tWu75ad4x56aoOPJKHLLkr7SImBZuUc"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# --- Function ---
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
    # These values will come from frontend input
    demand_variability_threshold = 0.65  # Example input
    decoupling_threshold = 0.8          # Example input

    update_thresholds(demand_variability_threshold, decoupling_threshold)
