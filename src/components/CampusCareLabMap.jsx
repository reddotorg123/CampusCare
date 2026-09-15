import React, { useState } from 'react';
import { ArrowLeft, Search, Edit3, Plus, Minus, Crosshair, Monitor } from 'lucide-react';

export function CampusCareLabMap({ 
  school,
  lab,
  devices = [],
  onSelectDevice,
  onOpenEditor,
  onBack
}) {
  const [activeTab, setActiveTab] = useState('map'); // 'map' | 'systems' | 'details'
  const [zoomLevel, setZoomLevel] = useState(1);

  const schoolName = school?.name || 'Velammal Matric Hr Sec School';
  const labName = lab?.name || 'Computer Lab - Main Lab';

  const handleZoom = (delta) => {
    setZoomLevel(prev => Math.min(1.4, Math.max(0.7, prev + delta)));
  };

  const handleResetZoom = () => setZoomLevel(1);

  // Status color mapper
  const getDeviceColor = (status) => {
    switch (status) {
      case 'working': return { bg: '#22c55e', border: '#16a34a', text: '#ffffff' };
      case 'warning': return { bg: '#f59e0b', border: '#d97706', text: '#ffffff' };
      case 'issue_reported': return { bg: '#ef4444', border: '#dc2626', text: '#ffffff' };
      case 'under_service': return { bg: '#3b82f6', border: '#2563eb', text: '#ffffff' };
      case 'offline': return { bg: '#64748b', border: '#475569', text: '#ffffff' };
      default: return { bg: '#22c55e', border: '#16a34a', text: '#ffffff' };
    }
  };

  return (
    <div className="screen-scroll-container">
      {/* Header */}
      <div className="screen-header-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className="icon-button" onClick={onBack} title="Back">
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="screen-header-title" style={{ fontSize: '14px' }}>
              {labName}
            </div>
            <div className="screen-header-subtitle">
              {schoolName}
            </div>
          </div>
        </div>

        <button className="icon-button" title="Search">
          <Search size={18} />
        </button>
      </div>

      {/* Tabs: Lab Map | Systems | Details */}
      <div className="segmented-tabs">
        <button 
          className={`segmented-tab-btn ${activeTab === 'map' ? 'active' : ''}`}
          onClick={() => setActiveTab('map')}
        >
          Lab Map
        </button>
        <button 
          className={`segmented-tab-btn ${activeTab === 'systems' ? 'active' : ''}`}
          onClick={() => setActiveTab('systems')}
        >
          Systems
        </button>
        <button 
          className={`segmented-tab-btn ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          Details
        </button>
      </div>

      {activeTab === 'map' && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '0 16px 16px 16px' }}>
          {/* Action Row: Edit Map */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
            <button 
              onClick={onOpenEditor}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: '#ffffff',
                border: '1px solid var(--border-mid)',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: '600',
                color: 'var(--navy-800)',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <Edit3 size={12} />
              Edit Map
            </button>
          </div>

          {/* 2D Canvas Room Box */}
          <div style={{
            position: 'relative',
            background: '#ffffff',
            border: '2px solid #334155',
            borderRadius: '8px',
            minHeight: '440px',
            overflow: 'hidden',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.03)'
          }}>
            {/* Architectural Grid & Room Boundary */}
            <div 
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top left',
                transition: 'transform 0.15s ease-out',
                position: 'relative',
                width: '390px',
                height: '440px',
                padding: '10px'
              }}
            >
              {/* Desks Grid (20 Workstations) */}
              {devices.map(device => {
                const color = getDeviceColor(device.status);
                return (
                  <div
                    key={device.id}
                    onClick={() => onSelectDevice(device)}
                    title={`${device.code} - ${device.status}`}
                    style={{
                      position: 'absolute',
                      left: `${device.coords?.x || 40}px`,
                      top: `${device.coords?.y || 60}px`,
                      width: '54px',
                      height: '46px',
                      background: color.bg,
                      border: `1.5px solid ${color.border}`,
                      borderRadius: '4px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.12)',
                      transition: 'transform 0.1s',
                      userSelect: 'none'
                    }}
                  >
                    <Monitor size={14} color={color.text} />
                    <span style={{ 
                      fontSize: '9px', 
                      fontWeight: '800', 
                      color: color.text, 
                      marginTop: '2px',
                      letterSpacing: '-0.3px'
                    }}>
                      {device.code}
                    </span>
                  </div>
                );
              })}

              {/* Teacher Desk at Bottom Right */}
              <div style={{
                position: 'absolute',
                right: '24px',
                bottom: '24px',
                width: '90px',
                height: '44px',
                background: '#f1f5f9',
                border: '1.5px dashed #64748b',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: '700',
                color: '#475569',
                textAlign: 'center'
              }}>
                Teacher's<br/>Desk
              </div>

              {/* Entrance Cutout at Bottom Left */}
              <div style={{
                position: 'absolute',
                left: '0px',
                bottom: '18px',
                width: '60px',
                height: '24px',
                background: '#ffffff',
                borderTop: '2px solid #334155',
                borderRight: '2px solid #334155',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '9px',
                fontWeight: '700',
                color: '#64748b'
              }}>
                Entrance
              </div>
            </div>

            {/* Floating Zoom Controls (+ / - / Reticle) */}
            <div style={{
              position: 'absolute',
              right: '12px',
              bottom: '90px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              background: '#ffffff',
              border: '1px solid var(--border-mid)',
              borderRadius: '6px',
              padding: '2px',
              boxShadow: 'var(--shadow-md)',
              zIndex: 10
            }}>
              <button 
                onClick={() => handleZoom(0.1)} 
                className="icon-button" 
                style={{ padding: '4px' }}
                title="Zoom In"
              >
                <Plus size={14} />
              </button>
              <div style={{ height: '1px', background: 'var(--border-light)' }}></div>
              <button 
                onClick={() => handleZoom(-0.1)} 
                className="icon-button" 
                style={{ padding: '4px' }}
                title="Zoom Out"
              >
                <Minus size={14} />
              </button>
              <div style={{ height: '1px', background: 'var(--border-light)' }}></div>
              <button 
                onClick={handleResetZoom} 
                className="icon-button" 
                style={{ padding: '4px' }}
                title="Center / Reset"
              >
                <Crosshair size={14} />
              </button>
            </div>
          </div>

          {/* Bottom Color Status Legend */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '12px',
            padding: '8px 6px',
            background: '#ffffff',
            borderRadius: '8px',
            border: '1px solid var(--border-light)',
            fontSize: '10px',
            fontWeight: '600'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--status-working)' }}></span>
              Working
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--status-warning)' }}></span>
              Issue Reported
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--status-service)' }}></span>
              Under Service
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--status-offline)' }}></span>
              Offline
            </div>
          </div>
        </div>
      )}

      {activeTab === 'systems' && (
        <div style={{ padding: '0 16px 16px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {devices.map(device => (
            <div 
              key={device.id}
              onClick={() => onSelectDevice(device)}
              className="card-item clickable"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', marginBottom: 0 }}
            >
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--navy-900)' }}>
                  {device.code} &nbsp;<span style={{ fontSize: '11px', fontWeight: '500', color: 'var(--text-muted)' }}>({device.assetCode})</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {device.makeModel} &nbsp;•&nbsp; {device.processor}
                </div>
              </div>
              <span className={`status-pill ${device.status}`}>
                {device.status.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'details' && (
        <div style={{ padding: '0 16px 16px 16px' }}>
          <div className="card-item">
            <h3 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '8px' }}>Lab Details</h3>
            <div style={{ fontSize: '12px', color: 'var(--text-body)', lineHeight: '1.6' }}>
              <div><strong>Room:</strong> {lab?.room || 'Room 101'}</div>
              <div><strong>Capacity:</strong> {devices.length} Workstations</div>
              <div><strong>In-Charge:</strong> Mr. Arun Kumar (+91 94440 12345)</div>
              <div><strong>Network:</strong> Gigabit Ethernet Cat6 with Managed Switch SW-01</div>
              <div><strong>UPS Backup:</strong> 10kVA Online Central UPS (30 min backup)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
