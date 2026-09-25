import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MoreVertical, 
  Navigation, 
  Phone, 
  Calendar, 
  CheckSquare, 
  Square, 
  ChevronDown, 
  Check, 
  AlertTriangle, 
  Zap, 
  Inbox, 
  UserCheck, 
  Clock, 
  XCircle, 
  RotateCcw
} from 'lucide-react';

export function CampusCareTechnicianJob({ 
  tickets = [],
  ticket,
  currentUser,
  onClaimTicket,
  onReleaseTicket,
  onToggleChecklistItem,
  onUpdateStatus,
  onNavigateToMap,
  onBack 
}) {
  const currentTechName = currentUser?.name || 'Field Technician';

  // Open Pool Tickets: Status is open or technician is Unassigned or empty
  const openPoolTickets = tickets.filter(t => 
    t.status === 'open' || !t.technician || t.technician === 'Unassigned'
  );

  // Active Assigned Tickets: Assigned to this technician and not resolved
  const myActiveTickets = tickets.filter(t => 
    (t.technician === currentTechName || t.status === 'in_progress') && 
    t.status !== 'resolved' && 
    t.status !== 'closed'
  );

  const [topMode, setTopMode] = useState(() => myActiveTickets.length > 0 ? 'my_jobs' : 'open_pool');
  const [selectedTicketId, setSelectedTicketId] = useState(() => {
    return (ticket?.id) || (myActiveTickets[0]?.id) || (tickets[0]?.id) || null;
  });
  const [activeTab, setActiveTab] = useState('job'); // 'job' | 'checklist' | 'parts'
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [releaseReason, setReleaseReason] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const activeTicket = tickets.find(t => t.id === selectedTicketId) || myActiveTickets[0] || openPoolTickets[0] || null;

  const handleCall = () => {
    if (activeTicket?.reporterPhone) {
      window.location.href = `tel:${activeTicket.reporterPhone}`;
    } else {
      window.location.href = 'tel:+919444012345';
    }
  };

  const handleClaim = (ticketId) => {
    if (onClaimTicket) {
      onClaimTicket(ticketId, currentTechName);
    } else if (onUpdateStatus) {
      onUpdateStatus(ticketId, 'in_progress');
    }
    setActionSuccess('Job claimed! You are now assigned to this issue.');
    setSelectedTicketId(ticketId);
    setTopMode('my_jobs');
    setTimeout(() => setActionSuccess(''), 3000);
  };

  const handleConfirmRelease = () => {
    if (!selectedTicketId) return;
    if (onReleaseTicket) {
      onReleaseTicket(selectedTicketId, releaseReason || 'Reassigned to open pool by engineer');
    } else if (onUpdateStatus) {
      onUpdateStatus(selectedTicketId, 'open');
    }
    setShowReleaseModal(false);
    setReleaseReason('');
    setActionSuccess('Ticket released back to Open Pool. Other engineers can now accept it.');
    setTopMode('open_pool');
    setTimeout(() => setActionSuccess(''), 3500);
  };

  const handleMarkResolved = (ticketId) => {
    if (onUpdateStatus) {
      onUpdateStatus(ticketId, 'resolved');
    }
    setActionSuccess('Ticket marked as Resolved & Signed Off!');
    setTimeout(() => setActionSuccess(''), 3000);
  };

  return (
    <div className="screen-scroll-container no-bottom-nav">
      {/* Header */}
      <div className="screen-header-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className="icon-button" onClick={onBack} title="Back">
            <ArrowLeft size={20} />
          </button>
          <div>
            <span className="screen-header-title">Field Engineer Portal</span>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{currentTechName}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '12px', background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0' }}>
            🟢 On Duty
          </span>
        </div>
      </div>

      {/* Success Notification Alert */}
      {actionSuccess && (
        <div style={{
          margin: '8px 16px 0 16px',
          padding: '10px 14px',
          background: '#ecfdf5',
          border: '1px solid #10b981',
          borderRadius: '10px',
          color: '#065f46',
          fontSize: '11px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <Check size={16} color="#059669" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Top Main Mode Selector: My Active Jobs vs Open Issues Pool */}
      <div style={{ padding: '12px 16px 4px 16px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          background: '#e2e8f0',
          padding: '3px',
          borderRadius: '10px',
          gap: '4px'
        }}>
          <button
            onClick={() => setTopMode('my_jobs')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px',
              borderRadius: '8px',
              border: 'none',
              background: topMode === 'my_jobs' ? '#ffffff' : 'transparent',
              color: topMode === 'my_jobs' ? 'var(--navy-900)' : '#64748b',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: topMode === 'my_jobs' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <UserCheck size={14} color={topMode === 'my_jobs' ? '#2563eb' : '#64748b'} />
            <span>My Active Jobs ({myActiveTickets.length})</span>
          </button>

          <button
            onClick={() => setTopMode('open_pool')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px',
              borderRadius: '8px',
              border: 'none',
              background: topMode === 'open_pool' ? '#ffffff' : 'transparent',
              color: topMode === 'open_pool' ? '#b45309' : '#64748b',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: topMode === 'open_pool' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <Inbox size={14} color={topMode === 'open_pool' ? '#d97706' : '#64748b'} />
            <span>Open Pool ({openPoolTickets.length})</span>
          </button>
        </div>
      </div>

      {/* ==================== VIEW 1: OPEN ISSUES POOL ==================== */}
      {topMode === 'open_pool' && (
        <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{
            background: '#fffbeb',
            border: '1px solid #fde68a',
            padding: '10px 12px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            fontSize: '11px',
            color: '#92400e'
          }}>
            <Zap size={16} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>
              <strong>Open Dispatch Queue:</strong> These reported issues are unassigned or released by another engineer. Any field engineer can accept and claim them.
            </span>
          </div>

          {openPoolTickets.length === 0 ? (
            <div style={{
              background: '#ffffff',
              border: '1px dashed #cbd5e1',
              borderRadius: '12px',
              padding: '36px 16px',
              textAlign: 'center',
              color: '#64748b'
            }}>
              <Check size={32} color="#10b981" style={{ margin: '0 auto 8px auto' }} />
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>All Clear! No Open Issues</div>
              <p style={{ fontSize: '11px', marginTop: '4px' }}>All reported issues are currently assigned or resolved.</p>
            </div>
          ) : (
            openPoolTickets.map(ticketItem => {
              const ticketNum = ticketItem.ticketNumber || ticketItem.id;
              return (
                <div 
                  key={ticketItem.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid var(--border-light)',
                    borderRadius: '12px',
                    padding: '14px',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--navy-900)' }}>
                          {ticketNum}
                        </span>
                        <span className="status-pill open" style={{ fontSize: '10px' }}>
                          Available to Claim
                        </span>
                        <span style={{
                          fontSize: '9.5px',
                          fontWeight: '700',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: ticketItem.priority === 'Critical' || ticketItem.priority === 'High' ? '#fee2e2' : '#f1f5f9',
                          color: ticketItem.priority === 'Critical' || ticketItem.priority === 'High' ? '#dc2626' : '#475569'
                        }}>
                          {ticketItem.priority || 'High'}
                        </span>
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', marginTop: '4px' }}>
                        {ticketItem.schoolName || 'Client Institution'}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                        {ticketItem.labName || 'Lab'} – System: <strong style={{ color: '#0f172a' }}>{ticketItem.systemName || ticketItem.systemId || 'Equipment'}</strong>
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '12px', color: '#334155', background: '#f8fafc', padding: '8px 10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: '600', color: '#0f172a', marginBottom: '2px' }}>
                      {ticketItem.issue || ticketItem.title || 'Reported Hardware Fault'}
                    </div>
                    {ticketItem.notes || ticketItem.description || 'Diagnosis required on site.'}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
                    <div style={{ fontSize: '10px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={11} /> Reported by: {ticketItem.reportedBy || 'Staff'}
                    </div>

                    <button
                      onClick={() => handleClaim(ticketItem.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: '#059669',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 14px',
                        fontSize: '11px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        boxShadow: '0 2px 4px rgba(5, 150, 105, 0.25)'
                      }}
                    >
                      <Zap size={13} />
                      <span>Accept & Claim Job</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ==================== VIEW 2: MY ACTIVE JOBS ==================== */}
      {topMode === 'my_jobs' && (
        <div style={{ padding: '0 16px 16px 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {myActiveTickets.length === 0 ? (
            <div style={{
              background: '#ffffff',
              border: '1px dashed #cbd5e1',
              borderRadius: '12px',
              padding: '36px 16px',
              textAlign: 'center',
              color: '#64748b',
              marginTop: '12px'
            }}>
              <Inbox size={32} color="#64748b" style={{ margin: '0 auto 8px auto' }} />
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>No Active Assigned Jobs</div>
              <p style={{ fontSize: '11px', marginTop: '4px', marginBottom: '16px' }}>
                You have no jobs currently assigned to you. Check the Open Pool to claim work!
              </p>
              <button
                onClick={() => setTopMode('open_pool')}
                style={{
                  background: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Go to Open Issues Pool ({openPoolTickets.length})
              </button>
            </div>
          ) : (
            <>
              {/* If multiple active tickets, show quick selector tabs */}
              {myActiveTickets.length > 1 && (
                <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', padding: '4px 0' }}>
                  {myActiveTickets.map(tItem => (
                    <button
                      key={tItem.id}
                      onClick={() => setSelectedTicketId(tItem.id)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '700',
                        border: selectedTicketId === tItem.id ? '1px solid #2563eb' : '1px solid #e2e8f0',
                        background: selectedTicketId === tItem.id ? '#eff6ff' : '#ffffff',
                        color: selectedTicketId === tItem.id ? '#1d4ed8' : '#64748b',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {tItem.ticketNumber || tItem.id} • {tItem.systemName || tItem.systemId}
                    </button>
                  ))}
                </div>
              )}

              {activeTicket && (
                <>
                  {/* Job Header Card */}
                  <div style={{ 
                    background: '#ffffff', 
                    border: '1px solid var(--border-light)', 
                    borderRadius: '12px', 
                    padding: '14px',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--navy-900)' }}>
                            {activeTicket.ticketNumber || activeTicket.id}
                          </span>
                          <span className={`status-pill ${activeTicket.status === 'resolved' ? 'working' : 'under_service'}`} style={{ fontSize: '10px' }}>
                            {activeTicket.status === 'resolved' ? 'Resolved' : 'In Progress (Assigned to You)'}
                          </span>
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', marginTop: '4px' }}>
                          {activeTicket.schoolName || 'Client Institution'}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {activeTicket.labName || 'Computer Lab'} – <strong style={{ color: '#0f172a' }}>{activeTicket.systemName || activeTicket.systemId || 'Equipment'}</strong>
                        </div>
                      </div>

                      {/* Reassign / Decline Button */}
                      <button
                        onClick={() => setShowReleaseModal(true)}
                        title="Release job to open pool if unable to complete"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: '#fff1f2',
                          border: '1px solid #fecdd3',
                          borderRadius: '8px',
                          padding: '6px 10px',
                          color: '#e11d48',
                          fontSize: '10px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        <RotateCcw size={12} />
                        <span>Release / Decline</span>
                      </button>
                    </div>

                    {/* Quick Call & Map Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '14px' }}>
                      <button 
                        onClick={handleCall}
                        className="btn-secondary-outline"
                        style={{ padding: '8px 10px', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                      >
                        <Phone size={14} color="var(--navy-800)" />
                        <span>Call Staff</span>
                      </button>

                      <button 
                        onClick={() => onNavigateToMap && onNavigateToMap(activeTicket)}
                        style={{
                          background: 'var(--navy-800)',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '8px 10px',
                          fontSize: '11px',
                          fontWeight: '700',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <Navigation size={14} />
                        <span>View Lab Map</span>
                      </button>
                    </div>
                  </div>

                  {/* Segmented Tabs: Details | Checklist | Parts */}
                  <div className="segmented-tabs" style={{ margin: '0' }}>
                    <button 
                      className={`segmented-tab-btn ${activeTab === 'job' ? 'active' : ''}`}
                      onClick={() => setActiveTab('job')}
                    >
                      Issue & Specs
                    </button>
                    <button 
                      className={`segmented-tab-btn ${activeTab === 'checklist' ? 'active' : ''}`}
                      onClick={() => setActiveTab('checklist')}
                    >
                      Checklist ({(activeTicket.checklist || []).filter(c => c.checked).length}/{(activeTicket.checklist || []).length || 5})
                    </button>
                    <button 
                      className={`segmented-tab-btn ${activeTab === 'parts' ? 'active' : ''}`}
                      onClick={() => setActiveTab('parts')}
                    >
                      Parts & Signoff
                    </button>
                  </div>

                  {/* TAB 1: JOB DETAILS */}
                  {activeTab === 'job' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ 
                        background: '#ffffff', 
                        border: '1px solid var(--border-light)', 
                        borderRadius: '12px', 
                        padding: '14px',
                        boxShadow: 'var(--shadow-sm)'
                      }}>
                        <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--navy-700)', textTransform: 'uppercase', marginBottom: '8px' }}>
                          Reported Incident
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>
                          {activeTicket.issue || activeTicket.title || 'Monitor Display Failure'}
                        </div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-body)', marginTop: '4px', lineHeight: '1.4' }}>
                          {activeTicket.notes || activeTicket.description || 'Display does not power on during morning computer batch.'}
                        </div>
                      </div>

                      {/* Workstation Hardware Info */}
                      <div style={{ 
                        background: '#ffffff', 
                        border: '1px solid var(--border-light)', 
                        borderRadius: '12px', 
                        padding: '14px',
                        boxShadow: 'var(--shadow-sm)'
                      }}>
                        <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--navy-700)', textTransform: 'uppercase', marginBottom: '8px' }}>
                          Target System Specs ({activeTicket.systemName || activeTicket.systemId})
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px' }}>
                          <div><span style={{ color: 'var(--text-muted)' }}>Make/Model:</span> <strong>Dell OptiPlex 3080</strong></div>
                          <div><span style={{ color: 'var(--text-muted)' }}>Processor:</span> <strong>Core i5 10th Gen</strong></div>
                          <div><span style={{ color: 'var(--text-muted)' }}>RAM:</span> <strong>8 GB DDR4</strong></div>
                          <div><span style={{ color: 'var(--text-muted)' }}>Storage:</span> <strong>256 GB NVMe SSD</strong></div>
                          <div><span style={{ color: 'var(--text-muted)' }}>OS:</span> <strong>Windows 11 Pro</strong></div>
                          <div><span style={{ color: 'var(--text-muted)' }}>AMC Status:</span> <strong style={{ color: '#059669' }}>Active Warranty</strong></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: CHECKLIST */}
                  {activeTab === 'checklist' && (
                    <div style={{ 
                      background: '#ffffff', 
                      border: '1px solid var(--border-light)', 
                      borderRadius: '12px', 
                      padding: '14px',
                      boxShadow: 'var(--shadow-sm)'
                    }}>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--navy-900)', marginBottom: '10px' }}>
                        Diagnostic & Repair Checklist
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {[
                          { id: 1, text: 'Check wall power socket and surge protector supply' },
                          { id: 2, text: 'Verify HDMI/VGA cable connection firmly seated' },
                          { id: 3, text: 'Swap with known-good monitor from adjacent bench' },
                          { id: 4, text: 'Inspect motherboard diagnostic beeps & LED indicators' },
                          { id: 5, text: 'Re-seat RAM stick and clear CMOS if required' },
                          { id: 6, text: 'Boot system and verify Windows desktop resolution' }
                        ].map((item, idx) => (
                          <div 
                            key={item.id}
                            onClick={() => onToggleChecklistItem && onToggleChecklistItem(activeTicket.id, item.id)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '8px 10px',
                              borderRadius: '8px',
                              background: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              cursor: 'pointer'
                            }}
                          >
                            <input 
                              type="checkbox" 
                              checked={idx < 2} 
                              readOnly 
                              style={{ width: '16px', height: '16px', accentColor: '#2563eb' }}
                            />
                            <span style={{ fontSize: '12px', color: '#1e293b' }}>
                              {item.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 3: PARTS & SIGNOFF */}
                  {activeTab === 'parts' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ 
                        background: '#ffffff', 
                        border: '1px solid var(--border-light)', 
                        borderRadius: '12px', 
                        padding: '14px',
                        boxShadow: 'var(--shadow-sm)'
                      }}>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--navy-900)', marginBottom: '8px' }}>
                          Parts Replaced / Used
                        </div>
                        <div style={{ padding: '8px 10px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px', color: '#475569' }}>
                          • 1x High-speed HDMI Cable (1.5m, Part #HD-1092)
                        </div>
                      </div>

                      {/* Final Resolution Button */}
                      <button
                        onClick={() => handleMarkResolved(activeTicket.id)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '10px',
                          background: '#059669',
                          color: '#ffffff',
                          border: 'none',
                          fontSize: '13px',
                          fontWeight: '700',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          cursor: 'pointer',
                          boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.3)'
                        }}
                      >
                        <Check size={18} />
                        <span>Sign-Off & Complete Service</span>
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      )}

      {/* Reassign / Release Modal */}
      {showReleaseModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 110,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '380px',
            padding: '20px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e11d48' }}>
              <AlertTriangle size={20} />
              <span style={{ fontSize: '15px', fontWeight: '700' }}>Release Job to Open Pool?</span>
            </div>

            <p style={{ fontSize: '12px', color: '#475569', lineHeight: '1.4' }}>
              If you cannot complete this job (e.g. shift ended, requires special spare parts), you can cancel your assignment. It will immediately become open for all other engineers to accept.
            </p>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#334155', marginBottom: '4px' }}>
                Reason for Release:
              </label>
              <input
                type="text"
                placeholder="e.g., Need senior hardware specialist"
                value={releaseReason}
                onChange={e => setReleaseReason(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '12px'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <button
                onClick={() => setShowReleaseModal(false)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: '#f8fafc',
                  color: '#475569',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmRelease}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#e11d48',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Confirm Release
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
