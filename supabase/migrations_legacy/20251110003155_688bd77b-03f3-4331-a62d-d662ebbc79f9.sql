-- Revoke public access to performance views (security fix)
REVOKE ALL ON public.v_case_costs FROM anon;
REVOKE ALL ON public.v_case_costs FROM authenticated;

REVOKE ALL ON public.v_utilization FROM anon;
REVOKE ALL ON public.v_utilization FROM authenticated;

REVOKE ALL ON public.v_realization FROM anon;
REVOKE ALL ON public.v_realization FROM authenticated;