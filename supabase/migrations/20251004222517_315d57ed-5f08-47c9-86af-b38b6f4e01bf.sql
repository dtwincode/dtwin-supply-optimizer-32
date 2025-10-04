-- Enable RLS on the materialized view
ALTER MATERIALIZED VIEW component_demand_view OWNER TO postgres;

-- Grant access to authenticated users
GRANT SELECT ON component_demand_view TO authenticated;
GRANT SELECT ON component_demand_view TO anon;