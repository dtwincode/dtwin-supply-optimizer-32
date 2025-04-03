import pandas as pd
import numpy as np
from scipy import stats
from supabase import create_client, Client

# === Supabase Credentials ===
SUPABASE_URL = "https://mttzjxktvbsixjaqiuxq.supabase.co"
SUPABASE_SERVICE_KEY = "YOUR_SERVICE_KEY"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# === Step 1: Fetch historical sales data ===
def fetch_sales_data():
    response = supabase.table('historical_sales_data').select('product_id, location_id, quantity_sold').execute()
    data = response.data
    return pd.DataFrame(data)

# === Step 2: Fit and detect distribution ===
def detect_distribution(sales):
    distributions = ['norm', 'lognorm', 'gamma', 'beta']
    best_fit = None
    best_p = 0

    for dist_name in distributions:
        dist = getattr(stats, dist_name)
        try:
            params = dist.fit(sales)
            ks_stat, p_value = stats.kstest(sales, dist_name, args=params)
            if p_value > best_p:
                best_p = p_value
                best_fit = (dist_name, params)
        except Exception:
            continue

    return best_fit

# === Step 3: Store results in Supabase ===
def store_profile(product_id, location_id, distribution, params):
    supabase.table('demand_distribution_profile').upsert({
        'product_id': product_id,
        'location_id': location_id,
        'distribution_type': distribution,
        'param1': params[0],
        'param2': params[1] if len(params) > 1 else None
    }).execute()

def main():
    df = fetch_sales_data()
    grouped = df.groupby(['product_id', 'location_id'])

    for (product_id, location_id), group in grouped:
        sales = group['quantity_sold'].dropna().values
        if len(sales) < 5:
            continue  # Skip small samples

        best_fit = detect_distribution(sales)
        if best_fit:
            dist_name, params = best_fit
            store_profile(product_id, location_id, dist_name, params)
            print(f"✅ {product_id} @ {location_id} → {dist_name}")

if __name__ == "__main__":
    main()
