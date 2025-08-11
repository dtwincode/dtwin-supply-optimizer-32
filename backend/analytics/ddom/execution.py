"""
DDOM Execution module.
This module provides a basic execution mechanism for the Demand Driven Operating Model (DDOM).
"""

from typing import List, Dict

from ..supabase.supabase_client import supabase


def execute_orders(orders: List[Dict[str, str]]) -> List[Dict[str, str]]:
    """
    Simulate execution of orders by marking them as completed in the database.
    :param orders: List of order dictionaries with 'order_id'.
    :return: List of dictionaries containing 'order_id' and 'status'.
    """
    results: List[Dict[str, str]] = []
    for order in orders:
        order_id = order.get('order_id')
        status = 'completed'
        try:
            supabase.table('orders').update({'status': status}).eq('order_id', order_id).execute()
        except Exception:
            pass
        results.append({'order_id': order_id, 'status': status})
    return results
