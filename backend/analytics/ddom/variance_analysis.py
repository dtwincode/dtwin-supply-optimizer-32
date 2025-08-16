"""
DDOM Variance Analysis module.

This module provides basic variance analysis for buffer performance in the Demand Driven Operating Model (DDOM).

The ``analyze_buffer_variance`` function accepts a pandas ``DataFrame`` with a
``level`` column representing buffer levels and returns a dictionary
containing the mean buffer level and its standard deviation.  The key
names are intentionally aligned with the API's ``VarianceResponse``
schema: ``mean_level`` and ``std_dev``.
"""

from typing import Dict

import pandas as pd


def analyze_buffer_variance(buffer_data: pd.DataFrame) -> Dict[str, float]:
    """Calculate basic variance metrics for buffer levels.

    Args:
        buffer_data: A pandas DataFrame with a ``level`` column representing
            buffer levels.

    Returns:
        A dictionary containing the mean buffer level (``mean_level``) and
        the standard deviation (``std_dev``) of the buffer levels.  The
        returned keys match the API's ``VarianceResponse`` model.
    """
    # Compute mean and standard deviation as floats to ensure JSON serialisability
    mean = float(buffer_data["level"].mean())
    std_dev = float(buffer_data["level"].std())

    return {"mean_level": mean, "std_dev": std_dev}