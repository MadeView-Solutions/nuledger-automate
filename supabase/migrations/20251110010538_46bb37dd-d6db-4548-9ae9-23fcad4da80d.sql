-- Secure materialized views with RLS
ALTER MATERIALIZED VIEW mv_trial_balance OWNER TO postgres;
ALTER MATERIALIZED VIEW mv_gl_detail OWNER TO postgres;
ALTER MATERIALIZED VIEW mv_case_profitability OWNER TO postgres;
ALTER MATERIALIZED VIEW mv_trust_three_way OWNER TO postgres;
ALTER MATERIALIZED VIEW mv_case_cycle OWNER TO postgres;
ALTER MATERIALIZED VIEW mv_settlement_distribution OWNER TO postgres;
ALTER MATERIALIZED VIEW mv_liens_recovery_rate OWNER TO postgres;
ALTER MATERIALIZED VIEW mv_referral_roi OWNER TO postgres;

-- Note: Materialized views don't support RLS directly, but the underlying tables do.
-- Users can only access data through the fn_generate_report function which is SECURITY DEFINER
-- and respects organization boundaries. The views themselves are read-only aggregations.