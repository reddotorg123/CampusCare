import React, { useState } from 'react';
import { 
  X, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ArrowRight, 
  Monitor, 
  Printer, 
  Search,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function TicketListModal({
  tickets,
  labs,
  onClose,
  onResolveTicket,
  onSelectDeviceOnMap
}) {
  const [filterLab, setFilterLab] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('active'); // 'all' | 'active' | 'resolved'
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTickets = tickets.filter(t => {
    if (filterLab !== 'all' && t.labId !== filterLab) return false;
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    if (filterStatus === 'active' && t.status === 'resolved') return false;
    if (filterStatus === 'resolved' && t.status !== 'resolved') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = `${t.title} ${t.description} ${t.deviceCode} ${t.deviceName} ${t.reportedBy}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }

    return true;
  });

  const triggerCelebrate = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 }
      });
    } catch (e) {}
  };

  return (
    <div className="modal-fullscreen-sheet">
      {/* Modal Header */}
      <div className="modal-header">
        <div className="modal-title">
          <AlertCircle size={20} style={{ color: 'var(--cisco-blue)' }} />
          <span>School IT Tickets Center</span>
          <span className="badge badge-critical" style={{ fontSize: '10px' }}>
            {tickets.filter(t => t.status !== 'resolved').length} Open
          </span>
        </div>

        <button className="icon-btn" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
      </div>

      {/* Filter Bar */}
      <div style={{ padding: '12px 16px', background: 'var(--bg-panel)', borderBottom: '1px solid var(--border-subtle)' }}>
        {/* Search Input */}
        <div style={{ position: 'relative', marginBottom: '10px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-dim)' }} />
          <input
            type="text"
            placeholder="Search tickets, PC bench, printer model..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '100%', paddingLeft: '36px' }}
          />
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {/* Status Tabs */}
          <button
            className={`pt-pill-btn ${filterStatus === 'active' ? 'active-issues' : ''}`}
            onClick={() => setFilterStatus('active')}
          >
            Active Issues
          </button>
          <button
            className={`pt-pill-btn ${filterStatus === 'all' ? 'active-all' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All Tickets
          </button>
          <button
            className={`pt-pill-btn ${filterStatus === 'resolved' ? 'active-all' : ''}`}
            onClick={() => setFilterStatus('resolved')}
          >
            Resolved
          </button>

          {/* Priority filter */}
          <select 
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value)}
            style={{ padding: '4px 8px', fontSize: '11px', borderRadius: '14px' }}
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Lab filter */}
          <select
            value={filterLab}
            onChange={e => setFilterLab(e.target.value)}
            style={{ padding: '4px 8px', fontSize: '11px', borderRadius: '14px' }}
          >
            <option value="all">All Labs</option>
            {labs.map(l => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Ticket List Scroll Area */}
      <div className="modal-content-scroll">
        {filteredTickets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <CheckCircle2 size={48} style={{ color: '#10b981', margin: '0 auto 12px auto' }} />
            <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-main)' }}>No matching tickets found</div>
            <div style={{ fontSize: '12px', marginTop: '4px' }}>Try clearing filters or search keywords.</div>
          </div>
        ) : (
          filteredTickets.map(ticket => {
            const isResolved = ticket.status === 'resolved';

            return (
              <div key={ticket.id} className="ticket-card">
                <div className="ticket-top-row">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {ticket.deviceType === 'printer' ? (
                      <Printer size={16} style={{ color: 'var(--cisco-blue)' }} />
                    ) : (
                      <Monitor size={16} style={{ color: 'var(--cisco-blue)' }} />
                    )}
                    <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-main)' }}>
                      {ticket.deviceCode}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      ({ticket.deviceName})
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '5px' }}>
                    <span className={`badge badge-${ticket.priority}`}>
                      {ticket.priority}
                    </span>
                    <span className={`badge badge-${ticket.status}`}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="ticket-card-title">{ticket.title}</div>
                <div className="ticket-card-desc">{ticket.description}</div>

                {/* Location banner */}
                <div style={{ 
                  background: 'var(--bg-primary)', 
                  padding: '6px 10px', 
                  borderRadius: '6px', 
                  fontSize: '11px', 
                  color: 'var(--text-muted)',
                  marginBottom: '10px',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span>📍 {ticket.labName} ({ticket.room})</span>
                  <span>ID: {ticket.ticketNumber}</span>
                </div>

                <div className="ticket-meta-footer">
                  <div>
                    <span>Assignee: {ticket.assignedTo || 'Unassigned'}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {/* Jump to Device on Map button */}
                    <button
                      className="action-btn-secondary"
                      onClick={() => onSelectDeviceOnMap(ticket.deviceId, ticket.labId)}
                      title="Locate on Topology Canvas"
                      style={{ padding: '6px 10px', fontSize: '11px', gap: '4px' }}
                    >
                      <span>Locate on Map</span>
                      <ArrowRight size={13} />
                    </button>

                    {/* Resolve button */}
                    {!isResolved && (
                      <button
                        className="action-btn-resolve"
                        onClick={() => {
                          triggerCelebrate();
                          onResolveTicket(ticket.id, ticket.deviceId);
                        }}
                      >
                        <CheckCircle2 size={13} />
                        <span>Resolve</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
