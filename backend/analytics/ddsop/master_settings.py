"""
DDS&OP master settings module.
This module provides functions to retrieve master settings for DDOM and DDS&OP, such as buffer factors,
lead times, and capacity parameters. These settings are typically configured by supply chain planners
and should be stored in a central table. Access to these values supports DDS&OP compliance, which
requires visibility into DDOM master settings as part of sales and operations planning.
"""

import os
from typing import List, Dict, Any

from supabase import create_client
from dotenv import load_dotenv

# Load environment variables from .env file for local development
load_dotenv()

# Initialize the Supabase client using environment variables
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

supabase = None
if SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY:
    supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)


def get_master_settings() -> List[Dict[str, Any]]:
    """Fetch master settings for DDOM/DDS&OP from the database.

    Returns a list of dictionaries representing settings. If no settings are found or
    the Supabase client is not configured, returns an empty list.
    """
    if supabase is None:
        return []
    try:
        response = supabase.table("ddom_master_settings").select("*").execute()
        data = response.data or []
        # You might want to post-process or validate the settings here
        return data
    except Exception:
        # In a production system you would log the exception
        return []


def upsert_master_settings(settings: List[Dict[str, Any]]) -> bool:
    """Upsert a list of master settings into the database.

    Args:
        settings: A list of dictionaries containing settings with keys matching the database schema.

    Returns:
        True if the operation succeeds, False otherwise.
    """
    if supabase is None:
        return False
    try:
        # Upsert ensures existing records are updated and new ones inserted
        supabase.table("ddom_master_settings").upsert(settings).execute()
        return True
    except Exception:
        return False
