from typing import Dict
from backend.supabase.supabase_client import supabase


def calculate_buffer_profiles(item_id: str, average_daily_demand: float, decoupled_lead_time: float, min_order_quantity: float, variability_factor: float = 1.0) -> Dict[str, float]:
    """
    Calculate DDMRP buffer zones for a given item based on its average daily demand, decoupled lead time,
    and minimum order quantity.  The buffer zones are defined as:

    - Red zone: base stock covering demand during the decoupled lead time adjusted by a variability factor.
      The red zone is at least as large as the minimum order quantity.
    - Yellow zone: additional stock to protect against variability (typically half of the red zone).
    - Green zone: maximum stock level signaling when to stop replenishing (typically twice the red zone).

    The calculated buffer levels are upserted into the `buffers` table in Supabase.

    :param item_id: Identifier of the item.
    :param average_daily_demand: Estimated average daily demand for the item.
    :param decoupled_lead_time: The decoupled lead time in days.
    :param min_order_quantity: Minimum order quantity for the item.
    :param variability_factor: Factor to scale the red zone based on demand variability.
    :return: Dictionary containing the buffer levels for red, yellow, and green zones.
    """
    red_base = average_daily_demand * decoupled_lead_time * variability_factor
    red_zone = red_base if red_base > min_order_quantity else min_order_quantity
    yellow_zone = 0.5 * red_zone
    green_zone = 2.0 * red_zone

    buffer_levels = {
        "item_id": item_id,
        "red_zone": red_zone,
        "yellow_zone": yellow_zone,
        "green_zone": green_zone,
    }

    try:
        # Upsert buffer levels into Supabase (create or update the record)
        supabase.table("buffers").upsert(buffer_levels).execute()
    except Exception as e:
        # Log or handle the error as needed
        print(f"Error saving buffer profiles: {e}")

    return buffer_levels
