-- ============================================================================
-- CAMPUSCARE - SEED DATA SCRIPT
-- Matches the 10 Prototype Screens (Velammal Matric, PC-07, #TKT-1024, etc.)
-- ============================================================================

-- Clean existing data in dependency order
TRUNCATE TABLE service_history, technician_jobs, ticket_communications, 
               ticket_timeline, tickets, amc_contracts, assets, lab_maps, 
               labs, floors, buildings, profiles, schools, organizations CASCADE;

-- 1. AMC PROVIDER ORGANIZATION
INSERT INTO organizations (id, name, code, contact_email, contact_phone, address)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'CampusCare AMC Solutions',
    'CAMPUS-CARE',
    'support@campuscare.in',
    '+91 44 2819 0000',
    'No. 42, Mount Road, Guindy, Chennai, Tamil Nadu - 600032'
);

-- 2. SCHOOLS & COLLEGES (Matching Screen 3)
INSERT INTO schools (id, organization_id, name, institution_type, code, city, state, contact_person, contact_phone, contact_email, image_url)
VALUES 
(
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Velammal Matric Hr Sec School',
    'school',
    'VMHS',
    'Chennai',
    'Tamil Nadu',
    'Mr. Arun Kumar',
    '+91 94440 12345',
    'itlab@velammal.edu.in',
    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=200&auto=format&fit=crop&q=80'
),
(
    '10000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'Sri Vidhya Matric School',
    'school',
    'SVMS',
    'Chennai',
    'Tamil Nadu',
    'Mrs. Shanthi S.',
    '+91 94440 23456',
    'admin@srividhya.edu.in',
    'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=200&auto=format&fit=crop&q=80'
),
(
    '10000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'Greenwood International School',
    'school',
    'GWIS',
    'Chennai',
    'Tamil Nadu',
    'Dr. K. Balaji',
    '+91 94440 34567',
    'itdirector@greenwood.org',
    'https://images.unsplash.com/photo-1562774053-701939374585?w=200&auto=format&fit=crop&q=80'
),
(
    '10000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000001',
    'St. Mary''s College',
    'college',
    'SMC',
    'Chennai',
    'Tamil Nadu',
    'Prof. D. Thomas',
    '+91 94440 45678',
    'systems@stmaryscollege.edu',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=200&auto=format&fit=crop&q=80'
),
(
    '10000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000001',
    'Excel Engineering College',
    'college',
    'EEC',
    'Komarapalayam',
    'Tamil Nadu',
    'Dr. R. Murugan',
    '+91 94440 56789',
    'campus-it@excelengg.ac.in',
    'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&auto=format&fit=crop&q=80'
);

-- 3. PROFILES / USERS (Extends auth.users; dummy UUIDs for seed)
INSERT INTO profiles (id, organization_id, school_id, role, full_name, email, phone, designation)
VALUES 
(
    '20000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    NULL,
    'org_admin',
    'Rajesh Kumar',
    'admin@campuscare.in',
    '+91 98400 11223',
    'Operations Director'
),
(
    '20000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    NULL,
    'technician',
    'Karthik V.',
    'karthik.tech@campuscare.in',
    '+91 98401 23456',
    'Senior Hardware Engineer'
),
(
    '20000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'school_staff',
    'Mr. Arun',
    'arun.lab@velammal.edu.in',
    '+91 94440 12345',
    'Computer Lab In-Charge'
);

-- 4. BUILDINGS & FLOORS (Velammal Matric)
INSERT INTO buildings (id, school_id, name, code)
VALUES ('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Main Academic Block', 'BLK-A');

