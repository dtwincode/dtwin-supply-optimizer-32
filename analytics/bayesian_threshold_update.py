import pandas as pd
from supabase import create_client, Client

# Supabase credentials
SUPABASE_URL = "https://mttzjxktvbsixjaqiuxq.supabase.co"
SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

def fetch_performance_data():
    """Fetch monthly performance tracking data."""
    response = supabase.table('performance_tracking').select('*').execute()
    return pd.DataFrame(response.data)

def bayesian_update(prior_mean, prior_variance, observed_mean, observed_variance):
    """Bayesian Updating Formula."""
    posterior_mean = (prior_variance * observed_mean + observed_variance * prior_mean) / (prior_variance + observed_variance)
    return round(posterior_mean, 2)

def update_thresholds():
    """Apply Bayesian update to thresholds."""
    # Fetch data
    df = fetch_performance_data()

    if df.empty:
        print("No performance data found.")
        return

    # Example calculation: Adjust Demand Variability Threshold
    observed_mean = df['service_level_achieved'].mean()
    observed_variance = df['service_level_achieved'].var()

    # Fetch current threshold
    current = supabase.table('threshold_config').select('*').execute().data[0]
    prior_mean = current['demand_variability_threshold']
    prior_variance = 0.01  # Example prior variance

    # Bayesian Update
    new_threshold = bayesian_update(prior_mean, prior_variance, observed_mean, observed_variance)

    # Update in Supabase
    supabase.table('threshold_config').update({'demand_variability_threshold': new_threshold}).execute()
    print(f"✅ Demand Variability Threshold updated to: {new_threshold}")

if __name__ == "__main__":
    update_thresholds()
