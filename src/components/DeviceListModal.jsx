import React, { useState } from 'react';
import { 
  X, 
  Monitor, 
  Printer, 
  Network, 
  Cpu, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';

export function DeviceListModal({
  labs,
  currentLabId,
  tickets,
  onClose,
  onInspectDevice
}) {
  const [selectedLabId, setSelectedLabId] = useState(currentLabId);
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'pc' | 'printer' | 'issues'
  const [searchQuery, setSearchQuery] = useState('');

  const currentLab = labs.find(l => l.id === selectedLabId) || labs[0];

  const filteredDevices = currentLab.devices.filter(device => {
    // Type filter
    if (typeFilter === 'pc' && device.type !== 'pc') return false;
    if (typeFilter === 'printer' && device.type !== 'printer') return false;
    if (typeFilter === 'issues') {
      const activeTickets = tickets.filter(t => t.deviceId === device.id && t.status !== 'resolved');
      if (activeTickets.length === 0 && device.status === 'operational') return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = `${device.name} ${device.code} ${device.ip} ${device.bench || ''} ${device.hardware?.model || ''}`.toLowerCase();
      if (!match.includes(q)) return false;
    }

    return true;
  });

  return (
    <div className="modal-fullscreen-sheet">
      {/* Header */}
      <div className="modal-header">
        <div className="modal-title">
          <Monitor size={20} style={{ color: 'var(--cisco-blue)' }} />
          <span>Lab Equipment Inventory</span>
          <span className="badge badge-operational" style={{ fontSize: '10px' }}>
            {currentLab.devices.length} Nodes
          </span>
        </div>

        <button className="icon-btn" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
      </div>

      {/* Lab Selector & Search */}
      <div style={{ padding: '12px 16px', background: 'var(--bg-panel)', borderBottom: '1px solid var(--border-subtle)' }}>
        {/* Lab Switcher row */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
          {labs.map(lab => (
            <button
              key={lab.id}
              onClick={() => setSelectedLabId(lab.id)}
              style={{
                padding: '6px 12px',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                background: selectedLabId === lab.id ? 'var(--cisco-blue)' : 'var(--bg-surface)',
                color: selectedLabId === lab.id ? '#0b1320' : 'var(--text-main)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              {lab.code} ({lab.devices.length})
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '8px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-dim)' }} />
          <input
            type="text"
            placeholder="Search by bench number, hostname, IP..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '100%', paddingLeft: '36px' }}
          />
        </div>

        {/* Filter chips */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {[
            { id: 'all', label: 'All Equipment' },
            { id: 'pc', label: 'Computers Only' },
            { id: 'printer', label: 'Printers' },
            { id: 'issues', label: 'Needs Attention' }
          ].map(f => (
            <button
              key={f.id}
              className={`pt-pill-btn ${typeFilter === f.id ? 'active-all' : ''}`}
              onClick={() => setTypeFilter(f.id)}
              style={{ fontSize: '11px' }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Device List */}
      <div className="modal-content-scroll">
        <div style={{ display: 'grid', gap: '10px' }}>
          {filteredDevices.map(device => {
            const activeTickets = tickets.filter(t => t.deviceId === device.id && t.status !== 'resolved');
            const isPrinter = device.type === 'printer';
            const isPC = device.type === 'pc';

            return (
              <div
                key={device.id}
                onClick={() => onInspectDevice(device, currentLab)}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="device-avatar" style={{ width: '38px', height: '38px' }}>
                    {isPrinter ? <Printer size={20} /> : isPC ? <Monitor size={20} /> : <Network size={20} />}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
                        {device.code}
                      </span>
                      <span className={`badge badge-${device.status}`} style={{ fontSize: '9px', padding: '1px 6px' }}>
                        {device.status}
                      </span>
                    </div>

                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {device.name} {device.bench ? `• ${device.bench}` : ''}
                    </div>

                    <div style={{ fontSize: '10px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                      IP: {device.ip} • Port: {device.switchPort}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {activeTickets.length > 0 && (
                    <span className="badge badge-critical" style={{ fontSize: '10px' }}>
                      {activeTickets.length} issue{activeTickets.length > 1 ? 's' : ''}
                    </span>
                  )}
                  <ArrowRight size={16} style={{ color: 'var(--text-dim)' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
