-- ============================================================================
-- CAMPUSCARE - IT AMC & SERVICE MANAGEMENT PLATFORM
-- Database Architecture V1 - PostgreSQL / Supabase DDL
-- ============================================================================
-- Hierarchy:
--   Organization (AMC Provider)
--     └── Schools & Colleges
--           └── Buildings
--                 └── Floors
--                       └── Labs
--                             ├── Lab Maps (Data-driven 2D floor plans)
--                             └── Assets (Systems, Peripherals, Infrastructure)
--                                   └── Tickets (Lifecycle Issue Resolution)
--                                         ├── Ticket Timeline (Audit trail)
--                                         ├── Ticket Communications (Chat stream)
--                                         ├── Technician Jobs (Checklists & Notes)
--                                         └── Service History (Permanent ledger)
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUM TYPES
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM (
        'org_admin',       -- Full administrative control over AMC organization
        'org_staff',       -- AMC back-office dispatcher / manager
        'technician',      -- Field service engineer assigned to tickets
        'school_staff'     -- School / College lab in-charge / faculty
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE institution_type AS ENUM (
        'school',
        'college',
        'polytechnic',
        'university'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE asset_type AS ENUM (
        'pc',
        'monitor',
        'printer',
        'switch',
        'router',
        'projector',
        'ups',
        'server',
        'furniture_table',
        'teacher_desk',
        'door',
        'other'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE asset_status AS ENUM (
        'working',          -- 🟢 Operational
        'warning',          -- 🟡 Warning / Maintenance Due
        'issue_reported',   -- 🔴 Fault / Ticket Raised
        'under_service',    -- 🔵 Technician Working On-Site
        'offline',          -- ⚫ Powered Down / Decommissioned
        'unknown'           -- ⚪ Unverified State
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE ticket_priority AS ENUM (
        'low',
        'medium',
        'high',
        'urgent'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE ticket_status AS ENUM (
        'created',          -- Issue reported by School
        'assigned',         -- AMC dispatcher assigned a technician
        'acknowledged',     -- Technician accepted the job
        'in_progress',      -- Technician on-site diagnosing/repairing
        'resolved',         -- Repair completed and tested
        'confirmed',        -- School lab staff confirmed working
        'closed'            -- Officially closed and archived
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE ticket_category AS ENUM (
        'hardware',
        'software',
        'network',
        'peripherals',
        'power',
        'preventive_maintenance',
        'other'
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE amc_contract_type AS ENUM (
        'comprehensive',        -- Covers parts + labor
        'non_comprehensive',    -- Labor only, parts chargeable
        'lab_only',             -- Covers dedicated computer labs only
        'campus_wide'           -- Covers all campus IT assets
    );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 3. CORE RELATIONAL TABLES

-- (A) ORGANIZATIONS (AMC Providers / MSPs)
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT UNIQUE,
    contact_email TEXT,
    contact_phone TEXT,
    address TEXT,
    logo_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- (B) SCHOOLS & COLLEGES (Client Institutions)
CREATE TABLE IF NOT EXISTS schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    institution_type institution_type NOT NULL DEFAULT 'school',
    code TEXT NOT NULL,
    address TEXT,
    city TEXT NOT NULL DEFAULT 'Chennai',
    state TEXT NOT NULL DEFAULT 'Tamil Nadu',
    pincode TEXT,
    contact_person TEXT,
    contact_phone TEXT,
    contact_email TEXT,
    sso_domain TEXT,
    image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- (C) USER PROFILES (Extending Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
    role user_role NOT NULL DEFAULT 'school_staff',
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    avatar_url TEXT,
    designation TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- (D) CAMPUS PHYSICAL STRUCTURE: BUILDINGS & FLOORS
CREATE TABLE IF NOT EXISTS buildings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS floors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
    floor_number INTEGER NOT NULL DEFAULT 1,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- (E) COMPUTER LABS
CREATE TABLE IF NOT EXISTS labs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    building_id UUID REFERENCES buildings(id) ON DELETE SET NULL,
    floor_id UUID REFERENCES floors(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    code TEXT,
    room_number TEXT,
    capacity INTEGER NOT NULL DEFAULT 20,
    in_charge_name TEXT,
    in_charge_phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- (F) 2D LAB MAPS (Data-driven visual layouts)
CREATE TABLE IF NOT EXISTS lab_maps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lab_id UUID UNIQUE NOT NULL REFERENCES labs(id) ON DELETE CASCADE,
    width INTEGER NOT NULL DEFAULT 1200,
    height INTEGER NOT NULL DEFAULT 800,
    grid_size INTEGER NOT NULL DEFAULT 20,
    background_data JSONB NOT NULL DEFAULT '{
        "entrance": {"x": 40, "y": 720, "label": "Entrance"},
        "teacher_desk": {"x": 920, "y": 660, "width": 180, "height": 70, "label": "Teacher Desk"},
        "walls": []
    }'::jsonb,
    -- Array of placed objects: [{ asset_id, type, x, y, width, height, rotation, label }]
    objects JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- (G) ASSETS (PCs, Printers, Switches, Network Nodes)
CREATE TABLE IF NOT EXISTS assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    lab_id UUID REFERENCES labs(id) ON DELETE SET NULL,
    asset_code TEXT UNIQUE NOT NULL, -- e.g. 'VMHS-PC-007'
    name TEXT NOT NULL,              -- e.g. 'PC-07'
    type asset_type NOT NULL DEFAULT 'pc',
    status asset_status NOT NULL DEFAULT 'working',
    location_note TEXT,             -- e.g. 'Main Lab - Row 2 - Position 3'
    make_model TEXT,                -- e.g. 'Dell OptiPlex 3080'
    serial_number TEXT,
    
    -- Technical Specifications
    specs JSONB NOT NULL DEFAULT '{
        "cpu": "",
        "ram": "",
        "storage": "",
        "gpu": "",
        "os": "",
        "ip_address": "",
        "mac_address": "",
        "switch_port": "",
        "network_port": ""
    }'::jsonb,
    
    -- Connected Peripherals
    peripherals JSONB NOT NULL DEFAULT '{
        "monitor": "",
        "keyboard": "",
        "mouse": "",
        "ups": ""
    }'::jsonb,
    
    purchase_date DATE,
    warranty_expiry DATE,
    photos TEXT[] DEFAULT '{}',
    qr_code_payload TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- (H) AMC CONTRACTS
CREATE TABLE IF NOT EXISTS amc_contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    contract_number TEXT UNIQUE NOT NULL,
    contract_type amc_contract_type NOT NULL DEFAULT 'comprehensive',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    covered_assets_count INTEGER NOT NULL DEFAULT 0,
    sla_response_hours INTEGER NOT NULL DEFAULT 4,
    sla_resolution_hours INTEGER NOT NULL DEFAULT 24,
    preventive_maintenance_interval_days INTEGER NOT NULL DEFAULT 90,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- (I) TICKETS (Service & Issue Management)
CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number TEXT UNIQUE NOT NULL, -- e.g. '#TKT-1024'
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    lab_id UUID REFERENCES labs(id) ON DELETE SET NULL,
    asset_id UUID REFERENCES assets(id) ON DELETE SET NULL,
    reported_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL, -- Technician
    priority ticket_priority NOT NULL DEFAULT 'medium',
    status ticket_status NOT NULL DEFAULT 'created',
    category ticket_category NOT NULL DEFAULT 'hardware',
    sub_category TEXT,             -- e.g. 'Monitor Not Working'
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    attachments TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    acknowledged_at TIMESTAMPTZ,
    in_progress_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- (J) TICKET TIMELINE (Formal Audit Stepper)
CREATE TABLE IF NOT EXISTS ticket_timeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    status ticket_status NOT NULL,
    actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    actor_name TEXT NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- (K) TICKET COMMUNICATIONS (Chronological Discussion / Audit Stream)
CREATE TABLE IF NOT EXISTS ticket_communications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    sender_name TEXT NOT NULL,
    sender_role user_role NOT NULL,
    message TEXT NOT NULL,
    attachments TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- (L) TECHNICIAN JOBS & DIAGNOSIS CHECKLIST
CREATE TABLE IF NOT EXISTS technician_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID UNIQUE NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    technician_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Interactive checklist items: [{ id: 1, text: "Check power supply", checked: true }]
    checklist_items JSONB NOT NULL DEFAULT '[
        {"id": 1, "text": "Check power supply", "checked": false},
        {"id": 2, "text": "Check monitor and cable", "checked": false},
        {"id": 3, "text": "Test with another monitor", "checked": false},
        {"id": 4, "text": "Check GPU / onboard display", "checked": false},
        {"id": 5, "text": "Replace cable if required", "checked": false}
    ]'::jsonb,
    
    parts_notes TEXT,
    parts_replaced TEXT,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- (M) SERVICE HISTORY (Permanent Asset Maintenance Ledger)
CREATE TABLE IF NOT EXISTS service_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    ticket_id UUID REFERENCES tickets(id) ON DELETE SET NULL,
    technician_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    service_date DATE NOT NULL DEFAULT CURRENT_DATE,
    action_type TEXT NOT NULL, -- e.g. 'Repair', 'Replacement', 'Preventive Maintenance', 'OS Reinstall'
    diagnosis TEXT,
    action_taken TEXT NOT NULL,
    parts_replaced TEXT,
    remarks TEXT,
    customer_signature_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_schools_org ON schools(organization_id);
CREATE INDEX IF NOT EXISTS idx_profiles_org ON profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_profiles_school ON profiles(school_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_labs_school ON labs(school_id);
CREATE INDEX IF NOT EXISTS idx_assets_lab ON assets(lab_id);
CREATE INDEX IF NOT EXISTS idx_assets_school ON assets(school_id);
CREATE INDEX IF NOT EXISTS idx_assets_status ON assets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_org ON tickets(organization_id);
CREATE INDEX IF NOT EXISTS idx_tickets_school ON tickets(school_id);
CREATE INDEX IF NOT EXISTS idx_tickets_lab ON tickets(lab_id);
CREATE INDEX IF NOT EXISTS idx_tickets_asset ON tickets(asset_id);
CREATE INDEX IF NOT EXISTS idx_tickets_assigned_to ON tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON tickets(priority);
CREATE INDEX IF NOT EXISTS idx_ticket_timeline_ticket ON ticket_timeline(ticket_id);
CREATE INDEX IF NOT EXISTS idx_ticket_comms_ticket ON ticket_communications(ticket_id);
CREATE INDEX IF NOT EXISTS idx_service_history_asset ON service_history(asset_id);

-- 5. AUTOMATIC TIMESTAMP TRIGGER
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
    CREATE TRIGGER trg_update_organizations BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_timestamp();
    CREATE TRIGGER trg_update_schools BEFORE UPDATE ON schools FOR EACH ROW EXECUTE FUNCTION update_timestamp();
    CREATE TRIGGER trg_update_profiles BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_timestamp();
    CREATE TRIGGER trg_update_labs BEFORE UPDATE ON labs FOR EACH ROW EXECUTE FUNCTION update_timestamp();
    CREATE TRIGGER trg_update_lab_maps BEFORE UPDATE ON lab_maps FOR EACH ROW EXECUTE FUNCTION update_timestamp();
    CREATE TRIGGER trg_update_assets BEFORE UPDATE ON assets FOR EACH ROW EXECUTE FUNCTION update_timestamp();
    CREATE TRIGGER trg_update_amc_contracts BEFORE UPDATE ON amc_contracts FOR EACH ROW EXECUTE FUNCTION update_timestamp();
    CREATE TRIGGER trg_update_tickets BEFORE UPDATE ON tickets FOR EACH ROW EXECUTE FUNCTION update_timestamp();
    CREATE TRIGGER trg_update_technician_jobs BEFORE UPDATE ON technician_jobs FOR EACH ROW EXECUTE FUNCTION update_timestamp();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 6. AUTOMATIC ASSET STATUS SYNC WITH TICKETS
-- When a ticket is created/updated, update the asset status accordingly
CREATE OR REPLACE FUNCTION sync_asset_status_from_ticket()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.asset_id IS NOT NULL THEN
        IF NEW.status = 'created' OR NEW.status = 'assigned' THEN
            UPDATE assets SET status = 'issue_reported' WHERE id = NEW.asset_id;
        ELSIF NEW.status = 'in_progress' THEN
            UPDATE assets SET status = 'under_service' WHERE id = NEW.asset_id;
        ELSIF NEW.status = 'resolved' OR NEW.status = 'confirmed' OR NEW.status = 'closed' THEN
            -- Check if any other open tickets exist for this asset
            IF NOT EXISTS (
                SELECT 1 FROM tickets 
                WHERE asset_id = NEW.asset_id 
                  AND id <> NEW.id 
                  AND status NOT IN ('resolved', 'confirmed', 'closed')
            ) THEN
                UPDATE assets SET status = 'working' WHERE id = NEW.asset_id;
            END IF;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
    CREATE TRIGGER trg_sync_asset_status AFTER INSERT OR UPDATE OF status, asset_id ON tickets
    FOR EACH ROW EXECUTE FUNCTION sync_asset_status_from_ticket();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 7. SUPABASE ROW LEVEL SECURITY (RLS) POLICIES

-- Helper Functions to fetch calling user attributes
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
    SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_user_org_id()
RETURNS UUID AS $$
    SELECT organization_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_user_school_id()
RETURNS UUID AS $$
    SELECT school_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE floors ENABLE ROW LEVEL SECURITY;
ALTER TABLE labs ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_maps ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE amc_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE technician_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_history ENABLE ROW LEVEL SECURITY;

-- (A) ORGANIZATIONS POLICIES
CREATE POLICY "Users can view their organization"
    ON organizations FOR SELECT
    USING (id = get_user_org_id());

CREATE POLICY "Org Admins can update their organization"
    ON organizations FOR UPDATE
    USING (id = get_user_org_id() AND get_user_role() = 'org_admin');

-- (B) SCHOOLS POLICIES
CREATE POLICY "Org members can view all schools under their org"
    ON schools FOR SELECT
    USING (
        (organization_id = get_user_org_id() AND get_user_role() IN ('org_admin', 'org_staff', 'technician'))
        OR
        (id = get_user_school_id())
    );

CREATE POLICY "Org Admins and Staff can manage schools"
    ON schools FOR ALL
    USING (organization_id = get_user_org_id() AND get_user_role() IN ('org_admin', 'org_staff'));

-- (C) PROFILES POLICIES
CREATE POLICY "Users can view profiles in their scope"
    ON profiles FOR SELECT
    USING (
        (organization_id = get_user_org_id())
        OR
        (school_id = get_user_school_id())
        OR
        (id = auth.uid())
    );

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (id = auth.uid());

CREATE POLICY "Org Admins can manage profiles"
    ON profiles FOR ALL
    USING (organization_id = get_user_org_id() AND get_user_role() = 'org_admin');

-- (D) LABS & LAB MAPS POLICIES
CREATE POLICY "Users can view labs in their scope"
    ON labs FOR SELECT
    USING (
        (school_id IN (SELECT id FROM schools WHERE organization_id = get_user_org_id()))
        OR
        (school_id = get_user_school_id())
    );

CREATE POLICY "Org admins/staff and school in-charge can update labs"
    ON labs FOR ALL
    USING (
        (school_id IN (SELECT id FROM schools WHERE organization_id = get_user_org_id()) AND get_user_role() IN ('org_admin', 'org_staff'))
        OR
        (school_id = get_user_school_id() AND get_user_role() = 'school_staff')
    );

CREATE POLICY "Users can view lab maps in their scope"
    ON lab_maps FOR SELECT
    USING (
        lab_id IN (
            SELECT id FROM labs WHERE 
                school_id IN (SELECT id FROM schools WHERE organization_id = get_user_org_id())
                OR school_id = get_user_school_id()
        )
    );

CREATE POLICY "Admins and Staff can edit lab maps"
    ON lab_maps FOR ALL
    USING (
        lab_id IN (
            SELECT id FROM labs WHERE 
                school_id IN (SELECT id FROM schools WHERE organization_id = get_user_org_id())
                AND get_user_role() IN ('org_admin', 'org_staff')
        )
    );

-- (E) ASSETS POLICIES
CREATE POLICY "Users can view assets in their scope"
    ON assets FOR SELECT
    USING (
        (school_id IN (SELECT id FROM schools WHERE organization_id = get_user_org_id()))
        OR
        (school_id = get_user_school_id())
    );

CREATE POLICY "Admins, staff and technicians can modify assets"
    ON assets FOR ALL
    USING (
        (school_id IN (SELECT id FROM schools WHERE organization_id = get_user_org_id()) AND get_user_role() IN ('org_admin', 'org_staff', 'technician'))
    );

-- (F) TICKETS POLICIES
CREATE POLICY "Users can view relevant tickets"
    ON tickets FOR SELECT
    USING (
        (organization_id = get_user_org_id() AND get_user_role() IN ('org_admin', 'org_staff'))
        OR
        (assigned_to = auth.uid() AND get_user_role() = 'technician')
        OR
        (school_id = get_user_school_id() AND get_user_role() = 'school_staff')
    );

CREATE POLICY "School staff can raise tickets for their school"
    ON tickets FOR INSERT
    WITH CHECK (
        (school_id = get_user_school_id() AND get_user_role() = 'school_staff')
        OR
        (organization_id = get_user_org_id() AND get_user_role() IN ('org_admin', 'org_staff'))
    );

CREATE POLICY "Authorized roles can update tickets"
    ON tickets FOR UPDATE
    USING (
        (organization_id = get_user_org_id() AND get_user_role() IN ('org_admin', 'org_staff'))
        OR
        (assigned_to = auth.uid() AND get_user_role() = 'technician')
        OR
        (school_id = get_user_school_id() AND get_user_role() = 'school_staff' AND status IN ('resolved', 'confirmed'))
    );

-- (G) TICKET COMMUNICATIONS & TIMELINE
CREATE POLICY "Users can view ticket timeline in scope"
    ON ticket_timeline FOR SELECT
    USING (ticket_id IN (SELECT id FROM tickets));

CREATE POLICY "Users can add to timeline in scope"
    ON ticket_timeline FOR INSERT
    WITH CHECK (ticket_id IN (SELECT id FROM tickets));

CREATE POLICY "Users can view ticket comms in scope"
    ON ticket_communications FOR SELECT
    USING (ticket_id IN (SELECT id FROM tickets));

CREATE POLICY "Users can post to ticket comms in scope"
    ON ticket_communications FOR INSERT
    WITH CHECK (ticket_id IN (SELECT id FROM tickets));

-- (H) TECHNICIAN JOBS & CHECKLISTS
CREATE POLICY "Technicians and Admins can view jobs"
    ON technician_jobs FOR SELECT
    USING (
        technician_id = auth.uid()
        OR get_user_role() IN ('org_admin', 'org_staff')
    );

CREATE POLICY "Assigned Technician can update their job checklist"
    ON technician_jobs FOR ALL
    USING (technician_id = auth.uid() OR get_user_role() IN ('org_admin', 'org_staff'));

-- (I) SERVICE HISTORY
CREATE POLICY "Users can view service history in scope"
    ON service_history FOR SELECT
    USING (
        asset_id IN (
            SELECT id FROM assets WHERE 
                school_id IN (SELECT id FROM schools WHERE organization_id = get_user_org_id())
                OR school_id = get_user_school_id()
        )
    );

CREATE POLICY "Technicians and Admins can record service history"
    ON service_history FOR INSERT
    WITH CHECK (
        get_user_role() IN ('org_admin', 'org_staff', 'technician')
    );
