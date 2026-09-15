import React, { useState } from 'react';
import { 
  Check, 
  RotateCw, 
  Plus, 
  Trash2, 
  Copy, 
  Grid, 
  Save, 
  X, 
  Monitor, 
  Printer, 
  Cpu, 
  Layers, 
  Sparkles,
  Edit2
} from 'lucide-react';

export function BuilderToolbar({
  selectedDevice,
  onRotateDevice,
  onDuplicateDevice,
  onDeleteDevice,
  onRenameDevice,
  onAddDevice,
  gridSnap,
  onToggleGridSnap,
  onSaveLayout,
  onExitBuilder,
  lab
}) {
  const [showTray, setShowTray] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [newNameVal, setNewNameVal] = useState('');

  const handleStartRename = () => {
    if (!selectedDevice) return;
    setNewNameVal(selectedDevice.bench || selectedDevice.code);
    setEditingName(true);
  };

  const handleConfirmRename = () => {
    if (selectedDevice && newNameVal.trim()) {
      onRenameDevice(selectedDevice.id, newNameVal.trim());
    }
    setEditingName(false);
  };

  return (
    <div 
      style={{
        position: 'absolute',
        bottom: '8px',
        left: '8px',
        right: '8px',
        zIndex: 60,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        pointerEvents: 'none'
      }}
    >
      {/* 1. Context Quick Actions for Selected Device */}
      {selectedDevice && (
        <div
          style={{
            pointerEvents: 'auto',
            background: 'var(--bg-panel)',
            backdropFilter: 'blur(16px)',
            borderRadius: '14px',
            padding: '8px 12px',
            border: '1px solid var(--cisco-blue)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            animation: 'slideUp 0.16s ease-out'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--cisco-blue)', fontFamily: 'var(--font-mono)' }}>
              {selectedDevice.bench || selectedDevice.code}
            </span>
            <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>
              ({selectedDevice.coords.x}, {selectedDevice.coords.y}) • {selectedDevice.rotation || 0}°
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {/* Rotate */}
            <button
              onClick={() => onRotateDevice(selectedDevice.id)}
              style={{
                padding: '6px 10px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 700,
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Rotate 90 degrees"
            >
              <RotateCw size={13} />
              <span>Rotate</span>
            </button>

            {/* Rename */}
            <button
              onClick={handleStartRename}
              style={{
                padding: '6px 8px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 600,
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-main)'
              }}
              title="Rename Bench Tag"
            >
              <Edit2 size={13} />
            </button>

            {/* Duplicate */}
            <button
              onClick={() => onDuplicateDevice(selectedDevice.id)}
              style={{
                padding: '6px 8px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 600,
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-main)'
              }}
              title="Duplicate Desk"
            >
              <Copy size={13} />
            </button>

            {/* Delete */}
            <button
              onClick={() => onDeleteDevice(selectedDevice.id)}
              style={{
                padding: '6px 8px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 600,
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#ef4444'
              }}
              title="Delete Device"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      )}

      {/* Rename Prompt Modal / Overlay */}
      {editingName && (
        <div
          style={{
            pointerEvents: 'auto',
            background: 'var(--bg-surface)',
            borderRadius: '12px',
            padding: '12px',
            border: '1px solid var(--cisco-blue)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <input
            type="text"
            value={newNameVal}
            onChange={(e) => setNewNameVal(e.target.value)}
            placeholder="Bench Tag (e.g. Desk-01, Podium)"
            style={{ flex: 1, padding: '6px 10px', fontSize: '13px' }}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleConfirmRename();
              if (e.key === 'Escape') setEditingName(false);
            }}
          />
          <button
            onClick={handleConfirmRename}
            className="action-btn-primary"
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            Save
          </button>
          <button
            onClick={() => setEditingName(false)}
            style={{ padding: '6px 8px', color: 'var(--text-dim)' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* 2. Device Palette Drawer (Clash of Clans Unit Tray) */}
      {showTray && (
        <div
          style={{
            pointerEvents: 'auto',
            background: 'var(--bg-panel)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '12px',
            border: '1px solid var(--border-focus)',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            animation: 'slideUp 0.18s ease-out'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--cisco-blue)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              📦 Place Hardware Units on Map
            </span>
            <button onClick={() => setShowTray(false)} style={{ color: 'var(--text-dim)' }}>
              <X size={15} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
            {/* Add PC */}
            <button
              onClick={() => {
                onAddDevice('pc');
                setShowTray(false);
              }}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                padding: '8px 4px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer'
              }}
            >
              <Monitor size={18} color="var(--cisco-blue)" />
              <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-main)' }}>+ PC Desk</span>
            </button>

            {/* Add Teacher Podium */}
            <button
              onClick={() => {
                onAddDevice('teacher');
                setShowTray(false);
              }}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                padding: '8px 4px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer'
              }}
            >
              <Cpu size={18} color="#10b981" />
              <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-main)' }}>+ Podium</span>
            </button>

            {/* Add Laser Printer */}
            <button
              onClick={() => {
                onAddDevice('printer');
                setShowTray(false);
              }}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                padding: '8px 4px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer'
              }}
            >
              <Printer size={18} color="#f59e0b" />
              <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-main)' }}>+ Printer</span>
            </button>

            {/* Add Switch Rack */}
            <button
              onClick={() => {
                onAddDevice('switch');
                setShowTray(false);
              }}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                padding: '8px 4px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer'
              }}
            >
              <Layers size={18} color="#ec4899" />
              <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-main)' }}>+ Rack</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Main Builder Control Pill Bar */}
      <div
        style={{
          pointerEvents: 'auto',
          background: 'var(--bg-panel)',
          backdropFilter: 'blur(20px)',
          borderRadius: '18px',
          padding: '8px 12px',
          border: '1.5px solid var(--cisco-blue)',
          boxShadow: '0 8px 30px rgba(0, 188, 235, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px'
        }}
      >
        {/* Left: Builder Status Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span 
            style={{
              padding: '3px 8px',
              borderRadius: '8px',
              background: 'rgba(0, 188, 235, 0.2)',
              color: 'var(--cisco-blue)',
              fontSize: '10px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>🔨</span>
            <span>BUILDER MODE</span>
          </span>

          {/* Grid Snap Toggle */}
          <button
            onClick={onToggleGridSnap}
            style={{
              padding: '4px 7px',
              borderRadius: '8px',
              fontSize: '10px',
              fontWeight: 700,
              background: gridSnap ? 'rgba(16, 185, 129, 0.2)' : 'var(--bg-surface)',
              color: gridSnap ? '#10b981' : 'var(--text-dim)',
              border: gridSnap ? '1px solid #10b981' : '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '3px'
            }}
            title="Snap to 20px grid tiles"
          >
            <Grid size={11} />
            <span>Snap {gridSnap ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* Right: Add Device + Save + Done */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => setShowTray(!showTray)}
            style={{
              padding: '5px 10px',
              borderRadius: '10px',
              fontSize: '11px',
              fontWeight: 700,
              background: showTray ? 'var(--cisco-blue)' : 'var(--bg-surface)',
              color: showTray ? '#ffffff' : 'var(--cisco-blue)',
              border: '1px solid var(--cisco-blue)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Plus size={13} />
            <span>Add Device</span>
          </button>

          <button
            onClick={onSaveLayout}
            className="action-btn-primary"
            style={{
              padding: '5px 12px',
              borderRadius: '10px',
              fontSize: '11px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none',
              boxShadow: '0 0 10px rgba(16, 185, 129, 0.4)'
            }}
          >
            <Save size={13} />
            <span>Save</span>
          </button>

          <button
            onClick={onExitBuilder}
            style={{
              padding: '5px 8px',
              borderRadius: '10px',
              fontSize: '11px',
              fontWeight: 700,
              background: 'var(--bg-surface)',
              color: 'var(--text-dim)',
              border: '1px solid var(--border-subtle)'
            }}
            title="Exit Builder Mode"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
