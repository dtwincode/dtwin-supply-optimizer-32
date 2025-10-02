-- Fix generate_replenishment function to use correct column names from inventory_ddmrp_buffers_view
CREATE OR REPLACE FUNCTION public.generate_replenishment(location_id_filter text DEFAULT NULL::text)
RETURNS integer
LANGUAGE plpgsql
AS $function$
DECLARE
  r RECORD;
  inserted_count int := 0;
  qty_raw numeric;
  qty_rounded numeric;
  round_mult numeric;
  moq_val numeric;
  due_dt date;
BEGIN
  FOR r IN
    SELECT b.product_id, b.location_id, b.tor, b.toy, b.tog,
           b.rounding_multiple, b.moq, n.nfp, b.dlt
    FROM public.inventory_ddmrp_buffers_view b
    JOIN public.inventory_net_flow_view n USING (product_id, location_id)
    WHERE (location_id_filter IS NULL OR b.location_id = location_id_filter)
      AND n.nfp <= b.toy
  LOOP
    qty_raw := (r.tog - r.nfp);
    IF qty_raw <= 0 THEN CONTINUE; END IF;

    round_mult := COALESCE(NULLIF(r.rounding_multiple,0), 1);
    qty_rounded := CEIL(qty_raw / round_mult) * round_mult;

    moq_val := COALESCE(r.moq, 0);
    IF qty_rounded < moq_val THEN qty_rounded := moq_val; END IF;

    due_dt := CURRENT_DATE + (r.dlt::int);

    INSERT INTO public.replenishment_orders (product_id, location_id, qty_recommend, target_due_date)
    VALUES (r.product_id, r.location_id, qty_rounded, due_dt);

    inserted_count := inserted_count + 1;
  END LOOP;
  RETURN inserted_count;
END;
$function$;