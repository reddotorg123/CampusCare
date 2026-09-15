import React, { useState } from 'react';
import { ArrowLeft, MoreVertical, Navigation, Phone, Calendar, CheckSquare, Square, ChevronDown, Check } from 'lucide-react';

export function CampusCareTechnicianJob({ 
  ticket,
  onToggleChecklistItem,
  onUpdateStatus,
  onNavigateToMap,
  onBack 
}) {
  const [activeTab, setActiveTab] = useState('job'); // 'job' | 'checklist' | 'parts'
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const t = ticket || {
    ticketNumber: '#TKT-1024',
    status: 'in_progress',
    schoolName: 'Velammal Matric Hr Sec School',
    labName: 'Main Lab',
    systemName: 'PC-07',
    createdAt: '15 Sep 2025, 10:24 AM',
    reportedBy: 'Mr. Arun (Lab Staff)',
    reporterPhone: '+91 94440 12345',
    priority: 'High',
    checklist: [
      { id: 1, text: 'Check power supply', checked: true },
      { id: 2, text: 'Check monitor and cable', checked: true },
      { id: 3, text: 'Test with another monitor', checked: false },
      { id: 4, text: 'Check GPU / onboard display', checked: false },
      { id: 5, text: 'Replace cable if required', checked: false }
    ]
  };

  const handleCall = () => {
    window.location.href = `tel:${t.reporterPhone || '+919444012345'}`;
  };

  return (
    <div className="screen-scroll-container no-bottom-nav">
      {/* Header */}
      <div className="screen-header-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className="icon-button" onClick={onBack} title="Back">
            <ArrowLeft size={20} />
          </button>
          <span className="screen-header-title">
            Technician Job
          </span>
        </div>
        <button className="icon-button" title="Menu">
          <MoreVertical size={18} />
        </button>
      </div>

      {/* Tabs */}
      <div className="segmented-tabs">
        <button 
          className={`segmented-tab-btn ${activeTab === 'job' ? 'active' : ''}`}
          onClick={() => setActiveTab('job')}
        >
          Job Details
        </button>
        <button 
          className={`segmented-tab-btn ${activeTab === 'checklist' ? 'active' : ''}`}
          onClick={() => setActiveTab('checklist')}
        >
          Checklist
        </button>
        <button 
          className={`segmented-tab-btn ${activeTab === 'parts' ? 'active' : ''}`}
          onClick={() => setActiveTab('parts')}
        >
          Parts & Notes
        </button>
      </div>

      <div style={{ padding: '0 16px 16px 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
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
                  {t.ticketNumber}
                </span>
                <span className="status-pill under_service" style={{ fontSize: '10px' }}>
                  In Progress
                </span>
              </div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', marginTop: '4px' }}>
                {t.schoolName}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {t.labName} – {t.systemName}
              </div>
            </div>

            {/* Navigate Button */}
            <button
              onClick={onNavigateToMap}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'var(--blue-600)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 10px',
                fontSize: '11px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <Navigation size={12} />
              Navigate
            </button>
          </div>

          {/* Meta Info Grid */}
          <div style={{ 
            marginTop: '12px', 
            paddingTop: '10px', 
            borderTop: '1px solid var(--border-light)',
            display: 'flex', 
            flexDirection: 'column', 
            gap: '6px',
            fontSize: '11px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
              <Calendar size={13} />
              <span>{t.createdAt}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-body)', fontWeight: '600' }}>
                <span>👤</span>
                <span>{t.reportedBy}</span>
              </div>
              <button 
                onClick={handleCall}
                style={{ background: 'none', border: 'none', color: 'var(--blue-600)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                title="Call Reporter"
              >
                <Phone size={15} />
              </button>
            </div>

            <div style={{ marginTop: '2px' }}>
              <span style={{ 
                fontSize: '10px', 
                fontWeight: '700', 
                color: 'var(--status-issue)', 
                background: 'var(--status-issue-bg)',
                padding: '2px 8px',
                borderRadius: '4px'
              }}>
                High Priority
              </span>
            </div>
          </div>
        </div>

        {/* Diagnosis Checklist Section */}
        <div style={{ 
          background: '#ffffff', 
          border: '1px solid var(--border-light)', 
          borderRadius: '12px', 
          padding: '14px' 
        }}>
          <h3 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '12px' }}>
            Diagnosis Checklist
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {t.checklist?.map((item) => (
              <div 
                key={item.id}
                onClick={() => onToggleChecklistItem(t.id, item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  padding: '4px 0'
                }}
              >
                <div style={{ color: item.checked ? 'var(--blue-600)' : 'var(--border-mid)' }}>
                  {item.checked ? <CheckSquare size={18} /> : <Square size={18} />}
                </div>
                <span style={{ 
                  fontSize: '12px', 
                  color: item.checked ? 'var(--text-main)' : 'var(--text-body)',
                  fontWeight: item.checked ? '600' : '400',
                  textDecoration: item.checked ? 'none' : 'none'
                }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Update Status Dropdown / Action */}
        <div style={{ position: 'relative', marginTop: '10px' }}>
          <button 
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            className="btn-primary-navy"
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
          >
            <span>Update Status</span>
            <ChevronDown size={16} />
          </button>

          {showStatusMenu && (
            <div style={{
              position: 'absolute',
              bottom: '50px',
              left: 0,
              right: 0,
              background: '#ffffff',
              border: '1px solid var(--border-mid)',
              borderRadius: '10px',
              boxShadow: 'var(--shadow-md)',
              overflow: 'hidden',
              zIndex: 30
            }}>
              {[
                { label: 'Mark as In Progress', status: 'in_progress', color: 'var(--status-service)' },
                { label: 'Mark as Resolved', status: 'resolved', color: 'var(--status-working)' },
                { label: 'Parts Required / Hold', status: 'warning', color: 'var(--status-warning)' },
                { label: 'Close Ticket', status: 'closed', color: 'var(--navy-900)' }
              ].map(opt => (
                <div 
                  key={opt.status}
                  onClick={() => {
                    onUpdateStatus(t.id, opt.status);
                    setShowStatusMenu(false);
                  }}
                  style={{
                    padding: '12px 16px',
                    fontSize: '12.5px',
                    fontWeight: '600',
                    color: opt.color,
                    borderBottom: '1px solid var(--border-light)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>{opt.label}</span>
                  <Check size={14} style={{ opacity: t.status === opt.status ? 1 : 0 }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
