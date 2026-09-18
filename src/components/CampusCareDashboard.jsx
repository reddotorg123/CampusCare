import React from 'react';
import { Menu, Bell, PlusCircle, Ticket, MapPin, FileText, ChevronRight, CheckCircle2, Shield, Wrench, School, Database } from 'lucide-react';

export function CampusCareDashboard({ 
  tickets = [], 
  currentUser,
  currentSchool,
  schoolLabs = [],
  labDevices = [],
  onSelectTicket, 
  onNavigateTo,
  onQuickAction,
  isDbConnected = false,
  onOpenDbConfig
}) {
  // Filter tickets strictly to this school if role is school_staff (Data Isolation)
  const schoolTickets = currentUser?.role === 'school_staff'
    ? tickets.filter(t => t.schoolId === currentUser.schoolId || t.schoolName === currentSchool?.name)
    : tickets;

  // Real-time calculated KPI metrics
  const unsolvedTickets = schoolTickets.filter(t => t.status !== 'resolved' && t.status !== 'closed');
  const inProgressCount = schoolTickets.filter(t => t.status === 'in_progress').length;
  const pendingCount = schoolTickets.filter(t => t.status === 'open' || t.status === 'created' || !t.assignedTo || t.assignedTo === 'Unassigned').length;
  const totalAssets = currentSchool?.systemsCount ?? labDevices.filter(d => d.type === 'pc').length;
  const totalLabsCount = (schoolLabs && schoolLabs.length > 0) ? schoolLabs.length : (currentSchool?.labs?.length || 0);

  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="screen-scroll-container">
      {/* Top Header Bar */}
      <div className="screen-header-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
          {currentUser?.role === 'org_admin' && (
            <button className="icon-button" onClick={() => onNavigateTo('schools')} title="All Institutions">
              <Menu size={20} />
            </button>
          )}
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--navy-900)', lineHeight: '1.2', letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentUser?.role === 'technician' 
                ? (currentUser?.schoolName || 'Field Operations')
                : (currentSchool?.name || currentUser?.schoolName || 'CampusCare Dashboard')}
            </div>
            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '2px', lineHeight: '1.2' }}>
              {currentUser?.role === 'school_staff' 
                ? `${totalLabsCount} Computer ${totalLabsCount === 1 ? 'Lab' : 'Labs'} • IT Portal` 
                : 'Central AMC Support'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <div style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-muted)', textAlign: 'right' }}>
            {todayStr}
          </div>
          <button 
            className="icon-button" 
            style={{ position: 'relative' }}
            onClick={() => onNavigateTo('tickets')}
            title="Notifications & Tickets"
          >
            <Bell size={18} />
            {unsolvedTickets.length > 0 && (
              <span style={{ 
                position: 'absolute', 
                top: '4px', 
                right: '4px', 
                width: '7px', 
                height: '7px', 
                borderRadius: '50%', 
                background: 'var(--status-issue)' 
              }} />
            )}
          </button>
        </div>
      </div>

      {/* Main Dashboard Body */}
      <div style={{ padding: '16px' }}>
        {/* Dynamic Real KPI Cards */}
        <div className="kpi-grid">
          {/* Present Unsolved Tickets */}
          <div 
            onClick={() => onNavigateTo('tickets')}
            style={{ 
              background: '#ffffff', 
              borderRadius: '12px', 
              padding: '14px', 
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)',
              cursor: 'pointer'
            }}
          >
            <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--status-issue)' }}>
              {unsolvedTickets.length}
            </div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-body)', marginTop: '2px' }}>
              Present Unsolved
            </div>
          </div>

          {/* In Progress */}
          <div 
            onClick={() => onNavigateTo('tickets')}
            style={{ 
              background: '#ffffff', 
              borderRadius: '12px', 
              padding: '14px', 
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)',
              cursor: 'pointer'
            }}
          >
            <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--status-service)' }}>
              {inProgressCount}
            </div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-body)', marginTop: '2px' }}>
              In Progress
            </div>
          </div>

          {/* Pending Assignment */}
          <div 
            onClick={() => onNavigateTo('tickets')}
            style={{ 
              background: '#ffffff', 
              borderRadius: '12px', 
              padding: '14px', 
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)',
              cursor: 'pointer'
            }}
          >
            <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--status-warning)' }}>
              {pendingCount}
            </div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-body)', marginTop: '2px' }}>
              Pending
            </div>
          </div>

          {/* Total Systems */}
          <div 
            onClick={() => onNavigateTo('lab_map')}
            style={{ 
              background: '#ffffff', 
              borderRadius: '12px', 
              padding: '14px', 
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)',
              cursor: 'pointer'
            }}
          >
            <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--status-working)' }}>
              {totalAssets}
            </div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-body)', marginTop: '2px' }}>
              Lab Systems
            </div>
          </div>
        </div>

        {/* Present Unsolved Tickets Section */}
        <div style={{ marginBottom: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div>
              <h2 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>
                Present Unsolved Tickets
              </h2>
              <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                Active issues requiring technician attention
              </span>
            </div>
            <button 
              onClick={() => onNavigateTo('tickets')}
              style={{ background: 'none', border: 'none', color: 'var(--blue-600)', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
            >
              View All ({unsolvedTickets.length})
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {unsolvedTickets.length > 0 ? (
              unsolvedTickets.slice(0, 5).map(ticket => {
                const borderLeftColor = 
                  ticket.priority?.toLowerCase() === 'high' ? 'var(--status-issue)' :
                  ticket.priority?.toLowerCase() === 'medium' ? 'var(--status-service)' : 'var(--status-working)';

                return (
                  <div 
                    key={ticket.id}
                    onClick={() => onSelectTicket(ticket)}
                    className="card-item clickable"
                    style={{
                      borderLeft: `4px solid ${borderLeftColor}`,
                      padding: '12px 14px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ flex: 1, paddingRight: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--navy-900)' }}>
                          {ticket.ticketNumber || ticket.id}
                        </span>
                        <span style={{
                          fontSize: '9px',
                          fontWeight: 700,
                          color: 'var(--status-issue)',
                          background: 'var(--status-issue-bg)',
                          padding: '1px 6px',
                          borderRadius: '4px'
                        }}>
                          {ticket.status === 'in_progress' ? 'In Progress' : 'Unsolved'}
                        </span>
                      </div>
                      <div style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-main)', marginTop: '3px' }}>
                        {ticket.labName} • {ticket.systemName || ticket.systemId || 'Equipment'}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {ticket.problem || ticket.title}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {ticket.attachments && ticket.attachments.length > 0 && (
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '6px',
                          overflow: 'hidden',
                          border: '1px solid var(--border-mid)'
                        }}>
                          <img 
                            src={ticket.attachments[0].url} 
                            alt="Issue thumbnail" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          />
                        </div>
                      )}
                      <ChevronRight size={16} color="var(--text-muted)" />
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '24px 16px',
                background: '#ffffff',
                borderRadius: '10px',
                border: '1px dashed #cbd5e1'
              }}>
                <CheckCircle2 size={28} color="var(--status-working)" style={{ margin: '0 auto 6px auto' }} />
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy-900)' }}>
                  All systems operational!
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {currentUser?.role === 'technician'
                    ? 'No active dispatch tickets across client campuses.'
                    : currentUser?.role === 'org_admin'
                    ? 'No open service tickets across contracted institutions.'
                    : `There are no present unsolved tickets for ${currentSchool?.name || 'your school'}.`}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div>
          <h2 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '10px' }}>
            Quick Actions
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {/* Action 1: Raise Ticket */}
            <button 
              onClick={() => onNavigateTo('create_ticket')}
              className="quick-action-btn"
            >
              <div style={{ 
                width: '38px', 
                height: '38px', 
                borderRadius: '10px', 
                background: 'var(--blue-50)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <PlusCircle size={20} color="var(--blue-600)" />
              </div>
              <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--navy-900)', textAlign: 'center' }}>
                Raise Ticket
              </span>
            </button>

            {/* Action 2: Lab Map / Field Jobs */}
            <button 
              onClick={() => onNavigateTo(currentUser?.role === 'technician' ? 'engineers' : 'lab_map')}
              className="quick-action-btn"
            >
              <div style={{ 
                width: '38px', 
                height: '38px', 
                borderRadius: '10px', 
                background: '#ecfdf5', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                {currentUser?.role === 'technician' ? (
                  <Wrench size={20} color="#059669" />
                ) : (
                  <MapPin size={20} color="#059669" />
                )}
              </div>
              <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--navy-900)', textAlign: 'center' }}>
                {currentUser?.role === 'technician' ? 'Field Jobs' : 'Lab Layout'}
              </span>
            </button>

            {/* Action 3: My Tickets */}
            <button 
              onClick={() => onNavigateTo('tickets')}
              className="quick-action-btn"
            >
              <div style={{ 
                width: '38px', 
                height: '38px', 
                borderRadius: '10px', 
                background: '#fef3c7', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <Ticket size={20} color="#d97706" />
              </div>
              <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--navy-900)', textAlign: 'center' }}>
                {currentUser?.role === 'technician' ? 'All Tickets' : 'My Tickets'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
