-- ============================================================================
-- CAMPUSCARE - ENABLE DIRECT ACCESS FOR CLIENT APPS (WEB, ANDROID, QT DESKTOP)
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/uxujdjyuhduthyhkcqfa/sql
-- ============================================================================

-- Disable RLS on client operational tables so that Web, Android (Capacitor),
-- and Desktop (Qt) can read, insert, and update tickets and schools seamlessly.

ALTER TABLE IF EXISTS organizations DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS schools DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS buildings DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS floors DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS labs DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS lab_maps DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS assets DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS amc_contracts DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS tickets DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ticket_timeline DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ticket_communications DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS technician_jobs DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS service_history DISABLE ROW LEVEL SECURITY;

-- Grant standard usage to anon and authenticated roles
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;
