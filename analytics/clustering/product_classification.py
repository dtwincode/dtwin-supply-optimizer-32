import pandas as pd
from sklearn.cluster import KMeans
from supabase import create_client, Client

# === Supabase Credentials ===
SUPABASE_URL = "https://mttzjxktvbsixjaqiuxq.supabase.co"
SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10dHpqeGt0dmJzaXhqYXFpdXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTE2OTg0MSwiZXhwIjoyMDU0NzQ1ODQxfQ.xkL_emVJCkz3tWu75ad4x56aoOPJKHLLkr7SImBZuUc"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# === Functions ===

def fetch_product_data():
    """Fetch product demand data from inventory_planning_view."""
    try:
        response = supabase.table('inventory_planning_view').select(
            'product_id, location_id, average_daily_usage, demand_variability'
        ).execute()
        data = response.data
        return pd.DataFrame(data)
    except Exception as e:
        print("❌ Failed to fetch data:", str(e))
        return pd.DataFrame()

def classify_products(df):
    """Apply K-Means Clustering and prepare classification attributes."""
    if df.empty:
        print("⚠️ No data to classify.")
        return df

    features = df[['average_daily_usage', 'demand_variability']].fillna(0)
    kmeans = KMeans(n_clusters=3, random_state=42)
    df['cluster_id'] = kmeans.fit_predict(features)
    df['classification_label'] = df['cluster_id'].apply(lambda x: f"Class_{x+1}")

    df['lead_time_category'] = 'Normal'
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
    if df.empty:
        print("⚠️ No classification data to store.")
        return

    try:
        # Optional: Clear old records
        supabase.table('product_classification').delete().neq('product_id', '').execute()
        print("🗑️ Old classification data cleared.")

        # Insert new classification
        records = df[['product_id', 'location_id', 'classification_label',
                      'lead_time_category', 'variability_level', 'criticality', 'score']].to_dict(orient='records')

        for record in records:
            supabase.table('product_classification').upsert(record).execute()

        print("✅ Classification data stored successfully.")
    except Exception as e:
        print("❌ Failed to store classification:", str(e))

def main():
    print("🔄 Fetching product planning data...")
    df = fetch_product_data()
    print(f"✅ Fetched {len(df)} records.")

    if df.empty:
        return

    print("🚀 Running K-Means classification...")
    classified_df = classify_products(df)

    print("💾 Storing classification results to Supabase...")
    store_classification(classified_df)

    print("🎯 Product classification completed successfully.")

if __name__ == "__main__":
    main()
