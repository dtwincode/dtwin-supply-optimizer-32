from typing import Optional, Dict
import pandas as pd
from backend.supabase.supabase_client import supabase


def calculate_decoupled_lead_time(item_id: str, demand_data: Optional[pd.DataFrame] = None) -> Dict[str, float]:
    """
    Calculate the decoupled lead time (DLT) for a given item.

    The decoupled lead time is the supply lead time plus manufacturing lead time.
    This function queries the 'items' table in Supabase for the item's lead times.
    If a demand_data DataFrame is provided, the function will also compute the average
    daily demand for the item.

    :param item_id: Identifier of the item to calculate DLT for.
    :param demand_data: Optional pandas DataFrame containing a 'demand' column with historical demand.
    :return: Dictionary containing the item_id, dlt, and avg_daily_demand (if available).
    """
    dlt = None
    avg_daily_demand = None

    try:
        response = supabase.table("items").select("*").eq("item_id", item_id).execute()
        if response and response.data:
            record = response.data[0]
            supply_lt = record.get("supply_lead_time", 0)
            manufacturing_lt = record.get("manufacturing_lead_time", 0)
            dlt = supply_lt + manufacturing_lt
    except Exception as e:
        # Log the error or handle it as needed
        print(f"Error fetching item data: {e}")

    if demand_data is not None and not demand_data.empty and "demand" in demand_data.columns:
        avg_daily_demand = demand_data["demand"].mean()

    return {"item_id": item_id, "dlt": dlt, "avg_daily_demand": avg_daily_demand}
