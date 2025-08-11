"""
DDOM Capacity Scheduling module.
This module provides a basic capacity scheduling algorithm for the Demand Driven Operating Model (DDOM).
"""

from typing import List, Dict
from datetime import datetime, timedelta

from ..supabase.supabase_client import supabase


def schedule_capacity(demand: List[Dict[str, float]], capacity_per_day: float) -> List[Dict[str, float]]:
    """
    Simple capacity scheduling algorithm.
    :param demand: List of dictionaries with 'item_id' and 'quantity'.
    :param capacity_per_day: The available production capacity per day.
    :return: A list of scheduled orders with 'item_id', 'start_date' and 'quantity'.
    """
    schedule: List[Dict[str, float]] = []
    current_date = datetime.utcnow().date()
    available_capacity = capacity_per_day

    for order in demand:
        qty = order.get('quantity', 0)
        item_id = order.get('item_id')
        while qty > 0:
            if available_capacity <= 0:
                current_date += timedelta(days=1)
                available_capacity = capacity_per_day
            allocation = min(qty, available_capacity)
            schedule.append({
                'item_id': item_id,
                'start_date': current_date.isoformat(),
                'quantity': allocation
            })
            qty -= allocation
            available_capacity -= allocation

    # Insert schedule into Supabase table 'capacity_schedule' (if exists)
    try:
        supabase.table('capacity_schedule').insert(schedule).execute()
    except Exception:
        # ignore errors for now (table may not exist)
        pass

    return schedule