INSERT INTO floors (id, building_id, floor_number, name)
VALUES ('31000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 1, 'First Floor');

-- 5. LABS
INSERT INTO labs (id, school_id, building_id, floor_id, name, code, room_number, capacity, in_charge_name, in_charge_phone)
VALUES 
(
    '40000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001',
    '31000000-0000-0000-0000-000000000001',
    'Computer Lab - Main Lab',
    'LAB-01',
    'Room 101',
    20,
    'Mr. Arun',
    '+91 94440 12345'
),
(
    '40000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001',
    '31000000-0000-0000-0000-000000000001',
    'Computer Lab 2',
    'LAB-02',
    'Room 102',
    30,
    'Mrs. Priya R.',
    '+91 94440 98765'
);

-- 6. ASSETS FOR MAIN COMPUTER LAB (PC-01 through PC-20)
-- Exact match with Screen 4 and Screen 5
INSERT INTO assets (
    id, school_id, lab_id, asset_code, name, type, status, location_note, make_model, serial_number, specs, peripherals
) VALUES 
-- Row 1: PC-01 to PC-05
('50000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'VMHS-PC-001', 'PC-01', 'pc', 'working', 'Main Lab - Row 1 - Desk 1', 'Dell OptiPlex 3080', 'CN-08D93K-74261-01A-0101', 
 '{"cpu": "Intel Core i5 (10th Gen)", "ram": "8 GB", "storage": "256 GB SSD", "os": "Windows 11 Pro", "ip_address": "192.168.1.101", "mac_address": "3C:52:82:1A:9F:01", "switch_port": "SW-01/Gi0/1"}'::jsonb,
 '{"monitor": "Dell 21.5\"", "keyboard": "Dell USB Keyboard", "mouse": "Dell Optical Mouse", "ups": "Central Lab UPS"}'::jsonb),

('50000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'VMHS-PC-002', 'PC-02', 'pc', 'working', 'Main Lab - Row 1 - Desk 2', 'Dell OptiPlex 3080', 'CN-08D93K-74261-01A-0102', 
 '{"cpu": "Intel Core i5 (10th Gen)", "ram": "8 GB", "storage": "256 GB SSD", "os": "Windows 11 Pro", "ip_address": "192.168.1.102", "mac_address": "3C:52:82:1A:9F:02", "switch_port": "SW-01/Gi0/2"}'::jsonb,
 '{"monitor": "Dell 21.5\"", "keyboard": "Dell USB Keyboard", "mouse": "Dell Optical Mouse", "ups": "Central Lab UPS"}'::jsonb),

('50000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'VMHS-PC-003', 'PC-03', 'pc', 'issue_reported', 'Main Lab - Row 1 - Desk 3', 'Dell OptiPlex 3080', 'CN-08D93K-74261-01A-0103', 
 '{"cpu": "Intel Core i5 (10th Gen)", "ram": "8 GB", "storage": "256 GB SSD", "os": "Windows 11 Pro", "ip_address": "192.168.1.103", "mac_address": "3C:52:82:1A:9F:03", "switch_port": "SW-01/Gi0/3"}'::jsonb,
 '{"monitor": "Dell 21.5\"", "keyboard": "Dell USB Keyboard", "mouse": "Dell Optical Mouse", "ups": "Central Lab UPS"}'::jsonb),

('50000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'VMHS-PC-004', 'PC-04', 'pc', 'working', 'Main Lab - Row 1 - Desk 4', 'Dell OptiPlex 3080', 'CN-08D93K-74261-01A-0104', 
 '{"cpu": "Intel Core i5 (10th Gen)", "ram": "8 GB", "storage": "256 GB SSD", "os": "Windows 11 Pro", "ip_address": "192.168.1.104", "mac_address": "3C:52:82:1A:9F:04", "switch_port": "SW-01/Gi0/4"}'::jsonb,
 '{"monitor": "Dell 21.5\"", "keyboard": "Dell USB Keyboard", "mouse": "Dell Optical Mouse", "ups": "Central Lab UPS"}'::jsonb),

('50000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'VMHS-PC-005', 'PC-05', 'pc', 'working', 'Main Lab - Row 1 - Desk 5', 'Dell OptiPlex 3080', 'CN-08D93K-74261-01A-0105', 
 '{"cpu": "Intel Core i5 (10th Gen)", "ram": "8 GB", "storage": "256 GB SSD", "os": "Windows 11 Pro", "ip_address": "192.168.1.105", "mac_address": "3C:52:82:1A:9F:05", "switch_port": "SW-01/Gi0/5"}'::jsonb,
 '{"monitor": "Dell 21.5\"", "keyboard": "Dell USB Keyboard", "mouse": "Dell Optical Mouse", "ups": "Central Lab UPS"}'::jsonb),

-- Row 2: PC-06 to PC-10 (PC-07 is the hero workstation)
('50000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'VMHS-PC-006', 'PC-06', 'pc', 'working', 'Main Lab - Row 2 - Desk 1', 'Dell OptiPlex 3080', 'CN-08D93K-74261-01A-0106', 
 '{"cpu": "Intel Core i5 (10th Gen)", "ram": "8 GB", "storage": "256 GB SSD", "os": "Windows 11 Pro", "ip_address": "192.168.1.106", "mac_address": "3C:52:82:1A:9F:06", "switch_port": "SW-01/Gi0/6"}'::jsonb,
 '{"monitor": "Dell 21.5\"", "keyboard": "Dell USB Keyboard", "mouse": "Dell Optical Mouse", "ups": "Central Lab UPS"}'::jsonb),

('50000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'VMHS-PC-007', 'PC-07', 'pc', 'issue_reported', 'Main Lab - Row 2', 'Dell OptiPlex 3080', 'CN-08D93K-74261-07A-0492', 
 '{"cpu": "Intel Core i5 (10th Gen)", "ram": "8 GB", "storage": "256 GB SSD", "os": "Windows 11 Pro", "ip_address": "192.168.1.107", "mac_address": "3C:52:82:1A:9F:3D", "switch_port": "SW-01/Gi0/7", "network_port": "D-07"}'::jsonb,
 '{"monitor": "Dell 21.5\"", "keyboard": "Keyboard", "mouse": "Mouse", "ups": "Central Lab UPS"}'::jsonb),

('50000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'VMHS-PC-008', 'PC-08', 'pc', 'working', 'Main Lab - Row 2 - Desk 3', 'Dell OptiPlex 3080', 'CN-08D93K-74261-01A-0108', 
 '{"cpu": "Intel Core i5 (10th Gen)", "ram": "8 GB", "storage": "256 GB SSD", "os": "Windows 11 Pro", "ip_address": "192.168.1.108", "mac_address": "3C:52:82:1A:9F:08", "switch_port": "SW-01/Gi0/8"}'::jsonb,
 '{"monitor": "Dell 21.5\"", "keyboard": "Dell USB Keyboard", "mouse": "Dell Optical Mouse", "ups": "Central Lab UPS"}'::jsonb),

('50000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'VMHS-PC-009', 'PC-09', 'pc', 'working', 'Main Lab - Row 2 - Desk 4', 'Dell OptiPlex 3080', 'CN-08D93K-74261-01A-0109', 
 '{"cpu": "Intel Core i5 (10th Gen)", "ram": "8 GB", "storage": "256 GB SSD", "os": "Windows 11 Pro", "ip_address": "192.168.1.109", "mac_address": "3C:52:82:1A:9F:09", "switch_port": "SW-01/Gi0/9"}'::jsonb,
 '{"monitor": "Dell 21.5\"", "keyboard": "Dell USB Keyboard", "mouse": "Dell Optical Mouse", "ups": "Central Lab UPS"}'::jsonb),

('50000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'VMHS-PC-010', 'PC-10', 'pc', 'working', 'Main Lab - Row 2 - Desk 5', 'Dell OptiPlex 3080', 'CN-08D93K-74261-01A-0110', 
 '{"cpu": "Intel Core i5 (10th Gen)", "ram": "8 GB", "storage": "256 GB SSD", "os": "Windows 11 Pro", "ip_address": "192.168.1.110", "mac_address": "3C:52:82:1A:9F:10", "switch_port": "SW-01/Gi0/10"}'::jsonb,
 '{"monitor": "Dell 21.5\"", "keyboard": "Dell USB Keyboard", "mouse": "Dell Optical Mouse", "ups": "Central Lab UPS"}'::jsonb),

-- Row 3: PC-11 to PC-15 (PC-12 is under service)
('50000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'VMHS-PC-011', 'PC-11', 'pc', 'working', 'Main Lab - Row 3 - Desk 1', 'Dell OptiPlex 3080', 'CN-08D93K-74261-01A-0111', 
 '{"cpu": "Intel Core i5 (10th Gen)", "ram": "8 GB", "storage": "256 GB SSD", "os": "Windows 11 Pro", "ip_address": "192.168.1.111", "mac_address": "3C:52:82:1A:9F:11", "switch_port": "SW-01/Gi0/11"}'::jsonb,
 '{"monitor": "Dell 21.5\"", "keyboard": "Dell USB Keyboard", "mouse": "Dell Optical Mouse", "ups": "Central Lab UPS"}'::jsonb),

('50000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'VMHS-PC-012', 'PC-12', 'pc', 'under_service', 'Main Lab - Row 3 - Desk 2', 'Dell OptiPlex 3080', 'CN-08D93K-74261-01A-0112', 
 '{"cpu": "Intel Core i5 (10th Gen)", "ram": "8 GB", "storage": "256 GB SSD", "os": "Windows 11 Pro", "ip_address": "192.168.1.112", "mac_address": "3C:52:82:1A:9F:12", "switch_port": "SW-01/Gi0/12"}'::jsonb,
 '{"monitor": "Dell 21.5\"", "keyboard": "Dell USB Keyboard", "mouse": "Dell Optical Mouse", "ups": "Central Lab UPS"}'::jsonb),

('50000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'VMHS-PC-013', 'PC-13', 'pc', 'working', 'Main Lab - Row 3 - Desk 3', 'Dell OptiPlex 3080', 'CN-08D93K-74261-01A-0113', 
 '{"cpu": "Intel Core i5 (10th Gen)", "ram": "8 GB", "storage": "256 GB SSD", "os": "Windows 11 Pro", "ip_address": "192.168.1.113", "mac_address": "3C:52:82:1A:9F:13", "switch_port": "SW-01/Gi0/13"}'::jsonb,
 '{"monitor": "Dell 21.5\"", "keyboard": "Dell USB Keyboard", "mouse": "Dell Optical Mouse", "ups": "Central Lab UPS"}'::jsonb),

('50000000-0000-0000-0000-000000000014', '10000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'VMHS-PC-014', 'PC-14', 'pc', 'working', 'Main Lab - Row 3 - Desk 4', 'Dell OptiPlex 3080', 'CN-08D93K-74261-01A-0114', 
 '{"cpu": "Intel Core i5 (10th Gen)", "ram": "8 GB", "storage": "256 GB SSD", "os": "Windows 11 Pro", "ip_address": "192.168.1.114", "mac_address": "3C:52:82:1A:9F:14", "switch_port": "SW-01/Gi0/14"}'::jsonb,
 '{"monitor": "Dell 21.5\"", "keyboard": "Dell USB Keyboard", "mouse": "Dell Optical Mouse", "ups": "Central Lab UPS"}'::jsonb),

('50000000-0000-0000-0000-000000000015', '10000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'VMHS-PC-015', 'PC-15', 'pc', 'working', 'Main Lab - Row 3 - Desk 5', 'Dell OptiPlex 3080', 'CN-08D93K-74261-01A-0115', 
 '{"cpu": "Intel Core i5 (10th Gen)", "ram": "8 GB", "storage": "256 GB SSD", "os": "Windows 11 Pro", "ip_address": "192.168.1.115", "mac_address": "3C:52:82:1A:9F:15", "switch_port": "SW-01/Gi0/15"}'::jsonb,
 '{"monitor": "Dell 21.5\"", "keyboard": "Dell USB Keyboard", "mouse": "Dell Optical Mouse", "ups": "Central Lab UPS"}'::jsonb),

-- Row 4: PC-16 to PC-20
('50000000-0000-0000-0000-000000000016', '10000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'VMHS-PC-016', 'PC-16', 'pc', 'working', 'Main Lab - Row 4 - Desk 1', 'Dell OptiPlex 3080', 'CN-08D93K-74261-01A-0116', 
 '{"cpu": "Intel Core i5 (10th Gen)", "ram": "8 GB", "storage": "256 GB SSD", "os": "Windows 11 Pro", "ip_address": "192.168.1.116", "mac_address": "3C:52:82:1A:9F:16", "switch_port": "SW-01/Gi0/16"}'::jsonb,
 '{"monitor": "Dell 21.5\"", "keyboard": "Dell USB Keyboard", "mouse": "Dell Optical Mouse", "ups": "Central Lab UPS"}'::jsonb),

('50000000-0000-0000-0000-000000000017', '10000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'VMHS-PC-017', 'PC-17', 'pc', 'working', 'Main Lab - Row 4 - Desk 2', 'Dell OptiPlex 3080', 'CN-08D93K-74261-01A-0117', 
 '{"cpu": "Intel Core i5 (10th Gen)", "ram": "8 GB", "storage": "256 GB SSD", "os": "Windows 11 Pro", "ip_address": "192.168.1.117", "mac_address": "3C:52:82:1A:9F:17", "switch_port": "SW-01/Gi0/17"}'::jsonb,
 '{"monitor": "Dell 21.5\"", "keyboard": "Dell USB Keyboard", "mouse": "Dell Optical Mouse", "ups": "Central Lab UPS"}'::jsonb),

('50000000-0000-0000-0000-000000000018', '10000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'VMHS-PC-018', 'PC-18', 'pc', 'working', 'Main Lab - Row 4 - Desk 3', 'Dell OptiPlex 3080', 'CN-08D93K-74261-01A-0118', 
 '{"cpu": "Intel Core i5 (10th Gen)", "ram": "8 GB", "storage": "256 GB SSD", "os": "Windows 11 Pro", "ip_address": "192.168.1.118", "mac_address": "3C:52:82:1A:9F:18", "switch_port": "SW-01/Gi0/18"}'::jsonb,
 '{"monitor": "Dell 21.5\"", "keyboard": "Dell USB Keyboard", "mouse": "Dell Optical Mouse", "ups": "Central Lab UPS"}'::jsonb),

('50000000-0000-0000-0000-000000000019', '10000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'VMHS-PC-019', 'PC-19', 'pc', 'working', 'Main Lab - Row 4 - Desk 4', 'Dell OptiPlex 3080', 'CN-08D93K-74261-01A-0119', 
 '{"cpu": "Intel Core i5 (10th Gen)", "ram": "8 GB", "storage": "256 GB SSD", "os": "Windows 11 Pro", "ip_address": "192.168.1.119", "mac_address": "3C:52:82:1A:9F:19", "switch_port": "SW-01/Gi0/19"}'::jsonb,
 '{"monitor": "Dell 21.5\"", "keyboard": "Dell USB Keyboard", "mouse": "Dell Optical Mouse", "ups": "Central Lab UPS"}'::jsonb),

('50000000-0000-0000-0000-000000000020', '10000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'VMHS-PC-020', 'PC-20', 'pc', 'working', 'Main Lab - Row 4 - Desk 5', 'Dell OptiPlex 3080', 'CN-08D93K-74261-01A-0120', 
 '{"cpu": "Intel Core i5 (10th Gen)", "ram": "8 GB", "storage": "256 GB SSD", "os": "Windows 11 Pro", "ip_address": "192.168.1.120", "mac_address": "3C:52:82:1A:9F:20", "switch_port": "SW-01/Gi0/20"}'::jsonb,
 '{"monitor": "Dell 21.5\"", "keyboard": "Dell USB Keyboard", "mouse": "Dell Optical Mouse", "ups": "Central Lab UPS"}'::jsonb);

-- 7. 2D LAB MAP FOR MAIN COMPUTER LAB
-- Data-driven layout capturing 4 rows x 5 columns + teacher desk + entrance
INSERT INTO lab_maps (id, lab_id, width, height, grid_size, background_data, objects)
VALUES (
    '60000000-0000-0000-0000-000000000001',
    '40000000-0000-0000-0000-000000000001',
    1000,
    720,
    20,
    '{
        "room_name": "Main Computer Lab",
        "entrance": {"x": 50, "y": 660, "width": 60, "height": 30, "label": "Entrance"},
        "teacher_desk": {"x": 760, "y": 610, "width": 180, "height": 70, "label": "Teacher''s Desk"}
    }'::jsonb,
    '[
        {"asset_id": "50000000-0000-0000-0000-000000000001", "label": "PC-01", "type": "pc", "x": 80,  "y": 80,  "width": 110, "height": 70, "rotation": 0},
        {"asset_id": "50000000-0000-0000-0000-000000000002", "label": "PC-02", "type": "pc", "x": 260, "y": 80,  "width": 110, "height": 70, "rotation": 0},
        {"asset_id": "50000000-0000-0000-0000-000000000003", "label": "PC-03", "type": "pc", "x": 440, "y": 80,  "width": 110, "height": 70, "rotation": 0},
        {"asset_id": "50000000-0000-0000-0000-000000000004", "label": "PC-04", "type": "pc", "x": 620, "y": 80,  "width": 110, "height": 70, "rotation": 0},
        {"asset_id": "50000000-0000-0000-0000-000000000005", "label": "PC-05", "type": "pc", "x": 800, "y": 80,  "width": 110, "height": 70, "rotation": 0},

        {"asset_id": "50000000-0000-0000-0000-000000000006", "label": "PC-06", "type": "pc", "x": 80,  "y": 200, "width": 110, "height": 70, "rotation": 0},
        {"asset_id": "50000000-0000-0000-0000-000000000007", "label": "PC-07", "type": "pc", "x": 260, "y": 200, "width": 110, "height": 70, "rotation": 0},
        {"asset_id": "50000000-0000-0000-0000-000000000008", "label": "PC-08", "type": "pc", "x": 440, "y": 200, "width": 110, "height": 70, "rotation": 0},
        {"asset_id": "50000000-0000-0000-0000-000000000009", "label": "PC-09", "type": "pc", "x": 620, "y": 200, "width": 110, "height": 70, "rotation": 0},
        {"asset_id": "50000000-0000-0000-0000-000000000010", "label": "PC-10", "type": "pc", "x": 800, "y": 200, "width": 110, "height": 70, "rotation": 0},

        {"asset_id": "50000000-0000-0000-0000-000000000011", "label": "PC-11", "type": "pc", "x": 80,  "y": 320, "width": 110, "height": 70, "rotation": 0},
        {"asset_id": "50000000-0000-0000-0000-000000000012", "label": "PC-12", "type": "pc", "x": 260, "y": 320, "width": 110, "height": 70, "rotation": 0},
        {"asset_id": "50000000-0000-0000-0000-000000000013", "label": "PC-13", "type": "pc", "x": 440, "y": 320, "width": 110, "height": 70, "rotation": 0},
        {"asset_id": "50000000-0000-0000-0000-000000000014", "label": "PC-14", "type": "pc", "x": 620, "y": 320, "width": 110, "height": 70, "rotation": 0},
        {"asset_id": "50000000-0000-0000-0000-000000000015", "label": "PC-15", "type": "pc", "x": 800, "y": 320, "width": 110, "height": 70, "rotation": 0},

        {"asset_id": "50000000-0000-0000-0000-000000000016", "label": "PC-16", "type": "pc", "x": 80,  "y": 440, "width": 110, "height": 70, "rotation": 0},
        {"asset_id": "50000000-0000-0000-0000-000000000017", "label": "PC-17", "type": "pc", "x": 260, "y": 440, "width": 110, "height": 70, "rotation": 0},
        {"asset_id": "50000000-0000-0000-0000-000000000018", "label": "PC-18", "type": "pc", "x": 440, "y": 440, "width": 110, "height": 70, "rotation": 0},
        {"asset_id": "50000000-0000-0000-0000-000000000019", "label": "PC-19", "type": "pc", "x": 620, "y": 440, "width": 110, "height": 70, "rotation": 0},
        {"asset_id": "50000000-0000-0000-0000-000000000020", "label": "PC-20", "type": "pc", "x": 800, "y": 440, "width": 110, "height": 70, "rotation": 0}
    ]'::jsonb
);

