from typing import Dict
from backend.supabase.supabase_client import supabase


def adjust_buffer_levels(item_id: str, adjustment_factor: float) -> Dict[str, float]:
    """
    Dynamically adjust buffer levels for an item using an adjustment factor.

    This function fetches the current buffer levels for the specified item from the
    `buffers` table, multiplies each zone by the adjustment factor, and upserts
    the updated values back into the database.

    :param item_id: Identifier of the item whose buffers should be adjusted.
    :param adjustment_factor: Multiplier to apply to each buffer zone.
    :return: A dictionary containing the updated buffer levels. If the item is not found,
        an empty dictionary is returned.
    """
    updated_levels: Dict[str, float] = {}

    try:
        response = supabase.table("buffers").select("*").eq("item_id", item_id).execute()
        if response and response.data:
            record = response.data[0]
            updated_levels = {
                "item_id": item_id,
                "red_zone": record.get("red_zone", 0) * adjustment_factor,
                "yellow_zone": record.get("yellow_zone", 0) * adjustment_factor,
                "green_zone": record.get("green_zone", 0) * adjustment_factor,
            }
            # Upsert the updated buffer levels back into the database
            supabase.table("buffers").upsert(updated_levels).execute()
    except Exception as e:
        print(f"Error adjusting buffer levels: {e}")

    return updated_levels
