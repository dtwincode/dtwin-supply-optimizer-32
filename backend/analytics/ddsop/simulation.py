"""
DDS&OP simulation module.
Provides functions to simulate DDOM performance under different scenarios.  DDS&OP
compliance requires the ability to run multiple what-if scenarios to compare
strategic decisions and assess system performance with respect to demand, capacity,
and inventory policies.
"""

from typing import List, Dict, Any

# Import capacity scheduling function from the DDOM analytics package
from ..ddom.capacity_scheduling import schedule_capacity


def simulate_ddom_performance(scenarios: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Run capacity scheduling simulations across multiple scenarios.

    Each scenario should be a dictionary with keys:
      - 'name': unique identifier for the scenario
      - 'orders': list of order dicts with 'item_id', 'quantity', and 'due_date'
      - 'capacity_per_day': integer representing daily capacity

    Returns a dictionary keyed by scenario name with the scheduled output from
    schedule_capacity.
    """
    results: Dict[str, Any] = {}
    for scenario in scenarios:
        name = scenario.get("name", "scenario")
        orders = scenario.get("orders", [])
        capacity = scenario.get("capacity_per_day", 0)
        try:
            schedule = schedule_capacity(orders=orders, capacity_per_day=capacity)
            results[name] = schedule
        except Exception as exc:
            # In production you would log the exception and include more details
            results[name] = {"error": str(exc)}
    return results
