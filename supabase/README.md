# CampusCare Supabase Setup Guide & Backend Architecture V1

This directory contains the complete PostgreSQL schema and seed data for **CampusCare - IT AMC & Service Management Platform**.

---

## 1. Quick Setup (Supabase Free Tier)

### Step 1: Create a Project
1. Log in to [Supabase](https://supabase.com/).
2. Click **New Project**.
3. Choose an organization, project name (e.g., `CampusCare-Dev`), set a strong database password, and choose your nearest region (e.g., `South Asia (Mumbai)`).
4. Wait ~2 minutes for the database instance to initialize.

### Step 2: Execute Schema & Seed
1. In the Supabase Dashboard, navigate to **SQL Editor** (left sidebar).
2. Click **New Query**.
3. Copy the entire contents of [`schema.sql`](file:///d:/documents/PROJECT%20FILES_BP/ANTIGRAVITY%20APP%20FILES/SCHOOL%20TICKET%20APPICATION/supabase/schema.sql) and paste it into the editor.
4. Click **Run** (or press `Ctrl + Enter`).
5. Open another query, paste the contents of [`seed.sql`](file:///d:/documents/PROJECT%20FILES_BP/ANTIGRAVITY%20APP%20FILES/SCHOOL%20TICKET%20APPICATION/supabase/seed.sql), and click **Run**.

---

## 2. What Was Generated

### Relational Hierarchy
```
Organizations (AMC Provider)
   └── Schools & Colleges
         └── Buildings
               └── Floors
                     └── Labs
                           ├── Lab Maps (Data-driven 2D layout coordinates)
                           └── Assets (PCs, Peripherals, Infrastructure)
                                 └── Tickets
                                       ├── Timeline (Lifecycle events)
                                       ├── Communications (Audit discussion stream)
                                       ├── Technician Jobs (Diagnosis checklist)
                                       └── Service History (Permanent ledger)
```

### Auto-Generated PostgREST Endpoints
Supabase automatically generates a secure REST API for all tables with zero backend boilerplate:

| Endpoint | Purpose | Example Query |
| :--- | :--- | :--- |
| `GET /rest/v1/schools` | List schools/colleges with counts | `?select=*,labs(id,name,capacity)` |
| `GET /rest/v1/labs` | Retrieve labs by school | `?school_id=eq.<SCHOOL_ID>&select=*,lab_maps(*)` |
| `GET /rest/v1/lab_maps` | Get 2D coordinate objects for Canvas | `?lab_id=eq.<LAB_ID>` |
| `GET /rest/v1/assets` | Retrieve assets with specs & status | `?lab_id=eq.<LAB_ID>&order=name.asc` |
| `GET /rest/v1/tickets` | Retrieve tickets with relations | `?select=*,assets(*),schools(name)&order=created_at.desc` |
| `POST /rest/v1/tickets` | Raise new ticket | Request body: JSON payload |
| `GET /rest/v1/ticket_timeline` | Stepper history for ticket | `?ticket_id=eq.<TICKET_ID>&order=created_at.asc` |
| `GET /rest/v1/ticket_communications` | Chat stream for ticket | `?ticket_id=eq.<TICKET_ID>&order=created_at.asc` |
| `GET /rest/v1/technician_jobs` | Checklist & navigation for job | `?ticket_id=eq.<TICKET_ID>` |
| `PATCH /rest/v1/technician_jobs` | Update checklist item completion | Request body: `{ "checklist_items": [...] }` |

---

## 3. Row-Level Security (RLS) & Multi-Tenancy

Every table has RLS enabled:
- **`school_staff`**:
  - Can only query labs, assets, and tickets belonging to their assigned `school_id`.
  - Can insert new tickets for their school.
  - Can confirm and view resolved tickets.
  - **Cannot** view other schools or access other schools' network maps.
- **`technician`**:
  - Can query all schools, labs, and assets under their AMC provider organization.
  - Can view and update tickets and jobs specifically assigned to them.
  - Can insert service history records and update checklist items.
- **`org_admin` & `org_staff`**:
  - Full CRUD access to all schools, technicians, assets, tickets, and contracts under their organization.

---

## 4. Connecting from Client Applications

### A. Environment Variables
In your client app (`.env` or configuration file):
```ini
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-public-key
```

### B. Calling from C++ / Qt 6 (`QNetworkAccessManager`)
```cpp
QNetworkRequest request(QUrl(supabaseUrl + "/rest/v1/tickets?select=*,assets(name,status)"));
request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");
request.setRawHeader("apikey", supabaseAnonKey.toUtf8());
request.setRawHeader("Authorization", "Bearer " + userJwtToken.toUtf8());

QNetworkReply *reply = networkManager->get(request);
```

### C. Calling from JavaScript / Web / Flutter
```javascript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fetch Main Computer Lab Map & Placed Objects
const { data: labMap } = await supabase
  .from('lab_maps')
  .select('*, labs(name, room_number)')
  .eq('lab_id', currentLabId)
  .single();
```

---

## 5. Prototype Entities Included in Seed Data
- **School**: `Velammal Matric Hr Sec School` (4 Labs, 120 Systems) + 4 other institutions.
- **Lab**: `Computer Lab - Main Lab` with full 20-workstation grid (`PC-01` to `PC-20`), Teacher's Desk, and Entrance.
- **Hero Asset**: `PC-07` (`VMHS-PC-007`) — Dell OptiPlex 3080, i5 10th Gen, 8GB RAM, 256GB SSD, IP `192.168.1.107`, MAC `3C:52:82:1A:9F:3D`, Monitor `Dell 21.5"`.
- **Ticket**: `#TKT-1024` — High priority, "Monitor not working", in-progress with technician Karthik.
- **Timeline & Chat**: Full 4-step history and 2-message dialogue matching the design prototype.
- **Diagnosis Checklist**: 5 items with power and cable verification completed.
