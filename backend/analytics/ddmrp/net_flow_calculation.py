from typing import Dict, Optional

from backend.supabase.supabase_client import supabase


def calculate_net_flow(item_id: str, on_hand: float, open_supply: float, qualified_demand: float, buffer_levels: Optional[Dict[str, float]] = None) -> Dict[str, float]:
    """
    Calculate the net flow position and color for a given item based on DDMRP principles.

    Net flow is defined as on_hand + open_supply - qualified_demand. The resulting
    color is determined relative to the item's buffer levels:
    - red: stock is below zero or less than one third of total buffer
    - yellow: stock is between one third and two thirds of total buffer
    - green: stock is within the buffer range
    - blue: stock exceeds buffer range

    :param item_id: Identifier of the item.
    :param on_hand: Current on-hand inventory quantity.
    :param open_supply: Quantity of open supply (e.g., orders in transit).
    :param qualified_demand: Qualified demand over the planning horizon.
    :param buffer_levels: Optional dictionary containing 'red_zone', 'yellow_zone', and 'green_zone'.
    :return: Dictionary containing the net_flow value, ratio relative to total buffer, and color.
    """
    # If buffer levels are not provided, attempt to fetch them from the database
    if buffer_levels is None:
        try:
            response = supabase.table("buffers").select("*").eq("item_id", item_id).execute()
            if response and response.data:
                buffer_levels = response.data[0]
        except Exception as e:
            print(f"Error fetching buffer levels: {e}")
            buffer_levels = None

    net_flow = on_hand + open_supply - qualified_demand
    color = "green"
    ratio: Optional[float] = None

    if buffer_levels:
        red = buffer_levels.get("red_zone", 0)
        yellow = buffer_levels.get("yellow_zone", 0)
        green = buffer_levels.get("green_zone", 0)
        total_buffer = red + yellow + green

        if total_buffer > 0:
            ratio = net_flow / total_buffer

        # Determine color based on net flow relative to buffer zones
        if net_flow < 0:
            color = "red"
        elif ratio is not None:
            if ratio < 0.33:
                color = "red"
            elif ratio < 0.66:
                color = "yellow"
            elif ratio < 1.0:
                color = "green"
            else:
                color = "blue"
    else:
        color = "unknown"

    result = {
        "item_id": item_id,
        "net_flow": net_flow,
        "ratio": ratio,
        "color": color,
    }

    try:
        supabase.table("net_flow").upsert(result).execute()
    except Exception as e:
        print(f"Error saving net flow calculation: {e}")

    return result
