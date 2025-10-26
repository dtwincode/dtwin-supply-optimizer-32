"""
Bullwhip Effect Analysis Module

Calculates demand amplification (bullwhip effect) for product-location pairs
to support 9-factor decoupling point scoring.

Bullwhip Ratio = Order Variability / Customer Demand Variability
"""

from datetime import datetime, timedelta
from typing import Dict, Optional
import pandas as pd
import numpy as np
from backend.supabase.supabase_client import supabase


def calculate_bullwhip_analysis(
    product_id: str, 
    location_id: str, 
    analysis_days: int = 90
) -> Dict:
    """
    Calculate bullwhip effect for a product-location pair.
    
    Bullwhip Ratio measures how much order variability exceeds customer demand variability.
    A ratio > 1.0 indicates demand amplification (the bullwhip effect).
    
    Args:
        product_id: Product identifier
        location_id: Location identifier
        analysis_days: Number of days to analyze (default: 90)
    
    Returns:
        Dictionary with bullwhip metrics and scoring
    """
    end_date = datetime.now().date()
    start_date = end_date - timedelta(days=analysis_days)
    
    # Get customer demand (actual sales)
    sales_response = supabase.table("historical_sales_data") \
        .select("sales_date, quantity_sold") \
        .eq("product_id", product_id) \
        .eq("location_id", location_id) \
        .gte("sales_date", start_date.isoformat()) \
        .lte("sales_date", end_date.isoformat()) \
        .execute()
    
    # Get orders placed to supplier
    po_response = supabase.table("open_pos") \
        .select("order_date, ordered_qty") \
        .eq("product_id", product_id) \
        .eq("location_id", location_id) \
        .gte("order_date", start_date.isoformat()) \
        .lte("order_date", end_date.isoformat()) \
        .execute()
    
    if not sales_response.data or not po_response.data:
        return {
            "status": "insufficient_data",
            "message": f"Insufficient data for {product_id} at {location_id}",
            "bullwhip_ratio": 1.0,
            "bullwhip_score": 50
        }
    
    # Calculate customer demand variability
    demand_df = pd.DataFrame(sales_response.data)
    demand_mean = demand_df['quantity_sold'].mean()
    demand_std = demand_df['quantity_sold'].std()
    demand_cv = demand_std / demand_mean if demand_mean > 0 else 0
    
    # Calculate order variability
    order_df = pd.DataFrame(po_response.data)
    order_mean = order_df['ordered_qty'].mean()
    order_std = order_df['ordered_qty'].std()
    order_cv = order_std / order_mean if order_mean > 0 else 0
    
    # Bullwhip Ratio (order CV / demand CV)
    bullwhip_ratio = order_cv / demand_cv if demand_cv > 0 else 1.0
    
    # Score (0-100 scale, higher ratio = higher score = more need for decoupling)
    score = _calculate_bullwhip_score(bullwhip_ratio)
    
    # Upsert into database
    try:
        supabase.table("bullwhip_analysis").upsert({
            "product_id": product_id,
            "location_id": location_id,
            "analysis_period_start": start_date.isoformat(),
            "analysis_period_end": end_date.isoformat(),
            "customer_demand_mean": float(demand_mean),
            "customer_demand_std_dev": float(demand_std),
            "order_qty_mean": float(order_mean),
            "order_qty_std_dev": float(order_std),
            "bullwhip_score": score
        }, on_conflict="product_id,location_id,analysis_period_end").execute()
    except Exception as e:
        print(f"Error upserting bullwhip analysis: {e}")
    
    return {
        "status": "success",
        "product_id": product_id,
        "location_id": location_id,
        "bullwhip_ratio": round(bullwhip_ratio, 2),
        "customer_demand_cv": round(demand_cv, 3),
        "order_qty_cv": round(order_cv, 3),
        "customer_demand_mean": round(demand_mean, 2),
        "order_qty_mean": round(order_mean, 2),
        "bullwhip_score": score,
        "interpretation": _get_interpretation(bullwhip_ratio),
        "analysis_period": {
            "start": start_date.isoformat(),
            "end": end_date.isoformat(),
            "days": analysis_days
        }
    }


def _calculate_bullwhip_score(ratio: float) -> int:
    """
    Convert bullwhip ratio to a 0-100 score.
    
    Based on DDMRP principles (Ptak & Smith):
    - Ratio >= 1.5 indicates critical need for decoupling
    - Higher ratios = higher scores (more need for buffer)
    """
    if ratio >= 3.0:
        return 100  # Severe amplification
    elif ratio >= 2.0:
        return 85   # High amplification
    elif ratio >= 1.5:
        return 70   # Moderate amplification
    elif ratio >= 1.2:
        return 50   # Mild amplification
    elif ratio >= 1.0:
        return 30   # Minimal amplification
    else:
        return 20   # No amplification


