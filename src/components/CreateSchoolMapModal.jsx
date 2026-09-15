import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Layers, 
  Sliders, 
  Plus, 
  Sparkles, 
  Check, 
  School, 
  Building2, 
  Grid 
} from 'lucide-react';
import { 
  generateSystemCoordinates, 
  ROOM_ARRANGEMENTS, 
  INITIAL_SCHOOLS 
} from '../data/labData';

export function CreateSchoolMapModal({
  schools = INITIAL_SCHOOLS,
  currentSchoolId,
  onClose,
  onCreateMap
}) {
  const [selectedSchoolId, setSelectedSchoolId] = useState(currentSchoolId || schools[0]?.id);
  const [labName, setLabName] = useState('');
  const [room, setRoom] = useState('Room 101');
  const [building, setBuilding] = useState('Science & Tech Wing');
  const [code, setCode] = useState('');
  const [layoutTemplate, setLayoutTemplate] = useState('blank'); // 'blank' | 'u_shape' | 'classroom_rows' | 'cluster_pods' | 'dual_bank'
  const [initialPCCount, setInitialPCCount] = useState(16);
  const [gridSize, setGridSize] = useState('medium'); // 'small' | 'medium' | 'large'

  const selectedSchool = schools.find(s => s.id === selectedSchoolId) || schools[0];

  const handleCreate = (e) => {
    e.preventDefault();
    if (!labName.trim()) return;

    const generatedCode = code.trim() || labName.slice(0, 4).toUpperCase() + '-LAB';
    const newLabId = `lab-${Date.now().toString(36)}`;

    // Calculate map bounds based on grid size
    let mapBounds = { width: 380, height: 520 };
    if (gridSize === 'small') mapBounds = { width: 380, height: 440 };
    if (gridSize === 'large') mapBounds = { width: 420, height: 720 };

    // Devices generation
    let initialDevices = [];
    if (layoutTemplate === 'blank') {
      // Create with Teacher podium and 4 starter workstations placed in corners
      initialDevices = [
        {
          id: `${newLabId}-teacher`,
          name: 'Teacher Podium',
          code: 'TEACHER-PC',
          type: 'pc',
          status: 'operational',
          ip: '192.168.10.15',
          bench: 'Podium',
          coords: { x: 190, y: 70 },
          hardware: { model: 'Dell OptiPlex AIO', cpu: 'Intel i7-11700', ram: '16 GB', os: 'Windows 11 Pro Edu', powerState: true },
          tickets: []
        },
        {
          id: `${newLabId}-prn1`,
          name: 'Network Laser Printer',
          code: 'PRN-01',
          type: 'printer',
          status: 'operational',
          ip: '192.168.10.10',
          bench: 'Laser Bay',
          coords: { x: 80, y: 70 },
          hardware: { model: 'HP LaserJet Pro M404n', tonerLevel: 95, paperLevel: 100, paperStatus: 'Ready', queueCount: 0 },
          tickets: []
        },
        {
          id: `${newLabId}-pc1`,
          name: 'Workstation 01',
          code: 'PC-01',
          type: 'pc',
          status: 'operational',
          ip: '192.168.10.21',
          bench: 'Desk-01',
          coords: { x: 100, y: 180 },
          hardware: { model: 'Dell OptiPlex 7090', cpu: 'Intel i7-11700', ram: '16 GB', os: 'Windows 11 Pro Edu', powerState: true },
          tickets: []
        },
        {
          id: `${newLabId}-pc2`,
          name: 'Workstation 02',
          code: 'PC-02',
          type: 'pc',
          status: 'operational',
          ip: '192.168.10.22',
          bench: 'Desk-02',
          coords: { x: 280, y: 180 },
          hardware: { model: 'Dell OptiPlex 7090', cpu: 'Intel i7-11700', ram: '16 GB', os: 'Windows 11 Pro Edu', powerState: true },
          tickets: []
        },
        {
          id: `${newLabId}-pc3`,
          name: 'Workstation 03',
          code: 'PC-03',
          type: 'pc',
          status: 'operational',
          ip: '192.168.10.23',
          bench: 'Desk-03',
          coords: { x: 100, y: 300 },
          hardware: { model: 'Dell OptiPlex 7090', cpu: 'Intel i7-11700', ram: '16 GB', os: 'Windows 11 Pro Edu', powerState: true },
          tickets: []
        },
        {
          id: `${newLabId}-pc4`,
          name: 'Workstation 04',
          code: 'PC-04',
          type: 'pc',
          status: 'operational',
          ip: '192.168.10.24',
          bench: 'Desk-04',
          coords: { x: 280, y: 300 },
          hardware: { model: 'Dell OptiPlex 7090', cpu: 'Intel i7-11700', ram: '16 GB', os: 'Windows 11 Pro Edu', powerState: true },
          tickets: []
        }
      ];
    } else {
      // Use template coordinate generator
      const pcDevices = generateSystemCoordinates(initialPCCount, 4, layoutTemplate);
      initialDevices = [
        {
          id: `${newLabId}-teacher`,
          name: 'Teacher Podium',
          code: 'TEACHER-PC',
          type: 'pc',
          status: 'operational',
          ip: '192.168.10.15',
          bench: 'Podium',
          coords: layoutTemplate === 'u_shape' ? { x: 190, y: 220 } : { x: 190, y: 55 },
          hardware: { model: 'Dell OptiPlex AIO', cpu: 'Intel i7-11700', ram: '16 GB', os: 'Windows 11 Pro Edu', powerState: true },
          tickets: []
        },
        ...pcDevices
      ];
    }

    const newLab = {
      id: newLabId,
      schoolId: selectedSchool.id,
      schoolName: selectedSchool.name,
      schoolCode: selectedSchool.code,
      name: labName.trim(),
      code: generatedCode,
      room: room.trim(),
      building: building.trim(),
      layoutType: layoutTemplate === 'blank' ? 'u_shape' : layoutTemplate,
      accentColor: selectedSchool.accentColor || '#00bceb',
      totalPCs: initialDevices.filter(d => d.type === 'pc').length,
      totalPrinters: initialDevices.filter(d => d.type === 'printer').length,
      mapBounds,
      devices: initialDevices
    };

    onCreateMap(newLab);
    onClose();
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 220,
        background: 'rgba(5, 10, 20, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '440px',
          maxHeight: '90vh',
          background: 'var(--bg-panel)',
          borderRadius: '20px',
          border: '1.5px solid var(--cisco-blue)',
          boxShadow: '0 20px 50px rgba(0, 188, 235, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'slideUp 0.2s ease-out'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          style={{
            padding: '14px 16px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div 
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: 'rgba(0, 188, 235, 0.15)',
                color: 'var(--cisco-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--cisco-blue)'
              }}
            >
              <Plus size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '15px', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                Create Custom School Map
              </h2>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Design a custom floor plan with drag-and-drop units
              </span>
            </div>
          </div>

          <button onClick={onClose} className="icon-btn" style={{ width: '32px', height: '32px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleCreate} style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* 1. School Selector */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
              Assign to Client School
            </label>
            <select
              value={selectedSchoolId}
              onChange={e => setSelectedSchoolId(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', fontSize: '12.5px', fontWeight: 600 }}
            >
              {schools.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code}) - {s.campus}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Room Identity */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                Lab Name *
              </label>
              <input
                type="text"
                value={labName}
                onChange={e => setLabName(e.target.value)}
                placeholder="e.g. AI Coding Center"
                required
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                Room & Building
              </label>
              <input
                type="text"
                value={room}
                onChange={e => setRoom(e.target.value)}
                placeholder="e.g. Hall 204, Floor 2"
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* 3. Starting Arrangement Template */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
              Starting Arrangement Template
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setLayoutTemplate('blank')}
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  background: layoutTemplate === 'blank' ? 'var(--bg-surface-active)' : 'var(--bg-surface)',
                  border: layoutTemplate === 'blank' ? '2px solid var(--cisco-blue)' : '1px solid var(--border-subtle)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '16px' }}>🎨</span>
                  {layoutTemplate === 'blank' && <Check size={14} color="var(--cisco-blue)" />}
                </div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: layoutTemplate === 'blank' ? 'var(--cisco-blue)' : 'var(--text-main)' }}>
                  Blank Canvas Grid
                </span>
                <span style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>
                  Place desks freely from scratch
                </span>
              </button>

              <button
                type="button"
                onClick={() => setLayoutTemplate('u_shape')}
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  background: layoutTemplate === 'u_shape' ? 'var(--bg-surface-active)' : 'var(--bg-surface)',
                  border: layoutTemplate === 'u_shape' ? '2px solid #00bceb' : '1px solid var(--border-subtle)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '16px' }}>🏛️</span>
                  {layoutTemplate === 'u_shape' && <Check size={14} color="#00bceb" />}
                </div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: layoutTemplate === 'u_shape' ? '#00bceb' : 'var(--text-main)' }}>
                  U-Shape Perimeter
                </span>
                <span style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>
                  360° teacher observation
                </span>
              </button>

              <button
                type="button"
                onClick={() => setLayoutTemplate('classroom_rows')}
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  background: layoutTemplate === 'classroom_rows' ? 'var(--bg-surface-active)' : 'var(--bg-surface)',
                  border: layoutTemplate === 'classroom_rows' ? '2px solid #10b981' : '1px solid var(--border-subtle)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '16px' }}>📐</span>
                  {layoutTemplate === 'classroom_rows' && <Check size={14} color="#10b981" />}
                </div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: layoutTemplate === 'classroom_rows' ? '#10b981' : 'var(--text-main)' }}>
                  Forward Rows
                </span>
                <span style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>
                  Parallel lecture rows
                </span>
              </button>

              <button
                type="button"
                onClick={() => setLayoutTemplate('cluster_pods')}
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  background: layoutTemplate === 'cluster_pods' ? 'var(--bg-surface-active)' : 'var(--bg-surface)',
                  border: layoutTemplate === 'cluster_pods' ? '2px solid #ec4899' : '1px solid var(--border-subtle)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '16px' }}>🧩</span>
                  {layoutTemplate === 'cluster_pods' && <Check size={14} color="#ec4899" />}
                </div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: layoutTemplate === 'cluster_pods' ? '#ec4899' : 'var(--text-main)' }}>
                  4-PC Island Pods
                </span>
                <span style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>
                  Team coding / Robotics
                </span>
              </button>
            </div>
          </div>

          {/* 4. Canvas Grid Size */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
              Room Canvas Dimensions
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { id: 'small', label: 'Compact Room (4-12 PCs)' },
                { id: 'medium', label: 'Standard Room (16-32 PCs)' },
                { id: 'large', label: 'Mega Hall (40-100 PCs)' }
              ].map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setGridSize(s.id)}
                  style={{
                    flex: 1,
                    padding: '8px 6px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 600,
                    background: gridSize === s.id ? 'var(--cisco-blue)' : 'var(--bg-surface)',
                    color: gridSize === s.id ? '#ffffff' : 'var(--text-muted)',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer'
                  }}
                >
                  {s.label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div style={{ marginTop: '10px' }}>
            <button
              type="submit"
              className="action-btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '13px', borderRadius: '12px', gap: '8px' }}
            >
              <Sparkles size={16} />
              <span>Create Map & Open Drag & Drop Builder</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
