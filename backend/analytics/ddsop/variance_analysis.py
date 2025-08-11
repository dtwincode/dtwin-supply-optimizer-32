"""
DDS&OP variance analysis module.
This module contains functions to perform variance analysis on planned versus actual
demand, capacity, and inventory levels. DDS&OP compliance requires the ability to
review and compare expected results against actual outcomes, providing insights
for continuous improvement of DDOM and DDMRP implementations.
"""

from typing import Dict, Any
import pandas as pd


def perform_variance_analysis(plan_data: pd.DataFrame, actual_data: pd.DataFrame) -> Dict[str, Any]:
    """Calculate variance statistics between planned and actual datasets.

    Args:
        plan_data: A pandas DataFrame containing planned values. Column names should correspond to metrics (e.g., 'demand', 'capacity', 'inventory').
        actual_data: A pandas DataFrame containing actual values with the same columns as plan_data.

    Returns:
        A dictionary where keys are metric names appended with a statistic type (mean_diff, std_diff) and values are the computed floats.
    """
    metrics: Dict[str, Any] = {}
    # Ensure that we operate only on the intersection of columns
    common_cols = [col for col in plan_data.columns if col in actual_data.columns]
    for col in common_cols:
        diff_series = actual_data[col] - plan_data[col]
        metrics[f"{col}_mean_diff"] = diff_series.mean()
        metrics[f"{col}_std_diff"] = diff_series.std()
    return metrics
