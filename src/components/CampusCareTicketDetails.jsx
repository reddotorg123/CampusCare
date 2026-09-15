import React from 'react';
import { ArrowLeft, MoreVertical, Phone, Clock, Paperclip, ChevronRight } from 'lucide-react';

export function CampusCareTicketDetails({ 
  ticket,
  onAssign,
  onUpdateStatus,
  onCloseTicket,
  onOpenTimeline,
  onBack 
}) {
  const t = ticket || {
    ticketNumber: '#TKT-1024',
    status: 'open',
    createdAt: 'Mon, 15 Sep 2025  10:24 AM',
    labName: 'Lab 1',
    systemName: 'PC-07',
    problem: 'Monitor not working',
    schoolName: 'Velammal Matric Hr Sec School',
    reportedBy: 'Mr. Arun (Lab Staff)',
    reporterPhone: '+91 94440 12345',
    assignedTo: 'Karthik V.',
    priority: 'High',
    category: 'Hardware Issue',
    description: 'Monitor shows no display. Power light is on.',
    attachments: [
      { name: 'image1.jpg', url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&auto=format&fit=crop&q=80' }
    ]
  };

  const handleCallReporter = () => {
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
            Ticket Details
          </span>
        </div>
        <button className="icon-button" title="Menu">
          <MoreVertical size={18} />
        </button>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Hero Ticket Header Card */}
        <div style={{ 
          background: '#ffffff', 
          border: '1px solid var(--border-light)', 
          borderRadius: '12px', 
          padding: '14px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--navy-900)' }}>
                {t.ticketNumber}
              </span>
              <span style={{ 
                fontSize: '11px', 
                fontWeight: '700', 
                color: 'var(--status-issue)', 
                background: 'var(--status-issue-bg)',
                padding: '2px 8px',
                borderRadius: '10px',
                border: '1px solid rgba(239, 68, 68, 0.2)'
              }}>
                {t.status === 'in_progress' ? 'In Progress' : 'Open'}
              </span>
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-light)', fontWeight: '600' }}>
              {t.createdAt}
            </span>
          </div>

          <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>
                {t.labName} – {t.systemName}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {t.problem}
              </div>
            </div>
            <span style={{
              fontSize: '10px',
              fontWeight: '700',
              color: 'var(--status-issue)',
              background: 'var(--status-issue-bg)',
              padding: '2px 8px',
              borderRadius: '4px'
            }}>
              High
            </span>
          </div>
        </div>

        {/* View Timeline Banner */}
        <div 
          onClick={onOpenTimeline}
          style={{
            background: 'var(--blue-50)',
            border: '1px solid rgba(37, 99, 235, 0.15)',
            borderRadius: '8px',
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={16} color="var(--blue-600)" />
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--navy-800)' }}>
              View Ticket Timeline & Chat
            </span>
          </div>
          <ChevronRight size={16} color="var(--navy-800)" />
        </div>

        {/* Detail Field Rows */}
        <div style={{ 
          background: '#ffffff', 
          border: '1px solid var(--border-light)', 
          borderRadius: '10px',
          overflow: 'hidden'
        }}>
          {[
            { label: 'School', value: t.schoolName },
            { label: 'Lab', value: t.labName },
            { label: 'System', value: t.systemName || 'PC-07' },
            { 
              label: 'Reported By', 
              value: t.reportedBy,
              action: (
                <button 
                  onClick={handleCallReporter}
                  style={{ background: 'none', border: 'none', color: 'var(--blue-600)', cursor: 'pointer', padding: '2px 4px' }}
                  title="Call Reporter"
                >
                  <Phone size={14} />
                </button>
              )
            },
            { label: 'Assigned To', value: t.assignedTo || 'Karthik V.' },
            { label: 'Priority', value: t.priority ? (t.priority.charAt(0).toUpperCase() + t.priority.slice(1)) : 'High' },
            { label: 'Category', value: t.category },
            { label: 'Description', value: t.description }
          ].map((row, idx, arr) => (
            <div 
              key={row.label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '9px 12px',
                fontSize: '11.5px',
                borderBottom: idx < arr.length - 1 ? '1px solid var(--border-light)' : 'none',
                background: idx % 2 === 0 ? '#ffffff' : '#fafafa'
              }}
            >
              <span style={{ color: 'var(--text-muted)', fontWeight: '500' }}>{row.label}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: 'var(--text-main)', fontWeight: '600', textAlign: 'right' }}>
                  {row.value}
                </span>
                {row.action}
              </div>
            </div>
          ))}
        </div>

        {/* Attachments Section */}
        <div>
          <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>
            Attachments
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {t.attachments?.map((att, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
                  <img src={att.url} alt="Attachment" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ 
                  background: '#ffffff', 
                  border: '1px solid var(--border-mid)', 
                  borderRadius: '6px', 
                  padding: '4px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '10.5px',
                  fontWeight: '600',
                  color: 'var(--text-body)'
                }}>
                  <Paperclip size={12} />
                  {att.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons: [ Assign ] [ Update ] [ Close ] */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
          <button 
            onClick={onAssign}
            className="btn-primary-navy"
            style={{ flex: 1, padding: '10px' }}
          >
            Assign
          </button>
          <button 
            onClick={onUpdateStatus}
            className="btn-primary-navy"
            style={{ flex: 1, padding: '10px' }}
          >
            Update
          </button>
          <button 
            onClick={onCloseTicket}
            className="btn-primary-navy"
            style={{ flex: 1, padding: '10px', background: 'var(--navy-900)' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
