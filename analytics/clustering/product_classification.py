def classify_products(df):
    """Apply K-Means Clustering and assign classification labels (Green, Yellow, Red)."""
    if df.empty:
        print("⚠️ No data to classify.")
        return df

    # 1. Prepare features
    features = df[['average_daily_usage', 'demand_variability']].fillna(0)

    # 2. Fit KMeans
    kmeans = KMeans(n_clusters=3, random_state=42)
    df['cluster_id'] = kmeans.fit_predict(features)
    
    # 3. Compute risk score per cluster
    import numpy as np
    centroids = kmeans.cluster_centers_
    risk_scores = [np.sum(c) for c in centroids]  # simple sum: higher means more risky
    sorted_clusters = np.argsort(risk_scores)  # low to high

    # 4. Map cluster_id to classification label
    color_map = ['Green', 'Yellow', 'Red']  # low → high risk
    cluster_to_label = {cluster_id: color_map[idx] for idx, cluster_id in enumerate(sorted_clusters)}
    df['classification_label'] = df['cluster_id'].map(cluster_to_label)

    # 5. Derive other fields
    df['lead_time_category'] = 'Normal'  # or derive if you have lead time data
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
