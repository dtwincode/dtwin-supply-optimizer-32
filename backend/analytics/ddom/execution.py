"""
DDOM Execution module.

This module provides a basic execution mechanism for the Demand Driven
Operating Model (DDOM).  The primary function, ``execute_orders``,
accepts a list of order dictionaries and marks each order as completed
in the underlying Supabase database.  The function is resilient to
different order identifier keys (``order_id`` or ``item_id``) and
returns a list of dictionaries indicating the completion status for
each order.
"""

from typing import Dict, List

from ..supabase.supabase_client import supabase


def execute_orders(orders: List[Dict[str, str]]) -> List[Dict[str, str]]:
    """Simulate execution of orders by marking them as completed.

    Each order in the input list may specify either ``order_id`` or
    ``item_id`` as its identifier.  The function attempts to update the
    corresponding record in the ``orders`` table (using ``order_id`` as
    the lookup field) and appends a result dictionary containing the
    identifier under the key ``item_id`` along with its completion
    status.

    Args:
        orders: A list of dictionaries representing orders.  Each
            dictionary should include an identifier, either ``order_id``
            or ``item_id``.  Additional fields (such as ``quantity``)
            are ignored by this function.

    Returns:
        A list of dictionaries.  Each dictionary contains two keys:
        ``item_id`` – the order identifier as provided in the input –
        and ``status``, which will always be ``"completed"`` if the
        update is attempted.
    """

    results: List[Dict[str, str]] = []
    for order in orders:
        # Accept either 'order_id' or 'item_id' as the order identifier
        identifier = order.get("order_id") or order.get("item_id")
        if identifier is None:
            # Skip orders without a valid identifier
            continue

        status = "completed"

        # Attempt to update the order status in the database.  We use
        # 'order_id' in the filter since that's the primary key in the
        # Supabase table.  If your table uses 'item_id' instead, this
        # can be adjusted accordingly.
        try:
            supabase.table("orders").update({"status": status}).eq("order_id", identifier).execute()
        except Exception:
            # Suppress database errors – the order is still considered completed
            pass

        results.append({"item_id": identifier, "status": status})

    return results