-- 8. AMC CONTRACT
INSERT INTO amc_contracts (
    id, organization_id, school_id, contract_number, contract_type, start_date, end_date, covered_assets_count, sla_response_hours, sla_resolution_hours
) VALUES (
    '70000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'AMC-VMHS-2025-01',
    'comprehensive',
    '2025-01-01',
    '2025-12-31',
    120,
    4,
    24
);

-- 9. TICKETS (Matching Screens 2, 6, 7, 8, 9)
-- Ticket #TKT-1024: PC-07 (High Priority, In Progress, Monitor not working)
INSERT INTO tickets (
    id, ticket_number, organization_id, school_id, lab_id, asset_id, reported_by, assigned_to, 
    priority, status, category, sub_category, title, description, attachments, created_at, acknowledged_at, in_progress_at
) VALUES (
    '80000000-0000-0000-0000-000000001024',
    '#TKT-1024',
    '00000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    '40000000-0000-0000-0000-000000000001',
    '50000000-0000-0000-0000-000000000007',
    '20000000-0000-0000-0000-000000000003', -- Mr. Arun
    '20000000-0000-0000-0000-000000000002', -- Karthik V.
    'high',
    'in_progress',
    'hardware',
    'Monitor Not Working',
    'Monitor not working',
    'Monitor shows no display. Power light is on.',
    ARRAY['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&auto=format&fit=crop&q=80'],
    '2025-09-15 10:24:00+05:30',
    '2025-09-15 11:30:00+05:30',
    '2025-09-15 12:15:00+05:30'
);

