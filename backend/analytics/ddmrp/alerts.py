from supabase import create_client
from dotenv import load_dotenv
import os
import datetime

# Load environment variables
load_dotenv()

# Initialize Supabase client
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

supabase = None
if SUPABASE_URL and SUPABASE_SERVICE_KEY:
    supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


def generate_alerts():
    """
    Generate alerts based on the current net flow status.

    This function checks the `net_flow` table for items whose net flow status is
    in the red or yellow zone. For each such item, it creates an alert record
    with the appropriate severity (e.g., critical for red, warning for yellow)
    and inserts these records into the `alerts` table.

    Returns:
        list: A list of generated alerts dictionaries, or an empty list if none
              are created.
    """
    if supabase is None:
        raise RuntimeError("Supabase client is not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_KEY in the environment.")

    # Fetch net flow data
    response = supabase.table("net_flow").select("*").execute()
    data = response.data if hasattr(response, "data") else None
    if not data:
        return []

    alerts = []
    for record in data:
        color = record.get("color")
        item_id = record.get("item_id")
        if not color or not item_id:
            continue

        if color.lower() in ["red", "yellow"]:
            alert_type = "critical" if color.lower() == "red" else "warning"
            message = f"Item {item_id} net flow is in {color} zone"
            alerts.append({
                "item_id": item_id,
                "alert_type": alert_type,
                "color": color,
                "message": message,
                "created_at": datetime.datetime.utcnow().isoformat()
            })

    if alerts:
        supabase.table("alerts").insert(alerts).execute()

    return alerts
