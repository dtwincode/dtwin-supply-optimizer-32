"""DDSOP analytics package.

Exposes functions for master settings management, variance analysis, and simulation
of DDOM performance. These utilities support higher-level DDS&OP planning and
performance evaluation.
"""

from .master_settings import get_master_settings, upsert_master_settings
from .variance_analysis import perform_variance_analysis
from .simulation import simulate_ddom_performance

__all__ = [
    "get_master_settings",
    "upsert_master_settings",
    "perform_variance_analysis",
    "simulate_ddom_performance",
]
