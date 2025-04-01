import pandas as pd
from sklearn.cluster import KMeans
from supabase import create_client, Client

# === Supabase Credentials ===
SUPABASE_URL = "https://mttzjxktvbsixjaqiuxq.supabase.co"
SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10dHpqeGt0dmJzaXhqYXFpdXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTE2OTg0MSwiZXhwIjoyMDU0NzQ1ODQxfQ.xkL_emVJCkz3tWu75ad4x56aoOPJKHLLkr7SImBZuUc"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# === Functions ===

def fetch_product_data():
    """Fetch product demand data from Supabase."""
    response = supabase.table('inventory_demand_variability').select('product_id, location_id, average_daily_usage, demand_variability').execute()
    data = response.data
    return pd.DataFrame(data)

def classify_products(df):
    """Apply K-Means Clustering and prepare classification attributes."""
    # Handle empty data
    if df.empty:
        return df

    # === K-Means Classification ===
    features = df[['average_daily_usage', 'demand_variability']].fillna(0)
    kmeans = KMeans(n_clusters=3, random_state=42)
    df['cluster_id'] = kmeans.fit_predict(features)
    df['classification_label'] = df['cluster_id'].apply(lambda x: f"Class_{x+1}")

    # === Add additional attributes ===
    df['lead_time_category'] = 'Normal'  # Optional: You can automate later
    df['variability_level'] = pd.cut(df['demand_variability'],
                                     bins=[-1, 0.3, 0.6, 1000],
                                     labels=['Low', 'Medium', 'High'])
    df['criticality'] = df['classification_label'].map({
        'Class_1': 'High',
        'Class_2': 'Medium',
        'Class_3': 'Low'
    })
    df['score'] = df['average_daily_usage'].rank(ascending=False).astype(int)

    return df

def store_classification(df):
    """Store classification results to Supabase table."""
    # Clear existing records
    supabase.table('product_classification').delete().neq('product_id', '').execute()

    # Insert new classification
    records = df[['product_id', 'location_id', 'classification_label',
                  'lead_time_category', 'variability_level', 'criticality', 'score']].to_dict(orient='records')

    for record in records:
        supabase.table('product_classification').upsert(record).execute()

def main():
    print("🔄 Fetching product demand data...")
    df = fetch_product_data()
    print(f"✅ Fetched {len(df)} records.")

    if df.empty:
        print("⚠️ No data found. Exiting.")
        return

    print("🚀 Running K-Means classification...")
    classified_df = classify_products(df)

    print("💾 Storing classification results to Supabase...")
    store_classification(classified_df)

    print("🎯 Product classification completed successfully.")

if __name__ == "__main__":
    main()
