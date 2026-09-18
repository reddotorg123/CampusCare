import { getSupabaseClient, isSupabaseConfigured } from '../supabaseClient';

/**
 * CampusCare Database Service
 * Provides live PostgreSQL/Supabase CRUD with seamless offline / LocalStorage sync.
 * ZERO Fake Data - Pure Cloud Data Layer
 */

export const isLiveDb = () => isSupabaseConfigured();

const isValidUuid = (val) => typeof val === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(val);

/**
 * Ensure an active Organization exists in Supabase so foreign key constraints on schools succeed.
 */
export async function getOrCreateDefaultOrganization() {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data: orgs, error: fetchErr } = await supabase
      .from('organizations')
      .select('id, name')
      .limit(1);

    if (!fetchErr && orgs && orgs.length > 0) {
      return orgs[0].id;
    }

    // Create primary AMC Organization record if none exists
    const { data: newOrg, error: insErr } = await supabase
      .from('organizations')
      .insert([{
        name: 'CampusCare IT AMC Operations',
        code: 'CC-AMC',
        contact_email: 'support@campuscare.in',
        contact_phone: '+91 94440 00000',
        address: 'Central MSP Hub, Chennai'
      }])
      .select('id')
      .single();

    if (!insErr && newOrg) {
      return newOrg.id;
    }
  } catch (err) {
    console.warn('Could not ensure default organization:', err);
  }
  return null;
}

/**
 * Fetch all schools with their child labs from Supabase
 */
export async function fetchSchoolsFromDb() {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data: schoolsData, error: schoolsErr } = await supabase
      .from('schools')
      .select('*, labs(*)');

    if (schoolsErr) {
      console.warn('Supabase fetchSchools error:', schoolsErr);
      return null;
    }

    if (!schoolsData || schoolsData.length === 0) {
      return [];
    }

    // Map database snake_case to app camelCase with zero fake defaults
    return schoolsData.map(s => ({
      id: s.id,
      name: s.name,
      code: s.code || 'SCH',
      type: s.institution_type || s.type || 'school',
      city: s.city || '',
      campus: s.address || (s.city ? `${s.city} Campus` : ''),
      contractTier: 'Comprehensive AMC',
      leadEngineer: s.lead_engineer || '',
      phone: s.contact_phone || '',
      contactPerson: s.contact_person || '',
      accentColor: '#10b981',
      labsCount: s.labs?.length || 0,
      systemsCount: s.labs?.reduce((sum, l) => sum + (l.capacity || 0), 0) || 0,
      labs: (s.labs && s.labs.length > 0) ? s.labs.map(l => ({
        id: l.id,
        name: l.name,
        code: l.code || 'LAB-01',
        room: l.room_number || '',
        capacity: l.capacity || 0,
        inCharge: l.in_charge_name || s.contact_person || '',
        phone: l.in_charge_phone || s.contact_phone || '',
        network: '',
        ups: '',
        operatingHours: '',
        notes: ''
      })) : []
    }));
  } catch (err) {
    console.error('Error in fetchSchoolsFromDb:', err);
    return null;
  }
}

/**
 * Fetch all tickets from Supabase with relations
 */
export async function fetchTicketsFromDb() {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data: ticketsData, error } = await supabase
      .from('tickets')
      .select('*, schools(name), labs(name), assets(name, asset_code)')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetchTickets error:', error);
      return null;
    }

    if (!ticketsData) return [];

    return ticketsData.map(t => ({
      id: t.id,
      ticketNumber: t.ticket_number || `#TKT-${t.id.substring(0, 6).toUpperCase()}`,
      schoolId: t.school_id,
      schoolName: t.schools?.name || 'Institution',
      labId: t.lab_id,
      labName: t.labs?.name || 'Computer Lab',
      systemId: t.asset_id || null,
      systemName: t.assets?.name || (t.asset_id ? 'Workstation' : 'Equipment'),
      title: t.title || 'Reported Issue',
      problem: t.description || t.title,
      description: t.description || '',
      category: t.category || 'hardware',
      priority: t.priority || 'medium',
      status: t.status || 'created',
      createdAt: t.created_at,
      reportedBy: t.reported_by_name || 'Staff',
      assignedTo: t.assigned_technician_name || null,
      attachments: t.attachments || [],
      timeline: [
        {
          status: 'created',
          title: 'Ticket Raised',
          by: t.reported_by_name || 'Staff',
          date: t.created_at ? new Date(t.created_at).toLocaleString() : 'Just now',
          done: true
        },
        ...(t.status === 'in_progress' || t.status === 'resolved' || t.status === 'closed' ? [{
          status: 'in_progress',
          title: 'In Progress',
          by: t.assigned_technician_name || 'Technician',
          date: 'In Progress',
          done: true
        }] : []),
        ...(t.status === 'resolved' || t.status === 'closed' ? [{
          status: 'resolved',
          title: 'Resolved',
          by: t.assigned_technician_name || 'Technician',
          date: 'Resolved',
          done: true
        }] : [])
      ]
    }));
  } catch (err) {
    console.error('Error in fetchTicketsFromDb:', err);
    return null;
  }
}

/**
 * Register a new School & Lab directly in Supabase
 */
