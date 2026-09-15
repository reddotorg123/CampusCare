import React, { useState } from 'react';
import { ArrowLeft, MoreVertical, Plus, Monitor, HardDrive, Cpu, Wifi, Wrench } from 'lucide-react';

export function CampusCareSystemDetails({ 
  device,
  school,
  lab,
  onRaiseTicket,
  onBack 
}) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'specs' | 'history'

  const d = device || {
    name: 'PC-07',
    code: 'PC-07',
    assetCode: 'VMHS-PC-007',
    status: 'issue_reported',
    makeModel: 'Dell OptiPlex 3080',
    processor: 'Intel Core i5 (10th Gen)',
    ram: '8 GB',
    storage: '256 GB SSD',
    os: 'Windows 11 Pro',
    ip: '192.168.1.107',
    mac: '3C:52:82:1A:9F:3D',
    monitor: 'Dell 21.5"',
    peripherals: 'Keyboard, Mouse',
    location: 'Main Lab - Row 2',
    photos: [
      'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&auto=format&fit=crop&q=80'
    ],
    serviceHistory: [
      { date: '12 Aug 2026', action: 'Monitor replaced', technician: 'Karthik V.' },
      { date: '03 Jun 2026', action: 'OS reinstalled', technician: 'Karthik V.' },
      { date: '12 Jan 2026', action: 'Preventive maintenance', technician: 'Karthik V.' }
    ]
  };

  const schoolName = school?.name || 'Velammal Matric Hr Sec School';
  const labName = lab?.name || 'Main Lab';

  return (
    <div className="screen-scroll-container no-bottom-nav">
      {/* Header Bar */}
      <div className="screen-header-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className="icon-button" onClick={onBack} title="Back">
            <ArrowLeft size={20} />
          </button>
          <span className="screen-header-title">
            System Details
          </span>
        </div>
        <button className="icon-button" title="Menu">
          <MoreVertical size={18} />
        </button>
      </div>

      {/* Hero Card */}
      <div style={{ padding: '16px 16px 0 16px' }}>
        <div style={{ 
          background: '#ffffff', 
          border: '1px solid var(--border-light)', 
          borderRadius: '12px', 
          padding: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          {/* PC Icon / Thumbnail */}
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '8px',
            background: 'var(--navy-900)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            flexShrink: 0
          }}>
            <Monitor size={24} />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--navy-900)' }}>
                {d.code}
              </span>
              <span className={`status-pill ${d.status}`}>
                {d.status === 'issue_reported' ? 'Issue Reported' : d.status === 'warning' ? 'Maintenance Due' : d.status === 'under_service' ? 'Under Service' : 'Working'}
              </span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {labName} &nbsp;|&nbsp; {schoolName}
            </div>
          </div>
        </div>
      </div>

      {/* Segmented Tabs: Overview | Spec & Details | Service History */}
      <div className="segmented-tabs" style={{ marginTop: '12px' }}>
        <button 
          className={`segmented-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`segmented-tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
          onClick={() => setActiveTab('specs')}
        >
          Spec & Details
        </button>
        <button 
          className={`segmented-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Service History
        </button>
      </div>

      {/* Tab 1: Overview Specs Table */}
      {activeTab === 'overview' && (
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Specs Key-Value Table */}
          <div style={{ 
            background: '#ffffff', 
            border: '1px solid var(--border-light)', 
            borderRadius: '10px',
            overflow: 'hidden' 
          }}>
            {[
              { label: 'Asset ID', value: d.assetCode },
              { label: 'Make / Model', value: d.makeModel },
              { label: 'Processor', value: d.processor },
              { label: 'RAM', value: d.ram },
              { label: 'Storage', value: d.storage },
              { label: 'OS', value: d.os },
              { label: 'IP Address', value: d.ip },
              { label: 'MAC Address', value: d.mac },
              { label: 'Monitor', value: d.monitor },
              { label: 'Peripherals', value: d.peripherals },
              { label: 'Location', value: d.location }
            ].map((row, idx, arr) => (
              <div 
                key={row.label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  fontSize: '11.5px',
                  borderBottom: idx < arr.length - 1 ? '1px solid var(--border-light)' : 'none',
                  background: idx % 2 === 0 ? '#ffffff' : '#fafafa'
                }}
              >
                <span style={{ color: 'var(--text-muted)', fontWeight: '500' }}>{row.label}</span>
                <span style={{ color: 'var(--text-main)', fontWeight: '600', textAlign: 'right' }}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* Photos Section */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>
              Photos
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {d.photos?.map((photo, i) => (
                <div 
                  key={i} 
                  style={{ 
                    width: '64px', 
                    height: '64px', 
                    borderRadius: '8px', 
                    overflow: 'hidden', 
                    border: '1px solid var(--border-light)',
                    background: '#f1f5f9' 
                  }}
                >
                  <img src={photo} alt="Asset" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '8px',
                border: '1.5px dashed var(--border-mid)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '9px',
                fontWeight: '600'
              }}>
                <Plus size={16} />
                Add Photo
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Spec & Details */}
      {activeTab === 'specs' && (
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div className="card-item">
            <h4 style={{ fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>Network & Port Assignment</h4>
            <div style={{ fontSize: '11.5px', color: 'var(--text-body)', lineHeight: '1.6' }}>
              <div><strong>Switch:</strong> Cisco Catalyst 2960-X (SW-01)</div>
              <div><strong>Switch Port:</strong> {d.switchPort || 'SW-01/Gi0/7'}</div>
              <div><strong>Wall Plate Jack:</strong> {d.networkPort || 'D-07'}</div>
              <div><strong>VLAN:</strong> 10 (Student Computer Lab subnet)</div>
              <div><strong>Gateway:</strong> 192.168.1.1</div>
            </div>
          </div>

          <div className="card-item">
            <h4 style={{ fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>Warranty & AMC Coverage</h4>
            <div style={{ fontSize: '11.5px', color: 'var(--text-body)', lineHeight: '1.6' }}>
              <div><strong>OEM Warranty:</strong> Expired (Purchased Jan 2021)</div>
              <div><strong>Active AMC:</strong> Comprehensive Annual Maintenance Contract (CC-AMC-2025)</div>
              <div><strong>SLA Coverage:</strong> 4h Response / 24h Resolution</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Service History */}
      {activeTab === 'history' && (
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {d.serviceHistory?.map((item, idx) => (
            <div key={idx} className="card-item" style={{ marginBottom: 0, padding: '10px 12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--navy-900)' }}>
                  {item.action}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--text-light)', fontWeight: '600' }}>
                  {item.date}
                </span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Technician: {item.technician}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Sticky Action: Raise Ticket */}
      <div style={{ padding: '16px', marginTop: 'auto' }}>
        <button 
          onClick={() => onRaiseTicket(d)} 
          className="btn-primary-navy"
        >
          Raise Ticket
        </button>
      </div>
    </div>
  );
}
