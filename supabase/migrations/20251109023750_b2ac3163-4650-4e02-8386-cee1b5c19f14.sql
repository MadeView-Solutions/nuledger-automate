-- Revoke public access to materialized view (security fix)
REVOKE ALL ON public.mv_kpis_daily FROM anon;
REVOKE ALL ON public.mv_kpis_daily FROM authenticated;