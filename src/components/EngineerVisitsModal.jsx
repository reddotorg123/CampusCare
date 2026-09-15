import React, { useState } from 'react';
import { 
  X, 
  UserCheck, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Wrench, 
  Plus, 
  FileText, 
  Building,
  ShieldCheck,
  PhoneCall
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function EngineerVisitsModal({
  visits,
  engineers,
  labs,
  tickets,
  currentRole, // 'admin' | 'school'
  onClose,
  onLogVisit
}) {
  const [showLogForm, setShowLogForm] = useState(false);
  const [selectedEngineerId, setSelectedEngineerId] = useState(engineers[0]?.id || '');
  const [selectedLabId, setSelectedLabId] = useState(labs[0]?.id || '');
  const [workSummary, setWorkSummary] = useState('');
  const [signOffName, setSignOffName] = useState('Prof. Anderson');
  const [attendedTicketIds, setAttendedTicketIds] = useState([]);
  const [durationHours, setDurationHours] = useState(2.0);

  const openTicketsInLab = tickets.filter(t => t.labId === selectedLabId && t.status !== 'resolved');

  const handleToggleTicket = (ticketId) => {
    if (attendedTicketIds.includes(ticketId)) {
      setAttendedTicketIds(attendedTicketIds.filter(id => id !== ticketId));
    } else {
      setAttendedTicketIds([...attendedTicketIds, ticketId]);
    }
  };

  const handleSubmitVisit = (e) => {
    e.preventDefault();
    const engineer = engineers.find(eng => eng.id === selectedEngineerId) || engineers[0];
    const lab = labs.find(l => l.id === selectedLabId) || labs[0];

    const newVisit = {
      id: `VISIT-${Math.floor(200 + Math.random() * 800)}`,
      schoolId: 'sch-client',
      schoolName: 'Westbridge Academy',
      labId: lab.id,
      labName: lab.name,
      room: lab.room,
      engineerId: engineer.id,
      engineerName: engineer.name,
      engineerRole: engineer.role,
      visitDate: new Date().toISOString(),
      status: 'completed',
      ticketsAttended: attendedTicketIds,
      workSummary: workSummary || 'Regular routine diagnostic and equipment inspection performed.',
      schoolSignOffBy: signOffName || 'Lab Assistant',
      durationHours: parseFloat(durationHours) || 2.0
    };

    onLogVisit(newVisit);
    setShowLogForm(false);
    setWorkSummary('');
    setAttendedTicketIds([]);

    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    } catch (err) {}
  };

  return (
    <div className="modal-fullscreen-sheet" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="modal-header">
        <div className="modal-title">
          <UserCheck size={20} style={{ color: 'var(--cisco-blue)' }} />
          <span>Engineer Visits & Service Logs</span>
        </div>

        <button className="icon-btn" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
      </div>

      <div className="modal-content-scroll">
        {/* Banner */}
        <div style={{ background: 'var(--bg-surface)', padding: '12px 14px', borderRadius: '12px', border: '1px solid var(--border-subtle)', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>
              On-Site IT Technician Service Record
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {currentRole === 'admin' ? 'MSP Engineer Dispatch & Service Attendance' : 'School Service History & Signed-Off Tickets'}
            </div>
          </div>

          {currentRole === 'admin' && (
            <button 
              className="action-btn-primary" 
              style={{ padding: '6px 12px', fontSize: '11px', gap: '4px' }}
              onClick={() => setShowLogForm(!showLogForm)}
            >
              <Plus size={14} />
              <span>{showLogForm ? 'Cancel' : 'Log New Visit'}</span>
            </button>
          )}
        </div>

        {/* Admin Form: Log New Site Visit */}
        {showLogForm && (
          <form 
            onSubmit={handleSubmitVisit}
            style={{ 
              background: 'var(--bg-surface)', 
              borderRadius: '14px', 
              border: '1px solid var(--cisco-blue)', 
              padding: '16px', 
              marginBottom: '18px',
              animation: 'slideUp 0.2s ease-out'
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--cisco-blue)', marginBottom: '12px' }}>
              Log Field Engineer Service Visit
            </div>

            {/* Select Engineer */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                Assigned Support Engineer
              </label>
              <select
                value={selectedEngineerId}
                onChange={e => setSelectedEngineerId(e.target.value)}
                style={{ width: '100%' }}
              >
                {engineers.map(eng => (
                  <option key={eng.id} value={eng.id}>
                    {eng.name} — {eng.role}
                  </option>
                ))}
              </select>
            </div>

            {/* Select Lab */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                School Lab Inspected
              </label>
              <select
                value={selectedLabId}
                onChange={e => {
                  setSelectedLabId(e.target.value);
                  setAttendedTicketIds([]);
                }}
                style={{ width: '100%' }}
              >
                {labs.map(lab => (
                  <option key={lab.id} value={lab.id}>
                    {lab.name} ({lab.room})
                  </option>
                ))}
              </select>
            </div>

            {/* Tickets attended */}
            {openTicketsInLab.length > 0 && (
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Tickets Resolved During This Visit (Tap to include):
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {openTicketsInLab.map(t => {
                    const isChecked = attendedTicketIds.includes(t.id);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleToggleTicket(t.id)}
                        style={{
                          padding: '8px 10px',
                          borderRadius: '8px',
                          background: isChecked ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-primary)',
                          border: isChecked ? '1px solid #10b981' : '1px solid var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          textAlign: 'left'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: isChecked ? '#10b981' : 'var(--text-main)' }}>
                            [{t.deviceCode}] {t.title}
                          </div>
                          <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Ticket {t.ticketNumber}</div>
                        </div>
                        {isChecked && <CheckCircle2 size={16} style={{ color: '#10b981' }} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Work Summary */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                Technician Work Summary & Actions Taken
              </label>
              <textarea
                placeholder="e.g. Cleaned laser printer optical sensors, replaced DP cables, reimaged boot partition..."
                value={workSummary}
                onChange={e => setWorkSummary(e.target.value)}
                rows={2}
                style={{ width: '100%', resize: 'none' }}
                required
              />
            </div>

            {/* School Sign-off */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px', marginBottom: '14px' }}>
              <div>
                <label style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>School Faculty Sign-Off</label>
                <input
                  type="text"
                  placeholder="e.g. Prof. Anderson"
                  value={signOffName}
                  onChange={e => setSignOffName(e.target.value)}
                  style={{ width: '100%' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '10px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Hours Spent</label>
                <input
                  type="number"
                  step="0.5"
                  value={durationHours}
                  onChange={e => setDurationHours(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <button type="submit" className="action-btn-primary" style={{ width: '100%', padding: '10px' }}>
              <CheckCircle2 size={16} />
              <span>Submit & Record On-Site Visit</span>
            </button>
          </form>
        )}

        {/* Visit Logs List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {visits.map(visit => {
            const isDone = visit.status === 'completed';
            const resolvedTickets = tickets.filter(t => visit.ticketsAttended?.includes(t.id));

            return (
              <div 
                key={visit.id}
                style={{
                  background: 'var(--bg-surface)',
                  borderRadius: '14px',
                  border: '1px solid var(--border-subtle)',
                  padding: '14px',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {/* Top Row: Engineer & Date */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div 
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #00bceb 0%, #0284c7 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '13px'
                      }}
                    >
                      {visit.engineerName.split(' ').map(n => n[0]).join('')}
                    </div>

                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>
                        {visit.engineerName}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {visit.engineerRole}
                      </div>
                    </div>
                  </div>

                  <span className={`badge ${isDone ? 'badge-operational' : 'badge-in_progress'}`} style={{ fontSize: '10px' }}>
                    {isDone ? 'Visit Completed' : 'Active On-Site'}
                  </span>
                </div>

                {/* Visit Location & Time Banner */}
                <div style={{ background: 'var(--bg-primary)', padding: '6px 10px', borderRadius: '8px', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>📍 {visit.labName} ({visit.room})</span>
                  <span>🗓️ {new Date(visit.visitDate).toLocaleDateString()}</span>
                </div>

                {/* Work Summary */}
                <div style={{ fontSize: '12px', color: 'var(--text-main)', lineHeight: '1.4', marginBottom: '10px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--cisco-blue)' }}>Service Report: </span>
                  {visit.workSummary}
                </div>

                {/* Tickets Attended Pills */}
                {resolvedTickets.length > 0 && (
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700, marginBottom: '4px' }}>
                      Attended Issues ({resolvedTickets.length}):
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {resolvedTickets.map(t => (
                        <span 
                          key={t.id}
                          style={{
                            background: 'rgba(16, 185, 129, 0.12)',
                            color: '#10b981',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            borderRadius: '6px',
                            padding: '2px 6px',
                            fontSize: '10px',
                            fontFamily: 'var(--font-mono)'
                          }}
                        >
                          ✓ [{t.deviceCode}] {t.title.slice(0, 26)}...
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer Sign-off */}
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-dim)' }}>
                  <span>✍️ Signed off by: <strong style={{ color: 'var(--text-main)' }}>{visit.schoolSignOffBy}</strong></span>
                  <span>⏱️ Duration: {visit.durationHours || 2} hrs</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
