import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from supabase import create_client, Client
import os
from dotenv import load_dotenv

# === Load environment variables ===
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# === Step 1: Fetch All Data from Supabase in Batches ===
def fetch_all_data():
    """Fetch product data from Supabase with batching."""
    all_rows = []
    batch_size = 1000
    start = 0

    while True:
        print(f"📦 Fetching rows {start} to {start + batch_size - 1}...")
        response = supabase.table('inventory_planning_view') \
            .select('product_id, location_id, average_daily_usage, demand_variability') \
            .range(start, start + batch_size - 1) \
            .execute()

        rows = response.data
        if not rows:
            break

        all_rows.extend(rows)
        start += batch_size

    print(f"✅ Total fetched: {len(all_rows)} rows")
    return pd.DataFrame(all_rows)

# === Step 2: Classify Products with K-Means ===
def classify_products(df):
    """Apply K-Means Clustering and assign classification labels (Green, Yellow, Red)."""
    if df.empty:
        print("⚠️ No data to classify.")
        return df

    features = df[['average_daily_usage', 'demand_variability']].fillna(0)

    kmeans = KMeans(n_clusters=3, random_state=42)
    df['cluster_id'] = kmeans.fit_predict(features)

    centroids = kmeans.cluster_centers_
    risk_scores = [np.sum(c) for c in centroids]
    sorted_clusters = np.argsort(risk_scores)

    color_map = ['Green', 'Yellow', 'Red']
    cluster_to_label = {cluster_id: color_map[idx] for idx, cluster_id in enumerate(sorted_clusters)}
    df['classification_label'] = df['cluster_id'].map(cluster_to_label)

    df['lead_time_category'] = 'Normal'
    df['variability_level'] = pd.cut(df['demand_variability'],
                                     bins=[-1, 0.3, 0.6, float('inf')],
                                     labels=['Low', 'Medium', 'High'])
    df['criticality'] = df['classification_label'].map({
        'Red': 'High',
        'Yellow': 'Medium',
        'Green': 'Low'
    })
    df['score'] = df['average_daily_usage'].rank(ascending=False).astype(int)

    return df

# === Step 3: Store Results to Supabase ===
def store_classification(df):
    """Store classification results to Supabase."""
    if df.empty:
        print("⚠️ No classification data to store.")
        return

    try:
        # Optional: clear existing records
        supabase.table('product_classification').delete().neq('product_id', '').execute()
        print("🗑️ Old classification records cleared.")

        records = df[['product_id', 'location_id', 'classification_label',
                      'lead_time_category', 'variability_level', 'criticality', 'score']].to_dict(orient='records')

        for record in records:
            supabase.table('product_classification').upsert(record).execute()

        print("✅ Classification data stored successfully.")
    except Exception as e:
        print("❌ Failed to store classification:", str(e))

# === Step 4: Main ===
def main():
    print("🔄 Fetching product planning data...")
    df = fetch_all_data()
    if df.empty:
        print("⚠️ No data fetched, exiting.")
        return

    print("🚀 Running K-Means classification...")
    classified_df = classify_products(df)

    print("💾 Storing classification results...")
    store_classification(classified_df)

    print("🎯 Classification completed.")

if __name__ == "__main__":
    main()
