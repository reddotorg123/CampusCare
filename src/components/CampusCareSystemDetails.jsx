import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Edit3, 
  Plus, 
  Monitor, 
  HardDrive, 
  Cpu, 
  Wifi, 
  Wrench, 
  Check, 
  X, 
  Save, 
  Sliders,
  Sparkles
} from 'lucide-react';

export function CampusCareSystemDetails({ 
  device,
  school,
  lab,
  onUpdateDevice,
  onRaiseTicket,
  onBack 
}) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'specs' | 'history'
  const [isEditingSpecs, setIsEditingSpecs] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Editable fields state initialized from device
  const [formData, setFormData] = useState({
    code: device?.code || '',
    assetCode: device?.assetCode || '',
    status: device?.status || 'working',
    makeModel: device?.makeModel || '',
    processor: device?.processor || '',
    ram: device?.ram || '',
    storage: device?.storage || '',
    os: device?.os || '',
    ip: device?.ip || '',
    mac: device?.mac || '',
    monitor: device?.monitor || '',
    peripherals: device?.peripherals || '',
    location: device?.location || (lab?.name ? `${lab.name}` : ''),
    serialNumber: device?.serialNumber || '',
    purchaseDate: device?.purchaseDate || ''
  });

  // Keep formData in sync when selected device or lab changes
  useEffect(() => {
    if (device) {
      setFormData({
        code: device.code || '',
        assetCode: device.assetCode || '',
        status: device.status || 'working',
        makeModel: device.makeModel || '',
        processor: device.processor || '',
        ram: device.ram || '',
        storage: device.storage || '',
        os: device.os || '',
        ip: device.ip || '',
        mac: device.mac || '',
        monitor: device.monitor || '',
        peripherals: device.peripherals || '',
        location: device.location || (lab?.name ? `${lab.name}` : ''),
        serialNumber: device.serialNumber || '',
        purchaseDate: device.purchaseDate || ''
      });
    }
  }, [device, lab]);

  const d = { ...device, ...formData };
  const schoolName = school?.name || 'School / College';
  const labName = lab?.name || 'Main Lab';

  const handleSaveSpecs = (e) => {
    e?.preventDefault();
    const updatedDevice = {
      ...device,
      ...formData,
      name: formData.code
    };

    if (onUpdateDevice) {
      onUpdateDevice(updatedDevice);
    }

    setIsEditingSpecs(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'working': return { text: 'var(--status-working)', bg: 'var(--status-working-bg)', label: 'Working' };
      case 'warning': return { text: '#d97706', bg: '#fef3c7', label: 'Maintenance Due' };
      case 'issue_reported': return { text: 'var(--status-issue)', bg: 'var(--status-issue-bg)', label: 'Issue Reported' };
      case 'under_service': return { text: '#2563eb', bg: '#eff6ff', label: 'Under Service' };
      case 'offline': return { text: '#64748b', bg: '#f1f5f9', label: 'Offline' };
      default: return { text: 'var(--status-working)', bg: 'var(--status-working-bg)', label: 'Working' };
    }
  };

  const statusStyle = getStatusColor(d.status);

  return (
    <div className="screen-scroll-container no-bottom-nav">
      {/* Header Bar */}
      <div className="screen-header-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className="icon-button" onClick={onBack} title="Back">
            <ArrowLeft size={20} />
          </button>
          <div>
            <span className="screen-header-title">
              {d.code} Details
            </span>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
              {labName} • {schoolName}
            </div>
          </div>
        </div>

        {/* Edit Specifications Action Button */}
        <button 
          onClick={() => setIsEditingSpecs(true)}
          style={{
            background: 'var(--navy-800)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '6px 12px',
            fontSize: '11px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <Edit3 size={13} />
          <span>Edit Specs</span>
        </button>
      </div>

      {/* Save Notification Toast */}
      {saveToast && (
        <div style={{
          position: 'fixed',
          top: '60px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--status-working)',
          color: '#fff',
          padding: '8px 18px',
          borderRadius: '20px',
          fontSize: '11px',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          zIndex: 100,
          boxShadow: 'var(--shadow-md)'
        }}>
          <Check size={14} />
          <span>System specifications updated successfully!</span>
        </div>
      )}

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
          {/* PC Icon */}
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
              <span style={{
                fontSize: '10px',
                fontWeight: 700,
                color: statusStyle.text,
                background: statusStyle.bg,
                padding: '2px 8px',
                borderRadius: '10px',
                border: `1px solid ${statusStyle.text}`
              }}>
                {statusStyle.label}
              </span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Asset: <strong>{d.assetCode}</strong> &nbsp;|&nbsp; {d.makeModel}
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
          Hardware Specs
        </button>
        <button 
          className={`segmented-tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
          onClick={() => setActiveTab('specs')}
        >
          Network & OS
        </button>
        <button 
          className={`segmented-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Actions & Service
        </button>
      </div>

      {/* Tab 1: Hardware Specs Table */}
      {activeTab === 'overview' && (
        <div style={{ padding: '0 16px 16px 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ 
            background: '#ffffff', 
            border: '1px solid var(--border-light)', 
            borderRadius: '10px',
            overflow: 'hidden' 
          }}>
            {[
              { label: 'Workstation Code', value: d.code },
              { label: 'Asset ID / Barcode', value: d.assetCode },
              { label: 'Make / Model', value: d.makeModel },
              { label: 'Processor (CPU)', value: d.processor },
              { label: 'Memory (RAM)', value: d.ram },
              { label: 'Storage (SSD/HDD)', value: d.storage },
              { label: 'Monitor Display', value: d.monitor },
              { label: 'Peripherals', value: d.peripherals },
              { label: 'Bench / Physical Location', value: d.location }
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
                <span style={{ color: 'var(--text-main)', fontWeight: '600', textAlign: 'right' }}>{row.value || 'Not Specified'}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setIsEditingSpecs(true)}
            style={{
              padding: '10px',
              borderRadius: '8px',
              border: '1px dashed var(--blue-600)',
              background: 'var(--blue-50)',
              color: 'var(--blue-600)',
              fontSize: '11.5px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <Edit3 size={15} />
            <span>Feed / Edit System Specifications</span>
          </button>
        </div>
      )}

      {/* Tab 2: Network & OS Table */}
      {activeTab === 'specs' && (
        <div style={{ padding: '0 16px 16px 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ 
            background: '#ffffff', 
            border: '1px solid var(--border-light)', 
            borderRadius: '10px',
            overflow: 'hidden' 
          }}>
            {[
              { label: 'Operating System', value: d.os },
              { label: 'IP Address', value: d.ip },
              { label: 'MAC Address', value: d.mac },
              { label: 'Serial Number', value: d.serialNumber },
              { label: 'Commissioning Date', value: d.purchaseDate },
              { label: 'Operating Health', value: statusStyle.label }
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
                <span style={{ color: 'var(--text-main)', fontWeight: '600', textAlign: 'right' }}>{row.value || 'Not Specified'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Actions & Report */}
      {activeTab === 'history' && (
        <div style={{ padding: '0 16px 16px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '10px',
            padding: '14px',
            border: '1px solid var(--border-light)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy-900)' }}>
              Maintenance Actions for {d.code}
            </div>
            <p style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
              Report a malfunction, request technician inspection, or change system status.
            </p>

            <button
              onClick={() => onRaiseTicket(d)}
              className="btn-primary-navy"
              style={{ padding: '10px', marginTop: '6px', fontSize: '12px' }}
            >
              <Wrench size={15} style={{ marginRight: '6px', display: 'inline' }} />
              Raise Service Ticket for {d.code}
            </button>
          </div>
        </div>
      )}

      {/* EDIT SPECIFICATIONS MODAL */}
      {isEditingSpecs && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 150,
          background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '480px',
            maxHeight: '90vh',
            background: '#ffffff',
            borderRadius: '14px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 18px',
              background: 'var(--navy-900)',
              color: '#ffffff'
            }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800 }}>
                  Edit Hardware Specifications
                </div>
                <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                  Updating {d.code} • {labName}
                </div>
              </div>
              <button 
                onClick={() => setIsEditingSpecs(false)}
                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body: Scrollable Form */}
            <form onSubmit={handleSaveSpecs} style={{ padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label" style={{ fontSize: '10.5px' }}>PC Code *</label>
                  <input 
                    type="text" 
                    value={formData.code} 
                    onChange={e => setFormData({ ...formData, code: e.target.value })} 
                    className="form-input" 
                    style={{ fontSize: '11px' }} 
                    required 
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label" style={{ fontSize: '10.5px' }}>Asset ID *</label>
                  <input 
                    type="text" 
                    value={formData.assetCode} 
                    onChange={e => setFormData({ ...formData, assetCode: e.target.value })} 
                    className="form-input" 
                    style={{ fontSize: '11px' }} 
                    required 
                  />
                </div>
              </div>

              {/* Status Picker */}
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '10.5px' }}>Operating Status</label>
                <select 
                  value={formData.status} 
                  onChange={e => setFormData({ ...formData, status: e.target.value })} 
                  className="form-select"
                  style={{ fontSize: '11px' }}
                >
                  <option value="working">Working / Normal</option>
                  <option value="warning">Warning / Maintenance Due</option>
                  <option value="issue_reported">Issue Reported</option>
                  <option value="under_service">Under Service / Repair</option>
                  <option value="offline">Offline / Powered Off</option>
                </select>
              </div>

              {/* Make & Model */}
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '10.5px' }}>Make / Model</label>
                <input 
                  type="text" 
                  value={formData.makeModel} 
                  onChange={e => setFormData({ ...formData, makeModel: e.target.value })} 
                  className="form-input" 
                  placeholder="e.g. Dell OptiPlex 3080 / HP ProDesk 400"
                  style={{ fontSize: '11px' }} 
                />
              </div>

              {/* Processor & RAM in row */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <div className="form-group" style={{ flex: 2 }}>
                  <label className="form-label" style={{ fontSize: '10.5px' }}>Processor (CPU)</label>
                  <input 
                    type="text" 
                    value={formData.processor} 
                    onChange={e => setFormData({ ...formData, processor: e.target.value })} 
                    className="form-input" 
                    placeholder="e.g. Intel Core i5-10400"
                    style={{ fontSize: '11px' }} 
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label" style={{ fontSize: '10.5px' }}>RAM</label>
                  <input 
                    type="text" 
                    value={formData.ram} 
                    onChange={e => setFormData({ ...formData, ram: e.target.value })} 
                    className="form-input" 
                    placeholder="e.g. 8 GB DDR4"
                    style={{ fontSize: '11px' }} 
                  />
                </div>
              </div>

              {/* Storage & OS in row */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label" style={{ fontSize: '10.5px' }}>Storage (SSD / HDD)</label>
                  <input 
                    type="text" 
                    value={formData.storage} 
                    onChange={e => setFormData({ ...formData, storage: e.target.value })} 
                    className="form-input" 
                    placeholder="e.g. 256 GB NVMe SSD"
                    style={{ fontSize: '11px' }} 
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label" style={{ fontSize: '10.5px' }}>Operating System</label>
                  <input 
                    type="text" 
                    value={formData.os} 
                    onChange={e => setFormData({ ...formData, os: e.target.value })} 
                    className="form-input" 
                    placeholder="e.g. Windows 11 Pro / Ubuntu"
                    style={{ fontSize: '11px' }} 
                  />
                </div>
              </div>

              {/* IP & MAC Address in row */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label" style={{ fontSize: '10.5px' }}>IP Address</label>
                  <input 
                    type="text" 
                    value={formData.ip} 
                    onChange={e => setFormData({ ...formData, ip: e.target.value })} 
                    className="form-input" 
                    placeholder="192.168.1.100"
                    style={{ fontSize: '11px' }} 
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label" style={{ fontSize: '10.5px' }}>MAC Address</label>
                  <input 
                    type="text" 
                    value={formData.mac} 
                    onChange={e => setFormData({ ...formData, mac: e.target.value })} 
                    className="form-input" 
                    placeholder="3C:52:82:1A:9F:3D"
                    style={{ fontSize: '11px' }} 
                  />
                </div>
              </div>

              {/* Monitor & Peripherals */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label" style={{ fontSize: '10.5px' }}>Monitor</label>
                  <input 
                    type="text" 
                    value={formData.monitor} 
                    onChange={e => setFormData({ ...formData, monitor: e.target.value })} 
                    className="form-input" 
                    placeholder="e.g. Dell 21.5-inch FHD"
                    style={{ fontSize: '11px' }} 
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label" style={{ fontSize: '10.5px' }}>Location / Bench</label>
                  <input 
                    type="text" 
                    value={formData.location} 
                    onChange={e => setFormData({ ...formData, location: e.target.value })} 
                    className="form-input" 
                    placeholder="e.g. Row 2, Desk 4"
                    style={{ fontSize: '11px' }} 
                  />
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsEditingSpecs(false)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    color: 'var(--text-main)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary-navy"
                  style={{
                    flex: 2,
                    padding: '10px',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Save size={14} />
                  <span>Save Specifications</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
