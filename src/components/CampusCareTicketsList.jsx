import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  PlusCircle, 
  Ticket, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  Paperclip,
  ChevronRight,
  Filter
} from 'lucide-react';

export function CampusCareTicketsList({
  tickets = [],
  currentUser,
  currentSchool,
  onSelectTicket,
  onRaiseTicket,
  onBack
}) {
  const [filterMode, setFilterMode] = useState('unsolved'); // 'unsolved' | 'in_progress' | 'resolved' | 'all'
  const [searchQuery, setSearchQuery] = useState('');

  // Filter tickets:
  // If School Staff, strictly filter to this school's tickets!
  const schoolTickets = currentUser?.role === 'school_staff'
    ? tickets.filter(t => t.schoolId === currentUser.schoolId || t.schoolName === currentSchool?.name)
    : tickets;

  const unsolvedTickets = schoolTickets.filter(t => t.status !== 'resolved' && t.status !== 'closed');
  const inProgressTickets = schoolTickets.filter(t => t.status === 'in_progress');
  const resolvedTickets = schoolTickets.filter(t => t.status === 'resolved' || t.status === 'closed');

  const filteredTickets = schoolTickets.filter(ticket => {
    // 1. Status Filter
    if (filterMode === 'unsolved') {
      if (ticket.status === 'resolved' || ticket.status === 'closed') return false;
    } else if (filterMode === 'in_progress') {
      if (ticket.status !== 'in_progress') return false;
    } else if (filterMode === 'resolved') {
      if (ticket.status !== 'resolved' && ticket.status !== 'closed') return false;
    }

    // 2. Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNumber = ticket.ticketNumber?.toLowerCase().includes(q);
      const matchSystem = (ticket.systemName || ticket.systemId)?.toLowerCase().includes(q);
      const matchProblem = (ticket.problem || ticket.title)?.toLowerCase().includes(q);
      const matchLab = ticket.labName?.toLowerCase().includes(q);
      return matchNumber || matchSystem || matchProblem || matchLab;
    }

    return true;
  });

  return (
    <div className="screen-scroll-container">
      {/* Header Bar */}
      <div className="screen-header-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {onBack && (
            <button className="icon-button" onClick={onBack} title="Back">
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <span className="screen-header-title">
              {currentUser?.role === 'school_staff' ? 'My School Tickets' : 'Service Tickets'}
            </span>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
              {currentSchool?.name || currentUser?.schoolName || 'CampusCare'} • {unsolvedTickets.length} Unsolved
            </div>
          </div>
        </div>

        <button 
          onClick={onRaiseTicket}
          style={{
            background: 'var(--navy-800)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '6px 12px',
            fontSize: '11px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <PlusCircle size={14} />
          <span>Report Issue</span>
        </button>
      </div>

      <div style={{ padding: '12px 16px' }}>
        {/* Search Bar */}
        <div style={{ position: 'relative', marginBottom: '10px' }}>
          <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Ticket #, PC code, or problem..."
            className="form-input"
            style={{ paddingLeft: '32px', height: '34px', fontSize: '11.5px' }}
          />
        </div>

        {/* Filter Pills (Defaulted to Present Unsolved Tickets!) */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '12px' }}>
          <button
            type="button"
            onClick={() => setFilterMode('unsolved')}
            style={{
              padding: '6px 12px',
              borderRadius: '20px',
              border: filterMode === 'unsolved' ? '2px solid var(--navy-800)' : '1px solid var(--border-mid)',
              background: filterMode === 'unsolved' ? 'var(--navy-800)' : '#ffffff',
              color: filterMode === 'unsolved' ? '#ffffff' : 'var(--text-main)',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap'
            }}
          >
            <span>Present Unsolved</span>
            <span style={{
              background: filterMode === 'unsolved' ? 'var(--status-issue)' : '#ef4444',
              color: '#ffffff',
              borderRadius: '10px',
              padding: '1px 6px',
              fontSize: '9px',
              fontWeight: 800
            }}>
              {unsolvedTickets.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilterMode('in_progress')}
            style={{
              padding: '6px 12px',
              borderRadius: '20px',
              border: filterMode === 'in_progress' ? '2px solid var(--navy-800)' : '1px solid var(--border-mid)',
              background: filterMode === 'in_progress' ? 'var(--navy-800)' : '#ffffff',
              color: filterMode === 'in_progress' ? '#ffffff' : 'var(--text-main)',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap'
            }}
          >
            <span>In Progress</span>
            <span style={{
              background: filterMode === 'in_progress' ? 'rgba(255,255,255,0.3)' : '#f1f5f9',
              color: filterMode === 'in_progress' ? '#ffffff' : 'var(--navy-800)',
              borderRadius: '10px',
              padding: '1px 6px',
              fontSize: '9px'
            }}>
              {inProgressTickets.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilterMode('resolved')}
            style={{
              padding: '6px 12px',
              borderRadius: '20px',
              border: filterMode === 'resolved' ? '2px solid var(--navy-800)' : '1px solid var(--border-mid)',
              background: filterMode === 'resolved' ? 'var(--navy-800)' : '#ffffff',
              color: filterMode === 'resolved' ? '#ffffff' : 'var(--text-main)',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap'
            }}
          >
            <span>Resolved</span>
            <span style={{
              background: filterMode === 'resolved' ? 'rgba(255,255,255,0.3)' : '#f1f5f9',
              color: filterMode === 'resolved' ? '#ffffff' : 'var(--navy-800)',
              borderRadius: '10px',
              padding: '1px 6px',
              fontSize: '9px'
            }}>
              {resolvedTickets.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilterMode('all')}
            style={{
              padding: '6px 12px',
              borderRadius: '20px',
              border: filterMode === 'all' ? '2px solid var(--navy-800)' : '1px solid var(--border-mid)',
              background: filterMode === 'all' ? 'var(--navy-800)' : '#ffffff',
              color: filterMode === 'all' ? '#ffffff' : 'var(--text-main)',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            All ({schoolTickets.length})
          </button>
        </div>

        {/* Tickets Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredTickets.length > 0 ? (
            filteredTickets.map(ticket => {
              const isResolved = ticket.status === 'resolved' || ticket.status === 'closed';
              const isInProgress = ticket.status === 'in_progress';

              const statusColor = isResolved ? 'var(--status-working)' : (isInProgress ? 'var(--blue-600)' : 'var(--status-issue)');
              const statusBg = isResolved ? 'var(--status-working-bg)' : (isInProgress ? 'var(--blue-50)' : 'var(--status-issue-bg)');
              const borderLeftColor = 
                ticket.priority?.toLowerCase() === 'high' ? 'var(--status-issue)' :
                ticket.priority?.toLowerCase() === 'medium' ? '#f59e0b' : 'var(--status-working)';

              return (
                <div 
                  key={ticket.id}
                  onClick={() => onSelectTicket(ticket)}
                  className="card-item clickable"
                  style={{
                    borderLeft: `4px solid ${borderLeftColor}`,
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--navy-900)' }}>
                        {ticket.ticketNumber || ticket.id}
                      </span>
                      <span style={{
                        fontSize: '9.5px',
                        fontWeight: '700',
                        color: statusColor,
                        background: statusBg,
                        padding: '1px 6px',
                        borderRadius: '6px'
                      }}>
                        {isInProgress ? 'In Progress' : (isResolved ? 'Resolved' : 'Unsolved')}
                      </span>
                    </div>

                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      {ticket.createdAt || ticket.relativeTime || 'Active'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1, paddingRight: '8px' }}>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>
                        {ticket.labName} • {ticket.systemName || ticket.systemId || 'Equipment'}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px', lineHeight: '1.3' }}>
                        {ticket.problem || ticket.title}
                      </div>
                    </div>

                    {/* Thumbnail if user uploaded photo */}
                    {ticket.attachments && ticket.attachments.length > 0 && (
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        border: '1px solid var(--border-mid)',
                        flexShrink: 0
                      }}>
                        <img 
                          src={ticket.attachments[0].url} 
                          alt="Thumbnail" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px', paddingTop: '4px', borderTop: '1px solid #f1f5f9' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-light)', fontWeight: 600 }}>
                      Assigned: {ticket.assignedTo || ticket.technician || 'Pending Assignment'}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '10px', color: 'var(--blue-600)', fontWeight: 700 }}>
                      <span>View</span>
                      <ChevronRight size={13} />
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px dashed #cbd5e1'
            }}>
              <CheckCircle2 size={36} color="var(--status-working)" style={{ margin: '0 auto 10px auto' }} />
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--navy-900)' }}>
                {filterMode === 'unsolved' ? 'No Unsolved Tickets!' : 'No tickets found'}
              </div>
              <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                {filterMode === 'unsolved' 
                  ? 'All computer lab systems are fully operational in your school.' 
                  : 'No tickets match the selected filter criteria.'}
              </p>
              {filterMode === 'unsolved' && (
                <button
                  onClick={onRaiseTicket}
                  className="btn-primary-navy"
                  style={{ marginTop: '14px', padding: '8px 16px', fontSize: '11px' }}
                >
                  + Report Equipment Issue
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
