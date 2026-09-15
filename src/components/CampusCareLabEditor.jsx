import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Tag, Table2, Monitor, Info, Check } from 'lucide-react';

export function CampusCareLabEditor({ 
  lab,
  devices = [],
  onSaveLab,
  onBack 
}) {
  const [labDevices, setLabDevices] = useState(devices);
  const [selectedId, setSelectedId] = useState(null);
  const [saveNotification, setSaveNotification] = useState(false);

  const handleAddPC = () => {
    const nextNum = labDevices.length + 1;
    const numStr = String(nextNum).padStart(2, '0');
    const code = `PC-${numStr}`;
    
    const newPC = {
      id: `dev-pc-${numStr}-${Date.now()}`,
      name: code,
      code: code,
      assetCode: `VMHS-PC-0${numStr}`,
      status: 'working',
      type: 'pc',
      row: Math.ceil(nextNum / 5),
      col: ((nextNum - 1) % 5) + 1,
      coords: {
        x: 40 + (((nextNum - 1) % 5) * 66),
        y: 60 + (Math.floor((nextNum - 1) / 5) * 80)
      },
      makeModel: 'Dell OptiPlex 3080',
      processor: 'Intel Core i5 (10th Gen)',
      ram: '8 GB',
      storage: '256 GB SSD',
      os: 'Windows 11 Pro',
      ip: `192.168.1.${100 + nextNum}`,
      mac: `3C:52:82:1A:9F:${numStr}`
    };

    setLabDevices(prev => [...prev, newPC]);
    setSelectedId(newPC.id);
  };

  const handleRemoveSelected = () => {
    if (!selectedId) return;
    setLabDevices(prev => prev.filter(d => d.id !== selectedId));
    setSelectedId(null);
  };

  const handleSave = () => {
    onSaveLab(labDevices);
    setSaveNotification(true);
    setTimeout(() => {
      setSaveNotification(false);
      onBack();
    }, 1200);
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
            Lab Map Editor
          </span>
        </div>
        <button 
          onClick={handleSave}
          style={{
            background: 'var(--navy-800)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '5px 14px',
            fontSize: '12px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          Save
        </button>
      </div>

      {/* Save Notification Toast */}
      {saveNotification && (
        <div style={{
          position: 'fixed',
          top: '60px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--status-working)',
          color: '#fff',
          padding: '6px 14px',
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
          <span>Lab layout saved successfully!</span>
        </div>
      )}

      {/* Instruction Banner */}
      <div style={{
        margin: '12px 16px 8px 16px',
        padding: '10px 12px',
        background: 'var(--blue-50)',
        borderRadius: '8px',
        border: '1px solid rgba(37, 99, 235, 0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '11px',
        color: 'var(--navy-800)',
        lineHeight: '1.4'
      }}>
        <Info size={16} color="var(--blue-600)" style={{ flexShrink: 0 }} />
        <span>Drag and drop systems to create your lab map. Tap a system to edit details.</span>
      </div>

      {/* Workspace Area: Left Toolbar + Canvas */}
      <div style={{ padding: '0 16px 16px 16px', display: 'flex', gap: '10px', flex: 1 }}>
        {/* Left Toolbar */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          width: '68px',
          flexShrink: 0
        }}>
          <button
            onClick={handleAddPC}
            style={{
              background: '#ffffff',
              border: '1px solid var(--border-mid)',
              borderRadius: '8px',
              padding: '10px 4px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              fontSize: '10px',
              fontWeight: '600',
              color: 'var(--text-main)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Monitor size={18} color="var(--navy-800)" />
            Add PC
          </button>

          <button
            onClick={handleAddPC}
            style={{
              background: '#ffffff',
              border: '1px solid var(--border-mid)',
              borderRadius: '8px',
              padding: '10px 4px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              fontSize: '10px',
              fontWeight: '600',
              color: 'var(--text-main)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Table2 size={18} color="var(--navy-800)" />
            Add Table
          </button>

          <button
            style={{
              background: '#ffffff',
              border: '1px solid var(--border-mid)',
              borderRadius: '8px',
              padding: '10px 4px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              fontSize: '10px',
              fontWeight: '600',
              color: 'var(--text-main)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Tag size={18} color="var(--navy-800)" />
            Add Label
          </button>

          <button
            onClick={handleRemoveSelected}
            disabled={!selectedId}
            style={{
              background: selectedId ? '#fee2e2' : '#f8fafc',
              border: selectedId ? '1px solid #ef4444' : '1px solid var(--border-light)',
              borderRadius: '8px',
              padding: '10px 4px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              cursor: selectedId ? 'pointer' : 'not-allowed',
              fontSize: '10px',
              fontWeight: '600',
              color: selectedId ? '#dc2626' : 'var(--text-light)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Trash2 size={18} />
            Remove
          </button>
        </div>

        {/* 2D Canvas Editor */}
        <div style={{
          flex: 1,
          background: '#ffffff',
          border: '2px solid #334155',
          borderRadius: '8px',
          position: 'relative',
          height: '460px',
          overflow: 'hidden',
          backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
          backgroundSize: '16px 16px'
        }}>
          {labDevices.map(device => {
            const isSelected = selectedId === device.id;
            return (
              <div
                key={device.id}
                onClick={() => setSelectedId(device.id)}
                style={{
                  position: 'absolute',
                  left: `${device.coords?.x || 30}px`,
                  top: `${device.coords?.y || 40}px`,
                  width: '50px',
                  height: '42px',
                  background: isSelected ? 'var(--navy-800)' : 'var(--status-working)',
                  border: isSelected ? '2px solid #3b82f6' : '1px solid #16a34a',
                  borderRadius: '4px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '9px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 0 0 3px rgba(59, 130, 246, 0.4)' : '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <Monitor size={12} />
                <span>{device.code}</span>
              </div>
            );
          })}

          {/* Teacher Desk */}
          <div style={{
            position: 'absolute',
            right: '16px',
            bottom: '16px',
            width: '80px',
            height: '40px',
            background: '#f1f5f9',
            border: '1.5px dashed #64748b',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '9px',
            fontWeight: '700',
            color: '#475569',
            textAlign: 'center'
          }}>
            Teacher's<br/>Desk
          </div>

          {/* Entrance */}
          <div style={{
            position: 'absolute',
            left: '0px',
            bottom: '16px',
            width: '50px',
            height: '22px',
            background: '#ffffff',
            borderTop: '2px solid #334155',
            borderRight: '2px solid #334155',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '8.5px',
            fontWeight: '700',
            color: '#64748b'
          }}>
            Entrance
          </div>
        </div>
      </div>
    </div>
  );
}
