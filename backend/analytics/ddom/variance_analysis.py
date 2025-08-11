"""
DDOM Variance Analysis module.
This module provides basic variance analysis for buffer performance in the Demand Driven Operating Model (DDOM).
"""

from typing import Dict
import pandas as pd


def analyze_buffer_variance(buffer_data: pd.DataFrame) -> Dict[str, float]:
    """
    Calculate basic variance metrics for buffer levels.
    :param buffer_data: DataFrame with a 'level' column representing buffer levels.
    :return: Dictionary with mean and standard deviation of the buffer levels.
    """
    mean = float(buffer_data['level'].mean())
    std_dev = float(buffer_data['level'].std())
    return {'mean': mean, 'std_dev': std_dev}
