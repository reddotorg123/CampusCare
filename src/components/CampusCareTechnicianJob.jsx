import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Navigation, 
  Phone, 
  Check, 
  AlertTriangle, 
  Zap, 
  Inbox, 
  Clock, 
  RotateCcw,
  Plus,
  Trash2,
  Image as ImageIcon,
  ZoomIn,
  X,
  Package,
  Hourglass,
  CheckSquare,
  Square
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

  // Active Assigned Tickets: Assigned to this technician and not resolved/closed
  const myActiveTickets = tickets.filter(t => 
    (t.technician === currentTechName || t.status === 'in_progress' || t.status === 'pending') && 
    t.status !== 'resolved' && 
    t.status !== 'closed'
  );

  const [topMode, setTopMode] = useState(() => myActiveTickets.length > 0 ? 'my_jobs' : 'open_pool');
  const [selectedTicketId, setSelectedTicketId] = useState(() => {
    return (ticket?.id) || (myActiveTickets[0]?.id) || (tickets[0]?.id) || null;
  });
  const [activeTab, setActiveTab] = useState('job'); // 'job' | 'checklist' | 'parts'
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [releaseReason, setReleaseReason] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Lightbox for attached equipment photos
  const [lightboxPhoto, setLightboxPhoto] = useState(null);

  // Custom Parts Management
  const [customParts, setCustomParts] = useState([
    { id: 1, name: 'High-speed HDMI Cable (1.5m)', qty: 1, partNo: 'HD-1092' }
  ]);
  const [newPartName, setNewPartName] = useState('');
  const [newPartQty, setNewPartQty] = useState('1');
  const [newPartNo, setNewPartNo] = useState('');

  // Local checklist state fallback to ensure immediate UI feedback
  const [localChecklistMap, setLocalChecklistMap] = useState({});

  const activeTicket = tickets.find(t => t.id === selectedTicketId) || myActiveTickets[0] || openPoolTickets[0] || null;

  const defaultChecklist = [
    { id: 1, text: 'Check wall power socket and surge protector supply', checked: false },
    { id: 2, text: 'Verify HDMI/VGA cable connection firmly seated', checked: false },
    { id: 3, text: 'Swap with known-good monitor from adjacent bench', checked: false },
    { id: 4, text: 'Inspect motherboard diagnostic beeps & LED indicators', checked: false },
    { id: 5, text: 'Re-seat RAM stick and clear CMOS if required', checked: false },
    { id: 6, text: 'Boot system and verify Windows desktop resolution', checked: false }
  ];

  const getTicketChecklist = () => {
    if (!activeTicket) return defaultChecklist;
    if (localChecklistMap[activeTicket.id]) {
      return localChecklistMap[activeTicket.id];
    }
    if (activeTicket.checklist && activeTicket.checklist.length > 0) {
      return activeTicket.checklist;
    }
    return defaultChecklist;
  };

  const currentChecklist = getTicketChecklist();
  const completedChecklistCount = currentChecklist.filter(c => c.checked).length;

  const handleToggleCheck = (itemId) => {
    if (!activeTicket) return;
    const updated = currentChecklist.map(item => {
      if (item.id === itemId) return { ...item, checked: !item.checked };
      return item;
    });
    setLocalChecklistMap(prev => ({ ...prev, [activeTicket.id]: updated }));

    if (onToggleChecklistItem) {
      onToggleChecklistItem(activeTicket.id, itemId);
    }
  };

  const handleAddPart = (e) => {
    e?.preventDefault();
    if (!newPartName.trim()) return;
    const item = {
      id: Date.now(),
      name: newPartName.trim(),
      qty: parseInt(newPartQty, 10) || 1,
      partNo: newPartNo.trim() || 'N/A'
    };
    setCustomParts(prev => [...prev, item]);
    setNewPartName('');
    setNewPartQty('1');
    setNewPartNo('');
  };

  const handleRemovePart = (id) => {
    setCustomParts(prev => prev.filter(p => p.id !== id));
  };

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
      onUpdateStatus(ticketId, 'resolved', 'Signed off with parts & diagnostic checklist complete', { parts: customParts });
    }
    setActionSuccess('✓ Ticket marked as Resolved & Signed Off!');
    setTimeout(() => setActionSuccess(''), 3000);
  };

  const handleMarkPending = (ticketId) => {
    if (onUpdateStatus) {
      onUpdateStatus(ticketId, 'pending', 'Marked as Pending: Waiting for spares/replacement parts', { 
        parts: customParts,
        pendingReason: 'Awaiting replacement parts & spares delivery'
      });
    }
    setActionSuccess('⏳ Ticket marked as Pending (Awaiting Spares/Parts)!');
    setTimeout(() => setActionSuccess(''), 3500);
  };

  // Extract photos/attachments from active ticket
  const ticketAttachments = activeTicket?.attachments || (activeTicket?.photos ? activeTicket.photos.map((p, i) => ({ name: `Photo ${i + 1}`, url: p })) : []);

  return (
    <div 
      className="screen-scroll-container no-bottom-nav"
      style={{
        WebkitOverflowScrolling: 'touch',
        overscrollBehaviorY: 'contain',
        touchAction: 'pan-y'
      }}
    >
      {/* Header: Clean, professional, On Duty badge removed */}
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
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              background: topMode === 'my_jobs' ? '#ffffff' : 'transparent',
              color: topMode === 'my_jobs' ? '#1e293b' : '#64748b',
              boxShadow: topMode === 'my_jobs' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <span>My Assigned ({myActiveTickets.length})</span>
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
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              background: topMode === 'open_pool' ? '#ffffff' : 'transparent',
              color: topMode === 'open_pool' ? '#1e293b' : '#64748b',
              boxShadow: topMode === 'open_pool' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Zap size={14} color={topMode === 'open_pool' ? '#059669' : '#64748b'} />
            <span>Open Pool ({openPoolTickets.length})</span>
          </button>
        </div>
      </div>

      {/* ==================== VIEW 1: OPEN ISSUES POOL ==================== */}
      {topMode === 'open_pool' && (
        <div style={{ padding: '8px 16px 16px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', padding: '0 2px' }}>
            Unassigned school tickets awaiting an engineer to claim:
          </div>

          {openPoolTickets.length === 0 ? (
            <div style={{
              background: '#ffffff',
              border: '1px dashed #cbd5e1',
              borderRadius: '12px',
              padding: '32px 16px',
              textAlign: 'center',
              color: '#64748b',
              marginTop: '12px'
            }}>
              <Inbox size={32} color="#64748b" style={{ margin: '0 auto 8px auto' }} />
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>No Open Tickets</div>
              <p style={{ fontSize: '11px', marginTop: '4px' }}>
                All campus issues are currently assigned to engineers or resolved.
              </p>
            </div>
          ) : (
            openPoolTickets.map(ticketItem => {
              const ticketNum = ticketItem.ticketNumber || ticketItem.id;
              return (
                <div
                  key={ticketItem.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--navy-900)' }}>
                            {activeTicket.ticketNumber || activeTicket.id}
                          </span>
                          <span className={`status-pill ${activeTicket.status === 'resolved' ? 'working' : activeTicket.status === 'pending' ? 'under_service' : 'under_service'}`} style={{ fontSize: '10px' }}>
                            {activeTicket.status === 'resolved' ? 'Resolved' : activeTicket.status === 'pending' ? 'Pending (Awaiting Parts)' : 'In Progress (Assigned)'}
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
                      Checklist ({completedChecklistCount}/{currentChecklist.length})
                    </button>
                    <button 
                      className={`segmented-tab-btn ${activeTab === 'parts' ? 'active' : ''}`}
                      onClick={() => setActiveTab('parts')}
                    >
                      Parts & Signoff
                    </button>
                  </div>

                  {/* TAB 1: JOB DETAILS & ATTACHED PHOTOS */}
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
                          {activeTicket.issue || activeTicket.title || 'Reported Hardware Fault'}
                        </div>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-body)', marginTop: '4px', lineHeight: '1.4' }}>
                          {activeTicket.notes || activeTicket.description || 'Diagnosis required on site.'}
                        </div>
                      </div>

                      {/* Attached Equipment Photos (Uploaded by School Staff) */}
                      <div style={{ 
                        background: '#ffffff', 
                        border: '1px solid var(--border-light)', 
                        borderRadius: '12px', 
                        padding: '14px',
                        boxShadow: 'var(--shadow-sm)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--navy-700)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <ImageIcon size={14} color="var(--blue-600)" />
                            <span>Staff Uploaded Photos ({ticketAttachments.length})</span>
                          </div>
                          {ticketAttachments.length > 0 && (
                            <span style={{ fontSize: '10px', color: 'var(--blue-600)', fontWeight: 600 }}>
                              Tap to enlarge
                            </span>
                          )}
                        </div>

                        {ticketAttachments.length > 0 ? (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {ticketAttachments.map((att, idx) => (
                              <div 
                                key={idx}
                                onClick={() => setLightboxPhoto(att)}
                                style={{
                                  position: 'relative',
                                  width: '84px',
                                  height: '84px',
                                  borderRadius: '8px',
                                  overflow: 'hidden',
                                  border: '1px solid var(--border-mid)',
                                  cursor: 'pointer',
                                  boxShadow: 'var(--shadow-sm)'
                                }}
                              >
                                <img 
                                  src={att.url} 
                                  alt={att.name || `Photo ${idx + 1}`} 
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                />
                                <div style={{
                                  position: 'absolute',
                                  inset: 0,
                                  background: 'rgba(0,0,0,0.25)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  opacity: 0,
                                  transition: 'opacity 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                                >
                                  <ZoomIn size={20} color="#ffffff" />
                                </div>
                                <div style={{
                                  position: 'absolute',
                                  bottom: 0,
                                  left: 0,
                                  right: 0,
                                  background: 'rgba(15, 23, 42, 0.8)',
                                  color: '#ffffff',
                                  fontSize: '8.5px',
                                  padding: '2px 4px',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}>
                                  {att.name || `Photo ${idx + 1}`}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic', padding: '6px 0' }}>
                            No equipment photos were attached by the reporting staff.
                          </div>
                        )}
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

                  {/* TAB 2: INTERACTIVE CHECKLIST */}
                  {activeTab === 'checklist' && (
                    <div style={{ 
                      background: '#ffffff', 
                      border: '1px solid var(--border-light)', 
                      borderRadius: '12px', 
                      padding: '14px',
                      boxShadow: 'var(--shadow-sm)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--navy-900)' }}>
                          Diagnostic & Repair Checklist
                        </div>
                        <span style={{ fontSize: '10px', color: '#2563eb', fontWeight: '700' }}>
                          {completedChecklistCount} of {currentChecklist.length} Complete
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {currentChecklist.map((item) => (
                          <div 
                            key={item.id}
                            onClick={() => handleToggleCheck(item.id)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '10px 12px',
                              borderRadius: '8px',
                              background: item.checked ? '#f0fdf4' : '#f8fafc',
                              border: item.checked ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {item.checked ? (
                                <CheckSquare size={18} color="#16a34a" />
                              ) : (
                                <Square size={18} color="#94a3b8" />
                              )}
                            </div>
                            <span style={{ 
                              fontSize: '12px', 
                              color: item.checked ? '#15803d' : '#1e293b',
                              textDecoration: item.checked ? 'line-through' : 'none',
                              fontWeight: item.checked ? '600' : '400'
                            }}>
                              {item.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 3: CUSTOM PARTS & SIGNOFF / PENDING ACTIONS */}
                  {activeTab === 'parts' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {/* Parts Required / Used Form & List */}
                      <div style={{ 
                        background: '#ffffff', 
                        border: '1px solid var(--border-light)', 
                        borderRadius: '12px', 
                        padding: '14px',
                        boxShadow: 'var(--shadow-sm)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                          <Package size={15} color="var(--navy-800)" />
                          <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--navy-900)' }}>
                            Custom Required Parts & Spares
                          </div>
                        </div>

                        {/* List of Custom Parts */}
                        {customParts.length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
                            {customParts.map(part => (
                              <div 
                                key={part.id}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  padding: '8px 10px',
                                  background: '#f8fafc',
                                  borderRadius: '8px',
                                  border: '1px solid #e2e8f0',
                                  fontSize: '11px'
                                }}
                              >
                                <div>
                                  <strong style={{ color: '#0f172a' }}>{part.qty}x {part.name}</strong>
                                  {part.partNo && part.partNo !== 'N/A' && (
                                    <span style={{ color: '#64748b', marginLeft: '6px' }}>(Part #: {part.partNo})</span>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemovePart(part.id)}
                                  title="Remove part"
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#ef4444',
                                    cursor: 'pointer',
                                    padding: '4px'
                                  }}
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic', marginBottom: '12px' }}>
                            No spare parts added yet. Add custom parts below if required.
                          </div>
                        )}

                        {/* Add Custom Part Inputs */}
                        <div style={{
                          background: '#f1f5f9',
                          padding: '10px',
                          borderRadius: '8px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px'
                        }}>
                          <div style={{ fontSize: '11px', fontWeight: '700', color: '#334155' }}>
                            Add Custom Spare Part
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '8px' }}>
                            <input 
                              type="text"
                              placeholder="Part description (e.g. DDR4 8GB RAM)"
                              value={newPartName}
                              onChange={e => setNewPartName(e.target.value)}
                              style={{
                                padding: '7px 9px',
                                borderRadius: '6px',
                                border: '1px solid #cbd5e1',
                                fontSize: '11px',
                                background: '#ffffff'
                              }}
                            />
                            <input 
                              type="number"
                              min="1"
                              placeholder="Qty"
                              value={newPartQty}
                              onChange={e => setNewPartQty(e.target.value)}
                              style={{
                                padding: '7px 9px',
                                borderRadius: '6px',
                                border: '1px solid #cbd5e1',
                                fontSize: '11px',
                                background: '#ffffff'
                              }}
                            />
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '8px' }}>
                            <input 
                              type="text"
                              placeholder="Part/Model # (optional)"
                              value={newPartNo}
                              onChange={e => setNewPartNo(e.target.value)}
                              style={{
                                padding: '7px 9px',
                                borderRadius: '6px',
                                border: '1px solid #cbd5e1',
                                fontSize: '11px',
                                background: '#ffffff'
                              }}
                            />
                            <button
                              type="button"
                              onClick={handleAddPart}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '4px',
                                background: 'var(--navy-800)',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '7px 10px',
                                fontSize: '11px',
                                fontWeight: '700',
                                cursor: 'pointer'
                              }}
                            >
                              <Plus size={13} />
                              <span>Add</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Action 1: Pending Option (Waiting for Parts/Spares) */}
                      <button
                        onClick={() => handleMarkPending(activeTicket.id)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '10px',
                          background: '#fffbeb',
                          border: '1px solid #f59e0b',
                          color: '#b45309',
                          fontSize: '13px',
                          fontWeight: '700',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          cursor: 'pointer',
                          boxShadow: '0 1px 3px rgba(245, 158, 11, 0.15)'
                        }}
                      >
                        <Hourglass size={16} color="#d97706" />
                        <span>Mark as Pending (Spares Required)</span>
                      </button>

                      {/* Action 2: Sign-Off & Complete Service */}
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

      {/* Lightbox Modal for Photo Full View */}
      {lightboxPhoto && (
        <div 
          onClick={() => setLightboxPhoto(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 120,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '92%',
              maxHeight: '80%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <button
              onClick={() => setLightboxPhoto(null)}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: '#ffffff',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} color="#0f172a" />
            </button>
            <img 
              src={lightboxPhoto.url} 
              alt={lightboxPhoto.name}
              style={{
                maxWidth: '100%',
                maxHeight: '75vh',
                borderRadius: '12px',
                objectFit: 'contain',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
              }}
            />
            <div style={{ color: '#ffffff', fontSize: '12px', fontWeight: '600', marginTop: '10px' }}>
              {lightboxPhoto.name}
            </div>
          </div>
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
