from backend.supabase.supabase_client import supabase
from typing import Dict, Optional
import pandas as pd

def calculate_decoupled_lead_time(item_id: str, demand_data: Optional[pd.DataFrame] = None) -> Dict[str, float]:
    """
    Calculate the decoupled lead time (DLT) for a given item.
    The DLT is the sum of the supply lead time and manufacturing lead time.
    If a demand_data DataFrame is provided, the average daily demand will also be calculated.

    Args:
        item_id: Identifier of the item to calculate DLT for.
        demand_data: Optional pandas DataFrame containing a 'demand' column with historical demand.

    Returns:
        Dictionary containing the item_id, decoupled_lead_time, and avg_daily_demand (if available).
    """
    dlt: Optional[float] = None
    avg_daily_demand: Optional[float] = None

    try:
        response = supabase.table("items").select("supply_lead_time, manufacturing_lead_time").eq("item_id", item_id).execute()
        if response and response.data:
            record = response.data[0]
            supply_lt = record.get("supply_lead_time", 0)
            manufacturing_lt = record.get("manufacturing_lead_time", 0)
            dlt = supply_lt + manufacturing_lt
    except Exception as e:
        # Log the error or handle it as needed
        print(f"Error fetching item data: {e}")

    # Calculate average daily demand if demand data is provided
    if demand_data is not None and "demand" in demand_data.columns:
        avg_daily_demand = float(demand_data["demand"].mean())

    return {
        "item_id": item_id,
        "decoupled_lead_time": dlt,
        "avg_daily_demand": avg_daily_demand,
    }