def _get_interpretation(ratio: float) -> str:
    """Return human-readable interpretation of bullwhip ratio."""
    if ratio >= 3.0:
        return "CRITICAL: Severe demand amplification - immediate decoupling required"
    elif ratio >= 2.0:
        return "HIGH: Significant amplification - strong decoupling candidate"
    elif ratio >= 1.5:
        return "MODERATE: Noticeable amplification - consider decoupling"
    elif ratio >= 1.2:
        return "MILD: Minor amplification - monitor closely"
    elif ratio >= 1.0:
        return "LOW: Minimal amplification - low decoupling priority"
    else:
        return "NONE: No amplification detected"


def batch_calculate_bullwhip(
    product_location_pairs: list = None,
    analysis_days: int = 90,
    min_data_points: int = 30
) -> Dict:
    """
    Calculate bullwhip effect for multiple product-location pairs in batch.
    
    Args:
        product_location_pairs: List of tuples [(product_id, location_id), ...]
                                If None, analyze all decoupling points
        analysis_days: Number of days to analyze
        min_data_points: Minimum number of data points required
    
    Returns:
        Dictionary with batch results and summary statistics
    """
    if product_location_pairs is None:
        # Get all decoupling points
        dp_response = supabase.table("decoupling_points") \
            .select("product_id, location_id") \
            .execute()
        
        if not dp_response.data:
            return {"status": "no_decoupling_points", "results": []}
        
        product_location_pairs = [
            (dp["product_id"], dp["location_id"]) 
            for dp in dp_response.data
        ]
    
    results = []
    critical_count = 0
    high_count = 0
    moderate_count = 0
    
    for product_id, location_id in product_location_pairs:
        result = calculate_bullwhip_analysis(
            product_id, 
            location_id, 
            analysis_days
        )
        results.append(result)
        
        if result["status"] == "success":
            ratio = result["bullwhip_ratio"]
            if ratio >= 3.0:
                critical_count += 1
            elif ratio >= 2.0:
                high_count += 1
            elif ratio >= 1.5:
                moderate_count += 1
    
    return {
        "status": "success",
        "total_analyzed": len(results),
        "successful": len([r for r in results if r["status"] == "success"]),
        "insufficient_data": len([r for r in results if r["status"] == "insufficient_data"]),
        "summary": {
            "critical_items": critical_count,
            "high_items": high_count,
            "moderate_items": moderate_count,
            "avg_ratio": round(
                sum(r["bullwhip_ratio"] for r in results if r["status"] == "success") / 
                max(1, len([r for r in results if r["status"] == "success"])),
                2
            )
        },
        "results": results
    }


def get_top_bullwhip_candidates(limit: int = 20) -> list:
    """
    Get top products with highest bullwhip ratios (best decoupling candidates).
    
    Args:
        limit: Maximum number of results to return
    
    Returns:
        List of products sorted by bullwhip ratio (descending)
    """
    response = supabase.table("bullwhip_analysis") \
        .select("*") \
        .order("bullwhip_ratio", desc=True) \
        .limit(limit) \
        .execute()
    
    return response.data if response.data else []


def analyze_bullwhip_by_location(location_id: str) -> Dict:
    """
    Analyze bullwhip effect for all products at a specific location.
    
    Args:
        location_id: Location identifier
    
    Returns:
        Dictionary with location-level bullwhip statistics
    """
    response = supabase.table("bullwhip_analysis") \
        .select("*") \
        .eq("location_id", location_id) \
        .execute()
    
    if not response.data:
        return {
            "status": "no_data",
            "location_id": location_id
        }
    
    df = pd.DataFrame(response.data)
    
    return {
        "status": "success",
        "location_id": location_id,
        "total_products": len(df),
        "avg_bullwhip_ratio": round(df["bullwhip_ratio"].mean(), 2),
        "max_bullwhip_ratio": round(df["bullwhip_ratio"].max(), 2),
        "critical_products": len(df[df["bullwhip_ratio"] >= 2.0]),
        "products_with_amplification": len(df[df["bullwhip_ratio"] > 1.0]),
        "top_5_products": df.nlargest(5, "bullwhip_ratio")[
            ["product_id", "bullwhip_ratio", "bullwhip_score"]
        ].to_dict("records")
    }
