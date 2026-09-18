import React, { useState } from 'react';
import { ArrowLeft, MoreVertical, Phone, Clock, Paperclip, ChevronRight, X, ZoomIn } from 'lucide-react';

export function CampusCareTicketDetails({ 
  ticket,
  onAssign,
  onUpdateStatus,
  onCloseTicket,
  onOpenTimeline,
  onBack 
}) {
  const [lightboxImage, setLightboxImage] = useState(null);

  const t = ticket || {
    ticketNumber: 'N/A',
    status: 'created',
    createdAt: '',
    labName: '',
    systemName: '',
    problem: '',
    schoolName: '',
    reportedBy: '',
    reporterPhone: '',
    assignedTo: 'Unassigned',
    priority: 'Normal',
    category: 'General',
    description: '',
    attachments: []
  };

  const handleCallReporter = () => {
    if (t.reporterPhone) {
      window.location.href = `tel:${t.reporterPhone}`;
    }
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
            <span className="screen-header-title">
              Ticket Details
            </span>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
              {t.ticketNumber} • {t.schoolName}
            </div>
          </div>
        </div>
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
                color: t.status === 'resolved' ? 'var(--status-working)' : 'var(--status-issue)', 
                background: t.status === 'resolved' ? 'var(--status-working-bg)' : 'var(--status-issue-bg)',
                padding: '2px 8px',
                borderRadius: '10px',
                border: '1px solid rgba(239, 68, 68, 0.2)'
              }}>
                {t.status === 'in_progress' ? 'In Progress' :
                 t.status === 'resolved' ? 'Resolved' :
                 t.status === 'closed' ? 'Closed' : 'Active / Unsolved'}
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
                {t.problem || t.title}
              </div>
            </div>
            <span style={{
              fontSize: '10px',
              fontWeight: '700',
              color: t.priority?.toLowerCase() === 'high' ? 'var(--status-issue)' : 'var(--navy-800)',
              background: t.priority?.toLowerCase() === 'high' ? 'var(--status-issue-bg)' : 'var(--blue-50)',
              padding: '2px 8px',
              borderRadius: '4px'
            }}>
              {(t.priority || 'Medium').toUpperCase()}
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
            { label: 'System', value: t.systemName || t.systemId || 'PC-01' },
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
            { label: 'Assigned To', value: t.assignedTo || t.technician || 'Unassigned' },
            { label: 'Priority', value: (t.priority || 'Medium').toUpperCase() },
            { label: 'Category', value: t.category || 'General' },
            { label: 'Description', value: t.description || 'None' }
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

        {/* REAL ATTACHMENTS & PHOTO GALLERY */}
        <div style={{
          background: '#ffffff',
          borderRadius: '10px',
          border: '1px solid var(--border-light)',
          padding: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)' }}>
              Attached Equipment Photos ({t.attachments?.length || 0})
            </div>
            {t.attachments?.length > 0 && (
              <span style={{ fontSize: '10px', color: 'var(--blue-600)', fontWeight: 600 }}>
                Tap photo to enlarge
              </span>
            )}
          </div>

          {t.attachments && t.attachments.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {t.attachments.map((att, idx) => (
                <div 
                  key={idx}
                  onClick={() => setLightboxImage(att)}
                  style={{
                    position: 'relative',
                    width: '80px',
                    height: '80px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid var(--border-mid)',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <img 
                    src={att.url} 
                    alt={att.name || 'Photo'} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                  >
                    <ZoomIn size={18} color="#ffffff" />
                  </div>
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'rgba(15, 23, 42, 0.75)',
                    color: '#ffffff',
                    fontSize: '8px',
                    padding: '2px 4px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {att.name}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              No photos attached to this ticket.
            </div>
          )}
        </div>

        {/* Action Buttons: [ Assign ] [ Update ] [ Close ] */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
          <button 
            onClick={onAssign}
            className="btn-primary-navy"
            style={{ flex: 1, padding: '10px' }}
          >
            Assign Tech
          </button>
          <button 
            onClick={onUpdateStatus}
            className="btn-primary-navy"
            style={{ flex: 1, padding: '10px' }}
          >
            Work Order
          </button>
          <button 
            onClick={onCloseTicket}
            className="btn-primary-navy"
            style={{ flex: 1, padding: '10px', background: 'var(--navy-900)' }}
          >
            Close Ticket
          </button>
        </div>
      </div>

      {/* Image Lightbox Modal */}
      {lightboxImage && (
        <div 
          onClick={() => setLightboxImage(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 120,
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '90%',
              maxHeight: '80%',
              background: '#ffffff',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderBottom: '1px solid #e2e8f0',
              background: '#f8fafc'
            }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--navy-900)' }}>
                {lightboxImage.name}
              </span>
              <button 
                onClick={() => setLightboxImage(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-main)',
                  padding: '2px'
                }}
              >
                <X size={18} />
              </button>
            </div>
            <img 
              src={lightboxImage.url} 
              alt={lightboxImage.name} 
              style={{
                maxWidth: '100%',
                maxHeight: '65vh',
                objectFit: 'contain'
              }} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
