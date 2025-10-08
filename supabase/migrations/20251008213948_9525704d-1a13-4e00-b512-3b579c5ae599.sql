-- Drop unnecessary views that duplicate data from inventory_planning_view
DROP VIEW IF EXISTS public.buffer_status_summary;
DROP VIEW IF EXISTS public.execution_priority_view;

-- inventory_planning_view already contains all needed data:
-- buffer_status, nfp, tor, toy, tog, on_hand, lead_time_days, etc.