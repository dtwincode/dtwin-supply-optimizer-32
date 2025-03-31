import pandas as pd
from sklearn.cluster import KMeans
from supabase import create_client, Client

# --- Supabase Credentials (Service Role Key) ---
SUPABASE_URL = "https://mttzjxktvbsixjaqiuxq.supabase.co"
SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10dHpqeGt0dmJzaXhqYXFpdXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTE2OTg0MSwiZXhwIjoyMDU0NzQ1ODQxfQ.xkL_emVJCkz3tWu75ad4x56aoOPJKHLLkr7SImBZuUc"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# --- Functions ---

def fetch_product_data():
    """Fetch product data from Supabase."""
    response = supabase.table('inventory_demand_variability').select('product_id, location_id, average_daily_usage, demand_variability').execute()
    data = response.data
    return pd.DataFrame(data)

def classify_products(df):
    """Apply K-Means Clustering to classify products."""
    features = df[['average_daily_usage', 'demand_variability']].fillna(0)
    kmeans = KMeans(n_clusters=3, random_state=42)
    df['cluster_id'] = kmeans.fit_predict(features)
    df['classification_label'] = df['cluster_id'].apply(lambda x: f"Class_{x+1}")
    return df

def store_classification(df):
    """Store classification results to Supabase table."""
    # Clear existing records
    supabase.table('product_classification').delete().neq('product_id', '').execute()

    # Insert new classification
    records = df[['product_id', 'location_id', 'classification_label', 'cluster_id']].to_dict(orient='records')
    for record in records:
        supabase.table('product_classification').insert(record).execute()

def main():
    print("🔄 Fetching product data...")
    df = fetch_product_data()
    print(f"✅ Fetched {len(df)} records.")

    print("🚀 Running K-Means classification...")
    classified_df = classify_products(df)

    print("💾 Saving classification result to Supabase...")
    store_classification(classified_df)

    print("🎯 Product classification completed successfully.")

if __name__ == "__main__":
    main()