-- Ticket #TKT-1023: PC-12 (Medium Priority, 4h ago)
INSERT INTO tickets (
    id, ticket_number, organization_id, school_id, lab_id, asset_id, reported_by, assigned_to, 
    priority, status, category, sub_category, title, description, created_at
) VALUES (
    '80000000-0000-0000-0000-000000001023',
    '#TKT-1023',
    '00000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    '40000000-0000-0000-0000-000000000001',
    '50000000-0000-0000-0000-000000000012',
    '20000000-0000-0000-0000-000000000003',
    '20000000-0000-0000-0000-000000000002',
    'medium',
    'in_progress',
    'hardware',
    'Display Flickering',
    'Monitor not working',
    'Display flickers intermittently when moving VGA cable.',
    '2025-09-15 08:30:00+05:30'
);

-- Ticket #TKT-1022: Computer Lab A (Low Priority, 1d ago)
INSERT INTO tickets (
    id, ticket_number, organization_id, school_id, lab_id, asset_id, reported_by, 
    priority, status, category, sub_category, title, description, created_at
) VALUES (
    '80000000-0000-0000-0000-000000001022',
    '#TKT-1022',
    '00000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    '40000000-0000-0000-0000-000000000002',
    NULL,
    '20000000-0000-0000-0000-000000000003',
    'low',
    'created',
    'software',
    'Application Installation',
    'Software installation',
    'Need Python 3.12 and VS Code installed across Lab 2 workstations for upcoming syllabus.',
    '2025-09-14 10:00:00+05:30'
);

