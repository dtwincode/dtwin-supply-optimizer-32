from supabase import create_client, Client

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# --- Test Query ---
def test_connection():
    try:
        response = supabase.table('demand_distribution_profile').select('*').limit(1).execute()
        print("✅ Supabase Connection Successful!")
        print("Sample Data:", response.data)
    except Exception as e:
        print("❌ Connection failed:", e)

if __name__ == "__main__":
    test_connection()
