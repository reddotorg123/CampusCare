import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Wrench
} from 'lucide-react';
import { ISSUE_PRESETS } from '../data/labData';

export function QuickReportModal({
  labs,
  currentLabId,
  onClose,
  onSubmitTicket
}) {
  const [selectedLabId, setSelectedLabId] = useState(currentLabId);
  const currentLab = labs.find(l => l.id === selectedLabId) || labs[0];

  const [selectedDeviceId, setSelectedDeviceId] = useState(currentLab.devices[2]?.id || '');
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [customTitle, setCustomTitle] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [priority, setPriority] = useState('medium');
  const [reporterName, setReporterName] = useState('Lab Assistant (Mobile)');

  const targetDevice = currentLab.devices.find(d => d.id === selectedDeviceId);
  const isPrinter = targetDevice?.type === 'printer';

  const presets = isPrinter ? ISSUE_PRESETS.printer : ISSUE_PRESETS.pc;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!targetDevice) return;

    const title = customTitle || selectedPreset?.label || 'General Issue Reported';
    const category = selectedPreset?.category || (isPrinter ? 'printer_jam' : 'hardware');
    const finalPriority = selectedPreset?.priority || priority;

    onSubmitTicket({
      deviceId: targetDevice.id,
      deviceName: targetDevice.name,
      deviceCode: targetDevice.code,
      deviceType: targetDevice.type,
      labId: currentLab.id,
      labName: currentLab.name,
      room: currentLab.room,
      category,
      title,
      description: customDesc || `Reported during lab inspection: ${title}`,
      priority: finalPriority,
      reportedBy: reporterName
    });

    onClose();
  };

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div 
        className="sheet-container"
        style={{ maxHeight: '90vh' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="sheet-handle-bar" />

        <div className="sheet-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="cisco-logo-mark" style={{ width: '30px', height: '30px' }}>
              <Wrench size={16} />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>
                Report Lab Equipment Issue
              </h3>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Field Reporting • Instant Map Topology Sync
              </div>
            </div>
          </div>

          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="sheet-body">
          {/* 1. Select Lab */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '6px' }}>
              1. School Lab Location
            </label>
            <select
              value={selectedLabId}
              onChange={e => {
                const newLabId = e.target.value;
                setSelectedLabId(newLabId);
                const foundLab = labs.find(l => l.id === newLabId);
                if (foundLab && foundLab.devices.length) {
                  setSelectedDeviceId(foundLab.devices[0].id);
                }
              }}
              style={{ width: '100%' }}
            >
              {labs.map(lab => (
                <option key={lab.id} value={lab.id}>
                  {lab.name} ({lab.room})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Select Device */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '6px' }}>
              2. Select Computer or Printer
            </label>
            <select
              value={selectedDeviceId}
              onChange={e => {
                setSelectedDeviceId(e.target.value);
                setSelectedPreset(null);
              }}
              style={{ width: '100%', fontFamily: 'var(--font-mono)' }}
            >
              {currentLab.devices.map(dev => (
                <option key={dev.id} value={dev.id}>
                  [{dev.type.toUpperCase()}] {dev.code} - {dev.name} {dev.bench ? `(${dev.bench})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Issue Presets */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '6px' }}>
              3. Quick Common Problem (Tap one):
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {presets.map((preset, idx) => {
                const isSelected = selectedPreset?.label === preset.label;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedPreset(preset);
                      setCustomTitle(preset.label);
                      setPriority(preset.priority);
                    }}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: isSelected ? 'var(--bg-surface-active)' : 'var(--bg-primary)',
                      border: isSelected ? '1px solid var(--cisco-blue)' : '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left'
                    }}
                  >
                    <span style={{ fontSize: '12px', fontWeight: isSelected ? 600 : 400, color: isSelected ? 'var(--cisco-blue)' : 'var(--text-main)' }}>
                      {preset.label}
                    </span>
                    <span className={`badge badge-${preset.priority}`} style={{ fontSize: '9px' }}>
                      {preset.priority}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Additional Notes */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '6px' }}>
              Additional Observations (Optional):
            </label>
            <textarea
              placeholder="e.g., Happened during 2nd period C++ programming class..."
              value={customDesc}
              onChange={e => setCustomDesc(e.target.value)}
              rows={2}
              style={{ width: '100%', resize: 'none' }}
            />
          </div>

          {/* Reporter Name */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '6px' }}>
              Reported By:
            </label>
            <input
              type="text"
              value={reporterName}
              onChange={e => setReporterName(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="action-btn-primary" 
            style={{ width: '100%', padding: '12px', fontSize: '14px' }}
          >
            <Send size={16} />
            <span>Submit Ticket & Update Map</span>
          </button>
        </form>
      </div>
    </div>
  );
}
