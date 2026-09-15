import React from 'react';
import { 
  X, 
  BarChart2, 
  Activity, 
  Monitor, 
  Printer, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw 
} from 'lucide-react';

export function LabStatsModal({
  labs,
  tickets,
  onClose,
  onResetData
}) {
  // Aggregate stats across all school labs
  let totalPCs = 0;
  let totalPrinters = 0;
  let totalSwitches = 0;

  labs.forEach(lab => {
    lab.devices.forEach(dev => {
      if (dev.type === 'pc') totalPCs++;
      if (dev.type === 'printer') totalPrinters++;
      if (dev.type === 'switch') totalSwitches++;
    });
  });

  const activeTickets = tickets.filter(t => t.status !== 'resolved');
  const urgentTickets = activeTickets.filter(t => t.priority === 'urgent');
  const printerTickets = activeTickets.filter(t => t.deviceType === 'printer');
  const pcTickets = activeTickets.filter(t => t.deviceType === 'pc');

  const totalDevices = totalPCs + totalPrinters + totalSwitches;
  const healthyDevices = totalDevices - activeTickets.length;
  const uptimePercent = Math.round((healthyDevices / (totalDevices || 1)) * 100);

  // Group by category
  const categories = [
    { key: 'printer_jam', label: 'Printer Paper Jams', count: activeTickets.filter(t => t.category === 'printer_jam').length, color: '#ef4444' },
    { key: 'printer_toner', label: 'Toner & Ink Depletion', count: activeTickets.filter(t => t.category === 'printer_toner').length, color: '#f59e0b' },
    { key: 'software', label: 'OS & Software Crashes', count: activeTickets.filter(t => t.category === 'software').length, color: '#8b5cf6' },
    { key: 'network', label: 'Cables & No Internet', count: activeTickets.filter(t => t.category === 'network').length, color: '#00bceb' },
    { key: 'hardware', label: 'Display & Power Issues', count: activeTickets.filter(t => t.category === 'hardware').length, color: '#ec4899' },
    { key: 'peripherals', label: 'Mice & Keyboards', count: activeTickets.filter(t => t.category === 'peripherals').length, color: '#10b981' }
  ];

  return (
    <div className="modal-fullscreen-sheet">
      <div className="modal-header">
        <div className="modal-title">
          <BarChart2 size={20} style={{ color: 'var(--cisco-blue)' }} />
          <span>School IT Health & Analytics</span>
        </div>

        <button className="icon-btn" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
      </div>

      <div className="modal-content-scroll">
        {/* Top Summary Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
          <div className="spec-item" style={{ padding: '12px' }}>
            <div className="spec-label">Overall Lab Uptime</div>
            <div className="spec-val" style={{ fontSize: '24px', color: uptimePercent > 80 ? '#10b981' : '#f59e0b' }}>
              {uptimePercent}%
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>
              {healthyDevices} of {totalDevices} devices normal
            </div>
          </div>

          <div className="spec-item" style={{ padding: '12px' }}>
            <div className="spec-label">Active Tickets</div>
            <div className="spec-val" style={{ fontSize: '24px', color: activeTickets.length > 0 ? '#ef4444' : '#10b981' }}>
              {activeTickets.length}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>
              {urgentTickets.length} flagged as urgent
            </div>
          </div>
        </div>

        {/* Equipment Breakdown */}
        <div className="hardware-view-card" style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '10px', color: 'var(--text-main)' }}>
            Monitored School Hardware
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            <div style={{ background: 'var(--bg-surface)', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
              <Monitor size={18} style={{ color: 'var(--cisco-blue)', margin: '0 auto 4px auto' }} />
              <div style={{ fontSize: '16px', fontWeight: 700 }}>{totalPCs}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>PCs ({pcTickets.length} down)</div>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
              <Printer size={18} style={{ color: 'var(--cisco-blue)', margin: '0 auto 4px auto' }} />
              <div style={{ fontSize: '16px', fontWeight: 700 }}>{totalPrinters}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Printers ({printerTickets.length} down)</div>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
              <Activity size={18} style={{ color: 'var(--cisco-blue)', margin: '0 auto 4px auto' }} />
              <div style={{ fontSize: '16px', fontWeight: 700 }}>{totalSwitches}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Cisco Switches</div>
            </div>
          </div>
        </div>

        {/* Issue Categories Breakdown */}
        <div className="hardware-view-card" style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px', color: 'var(--text-main)' }}>
            Active Failure Breakdown by Category
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {categories.map(cat => (
              <div key={cat.key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
                  <span>{cat.label}</span>
                  <span style={{ fontWeight: 700, color: cat.count > 0 ? cat.color : 'var(--text-dim)' }}>
                    {cat.count} ticket{cat.count !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="progress-bar-bg" style={{ height: '6px' }}>
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${activeTickets.length ? (cat.count / activeTickets.length) * 100 : 0}%`,
                      background: cat.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lab Breakdown */}
        <div className="hardware-view-card" style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '10px', color: 'var(--text-main)' }}>
            Lab Facilities Status
          </div>

          {labs.map(lab => {
            const labIssues = activeTickets.filter(t => t.labId === lab.id).length;
            return (
              <div 
                key={lab.id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid var(--border-subtle)'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '13px' }}>{lab.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{lab.room} • {lab.devices.length} Nodes</div>
                </div>

                <span className={`badge ${labIssues > 0 ? 'badge-critical' : 'badge-operational'}`}>
                  {labIssues > 0 ? `${labIssues} Issues` : 'Healthy'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Demo reset data */}
        <button
          className="action-btn-secondary"
          onClick={() => {
            if (confirm('Reset all labs and tickets to initial default sample dataset?')) {
              onResetData();
              onClose();
            }
          }}
          style={{ width: '100%', gap: '6px' }}
        >
          <RotateCcw size={14} />
          <span>Reset Sample School Lab Data</span>
        </button>
      </div>
    </div>
  );
}