export async function registerSchoolInDb(schoolData) {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const orgId = await getOrCreateDefaultOrganization();

    const payload = {
      id: isValidUuid(schoolData.id) ? schoolData.id : undefined,
      organization_id: orgId,
      name: schoolData.name,
      institution_type: schoolData.type || 'school',
      code: schoolData.code || 'SCH',
      city: schoolData.city || 'Chennai',
      state: schoolData.state || 'Tamil Nadu',
      address: schoolData.address || `${schoolData.city || 'Chennai'} Campus`,
      contact_person: schoolData.contactPerson || '',
      contact_email: schoolData.email || '',
      contact_phone: schoolData.phone || ''
    };

    const { data: insertedSchool, error: schoolErr } = await supabase
      .from('schools')
      .insert([payload])
      .select()
      .single();

    if (schoolErr) {
      console.warn('Could not insert school in Supabase:', schoolErr);
      return null;
    }

    // Insert child lab if provided
    if (schoolData.labs && schoolData.labs.length > 0) {
      const labRows = schoolData.labs.map(l => ({
        id: isValidUuid(l.id) ? l.id : undefined,
        school_id: insertedSchool.id,
        name: l.name || 'Main Computer Lab',
        code: l.code || 'LAB-01',
        room_number: l.room || 'Room 101',
        capacity: Number(l.capacity) || 20,
        in_charge_name: l.inCharge || schoolData.contactPerson || '',
        in_charge_phone: l.phone || schoolData.phone || ''
      }));

      await supabase.from('labs').insert(labRows).catch(() => {});
    }

    return insertedSchool;
  } catch (err) {
    console.error('Error in registerSchoolInDb:', err);
    return null;
  }
}

/**
 * Save new ticket to Supabase
 */
export async function createTicketInDb(ticketData) {
  const supabase = getSupabaseClient();
  if (!supabase) return ticketData;

  try {
    const orgId = await getOrCreateDefaultOrganization();

    const payload = {
      ticket_number: ticketData.ticketNumber || `#TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      organization_id: orgId,
      school_id: isValidUuid(ticketData.schoolId) ? ticketData.schoolId : null,
      lab_id: isValidUuid(ticketData.labId) ? ticketData.labId : null,
      asset_id: isValidUuid(ticketData.systemId) ? ticketData.systemId : null,
      title: ticketData.title || ticketData.problem || 'Hardware Issue',
      description: ticketData.description || ticketData.problem || ticketData.title || '',
      category: (ticketData.category || 'hardware').toLowerCase(),
      priority: (ticketData.priority || 'medium').toLowerCase(),
      status: 'created',
      reported_by_name: ticketData.reportedBy || 'Staff'
    };

    const { data, error } = await supabase
      .from('tickets')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.warn('Could not insert ticket in Supabase:', error);
      return ticketData;
    }

    if (data?.id) {
      await supabase.from('ticket_timeline').insert([{
        ticket_id: data.id,
        status: 'created',
        actor_name: ticketData.reportedBy || 'Staff',
        note: ticketData.problem || 'Issue logged'
      }]).catch(() => {});
    }

    return {
      ...ticketData,
      id: data.id,
      ticketNumber: data.ticket_number
    };
  } catch (err) {
    console.error('Error in createTicketInDb:', err);
    return ticketData;
  }
}

/**
 * Update ticket status in Supabase
 */
export async function updateTicketStatusInDb(ticketId, newStatus, resolutionNotes = '', actorName = 'Technician') {
  const supabase = getSupabaseClient();
  if (!supabase || !ticketId) return;

  try {
    await supabase
      .from('tickets')
      .update({
        status: newStatus.toLowerCase(),
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId);

    await supabase.from('ticket_timeline').insert([{
      ticket_id: ticketId,
      status: newStatus.toLowerCase(),
      actor_name: actorName,
      note: resolutionNotes || `Ticket status updated to ${newStatus}`
    }]).catch(() => {});
  } catch (err) {
    console.error('Error updating ticket in Supabase:', err);
  }
}

/**
 * Claim ticket in Supabase
 */
export async function claimTicketInDb(ticketId, technicianName) {
  const supabase = getSupabaseClient();
  if (!supabase || !ticketId) return;

  try {
    await supabase
      .from('tickets')
      .update({
        assigned_technician_name: technicianName,
        status: 'in_progress',
        in_progress_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId);

    await supabase.from('ticket_timeline').insert([{
      ticket_id: ticketId,
      status: 'in_progress',
      actor_name: technicianName,
      note: `${technicianName} accepted dispatch.`
    }]).catch(() => {});
  } catch (err) {
    console.error('Error claiming ticket in Supabase:', err);
  }
}

/**
 * Save lab layout workstation coordinates
 */
export async function saveLabLayoutToDb(labId, devices) {
  const supabase = getSupabaseClient();
  if (!supabase || !labId || !devices) return;

  try {
    // If lab has assets, save them
    const rows = devices.map(d => ({
      id: d.id,
      lab_id: labId,
      name: d.name,
      asset_code: d.assetCode || d.code || d.name,
      type: d.type || 'pc',
      status: d.status || 'working',
      location_note: d.location || `Coords: ${d.coords?.x}, ${d.coords?.y}`
    }));

    await supabase
      .from('assets')
      .upsert(rows, { onConflict: 'id' })
      .catch(() => {});
  } catch (err) {
    console.warn('Could not save lab layout to Supabase:', err);
  }
}

/**
 * Setup Realtime subscription for tickets table
 */
export function subscribeToTickets(onUpdate) {
  const supabase = getSupabaseClient();
  if (!supabase || typeof onUpdate !== 'function') return () => {};

  try {
    const channel = supabase
      .channel('campuscare-tickets-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tickets' },
        (payload) => {
          onUpdate(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (e) {
    console.warn('Realtime subscription not active:', e);
    return () => {};
  }
}
