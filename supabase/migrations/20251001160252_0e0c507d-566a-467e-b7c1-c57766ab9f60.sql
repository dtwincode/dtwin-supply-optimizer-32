-- =========================================================
-- Complete DDMRP Schema - All Components in Correct Order
-- =========================================================

-- 1) Create Tables First
CREATE TABLE IF NOT EXISTS public.buffer_profile_master (
  buffer_profile_id text PRIMARY KEY,
  name text NOT NULL,
  description text,
  lt_factor numeric NOT NULL DEFAULT 1.0,
  variability_factor numeric NOT NULL DEFAULT 0.25,
  order_cycle_days numeric NOT NULL DEFAULT 7,
  min_order_qty numeric NOT NULL DEFAULT 0,
  rounding_multiple numeric NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.demand_adjustment_factor (
  product_id text NOT NULL,
  location_id text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  daf numeric NOT NULL DEFAULT 1.0,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT demand_adjustment_factor_pk PRIMARY KEY (product_id, location_id, start_date, end_date)
);

CREATE TABLE IF NOT EXISTS public.order_spike_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text,
  location_id text,
  horizon_days integer NOT NULL DEFAULT 30,
  spike_multiplier numeric NOT NULL DEFAULT 3.0,
  is_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.replenishment_orders (
  proposal_id bigserial PRIMARY KEY,
  product_id text NOT NULL,
  location_id text NOT NULL,
  proposal_ts timestamptz NOT NULL DEFAULT now(),
  qty_recommend numeric NOT NULL,
  reason text NOT NULL DEFAULT 'NFP <= TOY',
  source_view text NOT NULL DEFAULT 'ddmrp',
  status text NOT NULL DEFAULT 'DRAFT',
  target_due_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.buffer_breach_events (
  event_id bigserial PRIMARY KEY,
  product_id text NOT NULL,
  location_id text NOT NULL,
  breach_type text NOT NULL,
  detected_ts timestamptz NOT NULL DEFAULT now(),
  current_oh numeric,
  threshold numeric,
  severity text,
  acknowledged boolean DEFAULT false,
  acknowledged_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.on_hand_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text NOT NULL,
  location_id text NOT NULL,
  qty_on_hand numeric NOT NULL DEFAULT 0,
  snapshot_ts timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.open_pos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text NOT NULL,
  location_id text NOT NULL,
  ordered_qty numeric NOT NULL,
  received_qty numeric DEFAULT 0,
  status text NOT NULL DEFAULT 'OPEN',
  order_date date NOT NULL,
  expected_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.open_so (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text NOT NULL,
  location_id text NOT NULL,
  qty numeric NOT NULL,
  confirmed_date date NOT NULL,
  status text NOT NULL DEFAULT 'CONFIRMED',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Insert default buffer profile
INSERT INTO public.buffer_profile_master (buffer_profile_id, name, description)
VALUES ('BP_DEFAULT', 'Default', 'Default DDMRP factors')
ON CONFLICT (buffer_profile_id) DO NOTHING;

-- 2) Create Indexes
CREATE INDEX IF NOT EXISTS idx_ddmrp_daf_prod_loc ON public.demand_adjustment_factor (product_id, location_id);
CREATE INDEX IF NOT EXISTS idx_open_pos_status ON public.open_pos (status);
CREATE INDEX IF NOT EXISTS idx_open_so_date ON public.open_so (confirmed_date);
CREATE INDEX IF NOT EXISTS idx_buffer_breach_events_ts ON public.buffer_breach_events (detected_ts DESC);
CREATE INDEX IF NOT EXISTS idx_replenishment_orders_status ON public.replenishment_orders (status);
CREATE INDEX IF NOT EXISTS idx_on_hand_inventory_snapshot ON public.on_hand_inventory (product_id, location_id, snapshot_ts DESC);

-- 3) Create Views in Dependency Order
CREATE OR REPLACE VIEW public.daily_sales_base AS
SELECT
  s.product_id,
  s.location_id,
  s.sales_date::date AS sales_date,
  SUM(s.quantity_sold)::numeric AS qty
FROM public.historical_sales_data s
WHERE s.transaction_type = 'SALE'
GROUP BY s.product_id, s.location_id, s.sales_date::date;

CREATE OR REPLACE VIEW public.adu_90d_view AS
WITH windowed AS (
  SELECT d.product_id, d.location_id, d.sales_date, d.qty
  FROM public.daily_sales_base d
  WHERE d.sales_date >= (CURRENT_DATE - INTERVAL '90 day')
),
adj AS (
  SELECT
    w.product_id,
    w.location_id,
    w.sales_date,
    w.qty * COALESCE(
      (SELECT AVG(f.daf)
       FROM public.demand_adjustment_factor f
       WHERE f.product_id = w.product_id AND f.location_id = w.location_id
         AND w.sales_date BETWEEN f.start_date AND f.end_date), 1.0
    ) AS qty_adj
  FROM windowed w
)
SELECT
  a.product_id,
  a.location_id,
  COALESCE(SUM(a.qty_adj) / NULLIF(COUNT(*)::numeric, 0), 0)::numeric AS adu_adj,
  90::int AS window_days
FROM adj a
GROUP BY a.product_id, a.location_id;

CREATE OR REPLACE VIEW public.buffer_profile_selected AS
SELECT
  x.product_id,
  x.location_id,
  COALESCE(o.buffer_profile_id, 'BP_DEFAULT') AS buffer_profile_id
FROM (
  SELECT DISTINCT product_id, location_id FROM public.inventory_demand_variability
  UNION
  SELECT DISTINCT product_id, location_id FROM public.daily_sales_base
) x
LEFT JOIN public.buffer_profile_override o
  ON o.product_id = x.product_id AND o.location_id = x.location_id;

CREATE OR REPLACE VIEW public.inventory_ddmrp_buffers_view AS
WITH base AS (
  SELECT
    v.product_id,
    v.location_id,
    v.lead_time_days::numeric AS dlt,
    v.demand_variability::numeric AS variability,
    COALESCE(a.adu_adj, 0) AS adu_adj
  FROM public.inventory_demand_variability v
  LEFT JOIN public.adu_90d_view a
    ON a.product_id = v.product_id AND a.location_id = v.location_id
),
bp AS (
  SELECT
    s.product_id,
    s.location_id,
    m.buffer_profile_id,
    m.lt_factor,
    m.variability_factor,
    m.order_cycle_days,
    m.min_order_qty,
    m.rounding_multiple
  FROM public.buffer_profile_selected s
  JOIN public.buffer_profile_master m
    ON m.buffer_profile_id = s.buffer_profile_id
)
SELECT
  b.product_id,
  b.location_id,
  b.dlt,
  b.variability,
  b.adu_adj,
  p.buffer_profile_id,
  (b.adu_adj * b.dlt)::numeric AS yellow_zone,
  ((b.adu_adj * b.dlt * p.lt_factor))::numeric AS red_base,
  ((b.adu_adj * b.dlt * p.lt_factor) * p.variability_factor)::numeric AS red_safety,
  ((b.adu_adj * b.dlt * p.lt_factor) * (1 + p.variability_factor))::numeric AS red_zone,
  GREATEST(
    (b.adu_adj * p.order_cycle_days),
    (b.adu_adj * b.dlt * p.lt_factor),
    p.min_order_qty
  )::numeric AS green_zone,
  ((b.adu_adj * b.dlt * p.lt_factor) * (1 + p.variability_factor))::numeric AS tor,
  ((b.adu_adj * b.dlt * p.lt_factor) * (1 + p.variability_factor) + (b.adu_adj * b.dlt))::numeric AS toy,
  (((b.adu_adj * b.dlt * p.lt_factor) * (1 + p.variability_factor))
    + (b.adu_adj * b.dlt)
    + GREATEST(
        (b.adu_adj * p.order_cycle_days),
        (b.adu_adj * b.dlt * p.lt_factor),
        p.min_order_qty
      )
  )::numeric AS tog,
  p.lt_factor,
  p.variability_factor,
  p.order_cycle_days,
  p.min_order_qty,
  p.rounding_multiple
FROM base b
JOIN bp p ON p.product_id = b.product_id AND p.location_id = b.location_id;

CREATE OR REPLACE VIEW public.onhand_latest_view AS
WITH latest_oh AS (
  SELECT product_id, location_id, MAX(snapshot_ts) AS max_ts
  FROM public.on_hand_inventory
  GROUP BY product_id, location_id
)
SELECT i.product_id, i.location_id, i.qty_on_hand::numeric AS qty_on_hand
FROM public.on_hand_inventory i
JOIN latest_oh l
  ON l.product_id = i.product_id AND l.location_id = i.location_id AND l.max_ts = i.snapshot_ts;

CREATE OR REPLACE VIEW public.onorder_view AS
SELECT
  p.product_id,
  p.location_id,
  COALESCE(SUM(GREATEST(p.ordered_qty - COALESCE(p.received_qty,0), 0)), 0)::numeric AS qty_on_order
FROM public.open_pos p
WHERE COALESCE(p.status, 'OPEN') IN ('OPEN','PARTIAL')
GROUP BY p.product_id, p.location_id;

CREATE OR REPLACE VIEW public.qualified_demand_view AS
WITH horizon AS (
  SELECT
    COALESCE(product_id, '*') AS product_id,
    COALESCE(location_id, '*') AS location_id,
    MAX(horizon_days) AS horizon_days,
    BOOL_OR(is_enabled) AS enabled
  FROM public.order_spike_settings
  GROUP BY COALESCE(product_id, '*'), COALESCE(location_id, '*')
)
SELECT
  s.product_id,
  s.location_id,
  COALESCE(SUM(CASE
    WHEN s.confirmed_date <= CURRENT_DATE + MAKE_INTERVAL(days => COALESCE(h.horizon_days, 30))
         THEN s.qty ELSE 0 END), 0)::numeric AS qualified_demand
FROM public.open_so s
LEFT JOIN horizon h
  ON (h.product_id = s.product_id OR h.product_id = '*')
 AND (h.location_id = s.location_id OR h.location_id = '*')
GROUP BY s.product_id, s.location_id;

CREATE OR REPLACE VIEW public.inventory_net_flow_view AS
SELECT
  z.product_id,
  z.location_id,
  COALESCE(oh.qty_on_hand, 0) AS on_hand,
  COALESCE(oo.qty_on_order, 0) AS on_order,
  COALESCE(qd.qualified_demand, 0) AS qualified_demand,
  (COALESCE(oh.qty_on_hand, 0) + COALESCE(oo.qty_on_order, 0) - COALESCE(qd.qualified_demand, 0))::numeric AS nfp
FROM (SELECT DISTINCT product_id, location_id FROM public.inventory_ddmrp_buffers_view) z
LEFT JOIN public.onhand_latest_view oh ON oh.product_id = z.product_id AND oh.location_id = z.location_id
LEFT JOIN public.onorder_view oo ON oo.product_id = z.product_id AND oo.location_id = z.location_id
LEFT JOIN public.qualified_demand_view qd ON qd.product_id = z.product_id AND qd.location_id = z.location_id;

-- 4) Create Functions
CREATE OR REPLACE FUNCTION public.generate_replenishment(location_id_filter text DEFAULT NULL)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  r RECORD;
  inserted_count int := 0;
  qty_raw numeric;
  qty_rounded numeric;
  round_mult numeric;
  moq numeric;
  due_dt date;
BEGIN
  FOR r IN
    SELECT b.product_id, b.location_id, b.tor, b.toy, b.tog,
           b.rounding_multiple, b.min_order_qty, n.nfp, b.dlt
    FROM public.inventory_ddmrp_buffers_view b
    JOIN public.inventory_net_flow_view n USING (product_id, location_id)
    WHERE (location_id_filter IS NULL OR b.location_id = location_id_filter)
      AND n.nfp <= b.toy
  LOOP
    qty_raw := (r.tog - r.nfp);
    IF qty_raw <= 0 THEN CONTINUE; END IF;

    round_mult := COALESCE(NULLIF(r.rounding_multiple,0), 1);
    qty_rounded := CEIL(qty_raw / round_mult) * round_mult;

    moq := COALESCE(r.min_order_qty, 0);
    IF qty_rounded < moq THEN qty_rounded := moq; END IF;

    due_dt := CURRENT_DATE + (r.dlt::int);

    INSERT INTO public.replenishment_orders (product_id, location_id, qty_recommend, target_due_date)
    VALUES (r.product_id, r.location_id, qty_rounded, due_dt);

    inserted_count := inserted_count + 1;
  END LOOP;
  RETURN inserted_count;
END;
$$;

CREATE OR REPLACE FUNCTION public.detect_buffer_breaches()
RETURNS integer
LANGUAGE sql
AS $$
  WITH s AS (
    SELECT b.product_id, b.location_id, b.tor, b.toy, b.tog,
           n.nfp, n.on_hand
    FROM public.inventory_ddmrp_buffers_view b
    JOIN public.inventory_net_flow_view n USING (product_id, location_id)
  ),
  ins AS (
    INSERT INTO public.buffer_breach_events (product_id, location_id, breach_type, current_oh, threshold, severity)
    SELECT
      product_id, location_id,
      CASE WHEN nfp < tor THEN 'below_tor'
           WHEN nfp < toy THEN 'below_toy'
           WHEN nfp > tog THEN 'above_tog' END AS breach_type,
      on_hand,
      CASE WHEN nfp < tor THEN tor
           WHEN nfp < toy THEN toy
           WHEN nfp > tog THEN tog END AS threshold,
      CASE WHEN nfp < tor THEN 'HIGH'
           WHEN nfp < toy THEN 'MEDIUM'
           WHEN nfp > tog THEN 'LOW' END AS severity
    FROM s
    WHERE (nfp < tor OR nfp < toy OR nfp > tog)
    RETURNING 1
  )
  SELECT COALESCE(COUNT(*),0)::integer FROM ins;
$$;

CREATE OR REPLACE FUNCTION public.ddmrp_nightly()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM public.detect_buffer_breaches();
  PERFORM public.generate_replenishment(NULL);
END;
$$;

-- 5) Enable RLS and Create Policies
ALTER TABLE public.buffer_profile_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demand_adjustment_factor ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_spike_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.replenishment_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buffer_breach_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.on_hand_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.open_pos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.open_so ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'buffer_profile_master' AND policyname = 'Allow authenticated full access') THEN
    CREATE POLICY "Allow authenticated full access" ON public.buffer_profile_master FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'demand_adjustment_factor' AND policyname = 'Allow authenticated full access') THEN
    CREATE POLICY "Allow authenticated full access" ON public.demand_adjustment_factor FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'order_spike_settings' AND policyname = 'Allow authenticated full access') THEN
    CREATE POLICY "Allow authenticated full access" ON public.order_spike_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'replenishment_orders' AND policyname = 'Allow authenticated full access') THEN
    CREATE POLICY "Allow authenticated full access" ON public.replenishment_orders FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'buffer_breach_events' AND policyname = 'Allow authenticated full access') THEN
    CREATE POLICY "Allow authenticated full access" ON public.buffer_breach_events FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'on_hand_inventory' AND policyname = 'Allow authenticated full access') THEN
    CREATE POLICY "Allow authenticated full access" ON public.on_hand_inventory FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'open_pos' AND policyname = 'Allow authenticated full access') THEN
    CREATE POLICY "Allow authenticated full access" ON public.open_pos FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'open_so' AND policyname = 'Allow authenticated full access') THEN
    CREATE POLICY "Allow authenticated full access" ON public.open_so FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
END
$$;