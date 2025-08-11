import pandas as pd
import numpy as np
from scipy import stats
from backend.supabase.supabase_client import supabase
import logging

# === Logging Setup ===
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# === Step 1: Fetch active demand nodes ===
def fetch_active_nodes():
    response = supabase.table('active_demand_nodes').select('product_id, location_id').execute()
    return pd.DataFrame(response.data or [])

# === Step 2: Fetch historical sales data ===
def fetch_sales_data():
    response = supabase.table('historical_sales_data').select('product_id, location_id, quantity_sold').execute()
    return pd.DataFrame(response.data or [])

# === Step 3: Detect best fitting distribution ===
def detect_distribution(sales):
    distributions = ['norm', 'lognorm', 'gamma', 'beta']
    best_fit = None
    best_p = 0

    for dist_name in distributions:
        dist = getattr(stats, dist_name)
        try:
            params = dist.fit(sales)
            _, p_value = stats.kstest(sales, dist_name, args=params)
            if p_value > best_p:
                best_p = p_value
                best_fit = (dist_name, params)
        except Exception as e:
            logging.warning(f"⚠️ Failed fitting {dist_name}: {e}")
            continue

    return best_fit

# === Step 4: Store results in Supabase ===
def store_profile(product_id, location_id, distribution, params):
    supabase.table('demand_distribution_profile').upsert({
        'product_id': product_id,
        'location_id': location_id,
        'distribution_type': distribution,
        'param1': params[0],
        'param2': params[1] if len(params) > 1 else None
    }).execute()

# === Main function ===
def main():
    logging.info("📥 Fetching active demand nodes...")
    nodes = fetch_active_nodes()
    if nodes.empty:
        logging.warning("❌ No active demand nodes found. Exiting.")
        return

    logging.info(f"✅ Found {len(nodes)} active demand nodes.")

    logging.info("📥 Fetching historical sales data...")
    sales_df = fetch_sales_data()
    if sales_df.empty:
        logging.warning("❌ No historical sales data found. Exiting.")
        return

    total_inserted = 0

    for _, row in nodes.iterrows():
        product_id, location_id = row['product_id'], row['location_id']
        group = sales_df[(sales_df['product_id'] == product_id) & (sales_df['location_id'] == location_id)]
        sales = group['quantity_sold'].dropna().values

        if len(sales) < 5:
            logging.info(f"🚫 Skipping {product_id} @ {location_id} → Not enough samples ({len(sales)})")
            continue

        if np.any(sales <= 0):
            logging.info(f"🚫 Skipping {product_id} @ {location_id} → Contains zero or negative sales")
            continue

        best_fit = detect_distribution(sales)
        if best_fit:
            dist_name, params = best_fit
            store_profile(product_id, location_id, dist_name, params)
            logging.info(f"✅ Inserted {product_id} @ {location_id} → {dist_name}")
            total_inserted += 1
        else:
            logging.info(f"🚫 Skipping {product_id} @ {location_id} → No valid distribution fit")

    logging.info(f"🎯 Distribution detection completed. Total inserted: {total_inserted}")

if __name__ == "__main__":
    main()