-- 10. TICKET TIMELINE FOR #TKT-1024 (Matching Screen 8)
INSERT INTO ticket_timeline (ticket_id, status, actor_id, actor_name, note, created_at)
VALUES 
(
    '80000000-0000-0000-0000-000000001024',
    'created',
    '20000000-0000-0000-0000-000000000003',
    'Mr. Arun (Lab Staff)',
    'Ticket created with high priority',
    '2025-09-15 10:24:00+05:30'
),
(
    '80000000-0000-0000-0000-000000001024',
    'assigned',
    '20000000-0000-0000-0000-000000000001',
    'Admin',
    'Assigned to Technician Karthik V.',
    '2025-09-15 11:10:00+05:30'
),
(
    '80000000-0000-0000-0000-000000001024',
    'acknowledged',
    '20000000-0000-0000-0000-000000000002',
    'Karthik',
    'Technician acknowledged and scheduled site visit',
    '2025-09-15 11:30:00+05:30'
),
(
    '80000000-0000-0000-0000-000000001024',
    'in_progress',
    '20000000-0000-0000-0000-000000000002',
    'Karthik',
    'Diagnosing the issue on site',
    '2025-09-15 12:15:00+05:30'
);

-- 11. TICKET COMMUNICATIONS / CHAT (Matching Screen 8)
INSERT INTO ticket_communications (ticket_id, sender_id, sender_name, sender_role, message, created_at)
VALUES 
(
    '80000000-0000-0000-0000-000000001024',
    '20000000-0000-0000-0000-000000000002',
    'Karthik',
    'technician',
    'We are checking the issue. Will update soon.',
    '2025-09-15 12:20:00+05:30'
),
(
    '80000000-0000-0000-0000-000000001024',
    '20000000-0000-0000-0000-000000000003',
    'Mr. Arun',
    'school_staff',
    'Please carry a VGA cable also.',
    '2025-09-15 12:25:00+05:30'
);

