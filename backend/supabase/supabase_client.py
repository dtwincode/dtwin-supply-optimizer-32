# backend/supabase/supabase_client.py

from supabase import create_client
import os
from dotenv import load_dotenv

# تحميل متغيرات البيئة من ملف .env
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    raise ValueError("Supabase credentials not set in .env")

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
