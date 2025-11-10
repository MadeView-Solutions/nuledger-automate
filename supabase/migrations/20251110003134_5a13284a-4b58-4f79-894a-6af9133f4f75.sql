-- Revoke public access to materialized view (security fix)
REVOKE ALL ON public.mv_perf_weekly FROM anon;
REVOKE ALL ON public.mv_perf_weekly FROM authenticated;