-- 12. TECHNICIAN JOB & CHECKLIST (Matching Screen 9)
INSERT INTO technician_jobs (
    id, ticket_id, technician_id, checklist_items, parts_notes, started_at
) VALUES (
    '90000000-0000-0000-0000-000000000001',
    '80000000-0000-0000-0000-000000001024',
    '20000000-0000-0000-0000-000000000002',
    '[
        {"id": 1, "text": "Check power supply", "checked": true},
        {"id": 2, "text": "Check monitor and cable", "checked": true},
        {"id": 3, "text": "Test with another monitor", "checked": false},
        {"id": 4, "text": "Check GPU / onboard display", "checked": false},
        {"id": 5, "text": "Replace cable if required", "checked": false}
    ]'::jsonb,
    'Brought replacement 1.5m HDMI to VGA cable and test monitor.',
    '2025-09-15 12:15:00+05:30'
);

-- 13. HISTORICAL SERVICE LOGS FOR PC-07 (Matching Screen 5)
INSERT INTO service_history (asset_id, technician_id, service_date, action_type, diagnosis, action_taken, parts_replaced, remarks)
VALUES 
(
    '50000000-0000-0000-0000-000000000007',
    '20000000-0000-0000-0000-000000000002',
    '2025-08-12',
    'Replacement',
    'Damaged backlight panel',
    'Replaced monitor panel with OEM certified display',
    'Dell 21.5" Monitor (Model E2216HV)',
    'Verified with display test pattern.'
),
(
    '50000000-0000-0000-0000-000000000007',
    '20000000-0000-0000-0000-000000000002',
    '2025-06-03',
    'Software',
    'Corrupt bootloader after power trip',
    'Reinstalled Windows 11 Pro Edu from golden image',
    NULL,
    'Joined to school domain, restored student profile.'
),
(
    '50000000-0000-0000-0000-000000000007',
    '20000000-0000-0000-0000-000000000002',
    '2025-01-12',
    'Preventive Maintenance',
    'Quarterly routine check',
    'Cleaned CPU heatsink, dust blower pass, tested RAM and SMART disk health',
    NULL,
    'All benchmarks normal. Temperature 42C under load.'
);
