"""
DDMRP Buffer Profile Calculation.

This module provides a function to calculate buffer profiles for a
Demand‑Driven Material Requirements Planning (DDMRP) system.  The
calculation determines three buffer zones – red, yellow, and green –
based on an item's average daily demand, decoupled lead time,
minimum order quantity and a variability factor.  The calculated
profiles are upserted into the ``buffers`` table of the Supabase
database.  Only the buffer zone values are returned to the caller; the
item identifier is used internally for persistence but is omitted
from the response to align with the API's ``BufferProfileResponse``
schema.
"""

from typing import Dict

from backend.supabase.supabase_client import supabase


def calculate_buffer_profiles(
    item_id: str,
    average_daily_demand: float,
    decoupled_lead_time: float,
    min_order_quantity: float,
    variability_factor: float = 1.0,
) -> Dict[str, float]:
    """Calculate DDMRP buffer zones for a given item.

    The red zone represents base stock covering demand during the
    decoupled lead time adjusted by the variability factor and
    constrained by the minimum order quantity.  The yellow zone is set
    to half of the red zone, and the green zone is twice the red zone.

    Args:
        item_id: Identifier for the item.
        average_daily_demand: Estimated average daily demand for the item.
        decoupled_lead_time: The decoupled lead time in days.
        min_order_quantity: Minimum order quantity for the item.
        variability_factor: Factor to scale the red zone based on demand
            variability.  Defaults to ``1.0``.

    Returns:
        A dictionary containing the calculated buffer levels with keys
        ``red_zone``, ``yellow_zone`` and ``green_zone``.
    """

    # Compute base stock for the red zone
    red_base = average_daily_demand * decoupled_lead_time * variability_factor
    red_zone = red_base if red_base > min_order_quantity else min_order_quantity

    # Yellow zone is typically half of the red zone
    yellow_zone = 0.5 * red_zone

    # Green zone signals when to stop replenishment (typically twice the red zone)
    green_zone = 2.0 * red_zone

    # Prepare a record to upsert into Supabase.  Include the item_id so
    # that the record can be keyed correctly, but do not return it to
    # the caller – the API response model does not include item_id.
    buffer_record = {
        "item_id": item_id,
        "red_zone": red_zone,
        "yellow_zone": yellow_zone,
        "green_zone": green_zone,
    }

    try:
        # Upsert the buffer levels into Supabase
        supabase.table("buffers").upsert(buffer_record).execute()
    except Exception as e:
        # Log or handle the error as needed but do not interrupt the API response
        print(f"Error saving buffer profiles: {e}")

    # Return only the zone values to align with the API's response model
    return {
        "red_zone": red_zone,
        "yellow_zone": yellow_zone,
        "green_zone": green_zone,
    }