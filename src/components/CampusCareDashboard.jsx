import React from 'react';
import { Menu, Bell, PlusCircle, Ticket, MapPin, FileText, ChevronRight } from 'lucide-react';

export function CampusCareDashboard({ 
  tickets = [], 
  onSelectTicket, 
  onNavigateTo,
  onQuickAction
}) {
  return (
    <div className="screen-scroll-container">
      {/* Top Header Bar */}
      <div className="screen-header-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="icon-button" onClick={() => onNavigateTo('schools')} title="Menu">
            <Menu size={20} />
          </button>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--navy-900)' }}>
              CampusCare
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
              Organization Dashboard
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-muted)', textAlign: 'right' }}>
            Mon, 15 Sep 2025
          </div>
          <button className="icon-button" style={{ position: 'relative' }}>
            <Bell size={18} />
            <span style={{ 
              position: 'absolute', 
              top: '4px', 
              right: '4px', 
              width: '7px', 
              height: '7px', 
              borderRadius: '50%', 
              background: 'var(--status-issue)' 
            }} />
          </button>
        </div>
      </div>

      {/* Main Dashboard Body */}
      <div style={{ padding: '16px' }}>
        {/* KPI 4-Card Grid (2x2) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
          {/* Open Tickets */}
          <div style={{ 
            background: '#ffffff', 
            borderRadius: '12px', 
            padding: '14px', 
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--status-issue)' }}>
              24
            </div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-body)', marginTop: '2px' }}>
              Open Tickets
            </div>
          </div>

          {/* In Progress */}
          <div style={{ 
            background: '#ffffff', 
            borderRadius: '12px', 
            padding: '14px', 
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--status-service)' }}>
              12
            </div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-body)', marginTop: '2px' }}>
              In Progress
            </div>
          </div>

          {/* Pending */}
          <div style={{ 
            background: '#ffffff', 
            borderRadius: '12px', 
            padding: '14px', 
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--status-warning)' }}>
              5
            </div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-body)', marginTop: '2px' }}>
              Pending
            </div>
          </div>

          {/* Total Assets */}
          <div style={{ 
            background: '#ffffff', 
            borderRadius: '12px', 
            padding: '14px', 
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--status-working)' }}>
              148
            </div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-body)', marginTop: '2px' }}>
              Total Assets
            </div>
          </div>
        </div>

        {/* Recent Tickets Section */}
        <div style={{ marginBottom: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>
              Recent Tickets
            </h2>
            <button 
              onClick={() => onNavigateTo('tickets')}
              style={{ background: 'none', border: 'none', color: 'var(--blue-600)', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
            >
              View All
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {tickets.map(ticket => {
              const borderLeftColor = 
                ticket.priority === 'high' ? 'var(--status-issue)' :
                ticket.priority === 'medium' ? 'var(--status-service)' : 'var(--status-working)';

              return (
                <div 
                  key={ticket.id}
                  onClick={() => onSelectTicket(ticket)}
                  className="card-item clickable"
                  style={{ 
                    padding: '12px 14px', 
                    marginBottom: 0,
                    borderLeft: `4px solid ${borderLeftColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--navy-900)' }}>
                        {ticket.ticketNumber}
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-body)' }}>
                        {ticket.labName} {ticket.systemName ? `– ${ticket.systemName}` : ''}
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {ticket.problem}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', marginLeft: '12px' }}>
                    <span style={{ 
                      fontSize: '10px', 
                      fontWeight: '700',
                      color: ticket.priority === 'high' ? 'var(--status-issue)' : ticket.priority === 'medium' ? 'var(--status-warning)' : 'var(--status-working)'
                    }}>
                      {ticket.priority.toUpperCase()}
                    </span>
                    <div style={{ fontSize: '10px', color: 'var(--text-light)', marginTop: '2px' }}>
                      {ticket.relativeTime || '2h ago'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '10px' }}>
            Quick Actions
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            <button 
              onClick={() => onQuickAction('add_school')}
              style={{
                background: '#ffffff',
                border: '1px solid var(--border-light)',
                borderRadius: '12px',
                padding: '12px 4px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ color: 'var(--navy-800)' }}>
                <PlusCircle size={20} />
              </div>
              <span style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-body)' }}>
                Add School
              </span>
            </button>

            <button 
              onClick={() => onQuickAction('assign_ticket')}
              style={{
                background: '#ffffff',
                border: '1px solid var(--border-light)',
                borderRadius: '12px',
                padding: '12px 4px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ color: 'var(--navy-800)' }}>
                <Ticket size={20} />
              </div>
              <span style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-body)' }}>
                Assign Ticket
              </span>
            </button>

            <button 
              onClick={() => onNavigateTo('lab_map')}
              style={{
                background: '#ffffff',
                border: '1px solid var(--border-light)',
                borderRadius: '12px',
                padding: '12px 4px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ color: 'var(--navy-800)' }}>
                <MapPin size={20} />
              </div>
              <span style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-body)' }}>
                View Map
              </span>
            </button>

            <button 
              onClick={() => onQuickAction('reports')}
              style={{
                background: '#ffffff',
                border: '1px solid var(--border-light)',
                borderRadius: '12px',
                padding: '12px 4px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ color: 'var(--navy-800)' }}>
                <FileText size={20} />
              </div>
              <span style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-body)' }}>
                Reports
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
